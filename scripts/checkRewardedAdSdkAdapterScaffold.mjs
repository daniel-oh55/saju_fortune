import {
  getRewardedAdOutcomeMessage,
  REWARDED_AD_OUTCOME,
  REWARDED_AD_PROVIDER,
  showRewardedAd,
} from '../src/services/rewardedAdService.js';
import { REWARDED_AD_PROVIDER_TYPE } from '../src/services/rewardedAdProvider.types.js';

const failures = [];

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

async function checkMockCompleted(sampleId, envOverride) {
  const result = await showRewardedAd({
    placementId: 'test',
    categoryLabel: '테스트 광고',
    delayMs: 0,
    envOverride,
  });

  const isPass = result.ok === true && result.provider === REWARDED_AD_PROVIDER;
  logResult(sampleId, isPass);
  assertCondition(isPass, `${sampleId}: expected mock completed result`);
}

await checkMockCompleted('default_provider_is_mock');
await checkMockCompleted('mock_provider_completed', {
  VITE_REWARDED_AD_PROVIDER: 'mock',
});

const sdkDisabled = await showRewardedAd({
  placementId: 'test',
  categoryLabel: '테스트 광고',
  envOverride: {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'false',
  },
});
const sdkDisabledPass =
  sdkDisabled.ok === false &&
  sdkDisabled.provider === REWARDED_AD_PROVIDER_TYPE.SDK &&
  sdkDisabled.reason === REWARDED_AD_OUTCOME.SDK_UNAVAILABLE;
logResult('sdk_provider_disabled_returns_unavailable', sdkDisabledPass);
assertCondition(sdkDisabledPass, 'sdk disabled should return sdk_unavailable');

const sdkEnabled = await showRewardedAd({
  placementId: 'test',
  categoryLabel: '테스트 광고',
  consentPreferences: { ads: true },
  envOverride: {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
  },
});
const sdkEnabledPass =
  sdkEnabled.ok === false &&
  sdkEnabled.provider === REWARDED_AD_PROVIDER_TYPE.SDK &&
  sdkEnabled.reason === REWARDED_AD_OUTCOME.SDK_UNAVAILABLE;
logResult('sdk_provider_enabled_returns_unavailable_until_real_sdk_added', sdkEnabledPass);
assertCondition(sdkEnabledPass, 'sdk scaffold should return sdk_unavailable until real SDK is added');

await checkMockCompleted('unknown_provider_falls_back_to_mock', {
  VITE_REWARDED_AD_PROVIDER: 'unknown',
});

const unavailableMessage = getRewardedAdOutcomeMessage(REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
const unavailableMessagePass =
  typeof unavailableMessage === 'string' &&
  unavailableMessage.includes('준비 중') &&
  unavailableMessage.includes('무료 해석');
logResult('sdk_unavailable_message', unavailableMessagePass);
assertCondition(unavailableMessagePass, 'sdk unavailable message should be user-friendly');

const mockOutcomes = [
  [REWARDED_AD_OUTCOME.COMPLETED, true],
  [REWARDED_AD_OUTCOME.LOAD_FAILED, false],
  [REWARDED_AD_OUTCOME.CANCELED, false],
  [REWARDED_AD_OUTCOME.NO_REWARD, false],
];

let mockOutcomesPass = true;
for (const [mockOutcome, expectedOk] of mockOutcomes) {
  const result = await showRewardedAd({
    placementId: 'test',
    categoryLabel: '테스트 광고',
    mockOutcome,
    delayMs: 0,
    envOverride: {
      VITE_REWARDED_AD_PROVIDER: 'mock',
    },
  });

  const isPass =
    result.ok === expectedOk &&
    result.provider === REWARDED_AD_PROVIDER &&
    (expectedOk ? typeof result.rewardedAt === 'string' : result.reason === mockOutcome);

  mockOutcomesPass = mockOutcomesPass && isPass;
}
logResult('mock_outcomes_still_work', mockOutcomesPass);
assertCondition(mockOutcomesPass, 'mock outcomes should keep existing behavior');

if (failures.length > 0) {
  console.error('Rewarded ad sdk adapter scaffold check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Rewarded ad sdk adapter scaffold check passed');
}
