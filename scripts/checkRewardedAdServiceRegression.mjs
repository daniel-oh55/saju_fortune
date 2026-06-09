import {
  getMockRewardedAdDurationSeconds,
  REWARDED_AD_PROVIDER,
  showRewardedAd,
} from '../src/services/rewardedAdService.js';

const failures = [];

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

const duration = getMockRewardedAdDurationSeconds();

console.log('sampleId: rewarded_ad_service_duration');
console.log(`durationSeconds: ${duration}`);
console.log(`result: ${duration === 2 ? 'pass' : 'fail'}`);
console.log('');

assertCondition(duration === 2, `duration should be 2, got ${duration}`);
assertCondition(
  REWARDED_AD_PROVIDER === 'mock_rewarded_ad',
  `provider constant should be mock_rewarded_ad, got ${REWARDED_AD_PROVIDER}`,
);

const result = await showRewardedAd({
  placementId: 'sajuInsightDeepDive',
  categoryLabel: '사주 심화 해석',
});

console.log('sampleId: rewarded_ad_service_show_rewarded_ad');
console.log(`ok: ${result.ok}`);
console.log(`provider: ${result.provider}`);
console.log(`placementId: ${result.placementId}`);
console.log(`categoryLabel: ${result.categoryLabel}`);
console.log(`rewardedAt: ${result.rewardedAt}`);

assertCondition(result.ok === true, 'showRewardedAd result.ok should be true');
assertCondition(
  result.provider === 'mock_rewarded_ad',
  `provider should be mock_rewarded_ad, got ${result.provider}`,
);
assertCondition(
  result.placementId === 'sajuInsightDeepDive',
  `placementId should be sajuInsightDeepDive, got ${result.placementId}`,
);
assertCondition(
  result.categoryLabel === '사주 심화 해석',
  `categoryLabel should be 사주 심화 해석, got ${result.categoryLabel}`,
);
assertCondition(typeof result.rewardedAt === 'string', 'rewardedAt should be a string');

console.log(`result: ${failures.length === 0 ? 'pass' : 'fail'}`);

if (failures.length > 0) {
  console.log('');
  console.log('failures:');
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exitCode = 1;
}
