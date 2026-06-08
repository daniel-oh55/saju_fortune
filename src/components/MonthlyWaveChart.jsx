function clampScore(score) {
  const numberScore = Number(score);

  if (Number.isNaN(numberScore)) return 0;
  return Math.min(100, Math.max(0, numberScore));
}

function buildSmoothPath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const previous = points[index - 1];
    const midX = (previous.x + point.x) / 2;
    return `${path} Q ${previous.x} ${previous.y} ${midX} ${(previous.y + point.y) / 2} T ${point.x} ${point.y}`;
  }, '');
}

function MonthlyWaveChart({ months }) {
  const width = 320;
  const height = 156;
  const paddingX = 18;
  const top = 22;
  const bottom = 108;
  const step = (width - paddingX * 2) / Math.max(months.length - 1, 1);
  const points = months.map((month, index) => {
    const score = clampScore(month.score);
    const x = paddingX + step * index;
    const y = bottom - (score / 100) * (bottom - top);

    return { x, y, score, month: month.month };
  });
  const path = buildSmoothPath(points);
  const label = months.map((month) => `${month.month}월 ${month.score}점`).join(', ');

  return (
    <section className="monthly-wave-card" aria-label={`2026 월별 운세 흐름: ${label}`}>
      <div>
        <p className="eyebrow">Monthly Wave</p>
        <h3>2026 월별 운세 흐름</h3>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true">
        <path className="monthly-wave-area" d={`${path} L ${width - paddingX} ${bottom} L ${paddingX} ${bottom} Z`} />
        <path className="monthly-wave-line" d={path} />
        {points.map((point) => (
          <g key={point.month}>
            <circle className="monthly-wave-dot" cx={point.x} cy={point.y} r="3.5" />
            <text className="monthly-wave-score" x={point.x} y={point.y - 8}>
              {point.score}
            </text>
            <text className="monthly-wave-label" x={point.x} y="140">
              {point.month}월
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}

export default MonthlyWaveChart;
