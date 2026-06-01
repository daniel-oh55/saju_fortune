import { useState } from 'react';
import RewardAdModal from './RewardAdModal.jsx';

function AdRewardBox({ categoryLabel, isUnlocked, onUnlock, buttonLabel = '광고 보고 상세 풀이 열기' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isUnlocked) {
    return (
      <section className="ad-box is-complete">
        <span>광고 시청 완료</span>
        <strong>상세 풀이가 열렸습니다.</strong>
      </section>
    );
  }

  return (
    <>
      <section className="ad-box">
        <span>광고 영역</span>
        <strong>보상형 광고 자리</strong>
        <p>짧은 광고를 보고 {categoryLabel} 상세 풀이를 확인해보세요.</p>
        <button className="primary-button" type="button" onClick={() => setIsModalOpen(true)}>
          {buttonLabel}
        </button>
      </section>

      {isModalOpen && (
        <RewardAdModal
          categoryLabel={categoryLabel}
          onClose={() => setIsModalOpen(false)}
          onRewardComplete={onUnlock}
        />
      )}
    </>
  );
}

export default AdRewardBox;
