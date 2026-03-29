import { useRef, useState, useCallback } from 'react';
import './DropZone.css';

export default function DropZone({ onFilesSelected }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (imageFiles.length > 0) {
      onFilesSelected(imageFiles);
    }
  }, [onFilesSelected]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <div className="dropzone-wrapper">
      <div
        className={`dropzone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        id="dropzone"
      >
        <div className="dropzone-content">
          <div className="dropzone-icon">📁</div>
          <div className="dropzone-text">拖拽证件的正反面图片到此上传</div>
          <div className="dropzone-hint">
            支持 JPG / PNG 格式 · 按顺序上传（正面、反面、正面、反面...）
          </div>
          <div className="dropzone-actions">
            <button className="btn" type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              📂 选择文件
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          multiple
          onChange={handleFileChange}
          id="file-input"
        />
      </div>
    </div>
  );
}
