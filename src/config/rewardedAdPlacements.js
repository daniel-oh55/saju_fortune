export const REWARDED_AD_PLACEMENT_KEYS = {
  TODAY_FORTUNE_DETAIL: 'TODAY_FORTUNE_DETAIL',
  SAJU_INSIGHT_DEEP_DIVE: 'SAJU_INSIGHT_DEEP_DIVE',
  YEAR_FORTUNE_DETAIL: 'YEAR_FORTUNE_DETAIL',
  ZODIAC_FORTUNE_DETAIL: 'ZODIAC_FORTUNE_DETAIL',
};

export const REWARDED_AD_PLACEMENTS = {
  TODAY_FORTUNE_DETAIL: 'today_fortune_detail',
  SAJU_INSIGHT_DEEP_DIVE: 'saju_insight_deep_dive',
  YEAR_FORTUNE_DETAIL: 'year_fortune_detail',
  ZODIAC_FORTUNE_DETAIL: 'zodiac_fortune_detail',
};

const ENV_KEY_BY_PLACEMENT_KEY = {
  TODAY_FORTUNE_DETAIL: 'VITE_REWARDED_AD_PLACEMENT_TODAY_FORTUNE_DETAIL',
  SAJU_INSIGHT_DEEP_DIVE: 'VITE_REWARDED_AD_PLACEMENT_SAJU_INSIGHT_DEEP_DIVE',
  YEAR_FORTUNE_DETAIL: 'VITE_REWARDED_AD_PLACEMENT_YEAR_FORTUNE_DETAIL',
  ZODIAC_FORTUNE_DETAIL: 'VITE_REWARDED_AD_PLACEMENT_ZODIAC_FORTUNE_DETAIL',
};

function readViteEnvValue(envKey) {
  try {
    return import.meta.env?.[envKey] || '';
  } catch {
    return '';
  }
}

export function getRewardedAdPlacementId(key) {
  return REWARDED_AD_PLACEMENTS[key] || REWARDED_AD_PLACEMENTS.TODAY_FORTUNE_DETAIL;
}

export function resolveRewardedAdPlacementId(key, envOverride = {}) {
  const fallbackPlacementId = getRewardedAdPlacementId(key);
  const envKey = ENV_KEY_BY_PLACEMENT_KEY[key];

  if (!envKey) return fallbackPlacementId;

  const overrideValue = envOverride[envKey];
  const envValue = typeof overrideValue === 'string' ? overrideValue : readViteEnvValue(envKey);

  return envValue || fallbackPlacementId;
}

export function getRewardedAdPlacementEnvKey(key) {
  return ENV_KEY_BY_PLACEMENT_KEY[key] || '';
}
