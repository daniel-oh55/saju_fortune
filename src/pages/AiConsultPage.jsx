function AiConsultPage({ profile, fortune }) {
  const sampleQuestions = [
    '오늘 중요한 결정을 해도 괜찮을까요?',
    '연애운을 더 좋게 만드는 행동은 무엇인가요?',
    '이번 주 금전 관리에서 조심할 점은 무엇인가요?',
  ];

  return (
    <div className="page-stack">
      <section className="section-header">
        <p className="eyebrow">준비 중</p>
        <h1>AI 상담</h1>
        <p>{profile.nickname}님의 오늘 운세 데이터를 바탕으로 상담하는 화면입니다.</p>
      </section>

      <section className="consult-panel">
        <div className="chat-bubble bot">
          오늘 평균 운세 점수는 {fortune.averageScore}점입니다. 실제 AI API 연결 전까지는 상담
          흐름과 데이터 구조만 확인할 수 있습니다.
        </div>
        <div className="question-list">
          {sampleQuestions.map((question) => (
            <button key={question} type="button">
              {question}
            </button>
          ))}
        </div>
        <textarea placeholder="상담하고 싶은 내용을 입력하세요." rows="4" />
        <button className="primary-button full-width" type="button" disabled>
          추후 AI 상담 연결 예정
        </button>
      </section>
    </div>
  );
}

export default AiConsultPage;
