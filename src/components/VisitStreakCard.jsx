function VisitStreakCard({ streak }) {
  const currentStreak = Math.max(Number(streak?.currentStreak) || 0, 0);
  const bestStreak = Math.max(Number(streak?.bestStreak) || 0, 0);

  const streakText =
    currentStreak > 1
      ? `${currentStreak}일 연속 확인 중`
      : currentStreak === 1
        ? '오늘부터 시작했어요'
        : '오늘의 운세를 확인하면 기록이 시작됩니다';

  return (
    <section className="visit-streak-card">
      <div className="visit-streak-header">
        <div>
          <p className="eyebrow">Visit Streak</p>
          <h2>오늘도 하루풀이 확인 완료</h2>
        </div>
        <strong className="visit-streak-count">{currentStreak}</strong>
      </div>

      <div className="visit-streak-meta">
        <span>{streakText}</span>
        <span>최고 기록 {bestStreak}일</span>
      </div>

      <p className="visit-streak-note">
        작은 확인이 쌓이면 나의 흐름을 더 편하게 돌아볼 수 있어요.
      </p>
    </section>
  );
}

export default VisitStreakCard;
