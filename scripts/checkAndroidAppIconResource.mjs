import fs from 'node:fs';
import { execSync } from 'node:child_process';

const sourcePngPath = 'assets/app-icon/source/harupuli-icon-source.png';
const readmePath = 'assets/app-icon/README.md';
const briefDocPath = 'docs/APP_ICON_DESIGN_BRIEF.md';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';
const packagePath = 'package.json';
const checkScriptPath = 'scripts/checkAndroidAppIconResource.mjs';
const androidManifestPath = 'android/app/src/main/AndroidManifest.xml';
const androidResRoot = 'android/app/src/main/res/';

const read = (path) => fs.readFileSync(path, 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

for (const path of [sourcePngPath, readmePath, briefDocPath]) {
  mark(fs.existsSync(path), `${path}_exists`);
}
if (checks.some((check) => !check.condition)) {
  console.error('Android app icon resource check failed');
  checks.filter((check) => !check.condition).forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

const readmeSource = read(readmePath);
const briefDoc = read(briefDocPath);
const changelogSource = read(changelogPath);
const developmentLogSource = read(developmentLogPath);
const todoSource = read(todoPath);
const packageSource = read(packagePath);

mark(readmeSource.includes('Android resource integration: Completed'), 'readme_includes_resource_integration_completed');
mark(readmeSource.includes('Real-device launcher QA: Pending'), 'readme_includes_launcher_qa_pending');

const requiredBriefDocSnippets = [
  'Android icon resource integration: Completed',
  'Real-device launcher QA: Pending',
  'Google Play icon upload: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
];
for (const snippet of requiredBriefDocSnippets) {
  mark(briefDoc.includes(snippet), `brief_doc_includes_${snippet}`);
}

mark(
  changelogSource.includes('- Applied the selected app icon to Android launcher resources'),
  'changelog_records_resource_integration',
);

mark(developmentLogSource.includes('## Android App Icon Resource Integration'), 'development_log_has_section');

mark(
  todoSource.includes('- [x] Apply app icon to Android resources after asset finalization'),
  'todo_marked_complete',
);
mark(
  todoSource.includes('- [ ] Record Android launcher icon real-device QA result'),
  'todo_launcher_qa_kept_pending',
);

mark(
  packageSource.includes('"check:android-app-icon-resource": "node scripts/checkAndroidAppIconResource.mjs"'),
  'package_script_registered',
);

const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedNonAndroidFiles = new Set([
  changelogPath,
  developmentLogPath,
  todoPath,
  briefDocPath,
  readmePath,
  packagePath,
  checkScriptPath,
]);

const isAllowedAndroidIconFile = (file) => file.startsWith(androidResRoot) && /ic_launcher/.test(file);

mark(
  changedFiles.every((file) => allowedNonAndroidFiles.has(file) || isAllowedAndroidIconFile(file)),
  'changed_files_limited_to_expected_scope',
);

mark(
  changedFiles.some((file) => file.startsWith(androidResRoot) && /ic_launcher/.test(file)),
  'android_launcher_icon_resource_changed',
);

mark(!changedFiles.includes(sourcePngPath), 'existing_source_png_not_modified');
mark(!changedFiles.includes(androidManifestPath), 'android_manifest_unchanged');

const protectedPaths = ['src/', 'docs/generated/', 'public/privacy-policy.html', 'package-lock.json'];
mark(
  !changedFiles.some((file) => protectedPaths.some((protectedPath) => file === protectedPath || file.startsWith(protectedPath))),
  'protected_paths_unchanged',
);

const gradleFilesChanged = changedFiles.some(
  (file) => file.endsWith('.gradle') || file.endsWith('.gradle.kts') || file === 'android/gradle.properties',
);
mark(!gradleFilesChanged, 'gradle_files_unchanged');

const protectedDiff = execSync(
  'git diff HEAD -- src docs/generated public/privacy-policy.html package-lock.json',
  { encoding: 'utf8' },
);
mark(protectedDiff.trim() === '', 'protected_diff_empty');

const manifestDiff = execSync(`git diff HEAD -- ${androidManifestPath}`, { encoding: 'utf8' });
mark(manifestDiff.trim() === '', 'android_manifest_diff_empty');

const disallowedArtifactExtensions = ['.aab', '.zip', '.jks', '.keystore'];
mark(
  !changedFiles.some((file) => disallowedArtifactExtensions.some((extension) => file.endsWith(extension))),
  'no_release_artifacts_added',
);

const forbiddenPackagePatterns = [/kakao/i, /capacitor\/?share/i, /"@capacitor-community\/share"/i];
mark(
  !forbiddenPackagePatterns.some((pattern) => pattern.test(packageSource)),
  'no_kakao_or_capacitor_share_dependency_added',
);

const srcDiff = execSync('git diff HEAD -- src', { encoding: 'utf8' });
mark(!/schemaVersion|CURRENT_FORTUNE_SCHEMA_VERSION/.test(srcDiff), 'diff_free_of_schema_version_changes');
mark(!/localStorage\.(setItem|getItem|removeItem)/.test(srcDiff), 'diff_free_of_local_storage_key_changes');

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Android app icon resource check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Android app icon resource check passed');
