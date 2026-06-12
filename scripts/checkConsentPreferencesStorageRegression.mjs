import {
  clearConsentPreferences,
  CONSENT_POLICY_VERSION,
  CONSENT_PREFERENCES_STORAGE_KEY,
  createDefaultConsentPreferences,
  hasConsentPreferences,
  isConsentPolicyVersionCurrent,
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

function assertBooleanPreferences(preferences, expected, prefix) {
  assertCondition(preferences.analytics === expected.analytics, `${prefix}: analytics mismatch`);
  assertCondition(preferences.ads === expected.ads, `${prefix}: ads mismatch`);
  assertCondition(preferences.personalizedAds === expected.personalizedAds, `${prefix}: personalizedAds mismatch`);
}

globalThis.localStorage.clear();

const defaultPreferences = createDefaultConsentPreferences();
const defaultPass =
  defaultPreferences.analytics === false &&
  defaultPreferences.ads === false &&
  defaultPreferences.personalizedAds === false &&
  defaultPreferences.policyVersion === CONSENT_POLICY_VERSION &&
  typeof defaultPreferences.updatedAt === 'string';
logResult('default_preferences', defaultPass);
assertCondition(defaultPass, 'default preferences should be false with current policy version');

globalThis.localStorage.clear();
const loadedDefault = loadConsentPreferences();
const loadWithoutStoragePass =
  loadedDefault.analytics === false &&
  loadedDefault.ads === false &&
  loadedDefault.personalizedAds === false &&
  loadedDefault.policyVersion === CONSENT_POLICY_VERSION;
logResult('load_without_storage_returns_default', loadWithoutStoragePass);
assertCondition(loadWithoutStoragePass, 'load without storage should return default preferences');

const saved = saveConsentPreferences({
  analytics: true,
  ads: true,
  personalizedAds: false,
});
const reloaded = loadConsentPreferences();
const savePass =
  saved.analytics === true &&
  saved.ads === true &&
  saved.personalizedAds === false &&
  reloaded.analytics === true &&
  reloaded.ads === true &&
  reloaded.personalizedAds === false &&
  typeof reloaded.updatedAt === 'string';
logResult('save_preferences', savePass);
assertCondition(savePass, 'save should persist normalized preferences with updatedAt');

const updated = updateConsentPreferences({ personalizedAds: true });
const updatePass = updated.analytics === true && updated.ads === true && updated.personalizedAds === true;
logResult('update_partial_preferences', updatePass);
assertCondition(updatePass, 'partial update should preserve existing consent fields');

const normalized = saveConsentPreferences({
  analytics: 'yes',
  ads: 1,
  personalizedAds: 0,
});
const booleanPass = normalized.analytics === true && normalized.ads === true && normalized.personalizedAds === false;
logResult('boolean_normalization', booleanPass);
assertCondition(booleanPass, 'save should coerce consent fields to booleans');

clearConsentPreferences();
const hasBefore = hasConsentPreferences();
saveConsentPreferences({ analytics: false, ads: true, personalizedAds: false });
const hasAfter = hasConsentPreferences();
const hasPass = hasBefore === false && hasAfter === true;
logResult('has_consent_preferences', hasPass);
assertCondition(hasPass, 'hasConsentPreferences should reflect consent key existence');

clearConsentPreferences();
const clearPass = hasConsentPreferences() === false;
logResult('clear_consent_preferences', clearPass);
assertCondition(clearPass, 'clearConsentPreferences should remove only consent preferences');

const policyCurrentPass =
  isConsentPolicyVersionCurrent({ policyVersion: CONSENT_POLICY_VERSION }) === true &&
  isConsentPolicyVersionCurrent({ policyVersion: 999 }) === false;
logResult('policy_version_current', policyCurrentPass);
assertCondition(policyCurrentPass, 'policy version check should compare against current version');

globalThis.localStorage.clear();
const shouldShowWithoutPreferences = shouldShowConsentBanner() === true;
logResult('should_show_without_preferences', shouldShowWithoutPreferences);
assertCondition(shouldShowWithoutPreferences, 'banner should show when preferences do not exist');

saveConsentPreferences({
  analytics: true,
  ads: true,
  personalizedAds: true,
  policyVersion: 0,
});
const shouldShowPolicyMismatch = shouldShowConsentBanner() === true;
logResult('should_show_policy_mismatch', shouldShowPolicyMismatch);
assertCondition(shouldShowPolicyMismatch, 'banner should show when policy version is stale');

saveConsentPreferences({
  analytics: true,
  ads: false,
  personalizedAds: false,
  policyVersion: CONSENT_POLICY_VERSION,
});
const shouldNotShowWhenCurrent = shouldShowConsentBanner() === false;
logResult('should_not_show_when_current', shouldNotShowWhenCurrent);
assertCondition(shouldNotShowWhenCurrent, 'banner should not show when current preferences exist');

globalThis.localStorage.setItem(CONSENT_PREFERENCES_STORAGE_KEY, '{broken-json');
const recovered = loadConsentPreferences();
const corruptedPass =
  recovered.analytics === false &&
  recovered.ads === false &&
  recovered.personalizedAds === false &&
  recovered.policyVersion === CONSENT_POLICY_VERSION;
logResult('corrupted_storage_recovers', corruptedPass);
assertCondition(corruptedPass, 'corrupted storage should recover to default preferences');

globalThis.localStorage.clear();
const existingKeys = {
  harupuli_profile_v1: 'profile',
  harupuli_fortune_v1: 'fortune',
  harupuli_reward_unlocks_v1: 'reward',
  harupuli_saved_readings_v1: 'saved',
  harupuli_visit_streak_v1: 'streak',
};

for (const [key, value] of Object.entries(existingKeys)) {
  globalThis.localStorage.setItem(key, value);
}

saveConsentPreferences({ analytics: true, ads: false, personalizedAds: false });
clearConsentPreferences();

const onlyUsesConsentKey = Object.entries(existingKeys).every(([key, value]) => globalThis.localStorage.getItem(key) === value);
logResult('only_uses_consent_key', onlyUsesConsentKey);
assertCondition(onlyUsesConsentKey, 'consent utility should not mutate existing app localStorage keys');

assertBooleanPreferences(createDefaultConsentPreferences(), {
  analytics: false,
  ads: false,
  personalizedAds: false,
}, 'default shape');

if (failures.length > 0) {
  console.error('Consent preferences storage check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Consent preferences storage check passed');
}
