import { PAPER_SIZES, CARD_WIDTH_MM, CARD_HEIGHT_MM } from './constants.js';

/**
 * Calculate layout positions for card pairs on pages.
 * 
 * @param {number} cardCount - Number of card pairs
 * @param {object} settings - Layout settings
 * @returns {{ pages: Array<Array<{index, frontX, frontY, backX, backY}>>, pairsPerPage, cardWidthMm, cardHeightMm }}
 */
export function calculateLayout(cardCount, settings) {
  const paper = PAPER_SIZES[settings.paperSize];
  const { margin, gap, layout } = settings;

  const cardW = CARD_WIDTH_MM;
  const cardH = CARD_HEIGHT_MM;

  const usableW = paper.width - margin * 2;
  const usableH = paper.height - margin * 2;

  let pairsPerPage;
  let positions = [];

  if (layout === 'side-by-side') {
    // Front and back side by side horizontally
    const groupW = cardW * 2 + gap;
    const groupH = cardH;

    const cols = Math.floor((usableW + gap) / (groupW + gap));
    const rows = Math.floor((usableH + gap) / (groupH + gap));
    pairsPerPage = cols * rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const baseX = margin + col * (groupW + gap);
        const baseY = margin + row * (groupH + gap);
        positions.push({
          frontX: baseX,
          frontY: baseY,
          backX: baseX + cardW + gap,
          backY: baseY,
        });
      }
    }
  } else {
    // Front and back stacked vertically
    const groupW = cardW;
    const groupH = cardH * 2 + gap;

    const cols = Math.floor((usableW + gap) / (groupW + gap));
    const rows = Math.floor((usableH + gap) / (groupH + gap));
    pairsPerPage = cols * rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const baseX = margin + col * (groupW + gap);
        const baseY = margin + row * (groupH + gap);
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

    pages[pageIdx].push({
      index: i,
      ...positions[posIdx],
    });
  }

  return {
    pages,
    pairsPerPage: pairsPerPage || 1,
    cardWidthMm: cardW,
    cardHeightMm: cardH,
    paperWidthMm: paper.width,
    paperHeightMm: paper.height,
  };
}
