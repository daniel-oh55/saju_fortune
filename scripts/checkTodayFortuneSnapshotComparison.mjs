import fs from 'node:fs';

const baselinePath = 'docs/generated/fortune-engine-sample-snapshot.json';
const afterPath = 'docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json';
const resultPath = 'docs/generated/today-fortune-snapshot-comparison-result.json';
const requiredTodayCategoryIds = ['overall', 'money', 'love', 'work', 'study', 'health'];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function isDeepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function sampleMap(snapshot) {
  return new Map(snapshot.samples.map((sample) => [sample.sampleId, sample]));
}

function sameArray(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

let hasFailure = false;

for (const path of [baselinePath, afterPath]) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const baseline = readJson(baselinePath);
const after = readJson(afterPath);
const baselineSamples = sampleMap(baseline);
const afterSamples = sampleMap(after);
const baselineSampleIds = baseline.samples.map((sample) => sample.sampleId);
const afterSampleIds = after.samples.map((sample) => sample.sampleId);

const sampleCountPreserved = baseline.samples.length === after.samples.length && after.samples.length === 8;
const sampleIdsPreserved = sameArray(baselineSampleIds, afterSampleIds);
const afterMetadataValid =
  after.snapshotVersion === 'fortune_engine_sample_snapshot_after_today_improvement_v1' &&
  after.dateKey === '2026-06-30' &&
  after.targetYear === 2026 &&
  after.productionLogicChangeScope === 'today_fortune_first_scope_only' &&
  after.engineAccuracyApproval === 'Pending';

logResult('sample_count_is_8_and_preserved', sampleCountPreserved);
logResult('sample_ids_preserved', sampleIdsPreserved);
logResult('after_snapshot_metadata_valid', afterMetadataValid);

if (!sampleCountPreserved || !sampleIdsPreserved || !afterMetadataValid) hasFailure = true;

let requiredCategoryIdsPreserved = true;
let manseryeokUnchanged = true;
let yearFortuneUnchanged = true;
let zodiacFortuneUnchanged = true;
let todayFortuneChanged = false;

for (const sampleId of baselineSampleIds) {
  const beforeSample = baselineSamples.get(sampleId);
  const afterSample = afterSamples.get(sampleId);

  const categoryIdsPreserved = sameArray(
    afterSample?.todayFortuneSummary?.categoryIds || [],
    requiredTodayCategoryIds
  );
  logResult(`${sampleId}_required_today_category_ids_preserved`, categoryIdsPreserved);
  if (!categoryIdsPreserved) requiredCategoryIdsPreserved = false;

  const sameManseryeok = isDeepEqual(beforeSample.manseryeokSummary, afterSample.manseryeokSummary);
  const sameYearFortune = isDeepEqual(beforeSample.yearFortuneSummary, afterSample.yearFortuneSummary);
  const sameZodiacFortune = isDeepEqual(beforeSample.zodiacFortuneSummary, afterSample.zodiacFortuneSummary);
  const sameTodayFortune = isDeepEqual(beforeSample.todayFortuneSummary, afterSample.todayFortuneSummary);

  logResult(`${sampleId}_manseryeok_unchanged`, sameManseryeok);
  logResult(`${sampleId}_year_fortune_unchanged`, sameYearFortune);
  logResult(`${sampleId}_zodiac_fortune_unchanged`, sameZodiacFortune);

  if (!sameManseryeok) manseryeokUnchanged = false;
  if (!sameYearFortune) yearFortuneUnchanged = false;
  if (!sameZodiacFortune) zodiacFortuneUnchanged = false;
  if (!sameTodayFortune) todayFortuneChanged = true;
}

const comparison = {
  comparisonVersion: 'today_fortune_snapshot_comparison_v1',
  dateKey: '2026-06-30',
  targetYear: 2026,
  baselineSnapshot: baselinePath,
  afterSnapshot: afterPath,
  sampleCount: after.samples.length,
  sampleIdsPreserved,
  requiredCategoryIdsPreserved,
  manseryeokUnchanged,
  yearFortuneUnchanged,
  zodiacFortuneUnchanged,
  todayFortuneChanged,
  engineAccuracyApproval: 'Pending',
  snapshotComparisonAfterImplementation: 'Generated',
  notes:
    'Today fortune output changes are generated for comparison only. Engine accuracy approval remains separate.',
};

fs.writeFileSync(resultPath, `${JSON.stringify(comparison, null, 2)}\n`, 'utf8');
console.log(`Today fortune snapshot comparison result written to ${resultPath}`);

for (const [label, passed] of [
  ['required_category_ids_preserved', requiredCategoryIdsPreserved],
  ['manseryeok_unchanged', manseryeokUnchanged],
  ['year_fortune_unchanged', yearFortuneUnchanged],
  ['zodiac_fortune_unchanged', zodiacFortuneUnchanged],
]) {
  logResult(label, passed);
  if (!passed) hasFailure = true;
}

if (hasFailure) {
  console.error('Today fortune snapshot comparison failed');
  process.exit(1);
}

console.log('Today fortune snapshot comparison passed');
