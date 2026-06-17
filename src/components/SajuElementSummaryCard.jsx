import { useState } from 'react';

const ELEMENT_LABELS = {
  화: '화(火)',
  수: '수(水)',
  목: '목(木)',
  금: '금(金)',
  토: '토(土)',
};

function takeItems(items, count = 3) {
  return Array.isArray(items) ? items.filter(Boolean).slice(0, count) : [];
}

function labelElement(value) {
  if (!value) return '확인 중';
  return String(value)
    .split('/')
    .map((item) => ELEMENT_LABELS[item.trim()] || item.trim())
    .join(' / ');
}

function SajuElementSummaryCard({ sajuAnalysis, onOpenDetail }) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  if (!sajuAnalysis?.elements) return null;

  const { elements } = sajuAnalysis;
  const traits = takeItems(sajuAnalysis.traits);
  const luckyKeywords = takeItems(sajuAnalysis.luckyKeywords);

  return (
    <section className="saju-element-summary-card">
      <div className="saju-element-head">
        <div>
          <p className="eyebrow">Saju Flow</p>
          <h2>나의 사주 흐름</h2>
        </div>
        <button
          className="saju-info-button"
          type="button"
          onClick={() => setIsGuideOpen(true)}
          aria-label="나의 사주 흐름 설명 보기"
        >
          ?
        </button>
      </div>

      <div className="saju-element-pair-grid">
        <div>
          <span>중심 기운</span>
          <strong>{labelElement(elements.dominant)}</strong>
        </div>
        <div>
          <span>보완하면 좋은 기운</span>
          <strong>{labelElement(elements.weak)}</strong>
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

      {isGuideOpen && (
        <div className="home-modal-backdrop" role="presentation">
          <section className="home-bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="saju-flow-guide-title">
            <div className="home-modal-head">
              <div>
                <p className="eyebrow">Guide</p>
                <h2 id="saju-flow-guide-title">나의 사주 흐름이란?</h2>
              </div>
              <button type="button" onClick={() => setIsGuideOpen(false)} aria-label="나의 사주 흐름 설명 닫기">
                ×
              </button>
            </div>
            <div className="saju-flow-guide-copy">
              <p>
                나의 사주 흐름은 타고난 성향과 오늘의 운세 흐름을 바탕으로, 하루 안에서 어떤
                기운이 조금 더 두드러지는지 참고할 수 있도록 정리한 내용입니다.
              </p>
              <p>
                절대적인 판단이 아니라 오늘의 방향을 부드럽게 살펴보는 참고 정보로 활용해보세요.
                마음, 일정, 관계의 균형을 잡는 작은 힌트로 보면 가장 편안합니다.
              </p>
            </div>
            <button className="primary-button full-width" type="button" onClick={() => setIsGuideOpen(false)}>
              확인했어요
            </button>
          </section>
        </div>
      )}
    </section>
  );
}

export default SajuElementSummaryCard;
