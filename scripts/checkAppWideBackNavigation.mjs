import fs from 'node:fs';
import { execSync } from 'node:child_process';

const appPath = 'src/App.jsx';
const packagePath = 'package.json';
const packageLockPath = 'package-lock.json';
const appSource = fs.readFileSync(appPath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');
const diffOutput = [
  execSync('git diff -- .', { encoding: 'utf8' }),
  execSync('git diff --cached -- .', { encoding: 'utf8' }),
].join('\n');
const guardedDiffOutput = [
  execSync(
    `git diff -- ${appPath} ${packagePath} ${packageLockPath} scripts/checkTodayFortuneBackNavigation.mjs scripts/checkNativeAndroidBackButton.mjs`,
    { encoding: 'utf8' },
  ),
  execSync(
    `git diff --cached -- ${appPath} ${packagePath} ${packageLockPath} scripts/checkTodayFortuneBackNavigation.mjs scripts/checkNativeAndroidBackButton.mjs`,
    {
      encoding: 'utf8',
    },
  ),
].join('\n');
const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  'docs/NATIVE_ANDROID_BACK_QA_RESULT.md',
  'package.json',
  'package-lock.json',
  'scripts/checkAppWideBackNavigation.mjs',
  'scripts/checkBrandCopyConsistency.mjs',
  'scripts/checkFiveElementsGuidanceDeduplication.mjs',
  'scripts/checkNativeAndroidBackButton.mjs',
  'scripts/checkNativeAndroidBackQaResult.mjs',
  'scripts/checkTodayFortuneBackNavigation.mjs',
  'scripts/checkZodiacExplanationCardOrder.mjs',
  'scripts/checkZodiacYearVariationOutputReview.mjs',
  appPath,
  'src/styles.css',
]);

const requiredAppSnippets = [
  "const APP_HISTORY_MARKER = 'harupuliAppHistory'",
  "const APP_HISTORY_PAGE_KEY = 'harupuliAppPage'",
  "const TODAY_FORTUNE_DETAIL_HISTORY_MARKER = 'harupuliTodayFortuneDetail'",
  'function createAppHistoryState(page, extraState = {})',
  'function isAppHistoryState(state)',
  'appHistoryInitializedRef',
  'window.history.replaceState(createAppHistoryState(activePageRef.current)',
  'window.history.pushState(nextState',
  'createAppHistoryState(\'fortune\', { [TODAY_FORTUNE_DETAIL_HISTORY_MARKER]: true })',
  'const handlePopState = (event) =>',
  "activePageRef.current === 'fortune' && detailHistoryPushedRef.current",
  'isAppHistoryState(nextState)',
  "activePageRef.current !== 'home'",
  'window.history.replaceState(createAppHistoryState(\'home\')',
  'const appPageStackRef = useRef([activePage])',
  'const handleAppBackRef = useRef(null)',
  'const handleAppBack = ({ allowExit = false } = {}) =>',
  "CapacitorApp.addListener('backButton'",
  'CapacitorApp.exitApp()',
  'const navigateToAppPage = (',
  'const handleNavigate = (page) =>',
  'scrollToPageTop()',
  'onClose={handleCloseFortuneDetail}',
];

const forbiddenPackageSnippets = [
  '"@capacitor/ios"',
  'serviceWorker',
  'workbox',
];

const forbiddenChangedPathSnippets = [
  'src/domain/',
  'docs/generated/',
  'android/',
  'public/privacy-policy.html',
  '.aab',
  '.zip',
  '.jks',
  '.keystore',
];

const forbiddenDiffSnippets = [
  'CURRENT_FORTUNE_SCHEMA_VERSION =',
  'schemaVersion:',
  'localStorage.setItem',
  'localStorage.getItem',
  'localStorage.removeItem',
];

let hasFailure = false;

function logResult(label, passed, detail = '') {
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${detail ? ` - ${detail}` : ''}`);
  if (!passed) hasFailure = true;
}

for (const path of [appPath, packagePath]) {
  logResult(`${path}_exists`, fs.existsSync(path));
}

for (const snippet of requiredAppSnippets) {
  logResult(`app_includes_${snippet.slice(0, 80).replaceAll(/\s+/g, '_')}`, appSource.includes(snippet));
}

for (const snippet of forbiddenPackageSnippets) {
  logResult(`package_excludes_${snippet}`, !packageSource.includes(snippet));
}

for (const file of new Set(changedFiles)) {
  logResult(`allowed_changed_file_${file}`, allowedChangedFiles.has(file));
}

for (const snippet of forbiddenChangedPathSnippets) {
  logResult(
    `changed_files_exclude_${snippet}`,
    changedFiles.every((file) => !file.includes(snippet)),
  );
}

for (const snippet of forbiddenDiffSnippets) {
  logResult(`diff_excludes_${snippet}`, !guardedDiffOutput.includes(snippet));
}

logResult(
  'package_script_registered',
  packageSource.includes('"check:app-wide-back-navigation": "node scripts/checkAppWideBackNavigation.mjs"'),
);

if (hasFailure) {
  console.error('App-wide back navigation check failed');
  process.exit(1);
}

console.log('App-wide back navigation check passed');
