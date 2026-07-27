import {
  REWARDED_AD_OUTCOME,
  REWARDED_AD_PROVIDER,
} from './rewardedAdProvider.types.js';
import {
  getMockRewardedAdDurationSeconds,
} from './rewardedAdProvider.mock.js';
import { showRewardedAdWithResolvedProvider } from './rewardedAdProvider.loader.js';

export {
  getMockRewardedAdDurationSeconds,
  REWARDED_AD_OUTCOME,
  REWARDED_AD_PROVIDER,
};

export function getRewardedAdOutcomeMessage(reason) {
  if (reason === REWARDED_AD_OUTCOME.SDK_UNAVAILABLE) {
    return '광고 기능은 준비 중입니다. 지금은 기본 운세와 무료 해석을 계속 이용할 수 있습니다.';
  }

  if (reason === REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED) {
    return '광고와 데이터 사용 동의가 필요한 기능입니다. 데이터 사용 설정에서 변경할 수 있습니다. 기본 운세와 무료 해석은 계속 이용할 수 있습니다.';
  }

  if (reason === REWARDED_AD_OUTCOME.LOAD_FAILED) {
    return '광고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
  }

  if (reason === REWARDED_AD_OUTCOME.AD_GATE_CLOSED) {
    return '광고를 요청할 수 있는 개인정보 설정 상태가 아니에요. 앱 설정의 개인정보 및 쿠키 설정을 확인해 주세요.';
  }

  if (reason === REWARDED_AD_OUTCOME.SHOW_FAILED) {
    return '광고 화면을 열지 못했어요. 잠시 후 다시 시도해 주세요.';
  }

  if (reason === REWARDED_AD_OUTCOME.TIMEOUT) {
    return '광고 응답이 지연되고 있어요. 잠시 후 다시 시도해 주세요.';
  }

  if (reason === REWARDED_AD_OUTCOME.UNEXPECTED_ERROR) {
    return '광고 처리 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.';
  }

  if (reason === REWARDED_AD_OUTCOME.CANCELED) {
    return '광고 시청이 완료되지 않았습니다. 다시 시도하면 심화 해석을 열 수 있어요.';
  }

  if (reason === REWARDED_AD_OUTCOME.NO_REWARD) {
    return '보상 확인이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.';
  }

  return '광고 보상 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
}

export function showRewardedAd(options = {}) {
  return showRewardedAdWithResolvedProvider(options, options.envOverride);
}
