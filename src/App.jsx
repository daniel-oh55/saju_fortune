import { useEffect, useMemo, useState } from 'react';
import BottomNav from './components/BottomNav.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import FortuneDetailPage from './pages/FortuneDetailPage.jsx';
import YearFortunePage from './pages/YearFortunePage.jsx';
import ZodiacFortunePage from './pages/ZodiacFortunePage.jsx';
import AiConsultPage from './pages/AiConsultPage.jsx';
import CompatibilityPage from './pages/CompatibilityPage.jsx';
import PremiumPage from './pages/PremiumPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import { createTodayFortune } from './utils/fortuneEngine.js';
import { getKoreaDateKey } from './utils/date.js';
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

function App() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [activePage, setActivePage] = useState(profile ? 'home' : 'onboarding');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [unlockedDetails, setUnlockedDetails] = useState({});

  const fortune = useMemo(() => {
    if (!profile) return null;

    const cached = loadFortune();
    if (cached?.dateKey === todayKey && cached?.profileId === profile.id && cached?.sajuAnalysis) {
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

  const handleSaveProfile = (nextProfile) => {
    saveProfile(nextProfile);
    setProfile(nextProfile);
    setActivePage('home');
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

  const handleReset = () => {
    clearAppData();
    setProfile(null);
    setUnlockedDetails({});
    setActivePage('onboarding');
  };

  if (!profile || activePage === 'onboarding') {
    return <OnboardingPage initialProfile={profile} onSave={handleSaveProfile} />;
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        {activePage === 'home' && (
          <HomePage
            fortune={fortune}
            profile={profile}
            onOpenDetail={handleOpenDetail}
            onNavigate={setActivePage}
          />
        )}
        {activePage === 'fortune' && (
          <FortuneDetailPage
            fortune={fortune}
            selectedCategory={selectedCategory}
            unlockedDetails={unlockedDetails}
            onSelectCategory={setSelectedCategory}
            onUnlockDetail={handleUnlockDetail}
          />
        )}
        {activePage === 'year' && (
          <YearFortunePage profile={profile} fortune={fortune} onNavigate={setActivePage} />
        )}
        {activePage === 'zodiac' && (
          <ZodiacFortunePage profile={profile} fortune={fortune} />
        )}
        {activePage === 'ai' && <AiConsultPage profile={profile} fortune={fortune} />}
        {activePage === 'compatibility' && <CompatibilityPage profile={profile} />}
        {activePage === 'premium' && <PremiumPage />}
        {activePage === 'settings' && (
          <SettingsPage
            profile={profile}
            onEditProfile={() => setActivePage('onboarding')}
            onReset={handleReset}
          />
        )}
      </main>
      <BottomNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}

export default App;
