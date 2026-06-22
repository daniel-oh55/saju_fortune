const navItems = [
  { id: 'home', label: '홈', icon: '⌂' },
  { id: 'sajuInsight', label: '오늘흐름', icon: '☼' },
  { id: 'year', label: '2026운세', icon: '2026' },
  { id: 'zodiac', label: '띠별운세', icon: '12' },
  { id: 'settings', label: '내정보', icon: '☻' },
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
