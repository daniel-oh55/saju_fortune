import FortuneCard from '../components/FortuneCard.jsx';
import SajuElementSummaryCard from '../components/SajuElementSummaryCard.jsx';
import ScoreDonut from '../components/ScoreDonut.jsx';

function getTimeFortune() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return {
      label: '오전',
      title: '천천히 시동을 걸기 좋은 시간',
      text: '해야 할 일을 작게 나누어두면 하루가 한결 편안하게 시작됩니다.',
    };
  }

  if (hour < 18) {
    return {
      label: '오후',
      title: '정리와 확인이 흐름을 살리는 시간',
      text: '중요한 메시지나 약속은 한 번 더 확인하면 도움이 됩니다.',
    };
  }

  if (hour < 22) {
    return {
      label: '저녁',
      title: '속도를 낮추고 회복을 챙길 시간',
      text: '가벼운 정리나 짧은 휴식이 내일의 리듬을 편안하게 만듭니다.',
    };
  }

  return {
    label: '밤',
    title: '마음을 차분히 가라앉힐 시간',
    text: '오늘 잘한 일을 하나 떠올리며 하루를 부드럽게 마무리해보세요.',
  };
}

function HomePage({ fortune, profile, onOpenDetail, onNavigate }) {
  const overall = fortune.categories.find((category) => category.id === 'overall') || fortune.categories[0];
  const money = fortune.categories.find((category) => category.id === 'money');
  const love = fortune.categories.find((category) => category.id === 'love');
  const work = fortune.categories.find((category) => category.id === 'work');
  const study = fortune.categories.find((category) => category.id === 'study');
  const health = fortune.categories.find((category) => category.id === 'health');
  const timeFortune = getTimeFortune();
  const quickItems = [money, love, work, study, health].filter(Boolean);

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
        <p className="eyebrow">오늘의 점수</p>
        <div className="score-hero-main">
          <ScoreDonut score={fortune.averageScore} />
          <div className="score-hero-copy">
            <h1>{fortune.keyword}</h1>
            <p>{fortune.greeting}</p>
          </div>
        </div>
        <button className="primary-button full-width" type="button" onClick={() => onNavigate('fortune')}>
          오늘운세 자세히 보기
        </button>
      </section>

      <SajuElementSummaryCard sajuAnalysis={fortune.sajuAnalysis} />

      <section className="today-summary-card">
        <p className="eyebrow">한 줄 요약</p>
        <h2>{overall.summary}</h2>
        <p>좋은 흐름은 살리고, 조심할 부분은 차분히 점검해보세요.</p>
      </section>

      <section className="section-title-row">
        <div>
          <p className="eyebrow">Quick Summary</p>
          <h2>오늘의 운세 요약</h2>
        </div>
      </section>

      <section className="fortune-grid">
        {fortune.categories.map((category) => (
          <FortuneCard key={category.id} category={category} onOpenDetail={onOpenDetail} />
        ))}
      </section>

      <section className="fortune-flow-card">
        <p className="eyebrow">오늘의 운세 흐름</p>
        <div className="flow-list">
          {fortune.categories.map((category) => (
            <div key={category.id} className="flow-item">
              <span>{category.label}</span>
              <div className="score-bar">
                <span style={{ width: `${category.score}%` }} />
              </div>
              <strong>{category.score}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="time-fortune-card">
        <div>
          <p className="eyebrow">{timeFortune.label} 운세</p>
          <h2>{timeFortune.title}</h2>
          <p>{timeFortune.text}</p>
        </div>
      </section>

      <section className="lucky-grid">
        <div>
          <span>행운 색상</span>
          <strong>{overall.luckyColor}</strong>
        </div>
        <div>
          <span>행운 아이템</span>
          <strong>{overall.luckyItem}</strong>
        </div>
        <div>
          <span>오늘 키워드</span>
          <strong>{fortune.keyword}</strong>
        </div>
      </section>

      <section className="home-action-grid">
        {quickItems.map((category) => (
          <button key={category.id} type="button" onClick={() => onOpenDetail(category.id)}>
            {category.label} 상세
          </button>
        ))}
        <button type="button" onClick={() => onNavigate('compatibility')}>
          궁합 보기
        </button>
        <button type="button" onClick={() => onNavigate('ai')}>
          AI상담
        </button>
      </section>

      <section className="zodiac-link-card">
        <div>
          <p className="eyebrow">띠별 운세</p>
          <h2>태어난 해로 보는 오늘의 흐름</h2>
          <p>1948년부터 2019년까지 태어난 해를 선택해 가볍게 확인할 수 있어요.</p>
        </div>
        <button className="ghost-button" type="button" onClick={() => onNavigate('zodiac')}>
          띠별 보기
        </button>
      </section>
    </div>
  );
}

export default HomePage;
