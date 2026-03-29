// Standard ID card dimensions (ISO/IEC 7810 ID-1)
export const CARD_WIDTH_MM = 85.6;
export const CARD_HEIGHT_MM = 54.0;
export const CARD_CORNER_RADIUS_MM = 3.0;

// Paper sizes in mm
export const PAPER_SIZES = {
  A4: { width: 210, height: 297, label: 'A4 (210×297mm)' },
  Letter: { width: 215.9, height: 279.4, label: 'Letter (8.5×11")' },
};

// Default DPI options
export const DPI_OPTIONS = [200, 300, 600];

// Default settings
export const DEFAULT_SETTINGS = {
  paperSize: 'A4',
  orientation: 'portrait',   // 'portrait' or 'landscape'
  dpi: 300,
  cornerRadius: 3,           // mm
  margin: 10,                // mm
  gap: 10,                   // mm increased default space
  roundedCorners: true,
};

// mm to points (PDF uses points: 1pt = 1/72 inch)
export const MM_TO_PT = 72 / 25.4;

// mm to pixels at given DPI
export const mmToPx = (mm, dpi) => (mm / 25.4) * dpi;

// pixels to mm at given DPI
export const pxToMm = (px, dpi) => (px / dpi) * 25.4;
