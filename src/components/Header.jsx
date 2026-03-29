import './Header.css';

export default function Header() {
  return (
    <header className="header" id="header">
      <div className="header-brand">
        <div className="header-logo-wrapper">
          <img src="./favicon.svg" alt="IDCanvas Logo" className="header-logo-img" />
        </div>
        <div className="header-titles">
          <h1 className="header-title">IDCanvas</h1>
          <span className="header-subtitle">将证件正反面排版到同一页</span>
        </div>
      </div>
      <div className="header-actions">
        <div className="privacy-badge">
          <span>🔒</span>
          <span>图片不会上传至服务器</span>
        </div>
      </div>
    </header>
  );
}
