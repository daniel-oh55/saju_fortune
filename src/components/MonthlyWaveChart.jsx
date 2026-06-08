function clampScore(score) {
  const numberScore = Number(score);

  if (Number.isNaN(numberScore)) return 0;
  return Math.min(100, Math.max(0, numberScore));
}

function buildCurvePath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const controlPoint = (current, previous, next, reverse = false) => {
    const smoothing = 0.18;
    const p = previous || current;
    const n = next || current;
    const lengthX = n.x - p.x;
    const lengthY = n.y - p.y;
    const direction = reverse ? -1 : 1;

    return {
      x: current.x + lengthX * smoothing * direction,
      y: current.y + lengthY * smoothing * direction,
    };
  };

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const previous = points[index - 1];
    const beforePrevious = points[index - 2];
    const next = points[index + 1];
    const cp1 = controlPoint(previous, beforePrevious, point);
    const cp2 = controlPoint(point, previous, next, true);

    return `${path} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${point.x} ${point.y}`;
  }, '');
}

function MonthlyWaveChart({ months }) {
  const width = 720;
  const height = 176;
  const paddingX = 36;
  const top = 26;
  const bottom = 122;
  const step = (width - paddingX * 2) / Math.max(months.length - 1, 1);
  const points = months.map((month, index) => {
    const score = clampScore(month.score);
    const x = paddingX + step * index;
    const y = bottom - (score / 100) * (bottom - top);

    return { x, y, score, month: month.month };
  });
  const path = buildCurvePath(points);
  const label = months.map((month) => `${month.month}월 ${month.score}점`).join(', ');

  return (
    <section className="monthly-wave-card" aria-label={`2026 월별 운세 흐름: ${label}`}>
      <div>
        <p className="eyebrow">Monthly Wave</p>
        <h3>2026 월별 운세 흐름</h3>
      </div>
      <div className="monthly-wave-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true">
          <path
            className="monthly-wave-area"
            d={`${path} L ${width - paddingX} ${bottom} L ${paddingX} ${bottom} Z`}
          />
          <path className="monthly-wave-line" d={path} />
          {points.map((point) => (
            <g key={point.month}>
              <circle className="monthly-wave-dot" cx={point.x} cy={point.y} r="4" />
              <text className="monthly-wave-score" x={point.x} y={Math.max(14, point.y - 12)}>
                {point.score}
              </text>
              <text className="monthly-wave-label" x={point.x} y="158">
                {point.month}월
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

export default MonthlyWaveChart;
