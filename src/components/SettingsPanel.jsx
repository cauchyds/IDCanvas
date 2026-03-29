import './SettingsPanel.css';

export default function SettingsPanel({ settings, onSettingsChange }) {
  const update = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="settings-panel" id="settings-panel">
      <div className="settings-grid">
        <div className="input-group">
          <label htmlFor="paper-size">纸张大小</label>
          <select
            className="input-field"
            id="paper-size"
            value={settings.paperSize}
            onChange={(e) => update('paperSize', e.target.value)}
          >
            <option value="A4">A4 (210 × 297mm)</option>
            <option value="Letter">Letter (8.5 × 11&quot;)</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="orientation">纸张方向</label>
          <select
            className="input-field"
            id="orientation"
            value={settings.orientation}
            onChange={(e) => update('orientation', e.target.value)}
          >
            <option value="portrait">竖向 (上下排列)</option>
            <option value="landscape">横向 (左右并排)</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="dpi-setting">扫描 DPI</label>
          <select
            className="input-field"
            id="dpi-setting"
            value={settings.dpi}
            onChange={(e) => update('dpi', Number(e.target.value))}
          >
            <option value={200}>200 DPI</option>
            <option value={300}>300 DPI</option>
            <option value={600}>600 DPI</option>
          </select>
        </div>

        <div className="input-group" style={{ justifyContent: 'flex-end' }}>
          <div className="toggle-group">
            <span className="toggle-label">圆角处理</span>
            <div
              className={`toggle-switch ${settings.roundedCorners ? 'active' : ''}`}
              onClick={() => update('roundedCorners', !settings.roundedCorners)}
              role="switch"
              aria-checked={settings.roundedCorners}
              id="toggle-rounded-corners"
            />
          </div>
        </div>
      </div>

      {settings.roundedCorners && (
        <div className="range-group animate-fade-in-up">
          <div className="range-header">
            <span className="range-label">圆角半径</span>
            <span className="range-value">{settings.cornerRadius}mm</span>
          </div>
          <input
            type="range"
            className="range-input"
            min="1"
            max="5"
            step="0.5"
            value={settings.cornerRadius}
            onChange={(e) => update('cornerRadius', Number(e.target.value))}
            id="corner-radius-slider"
          />
        </div>
      )}

    </div>
  );
}
