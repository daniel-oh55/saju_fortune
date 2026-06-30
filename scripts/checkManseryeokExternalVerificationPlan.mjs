import fs from 'node:fs';
import { execSync } from 'node:child_process';

const planDocPath = 'docs/MANSERYEOK_EXTERNAL_VERIFICATION_PLAN.md';
const snapshotPath = 'docs/generated/fortune-engine-sample-snapshot.json';
const relatedDocs = [
  'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_QUALITY_REVIEW.md',
  'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_RESULT.md',
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

const requiredPlanSnippets = [
  '# Manseryeok External Verification Plan',
  'This document is not external verification completion and does not approve final engine accuracy.',
  'Manseryeok external verification plan | Added',
  'Actual external reference comparison | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'Engine accuracy approval | Pending',
  'Production engine logic change | Pending',
  'Engine version | Existing | manseryeok_core_v0',
  'Library basis | Existing | lunar-javascript',
  'Snapshot file | Existing | docs/generated/fortune-engine-sample-snapshot.json',
  '태양시 보정 | Not applied',
  '23시 이후 자시 기준 | Policy-based',
  'convertedSolar | Pending',
  'convertedLunar | Pending',
  'year pillar | Pending',
  'month pillar | Pending',
  'day pillar | Pending',
  'hour pillar | Pending',
  'External manseryeok reference 1 | Pending',
  'External manseryeok reference 2 | Pending',
  'This PR defines the manseryeok external verification plan only.',
  'This PR is not external verification completion.',
  'This PR is not final engine accuracy approval.',
  'Snapshot JSON is not regenerated.',
  'CURRENT_FORTUNE_SCHEMA_VERSION is not changed.',
  'schemaVersion is not changed.',
  'Existing localStorage keys are not changed.',
];

const requiredRelatedDocSnippets = [
  'Manseryeok external verification plan: Added',
  'Actual external reference comparison: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Engine accuracy approval: Pending',
  'Production engine logic change: Pending',
];

const requiredRoadmapOnlySnippets = [
  'Today fortune engine improvement: Pending',
  'Year/monthly fortune engine improvement: Pending',
  'Zodiac fortune engine improvement: Pending',
];

const forbiddenSnippets = [
  'Actual external reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  'Engine accuracy approval: Confirmed',
  'Production engine logic change: Confirmed',
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

for (const path of [planDocPath, snapshotPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const planDoc = fs.readFileSync(planDocPath, 'utf8');
const docsToScan = [{ path: planDocPath, source: planDoc }];

if (!checkIncludes('plan_doc', planDoc, requiredPlanSnippets)) hasFailure = true;

for (const sampleId of sampleIds) {
  const found = planDoc.includes(sampleId);
  logResult(`plan_doc_includes_${sampleId}`, found);
  if (!found) hasFailure = true;
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
  '"check:manseryeok-external-verification-plan": "node scripts/checkManseryeokExternalVerificationPlan.mjs"'
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
  console.error('Manseryeok external verification plan check failed');
  process.exit(1);
}

console.log('Manseryeok external verification plan check passed');
