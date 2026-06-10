import {
  getMockRewardedAdDurationSeconds,
  getRewardedAdOutcomeMessage,
  REWARDED_AD_OUTCOME,
  REWARDED_AD_PROVIDER,
  showRewardedAd,
} from '../src/services/rewardedAdService.js';

const failures = [];

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

const isProviderExportValid = REWARDED_AD_PROVIDER === 'mock_rewarded_ad';
assertCondition(
  isProviderExportValid,
  `REWARDED_AD_PROVIDER should be mock_rewarded_ad, got ${REWARDED_AD_PROVIDER}`,
);
logResult('service_exports_provider', isProviderExportValid);

const expectedOutcomes = {
  COMPLETED: 'completed',
  LOAD_FAILED: 'load_failed',
  CANCELED: 'canceled',
  NO_REWARD: 'no_reward',
};
const areOutcomesValid = Object.entries(expectedOutcomes).every(
  ([key, value]) => REWARDED_AD_OUTCOME[key] === value,
);
assertCondition(areOutcomesValid, 'REWARDED_AD_OUTCOME should keep completed/load_failed/canceled/no_reward values');
logResult('service_exports_outcomes', areOutcomesValid);

const completedResult = await showRewardedAd({
  placementId: 'today_fortune_detail',
  categoryLabel: '오늘운세',
  delayMs: 0,
});
const isCompletedValid =
  completedResult.ok === true &&
  completedResult.provider === 'mock_rewarded_ad' &&
  completedResult.placementId === 'today_fortune_detail' &&
  typeof completedResult.rewardedAt === 'string';
assertCondition(isCompletedValid, 'default mock provider should complete with provider, placementId, and rewardedAt');
logResult('mock_provider_default_completed', isCompletedValid);

const failedResult = await showRewardedAd({
  placementId: 'today_fortune_detail',
  categoryLabel: '오늘운세',
  mockOutcome: REWARDED_AD_OUTCOME.NO_REWARD,
  delayMs: 0,
});
const isFailureValid = failedResult.ok === false && failedResult.reason === REWARDED_AD_OUTCOME.NO_REWARD;
assertCondition(isFailureValid, `NO_REWARD should pass through as failed result, got ${failedResult.reason}`);
logResult('mock_provider_failure_passthrough', isFailureValid);

const canceledMessage = getRewardedAdOutcomeMessage(REWARDED_AD_OUTCOME.CANCELED);
const isMessageValid = typeof canceledMessage === 'string' && canceledMessage.length > 0;
assertCondition(isMessageValid, 'canceled outcome message should not be empty');
logResult('outcome_message_compatibility', isMessageValid);

const duration = getMockRewardedAdDurationSeconds();
const isDurationValid = duration === 2;
assertCondition(isDurationValid, `mock duration should be 2, got ${duration}`);
logResult('existing_checks_compatibility', isDurationValid);

if (failures.length > 0) {
  console.log('failures:');
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exitCode = 1;
}
