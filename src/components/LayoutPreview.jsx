import { useRef, useEffect, useState } from 'react';
import './LayoutPreview.css';
import SettingsPanel from './SettingsPanel.jsx';
import { calculateLayout } from '../utils/layoutCalculator.js';
import { PAPER_SIZES, CARD_WIDTH_MM, CARD_HEIGHT_MM } from '../utils/constants.js';

const PREVIEW_WIDTH = 500; // px for canvas rendering

export default function LayoutPreview({ cardPairs, settings, onSettingsChange }) {
  const canvasRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const layoutResult = calculateLayout(cardPairs.length, settings);
  const totalPages = layoutResult.pages.length;

  // Clamp current page
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  // Draw preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cardPairs.length === 0) return;

    const paperW = layoutResult.paperWidthMm;
    const paperH = layoutResult.paperHeightMm;
    const scale = PREVIEW_WIDTH / paperW;
    const canvasW = PREVIEW_WIDTH;
    const canvasH = paperH * scale;

    // Handle HiDPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = canvasW + 'px';
    canvas.style.height = canvasH + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // White paper background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Draw margin guides (dashed lines)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 4]);
    const m = 10 * scale; // Standard 10mm guide
    ctx.strokeRect(m, m, canvasW - m * 2, canvasH - m * 2);
    ctx.setLineDash([]);

    // Draw cards for current page
    const pageItems = layoutResult.pages[currentPage] || [];
    const cardWPx = CARD_WIDTH_MM * scale;
    const cardHPx = CARD_HEIGHT_MM * scale;
    const cornerRadiusPx = settings.roundedCorners ? settings.cornerRadius * scale : 0;

    for (const item of pageItems) {
      const pair = cardPairs[item.index];
      if (!pair) continue;

      // Draw front
      drawCardSlot(ctx, item.frontX * scale, item.frontY * scale, cardWPx, cardHPx, cornerRadiusPx, pair.front, '正');

      // Draw back
      drawCardSlot(ctx, item.backX * scale, item.backY * scale, cardWPx, cardHPx, cornerRadiusPx, pair.back, '反');
    }
  }, [cardPairs, settings, currentPage, layoutResult]);

  if (cardPairs.length === 0) return null;

  return (
    <div className="preview-section" id="preview-section">
      <div className="section-header">
        <span className="section-number">2</span>
        <span className="section-title">排版预览</span>
        <span className="section-subtitle">
          共 {totalPages} 页 · 每页最多 {layoutResult.pairsPerPage} 组
        </span>
      </div>

      <div className="preview-layout">
        <div className="preview-canvas-wrapper">
          <div className="preview-canvas-container">
            <canvas ref={canvasRef} id="preview-canvas" />
          </div>

          {totalPages > 1 && (
            <div className="preview-page-nav">
              <button
                className="btn btn-sm"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => p - 1)}
                id="btn-prev-page"
              >
                ◀ 上一页
              </button>
              <span className="preview-page-info">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                className="btn btn-sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((p) => p + 1)}
                id="btn-next-page"
              >
                下一页 ▶
              </button>
            </div>
          )}
        </div>

        <div className="preview-settings-card glass-card">
          <SettingsPanel settings={settings} onSettingsChange={onSettingsChange} />
        </div>
      </div>
    </div>
  );
}

function drawCardSlot(ctx, x, y, w, h, r, imageData, label) {
  ctx.save();

  // Clip to rounded rectangle
  if (r > 0) {
    roundedRect(ctx, x, y, w, h, r);
    ctx.clip();
  }

  if (imageData?.img) {
    ctx.drawImage(imageData.img, x, y, w, h);
  } else {
    // Empty slot
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${label}面`, x + w / 2, y + h / 2);
  }

  ctx.restore();

  // Border
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 0.5;
  if (r > 0) {
    roundedRect(ctx, x, y, w, h, r);
    ctx.stroke();
  } else {
    ctx.strokeRect(x, y, w, h);
  }
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
