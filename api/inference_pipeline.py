import cv2
import numpy as np

from load_and_preprocess import full_preprocess
from tta_mc_dropout import predict_tta_mc
from utils import get_uncertainty_label, numpy_to_base64
from score_cam import make_scorecam_heatmap, overlay_heatmap_on_image

def run_full_inference(img_path, patient_metadata, model,
                       meta_cols, threshold, grid_size=14, 
                       img_size=256, n_mc_passes=20):
  """
  Full inference pipeline - called by FastAPI backend

  Returns:
     dict with all results — ready to return from FastAPI endpoint
  """

  ## ----------- 1. Load and Preprocess image--------
  raw_img = cv2.imread(img_path)

  raw_img = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
  proc_img = full_preprocess(raw_img) 
  resized = cv2.resize(proc_img, (img_size, img_size))

  img_norm = resized.astype(np.float32) / 255.0
  img_input = np.expand_dims(img_norm, axis=0)

  ## --------- 2. Build metadata features---------
  meta_dict = {
      'sex_encoded' : 1.0 if patient_metadata.get('sex') == 'male' else (0.0 if patient_metadata.get('sex') == 'female' else 0.5),
      'age_normalized' : patient_metadata.get('age', 45)/90,
      'n_images_log' : np.log1p(patient_metadata.get('n_images_per_patient', 1))
  }

  site_options = ['torso', 'lower extremity', 'upper extremity',
                    'head/neck', 'palms/soles', 'oral/genital', 'unknown']

  patient_site = patient_metadata.get('anatom_site', '')
  if patient_site not in site_options:
      patient_site = 'unknown'

  # Clean variable name
  for site in site_options:
    key = 'site_' + site.replace(' ', '_').replace('/', '_')
    meta_dict[key] = 1.0 if site == patient_site else 0.0

  meta_vector = np.array([meta_dict.get(col, 0.0) for col in meta_cols], dtype=np.float32)
  meta_input = np.expand_dims(meta_vector, axis=0)

  ## ------- 3. MC-TTA predictions--------
  mean_prob, std_prob = predict_tta_mc(
      model,img_input, meta_input, n_passes=n_mc_passes 
  )

  ## --------- 4. Decision----------- 
  is_malignant = mean_prob >= threshold
  uncertainty_label, _ = get_uncertainty_label(std_prob)
 
  ##---------- 5. Score-CAM Heatmap----------
  heatmap = make_scorecam_heatmap(img_input, meta_input, model, grid_size=grid_size)

  # Overlay  heatmap
  overlay = overlay_heatmap_on_image(resized, heatmap)

  # convert to base64
  original_b64 = numpy_to_base64(resized)
  overlay_b64 = numpy_to_base64(overlay)

  ## ------ 6. Return structured result --------
  return {
        'prediction': 'Malignant' if is_malignant else 'Benign',
        'probability': round(float(mean_prob)*100, 1),
        'is_malignant': bool(is_malignant),         
        'uncertainty_std': round(float(std_prob), 4),
        'uncertainty_label': str(uncertainty_label), 
        'requires_review': bool(std_prob >= 0.10),   
        'urgent': bool(is_malignant and std_prob<0.10), 
        'threshold_used': float(threshold),           
        'disclaimer': 'For clinical decision support only. Not a substitute for dermatologist review.',
        'original_image_b64': original_b64,
        'heatmap_overlay_b64': overlay_b64
    }
