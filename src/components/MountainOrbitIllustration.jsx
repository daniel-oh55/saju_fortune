function MountainOrbitIllustration({
  size = 'medium',
  align = 'right',
  className = '',
  opacity,
  decorative = true,
}) {
  const classNames = [
    'mountain-orbit-illustration',
    `size-${size}`,
    `align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const style = opacity === undefined ? undefined : { opacity };

  return (
    <div
      className={classNames}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : '산과 달 궤도 일러스트'}
      role={decorative ? undefined : 'img'}
      style={style}
    >
      <span className="mountain-orbit-ring ring-main" />
      <span className="mountain-orbit-ring ring-soft" />
      <span className="mountain-orbit-dot dot-one" />
      <span className="mountain-orbit-dot dot-two" />
      <span className="mountain-orbit-star star-one" />
      <span className="mountain-orbit-star star-two" />
      <span className="mountain-orbit-sun" />
      <span className="mountain-orbit-ridge ridge-back" />
      <span className="mountain-orbit-ridge ridge-mid" />
      <span className="mountain-orbit-ridge ridge-front" />
    </div>
  );
}

export default MountainOrbitIllustration;
