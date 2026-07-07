import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/BIRTH_REGION_EXPANSION_POLICY.md';
const packagePath = 'package.json';

const requiredDocSnippets = [
  '# Birth Region Expansion Policy',
  'Current implementation is localStorage-based',
  'No server DB',
  'No login',
  'No external geocoding API',
  'No analytics SDK',
  'Seoul district list was expanded to 25 districts in PR #285',
  'Other Korean regions still need expansion',
  'Overseas birth region selection policy is not implemented yet',
  'Actual production data update remains Pending',
  'Android QA for final region selection remains Pending',
  '대한민국',
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
  '시/군',
  '시/군/구',
  '제주시',
  '서귀포시',
  '해외',
  'direct input',
  '직접',
  '태양시 보정 적용 여부',
  '음력/윤달 샘플 외부 검증',
  'Pending',
  'src unchanged',
  'src/utils/profileRegionMetaStorage.js` unchanged',
  'production fortune logic unchanged',
  'generated JSON unchanged',
  'docs/generated unchanged',
  'schemaVersion unchanged',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  'existing localStorage keys unchanged',
  'no new localStorage key added',
  'profile storage object shape unchanged',
  'Android native source unchanged',
  'Gradle unchanged',
  'package-lock.json unchanged',
];

const requiredTodoSnippets = [
  '## Birth region expansion TODO',
  '- [x] Define nationwide birth region expansion policy',
  '- [x] Define overseas birth region selection policy',
  '- [ ] Add Korean nationwide city/district data',
  '- [ ] Add overseas birth region input UI',
  '- [ ] Re-test birth region selection on Android device',
  '- [ ] Review 태양시 보정 적용 여부',
  '- [ ] Complete 음력/윤달 샘플 외부 검증',
];

const requiredLogSnippets = [
  '## Birth Region Expansion Policy',
  'Defined policy for expanding birth region options beyond Seoul',
  'Documented Korean nationwide region selection strategy',
  'Documented overseas birth region selection strategy',
  'Kept 태양시 보정 적용 여부 as Pending',
  'Kept 음력/윤달 샘플 외부 검증 as Pending',
];

const requiredChangelogSnippets = [
  'Documented birth region expansion policy for Korean nationwide and overseas selections',
];

const forbiddenDocSnippets = [
  '태양시 보정 적용 여부 | Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  '음력/윤달 샘플 외부 검증 | Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '양력/음력 샘플 추가 검증',
  '태양시 보정 적용 여무',
  '@capacitor/ios',
  'serviceWorker',
  'workbox',
];

const protectedFiles = [
  'src',
  'docs/generated',
  'android',
  'public/privacy-policy.html',
  'package-lock.json',
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
  'scripts/checkNativeAndroidBackButton.mjs',
  'scripts/checkNativeAndroidBackQaResult.mjs',
  'scripts/checkZodiacExplanationCardOrder.mjs',
]);

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

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_forbidden_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const packageScriptRegistered = packageSource.includes(
  '"check:birth-region-expansion-policy": "node scripts/checkBirthRegionExpansionPolicy.mjs"',
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

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('src_generated_android_privacy_package_lock_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

const profileRegionMetaStorageUnchanged =
  execSync('git diff --name-only -- src/utils/profileRegionMetaStorage.js', { encoding: 'utf8' }).trim().length === 0;
logResult('profile_region_meta_storage_unchanged', profileRegionMetaStorageUnchanged);
if (!profileRegionMetaStorageUnchanged) hasFailure = true;

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
  console.error('Birth region expansion policy check failed');
  process.exit(1);
}

console.log('Birth region expansion policy check passed');
