import fs from 'node:fs';
import { execSync } from 'node:child_process';

const appPath = 'src/App.jsx';
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
  'function scrollToPageTop()',
  'window.scrollTo({ top: 0, left: 0, behavior: \'auto\' })',
  'document.documentElement.scrollTop = 0',
  'document.body.scrollTop = 0',
  'window.requestAnimationFrame(applyScroll)',
  'window.setTimeout(applyScroll, 0)',
  'const handleNavigate = (page) => {',
  'setActivePage(page)',
  'scrollToPageTop()',
  'onNavigate={handleNavigate}',
  '<BottomNav activePage={activePage} onNavigate={handleNavigate} />',
  'onEditProfile={() => handleNavigate(\'profileEdit\')}',
];

const forbiddenAppSnippets = [
  '<BottomNav activePage={activePage} onNavigate={setActivePage} />',
  'onNavigate={setActivePage}',
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

for (const path of [appPath, packagePath]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const appSource = fs.readFileSync(appPath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');

for (const snippet of requiredAppSnippets) {
  const found = appSource.includes(snippet);
  logResult(`app_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenAppSnippets) {
  const absent = !appSource.includes(snippet);
  logResult(`app_forbidden_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const packageScriptRegistered = packageSource.includes(
  '"check:scroll-to-top-navigation": "node scripts/checkScrollToTopNavigation.mjs"',
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
  console.error('Scroll-to-top navigation check failed');
  process.exit(1);
}

console.log('Scroll-to-top navigation check passed');
