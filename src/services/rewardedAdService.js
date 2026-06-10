const MOCK_AD_SECONDS = 2;

export const REWARDED_AD_PROVIDER = 'mock_rewarded_ad';

export const REWARDED_AD_OUTCOME = {
  COMPLETED: 'completed',
  LOAD_FAILED: 'load_failed',
  CANCELED: 'canceled',
  NO_REWARD: 'no_reward',
};

export function getMockRewardedAdDurationSeconds() {
  return MOCK_AD_SECONDS;
}

export function getRewardedAdOutcomeMessage(reason) {
  if (reason === REWARDED_AD_OUTCOME.LOAD_FAILED) {
    return '광고를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
  }

  if (reason === REWARDED_AD_OUTCOME.CANCELED) {
    return '광고 시청이 완료되지 않았습니다. 다시 시도하면 심화 해석을 열 수 있어요.';
  }

  if (reason === REWARDED_AD_OUTCOME.NO_REWARD) {
    return '보상 확인이 완료되지 않았습니다. 잠시 후 다시 시도해주세요.';
  }

  return '광고 보상 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

export async function showRewardedAd({ placementId, categoryLabel, mockOutcome, delayMs } = {}) {
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
