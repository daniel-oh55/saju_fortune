export const DAILY_REMINDER_SETTINGS_KEY = 'harupuli_daily_reminder_settings_v1';

const DEFAULT_DAILY_REMINDER_SETTINGS = {
  enabled: false,
  time: '08:00',
};

function normalizeReminderSettings(value) {
  const time = typeof value?.time === 'string' && /^\d{2}:\d{2}$/.test(value.time)
    ? value.time
    : DEFAULT_DAILY_REMINDER_SETTINGS.time;

  return {
    enabled: Boolean(value?.enabled),
    time,
  };
}

export function loadDailyReminderSettings() {
  if (typeof window === 'undefined') return DEFAULT_DAILY_REMINDER_SETTINGS;

  try {
    const saved = JSON.parse(window.localStorage.getItem(DAILY_REMINDER_SETTINGS_KEY));
    return normalizeReminderSettings(saved);
  } catch {
    return DEFAULT_DAILY_REMINDER_SETTINGS;
  }
}

export function saveDailyReminderSettings(settings) {
  const nextSettings = normalizeReminderSettings(settings);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DAILY_REMINDER_SETTINGS_KEY, JSON.stringify(nextSettings));
  }

  return nextSettings;
}

export async function requestDailyReminderPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  if (window.Notification.permission === 'granted') return 'granted';
  if (window.Notification.permission === 'denied') return 'denied';

  return window.Notification.requestPermission();
}
