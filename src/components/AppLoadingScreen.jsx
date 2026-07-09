function AppLoadingScreen() {
  return (
    <div className="app-loading-screen" role="status" aria-live="polite">
      <div className="brand-mark app-loading-badge">하루</div>
      <p className="app-loading-title">하루풀이</p>
      <p className="app-loading-text">오늘의 흐름을 준비하고 있어요</p>
    </div>
  );
}

export default AppLoadingScreen;
