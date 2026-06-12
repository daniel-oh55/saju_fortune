export const CONSENT_PREFERENCES_STORAGE_KEY = 'harupuli_consent_preferences_v1';
export const CONSENT_POLICY_VERSION = 1;

function getStorage() {
  try {
    return globalThis.localStorage || null;
  } catch {
    return null;
  }
}

function safeParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function normalizeConsentPreferences(preferences, updatedAt = new Date().toISOString()) {
  const source = preferences && typeof preferences === 'object' ? preferences : {};
  const policyVersion =
    typeof source.policyVersion === 'number' && Number.isFinite(source.policyVersion)
      ? source.policyVersion
      : CONSENT_POLICY_VERSION;

  return {
    analytics: Boolean(source.analytics),
    ads: Boolean(source.ads),
    personalizedAds: Boolean(source.personalizedAds),
    policyVersion,
    updatedAt: typeof source.updatedAt === 'string' && source.updatedAt ? source.updatedAt : updatedAt,
  };
}

export function createDefaultConsentPreferences() {
  return {
    analytics: false,
    ads: false,
    personalizedAds: false,
    policyVersion: CONSENT_POLICY_VERSION,
    updatedAt: new Date().toISOString(),
  };
}

export function loadConsentPreferences() {
  const storage = getStorage();
  if (!storage) return createDefaultConsentPreferences();

  return normalizeConsentPreferences(safeParse(storage.getItem(CONSENT_PREFERENCES_STORAGE_KEY)));
}

export function saveConsentPreferences(preferences) {
  const normalized = normalizeConsentPreferences({
    ...preferences,
    updatedAt: new Date().toISOString(),
  });
  const storage = getStorage();

  if (storage) {
    storage.setItem(CONSENT_PREFERENCES_STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

export function updateConsentPreferences(partialPreferences) {
  return saveConsentPreferences({
    ...loadConsentPreferences(),
    ...(partialPreferences && typeof partialPreferences === 'object' ? partialPreferences : {}),
  });
}

export function clearConsentPreferences() {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(CONSENT_PREFERENCES_STORAGE_KEY);
  }
}

export function hasConsentPreferences() {
  const storage = getStorage();
  return Boolean(storage?.getItem(CONSENT_PREFERENCES_STORAGE_KEY));
}

export function isConsentPolicyVersionCurrent(preferences) {
  return preferences?.policyVersion === CONSENT_POLICY_VERSION;
}

export function shouldShowConsentBanner() {
  const storage = getStorage();
  if (!storage) return false;

  const storedValue = storage.getItem(CONSENT_PREFERENCES_STORAGE_KEY);
  if (!storedValue) return true;

  const parsed = safeParse(storedValue);
  if (!parsed || typeof parsed !== 'object') return true;

  return !isConsentPolicyVersionCurrent(normalizeConsentPreferences(parsed));
}
