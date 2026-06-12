import {
  REWARDED_AD_OUTCOME,
  REWARDED_AD_PROVIDER_TYPE,
} from './rewardedAdProvider.types.js';

export async function showSdkRewardedAd({ placementId, categoryLabel } = {}) {
  return {
    ok: false,
    provider: REWARDED_AD_PROVIDER_TYPE.SDK,
    placementId,
    categoryLabel,
    reason: REWARDED_AD_OUTCOME.SDK_UNAVAILABLE,
    rewardedAt: null,
  };
}
