import fs from 'node:fs';
import { execSync } from 'node:child_process';

const dailyRoutinePath = 'src/components/DailyRoutineCard.jsx';
const sajuElementPath = 'src/components/SajuElementSummaryCard.jsx';

const dailyRoutineSource = fs.readFileSync(dailyRoutinePath, 'utf8');
const sajuElementSource = fs.readFileSync(sajuElementPath, 'utf8');
const stylesSource = fs.readFileSync('src/styles.css', 'utf8');
const diffOutput = [
  execSync('git diff -- .', { encoding: 'utf8' }),
  execSync('git diff --cached -- .', { encoding: 'utf8' }),
].join('\n');
const guardedCodeDiffOutput = [
  execSync('git diff -- src package.json', { encoding: 'utf8' }),
  execSync('git diff --cached -- src package.json', { encoding: 'utf8' }),
].join('\n');
const trackedChangedFiles = execSync('git diff --name-only -- .', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const stagedChangedFiles = execSync('git diff --cached --name-only -- .', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const untrackedFiles = execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const changedFiles = [...new Set([...trackedChangedFiles, ...stagedChangedFiles, ...untrackedFiles])];

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  'package.json',
  'scripts/checkFiveElementsGuidanceDeduplication.mjs',
  dailyRoutinePath,
  'src/styles.css',
]);

const requiredDailyRoutineSnippets = [
  "화: { label: '화(火)', plain: '추진력과 표현이 살아나는 기운'",
  "수: { label: '수(水)', plain: '생각을 정리하고 흐름을 살피는 기운'",
  "목: { label: '목(木)', plain: '성장과 시작을 돕는 기운'",
  "금: { label: '금(金)', plain: '기준을 세우고 정돈하는 기운'",
  "토: { label: '토(土)', plain: '균형을 잡고 기반을 다지는 기운'",
  'daily-routine-detail',
];

const requiredSajuElementSnippets = [
  'buildElementHelp',
  'displayFiveElementText',
  'getFiveElementInfo',
  'balanceTip',
  '오행 설명 닫기',
];

const forbiddenSourceSnippets = [
  '오행을 쉽게 보면',
  'daily-routine-element-guide',
  'FIVE_ELEMENT_GUIDE_ITEMS',
];

const forbiddenChangedPathSnippets = [
  'src/domain/fortune/zodiacFortuneEngine.js',
  'docs/generated/',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res/',
  'build.gradle',
  'public/privacy-policy.html',
  '.aab',
  '.jks',
  '.keystore',
];

const forbiddenCodeDiffSnippets = [
  'CURRENT_FORTUNE_SCHEMA_VERSION =',
  'schemaVersion:',
  'localStorage.setItem',
  'localStorage.getItem',
  'localStorage.removeItem',
];

let hasFailure = false;

function logResult(name, passed, detail = '') {
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${name}${detail ? ` - ${detail}` : ''}`);
  if (!passed) hasFailure = true;
}

for (const snippet of requiredDailyRoutineSnippets) {
  logResult(`daily_routine_keeps_${snippet}`, dailyRoutineSource.includes(snippet));
}

for (const snippet of requiredSajuElementSnippets) {
  logResult(`saju_element_keeps_${snippet}`, sajuElementSource.includes(snippet));
}

for (const snippet of forbiddenSourceSnippets) {
  logResult(`source_removes_${snippet}`, !dailyRoutineSource.includes(snippet) && !stylesSource.includes(snippet));
}

for (const file of changedFiles) {
  logResult(`allowed_changed_file_${file}`, allowedChangedFiles.has(file));
}

for (const snippet of forbiddenChangedPathSnippets) {
  logResult(
    `changed_files_exclude_${snippet}`,
    changedFiles.every((file) => !file.includes(snippet)),
  );
}

for (const snippet of forbiddenCodeDiffSnippets) {
  logResult(`code_diff_excludes_${snippet}`, !guardedCodeDiffOutput.includes(snippet));
}

if (hasFailure) {
  console.error('Five elements guidance deduplication check failed.');
  process.exit(1);
}

console.log('Five elements guidance deduplication check passed.');
