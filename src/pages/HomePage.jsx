import FortuneCard from '../components/FortuneCard.jsx';

function HomePage({ fortune, profile, onOpenDetail, onNavigate }) {
  const menuItems = [
    { label: '오늘운세', icon: '☼', action: () => onNavigate('fortune') },
    { label: '2026운세', icon: '2026', action: () => onNavigate('year') },
    { label: '재물운', icon: '₩', action: () => onOpenDetail('money') },
    { label: '연애운', icon: '♡', action: () => onOpenDetail('love') },
    { label: '직장운', icon: '↗', action: () => onOpenDetail('work') },
    { label: '건강운', icon: '+', action: () => onOpenDetail('health') },
    { label: '궁합', icon: '∞', action: () => onNavigate('compatibility') },
    { label: 'AI상담', icon: 'AI', action: () => onNavigate('ai') },
  ];

  return (
    <div className="page-stack home-page">
      <header className="mobile-appbar">
        <div>
          <strong>하루풀이</strong>
          <span>{fortune.dateKey}</span>
        </div>
        <button type="button" onClick={() => onNavigate('settings')}>
          {profile.nickname}
        </button>
      </header>

      <section className="score-hero-card">
        <p className="eyebrow">오늘의 흐름</p>
        <div className="score-hero-main">
          <div>
            <h1>{fortune.averageScore}점</h1>
            <p>오늘 하루, 어떤 흐름이 기다리고 있을까요? 하루풀이가 따뜻하게 풀어드릴게요.</p>
          </div>
          <span>{fortune.keyword}</span>
        </div>
        <button className="primary-button full-width" type="button" onClick={() => onNavigate('fortune')}>
          오늘운세 자세히 보기
        </button>
      </section>

      <section className="home-menu-grid" aria-label="운세 메뉴">
        {menuItems.map((item) => (
          <button key={item.label} type="button" onClick={item.action}>
            <span>{item.icon}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </section>

      <section className="recommend-card">
        <div>
          <p className="eyebrow">추천 풀이</p>
          <h2>2026년의 큰 흐름을 부담 없이 미리 살펴보세요</h2>
          <p>{fortune.sajuAnalysis.traits[0]} 성향을 바탕으로 한 해의 방향을 정리했어요.</p>
        </div>
        <button className="ghost-button" type="button" onClick={() => onNavigate('year')}>
          보기
        </button>
      </section>

      <section className="section-title-row">
        <div>
          <p className="eyebrow">Free Summary</p>
          <h2>오늘의 운세 요약</h2>
        </div>
      </section>

      <section className="fortune-grid">
        {fortune.categories.map((category) => (
          <FortuneCard key={category.id} category={category} onOpenDetail={onOpenDetail} />
        ))}
      </section>
    </div>
  );
}

export default HomePage;
