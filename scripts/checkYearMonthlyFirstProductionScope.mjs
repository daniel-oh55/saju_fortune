import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/YEAR_MONTHLY_FIRST_PRODUCTION_SCOPE.md';
const relatedDocs = [
  'docs/YEAR_MONTHLY_SNAPSHOT_COMPARISON_CHECK_DESIGN.md',
  'docs/YEAR_MONTHLY_FORTUNE_IMPLEMENTATION_PLAN.md',
  'docs/YEAR_MONTHLY_FORTUNE_ENGINE_IMPROVEMENT_DESIGN.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
  'docs/FORTUNE_ENGINE_CURRENT_STATE_AUDIT.md',
  'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_QUALITY_REVIEW.md',
];
const requiredDocSnippets = [
  '# Year Monthly First Production Scope',
  'This document is not a production logic change and does not approve final engine accuracy.',
  'Year/monthly first production scope | Added',
  'Year/monthly fortune engine improvement | Pending',
  'Production engine logic change | Pending',
  'Snapshot comparison for year/monthly improvement | Pending',
  'Engine accuracy approval | Pending',
  'External reference comparison | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'Target file | src/domain/fortune/yearFortuneEngine.js',
  'Primary change | add small annual/monthly score and text composition adjustment',
  'Monthly entries | preserve 12 monthly entries',
  'Today fortune output | no change',
  'Zodiac fortune output | no change',
  'Manseryeok output | no change',
  'CURRENT_FORTUNE_SCHEMA_VERSION change | Not planned',
  'schemaVersion change | Not planned',
  'Use practical baseline snapshot | Required',
  'Compare today fortune output | Required',
  'Compare year/monthly output | Required',
  'Review monthly entries count | Required',
  'This PR defines first year/monthly production change scope only.',
  'Year/monthly fortune output logic is not changed.',
  'Snapshot JSON files are not regenerated.',
];
const requiredRelatedDocSnippets = [
  'Year/monthly first production scope: Added',
  'Year/monthly fortune engine improvement: Pending',
  'Production engine logic change: Pending',
  'Snapshot comparison for year/monthly improvement: Pending',
  'Engine accuracy approval: Pending',
  'External reference comparison: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Today fortune first production improvement: Reviewed',
  'Zodiac fortune engine improvement: Pending',
];
const forbiddenSnippets = [
  'Year/monthly fortune engine improvement: Confirmed',
  'Production engine logic change: Confirmed',
  'Snapshot comparison for year/monthly improvement: Confirmed',
  'Engine accuracy approval: Confirmed',
  'External reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  'Zodiac fortune engine improvement: Confirmed',
  'CURRENT_FORTUNE_SCHEMA_VERSION changed',
  'schemaVersion changed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];
const protectedFiles = [
  'src',
  'docs/generated/fortune-engine-sample-snapshot.json',
  'docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json',
  'docs/generated/today-fortune-snapshot-comparison-result.json',
  'public/privacy-policy.html',
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
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

function isForbiddenAbsent(source, snippet) {
  if (
    (snippet === 'CURRENT_FORTUNE_SCHEMA_VERSION changed' || snippet === 'schemaVersion changed') &&
    source.includes(`${snippet} | Not planned`)
  ) {
    return true;
  }

  return !source.includes(snippet);
}

let hasFailure = false;

for (const path of [docPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const docsToScan = [{ path: docPath, source: doc }];

if (!checkIncludes('year_monthly_first_production_scope_doc', doc, requiredDocSnippets)) {
  hasFailure = true;
}

for (const path of relatedDocs) {
  const source = fs.readFileSync(path, 'utf8');
  docsToScan.push({ path, source });
  if (!checkIncludes(labelFromSnippet(path), source, requiredRelatedDocSnippets)) hasFailure = true;
}

for (const snippet of forbiddenSnippets) {
  for (const { path, source } of docsToScan) {
    const absent = isForbiddenAbsent(source, snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const packageJson = fs.readFileSync('package.json', 'utf8');
const scriptRegistered = packageJson.includes(
  '"check:year-monthly-first-production-scope": "node scripts/checkYearMonthlyFirstProductionScope.mjs"'
);
logResult('package_script_registered', scriptRegistered);
if (!scriptRegistered) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('production_snapshot_privacy_and_android_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Year/monthly first production scope check failed');
  process.exit(1);
}

console.log('Year/monthly first production scope check passed');
