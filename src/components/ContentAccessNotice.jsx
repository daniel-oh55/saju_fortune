const DEFAULT_COPY = {
  free: {
    label: '무료',
    title: '무료 기본 해석',
    description: '오늘의 흐름을 이해하는 데 필요한 핵심 내용은 무료로 제공됩니다.',
  },
  rewarded: {
    label: '광고 해금',
    title: '광고 해금 심화 해석',
    description:
      '더 자세한 해석은 광고 시청 후 열람할 수 있습니다. 기본 해석은 계속 무료로 이용할 수 있습니다.',
  },
};

function ContentAccessNotice({ variant = 'free', title, description }) {
  const isRewarded = variant === 'rewarded';
  const copy = isRewarded ? DEFAULT_COPY.rewarded : DEFAULT_COPY.free;

  return (
    <div className={`content-access-notice ${isRewarded ? 'rewarded' : 'free'}`}>
      <span className="content-access-pill">{copy.label}</span>
      <div>
        <strong>{title || copy.title}</strong>
        <p>{description || copy.description}</p>
      </div>
    </div>
  );
}

export default ContentAccessNotice;
