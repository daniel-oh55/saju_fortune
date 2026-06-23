import { useState } from 'react';
import {
  displayFiveElementText,
  getElementsFromText,
  getFiveElementInfo,
} from '../utils/fiveElementsInfo.js';

function takeItems(items, count = 3) {
  return Array.isArray(items) ? items.filter(Boolean).slice(0, count) : [];
}

function buildElementHelp(kind, value) {
  const elements = getElementsFromText(value);
  const infos = elements.map((element) => getFiveElementInfo(element)).filter(Boolean);
  const label = displayFiveElementText(value);

  if (infos.length === 0) {
    return {
      title: kind === 'dominant' ? '중심 기운' : '보완하면 좋은 기운',
      label,
      description: '아직 확인 중인 기운입니다. 오늘의 흐름을 가볍게 참고해 주세요.',
      tip: '무리하게 해석하기보다 하루의 리듬을 천천히 살펴보세요.',
    };
  }

  if (kind === 'dominant') {
    const summaries = infos.map((info) => info.summary.split(', ')[0]).join('과 ');
    return {
      title: '중심 기운',
      label,
      description: `${label}가 중심 기운이라는 뜻은, ${summaries}의 흐름이 기본 성향에서 비교적 잘 드러난다는 의미입니다. 오늘은 이 기운을 기준으로 일정과 관계의 균형을 함께 살펴보면 좋습니다.`,
      tip: infos.map((info) => info.balanceTip).join(' '),
    };
  }

  return {
    title: '보완하면 좋은 기운',
    label,
    description: `${label} 기운을 보완한다는 것은 부족함을 단정하는 뜻이 아니라, 하루의 균형을 위해 의식적으로 챙겨보면 좋은 방향을 살펴본다는 의미입니다.`,
    tip: infos.map((info) => info.balanceTip).join(' '),
  };
}

function SajuElementSummaryCard({ sajuAnalysis, onOpenDetail }) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeElementHelp, setActiveElementHelp] = useState(null);

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
        <button
          className="saju-element-help-trigger"
          type="button"
          onClick={() => setActiveElementHelp(buildElementHelp('dominant', elements.dominant))}
        >
          <span>중심 기운</span>
          <strong>{displayFiveElementText(elements.dominant)}</strong>
          <small>눌러서 의미 보기</small>
        </button>
        <button
          className="saju-element-help-trigger"
          type="button"
          onClick={() => setActiveElementHelp(buildElementHelp('weak', elements.weak))}
        >
          <span>보완하면 좋은 기운</span>
          <strong>{displayFiveElementText(elements.weak)}</strong>
          <small>눌러서 행동 팁 보기</small>
        </button>
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

      {activeElementHelp && (
        <div className="home-modal-backdrop" role="presentation">
          <section className="home-bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="saju-element-help-title">
            <div className="home-modal-head">
              <div>
                <p className="eyebrow">Five Elements</p>
                <h2 id="saju-element-help-title">{activeElementHelp.title}</h2>
              </div>
              <button type="button" onClick={() => setActiveElementHelp(null)} aria-label="오행 설명 닫기">
                ×
              </button>
            </div>
            <div className="saju-flow-guide-copy">
              <p>
                <strong>{activeElementHelp.label}</strong>
              </p>
              <p>{activeElementHelp.description}</p>
              <p>{activeElementHelp.tip}</p>
            </div>
            <button className="primary-button full-width" type="button" onClick={() => setActiveElementHelp(null)}>
              확인했어요
            </button>
          </section>
        </div>
      )}
    </section>
  );
}

export default SajuElementSummaryCard;
