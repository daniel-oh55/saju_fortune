export const BANNER_AD_PROVIDER_KEY = {
  NONE: 'none',
  SDK: 'sdk',
};

export const BANNER_AD_PROVIDER_ENV_KEY = 'VITE_BANNER_AD_PROVIDER';
export const BANNER_AD_SDK_ENABLED_ENV_KEY = 'VITE_BANNER_AD_SDK_ENABLED';
export const BANNER_AD_MODE_ENV_KEY = 'VITE_BANNER_AD_MODE';
export const BANNER_AD_BUILD_TARGET_ENV_KEY = 'VITE_BANNER_AD_BUILD_TARGET';
export const BANNER_AD_UNIT_ID_ENV_KEY = 'VITE_BANNER_AD_UNIT_ID';

export const BANNER_AD_MODE = Object.freeze({
  DISABLED: 'disabled',
  OFFICIAL_TEST: 'official_test',
  PRODUCTION: 'production',
});

export const BANNER_AD_BUILD_TARGET = Object.freeze({
  DEBUG: 'debug',
  RELEASE: 'release',
});

export const GOOGLE_OFFICIAL_ANDROID_ADAPTIVE_BANNER_TEST_AD_UNIT_ID =
  'ca-app-pub-3940256099942544/9214589741';

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

export function normalizeBannerAdUnitId(value) {
  return String(value ?? '').trim();
}

export function isValidAdMobBannerAdUnitId(value) {
  return /^ca-app-pub-\d{16}\/\d{10}$/.test(normalizeBannerAdUnitId(value));
}

export function getBannerAdProviderKey(envOverride = {}) {
  const provider = String(
    readViteEnvValue(BANNER_AD_PROVIDER_ENV_KEY, envOverride) || '',
  ).trim().toLowerCase();

  return provider || BANNER_AD_PROVIDER_KEY.NONE;
}

export function isBannerAdSdkEnabled(envOverride = {}) {
  return String(
    readViteEnvValue(BANNER_AD_SDK_ENABLED_ENV_KEY, envOverride) || '',
  ).trim().toLowerCase() === 'true';
}

export function getBannerAdSdkConfig(envOverride = {}) {
  const provider = getBannerAdProviderKey(envOverride);
  const sdkEnabled = isBannerAdSdkEnabled(envOverride);
  const mode = String(
    readViteEnvValue(BANNER_AD_MODE_ENV_KEY, envOverride) || '',
  ).trim().toLowerCase();
  const buildTarget = String(
    readViteEnvValue(BANNER_AD_BUILD_TARGET_ENV_KEY, envOverride) || '',
  ).trim().toLowerCase();
  const productionAdUnitId = normalizeBannerAdUnitId(
    readViteEnvValue(BANNER_AD_UNIT_ID_ENV_KEY, envOverride),
  );
  const officialTestApproved =
    provider === BANNER_AD_PROVIDER_KEY.SDK &&
    sdkEnabled &&
    mode === BANNER_AD_MODE.OFFICIAL_TEST &&
    buildTarget === BANNER_AD_BUILD_TARGET.DEBUG &&
    productionAdUnitId === '';
  const productionApproved =
    provider === BANNER_AD_PROVIDER_KEY.SDK &&
    sdkEnabled &&
    mode === BANNER_AD_MODE.PRODUCTION &&
    buildTarget === BANNER_AD_BUILD_TARGET.RELEASE &&
    isValidAdMobBannerAdUnitId(productionAdUnitId) &&
    productionAdUnitId !== GOOGLE_OFFICIAL_ANDROID_ADAPTIVE_BANNER_TEST_AD_UNIT_ID;
  const configurationValid = officialTestApproved || productionApproved;

  return {
    provider,
    sdkEnabled,
    mode,
    buildTarget,
    configurationValid,
    adId: officialTestApproved
      ? GOOGLE_OFFICIAL_ANDROID_ADAPTIVE_BANNER_TEST_AD_UNIT_ID
      : productionApproved
        ? productionAdUnitId
        : '',
    isTesting: officialTestApproved,
  };
}

export function isApprovedBannerAdSdkConfig(config) {
  if (
    config?.configurationValid !== true ||
    config?.provider !== BANNER_AD_PROVIDER_KEY.SDK ||
    config?.sdkEnabled !== true ||
    typeof config?.isTesting !== 'boolean' ||
    !isValidAdMobBannerAdUnitId(config?.adId)
  ) {
    return false;
  }

  const officialTestApproved =
    config.mode === BANNER_AD_MODE.OFFICIAL_TEST &&
    config.buildTarget === BANNER_AD_BUILD_TARGET.DEBUG &&
    config.adId === GOOGLE_OFFICIAL_ANDROID_ADAPTIVE_BANNER_TEST_AD_UNIT_ID &&
    config.isTesting === true;
  const productionApproved =
    config.mode === BANNER_AD_MODE.PRODUCTION &&
    config.buildTarget === BANNER_AD_BUILD_TARGET.RELEASE &&
    config.adId !== GOOGLE_OFFICIAL_ANDROID_ADAPTIVE_BANNER_TEST_AD_UNIT_ID &&
    config.isTesting === false;

  return officialTestApproved || productionApproved;
}
