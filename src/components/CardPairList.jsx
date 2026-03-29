import './CardPairList.css';

export default function CardPairList({ cardPairs, onSwap, onRemove, onRemoveAll, roundedCorners }) {
  if (cardPairs.length === 0) return null;

  return (
    <div className="card-pair-list" id="card-pair-list">
      <div className="card-pair-list-header">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span className="section-number">1</span>
          <span className="section-title">确认配对</span>
          <span className="section-subtitle">
            已配对 {cardPairs.length} 组证件
          </span>
        </div>
        <button className="btn btn-danger btn-sm" onClick={onRemoveAll} id="btn-remove-all">
          🗑 清空全部
        </button>
      </div>

      <div className="card-pairs-grid">
        {cardPairs.map((pair, idx) => (
          <div
            className="card-pair glass-card"
            key={pair.id}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="card-pair-number">#{idx + 1}</div>

            <div className="card-pair-images">
              {/* Front */}
              <div className="card-image-column">
                <div className={`card-image-slot ${pair.front ? 'has-image' : ''} ${roundedCorners ? 'rounded' : ''}`}>
                  {pair.front ? (
                    <>
                      <img src={pair.front.objectUrl} alt={`证件 ${idx + 1} 正面`} />
                      <span className="card-image-label">正面</span>
                    </>
                  ) : (
                    <div className="card-image-empty">
                      <span className="card-image-empty-icon">🖼</span>
                      <span>正面</span>
                    </div>
                  )}
                </div>
                {pair.front && (
                  <div className="card-pair-filename" title={pair.front.name}>
                    {pair.front.name}
                  </div>
                )}
              </div>

              {/* Swap button */}
              <button
                className="card-pair-swap"
                onClick={() => onSwap(idx)}
                title="交换正反面"
                id={`btn-swap-${idx}`}
              >
                ⇄
              </button>

              {/* Back */}
              <div className="card-image-column">
                <div className={`card-image-slot ${pair.back ? 'has-image' : ''} ${roundedCorners ? 'rounded' : ''}`}>
                  {pair.back ? (
                    <>
                      <img src={pair.back.objectUrl} alt={`证件 ${idx + 1} 反面`} />
                      <span className="card-image-label">反面</span>
                    </>
                  ) : (
                    <div className="card-image-empty">
                      <span className="card-image-empty-icon">🖼</span>
                      <span>反面</span>
                    </div>
                  )}
                </div>
                {pair.back && (
                  <div className="card-pair-filename" title={pair.back.name}>
                    {pair.back.name}
                  </div>
                )}
              </div>
            </div>

            <div className="card-pair-actions">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onRemove(idx)}
                title="删除此组"
                id={`btn-remove-${idx}`}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
