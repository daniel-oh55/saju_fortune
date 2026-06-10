import { useEffect, useState } from 'react';
import {
  getMockRewardedAdDurationSeconds,
  getRewardedAdOutcomeMessage,
  showRewardedAd,
} from '../services/rewardedAdService.js';

const AD_SECONDS = getMockRewardedAdDurationSeconds();

function RewardAdModal({ categoryLabel, onClose, onRewardComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(AD_SECONDS);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isCompleted = secondsLeft === 0;

  useEffect(() => {
    if (secondsLeft === 0) return undefined;

    const timerId = globalThis.setTimeout(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => globalThis.clearTimeout(timerId);
  }, [secondsLeft]);

  const handleComplete = async () => {
    if (isCompleting) return;

    setIsCompleting(true);
    setErrorMessage('');

    try {
      const result = await showRewardedAd({
        placementId: categoryLabel,
        categoryLabel,
        delayMs: 0,
      });

      if (!result.ok) {
        setErrorMessage(getRewardedAdOutcomeMessage(result.reason));
        return;
      }

      onRewardComplete();
      onClose();
    } catch {
      setErrorMessage('광고 보상 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="reward-modal" role="dialog" aria-modal="true" aria-label="광고 시청">
        <div className="mock-ad-screen">
          <span>광고 영역</span>
          <strong>{categoryLabel} 상세 풀이 보상 광고</strong>
          <p>실제 광고 SDK가 연결되면 이 영역에 보상형 광고가 표시됩니다.</p>
        </div>

        <div className="ad-progress">
          <div className="ad-progress-bar">
            <span style={{ width: `${((AD_SECONDS - secondsLeft) / AD_SECONDS) * 100}%` }} />
          </div>
          <p>
            {isCompleted
              ? '광고 시청이 완료되었습니다.'
              : `${secondsLeft}초 후 상세 풀이가 열립니다.`}
          </p>
          {errorMessage && <p className="ad-error-message">{errorMessage}</p>}
        </div>

        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onClose} disabled={isCompleting}>
            닫기
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={handleComplete}
            disabled={!isCompleted || isCompleting}
          >
            {isCompleting ? '보상 확인 중...' : '상세 풀이 열기'}
          </button>
        </div>
      </section>
    </div>
  );
}

export default RewardAdModal;
