import fs from 'node:fs';

const docPath = 'docs/GOOGLE_PLAY_AAB_UPLOAD_RECORD.md';

const requiredDocSnippets = [
  '# Google Play AAB Upload Record',
  'Status: Google Play AAB upload recorded',
  'Release AAB workflow: Completed',
  'Release build: Completed',
  'AAB generation: Completed',
  'Release AAB verification: Completed',
  'Release AAB artifact download: Completed',
  'Google Play AAB upload: Completed',
  'App submission/review request: Pending',
  'Purpose: Record Google Play Console AAB upload completion',
  'PR type: docs/check-only',
  'Release AAB was generated and verified in Android Release AAB #9',
  'The generated AAB was uploaded manually to Google Play Console',
  'This PR does not commit AAB files',
  'This PR does not add real keystore files',
  'This PR does not add signing credentials',
  'This PR does not submit the app for review',
  'This PR does not change production UI or app logic',
  '## 2. Completed AAB items',
  '| Release AAB workflow | Completed | Android Release AAB #9 succeeded |',
  '| Release build | Completed | Completed by GitHub Actions |',
  '| AAB generation | Completed | app-release.aab generated |',
  '| Release AAB verification | Completed | Verify signed release AAB step succeeded |',
  '| Release AAB artifact download | Completed | Artifact download confirmed |',
  '| Google Play AAB upload | Completed | Uploaded manually to Google Play Console |',
  '## 3. Upload record',
  '| Source workflow | Android Release AAB #9 |',
  '| Source artifact | harupuli-release-aab |',
  '| AAB file name | app-release.aab |',
  '| AAB committed to repo | NO |',
  '| Google Play AAB upload | Completed |',
  '| App submission/review request | Pending |',
  '## 4. Not included in this PR',
  'No AAB file committed',
  'No real keystore file',
  'No signing credentials',
  'No committed secrets',
  'No app submission/review request',
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
  '| Final pre-submission review | Pending |',
  'This PR records Google Play AAB upload completion only.',
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
  '- [x] Google Play AAB upload',
  '- [x] Google Play AAB upload completion 기록',
  '- [x] Google Play AAB upload record 검증 스크립트 추가',
];

const pendingTodoSnippets = ['- [ ] Final pre-submission review', '- [ ] App submission/review request'];

const requiredDevLogSnippets = [
  '## Google Play AAB Upload Record',
  'PR 목적: Google Play AAB upload completion 기록',
  'Status: Docs/check-only',
  'Release AAB workflow: Completed',
  'Release build: Completed',
  'AAB generation: Completed',
  'Release AAB verification: Completed',
  'Release AAB artifact download: Completed',
  'Google Play AAB upload: Completed',
  'App submission/review request: Pending',
  'Source workflow: Android Release AAB #9',
  'Source artifact: harupuli-release-aab',
  'AAB file name: app-release.aab',
  'AAB committed to repo: NO',
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
  'Recorded Google Play AAB upload completion.',
  'Added Google Play AAB upload record check.',
];

const requiredPackageJsonSnippets = [
  '"check:google-play-aab-upload-record": "node scripts/checkGooglePlayAabUploadRecord.mjs"',
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
  console.error('Google Play AAB upload record check failed.');
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

// docs/GOOGLE_PLAY_AAB_UPLOAD_RECORD.md and CHANGELOG.md have no history of legitimately
// referencing these wrong phrases, so a whole-file scan is safe for them. TODO.md and
// DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g. documenting that
// a check for these phrases exists), so their scan is scoped to this PR's section only.
const todoSection = sectionText(todo, '## Google Play AAB Upload Record TODO');
const devLogSection = sectionText(devLog, '## Google Play AAB Upload Record');

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
  console.error('Google Play AAB upload record check failed.');
  process.exit(1);
}

console.log('Google Play AAB upload record check passed');
