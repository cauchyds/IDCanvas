import { useState } from 'react';
import './ExportSection.css';
import { generatePdf } from '../utils/pdfGenerator.js';

export default function ExportSection({ cardPairs, settings }) {
  const [filename, setFilename] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    return `scanned_cards_${today}`;
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    if (cardPairs.length === 0) return;

    setStatus('loading');
    setMessage('正在生成 PDF...');

    try {
      const pdfBytes = await generatePdf(cardPairs, settings);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      // Try File System Access API first (Chrome)
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: `${filename}.pdf`,
            types: [{
              description: 'PDF 文件',
              accept: { 'application/pdf': ['.pdf'] },
            }],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();

          setStatus('success');
          setMessage(`✅ 已保存: ${handle.name}`);
          return;
        } catch (err) {
          // User cancelled the picker, fall through to download
          if (err.name === 'AbortError') {
            setStatus(null);
            setMessage('');
            return;
          }
        }
      }

      // Fallback: regular download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('success');
      setMessage(`✅ PDF 已下载: ${filename}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setStatus('error');
      setMessage(`❌ 生成失败: ${err.message}`);
    }
  };

  if (cardPairs.length === 0) return null;

  return (
    <div className="export-section" id="export-section">
      <div className="section-header">
        <span className="section-number">3</span>
        <span className="section-title">导出 PDF</span>
      </div>

      <div className="export-card glass-card">
        <div className="export-row">
          <div className="export-filename input-group">
            <label htmlFor="export-filename">文件名</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                className="input-field"
                id="export-filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="输入文件名"
              />
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', flexShrink: 0 }}>.pdf</span>
            </div>
          </div>

          <div className="export-actions">
            <button
              className="btn btn-primary"
              onClick={handleExport}
              disabled={status === 'loading' || cardPairs.length === 0}
              id="btn-export"
            >
              {status === 'loading' ? (
                <>
                  <span className="export-spinner" />
                  生成中...
                </>
              ) : (
                <>📥 保存 PDF</>
              )}
            </button>
          </div>
        </div>

        {status && (
          <div className={`export-status ${status}`}>
            {status === 'loading' && <span className="export-spinner" />}
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
