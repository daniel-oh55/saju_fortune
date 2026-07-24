import { useEffect, useMemo, useState } from 'react';
import FortuneCard from '../components/FortuneCard.jsx';
import PageTopBar from '../components/PageTopBar.jsx';
import SavedReadingsSummaryCard from '../components/SavedReadingsSummaryCard.jsx';
import VisitStreakCard from '../components/VisitStreakCard.jsx';
import { displayFiveElement } from '../utils/fiveElementsInfo.js';
import morningFortuneBg from '../assets/fortune-time/morning-fortune-bg.png';
import noonFortuneBg from '../assets/fortune-time/noon-fortune-bg.png';
import eveningFortuneBg from '../assets/fortune-time/evening-fortune-bg.png';

const QUICK_MENU_PREFS_KEY = 'harupuli_home_quick_menu_prefs';
const MAX_HOME_QUICK_MENU_ITEMS = 4;
const DEFAULT_QUICK_MENU_IDS = ['today', 'saju', 'money', 'love'];
const TODAY_FORTUNE_CATEGORY_IDS = ['overall', 'money', 'love', 'work', 'study', 'health'];
const WEEKDAY_LABELS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function formatKoreanDate(dateKey) {
  const [year, month, day] = String(dateKey || '').split('-').map(Number);
  if (!year || !month || !day) return '';

  const weekday = WEEKDAY_LABELS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  return `${year}년 ${month}월 ${day}일 ${weekday}`;
}

function formatElementDisplayText(text) {
  return String(text || '').replace(/(화|수|목|금|토)(?=\s*(균형|정리|기운)|$)/g, (element) => displayFiveElement(element));
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

const HOME_TIME_SLOT_FORTUNES = [
  {
    id: 'morning',
    label: '아침운세',
    title: '천천히 시동을 걸기 좋은 시간',
    text: '해야 할 일을 작게 나누고 서두르지 않으면 하루를 차분하게 시작할 수 있습니다.',
    bg: morningFortuneBg,
  },
  {
    id: 'lunch',
    label: '점심운세',
    title: '정리와 확인에 어울리는 시간',
    text: '중요한 메시지나 약속은 한 번 더 확인하고, 급한 결정은 잠시 미뤄보세요.',
    bg: noonFortuneBg,
  },
  {
    id: 'evening',
    label: '저녁운세',
    title: '속도를 낮추고 균형을 챙길 시간',
    text: '가벼운 정리와 짧은 휴식으로 마무리하고, 무리한 약속은 다음으로 미뤄보세요.',
    bg: eveningFortuneBg,
  },
];

const HOME_TIME_SLOT_FALLBACK_TITLE = '오늘의 흐름을 살펴보세요';
const HOME_TIME_SLOT_FALLBACK_TEXT = '잠시 후 다시 확인해주세요.';

function HomePage({
  fortune,
  profile,
  savedReadings,
  visitStreak,
  onOpenDetail,
  onNavigate,
  onOpenReminderSettings,
  isReminderEnabled,
}) {
  const [quickMenuPrefs, setQuickMenuPrefs] = useState(() => readQuickMenuPrefs());
  const [isQuickMenuEditorOpen, setIsQuickMenuEditorOpen] = useState(false);
  const [quickMenuMessage, setQuickMenuMessage] = useState('');
  const overall = fortune.categories.find((category) => category.id === 'overall') || fortune.categories[0];
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
      <PageTopBar
        title="하루풀이"
        profileName={profile.nickname}
        isReminderEnabled={isReminderEnabled}
        onProfileClick={() => onNavigate('settings')}
        onReminderClick={onOpenReminderSettings}
      />

      <section className="home-diary-hero shared-hero-artwork-card" aria-labelledby="home-hero-title">
        <p className="eyebrow">고요한 아침의 운세 다이어리</p>
        <h1 id="home-hero-title">오늘의 운세를 살펴보세요</h1>
        <p>
          내 하루의 기운을 가볍게 확인하고,
          <br />
          지금 필요한 작은 방향을 찾아보세요.
        </p>
        <div className="home-hero-actions">
          <button className="primary-button" type="button" onClick={() => onNavigate('settings')}>
            내 사주 입력하기
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
            aria-expanded={isQuickMenuEditorOpen}
            aria-controls="quick-menu-editor-dialog"
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
          <section
            id="quick-menu-editor-dialog"
            className="home-bottom-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-menu-editor-title"
          >
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

      <VisitStreakCard streak={visitStreak} />

      <section className="today-summary-card today-line-card">
        <p className="eyebrow">오늘의 한 줄 풀이</p>
        <h2>{overall.summary}</h2>
        <p>좋은 흐름은 살리고, 조심할 부분은 차분히 살펴보세요.</p>
      </section>

      <SavedReadingsSummaryCard
        savedReadings={savedReadings}
        onOpenSavedReadings={() => onNavigate('savedReadings')}
      />

      <section className="time-fortune-card home-time-slot-card">
        <p className="eyebrow">오늘의 시간대 운세</p>
        <p className="home-time-slot-subtext">아침, 점심, 저녁의 흐름을 한눈에 살펴보세요.</p>
        <div className="home-time-slot-grid">
          {HOME_TIME_SLOT_FORTUNES.map((slot) => (
            <div
              key={slot.id}
              className="home-time-slot-item"
              style={slot.bg ? { backgroundImage: `url(${slot.bg})` } : undefined}
            >
              <span className="home-time-slot-label">{slot.label}</span>
              <strong className="home-time-slot-title">{slot.title || HOME_TIME_SLOT_FALLBACK_TITLE}</strong>
              <p className="home-time-slot-text">{slot.text || HOME_TIME_SLOT_FALLBACK_TEXT}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="time-fortune-card home-today-hint-card">
        <p className="eyebrow">오늘의 힌트</p>
        <p className="home-hint-subtext">행운 색상, 행운 아이템, 오늘 키워드를 한곳에서 확인해보세요.</p>
        <div className="home-hint-grid">
          <div className="home-hint-item">
            <span className="home-hint-label">행운 색상</span>
            <strong className="home-hint-value">{overall.luckyColor}</strong>
          </div>
          <div className="home-hint-item">
            <span className="home-hint-label">행운 아이템</span>
            <strong className="home-hint-value">{overall.luckyItem}</strong>
          </div>
          <div className="home-hint-item">
            <span className="home-hint-label">오늘 키워드</span>
            <strong className="home-hint-value">{todayKeyword}</strong>
          </div>
        </div>
      </section>

      <section className="home-trust-card">
        <span aria-hidden="true">✦</span>
        <div>
          <h2>입력 정보는 현재 기기 안에서만 사용됩니다.</h2>
          <p>하루풀이는 서버 DB와 로그인 없이 이용할 수 있으며, 입력한 정보는 운세 참고 콘텐츠를 보여주는 데 사용됩니다.</p>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
