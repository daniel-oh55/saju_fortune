import fs from 'node:fs';
import { execSync } from 'node:child_process';

const appPath = 'src/App.jsx';
const detailPath = 'src/pages/FortuneDetailPage.jsx';
const packagePath = 'package.json';
const protectedFiles = [
  'docs/generated',
  'android',
  'public/privacy-policy.html',
  'src/domain',
  'src/utils/fortuneEngine.js',
  'src/domain/fortune/zodiacFortuneEngine.js',
];

const requiredAppSnippets = [
  'useRef',
  'detailReturnPageRef',
  'detailHistoryPushedRef',
  'handlePopState',
  "activePageRef.current === 'fortune'",
  "window.addEventListener('popstate', handlePopState)",
  "window.removeEventListener('popstate', handlePopState)",
  'window.history.pushState',
  'harupuliTodayFortuneDetail',
  'window.history.back()',
  'createAppHistoryState(\'fortune\', { [TODAY_FORTUNE_DETAIL_HISTORY_MARKER]: true })',
  'handleCloseFortuneDetail',
  'onClose={handleCloseFortuneDetail}',
];

const requiredDetailSnippets = [
  'onClose',
  'type="button"',
  'onClick={onClose}',
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

for (const path of [appPath, detailPath, packagePath]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const appSource = fs.readFileSync(appPath, 'utf8');
const detailSource = fs.readFileSync(detailPath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');

for (const snippet of requiredAppSnippets) {
  const found = appSource.includes(snippet);
  logResult(`app_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredDetailSnippets) {
  const found = detailSource.includes(snippet);
  logResult(`detail_page_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

const packageScriptRegistered = packageSource.includes(
  '"check:today-fortune-back-navigation": "node scripts/checkTodayFortuneBackNavigation.mjs"',
);
logResult('package_script_registered', packageScriptRegistered);
if (!packageScriptRegistered) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('engine_generated_privacy_android_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Today fortune back navigation check failed');
  process.exit(1);
}

console.log('Today fortune back navigation check passed');
