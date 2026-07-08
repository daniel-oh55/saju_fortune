import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const packagePath = 'package.json';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';
const checkScriptPath = 'scripts/checkProfileCtaCopyUpdate.mjs';

const OLD_COPY = '하루풀이 시작하기';
const NEW_COPY = '저장하고 하루풀이 시작하기';

const read = (path) => fs.readFileSync(path, 'utf8');

const packageSource = read(packagePath);
const changelogSource = read(changelogPath);
const developmentLogSource = read(developmentLogPath);
const todoSource = read(todoPath);

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const collectSrcFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(collectSrcFiles(fullPath));
    } else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
};

const srcFiles = collectSrcFiles('src');
const srcContents = srcFiles.map((file) => ({ file, content: read(file) }));

const newCopyPresent = srcContents.some(({ content }) => content.includes(NEW_COPY));
mark(newCopyPresent, 'src_contains_new_cta_copy');

const staleOldCopyFiles = srcContents.filter(({ content }) => {
  const withoutNewCopy = content.split(NEW_COPY).join('');
  return withoutNewCopy.includes(OLD_COPY);
});
mark(staleOldCopyFiles.length === 0, 'src_free_of_standalone_old_cta_copy');

const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedNonSrcFiles = new Set([changelogPath, developmentLogPath, todoPath, packagePath, checkScriptPath]);

const changedSrcFiles = changedFiles.filter((file) => file.startsWith('src/'));
const changedNonSrcFiles = changedFiles.filter((file) => !file.startsWith('src/'));

mark(changedNonSrcFiles.every((file) => allowedNonSrcFiles.has(file)), 'changed_files_limited_to_expected_scope');
mark(changedSrcFiles.length > 0, 'at_least_one_src_file_changed');
mark(changedSrcFiles.every((file) => file === 'src/components/ProfileForm.jsx'), 'src_changes_limited_to_cta_copy_file');

const protectedPaths = ['docs/generated/', 'android/', 'public/privacy-policy.html', 'package-lock.json'];
mark(
  !changedFiles.some((file) => protectedPaths.some((protectedPath) => file === protectedPath || file.startsWith(protectedPath))),
  'protected_paths_unchanged',
);

const artifactExtensions = ['.aab', '.zip', '.jks', '.keystore', '.png', '.webp', '.svg', '.ico', '.json'];
mark(
  !changedFiles.some(
    (file) => file !== packagePath && artifactExtensions.some((extension) => file.endsWith(extension)),
  ),
  'no_icon_release_or_generated_json_artifacts_added',
);

const forbiddenPackagePatterns = [/kakao/i, /capacitor\/?share/i, /"@capacitor-community\/share"/i];
mark(
  !forbiddenPackagePatterns.some((pattern) => pattern.test(packageSource)),
  'no_kakao_or_capacitor_share_dependency_added',
);

mark(
  packageSource.includes('"check:profile-cta-copy-update": "node scripts/checkProfileCtaCopyUpdate.mjs"'),
  'package_script_registered',
);
mark(
  changelogSource.includes("- Updated profile start CTA copy to '저장하고 하루풀이 시작하기'"),
  'changelog_records_copy_update',
);

const requiredDevelopmentLogSnippets = [
  '## Profile CTA Copy Update',
  "Updated 내정보 CTA copy from '하루풀이 시작하기' to '저장하고 하루풀이 시작하기'",
  'Kept change as copy-only UI update',
  'No profile save logic changes',
  'No routing changes',
  'No localStorage key changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No production fortune logic changes',
  'No generated JSON changes',
  'No docs/generated changes',
  'No Android/Gradle changes',
  'No icon asset changes',
  'No loading screen implementation',
  'No sharing feature implementation',
];
for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_contains_${snippet}`);
}

mark(
  todoSource.includes("- [x] Change 내정보 CTA copy to '저장하고 하루풀이 시작하기'"),
  'todo_ux_007_marked_complete',
);

const pendingTodoSnippets = [
  '- [ ] Show morning, lunch, and evening fortune cards on the home screen',
  '- [ ] Add short app loading screen',
  '- [ ] Create app icon asset',
  '- [ ] Apply app icon to Android resources after asset finalization',
  '- [ ] Add saved reading share feature',
  '- [ ] Review KakaoTalk/SMS sharing path',
];
for (const snippet of pendingTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_kept_pending_${snippet}`);
}

const protectedDiff = execSync(
  'git diff HEAD -- docs/generated android public/privacy-policy.html package-lock.json',
  { encoding: 'utf8' },
);
mark(protectedDiff.trim() === '', 'protected_diff_empty');

const srcDiff = execSync('git diff HEAD -- src', { encoding: 'utf8' });
mark(
  !/schemaVersion|CURRENT_FORTUNE_SCHEMA_VERSION/.test(srcDiff),
  'diff_free_of_schema_version_changes',
);
mark(
  !/localStorage\.(setItem|getItem|removeItem)/.test(srcDiff),
  'diff_free_of_local_storage_code_changes',
);

const productionCalculationPathPatterns = [
  /^src\/domain\/fortune\//,
  /zodiacFortuneEngine/,
  /yearFortuneEngine/,
  /profileRegionMetaStorage/,
];
mark(
  !changedFiles.some((file) => productionCalculationPathPatterns.some((pattern) => pattern.test(file))),
  'no_production_calculation_file_changes',
);

const profileFormDiff = execSync('git diff HEAD -- src/components/ProfileForm.jsx', { encoding: 'utf8' });
const addedLines = profileFormDiff.split(/\r?\n/).filter((line) => line.startsWith('+') && !line.startsWith('+++'));
const removedLines = profileFormDiff.split(/\r?\n/).filter((line) => line.startsWith('-') && !line.startsWith('---'));
mark(addedLines.length <= 1 && removedLines.length <= 1, 'profile_form_diff_is_single_line_copy_change');
mark(
  !/onClick|onSubmit|useState|useEffect|localStorage|navigate|useNavigate|className=/.test(
    [...addedLines, ...removedLines].join('\n'),
  ),
  'profile_form_diff_free_of_handler_or_structural_changes',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Profile CTA copy update check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Profile CTA copy update check passed');
