import fs from 'node:fs';
import { execSync } from 'node:child_process';

const homePath = 'src/pages/HomePage.jsx';
const packagePath = 'package.json';
const expectedKey = 'harupuli_home_quick_menu_prefs';
const protectedFiles = [
  'src/domain',
  'src/utils/fortuneEngine.js',
  'src/utils/storage.js',
  'docs/generated',
  'public/privacy-policy.html',
  'android/app/build.gradle',
  'android/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
];

const requiredHomeSnippets = [
  `const QUICK_MENU_PREFS_KEY = '${expectedKey}'`,
  'const MAX_HOME_QUICK_MENU_ITEMS = 4',
  'const DEFAULT_QUICK_MENU_IDS',
  'readQuickMenuPrefs',
  'writeQuickMenuPrefs',
  'window.localStorage.getItem(QUICK_MENU_PREFS_KEY)',
  'window.localStorage.setItem(QUICK_MENU_PREFS_KEY, JSON.stringify(menuIds))',
  '.slice(0, MAX_HOME_QUICK_MENU_ITEMS)',
  '빠른 메뉴는 최대 4개까지 선택할 수 있어요.',
  '최소 1개 메뉴는 남겨두면 홈에서 바로 이동할 수 있어요.',
  'setIsQuickMenuEditorOpen(true)',
  'setIsQuickMenuEditorOpen(false)',
  'aria-label="빠른 메뉴 편집"',
  'aria-expanded={isQuickMenuEditorOpen}',
  'aria-controls="quick-menu-editor-dialog"',
  'id="quick-menu-editor-dialog"',
  'role="dialog"',
  'aria-modal="true"',
  'type="checkbox"',
  'checked={isChecked}',
  'onChange={() => handleToggleQuickMenu(item.id)}',
  'grid-template-columns: repeat(4, minmax(0, 1fr))',
];

const forbiddenHomeSnippets = [
  'schemaVersion',
  'CURRENT_FORTUNE_SCHEMA_VERSION',
  'localStorage.setItem("aiTodayFortune.profile"',
  "localStorage.setItem('aiTodayFortune.profile'",
  'localStorage.setItem("aiTodayFortune.todayFortune"',
  "localStorage.setItem('aiTodayFortune.todayFortune'",
  'localStorage.setItem("harupuli_home_quick_menu_prefs_v',
  "localStorage.setItem('harupuli_home_quick_menu_prefs_v",
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

for (const path of [homePath, packagePath]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const homeSource = fs.readFileSync(homePath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');
const stylesSource = fs.readFileSync('src/styles.css', 'utf8');
const combinedSource = `${homeSource}\n${stylesSource}`;

for (const snippet of requiredHomeSnippets) {
  const found = combinedSource.includes(snippet);
  logResult(`quick_menu_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenHomeSnippets) {
  const absent = !homeSource.includes(snippet);
  logResult(`quick_menu_forbidden_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const quickMenuKeyOccurrences = [...homeSource.matchAll(new RegExp(expectedKey, 'g'))].length;
const keyPresentWithoutNewVariant = quickMenuKeyOccurrences >= 1 && !homeSource.includes(`${expectedKey}_v`);
logResult('quick_menu_existing_key_used_without_variant', keyPresentWithoutNewVariant);
if (!keyPresentWithoutNewVariant) hasFailure = true;

const localStorageSetItemCalls = [...homeSource.matchAll(/localStorage\.setItem\(([^)]*)\)/g)].map((match) => match[0]);
const localStorageSetItemOnlyQuickMenu =
  localStorageSetItemCalls.length === 1 && localStorageSetItemCalls[0].includes('QUICK_MENU_PREFS_KEY');
logResult('home_localStorage_setItem_only_uses_quick_menu_key', localStorageSetItemOnlyQuickMenu);
if (!localStorageSetItemOnlyQuickMenu) hasFailure = true;

const packageScriptRegistered = packageSource.includes(
  '"check:home-quick-menu-prefs": "node scripts/checkHomeQuickMenuPrefs.mjs"',
);
logResult('package_script_registered', packageScriptRegistered);
if (!packageScriptRegistered) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('generated_privacy_android_and_engine_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Home quick menu prefs check failed');
  process.exit(1);
}

console.log('Home quick menu prefs check passed');
