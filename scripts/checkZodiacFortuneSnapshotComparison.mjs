import fs from 'node:fs';

const practicalBaselinePath = 'docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json';
const afterPath = 'docs/generated/fortune-engine-sample-snapshot-after-zodiac-improvement.json';
const resultPath = 'docs/generated/zodiac-fortune-snapshot-comparison-result.json';
const expectedCategoryIds = ['overall', 'money', 'relationship', 'work', 'health'];

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
  after.snapshotVersion === 'fortune_engine_sample_snapshot_after_zodiac_improvement_v1' &&
  after.dateKey === '2026-06-30' &&
  after.targetYear === 2026 &&
  after.productionLogicChangeScope === 'zodiac_first_scope_only' &&
  after.engineAccuracyApproval === 'Pending';

logResult('sample_count_is_8_and_preserved', sampleCountPreserved);
logResult('sample_ids_preserved', sampleIdsPreserved);
logResult('after_snapshot_metadata_valid', afterMetadataValid);

if (!sampleCountPreserved || !sampleIdsPreserved || !afterMetadataValid) hasFailure = true;

let todayFortuneUnchanged = true;
let yearMonthlyFortuneUnchanged = true;
let manseryeokUnchanged = true;
let sajuAnalysisUnchanged = true;
let zodiacFortuneChanged = false;
let zodiacCategoryIdsPreserved = true;
let selectedYearPreserved = true;
let selectedAnimalPreserved = true;

for (const sampleId of baselineSampleIds) {
  const beforeSample = baselineSamples.get(sampleId);
  const afterSample = afterSamples.get(sampleId);

  const sameTodayFortune = isDeepEqual(beforeSample.todayFortuneSummary, afterSample.todayFortuneSummary);
  const sameYearFortune = isDeepEqual(beforeSample.yearFortuneSummary, afterSample.yearFortuneSummary);
  const sameManseryeok = isDeepEqual(beforeSample.manseryeokSummary, afterSample.manseryeokSummary);
  const sameSajuAnalysis = isDeepEqual(beforeSample.sajuAnalysisSummary, afterSample.sajuAnalysisSummary);
  const sameZodiacFortune = isDeepEqual(beforeSample.zodiacFortuneSummary, afterSample.zodiacFortuneSummary);
  const sameCategoryIds = sameArray(afterSample?.zodiacFortuneSummary?.categoryIds || [], expectedCategoryIds);
  const sameSelectedYear =
    beforeSample?.zodiacFortuneSummary?.selectedYear === afterSample?.zodiacFortuneSummary?.selectedYear;
  const sameSelectedAnimal =
    beforeSample?.zodiacFortuneSummary?.selectedAnimal === afterSample?.zodiacFortuneSummary?.selectedAnimal;

  logResult(`${sampleId}_today_fortune_unchanged`, sameTodayFortune);
  logResult(`${sampleId}_year_monthly_fortune_unchanged`, sameYearFortune);
  logResult(`${sampleId}_manseryeok_unchanged`, sameManseryeok);
  logResult(`${sampleId}_saju_analysis_unchanged`, sameSajuAnalysis);
  logResult(`${sampleId}_zodiac_fortune_changed_or_review_target`, !sameZodiacFortune);
  logResult(`${sampleId}_zodiac_category_ids_preserved`, sameCategoryIds);
  logResult(`${sampleId}_selected_year_preserved`, sameSelectedYear);
  logResult(`${sampleId}_selected_animal_preserved`, sameSelectedAnimal);

  if (!sameTodayFortune) todayFortuneUnchanged = false;
  if (!sameYearFortune) yearMonthlyFortuneUnchanged = false;
  if (!sameManseryeok) manseryeokUnchanged = false;
  if (!sameSajuAnalysis) sajuAnalysisUnchanged = false;
  if (!sameZodiacFortune) zodiacFortuneChanged = true;
  if (!sameCategoryIds) zodiacCategoryIdsPreserved = false;
  if (!sameSelectedYear) selectedYearPreserved = false;
  if (!sameSelectedAnimal) selectedAnimalPreserved = false;
}

const comparison = {
  comparisonVersion: 'zodiac_fortune_snapshot_comparison_v1',
  dateKey: '2026-06-30',
  targetYear: 2026,
  practicalBaselineSnapshot: practicalBaselinePath,
  afterSnapshot: afterPath,
  sampleCount: after.samples.length,
  sampleIdsPreserved,
  todayFortuneUnchanged,
  yearMonthlyFortuneUnchanged,
  manseryeokUnchanged,
  sajuAnalysisUnchanged,
  zodiacFortuneChanged,
  zodiacCategoryIdsPreserved,
  selectedYearPreserved,
  selectedAnimalPreserved,
  engineAccuracyApproval: 'Pending',
  snapshotComparisonForZodiacImprovement: 'Generated',
  notes:
    'Zodiac changes are generated for separate output quality review. Engine accuracy approval remains separate.',
};

fs.writeFileSync(resultPath, `${JSON.stringify(comparison, null, 2)}\n`, 'utf8');
console.log(`Zodiac fortune snapshot comparison result written to ${resultPath}`);

for (const [label, passed] of [
  ['today_fortune_unchanged', todayFortuneUnchanged],
  ['year_monthly_fortune_unchanged', yearMonthlyFortuneUnchanged],
  ['manseryeok_unchanged', manseryeokUnchanged],
  ['saju_analysis_unchanged', sajuAnalysisUnchanged],
  ['zodiac_category_ids_preserved', zodiacCategoryIdsPreserved],
  ['selected_year_preserved', selectedYearPreserved],
  ['selected_animal_preserved', selectedAnimalPreserved],
]) {
  logResult(label, passed);
  if (!passed) hasFailure = true;
}

if (hasFailure) {
  console.error('Zodiac fortune snapshot comparison failed');
  process.exit(1);
}

console.log('Zodiac fortune snapshot comparison passed');
