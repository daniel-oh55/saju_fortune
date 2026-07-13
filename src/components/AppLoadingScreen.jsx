function AppLoadingScreen() {
  return (
    <div className="app-loading-screen" role="status" aria-live="polite">
      <div className="app-loading-backdrop" aria-hidden="true" />
      <svg
        className="app-loading-brand-svg"
        viewBox="0 0 320 70"
        role="img"
        aria-label="하루풀이"
      >
        <text x="8" y="50" className="app-loading-brand-text">
          하루풀이
        </text>
      </svg>
      <div className="app-loading-content">
        <p className="app-loading-text">오늘의 흐름을 준비하고 있어요</p>
        <div className="app-loading-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default AppLoadingScreen;
