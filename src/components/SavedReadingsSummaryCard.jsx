function SavedReadingsSummaryCard({ savedReadings, onOpenSavedReadings }) {
  const count = Array.isArray(savedReadings?.items) ? savedReadings.items.length : 0;

  return (
    <section className="saved-readings-summary-card">
      <div>
        <p className="eyebrow">Saved</p>
        <h2>저장한 풀이</h2>
        <p>
          {count > 0
            ? `저장한 풀이 ${count}개`
            : '마음에 드는 풀이를 저장해두면 나중에 다시 볼 수 있어요.'}
        </p>
      </div>
      <button className="ghost-button full-width" type="button" onClick={onOpenSavedReadings}>
        저장한 풀이 보기
      </button>
    </section>
  );
}

export default SavedReadingsSummaryCard;
