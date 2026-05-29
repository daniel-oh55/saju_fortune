const PROFILE_KEY = 'aiTodayFortune.profile';
const FORTUNE_KEY = 'aiTodayFortune.todayFortune';
const UNLOCKS_KEY = 'aiTodayFortune.rewardUnlocks';

function safeParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function loadProfile() {
  return safeParse(localStorage.getItem(PROFILE_KEY));
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadFortune() {
  return safeParse(localStorage.getItem(FORTUNE_KEY));
}

export function saveFortune(fortune) {
  localStorage.setItem(FORTUNE_KEY, JSON.stringify(fortune));
}

export function loadRewardUnlocks(fortuneId) {
  const allUnlocks = safeParse(localStorage.getItem(UNLOCKS_KEY)) || {};
  return allUnlocks[fortuneId] || {};
}

export function saveRewardUnlock(fortuneId, categoryId) {
  const allUnlocks = safeParse(localStorage.getItem(UNLOCKS_KEY)) || {};
  const todayUnlocks = allUnlocks[fortuneId] || {};

  const nextUnlocks = {
    ...allUnlocks,
    [fortuneId]: {
      ...todayUnlocks,
      [categoryId]: {
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        rewardType: 'mock_rewarded_ad',
      },
    },
  };

  localStorage.setItem(UNLOCKS_KEY, JSON.stringify(nextUnlocks));
  return nextUnlocks[fortuneId];
}

export function clearAppData() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(FORTUNE_KEY);
  localStorage.removeItem(UNLOCKS_KEY);
}
