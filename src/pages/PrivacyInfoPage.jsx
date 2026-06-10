const storedItems = [
  '프로필 입력 정보',
  '오늘운세와 사주 흐름 결과 캐시',
  '광고 해금 상태',
  '저장한 풀이',
  '방문 streak',
];

const notStoredItems = [
  '저장한 풀이에는 생년월일, 출생시간, 성별, 양력/음력 원본 설정, 23시 이후 자시 정책을 포함하지 않습니다.',
  '공유용 텍스트에는 생년월일, 출생시간, 성별을 포함하지 않습니다.',
  'visit streak에는 운세 내용이나 생년월일을 저장하지 않습니다.',
];

const externalTransferItems = [
  '현재 MVP 기준 서버/DB 전송 없음',
  '실제 광고 SDK 없음',
  '실제 분석 SDK 없음',
  '실제 결제 SDK 없음',
  'mock rewarded ad provider만 사용',
];

const reviewNeededItems = [
  '실제 광고 SDK 도입',
  '분석 SDK 도입',
  '로그인 기능 도입',
  '서버/DB 저장 도입',
  '결제 기능 도입',
  '맞춤형 광고 또는 쿠키 사용',
];

const referenceDocs = [
  'docs/PRIVACY_POLICY_DRAFT.md',
  'docs/PRIVACY_DATA_MAP.md',
  'docs/COOKIE_AD_CONSENT_UX.md',
  'docs/REWARDED_AD_SDK_READINESS.md',
];

function InfoSection({ title, description, items }) {
  return (
    <section className="privacy-info-section">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <ul className="privacy-info-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function PrivacyInfoPage({ onNavigate }) {
  return (
    <div className="page-stack privacy-info-page">
      <section className="section-header">
        <button className="ghost-button" type="button" onClick={() => onNavigate('home')}>
          홈으로
        </button>
        <p className="eyebrow">Privacy Guide</p>
        <h1>개인정보 안내</h1>
        <p>
          이 페이지는 하루풀이 MVP 기준의 개인정보 처리 안내입니다. 법률 검토를 완료한 최종
          개인정보 처리방침은 실제 서비스 공개 전 별도로 확정될 예정입니다.
        </p>
      </section>

      <section className="privacy-info-note">
        <strong>MVP 기준 안내</strong>
        <p>
          현재 저장되는 정보는 서버가 아니라 사용자의 브라우저 localStorage에 보관됩니다.
          실제 광고, 분석, 결제 SDK는 아직 연결되어 있지 않습니다.
        </p>
      </section>

      <div className="privacy-info-grid">
        <InfoSection
          title="현재 저장되는 정보"
          description="아래 정보는 현재 MVP에서 브라우저 저장소에 보관될 수 있습니다."
          items={storedItems}
        />
        <InfoSection
          title="저장하지 않는 정보"
          description="저장/공유 기능에서는 원본 프로필 민감 정보를 제외하는 것을 원칙으로 합니다."
          items={notStoredItems}
        />
        <InfoSection
          title="외부 전송"
          description="현재 MVP는 서버나 외부 SDK로 개인정보를 전송하지 않습니다."
          items={externalTransferItems}
        />
        <InfoSection
          title="향후 재검토가 필요한 경우"
          description="아래 기능을 도입할 때는 개인정보 처리방침과 동의 UX를 다시 검토해야 합니다."
          items={reviewNeededItems}
        />
      </div>

      <section className="privacy-info-section">
        <h2>데이터 삭제</h2>
        <p>
          브라우저 저장소 삭제 또는 앱 초기화를 통해 현재 브라우저에 저장된 데이터를 삭제할 수
          있습니다. 향후 서버 저장 기능이 생기면 별도 삭제 절차가 필요합니다.
        </p>
      </section>

      <section className="privacy-info-section">
        <h2>참고 문서</h2>
        <div className="privacy-info-card-list">
          {referenceDocs.map((docName) => (
            <code key={docName}>{docName}</code>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PrivacyInfoPage;
