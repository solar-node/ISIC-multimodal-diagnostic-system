import tensorflow as tf
import numpy as np

def predict_tta_mc(model, img_tensor, meta_tensor, n_passes=20):  
  """
  Combines TTA (4 angles) with MC Dropout (20 passes)
  Total predictions: 80 per patient.
  """

  # TTA verification
  img_array = img_tensor[0]
  tta_batch = tf.stack([
      img_array,
      tf.image.flip_left_right(img_array), # Horizontal Flip
      tf.image.flip_up_down(img_array), # Horizontal flip
      tf.image.rot90(img_array, k=1)  # 90 degree rotation
  ])

  # Duplicate metadata 4 times to match 4 images
  meta_batch = tf.repeat(meta_tensor, repeats=4, axis=0)

  # Run MC dropoout loop
  all_80_scores = []

  for i in range(n_passes):
    # Pass all 4 images at once with Dropout forced ON (training=True)
    predictions = model([tta_batch, meta_batch], training=True)

    scores = predictions[:, 0].numpy().tolist()
    all_80_scores.extend(scores)

  
  # Calculate the final 
  all_80_scores = np.array(all_80_scores)

  final_averaged_score = np.mean(all_80_scores)
  total_uncertainty = np.std(all_80_scores)

  return final_averaged_score, total_uncertainty
