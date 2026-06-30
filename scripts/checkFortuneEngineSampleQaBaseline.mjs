import fs from 'node:fs';
import { execSync } from 'node:child_process';

const baselineDocPath = 'docs/FORTUNE_ENGINE_SAMPLE_QA_BASELINE.md';
const auditDocPath = 'docs/FORTUNE_ENGINE_CURRENT_STATE_AUDIT.md';
const roadmapDocPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredBaselineSnippets = [
  '# Fortune Engine Sample QA Baseline',
  'This document is not a production logic change and does not record final engine accuracy approval.',
  'Today fortune sample QA baseline | Added',
  'Saju analysis sample QA baseline | Added',
  'Manseryeok sample QA baseline | Added',
  'Year/monthly fortune sample QA baseline | Added',
  'Zodiac fortune sample QA baseline | Added',
  'Production engine logic change | Pending',
  'Engine accuracy approval | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'solar-known-time-01',
  'solar-unknown-time-01',
  'solar-late-night-same-day-01',
  'solar-late-night-next-day-01',
  'lunar-non-leap-01',
  'lunar-leap-01',
  'term-boundary-01',
  'profile-zodiac-boundary-01',
  'overall, money, love, work, study, health',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  '23시 이후 자시 기준 requires same_day and next_day sample comparison.',
  'target year ganji relationship | Pending design',
  'monthly ganji flow | Pending design',
  'saju year pillar vs birth-year explanation | Pending refinement',
  'Actual output snapshot generation',
  'This PR defines sample QA baselines only.',
  'Today fortune output logic is not changed.',
  'Manseryeok logic is not changed.',
  'Year/monthly fortune logic is not changed.',
  'Zodiac fortune logic is not changed.',
  'schemaVersion is not changed.',
  'Existing localStorage keys are not changed.',
  'UI/design is not changed.',
];

const requiredAuditSnippets = [
  'Fortune engine sample QA baseline: Added',
  'Actual output snapshot generation: Pending',
  'Production engine logic change: Pending',
  'Engine accuracy approval: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
];

const requiredRoadmapSnippets = [
  'Fortune engine sample QA baseline: Added',
  'Actual output snapshot generation: Pending',
  'Production engine logic change: Pending',
  'Engine accuracy approval: Pending',
];

const forbiddenSnippets = [
  'Production engine logic change: Confirmed',
  'Engine accuracy approval: Confirmed',
  'Actual output snapshot generation: Confirmed',
  'Today fortune engine improvement: Confirmed',
  'Year/monthly fortune engine improvement: Confirmed',
  'Zodiac fortune engine improvement: Confirmed',
  'schemaVersion changed',
  'CURRENT_FORTUNE_SCHEMA_VERSION changed',
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

for (const path of [baselineDocPath, auditDocPath, roadmapDocPath]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const baselineDoc = fs.readFileSync(baselineDocPath, 'utf8');
const auditDoc = fs.readFileSync(auditDocPath, 'utf8');
const roadmapDoc = fs.readFileSync(roadmapDocPath, 'utf8');
const docsToScan = [
  { path: baselineDocPath, source: baselineDoc },
  { path: auditDocPath, source: auditDoc },
  { path: roadmapDocPath, source: roadmapDoc },
];

if (!checkIncludes('baseline_doc', baselineDoc, requiredBaselineSnippets)) hasFailure = true;
if (!checkIncludes('audit_doc', auditDoc, requiredAuditSnippets)) hasFailure = true;
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
  '"check:fortune-engine-sample-qa-baseline": "node scripts/checkFortuneEngineSampleQaBaseline.mjs"'
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
  console.error('Fortune engine sample QA baseline check failed');
  process.exit(1);
}

console.log('Fortune engine sample QA baseline check passed');
