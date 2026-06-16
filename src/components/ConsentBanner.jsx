function ConsentBanner({ onAcceptAll, onRejectOptional, onOpenSettings, onOpenPrivacyInfo }) {
  return (
    <section className="consent-banner" aria-label="데이터 사용 안내">
      <div className="consent-banner-content">
        <p className="eyebrow">데이터 사용 안내</p>
        <h2>하루풀리의 데이터 사용 안내</h2>
        <p>
          하루풀리는 기본 운세 제공을 위해 브라우저 저장소를 사용합니다. 광고와 분석 기능은 아직
          연결되어 있지 않지만, 향후 선택 동의가 필요한 기능을 준비하고 있습니다.
        </p>
      </div>
      <div className="consent-banner-actions">
        <button className="primary-button" type="button" onClick={onAcceptAll}>
          동의
        </button>
        <button className="ghost-button" type="button" onClick={onOpenSettings}>
          설정
        </button>
        <button className="ghost-button" type="button" onClick={onRejectOptional}>
          나중에
        </button>
        <button className="text-button" type="button" onClick={onOpenPrivacyInfo}>
          개인정보 안내
        </button>
      </div>
    </section>
  );
}

export default ConsentBanner;
