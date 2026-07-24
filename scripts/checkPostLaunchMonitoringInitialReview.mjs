import fs from 'node:fs';

const docPath = 'docs/POST_LAUNCH_MONITORING_INITIAL_REVIEW.md';

const requiredFiles = [
  docPath,
  'TODO.md',
  'DEVELOPMENT_LOG.md',
  'CHANGELOG.md',
  'package.json',
];

const requiredDocSnippets = [
  '# Post-Launch Monitoring Initial Review',
  'Verification date: 2026-07-24',
  'PR type: docs/check-only',
  'Post-launch monitoring execution: Completed',
  'Initial post-launch monitoring review: Completed',
  'Policy status review: Completed',
  'User-perceived crash rate',
  'Observed result: Insufficient data',
  'User-perceived ANR rate',
  'Slow cold start',
  'Ratings review: Completed',
  'Written reviews review: Completed',
  'App statistics review: Completed',
  'Support inquiry review: Completed',
  'No inquiries found during the reviewed period',
  'R8 optimization recommendation',
  'Implementation | Pending',
  'Post-install functional QA: Pending',
  'Detailed Android device QA: Pending',
  'First update planning: Pending',
  'No data must not be treated as zero',
  'Insufficient data must not be treated as Pass',
];

const requiredTodoSnippets = [
  '- [x] Post-launch monitoring execution',
  '- [x] Initial post-launch monitoring review',
  '- [x] Policy status review',
  '- [x] User-perceived crash rate review',
  '- [x] User-perceived ANR rate review',
  '- [x] Slow cold start review',
  '- [x] Ratings review',
  '- [x] Written reviews review',
  '- [x] App statistics review',
  '- [x] Support inquiry review',
  '- [x] First update consideration review',
  '- [x] Initial monitoring review document',
  '- [x] Initial monitoring review validation script',
  '- [ ] Future recurring monitoring',
  '- [ ] Post-install functional QA',
  '- [ ] Detailed Android device QA',
  '- [ ] R8 optimization implementation',
  '- [ ] Empty advertisement placeholder UX implementation',
  '- [ ] AdMob integration planning',
  '- [ ] AdMob SDK integration',
  '- [ ] Actual advertisement serving',
  '- [ ] First update planning',
];

const requiredDevLogSnippets = [
  'PR 목적: 초기 출시 후 모니터링 실제 확인 결과 기록',
  'Status: Docs/check-only',
  'Verification date: 2026-07-24',
  'Post-launch monitoring execution: Completed',
  'Initial post-launch monitoring review: Completed',
  'Policy status review: Completed',
  'Policy observed result: No policy issue displayed',
  'User-perceived crash rate review: Completed',
  'Crash result: Insufficient data',
  'User-perceived ANR rate review: Completed',
  'ANR result: Insufficient data',
  'Slow cold start review: Completed',
  'Slow cold start result: Insufficient data',
  'Ratings review: Completed',
  'Ratings result: No data',
  'Written reviews review: Completed',
  'Written reviews result: No data',
  'App statistics review: Completed',
  'App statistics result: No data',
  'Support inquiry review: Completed',
  'Support result: No inquiries found during the reviewed period',
  'First update consideration review: Completed',
  'Release-blocking issue identified: No',
  'Immediate hotfix required: No',
  'R8 optimization recommendation: Identified',
  'R8 implementation: Pending',
  'Empty advertisement placeholder UX implementation: Pending',
  'Post-install functional QA: Pending',
  'Detailed Android device QA: Pending',
  'First update planning: Pending',
  'npm run build 결과',
  'npm run check:post-launch-monitoring-initial-review 결과',
  'npm run check:post-launch-monitoring-readiness 결과',
];

const requiredChangelogSnippets = [
  'Recorded the initial manual Google Play post-launch monitoring review.',
  'Recorded policy status, Android vitals, ratings, reviews, app statistics, and support inquiry observations.',
  'Recorded R8 and the empty advertisement placeholder as non-blocking future update candidates.',
  'Added the initial post-launch monitoring review check.',
  '- Future recurring monitoring',
  '- Post-install functional QA',
  '- Detailed Android device QA',
  '- R8 optimization implementation',
  '- Empty advertisement placeholder UX implementation',
  '- AdMob integration planning',
  '- First update planning',
];

const forbiddenClaims = [
  'Crash rate: 0%',
  'ANR rate: 0%',
  'No crashes confirmed',
  'No ANRs confirmed',
  'Android vitals passed',
  'All users are satisfied',
  'No user complaints',
  'App install count is zero',
  'All monitoring permanently completed',
  'Post-install functional QA: Completed',
  'Detailed Android device QA: Completed',
  'First update planning: Completed',
  'R8 optimization implementation: Completed',
  'AdMob integration: Completed',
  'Actual advertisement serving: Completed',
];

let hasFailure = false;

function logResult(name, passed, detail = '') {
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${name}${detail ? ` - ${detail}` : ''}`);
  if (!passed) hasFailure = true;
}

function labelFromSnippet(snippet) {
  return snippet
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\p{L}\p{N}_/-]/gu, '')
    .slice(0, 80);
}

function sectionText(markdown, heading) {
  const start = markdown.indexOf(heading);
  if (start === -1) return '';
  const nextHeading = markdown.indexOf('\n## ', start + heading.length);
  return nextHeading === -1 ? markdown.slice(start) : markdown.slice(start, nextHeading);
}

for (const filePath of requiredFiles) {
  logResult(`file_exists_${labelFromSnippet(filePath)}`, fs.existsSync(filePath));
}

if (requiredFiles.some((filePath) => !fs.existsSync(filePath))) {
  console.error('Post-launch monitoring initial review check failed.');
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const todo = fs.readFileSync('TODO.md', 'utf8');
const devLog = fs.readFileSync('DEVELOPMENT_LOG.md', 'utf8');
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const packageJsonText = fs.readFileSync('package.json', 'utf8');
const todoSection = sectionText(todo, '## Post-Launch Monitoring Initial Review TODO');
const devLogSection = sectionText(devLog, '## Post-Launch Monitoring Initial Review');
const firstDocsHeading = changelog.indexOf('## Docs');
const nextDocsHeading = changelog.indexOf('\n## Docs', firstDocsHeading + '## Docs'.length);
const changelogEntry =
  nextDocsHeading === -1 ? changelog : changelog.slice(0, nextDocsHeading);

logResult('todo_has_initial_review_section', todoSection.length > 0);
logResult('dev_log_has_initial_review_section', devLogSection.length > 0);

for (const snippet of requiredDocSnippets) {
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, doc.includes(snippet));
}

for (const snippet of requiredTodoSnippets) {
  logResult(`todo_section_includes_${labelFromSnippet(snippet)}`, todoSection.includes(snippet));
}

for (const snippet of requiredDevLogSnippets) {
  logResult(`dev_log_section_includes_${labelFromSnippet(snippet)}`, devLogSection.includes(snippet));
}

for (const snippet of requiredChangelogSnippets) {
  logResult(`changelog_entry_includes_${labelFromSnippet(snippet)}`, changelogEntry.includes(snippet));
}

for (const [scopeName, scopeText] of [
  ['doc', doc],
  ['todo_section', todoSection],
  ['dev_log_section', devLogSection],
]) {
  for (const phrase of forbiddenClaims) {
    logResult(`${scopeName}_excludes_${labelFromSnippet(phrase)}`, !scopeText.includes(phrase));
  }
}

let packageJson;
try {
  packageJson = JSON.parse(packageJsonText);
  logResult('package_json_parses', true);
} catch (error) {
  logResult('package_json_parses', false, error.message);
}

logResult(
  'package_json_has_initial_review_script',
  packageJson?.scripts?.['check:post-launch-monitoring-initial-review']
    === 'node scripts/checkPostLaunchMonitoringInitialReview.mjs',
);

const changedContent = [doc, todoSection, devLogSection, changelogEntry].join('\n');
const emailAddressPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu;
const screenshotPathPattern =
  /(?:^|[\s"'`(])(?:[^\s"'`()]+[\\/])+[^\s"'`()]+\.(?:png|jpe?g|webp)(?=$|[\s"'`),])/imu;
const artifactPathPattern =
  /(?:^|[\s"'`(])(?:[^\s"'`()]+[\\/])?[^\s"'`()]+\.(?:aab|apk|jks|keystore|p12|pem)(?=$|[\s"'`),])/imu;
const passwordAssignmentPattern =
  /(?:storePassword|keyPassword|keystorePassword)\s*[:=]\s*['"][^'"\s]{3,}['"]/u;
const keystoreBase64LiteralPattern =
  /ANDROID_KEYSTORE_BASE64\s*[:=]\s*['"]?[A-Za-z0-9+/]{24,}={0,2}['"]?/u;
const privateKeyPattern = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u;
const serviceAccountPrivateKeyPattern = /"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----/u;
const googlePlayTokenPattern =
  /(?:GOOGLE_PLAY_API_TOKEN|PLAY_DEVELOPER_REPORTING_TOKEN)\s*[:=]\s*['"][^'"\s]{12,}['"]/u;
const inquiryMessageHeaderPattern = /^(?:From|To|Subject|보낸 사람|받는 사람|제목):\s+\S+/imu;

logResult('changed_content_excludes_email_address', !emailAddressPattern.test(changedContent));
logResult('changed_content_excludes_screenshot_path', !screenshotPathPattern.test(changedContent));
logResult('changed_content_excludes_artifact_path', !artifactPathPattern.test(changedContent));
logResult('changed_content_excludes_password_assignment', !passwordAssignmentPattern.test(changedContent));
logResult('changed_content_excludes_keystore_base64_literal', !keystoreBase64LiteralPattern.test(changedContent));
logResult('changed_content_excludes_private_key', !privateKeyPattern.test(changedContent));
logResult(
  'changed_content_excludes_service_account_private_key',
  !serviceAccountPrivateKeyPattern.test(changedContent),
);
logResult('changed_content_excludes_google_play_token', !googlePlayTokenPattern.test(changedContent));
logResult(
  'changed_content_excludes_inquiry_message_header',
  !inquiryMessageHeaderPattern.test(changedContent),
);

if (hasFailure) {
  console.error('Post-launch monitoring initial review check failed.');
  process.exit(1);
}

console.log('Post-launch monitoring initial review check passed');
