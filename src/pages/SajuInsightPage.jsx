import SajuCalculationBasisCard from '../components/SajuCalculationBasisCard.jsx';

const ELEMENT_LABELS = {
  wood: '목',
  fire: '화',
  earth: '토',
  metal: '금',
  water: '수',
};

function toItems(items, count) {
  return Array.isArray(items) ? items.filter(Boolean).slice(0, count) : [];
}

function labelElement(key, fallback) {
  return ELEMENT_LABELS[key] || fallback || key;
}

function buildElementRows(elements) {
  const percentages = elements?.percentages || {};
  const counts = elements?.counts || {};
  const keys = Object.keys(percentages).length > 0 ? Object.keys(percentages) : Object.keys(counts);

  return keys.map((key) => ({
    key,
    label: labelElement(key, elements?.labels?.[key]),
    percent: typeof percentages[key] === 'number' ? percentages[key] : null,
    count: typeof counts[key] === 'number' ? counts[key] : null,
  }));
}

function SajuInsightPage({ profile, fortune, onNavigate }) {
  const sajuAnalysis = fortune?.sajuAnalysis;

  if (!sajuAnalysis) {
    return (
      <div className="page-stack saju-insight-page">
        <section className="saju-insight-hero">
          <button className="ghost-button" type="button" onClick={() => onNavigate('home')}>
            ← 홈으로
          </button>
          <h1>사주 흐름 자세히 보기</h1>
          <p>사주 흐름 정보를 준비 중입니다.</p>
        </section>
      </div>
    );
  }

  const elements = sajuAnalysis.elements || {};
  const elementRows = buildElementRows(elements);
  const traits = toItems(sajuAnalysis.traits, 3);
  const weakPoints = toItems(sajuAnalysis.weakPoints, 3);
  const luckyKeywords = toItems(sajuAnalysis.luckyKeywords, 4);

  return (
    <div className="page-stack saju-insight-page">
      <section className="saju-insight-hero">
        <button className="ghost-button" type="button" onClick={() => onNavigate('home')}>
          ← 홈으로
        </button>
        <p className="eyebrow">Saju Insight</p>
        <h1>사주 흐름 자세히 보기</h1>
        <p>입력한 생년월일과 선택한 시간 기준을 바탕으로 계산한 참고용 사주 흐름입니다.</p>
      </section>

      <SajuCalculationBasisCard profile={profile} fortune={fortune} />

      <section className="saju-insight-section">
        <h2>오행 균형</h2>
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
        {elements.balanceLabel && <p className="saju-insight-muted">{elements.balanceLabel}</p>}
        {elements.balanceHint && <p className="saju-insight-note">{elements.balanceHint}</p>}

        {elementRows.length > 0 && (
          <div className="saju-element-bars">
            {elementRows.map((item) => (
              <div className="saju-element-bar" key={item.key}>
                <div>
                  <span>{item.label}</span>
                  <strong>
                    {item.percent !== null ? `${item.percent}%` : `${item.count ?? 0}개`}
                  </strong>
                </div>
                <i>
                  <b style={{ width: `${item.percent ?? Math.min((item.count ?? 0) * 12, 100)}%` }} />
                </i>
              </div>
            ))}
          </div>
        )}
      </section>

      {traits.length > 0 && (
        <section className="saju-insight-section">
          <h2>성향 키워드</h2>
          <div className="saju-insight-chip-list">
            {traits.map((trait) => (
              <span key={trait}>{trait}</span>
            ))}
          </div>
          <p className="saju-insight-muted">
            오늘의 흐름을 살필 때 편안하게 참고해볼 수 있는 성향입니다.
          </p>
        </section>
      )}

      {weakPoints.length > 0 && (
        <section className="saju-insight-section">
          <h2>보완 포인트</h2>
          <div className="saju-insight-chip-list">
            {weakPoints.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
          <p className="saju-insight-muted">
            부족함을 단정하기보다 오늘 조금 더 살펴보면 좋은 부분으로 활용해보세요.
          </p>
        </section>
      )}

      {luckyKeywords.length > 0 && (
        <section className="saju-insight-section">
          <h2>오늘 활용 키워드</h2>
          <div className="saju-insight-chip-list">
            {luckyKeywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
          <p className="saju-insight-muted">
            하루의 행동 힌트처럼 가볍게 참고해보세요.
          </p>
        </section>
      )}

      <section className="saju-insight-note">
        <p>
          이 페이지는 사주 원국을 바탕으로 한 참고용 해석입니다. 실제 선택과 판단은 현재 상황을 함께
          고려해 주세요.
        </p>
        <p>
          건강, 투자, 법률, 중대한 결정에 대한 확정적 판단으로 사용하지 마세요.
        </p>
      </section>
    </div>
  );
}

export default SajuInsightPage;
