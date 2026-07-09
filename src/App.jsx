import { useEffect, useMemo, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import AppLoadingScreen from './components/AppLoadingScreen.jsx';
import BottomNav from './components/BottomNav.jsx';
import ConsentBanner from './components/ConsentBanner.jsx';
import ConsentSettingsPanel from './components/ConsentSettingsPanel.jsx';
import DailyReminderSettingsPanel from './components/DailyReminderSettingsPanel.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import FortuneDetailPage from './pages/FortuneDetailPage.jsx';
import YearFortunePage from './pages/YearFortunePage.jsx';
import ZodiacFortunePage from './pages/ZodiacFortunePage.jsx';
import SajuInsightPage from './pages/SajuInsightPage.jsx';
import SavedReadingsPage from './pages/SavedReadingsPage.jsx';
import ManseryeokValidationPage from './pages/ManseryeokValidationPage.jsx';
import AiConsultPage from './pages/AiConsultPage.jsx';
import CompatibilityPage from './pages/CompatibilityPage.jsx';
import PremiumPage from './pages/PremiumPage.jsx';
import PrivacyInfoPage from './pages/PrivacyInfoPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import { CURRENT_FORTUNE_SCHEMA_VERSION, createTodayFortune } from './utils/fortuneEngine.js';
import { getKoreaDateKey } from './utils/date.js';
import {
  loadSavedReadings,
  removeSavedReading,
  saveReadingItem,
} from './utils/savedReadingsStorage.js';
import { createEmptyVisitStreak, recordDailyVisit } from './utils/visitStreakStorage.js';
import {
  loadDailyReminderSettings,
  requestDailyReminderPermission,
  saveDailyReminderSettings,
} from './utils/dailyReminderSettings.js';
import {
  loadConsentPreferences,
  saveConsentPreferences,
  shouldShowConsentBanner,
  updateConsentPreferences,
} from './utils/consentPreferencesStorage.js';
import {
  clearAppData,
  loadFortune,
  loadProfile,
  loadRewardUnlocks,
  saveFortune,
  saveProfile,
  saveRewardUnlock,
} from './utils/storage.js';

const todayKey = getKoreaDateKey();
const REQUIRED_FORTUNE_CATEGORY_IDS = ['overall', 'money', 'love', 'work', 'study', 'health'];
const APP_HISTORY_MARKER = 'harupuliAppHistory';
const APP_HISTORY_PAGE_KEY = 'harupuliAppPage';
const TODAY_FORTUNE_DETAIL_HISTORY_MARKER = 'harupuliTodayFortuneDetail';
const APP_LOADING_DURATION_MS = 700;

function scrollToPageTop() {
  if (typeof window === 'undefined') return;

  const applyScroll = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(applyScroll);
    return;
  }

  window.setTimeout(applyScroll, 0);
}

function hasRequiredFortuneCategories(fortune) {
  if (!Array.isArray(fortune?.categories)) return false;

  const categoryIds = new Set(fortune.categories.map((category) => category.id));
  return REQUIRED_FORTUNE_CATEGORY_IDS.every((categoryId) => categoryIds.has(categoryId));
}

function isValidCachedFortune(cached, profile, dateKey) {
  return (
    cached?.dateKey === dateKey &&
    cached?.profileId === profile.id &&
    cached?.schemaVersion === CURRENT_FORTUNE_SCHEMA_VERSION &&
    cached?.sajuAnalysis &&
    hasRequiredFortuneCategories(cached)
  );
}

function createAppHistoryState(page, extraState = {}) {
  const currentState = typeof window !== 'undefined' ? window.history.state || {} : {};
  const { [TODAY_FORTUNE_DETAIL_HISTORY_MARKER]: _detailState, ...baseState } = currentState;

  return {
    ...baseState,
    [APP_HISTORY_MARKER]: true,
    [APP_HISTORY_PAGE_KEY]: page,
    ...extraState,
  };
}

function isAppHistoryState(state) {
  return Boolean(state?.[APP_HISTORY_MARKER] && state?.[APP_HISTORY_PAGE_KEY]);
}

function App() {
  const isManseryeokDebug =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('debug') === 'manseryeok';

  if (isManseryeokDebug) {
    return <ManseryeokValidationPage />;
  }

  const [profile, setProfile] = useState(() => loadProfile());
  const [activePage, setActivePage] = useState(profile ? 'home' : 'onboarding');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [unlockedDetails, setUnlockedDetails] = useState({});
  const [savedReadings, setSavedReadings] = useState(() => loadSavedReadings());
  const [visitStreak, setVisitStreak] = useState(() => createEmptyVisitStreak());
  const [consentPreferences, setConsentPreferences] = useState(() => loadConsentPreferences());
  const [isConsentBannerVisible, setIsConsentBannerVisible] = useState(() => shouldShowConsentBanner());
  const [isConsentSettingsOpen, setIsConsentSettingsOpen] = useState(false);
  const [dailyReminderSettings, setDailyReminderSettings] = useState(() => loadDailyReminderSettings());
  const [dailyReminderDraft, setDailyReminderDraft] = useState(() => loadDailyReminderSettings());
  const [isReminderSettingsOpen, setIsReminderSettingsOpen] = useState(false);
  const [reminderSettingsMessage, setReminderSettingsMessage] = useState('');
  const [isAppLoading, setIsAppLoading] = useState(true);
  const activePageRef = useRef(activePage);
  const detailReturnPageRef = useRef('home');
  const detailHistoryPushedRef = useRef(false);
  const appHistoryInitializedRef = useRef(false);
  const appPageStackRef = useRef([activePage]);
  const handleAppBackRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsAppLoading(false), APP_LOADING_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const fortune = useMemo(() => {
    if (!profile) return null;

    const cached = loadFortune();
    if (isValidCachedFortune(cached, profile, todayKey)) {
      return cached;
    }

    const created = createTodayFortune(profile, todayKey);
    saveFortune(created);
    return created;
  }, [profile]);

  const syncAppPageStack = (page, { replaceStack = false, resetStack = false } = {}) => {
    if (resetStack || page === 'home' || page === 'onboarding') {
      appPageStackRef.current = [page];
      return;
    }

    const stack = [...appPageStackRef.current];
    const currentStackPage = stack[stack.length - 1];

    if (replaceStack) {
      if (stack.length === 0) {
        appPageStackRef.current = [page];
        return;
      }

      stack[stack.length - 1] = page;
      appPageStackRef.current = stack;
      return;
    }

    if (currentStackPage !== page) {
      stack.push(page);
    }

    appPageStackRef.current = stack.length > 0 ? stack : [page];
  };

  const getPreviousAppPage = (fallbackPage = 'home') => {
    const stack = [...appPageStackRef.current];

    if (stack.length > 1) {
      stack.pop();
      const previousPage = stack[stack.length - 1] || fallbackPage;
      appPageStackRef.current = stack;
      return previousPage;
    }

    appPageStackRef.current = [fallbackPage];
    return fallbackPage;
  };

  const handleAppBack = ({ allowExit = false } = {}) => {
    const currentPage = activePageRef.current;

    if (currentPage === 'fortune' && detailHistoryPushedRef.current) {
      detailHistoryPushedRef.current = false;
      const returnPage = getPreviousAppPage(detailReturnPageRef.current || 'home');
      navigateToAppPage(returnPage, { replaceHistory: true, replaceStack: true });
      return true;
    }

    if (currentPage !== 'home') {
      detailHistoryPushedRef.current = false;
      const previousPage = getPreviousAppPage('home');
      navigateToAppPage(previousPage, { replaceHistory: true, replaceStack: true });
      return true;
    }

    if (allowExit && Capacitor.isNativePlatform()) {
      CapacitorApp.exitApp();
    }

    return false;
  };

  useEffect(() => {
    if (profile && activePage === 'onboarding') {
      navigateToAppPage('home', { replaceHistory: true });
    }
  }, [activePage, profile]);

  useEffect(() => {
    activePageRef.current = activePage;
  }, [activePage]);

  useEffect(() => {
    handleAppBackRef.current = handleAppBack;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !Capacitor.isNativePlatform()) return undefined;

    let backButtonListener = null;
    let isMounted = true;

    CapacitorApp.addListener('backButton', () => {
      handleAppBackRef.current?.({ allowExit: true });
    }).then((listener) => {
      if (!isMounted) {
        listener.remove();
        return;
      }

      backButtonListener = listener;
    });

    return () => {
      isMounted = false;
      backButtonListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    if (!appHistoryInitializedRef.current) {
      window.history.replaceState(createAppHistoryState(activePageRef.current), '', window.location.href);
      appHistoryInitializedRef.current = true;
    }

    const handlePopState = (event) => {
      const nextState = event.state;

      if (activePageRef.current === 'fortune' && detailHistoryPushedRef.current) {
        detailHistoryPushedRef.current = false;
        const returnPage = isAppHistoryState(nextState)
          ? nextState[APP_HISTORY_PAGE_KEY]
          : detailReturnPageRef.current || 'home';
        syncAppPageStack(returnPage, { replaceStack: true });
        activePageRef.current = returnPage;
        setActivePage(returnPage);
        scrollToPageTop();
        return;
      }

      if (isAppHistoryState(nextState)) {
        const nextPage = nextState[APP_HISTORY_PAGE_KEY];
        detailHistoryPushedRef.current = Boolean(nextState[TODAY_FORTUNE_DETAIL_HISTORY_MARKER]);
        syncAppPageStack(nextPage, { replaceStack: true });
        activePageRef.current = nextPage;
        setActivePage(nextPage);
        scrollToPageTop();
        return;
      }

      if (activePageRef.current !== 'home') {
        detailHistoryPushedRef.current = false;
        syncAppPageStack('home', { resetStack: true });
        activePageRef.current = 'home';
        setActivePage('home');
        window.history.replaceState(createAppHistoryState('home'), '', window.location.href);
        scrollToPageTop();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (fortune?.id) {
      setUnlockedDetails(loadRewardUnlocks(fortune.id));
    }
  }, [fortune?.id]);

  useEffect(() => {
    if (fortune?.id) {
      setVisitStreak(recordDailyVisit(todayKey));
    }
  }, [fortune?.id]);

  const handleSaveProfile = (nextProfile) => {
    const hadProfile = Boolean(profile);
    saveProfile(nextProfile);
    setProfile(nextProfile);
    navigateToAppPage(hadProfile ? 'settings' : 'home', { replaceHistory: true });
  };

  const navigateToAppPage = (
    page,
    { pushHistory = true, replaceHistory = false, scroll = true, replaceStack = false, resetStack = false } = {},
  ) => {
    const currentPage = activePageRef.current;
    const isSamePage = currentPage === page;

    if (isSamePage) {
      if (replaceStack || resetStack) {
        syncAppPageStack(page, { replaceStack, resetStack });
      }
      if (scroll) scrollToPageTop();
      return;
    }

    if (typeof window !== 'undefined') {
      const nextState = createAppHistoryState(page);
      if (replaceHistory) {
        window.history.replaceState(nextState, '', window.location.href);
      } else if (pushHistory) {
        window.history.pushState(nextState, '', window.location.href);
      }
    }

    if (page !== 'fortune') {
      detailHistoryPushedRef.current = false;
    }

    syncAppPageStack(page, { replaceStack, resetStack });
    activePageRef.current = page;
    setActivePage(page);
    if (scroll) scrollToPageTop();
  };

  const handleNavigate = (page) => {
    navigateToAppPage(page);
  };

  const handleOpenDetail = (categoryId) => {
    const currentPage = activePageRef.current;

    if (currentPage !== 'fortune') {
      detailReturnPageRef.current = currentPage === 'onboarding' || currentPage === 'profileEdit' ? 'home' : currentPage;
    }

    setSelectedCategory(categoryId);

    if (currentPage !== 'fortune') {
      syncAppPageStack('fortune');
      if (typeof window !== 'undefined') {
        window.history.pushState(
          createAppHistoryState('fortune', { [TODAY_FORTUNE_DETAIL_HISTORY_MARKER]: true }),
          '',
          window.location.href,
        );
      }
      detailHistoryPushedRef.current = true;
      activePageRef.current = 'fortune';
      setActivePage('fortune');
      scrollToPageTop();
    }
  };

  const handleCloseFortuneDetail = () => {
    handleAppBack();
  };

  const handleUnlockDetail = (categoryId) => {
    if (!fortune?.id) return;

    // 실제 광고 SDK 연동 전까지는 mock_rewarded_ad 상태를 저장합니다.
    const nextUnlocks = saveRewardUnlock(fortune.id, categoryId);
    setUnlockedDetails(nextUnlocks);
  };

  const handleSaveReading = (item) => {
    setSavedReadings(saveReadingItem(item));
  };

  const handleRemoveSavedReading = (itemId) => {
    setSavedReadings(removeSavedReading(itemId));
  };

  const handleReset = () => {
    clearAppData();
    setProfile(null);
    setUnlockedDetails({});
    navigateToAppPage('onboarding', { replaceHistory: true });
  };

  const handleAcceptAllConsent = () => {
    const nextPreferences = saveConsentPreferences({
      analytics: true,
      ads: true,
      personalizedAds: true,
    });
    setConsentPreferences(nextPreferences);
    setIsConsentBannerVisible(false);
  };

  const handleRejectOptionalConsent = () => {
    const nextPreferences = saveConsentPreferences({
      analytics: false,
      ads: false,
      personalizedAds: false,
    });
    setConsentPreferences(nextPreferences);
    setIsConsentBannerVisible(false);
  };

  const handleOpenConsentSettings = () => {
    setIsConsentSettingsOpen(true);
  };

  const handleCloseConsentSettings = () => {
    setIsConsentSettingsOpen(false);
  };

  const handleSaveConsentSettings = (nextPreferences) => {
    const savedPreferences = updateConsentPreferences(nextPreferences);
    setConsentPreferences(savedPreferences);
    setIsConsentSettingsOpen(false);
    setIsConsentBannerVisible(false);
  };

  const handleOpenPrivacyInfoFromConsent = () => {
    handleNavigate('privacyInfo');
    setIsConsentSettingsOpen(false);
  };

  const handleOpenReminderSettings = () => {
    setDailyReminderDraft(dailyReminderSettings);
    setReminderSettingsMessage('');
    setIsReminderSettingsOpen(true);
  };

  const handleToggleDailyReminder = async (enabled) => {
    if (!enabled) {
      setDailyReminderDraft((current) => ({ ...current, enabled: false }));
      setReminderSettingsMessage('알림을 꺼두면 저장된 시간은 유지됩니다.');
      return;
    }

    const permission = await requestDailyReminderPermission();
    if (permission === 'denied') {
      setDailyReminderDraft((current) => ({ ...current, enabled: false }));
      setReminderSettingsMessage('알림 권한이 꺼져 있어요. 기기 설정에서 허용한 뒤 다시 켜주세요.');
      return;
    }

    setDailyReminderDraft((current) => ({ ...current, enabled: true }));
    setReminderSettingsMessage(
      permission === 'granted'
        ? '알림 설정을 저장할 수 있어요. Android 앱 알림 연동은 안정적으로 동작하도록 준비 중입니다.'
        : '앱 알림은 Android 앱 빌드에서 안정적으로 동작하도록 준비 중입니다.',
    );
  };

  const handleSaveDailyReminderSettings = () => {
    const savedSettings = saveDailyReminderSettings(dailyReminderDraft);
    setDailyReminderSettings(savedSettings);
    setIsReminderSettingsOpen(false);
  };

  const consentUi = (
    <>
      {isConsentBannerVisible && (
        <ConsentBanner
          onAcceptAll={handleAcceptAllConsent}
          onRejectOptional={handleRejectOptionalConsent}
          onOpenSettings={handleOpenConsentSettings}
          onOpenPrivacyInfo={handleOpenPrivacyInfoFromConsent}
        />
      )}
      {isConsentSettingsOpen && (
        <ConsentSettingsPanel
          preferences={consentPreferences}
          onSave={handleSaveConsentSettings}
          onClose={handleCloseConsentSettings}
          onOpenPrivacyInfo={handleOpenPrivacyInfoFromConsent}
        />
      )}
    </>
  );
  if (isAppLoading) {
    return <AppLoadingScreen />;
  }

  const shouldShowAppBackButton = activePage !== 'home' && activePage !== 'onboarding';

  if (!profile || activePage === 'onboarding' || activePage === 'profileEdit') {
    return (
      <>
        <OnboardingPage initialProfile={profile} onSave={handleSaveProfile} />
        {consentUi}
      </>
    );
  }

  return (
    <div className="app-shell">
      {shouldShowAppBackButton && (
        <button
          className="app-back-button"
          type="button"
          aria-label="이전 화면으로 돌아가기"
          onClick={() => handleAppBack()}
        >
          <span aria-hidden="true">‹</span>
        </button>
      )}
      <main className="app-main">
        {activePage === 'home' && (
          <HomePage
            fortune={fortune}
            profile={profile}
            savedReadings={savedReadings}
            visitStreak={visitStreak}
            onOpenDetail={handleOpenDetail}
            onNavigate={handleNavigate}
            onOpenReminderSettings={handleOpenReminderSettings}
            isReminderEnabled={dailyReminderSettings.enabled}
          />
        )}
        {activePage === 'fortune' && (
          <FortuneDetailPage
            fortune={fortune}
            selectedCategory={selectedCategory}
            unlockedDetails={unlockedDetails}
            savedReadings={savedReadings}
            consentPreferences={consentPreferences}
            onOpenConsentSettings={handleOpenConsentSettings}
            onSelectCategory={setSelectedCategory}
            onClose={handleCloseFortuneDetail}
            onUnlockDetail={handleUnlockDetail}
            onSaveReading={handleSaveReading}
            onRemoveSavedReading={handleRemoveSavedReading}
          />
        )}
        {activePage === 'year' && (
          <YearFortunePage
            profile={profile}
            fortune={fortune}
            onNavigate={handleNavigate}
            onOpenReminderSettings={handleOpenReminderSettings}
            isReminderEnabled={dailyReminderSettings.enabled}
          />
        )}
        {activePage === 'zodiac' && (
          <ZodiacFortunePage
            profile={profile}
            fortune={fortune}
            onNavigate={handleNavigate}
            onOpenReminderSettings={handleOpenReminderSettings}
            isReminderEnabled={dailyReminderSettings.enabled}
          />
        )}
        {activePage === 'sajuInsight' && (
          <SajuInsightPage
            profile={profile}
            fortune={fortune}
            unlockedDetails={unlockedDetails}
            onUnlockDetail={handleUnlockDetail}
            savedReadings={savedReadings}
            consentPreferences={consentPreferences}
            onOpenConsentSettings={handleOpenConsentSettings}
            onSaveReading={handleSaveReading}
            onRemoveSavedReading={handleRemoveSavedReading}
            onNavigate={handleNavigate}
            onOpenReminderSettings={handleOpenReminderSettings}
            isReminderEnabled={dailyReminderSettings.enabled}
          />
        )}
        {activePage === 'savedReadings' && (
          <SavedReadingsPage
            savedReadings={savedReadings}
            onRemoveSavedReading={handleRemoveSavedReading}
            onNavigate={handleNavigate}
          />
        )}
        {activePage === 'ai' && <AiConsultPage profile={profile} fortune={fortune} />}
        {activePage === 'compatibility' && <CompatibilityPage profile={profile} />}
        {activePage === 'premium' && <PremiumPage />}
        {activePage === 'privacyInfo' && (
          <PrivacyInfoPage onNavigate={handleNavigate} consentPreferences={consentPreferences} />
        )}
        {activePage === 'settings' && (
          <SettingsPage
            profile={profile}
            fortune={fortune}
            consentPreferences={consentPreferences}
            onNavigate={handleNavigate}
            onOpenConsentSettings={handleOpenConsentSettings}
            onEditProfile={() => handleNavigate('profileEdit')}
            onReset={handleReset}
          />
        )}
      </main>
      <BottomNav activePage={activePage} onNavigate={handleNavigate} />
      {isReminderSettingsOpen && (
        <DailyReminderSettingsPanel
          draft={dailyReminderDraft}
          message={reminderSettingsMessage}
          onClose={() => setIsReminderSettingsOpen(false)}
          onSave={handleSaveDailyReminderSettings}
          onToggle={handleToggleDailyReminder}
          onTimeChange={(time) => setDailyReminderDraft((current) => ({ ...current, time }))}
        />
      )}
      {consentUi}
    </div>
  );
}

export default App;
