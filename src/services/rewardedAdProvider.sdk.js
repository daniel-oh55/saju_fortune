import { Capacitor } from '@capacitor/core';
import { getAdmobRuntimeConsentSnapshot } from './admobRuntimeConsentCoordinator.js';
import { loadConsentPreferences } from '../utils/consentPreferencesStorage.js';
import {
  REWARDED_AD_OUTCOME,
  REWARDED_AD_PROVIDER_TYPE,
} from './rewardedAdProvider.types.js';

export const REWARDED_AD_TIMEOUT_MS = Object.freeze({
  load: 20_000,
  showStart: 10_000,
  lifecycle: 180_000,
  dismissRewardGrace: 500,
  cleanup: 2_000,
});

const EVENT_FALLBACK = Object.freeze({
  FailedToLoad: 'onRewardedVideoAdFailedToLoad',
  Showed: 'onRewardedVideoAdShowed',
  FailedToShow: 'onRewardedVideoAdFailedToShow',
  Dismissed: 'onRewardedVideoAdDismissed',
  Rewarded: 'onRewardedVideoAdReward',
});

function createDeferred() {
  let resolve;
  const promise = new Promise((settle) => {
    resolve = settle;
  });
  return { promise, resolve };
}

function failure(options, reason) {
  return {
    ok: false,
    provider: REWARDED_AD_PROVIDER_TYPE.SDK,
    placementId: options.placementId,
    categoryLabel: options.categoryLabel,
    reason,
    rewardedAt: null,
  };
}

function runtimeGateOpen(snapshot) {
  return (
    snapshot?.isNativeAndroid === true &&
    snapshot?.consentInfoCompleted === true &&
    snapshot?.canRequestAds === true &&
    snapshot?.initializeResolved === true &&
    snapshot?.adGateOpen === true
  );
}

export function isValidAdMobRewardItem(rewardItem) {
  return (
    rewardItem !== null &&
    typeof rewardItem === 'object' &&
    Number.isFinite(rewardItem.amount) &&
    rewardItem.amount > 0 &&
    typeof rewardItem.type === 'string' &&
    rewardItem.type.trim().length > 0
  );
}

export function createSdkRewardedAdProvider(dependencyOverrides = {}) {
  const dependencies = {
    isNativePlatform: () => Capacitor.isNativePlatform(),
    getPlatform: () => Capacitor.getPlatform(),
    getRuntimeConsentSnapshot: () => getAdmobRuntimeConsentSnapshot(),
    loadLocalConsentPreferences: () => loadConsentPreferences(),
    loadAdMobModule: () => import('@capacitor-community/admob'),
    setTimeout: (callback, delay) => globalThis.setTimeout(callback, delay),
    clearTimeout: (timerId) => globalThis.clearTimeout(timerId),
    now: () => new Date(),
    createActionId: () => globalThis.crypto?.randomUUID?.(),
    timeoutMs: REWARDED_AD_TIMEOUT_MS,
    ...dependencyOverrides,
  };

  let rewardedPromise = null;
  let actionSequence = 0;

  function createRewardActionId() {
    actionSequence += 1;
    const candidate = dependencies.createActionId();
    const sanitized = typeof candidate === 'string'
      ? candidate.trim().replace(/[^A-Za-z0-9._:-]+/g, '-').slice(0, 128)
      : '';

    return sanitized || `sdk-reward-${dependencies.now().getTime()}-${actionSequence}`;
  }

  function withTimeout(promise, milliseconds, timeoutValue) {
    let timerId;
    const timeoutPromise = new Promise((resolve) => {
      timerId = dependencies.setTimeout(() => resolve(timeoutValue), milliseconds);
    });

    return Promise.race([Promise.resolve(promise), timeoutPromise]).finally(() => {
      dependencies.clearTimeout(timerId);
    });
  }

  async function cleanupHandles(handles) {
    const cleanup = Promise.allSettled(
      handles.map((handle) =>
        Promise.resolve().then(() => handle?.remove?.()),
      ),
    );
    await withTimeout(cleanup, dependencies.timeoutMs.cleanup, null);
  }

  function readGateState() {
    const localConsent = dependencies.loadLocalConsentPreferences();
    if (localConsent?.ads !== true) {
      return {
        failureReason: REWARDED_AD_OUTCOME.ADS_CONSENT_REQUIRED,
        localConsent,
        runtimeSnapshot: null,
      };
    }
    const runtimeSnapshot = dependencies.getRuntimeConsentSnapshot();
    if (!runtimeGateOpen(runtimeSnapshot)) {
      return {
        failureReason: REWARDED_AD_OUTCOME.AD_GATE_CLOSED,
        localConsent,
        runtimeSnapshot,
      };
    }
    return {
      failureReason: null,
      localConsent,
      runtimeSnapshot,
    };
  }

  async function runAction(options, rewardActionId) {
    const handles = [];
    let settled = false;
    let rewardDelivered = false;

    try {
      if (options.config?.configurationValid !== true) {
        return failure(options, REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
      }

      if (
        dependencies.isNativePlatform() !== true ||
        dependencies.getPlatform() !== 'android'
      ) {
        return failure(options, REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
      }

      const initialGate = readGateState();
      if (initialGate.failureReason) {
        return failure(options, initialGate.failureReason);
      }

      const module = await dependencies.loadAdMobModule();
      const AdMob = module?.AdMob || module;
      const events = module?.RewardAdPluginEvents || EVENT_FALLBACK;
      if (
        !AdMob ||
        typeof AdMob.addListener !== 'function' ||
        typeof AdMob.prepareRewardVideoAd !== 'function' ||
        typeof AdMob.showRewardVideoAd !== 'function'
      ) {
        return failure(options, REWARDED_AD_OUTCOME.SDK_UNAVAILABLE);
      }

      const failedToLoad = createDeferred();
      const showed = createDeferred();
      const failedToShow = createDeferred();
      const dismissed = createDeferred();

      const listeners = [
        [events.FailedToLoad, () => failedToLoad.resolve('failed-to-load')],
        [events.Showed, () => showed.resolve('showed')],
        [events.FailedToShow, () => failedToShow.resolve('failed-to-show')],
        [events.Dismissed, () => dismissed.resolve('dismissed')],
        // Rewarded is diagnostic only. The resolved show Promise is authoritative.
        [events.Rewarded, () => undefined],
      ];

      for (const [eventName, callback] of listeners) {
        const handle = await AdMob.addListener(eventName, (...args) => {
          if (settled) return;
          try {
            callback(...args);
          } catch {
            // Native listener callbacks are isolated from action settlement.
          }
        });
        handles.push(handle);
      }

      const prePrepareGate = readGateState();
      if (prePrepareGate.failureReason) {
        return failure(options, prePrepareGate.failureReason);
      }

      const prepareOptions = {
        adId: options.config.adId,
        isTesting: true,
        ...(prePrepareGate.localConsent?.personalizedAds === true ? {} : { npa: true }),
      };
      const prepareResult = await withTimeout(
        Promise.race([
          Promise.resolve()
            .then(() => AdMob.prepareRewardVideoAd(prepareOptions))
            .then(
              () => ({ type: 'prepared' }),
              () => ({ type: 'load-failed' }),
            ),
          failedToLoad.promise.then(() => ({ type: 'load-failed' })),
        ]),
        dependencies.timeoutMs.load,
        { type: 'timeout' },
      );

      if (prepareResult.type === 'timeout') {
        return failure(options, REWARDED_AD_OUTCOME.TIMEOUT);
      }
      if (prepareResult.type !== 'prepared') {
        return failure(options, REWARDED_AD_OUTCOME.LOAD_FAILED);
      }

      const preShowGate = readGateState();
      if (preShowGate.failureReason) {
        return failure(options, preShowGate.failureReason);
      }

      const showPromise = Promise.resolve()
        .then(() => AdMob.showRewardVideoAd())
        .then(
          (rewardItem) => ({ type: 'reward', rewardItem }),
          () => ({ type: 'show-failed' }),
        );

      const showStartResult = await withTimeout(
        Promise.race([
          showPromise,
          showed.promise.then(() => ({ type: 'showed' })),
          failedToShow.promise.then(() => ({ type: 'show-failed' })),
          dismissed.promise.then(() => ({ type: 'dismissed' })),
        ]),
        dependencies.timeoutMs.showStart,
        { type: 'timeout' },
      );

      let lifecycleResult = showStartResult;
      if (showStartResult.type === 'showed') {
        lifecycleResult = await withTimeout(
          Promise.race([
            showPromise,
            failedToShow.promise.then(() => ({ type: 'show-failed' })),
            dismissed.promise.then(() => ({ type: 'dismissed' })),
          ]),
          dependencies.timeoutMs.lifecycle,
          { type: 'timeout' },
        );
      }

      if (lifecycleResult.type === 'dismissed') {
        lifecycleResult = await withTimeout(
          showPromise,
          dependencies.timeoutMs.dismissRewardGrace,
          { type: 'canceled' },
        );
      }

      if (lifecycleResult.type === 'reward') {
        if (!isValidAdMobRewardItem(lifecycleResult.rewardItem)) {
          return failure(options, REWARDED_AD_OUTCOME.NO_REWARD);
        }
        if (rewardDelivered) {
          return failure(options, REWARDED_AD_OUTCOME.NO_REWARD);
        }
        rewardDelivered = true;
        return {
          ok: true,
          provider: REWARDED_AD_PROVIDER_TYPE.SDK,
          placementId: options.placementId,
          categoryLabel: options.categoryLabel,
          rewardActionId,
          rewardedAt: dependencies.now().toISOString(),
        };
      }

      if (lifecycleResult.type === 'show-failed') {
        return failure(options, REWARDED_AD_OUTCOME.SHOW_FAILED);
      }
      if (lifecycleResult.type === 'timeout') {
        return failure(options, REWARDED_AD_OUTCOME.TIMEOUT);
      }
      if (lifecycleResult.type === 'canceled' || lifecycleResult.type === 'dismissed') {
        return failure(options, REWARDED_AD_OUTCOME.CANCELED);
      }
      return failure(options, REWARDED_AD_OUTCOME.NO_REWARD);
    } catch {
      return failure(options, REWARDED_AD_OUTCOME.UNEXPECTED_ERROR);
    } finally {
      settled = true;
      await cleanupHandles(handles);
    }
  }

  function show(options = {}) {
    if (rewardedPromise) return rewardedPromise;

    const rewardActionId = createRewardActionId();
    let currentPromise;
    currentPromise = Promise.resolve()
      .then(() => runAction(options, rewardActionId))
      .finally(() => {
        if (rewardedPromise === currentPromise) {
          rewardedPromise = null;
        }
      });
    rewardedPromise = currentPromise;
    return currentPromise;
  }

  return Object.freeze({ show });
}

const defaultProvider = createSdkRewardedAdProvider();

export function showSdkRewardedAd(options = {}) {
  return defaultProvider.show(options);
}
