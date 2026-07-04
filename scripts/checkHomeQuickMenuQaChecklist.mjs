import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/HOME_QUICK_MENU_QA_CHECKLIST.md';
const packagePath = 'package.json';
const protectedFiles = [
  'src',
  'docs/generated',
  'public/privacy-policy.html',
  'android/app/build.gradle',
  'android/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
];

const requiredDocSnippets = [
  '# Home Quick Menu QA Checklist',
  'Review target: home quick menu customization after PR #279',
  'Storage key: `harupuli_home_quick_menu_prefs`',
  'This document is a QA checklist only',
  'This document does not confirm actual Android device QA',
  'This document does not confirm APK download, APK install, or app launch',
  'This document does not change production logic',
  'Maximum 4 menu selection | Ready for QA',
  'Minimum 1 menu retained | Ready for QA',
  'localStorage restore after reload | Ready for QA',
  'Invalid saved value fallback | Ready for QA',
  'Android device QA | Pending',
  'APK download | Pending',
  'APK install | Pending',
  'App launch test | Pending',
  'Google Play Console input | Pending',
  'release build | Pending',
  'signing setup | Pending',
  'AAB generation | Pending',
  'Open home screen',
  'Tap quick menu edit button',
  'Confirm quick menu editor opens',
  'Select up to 4 menu items',
  'Confirm a 5th item cannot be selected or shows a clear limit message',
  'Confirm at least 1 item remains selected',
  'Confirm selected quick menu items are restored from localStorage',
  'Manually corrupt `harupuli_home_quick_menu_prefs`',
  'Confirm fallback to default quick menu',
  'Stored value shape: JSON array of quick menu ids',
  'Maximum length: 4',
  'Minimum effective length: 1',
  'Invalid ids should be ignored',
  'Invalid JSON should fallback to default quick menu',
  'This storage is independent from profile/fortune storage',
  'No schemaVersion migration is required',
  'production fortune logic unchanged',
  'zodiac fortune engine unchanged',
  'generated JSON unchanged',
  'docs/generated unchanged',
  'schemaVersion unchanged',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  'existing localStorage keys unchanged',
  'no new localStorage key added in this PR',
  'routing unchanged',
  'privacy files unchanged',
  'Android/Gradle unchanged',
];

const forbiddenDocSnippets = [
  'Android device QA | Completed',
  'APK download | Completed',
  'APK install | Completed',
  'App launch test | Completed',
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
  '"check:home-quick-menu-qa-checklist": "node scripts/checkHomeQuickMenuQaChecklist.mjs"',
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
  console.error('Home quick menu QA checklist check failed');
  process.exit(1);
}

console.log('Home quick menu QA checklist check passed');
