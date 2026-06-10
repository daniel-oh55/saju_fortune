import {
  REWARDED_AD_OUTCOME,
  REWARDED_AD_PROVIDER,
} from './rewardedAdProvider.types.js';

const MOCK_AD_SECONDS = 2;

export function getMockRewardedAdDurationSeconds() {
  return MOCK_AD_SECONDS;
}

export async function showMockRewardedAd({ placementId, categoryLabel, mockOutcome, delayMs } = {}) {
  const outcome =
    mockOutcome ||
    globalThis.__HARUPULI_REWARDED_AD_MOCK_OUTCOME__ ||
    REWARDED_AD_OUTCOME.COMPLETED;
  const waitMs = typeof delayMs === 'number' ? delayMs : MOCK_AD_SECONDS * 1000;

  await new Promise((resolve) => {
    globalThis.setTimeout(resolve, waitMs);
  });

  if (outcome === REWARDED_AD_OUTCOME.COMPLETED) {
    return {
      ok: true,
      provider: REWARDED_AD_PROVIDER,
      placementId,
      categoryLabel,
      rewardedAt: new Date().toISOString(),
    };
  }

  return {
    ok: false,
    provider: REWARDED_AD_PROVIDER,
    placementId,
    categoryLabel,
    reason: outcome,
    rewardedAt: null,
  };
}
