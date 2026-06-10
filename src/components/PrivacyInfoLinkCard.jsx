function PrivacyInfoLinkCard({ onOpen }) {
  return (
    <section className="privacy-info-link-card">
      <div>
        <p className="eyebrow">Privacy</p>
        <h2>개인정보 안내</h2>
        <p>
          현재 MVP에서 어떤 정보가 브라우저에 저장되는지 확인할 수 있습니다.
        </p>
      </div>
      <button className="ghost-button" type="button" onClick={onOpen}>
        개인정보 안내 보기
      </button>
    </section>
  );
}

export default PrivacyInfoLinkCard;
