import {
  CONSENT_POLICY_VERSION,
  CONSENT_PREFERENCES_STORAGE_KEY,
  loadConsentPreferences,
  saveConsentPreferences,
  shouldShowConsentBanner,
  updateConsentPreferences,
} from '../src/utils/consentPreferencesStorage.js';

const failures = [];
const store = new Map();

globalThis.localStorage = {
  getItem(key) {
    return store.has(key) ? store.get(key) : null;
  },
  setItem(key, value) {
    store.set(key, String(value));
  },
  removeItem(key) {
    store.delete(key);
  },
  clear() {
    store.clear();
  },
};

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

globalThis.localStorage.clear();
const firstVisitShouldShow = shouldShowConsentBanner() === true;
logResult('first_visit_should_show_banner', firstVisitShouldShow);
assertCondition(firstVisitShouldShow, 'first visit should show consent banner');

let saved = saveConsentPreferences({
  analytics: true,
  ads: true,
  personalizedAds: true,
});
const acceptAllHides =
  shouldShowConsentBanner() === false &&
  saved.analytics === true &&
  saved.ads === true &&
  saved.personalizedAds === true;
logResult('accept_all_hides_banner', acceptAllHides);
assertCondition(acceptAllHides, 'accept all should save true values and hide banner');

saved = saveConsentPreferences({
  analytics: false,
  ads: false,
  personalizedAds: false,
});
const rejectOptionalHides =
  shouldShowConsentBanner() === false &&
  saved.analytics === false &&
  saved.ads === false &&
  saved.personalizedAds === false;
logResult('reject_optional_hides_banner', rejectOptionalHides);
assertCondition(rejectOptionalHides, 'reject optional should save false values and hide banner');

const partial = updateConsentPreferences({
  analytics: true,
  ads: false,
  personalizedAds: false,
});
const partialSettingsSave =
  partial.analytics === true &&
  partial.ads === false &&
  partial.personalizedAds === false &&
  shouldShowConsentBanner() === false;
logResult('partial_settings_save', partialSettingsSave);
assertCondition(partialSettingsSave, 'partial settings save should update selected values and hide banner');

globalThis.localStorage.setItem(
  CONSENT_PREFERENCES_STORAGE_KEY,
  JSON.stringify({
    analytics: true,
    ads: true,
    personalizedAds: true,
    policyVersion: 0,
    updatedAt: new Date().toISOString(),
  }),
);
const policyMismatchShows = shouldShowConsentBanner() === true;
logResult('policy_version_mismatch_shows_banner', policyMismatchShows);
assertCondition(policyMismatchShows, 'policy version mismatch should show banner');

globalThis.localStorage.setItem(CONSENT_PREFERENCES_STORAGE_KEY, '{broken-json');
const corruptedStorageShows = shouldShowConsentBanner() === true;
logResult('corrupted_storage_shows_banner', corruptedStorageShows);
assertCondition(corruptedStorageShows, 'corrupted storage should show banner');

globalThis.localStorage.clear();
const existingKeys = {
  'aiTodayFortune.profile': 'profile',
  'aiTodayFortune.todayFortune': 'fortune',
  'aiTodayFortune.rewardUnlocks': 'reward',
  harupuli_saved_readings_v1: 'saved',
  harupuli_visit_streak_v1: 'streak',
};

for (const [key, value] of Object.entries(existingKeys)) {
  globalThis.localStorage.setItem(key, value);
}

saveConsentPreferences({ analytics: true, ads: false, personalizedAds: false });
const preferences = loadConsentPreferences();
const existingAppStorageNotMutated =
  preferences.policyVersion === CONSENT_POLICY_VERSION &&
  Object.entries(existingKeys).every(([key, value]) => globalThis.localStorage.getItem(key) === value);
logResult('existing_app_storage_not_mutated', existingAppStorageNotMutated);
assertCondition(existingAppStorageNotMutated, 'consent banner state flow should not mutate existing app keys');

if (failures.length > 0) {
  console.error('Consent banner state check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Consent banner state check passed');
}
