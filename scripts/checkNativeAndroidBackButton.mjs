import fs from 'node:fs';
import { execSync } from 'node:child_process';

const appPath = 'src/App.jsx';
const stylesPath = 'src/styles.css';
const packagePath = 'package.json';
const packageLockPath = 'package-lock.json';

const appSource = fs.readFileSync(appPath, 'utf8');
const stylesSource = fs.readFileSync(stylesPath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');
const packageLockSource = fs.readFileSync(packageLockPath, 'utf8');

const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  packagePath,
  packageLockPath,
  'scripts/checkBrandCopyConsistency.mjs',
  'scripts/checkAppWideBackNavigation.mjs',
  'scripts/checkFiveElementsGuidanceDeduplication.mjs',
  'scripts/checkNativeAndroidBackButton.mjs',
  'scripts/checkTodayFortuneBackNavigation.mjs',
  'scripts/checkZodiacYearVariationOutputReview.mjs',
  'scripts/checkZodiacExplanationCardOrder.mjs',
  appPath,
  stylesPath,
]);

const requiredAppSnippets = [
  "import { App as CapacitorApp } from '@capacitor/app'",
  "import { Capacitor } from '@capacitor/core'",
  'const appPageStackRef = useRef([activePage])',
  'const handleAppBackRef = useRef(null)',
  'const handleAppBack = ({ allowExit = false } = {}) =>',
  "currentPage === 'fortune' && detailHistoryPushedRef.current",
  'Capacitor.isNativePlatform()',
  "CapacitorApp.addListener('backButton'",
  'handleAppBackRef.current?.({ allowExit: true })',
  'CapacitorApp.exitApp()',
  "activePage !== 'home' && activePage !== 'onboarding'",
  'aria-label="이전 화면으로 돌아가기"',
  'onClick={() => handleAppBack()}',
  'handleCloseFortuneDetail',
  'onClose={handleCloseFortuneDetail}',
  'scrollToPageTop()',
];

const requiredStyleSnippets = [
  '.app-back-button',
  'width: 42px',
  'height: 42px',
  'border-radius: 999px',
  ':focus-visible',
];

const forbiddenPackageSnippets = [
  '"@capacitor/ios"',
  '"lucide-react"',
  '"react-icons"',
  'serviceWorker',
  'workbox',
];

const forbiddenChangedPathSnippets = [
  'android/',
  'docs/generated/',
  'public/privacy-policy.html',
  'src/domain/',
  'src/utils/fortuneEngine.js',
  '.aab',
  '.zip',
  '.jks',
  '.keystore',
];

const guardedDiffOutput = [
  execSync(`git diff -- ${appPath} ${stylesPath} ${packagePath} ${packageLockPath}`, { encoding: 'utf8' }),
  execSync(`git diff --cached -- ${appPath} ${stylesPath} ${packagePath} ${packageLockPath}`, {
    encoding: 'utf8',
  }),
].join('\n');

const forbiddenDiffSnippets = [
  'CURRENT_FORTUNE_SCHEMA_VERSION =',
  'schemaVersion:',
  'localStorage.setItem',
  'localStorage.getItem',
  'localStorage.removeItem',
  '@capacitor/ios',
  'serviceWorker',
  'workbox',
];

let hasFailure = false;

function logResult(label, passed, detail = '') {
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${detail ? ` - ${detail}` : ''}`);
  if (!passed) hasFailure = true;
}

for (const path of [appPath, stylesPath, packagePath, packageLockPath]) {
  logResult(`${path}_exists`, fs.existsSync(path));
}

for (const snippet of requiredAppSnippets) {
  logResult(`app_includes_${snippet.slice(0, 80).replaceAll(/\s+/g, '_')}`, appSource.includes(snippet));
}

for (const snippet of requiredStyleSnippets) {
  logResult(`styles_include_${snippet}`, stylesSource.includes(snippet));
}

logResult('package_includes_capacitor_app_dependency', packageSource.includes('"@capacitor/app"'));
logResult('package_lock_includes_capacitor_app', packageLockSource.includes('node_modules/@capacitor/app'));
logResult(
  'package_script_registered',
  packageSource.includes('"check:native-android-back-button": "node scripts/checkNativeAndroidBackButton.mjs"'),
);

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

if (hasFailure) {
  console.error('Native Android back button check failed');
  process.exit(1);
}

console.log('Native Android back button check passed');
