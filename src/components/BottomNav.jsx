const navItems = [
  { id: 'home', label: '홈', icon: '⌂' },
  { id: 'fortune', label: '오늘운세', icon: '☼' },
  { id: 'year', label: '2026운세', icon: '2026' },
  { id: 'zodiac', label: '띠별', icon: '12' },
  { id: 'ai', label: 'AI상담', icon: 'AI' },
  { id: 'settings', label: '마이', icon: '☻' },
];

function BottomNav({ activePage, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
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
