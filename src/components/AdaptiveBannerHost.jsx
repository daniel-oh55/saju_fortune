import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

const BANNER_VISUAL_GAP_PX = 8;
const VIEWPORT_CHANGE_DEBOUNCE_MS = 150;

function computeMarginPx() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return 0;
  const nav = document.querySelector('.bottom-nav');
  if (!nav) return 0;

  const rect = nav.getBoundingClientRect();
  const distanceFromViewportBottom = Math.max(0, window.innerHeight - rect.top);
  return Math.round(distanceFromViewportBottom + BANNER_VISUAL_GAP_PX);
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
      bannerAdService.hide();
      return;
    }

    bannerAdService.show({
      adId: config.adId,
      isTesting: config.isTesting,
      npa: resolveBannerNpa(current.consentPreferences),
      marginPx: computeMarginPx(),
      isStillValid: () => stateRef.current.isEligible === true,
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
      if (stateRef.current.isEligible && Number.isFinite(info?.height) && info.height > 0) {
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
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      if (debounceTimerId) window.clearTimeout(debounceTimerId);
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

  if (!isConfigApproved || typeof document === 'undefined') return null;

  const appMainNode = document.querySelector('.app-main');
  if (!appMainNode) return null;

  return createPortal(
    <div className="banner-ad-reserve-spacer" aria-hidden="true" style={{ height: `${reserveHeightPx}px` }} />,
    appMainNode,
  );
}

export default AdaptiveBannerHost;
