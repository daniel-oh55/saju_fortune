import {
  getRewardedAdPlacementEnvKey,
  getRewardedAdPlacementId,
  resolveRewardedAdPlacementId,
} from '../src/config/rewardedAdPlacements.js';

const failures = [];

function assertEqual(sampleId, actual, expected) {
  const isPass = actual === expected;

  console.log(`sampleId: ${sampleId}`);
  console.log(`actual: ${actual}`);
  console.log(`expected: ${expected}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');

  if (!isPass) {
    failures.push(`${sampleId}: expected ${expected}, got ${actual}`);
  }
}

assertEqual(
  'fallback_today_fortune_detail',
  resolveRewardedAdPlacementId('TODAY_FORTUNE_DETAIL'),
  'today_fortune_detail',
);

assertEqual(
  'fallback_saju_insight_deep_dive',
  resolveRewardedAdPlacementId('SAJU_INSIGHT_DEEP_DIVE'),
  'saju_insight_deep_dive',
);

assertEqual(
  'env_override_today_fortune_detail',
  resolveRewardedAdPlacementId('TODAY_FORTUNE_DETAIL', {
    VITE_REWARDED_AD_PLACEMENT_TODAY_FORTUNE_DETAIL: 'ca-app-pub-test-today',
  }),
  'ca-app-pub-test-today',
);

assertEqual(
  'env_override_saju_insight_deep_dive',
  resolveRewardedAdPlacementId('SAJU_INSIGHT_DEEP_DIVE', {
    VITE_REWARDED_AD_PLACEMENT_SAJU_INSIGHT_DEEP_DIVE: 'ca-app-pub-test-saju',
  }),
  'ca-app-pub-test-saju',
);

assertEqual(
  'unknown_key_fallback',
  resolveRewardedAdPlacementId('UNKNOWN'),
  'today_fortune_detail',
);

assertEqual(
  'env_key_lookup',
  getRewardedAdPlacementEnvKey('SAJU_INSIGHT_DEEP_DIVE'),
  'VITE_REWARDED_AD_PLACEMENT_SAJU_INSIGHT_DEEP_DIVE',
);

assertEqual(
  'existing_config_compatibility_today',
  getRewardedAdPlacementId('TODAY_FORTUNE_DETAIL'),
  'today_fortune_detail',
);

assertEqual(
  'existing_config_compatibility_saju',
  getRewardedAdPlacementId('SAJU_INSIGHT_DEEP_DIVE'),
  'saju_insight_deep_dive',
);

if (failures.length > 0) {
  console.log('failures:');
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exitCode = 1;
}
