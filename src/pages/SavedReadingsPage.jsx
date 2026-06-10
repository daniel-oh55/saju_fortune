function formatSavedAt(value) {
  if (!value) return '저장일 확인 중';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '저장일 확인 중';

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function SavedReadingsPage({ savedReadings, onRemoveSavedReading, onNavigate }) {
  const items = Array.isArray(savedReadings?.items) ? savedReadings.items : [];

  return (
    <div className="page-stack saved-readings-page">
      <section className="section-header">
        <button className="ghost-button" type="button" onClick={() => onNavigate('home')}>
          ← 홈으로
        </button>
        <p className="eyebrow">Saved Readings</p>
        <h1>저장한 풀이</h1>
        <p>마음에 남는 풀이를 다시 확인할 수 있는 공간입니다.</p>
      </section>

      {items.length === 0 ? (
        <section className="saved-reading-empty">
          <h2>아직 저장한 풀이가 없습니다.</h2>
          <p>오늘운세 상세나 사주 흐름 페이지에서 풀이를 저장해보세요.</p>
        </section>
      ) : (
        <section className="saved-reading-list">
          {items.map((item) => (
            <article className="saved-reading-item" key={item.id}>
              <div>
                <span>{item.dateKey || formatSavedAt(item.savedAt)}</span>
                <h2>{item.title}</h2>
                {item.summary && <p>{item.summary}</p>}
              </div>

              {item.body && <p className="saved-reading-body">{item.body}</p>}

              {item.tags?.length > 0 && (
                <div className="saved-reading-tags">
                  {item.tags.map((tag, index) => (
                    <em key={`${item.id}-${tag}-${index}`}>{tag}</em>
                  ))}
                </div>
              )}

              <div className="saved-reading-actions">
                <span>{formatSavedAt(item.savedAt)} 저장</span>
                <button type="button" onClick={() => onRemoveSavedReading(item.id)}>
                  삭제
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default SavedReadingsPage;
