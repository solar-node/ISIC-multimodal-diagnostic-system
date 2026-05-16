import cv2
import os
import base64
import io
from PIL import Image

def get_uncertainty_label(uncertainty_score):
  """
  Convert numerical uncertainty into a human-readable label.
  Standard deviation (uncertainty) is usually between 0.0 and 0.3
  """

  if uncertainty_score < 0.05:
    return 'High Confidence', 'Green'

  if uncertainty_score < 0.10:
    return 'Moderate Confidence', 'Orange'

  else:
    return 'Low Confidence -  Dermatologist Review Recommended', 'Red'


def numpy_to_base64(img_array):
  """
  Convert a numpy image array to a base64 string.
  This is how we send images through the FastAPI response JSON.
  The React frontend decodes this string and displays the image.
  """

  # Convert numpy array to PIL Image
  pil_img = Image.fromarray(img_array)

  # Save the image to a BytesIO object
  buffer = io.BytesIO()
  pil_img.save(buffer, format="PNG")

  # Encode to base64 string
  b64_string = base64.b64encode(buffer.getvalue()).decode('utf-8')

  return f'data:image/png;base64,{b64_string}'



