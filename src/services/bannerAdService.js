import { Capacitor } from '@capacitor/core';
import { isApprovedBannerAdSdkConfig } from '../config/bannerAdSdkConfig.js';

export const BANNER_AD_ROUTE_ALLOWLIST = Object.freeze([
  'home',
  'sajuInsight',
  'year',
  'zodiac',
]);

export function isBannerAllowedRoute(page) {
  return BANNER_AD_ROUTE_ALLOWLIST.includes(page);
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

export function getBannerEligibility({
  activePage,
  consentPreferences,
  runtimeSnapshot,
  config,
  isSuppressed,
}) {
  if (isSuppressed) return { allowed: false, reason: 'suppressed' };
  if (!isBannerAllowedRoute(activePage)) return { allowed: false, reason: 'route_not_allowlisted' };
  if (!isApprovedBannerAdSdkConfig(config)) return { allowed: false, reason: 'config_not_approved' };
  if (consentPreferences?.ads !== true) return { allowed: false, reason: 'ads_consent_required' };
  if (!runtimeGateOpen(runtimeSnapshot)) return { allowed: false, reason: 'ad_gate_closed' };
  return { allowed: true, reason: null };
}

export function resolveBannerNpa(consentPreferences) {
  return consentPreferences?.personalizedAds !== true;
}

export function createBannerAdService(dependencyOverrides = {}) {
  const dependencies = {
    isNativePlatform: () => Capacitor.isNativePlatform(),
    getPlatform: () => Capacitor.getPlatform(),
    loadAdMobModule: () => import('@capacitor-community/admob'),
    ...dependencyOverrides,
  };

  let queue = Promise.resolve();
  let modulePromise = null;
  let listenersAttached = false;
  let sizeHandle = null;
  let failedHandle = null;
  let nativeState = 'none'; // none | shown | hidden | removed
  let lastShownSignature = null;
  const sizeListeners = new Set();
  const failedListeners = new Set();

  function enqueue(task) {
    const run = () => Promise.resolve().then(task).catch(() => {});
    queue = queue.then(run, run);
    return queue;
  }

  async function getModule() {
    if (!modulePromise) modulePromise = dependencies.loadAdMobModule();
    return modulePromise;
  }

  async function attachListeners() {
    if (listenersAttached) return;
    if (
      dependencies.isNativePlatform() !== true ||
      dependencies.getPlatform() !== 'android'
    ) {
      return;
    }

    const module = await getModule();
    const AdMob = module?.AdMob || module;
    const events = module?.BannerAdPluginEvents;
    if (!AdMob || typeof AdMob.addListener !== 'function' || !events) return;

    try {
      sizeHandle = await AdMob.addListener(events.SizeChanged, (info) => {
        for (const listener of sizeListeners) {
          try {
            listener(info);
          } catch {
            // A consumer error must not interrupt other size listeners.
          }
        }
      });
      failedHandle = await AdMob.addListener(events.FailedToLoad, () => {
        for (const listener of failedListeners) {
          try {
            listener();
          } catch {
            // A consumer error must not interrupt other failure listeners.
          }
        }
      });
      listenersAttached = true;
    } catch {
      sizeHandle = null;
      failedHandle = null;
    }
  }

  function show({ adId, isTesting, npa, marginPx, isStillValid }) {
    return enqueue(async () => {
      if (typeof isStillValid === 'function' && isStillValid() !== true) return;
      if (
        dependencies.isNativePlatform() !== true ||
        dependencies.getPlatform() !== 'android'
      ) {
        return;
      }

      const module = await getModule();
      const AdMob = module?.AdMob || module;
      const BannerAdSize = module?.BannerAdSize;
      const BannerAdPosition = module?.BannerAdPosition;
      if (
        !AdMob ||
        typeof AdMob.showBanner !== 'function' ||
        !BannerAdSize?.ADAPTIVE_BANNER ||
        !BannerAdPosition?.BOTTOM_CENTER
      ) {
        return;
      }

      await attachListeners();

      const normalizedMargin = Math.max(0, Math.round(marginPx || 0));
      const signature = JSON.stringify({ adId, isTesting, npa, normalizedMargin });
      if (nativeState === 'shown' && signature === lastShownSignature) return;

      if (typeof isStillValid === 'function' && isStillValid() !== true) return;

      try {
        await AdMob.showBanner({
          adId,
          isTesting,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: normalizedMargin,
          ...(npa ? { npa: true } : {}),
        });
        nativeState = 'shown';
        lastShownSignature = signature;
      } catch {
        nativeState = 'none';
        lastShownSignature = null;
      }
    });
  }

  function hide() {
    return enqueue(async () => {
      if (nativeState !== 'shown') return;

      const module = await getModule();
      const AdMob = module?.AdMob || module;
      if (!AdMob || typeof AdMob.hideBanner !== 'function') return;

      try {
        await AdMob.hideBanner();
        nativeState = 'hidden';
      } catch {
        // Leave nativeState untouched; a stale 'shown' still blocks a duplicate show.
      }
    });
  }

  function resume() {
    return enqueue(async () => {
      if (nativeState !== 'hidden') return;

      const module = await getModule();
      const AdMob = module?.AdMob || module;
      if (!AdMob || typeof AdMob.resumeBanner !== 'function') return;

      try {
        await AdMob.resumeBanner();
        nativeState = 'shown';
      } catch {
        // Leave nativeState untouched; the next reconcile can retry via show().
      }
    });
  }

  function remove() {
    return enqueue(async () => {
      if (nativeState === 'shown' || nativeState === 'hidden') {
        try {
          const module = await getModule();
          const AdMob = module?.AdMob || module;
          if (AdMob && typeof AdMob.removeBanner === 'function') {
            await AdMob.removeBanner();
          }
        } catch {
          // Native cleanup failure must not block app teardown.
        }
      }

      nativeState = 'removed';
      lastShownSignature = null;

      if (sizeHandle) {
        try {
          await sizeHandle.remove();
        } catch {
          // Ignore listener removal failure during teardown.
        }
        sizeHandle = null;
      }
      if (failedHandle) {
        try {
          await failedHandle.remove();
        } catch {
          // Ignore listener removal failure during teardown.
        }
        failedHandle = null;
      }
      listenersAttached = false;
    });
  }

  function subscribeSize(listener) {
    sizeListeners.add(listener);
    return () => sizeListeners.delete(listener);
  }

  function subscribeFailedToLoad(listener) {
    failedListeners.add(listener);
    return () => failedListeners.delete(listener);
  }

  function getNativeState() {
    return nativeState;
  }

  return Object.freeze({
    show,
    hide,
    resume,
    remove,
    subscribeSize,
    subscribeFailedToLoad,
    getNativeState,
  });
}

const defaultBannerAdService = createBannerAdService();

export default defaultBannerAdService;
