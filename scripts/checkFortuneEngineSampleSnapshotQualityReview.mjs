import fs from 'node:fs';
import { execSync } from 'node:child_process';

const qualityReviewDocPath = 'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_QUALITY_REVIEW.md';
const snapshotPath = 'docs/generated/fortune-engine-sample-snapshot.json';
const relatedDocs = [
  'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_RESULT.md',
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

const requiredReviewSnippets = [
  '# Fortune Engine Sample Snapshot Quality Review',
  'This document is not a production logic change and does not approve final engine accuracy.',
  'Snapshot file | Confirmed | docs/generated/fortune-engine-sample-snapshot.json',
  'Snapshot version | Confirmed | fortune_engine_sample_snapshot_v1',
  'dateKey | Confirmed | 2026-06-30',
  'targetYear | Confirmed | 2026',
  'sample source | Confirmed | artificial_sample_profiles_only',
  'Snapshot output quality review | Added',
  'Actual output snapshot generation | Confirmed',
  'Production engine logic change | Pending',
  'Engine accuracy approval | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'Today fortune sample output | Reviewed',
  'Saju analysis sample output | Reviewed',
  'Manseryeok sample output | Reviewed',
  'Year/monthly fortune sample output | Reviewed',
  'Zodiac fortune sample output | Reviewed',
  'This review does not claim final engine accuracy.',
  'This review does not verify manseryeok results against an external reference.',
  'This review does not decide 태양시 보정 적용 여부.',
  'This PR does not regenerate the snapshot JSON.',
  'CURRENT_FORTUNE_SCHEMA_VERSION is not changed.',
  'schemaVersion is not changed.',
  'Existing localStorage keys are not changed.',
];

const requiredRelatedDocSnippets = [
  'Fortune engine sample snapshot quality review: Added',
  'Snapshot output quality review: Confirmed',
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
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
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

for (const path of [qualityReviewDocPath, snapshotPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const qualityReviewDoc = fs.readFileSync(qualityReviewDocPath, 'utf8');
const docsToScan = [{ path: qualityReviewDocPath, source: qualityReviewDoc }];

if (!checkIncludes('quality_review_doc', qualityReviewDoc, requiredReviewSnippets)) hasFailure = true;

for (const sampleId of sampleIds) {
  const snippet = `| ${sampleId} | Reviewed |`;
  const found = qualityReviewDoc.includes(snippet);
  logResult(`quality_review_doc_includes_reviewed_${sampleId}`, found);
  if (!found) hasFailure = true;
}

const snapshotText = fs.readFileSync(snapshotPath, 'utf8');
let snapshot;

try {
  snapshot = JSON.parse(snapshotText);
  logResult('snapshot_json_parseable', true);
} catch (error) {
  logResult('snapshot_json_parseable', false, error.message);
  process.exit(1);
}

const snapshotChecks = [
  ['snapshotVersion_is_expected', snapshot.snapshotVersion === 'fortune_engine_sample_snapshot_v1'],
  ['dateKey_is_expected', snapshot.dateKey === '2026-06-30'],
  ['targetYear_is_expected', snapshot.targetYear === 2026],
  ['source_is_artificial_sample_profiles_only', snapshot.source === 'artificial_sample_profiles_only'],
  ['productionLogicChanged_is_false', snapshot.productionLogicChanged === false],
  ['engineAccuracyApproval_is_pending', snapshot.engineAccuracyApproval === 'Pending'],
  ['samples_length_is_8', Array.isArray(snapshot.samples) && snapshot.samples.length === 8],
];

for (const [label, passed] of snapshotChecks) {
  logResult(label, passed);
  if (!passed) hasFailure = true;
}

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
    const absent = !source.includes(snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const packageJson = fs.readFileSync('package.json', 'utf8');
const scriptRegistered = packageJson.includes(
  '"check:fortune-engine-sample-snapshot-quality-review": "node scripts/checkFortuneEngineSampleSnapshotQualityReview.mjs"'
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
  console.error('Fortune engine sample snapshot quality review check failed');
  process.exit(1);
}

console.log('Fortune engine sample snapshot quality review check passed');
