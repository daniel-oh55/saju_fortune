import { useEffect, useMemo, useState } from 'react';
import DailyRoutineCard from '../components/DailyRoutineCard.jsx';
import ContentSafetyNotice from '../components/ContentSafetyNotice.jsx';
import FortuneCard from '../components/FortuneCard.jsx';
import MountainOrbitIllustration from '../components/MountainOrbitIllustration.jsx';
import PrivacyInfoLinkCard from '../components/PrivacyInfoLinkCard.jsx';
import SajuElementSummaryCard from '../components/SajuElementSummaryCard.jsx';
import SavedReadingsSummaryCard from '../components/SavedReadingsSummaryCard.jsx';
import ScoreDonut from '../components/ScoreDonut.jsx';
import VisitStreakCard from '../components/VisitStreakCard.jsx';

const QUICK_MENU_PREFS_KEY = 'harupuli_home_quick_menu_prefs';
const MAX_HOME_QUICK_MENU_ITEMS = 4;
const DEFAULT_QUICK_MENU_IDS = ['today', 'saju', 'money', 'love'];
const TODAY_FORTUNE_CATEGORY_IDS = ['overall', 'money', 'love', 'work', 'study', 'health'];
const ELEMENT_DISPLAY_MAP = {
  화: '화(火)',
  수: '수(水)',
  목: '목(木)',
  금: '금(金)',
  토: '토(土)',
};
const WEEKDAY_LABELS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function formatElementDisplayText(text) {
  return String(text || '').replace(/(화|수|목|금|토)(?=\s*(균형|정리|기운)|$)/g, (element) => ELEMENT_DISPLAY_MAP[element]);
}

function formatKoreanDate(dateKey) {
  const [year, month, day] = String(dateKey || '').split('-').map(Number);
  if (!year || !month || !day) return '';

  const weekday = WEEKDAY_LABELS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${year}년 ${month}월 ${day}일 ${weekday}`;
}

function readQuickMenuPrefs() {
  if (typeof window === 'undefined') return DEFAULT_QUICK_MENU_IDS;

  try {
    const saved = JSON.parse(window.localStorage.getItem(QUICK_MENU_PREFS_KEY));
    return Array.isArray(saved) ? saved : DEFAULT_QUICK_MENU_IDS;
  } catch {
    return DEFAULT_QUICK_MENU_IDS;
  }
}

function writeQuickMenuPrefs(menuIds) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(QUICK_MENU_PREFS_KEY, JSON.stringify(menuIds));
}

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
  const [quickMenuPrefs, setQuickMenuPrefs] = useState(() => readQuickMenuPrefs());
  const [isQuickMenuEditorOpen, setIsQuickMenuEditorOpen] = useState(false);
  const [quickMenuMessage, setQuickMenuMessage] = useState('');
  const overall = fortune.categories.find((category) => category.id === 'overall') || fortune.categories[0];
  const recentSavedReading = Array.isArray(savedReadings?.items) ? savedReadings.items[0] : null;
  const timeFortune = getTimeFortune();
  const todayFlowDate = formatKoreanDate(fortune.dateKey);
  const todayKeyword = formatElementDisplayText(fortune.keyword);
  const todayFortuneCategories = useMemo(() => {
    const categoryMap = new Map(fortune.categories.map((category) => [category.id, category]));
    const orderedCategories = TODAY_FORTUNE_CATEGORY_IDS.map((categoryId) => categoryMap.get(categoryId)).filter(Boolean);
    const remainingCategories = fortune.categories.filter((category) => !TODAY_FORTUNE_CATEGORY_IDS.includes(category.id));

    return [...orderedCategories, ...remainingCategories].slice(0, 6);
  }, [fortune.categories]);

  const quickMenuItems = [
    { id: 'today', label: '오늘운세', icon: '☾', onClick: () => onOpenDetail('overall') },
    { id: 'saju', label: '정통사주', icon: '✦', onClick: () => onNavigate('sajuInsight') },
    { id: 'money', label: '재물운', icon: '◇', onClick: () => onOpenDetail('money') },
    { id: 'love', label: '연애운', icon: '♡', onClick: () => onOpenDetail('love') },
    { id: 'compatibility', label: '궁합', icon: '⌁', onClick: () => onNavigate('compatibility') },
    { id: 'saved', label: '저장한 풀이', icon: '✧', onClick: () => onNavigate('savedReadings') },
  ];
  const quickMenuIdSet = new Set(quickMenuItems.map((item) => item.id));
  const visibleQuickMenuItems = useMemo(() => {
    const validPrefs = quickMenuPrefs.filter((id) => quickMenuIdSet.has(id));
    const fallbackIds = DEFAULT_QUICK_MENU_IDS.filter((id) => quickMenuIdSet.has(id));
    const menuIds = (validPrefs.length > 0 ? validPrefs : fallbackIds).slice(0, MAX_HOME_QUICK_MENU_ITEMS);
    return menuIds.map((id) => quickMenuItems.find((item) => item.id === id)).filter(Boolean);
  }, [quickMenuItems, quickMenuIdSet, quickMenuPrefs]);

  useEffect(() => {
    const validPrefs = quickMenuPrefs.filter((id) => quickMenuIdSet.has(id)).slice(0, MAX_HOME_QUICK_MENU_ITEMS);
    if (validPrefs.length !== quickMenuPrefs.length || validPrefs.some((id, index) => id !== quickMenuPrefs[index])) {
      setQuickMenuPrefs(validPrefs.length > 0 ? validPrefs : DEFAULT_QUICK_MENU_IDS);
    }
  }, [quickMenuIdSet, quickMenuPrefs]);

  const handleToggleQuickMenu = (menuId) => {
    setQuickMenuPrefs((currentPrefs) => {
      if (currentPrefs.includes(menuId)) {
        const nextPrefs = currentPrefs.filter((id) => id !== menuId);
        setQuickMenuMessage(nextPrefs.length === 0 ? '최소 1개 메뉴는 남겨두면 홈에서 바로 이동할 수 있어요.' : '');
        const savedPrefs = nextPrefs.length > 0 ? nextPrefs : currentPrefs;
        writeQuickMenuPrefs(savedPrefs);
        return savedPrefs;
      }

      if (currentPrefs.length >= MAX_HOME_QUICK_MENU_ITEMS) {
        setQuickMenuMessage('빠른 메뉴는 최대 4개까지 선택할 수 있어요.');
        return currentPrefs;
      }

      const nextPrefs = [...currentPrefs, menuId];
      setQuickMenuMessage('');
      writeQuickMenuPrefs(nextPrefs);
      return nextPrefs;
    });
  };

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
        <MountainOrbitIllustration size="large" className="home-hero-artwork" opacity={0.86} />
        <p className="eyebrow">고요한 아침의 운세 다이어리</p>
        <h1 id="home-hero-title">오늘의 흐름을 살펴보세요</h1>
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

      <section className="home-today-fortune-section" aria-labelledby="home-today-fortune-title">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Today Fortune</p>
            <h2 id="home-today-fortune-title">오늘운세</h2>
          </div>
          <span>{todayFlowDate}</span>
        </div>
        <div className="fortune-grid home-today-fortune-grid">
          {todayFortuneCategories.map((category) => (
            <FortuneCard key={category.id} category={category} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </section>

      <section className="fortune-flow-card home-fortune-flow-card">
        <p className="eyebrow">오늘 운세 흐름</p>
        <h2>여섯 가지 운세를 한눈에 보기</h2>
        <div className="flow-list">
          {todayFortuneCategories.map((category) => (
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

      <section className="home-score-diary-card">
        <div className="home-score-copy">
          <p className="eyebrow">오늘의 흐름</p>
          {todayFlowDate && <p className="home-score-date">{todayFlowDate}</p>}
          <h2>{todayKeyword}</h2>
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
          <button
            className="quick-menu-edit-button"
            type="button"
            onClick={() => {
              setQuickMenuMessage('');
              setIsQuickMenuEditorOpen(true);
            }}
            aria-label="빠른 메뉴 편집"
          >
            편집
          </button>
        </div>
        <div className="home-menu-grid home-menu-grid-v2">
          {visibleQuickMenuItems.map((item) => (
            <button key={item.id} type="button" onClick={item.onClick}>
              <span aria-hidden="true">{item.icon}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>
      </section>

      {isQuickMenuEditorOpen && (
        <div className="home-modal-backdrop" role="presentation">
          <section className="home-bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="quick-menu-editor-title">
            <div className="home-modal-head">
              <div>
                <p className="eyebrow">Quick Menu</p>
                <h2 id="quick-menu-editor-title">빠른 메뉴 편집</h2>
              </div>
              <button type="button" onClick={() => setIsQuickMenuEditorOpen(false)} aria-label="빠른 메뉴 편집 닫기">
                ×
              </button>
            </div>
            <p className="quick-menu-editor-copy">홈에 보여줄 메뉴를 최대 4개까지 고를 수 있어요.</p>
            <div className="quick-menu-choice-list">
              {quickMenuItems.map((item) => {
                const isChecked = quickMenuPrefs.includes(item.id);
                return (
                  <label className="quick-menu-choice" key={item.id}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleQuickMenu(item.id)}
                    />
                    <span aria-hidden="true">{item.icon}</span>
                    <strong>{item.label}</strong>
                  </label>
                );
              })}
            </div>
            <p className="quick-menu-editor-status" role="status">
              {quickMenuMessage || `${quickMenuPrefs.length}/${MAX_HOME_QUICK_MENU_ITEMS}개 선택됨`}
            </p>
            <button className="primary-button full-width" type="button" onClick={() => setIsQuickMenuEditorOpen(false)}>
              완료
            </button>
          </section>
        </div>
      )}

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
