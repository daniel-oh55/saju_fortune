import fs from 'node:fs';

const docPath = 'docs/FINAL_PRE_SUBMISSION_REVIEW.md';

const requiredDocSnippets = [
  '# Final Pre-Submission Review',
  'Status: Final pre-submission review recorded',
  'Store screenshot upload: Completed',
  'App icon final upload: Completed',
  'Feature graphic final upload: Completed',
  'Google Play Console actual input: Completed',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'Release AAB workflow: Completed',
  'Release build: Completed',
  'AAB generation: Completed',
  'Release AAB verification: Completed',
  'Release AAB artifact download: Completed',
  'Google Play AAB upload: Completed',
  'Final pre-submission review: Completed',
  'App submission/review request: Pending',
  'Purpose: Record final pre-submission review before Google Play review request',
  'PR type: docs/check-only',
  'This PR records final readiness only',
  'This PR does not submit the app for review',
  'This PR does not commit AAB files',
  'This PR does not add real keystore files',
  'This PR does not add signing credentials',
  'This PR does not change production UI or app logic',
  '## 2. Completed release readiness items',
  '| Store screenshot upload | Completed | PR #380 |',
  '| App icon final upload | Completed | PR #383 |',
  '| Feature graphic final upload | Completed | PR #383 |',
  '| Google Play Console actual input | Completed | PR #384 |',
  '| Google Play 데이터 보안 양식 최종 입력 | Completed | PR #385 |',
  '| Release signing config | Completed | PR #387 |',
  '| Release AAB workflow readiness | Completed | PR #388 |',
  '| Release AAB generation | Completed | PR #390 |',
  '| Google Play AAB upload | Completed | PR #391 |',
  '## 3. Final review checklist',
  '| Privacy policy URL | Completed | Confirmed in Google Play Console input |',
  '| Contact email | Completed | Confirmed in Google Play Console input |',
  '| Store listing text | Completed | Confirmed in Google Play Console input |',
  '| Screenshots | Completed | Uploaded to Google Play Console |',
  '| App icon | Completed | Uploaded to Google Play Console |',
  '| Feature graphic | Completed | Uploaded to Google Play Console |',
  '| Data safety form | Completed | Saved in Google Play Console |',
  '| AAB upload | Completed | app-release.aab uploaded to Google Play Console |',
  '| Release notes | Completed | Korean release notes entered |',
  '| App submission/review request | Pending | Do not mark completed until user submits |',
  '## 4. Not included in this PR',
  'No app submission/review request',
  'No AAB file committed',
  'No real keystore file',
  'No signing credentials',
  'No committed secrets',
  'No image file changes',
  'No new screenshot capture',
  'No new image generation',
  'No image redesign',
  'No src changes',
  'No CSS changes',
  'No AndroidManifest.xml changes',
  'No Android native/resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No fortune copy/content changes',
  'No fortune calculation logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  '| App submission/review request | Pending |',
  'This PR records final pre-submission review completion only.',
  'App submission/review request remains Pending.',
  'No AAB file, keystore file, signing credential, production UI, fortune logic, routing, schemaVersion, localStorage key, image, or app submission changes are included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'App submission/review request: Completed',
  'App submission/review request | Completed',
  'app submission/review request 완료',
  'AAB committed to repo | YES',
  'keystore file committed',
  'signing credentials committed',
];

const requiredTodoSnippets = [
  '- [x] Final pre-submission review',
  '- [x] final pre-submission review record 작성',
  '- [x] final pre-submission review 검증 스크립트 추가',
];

const pendingTodoSnippets = ['- [ ] App submission/review request'];

const requiredDevLogSnippets = [
  '## Final Pre-Submission Review',
  'PR 목적: Google Play 심사 제출 전 최종 점검 기록',
  'Status: Docs/check-only',
  'Store screenshot upload: Completed',
  'App icon final upload: Completed',
  'Feature graphic final upload: Completed',
  'Google Play Console actual input: Completed',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'Release AAB workflow: Completed',
  'Release build: Completed',
  'AAB generation: Completed',
  'Release AAB verification: Completed',
  'Release AAB artifact download: Completed',
  'Google Play AAB upload: Completed',
  'Final pre-submission review: Completed',
  'App submission/review request: Pending',
  '실제 AAB 파일 추가 없음',
  '실제 keystore 파일 추가 없음',
  'signing credentials 추가 없음',
  'committed secrets 없음',
  'app submission/review request 없음',
  'production UI 변경 없음',
  'src/CSS/Android/Gradle/Capacitor 변경 없음',
  '운세 로직/routing/schemaVersion/localStorage key 변경 없음',
];

const requiredChangelogSnippets = [
  'Recorded final pre-submission review completion.',
  'Added final pre-submission review check.',
];

const requiredPackageJsonSnippets = [
  '"check:final-pre-submission-review": "node scripts/checkFinalPreSubmissionReview.mjs"',
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

logResult('doc_exists', fs.existsSync(docPath));
if (!fs.existsSync(docPath)) {
  console.error('Final pre-submission review check failed.');
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const todo = fs.readFileSync('TODO.md', 'utf8');
const devLog = fs.readFileSync('DEVELOPMENT_LOG.md', 'utf8');
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const packageJson = fs.readFileSync('package.json', 'utf8');

function sectionText(markdown, heading) {
  const start = markdown.indexOf(heading);
  if (start === -1) return '';
  const nextHeading = markdown.indexOf('\n## ', start + heading.length);
  return nextHeading === -1 ? markdown.slice(start) : markdown.slice(start, nextHeading);
}

for (const snippet of requiredDocSnippets) {
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, doc.includes(snippet));
}

// docs/FINAL_PRE_SUBMISSION_REVIEW.md and CHANGELOG.md have no history of legitimately
// referencing these wrong phrases, so a whole-file scan is safe for them. TODO.md and
// DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g. documenting that
// a check for these phrases exists), so their scan is scoped to this PR's section only.
const todoSection = sectionText(todo, '## Final Pre-Submission Review TODO');
const devLogSection = sectionText(devLog, '## Final Pre-Submission Review');

logResult('todo_has_section', todoSection.length > 0);
logResult('dev_log_has_section', devLogSection.length > 0);

for (const file of [
  ['doc', doc],
  ['todo_section', todoSection],
  ['dev_log_section', devLogSection],
  ['changelog', changelog],
]) {
  const [label, content] = file;
  for (const phrase of wrongPhrases) {
    logResult(`${label}_excludes_${labelFromSnippet(phrase)}`, !content.includes(phrase));
  }
}

for (const snippet of requiredTodoSnippets) {
  logResult(`todo_includes_${labelFromSnippet(snippet)}`, todo.includes(snippet));
}

for (const snippet of pendingTodoSnippets) {
  logResult(`todo_keeps_pending_${labelFromSnippet(snippet)}`, todo.includes(snippet));
}

for (const snippet of requiredDevLogSnippets) {
  logResult(`dev_log_includes_${labelFromSnippet(snippet)}`, devLog.includes(snippet));
}

for (const snippet of requiredChangelogSnippets) {
  logResult(`changelog_includes_${labelFromSnippet(snippet)}`, changelog.includes(snippet));
}

for (const snippet of requiredPackageJsonSnippets) {
  logResult(`package_json_includes_${labelFromSnippet(snippet)}`, packageJson.includes(snippet));
}

// Guard against real AAB/keystore files or password-like literal assignments entering the repo.
const binaryFileReferencePattern = /["'][^"'\s]+\.(aab|jks|keystore|p12|pem)["']/i;
const passwordAssignmentPattern = /(storePassword|keyPassword|keystorePassword)\s*[:=]\s*['"][^'"\s]{3,}['"]/;
logResult('doc_excludes_binary_file_reference', !binaryFileReferencePattern.test(doc));
logResult('doc_excludes_password_assignment', !passwordAssignmentPattern.test(doc));

if (hasFailure) {
  console.error('Final pre-submission review check failed.');
  process.exit(1);
}

console.log('Final pre-submission review check passed');
