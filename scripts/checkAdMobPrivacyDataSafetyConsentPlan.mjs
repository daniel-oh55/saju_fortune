import fs from 'node:fs';

const docPath = 'docs/ADMOB_PRIVACY_DATA_SAFETY_CONSENT_PLAN.md';
const requiredFiles = [
  docPath,
  'TODO.md',
  'DEVELOPMENT_LOG.md',
  'CHANGELOG.md',
  'package.json',
];

const todoHeading = '## AdMob Privacy, Data Safety, and Consent Plan TODO';
const devLogHeading = '## AdMob Privacy, Data Safety, and Consent Plan';

const requiredDocSnippets = [
  '# AdMob Privacy, Data Safety, and Consent Plan',
  'Verification date: 2026-07-26',
  'PR type: docs/check-only',
  'AdMob app verification: Completed',
  'App readiness review: Completed — Approved',
  'App-level ad serving limit: Lifted',
  'AdMob account verification: In progress',
  'Ad units: 0',
  'Google Mobile Ads SDK integration: Not started',
  'UMP SDK integration: Not started',
  'Actual advertisement serving: Pending',
  'Google Mobile Ads SDK data disclosure candidate',
  'Google Play Data safety response candidate',
  'Advertising ID decision',
  'Privacy policy update draft',
  'UMP consent flow design',
  'Consent failure and fallback behavior',
  'Privacy options entry point candidate',
  'General audience and child-directed review',
  'App approval does not mean account verification completed',
  'A policy draft does not mean the production policy is updated',
  'Data safety response candidates do not mean the Play form is submitted',
];

const requiredTodoSnippets = [
  '- [x] AdMob app approval result recording',
  '- [x] App-level ad serving limit result recording',
  '- [x] Privacy baseline investigation',
  '- [x] Mobile Ads SDK data disclosure candidate',
  '- [x] Google Play Data safety response draft',
  '- [x] Advertising ID decision gate',
  '- [x] Privacy policy advertising change draft',
  '- [x] UMP consent flow design',
  '- [x] Consent fallback principles',
  '- [x] Privacy options entry point candidate',
  '- [x] Target audience and Families review plan',
  '- [x] Implementation and release gates',
  '- [x] Validation script',
  '- [ ] AdMob account verification',
  '- [ ] Ad unit creation',
  '- [ ] Exact SDK version selection',
  '- [ ] Implementation approach selection',
  '- [ ] Advertising ID collection decision',
  '- [ ] Merged manifest AD_ID review',
  '- [ ] AdMob Privacy & Messaging configuration',
  '- [ ] Privacy policy legal wording review',
  '- [ ] Privacy policy production deployment',
  '- [ ] Google Play Data safety final answers',
  '- [ ] Google Play Data safety submission',
  '- [ ] Target audience and Families status confirmation',
  '- [ ] Google Mobile Ads SDK integration',
  '- [ ] UMP SDK integration',
  '- [ ] Privacy options UI implementation',
  '- [ ] Official test ad verification',
  '- [ ] Consent Android QA',
  '- [ ] Actual advertisement serving',
  '- [ ] First advertising update release',
];

const requiredDevLogSnippets = [
  'Verification date: 2026-07-26',
  'Status: Docs/check-only',
  'AdMob app verification: Completed',
  'App readiness review: Completed — Approved',
  'App-level ad serving limit: Lifted',
  'AdMob account verification: In progress',
  'Ad units: 0',
  'Google Mobile Ads SDK integration: Not started',
  'UMP SDK integration: Not started',
  'Actual advertisement serving: Pending',
  'app-ads.txt verification: Completed',
  'Privacy baseline investigation: Completed',
  'Data safety response draft: Completed',
  'Advertising ID collection decision: Pending',
  'Consent flow design: Completed',
  'production privacy policy 변경 없음',
  'Android/Gradle/Capacitor 변경 없음',
  'dependency/package-lock 변경 없음',
  '실제 ID 또는 개인정보 추가 없음',
];

const requiredChangelogSnippets = [
  'Recorded the completed AdMob app verification and approval result.',
  'Added the AdMob privacy, Data safety, and consent plan.',
  'Added privacy policy change candidates, Data safety response candidates, UMP flow, Advertising ID gates, and release requirements.',
  'Added the AdMob privacy, Data safety, and consent plan validation check.',
  '- AdMob account verification',
  '- Ad unit creation',
  '- SDK version and implementation selection',
  '- Advertising ID decision',
  '- Privacy & Messaging configuration',
  '- Privacy policy production update',
  '- Google Play Data safety submission',
  '- Target audience and Families status confirmation',
  '- Google Mobile Ads and UMP SDK integration',
  '- Android consent and advertising QA',
  '- Actual advertisement serving',
  '- First advertising update release',
];

const forbiddenClaims = [
  'AdMob account verification: Completed',
  'Ad unit creation: Completed',
  'Google Mobile Ads SDK integration: Completed',
  'UMP SDK integration: Completed',
  'Privacy policy production update: Completed',
  'Google Play Data safety update: Completed',
  'Play Console Data safety submission: Completed',
  'Advertising ID declaration: Completed',
  'Privacy & Messaging configuration: Completed',
  'Consent Android QA: Completed',
  'Actual advertisement serving: Completed',
  'First advertising update release: Completed',
  'Ads are live',
  'Production ads enabled',
  'All privacy work completed',
  'Legal review completed',
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
  console.error('AdMob privacy, Data safety, and consent plan check failed.');
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const todo = fs.readFileSync('TODO.md', 'utf8');
const devLog = fs.readFileSync('DEVELOPMENT_LOG.md', 'utf8');
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const packageJsonText = fs.readFileSync('package.json', 'utf8');
const todoSection = sectionText(todo, todoHeading);
const devLogSection = sectionText(devLog, devLogHeading);

logResult('todo_has_new_section', todoSection.length > 0);
logResult('dev_log_has_new_section', devLogSection.length > 0);

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
  logResult(`changelog_includes_${labelFromSnippet(snippet)}`, changelog.includes(snippet));
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

const interpretationRules = [
  'App approval does not mean account verification completed',
  'App approval does not mean actual ads are serving',
  'A policy draft does not mean the production policy is updated',
  'Data safety response candidates do not mean the Play form is submitted',
  'Consent flow design does not mean UMP is integrated',
];

for (const rule of interpretationRules) {
  logResult(`doc_has_caution_${labelFromSnippet(rule)}`, doc.includes(rule));
}

let packageJson;
try {
  packageJson = JSON.parse(packageJsonText);
  logResult('package_json_parses', true);
} catch (error) {
  logResult('package_json_parses', false, error.message);
}

logResult(
  'package_json_has_plan_script',
  packageJson?.scripts?.['check:admob-privacy-data-safety-consent-plan']
    === 'node scripts/checkAdMobPrivacyDataSafetyConsentPlan.mjs',
);

const changedContent = [doc, todoSection, devLogSection, changelog].join('\n');
const sensitivePatterns = [
  ['actual_admob_app_or_unit_id', /\bca-app-pub-\d{16}[~/]\d{10}\b/u],
  ['actual_publisher_id', /\bpub-\d{16}\b/u],
  ['test_device_id_value', /(?:test device id|테스트 기기 ID)\s*[:=]\s*[A-F0-9-]{8,}/iu],
  ['android_advertising_id_value', /(?:advertising id|광고 ID)\s*[:=]\s*[A-F0-9-]{16,}/iu],
  ['payment_profile_id_value', /(?:payment profile id|결제 프로필 ID)\s*[:=]\s*[A-Z0-9-]{6,}/iu],
  ['email_address', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu],
  ['bank_account_number', /(?:bank account|계좌번호)\s*[:=]\s*[\d-]{8,}/iu],
  ['token_or_credential_value', /(?:token|credential|api key|secret)\s*[:=]\s*['"][^'"\s]{8,}['"]/iu],
  ['private_key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u],
  ['keystore_or_signing_value', /(?:storePassword|keyPassword|keystorePassword)\s*[:=]\s*['"][^'"\s]{3,}['"]/u],
  ['street_address', /(?:상세 주소|street address)\s*[:=]\s*\S.{8,}/iu],
];

for (const [name, pattern] of sensitivePatterns) {
  logResult(`changed_content_excludes_${name}`, !pattern.test(changedContent));
}

logResult(
  'abstract_admob_id_example_is_allowed',
  !doc.includes('ca-app-pub-') || doc.includes('ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy'),
);

if (hasFailure) {
  console.error('AdMob privacy, Data safety, and consent plan check failed.');
  process.exit(1);
}

console.log('AdMob privacy, Data safety, and consent plan check passed');
