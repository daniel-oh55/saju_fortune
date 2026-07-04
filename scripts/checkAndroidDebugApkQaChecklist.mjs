import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_DEBUG_APK_QA_CHECKLIST.md';
const packagePath = 'package.json';
const protectedFiles = ['src', 'docs/generated', 'android', 'public/privacy-policy.html'];

const requiredDocSnippets = [
  '# Android Debug APK QA Checklist',
  'Review target: Android Debug APK manual QA preparation',
  'Build type: debug APK artifact from GitHub Actions',
  'This document is a QA checklist only',
  'This document does not confirm actual APK download',
  'This document does not confirm actual APK install',
  'This document does not confirm actual app launch',
  'This document does not confirm Android device QA',
  'This document does not confirm Google Play Console input',
  'This document does not confirm release build',
  'This document does not confirm signing setup',
  'This document does not confirm AAB generation',
  'This document does not change production logic',
  'Android Debug Build workflow | Ready for QA',
  'Debug APK artifact | Ready for QA',
  'APK download | Pending',
  'APK install | Pending',
  'App launch test | Pending',
  'Android device QA | Pending',
  'Home screen QA | Pending',
  'Today flow QA | Pending',
  'Zodiac fortune QA | Pending',
  'My info QA | Pending',
  'Quick menu customization QA | Pending',
  'Google Play Console input | Pending',
  'release build | Pending',
  'signing setup | Pending',
  'AAB generation | Pending',
  'Download latest `harupuli-debug-apk` artifact from GitHub Actions',
  'Extract APK from artifact zip',
  'Install APK on Android test device',
  'Launch app successfully',
  'Confirm app does not crash on first launch',
  'Confirm home screen renders correctly',
  'Confirm bottom navigation works',
  'Confirm quick menu customization works',
  'Confirm quick menu localStorage restore works after app restart',
  'Confirm share/save related UI does not crash',
  'Confirm no unexpected permission prompt appears',
  'Confirm no login/payment/ad SDK flow appears',
  'Confirm existing profile/fortune localStorage data is preserved',
  'Confirm `harupuli_home_quick_menu_prefs` is independent from profile/fortune storage',
  'Confirm invalid quick menu saved value falls back safely',
  'Confirm app works after clearing app data',
  'Confirm no schemaVersion migration is triggered by quick menu settings',
  'production fortune logic unchanged',
  'zodiac fortune engine unchanged',
  'src production UI unchanged',
  'generated JSON unchanged',
  'docs/generated unchanged',
  'schemaVersion unchanged',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  'existing localStorage keys unchanged',
  'routing unchanged',
  'privacy files unchanged',
  'Android/Gradle unchanged',
  'release build not added',
  'signing setup not added',
  'AAB not generated',
];

const forbiddenDocSnippets = [
  'APK download | Completed',
  'APK install | Completed',
  'App launch test | Completed',
  'Android device QA | Completed',
  'Google Play Console input | Completed',
  'release build | Completed',
  'signing setup | Completed',
  'AAB generation | Completed',
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

for (const path of [docPath, packagePath]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');

for (const snippet of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(`qa_doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`qa_doc_forbidden_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const packageScriptRegistered = packageSource.includes(
  '"check:android-debug-apk-qa-checklist": "node scripts/checkAndroidDebugApkQaChecklist.mjs"',
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
  console.error('Android Debug APK QA checklist check failed');
  process.exit(1);
}

console.log('Android Debug APK QA checklist check passed');
