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

  let pairsPerPage;
  let positions = [];

  // Default to 1 to avoid division by zero
  let cols = 1, rows = 1;

  if (orientation === 'landscape') {
    // Landscape: Front and back side by side horizontally
    const groupW = cardW * 2 + gap;
    const groupH = cardH;

    cols = Math.floor((usableW + gap) / (groupW + gap));
    rows = Math.floor((usableH + gap) / (groupH + gap));
    if (cols < 1) cols = 1;
    if (rows < 1) rows = 1;
    pairsPerPage = cols * rows;

    // Calculate grid total size
    const totalW = cols * (groupW + gap) - gap;
    const totalH = rows * (groupH + gap) - gap;

    // Calculate centering offset
    const offsetX = (paperWidth - totalW) / 2;
    const offsetY = (paperHeight - totalH) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const baseX = offsetX + col * (groupW + gap);
        const baseY = offsetY + row * (groupH + gap);
        positions.push({
          frontX: baseX,
          frontY: baseY,
          backX: baseX + cardW + gap,
          backY: baseY,
        });
      }
    }
  } else {
    // Portrait: Front and back stacked vertically
    const groupW = cardW;
    const groupH = cardH * 2 + gap;

    cols = Math.floor((usableW + gap) / (groupW + gap));
    rows = Math.floor((usableH + gap) / (groupH + gap));
    if (cols < 1) cols = 1;
    if (rows < 1) rows = 1;
    pairsPerPage = cols * rows;

    // Calculate grid total size
    const totalW = cols * (groupW + gap) - gap;
    const totalH = rows * (groupH + gap) - gap;

    // Calculate centering offset
    const offsetX = (paperWidth - totalW) / 2;
    const offsetY = (paperHeight - totalH) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const baseX = offsetX + col * (groupW + gap);
        const baseY = offsetY + row * (groupH + gap);
        positions.push({
          frontX: baseX,
          frontY: baseY,
          backX: baseX,
          backY: baseY + cardH + gap,
        });
      }
    }
  }

  // Distribute card pairs across pages
  const pages = [];
  for (let i = 0; i < cardCount; i++) {
    const pageIdx = Math.floor(i / pairsPerPage);
    const posIdx = i % pairsPerPage;

    if (!pages[pageIdx]) pages[pageIdx] = [];

    const position = positions[posIdx] || positions[0];

    pages[pageIdx].push({
      index: i,
      ...position,
    });
  }

  return {
    pages,
    pairsPerPage: pairsPerPage,
    cardWidthMm: cardW,
    cardHeightMm: cardH,
    paperWidthMm: paperWidth,
    paperHeightMm: paperHeight,
    orientation
  };
}
