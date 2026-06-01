import { useEffect, useState } from 'react';

const AD_SECONDS = 5;

function RewardAdModal({ categoryLabel, onClose, onRewardComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(AD_SECONDS);
  const isCompleted = secondsLeft === 0;

  useEffect(() => {
    if (secondsLeft === 0) return undefined;

    const timerId = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [secondsLeft]);

  const handleComplete = () => {
    onRewardComplete();
    onClose();
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
          <p>{isCompleted ? '광고 시청이 완료되었습니다.' : `${secondsLeft}초 후 상세 풀이가 열립니다.`}</p>
        </div>

        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onClose}>
            닫기
          </button>
          <button className="primary-button" type="button" onClick={handleComplete} disabled={!isCompleted}>
            상세 풀이 열기
          </button>
        </div>
      </section>
    </div>
  );
}

export default RewardAdModal;
