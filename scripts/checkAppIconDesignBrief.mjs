import fs from 'node:fs';
import { execSync } from 'node:child_process';

const briefDocPath = 'docs/APP_ICON_DESIGN_BRIEF.md';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';
const packagePath = 'package.json';
const checkScriptPath = 'scripts/checkAppIconDesignBrief.mjs';

const read = (path) => fs.readFileSync(path, 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(briefDocPath), 'brief_doc_exists');
if (!fs.existsSync(briefDocPath)) {
  console.error('App icon design brief check failed');
  console.error('- brief_doc_exists');
  process.exit(1);
}

const briefDoc = read(briefDocPath);
const changelogSource = read(changelogPath);
const developmentLogSource = read(developmentLogPath);
const todoSource = read(todoPath);
const packageSource = read(packagePath);

const requiredBriefDocSnippets = [
  'App icon design brief: Documented',
  'App icon asset creation: Pending',
  'Android icon resource integration: Pending',
  'Adaptive icon implementation: Not started',
  'Actual icon image files: Not added',
  'Google Play icon upload: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  '고요한 밤의 운세 다이어리',
  'ICON-001',
  'ICON-002',
  'ICON-003',
  'ICON-004',
];
for (const snippet of requiredBriefDocSnippets) {
  mark(briefDoc.includes(snippet), `brief_doc_includes_${snippet}`);
}

const candidateConceptRowPattern = /\| (ICON-00[1-4]) \|[^\n]*\| Pending \|/g;
const candidateConceptMatches = [...briefDoc.matchAll(candidateConceptRowPattern)].map((match) => match[1]);
mark(
  ['ICON-001', 'ICON-002', 'ICON-003', 'ICON-004'].every((id) => candidateConceptMatches.includes(id)),
  'all_candidate_concept_rows_marked_pending',
);

mark(
  changelogSource.includes('- Documented app icon design brief and kept icon asset creation Pending'),
  'changelog_records_app_icon_design_brief',
);

mark(developmentLogSource.includes('## App Icon Design Brief'), 'development_log_has_section');

mark(
  todoSource.includes('- [x] Document app icon design brief'),
  'todo_marked_complete',
);

const pendingTodoSnippets = [
  '- [ ] Create app icon asset',
  '- [ ] Apply app icon to Android resources after asset finalization',
];
for (const snippet of pendingTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_kept_pending_${snippet}`);
}

mark(
  packageSource.includes('"check:app-icon-design-brief": "node scripts/checkAppIconDesignBrief.mjs"'),
  'package_script_registered',
);

const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedFiles = new Set([
  changelogPath,
  developmentLogPath,
  todoPath,
  briefDocPath,
  packagePath,
  checkScriptPath,
]);

mark(changedFiles.every((file) => allowedFiles.has(file)), 'changed_files_limited_to_expected_scope');

const protectedPaths = ['src/', 'docs/generated/', 'android/', 'public/privacy-policy.html', 'package-lock.json'];
mark(
  !changedFiles.some((file) => protectedPaths.some((protectedPath) => file === protectedPath || file.startsWith(protectedPath))),
  'protected_paths_unchanged',
);

const protectedDiff = execSync(
  'git diff HEAD -- src docs/generated android public/privacy-policy.html package-lock.json',
  { encoding: 'utf8' },
);
mark(protectedDiff.trim() === '', 'protected_diff_empty');

const artifactExtensions = ['.png', '.webp', '.svg', '.ico', '.aab', '.zip', '.jks', '.keystore'];
mark(
  !changedFiles.some((file) => artifactExtensions.some((extension) => file.endsWith(extension))),
  'no_icon_or_release_artifacts_added',
);

const forbiddenPackagePatterns = [/kakao/i, /capacitor\/?share/i, /"@capacitor-community\/share"/i];
mark(
  !forbiddenPackagePatterns.some((pattern) => pattern.test(packageSource)),
  'no_kakao_or_capacitor_share_dependency_added',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('App icon design brief check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('App icon design brief check passed');
