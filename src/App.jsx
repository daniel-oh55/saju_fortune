import { useEffect, useMemo, useState } from 'react';
import BottomNav from './components/BottomNav.jsx';
import ConsentBanner from './components/ConsentBanner.jsx';
import ConsentSettingsPanel from './components/ConsentSettingsPanel.jsx';
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

  useEffect(() => {
    if (profile && activePage === 'onboarding') {
      setActivePage('home');
    }
  }, [activePage, profile]);

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
    setActivePage(hadProfile ? 'settings' : 'home');
  };

  const handleOpenDetail = (categoryId) => {
    setSelectedCategory(categoryId);
    setActivePage('fortune');
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
    setActivePage('onboarding');
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
    setActivePage('privacyInfo');
    setIsConsentSettingsOpen(false);
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
      <main className="app-main">
        {activePage === 'home' && (
          <HomePage
            fortune={fortune}
            profile={profile}
            savedReadings={savedReadings}
            visitStreak={visitStreak}
            onOpenDetail={handleOpenDetail}
            onNavigate={setActivePage}
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
            onUnlockDetail={handleUnlockDetail}
            onSaveReading={handleSaveReading}
            onRemoveSavedReading={handleRemoveSavedReading}
          />
        )}
        {activePage === 'year' && (
          <YearFortunePage profile={profile} fortune={fortune} onNavigate={setActivePage} />
        )}
        {activePage === 'zodiac' && (
          <ZodiacFortunePage profile={profile} fortune={fortune} />
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
            onNavigate={setActivePage}
          />
        )}
        {activePage === 'savedReadings' && (
          <SavedReadingsPage
            savedReadings={savedReadings}
            onRemoveSavedReading={handleRemoveSavedReading}
            onNavigate={setActivePage}
          />
        )}
        {activePage === 'ai' && <AiConsultPage profile={profile} fortune={fortune} />}
        {activePage === 'compatibility' && <CompatibilityPage profile={profile} />}
        {activePage === 'premium' && <PremiumPage />}
        {activePage === 'privacyInfo' && (
          <PrivacyInfoPage onNavigate={setActivePage} consentPreferences={consentPreferences} />
        )}
        {activePage === 'settings' && (
          <SettingsPage
            profile={profile}
            fortune={fortune}
            consentPreferences={consentPreferences}
            onNavigate={setActivePage}
            onOpenConsentSettings={handleOpenConsentSettings}
            onEditProfile={() => setActivePage('profileEdit')}
            onReset={handleReset}
          />
        )}
      </main>
      <BottomNav activePage={activePage} onNavigate={setActivePage} />
      {consentUi}
    </div>
  );
}

export default App;
