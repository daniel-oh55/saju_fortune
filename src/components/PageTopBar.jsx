import NotificationBellIcon from './NotificationBellIcon.jsx';

function PageTopBar({
  title,
  profileName,
  isReminderEnabled = false,
  onProfileClick,
  onReminderClick,
}) {
  const profileInitial = String(profileName || '마이').trim().slice(0, 1) || '마';

  return (
    <header className="page-topbar" aria-label={`${title} 상단 메뉴`}>
      {/* Left slot stays structurally present but empty: on the PageTopBar-backed
          subpages the App-owned back button is aligned into it via CSS, so this
          component never renders a second back-navigation control. */}
      <div className="page-topbar-left" />
      <strong className="page-topbar-title">{title}</strong>
      <div className="page-topbar-right">
        <button
          className={`page-topbar-icon-button notification ${isReminderEnabled ? 'is-enabled' : ''}`}
          type="button"
          onClick={onReminderClick}
          aria-label="알림 설정"
        >
          <NotificationBellIcon />
        </button>
        <button
          className="page-topbar-icon-button profile"
          type="button"
          onClick={onProfileClick}
          aria-label="내정보 열기"
        >
          {profileInitial}
        </button>
      </div>
    </header>
  );
}

export default PageTopBar;
