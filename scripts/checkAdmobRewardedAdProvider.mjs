import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { TextDecoder } from 'node:util';
import {
  getRewardedAdSdkConfig,
  GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID,
  isApprovedRewardedAdSdkConfig,
} from '../src/config/rewardedAdSdkConfig.js';
import { createRewardedAdProviderLoader } from '../src/services/rewardedAdProvider.loader.js';
import {
  createSdkRewardedAdProvider,
  isValidAdMobRewardItem,
  REWARDED_AD_TIMEOUT_MS,
} from '../src/services/rewardedAdProvider.sdk.js';
import { REWARDED_AD_OUTCOME } from '../src/services/rewardedAdProvider.types.js';
import {
  createRewardedRequestId,
  getRewardPersistenceDecision,
  getRewardedAdOutcomeMessage,
  isValidRewardedRequestId,
  isRewardedResultForRequest,
} from '../src/services/rewardedAdService.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const negativeSelfTest = process.argv.includes('--negative-self-test');
const releaseEnvPreflight = process.argv.includes('--release-env-preflight');
const releaseEnvPreflightTestFixture = process.argv.includes(
  '--release-env-preflight-test-app-id-fixture',
);
const androidAdMobAppIdResourcePath = 'android/app/src/main/res/values/strings.xml';
const preservedUntrackedFiles = new Set(['pr405-review.json', 'pr405.diff']);
const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
const concreteAdUnitIdPattern = /\bca-app-pub-\d{16}\/\d{10}\b/gu;
const releaseEnvKeys = [
  'VITE_REWARDED_AD_PROVIDER',
  'VITE_REWARDED_AD_SDK_ENABLED',
  'VITE_REWARDED_AD_MODE',
  'VITE_REWARDED_AD_BUILD_TARGET',
  'VITE_REWARDED_AD_UNIT_ID',
];

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function gitLines(args) {
  try {
    return git(args).split(/\r?\n/).filter(Boolean).map((file) => file.replaceAll('\\', '/'));
  } catch {
    return [];
  }
}

function getChangedFiles() {
  const committed = gitLines(['diff', '--name-only', 'origin/main...HEAD']);
  const committedFallback = committed.length > 0
    ? []
    : gitLines(['diff', '--name-only', 'HEAD^...HEAD']);
  const staged = gitLines(['diff', '--name-only', '--cached']);
  const working = gitLines(['diff', '--name-only']);
  const untracked = gitLines(['ls-files', '--others', '--exclude-standard'])
    .filter((file) => !preservedUntrackedFiles.has(file));
  return [...new Set([...committed, ...committedFallback, ...staged, ...working, ...untracked])];
}

let changedFiles = [];
let trackedFiles = [];

function getTrackedFiles() {
  return execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
    .split('\0')
    .filter(Boolean)
    .map((file) => file.replaceAll('\\', '/'));
}

function readTrackedUtf8Text(relativePath, bufferOverride) {
  const buffer = bufferOverride ?? readFileSync(path.join(root, relativePath));
  if (buffer.includes(0)) return null;
  try {
    return utf8Decoder.decode(buffer);
  } catch {
    return null;
  }
}

function validateConcreteAdUnitIdLiterals(files, sourceOverrides = new Map()) {
  const errors = [];
  for (const file of files) {
    const source = sourceOverrides.has(file)
      ? sourceOverrides.get(file)
      : readTrackedUtf8Text(file);
    if (source === null || source === undefined) continue;
    const concreteIds = source.match(concreteAdUnitIdPattern) ?? [];
    if (concreteIds.some(
      (value) => value !== GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID,
    )) {
      errors.push(`${file}: concrete production ad unit ID literal is prohibited`);
    }
  }
  return errors;
}

function assertNoConcreteProductionAdUnitIds(files, sourceOverrides = new Map()) {
  const errors = validateConcreteAdUnitIdLiterals(files, sourceOverrides);
  assert.deepEqual(errors, [], errors.join('\n'));
}

const requiredTokens = [
  ['scripts/checkAdmobRewardedAdProvider.mjs', 'function getTrackedFiles()'],
  ['scripts/checkAdmobRewardedAdProvider.mjs', "execFileSync('git', ['ls-files', '-z']"],
  ['scripts/checkAdmobRewardedAdProvider.mjs', 'function validateConcreteAdUnitIdLiterals('],
  ['scripts/checkAdmobRewardedAdProvider.mjs', 'function assertNoConcreteProductionAdUnitIds('],
  ['scripts/checkAdmobRewardedAdProvider.mjs', 'trackedFiles = getTrackedFiles();'],
  ['scripts/checkAdmobRewardedAdProvider.mjs', 'assertNoConcreteProductionAdUnitIds(trackedFiles);'],
  ['src/config/rewardedAdSdkConfig.js', 'GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID'],
  ['src/config/rewardedAdSdkConfig.js', "REWARDED_AD_UNIT_ID_ENV_KEY = 'VITE_REWARDED_AD_UNIT_ID'"],
  ['src/config/rewardedAdSdkConfig.js', "OFFICIAL_TEST: 'official_test'"],
  ['src/config/rewardedAdSdkConfig.js', "PRODUCTION: 'production'"],
  ['src/config/rewardedAdSdkConfig.js', "DEBUG: 'debug'"],
  ['src/config/rewardedAdSdkConfig.js', "RELEASE: 'release'"],
  ['src/config/rewardedAdSdkConfig.js', 'normalizeRewardedAdUnitId'],
  ['src/config/rewardedAdSdkConfig.js', 'isValidAdMobRewardedAdUnitId'],
  ['src/config/rewardedAdSdkConfig.js', 'isApprovedRewardedAdSdkConfig'],
  ['src/config/rewardedAdSdkConfig.js', 'configurationValid'],
  ['src/config/rewardedAdSdkConfig.js', 'isTesting: officialTestApproved'],
  ['src/config/rewardedAdSdkConfig.js', 'mockAllowed'],
  ['src/services/rewardedAdProvider.types.js', "AD_GATE_CLOSED: 'ad_gate_closed'"],
  ['src/services/rewardedAdProvider.types.js', "SHOW_FAILED: 'show_failed'"],
  ['src/services/rewardedAdProvider.types.js', "TIMEOUT: 'timeout'"],
  ['src/services/rewardedAdProvider.types.js', "UNEXPECTED_ERROR: 'unexpected_error'"],
  ['src/services/rewardedAdProvider.sdk.js', 'createSdkRewardedAdProvider'],
  ['src/services/rewardedAdProvider.sdk.js', 'isNativePlatform'],
  ['src/services/rewardedAdProvider.sdk.js', 'getPlatform'],
  ['src/services/rewardedAdProvider.sdk.js', 'getRuntimeConsentSnapshot'],
  ['src/services/rewardedAdProvider.sdk.js', 'loadLocalConsentPreferences'],
  ['src/services/rewardedAdProvider.sdk.js', "import('@capacitor-community/admob')"],
  ['src/services/rewardedAdProvider.sdk.js', 'prepareRewardVideoAd'],
  ['src/services/rewardedAdProvider.sdk.js', 'showRewardVideoAd'],
  ['src/services/rewardedAdProvider.sdk.js', 'Number.isFinite(rewardItem.amount)'],
  ['src/services/rewardedAdProvider.sdk.js', 'rewardItem.amount > 0'],
  ['src/services/rewardedAdProvider.sdk.js', 'rewardItem.type.trim().length > 0'],
  ['src/services/rewardedAdProvider.sdk.js', 'if (rewardedPromise) return rewardedPromise;'],
  ['src/services/rewardedAdProvider.sdk.js', 'if (settled) return'],
  ['src/services/rewardedAdProvider.sdk.js', 'if (rewardDelivered)'],
  ['src/services/rewardedAdProvider.sdk.js', 'handle?.remove?.()'],
  ['src/services/rewardedAdProvider.sdk.js', 'Promise.allSettled'],
  ['src/services/rewardedAdProvider.sdk.js', 'dismissRewardGrace'],
  ['src/services/rewardedAdProvider.sdk.js', 'cleanup: 2_000'],
  ['src/services/rewardedAdProvider.sdk.js', 'Rewarded is diagnostic only'],
  ['src/services/rewardedAdProvider.sdk.js', 'const prePrepareGate = readGateState()'],
  ['src/services/rewardedAdProvider.sdk.js', 'prePrepareGate.localConsent?.personalizedAds'],
  ['src/services/rewardedAdProvider.sdk.js', 'const preShowGate = readGateState()'],
  ['src/services/rewardedAdProvider.sdk.js', 'isApprovedRewardedAdSdkConfig(options.config)'],
  ['src/services/rewardedAdProvider.sdk.js', 'isTesting: options.config.isTesting'],
  ['src/services/rewardedAdProvider.sdk.js', 'const rewardActionId = createRewardActionId()'],
  ['src/services/rewardedAdProvider.sdk.js', 'rewardActionId,'],
  ['src/services/rewardedAdProvider.sdk.js', 'rewardRequestId: options.rewardRequestId'],
  ['src/services/rewardedAdProvider.sdk.js', 'isValidRewardedRequestId(options.rewardRequestId)'],
  ['src/services/rewardedAdProvider.loader.js', 'createRewardedAdProviderLoader'],
  ['src/services/rewardedAdProvider.loader.js', 'config.mockAllowed === true'],
  ['src/services/rewardedAdProvider.loader.js', 'isApprovedRewardedAdSdkConfig(config)'],
  ['src/services/rewardedAdProvider.loader.js', 'return showSdk({ ...options, config })'],
  ['src/services/rewardedAdService.js', 'export function showRewardedAd(options = {})'],
  ['src/services/rewardedAdService.js', 'export function createRewardedRequestId('],
  ['src/services/rewardedAdService.js', 'export function isValidRewardedRequestId(value)'],
  ['src/services/rewardedAdService.js', 'export function isRewardedResultForRequest('],
  ['src/services/rewardedAdService.js', 'result.rewardRequestId === rewardRequestId'],
  ['src/services/rewardedAdService.js', 'export function getRewardPersistenceDecision({'],
  ['src/services/rewardedAdService.js', 'consumedSdkRewardActionIds.has(rewardActionId)'],
  ['src/services/rewardedAdProvider.loader.js', 'export function showRewardedAdWithResolvedProvider'],
  ['src/services/rewardedAdProvider.sdk.js', 'export function showSdkRewardedAd(options = {})'],
  ['src/components/RewardAdModal.jsx', 'completionDeliveredRef'],
  ['src/components/RewardAdModal.jsx', 'completionInFlightRef'],
  ['src/components/RewardAdModal.jsx', 'const rewardRequestId = createRewardedRequestId()'],
  ['src/components/RewardAdModal.jsx', 'rewardRequestId,'],
  ['src/components/RewardAdModal.jsx', 'mountedRef'],
  ['src/components/RewardAdModal.jsx', 'const OFFICIAL_TEST_SDK_COPY = Object.freeze({'],
  ['src/components/RewardAdModal.jsx', 'const PRODUCTION_SDK_COPY = Object.freeze({'],
  ['src/components/RewardAdModal.jsx', 'if (isOfficialTestSdk) return OFFICIAL_TEST_SDK_COPY'],
  ['src/components/RewardAdModal.jsx', 'if (isProductionSdk) return PRODUCTION_SDK_COPY'],
  ['src/components/RewardAdModal.jsx', "title: 'Google 공식 테스트 광고'"],
  ['src/components/RewardAdModal.jsx', "cta: '테스트 광고 보고 상세 풀이 열기'"],
  ['src/components/RewardAdModal.jsx', "title: '보상형 광고'"],
  ['src/components/RewardAdModal.jsx', "preparing: '광고를 준비하고 있어요.'"],
  ['src/components/RewardAdModal.jsx', "cta: '광고 보고 상세 풀이 열기'"],
  ['src/components/RewardAdModal.jsx', '현재 상세 풀이의 광고를 시작해 주세요'],
  ['src/components/RewardAdModal.jsx', 'isRewardedResultForRequest(result, {'],
  ['src/components/RewardAdModal.jsx', 'const wasPersisted = await onRewardComplete(result)'],
  ['src/components/RewardAdModal.jsx', 'if (wasPersisted === false)'],
  ['src/components/RewardAdModal.jsx', "errorReason === 'ads_consent_required'"],
  ['src/pages/FortuneDetailPage.jsx', 'onUnlock={(rewardResult) => onUnlockDetail(category.id, rewardResult)}'],
  ['src/pages/SajuInsightPage.jsx', 'onUnlock={(rewardResult) =>'],
  ['src/App.jsx', 'const handleUnlockDetail = (categoryId, rewardResult) =>'],
  ['src/App.jsx', 'getRewardPersistenceDecision({'],
  ['src/App.jsx', 'consumedSdkRewardActionIdsRef.current.add(decision.rewardActionId)'],
  ['src/App.jsx', 'currentSessionEpoch: rewardSessionEpochRef.current'],
  ['src/App.jsx', 'persistedRewardKeysRef.current.clear()'],
  ['src/App.jsx', 'consumedSdkRewardActionIdsRef.current.clear()'],
  ['src/App.jsx', 'rewardSessionEpochRef.current += 1'],
  ['src/utils/storage.js', "rewardType = 'mock_rewarded_ad'"],
  ['src/utils/storage.js', "rewardType === 'sdk_rewarded_ad'"],
  ['src/utils/storage.js', 'rewardType: safeRewardType'],
  ['src/pages/PrivacyInfoPage.jsx', '기본 Web/Vercel/일반 Android Debug Build의 provider는 mock'],
  ['src/pages/PrivacyInfoPage.jsx', '공식 테스트 전용 Debug Build에서는 Google 공식 Rewarded Test Ad'],
  ['src/pages/PrivacyInfoPage.jsx', '승인된 production/release 구성에서는 AdMob production Rewarded 광고'],
  ['src/pages/PrivacyInfoPage.jsx', 'release workflow 실행, AAB 생성, 기기 QA, serving은 아직 수행하지 않았습니다'],
  ['src/pages/PrivacyInfoPage.jsx', '앱 내부 광고 데이터 사용 선택과 Google UMP runtime gate가 모두 필요'],
  ['src/pages/PrivacyInfoPage.jsx', '이 페이지는 하루풀이 앱의 현재 개인정보 처리 안내입니다'],
  ['src/pages/PrivacyInfoPage.jsx', '최신 개인정보처리방침 전문은'],
  ['src/pages/PrivacyInfoPage.jsx', '아래 외부 페이지에서 확인할 수 있으며'],
  ['src/pages/PrivacyInfoPage.jsx', 'production 광고 활성화 전 개인정보/Data Safety'],
  ['src/pages/PrivacyInfoPage.jsx', '외부 공개 개인정보처리방침 최종 검토'],
  ['src/pages/PrivacyInfoPage.jsx', '광고 관련 disclosure 최종 검토'],
  ['src/pages/PrivacyInfoPage.jsx', 'https://hymlounge.com/harupuli/privacy/'],
  ['src/components/ConsentSettingsPanel.jsx', '공식 테스트 및 승인된 production Rewarded 경로 모두'],
  ['src/components/ConsentSettingsPanel.jsx', '공식 테스트 및 승인된 production Rewarded 광고 요청 경로'],
  ['src/components/ConsentSettingsPanel.jsx', '이 선택이 true가'],
  ['src/components/ConsentSettingsPanel.jsx', 'non-personalized 광고 요청으로 제한'],
  ['.github/workflows/android-rewarded-test-build.yml', 'Android Rewarded Test Build'],
  ['.github/workflows/android-rewarded-test-build.yml', 'VITE_REWARDED_AD_PROVIDER: sdk'],
  ['.github/workflows/android-rewarded-test-build.yml', 'VITE_REWARDED_AD_SDK_ENABLED: "true"'],
  ['.github/workflows/android-rewarded-test-build.yml', 'VITE_REWARDED_AD_MODE: official_test'],
  ['.github/workflows/android-rewarded-test-build.yml', 'VITE_REWARDED_AD_BUILD_TARGET: debug'],
  ['.github/workflows/android-rewarded-test-build.yml', 'harupuli-rewarded-test-apk'],
  ['.github/workflows/android-rewarded-test-build.yml', 'npm run check:admob-rewarded-provider'],
  ['package.json', '"check:admob-rewarded-provider"'],
];

function validateSources(sourceOverrides = new Map()) {
  const errors = [];
  const sourceFor = (file) =>
    sourceOverrides.has(file) ? sourceOverrides.get(file) : read(file);

  for (const [file, token] of requiredTokens) {
    if (!sourceFor(file).includes(token)) errors.push(`${file}: missing ${token}`);
  }

  const sdkSource = sourceFor('src/services/rewardedAdProvider.sdk.js');
  const loaderSource = sourceFor('src/services/rewardedAdProvider.loader.js');
  const serviceSource = sourceFor('src/services/rewardedAdService.js');
  const modalSource = sourceFor('src/components/RewardAdModal.jsx');
  const privacySource = sourceFor('src/pages/PrivacyInfoPage.jsx');
  const consentSettingsSource = sourceFor('src/components/ConsentSettingsPanel.jsx');
  const appSource = sourceFor('src/App.jsx');
  const configSource = sourceFor('src/config/rewardedAdSdkConfig.js');
  const checkerSource = sourceFor('scripts/checkAdmobRewardedAdProvider.mjs');
  const trackedFileScanBlock = checkerSource.slice(
    checkerSource.indexOf('\nfunction getTrackedFiles'),
    checkerSource.indexOf('\nfunction readTrackedUtf8Text'),
  );
  const trackedTextReadBlock = checkerSource.slice(
    checkerSource.indexOf('\nfunction readTrackedUtf8Text'),
    checkerSource.indexOf('\nfunction validateConcreteAdUnitIdLiterals'),
  );
  const concreteIdValidationBlock = checkerSource.slice(
    checkerSource.indexOf('\nfunction validateConcreteAdUnitIdLiterals'),
    checkerSource.indexOf('\nfunction assertNoConcreteProductionAdUnitIds'),
  );
  const mainBlock = checkerSource.slice(checkerSource.indexOf('\nasync function main()'));
  if (!trackedFileScanBlock.includes("execFileSync('git', ['ls-files', '-z']")) {
    errors.push('concrete ad unit ID scan must enumerate all tracked files');
  }
  const trackedFileFilters = trackedFileScanBlock.match(/\.filter\(/gu) ?? [];
  if (
    trackedFileFilters.length !== 1 ||
    !trackedFileScanBlock.includes('.filter(Boolean)') ||
    trackedFileScanBlock.includes('trackedTextExtensions') ||
    trackedFileScanBlock.includes('path.extname') ||
    trackedFileScanBlock.includes('.endsWith(')
  ) {
    errors.push('tracked file enumeration must not use filename or extension filters');
  }
  if (
    !trackedTextReadBlock.includes('readFileSync(path.join(root, relativePath))') ||
    !trackedTextReadBlock.includes('buffer.includes(0)') ||
    !trackedTextReadBlock.includes('utf8Decoder.decode(buffer)') ||
    !trackedTextReadBlock.includes('return null')
  ) {
    errors.push('tracked file text detection must use NUL and strict UTF-8 content checks');
  }
  if (
    !mainBlock.includes('trackedFiles = getTrackedFiles();') ||
    !mainBlock.includes('assertNoConcreteProductionAdUnitIds(trackedFiles);')
  ) {
    errors.push('concrete ad unit ID scan must use the repository-wide tracked file list');
  }
  if (concreteIdValidationBlock.includes('changedFiles')) {
    errors.push('concrete ad unit ID scan must not depend on changedFiles');
  }
  if (!concreteIdValidationBlock.includes(
    'value !== GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID',
  )) {
    errors.push('only the Google official Rewarded Test ID may be allowed');
  }
  if (
    !concreteIdValidationBlock.includes(
      '`${file}: concrete production ad unit ID literal is prohibited`',
    ) ||
    concreteIdValidationBlock.includes('${value}')
  ) {
    errors.push('concrete ad unit ID errors must be generic and must not expose ID values');
  }
  const releaseValidationBlock = checkerSource.slice(
    checkerSource.indexOf('\nfunction validateProductionReleaseEnvironment'),
    checkerSource.indexOf('\nfunction runReleaseEnvironmentPreflight'),
  );
  const releaseSubprocessBlock = checkerSource.slice(
    checkerSource.indexOf('\nfunction runReleaseEnvironmentPreflightSubprocessTests'),
    checkerSource.indexOf('\nfunction makeProductionConfig'),
  );
  if (!checkerSource.includes(
    "const androidAdMobAppIdResourcePath = 'android/app/src/main/res/values/strings.xml'",
  )) {
    errors.push('release preflight must read the approved Android AdMob App ID resource');
  }
  if (!releaseValidationBlock.includes(
    'appPublisherPrefix === adUnitPublisherPrefix',
  )) {
    errors.push('release preflight must verify matching publisher prefixes');
  }
  if (!releaseSubprocessBlock.includes("'mismatched publisher prefix'")) {
    errors.push('release preflight subprocess tests must cover mismatched publisher prefixes');
  }
  if (!releaseSubprocessBlock.includes(
    'const mismatchedPublisherPrefixShouldPass = false',
  )) {
    errors.push('mismatched publisher prefix fixture must fail');
  }
  const officialTestCopyBlock = modalSource.slice(
    modalSource.indexOf('const OFFICIAL_TEST_SDK_COPY'),
    modalSource.indexOf('const PRODUCTION_SDK_COPY'),
  );
  const productionCopyBlock = modalSource.slice(
    modalSource.indexOf('const PRODUCTION_SDK_COPY'),
    modalSource.indexOf('function getRewardedAdSdkCopy'),
  );
  const officialTestCopyTokens = [
    'Google 공식 테스트 광고',
    'Google 공식 Rewarded Test Ad',
    '테스트 광고 시청은 선택 사항',
    '테스트 광고 보고 상세 풀이 열기',
  ];
  for (const token of officialTestCopyTokens) {
    if (!officialTestCopyBlock.includes(token)) {
      errors.push(`official-test SDK copy is missing: ${token}`);
    }
  }
  const productionCopyTokens = [
    "title: '보상형 광고'",
    '광고를 끝까지 시청하고 보상을 받으면 상세 풀이가 열립니다',
    "preparing: '광고를 준비하고 있어요.'",
    '광고 시청은 선택 사항이며, 버튼을 눌러 시작할 수 있어요',
    "cta: '광고 보고 상세 풀이 열기'",
  ];
  for (const token of productionCopyTokens) {
    if (!productionCopyBlock.includes(token)) {
      errors.push(`production SDK copy is missing: ${token}`);
    }
  }
  for (const prohibited of [
    'Google 공식 테스트 광고',
    'Rewarded Test Ad',
    '테스트 광고 보고',
    '공식 테스트 전용',
  ]) {
    if (productionCopyBlock.includes(prohibited)) {
      errors.push(`production SDK copy must not use test-ad language: ${prohibited}`);
    }
  }
  if (
    !modalSource.includes('if (isOfficialTestSdk) return OFFICIAL_TEST_SDK_COPY') ||
    !modalSource.includes('if (isProductionSdk) return PRODUCTION_SDK_COPY')
  ) {
    errors.push('official-test and production SDK copy branches must remain separate');
  }
  if (modalSource.includes('현재 상세 풀이의 테스트 광고')) {
    errors.push('request ownership error copy must remain mode-neutral');
  }
  for (const staleClaim of [
    'production 광고 단위 ID와 production 광고 request/load/show는 구현되지 않았습니다',
    'production 환경의 실제 광고 송출은 없습니다',
    '공식 테스트 전용 빌드에서만',
    '실제 서비스 공개 전',
  ]) {
    if (privacySource.includes(staleClaim)) {
      errors.push(`privacy copy contains a stale production capability claim: ${staleClaim}`);
    }
  }
  if (
    /(?:개인정보|Privacy)\/Data Safety.{0,80}(?:Completed|완료)|(?:Completed|완료).{0,80}(?:개인정보|Privacy)\/Data Safety/su.test(
      privacySource,
    )
  ) {
    errors.push('Privacy/Data Safety review must not be represented as completed');
  }
  for (const staleClaim of [
    'production 광고 request/load/show 기능은 아직 구현되지 않았습니다',
    'production 광고 기능은 아직 구현되지 않았습니다',
  ]) {
    if (consentSettingsSource.includes(staleClaim)) {
      errors.push(`consent copy contains a stale production capability claim: ${staleClaim}`);
    }
  }
  if (
    !/const mockBuildTargetApproved\s*=\s*buildTarget === ''\s*\|\|\s*buildTarget === REWARDED_AD_BUILD_TARGET\.DEBUG;/u.test(
      configSource,
    )
  ) {
    errors.push('mock build target allowlist must contain only blank and debug');
  }
  if (/export\s+async\s+function\s+showSdkRewardedAd/.test(sdkSource)) {
    errors.push('SDK public forwarding function must preserve Promise identity');
  }
  if (/export\s+async\s+function\s+showRewardedAdWithResolvedProvider/.test(loaderSource)) {
    errors.push('loader forwarding function must preserve Promise identity');
  }
  if (/export\s+async\s+function\s+showRewardedAd/.test(serviceSource)) {
    errors.push('service forwarding function must preserve Promise identity');
  }
  if (sdkSource.includes('removeAllListeners')) errors.push('removeAllListeners is prohibited');
  if (loaderSource.includes('showMockRewardedAd(options);') &&
      loaderSource.indexOf('showMockRewardedAd(options);') <
        loaderSource.indexOf('return showSdkRewardedAd')) {
    errors.push('SDK-to-mock fallback detected');
  }
  const prePrepareBlock = sdkSource.slice(
    sdkSource.indexOf('const prePrepareGate = readGateState()'),
    sdkSource.indexOf('const prepareOptions'),
  );
  if (prePrepareBlock.includes('loadLocalConsentPreferences')) {
    errors.push('unvalidated local consent read detected before prepare');
  }
  if (!modalSource.includes('isRewardedResultForRequest(result, {')) {
    errors.push('modal request ownership validation is required');
  }
  if (
    !modalSource.includes('const rewardRequestId = createRewardedRequestId()') ||
    !/showRewardedAd\(\{\s*placementId: requestedPlacementId,\s*categoryLabel,\s*rewardRequestId,\s*consentPreferences,/u.test(
      modalSource,
    )
  ) {
    errors.push('modal caller-owned rewardRequestId is required');
  }
  if (
    !sdkSource.includes('isValidRewardedRequestId(options.rewardRequestId)') ||
    !sdkSource.includes('rewardRequestId: options.rewardRequestId')
  ) {
    errors.push('SDK must fail closed and bind success to the initiating request ID');
  }
  if (
    !serviceSource.includes("result?.provider === 'sdk_rewarded_ad'") ||
    !serviceSource.includes('result.rewardRequestId === rewardRequestId')
  ) {
    errors.push('SDK result ownership must require rewardRequestId equality');
  }
  if (
    serviceSource.includes(
      "if (result?.provider === 'sdk_rewarded_ad') return baseRequestFieldsMatch",
    )
  ) {
    errors.push('SDK ownership cannot fall back to placement/category fields');
  }
  if (!modalSource.includes('if (completionInFlightRef.current) return')) {
    errors.push('modal synchronous completion single-flight guard is required');
  }
  if (!serviceSource.includes('consumedSdkRewardActionIds.has(rewardActionId)')) {
    errors.push('SDK rewardActionId consumption guard is required');
  }
  if (
    !appSource.includes('persistedRewardKeysRef.current.clear()') ||
    !appSource.includes('consumedSdkRewardActionIdsRef.current.clear()')
  ) {
    errors.push('reset must clear reward persistence guards');
  }
  if (
    !appSource.includes('sessionEpoch: currentRewardSessionEpoch') ||
    !appSource.includes('currentSessionEpoch: rewardSessionEpochRef.current')
  ) {
    errors.push('reward session epoch validation is required');
  }

  for (const file of changedFiles) {
    if (!existsSync(path.join(root, file))) continue;
    const source = sourceFor(file);
    if (source.includes('\uFFFD') || /[?][쒕쟾젣]/u.test(source)) {
      errors.push(`${file}: replacement character or known mojibake detected`);
    }
  }
  return errors;
}

function makeConfig(overrides = {}) {
  return {
    provider: 'sdk',
    sdkEnabled: true,
    mode: 'official_test',
    buildTarget: 'debug',
    configurationValid: true,
    adId: GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID,
    isTesting: true,
    mockAllowed: false,
    ...overrides,
  };
}

function createSyntheticProductionAdUnitId() {
  const publisher = ['1234', '5678', '9012', '3456'].join('');
  const adUnit = ['12345', '67890'].join('');
  return ['ca-app-pub-', publisher, '/', adUnit].join('');
}

function createSyntheticAppId() {
  const publisher = ['1234', '5678', '9012', '3456'].join('');
  const app = ['12345', '67890'].join('');
  return ['ca-app-pub-', publisher, '~', app].join('');
}

function readApprovedAndroidAdMobAppId() {
  const source = read(androidAdMobAppIdResourcePath).replace(/<!--[\s\S]*?-->/gu, '');
  const matches = [...source.matchAll(
    /<string\b[^>]*\bname=["']admob_app_id["'][^>]*>([^<]+)<\/string>/gu,
  )];
  return matches.length === 1 ? matches[0][1].trim() : '';
}

function publisherPrefixFromAppId(appId) {
  return /^(ca-app-pub-\d{16})~\d{10}$/u.exec(appId)?.[1] ?? '';
}

function publisherPrefixFromAdUnitId(adUnitId) {
  return /^(ca-app-pub-\d{16})\/\d{10}$/u.exec(adUnitId)?.[1] ?? '';
}

function createAdUnitIdForPublisher(publisherPrefix) {
  return [publisherPrefix, '/', ['12345', '67890'].join('')].join('');
}

function createDifferentPublisherPrefix(publisherPrefix) {
  const lastDigit = Number(publisherPrefix.at(-1));
  return `${publisherPrefix.slice(0, -1)}${(lastDigit + 1) % 10}`;
}

function validateProductionReleaseEnvironment(env, appId) {
  const config = getRewardedAdSdkConfig(env);
  const normalizedAdUnitId = String(env.VITE_REWARDED_AD_UNIT_ID ?? '').trim();
  const appPublisherPrefix = publisherPrefixFromAppId(appId);
  const adUnitPublisherPrefix = publisherPrefixFromAdUnitId(normalizedAdUnitId);
  const valid =
    String(env.VITE_REWARDED_AD_PROVIDER ?? '').trim().toLowerCase() === 'sdk' &&
    String(env.VITE_REWARDED_AD_SDK_ENABLED ?? '').trim().toLowerCase() === 'true' &&
    String(env.VITE_REWARDED_AD_MODE ?? '').trim().toLowerCase() === 'production' &&
    String(env.VITE_REWARDED_AD_BUILD_TARGET ?? '').trim().toLowerCase() === 'release' &&
    appPublisherPrefix.length > 0 &&
    adUnitPublisherPrefix.length > 0 &&
    appPublisherPrefix === adUnitPublisherPrefix &&
    normalizedAdUnitId !== GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID &&
    config.configurationValid === true &&
    config.mockAllowed === false &&
    config.isTesting === false &&
    isApprovedRewardedAdSdkConfig(config) === true;

  if (!valid) {
    throw new Error('Production Rewarded release environment preflight failed');
  }
}

function runReleaseEnvironmentPreflight() {
  let appId = '';
  try {
    appId = releaseEnvPreflightTestFixture
      ? String(process.env.ADMOB_APP_ID_PREFLIGHT_TEST_FIXTURE ?? '')
      : readApprovedAndroidAdMobAppId();
  } catch {
    appId = '';
  }
  validateProductionReleaseEnvironment(process.env, appId);
  process.stdout.write('Production Rewarded release environment preflight passed\n');
}

function runReleaseEnvironmentPreflightSubprocessTests() {
  const checker = fileURLToPath(import.meta.url);
  const approvedAppId = readApprovedAndroidAdMobAppId();
  const approvedPublisherPrefix = publisherPrefixFromAppId(approvedAppId);
  assert(approvedPublisherPrefix, 'approved Android AdMob App ID must have the expected format');
  const matchingAdUnitId = createAdUnitIdForPublisher(approvedPublisherPrefix);
  const mismatchedAdUnitId = createAdUnitIdForPublisher(
    createDifferentPublisherPrefix(approvedPublisherPrefix),
  );
  const syntheticAppId = createSyntheticAppId();
  const baseEnv = Object.fromEntries(releaseEnvKeys.map((key) => [key, '']));
  const validEnv = {
    ...baseEnv,
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
    VITE_REWARDED_AD_UNIT_ID: matchingAdUnitId,
  };
  const mismatchedPublisherPrefixShouldPass = false;
  const cases = [
    ['matching publisher prefix', validEnv, true],
    ['mismatched publisher prefix', {
      ...validEnv,
      VITE_REWARDED_AD_UNIT_ID: mismatchedAdUnitId,
    }, mismatchedPublisherPrefixShouldPass],
    ['missing App ID', validEnv, false, ''],
    ['malformed App ID', validEnv, false, 'invalid'],
    ['missing ID', { ...validEnv, VITE_REWARDED_AD_UNIT_ID: '' }, false],
    ['malformed ad unit', { ...validEnv, VITE_REWARDED_AD_UNIT_ID: 'invalid' }, false],
    ['App ID used as ad unit', {
      ...validEnv,
      VITE_REWARDED_AD_UNIT_ID: syntheticAppId,
    }, false],
    ['official test ID', {
      ...validEnv,
      VITE_REWARDED_AD_UNIT_ID: GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID,
    }, false],
    ['debug target', { ...validEnv, VITE_REWARDED_AD_BUILD_TARGET: 'debug' }, false],
    ['official test mode', { ...validEnv, VITE_REWARDED_AD_MODE: 'official_test' }, false],
    ['mock provider', { ...validEnv, VITE_REWARDED_AD_PROVIDER: 'mock' }, false],
    ['SDK disabled', { ...validEnv, VITE_REWARDED_AD_SDK_ENABLED: 'false' }, false],
    ['unknown target', { ...validEnv, VITE_REWARDED_AD_BUILD_TARGET: 'unknown' }, false],
  ];

  for (const [name, env, shouldPass, appIdFixture] of cases) {
    const args = [checker, '--release-env-preflight'];
    if (appIdFixture !== undefined) {
      args.push('--release-env-preflight-test-app-id-fixture');
    }
    const result = spawnSync(process.execPath, args, {
      cwd: root,
      encoding: 'utf8',
      env: {
        ...process.env,
        ...env,
        ADMOB_APP_ID_PREFLIGHT_TEST_FIXTURE: appIdFixture ?? '',
      },
    });
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
    assert.equal(result.status === 0, shouldPass, `${name}: unexpected preflight result`);
    assert(!output.includes(approvedAppId), `${name}: approved App ID leaked`);
    assert(!output.includes(matchingAdUnitId), `${name}: matching ad unit ID leaked`);
    assert(!output.includes(mismatchedAdUnitId), `${name}: mismatched ad unit ID leaked`);
    assert(!output.includes(syntheticAppId), `${name}: synthetic App ID leaked`);
    if (shouldPass) {
      assert.equal(
        result.stdout,
        'Production Rewarded release environment preflight passed\n',
        `${name}: unexpected success output`,
      );
      assert.equal(result.stderr, '', `${name}: unexpected success error output`);
    } else {
      assert(
        output.includes('Production Rewarded release environment preflight failed'),
        `${name}: missing generic failure output`,
      );
    }
  }
}

function makeProductionConfig() {
  const productionAdUnitId = createSyntheticProductionAdUnitId();
  return getRewardedAdSdkConfig({
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
    VITE_REWARDED_AD_UNIT_ID: `  ${productionAdUnitId}  `,
  });
}

function createHarness(options = {}) {
  const listeners = new Map();
  const removed = [];
  let listenerCalls = 0;
  let prepareCalls = 0;
  let showCalls = 0;
  let localReads = 0;
  let runtimeReads = 0;
  let moduleLoads = 0;
  let actionIdCreates = 0;
  const preparedOptions = [];
  const localSequence = options.localSequence || [{ ads: true, personalizedAds: false }];
  const runtimeOpen = {
    isNativeAndroid: true,
    consentInfoCompleted: true,
    canRequestAds: true,
    initializeResolved: true,
    adGateOpen: true,
  };
  const runtimeSequence = options.runtimeSequence || [runtimeOpen];
  const module = {
    RewardAdPluginEvents: {
      FailedToLoad: 'failed-load',
      Showed: 'showed',
      FailedToShow: 'failed-show',
      Dismissed: 'dismissed',
      Rewarded: 'rewarded',
    },
    AdMob: {
      async addListener(event, callback) {
        listenerCalls += 1;
        if (options.listenerFailureAt === listeners.size) throw new Error('listener setup');
        listeners.set(event, callback);
        return {
          async remove() {
            removed.push(event);
            if (options.cleanupFailure) throw new Error('cleanup');
          },
        };
      },
      async prepareRewardVideoAd(prepareOptions) {
        prepareCalls += 1;
        preparedOptions.push(prepareOptions);
        options.onPrepare?.({ prepareOptions, listeners });
        if (options.prepareReject) throw new Error('load');
        if (options.preparePending) return new Promise(() => {});
        return {};
      },
      async showRewardVideoAd() {
        showCalls += 1;
        options.onShow?.({ listeners });
        if (options.showReject) throw new Error('show');
        if (options.showResultPromise) return options.showResultPromise;
        if (options.showPending) return new Promise(() => {});
        return options.rewardItem || { amount: 1, type: 'detail' };
      },
    },
  };
  const dependencies = {
    isNativePlatform: () => options.native !== false,
    getPlatform: () => options.platform || 'android',
    loadLocalConsentPreferences: () =>
      localSequence[Math.min(localReads++, localSequence.length - 1)],
    getRuntimeConsentSnapshot: () =>
      runtimeSequence[Math.min(runtimeReads++, runtimeSequence.length - 1)],
    loadAdMobModule: async () => {
      moduleLoads += 1;
      return module;
    },
    timeoutMs: {
      load: 20,
      showStart: 20,
      lifecycle: 20,
      dismissRewardGrace: 5,
      cleanup: 5,
    },
    now: () => new Date('2026-07-27T00:00:00.000Z'),
    createActionId: () => {
      actionIdCreates += 1;
      return options.actionIds?.[actionIdCreates - 1] || `action-${actionIdCreates}`;
    },
  };
  const sdkProvider = createSdkRewardedAdProvider(dependencies);
  return {
    provider: {
      show: (request = {}) => sdkProvider.show({
        rewardRequestId: 'default-test-request',
        ...request,
      }),
    },
    providerWithoutDefaultRequestId: sdkProvider,
    listeners,
    stats: () => ({
      prepareCalls,
      showCalls,
      localReads,
      runtimeReads,
      moduleLoads,
      listenerCalls,
      actionIdCreates,
      preparedOptions,
      removed,
    }),
  };
}

const tests = [];
function test(name, run) {
  tests.push({ name, run });
}

function createLoaderHarness(options = {}) {
  let mockCalls = 0;
  let sdkCalls = 0;
  const loader = createRewardedAdProviderLoader({
    showMock: (request) => {
      mockCalls += 1;
      return Promise.resolve({ ok: true, provider: 'mock_rewarded_ad', request });
    },
    showSdk: (request) => {
      sdkCalls += 1;
      return Promise.resolve(
        options.sdkResult || { ok: true, provider: 'sdk_rewarded_ad', request },
      );
    },
  });
  return {
    loader,
    stats: () => ({ mockCalls, sdkCalls }),
  };
}

test('repository-wide concrete ad unit scan passes every current tracked UTF-8 source', () => {
  assertNoConcreteProductionAdUnitIds(trackedFiles);
});
test('repository-wide concrete ad unit scan includes tracked CSS outside the current diff', () => {
  const fixture = 'src/styles.css';
  assert(trackedFiles.includes(fixture), 'tracked CSS fixture must be enumerated');
  assert(!changedFiles.includes(fixture), 'tracked CSS fixture must be outside the current diff');
  const syntheticId = createSyntheticProductionAdUnitId();
  const errors = validateConcreteAdUnitIdLiterals(
    trackedFiles,
    new Map([[fixture, `--injected-id: '${syntheticId}';`]]),
  );
  assert.deepEqual(
    errors,
    [`${fixture}: concrete production ad unit ID literal is prohibited`],
  );
  assert(!errors.join('\n').includes(syntheticId));
  assert(!errors.join('\n').includes(syntheticId.split('/')[0]));
});
test('repository-wide concrete ad unit scan allows the official Rewarded Test ID in CSS', () => {
  const fixture = 'src/styles.css';
  assert(trackedFiles.includes(fixture), 'tracked CSS fixture must be enumerated');
  assertNoConcreteProductionAdUnitIds(
    [fixture],
    new Map([[
      fixture,
      `--official-test-id: '${GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID}';`,
    ]]),
  );
});
test('repository-wide concrete ad unit scan includes extensionless tracked UTF-8 sources', () => {
  const fixture = trackedFiles.find(
    (file) => path.extname(file) === '' && readTrackedUtf8Text(file) !== null,
  );
  assert(fixture, 'extensionless tracked UTF-8 fixture is required');
  const syntheticId = createSyntheticProductionAdUnitId();
  const errors = validateConcreteAdUnitIdLiterals(
    trackedFiles,
    new Map([[fixture, `injected_id='${syntheticId}'`]]),
  );
  assert.deepEqual(
    errors,
    [`${fixture}: concrete production ad unit ID literal is prohibited`],
  );
  assert(!errors.join('\n').includes(syntheticId));
  assert(!errors.join('\n').includes(syntheticId.split('/')[0]));
});
test('repository-wide ad-unit scan does not confuse an App ID tilde form in CSS', () => {
  const fixture = 'src/styles.css';
  assert(trackedFiles.includes(fixture), 'tracked CSS fixture must be enumerated');
  assertNoConcreteProductionAdUnitIds(
    [fixture],
    new Map([[fixture, `--app-id: '${createSyntheticAppId()}';`]]),
  );
});
test('tracked file text detection skips NUL and invalid UTF-8 content', () => {
  assert.equal(readTrackedUtf8Text('synthetic-binary', Buffer.from([0x61, 0x00, 0x62])), null);
  assert.equal(readTrackedUtf8Text('synthetic-non-utf8', Buffer.from([0xc3, 0x28])), null);
});

test('default no-intent config allows exactly one mock call', async () => {
  const config = getRewardedAdSdkConfig({});
  assert.equal(config.provider, 'mock');
  assert.equal(config.configurationValid, false);
  assert.equal(config.adId, '');
  assert.equal(config.mockAllowed, true);

  const harness = createLoaderHarness();
  await harness.loader({}, {});
  assert.deepEqual(harness.stats(), { mockCalls: 1, sdkCalls: 0 });
});
test('mock debug build target allows exactly one mock call', async () => {
  const env = {
    VITE_REWARDED_AD_PROVIDER: 'mock',
    VITE_REWARDED_AD_BUILD_TARGET: 'debug',
  };
  const config = getRewardedAdSdkConfig(env);
  assert.equal(config.configurationValid, false);
  assert.equal(config.mockAllowed, true);

  const harness = createLoaderHarness();
  await harness.loader({}, env);
  assert.deepEqual(harness.stats(), { mockCalls: 1, sdkCalls: 0 });
});
test('official test debug configuration is approved and isolated', () => {
  const valid = getRewardedAdSdkConfig({
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'official_test',
    VITE_REWARDED_AD_BUILD_TARGET: 'debug',
  });
  assert.equal(valid.configurationValid, true);
  assert.equal(valid.isTesting, true);
  assert.equal(valid.mockAllowed, false);
  assert.equal(valid.adId, GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID);
  assert.equal(isApprovedRewardedAdSdkConfig(valid), true);
});
test('production release configuration normalizes the injected ID and disables testing', () => {
  const config = makeProductionConfig();
  assert.equal(config.configurationValid, true);
  assert.equal(config.adId, createSyntheticProductionAdUnitId());
  assert.equal(config.isTesting, false);
  assert.equal(config.mockAllowed, false);
  assert.equal(isApprovedRewardedAdSdkConfig(config), true);
});
test('loader routes approved SDK configurations exactly once', async () => {
  for (const env of [
    {
      VITE_REWARDED_AD_PROVIDER: 'sdk',
      VITE_REWARDED_AD_SDK_ENABLED: 'true',
      VITE_REWARDED_AD_MODE: 'official_test',
      VITE_REWARDED_AD_BUILD_TARGET: 'debug',
    },
    {
      VITE_REWARDED_AD_PROVIDER: 'sdk',
      VITE_REWARDED_AD_SDK_ENABLED: 'true',
      VITE_REWARDED_AD_MODE: 'production',
      VITE_REWARDED_AD_BUILD_TARGET: 'release',
      VITE_REWARDED_AD_UNIT_ID: createSyntheticProductionAdUnitId(),
    },
  ]) {
    const sdkHarness = createLoaderHarness();
    await sdkHarness.loader({}, env);
    assert.deepEqual(sdkHarness.stats(), { mockCalls: 0, sdkCalls: 1 });
  }
});
for (const [name, env] of [
  ['unset provider with malformed releas target', {
    VITE_REWARDED_AD_BUILD_TARGET: 'releas',
  }],
  ['mock provider with preview target', {
    VITE_REWARDED_AD_PROVIDER: 'mock',
    VITE_REWARDED_AD_BUILD_TARGET: 'preview',
  }],
  ['mock provider with production target', {
    VITE_REWARDED_AD_PROVIDER: 'mock',
    VITE_REWARDED_AD_BUILD_TARGET: 'production',
  }],
]) {
  test(`loader fails closed for ${name}`, async () => {
    const config = getRewardedAdSdkConfig(env);
    assert.equal(config.configurationValid, false);
    assert.equal(config.mockAllowed, false);

    const harness = createLoaderHarness();
    const result = await harness.loader({}, env);
    assert.equal(result.reason, REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
    assert.deepEqual(harness.stats(), { mockCalls: 0, sdkCalls: 0 });
  });
}
test('loader fails closed for invalid production intent without mock fallback', async () => {
  const harness = createLoaderHarness();
  const result = await harness.loader(
    { placementId: 'today', categoryLabel: '총운' },
    {
      VITE_REWARDED_AD_PROVIDER: 'sdk',
      VITE_REWARDED_AD_SDK_ENABLED: 'true',
      VITE_REWARDED_AD_MODE: 'production',
      VITE_REWARDED_AD_BUILD_TARGET: 'release',
    },
  );
  assert.equal(result.ok, false);
  assert.equal(result.reason, REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
  assert.deepEqual(harness.stats(), { mockCalls: 0, sdkCalls: 0 });
});
test('legacy blank SDK scaffold preserves consent precondition with zero provider calls', async () => {
  const harness = createLoaderHarness();
  const env = {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
  };
  const withoutConsent = await harness.loader({ consentPreferences: { ads: false } }, env);
  assert.equal(withoutConsent.reason, REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED);
  assert.deepEqual(harness.stats(), { mockCalls: 0, sdkCalls: 0 });

  const withConsent = await harness.loader({ consentPreferences: { ads: true } }, env);
  assert.equal(withConsent.reason, REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
  assert.deepEqual(harness.stats(), { mockCalls: 0, sdkCalls: 0 });
});
test('loader never falls back to mock after an SDK failure', async () => {
  const harness = createLoaderHarness({
    sdkResult: {
      ok: false,
      provider: 'sdk_rewarded_ad',
      reason: REWARDED_AD_OUTCOME.SDK_UNAVAILABLE,
    },
  });
  const result = await harness.loader({}, {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'official_test',
    VITE_REWARDED_AD_BUILD_TARGET: 'debug',
  });
  assert.equal(result.ok, false);
  assert.deepEqual(harness.stats(), { mockCalls: 0, sdkCalls: 1 });
});
test('reward payload validation rejects unsafe values', () => {
  assert.equal(isValidAdMobRewardItem({ amount: 1, type: 'detail' }), true);
  for (const value of [null, {}, { amount: 0, type: 'x' }, { amount: Number.NaN, type: 'x' }, { amount: 1, type: '' }]) {
    assert.equal(isValidAdMobRewardItem(value), false);
  }
});
test('web and iOS fail before plugin import', async () => {
  for (const harness of [createHarness({ native: false }), createHarness({ platform: 'ios' })]) {
    const result = await harness.provider.show({ config: makeConfig() });
    assert.equal(result.reason, REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
    assert.equal(harness.stats().moduleLoads, 0);
  }
});
test('invalid configs make zero module, listener, prepare, and show calls', async () => {
  for (const config of [
    makeConfig({ configurationValid: false }),
    makeConfig({ mockAllowed: true }),
    makeConfig({ provider: 'mock' }),
    makeConfig({ adId: '' }),
    makeConfig({ isTesting: false }),
    makeConfig({
      mode: 'production',
      buildTarget: 'release',
      adId: GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID,
      isTesting: false,
    }),
  ]) {
    const harness = createHarness();
    const result = await harness.provider.show({ config });
    assert.equal(result.reason, REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
    assert.equal(harness.stats().moduleLoads, 0);
    assert.equal(harness.stats().listenerCalls, 0);
    assert.equal(harness.stats().prepareCalls, 0);
    assert.equal(harness.stats().showCalls, 0);
  }
});
test('local consent closes all ad calls', async () => {
  const harness = createHarness({ localSequence: [{ ads: false }] });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED);
  assert.equal(harness.stats().prepareCalls, 0);
  assert.equal(harness.stats().showCalls, 0);
  assert.equal(harness.stats().localReads, 1);
  assert.equal(harness.stats().runtimeReads, 0);
  assert.equal(harness.stats().moduleLoads, 0);
  assert.deepEqual(harness.stats().removed, []);
});
test('runtime gate closes all ad calls', async () => {
  const harness = createHarness({ runtimeSequence: [{ adGateOpen: false }] });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.AD_GATE_CLOSED);
  assert.equal(harness.stats().moduleLoads, 0);
});
test('pre-prepare local withdrawal blocks prepare', async () => {
  const harness = createHarness({ localSequence: [{ ads: true }, { ads: false }] });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED);
  assert.equal(harness.stats().prepareCalls, 0);
  assert.equal(harness.stats().showCalls, 0);
  assert.equal(harness.stats().localReads, 2);
});
test('pre-prepare runtime withdrawal blocks prepare', async () => {
  const open = { isNativeAndroid: true, consentInfoCompleted: true, canRequestAds: true, initializeResolved: true, adGateOpen: true };
  const harness = createHarness({ runtimeSequence: [open, { ...open, adGateOpen: false }] });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.AD_GATE_CLOSED);
  assert.equal(harness.stats().prepareCalls, 0);
});
test('pre-show withdrawal blocks show after one prepare', async () => {
  const harness = createHarness({ localSequence: [{ ads: true }, { ads: true }, { ads: false }] });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED);
  assert.equal(harness.stats().prepareCalls, 1);
  assert.equal(harness.stats().showCalls, 0);
  assert.equal(harness.stats().localReads, 3);
});
test('prepare uses exactly the validated local snapshot with npa enabled', async () => {
  const harness = createHarness({
    localSequence: [
      { ads: true, personalizedAds: true },
      { ads: true, personalizedAds: false },
      { ads: true, personalizedAds: true },
    ],
    onPrepare: () => {
      assert.equal(harness.stats().localReads, 2);
    },
  });
  await harness.provider.show({ config: makeConfig() });
  assert.equal(harness.stats().preparedOptions[0].isTesting, true);
  assert.equal(
    harness.stats().preparedOptions[0].adId,
    GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID,
  );
  assert.equal(harness.stats().preparedOptions[0].npa, true);
});
test('prepare uses exactly the validated local snapshot without forced npa', async () => {
  const harness = createHarness({
    localSequence: [
      { ads: true, personalizedAds: false },
      { ads: true, personalizedAds: true },
      { ads: true, personalizedAds: false },
    ],
    onPrepare: () => {
      assert.equal(harness.stats().localReads, 2);
    },
  });
  await harness.provider.show({ config: makeConfig() });
  assert.equal('npa' in harness.stats().preparedOptions[0], false);
});
test('production prepare uses the normalized production ID with testing disabled', async () => {
  const harness = createHarness();
  const config = makeProductionConfig();
  await harness.provider.show({ config });
  assert.equal(harness.stats().preparedOptions[0].adId, createSyntheticProductionAdUnitId());
  assert.equal(harness.stats().preparedOptions[0].isTesting, false);
});
test('valid reward completes without native payload exposure', async () => {
  const harness = createHarness();
  const result = await harness.provider.show({ config: makeConfig(), placementId: 'today', categoryLabel: '총운' });
  assert.deepEqual(result, {
    ok: true,
    provider: 'sdk_rewarded_ad',
    placementId: 'today',
    categoryLabel: '총운',
    rewardActionId: 'action-1',
    rewardRequestId: 'default-test-request',
    rewardedAt: '2026-07-27T00:00:00.000Z',
  });
  assert.equal(harness.stats().prepareCalls, 1);
  assert.equal(harness.stats().showCalls, 1);
  assert.equal(harness.stats().removed.length, 5);
});
test('invalid reward returns no reward', async () => {
  const harness = createHarness({ rewardItem: { amount: 0, type: 'detail' } });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.NO_REWARD);
});
test('prepare rejection maps to load failure', async () => {
  const harness = createHarness({ prepareReject: true });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.LOAD_FAILED);
});
test('FailedToLoad maps to load failure', async () => {
  const harness = createHarness({ preparePending: true, onPrepare: ({ listeners }) => queueMicrotask(() => listeners.get('failed-load')()) });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.LOAD_FAILED);
});
test('prepare timeout maps to timeout', async () => {
  const harness = createHarness({ preparePending: true });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.TIMEOUT);
});
test('show rejection maps to show failure', async () => {
  const harness = createHarness({ showReject: true });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.SHOW_FAILED);
});
test('FailedToShow maps to show failure', async () => {
  const harness = createHarness({ showPending: true, onShow: ({ listeners }) => queueMicrotask(() => listeners.get('failed-show')()) });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.SHOW_FAILED);
});
test('dismiss without reward is canceled after grace', async () => {
  const harness = createHarness({ showPending: true, onShow: ({ listeners }) => queueMicrotask(() => listeners.get('dismissed')()) });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.CANCELED);
});
test('show start timeout settles and cleans listeners', async () => {
  const harness = createHarness({ showPending: true });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.TIMEOUT);
  assert.equal(harness.stats().removed.length, 5);
});
test('listener partial setup failure cleans registered handles', async () => {
  const harness = createHarness({ listenerFailureAt: 2 });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.UNEXPECTED_ERROR);
  assert.equal(harness.stats().removed.length, 2);
});
test('cleanup failure cannot overturn a valid reward', async () => {
  const harness = createHarness({ cleanupFailure: true });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.ok, true);
});
test('rapid calls and listener reentry share one Promise', async () => {
  let reentryPromise;
  let provider;
  const harness = createHarness({
    showPending: true,
    onShow: ({ listeners }) => {
      queueMicrotask(() => {
        reentryPromise = provider.show({ config: makeConfig() });
        listeners.get('failed-show')();
      });
    },
  });
  provider = harness.provider;
  const first = provider.show({ config: makeConfig() });
  const second = provider.show({ config: makeConfig() });
  assert.equal(first, second);
  await first;
  assert.equal(reentryPromise, first);
  assert.equal(harness.stats().prepareCalls, 1);
  assert.equal(harness.stats().showCalls, 1);
});
test('a deliberate retry creates a new action', async () => {
  const harness = createHarness({ actionIds: ['first-action', 'retry-action'] });
  const first = harness.provider.show({ config: makeConfig() });
  const firstResult = await first;
  const second = harness.provider.show({ config: makeConfig() });
  assert.notEqual(first, second);
  const secondResult = await second;
  assert.equal(firstResult.rewardActionId, 'first-action');
  assert.equal(secondResult.rewardActionId, 'retry-action');
  assert.notEqual(firstResult.rewardActionId, secondResult.rewardActionId);
  assert.equal(harness.stats().prepareCalls, 2);
  assert.equal(harness.stats().showCalls, 2);
});
test('different category callers share one action but only the owner matches', async () => {
  const harness = createHarness({ actionIds: ['shared-category-action'] });
  const firstRequest = {
    config: makeConfig(),
    placementId: 'today_fortune_detail',
    categoryLabel: '총운',
    rewardRequestId: 'category-owner',
  };
  const secondRequest = {
    config: makeConfig(),
    placementId: 'today_fortune_detail',
    categoryLabel: '재물운',
    rewardRequestId: 'category-non-owner',
  };
  const first = harness.provider.show(firstRequest);
  const second = harness.provider.show(secondRequest);
  assert.equal(first, second);
  const result = await first;
  assert.equal(harness.stats().prepareCalls, 1);
  assert.equal(harness.stats().showCalls, 1);
  assert.equal(isRewardedResultForRequest(result, firstRequest), true);
  assert.equal(isRewardedResultForRequest(result, secondRequest), false);
  assert.equal(result.categoryLabel, '총운');
});
test('different placement callers cannot claim a shared action', async () => {
  const harness = createHarness();
  const firstRequest = {
    config: makeConfig(),
    placementId: 'today_fortune_detail',
    categoryLabel: '총운',
    rewardRequestId: 'placement-owner',
  };
  const secondRequest = {
    config: makeConfig(),
    placementId: 'saju_insight_deep_dive',
    categoryLabel: '총운',
    rewardRequestId: 'placement-non-owner',
  };
  const first = harness.provider.show(firstRequest);
  const second = harness.provider.show(secondRequest);
  assert.equal(first, second);
  const result = await first;
  assert.equal(isRewardedResultForRequest(result, firstRequest), true);
  assert.equal(isRewardedResultForRequest(result, secondRequest), false);
});
test('same placement and category callers share one action but only the initiating request ID owns it', async () => {
  let resolveReward;
  const showResultPromise = new Promise((resolve) => {
    resolveReward = resolve;
  });
  const harness = createHarness({
    actionIds: ['same-fields-action'],
    showResultPromise,
  });
  const firstRequest = {
    config: makeConfig(),
    placementId: 'today_fortune_detail',
    categoryLabel: '총운',
    rewardRequestId: 'request-before-reset',
  };
  const secondRequest = {
    ...firstRequest,
    rewardRequestId: 'request-after-reset',
  };
  const first = harness.provider.show(firstRequest);
  const second = harness.provider.show(secondRequest);
  assert.equal(first, second);
  resolveReward({ amount: 1, type: 'detail' });
  const result = await first;
  assert.equal(harness.stats().prepareCalls, 1);
  assert.equal(harness.stats().showCalls, 1);
  assert.equal(result.rewardRequestId, firstRequest.rewardRequestId);
  assert.equal(isRewardedResultForRequest(result, firstRequest), true);
  assert.equal(isRewardedResultForRequest(result, secondRequest), false);
});
test('reset and new session reject a shared old request before a deliberate retry', async () => {
  let resolveReward;
  const showResultPromise = new Promise((resolve) => {
    resolveReward = resolve;
  });
  const sharedHarness = createHarness({
    actionIds: ['pre-reset-action'],
    showResultPromise,
  });
  const beforeReset = {
    config: makeConfig(),
    placementId: 'today_fortune_detail',
    categoryLabel: '총운',
    rewardRequestId: 'request-before-reset',
  };
  const afterReset = {
    ...beforeReset,
    rewardRequestId: 'request-after-reset',
  };
  const oldPromise = sharedHarness.provider.show(beforeReset);
  const sharedPromise = sharedHarness.provider.show(afterReset);
  assert.equal(oldPromise, sharedPromise);
  resolveReward({ amount: 1, type: 'detail' });
  const oldResult = await oldPromise;

  const state = {
    persistedRewardKeys: new Set(),
    consumedSdkRewardActionIds: new Set(),
    saves: 0,
  };
  assert.equal(isRewardedResultForRequest(oldResult, afterReset), false);
  assert.equal(reservePersistence(state, {
    categoryId: 'overall',
    rewardResult: oldResult,
    expectedFortuneId: 'fortune-a',
    activeFortuneId: 'fortune-a',
    sessionEpoch: 0,
    currentSessionEpoch: 1,
    isAlreadyUnlocked: false,
  }), false);
  assert.equal(state.saves, 0);

  const retryHarness = createHarness({ actionIds: ['new-session-action'] });
  const retryRequest = {
    ...afterReset,
    rewardRequestId: 'request-deliberate-retry',
  };
  const retryResult = await retryHarness.provider.show(retryRequest);
  assert.notEqual(retryResult.rewardActionId, oldResult.rewardActionId);
  assert.notEqual(retryResult.rewardRequestId, oldResult.rewardRequestId);
  assert.equal(isRewardedResultForRequest(retryResult, retryRequest), true);
  assert.equal(reservePersistence(state, {
    categoryId: 'overall',
    rewardResult: retryResult,
    expectedFortuneId: 'fortune-a',
    activeFortuneId: 'fortune-a',
    sessionEpoch: 1,
    currentSessionEpoch: 1,
    isAlreadyUnlocked: false,
  }), true);
  assert.equal(state.saves, 1);
});
test('fortune replacement rejects shared old request and accepts deliberate retry', async () => {
  const sharedHarness = createHarness({ actionIds: ['fortune-a-action'] });
  const fortuneARequest = {
    config: makeConfig(),
    placementId: 'today_fortune_detail',
    categoryLabel: '총운',
    rewardRequestId: 'fortune-a-request',
  };
  const fortuneBRequest = {
    ...fortuneARequest,
    rewardRequestId: 'fortune-b-request',
  };
  const oldPromise = sharedHarness.provider.show(fortuneARequest);
  const sharedPromise = sharedHarness.provider.show(fortuneBRequest);
  assert.equal(oldPromise, sharedPromise);
  const oldResult = await oldPromise;
  assert.equal(isRewardedResultForRequest(oldResult, fortuneBRequest), false);

  const state = {
    persistedRewardKeys: new Set(),
    consumedSdkRewardActionIds: new Set(),
    saves: 0,
  };
  assert.equal(reservePersistence(state, {
    categoryId: 'overall',
    rewardResult: oldResult,
    expectedFortuneId: 'fortune-a',
    activeFortuneId: 'fortune-b',
    sessionEpoch: 0,
    currentSessionEpoch: 0,
    isAlreadyUnlocked: false,
  }), false);

  const retryHarness = createHarness({ actionIds: ['fortune-b-action'] });
  const retryRequest = {
    ...fortuneBRequest,
    rewardRequestId: 'fortune-b-retry',
  };
  const retryResult = await retryHarness.provider.show(retryRequest);
  assert.equal(isRewardedResultForRequest(retryResult, retryRequest), true);
  assert.equal(reservePersistence(state, {
    categoryId: 'overall',
    rewardResult: retryResult,
    expectedFortuneId: 'fortune-b',
    activeFortuneId: 'fortune-b',
    sessionEpoch: 0,
    currentSessionEpoch: 0,
    isAlreadyUnlocked: false,
  }), true);
  assert.equal(state.saves, 1);
});
test('shared result callback is delivered at most once to its owner', async () => {
  const result = {
    ok: true,
    placementId: 'today_fortune_detail',
    categoryLabel: '총운',
  };
  let callbacks = 0;
  for (const request of [
    { placementId: 'today_fortune_detail', categoryLabel: '총운' },
    { placementId: 'today_fortune_detail', categoryLabel: '재물운' },
  ]) {
    if (isRewardedResultForRequest(result, request)) callbacks += 1;
  }
  assert.equal(callbacks, 1);
});
test('same in-flight action shares one rewardActionId', async () => {
  const harness = createHarness({ actionIds: ['same-action'] });
  const first = harness.provider.show({ config: makeConfig() });
  const second = harness.provider.show({ config: makeConfig() });
  assert.equal(first, second);
  const [firstResult, secondResult] = await Promise.all([first, second]);
  assert.equal(firstResult.rewardActionId, 'same-action');
  assert.equal(secondResult.rewardActionId, 'same-action');
  assert.equal(harness.stats().actionIdCreates, 1);
});
test('SDK action ID is sanitized before reaching App', async () => {
  const harness = createHarness({ actionIds: ['  unsafe action/id  '] });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.rewardActionId, 'unsafe-action-id');
  assert(!result.rewardActionId.includes('/'));
});
test('reward request IDs are unique and use only safe bounded characters', () => {
  const generated = Array.from({ length: 10 }, () => createRewardedRequestId());
  assert.equal(new Set(generated).size, generated.length);
  for (const rewardRequestId of generated) {
    assert.equal(isValidRewardedRequestId(rewardRequestId), true);
    assert(rewardRequestId.length <= 128);
    assert(!/[/\s\x00-\x1F]/.test(rewardRequestId));
  }
});
test('reward request ID fallback remains unique without crypto', () => {
  const first = createRewardedRequestId({
    randomUUID: () => undefined,
    now: () => 1_721_862_400_000,
  });
  const second = createRewardedRequestId({
    randomUUID: () => undefined,
    now: () => 1_721_862_400_000,
  });
  assert.notEqual(first, second);
  assert.equal(isValidRewardedRequestId(first), true);
  assert.equal(isValidRewardedRequestId(second), true);
});
test('SDK fails closed before module load for missing or invalid reward request IDs', async () => {
  const invalidRequestIds = [undefined, '', ' ', 'unsafe/request', 'x'.repeat(129)];
  for (const rewardRequestId of invalidRequestIds) {
    const harness = createHarness();
    const result = await harness.providerWithoutDefaultRequestId.show({
      config: makeConfig(),
      placementId: 'today_fortune_detail',
      categoryLabel: '총운',
      rewardRequestId,
    });
    assert.equal(result.ok, false);
    assert.equal(result.reason, REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
    assert.equal(harness.stats().moduleLoads, 0);
    assert.equal(harness.stats().prepareCalls, 0);
    assert.equal(harness.stats().showCalls, 0);
  }
});

function reservePersistence(state, request) {
  const decision = getRewardPersistenceDecision({
    ...request,
    persistedRewardKeys: state.persistedRewardKeys,
    consumedSdkRewardActionIds: state.consumedSdkRewardActionIds,
  });
  if (!decision.allowed) return false;
  state.persistedRewardKeys.add(decision.persistenceKey);
  if (decision.rewardActionId) {
    state.consumedSdkRewardActionIds.add(decision.rewardActionId);
  }
  state.saves += 1;
  return true;
}

test('SDK rewardActionId can be persisted at most once', () => {
  const state = {
    persistedRewardKeys: new Set(),
    consumedSdkRewardActionIds: new Set(),
    saves: 0,
  };
  const request = {
    categoryId: 'overall',
    rewardResult: {
      ok: true,
      provider: 'sdk_rewarded_ad',
      rewardActionId: 'one-native-action',
    },
    expectedFortuneId: 'fortune-a',
    activeFortuneId: 'fortune-a',
    sessionEpoch: 0,
    currentSessionEpoch: 0,
    isAlreadyUnlocked: false,
  };
  assert.equal(reservePersistence(state, request), true);
  state.persistedRewardKeys.clear();
  assert.equal(reservePersistence(state, request), false);
  assert.equal(state.saves, 1);
});
test('SDK persistence rejects missing or invalid action IDs', () => {
  const state = {
    persistedRewardKeys: new Set(),
    consumedSdkRewardActionIds: new Set(),
    saves: 0,
  };
  for (const rewardActionId of [undefined, '', 'unsafe action/id']) {
    assert.equal(reservePersistence(state, {
      categoryId: 'overall',
      rewardResult: {
        ok: true,
        provider: 'sdk_rewarded_ad',
        rewardActionId,
      },
      expectedFortuneId: 'fortune-a',
      activeFortuneId: 'fortune-a',
      sessionEpoch: 0,
      currentSessionEpoch: 0,
      isAlreadyUnlocked: false,
    }), false);
  }
  assert.equal(state.saves, 0);
});
test('reset permits same fortune and category only in the new session', () => {
  const state = {
    persistedRewardKeys: new Set(),
    consumedSdkRewardActionIds: new Set(),
    saves: 0,
  };
  const base = {
    categoryId: 'overall',
    expectedFortuneId: 'deterministic-profile-id:2026-07-27',
    activeFortuneId: 'deterministic-profile-id:2026-07-27',
    isAlreadyUnlocked: false,
  };
  assert.equal(reservePersistence(state, {
    ...base,
    rewardResult: {
      ok: true,
      provider: 'sdk_rewarded_ad',
      rewardActionId: 'pre-reset-action',
    },
    sessionEpoch: 0,
    currentSessionEpoch: 0,
  }), true);

  state.persistedRewardKeys.clear();
  state.consumedSdkRewardActionIds.clear();
  const currentSessionEpoch = 1;

  assert.equal(reservePersistence(state, {
    ...base,
    rewardResult: {
      ok: true,
      provider: 'sdk_rewarded_ad',
      rewardActionId: 'stale-callback-action',
    },
    sessionEpoch: 0,
    currentSessionEpoch,
  }), false);
  assert.equal(reservePersistence(state, {
    ...base,
    rewardResult: {
      ok: true,
      provider: 'sdk_rewarded_ad',
      rewardActionId: 'new-session-action',
    },
    sessionEpoch: 1,
    currentSessionEpoch,
  }), true);
  assert.equal(state.saves, 2);
});
test('old fortune callback is rejected after profile or fortune change', () => {
  const decision = getRewardPersistenceDecision({
    categoryId: 'overall',
    rewardResult: {
      ok: true,
      provider: 'sdk_rewarded_ad',
      rewardActionId: 'old-fortune-action',
    },
    expectedFortuneId: 'old-fortune',
    activeFortuneId: 'new-fortune',
    sessionEpoch: 0,
    currentSessionEpoch: 0,
    isAlreadyUnlocked: false,
    persistedRewardKeys: new Set(),
    consumedSdkRewardActionIds: new Set(),
  });
  assert.equal(decision.allowed, false);
});

const approvedConfigMatrix = [
  ['case-normalized official test', {
    VITE_REWARDED_AD_PROVIDER: ' SDK ',
    VITE_REWARDED_AD_SDK_ENABLED: ' TRUE ',
    VITE_REWARDED_AD_MODE: ' OFFICIAL_TEST ',
    VITE_REWARDED_AD_BUILD_TARGET: ' DEBUG ',
  }, true],
  ['normalized production release', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
    VITE_REWARDED_AD_UNIT_ID: ` ${createSyntheticProductionAdUnitId()} `,
  }, false],
];
for (const [name, env, isTesting] of approvedConfigMatrix) {
  test(`approved configuration matrix: ${name}`, () => {
    const config = getRewardedAdSdkConfig(env);
    assert.equal(config.configurationValid, true);
    assert.equal(config.mockAllowed, false);
    assert.equal(config.isTesting, isTesting);
    assert.equal(isApprovedRewardedAdSdkConfig(config), true);
  });
}

const invalidConfigMatrix = [
  ['production missing ID', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
  }],
  ['production malformed ID', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
    VITE_REWARDED_AD_UNIT_ID: 'malformed',
  }],
  ['production App ID tilde form', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
    VITE_REWARDED_AD_UNIT_ID: createSyntheticAppId(),
  }],
  ['official test ID in production', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
    VITE_REWARDED_AD_UNIT_ID: GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID,
  }],
  ['production ID in official test', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'official_test',
    VITE_REWARDED_AD_BUILD_TARGET: 'debug',
    VITE_REWARDED_AD_UNIT_ID: createSyntheticProductionAdUnitId(),
  }],
  ['production debug target', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_BUILD_TARGET: 'debug',
    VITE_REWARDED_AD_UNIT_ID: createSyntheticProductionAdUnitId(),
  }],
  ['official test release target', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'official_test',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
  }],
  ['unknown provider', {
    VITE_REWARDED_AD_PROVIDER: 'unknown',
  }],
  ['mock production release', {
    VITE_REWARDED_AD_PROVIDER: 'mock',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
    VITE_REWARDED_AD_UNIT_ID: createSyntheticProductionAdUnitId(),
  }],
  ['SDK disabled', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'false',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
    VITE_REWARDED_AD_UNIT_ID: createSyntheticProductionAdUnitId(),
  }],
  ['partial mode', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'production',
    VITE_REWARDED_AD_UNIT_ID: createSyntheticProductionAdUnitId(),
  }],
  ['partial target', {
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_BUILD_TARGET: 'release',
    VITE_REWARDED_AD_UNIT_ID: createSyntheticProductionAdUnitId(),
  }],
];
for (const [name, env] of invalidConfigMatrix) {
  test(`invalid configuration matrix: ${name}`, () => {
    const config = getRewardedAdSdkConfig(env);
    assert.equal(config.configurationValid, false);
    assert.equal(config.adId, '');
    assert.equal(config.mockAllowed, false);
    assert.equal(isApprovedRewardedAdSdkConfig(config), false);
  });
}

const rewardPayloadMatrix = [
  ['integer amount', { amount: 1, type: 'detail' }, true],
  ['fractional amount', { amount: 0.5, type: 'detail' }, true],
  ['trimmed nonempty type', { amount: 2, type: ' reward ' }, true],
  ['null', null, false],
  ['array', [], false],
  ['zero amount', { amount: 0, type: 'detail' }, false],
  ['negative amount', { amount: -1, type: 'detail' }, false],
  ['NaN amount', { amount: Number.NaN, type: 'detail' }, false],
  ['infinite amount', { amount: Number.POSITIVE_INFINITY, type: 'detail' }, false],
  ['string amount', { amount: '1', type: 'detail' }, false],
  ['empty type', { amount: 1, type: '' }, false],
  ['whitespace type', { amount: 1, type: '   ' }, false],
];
for (const [name, payload, expected] of rewardPayloadMatrix) {
  test(`reward payload matrix: ${name}`, () => {
    assert.equal(isValidAdMobRewardItem(payload), expected);
  });
}

const runtimeOpen = {
  isNativeAndroid: true,
  consentInfoCompleted: true,
  canRequestAds: true,
  initializeResolved: true,
  adGateOpen: true,
};
for (const field of Object.keys(runtimeOpen)) {
  test(`runtime gate requires ${field}`, async () => {
    const harness = createHarness({
      runtimeSequence: [{ ...runtimeOpen, [field]: false }],
    });
    const result = await harness.provider.show({ config: makeConfig() });
    assert.equal(result.reason, REWARDED_AD_OUTCOME.AD_GATE_CLOSED);
    assert.equal(harness.stats().moduleLoads, 0);
  });
}

for (const [name, options, expectedOk] of [
  ['non-native web', { native: false }, false],
  ['native iOS', { platform: 'ios' }, false],
  ['native unknown platform', { platform: 'electron' }, false],
  ['native Android', {}, true],
]) {
  test(`platform matrix: ${name}`, async () => {
    const harness = createHarness(options);
    const result = await harness.provider.show({ config: makeConfig() });
    assert.equal(result.ok, expectedOk);
  });
}

for (const outcome of Object.values(REWARDED_AD_OUTCOME)) {
  test(`sanitized user message: ${outcome}`, () => {
    const message = getRewardedAdOutcomeMessage(outcome);
    assert.equal(typeof message, 'string');
    assert(message.length > 0);
    assert(!message.includes('Error'));
    assert(!message.includes('stack'));
  });
}

for (const [key, expected] of [
  ['load', 20_000],
  ['showStart', 10_000],
  ['lifecycle', 180_000],
  ['dismissRewardGrace', 500],
  ['cleanup', 2_000],
]) {
  test(`bounded timeout constant: ${key}`, () => {
    assert.equal(REWARDED_AD_TIMEOUT_MS[key], expected);
    assert(REWARDED_AD_TIMEOUT_MS[key] > 0);
  });
}

const targetedNegativeMutations = [
  {
    name: 'publisher prefix comparison weakened to always true',
    file: 'scripts/checkAdmobRewardedAdProvider.mjs',
    mutate: (source) => source.replace(
      '    appPublisherPrefix === adUnitPublisherPrefix &&',
      '    true &&',
    ),
  },
  {
    name: 'mismatched publisher prefix fixture changed to pass',
    file: 'scripts/checkAdmobRewardedAdProvider.mjs',
    mutate: (source) => source.replace(
      '  const mismatchedPublisherPrefixShouldPass = false;',
      '  const mismatchedPublisherPrefixShouldPass = true;',
    ),
  },
  {
    name: 'repository-wide tracked file scan weakened to changedFiles',
    file: 'scripts/checkAdmobRewardedAdProvider.mjs',
    mutate: (source) => source.replace(
      '\n  trackedFiles = getTrackedFiles();\n  const sourceErrors',
      '\n  trackedFiles = changedFiles;\n  const sourceErrors',
    ),
  },
  {
    name: 'tracked file extension allowlist reintroduced',
    file: 'scripts/checkAdmobRewardedAdProvider.mjs',
    mutate: (source) => source
      .replace(
        "const utf8Decoder = new TextDecoder('utf-8', { fatal: true });",
        [
          "const trackedTextExtensions = new Set(['.js']);",
          "const utf8Decoder = new TextDecoder('utf-8', { fatal: true });",
        ].join('\n'),
      )
      .replace(
        "    .map((file) => file.replaceAll('\\\\', '/'));",
        [
          "    .map((file) => file.replaceAll('\\\\', '/'))",
          '    .filter((file) => trackedTextExtensions.has(path.extname(file)));',
        ].join('\n'),
      ),
  },
  {
    name: 'tracked file enumeration filtered by path.extname',
    file: 'scripts/checkAdmobRewardedAdProvider.mjs',
    mutate: (source) => source.replace(
      "    .map((file) => file.replaceAll('\\\\', '/'));",
      [
        "    .map((file) => file.replaceAll('\\\\', '/'))",
        "    .filter((file) => path.extname(file) !== '');",
      ].join('\n'),
    ),
  },
  {
    name: 'tracked CSS sources excluded',
    file: 'scripts/checkAdmobRewardedAdProvider.mjs',
    mutate: (source) => source.replace(
      "    .map((file) => file.replaceAll('\\\\', '/'));",
      [
        "    .map((file) => file.replaceAll('\\\\', '/'))",
        "    .filter((file) => !file.endsWith('.css'));",
      ].join('\n'),
    ),
  },
  {
    name: 'tracked file enumeration shrunk to selected extensions',
    file: 'scripts/checkAdmobRewardedAdProvider.mjs',
    mutate: (source) => source.replace(
      "    .map((file) => file.replaceAll('\\\\', '/'));",
      [
        "    .map((file) => file.replaceAll('\\\\', '/'))",
        "    .filter((file) => ['.js', '.mjs'].includes(path.extname(file)));",
      ].join('\n'),
    ),
  },
  {
    name: 'concrete ad unit ID scan receives an empty file list',
    file: 'scripts/checkAdmobRewardedAdProvider.mjs',
    mutate: (source) => source.replace(
      '\n  assertNoConcreteProductionAdUnitIds(trackedFiles);\n  assert(!read',
      '\n  assertNoConcreteProductionAdUnitIds([]);\n  assert(!read',
    ),
  },
  {
    name: 'non-official concrete ad unit IDs are allowed',
    file: 'scripts/checkAdmobRewardedAdProvider.mjs',
    mutate: (source) => source.replace(
      'value !== GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID',
      'false',
    ),
  },
  {
    name: 'mock build target allowlist weakened to release denylist',
    file: 'src/config/rewardedAdSdkConfig.js',
    mutate: (source) => source.replace(
      /const mockBuildTargetApproved\s*=\s*buildTarget === ''\s*\|\|\s*buildTarget === REWARDED_AD_BUILD_TARGET\.DEBUG;/u,
      'const mockBuildTargetApproved =\n    buildTarget !== REWARDED_AD_BUILD_TARGET.RELEASE;',
    ),
  },
  {
    name: 'unvalidated local read reintroduced before prepare',
    file: 'src/services/rewardedAdProvider.sdk.js',
    mutate: (source) => source.replace(
      'const prepareOptions = {',
      'const unsafeLocalConsent = dependencies.loadLocalConsentPreferences();\n      const prepareOptions = {',
    ),
  },
  {
    name: 'result request ownership matching removed',
    file: 'src/components/RewardAdModal.jsx',
    mutate: (source) => source.replace(
      'isRewardedResultForRequest(result, {',
      'Boolean(result?.ok) && ignoreRequestOwnership({',
    ),
  },
  {
    name: 'production modal copy reverted to test-ad language',
    file: 'src/components/RewardAdModal.jsx',
    mutate: (source) => source.replace(
      "title: '보상형 광고'",
      "title: 'Google 공식 테스트 광고'",
    ),
  },
  {
    name: 'privacy copy restores no-production-serving claim',
    file: 'src/pages/PrivacyInfoPage.jsx',
    mutate: (source) =>
      `${source}\nproduction 환경의 실제 광고 송출은 없습니다.\n`,
  },
  {
    name: 'privacy copy restores unpublished-app claim',
    file: 'src/pages/PrivacyInfoPage.jsx',
    mutate: (source) => `${source}\n실제 서비스 공개 전\n`,
  },
  {
    name: 'consent copy restores production-not-implemented claim',
    file: 'src/components/ConsentSettingsPanel.jsx',
    mutate: (source) =>
      `${source}\nproduction 광고 기능은 아직 구현되지 않았습니다.\n`,
  },
  {
    name: 'official-test and production copy branch separation removed',
    file: 'src/components/RewardAdModal.jsx',
    mutate: (source) => source.replace(
      'if (isProductionSdk) return PRODUCTION_SDK_COPY;',
      'if (isProductionSdk) return OFFICIAL_TEST_SDK_COPY;',
    ),
  },
  {
    name: 'rewardActionId consumption guard removed',
    file: 'src/services/rewardedAdService.js',
    mutate: (source) => source.replace(
      'consumedSdkRewardActionIds.has(rewardActionId)',
      'false',
    ),
  },
  {
    name: 'reset Set clears removed',
    file: 'src/App.jsx',
    mutate: (source) => source
      .replace('persistedRewardKeysRef.current.clear();', '')
      .replace('consumedSdkRewardActionIdsRef.current.clear();', ''),
  },
  {
    name: 'reward session epoch check removed',
    file: 'src/App.jsx',
    mutate: (source) => source.replace(
      'currentSessionEpoch: rewardSessionEpochRef.current',
      'currentSessionEpoch: currentRewardSessionEpoch',
    ),
  },
  {
    name: 'modal rewardRequestId generation removed',
    file: 'src/components/RewardAdModal.jsx',
    mutate: (source) => source.replace(
      /    const rewardRequestId = createRewardedRequestId\(\);\r?\n/u,
      '',
    ),
  },
  {
    name: 'modal show options rewardRequestId removed',
    file: 'src/components/RewardAdModal.jsx',
    mutate: (source) => source.replace(
      /        rewardRequestId,\r?\n        consentPreferences,/u,
      '        consentPreferences,',
    ),
  },
  {
    name: 'SDK success result rewardRequestId removed',
    file: 'src/services/rewardedAdProvider.sdk.js',
    mutate: (source) => source.replace(
      /          rewardRequestId: options\.rewardRequestId,\r?\n/u,
      '',
    ),
  },
  {
    name: 'SDK request ID equality removed from ownership helper',
    file: 'src/services/rewardedAdService.js',
    mutate: (source) => source.replace(
      'result.rewardRequestId === rewardRequestId',
      'true',
    ),
  },
  {
    name: 'SDK ownership reduced to placement and category',
    file: 'src/services/rewardedAdService.js',
    mutate: (source) => source.replace(
      "  if (result?.provider === 'sdk_rewarded_ad') {",
      "  if (result?.provider === 'sdk_rewarded_ad') return baseRequestFieldsMatch;\n  if (false) {",
    ),
  },
  {
    name: 'SDK missing request ID allowed to reach ad calls',
    file: 'src/services/rewardedAdProvider.sdk.js',
    mutate: (source) => source.replace(
      'if (!isValidRewardedRequestId(options.rewardRequestId)) {',
      'if (false) {',
    ),
  },
  {
    name: 'second same-fields caller rewrites initiating request ownership',
    file: 'src/services/rewardedAdProvider.sdk.js',
    mutate: (source) => source.replace(
      'if (rewardedPromise) return rewardedPromise;',
      'if (rewardedPromise) return rewardedPromise.then((result) => ({ ...result, rewardRequestId: options.rewardRequestId }));',
    ),
  },
];

async function main() {
  if (releaseEnvPreflight) {
    runReleaseEnvironmentPreflight();
    return;
  }

  changedFiles = getChangedFiles();
  trackedFiles = getTrackedFiles();
  const sourceErrors = validateSources();
  assert.deepEqual(sourceErrors, [], sourceErrors.join('\n'));

  const officialId = ['ca-app-pub-3940256099942544', '5224354917'].join('/');
  assert(read('src/config/rewardedAdSdkConfig.js').includes(officialId));
  assertNoConcreteProductionAdUnitIds(trackedFiles);
  assert(!read('.github/workflows/android-debug-build.yml').includes('VITE_REWARDED_AD_PROVIDER: sdk'));
  runReleaseEnvironmentPreflightSubprocessTests();

  let behavioralAssertions = 0;
  for (const { name, run } of tests) {
    await run();
    behavioralAssertions += 1;
    process.stdout.write(`✓ ${name}\n`);
  }

  if (negativeSelfTest) {
    let detected = 0;
    for (const [index, [file, token]] of requiredTokens.entries()) {
      const source = read(file);
      const mutated = source.replaceAll(token, `__MUTATION_${index}__`);
      const errors = validateSources(new Map([[file, mutated]]));
      assert(errors.length > 0, `negative mutation escaped: ${file} ${token}`);
      detected += 1;
    }
    for (const mutation of targetedNegativeMutations) {
      const source = read(mutation.file);
      const mutated = mutation.mutate(source);
      assert.notEqual(mutated, source, `negative mutation did not apply: ${mutation.name}`);
      const errors = validateSources(new Map([[mutation.file, mutated]]));
      assert(errors.length > 0, `negative mutation escaped: ${mutation.name}`);
      detected += 1;
    }
    process.stdout.write(`Negative self-test: ${detected} mutations detected.\n`);
  }

  process.stdout.write(
    `AdMob rewarded provider checker passed: ${behavioralAssertions} behavioral scenarios, ${requiredTokens.length} static invariants${negativeSelfTest ? ', negative self-test passed' : ''}.\n`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
