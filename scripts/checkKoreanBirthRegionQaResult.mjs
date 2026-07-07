import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/KOREAN_BIRTH_REGION_QA_RESULT.md';
const packagePath = 'package.json';

const requiredDocSnippets = [
  '# Korean Birth Region QA Result',
  'Android Debug Build #221',
  '`harupuli-debug-apk`',
  'Branch: `fix/complete-korean-birth-region-data`',
  'Related PR: #292',
  'Samsung Galaxy S23 Ultra',
  'One UI 8.0',
  'Android Debug APK',
  'user-confirmed real device test',
  '17 province/metropolitan-city options',
  'Seoul 25 districts',
  'Busan districts/count',
  '16개',
  'Daegu Gunwi-gun',
  '군위군',
  '9개',
  'Incheon key districts/count',
  '미추홀구',
  '강화군',
  '옹진군',
  '10개',
  'Sejong option',
  'Gyeonggi cities/count',
  '31개',
  'Gangwon cities/count',
  '18개',
  'Jeonbuk cities/count',
  '14개',
  'Jeju city options',
  '제주시',
  '서귀포시',
  'Save selected region',
  'Save selected region | Completed',
  'Persist selected region after app restart',
  'Persist selected region after app restart | Completed',
  'In-app top-left back button',
  'In-app top-left back button | Completed',
  'Home screen Android back exit',
  'Home screen Android back exit | Completed',
  'Additional issues',
  'Additional issues | Completed | 없음',
  'Overseas birth region input UI',
  'Overseas birth region input UI | Pending',
  '태양시 보정 적용 여부',
  '태양시 보정 적용 여부 | Pending',
  '음력/윤달 샘플 외부 검증',
  '음력/윤달 샘플 외부 검증 | Pending',
  'Full regression smoke QA | Pending',
  'Google Play Console input | Pending',
  'Release build | Pending',
  'signing setup | Pending',
  'AAB generation | Pending',
  'production fortune logic unchanged',
  'src unchanged',
  'src/utils/profileRegionMetaStorage.js unchanged',
  'generated JSON unchanged',
  'docs/generated unchanged',
  'schemaVersion unchanged',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  'existing localStorage keys unchanged',
  'no new localStorage key added',
  'profile storage object shape unchanged',
  'Android native source unchanged',
  'AndroidManifest.xml unchanged',
  'Gradle unchanged',
  'package-lock.json unchanged',
  'Capacitor dependencies unchanged',
];

const requiredTodoSnippets = [
  '## Korean birth region data TODO',
  '- [x] Re-test Korean birth region selection on Android device',
  '- [x] Confirm selected region save on Android device',
  '- [x] Confirm selected region persistence after app restart',
  '- [ ] Add overseas birth region input UI',
  '- [ ] Review 태양시 보정 적용 여부',
  '- [ ] Complete 음력/윤달 샘플 외부 검증',
  '- [x] Re-test in-app top-left back button after PR #289',
  '- [x] Re-test home screen exit behavior after PR #289',
  '- [ ] Full Android smoke QA after PR #289 remains Pending unless separately confirmed',
];

const requiredLogSnippets = [
  '## Korean Birth Region Data QA Result',
  'Android Debug Build #221 was tested on Samsung Galaxy S23 Ultra / One UI 8.0',
  'Korean 17 province/metropolitan-city selection was confirmed on device',
  'Seoul 25 district coverage was confirmed on device',
  'Busan, Daegu, Incheon, Sejong, Gyeonggi, Gangwon, Jeonbuk, and Jeju representative checks were confirmed on device',
  'Region save behavior was confirmed on device',
  'Region persistence after app restart was confirmed on device',
  'In-app top-left back button was confirmed on device',
  'Home screen Android back exit behavior was confirmed on device',
  'No additional issue was reported in this targeted QA',
  'Overseas birth region input UI remains Pending',
  '태양시 보정 적용 여부 remains Pending',
  '음력/윤달 샘플 외부 검증 remains Pending',
  'Full Android smoke QA remains Pending unless separately confirmed',
  'Production fortune logic unchanged',
  'src unchanged',
  'profileRegionMetaStorage.js unchanged',
  'Generated JSON unchanged',
  'docs/generated unchanged',
  'schemaVersion unchanged',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  'Existing localStorage keys unchanged',
  'Android/Gradle unchanged',
  'Release build/signing/AAB remain Pending',
];

const requiredChangelogSnippets = ['Recorded Android Debug Build #221 Korean birth region QA result'];

const forbiddenSnippets = [
  '태양시 보정 적용 여부 | Completed',
  '태양시 보정 적용 여부 | Confirmed',
  '태양시 보정 적용 여부: Completed',
  '태양시 보정 적용 여부: Confirmed',
  '음력/윤달 샘플 외부 검증 | Completed',
  '음력/윤달 샘플 외부 검증 | Confirmed',
  '음력/윤달 샘플 외부 검증: Completed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '양력/음력 샘플 추가 검증',
  'Full regression smoke QA | Completed',
  'Google Play Console input | Completed',
  'Release build | Completed',
  'AAB generation | Completed',
  '@capacitor/ios',
  'serviceWorker',
  'workbox',
];

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  docPath,
  packagePath,
  'scripts/checkAppWideBackNavigation.mjs',
  'scripts/checkBirthRegionExpansionPolicy.mjs',
  'scripts/checkFiveElementsGuidanceDeduplication.mjs',
  'scripts/checkKoreanBirthRegionData.mjs',
  'scripts/checkKoreanBirthRegionQaResult.mjs',
  'scripts/checkNativeAndroidBackButton.mjs',
  'scripts/checkNativeAndroidBackQaResult.mjs',
  'scripts/checkZodiacExplanationCardOrder.mjs',
]);

const protectedFiles = [
  'src',
  'docs/generated',
  'android',
  'public/privacy-policy.html',
  'package-lock.json',
];

function logResult(label, passed, detail = '') {
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${detail ? ` - ${detail}` : ''}`);
}

function labelFromSnippet(snippet) {
  return snippet
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\p{L}\p{N}_/-]/gu, '')
    .slice(0, 90);
}

function pathIsProtected(path) {
  return protectedFiles.some((protectedFile) => path === protectedFile || path.startsWith(`${protectedFile}/`));
}

let hasFailure = false;

for (const path of [docPath, packagePath, 'TODO.md', 'DEVELOPMENT_LOG.md', 'CHANGELOG.md']) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const todo = fs.readFileSync('TODO.md', 'utf8');
const developmentLog = fs.readFileSync('DEVELOPMENT_LOG.md', 'utf8');
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');

for (const snippet of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredTodoSnippets) {
  const found = todo.includes(snippet);
  logResult(`todo_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredLogSnippets) {
  const found = developmentLog.includes(snippet);
  logResult(`development_log_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredChangelogSnippets) {
  const found = changelog.includes(snippet);
  logResult(`changelog_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`forbidden_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const packageScriptRegistered = packageSource.includes(
  '"check:korean-birth-region-qa-result": "node scripts/checkKoreanBirthRegionQaResult.mjs"',
);
logResult('package_script_registered', packageScriptRegistered);
if (!packageScriptRegistered) hasFailure = true;

const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

for (const file of new Set(changedFiles)) {
  const allowed = allowedChangedFiles.has(file);
  logResult(`allowed_changed_file_${file}`, allowed);
  if (!allowed) hasFailure = true;
}

const protectedDiff = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = protectedDiff.length === 0;
logResult('src_generated_android_privacy_package_lock_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

const statusFiles = execSync('git status --short --untracked-files=all', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));
const protectedUntrackedFiles = statusFiles.filter((path) => pathIsProtected(path));
const protectedUntrackedFilesAbsent = protectedUntrackedFiles.length === 0;
logResult('protected_untracked_files_absent', protectedUntrackedFilesAbsent);
if (!protectedUntrackedFilesAbsent) hasFailure = true;

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const artifactFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  path.endsWith('.aab') || path.endsWith('.zip') || path.endsWith('.jks') || path.endsWith('.keystore')
);
const artifactFilesAbsent = artifactFiles.length === 0;
logResult('artifact_zip_and_keystore_files_not_added_to_repository', artifactFilesAbsent);
if (!artifactFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Korean birth region QA result check failed');
  process.exit(1);
}

console.log('Korean birth region QA result check passed');
