import { PAPER_SIZES, CARD_WIDTH_MM, CARD_HEIGHT_MM } from './constants.js';

/**
 * Calculate layout positions for card pairs on pages, 
 * automatically and evenly distributing them across the paper.
 * 
 * @param {number} cardCount - Number of card pairs
 * @param {object} settings - Layout settings
 * @returns {{ pages: Array<Array<{index, frontX, frontY, backX, backY}>>, pairsPerPage, cardWidthMm, cardHeightMm, orientation }}
 */
export function calculateLayout(cardCount, settings) {
  const paperDef = PAPER_SIZES[settings.paperSize];
  const { orientation } = settings;

  // Use a sensible internal minimum margin and gap for capacity checks
  const minMargin = 10;
  const minGap = 10;

  // Swap paper width and height if landscape
  const paperWidth = orientation === 'landscape' ? paperDef.height : paperDef.width;
  const paperHeight = orientation === 'landscape' ? paperDef.width : paperDef.height;

  const cardW = CARD_WIDTH_MM;
  const cardH = CARD_HEIGHT_MM;

  const usableW = paperWidth - minMargin * 2;
  const usableH = paperHeight - minMargin * 2;

  let groupW, groupH;
  if (orientation === 'landscape') {
    // Landscape: Front and back side by side horizontally
    groupW = cardW * 2 + minGap;
    groupH = cardH;
  } else {
    // Portrait: Front and back stacked vertically
    groupW = cardW;
    groupH = cardH * 2 + minGap;
  }

  // Determine MAX pairs that can fit on a page
  let maxCols = Math.floor((usableW + minGap) / (groupW + minGap));
  let maxRows = Math.floor((usableH + minGap) / (groupH + minGap));
  if (maxCols < 1) maxCols = 1;
  if (maxRows < 1) maxRows = 1;
  
  const pairsPerPage = maxCols * maxRows;
  const numPages = Math.max(1, Math.ceil(cardCount / pairsPerPage));
  const pages = [];

  for (let pageIdx = 0; pageIdx < numPages; pageIdx++) {
    const startIdx = pageIdx * pairsPerPage;
    const endIdx = Math.min(startIdx + pairsPerPage, cardCount);
    // Number of pairs actually on this page
    const countOnPage = cardCount === 0 ? 0 : endIdx - startIdx;
    
    // Dynamic grid size for this page specifically
    const actualCols = Math.min(maxCols, countOnPage || 1);
    const actualRows = Math.ceil((countOnPage || 1) / actualCols);
    
    // Determine card-level grid dimensions
    let totalCardCols, totalCardRows;
    if (orientation === 'landscape') {
        totalCardCols = actualCols * 2; // Each pair is 2 columns
        totalCardRows = actualRows * 1; // Each pair is 1 row
    } else {
        totalCardCols = actualCols * 1; // Each pair is 1 column
        totalCardRows = actualRows * 2; // Each pair is 2 rows
    }

    // Distribute remaining space evenly between borders and inner gaps
    const remainingW = paperWidth - (totalCardCols * cardW);
    const remainingH = paperHeight - (totalCardRows * cardH);
    
    // spacingX = margin_left = middle_gaps = margin_right
    const spacingX = remainingW / (totalCardCols + 1);
    const spacingY = remainingH / (totalCardRows + 1);

    const pageItems = [];
    for (let i = 0; i < countOnPage; i++) {
        const pairCol = i % actualCols;
        const pairRow = Math.floor(i / actualCols);
        
        // Convert to absolute card positions in the grid
        let frontCol, frontRow, backCol, backRow;
        
        if (orientation === 'landscape') {
            frontCol = pairCol * 2;
            frontRow = pairRow;
            backCol = pairCol * 2 + 1;
            backRow = pairRow;
        } else {
            frontCol = pairCol;
            frontRow = pairRow * 2;
            backCol = pairCol;
            backRow = pairRow * 2 + 1;
        }

        const frontX = spacingX + frontCol * (cardW + spacingX);
        const frontY = spacingY + frontRow * (cardH + spacingY);
        
        const backX = spacingX + backCol * (cardW + spacingX);
        const backY = spacingY + backRow * (cardH + spacingY);
        

        pageItems.push({
            index: startIdx + i,
            frontX, frontY,
            backX, backY
        });
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
