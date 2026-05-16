import numpy as np
import cv2

def make_scorecam_heatmap(img_array, meta_array, model, grid_size=14):
    """
    Optimized ScoreCAM — batches all masks in one predict call.
    grid_size=14 → 196 masks, good balance of speed and resolution.
    grid_size=20 → 400 masks, smoother but slower.
    """
    h, w        = 256, 256
    n_masks     = grid_size * grid_size
    img_single  = img_array[0]   # remove batch dim → (256, 256, 3)

    # Build all masked images at once
    all_masked_imgs  = np.zeros((n_masks, h, w, 3), dtype=np.float32)
    all_masked_metas = np.repeat(meta_array, n_masks, axis=0)

    idx = 0
    for row in range(grid_size):
        for col in range(grid_size):
            mask = np.zeros((h, w, 3), dtype=np.float32)
            r_start = int(row * h / grid_size)
            r_end   = int((row + 1) * h / grid_size)
            c_start = int(col * w / grid_size)
            c_end   = int((col + 1) * w / grid_size)
            mask[r_start:r_end, c_start:c_end, :] = 1.0
            all_masked_imgs[idx] = img_single * mask
            idx += 1

    # One single predict call for all masks
    print(f'Running {n_masks} masks in one batch...')
    scores = model.predict(
        [all_masked_imgs, all_masked_metas],
        batch_size=32,
        verbose=0
    ).squeeze()   # shape (n_masks,)

    # Reshape scores into 2D heatmap
    heatmap = scores.reshape(grid_size, grid_size).astype(np.float32)

    # Normalize
    heatmap -= heatmap.min()
    if heatmap.max() > 0:
        heatmap /= heatmap.max()

    heatmap = 1-heatmap

    print(f'Done. Heatmap range: {heatmap.min():.3f} – {heatmap.max():.3f}')
    return heatmap


def overlay_heatmap_on_image(original_img, heatmap, alpha=0.35):

  # Resize heatmap from (8,8) to full image size (256,256)
  heatmap_resized = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))

  # Convert to colormap
  # COLORMAP_JET: blue=cold(low attention) → green → red=hot(high attention)
  # COLORMAP_INFERNO: black → purple → orange → yellow (more clinical look)
  heatmap_uint8 = np.uint8(255*heatmap_resized)
  heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
  heatmap_color = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)

  # Blend original image and heatmap
  superimposed = cv2.addWeighted(
      original_img.astype(np.float32), 1-alpha,
      heatmap_color.astype(np.float32), alpha, 0
  )

  heatmap = np.uint8(superimposed)
  return heatmap