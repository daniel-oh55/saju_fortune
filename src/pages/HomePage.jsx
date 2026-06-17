import DailyRoutineCard from '../components/DailyRoutineCard.jsx';
import ContentSafetyNotice from '../components/ContentSafetyNotice.jsx';
import FortuneCard from '../components/FortuneCard.jsx';
import PrivacyInfoLinkCard from '../components/PrivacyInfoLinkCard.jsx';
import SajuElementSummaryCard from '../components/SajuElementSummaryCard.jsx';
import SavedReadingsSummaryCard from '../components/SavedReadingsSummaryCard.jsx';
import ScoreDonut from '../components/ScoreDonut.jsx';
import VisitStreakCard from '../components/VisitStreakCard.jsx';

function getTimeFortune() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return {
      label: '아침',
      title: '천천히 시동을 걸기 좋은 시간',
      text: '해야 할 일을 작게 나누어두면 하루가 차분하고 편안하게 시작됩니다.',
    };
  }

  if (hour < 18) {
    return {
      label: '오후',
      title: '정리와 확인에 어울리는 시간',
      text: '중요한 메시지나 약속을 한 번 더 확인하면 안정감이 커집니다.',
    };
  }

  if (hour < 22) {
    return {
      label: '저녁',
      title: '속도를 낮추고 균형을 챙길 시간',
      text: '가벼운 정리와 짧은 휴식이 내일의 리듬을 편안하게 만듭니다.',
    };
  }

  return {
    label: '밤',
    title: '마음을 차분히 가라앉힐 시간',
    text: '오늘 해낸 일을 하나 떠올리며 하루를 부드럽게 마무리해보세요.',
  };
}

function HomePage({ fortune, profile, savedReadings, visitStreak, onOpenDetail, onNavigate }) {
  const overall = fortune.categories.find((category) => category.id === 'overall') || fortune.categories[0];
  const recentSavedReading = Array.isArray(savedReadings?.items) ? savedReadings.items[0] : null;
  const timeFortune = getTimeFortune();

  const quickMenuItems = [
    { id: 'today', label: '오늘운세', icon: '☾', onClick: () => onOpenDetail('overall') },
    { id: 'saju', label: '정통사주', icon: '✦', onClick: () => onNavigate('sajuInsight') },
    { id: 'money', label: '재물운', icon: '◇', onClick: () => onOpenDetail('money') },
    { id: 'love', label: '연애운', icon: '♡', onClick: () => onOpenDetail('love') },
    { id: 'compatibility', label: '궁합', icon: '⌁', onClick: () => onNavigate('compatibility') },
    { id: 'saved', label: '저장한 풀이', icon: '✧', onClick: () => onNavigate('savedReadings') },
  ];

  return (
    <div className="page-stack home-page home-diary-theme">
      <header className="home-topbar" aria-label="하루풀이 홈">
        <div>
          <strong>하루풀이</strong>
          <span>오늘의 흐름을 차분히 읽어보세요</span>
        </div>
        <button type="button" onClick={() => onNavigate('settings')}>
          {profile.nickname}
        </button>
      </header>

      <section className="home-diary-hero" aria-labelledby="home-hero-title">
        <div className="hero-orbit" aria-hidden="true">
          <span className="hero-moon" />
          <span className="hero-star hero-star-one" />
          <span className="hero-star hero-star-two" />
          <span className="hero-mountain" />
        </div>
        <p className="eyebrow">고요한 밤의 운세 다이어리</p>
        <h1 id="home-hero-title">오늘의 흐름을 차분히 읽어보세요</h1>
        <p>내 하루의 기운을 가볍게 확인하고, 지금 필요한 작은 방향을 찾아보세요.</p>
        <div className="home-hero-actions">
          <button className="primary-button" type="button" onClick={() => onNavigate('settings')}>
            내 사주 입력하기
          </button>
          <button className="ghost-button" type="button" onClick={() => onOpenDetail('overall')}>
            오늘 운세 보기
          </button>
        </div>
      </section>

      <section className="home-score-diary-card">
        <div className="home-score-copy">
          <p className="eyebrow">오늘의 흐름</p>
          <h2>{fortune.keyword}</h2>
          <p>{fortune.greeting}</p>
        </div>
        <ScoreDonut score={fortune.averageScore} />
      </section>

      <section className="home-menu-section" aria-labelledby="home-quick-menu-title">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Quick Menu</p>
            <h2 id="home-quick-menu-title">빠른 메뉴</h2>
          </div>
        </div>
        <div className="home-menu-grid home-menu-grid-v2">
          {quickMenuItems.map((item) => (
            <button key={item.id} type="button" onClick={item.onClick}>
              <span aria-hidden="true">{item.icon}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="home-trust-card">
        <span aria-hidden="true">✦</span>
        <div>
          <h2>입력 정보는 현재 기기 안에서만 사용됩니다.</h2>
          <p>하루풀이는 서버 DB와 로그인 없이 이용할 수 있으며, 입력한 정보는 운세 참고 콘텐츠를 보여주는 데 사용됩니다.</p>
        </div>
      </section>

      <SajuElementSummaryCard
        sajuAnalysis={fortune.sajuAnalysis}
        onOpenDetail={() => onNavigate('sajuInsight')}
      />

      <DailyRoutineCard
        sajuAnalysis={fortune.sajuAnalysis}
        onOpenDetail={() => onNavigate('sajuInsight')}
      />

      <VisitStreakCard streak={visitStreak} />

      <section className="today-summary-card today-line-card">
        <p className="eyebrow">오늘의 한 줄 풀이</p>
        <h2>{overall.summary}</h2>
        <p>좋은 흐름은 살리고, 조심할 부분은 차분히 살펴보세요.</p>
      </section>

      <section className="recent-reading-card">
        <div>
          <p className="eyebrow">최근 본 풀이</p>
          <h2>{recentSavedReading ? recentSavedReading.title : '아직 저장한 풀이가 없습니다'}</h2>
          <p>
            {recentSavedReading
              ? '저장한 풀이에서 다시 확인할 수 있습니다.'
              : '마음에 드는 풀이를 저장하면 이곳에서 이어서 확인할 수 있습니다.'}
          </p>
        </div>
        <button className="ghost-button" type="button" onClick={() => onNavigate('savedReadings')}>
          저장한 풀이 보기
        </button>
      </section>

      <SavedReadingsSummaryCard
        savedReadings={savedReadings}
        onOpenSavedReadings={() => onNavigate('savedReadings')}
      />

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

      <section className="home-ad-placeholder" aria-label="광고 영역">
        <span>광고 영역</span>
        <p>향후 광고가 표시될 수 있습니다.</p>
      </section>

      <section className="zodiac-link-card">
        <div>
          <p className="eyebrow">띠별 운세</p>
          <h2>태어난 해로 보는 오늘의 흐름</h2>
          <p>가볍게 참고할 수 있는 띠별 운세도 함께 확인해보세요.</p>
        </div>
        <button className="ghost-button" type="button" onClick={() => onNavigate('zodiac')}>
          띠별 보기
        </button>
      </section>

      <ContentSafetyNotice variant="general" compact />
      <PrivacyInfoLinkCard onOpen={() => onNavigate('privacyInfo')} />
    </div>
  );
}

export default HomePage;
