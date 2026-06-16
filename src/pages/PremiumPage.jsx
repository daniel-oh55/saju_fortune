function PremiumPage() {
  const benefits = [
    '광고 시청 후 더 깊은 상세 풀이',
    '주간·월간 운세 리포트 준비',
    'AI 상담 질문 추가 기능 준비',
    '궁합 상세 리포트 저장 기능 준비',
  ];

  return (
    <div className="page-stack">
      <section className="premium-hero">
        <p className="eyebrow">Coming Soon</p>
        <h1>더 깊은 풀이 기능을 준비하고 있어요</h1>
        <p>
          현재 하루풀리는 무료 사용을 우선으로 합니다. 결제나 구독 기능은 추후 사용자 의견과
          서비스 규모를 보며 검토할 예정입니다.
        </p>
      </section>

      <section className="pricing-card">
        <span>준비 중인 기능</span>
        <strong>무료 우선</strong>
        <p>상세 풀이, 확장 리포트, AI 상담 기능은 광고 해금 구조를 중심으로 먼저 검토합니다.</p>
        <button className="primary-button full-width" type="button" disabled>
          추후 제공 예정
        </button>
      </section>

      <section className="benefit-list">
        {benefits.map((benefit) => (
          <div key={benefit}>{benefit}</div>
        ))}
      </section>
    </div>
  );
}

export default PremiumPage;
