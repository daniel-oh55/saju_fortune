const MOCK_AD_SECONDS = 2;

export const REWARDED_AD_PROVIDER = 'mock_rewarded_ad';

export function getMockRewardedAdDurationSeconds() {
  return MOCK_AD_SECONDS;
}

export async function showRewardedAd({ placementId, categoryLabel }) {
  return new Promise((resolve) => {
    globalThis.setTimeout(() => {
      resolve({
        ok: true,
        provider: REWARDED_AD_PROVIDER,
        placementId,
        categoryLabel,
        rewardedAt: new Date().toISOString(),
      });
    }, MOCK_AD_SECONDS * 1000);
  });
}
