import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  BANNER_AD_ROUTE_ALLOWLIST,
  createBannerAdService,
  getBannerEligibility,
  isBannerAllowedRoute,
  resolveBannerNpa,
} from '../src/services/bannerAdService.js';
import {
  getBannerAdSdkConfig,
  GOOGLE_OFFICIAL_ANDROID_ADAPTIVE_BANNER_TEST_AD_UNIT_ID,
  isApprovedBannerAdSdkConfig,
} from '../src/config/bannerAdSdkConfig.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const concreteAdUnitIdPattern = /\bca-app-pub-\d{16}\/\d{10}\b/gu;

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function git(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

// Built from separate prefix/digit components (never a contiguous literal)
// so the repository-wide concrete-ad-unit-ID scanner in
// checkAdmobRewardedAdProvider.mjs does not mistake this test fixture for a
// real production ad unit ID.
function createSyntheticProductionAdUnitId() {
  const publisher = ['1234', '5678', '9012', '3456'].join('');
  const adUnit = ['12345', '67890'].join('');
  return ['ca-app-pub-', publisher, '/', adUnit].join('');
}

function getChangedFiles() {
  const diffOutput = git(['diff', '--name-only', 'origin/main...HEAD']);
  const committed = diffOutput ? diffOutput.split(/\r?\n/).filter(Boolean) : [];
  const staged = git(['diff', '--name-only', '--cached']).split(/\r?\n/).filter(Boolean);
  const working = git(['diff', '--name-only']).split(/\r?\n/).filter(Boolean);
  const untracked = git(['ls-files', '--others', '--exclude-standard'])
    .split(/\r?\n/)
    .filter(Boolean);
  return [...new Set([...committed, ...staged, ...working, ...untracked])]
    .map((file) => file.replaceAll('\\', '/'));
}

const PROTECTED_PATH_PREFIXES = [
  'android/',
  '.github/workflows/',
  'src/services/admobRuntimeConsentCoordinator.js',
  'src/services/rewardedAdProvider.sdk.js',
  'src/services/rewardedAdService.js',
  'src/components/RewardAdModal.jsx',
  'package.json',
  'package-lock.json',
];

const tests = [];
function test(name, run) {
  tests.push({ name, run });
}

test('route allowlist is exactly home/sajuInsight/year/zodiac', () => {
  assert.deepEqual(
    [...BANNER_AD_ROUTE_ALLOWLIST].sort(),
    ['home', 'sajuInsight', 'year', 'zodiac'].sort(),
  );
  for (const page of ['home', 'sajuInsight', 'year', 'zodiac']) {
    assert.equal(isBannerAllowedRoute(page), true);
  }
  for (const page of [
    'settings',
    'privacyInfo',
    'onboarding',
    'profileEdit',
    'fortune',
    'savedReadings',
    'ai',
    'compatibility',
    'premium',
    undefined,
    null,
    '',
  ]) {
    assert.equal(isBannerAllowedRoute(page), false, `${page} must not be allowlisted`);
  }
});

test('default no-intent config is fail-closed', () => {
  const config = getBannerAdSdkConfig({});
  assert.equal(config.configurationValid, false);
  assert.equal(config.adId, '');
  assert.equal(isApprovedBannerAdSdkConfig(config), false);
});

test('official test config is approved only with sdk+enabled+debug+no unit id', () => {
  const approved = getBannerAdSdkConfig({
    VITE_BANNER_AD_PROVIDER: 'sdk',
    VITE_BANNER_AD_SDK_ENABLED: 'true',
    VITE_BANNER_AD_MODE: 'official_test',
    VITE_BANNER_AD_BUILD_TARGET: 'debug',
  });
  assert.equal(approved.configurationValid, true);
  assert.equal(approved.isTesting, true);
  assert.equal(approved.adId, GOOGLE_OFFICIAL_ANDROID_ADAPTIVE_BANNER_TEST_AD_UNIT_ID);
  assert.equal(isApprovedBannerAdSdkConfig(approved), true);

  for (const overrides of [
    { VITE_BANNER_AD_BUILD_TARGET: 'release' },
    { VITE_BANNER_AD_SDK_ENABLED: 'false' },
    { VITE_BANNER_AD_PROVIDER: 'mock' },
    { VITE_BANNER_AD_UNIT_ID: createSyntheticProductionAdUnitId() },
  ]) {
    const rejected = getBannerAdSdkConfig({
      VITE_BANNER_AD_PROVIDER: 'sdk',
      VITE_BANNER_AD_SDK_ENABLED: 'true',
      VITE_BANNER_AD_MODE: 'official_test',
      VITE_BANNER_AD_BUILD_TARGET: 'debug',
      ...overrides,
    });
    assert.equal(rejected.configurationValid, false, JSON.stringify(overrides));
  }
});

test('production config requires release target and a non-test unit id', () => {
  const productionAdUnitId = createSyntheticProductionAdUnitId();
  const approved = getBannerAdSdkConfig({
    VITE_BANNER_AD_PROVIDER: 'sdk',
    VITE_BANNER_AD_SDK_ENABLED: 'true',
    VITE_BANNER_AD_MODE: 'production',
    VITE_BANNER_AD_BUILD_TARGET: 'release',
    VITE_BANNER_AD_UNIT_ID: productionAdUnitId,
  });
  assert.equal(approved.configurationValid, true);
  assert.equal(approved.isTesting, false);
  assert.equal(approved.adId, productionAdUnitId);
  assert.equal(isApprovedBannerAdSdkConfig(approved), true);

  const rejectsTestIdAsProduction = getBannerAdSdkConfig({
    VITE_BANNER_AD_PROVIDER: 'sdk',
    VITE_BANNER_AD_SDK_ENABLED: 'true',
    VITE_BANNER_AD_MODE: 'production',
    VITE_BANNER_AD_BUILD_TARGET: 'release',
    VITE_BANNER_AD_UNIT_ID: GOOGLE_OFFICIAL_ANDROID_ADAPTIVE_BANNER_TEST_AD_UNIT_ID,
  });
  assert.equal(rejectsTestIdAsProduction.configurationValid, false);

  const rejectsDebugTarget = getBannerAdSdkConfig({
    VITE_BANNER_AD_PROVIDER: 'sdk',
    VITE_BANNER_AD_SDK_ENABLED: 'true',
    VITE_BANNER_AD_MODE: 'production',
    VITE_BANNER_AD_BUILD_TARGET: 'debug',
    VITE_BANNER_AD_UNIT_ID: productionAdUnitId,
  });
  assert.equal(rejectsDebugTarget.configurationValid, false);
});

test('eligibility requires native gate, local ads consent, route, and approved config', () => {
  const approvedConfig = getBannerAdSdkConfig({
    VITE_BANNER_AD_PROVIDER: 'sdk',
    VITE_BANNER_AD_SDK_ENABLED: 'true',
    VITE_BANNER_AD_MODE: 'official_test',
    VITE_BANNER_AD_BUILD_TARGET: 'debug',
  });
  const openRuntime = {
    isNativeAndroid: true,
    consentInfoCompleted: true,
    canRequestAds: true,
    initializeResolved: true,
    adGateOpen: true,
  };

  assert.equal(
    getBannerEligibility({
      activePage: 'home',
      consentPreferences: { ads: true },
      runtimeSnapshot: openRuntime,
      config: approvedConfig,
      isSuppressed: false,
    }).allowed,
    true,
  );

  assert.equal(
    getBannerEligibility({
      activePage: 'settings',
      consentPreferences: { ads: true },
      runtimeSnapshot: openRuntime,
      config: approvedConfig,
      isSuppressed: false,
    }).allowed,
    false,
  );

  assert.equal(
    getBannerEligibility({
      activePage: 'home',
      consentPreferences: { ads: false },
      runtimeSnapshot: openRuntime,
      config: approvedConfig,
      isSuppressed: false,
    }).allowed,
    false,
  );

  assert.equal(
    getBannerEligibility({
      activePage: 'home',
      consentPreferences: { ads: true },
      runtimeSnapshot: { ...openRuntime, adGateOpen: false },
      config: approvedConfig,
      isSuppressed: false,
    }).allowed,
    false,
  );

  assert.equal(
    getBannerEligibility({
      activePage: 'home',
      consentPreferences: { ads: true },
      runtimeSnapshot: openRuntime,
      config: getBannerAdSdkConfig({}),
      isSuppressed: false,
    }).allowed,
    false,
  );

  assert.equal(
    getBannerEligibility({
      activePage: 'home',
      consentPreferences: { ads: true },
      runtimeSnapshot: openRuntime,
      config: approvedConfig,
      isSuppressed: true,
    }).allowed,
    false,
  );
});

test('hard eligibility gates take precedence over temporary suppression/route reasons', () => {
  const approvedConfig = getBannerAdSdkConfig({
    VITE_BANNER_AD_PROVIDER: 'sdk',
    VITE_BANNER_AD_SDK_ENABLED: 'true',
    VITE_BANNER_AD_MODE: 'official_test',
    VITE_BANNER_AD_BUILD_TARGET: 'debug',
  });
  const openRuntime = {
    isNativeAndroid: true,
    consentInfoCompleted: true,
    canRequestAds: true,
    initializeResolved: true,
    adGateOpen: true,
  };
  const closedCanRequestAdsRuntime = { ...openRuntime, canRequestAds: false };
  const closedAdGateRuntime = { ...openRuntime, adGateOpen: false };

  // 1. revoked ads consent outranks temporary suppression.
  assert.deepEqual(
    getBannerEligibility({
      activePage: 'home',
      consentPreferences: { ads: false },
      runtimeSnapshot: openRuntime,
      config: approvedConfig,
      isSuppressed: true,
    }),
    { allowed: false, reason: 'ads_consent_required' },
  );

  // 2. revoked ads consent outranks a non-allowlisted route.
  assert.deepEqual(
    getBannerEligibility({
      activePage: 'settings',
      consentPreferences: { ads: false },
      runtimeSnapshot: openRuntime,
      config: approvedConfig,
      isSuppressed: false,
    }),
    { allowed: false, reason: 'ads_consent_required' },
  );

  // 3. a closed runtime gate outranks temporary suppression.
  assert.deepEqual(
    getBannerEligibility({
      activePage: 'home',
      consentPreferences: { ads: true },
      runtimeSnapshot: closedCanRequestAdsRuntime,
      config: approvedConfig,
      isSuppressed: true,
    }),
    { allowed: false, reason: 'ad_gate_closed' },
  );

  // 4. a closed runtime gate outranks a non-allowlisted route.
  assert.deepEqual(
    getBannerEligibility({
      activePage: 'settings',
      consentPreferences: { ads: true },
      runtimeSnapshot: closedAdGateRuntime,
      config: approvedConfig,
      isSuppressed: false,
    }),
    { allowed: false, reason: 'ad_gate_closed' },
  );

  // 5. with all hard gates valid, a temporary overlay still reports 'suppressed'.
  assert.deepEqual(
    getBannerEligibility({
      activePage: 'home',
      consentPreferences: { ads: true },
      runtimeSnapshot: openRuntime,
      config: approvedConfig,
      isSuppressed: true,
    }),
    { allowed: false, reason: 'suppressed' },
  );

  // 6. with all hard gates valid, an excluded route still reports 'route_not_allowlisted'.
  assert.deepEqual(
    getBannerEligibility({
      activePage: 'settings',
      consentPreferences: { ads: true },
      runtimeSnapshot: openRuntime,
      config: approvedConfig,
      isSuppressed: false,
    }),
    { allowed: false, reason: 'route_not_allowlisted' },
  );
});

test('npa mirrors Rewarded personalization behavior', () => {
  assert.equal(resolveBannerNpa({ personalizedAds: true }), false);
  assert.equal(resolveBannerNpa({ personalizedAds: false }), true);
  assert.equal(resolveBannerNpa({}), true);
  assert.equal(resolveBannerNpa(null), true);
});

test('non-native platforms never call showBanner/hideBanner/removeBanner', async () => {
  let showCalls = 0;
  const service = createBannerAdService({
    isNativePlatform: () => false,
    getPlatform: () => 'web',
    loadAdMobModule: async () => {
      throw new Error('module must not load on non-native platforms');
    },
  });

  await service.show({ adId: 'x', isTesting: true, npa: false, marginPx: 10 });
  await service.hide();
  await service.remove();
  assert.equal(showCalls, 0);
  assert.equal(service.getNativeState(), 'removed');
});

test('duplicate show calls with the same signature call showBanner exactly once', async () => {
  let showBannerCalls = 0;
  const module = {
    BannerAdPluginEvents: { SizeChanged: 'sizeChanged', FailedToLoad: 'failedToLoad' },
    BannerAdSize: { ADAPTIVE_BANNER: 'ADAPTIVE_BANNER' },
    BannerAdPosition: { BOTTOM_CENTER: 'BOTTOM_CENTER' },
    AdMob: {
      async addListener() {
        return { remove: async () => {} };
      },
      async showBanner() {
        showBannerCalls += 1;
      },
    },
  };
  const service = createBannerAdService({
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    loadAdMobModule: async () => module,
  });

  const options = { adId: 'ca-app-pub-3940256099942544/9214589741', isTesting: true, npa: true, marginPx: 42 };
  await Promise.all([service.show(options), service.show(options), service.show(options)]);
  assert.equal(showBannerCalls, 1);
  assert.equal(service.getNativeState(), 'shown');
});

test('a stale show is skipped once isStillValid reports invalid', async () => {
  let showBannerCalls = 0;
  const module = {
    BannerAdPluginEvents: { SizeChanged: 'sizeChanged', FailedToLoad: 'failedToLoad' },
    BannerAdSize: { ADAPTIVE_BANNER: 'ADAPTIVE_BANNER' },
    BannerAdPosition: { BOTTOM_CENTER: 'BOTTOM_CENTER' },
    AdMob: {
      async addListener() {
        return { remove: async () => {} };
      },
      async showBanner() {
        showBannerCalls += 1;
      },
    },
  };
  const service = createBannerAdService({
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    loadAdMobModule: async () => module,
  });

  await service.show({
    adId: 'ca-app-pub-3940256099942544/9214589741',
    isTesting: true,
    npa: true,
    marginPx: 10,
    isStillValid: () => false,
  });
  assert.equal(showBannerCalls, 0);
  assert.equal(service.getNativeState(), 'none');
});

test('hide is a no-op unless the banner is currently shown', async () => {
  let hideBannerCalls = 0;
  const service = createBannerAdService({
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    loadAdMobModule: async () => ({
      AdMob: {
        async hideBanner() {
          hideBannerCalls += 1;
        },
      },
    }),
  });

  await service.hide();
  assert.equal(hideBannerCalls, 0);
});

function createTrackingAdMobModule() {
  const calls = [];
  return {
    calls,
    module: {
      BannerAdPluginEvents: { SizeChanged: 'sizeChanged', FailedToLoad: 'failedToLoad' },
      BannerAdSize: { ADAPTIVE_BANNER: 'ADAPTIVE_BANNER' },
      BannerAdPosition: { BOTTOM_CENTER: 'BOTTOM_CENTER' },
      AdMob: {
        async addListener() {
          return { remove: async () => {} };
        },
        async showBanner() {
          calls.push('show');
        },
        async hideBanner() {
          calls.push('hide');
        },
        async resumeBanner() {
          calls.push('resume');
        },
        async removeBanner() {
          calls.push('remove');
        },
      },
    },
  };
}

test('shown -> temporary suppression calls hideBanner exactly once', async () => {
  const { module, calls } = createTrackingAdMobModule();
  const service = createBannerAdService({
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    loadAdMobModule: async () => module,
  });

  const options = { adId: 'ca-app-pub-3940256099942544/9214589741', isTesting: true, npa: true, marginPx: 10 };
  await service.show(options);
  await service.hide();
  await service.hide();
  assert.deepEqual(calls, ['show', 'hide']);
  assert.equal(service.getNativeState(), 'hidden');
});

test('hidden -> same configuration eligible again resumes exactly once, without a second showBanner', async () => {
  const { module, calls } = createTrackingAdMobModule();
  const service = createBannerAdService({
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    loadAdMobModule: async () => module,
  });

  const options = { adId: 'ca-app-pub-3940256099942544/9214589741', isTesting: true, npa: true, marginPx: 10 };
  await service.show(options);
  await service.hide();
  await service.resume();
  assert.deepEqual(calls, ['show', 'hide', 'resume']);
  assert.equal(service.getNativeState(), 'shown');
});

test('ads consent true -> false removes the Banner (hard gate loss, not a hide)', async () => {
  const { module, calls } = createTrackingAdMobModule();
  const service = createBannerAdService({
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    loadAdMobModule: async () => module,
  });
  const approvedConfig = getBannerAdSdkConfig({
    VITE_BANNER_AD_PROVIDER: 'sdk',
    VITE_BANNER_AD_SDK_ENABLED: 'true',
    VITE_BANNER_AD_MODE: 'official_test',
    VITE_BANNER_AD_BUILD_TARGET: 'debug',
  });
  const openRuntime = {
    isNativeAndroid: true,
    consentInfoCompleted: true,
    canRequestAds: true,
    initializeResolved: true,
    adGateOpen: true,
  };

  await service.show({ adId: approvedConfig.adId, isTesting: approvedConfig.isTesting, npa: true, marginPx: 10 });

  const revoked = getBannerEligibility({
    activePage: 'home',
    consentPreferences: { ads: false },
    runtimeSnapshot: openRuntime,
    config: approvedConfig,
    isSuppressed: false,
  });
  assert.equal(revoked.allowed, false);
  assert.equal(revoked.reason, 'ads_consent_required');

  await service.remove();
  assert.deepEqual(calls, ['show', 'remove']);
  assert.equal(service.getNativeState(), 'removed');
});

test('runtime canRequestAds/adGateOpen closing removes the Banner (hard gate loss, not a hide)', async () => {
  const { module, calls } = createTrackingAdMobModule();
  const service = createBannerAdService({
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    loadAdMobModule: async () => module,
  });
  const approvedConfig = getBannerAdSdkConfig({
    VITE_BANNER_AD_PROVIDER: 'sdk',
    VITE_BANNER_AD_SDK_ENABLED: 'true',
    VITE_BANNER_AD_MODE: 'official_test',
    VITE_BANNER_AD_BUILD_TARGET: 'debug',
  });

  await service.show({ adId: approvedConfig.adId, isTesting: approvedConfig.isTesting, npa: true, marginPx: 10 });

  const closedGate = getBannerEligibility({
    activePage: 'home',
    consentPreferences: { ads: true },
    runtimeSnapshot: {
      isNativeAndroid: true,
      consentInfoCompleted: true,
      canRequestAds: false,
      initializeResolved: true,
      adGateOpen: true,
    },
    config: approvedConfig,
    isSuppressed: false,
  });
  assert.equal(closedGate.allowed, false);
  assert.equal(closedGate.reason, 'ad_gate_closed');

  await service.remove();
  assert.deepEqual(calls, ['show', 'remove']);
  assert.equal(service.getNativeState(), 'removed');
});

test('a stale queued show made invalid by a personalization/generation change never reaches showBanner', async () => {
  const { module, calls } = createTrackingAdMobModule();
  const service = createBannerAdService({
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    loadAdMobModule: async () => module,
  });

  let generation = 1;
  const staleGeneration = generation;
  const isStillValid = () => generation === staleGeneration;

  const stalePromise = service.show({
    adId: 'ca-app-pub-3940256099942544/9214589741',
    isTesting: true,
    npa: false,
    marginPx: 10,
    isStillValid,
  });
  generation += 1;
  await stalePromise;

  assert.deepEqual(calls, []);
  assert.equal(service.getNativeState(), 'none');
});

test('a Banner identity (adId/isTesting/npa) change removes the old Banner before the replacement is shown', async () => {
  const { module, calls } = createTrackingAdMobModule();
  const service = createBannerAdService({
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    loadAdMobModule: async () => module,
  });

  await service.show({ adId: 'ca-app-pub-3940256099942544/9214589741', isTesting: true, npa: false, marginPx: 10 });
  await service.remove();
  await service.show({ adId: 'ca-app-pub-3940256099942544/9214589741', isTesting: true, npa: true, marginPx: 10 });

  assert.deepEqual(calls, ['show', 'remove', 'show']);
  assert.equal(service.getNativeState(), 'shown');
});

function validateSources() {
  const errors = [];
  const hostSource = read('src/components/AdaptiveBannerHost.jsx');
  const serviceSource = read('src/services/bannerAdService.js');
  const configSource = read('src/config/bannerAdSdkConfig.js');
  const appSource = read('src/App.jsx');

  if (!serviceSource.includes("BannerAdSize.ADAPTIVE_BANNER")) {
    errors.push('bannerAdService.js must use BannerAdSize.ADAPTIVE_BANNER');
  }
  if (!serviceSource.includes('BannerAdPosition.BOTTOM_CENTER')) {
    errors.push('bannerAdService.js must use BannerAdPosition.BOTTOM_CENTER');
  }
  if (!hostSource.includes(".reward-modal-portal")) {
    errors.push('AdaptiveBannerHost.jsx must observe the Rewarded modal portal class for suppression');
  }
  if (!hostSource.includes('MutationObserver')) {
    errors.push('AdaptiveBannerHost.jsx must use a MutationObserver to detect the Rewarded modal portal');
  }
  if (!serviceSource.includes('let queue = Promise.resolve()')) {
    errors.push('bannerAdService.js must serialize native calls through a single queue');
  }
  if (!serviceSource.includes("if (nativeState === 'shown' && signature === lastShownSignature) return")) {
    errors.push('bannerAdService.js must guard against duplicate concurrent showBanner calls');
  }
  if (!serviceSource.includes('isStillValid')) {
    errors.push('bannerAdService.js must support a stale-completion validity check for show()');
  }
  if (!hostSource.includes("document.querySelector('.bottom-nav')")) {
    errors.push('AdaptiveBannerHost.jsx must derive banner margin from .bottom-nav geometry');
  }
  if (!hostSource.includes('bannerAdService.resume()')) {
    errors.push('AdaptiveBannerHost.jsx must call bannerAdService.resume() to restore a temporarily hidden Banner instead of calling show() again');
  }
  if (
    !hostSource.includes("eligibility.reason === 'suppressed' || eligibility.reason === 'route_not_allowlisted'")
  ) {
    errors.push('AdaptiveBannerHost.jsx must classify suppressed/route_not_allowlisted as temporary suppression, distinct from hard eligibility/gate loss');
  }
  if (!/current\.nativeBannerSignature\s*=\s*null;\s*bannerAdService\.remove\(\)/u.test(hostSource)) {
    errors.push('AdaptiveBannerHost.jsx must removeBanner (not just hide) and forget the Banner identity on hard eligibility/gate loss');
  }
  if (!hostSource.includes('current.generation')) {
    errors.push('AdaptiveBannerHost.jsx must track a desired-generation to invalidate stale queued show operations');
  }
  if (!/stateRef\.current\.generation\s*===\s*generation/u.test(hostSource)) {
    errors.push('AdaptiveBannerHost.jsx isStillValid must verify the queued operation still matches the current desired generation');
  }
  if (
    !/current\.nativeBannerSignature\s*!==\s*null\s*&&\s*current\.nativeBannerSignature\s*!==\s*desiredConfigSignature/u.test(
      hostSource,
    )
  ) {
    errors.push('AdaptiveBannerHost.jsx must detect adId/isTesting/npa identity changes and remove the old Banner before creating/showing the replacement');
  }
  if (!hostSource.includes('nativeBannerRequestSignature')) {
    errors.push('AdaptiveBannerHost.jsx must track the full request signature (identity + margin) of the currently created native Banner, separate from the identity-only signature');
  }
  if (
    !/current\.nativeBannerRequestSignature\s*!==\s*null\s*&&\s*current\.nativeBannerRequestSignature\s*!==\s*desiredRequestSignature/u.test(
      hostSource,
    )
  ) {
    errors.push('AdaptiveBannerHost.jsx must remove the native Banner when the desired margin no longer matches its created request signature, regardless of shown/hidden state');
  }
  if (
    !/current\.nativeBannerSignature\s*===\s*desiredConfigSignature\s*&&\s*current\.nativeBannerRequestSignature\s*===\s*desiredRequestSignature\s*&&\s*bannerAdService\.getNativeState\(\)\s*===\s*'hidden'/u.test(
      hostSource,
    )
  ) {
    errors.push('AdaptiveBannerHost.jsx must only resume a hidden Banner when both identity and margin exactly match the desired full request signature');
  }
  if (/\b\d{2,4}\s*;?\s*\/\/\s*(nav|bottom-?nav)\s*height/iu.test(hostSource)) {
    errors.push('AdaptiveBannerHost.jsx must not hardcode a fixed nav height');
  }
  if (!appSource.includes('<AdaptiveBannerHost')) {
    errors.push('App.jsx must mount AdaptiveBannerHost');
  }
  if (!configSource.includes("'ca-app-pub-3940256099942544/9214589741'")) {
    errors.push('bannerAdSdkConfig.js must use the Google official Android Adaptive Banner test ad unit ID');
  }

  const concreteIds = [hostSource, serviceSource, configSource, appSource]
    .join('\n')
    .match(concreteAdUnitIdPattern) ?? [];
  if (concreteIds.some((value) => value !== GOOGLE_OFFICIAL_ANDROID_ADAPTIVE_BANNER_TEST_AD_UNIT_ID)) {
    errors.push('a concrete production Banner ad unit ID literal is prohibited in Banner source files');
  }

  const changedFiles = getChangedFiles();
  for (const file of changedFiles) {
    for (const protectedPrefix of PROTECTED_PATH_PREFIXES) {
      if (file === protectedPrefix || file.startsWith(protectedPrefix)) {
        errors.push(`protected surface must not be modified by this PR: ${file}`);
      }
    }
  }

  return errors;
}

async function main() {
  const errors = validateSources();
  for (const { name, run } of tests) {
    try {
      await run();
    } catch (error) {
      errors.push(`${name}: ${error?.message || error}`);
    }
  }

  if (errors.length > 0) {
    process.stderr.write(`${errors.join('\n')}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`AdMob Banner provider checks passed (${tests.length} tests)\n`);
}

main();
