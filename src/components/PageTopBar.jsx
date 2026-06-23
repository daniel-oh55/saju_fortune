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
      <div className="page-topbar-spacer" aria-hidden="true" />
      <strong className="page-topbar-title">{title}</strong>
      <div className="page-topbar-actions">
        <button
          className="page-topbar-icon-button profile"
          type="button"
          onClick={onProfileClick}
          aria-label="내정보 열기"
        >
          {profileInitial}
        </button>
        <button
          className={`page-topbar-icon-button notification ${isReminderEnabled ? 'is-enabled' : ''}`}
          type="button"
          onClick={onReminderClick}
          aria-label="알림 설정"
        >
          <NotificationBellIcon />
        </button>
      </div>
    </header>
  );
}

export default PageTopBar;
