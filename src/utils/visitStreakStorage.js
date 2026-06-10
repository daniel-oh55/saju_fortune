export const VISIT_STREAK_STORAGE_KEY = 'harupuli_visit_streak_v1';

const MAX_VISITED_DATES = 30;

function getStorage() {
  try {
    return globalThis.localStorage || null;
  } catch {
    return null;
  }
}

function safeParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function isDateKey(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toUtcDay(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

function getDayGap(previousDateKey, nextDateKey) {
  return Math.round((toUtcDay(nextDateKey) - toUtcDay(previousDateKey)) / 86400000);
}

function normalizeVisitStreak(streak) {
  if (!streak || typeof streak !== 'object') {
    return createEmptyVisitStreak();
  }

  const visitedDates = Array.isArray(streak.visitedDates)
    ? streak.visitedDates.filter(isDateKey).slice(-MAX_VISITED_DATES)
    : [];

  return {
    lastVisitedDateKey: isDateKey(streak.lastVisitedDateKey) ? streak.lastVisitedDateKey : '',
    currentStreak: Math.max(Number(streak.currentStreak) || 0, 0),
    bestStreak: Math.max(Number(streak.bestStreak) || 0, 0),
    visitedDates,
  };
}

export function createEmptyVisitStreak() {
  return {
    lastVisitedDateKey: '',
    currentStreak: 0,
    bestStreak: 0,
    visitedDates: [],
  };
}

export function loadVisitStreak() {
  const storage = getStorage();
  if (!storage) return createEmptyVisitStreak();

  return normalizeVisitStreak(safeParse(storage.getItem(VISIT_STREAK_STORAGE_KEY)));
}

export function saveVisitStreak(streak) {
  const normalized = normalizeVisitStreak(streak);
  const storage = getStorage();

  if (storage) {
    storage.setItem(VISIT_STREAK_STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

export function recordDailyVisit(dateKey) {
  if (!isDateKey(dateKey)) {
    return loadVisitStreak();
  }

  const current = loadVisitStreak();

  if (current.lastVisitedDateKey === dateKey) {
    return current;
  }

  const dayGap = current.lastVisitedDateKey ? getDayGap(current.lastVisitedDateKey, dateKey) : 0;
  const currentStreak = dayGap === 1 ? current.currentStreak + 1 : 1;
  const bestStreak = Math.max(current.bestStreak, currentStreak);
  const visitedDates = [...new Set([...current.visitedDates, dateKey])].slice(-MAX_VISITED_DATES);

  return saveVisitStreak({
    lastVisitedDateKey: dateKey,
    currentStreak,
    bestStreak,
    visitedDates,
  });
}
