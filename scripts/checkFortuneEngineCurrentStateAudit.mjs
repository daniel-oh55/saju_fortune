import fs from 'node:fs';
import { execSync } from 'node:child_process';

const auditDocPath = 'docs/FORTUNE_ENGINE_CURRENT_STATE_AUDIT.md';
const roadmapDocPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredAuditSnippets = [
  '# Fortune Engine Current State Audit',
  'This document is not a production logic change.',
  'Today fortune engine | Existing',
  'Saju analysis engine | Existing',
  'Manseryeok engine | Existing',
  'Element analyzer | Existing',
  'Year fortune engine | Existing',
  'Zodiac fortune engine | Existing',
  'createTodayFortune uses profile, dateKey, and sajuAnalysis.',
  'CURRENT_FORTUNE_SCHEMA_VERSION is not changed in this PR.',
  'Manseryeok failure can return mock fallback analysis.',
  '태양시 보정 적용 여부 remains a future review item.',
  '음력/윤달 샘플 외부 검증 remains a future review item.',
  'Hidden stems are not included in the current element distribution.',
  'createYearFortune currently uses profile.id, targetYear, and sajuAnalysis dominant element as seed basis.',
  'Zodiac page prioritizes the saju year pillar branch when available.',
  'Production fortune engine change',
  'schemaVersion is not changed.',
  'Existing localStorage keys are not changed.',
  'UI/design is not changed.',
  'AndroidManifest.xml, Android resource files, and Gradle settings are not changed.',
];

const requiredRoadmapSnippets = [
  'Fortune engine current state audit: Added',
  'Production engine logic change: Pending',
  'Today fortune engine improvement: Pending',
  'Year/monthly fortune engine improvement: Pending',
  'Zodiac fortune engine improvement: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
];

const forbiddenSnippets = [
  'Production engine logic change: Confirmed',
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

const auditDocExists = fs.existsSync(auditDocPath);
logResult('fortune_engine_current_state_audit_doc_exists', auditDocExists, auditDocPath);
if (!auditDocExists) process.exit(1);

const roadmapDocExists = fs.existsSync(roadmapDocPath);
logResult('saju_engine_accuracy_roadmap_doc_exists', roadmapDocExists, roadmapDocPath);
if (!roadmapDocExists) process.exit(1);

const auditDoc = fs.readFileSync(auditDocPath, 'utf8');
const roadmapDoc = fs.readFileSync(roadmapDocPath, 'utf8');
const docsToScan = [
  { path: auditDocPath, source: auditDoc },
  { path: roadmapDocPath, source: roadmapDoc },
];

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
  '"check:fortune-engine-current-state-audit": "node scripts/checkFortuneEngineCurrentStateAudit.mjs"'
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
  console.error('Fortune engine current state audit check failed');
  process.exit(1);
}

console.log('Fortune engine current state audit check passed');
