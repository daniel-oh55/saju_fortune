import AdRewardBox from '../components/AdRewardBox.jsx';

function FortuneDetailPage({
  fortune,
  selectedCategory,
  unlockedDetails,
  onSelectCategory,
  onUnlockDetail,
}) {
  const category = fortune.categories.find((item) => item.id === selectedCategory) || fortune.categories[0];
  const isUnlocked = Boolean(unlockedDetails[category.id]?.unlocked);
  const detailParagraphs = category.detail.split('\n\n');

  return (
    <div className="page-stack">
      <section className="section-header">
        <p className="eyebrow">{fortune.dateKey}</p>
        <h1>오늘운세</h1>
        <p>오늘의 키워드는 {fortune.keyword}입니다.</p>
      </section>

      <div className="category-tabs">
        {fortune.categories.map((item) => (
          <button
            className={item.id === category.id ? 'selected' : ''}
            key={item.id}
            type="button"
            onClick={() => onSelectCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <article className="detail-card">
        <div className="detail-score">
          <span>{category.label}</span>
          <strong>{category.score}</strong>
        </div>
        <h2>{category.summary}</h2>
        <p className="muted">
          행운 색상은 {category.luckyColor}, 행운 아이템은 {category.luckyItem}입니다.
        </p>

        <AdRewardBox
          categoryLabel={category.label}
          isUnlocked={isUnlocked}
          onUnlock={() => onUnlockDetail(category.id)}
        />

        {isUnlocked ? (
          <div className="detail-copy">
            <h3>상세 풀이</h3>
            {detailParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <div className="locked-copy">
            상세 풀이는 광고 시청 후 열람할 수 있습니다.
          </div>
        )}
      </article>
    </div>
  );
}

export default FortuneDetailPage;
