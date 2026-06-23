import ContentSafetyNotice from '../components/ContentSafetyNotice.jsx';
import SajuCalculationBasisCard from '../components/SajuCalculationBasisCard.jsx';
import MountainOrbitIllustration from '../components/MountainOrbitIllustration.jsx';

function genderLabel(value) {
  if (value === 'female') return '여성';
  if (value === 'male') return '남성';
  return '선택 안 함';
}

function isLateNightBirthTime(birthTime, birthTimeUnknown) {
  if (birthTimeUnknown) return false;
  return /^23:\d{2}$/.test(birthTime || '');
}

function lateNightJasiPolicyLabel(value) {
  return value === 'next_day' ? '다음 날 자시 기준' : '입력한 날짜 기준';
}

function SettingsPage({ profile, fortune, consentPreferences, onNavigate, onOpenConsentSettings, onEditProfile, onReset }) {
  return (
    <div className="page-stack settings-page">
      <section className="settings-title-row">
        <p className="eyebrow">My Info</p>
        <h1>내정보</h1>
      </section>

      <section className="settings-profile-card">
        <div className="settings-profile-head">
          <div className="settings-avatar" aria-hidden="true">☻</div>
          <div>
            <span>닉네임</span>
            <strong>{profile.nickname}</strong>
          </div>
          <MountainOrbitIllustration size="small" className="settings-profile-artwork" opacity={0.72} />
        </div>

        <div className="settings-profile-list">
          <div>
            <span>▣ 생년월일</span>
            <strong>{profile.birthDate}</strong>
          </div>
          <div>
            <span>◷ 태어난 시간</span>
            <strong>{profile.birthTimeUnknown ? '시간 모름' : profile.birthTime}</strong>
          </div>
          <div>
            <span>▣ 달력</span>
            <strong>{profile.calendarType === 'solar' ? '양력' : '음력'}</strong>
          </div>
          <div>
            <span>☾ 윤달 여부</span>
            <strong>{profile.calendarType === 'lunar' && profile.isLeapMonth ? '윤달' : '해당 없음'}</strong>
          </div>
          <div>
            <span>♙ 성별</span>
            <strong>{genderLabel(profile.gender)}</strong>
          </div>
        </div>
      </section>

      {isLateNightBirthTime(profile.birthTime, profile.birthTimeUnknown) && (
        <section className="late-night-time-notice">
          <p>23시 이후 기준: {lateNightJasiPolicyLabel(profile.lateNightJasiPolicy)}</p>
          <strong>23시 이후 출생 안내</strong>
          <p>
            23:00~23:59 출생은 만세력 기준에 따라 같은 날짜 기준 또는 다음 날 자시 기준으로
            일주와 시주가 달라질 수 있습니다.
          </p>
          <p>
            현재 하루풀이는 선택한 23시 이후 기준을 바탕으로 참고용 풀이를 제공하며, 기준 정책은
            추가 검증 후 조정될 수 있습니다.
          </p>
        </section>
      )}

      <button className="ghost-button full-width settings-edit-profile-button" type="button" onClick={onEditProfile}>
        프로필 수정하기
      </button>

      <SajuCalculationBasisCard profile={profile} fortune={fortune} />

      <ContentSafetyNotice
        title="참고용 해석 안내"
        description="하루풀이는 사주와 운세 흐름을 참고용으로 정리해드리는 서비스입니다. 중요한 결정은 실제 상황과 전문가의 조언을 함께 고려해 주세요."
        compact
      />

      <section className="settings-menu-list" aria-label="내정보 메뉴">
        <button type="button" onClick={() => onNavigate('privacyInfo')}>
          <span aria-hidden="true">♢</span>
          개인정보 안내 보기
        </button>
        <button type="button" onClick={onOpenConsentSettings}>
          <span aria-hidden="true">▤</span>
          데이터 사용 설정
        </button>
        {consentPreferences && (
          <div className="settings-consent-summary">
            <span aria-hidden="true">◇</span>
            분석 {consentPreferences.analytics ? '동의' : '미동의'} · 광고{' '}
            {consentPreferences.ads ? '동의' : '미동의'} · 맞춤형 광고{' '}
            {consentPreferences.personalizedAds ? '동의' : '미동의'}
          </div>
        )}
        <button className="is-danger" type="button" onClick={onReset}>
          <span aria-hidden="true">△</span>
          저장 데이터 초기화
        </button>
      </section>
    </div>
  );
}

export default SettingsPage;
