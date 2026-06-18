import MountainOrbitIllustration from '../components/MountainOrbitIllustration.jsx';

function AiConsultPage({ profile, fortune }) {
  const sampleQuestions = [
    '오늘 중요한 결정을 해도 괜찮을까요?',
    '관계에서 어떤 점을 조심하면 좋을까요?',
    '이번 주 돈 관리에서 점검할 부분은 무엇인가요?',
  ];

  return (
    <div className="page-stack ai-consult-page">
      <section className="ai-consult-hero">
        <div>
          <p className="eyebrow">준비 중</p>
          <h1>AI 상담</h1>
          <p>
            궁금한 고민이 있다면 편하게 물어보세요. 오늘의 흐름을 바탕으로 생각을 정리하는
            참고용 조언을 드릴게요.
          </p>
        </div>
        <span aria-hidden="true">✦</span>
        <MountainOrbitIllustration size="small" className="ai-consult-artwork" opacity={0.56} />
      </section>

      <section className="consult-panel">
        <div className="chat-bubble bot">
          {profile.nickname}님의 오늘 평균 운세 점수는 {fortune.averageScore}점입니다. 실제 AI
          API 연결 전까지는 상담 흐름과 데이터 구조만 확인할 수 있습니다. AI 상담은 참고용
          조언이며 전문가 상담을 대체하지 않습니다.
        </div>
        <div className="question-list">
          {sampleQuestions.map((question) => (
            <button key={question} type="button">
              {question}
            </button>
          ))}
        </div>
        <textarea placeholder="궁금한 고민을 편하게 적어보세요." rows="4" />
        <button className="primary-button full-width" type="button" disabled>
          AI 상담 기능 준비 중
        </button>
      </section>
    </div>
  );
}

export default AiConsultPage;
