import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  getRewardedAdSdkConfig,
  GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID,
} from '../src/config/rewardedAdSdkConfig.js';
import {
  createSdkRewardedAdProvider,
  isValidAdMobRewardItem,
  REWARDED_AD_TIMEOUT_MS,
} from '../src/services/rewardedAdProvider.sdk.js';
import { REWARDED_AD_OUTCOME } from '../src/services/rewardedAdProvider.types.js';
import { getRewardedAdOutcomeMessage } from '../src/services/rewardedAdService.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const negativeSelfTest = process.argv.includes('--negative-self-test');
const changedFiles = [
  '.github/workflows/android-rewarded-test-build.yml',
  'scripts/checkAdmobRewardedAdProvider.mjs',
  'src/services/rewardedAdProvider.sdk.js',
  'src/services/rewardedAdProvider.loader.js',
  'src/services/rewardedAdProvider.types.js',
  'src/services/rewardedAdService.js',
  'src/config/rewardedAdSdkConfig.js',
  'src/components/RewardAdModal.jsx',
  'src/pages/FortuneDetailPage.jsx',
  'src/pages/SajuInsightPage.jsx',
  'src/App.jsx',
  'src/utils/storage.js',
  'src/pages/PrivacyInfoPage.jsx',
  'src/components/ConsentSettingsPanel.jsx',
  'package.json',
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
].sort();

const protectedFiles = [
  'docs/ADMOB_REWARDED_AD_PROVIDER_CONTRACT.md',
  'scripts/checkAdmobRewardedAdProviderContract.mjs',
  'src/services/admobRuntimeConsentCoordinator.js',
  'src/services/rewardedAdProvider.mock.js',
  'src/components/AdRewardBox.jsx',
  'src/config/rewardedAdPlacements.js',
  'src/main.jsx',
  '.github/workflows/android-debug-build.yml',
  'package-lock.json',
  'capacitor.config.json',
  'vite.config.js',
];

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

const requiredTokens = [
  ['src/config/rewardedAdSdkConfig.js', 'GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID'],
  ['src/config/rewardedAdSdkConfig.js', "OFFICIAL_TEST: 'official_test'"],
  ['src/config/rewardedAdSdkConfig.js', "PRODUCTION: 'production'"],
  ['src/config/rewardedAdSdkConfig.js', "DEBUG: 'debug'"],
  ['src/config/rewardedAdSdkConfig.js', "RELEASE: 'release'"],
  ['src/config/rewardedAdSdkConfig.js', 'configurationValid'],
  ['src/config/rewardedAdSdkConfig.js', 'isTesting: configurationValid'],
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
  ['src/services/rewardedAdProvider.sdk.js', 'if (rewardedPromise) return rewardedPromise'],
  ['src/services/rewardedAdProvider.sdk.js', 'if (settled) return'],
  ['src/services/rewardedAdProvider.sdk.js', 'if (rewardDelivered)'],
  ['src/services/rewardedAdProvider.sdk.js', 'handle?.remove?.()'],
  ['src/services/rewardedAdProvider.sdk.js', 'Promise.allSettled'],
  ['src/services/rewardedAdProvider.sdk.js', 'dismissRewardGrace'],
  ['src/services/rewardedAdProvider.sdk.js', 'cleanup: 2_000'],
  ['src/services/rewardedAdProvider.sdk.js', 'Rewarded is diagnostic only'],
  ['src/services/rewardedAdProvider.sdk.js', 'latestLocalConsent?.personalizedAds'],
  ['src/services/rewardedAdProvider.loader.js', 'return showSdkRewardedAd({ ...options, config })'],
  ['src/services/rewardedAdService.js', 'export function showRewardedAd(options = {})'],
  ['src/services/rewardedAdProvider.loader.js', 'export function showRewardedAdWithResolvedProvider'],
  ['src/services/rewardedAdProvider.sdk.js', 'export function showSdkRewardedAd(options = {})'],
  ['src/components/RewardAdModal.jsx', 'completionDeliveredRef'],
  ['src/components/RewardAdModal.jsx', 'mountedRef'],
  ['src/components/RewardAdModal.jsx', 'Google 공식 테스트 광고'],
  ['src/components/RewardAdModal.jsx', '테스트 광고 보고 상세 풀이 열기'],
  ['src/components/RewardAdModal.jsx', 'onRewardComplete(result)'],
  ['src/components/RewardAdModal.jsx', "errorReason === 'ads_consent_required'"],
  ['src/pages/FortuneDetailPage.jsx', 'onUnlock={(rewardResult) => onUnlockDetail(category.id, rewardResult)}'],
  ['src/pages/SajuInsightPage.jsx', 'onUnlock={(rewardResult) =>'],
  ['src/App.jsx', 'const handleUnlockDetail = (categoryId, rewardResult) =>'],
  ['src/App.jsx', 'if (!fortune?.id || !categoryId) return'],
  ['src/App.jsx', "rewardResult?.provider === 'sdk_rewarded_ad'"],
  ['src/utils/storage.js', "rewardType = 'mock_rewarded_ad'"],
  ['src/utils/storage.js', "rewardType === 'sdk_rewarded_ad'"],
  ['src/utils/storage.js', 'rewardType: safeRewardType'],
  ['src/pages/PrivacyInfoPage.jsx', '공식 테스트 전용 빌드'],
  ['src/pages/PrivacyInfoPage.jsx', '광고 송출은 없습니다'],
  ['src/components/ConsentSettingsPanel.jsx', '별도 Android 공식 테스트 전용 빌드'],
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

  for (const file of changedFiles) {
    const source = sourceFor(file);
    if (source.includes('\uFFFD') || /[?][쒕쟾젣]/u.test(source)) {
      errors.push(`${file}: replacement character or known mojibake detected`);
    }
  }
  return errors;
}

function validateScope() {
  const branch = git(['branch', '--show-current']);
  if (branch === 'main') return;

  try {
    git(['rev-parse', '--verify', 'origin/main']);
  } catch (error) {
    if (process.env.GITHUB_ACTIONS === 'true') {
      process.stdout.write(
        'Scope check skipped: origin/main is unavailable in the shallow Actions checkout.\n',
      );
      return;
    }
    throw error;
  }

  const diffFiles = new Set(
    git(['diff', '--name-only', 'origin/main...HEAD'])
      .split(/\r?\n/)
      .filter(Boolean),
  );
  const statusLines = execFileSync('git', ['status', '--porcelain'], {
    cwd: root,
    encoding: 'utf8',
  })
    .split(/\r?\n/)
    .filter(Boolean);
  for (const line of statusLines) {
    const file = line.slice(3).replaceAll('\\', '/');
    if (!['pr405-review.json', 'pr405.diff'].includes(file)) diffFiles.add(file);
  }
  assert.deepEqual([...diffFiles].sort(), changedFiles, 'PR must contain exactly the approved 18 files');
  for (const file of protectedFiles) {
    assert(!diffFiles.has(file), `protected file changed: ${file}`);
  }
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
    ...overrides,
  };
}

function createHarness(options = {}) {
  const listeners = new Map();
  const removed = [];
  let prepareCalls = 0;
  let showCalls = 0;
  let localReads = 0;
  let runtimeReads = 0;
  let moduleLoads = 0;
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
        options.onPrepare?.({ prepareOptions, listeners });
        if (options.prepareReject) throw new Error('load');
        if (options.preparePending) return new Promise(() => {});
        return {};
      },
      async showRewardVideoAd() {
        showCalls += 1;
        options.onShow?.({ listeners });
        if (options.showReject) throw new Error('show');
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
  };
  return {
    provider: createSdkRewardedAdProvider(dependencies),
    listeners,
    stats: () => ({ prepareCalls, showCalls, localReads, runtimeReads, moduleLoads, removed }),
  };
}

const tests = [];
function test(name, run) {
  tests.push({ name, run });
}

test('default config remains mock and disabled', () => {
  const config = getRewardedAdSdkConfig({});
  assert.equal(config.provider, 'mock');
  assert.equal(config.configurationValid, false);
  assert.equal(config.adId, '');
});
test('official test debug configuration is the only valid SDK configuration', () => {
  const valid = getRewardedAdSdkConfig({
    VITE_REWARDED_AD_PROVIDER: 'sdk',
    VITE_REWARDED_AD_SDK_ENABLED: 'true',
    VITE_REWARDED_AD_MODE: 'official_test',
    VITE_REWARDED_AD_BUILD_TARGET: 'debug',
  });
  assert.equal(valid.configurationValid, true);
  assert.equal(valid.isTesting, true);
  assert.equal(valid.adId, GOOGLE_OFFICIAL_ANDROID_REWARDED_TEST_AD_UNIT_ID);
  for (const mutation of [
    { VITE_REWARDED_AD_MODE: '' },
    { VITE_REWARDED_AD_BUILD_TARGET: '' },
    { VITE_REWARDED_AD_BUILD_TARGET: 'release' },
    { VITE_REWARDED_AD_MODE: 'production' },
    { VITE_REWARDED_AD_SDK_ENABLED: 'false' },
  ]) {
    assert.equal(getRewardedAdSdkConfig({
      VITE_REWARDED_AD_PROVIDER: 'sdk',
      VITE_REWARDED_AD_SDK_ENABLED: 'true',
      VITE_REWARDED_AD_MODE: 'official_test',
      VITE_REWARDED_AD_BUILD_TARGET: 'debug',
      ...mutation,
    }).configurationValid, false);
  }
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
test('invalid config fails before plugin import', async () => {
  const harness = createHarness();
  const result = await harness.provider.show({ config: makeConfig({ configurationValid: false }) });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
  assert.equal(harness.stats().moduleLoads, 0);
});
test('local consent closes all ad calls', async () => {
  const harness = createHarness({ localSequence: [{ ads: false }] });
  const result = await harness.provider.show({ config: makeConfig() });
  assert.equal(result.reason, REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED);
  assert.deepEqual(harness.stats(), { prepareCalls: 0, showCalls: 0, localReads: 1, runtimeReads: 0, moduleLoads: 0, removed: [] });
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
});
test('valid reward completes without native payload exposure', async () => {
  const harness = createHarness();
  const result = await harness.provider.show({ config: makeConfig(), placementId: 'today', categoryLabel: '총운' });
  assert.deepEqual(result, {
    ok: true,
    provider: 'sdk_rewarded_ad',
    placementId: 'today',
    categoryLabel: '총운',
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
  const harness = createHarness();
  const first = harness.provider.show({ config: makeConfig() });
  await first;
  const second = harness.provider.show({ config: makeConfig() });
  assert.notEqual(first, second);
  await second;
  assert.equal(harness.stats().prepareCalls, 2);
  assert.equal(harness.stats().showCalls, 2);
});

const configMatrix = [
  ['missing mode', { VITE_REWARDED_AD_MODE: '' }, false],
  ['missing target', { VITE_REWARDED_AD_BUILD_TARGET: '' }, false],
  ['release target', { VITE_REWARDED_AD_BUILD_TARGET: 'release' }, false],
  ['production mode', { VITE_REWARDED_AD_MODE: 'production' }, false],
  ['disabled provider', { VITE_REWARDED_AD_PROVIDER: 'mock' }, false],
  ['unknown mode', { VITE_REWARDED_AD_MODE: 'preview' }, false],
  ['unknown target', { VITE_REWARDED_AD_BUILD_TARGET: 'preview' }, false],
  ['SDK disabled', { VITE_REWARDED_AD_SDK_ENABLED: 'false' }, false],
  ['case-normalized official test', {
    VITE_REWARDED_AD_PROVIDER: 'SDK',
    VITE_REWARDED_AD_MODE: 'OFFICIAL_TEST',
    VITE_REWARDED_AD_BUILD_TARGET: 'DEBUG',
  }, true],
];
for (const [name, mutation, expected] of configMatrix) {
  test(`configuration matrix: ${name}`, () => {
    const config = getRewardedAdSdkConfig({
      VITE_REWARDED_AD_PROVIDER: 'sdk',
      VITE_REWARDED_AD_SDK_ENABLED: 'true',
      VITE_REWARDED_AD_MODE: 'official_test',
      VITE_REWARDED_AD_BUILD_TARGET: 'debug',
      ...mutation,
    });
    assert.equal(config.configurationValid, expected);
    assert.equal(Boolean(config.adId), expected);
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

async function main() {
  validateScope();
  const sourceErrors = validateSources();
  assert.deepEqual(sourceErrors, [], sourceErrors.join('\n'));

  const officialId = ['ca-app-pub-3940256099942544', '5224354917'].join('/');
  const literalLocations = changedFiles.filter((file) => read(file).includes(officialId));
  assert.deepEqual(literalLocations, ['src/config/rewardedAdSdkConfig.js']);
  assert(!read('.github/workflows/android-debug-build.yml').includes('VITE_REWARDED_AD_PROVIDER: sdk'));

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
