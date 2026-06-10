import AdRewardBox from '../components/AdRewardBox.jsx';
import SajuCalculationBasisCard from '../components/SajuCalculationBasisCard.jsx';
import { REWARDED_AD_PLACEMENTS } from '../config/rewardedAdPlacements.js';

const SAJU_INSIGHT_DEEP_UNLOCK_KEY = 'sajuInsightDeepDive';

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

function buildDeepDiveSections(sajuAnalysis) {
  const elements = sajuAnalysis?.elements || {};
  const traits = toItems(sajuAnalysis?.traits, 2);
  const weakPoints = toItems(sajuAnalysis?.weakPoints, 2);
  const luckyKeywords = toItems(sajuAnalysis?.luckyKeywords, 3);
  const dominant = elements.dominant || '중심 기운';
  const weak = elements.weak || '보완 기운';
  const keywordText = luckyKeywords.length > 0 ? luckyKeywords.join(', ') : '정리와 균형';
  const traitText = traits.length > 0 ? traits.join(', ') : '차분한 관찰';
  const weakPointText = weakPoints.length > 0 ? weakPoints.join(', ') : '작은 루틴';

  return [
    {
      title: '중심 기운 활용법',
      text: `중심에 놓인 ${dominant} 흐름은 오늘의 선택을 정리하는 기준으로 살펴볼 수 있습니다. ${traitText}의 장점을 가볍게 떠올리면 일정이나 관계의 우선순위를 잡는 데 도움이 될 수 있습니다.`,
    },
    {
      title: '보완 기운 관리법',
      text: `보완하면 좋은 ${weak} 기운은 무리하게 채우기보다 작은 루틴으로 다뤄보면 좋습니다. ${weakPointText}을 한 번 더 살피면 하루의 균형을 부드럽게 맞추는 데 도움이 될 수 있습니다.`,
    },
    {
      title: '오늘의 실행 루틴',
      text: `오늘은 ${keywordText}를 중심으로 일정을 정리해보세요. 해야 할 일을 작게 나누고, 마무리할 수 있는 것부터 차분히 정리하는 흐름이 잘 맞을 수 있습니다.`,
    },
    {
      title: '관계와 일상 힌트',
      text: `${traitText}의 흐름을 살리되 표현은 조금 부드럽게 조절해보세요. 대화의 온도를 낮추고 확인하는 시간을 두면 관계나 일상에서 부담을 줄이는 데 도움이 될 수 있습니다.`,
    },
  ];
}

function SajuInsightPage({
  profile,
  fortune,
  unlockedDetails = {},
  onUnlockDetail,
  onNavigate,
}) {
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
  const isDeepDiveUnlocked = Boolean(unlockedDetails[SAJU_INSIGHT_DEEP_UNLOCK_KEY]?.unlocked);
  const deepDiveSections = buildDeepDiveSections(sajuAnalysis);

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

      {isDeepDiveUnlocked ? (
        <section className="saju-insight-section saju-insight-deep-dive">
          <h2>심화 해석</h2>
          <div className="saju-deep-dive-list">
            {deepDiveSections.map((section) => (
              <article className="saju-deep-dive-item" key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="saju-insight-section saju-insight-locked">
          <h2>심화 해석</h2>
          <p>
            오행 균형과 오늘의 활용 키워드를 조금 더 자세히 풀어볼 수 있습니다. 광고 시청 후
            심화 해석을 열람할 수 있어요.
          </p>
          {onUnlockDetail && (
            <AdRewardBox
              categoryLabel="사주 심화 해석"
              placementId={REWARDED_AD_PLACEMENTS.SAJU_INSIGHT_DEEP_DIVE}
              isUnlocked={false}
              onUnlock={() => onUnlockDetail(SAJU_INSIGHT_DEEP_UNLOCK_KEY)}
              buttonLabel="광고 보고 심화 해석 보기"
            />
          )}
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
