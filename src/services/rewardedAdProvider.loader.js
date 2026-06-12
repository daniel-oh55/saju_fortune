import {
  getRewardedAdSdkConfig,
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

export async function showRewardedAdWithResolvedProvider(options = {}, envOverride = {}) {
  const config = resolveRewardedAdProvider(envOverride);

  if (config.provider === REWARDED_AD_PROVIDER_KEY.SDK) {
    if (!config.sdkEnabled) {
      return {
        ok: false,
        provider: REWARDED_AD_PROVIDER_TYPE.SDK,
        placementId: options.placementId,
        categoryLabel: options.categoryLabel,
        reason: REWARDED_AD_OUTCOME.SDK_UNAVAILABLE,
        rewardedAt: null,
      };
    }

    if (options.consentPreferences?.ads !== true) {
      return {
        ok: false,
        provider: REWARDED_AD_PROVIDER_TYPE.SDK,
        placementId: options.placementId,
        categoryLabel: options.categoryLabel,
        reason: REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED,
        rewardedAt: null,
      };
    }

    if (config.sdkEnabled) {
      return showSdkRewardedAd(options);
    }
  }

  return showMockRewardedAd(options);
}
