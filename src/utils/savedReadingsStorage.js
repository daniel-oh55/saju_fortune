export const SAVED_READINGS_STORAGE_KEY = 'harupuli_saved_readings_v1';

const MAX_SAVED_READINGS = 50;
const BLOCKED_PROFILE_FIELDS = new Set([
  'birthDate',
  'birthTime',
  'birthTimeUnknown',
  'calendarType',
  'gender',
  'isLeapMonth',
  'lateNightJasiPolicy',
  'profile',
]);

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

function sanitizeTags(tags) {
  return Array.isArray(tags) ? tags.filter(Boolean).map(String).slice(0, 6) : [];
}

function sanitizeReadingItem(item) {
  if (!item || typeof item !== 'object' || !item.id) return null;

  const sanitized = {
    id: String(item.id),
    type: item.type ? String(item.type) : 'reading',
    title: item.title ? String(item.title) : '저장한 풀이',
    summary: item.summary ? String(item.summary) : '',
    body: item.body ? String(item.body) : '',
    tags: sanitizeTags(item.tags),
    dateKey: item.dateKey ? String(item.dateKey) : '',
    savedAt: item.savedAt ? String(item.savedAt) : new Date().toISOString(),
  };

  for (const blockedField of BLOCKED_PROFILE_FIELDS) {
    delete sanitized[blockedField];
  }

  return sanitized;
}

function normalizeSavedReadings(savedReadings) {
  if (!savedReadings || typeof savedReadings !== 'object') {
    return createEmptySavedReadings();
  }

  const items = Array.isArray(savedReadings.items)
    ? savedReadings.items.map(sanitizeReadingItem).filter(Boolean)
    : [];

  items.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());

  return {
    items: items.slice(0, MAX_SAVED_READINGS),
  };
}

export function createEmptySavedReadings() {
  return {
    items: [],
  };
}

export function loadSavedReadings() {
  const storage = getStorage();
  if (!storage) return createEmptySavedReadings();

  return normalizeSavedReadings(safeParse(storage.getItem(SAVED_READINGS_STORAGE_KEY)));
}

export function saveSavedReadings(savedReadings) {
  const normalized = normalizeSavedReadings(savedReadings);
  const storage = getStorage();

  if (storage) {
    storage.setItem(SAVED_READINGS_STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

export function saveReadingItem(item) {
  const nextItem = sanitizeReadingItem({
    ...item,
    savedAt: new Date().toISOString(),
  });

  if (!nextItem) return loadSavedReadings();

  const current = loadSavedReadings();
  const nextItems = [nextItem, ...current.items.filter((savedItem) => savedItem.id !== nextItem.id)];

  return saveSavedReadings({ items: nextItems });
}

export function removeSavedReading(itemId) {
  const current = loadSavedReadings();
  return saveSavedReadings({
    items: current.items.filter((item) => item.id !== itemId),
  });
}

export function isReadingSaved(itemId) {
  return loadSavedReadings().items.some((item) => item.id === itemId);
}
