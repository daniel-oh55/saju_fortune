import fs from 'node:fs';
import { execSync } from 'node:child_process';

const snapshotPath = 'docs/generated/fortune-engine-sample-snapshot.json';
const resultDocPath = 'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_RESULT.md';
const runnerPath = 'scripts/runFortuneEngineSampleSnapshot.mjs';
const relatedDocs = [
  'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_READINESS.md',
  'docs/FORTUNE_ENGINE_SAMPLE_QA_BASELINE.md',
  'docs/FORTUNE_ENGINE_CURRENT_STATE_AUDIT.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const sampleIds = [
  'solar-known-time-01',
  'solar-unknown-time-01',
  'solar-late-night-same-day-01',
  'solar-late-night-next-day-01',
  'lunar-non-leap-01',
  'lunar-leap-01',
  'term-boundary-01',
  'profile-zodiac-boundary-01',
];

const requiredSampleKeys = [
  'sampleId',
  'purpose',
  'profileInputSummary',
  'todayFortuneSummary',
  'sajuAnalysisSummary',
  'manseryeokSummary',
  'yearFortuneSummary',
  'zodiacFortuneSummary',
];

const requiredCategoryIds = ['overall', 'money', 'love', 'work', 'study', 'health'];

const requiredResultDocSnippets = [
  '# Fortune Engine Sample Snapshot Result',
  'This document is not a production logic change and does not approve final engine accuracy.',
  'Actual output snapshot generation | Confirmed',
  'Snapshot runner script | Added',
  'Snapshot check script | Added',
  'Production engine logic change | Pending',
  'Engine accuracy approval | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'Today fortune sample output | Recorded',
  'Saju analysis sample output | Recorded',
  'Manseryeok sample output | Recorded',
  'Year/monthly fortune sample output | Recorded',
  'Zodiac fortune sample output | Recorded',
];

const requiredRelatedDocSnippets = [
  'Fortune engine sample snapshot result: Added',
  'Actual output snapshot generation: Confirmed',
  'Snapshot runner script: Added',
  'Snapshot check script: Added',
  'Production engine logic change: Pending',
  'Engine accuracy approval: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
];

const requiredRoadmapOnlySnippets = [
  'Today fortune engine improvement: Pending',
  'Year/monthly fortune engine improvement: Pending',
  'Zodiac fortune engine improvement: Pending',
];

const forbiddenSnippets = [
  'Production engine logic change: Confirmed',
  'Engine accuracy approval: Confirmed',
  'Today fortune engine improvement: Confirmed',
  'Year/monthly fortune engine improvement: Confirmed',
  'Zodiac fortune engine improvement: Confirmed',
  'schemaVersion changed',
  'CURRENT_FORTUNE_SCHEMA_VERSION changed',
  'birthTimeUnknown 사주 미상 sample',
  'present or 사주 미상 when birthTimeUnknown=true',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const protectedFiles = [
  'src',
  'public/privacy-policy.html',
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
];

const sensitivePatterns = [
  {
    label: 'email_like_value_absent',
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  },
  {
    label: 'secret_keyword_absent',
    pattern: /(?:GitHub Secret|ANDROID_KEYSTORE|KEY_PASSWORD|PASSWORD\s*=|BEGIN PRIVATE)/i,
  },
  {
    label: 'base64_like_long_value_absent',
    pattern: /[A-Za-z0-9+/]{120,}={0,2}/,
  },
  {
    label: 'artifact_or_keystore_extension_absent',
    pattern: /\.(?:aab|zip|jks|keystore)\b/i,
  },
  {
    label: 'wrong_unknown_hour_wording_absent',
    pattern: /사주 미상/,
  },
];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function labelFromSnippet(snippet) {
  return snippet
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\p{L}\p{N}_/-]/gu, '')
    .slice(0, 90);
}

function checkIncludes(sourceLabel, source, snippets) {
  let passedAll = true;

  for (const snippet of snippets) {
    const found = source.includes(snippet);
    logResult(`${sourceLabel}_includes_${labelFromSnippet(snippet)}`, found);
    if (!found) passedAll = false;
  }

  return passedAll;
}

function hasKeys(object, keys) {
  return keys.every((key) => Object.prototype.hasOwnProperty.call(object, key));
}

let hasFailure = false;

for (const path of [snapshotPath, resultDocPath, runnerPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const snapshotText = fs.readFileSync(snapshotPath, 'utf8');
let snapshot;

try {
  snapshot = JSON.parse(snapshotText);
  logResult('snapshot_json_parseable', true);
} catch (error) {
  logResult('snapshot_json_parseable', false, error.message);
  process.exit(1);
}

const scalarChecks = [
  ['snapshotVersion_is_expected', snapshot.snapshotVersion === 'fortune_engine_sample_snapshot_v1'],
  ['dateKey_is_expected', snapshot.dateKey === '2026-06-30'],
  ['targetYear_is_expected', snapshot.targetYear === 2026],
  ['source_is_artificial_sample_profiles_only', snapshot.source === 'artificial_sample_profiles_only'],
  ['productionLogicChanged_is_false', snapshot.productionLogicChanged === false],
  ['engineAccuracyApproval_is_pending', snapshot.engineAccuracyApproval === 'Pending'],
  ['samples_length_is_8', Array.isArray(snapshot.samples) && snapshot.samples.length === 8],
];

for (const [label, passed] of scalarChecks) {
  logResult(label, passed);
  if (!passed) hasFailure = true;
}

for (const sampleId of sampleIds) {
  const found = snapshot.samples?.some((sample) => sample.sampleId === sampleId);
  logResult(`sample_id_present_${sampleId}`, found);
  if (!found) hasFailure = true;
}

for (const sample of snapshot.samples || []) {
  const keysPresent = hasKeys(sample, requiredSampleKeys);
  logResult(`sample_keys_present_${sample.sampleId}`, keysPresent);
  if (!keysPresent) hasFailure = true;

  const todayCategoryIds = sample.todayFortuneSummary?.categoryIds || [];
  const requiredTodayCategoryIdsPresent = requiredCategoryIds.every((id) => todayCategoryIds.includes(id));
  logResult(`today_required_category_ids_present_${sample.sampleId}`, requiredTodayCategoryIdsPresent);
  if (!requiredTodayCategoryIdsPresent) hasFailure = true;

  const monthsCount = sample.yearFortuneSummary?.monthsCount ?? sample.yearFortuneSummary?.months?.length;
  const monthsCountIs12 = monthsCount === 12;
  logResult(`year_months_count_is_12_${sample.sampleId}`, monthsCountIs12);
  if (!monthsCountIs12) hasFailure = true;
}

for (const { label, pattern } of sensitivePatterns) {
  const absent = !pattern.test(snapshotText);
  logResult(`${label}_from_snapshot_json`, absent);
  if (!absent) hasFailure = true;
}

const resultDoc = fs.readFileSync(resultDocPath, 'utf8');
if (!checkIncludes('result_doc', resultDoc, requiredResultDocSnippets)) hasFailure = true;

for (const sampleId of sampleIds) {
  const snippet = `| ${sampleId} | Recorded |`;
  const found = resultDoc.includes(snippet);
  logResult(`result_doc_includes_recorded_${sampleId}`, found);
  if (!found) hasFailure = true;
}

for (const path of relatedDocs) {
  const source = fs.readFileSync(path, 'utf8');
  if (!checkIncludes(labelFromSnippet(path), source, requiredRelatedDocSnippets)) hasFailure = true;

  if (path === 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md') {
    if (!checkIncludes(labelFromSnippet(path), source, requiredRoadmapOnlySnippets)) hasFailure = true;
  }

  for (const snippet of forbiddenSnippets) {
    const absent = !source.includes(snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

for (const snippet of forbiddenSnippets) {
  const absent = !resultDoc.includes(snippet);
  logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_result_doc`, absent);
  if (!absent) hasFailure = true;
}

const packageJson = fs.readFileSync('package.json', 'utf8');
const runnerScriptRegistered = packageJson.includes(
  '"snapshot:fortune-engine-samples": "node scripts/runFortuneEngineSampleSnapshot.mjs"'
);
const checkScriptRegistered = packageJson.includes(
  '"check:fortune-engine-sample-snapshot": "node scripts/checkFortuneEngineSampleSnapshot.mjs"'
);
logResult('snapshot_runner_package_script_registered', runnerScriptRegistered);
logResult('snapshot_check_package_script_registered', checkScriptRegistered);
if (!runnerScriptRegistered || !checkScriptRegistered) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('production_privacy_and_android_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const statusFiles = execSync('git status --short --untracked-files=all', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));
const artifactFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  path.endsWith('.aab') || path.endsWith('.zip') || path.endsWith('.jks') || path.endsWith('.keystore')
);
const artifactFilesAbsent = artifactFiles.length === 0;
logResult('artifact_zip_and_keystore_files_not_added_to_repository', artifactFilesAbsent);
if (!artifactFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Fortune engine sample snapshot check failed');
  process.exit(1);
}

console.log('Fortune engine sample snapshot check passed');
