import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  getRewardedAdSdkConfig,
  REWARDED_AD_BUILD_TARGET,
  REWARDED_AD_MODE,
  REWARDED_AD_PROVIDER_KEY,
} from '../config/rewardedAdSdkConfig.js';
import {
  createRewardedRequestId,
  getMockRewardedAdDurationSeconds,
  getRewardedAdOutcomeMessage,
  isRewardedResultForRequest,
  showRewardedAd,
} from '../services/rewardedAdService.js';

const AD_SECONDS = getMockRewardedAdDurationSeconds();

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getAttribute('aria-hidden') !== 'true',
  );
}

const OFFICIAL_TEST_SDK_COPY = Object.freeze({
  title: 'Google 공식 테스트 광고',
  description: '버튼을 누르면 Android의 Google 공식 Rewarded Test Ad가 열립니다.',
  preparing: 'Google 공식 테스트 광고를 준비하고 있어요.',
  guidance: '테스트 광고 시청은 선택 사항이며, 버튼을 눌러 시작할 수 있어요.',
  cta: '테스트 광고 보고 상세 풀이 열기',
});

const PRODUCTION_SDK_COPY = Object.freeze({
  title: '보상형 광고',
  description:
    '버튼을 누르면 광고가 열립니다. 광고를 끝까지 시청하고 보상을 받으면 상세 풀이가 열립니다.',
  preparing: '광고를 준비하고 있어요.',
  guidance: '광고 시청은 선택 사항이며, 버튼을 눌러 시작할 수 있어요.',
  cta: '광고 보고 상세 풀이 열기',
});

function getRewardedAdSdkCopy(config) {
  const isOfficialTestSdk =
    config.provider === REWARDED_AD_PROVIDER_KEY.SDK &&
    config.mode === REWARDED_AD_MODE.OFFICIAL_TEST &&
    config.buildTarget === REWARDED_AD_BUILD_TARGET.DEBUG &&
    config.isTesting === true;
  const isProductionSdk =
    config.provider === REWARDED_AD_PROVIDER_KEY.SDK &&
    config.mode === REWARDED_AD_MODE.PRODUCTION &&
    config.buildTarget === REWARDED_AD_BUILD_TARGET.RELEASE &&
    config.isTesting === false;

  if (isOfficialTestSdk) return OFFICIAL_TEST_SDK_COPY;
  if (isProductionSdk) return PRODUCTION_SDK_COPY;
  return PRODUCTION_SDK_COPY;
}

function RewardAdModal({
  categoryLabel,
  placementId,
  consentPreferences,
  onOpenConsentSettings,
  onClose,
  onRewardComplete,
}) {
  const [secondsLeft, setSecondsLeft] = useState(AD_SECONDS);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorReason, setErrorReason] = useState('');
  const completionDeliveredRef = useRef(false);
  const completionInFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const portalRootRef = useRef(null);
  const triggerElementRef = useRef(null);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const providerConfig = getRewardedAdSdkConfig();
  const isSdkProvider = providerConfig.provider === REWARDED_AD_PROVIDER_KEY.SDK;
  const sdkCopy = getRewardedAdSdkCopy(providerConfig);
  const isCompleted = !isSdkProvider && secondsLeft === 0;

  if (!portalRootRef.current && typeof document !== 'undefined') {
    const portalRoot = document.createElement('div');
    portalRoot.className = 'reward-modal-portal';
    portalRootRef.current = portalRoot;
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const portalRoot = portalRootRef.current;
    if (!portalRoot) return undefined;

    const activeElement = document.activeElement;
    triggerElementRef.current = activeElement instanceof HTMLElement && activeElement.isConnected
      ? activeElement
      : null;

    document.body.appendChild(portalRoot);
    const backgroundElements = Array.from(document.body.children).filter(
      (element) => element !== portalRoot,
    );
    const previousBackgroundStates = backgroundElements.map((element) => ({
      element,
      ariaHidden: element.getAttribute('aria-hidden'),
      inert: element.inert,
    }));
    const previousBodyOverflow = document.body.style.overflow;

    backgroundElements.forEach((element) => {
      element.setAttribute('aria-hidden', 'true');
      element.inert = true;
    });
    document.body.style.overflow = 'hidden';

    try {
      closeButtonRef.current?.focus({ preventScroll: true });
    } catch {
      closeButtonRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      previousBackgroundStates.forEach(({ element, ariaHidden, inert }) => {
        if (ariaHidden === null) {
          element.removeAttribute('aria-hidden');
        } else {
          element.setAttribute('aria-hidden', ariaHidden);
        }
        element.inert = inert;
      });
      portalRoot.remove();

      if (triggerElementRef.current?.isConnected) {
        try {
          triggerElementRef.current.focus({ preventScroll: true });
        } catch {
          triggerElementRef.current.focus();
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isSdkProvider || secondsLeft === 0) return undefined;

    const timerId = globalThis.setTimeout(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => globalThis.clearTimeout(timerId);
  }, [isSdkProvider, secondsLeft]);

  const handleComplete = async () => {
    if (completionInFlightRef.current) return;

    completionInFlightRef.current = true;
    const requestedPlacementId = placementId || categoryLabel;
    const rewardRequestId = createRewardedRequestId();
    setIsCompleting(true);
    setErrorMessage('');
    setErrorReason('');

    try {
      const result = await showRewardedAd({
        placementId: requestedPlacementId,
        categoryLabel,
        rewardRequestId,
        consentPreferences,
        delayMs: 0,
      });

      if (!result.ok) {
        if (!mountedRef.current) return;
        setErrorReason(result.reason || '');
        setErrorMessage(getRewardedAdOutcomeMessage(result.reason));
        return;
      }

      if (!isRewardedResultForRequest(result, {
        placementId: requestedPlacementId,
        categoryLabel,
        rewardRequestId,
      })) {
        if (!mountedRef.current) return;
        setErrorMessage(
          '다른 상세 풀이의 광고 요청이 처리되었어요. 다시 눌러 현재 상세 풀이의 광고를 시작해 주세요.',
        );
        return;
      }

      if (completionDeliveredRef.current) return;
      completionDeliveredRef.current = true;
      try {
        const wasPersisted = await onRewardComplete(result);
        if (wasPersisted === false) {
          completionDeliveredRef.current = false;
          if (mountedRef.current) {
            setErrorMessage(
              '상세 풀이를 열지 못했어요. 잠시 후 다시 시도해 주세요.',
            );
          }
          return;
        }
        if (mountedRef.current) onClose();
      } catch {
        completionDeliveredRef.current = false;
        if (mountedRef.current) {
          setErrorMessage(
            '상세 풀이를 열지 못했어요. 잠시 후 다시 시도해 주세요.',
          );
        }
      }
    } catch {
      if (mountedRef.current) {
        setErrorMessage('광고 처리 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      completionInFlightRef.current = false;
      if (mountedRef.current) setIsCompleting(false);
    }
  };

  const handleDialogKeyDown = (event) => {
    if (event.key !== 'Tab') return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableElements = getFocusableElements(dialog);
    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (!dialog.contains(activeElement)) {
      event.preventDefault();
      (event.shiftKey ? lastElement : firstElement).focus();
    } else if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return createPortal(
    <div className="modal-backdrop" role="presentation">
      <section
        ref={dialogRef}
        className="reward-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
        tabIndex="-1"
        onKeyDown={handleDialogKeyDown}
      >
        <div className="mock-ad-screen">
          <span>광고 영역</span>
          <strong id={dialogTitleId} role="heading" aria-level="2">
            {isSdkProvider
              ? sdkCopy.title
              : `${categoryLabel} 상세 풀이 보상 광고`}
          </strong>
          <p id={dialogDescriptionId}>
            {isSdkProvider
              ? sdkCopy.description
              : '테스트용 광고 화면이며, 2초 후 상세 풀이를 열 수 있습니다.'}
          </p>
        </div>

        <div className="ad-progress">
          {!isSdkProvider && (
            <div className="ad-progress-bar">
              <span style={{ width: `${((AD_SECONDS - secondsLeft) / AD_SECONDS) * 100}%` }} />
            </div>
          )}
          <p>
            {isSdkProvider
              ? (isCompleting
                ? sdkCopy.preparing
                : sdkCopy.guidance)
              : (isCompleted
                ? '테스트 광고 확인이 끝났습니다.'
                : `${secondsLeft}초 후 상세 풀이를 열 수 있습니다.`)}
          </p>
          {errorMessage && <p className="ad-error-message">{errorMessage}</p>}
          {errorReason === 'ads_consent_required' && onOpenConsentSettings && (
            <button className="ghost-button full-width" type="button" onClick={onOpenConsentSettings}>
              데이터 사용 설정 열기
            </button>
          )}
        </div>

        <div className="modal-actions">
          <button
            ref={closeButtonRef}
            className="ghost-button"
            type="button"
            onClick={onClose}
            disabled={isCompleting}
          >
            닫기
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={handleComplete}
            disabled={(!isSdkProvider && !isCompleted) || isCompleting}
          >
            {isCompleting
              ? '광고 준비 중...'
              : (isSdkProvider ? sdkCopy.cta : '상세 풀이 열기')}
          </button>
        </div>
      </section>
    </div>,
    portalRootRef.current,
  );
}

export default RewardAdModal;
