import {
  loadVisitStreak,
  recordDailyVisit,
  VISIT_STREAK_STORAGE_KEY,
} from '../src/utils/visitStreakStorage.js';

const failures = [];
const store = new Map();

globalThis.localStorage = {
  getItem(key) {
    return store.has(key) ? store.get(key) : null;
  },
  setItem(key, value) {
    store.set(key, String(value));
  },
  removeItem(key) {
    store.delete(key);
  },
  clear() {
    store.clear();
  },
};

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

function checkStreak(sampleId, streak, expected) {
  const isPass = Object.entries(expected).every(([key, value]) => streak[key] === value);
  assertCondition(isPass, `${sampleId}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(streak)}`);
  logResult(sampleId, isPass);
}

function addDays(dateKey, amount) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount));
  return date.toISOString().slice(0, 10);
}

globalThis.localStorage.clear();

checkStreak('initial_empty_streak', loadVisitStreak(), {
  currentStreak: 0,
  bestStreak: 0,
});

checkStreak('first_visit', recordDailyVisit('2026-06-10'), {
  currentStreak: 1,
  bestStreak: 1,
});

checkStreak('same_day_idempotent', recordDailyVisit('2026-06-10'), {
  currentStreak: 1,
  bestStreak: 1,
});

checkStreak('consecutive_day_increment', recordDailyVisit('2026-06-11'), {
  currentStreak: 2,
  bestStreak: 2,
});

checkStreak('gap_resets_current_streak', recordDailyVisit('2026-06-13'), {
  currentStreak: 1,
  bestStreak: 2,
});

recordDailyVisit('2026-06-14');
checkStreak('best_streak_updates', recordDailyVisit('2026-06-15'), {
  currentStreak: 3,
  bestStreak: 3,
});

globalThis.localStorage.setItem(VISIT_STREAK_STORAGE_KEY, '{broken-json');
checkStreak('corrupted_storage_recovers', loadVisitStreak(), {
  currentStreak: 0,
  bestStreak: 0,
});

globalThis.localStorage.clear();
let dateKey = '2026-05-01';
for (let index = 0; index < 35; index += 1) {
  recordDailyVisit(dateKey);
  dateKey = addDays(dateKey, 1);
}

const limitedStreak = loadVisitStreak();
const isLimitValid = limitedStreak.visitedDates.length <= 30;
assertCondition(
  isLimitValid,
  `visited_dates_limit: expected <= 30, got ${limitedStreak.visitedDates.length}`,
);
logResult('visited_dates_limit', isLimitValid);

if (failures.length > 0) {
  console.log('failures:');
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exitCode = 1;
}
