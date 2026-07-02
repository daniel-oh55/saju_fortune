import fs from 'node:fs';

const practicalBaselinePath = 'docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json';
const afterPath = 'docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json';
const resultPath = 'docs/generated/year-monthly-fortune-snapshot-comparison-result.json';

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

for (const path of [practicalBaselinePath, afterPath]) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const practicalBaseline = readJson(practicalBaselinePath);
const after = readJson(afterPath);
const baselineSamples = sampleMap(practicalBaseline);
const afterSamples = sampleMap(after);
const baselineSampleIds = practicalBaseline.samples.map((sample) => sample.sampleId);
const afterSampleIds = after.samples.map((sample) => sample.sampleId);

const sampleCountPreserved = practicalBaseline.samples.length === after.samples.length && after.samples.length === 8;
const sampleIdsPreserved = sameArray(baselineSampleIds, afterSampleIds);
const afterMetadataValid =
  after.snapshotVersion === 'fortune_engine_sample_snapshot_after_year_monthly_improvement_v1' &&
  after.dateKey === '2026-06-30' &&
  after.targetYear === 2026 &&
  after.productionLogicChangeScope === 'year_monthly_first_scope_only' &&
  after.engineAccuracyApproval === 'Pending';

logResult('sample_count_is_8_and_preserved', sampleCountPreserved);
logResult('sample_ids_preserved', sampleIdsPreserved);
logResult('after_snapshot_metadata_valid', afterMetadataValid);

if (!sampleCountPreserved || !sampleIdsPreserved || !afterMetadataValid) hasFailure = true;

let todayFortuneUnchanged = true;
let manseryeokUnchanged = true;
let sajuAnalysisUnchanged = true;
let zodiacFortuneUnchanged = true;
let yearMonthlyFortuneChanged = false;
let monthlyEntriesCountPreserved = true;
let targetYearPreserved = true;

for (const sampleId of baselineSampleIds) {
  const beforeSample = baselineSamples.get(sampleId);
  const afterSample = afterSamples.get(sampleId);

  const sameTodayFortune = isDeepEqual(beforeSample.todayFortuneSummary, afterSample.todayFortuneSummary);
  const sameManseryeok = isDeepEqual(beforeSample.manseryeokSummary, afterSample.manseryeokSummary);
  const sameSajuAnalysis = isDeepEqual(beforeSample.sajuAnalysisSummary, afterSample.sajuAnalysisSummary);
  const sameZodiacFortune = isDeepEqual(beforeSample.zodiacFortuneSummary, afterSample.zodiacFortuneSummary);
  const sameYearFortune = isDeepEqual(beforeSample.yearFortuneSummary, afterSample.yearFortuneSummary);
  const monthlyEntriesCountOk = afterSample?.yearFortuneSummary?.monthsCount === 12;
  const targetYearOk = afterSample?.yearFortuneSummary?.targetYear === 2026;

  logResult(`${sampleId}_today_fortune_unchanged`, sameTodayFortune);
  logResult(`${sampleId}_manseryeok_unchanged`, sameManseryeok);
  logResult(`${sampleId}_saju_analysis_unchanged`, sameSajuAnalysis);
  logResult(`${sampleId}_zodiac_fortune_unchanged`, sameZodiacFortune);
  logResult(`${sampleId}_monthly_entries_count_is_12`, monthlyEntriesCountOk);
  logResult(`${sampleId}_target_year_preserved`, targetYearOk);

  if (!sameTodayFortune) todayFortuneUnchanged = false;
  if (!sameManseryeok) manseryeokUnchanged = false;
  if (!sameSajuAnalysis) sajuAnalysisUnchanged = false;
  if (!sameZodiacFortune) zodiacFortuneUnchanged = false;
  if (!sameYearFortune) yearMonthlyFortuneChanged = true;
  if (!monthlyEntriesCountOk) monthlyEntriesCountPreserved = false;
  if (!targetYearOk) targetYearPreserved = false;
}

const comparison = {
  comparisonVersion: 'year_monthly_fortune_snapshot_comparison_v1',
  dateKey: '2026-06-30',
  targetYear: 2026,
  practicalBaselineSnapshot: practicalBaselinePath,
  afterSnapshot: afterPath,
  sampleCount: after.samples.length,
  sampleIdsPreserved,
  todayFortuneUnchanged,
  manseryeokUnchanged,
  sajuAnalysisUnchanged,
  zodiacFortuneUnchanged,
  yearMonthlyFortuneChanged,
  monthlyEntriesCountPreserved,
  targetYearPreserved,
  engineAccuracyApproval: 'Pending',
  snapshotComparisonForYearMonthlyImprovement: 'Generated',
  notes:
    'Year/monthly changes are intended for comparison and review. Engine accuracy approval remains separate.',
};

fs.writeFileSync(resultPath, `${JSON.stringify(comparison, null, 2)}\n`, 'utf8');
console.log(`Year/monthly fortune snapshot comparison result written to ${resultPath}`);

for (const [label, passed] of [
  ['today_fortune_unchanged', todayFortuneUnchanged],
  ['manseryeok_unchanged', manseryeokUnchanged],
  ['saju_analysis_unchanged', sajuAnalysisUnchanged],
  ['zodiac_fortune_unchanged', zodiacFortuneUnchanged],
  ['monthly_entries_count_preserved', monthlyEntriesCountPreserved],
  ['target_year_preserved', targetYearPreserved],
]) {
  logResult(label, passed);
  if (!passed) hasFailure = true;
}

if (hasFailure) {
  console.error('Year/monthly fortune snapshot comparison failed');
  process.exit(1);
}

console.log('Year/monthly fortune snapshot comparison passed');
