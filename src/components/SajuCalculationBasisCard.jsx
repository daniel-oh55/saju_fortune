function isLateNightBirthTime(birthTime, birthTimeUnknown) {
  if (birthTimeUnknown) return false;
  return /^23:\d{2}$/.test(birthTime || '');
}

function lateNightJasiPolicyLabel(value) {
  return value === 'next_day' ? '다음 날 자시 기준' : '입력한 날짜 기준';
}

function calendarTypeLabel(value) {
  return value === 'lunar' ? '음력' : '양력';
}

function formatBirthTime(profile) {
  return profile.birthTimeUnknown ? '시간 모름' : profile.birthTime || '미입력';
}

function formatPillar(value) {
  return value || '확인 중';
}

function SajuCalculationBasisCard({ profile, fortune }) {
  const sajuAnalysis = fortune?.sajuAnalysis;
  const manseryeok = sajuAnalysis?.manseryeok;
  const pillars = sajuAnalysis?.pillars;

  if (!profile || !sajuAnalysis) {
    return (
      <section className="saju-basis-card">
        <h2>사주 계산 기준</h2>
        <p>계산 기준 정보 준비 중입니다.</p>
      </section>
    );
  }

  const isLateNight = isLateNightBirthTime(profile.birthTime, profile.birthTimeUnknown);

  return (
    <section className="saju-basis-card">
      <div className="saju-basis-head">
        <span>참고용 계산 정보</span>
        <h2>사주 계산 기준</h2>
      </div>

      <div className="saju-basis-grid">
        <div>
          <span>생년월일</span>
          <strong>{profile.birthDate}</strong>
        </div>
        <div>
          <span>태어난 시간</span>
          <strong>{formatBirthTime(profile)}</strong>
        </div>
        <div>
          <span>달력</span>
          <strong>{calendarTypeLabel(profile.calendarType)}</strong>
        </div>
        {isLateNight && (
          <div>
            <span>23시 이후 기준</span>
            <strong>{lateNightJasiPolicyLabel(profile.lateNightJasiPolicy)}</strong>
          </div>
        )}
        <div className="saju-basis-wide">
          <span>계산 기준 일시</span>
          <strong>{manseryeok?.convertedSolar || '확인 중'}</strong>
        </div>
      </div>

      {pillars && (
        <div className="saju-pillar-grid" aria-label="사주 팔자">
          <div>
            <span>연주</span>
            <strong>{formatPillar(pillars.year)}</strong>
          </div>
          <div>
            <span>월주</span>
            <strong>{formatPillar(pillars.month)}</strong>
          </div>
          <div>
            <span>일주</span>
            <strong>{formatPillar(pillars.day)}</strong>
          </div>
          <div>
            <span>시주</span>
            <strong>{formatPillar(pillars.hour)}</strong>
          </div>
        </div>
      )}

      <div className="saju-basis-note">
        <p>이 정보는 입력한 생년월일과 선택한 시간 기준을 바탕으로 계산한 참고용 사주 기준입니다.</p>
        {isLateNight && (
          <p>23시 이후 출생자는 선택한 자시 기준에 따라 일주와 시주가 달라질 수 있습니다.</p>
        )}
      </div>
    </section>
  );
}

export default SajuCalculationBasisCard;
