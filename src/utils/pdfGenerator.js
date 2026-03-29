import { PDFDocument } from 'pdf-lib';
import { PAPER_SIZES, CARD_WIDTH_MM, CARD_HEIGHT_MM, MM_TO_PT } from './constants.js';
import { clipRoundedCorners, canvasToJpegBytes } from './roundedCorner.js';
import { calculateLayout } from './layoutCalculator.js';
import { mmToPx } from './constants.js';

/**
 * Generate a multi-page PDF with card pairs arranged on paper.
 *
 * @param {Array<{front: {img, objectUrl}, back: {img, objectUrl}}>} cardPairs
 * @param {object} settings
 * @returns {Promise<Uint8Array>} PDF bytes
 */
export async function generatePdf(cardPairs, settings) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle('CardPrint - 证件扫描');
  pdfDoc.setCreator('CardPrint');

  const paper = PAPER_SIZES[settings.paperSize];
  const paperWPt = paper.width * MM_TO_PT;
  const paperHPt = paper.height * MM_TO_PT;

  const layoutResult = calculateLayout(cardPairs.length, settings);
  const { pages } = layoutResult;

  const cornerRadiusPx = settings.roundedCorners
    ? mmToPx(settings.cornerRadius, settings.dpi)
    : 0;

  const cardWPt = CARD_WIDTH_MM * MM_TO_PT;
  const cardHPt = CARD_HEIGHT_MM * MM_TO_PT;

  for (const pageItems of pages) {
    const page = pdfDoc.addPage([paperWPt, paperHPt]);

    for (const item of pageItems) {
      const pair = cardPairs[item.index];
      if (!pair) continue;

      // Process front image
      if (pair.front?.img) {
        const frontBytes = await processImage(pair.front.img, cornerRadiusPx);
        const frontImage = await pdfDoc.embedJpg(frontBytes);

        // PDF coordinates are from bottom-left, Y axis is inverted
        const fx = item.frontX * MM_TO_PT;
        const fy = paperHPt - item.frontY * MM_TO_PT - cardHPt;

        page.drawImage(frontImage, {
          x: fx,
          y: fy,
          width: cardWPt,
          height: cardHPt,
        });
      }

      // Process back image
      if (pair.back?.img) {
        const backBytes = await processImage(pair.back.img, cornerRadiusPx);
        const backImage = await pdfDoc.embedJpg(backBytes);

        const bx = item.backX * MM_TO_PT;
        const by = paperHPt - item.backY * MM_TO_PT - cardHPt;

        page.drawImage(backImage, {
          x: bx,
          y: by,
          width: cardWPt,
          height: cardHPt,
        });
      }
    }
  }

  return await pdfDoc.save();
}

/**
 * Process a single image: apply rounded corners and convert to JPEG bytes.
 */
async function processImage(img, cornerRadiusPx) {
  if (cornerRadiusPx > 0) {
    const clippedCanvas = clipRoundedCorners(img, cornerRadiusPx);
    return await canvasToJpegBytes(clippedCanvas);
  } else {
    // Draw original image to canvas and export
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return await canvasToJpegBytes(canvas);
  }
}
