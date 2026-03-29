/**
 * Apply rounded corner clipping to an image using canvas.
 * Returns a new canvas with the clipped image.
 */
export function clipRoundedCorners(img, cornerRadiusPx) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');

  // Draw rounded rectangle clip path
  const w = canvas.width;
  const h = canvas.height;
  const r = Math.min(cornerRadiusPx, w / 2, h / 2);

  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.quadraticCurveTo(w, 0, w, r);
  ctx.lineTo(w, h - r);
  ctx.quadraticCurveTo(w, h, w - r, h);
  ctx.lineTo(r, h);
  ctx.quadraticCurveTo(0, h, 0, h - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(img, 0, 0, w, h);

  return canvas;
}

/**
 * Convert canvas to JPEG bytes for PDF embedding.
 */
export function canvasToJpegBytes(canvas, quality = 0.92) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
      },
      'image/jpeg',
      quality
    );
  });
}

/**
 * Convert canvas to PNG bytes for PDF embedding (preserves transparency).
 */
export function canvasToPngBytes(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
      },
      'image/png'
    );
  });
}
