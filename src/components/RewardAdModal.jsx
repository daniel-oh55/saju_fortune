import { useEffect, useRef, useState } from 'react';
import {
  getRewardedAdSdkConfig,
  REWARDED_AD_PROVIDER_KEY,
} from '../config/rewardedAdSdkConfig.js';
import {
  getMockRewardedAdDurationSeconds,
  getRewardedAdOutcomeMessage,
  isRewardedResultForRequest,
  showRewardedAd,
} from '../services/rewardedAdService.js';

const AD_SECONDS = getMockRewardedAdDurationSeconds();

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
  const providerConfig = getRewardedAdSdkConfig();
  const isSdkProvider = providerConfig.provider === REWARDED_AD_PROVIDER_KEY.SDK;
  const isCompleted = !isSdkProvider && secondsLeft === 0;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
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
    setIsCompleting(true);
    setErrorMessage('');
    setErrorReason('');

    try {
      const result = await showRewardedAd({
        placementId: requestedPlacementId,
        categoryLabel,
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
      })) {
        if (!mountedRef.current) return;
        setErrorMessage(
          '다른 상세 풀이의 광고 요청이 처리되었어요. 다시 눌러 현재 상세 풀이의 테스트 광고를 시작해 주세요.',
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

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="reward-modal" role="dialog" aria-modal="true" aria-label="광고 시청">
        <div className="mock-ad-screen">
          <span>광고 영역</span>
          <strong>
            {isSdkProvider
              ? 'Google 공식 테스트 광고'
              : `${categoryLabel} 상세 풀이 보상 광고`}
          </strong>
          <p>
            {isSdkProvider
              ? '버튼을 누르면 Android의 Google 공식 Rewarded Test Ad가 열립니다.'
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
                ? 'Google 공식 테스트 광고를 준비하고 있어요.'
                : '테스트 광고 시청은 선택 사항이며, 버튼을 눌러 시작할 수 있어요.')
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
          <button className="ghost-button" type="button" onClick={onClose} disabled={isCompleting}>
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
              : (isSdkProvider ? '테스트 광고 보고 상세 풀이 열기' : '상세 풀이 열기')}
          </button>
        </div>
      </section>
    </div>
  );
}

export default RewardAdModal;
