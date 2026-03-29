import './Header.css';

export default function Header() {
  return (
    <header className="header" id="header">
      <div className="header-brand">
        <span className="header-logo">🪪</span>
        <h1 className="header-title">CardPrint</h1>
        <span className="header-subtitle">证件扫描排版打印</span>
      </div>
      <div className="header-actions">
        <div className="privacy-badge">
          <span>🔒</span>
          <span>数据不离开浏览器</span>
        </div>
      </div>
    </header>
  );
}
