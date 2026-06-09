function takeItems(items, count = 3) {
  return Array.isArray(items) ? items.filter(Boolean).slice(0, count) : [];
}

function SajuElementSummaryCard({ sajuAnalysis, onOpenDetail }) {
  if (!sajuAnalysis?.elements) return null;

  const { elements } = sajuAnalysis;
  const traits = takeItems(sajuAnalysis.traits);
  const luckyKeywords = takeItems(sajuAnalysis.luckyKeywords);

  return (
    <section className="saju-element-summary-card">
      <div className="saju-element-head">
        <p className="eyebrow">Saju Flow</p>
        <h2>나의 사주 흐름</h2>
      </div>

      <div className="saju-element-pair-grid">
        <div>
          <span>중심 기운</span>
          <strong>{elements.dominant || '확인 중'}</strong>
        </div>
        <div>
          <span>보완하면 좋은 기운</span>
          <strong>{elements.weak || '확인 중'}</strong>
        </div>
      </div>

      {elements.balanceHint && <p className="saju-balance-hint">{elements.balanceHint}</p>}

      {traits.length > 0 && (
        <div className="saju-keyword-section">
          <span>성향 키워드</span>
          <div className="saju-keyword-chips">
            {traits.map((trait) => (
              <em key={trait}>{trait}</em>
            ))}
          </div>
        </div>
      )}

      {luckyKeywords.length > 0 && (
        <div className="saju-keyword-section">
          <span>오늘 활용 키워드</span>
          <div className="saju-keyword-chips">
            {luckyKeywords.map((keyword) => (
              <em key={keyword}>{keyword}</em>
            ))}
          </div>
        </div>
      )}

      <p className="saju-element-guide">
        이 내용은 사주 원국을 바탕으로 한 참고용 흐름입니다. 하루의 선택을 가볍게 정리하는 데
        활용해보세요.
      </p>

      {onOpenDetail && (
        <button className="ghost-button full-width" type="button" onClick={onOpenDetail}>
          사주 흐름 자세히 보기
        </button>
      )}
    </section>
  );
}

export default SajuElementSummaryCard;
