import fs from 'node:fs';
import { execSync } from 'node:child_process';

const designDocPath = 'docs/TODAY_FORTUNE_SNAPSHOT_COMPARISON_CHECK_DESIGN.md';
const snapshotPath = 'docs/generated/fortune-engine-sample-snapshot.json';
const relatedDocs = [
  'docs/TODAY_FORTUNE_ENGINE_IMPLEMENTATION_PLAN.md',
  'docs/TODAY_FORTUNE_ENGINE_IMPROVEMENT_DESIGN.md',
  'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_QUALITY_REVIEW.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const requiredDesignSnippets = [
  '# Today Fortune Snapshot Comparison Check Design',
  'This document is not a production logic change and does not approve final engine accuracy.',
  'Today fortune snapshot comparison check design | Added',
  'Before/after snapshot comparison check | Pending',
  'Production today fortune engine improvement | Pending',
  'Production engine logic change | Pending',
  'Snapshot comparison after implementation | Pending',
  'CURRENT_FORTUNE_SCHEMA_VERSION decision | Pending',
  'Engine accuracy approval | Pending',
  'todayFortuneSummary categoryIds | overall, money, love, work, study, health preserved',
  'category ids changed | Not allowed',
  'year/monthly fortune output changed | Not allowed unless separately approved',
  'zodiac fortune output changed | Not allowed unless separately approved',
  'manseryeok output changed | Not allowed',
  'docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json',
  'scripts/checkTodayFortuneSnapshotComparison.mjs',
  'Existing snapshot JSON is not regenerated.',
];

const requiredRelatedDocSnippets = [
  'Today fortune snapshot comparison check design: Added',
  'Before/after snapshot comparison check: Pending',
  'Production today fortune engine improvement: Pending',
  'Production engine logic change: Pending',
  'Snapshot comparison after implementation: Pending',
  'CURRENT_FORTUNE_SCHEMA_VERSION decision: Pending',
  'Engine accuracy approval: Pending',
];

const requiredRoadmapOnlySnippets = [
  'Year/monthly fortune engine improvement: Pending',
  'Zodiac fortune engine improvement: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
];

const forbiddenSnippets = [
  'Before/after snapshot comparison check: Confirmed',
  'Production today fortune engine improvement: Confirmed',
  'Production engine logic change: Confirmed',
  'Snapshot comparison after implementation: Confirmed',
  'CURRENT_FORTUNE_SCHEMA_VERSION decision: Confirmed',
  'Engine accuracy approval: Confirmed',
  'schemaVersion changed',
  'CURRENT_FORTUNE_SCHEMA_VERSION changed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const protectedFiles = [
  'docs/generated/fortune-engine-sample-snapshot.json',
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

let hasFailure = false;

for (const path of [designDocPath, snapshotPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const designDoc = fs.readFileSync(designDocPath, 'utf8');
const docsToScan = [{ path: designDocPath, source: designDoc }];

if (!checkIncludes('design_doc', designDoc, requiredDesignSnippets)) hasFailure = true;

for (const path of relatedDocs) {
  const source = fs.readFileSync(path, 'utf8');
  docsToScan.push({ path, source });
  if (!checkIncludes(labelFromSnippet(path), source, requiredRelatedDocSnippets)) hasFailure = true;

  if (path === 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md') {
    if (!checkIncludes(labelFromSnippet(path), source, requiredRoadmapOnlySnippets)) hasFailure = true;
  }
}

for (const snippet of forbiddenSnippets) {
  for (const { path, source } of docsToScan) {
    if (snippet === 'schemaVersion changed' && path === designDocPath) continue;

    const absent = !source.includes(snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const packageJson = fs.readFileSync('package.json', 'utf8');
const scriptRegistered = packageJson.includes(
  '"check:today-fortune-snapshot-comparison-check-design": "node scripts/checkTodayFortuneSnapshotComparisonCheckDesign.mjs"'
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
  console.error('Today fortune snapshot comparison check design check failed');
  process.exit(1);
}

console.log('Today fortune snapshot comparison check design check passed');
