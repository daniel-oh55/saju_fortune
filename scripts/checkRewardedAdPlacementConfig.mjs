import {
  getRewardedAdPlacementId,
  REWARDED_AD_PLACEMENTS,
} from '../src/config/rewardedAdPlacements.js';

const failures = [];

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logCheck(sampleId, result) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${result ? 'pass' : 'fail'}`);
  console.log('');
}

const checks = [
  {
    sampleId: 'today_fortune_detail_constant',
    result: REWARDED_AD_PLACEMENTS.TODAY_FORTUNE_DETAIL === 'today_fortune_detail',
    message: 'TODAY_FORTUNE_DETAIL should be today_fortune_detail',
  },
  {
    sampleId: 'saju_insight_deep_dive_constant',
    result: REWARDED_AD_PLACEMENTS.SAJU_INSIGHT_DEEP_DIVE === 'saju_insight_deep_dive',
    message: 'SAJU_INSIGHT_DEEP_DIVE should be saju_insight_deep_dive',
  },
  {
    sampleId: 'today_fortune_detail_lookup',
    result: getRewardedAdPlacementId('TODAY_FORTUNE_DETAIL') === 'today_fortune_detail',
    message: 'TODAY_FORTUNE_DETAIL lookup should return today_fortune_detail',
  },
  {
    sampleId: 'saju_insight_deep_dive_lookup',
    result: getRewardedAdPlacementId('SAJU_INSIGHT_DEEP_DIVE') === 'saju_insight_deep_dive',
    message: 'SAJU_INSIGHT_DEEP_DIVE lookup should return saju_insight_deep_dive',
  },
  {
    sampleId: 'unknown_key_fallback',
    result: getRewardedAdPlacementId('UNKNOWN_PLACEMENT') === 'today_fortune_detail',
    message: 'unknown placement key should fallback to today_fortune_detail',
  },
  {
    sampleId: 'unlock_key_and_placement_id_are_separate',
    result: 'sajuInsightDeepDive' !== REWARDED_AD_PLACEMENTS.SAJU_INSIGHT_DEEP_DIVE,
    message: 'unlock key sajuInsightDeepDive should differ from placementId saju_insight_deep_dive',
  },
];

for (const check of checks) {
  assertCondition(check.result, check.message);
  logCheck(check.sampleId, check.result);
}

if (failures.length > 0) {
  console.log('failures:');
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exitCode = 1;
}
