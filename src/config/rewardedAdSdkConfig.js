export const REWARDED_AD_PROVIDER_KEY = {
  MOCK: 'mock',
  SDK: 'sdk',
};

export const REWARDED_AD_PROVIDER_ENV_KEY = 'VITE_REWARDED_AD_PROVIDER';
export const REWARDED_AD_SDK_ENABLED_ENV_KEY = 'VITE_REWARDED_AD_SDK_ENABLED';
export const REWARDED_AD_MODE_ENV_KEY = 'VITE_REWARDED_AD_MODE';
export const REWARDED_AD_BUILD_TARGET_ENV_KEY = 'VITE_REWARDED_AD_BUILD_TARGET';
export const REWARDED_AD_UNIT_ID_ENV_KEY = 'VITE_REWARDED_AD_UNIT_ID';

export const REWARDED_AD_MODE = Object.freeze({
  DISABLED: 'disabled',
  OFFICIAL_TEST: 'official_test',
  PRODUCTION: 'production',
});

export const REWARDED_AD_BUILD_TARGET = Object.freeze({
  DEBUG: 'debug',
  RELEASE: 'release',
});

export const GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID =
  'ca-app-pub-3940256099942544/5224354917';

function readViteEnvValue(envKey, envOverride = {}) {
  if (Object.prototype.hasOwnProperty.call(envOverride, envKey)) {
    return envOverride[envKey];
  }

  try {
    return import.meta.env?.[envKey] || '';
  } catch {
    return '';
  }
}

export function normalizeRewardedAdUnitId(value) {
  return String(value ?? '').trim();
}

export function isValidAdMobRewardedAdUnitId(value) {
  return /^ca-app-pub-\d{16}\/\d{10}$/.test(normalizeRewardedAdUnitId(value));
}

export function getRewardedAdProviderKey(envOverride = {}) {
  const provider = String(
    readViteEnvValue(REWARDED_AD_PROVIDER_ENV_KEY, envOverride) || '',
  ).trim().toLowerCase();

  return provider || REWARDED_AD_PROVIDER_KEY.MOCK;
}

export function isRewardedAdSdkEnabled(envOverride = {}) {
  return String(
    readViteEnvValue(REWARDED_AD_SDK_ENABLED_ENV_KEY, envOverride) || '',
  ).trim().toLowerCase() === 'true';
}

export function isApprovedRewardedAdSdkConfig(config) {
  if (
    config?.configurationValid !== true ||
    config?.mockAllowed !== false ||
    config?.provider !== REWARDED_AD_PROVIDER_KEY.SDK ||
    config?.sdkEnabled !== true ||
    typeof config?.isTesting !== 'boolean' ||
    !isValidAdMobRewardedAdUnitId(config?.adId)
  ) {
    return false;
  }

  const officialTestApproved =
    config.mode === REWARDED_AD_MODE.OFFICIAL_TEST &&
    config.buildTarget === REWARDED_AD_BUILD_TARGET.DEBUG &&
    config.adId === GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID &&
    config.isTesting === true;
  const productionApproved =
    config.mode === REWARDED_AD_MODE.PRODUCTION &&
    config.buildTarget === REWARDED_AD_BUILD_TARGET.RELEASE &&
    config.adId !== GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID &&
    config.isTesting === false;

  return officialTestApproved || productionApproved;
}

export function getRewardedAdSdkConfig(envOverride = {}) {
  const provider = getRewardedAdProviderKey(envOverride);
  const sdkEnabled = isRewardedAdSdkEnabled(envOverride);
  const mode = String(
    readViteEnvValue(REWARDED_AD_MODE_ENV_KEY, envOverride) || '',
  ).trim().toLowerCase();
  const buildTarget = String(
    readViteEnvValue(REWARDED_AD_BUILD_TARGET_ENV_KEY, envOverride) || '',
  ).trim().toLowerCase();
  const productionAdUnitId = normalizeRewardedAdUnitId(
    readViteEnvValue(REWARDED_AD_UNIT_ID_ENV_KEY, envOverride),
  );
  const officialTestApproved =
    provider === REWARDED_AD_PROVIDER_KEY.SDK &&
    sdkEnabled &&
    mode === REWARDED_AD_MODE.OFFICIAL_TEST &&
    buildTarget === REWARDED_AD_BUILD_TARGET.DEBUG &&
    productionAdUnitId === '';
  const productionApproved =
    provider === REWARDED_AD_PROVIDER_KEY.SDK &&
    sdkEnabled &&
    mode === REWARDED_AD_MODE.PRODUCTION &&
    buildTarget === REWARDED_AD_BUILD_TARGET.RELEASE &&
    isValidAdMobRewardedAdUnitId(productionAdUnitId) &&
    productionAdUnitId !== GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID;
  const configurationValid = officialTestApproved || productionApproved;
  const mockBuildTargetApproved =
    buildTarget === '' ||
    buildTarget === REWARDED_AD_BUILD_TARGET.DEBUG;
  const mockAllowed =
    provider === REWARDED_AD_PROVIDER_KEY.MOCK &&
    sdkEnabled === false &&
    (mode === '' || mode === REWARDED_AD_MODE.DISABLED) &&
    mockBuildTargetApproved &&
    productionAdUnitId === '';

  return {
    provider,
    sdkEnabled,
    mode,
    buildTarget,
    configurationValid,
    adId: officialTestApproved
      ? GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID
      : productionApproved
        ? productionAdUnitId
        : '',
    isTesting: officialTestApproved,
    mockAllowed,
  };
}
