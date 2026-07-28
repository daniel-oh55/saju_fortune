import {
  getRewardedAdSdkConfig,
  isApprovedRewardedAdSdkConfig,
  REWARDED_AD_PROVIDER_KEY,
} from '../config/rewardedAdSdkConfig.js';
import { showMockRewardedAd } from './rewardedAdProvider.mock.js';
import { showSdkRewardedAd } from './rewardedAdProvider.sdk.js';
import {
  REWARDED_AD_OUTCOME,
  REWARDED_AD_PROVIDER_TYPE,
} from './rewardedAdProvider.types.js';

export function resolveRewardedAdProvider(envOverride = {}) {
  return getRewardedAdSdkConfig(envOverride);
}

function sdkFailure(options, reason = REWARDED_AD_OUTCOME.SDK_UNAVAILABLE) {
  return {
    ok: false,
    provider: REWARDED_AD_PROVIDER_TYPE.SDK,
    placementId: options.placementId,
    categoryLabel: options.categoryLabel,
    reason,
    rewardedAt: null,
  };
}

export function createRewardedAdProviderLoader(dependencyOverrides = {}) {
  const showMock = dependencyOverrides.showMock || showMockRewardedAd;
  const showSdk = dependencyOverrides.showSdk || showSdkRewardedAd;

  return function showWithResolvedProvider(options = {}, envOverride = {}) {
    const config = resolveRewardedAdProvider(envOverride);

    if (config.mockAllowed === true) {
      return showMock(options);
    }

    if (isApprovedRewardedAdSdkConfig(config)) {
      return showSdk({ ...options, config });
    }

    const legacySdkConsentPrecondition =
      config.provider === REWARDED_AD_PROVIDER_KEY.SDK &&
      config.sdkEnabled === true &&
      config.mode === '' &&
      config.buildTarget === '' &&
      config.adId === '' &&
      options.consentPreferences?.ads !== true;
    if (legacySdkConsentPrecondition) {
      return Promise.resolve(
        sdkFailure(options, REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED),
      );
    }

    return Promise.resolve(sdkFailure(options));
  };
}

const defaultLoader = createRewardedAdProviderLoader();

export function showRewardedAdWithResolvedProvider(options = {}, envOverride = {}) {
  return defaultLoader(options, envOverride);
}
