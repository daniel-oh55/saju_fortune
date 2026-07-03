import { useState } from 'react';

const ELEMENT_MEANINGS = {
  화: { label: '화(火)', plain: '추진력과 표현이 살아나는 기운', action: '짧게 몸을 움직이고 오늘 꼭 전할 말을 한 문장으로 정리해보세요.' },
  수: { label: '수(水)', plain: '생각을 정리하고 흐름을 살피는 기운', action: '잠깐 숨을 고르고 마음에 남은 생각을 메모해보세요.' },
  목: { label: '목(木)', plain: '성장과 시작을 돕는 기운', action: '새로 시작할 일을 작게 나누고 첫 단계만 가볍게 실행해보세요.' },
  금: { label: '금(金)', plain: '기준을 세우고 정돈하는 기운', action: '할 일을 세 가지로 줄이고 먼저 끝낼 순서를 정해보세요.' },
  토: { label: '토(土)', plain: '균형을 잡고 기반을 다지는 기운', action: '식사, 휴식, 주변 정리처럼 기본 리듬을 하나 챙겨보세요.' },
};

function takeItems(items, count = 3) {
  return Array.isArray(items) ? items.filter(Boolean).slice(0, count) : [];
}

function getElementMeaning(value) {
  const firstElement = String(value || '')
    .split('/')
    .map((item) => item.trim())
    .find((item) => ELEMENT_MEANINGS[item]);

  return ELEMENT_MEANINGS[firstElement] || {
    label: value || '오늘의 흐름',
    plain: '하루의 균형',
    action: '오늘 해야 할 일을 작게 나누고 부담 없는 것부터 시작해보세요.',
  };
}

function buildRoutineSteps(sajuAnalysis) {
  const elements = sajuAnalysis?.elements || {};
  const luckyKeywords = takeItems(sajuAnalysis?.luckyKeywords, 3);
  const traits = takeItems(sajuAnalysis?.traits, 3);
  const weakPoints = takeItems(sajuAnalysis?.weakPoints, 2);
  const dominant = elements.dominant || '중심 기운';
  const weak = elements.weak || '보완 기운';
  const dominantMeaning = getElementMeaning(dominant);
  const weakMeaning = getElementMeaning(weak);
  const morningKeyword = luckyKeywords[0] || '정리';
  const afternoonKeyword = luckyKeywords[1] || traits[0] || '균형';
  const eveningKeyword = luckyKeywords[2] || weakPoints[0] || '휴식';

  return [
    {
      time: '오전',
      title: `${morningKeyword} 한 가지로 시작하기`,
      text: `오늘의 시작 에너지를 정돈하도록 ${morningKeyword}과 관련된 작은 일을 하나만 먼저 골라보세요.`,
      detail: `${dominantMeaning.label}은 쉽게 말하면 ${dominantMeaning.plain}의 흐름입니다. ${dominantMeaning.action}`,
    },
    {
      time: '오후',
      title: `집중과 관계 이어가기`,
      text: `오후에는 ${afternoonKeyword}을 떠올리며 대화와 할 일을 차분히 이어가보세요.`,
      detail: `바쁜 시간대에는 속도를 올리기보다 한 번 더 확인하는 태도가 도움이 됩니다. 메시지, 약속, 할 일의 우선순위를 짧게 정리해보세요.`,
    },
    {
      time: '저녁',
      title: `${weakMeaning.plain} 챙기기`,
      text: `저녁에는 ${eveningKeyword}을 가볍게 돌아보며 마음과 주변을 정리해보세요.`,
      detail: `${weakMeaning.label}은 오늘 조금 더 보완하면 좋은 흐름입니다. ${weakMeaning.action}`,
    },
  ];
}

function DailyRoutineCard({ sajuAnalysis, onOpenDetail }) {
  const [activeStepTime, setActiveStepTime] = useState('오전');
  const steps = buildRoutineSteps(sajuAnalysis);
  const keywords = [
    ...takeItems(sajuAnalysis?.luckyKeywords, 2),
    ...takeItems(sajuAnalysis?.traits, 1),
  ].slice(0, 3);
  const balanceHint =
    sajuAnalysis?.elements?.balanceHint || '오늘의 흐름을 가볍게 정리해볼 수 있는 실천 가이드입니다.';

  return (
    <section className="daily-routine-card">
      <div className="daily-routine-header">
        <div>
          <p className="eyebrow">Daily Routine</p>
          <h2>오늘의 작은 루틴</h2>
        </div>
        {keywords.length > 0 && (
          <div className="daily-routine-keywords">
            {keywords.map((keyword, index) => (
              <span key={`${keyword}-${index}`}>{keyword}</span>
            ))}
          </div>
        )}
      </div>

      <p className="daily-routine-copy">{balanceHint}</p>

      <div className="daily-routine-list">
        {steps.map((step) => (
          <button
            className={`daily-routine-item${activeStepTime === step.time ? ' is-active' : ''}`}
            key={step.time}
            type="button"
            onClick={() => setActiveStepTime((current) => (current === step.time ? '' : step.time))}
            aria-expanded={activeStepTime === step.time}
          >
            <span className="daily-routine-time">{step.time}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
              {activeStepTime === step.time && <p className="daily-routine-detail">{step.detail}</p>}
            </div>
          </button>
        ))}
      </div>

      {onOpenDetail && (
        <button className="ghost-button full-width" type="button" onClick={onOpenDetail}>
          사주 흐름 자세히 보기
        </button>
      )}
    </section>
  );
}

export default DailyRoutineCard;
