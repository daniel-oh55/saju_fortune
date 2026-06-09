function genderLabel(value) {
  if (value === 'female') return '여성';
  if (value === 'male') return '남성';
  return '선택 안 함';
}

function isLateNightBirthTime(birthTime, birthTimeUnknown) {
  if (birthTimeUnknown) return false;
  return /^23:\d{2}$/.test(birthTime || '');
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

      {isLateNightBirthTime(profile.birthTime, profile.birthTimeUnknown) && (
        <section className="late-night-time-notice">
          <strong>23시 이후 출생 안내</strong>
          <p>
            23:00~23:59 출생은 만세력 기준에 따라 같은 날짜 기준 또는 다음 날 자시 기준으로
            일주와 시주가 달라질 수 있습니다.
          </p>
          <p>
            현재 하루풀이는 입력한 생년월일과 시간을 기준으로 참고용 풀이를 제공하며, 23시 이후
            기준 선택 기능은 추후 검토 중입니다.
          </p>
        </section>
      )}

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
