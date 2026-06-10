export const REWARDED_AD_PLACEMENTS = {
  TODAY_FORTUNE_DETAIL: 'today_fortune_detail',
  SAJU_INSIGHT_DEEP_DIVE: 'saju_insight_deep_dive',
  YEAR_FORTUNE_DETAIL: 'year_fortune_detail',
  ZODIAC_FORTUNE_DETAIL: 'zodiac_fortune_detail',
};

export function getRewardedAdPlacementId(key) {
  return REWARDED_AD_PLACEMENTS[key] || REWARDED_AD_PLACEMENTS.TODAY_FORTUNE_DETAIL;
}
