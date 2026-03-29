import ExifReader from 'exifreader';

/**
 * Extract DPI from JPEG EXIF metadata.
 * Returns { xDpi, yDpi } or null if not found.
 */
export async function extractDpi(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const tags = ExifReader.load(arrayBuffer);

    let xDpi = null;
    let yDpi = null;

    // Try XResolution / YResolution (EXIF/TIFF tags)
    if (tags['XResolution'] && tags['YResolution']) {
      xDpi = parseFloat(tags['XResolution'].description);
      yDpi = parseFloat(tags['YResolution'].description);
    }

    // Check the resolution unit (2 = inches, 3 = centimeters)
    const resUnit = tags['ResolutionUnit']?.value;
    if (resUnit === 3 && xDpi && yDpi) {
      // Convert from pixels/cm to pixels/inch
      xDpi = xDpi * 2.54;
      yDpi = yDpi * 2.54;
    }

    // JFIF fallback
    if (!xDpi && tags['PixelXDimension'] && tags['PixelYDimension']) {
      return null; // Cannot determine DPI from pixel dimensions alone
    }

    if (xDpi && yDpi && xDpi > 0 && yDpi > 0) {
      return { xDpi: Math.round(xDpi), yDpi: Math.round(yDpi) };
    }

    return null;
  } catch (e) {
    console.warn('Failed to extract EXIF DPI:', e);
    return null;
  }
}

/**
 * Load image and return { img, width, height, objectUrl }
 */
export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({
        img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        objectUrl,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = objectUrl;
  });
}
