import fs from 'node:fs';
import { execSync } from 'node:child_process';

const sourcePngPath = 'assets/app-icon/source/harupuli-icon-source.png';
const readmePath = 'assets/app-icon/README.md';
const briefDocPath = 'docs/APP_ICON_DESIGN_BRIEF.md';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';
const packagePath = 'package.json';
const checkScriptPath = 'scripts/checkProvidedAppIconCandidateAsset.mjs';

const read = (path) => fs.readFileSync(path, 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

for (const path of [sourcePngPath, readmePath, briefDocPath]) {
  mark(fs.existsSync(path), `${path}_exists`);
}
if (checks.some((check) => !check.condition)) {
  console.error('Provided app icon candidate asset check failed');
  checks.filter((check) => !check.condition).forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

const readmeSource = read(readmePath);
const briefDoc = read(briefDocPath);
const changelogSource = read(changelogPath);
const developmentLogSource = read(developmentLogPath);
const todoSource = read(todoPath);
const packageSource = read(packagePath);

const requiredReadmeSnippets = [
  'Current primary candidate: assets/app-icon/source/harupuli-icon-source.png',
  'Previous candidate: assets/app-icon/harupuli-icon-candidate.svg',
  'Android resource integration: Pending',
  'Google Play icon upload: Pending',
];
for (const snippet of requiredReadmeSnippets) {
  mark(readmeSource.includes(snippet), `readme_includes_${snippet}`);
}

const requiredBriefDocSnippets = [
  'Primary candidate asset path: assets/app-icon/source/harupuli-icon-source.png',
  'Previous candidate asset path: assets/app-icon/harupuli-icon-candidate.svg',
  'Asset creation status: Candidate updated',
  'Final icon decision: Pending',
];
for (const snippet of requiredBriefDocSnippets) {
  mark(briefDoc.includes(snippet), `brief_doc_includes_${snippet}`);
}

mark(
  changelogSource.includes(
    '- Replaced the primary app icon candidate with the provided image and kept Android resource integration Pending',
  ),
  'changelog_records_replacement',
);

mark(developmentLogSource.includes('## Provided App Icon Candidate Update'), 'development_log_has_section');

mark(
  todoSource.includes('- [x] Replace app icon candidate with provided image'),
  'todo_marked_complete',
);
mark(
  todoSource.includes('- [ ] Apply app icon to Android resources after asset finalization'),
  'todo_android_resource_kept_pending',
);

mark(
  packageSource.includes(
    '"check:provided-app-icon-candidate-asset": "node scripts/checkProvidedAppIconCandidateAsset.mjs"',
  ),
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
  readmePath,
  sourcePngPath,
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

const disallowedArtifactExtensions = ['.webp', '.ico', '.aab', '.zip', '.jks', '.keystore'];
mark(
  !changedFiles.some((file) => disallowedArtifactExtensions.some((extension) => file.endsWith(extension))),
  'no_disallowed_artifacts_added',
);

const forbiddenPackagePatterns = [/kakao/i, /capacitor\/?share/i, /"@capacitor-community\/share"/i];
mark(
  !forbiddenPackagePatterns.some((pattern) => pattern.test(packageSource)),
  'no_kakao_or_capacitor_share_dependency_added',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Provided app icon candidate asset check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Provided app icon candidate asset check passed');
