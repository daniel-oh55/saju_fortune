function takeItems(items, count = 3) {
  return Array.isArray(items) ? items.filter(Boolean).slice(0, count) : [];
}

function buildRoutineSteps(sajuAnalysis) {
  const elements = sajuAnalysis?.elements || {};
  const luckyKeywords = takeItems(sajuAnalysis?.luckyKeywords, 3);
  const traits = takeItems(sajuAnalysis?.traits, 3);
  const weakPoints = takeItems(sajuAnalysis?.weakPoints, 2);
  const dominant = elements.dominant || '중심 기운';
  const weak = elements.weak || '보완 기운';
  const morningKeyword = luckyKeywords[0] || '정리';
  const afternoonKeyword = luckyKeywords[1] || traits[0] || '균형';
  const eveningKeyword = luckyKeywords[2] || weakPoints[0] || '휴식';

  return [
    {
      time: '오전',
      title: `${morningKeyword}으로 시작하기`,
      text: `오늘의 키워드인 ${morningKeyword}을 기준으로 해야 할 일을 한 가지 먼저 정리해보세요.`,
    },
    {
      time: '오후',
      title: `${dominant} 흐름 살피기`,
      text: `대화나 업무는 속도를 조금 늦추고 ${afternoonKeyword}을 살펴보면 도움이 될 수 있습니다.`,
    },
    {
      time: '저녁',
      title: `${weak} 기운 보완하기`,
      text: `하루를 마무리하며 지출, 약속, ${eveningKeyword}을 가볍게 점검해보세요.`,
    },
  ];
}

function DailyRoutineCard({ sajuAnalysis, onOpenDetail }) {
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
          <article className="daily-routine-item" key={step.time}>
            <span className="daily-routine-time">{step.time}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </div>
          </article>
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
