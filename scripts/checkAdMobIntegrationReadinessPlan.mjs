import fs from 'node:fs';

const docPath = 'docs/ADMOB_INTEGRATION_READINESS_PLAN.md';
const requiredFiles = [
  docPath,
  'TODO.md',
  'DEVELOPMENT_LOG.md',
  'CHANGELOG.md',
  'package.json',
];

const requiredDocSnippets = [
  '# AdMob Integration Readiness Plan',
  'Verification date: 2026-07-26',
  'PR type: docs/check-only',
  'AdMob account verification: In progress',
  'AdMob app registration: Completed',
  'Google Play linking: Completed',
  'Package verification: Completed',
  'app-ads.txt production deployment: Completed',
  'Live app-ads.txt URL verification: Completed',
  'AdMob app-ads.txt verification: Pending',
  'AdMob app verification: Pending',
  'App readiness review: Pending',
  'Ad unit creation: Pending',
  'AdMob SDK integration: Not started',
  'UMP SDK integration: Not started',
  'Actual advertisement serving: Pending',
  '인라인 적응형 배너',
  'Initial ad format and placement',
  'Empty and failed ad behavior',
  'Development and test-ad policy',
  'Consent and privacy flow plan',
  'Google Play Data safety impact',
  'Advertising ID and manifest impact',
  'Android QA matrix',
  'First advertising update release gates',
  'Completed does not mean approved',
  'Production file availability does not mean AdMob verification completed',
];

const requiredTodoSnippets = [
  '- [x] AdMob integration readiness planning',
  '- [x] Current AdMob state separation',
  '- [x] Initial advertising scope candidate',
  '- [x] Empty and failed ad behavior principles',
  '- [x] Test-ad policy planning',
  '- [x] Consent and privacy flow planning',
  '- [x] Data safety impact planning',
  '- [x] Advertising ID and manifest impact planning',
  '- [x] Android advertising QA planning',
  '- [x] First advertising update release gates',
  '- [x] Readiness plan document',
  '- [x] Readiness plan validation script',
  '- [ ] AdMob account verification',
  '- [ ] AdMob app-ads.txt verification',
  '- [ ] AdMob app verification',
  '- [ ] AdMob app readiness review',
  '- [ ] Initial ad placement finalization',
  '- [ ] Implementation approach selection',
  '- [ ] Ad unit creation',
  '- [ ] AdMob Privacy & Messaging configuration',
  '- [ ] Privacy policy advertising update',
  '- [ ] Google Play Data safety update',
  '- [ ] AdMob SDK integration',
  '- [ ] UMP SDK integration',
  '- [ ] Official test ad verification',
  '- [ ] Android advertising QA',
  '- [ ] Actual advertisement serving',
  '- [ ] First advertising update release',
];

const requiredDevLogSnippets = [
  'Status: Docs/check-only',
  'Verification date: 2026-07-26',
  'AdMob account verification: In progress',
  'AdMob app registration: Completed',
  'Google Play linking: Completed',
  'app-ads.txt production deployment: Completed',
  'Live URL verification: Completed',
  'AdMob app-ads.txt verification: Pending',
  'AdMob app verification: Pending',
  'App readiness review: Pending',
  'Ad units: 0',
  'AdMob SDK integration: Not started',
  'Actual advertisement serving: Pending',
  '인라인 적응형 배너',
  'npm run build 결과',
  'npm run check:admob-integration-readiness-plan 결과',
  'npm run check:post-launch-monitoring-initial-review 결과',
  'npm run check:post-launch-monitoring-readiness 결과',
  'PR #397에서 완료된 empty advertisement placeholder 상태와 기존 post-launch initial-review checker의 stale expectation 동기화',
  'production 변경이 아닌 기존 검증 기준선 정합성 수정',
];

const requiredChangelogSnippets = [
  'Added the AdMob integration readiness plan.',
  'Recorded the current AdMob account, app verification, and app readiness states.',
  'Defined initial advertising scope, consent, privacy, Data safety, Android QA, and release gates.',
  'Added the AdMob integration readiness plan validation check.',
  'Aligned the post-launch initial-review check with the completed empty advertisement placeholder state recorded by PR #397.',
  '- AdMob account verification',
  '- app-ads.txt verification',
  '- AdMob app verification',
  '- App readiness review',
  '- Initial ad placement finalization',
  '- Privacy policy and Data safety updates',
  '- AdMob and UMP SDK integration',
  '- Android advertising QA',
  '- Actual advertisement serving',
  '- First advertising update release',
];

const forbiddenClaims = [
  'AdMob account verification: Completed',
  'AdMob app verification: Completed',
  'app-ads.txt verification: Completed',
  'App readiness review: Completed',
  'Ad unit creation: Completed',
  'AdMob SDK integration: Completed',
  'UMP SDK integration: Completed',
  'Actual advertisement serving: Completed',
  'Android advertising QA: Completed',
  'Privacy policy advertising update: Completed',
  'Google Play Data safety update: Completed',
  'First advertising update release: Completed',
  'All advertising work completed',
  'Ads are live',
  'Production ads enabled',
];

const deprecatedBannerTerms = [
  '반응형 배너',
  '반응형 인라인 배너',
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
    .slice(0, 90);
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
  console.error('AdMob integration readiness plan check failed.');
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const todo = fs.readFileSync('TODO.md', 'utf8');
const devLog = fs.readFileSync('DEVELOPMENT_LOG.md', 'utf8');
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const packageJsonText = fs.readFileSync('package.json', 'utf8');
const todoSection = sectionText(todo, '## AdMob Integration Readiness Plan TODO');
const devLogSection = sectionText(devLog, '## AdMob Integration Readiness Plan');
const changelogStartMarker = '<!-- ADMOB_INTEGRATION_READINESS_CHANGELOG_START -->';
const changelogEndMarker = '<!-- ADMOB_INTEGRATION_READINESS_CHANGELOG_END -->';
const changelogStart = changelog.indexOf(changelogStartMarker);
const changelogEnd = changelog.indexOf(changelogEndMarker);
const changelogEntry =
  changelogStart === -1 || changelogEnd === -1
    ? ''
    : changelog.slice(changelogStart, changelogEnd + changelogEndMarker.length);

logResult('todo_has_admob_readiness_section', todoSection.length > 0);
logResult('dev_log_has_admob_readiness_section', devLogSection.length > 0);
logResult('changelog_has_admob_readiness_entry', changelogEntry.length > 0);

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

for (const [scopeName, scopeText] of [
  ['doc', doc],
  ['dev_log_section', devLogSection],
]) {
  for (const phrase of deprecatedBannerTerms) {
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
  'package_json_has_admob_readiness_script',
  packageJson?.scripts?.['check:admob-integration-readiness-plan']
    === 'node scripts/checkAdMobIntegrationReadinessPlan.mjs',
);

const changedContent = [doc, todoSection, devLogSection, changelogEntry].join('\n');
const sensitivePatterns = [
  ['actual_admob_app_or_unit_id', /\bca-app-pub-\d{16}[~/]\d{10}\b/u],
  ['actual_publisher_id', /\bpub-\d{16}\b/u],
  ['test_device_id_value', /(?:test device id|테스트 기기 ID)\s*[:=]\s*[A-F0-9-]{8,}/iu],
  ['payment_profile_id_value', /(?:payment profile id|결제 프로필 ID)\s*[:=]\s*[A-Z0-9-]{6,}/iu],
  ['korean_resident_number', /\b\d{6}-[1-4]\d{6}\b/u],
  ['email_address', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu],
  ['bank_account_number', /(?:bank account|계좌번호)\s*[:=]\s*[\d-]{8,}/iu],
  ['token_or_credential_value', /(?:token|credential|service account key)\s*[:=]\s*['"][^'"\s]{8,}['"]/iu],
  ['private_key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u],
  ['keystore_or_signing_value', /(?:storePassword|keyPassword|keystorePassword)\s*[:=]\s*['"][^'"\s]{3,}['"]/u],
  ['street_address', /(?:상세 주소|street address)\s*[:=]\s*\S.{8,}/iu],
];

for (const [name, pattern] of sensitivePatterns) {
  logResult(`changed_content_excludes_${name}`, !pattern.test(changedContent));
}

if (hasFailure) {
  console.error('AdMob integration readiness plan check failed.');
  process.exit(1);
}

console.log('AdMob integration readiness plan check passed');
