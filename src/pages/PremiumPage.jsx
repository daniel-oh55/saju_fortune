function PremiumPage() {
  const benefits = [
    '광고 없이 상세 운세 열람',
    '주간·월간 운세 리포트',
    'AI 상담 질문 추가 제공',
    '궁합 상세 리포트 저장',
  ];

  return (
    <div className="page-stack">
      <section className="premium-hero">
        <p className="eyebrow">Premium</p>
        <h1>더 깊은 해석을 원하는 사용자를 위한 구독 안내</h1>
        <p>실제 결제 SDK는 추후 연결하고, 현재는 수익화 화면 흐름을 검증합니다.</p>
      </section>

      <section className="pricing-card">
        <span>월 구독 예상가</span>
        <strong>₩4,900</strong>
        <p>광고 제거와 확장 리포트를 포함하는 MVP 상품안입니다.</p>
        <button className="primary-button full-width" type="button" disabled>
          결제 연동 예정
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
