function genderLabel(value) {
  if (value === 'female') return '여성';
  if (value === 'male') return '남성';
  return '선택 안 함';
}

function SettingsPage({ profile, onEditProfile, onReset }) {
  return (
    <div className="page-stack">
      <section className="section-header">
        <p className="eyebrow">마이</p>
        <h1>내 정보와 앱 설정</h1>
      </section>

      <section className="settings-card">
        <div>
          <span>닉네임</span>
          <strong>{profile.nickname}</strong>
        </div>
        <div>
          <span>생년월일</span>
          <strong>{profile.birthDate}</strong>
        </div>
        <div>
          <span>태어난 시간</span>
          <strong>{profile.birthTimeUnknown ? '시간 모름' : profile.birthTime}</strong>
        </div>
        <div>
          <span>달력</span>
          <strong>{profile.calendarType === 'solar' ? '양력' : '음력'}</strong>
        </div>
        <div>
          <span>윤달 여부</span>
          <strong>{profile.calendarType === 'lunar' && profile.isLeapMonth ? '윤달' : '해당 없음'}</strong>
        </div>
        <div>
          <span>성별</span>
          <strong>{genderLabel(profile.gender)}</strong>
        </div>
      </section>

      <section className="settings-actions">
        <button className="ghost-button full-width" type="button" onClick={onEditProfile}>
          프로필 수정
        </button>
        <button className="danger-button full-width" type="button" onClick={onReset}>
          저장 데이터 초기화
        </button>
      </section>
    </div>
  );
}

export default SettingsPage;
