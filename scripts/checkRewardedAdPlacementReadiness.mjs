import {
  getRewardedAdPlacementEnvKey,
  REWARDED_AD_PLACEMENT_KEYS,
  REWARDED_AD_PLACEMENTS,
  resolveRewardedAdPlacementId,
} from '../src/config/rewardedAdPlacements.js';
import {
  getRewardedAdSdkConfig,
  REWARDED_AD_PROVIDER_KEY,
} from '../src/config/rewardedAdSdkConfig.js';

const failures = [];

const REQUIRED_PLACEMENT_KEYS = [
  'TODAY_FORTUNE_DETAIL',
  'SAJU_INSIGHT_DEEP_DIVE',
  'YEAR_FORTUNE_DETAIL',
  'ZODIAC_FORTUNE_DETAIL',
];

const EXPECTED_ENV_KEYS = {
  TODAY_FORTUNE_DETAIL: 'VITE_REWARDED_AD_PLACEMENT_TODAY_FORTUNE_DETAIL',
  SAJU_INSIGHT_DEEP_DIVE: 'VITE_REWARDED_AD_PLACEMENT_SAJU_INSIGHT_DEEP_DIVE',
  YEAR_FORTUNE_DETAIL: 'VITE_REWARDED_AD_PLACEMENT_YEAR_FORTUNE_DETAIL',
  ZODIAC_FORTUNE_DETAIL: 'VITE_REWARDED_AD_PLACEMENT_ZODIAC_FORTUNE_DETAIL',
};

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

const requiredPlacementKeysExist = REQUIRED_PLACEMENT_KEYS.every((key) => REWARDED_AD_PLACEMENT_KEYS[key] === key);
logResult('required_placement_keys_exist', requiredPlacementKeysExist);
assertCondition(requiredPlacementKeysExist, 'all required placement keys should exist');

const requiredPlacementIdsExist = REQUIRED_PLACEMENT_KEYS.every((key) => {
  const placementId = REWARDED_AD_PLACEMENTS[key];
  return typeof placementId === 'string' && placementId.length > 0;
});
logResult('required_placement_ids_exist', requiredPlacementIdsExist);
assertCondition(requiredPlacementIdsExist, 'all fallback placement ids should be non-empty strings');

const envKeyMapping = REQUIRED_PLACEMENT_KEYS.every(
  (key) => getRewardedAdPlacementEnvKey(key) === EXPECTED_ENV_KEYS[key],
);
logResult('env_key_mapping', envKeyMapping);
assertCondition(envKeyMapping, 'all placement keys should map to expected Vite env names');

const providerPlacementOverride = resolveRewardedAdPlacementId('TODAY_FORTUNE_DETAIL', {
  VITE_REWARDED_AD_PLACEMENT_TODAY_FORTUNE_DETAIL: 'provider_today_test',
});
const envOverrideResolves = providerPlacementOverride === 'provider_today_test';
logResult('env_override_resolves_provider_placement', envOverrideResolves);
assertCondition(envOverrideResolves, 'env override should resolve provider placement id');

const fallbackPlacement = resolveRewardedAdPlacementId('TODAY_FORTUNE_DETAIL', {});
const missingEnvFallsBack = fallbackPlacement === REWARDED_AD_PLACEMENTS.TODAY_FORTUNE_DETAIL;
logResult('missing_env_falls_back_to_internal_placement', missingEnvFallsBack);
assertCondition(missingEnvFallsBack, 'missing env should fall back to internal placement id');

const unknownKeyValue = resolveRewardedAdPlacementId('UNKNOWN_PLACEMENT_KEY', {});
const unknownKeySafe =
  typeof unknownKeyValue === 'string' &&
  unknownKeyValue.length > 0 &&
  unknownKeyValue === REWARDED_AD_PLACEMENTS.TODAY_FORTUNE_DETAIL;
logResult('unknown_key_returns_safe_value', unknownKeySafe);
assertCondition(unknownKeySafe, 'unknown placement key should return safe fallback value');

const sdkConfigEnabled = getRewardedAdSdkConfig({
  VITE_REWARDED_AD_PROVIDER: 'sdk',
  VITE_REWARDED_AD_SDK_ENABLED: 'true',
});
const sdkConfigCanBeEnabled =
  sdkConfigEnabled.provider === REWARDED_AD_PROVIDER_KEY.SDK && sdkConfigEnabled.sdkEnabled === true;
logResult('sdk_config_can_be_enabled', sdkConfigCanBeEnabled);
assertCondition(sdkConfigCanBeEnabled, 'sdk config should enable SDK provider from env override');

const sdkConfigDefault = getRewardedAdSdkConfig({});
const sdkConfigDefaultMock =
  sdkConfigDefault.provider === REWARDED_AD_PROVIDER_KEY.MOCK && sdkConfigDefault.sdkEnabled === false;
logResult('sdk_config_default_mock', sdkConfigDefaultMock);
assertCondition(sdkConfigDefaultMock, 'sdk config should default to mock provider');

if (failures.length > 0) {
  console.error('Rewarded ad placement readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Rewarded ad placement readiness check passed');
}
