import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getBannerAdSdkConfig,
  isApprovedBannerAdSdkConfig,
} from '../config/bannerAdSdkConfig.js';
import bannerAdService, {
  getBannerEligibility,
  resolveBannerNpa,
} from '../services/bannerAdService.js';
import {
  getAdmobRuntimeConsentSnapshot,
  subscribeAdmobRuntimeConsent,
} from '../services/admobRuntimeConsentCoordinator.js';

const BANNER_VISUAL_GAP_PX = 14;
const VIEWPORT_CHANGE_DEBOUNCE_MS = 150;

// The configured margin covers only what the web UI owns: the live BottomNav
// height, its non-system base offset, and the visual gap. The safe-area /
// system bottom inset is deliberately not folded into this Banner margin:
// after merged #443 the native BOTTOM_CENTER path positions the Banner using
// this configured margin directly (density-adjusted) and no longer adds an
// Android system bottom inset of its own.
function computeMarginPx() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return 0;
  const nav = document.querySelector('.bottom-nav');
  if (!nav) return 0;

  const rect = nav.getBoundingClientRect();
  const parsedBaseOffset = Number.parseFloat(
    window.getComputedStyle(nav).getPropertyValue('--bottom-nav-base-offset'),
  );
  const baseOffsetPx =
    Number.isFinite(parsedBaseOffset) && parsedBaseOffset >= 0 ? parsedBaseOffset : 0;

  return Math.ceil(Math.max(0, rect.height) + baseOffsetPx + BANNER_VISUAL_GAP_PX);
}

function AdaptiveBannerHost({
  activePage,
  consentPreferences,
  isConsentSettingsOpen,
  isReminderSettingsOpen,
}) {
  const config = useMemo(() => getBannerAdSdkConfig(), []);
  const isConfigApproved = isApprovedBannerAdSdkConfig(config);
  const [reserveHeightPx, setReserveHeightPx] = useState(0);
  const mountedRef = useRef(true);

  const stateRef = useRef({
    activePage,
    consentPreferences,
    isConsentSettingsOpen,
    isReminderSettingsOpen,
    isRewardModalActive: false,
    runtimeSnapshot: getAdmobRuntimeConsentSnapshot(),
    isEligible: false,
    // Identity (adId/isTesting/npa) of the native Banner the host believes is
    // currently created (shown or hidden). Null means none is known to exist.
    nativeBannerSignature: null,
    // Full request signature (identity + margin) the native Banner was last
    // created/shown with. Used so a hidden Banner is only ever resumed when
    // its on-screen position still matches the desired margin.
    nativeBannerRequestSignature: null,
    // Full request identity (config identity + margin) used to invalidate
    // stale queued show operations once a newer desired request supersedes them.
    desiredRequestSignature: null,
    generation: 0,
    lastKnownHeightPx: 0,
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  function setReserveHeight(px) {
    if (!mountedRef.current) return;
    setReserveHeightPx(Math.max(0, Math.round(px)));
  }

  function reconcile() {
    if (!isConfigApproved) return;

    const current = stateRef.current;
    const eligibility = getBannerEligibility({
      activePage: current.activePage,
      consentPreferences: current.consentPreferences,
      runtimeSnapshot: current.runtimeSnapshot,
      config,
      isSuppressed:
        current.isConsentSettingsOpen ||
        current.isReminderSettingsOpen ||
        current.isRewardModalActive,
    });

    current.isEligible = eligibility.allowed;

    if (!eligibility.allowed) {
      setReserveHeight(0);
      // 'suppressed' (route/consent overlay/reminder overlay/reward modal) and
      // 'route_not_allowlisted' are temporary visual states: keep the native
      // Banner alive (hidden) so it can be cheaply resumed. Every other
      // reason is a hard eligibility/gate loss: the Banner must not survive it.
      const isTemporaryReason =
        eligibility.reason === 'suppressed' || eligibility.reason === 'route_not_allowlisted';
      if (isTemporaryReason) {
        bannerAdService.hide();
      } else {
        current.nativeBannerRequestSignature = null;
        current.nativeBannerSignature = null;
        bannerAdService.remove();
      }
      return;
    }

    const npa = resolveBannerNpa(current.consentPreferences);
    const marginPx = computeMarginPx();
    const desiredConfigSignature = JSON.stringify([config.adId, config.isTesting, npa]);
    const desiredRequestSignature = JSON.stringify([config.adId, config.isTesting, npa, marginPx]);

    if (desiredRequestSignature !== current.desiredRequestSignature) {
      current.desiredRequestSignature = desiredRequestSignature;
      current.generation += 1;
    }
    const generation = current.generation;

    // adId/isTesting/npa changed while a Banner exists: the old Banner must be
    // removed before a replacement is created/shown under the new identity.
    if (
      current.nativeBannerSignature !== null &&
      current.nativeBannerSignature !== desiredConfigSignature
    ) {
      current.nativeBannerRequestSignature = null;
      current.nativeBannerSignature = null;
      bannerAdService.remove();
    }

    // Same identity but the margin changed while the Banner still exists
    // (shown or hidden): resuming would restore the stale position and
    // showing over an existing Banner would stack a second one, so remove
    // it here and let the replacement below re-create it at the new margin.
    if (
      current.nativeBannerRequestSignature !== null &&
      current.nativeBannerRequestSignature !== desiredRequestSignature
    ) {
      current.nativeBannerRequestSignature = null;
      current.nativeBannerSignature = null;
      bannerAdService.remove();
    }

    if (
      current.nativeBannerSignature === desiredConfigSignature &&
      current.nativeBannerRequestSignature === desiredRequestSignature &&
      bannerAdService.getNativeState() === 'hidden'
    ) {
      bannerAdService.resume().then(() => {
        if (stateRef.current.generation !== generation) return;
        if (bannerAdService.getNativeState() === 'shown') {
          if (stateRef.current.lastKnownHeightPx > 0) {
            setReserveHeight(stateRef.current.lastKnownHeightPx);
          }
        } else {
          // resumeBanner failed; forget the identity so a future reconcile falls
          // back to show() instead of retrying a no-op resume indefinitely.
          stateRef.current.nativeBannerRequestSignature = null;
          stateRef.current.nativeBannerSignature = null;
        }
      });
      return;
    }

    bannerAdService
      .show({
        adId: config.adId,
        isTesting: config.isTesting,
        npa,
        marginPx,
        isStillValid: () =>
          stateRef.current.isEligible === true && stateRef.current.generation === generation,
      })
      .then(() => {
        if (stateRef.current.generation !== generation) return;
        if (bannerAdService.getNativeState() === 'shown') {
          stateRef.current.nativeBannerSignature = desiredConfigSignature;
          stateRef.current.nativeBannerRequestSignature = desiredRequestSignature;
        }
      });
  }

  useEffect(() => {
    stateRef.current.activePage = activePage;
    stateRef.current.consentPreferences = consentPreferences;
    stateRef.current.isConsentSettingsOpen = isConsentSettingsOpen;
    stateRef.current.isReminderSettingsOpen = isReminderSettingsOpen;
    reconcile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, consentPreferences, isConsentSettingsOpen, isReminderSettingsOpen]);

  useEffect(() => {
    if (!isConfigApproved) return undefined;

    return subscribeAdmobRuntimeConsent((snapshot) => {
      stateRef.current.runtimeSnapshot = snapshot;
      reconcile();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigApproved]);

  useEffect(() => {
    if (!isConfigApproved || typeof document === 'undefined') return undefined;

    const updateFromBody = () => {
      const isActive = document.body.querySelector('.reward-modal-portal') !== null;
      if (isActive !== stateRef.current.isRewardModalActive) {
        stateRef.current.isRewardModalActive = isActive;
        reconcile();
      }
    };

    updateFromBody();
    const observer = new MutationObserver(updateFromBody);
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigApproved]);

  useEffect(() => {
    if (!isConfigApproved) return undefined;

    const unsubscribeSize = bannerAdService.subscribeSize((info) => {
      if (!Number.isFinite(info?.height) || info.height <= 0) return;
      stateRef.current.lastKnownHeightPx = info.height;
      if (stateRef.current.isEligible) {
        setReserveHeight(info.height);
      }
    });
    const unsubscribeFailed = bannerAdService.subscribeFailedToLoad(() => {
      setReserveHeight(0);
    });

    return () => {
      unsubscribeSize();
      unsubscribeFailed();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigApproved]);

  useEffect(() => {
    if (!isConfigApproved || typeof window === 'undefined') return undefined;

    let debounceTimerId = null;
    const handleViewportChange = () => {
      if (debounceTimerId) window.clearTimeout(debounceTimerId);
      debounceTimerId = window.setTimeout(() => {
        if (stateRef.current.isEligible) reconcile();
      }, VIEWPORT_CHANGE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && typeof document !== 'undefined') {
      const navNode = document.querySelector('.bottom-nav');
      if (navNode) {
        resizeObserver = new ResizeObserver(handleViewportChange);
        resizeObserver.observe(navNode);
      }
    }

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      if (debounceTimerId) window.clearTimeout(debounceTimerId);
      resizeObserver?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigApproved]);

  useEffect(() => {
    if (!isConfigApproved) return undefined;

    return () => {
      stateRef.current.isEligible = false;
      bannerAdService.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigApproved]);

  if (!isConfigApproved) return null;

  return (
    <div
      className="banner-ad-reserve-spacer"
      aria-hidden="true"
      style={{ height: `${reserveHeightPx}px` }}
    />
  );
}

export default AdaptiveBannerHost;
