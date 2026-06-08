function clampScore(score) {
  const numberScore = Number(score);

  if (Number.isNaN(numberScore)) return 0;
  return Math.min(100, Math.max(0, numberScore));
}

function ScoreDonut({ score, label = '오늘의 점수' }) {
  const safeScore = clampScore(score);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="score-donut" aria-label={`${label} ${safeScore}점`}>
      <svg viewBox="0 0 120 120" role="img" aria-hidden="true">
        <circle className="score-donut-track" cx="60" cy="60" r={radius} />
        <circle
          className="score-donut-value"
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="score-donut-text">
        <strong>{safeScore}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default ScoreDonut;
