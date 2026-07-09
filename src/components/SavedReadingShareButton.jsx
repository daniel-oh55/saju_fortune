import { useState } from 'react';
import { shareSavedReadingText } from '../utils/shareTextBuilder.js';

const STATUS_MESSAGES = {
  cancelled: '공유를 취소했어요.',
  copied_after_share_failure: '공유 문구를 복사했어요.',
  copied_unsupported: '이 기기에서는 공유창을 열 수 없어 문구를 복사했어요.',
  copy_failed: '공유 문구를 복사하지 못했어요.',
};

function SavedReadingShareButton({ reading }) {
  const [statusMessage, setStatusMessage] = useState('');

  const handleShare = async () => {
    const canUseWebShare = typeof globalThis.navigator?.share === 'function';
    setStatusMessage(canUseWebShare ? '공유할 앱을 선택해 주세요.' : '');

    const result = await shareSavedReadingText(reading);
    setStatusMessage(result.status === 'shared' ? '' : STATUS_MESSAGES[result.status] || '');
  };

  return (
    <div className="saved-reading-share-wrap">
      <button
        className="saved-reading-share-button"
        type="button"
        onClick={handleShare}
        aria-label="저장한 풀이 공유하기"
      >
        공유하기
      </button>
      {statusMessage && (
        <span className="saved-reading-share-status" aria-live="polite">
          {statusMessage}
        </span>
      )}
    </div>
  );
}

export default SavedReadingShareButton;
