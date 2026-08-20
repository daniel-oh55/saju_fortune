const navItems = [
  { id: 'home', label: '홈', icon: '⌂' },
  { id: 'sajuInsight', label: '오늘흐름', icon: '☼' },
  { id: 'year', label: '2026운세', icon: '2026' },
  { id: 'zodiac', label: '띠별운세', icon: '12' },
  { id: 'settings', label: '내정보', icon: '☻' },
];

function normalizeBannerOffsetPx(px) {
  const numeric = Number(px);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.round(numeric));
}

function BottomNav({ activePage, bannerOffsetPx = 0, onNavigate }) {
  // A native Banner sits below the nav at the bottom of the screen, so the nav
  // is lifted by the plugin-reported Banner height on top of its CSS baseline.
  // With no Banner the baseline CSS position is used unchanged.
  const offsetPx = normalizeBannerOffsetPx(bannerOffsetPx);
  const navStyle =
    offsetPx > 0
      ? { bottom: `calc(10px + env(safe-area-inset-bottom) + ${offsetPx}px)` }
      : undefined;

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴" style={navStyle}>
      {navItems.map((item) => (
        <button
          className={`nav-button ${activePage === item.id ? 'is-active' : ''}`}
          key={item.id}
          onClick={() => onNavigate(item.id)}
          type="button"
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
