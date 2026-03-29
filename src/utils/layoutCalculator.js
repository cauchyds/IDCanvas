import { PAPER_SIZES, CARD_WIDTH_MM, CARD_HEIGHT_MM } from './constants.js';

/**
 * Calculate layout positions for card pairs on pages.
 * 
 * @param {number} cardCount - Number of card pairs
 * @param {object} settings - Layout settings
 * @returns {{ pages: Array<Array<{index, frontX, frontY, backX, backY}>>, pairsPerPage, cardWidthMm, cardHeightMm, orientation }}
 */
export function calculateLayout(cardCount, settings) {
  const paperDef = PAPER_SIZES[settings.paperSize];
  const { margin, gap, orientation } = settings;

  // Swap paper width and height if landscape
  const paperWidth = orientation === 'landscape' ? paperDef.height : paperDef.width;
  const paperHeight = orientation === 'landscape' ? paperDef.width : paperDef.height;

  const cardW = CARD_WIDTH_MM;
  const cardH = CARD_HEIGHT_MM;

  const usableW = paperWidth - margin * 2;
  const usableH = paperHeight - margin * 2;

  let groupW, groupH;
  if (orientation === 'landscape') {
    // Landscape: Front and back side by side horizontally
    groupW = cardW * 2 + gap;
    groupH = cardH;
  } else {
    // Portrait: Front and back stacked vertically
    groupW = cardW;
    groupH = cardH * 2 + gap;
  }

  let maxCols = Math.floor((usableW + gap) / (groupW + gap));
  let maxRows = Math.floor((usableH + gap) / (groupH + gap));
  if (maxCols < 1) maxCols = 1;
  if (maxRows < 1) maxRows = 1;
  
  const pairsPerPage = maxCols * maxRows;
  const numPages = Math.max(1, Math.ceil(cardCount / pairsPerPage));
  const pages = [];

  for (let pageIdx = 0; pageIdx < numPages; pageIdx++) {
    const startIdx = pageIdx * pairsPerPage;
    const endIdx = Math.min(startIdx + pairsPerPage, cardCount);
    const countOnPage = cardCount === 0 ? 0 : endIdx - startIdx;
    
    // Calculate actual grid size dynamically for this specific page
    const actualCols = Math.min(maxCols, countOnPage || 1);
    const actualRows = Math.ceil((countOnPage || 1) / actualCols);
    
    // Calculate actual bounded size
    const totalW = actualCols * (groupW + gap) - gap;
    const totalH = actualRows * (groupH + gap) - gap;
    
    // Dynamic centering based on actual content
    const offsetX = (paperWidth - totalW) / 2;
    const offsetY = (paperHeight - totalH) / 2;

    const pageItems = [];
    for (let i = 0; i < countOnPage; i++) {
        const c = i % actualCols;
        const r = Math.floor(i / actualCols);
        const baseX = offsetX + c * (groupW + gap);
        const baseY = offsetY + r * (groupH + gap);

        if (orientation === 'landscape') {
            pageItems.push({
                index: startIdx + i,
                frontX: baseX, frontY: baseY,
                backX: baseX + cardW + gap, backY: baseY
            });
        } else {
            pageItems.push({
                index: startIdx + i,
                frontX: baseX, frontY: baseY,
                backX: baseX, backY: baseY + cardH + gap
            });
        }
    }
    pages.push(pageItems);
  }

  return {
    pages,
    pairsPerPage,
    cardWidthMm: cardW,
    cardHeightMm: cardH,
    paperWidthMm: paperWidth,
    paperHeightMm: paperHeight,
    orientation
  };
}
