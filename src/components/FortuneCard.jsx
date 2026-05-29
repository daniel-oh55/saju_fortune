function FortuneCard({ category, onOpenDetail }) {
  return (
    <article className="fortune-card">
      <div className="card-topline">
        <span className="category-icon">{category.icon}</span>
        <div>
          <h3>{category.label}</h3>
          <p>{category.summary}</p>
        </div>
      </div>
      <div className="score-row">
        <div className="score-bar" aria-label={`${category.score}점`}>
          <span style={{ width: `${category.score}%` }} />
        </div>
        <strong>{category.score}</strong>
      </div>
      <button className="text-button" type="button" onClick={() => onOpenDetail(category.id)}>
        자세히 보기
      </button>
    </article>
  );
}

export default FortuneCard;
