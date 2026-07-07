import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/NATIVE_ANDROID_BACK_QA_RESULT.md';
const packagePath = 'package.json';

const requiredDocSnippets = [
  '# Native Android Back Button QA Result',
  'Android Debug Build #218',
  '`harupuli-debug-apk`',
  'Branch: `fix/native-android-back-button`',
  'Related PR: #289',
  'Samsung Galaxy S23 Ultra',
  'One UI 8.0',
  'Android Debug APK',
  'user-confirmed real device test',
  'Native Android system back',
  'Native Android system back | Completed',
  'App exits unexpectedly on non-home screens | Resolved',
  'In-app top-left back button | Pending',
  'Home screen exit behavior | Pending',
  'Full regression smoke QA after #289 | Pending',
  'Release build | Pending',
  'AAB generation | Pending',
  'production fortune logic unchanged',
  'generated JSON unchanged',
  'docs/generated unchanged',
  'schemaVersion unchanged',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  'existing localStorage keys unchanged',
  'Android native source unchanged',
  'AndroidManifest.xml unchanged',
  'Gradle unchanged',
  'package-lock.json unchanged',
  'Capacitor dependencies unchanged',
];

const requiredTodoSnippets = [
  '- [x] Re-test native Android system back button after PR #289',
  '- [x] Native Android system back confirmed on Android Debug Build #218',
  '- [ ] Re-test in-app top-left back button after PR #289',
  '- [ ] Re-test home screen exit behavior after PR #289',
  '- [ ] Record full Android smoke QA after PR #289 if needed',
];

const requiredLogSnippets = [
  '## Native Android Back Button QA Result',
  'Android Debug Build #218 was tested on Samsung Galaxy S23 Ultra / One UI 8.0',
  'Native Android system back behavior was confirmed as working on device',
  'In-app top-left back button confirmation remains Pending',
  'Home screen exit behavior confirmation remains Pending',
];

const requiredChangelogSnippets = [
  'Recorded Android Debug Build #218 native back button QA result',
];

const forbiddenDocSnippets = [
  'In-app top-left back button | Completed',
  'Home screen exit behavior | Completed',
  'Full regression smoke QA after #289 | Completed',
  'Release build | Completed',
  'AAB generation | Completed',
  'signing setup | Completed',
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
  '"check:native-android-back-qa-result": "node scripts/checkNativeAndroidBackQaResult.mjs"',
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
  console.error('Native Android back QA result check failed');
  process.exit(1);
}

console.log('Native Android back QA result check passed');
