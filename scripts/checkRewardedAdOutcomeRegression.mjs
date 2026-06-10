import {
  getRewardedAdOutcomeMessage,
  REWARDED_AD_OUTCOME,
  REWARDED_AD_PROVIDER,
  showRewardedAd,
} from '../src/services/rewardedAdService.js';

const failures = [];

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

async function checkOutcome({ sampleId, mockOutcome, expectedOk, expectedReason }) {
  const result = await showRewardedAd({
    placementId: 'overall',
    categoryLabel: '오늘운세',
    mockOutcome,
    delayMs: 0,
  });

  console.log(`sampleId: ${sampleId}`);
  console.log(`ok: ${result.ok}`);
  console.log(`provider: ${result.provider}`);
  console.log(`reason: ${result.reason || 'none'}`);
  console.log(`rewardedAt: ${result.rewardedAt}`);

  assertCondition(result.ok === expectedOk, `${sampleId}: expected ok ${expectedOk}, got ${result.ok}`);
  assertCondition(
    result.provider === REWARDED_AD_PROVIDER,
    `${sampleId}: expected provider ${REWARDED_AD_PROVIDER}, got ${result.provider}`,
  );

  if (expectedOk) {
    assertCondition(typeof result.rewardedAt === 'string', `${sampleId}: rewardedAt should be a string`);
  } else {
    assertCondition(result.reason === expectedReason, `${sampleId}: expected reason ${expectedReason}, got ${result.reason}`);
    assertCondition(result.rewardedAt === null, `${sampleId}: rewardedAt should be null`);
  }

  console.log(`result: ${failures.length === 0 ? 'pass' : 'checked'}`);
  console.log('');
}

await checkOutcome({
  sampleId: 'completed_default',
  expectedOk: true,
});

await checkOutcome({
  sampleId: 'completed_explicit',
  mockOutcome: REWARDED_AD_OUTCOME.COMPLETED,
  expectedOk: true,
});

await checkOutcome({
  sampleId: 'load_failed',
  mockOutcome: REWARDED_AD_OUTCOME.LOAD_FAILED,
  expectedOk: false,
  expectedReason: REWARDED_AD_OUTCOME.LOAD_FAILED,
});

await checkOutcome({
  sampleId: 'canceled',
  mockOutcome: REWARDED_AD_OUTCOME.CANCELED,
  expectedOk: false,
  expectedReason: REWARDED_AD_OUTCOME.CANCELED,
});

await checkOutcome({
  sampleId: 'no_reward',
  mockOutcome: REWARDED_AD_OUTCOME.NO_REWARD,
  expectedOk: false,
  expectedReason: REWARDED_AD_OUTCOME.NO_REWARD,
});

globalThis.__HARUPULI_REWARDED_AD_MOCK_OUTCOME__ = REWARDED_AD_OUTCOME.NO_REWARD;
const globalMockResult = await showRewardedAd({
  placementId: 'test',
  categoryLabel: '테스트',
  delayMs: 0,
});
delete globalThis.__HARUPULI_REWARDED_AD_MOCK_OUTCOME__;

console.log('sampleId: global_mock_outcome');
console.log(`ok: ${globalMockResult.ok}`);
console.log(`reason: ${globalMockResult.reason}`);
console.log(`result: ${!globalMockResult.ok && globalMockResult.reason === REWARDED_AD_OUTCOME.NO_REWARD ? 'pass' : 'fail'}`);
console.log('');

assertCondition(globalMockResult.ok === false, 'global_mock_outcome: ok should be false');
assertCondition(
  globalMockResult.reason === REWARDED_AD_OUTCOME.NO_REWARD,
  `global_mock_outcome: expected reason ${REWARDED_AD_OUTCOME.NO_REWARD}, got ${globalMockResult.reason}`,
);

for (const reason of Object.values(REWARDED_AD_OUTCOME)) {
  const message = getRewardedAdOutcomeMessage(reason);
  assertCondition(typeof message === 'string' && message.length > 0, `message for ${reason} should not be empty`);
}

if (failures.length > 0) {
  console.log('failures:');
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exitCode = 1;
}
