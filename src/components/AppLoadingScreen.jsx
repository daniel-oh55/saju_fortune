function AppLoadingScreen() {
  return (
    <div className="app-loading-screen" role="status" aria-live="polite">
      <div className="app-loading-scene" aria-hidden="true">
        <span className="app-loading-sun" />
        <span className="app-loading-cloud app-loading-cloud-a" />
        <span className="app-loading-cloud app-loading-cloud-b" />
        <span className="app-loading-bird app-loading-bird-a" />
        <span className="app-loading-bird app-loading-bird-b" />
        <span className="app-loading-bird app-loading-bird-c" />
        <span className="app-loading-mountain app-loading-mountain-back" />
        <span className="app-loading-mountain app-loading-mountain-front" />
      </div>
      <div className="app-loading-content">
        <div className="brand-mark app-loading-badge">하루</div>
        <p className="app-loading-title">하루풀이</p>
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
