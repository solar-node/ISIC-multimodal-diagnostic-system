import cv2
import numpy as np
import os


def remove_hair(img):
  """DullRazor hair removal using black-hat morphology."""

  gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
  kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
  blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, kernel)

  _, hair_mask = cv2.threshold(blackhat, 15, 255, cv2.THRESH_BINARY)

  cleaned = cv2.inpaint(img, hair_mask,
                        inpaintRadius=2,
                        flags=cv2.INPAINT_TELEA)

  return cleaned


def remove_artifacts(img):
  """Inpaints blue/purple surgical marker ink."""

  hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)

  # Blue purple marker ink range in CSV
  lower_blue = np.array([90, 40, 40])
  upper_blue = np.array([150, 255, 255])
  artifact_mask = cv2.inRange(hsv, lower_blue, upper_blue)

  kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
  artifact_mask = cv2.dilate(artifact_mask, kernel, iterations=2)

  if artifact_mask.sum() > 100:
        return cv2.inpaint(img, artifact_mask, inpaintRadius=7, flags=cv2.INPAINT_TELEA)

  return img



def color_constancy(img, power=6):
  """Illumination normalization (Minkowski p-norm)."""

  img_float = img.astype(np.float32)

  norm_per_channel = np.power(
      np.mean(np.power(img_float, power), axis=(0, 1)),
      1.0/power
  )

  overall_norm = np.power(
     np.mean((np.power(norm_per_channel, 2))),
     1.0/2
  )

  img_constancy = img_float * (overall_norm/(norm_per_channel+ 1e-6))
  img_constancy = np.clip(img_constancy, 0, 255).astype(np.uint8)

  return img_constancy


def full_preprocess(img):
    """Executes the complete inference pipeline."""
    img = remove_hair(img)
    img = remove_artifacts(img)
    img = color_constancy(img)

    return img

def load_and_preprocess(img_name, img_dir, img_size=256):
   """Load one image from disk, preprocess, resize, normalize."""

   path = os.path.join(img_dir, img_name + '.jpg')
   img = cv2.imread(path)
   img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
   img = full_preprocess(img)
   img = cv2.resize(img, (img_size, img_size))

   return img
