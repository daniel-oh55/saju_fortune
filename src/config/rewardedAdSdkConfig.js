export const REWARDED_AD_PROVIDER_KEY = {
  MOCK: 'mock',
  SDK: 'sdk',
};

export const REWARDED_AD_PROVIDER_ENV_KEY = 'VITE_REWARDED_AD_PROVIDER';
export const REWARDED_AD_SDK_ENABLED_ENV_KEY = 'VITE_REWARDED_AD_SDK_ENABLED';
export const REWARDED_AD_MODE_ENV_KEY = 'VITE_REWARDED_AD_MODE';
export const REWARDED_AD_BUILD_TARGET_ENV_KEY = 'VITE_REWARDED_AD_BUILD_TARGET';

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

export function getRewardedAdProviderKey(envOverride = {}) {
  const provider = String(readViteEnvValue(REWARDED_AD_PROVIDER_ENV_KEY, envOverride) || '').toLowerCase();

  if (provider === REWARDED_AD_PROVIDER_KEY.SDK) {
    return REWARDED_AD_PROVIDER_KEY.SDK;
  }

  return REWARDED_AD_PROVIDER_KEY.MOCK;
}

export function isRewardedAdSdkEnabled(envOverride = {}) {
  return String(readViteEnvValue(REWARDED_AD_SDK_ENABLED_ENV_KEY, envOverride) || '').toLowerCase() === 'true';
}

export function getRewardedAdSdkConfig(envOverride = {}) {
  const mode = String(readViteEnvValue(REWARDED_AD_MODE_ENV_KEY, envOverride) || '').toLowerCase();
  const buildTarget = String(
    readViteEnvValue(REWARDED_AD_BUILD_TARGET_ENV_KEY, envOverride) || '',
  ).toLowerCase();
  const configurationValid =
    getRewardedAdProviderKey(envOverride) === REWARDED_AD_PROVIDER_KEY.SDK &&
    isRewardedAdSdkEnabled(envOverride) &&
    mode === REWARDED_AD_MODE.OFFICIAL_TEST &&
    buildTarget === REWARDED_AD_BUILD_TARGET.DEBUG;

  return {
    provider: getRewardedAdProviderKey(envOverride),
    sdkEnabled: isRewardedAdSdkEnabled(envOverride),
    mode,
    buildTarget,
    configurationValid,
    adId: configurationValid ? GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID : '',
    isTesting: configurationValid,
  };
}
