function NotificationBellIcon() {
  return (
    <svg className="notification-bell-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M10.5 14.2c0-3.8 2.4-6.5 5.5-6.5s5.5 2.7 5.5 6.5v4.4l2 3.2H8.5l2-3.2v-4.4Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
      <path
        d="M13.8 24.2c.5 1.2 1.2 1.8 2.2 1.8s1.7-.6 2.2-1.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.9"
      />
      <circle cx="23.8" cy="7.2" r="2.3" fill="var(--color-warm-gold)" />
    </svg>
  );
}

export default NotificationBellIcon;
