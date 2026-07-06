import fs from 'node:fs';
import { execSync } from 'node:child_process';

const resultDocPath = 'docs/ANDROID_DEBUG_APK_QA_RESULT.md';
const checklistDocPath = 'docs/ANDROID_DEBUG_APK_QA_CHECKLIST.md';
const packagePath = 'package.json';
const protectedFiles = ['src', 'docs/generated', 'android', 'public/privacy-policy.html'];

const requiredResultDocSnippets = [
  '# Android Debug APK QA Result',
  'Artifact name: `harupuli-debug-apk`',
  'Workflow run number: `#210`',
  'Samsung Galaxy S23 Ultra',
  'One UI 8.0',
  'Test date | 2026-07-06',
  'APK download | Completed',
  'APK install | Completed',
  'App launch test | Completed',
  'Basic Android smoke QA | Completed with follow-up issues',
  'Google Play Console input | Pending',
  'release build | Pending',
  'signing setup | Pending',
  'AAB generation | Pending',
  'This result does not replace full release QA',
  'This result does not confirm Play Console readiness',
  'This result does not confirm release build readiness',
  'Update birth region district data',
  'Fix detail back navigation behavior',
  'Scroll to top on menu navigation',
  'Add morning/lunch/evening fortune section',
  'Add lightweight startup loading screen',
  'Prepare app icon assets in separate PR',
  'Deduplicate five elements guidance cards',
  'Add saved reading share flow',
  'Move zodiac explanation cards below zodiac cards',
  'production fortune logic unchanged',
  'zodiac fortune engine unchanged',
  'src production UI unchanged',
  'generated JSON unchanged',
  'docs/generated unchanged',
  'schemaVersion unchanged',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  'existing localStorage keys unchanged',
  'no new localStorage key added',
  'routing unchanged',
  'privacy files unchanged',
  'Android/Gradle unchanged',
];

const requiredChecklistDocSnippets = [
  'APK download | Completed',
  'APK install | Completed',
  'App launch test | Completed',
  'Android device QA | Completed with follow-up issues',
  'Home screen QA | Completed with follow-up issues',
  'Zodiac fortune QA | Completed with follow-up issues',
  'My info QA | Completed with follow-up issues',
  'Quick menu customization QA | Completed with follow-up issues',
  'Google Play Console input | Pending',
  'release build | Pending',
  'signing setup | Pending',
  'AAB generation | Pending',
];

const forbiddenResultDocSnippets = [
  'Google Play Console input | Completed',
  'release build | Completed',
  'signing setup | Completed',
  'AAB generation | Completed',
  'Full release QA | Completed',
  'Play Console readiness | Completed',
  'release build readiness | Completed',
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

function pathIsProtected(path) {
  return protectedFiles.some((protectedFile) => path === protectedFile || path.startsWith(`${protectedFile}/`));
}

let hasFailure = false;

for (const path of [resultDocPath, checklistDocPath, packagePath]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const resultDoc = fs.readFileSync(resultDocPath, 'utf8');
const checklistDoc = fs.readFileSync(checklistDocPath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');

for (const snippet of requiredResultDocSnippets) {
  const found = resultDoc.includes(snippet);
  logResult(`qa_result_doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredChecklistDocSnippets) {
  const found = checklistDoc.includes(snippet);
  logResult(`qa_checklist_doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenResultDocSnippets) {
  const absent = !resultDoc.includes(snippet);
  logResult(`qa_result_doc_forbidden_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const packageScriptRegistered = packageSource.includes(
  '"check:android-debug-apk-qa-result": "node scripts/checkAndroidDebugApkQaResult.mjs"',
);
logResult('package_script_registered', packageScriptRegistered);
if (!packageScriptRegistered) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('src_generated_privacy_android_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Android Debug APK QA result check failed');
  process.exit(1);
}

console.log('Android Debug APK QA result check passed');
