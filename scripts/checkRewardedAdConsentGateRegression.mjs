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

const mockConsentFalse = await showRewardedAd({
  placementId: 'test',
  categoryLabel: '테스트 광고',
  consentPreferences: { ads: false },
  delayMs: 0,
  envOverride: {
    VITE_REWARDED_AD_PROVIDER: 'mock',
  },
});
const mockConsentFalsePass = mockConsentFalse.ok === true && mockConsentFalse.provider === REWARDED_AD_PROVIDER;
logResult('mock_provider_ignores_ads_consent_for_dev', mockConsentFalsePass);
assertCondition(mockConsentFalsePass, 'mock provider should keep existing dev/test behavior');

const sdkDisabled = await showRewardedAd({
  placementId: 'test',
  categoryLabel: '테스트 광고',
  consentPreferences: { ads: false },
  envOverride: {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'false',
  },
});
const sdkDisabledPass =
  sdkDisabled.ok === false &&
  sdkDisabled.provider === REWARDED_AD_PROVIDER_TYPE.SDK &&
  sdkDisabled.reason === REWARDED_AD_OUTCOME.SDK_UNAVAILABLE;
logResult('sdk_disabled_returns_sdk_unavailable', sdkDisabledPass);
assertCondition(sdkDisabledPass, 'sdk disabled should return sdk_unavailable before consent gate');

const sdkNoAdsConsent = await showRewardedAd({
  placementId: 'test',
  categoryLabel: '테스트 광고',
  consentPreferences: { ads: false },
  envOverride: {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
  },
});
const sdkNoAdsConsentPass =
  sdkNoAdsConsent.ok === false &&
  sdkNoAdsConsent.provider === REWARDED_AD_PROVIDER_TYPE.SDK &&
  sdkNoAdsConsent.reason === REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED;
logResult('sdk_enabled_without_ads_consent_requires_consent', sdkNoAdsConsentPass);
assertCondition(sdkNoAdsConsentPass, 'sdk enabled without ads consent should require ads consent');

const sdkWithAdsConsent = await showRewardedAd({
  placementId: 'test',
  categoryLabel: '테스트 광고',
  consentPreferences: { ads: true },
  envOverride: {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
  },
});
const sdkWithAdsConsentPass =
  sdkWithAdsConsent.ok === false &&
  sdkWithAdsConsent.provider === REWARDED_AD_PROVIDER_TYPE.SDK &&
  sdkWithAdsConsent.reason === REWARDED_AD_OUTCOME.SDK_UNAVAILABLE;
logResult('sdk_enabled_with_ads_consent_reaches_sdk_scaffold', sdkWithAdsConsentPass);
assertCondition(sdkWithAdsConsentPass, 'sdk enabled with ads consent should reach SDK scaffold');

const missingConsent = await showRewardedAd({
  placementId: 'test',
  categoryLabel: '테스트 광고',
  envOverride: {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
  },
});
const missingConsentPass =
  missingConsent.ok === false &&
  missingConsent.provider === REWARDED_AD_PROVIDER_TYPE.SDK &&
  missingConsent.reason === REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED;
logResult('missing_consent_preferences_requires_consent_for_sdk', missingConsentPass);
assertCondition(missingConsentPass, 'missing consent preferences should require ads consent for SDK provider');

const consentRequiredMessage = getRewardedAdOutcomeMessage(REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED);
const consentRequiredMessagePass =
  typeof consentRequiredMessage === 'string' &&
  consentRequiredMessage.includes('데이터 사용 설정') &&
  consentRequiredMessage.includes('무료 해석');
logResult('ads_consent_required_message', consentRequiredMessagePass);
assertCondition(consentRequiredMessagePass, 'ads consent required message should mention settings and free reading');

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
    consentPreferences: { ads: false },
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
  console.error('Rewarded ad consent gate check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Rewarded ad consent gate check passed');
}
