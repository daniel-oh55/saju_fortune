import fs from 'node:fs';
import { execSync } from 'node:child_process';

const sourcePngPath = 'assets/app-icon/source/harupuli-icon-source.png';
const readmePath = 'assets/app-icon/README.md';
const briefDocPath = 'docs/APP_ICON_DESIGN_BRIEF.md';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';
const packagePath = 'package.json';
const checkScriptPath = 'scripts/checkFinalizeProvidedAppIconCandidate.mjs';

const read = (path) => fs.readFileSync(path, 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

for (const path of [sourcePngPath, readmePath, briefDocPath]) {
  mark(fs.existsSync(path), `${path}_exists`);
}
if (checks.some((check) => !check.condition)) {
  console.error('Finalize provided app icon candidate check failed');
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
  'Final selected candidate: assets/app-icon/source/harupuli-icon-source.png',
  'Final icon decision: Completed',
  'Android resource integration: Pending',
  'Real-device launcher QA: Pending',
];
for (const snippet of requiredReadmeSnippets) {
  mark(readmeSource.includes(snippet), `readme_includes_${snippet}`);
}

const requiredBriefDocSnippets = [
  'Final selected candidate path: assets/app-icon/source/harupuli-icon-source.png',
  'Asset creation status: Final candidate selected',
  'Final icon decision: Completed',
  'Android icon resource integration: Pending',
  'Google Play icon upload: Pending',
  'Real-device launcher QA: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
];
for (const snippet of requiredBriefDocSnippets) {
  mark(briefDoc.includes(snippet), `brief_doc_includes_${snippet}`);
}

mark(
  changelogSource.includes(
    '- Finalized the provided image as the app icon candidate while keeping Android resource integration Pending',
  ),
  'changelog_records_finalization',
);

mark(developmentLogSource.includes('## Finalized Provided App Icon Candidate'), 'development_log_has_section');

mark(todoSource.includes('- [x] Finalize app icon asset'), 'todo_marked_complete');
mark(
  todoSource.includes('- [ ] Apply app icon to Android resources after asset finalization'),
  'todo_android_resource_kept_pending',
);

mark(
  packageSource.includes(
    '"check:finalize-provided-app-icon-candidate": "node scripts/checkFinalizeProvidedAppIconCandidate.mjs"',
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
]);

mark(changedFiles.every((file) => allowedFiles.has(file)), 'changed_files_limited_to_expected_scope');
mark(!changedFiles.includes(sourcePngPath), 'existing_source_png_not_modified');

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

const disallowedArtifactExtensions = ['.png', '.webp', '.ico', '.aab', '.zip', '.jks', '.keystore'];
mark(
  !changedFiles.some((file) => disallowedArtifactExtensions.some((extension) => file.endsWith(extension))),
  'no_new_icon_or_release_artifacts_added',
);

const forbiddenPackagePatterns = [/kakao/i, /capacitor\/?share/i, /"@capacitor-community\/share"/i];
mark(
  !forbiddenPackagePatterns.some((pattern) => pattern.test(packageSource)),
  'no_kakao_or_capacitor_share_dependency_added',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Finalize provided app icon candidate check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Finalize provided app icon candidate check passed');
