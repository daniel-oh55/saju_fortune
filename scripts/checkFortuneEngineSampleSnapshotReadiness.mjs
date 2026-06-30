import fs from 'node:fs';
import { execSync } from 'node:child_process';

const snapshotReadinessDocPath = 'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_READINESS.md';
const baselineDocPath = 'docs/FORTUNE_ENGINE_SAMPLE_QA_BASELINE.md';
const auditDocPath = 'docs/FORTUNE_ENGINE_CURRENT_STATE_AUDIT.md';
const roadmapDocPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredSnapshotReadinessSnippets = [
  '# Fortune Engine Sample Snapshot Readiness',
  'This document is not a production logic change and does not approve final engine accuracy.',
  'Fortune engine current state audit | Confirmed',
  'Fortune engine sample QA baseline | Confirmed',
  'Sample output snapshot readiness | Added',
  'Actual output snapshot generation | Pending',
  'Production engine logic change | Pending',
  'Engine accuracy approval | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'createTodayFortune sample output',
  'createSajuAnalysis sample output',
  'calculateManseryeok sample output',
  'createYearFortune 2026 sample output',
  'createZodiacFortune sample output',
  'solar-known-time-01',
  'solar-unknown-time-01',
  'birthTimeUnknown 시주 미상 sample',
  'dateKey | 2026-06-30',
  'targetYear | 2026',
  'Snapshot data must use only artificial sample profiles.',
  'Snapshot generation must not change production engine logic.',
  'CURRENT_FORTUNE_SCHEMA_VERSION is not changed.',
  'schemaVersion is not changed.',
  'Existing localStorage keys are not changed.',
  'This PR prepares sample snapshot generation only.',
  'This PR is not final engine accuracy approval.',
];

const requiredBaselineSnippets = [
  'birthTimeUnknown 시주 미상 sample',
  'present or 시주 미상 when birthTimeUnknown=true',
  'Fortune engine sample snapshot readiness: Added',
  'Actual output snapshot generation: Pending',
  'Production engine logic change: Pending',
  'Engine accuracy approval: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
];

const requiredRelatedDocSnippets = [
  'Fortune engine sample snapshot readiness: Added',
  'Actual output snapshot generation: Pending',
  'Production engine logic change: Pending',
  'Engine accuracy approval: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
];

const requiredRoadmapSnippets = [
  ...requiredRelatedDocSnippets,
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

for (const path of [snapshotReadinessDocPath, baselineDocPath, auditDocPath, roadmapDocPath]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const snapshotReadinessDoc = fs.readFileSync(snapshotReadinessDocPath, 'utf8');
const baselineDoc = fs.readFileSync(baselineDocPath, 'utf8');
const auditDoc = fs.readFileSync(auditDocPath, 'utf8');
const roadmapDoc = fs.readFileSync(roadmapDocPath, 'utf8');
const docsToScan = [
  { path: snapshotReadinessDocPath, source: snapshotReadinessDoc },
  { path: baselineDocPath, source: baselineDoc },
  { path: auditDocPath, source: auditDoc },
  { path: roadmapDocPath, source: roadmapDoc },
];

if (!checkIncludes('snapshot_readiness_doc', snapshotReadinessDoc, requiredSnapshotReadinessSnippets)) {
  hasFailure = true;
}

if (!checkIncludes('baseline_doc', baselineDoc, requiredBaselineSnippets)) hasFailure = true;
if (!checkIncludes('audit_doc', auditDoc, requiredRelatedDocSnippets)) hasFailure = true;
if (!checkIncludes('roadmap_doc', roadmapDoc, requiredRoadmapSnippets)) hasFailure = true;

for (const snippet of forbiddenSnippets) {
  for (const { path, source } of docsToScan) {
    const absent = !source.includes(snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const packageJson = fs.readFileSync('package.json', 'utf8');
const scriptRegistered = packageJson.includes(
  '"check:fortune-engine-sample-snapshot-readiness": "node scripts/checkFortuneEngineSampleSnapshotReadiness.mjs"'
);
logResult('package_script_registered', scriptRegistered);
if (!scriptRegistered) hasFailure = true;

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
  console.error('Fortune engine sample snapshot readiness check failed');
  process.exit(1);
}

console.log('Fortune engine sample snapshot readiness check passed');
