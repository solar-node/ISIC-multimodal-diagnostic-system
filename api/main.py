from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import keras
import shutil
import os
import uvicorn

from keras.layers import RandomFlip, RandomRotation, RandomBrightness
from load_and_preprocess import full_preprocess
from tta_mc_dropout import predict_tta_mc
from utils import get_uncertainty_label, numpy_to_base64
from score_cam import make_scorecam_heatmap, overlay_heatmap_on_image
from inference_pipeline import run_full_inference


app = FastAPI(title = "Malenoma Diagnostic API")

# -------- CORS setup -------------
# It allows frontend which is running on a different port to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], 
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)


# --------- Download Model from Google Cloud Storage if not exists ---------
MODEL_PATH = "saved_model/best_fusion_model.keras"
BUCKET_NAME = os.environ.get("GCS_BUCKET_NAME", "malenoma-model-aditya")

if not os.path.exists(MODEL_PATH):
    print("Model not found locally. Fetching from GCS...")
    try:
        from google.cloud import storage
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        
        # Initialize client. Cloud Run automatically uses its service account credentials!
        client = storage.Client()
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob("best_fusion_model.keras")
        blob.download_to_filename(MODEL_PATH)
        print("Model downloaded successfully from GCS!")
    except Exception as e:
        print(f"CRITICAL ERROR: Failed to download model from GCS: {e}")



# Patch directly on the classes themselves
_orig_flip = RandomFlip.__init__
_orig_rotation = RandomRotation.__init__
_orig_brightness = RandomBrightness.__init__

def _flip_init(self, *args, **kwargs):
    kwargs.pop("data_format", None)
    _orig_flip(self, *args, **kwargs)

def _rotation_init(self, *args, **kwargs):
    kwargs.pop("data_format", None)
    _orig_rotation(self, *args, **kwargs)

def _brightness_init(self, *args, **kwargs):
    kwargs.pop("data_format", None)
    _orig_brightness(self, *args, **kwargs)

RandomFlip.__init__ = _flip_init
RandomRotation.__init__ = _rotation_init
RandomBrightness.__init__ = _brightness_init

# --------- Load model ------------
model = keras.saving.load_model(
    MODEL_PATH,
    compile=False
)

# --------- API Endpoint ---------
@app.post("/analyze")
# Function to analyze lesion
async def analyze_lesion(
    image: UploadFile = File(...),
    sex: str = Form(...),
    age: int = Form(...),
    anatom_site: str = Form(...)
):
    # 1. Create a temporary file path on the server's hard drive
    temp_img_path = f"temp_{image.filename}"

    # 2. Write the incoming data stream to that physical file
    with open(temp_img_path, "wb") as buffer:
        # Stream the file from memory to disk efficiently
        shutil.copyfileobj(image.file, buffer)

    # 3. Construct the metadata dictionary the pipeline expects
    patient_metadata = {
        'sex': sex,
        'age': age,
        'anatom_site': anatom_site,
        'n_images_per_patient': 1
    }


    try:
        # 4. Invoke the full AI pipeline
        result = run_full_inference(
            img_path=temp_img_path,
            patient_metadata=patient_metadata,
            model = model,
            meta_cols =[
                'sex_encoded', 'age_normalized','n_images_log', 'site_head_neck', 
                'site_lower_extremity', 'site_oral_genital', 'site_palms_soles',
                'site_torso', 'site_unknown', 'site_upper_extremity'
            ],

            threshold=0.18,  # optimal threshold found after experimentation
            grid_size=14,
            img_size=256,
            n_mc_passes=20
        )

        return result
    
    except Exception as e:
        return {"error": str(e)}
    

    finally:            # this will definately run whatever happens
        # Cleanup: Delete the image from the hard drive
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)
 
 
if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
    

    





