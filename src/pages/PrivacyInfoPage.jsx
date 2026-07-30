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
  '하루풀이 자체 서버/DB로 프로필을 전송하지 않음',
  '별도의 외부 분석 전용 SDK는 아직 연결되지 않음',
  '실제 결제 SDK는 아직 연결되지 않음',
  'AdMob과 UMP는 광고·동의 처리를 위해 Google 서비스와 통신할 수 있음',
];

const advertisingDataItems = [
  'IP 주소를 통해 추정될 수 있는 대략적인 위치',
  '앱 실행, 화면 탭, 광고·동영상 상호작용 등의 앱 상호작용 및 사용 정보',
  '앱 또는 광고 SDK의 실행 시간, 중단, 성능 등의 진단 정보',
  'Android 광고 ID, 앱 세트 ID 및 기타 기기·앱 식별자',
];

const reviewNeededItems = [
  '새로운 분석 SDK 또는 광고 파트너 도입',
  '로그인·계정 기능 도입',
  '서버/DB 저장 도입',
  '결제 기능 도입',
  '광고 데이터 처리 범위나 동의 UX 변경',
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

function consentLabel(value) {
  return value ? '동의' : '미동의';
}

function PrivacyInfoPage({ onNavigate, consentPreferences }) {
  return (
    <div className="page-stack privacy-info-page">
      <section className="section-header">
        <button className="ghost-button" type="button" onClick={() => onNavigate('home')}>
          홈으로
        </button>
        <p className="eyebrow">Privacy Guide</p>
        <h1>개인정보 안내</h1>
        <p>
          이 페이지는 하루풀이 앱의 현재 개인정보 처리 안내입니다. 최신 개인정보처리방침 전문은
          아래 외부 페이지에서 확인할 수 있습니다.
        </p>
      </section>

      <section className="privacy-info-note">
        <strong>현재 광고 제공 상태</strong>
        <p>
          광고 기능이 활성화된 Android 앱 버전에서는 Google AdMob 보상형 광고를 제공합니다.
          일반 사용자 대상 Production 업데이트는 아직 수행되지 않았으므로, 현재 모든 이용자에게
          광고가 제공되고 있다고 단정하지 않습니다.
        </p>
      </section>

      <section className="privacy-info-section">
        <h2>데이터 사용 동의 상태</h2>
        <p>
          아래 상태는 하루풀이 앱 내부의 데이터 사용 선택이며 Google UMP 개인정보 선택과는
          별도입니다. 앱 내부 선택은 Google UMP 선택을 대신하지 않습니다. Google UMP의 runtime
          동의 상태를 브라우저 저장소에 보관하지 않습니다.
        </p>
        {consentPreferences ? (
          <div className="consent-status-list">
            <div>
              <span>분석 데이터 사용</span>
              <strong>{consentLabel(consentPreferences.analytics)}</strong>
            </div>
            <div>
              <span>광고 데이터 사용</span>
              <strong>{consentLabel(consentPreferences.ads)}</strong>
            </div>
            <div>
              <span>맞춤형 광고</span>
              <strong>{consentLabel(consentPreferences.personalizedAds)}</strong>
            </div>
          </div>
        ) : (
          <p>저장된 동의 상태가 아직 없습니다.</p>
        )}
      </section>

      <div className="privacy-info-grid">
        <InfoSection
          title="현재 저장되는 정보"
          description="아래 정보는 현재 브라우저 저장소에 보관될 수 있습니다."
          items={storedItems}
        />
        <InfoSection
          title="저장하지 않는 정보"
          description="저장/공유 기능에서는 원본 프로필 민감 정보를 제외하는 것을 원칙으로 합니다."
          items={notStoredItems}
        />
        <InfoSection
          title="외부 전송"
          description="프로필은 하루풀이 자체 서버/DB로 전송하지 않습니다. AdMob과 UMP는 광고·동의 처리를 위해 Google 서비스와 통신할 수 있습니다."
          items={externalTransferItems}
        />
        <InfoSection
          title="향후 재검토가 필요한 경우"
          description="아래 기능을 도입할 때는 개인정보 처리방침과 동의 UX를 다시 검토해야 합니다."
          items={reviewNeededItems}
        />
      </div>

      <InfoSection
        title="광고 과정에서 처리될 수 있는 데이터"
        description="Google Mobile Ads SDK는 아래 데이터를 자동 수집하거나 Google 및 적용 가능한 광고 파트너와 공유할 수 있습니다."
        items={advertisingDataItems}
      />

      <section className="privacy-info-section">
        <h2>광고 데이터 처리 방식</h2>
        <p>
          이러한 데이터는 TLS를 이용하여 전송 중 암호화됩니다. 대략적인 위치는 IP 주소를 통해
          추정될 수 있으며, GPS를 이용한 정확한 위치 수집을 의미하지 않습니다.
        </p>
        <p>
          HYM LOUNGE는 생년월일, 출생시간 등 운세 입력 정보를 Google에 광고 목적으로 제공하거나
          광고 식별자와 결합하지 않습니다.
        </p>
      </section>

      <section className="privacy-info-section">
        <h2>광고와 개인정보에 관한 사용자 선택</h2>
        <p>
          지역, 동의 상태, 기기·광고 설정에 따라 맞춤 광고, 비맞춤 광고 또는 제한적 광고가
          제공될 수 있습니다. 개인정보 설정 기능이 제공될 때 실제 메뉴명은
          <strong> 개인정보 및 쿠키 설정</strong>입니다.
        </p>
        <p>광고 동의 여부와 관계없이 핵심 운세 기능은 계속 이용할 수 있습니다.</p>
      </section>

      <section className="privacy-info-section">
        <h2>데이터 삭제</h2>
        <p>
          앱 데이터 삭제 또는 앱 제거로 기기 내부 데이터를 삭제할 수 있습니다. Google 등 외부
          제공업체가 보유한 데이터의 보유·삭제는 해당 제공업체 정책과 사용자 설정에 따릅니다.
          HYM LOUNGE는 외부 제공업체가 보유한 데이터를 직접 삭제할 수 없습니다.
        </p>
      </section>

      <section className="privacy-info-section">
        <h2>전체 개인정보처리방침</h2>
        <p>최신 개인정보처리방침 전문은 웹페이지에서 확인할 수 있습니다.</p>
        <a
          className="privacy-policy-external-link"
          href="https://www.hymlounge.com/harupuli/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          전체 개인정보처리방침 보기
        </a>
        <p>
          문의:{' '}
          <a href="mailto:hym.lounge@gmail.com">hym.lounge@gmail.com</a>
        </p>
      </section>
    </div>
  );
}

export default PrivacyInfoPage;
