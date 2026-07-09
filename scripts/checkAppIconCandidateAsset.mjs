import fs from 'node:fs';
import { execSync } from 'node:child_process';

const svgPath = 'assets/app-icon/harupuli-icon-candidate.svg';
const readmePath = 'assets/app-icon/README.md';
const briefDocPath = 'docs/APP_ICON_DESIGN_BRIEF.md';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';
const packagePath = 'package.json';
const checkScriptPath = 'scripts/checkAppIconCandidateAsset.mjs';

const read = (path) => fs.readFileSync(path, 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(svgPath), 'svg_candidate_exists');
mark(fs.existsSync(readmePath), 'readme_exists');
if (!fs.existsSync(svgPath) || !fs.existsSync(readmePath)) {
  console.error('App icon candidate asset check failed');
  checks.filter((check) => !check.condition).forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

const svgSource = read(svgPath);
const readmeSource = read(readmePath);
const briefDoc = read(briefDocPath);
const changelogSource = read(changelogPath);
const developmentLogSource = read(developmentLogPath);
const todoSource = read(todoPath);
const packageSource = read(packagePath);

mark(svgSource.includes('<svg'), 'svg_has_svg_tag');
mark(svgSource.includes('viewBox="0 0 512 512"'), 'svg_has_expected_viewbox');
mark(!/<script/i.test(svgSource), 'svg_has_no_script_tag');
mark(!/<text/i.test(svgSource), 'svg_has_no_text_element');
mark(!/href\s*=/i.test(svgSource), 'svg_has_no_href');
mark(!/base64/i.test(svgSource), 'svg_has_no_base64');
mark(!/animat/i.test(svgSource), 'svg_has_no_animation');
mark(/#314A66/i.test(svgSource), 'svg_has_deep_navy_color');
mark(/#C6A15B/i.test(svgSource), 'svg_has_warm_gold_color');

mark(readmeSource.includes('ICON-003'), 'readme_includes_concept_id');
mark(readmeSource.includes('Night mountain'), 'readme_includes_concept_name');
mark(readmeSource.includes('Android resource integration: Pending'), 'readme_includes_android_resource_pending');
mark(readmeSource.includes('Google Play icon upload: Pending'), 'readme_includes_play_upload_pending');

const requiredBriefDocSnippets = [
  'Selected candidate: ICON-003 Night mountain',
  'Asset creation status: Candidate added',
  'Final icon decision: Pending',
  'Android icon resource integration: Pending',
];
for (const snippet of requiredBriefDocSnippets) {
  mark(briefDoc.includes(snippet), `brief_doc_includes_${snippet}`);
}

mark(
  changelogSource.includes('- Added first app icon candidate asset and kept Android resource integration Pending'),
  'changelog_records_candidate_asset',
);

mark(developmentLogSource.includes('## App Icon Candidate Asset'), 'development_log_has_section');

mark(todoSource.includes('- [x] Create app icon asset candidate'), 'todo_marked_complete');
mark(
  todoSource.includes('- [ ] Apply app icon to Android resources after asset finalization'),
  'todo_android_resource_kept_pending',
);

mark(
  packageSource.includes('"check:app-icon-candidate-asset": "node scripts/checkAppIconCandidateAsset.mjs"'),
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
  svgPath,
  readmePath,
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

const disallowedArtifactExtensions = ['.png', '.webp', '.ico', '.aab', '.zip', '.jks', '.keystore'];
mark(
  !changedFiles.some((file) => disallowedArtifactExtensions.some((extension) => file.endsWith(extension))),
  'no_raster_icon_or_release_artifacts_added',
);

const forbiddenPackagePatterns = [/kakao/i, /capacitor\/?share/i, /"@capacitor-community\/share"/i];
mark(
  !forbiddenPackagePatterns.some((pattern) => pattern.test(packageSource)),
  'no_kakao_or_capacitor_share_dependency_added',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('App icon candidate asset check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('App icon candidate asset check passed');
