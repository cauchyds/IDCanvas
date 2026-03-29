import { useState, useCallback } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import DropZone from './components/DropZone.jsx';
import CardPairList from './components/CardPairList.jsx';
import LayoutPreview from './components/LayoutPreview.jsx';
import ExportSection from './components/ExportSection.jsx';
import { extractDpi, loadImage } from './utils/exifParser.js';
import { DEFAULT_SETTINGS } from './utils/constants.js';

let nextId = 1;

export default function App() {
  const [cardPairs, setCardPairs] = useState([]);
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [detectedDpi, setDetectedDpi] = useState(null);

  const handleFilesSelected = useCallback(async (files) => {
    // Load all images and extract DPI from the first one
    const loaded = [];
    for (const file of files) {
      try {
        const imageData = await loadImage(file);

        // Try to detect DPI from first file
        if (loaded.length === 0 && !detectedDpi) {
          const dpi = await extractDpi(file);
          if (dpi) {
            setDetectedDpi(dpi);
            setSettings((prev) => ({ ...prev, dpi: dpi.xDpi }));
          }
        }

        loaded.push({
          ...imageData,
          name: file.name,
          file,
        });
      } catch (err) {
        console.warn('Failed to load image:', file.name, err);
      }
    }

    // Pair images: odd = front, even = back
    setCardPairs((prev) => {
      const newPairs = [...prev];

      // Check if last pair is incomplete (has front but no back)
      let startIdx = 0;
      if (newPairs.length > 0 && !newPairs[newPairs.length - 1].back) {
        // Fill the back of the last incomplete pair
        newPairs[newPairs.length - 1] = {
          ...newPairs[newPairs.length - 1],
          back: loaded[0],
        };
        startIdx = 1;
      }

      // Create new pairs from remaining images
      for (let i = startIdx; i < loaded.length; i += 2) {
        newPairs.push({
          id: nextId++,
          front: loaded[i] || null,
          back: loaded[i + 1] || null,
        });
      }

      return newPairs;
    });
  }, [detectedDpi]);

  const handleSwap = useCallback((index) => {
    setCardPairs((prev) => {
      const newPairs = [...prev];
      const pair = { ...newPairs[index] };
      const temp = pair.front;
      pair.front = pair.back;
      pair.back = temp;
      newPairs[index] = pair;
      return newPairs;
    });
  }, []);

  const handleRemove = useCallback((index) => {
    setCardPairs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRemoveAll = useCallback(() => {
    // Revoke all object URLs
    cardPairs.forEach((pair) => {
      if (pair.front?.objectUrl) URL.revokeObjectURL(pair.front.objectUrl);
      if (pair.back?.objectUrl) URL.revokeObjectURL(pair.back.objectUrl);
    });
    setCardPairs([]);
    setDetectedDpi(null);
  }, [cardPairs]);

  return (
    <div className="app">
      <Header />

      <main className="app-main">
        <DropZone onFilesSelected={handleFilesSelected} />

        {detectedDpi && (
          <div className="dpi-notice">
            ℹ️ 检测到扫描 DPI: <strong>{detectedDpi.xDpi} × {detectedDpi.yDpi}</strong>
            （已自动应用到设置）
          </div>
        )}

        <CardPairList
          cardPairs={cardPairs}
          onSwap={handleSwap}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          roundedCorners={settings.roundedCorners}
        />

        <LayoutPreview
          cardPairs={cardPairs}
          settings={settings}
          onSettingsChange={setSettings}
        />

        <ExportSection
          cardPairs={cardPairs}
          settings={settings}
        />

        {cardPairs.length === 0 && (
          <div className="app-empty-state">
            <p>👆 上传扫描的证件图片开始使用</p>
            <p style={{ marginTop: '8px', fontSize: '0.75rem' }}>
              按顺序上传（正面→反面→正面→反面...），系统会自动配对
            </p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        IDCanvas · 所有处理在本地浏览器完成，不上传任何数据
      </footer>
    </div>
  );
}
