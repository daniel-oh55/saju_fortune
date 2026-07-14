import fs from 'node:fs';

const docPath = 'docs/GOOGLE_PLAY_SUBMISSION_RECORD.md';

const requiredDocSnippets = [
  '# Google Play Submission Record',
  'Status: Google Play submission request recorded',
  'Final pre-submission review: Completed',
  'Google Play AAB upload: Completed',
  'App submission/review request: Completed',
  'Google Play review result: Pending',
  'Production release live: Pending',
  'Purpose: Record Google Play Console app submission/review request completion',
  'PR type: docs/check-only',
  'The app was submitted manually to Google Play Console for review',
  'This PR does not record Google Play review approval',
  'This PR does not record production release live status',
  'This PR does not commit AAB files',
  'This PR does not add real keystore files',
  'This PR does not add signing credentials',
  'This PR does not change production UI or app logic',
  '## 2. Submission record',
  '| Final pre-submission review | Completed | Recorded in PR #392 |',
  '| Google Play AAB upload | Completed | Recorded in PR #391 |',
  '| App submission/review request | Completed | Submitted manually in Google Play Console |',
  '| Google Play review result | Pending | Waiting for Google review result |',
  '| Production release live | Pending | Not confirmed until review/release status is live |',
  '## 3. Submitted assets and inputs',
  '| Store screenshot upload | Completed |',
  '| App icon final upload | Completed |',
  '| Feature graphic final upload | Completed |',
  '| Google Play Console actual input | Completed |',
  '| Google Play 데이터 보안 양식 최종 입력 | Completed |',
  '| Release AAB generation | Completed |',
  '| Google Play AAB upload | Completed |',
  '## 4. Not included in this PR',
  'No Google Play review approval',
  'No production release live confirmation',
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
  '| Google Play review result | Pending |',
  '| Production release live | Pending |',
  '| Post-review release verification | Pending |',
  'This PR records Google Play app submission/review request completion only.',
  'Google Play review result and production release live status remain Pending.',
  'No AAB file, keystore file, signing credential, production UI, fortune logic, routing, schemaVersion, localStorage key, image, review approval, or production live confirmation is included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Google Play review result: Completed',
  'Google Play review result | Completed',
  'google play review result 완료',
  'Production release live: Completed',
  'Production release live | Completed',
  'production release live 완료',
  'AAB committed to repo | YES',
  'keystore file committed',
  'signing credentials committed',
];

const requiredTodoSnippets = [
  '- [x] App submission/review request',
  '- [x] Google Play submission record 작성',
  '- [x] Google Play submission record 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] Google Play review result',
  '- [ ] Production release live',
  '- [ ] Post-review release verification',
];

const requiredDevLogSnippets = [
  '## Google Play Submission Record',
  'PR 목적: Google Play app submission/review request completion 기록',
  'Status: Docs/check-only',
  'Final pre-submission review: Completed',
  'Google Play AAB upload: Completed',
  'App submission/review request: Completed',
  'Google Play review result: Pending',
  'Production release live: Pending',
  '실제 AAB 파일 추가 없음',
  '실제 keystore 파일 추가 없음',
  'signing credentials 추가 없음',
  'committed secrets 없음',
  'Google Play review approval 없음',
  'production release live confirmation 없음',
  'production UI 변경 없음',
  'src/CSS/Android/Gradle/Capacitor 변경 없음',
  '운세 로직/routing/schemaVersion/localStorage key 변경 없음',
];

const requiredChangelogSnippets = [
  'Recorded Google Play app submission/review request completion.',
  'Added Google Play submission record check.',
];

const requiredPackageJsonSnippets = [
  '"check:google-play-submission-record": "node scripts/checkGooglePlaySubmissionRecord.mjs"',
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
  console.error('Google Play submission record check failed.');
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

// docs/GOOGLE_PLAY_SUBMISSION_RECORD.md and CHANGELOG.md have no history of legitimately
// referencing these wrong phrases, so a whole-file scan is safe for them. TODO.md and
// DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g. documenting that
// a check for these phrases exists), so their scan is scoped to this PR's section only.
const todoSection = sectionText(todo, '## Google Play Submission Record TODO');
const devLogSection = sectionText(devLog, '## Google Play Submission Record');

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
  console.error('Google Play submission record check failed.');
  process.exit(1);
}

console.log('Google Play submission record check passed');
