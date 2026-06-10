import {
  isReadingSaved,
  loadSavedReadings,
  removeSavedReading,
  saveReadingItem,
  SAVED_READINGS_STORAGE_KEY,
} from '../src/utils/savedReadingsStorage.js';

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

function createItem(id, summary = '요약', body = '본문') {
  return {
    id,
    type: 'fortuneCategory',
    title: '오늘운세',
    summary,
    body,
    tags: ['정리', '균형'],
    dateKey: '2026-06-10',
  };
}

globalThis.localStorage.clear();

const initial = loadSavedReadings();
logResult('initial_empty_saved_readings', initial.items.length === 0);
assertCondition(initial.items.length === 0, 'initial saved readings should be empty');

let saved = saveReadingItem(createItem('fortune:2026-06-10:overall'));
logResult('save_first_item', saved.items.length === 1);
assertCondition(saved.items.length === 1, 'first save should create one item');

saved = saveReadingItem(createItem('fortune:2026-06-10:overall', '업데이트 요약', '업데이트 본문'));
const duplicateUpdated =
  saved.items.length === 1 &&
  saved.items[0].summary === '업데이트 요약' &&
  saved.items[0].body === '업데이트 본문';
logResult('duplicate_updates_not_duplicate', duplicateUpdated);
assertCondition(duplicateUpdated, 'duplicate save should update existing item without duplicate');

saved = saveReadingItem(createItem('saju:2026-06-10:insight', '사주 요약', '사주 본문'));
logResult('save_second_item', saved.items.length === 2);
assertCondition(saved.items.length === 2, 'second id should create a second item');

const readingSaved = isReadingSaved('saju:2026-06-10:insight');
logResult('is_reading_saved', readingSaved);
assertCondition(readingSaved, 'isReadingSaved should return true for saved id');

saved = removeSavedReading('fortune:2026-06-10:overall');
const removed = saved.items.length === 1 && !saved.items.some((item) => item.id === 'fortune:2026-06-10:overall');
logResult('remove_saved_reading', removed);
assertCondition(removed, 'removeSavedReading should remove only the target id');

globalThis.localStorage.setItem(SAVED_READINGS_STORAGE_KEY, '{broken-json');
const recovered = loadSavedReadings();
logResult('corrupted_storage_recovers', recovered.items.length === 0);
assertCondition(recovered.items.length === 0, 'corrupted storage should recover to empty items');

globalThis.localStorage.clear();
for (let index = 0; index < 55; index += 1) {
  saveReadingItem(createItem(`fortune:2026-06-${String(index + 1).padStart(2, '0')}:overall`));
}
const limited = loadSavedReadings();
logResult('max_items_limit', limited.items.length <= 50);
assertCondition(limited.items.length <= 50, `max items should be <= 50, got ${limited.items.length}`);

saveReadingItem({
  ...createItem('privacy:test'),
  birthDate: '1990-01-01',
  birthTime: '09:00',
  gender: 'male',
  calendarType: 'solar',
  lateNightJasiPolicy: 'same_day',
});
const sensitiveFields = ['birthDate', 'birthTime', 'gender', 'calendarType', 'lateNightJasiPolicy'];
const privacyItem = loadSavedReadings().items.find((item) => item.id === 'privacy:test');
const noSensitiveFields = sensitiveFields.every((field) => !(field in privacyItem));
logResult('no_profile_sensitive_fields', noSensitiveFields);
assertCondition(noSensitiveFields, 'saved item should not include profile sensitive fields');

if (failures.length > 0) {
  console.log('failures:');
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exitCode = 1;
}
