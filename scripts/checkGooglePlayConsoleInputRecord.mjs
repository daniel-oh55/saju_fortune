import fs from 'node:fs';

const docPath = 'docs/GOOGLE_PLAY_CONSOLE_INPUT_RECORD.md';

const requiredDocSnippets = [
  '# Google Play Console Input Record',
  'Status: Google Play Console input recorded',
  'Store screenshot upload: Completed',
  'App icon final upload: Completed',
  'Feature graphic final upload: Completed',
  'Google Play Console actual input: Completed',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'App submission/review request: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Purpose: Record Google Play Console store listing input completion',
  'PR type: docs/check-only',
  'Store screenshots, app icon, and feature graphic were already uploaded',
  'Store listing fields were entered and saved manually in Google Play Console',
  'This PR records Google Play Console input completion only',
  'This PR does not complete Google Play 데이터 보안 양식 최종 입력',
  'This PR does not submit the app for review',
  'This PR does not create release build/signing/AAB',
  'This PR does not change production UI or app logic',
  '## 2. Completed Console input items',
  '| Store screenshot upload | Completed | Recorded in PR #380 |',
  '| App icon final upload | Completed | Recorded in PR #383 |',
  '| Feature graphic final upload | Completed | Recorded in PR #383 |',
  '| App name | Completed | Entered in Google Play Console |',
  '| Short description | Completed | Entered in Google Play Console |',
  '| Full description | Completed | Entered in Google Play Console |',
  '| Privacy policy URL | Completed | Entered in Google Play Console |',
  '| Contact email | Completed | Entered in Google Play Console |',
  '| Category/tags | Completed | Entered in Google Play Console |',
  '| Ads declaration | Completed | Entered in Google Play Console |',
  '| App content-related settings | Completed | Entered in Google Play Console |',
  '| Target audience / content settings | Completed | Entered in Google Play Console |',
  'No Google Play 데이터 보안 양식 최종 입력',
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
  '| Google Play 데이터 보안 양식 최종 입력 | Pending |',
  '| App submission/review request | Pending |',
  '| Release build | Not started |',
  '| Signing setup | Not started |',
  '| AAB generation | Not started |',
  'This PR records Google Play Console actual input completion only.',
  'No production code, image file, Android packaging, signing, AAB, or app submission changes are included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'Google Play 데이터 보안 양식 최종 입력 | Completed',
  'app submission 완료',
  'App submission/review request: Completed',
  'App submission/review request | Completed',
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
  '- [x] Google Play Console 실제 입력',
  '- [x] Google Play Console 실제 입력 완료 기록',
  '- [x] google play console input record 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] App submission/review request',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];

const requiredDevLogSnippets = [
  '## Google Play Console Input Record',
  'PR 목적: Google Play Console 실제 입력 완료 기록',
  'Status: Docs/check-only',
  'Store screenshot upload: Completed',
  'App icon final upload: Completed',
  'Feature graphic final upload: Completed',
  'Google Play Console actual input: Completed',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'App submission/review request: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
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
  'Google Play 데이터 보안 양식 최종 입력 없음',
  'app submission/review request 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'AAB 생성 없음',
];

const requiredChangelogSnippets = [
  'Recorded Google Play Console actual input completion.',
  'Kept Google Play 데이터 보안 양식 최종 입력, app submission/review request, release build, signing setup, and AAB generation out of scope.',
  'Added Google Play Console input record check.',
];

const requiredPackageJsonSnippets = [
  '"check:google-play-console-input-record": "node scripts/checkGooglePlayConsoleInputRecord.mjs"',
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
  console.error('Google Play Console input record check failed.');
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

// docs/GOOGLE_PLAY_CONSOLE_INPUT_RECORD.md and CHANGELOG.md have no history of
// legitimately referencing these wrong phrases, so a whole-file scan is safe for them.
// TODO.md and DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g.
// documenting that a check for these phrases exists), so their scan is scoped to this
// PR's section only.
const todoSection = sectionText(todo, '## Google Play Console Input Record TODO');
const devLogSection = sectionText(devLog, '## Google Play Console Input Record');

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
  console.error('Google Play Console input record check failed.');
  process.exit(1);
}

console.log('Google Play Console input record check passed');
