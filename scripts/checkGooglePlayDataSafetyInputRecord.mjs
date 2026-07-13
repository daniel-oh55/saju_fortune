import fs from 'node:fs';

const docPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_RECORD.md';

const requiredDocSnippets = [
  '# Google Play Data Safety Input Record',
  'Status: Google Play data safety input recorded',
  'Store screenshot upload: Completed',
  'App icon final upload: Completed',
  'Feature graphic final upload: Completed',
  'Google Play Console actual input: Completed',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'App submission/review request: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Purpose: Record Google Play 데이터 보안 양식 최종 입력 completion',
  'PR type: docs/check-only',
  'Google Play Console store listing input was already completed',
  'Google Play 데이터 보안 양식 최종 입력 was completed manually in Google Play Console',
  'This PR records data safety input completion only',
  'This PR does not submit the app for review',
  'This PR does not create release build/signing/AAB',
  'This PR does not change production UI or app logic',
  '## 2. Data safety basis',
  'Server DB: None',
  'Login: None',
  'Actual ad SDK: None',
  'Payment SDK: None',
  'External analytics SDK: None',
  'Storage basis: localStorage 중심',
  'Data safety source document: docs/GOOGLE_PLAY_DATA_SAFETY_FINAL_REVIEW.md',
  '| Google Play Console actual input | Completed | Recorded in PR #384 |',
  '| Google Play 데이터 보안 양식 최종 입력 | Completed | Entered and saved manually in Google Play Console |',
  '| Store screenshot upload | Completed | Recorded in PR #380 |',
  '| App icon final upload | Completed | Recorded in PR #383 |',
  '| Feature graphic final upload | Completed | Recorded in PR #383 |',
  'No app submission/review request',
  'No image file changes',
  'No new screenshot capture',
  'No new image generation',
  'No image redesign',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
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
  '| Release build | Not started |',
  '| Signing setup | Not started |',
  '| AAB generation | Not started |',
  'This PR records Google Play 데이터 보안 양식 최종 입력 completion only.',
  'No production code, image file, Android packaging, signing, AAB, or app submission changes are included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'App submission/review request: Completed',
  'App submission/review request | Completed',
  'app submission 완료',
  'Release build: Completed',
  'Release build | Completed',
  'release build 완료',
  'Signing setup: Completed',
  'Signing setup | Completed',
  'signing 설정 완료',
  'AAB generation: Completed',
  'AAB generation | Completed',
  'AAB 생성 완료',
];

const requiredTodoSnippets = [
  '- [x] Google Play 데이터 보안 양식 최종 입력',
  '- [x] Google Play 데이터 보안 양식 최종 입력 완료 기록',
  '- [x] google play data safety input record 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] App submission/review request',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];

const requiredDevLogSnippets = [
  '## Google Play Data Safety Input Record',
  'PR 목적: Google Play 데이터 보안 양식 최종 입력 완료 기록',
  'Status: Docs/check-only',
  'Google Play Console actual input: Completed',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'App submission/review request: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Server DB: None',
  'Login: None',
  'Actual ad SDK: None',
  'Payment SDK: None',
  'External analytics SDK: None',
  'Storage basis: localStorage 중심',
  '이미지 파일 변경 없음',
  '새 캡처 없음',
  '새 이미지 생성 없음',
  '이미지 재디자인 없음',
  'production UI 변경 없음',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android native/resource 변경 없음',
  'Gradle 변경 없음',
  'Capacitor config 변경 없음',
  '운세 문구/content 변경 없음',
  '운세 계산 로직 변경 없음',
  'routing 변경 없음',
  'schemaVersion 변경 없음',
  'CURRENT_FORTUNE_SCHEMA_VERSION 변경 없음',
  '기존 localStorage key 변경 없음',
  'app submission/review request 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'AAB 생성 없음',
];

const requiredChangelogSnippets = [
  'Recorded Google Play 데이터 보안 양식 최종 입력 completion.',
  'Kept app submission/review request, release build, signing setup, and AAB generation out of scope.',
  'Added Google Play data safety input record check.',
];

const requiredPackageJsonSnippets = [
  '"check:google-play-data-safety-input-record": "node scripts/checkGooglePlayDataSafetyInputRecord.mjs"',
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
  console.error('Google Play data safety input record check failed.');
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

// docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_RECORD.md and CHANGELOG.md have no history of
// legitimately referencing these wrong phrases, so a whole-file scan is safe for them.
// TODO.md and DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g.
// documenting that a check for these phrases exists), so their scan is scoped to this
// PR's section only.
const todoSection = sectionText(todo, '## Google Play Data Safety Input Record TODO');
const devLogSection = sectionText(devLog, '## Google Play Data Safety Input Record');

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

if (hasFailure) {
  console.error('Google Play data safety input record check failed.');
  process.exit(1);
}

console.log('Google Play data safety input record check passed');
