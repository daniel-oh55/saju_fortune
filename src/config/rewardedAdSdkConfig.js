export const REWARDED_AD_PROVIDER_KEY = {
  MOCK: 'mock',
  SDK: 'sdk',
};

export const REWARDED_AD_PROVIDER_ENV_KEY = 'VITE_REWARDED_AD_PROVIDER';
export const REWARDED_AD_SDK_ENABLED_ENV_KEY = 'VITE_REWARDED_AD_SDK_ENABLED';

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
  return {
    provider: getRewardedAdProviderKey(envOverride),
    sdkEnabled: isRewardedAdSdkEnabled(envOverride),
  };
}
