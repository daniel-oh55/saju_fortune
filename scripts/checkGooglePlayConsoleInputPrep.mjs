import fs from 'node:fs';

const docPath = 'docs/GOOGLE_PLAY_CONSOLE_INPUT_PREP.md';

const requiredDocSnippets = [
  '# Google Play Console Input Preparation',
  'Status: Google Play Console input preparation recorded',
  'Store screenshot upload: Completed',
  'Google Play Console input: Partial screenshot upload only',
  'Google Play Console actual input: Pending',
  'App icon final upload: Pending',
  'Feature graphic final upload: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'App submission/review request: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Purpose: Prepare full Google Play Console input after screenshot upload',
  'PR type: docs/check-only',
  'Store screenshot upload was completed in PR #380',
  'This PR does not complete full Google Play Console input',
  'This PR does not complete app icon or feature graphic finalization',
  'This PR does not complete Google Play 데이터 보안 양식 최종 입력',
  'This PR does not submit the app for review',
  'This PR does not create release build/signing/AAB',
  'This PR does not change production UI or app logic',
  '## 2. Completed Console-related items',
  '| Store screenshot upload | Completed | Recorded in PR #380 |',
  '| Store screenshot upload completion record | Completed | docs/check-only |',
  '| Screenshot count | Completed | 6 uploaded |',
  '## 3. Remaining Console input items',
  '| App icon final upload | Pending | Final 512 x 512px, <= 1MB asset must be confirmed |',
  '| Feature graphic final upload | Pending | Final 1024 x 500px asset must be confirmed |',
  '| Google Play 데이터 보안 양식 최종 입력 | Pending | Separate final confirmation required |',
  '| App submission/review request | Pending | Do not submit yet |',
  '| Release build | Not started | No release build yet |',
  '| Signing setup | Not started | No signing setup yet |',
  '| AAB generation | Not started | No AAB yet |',
  '## 4. Input source documents',
  'Store listing text source: docs/GOOGLE_PLAY_STORE_LISTING_FINAL_TEXT.md',
  'Data safety review source: docs/GOOGLE_PLAY_DATA_SAFETY_FINAL_REVIEW.md',
  'Privacy/contact values source: docs/PRIVACY_POLICY_FINAL_VALUES_CONFIRMATION.md',
  'Screenshot upload completion source: docs/STORE_SCREENSHOT_UPLOAD_COMPLETION_RECORD.md',
  'No full Google Play Console input completion',
  'No app icon final upload completion',
  'No feature graphic final upload completion',
  'No Google Play 데이터 보안 양식 최종 입력',
  'No app submission/review request',
  'No image file changes',
  'No new screenshot capture',
  'No new screenshot generation',
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
  '| App icon final upload | Pending |',
  '| Feature graphic final upload | Pending |',
  '| Google Play Console actual input | Pending |',
  '| Google Play 데이터 보안 양식 최종 입력 | Pending |',
  '| App content rating / questionnaire | Pending |',
  '| Target audience / content settings | Pending |',
  '| App submission/review request | Pending |',
  '| Release build | Not started |',
  '| Signing setup | Not started |',
  '| AAB generation | Not started |',
  'This PR records Google Play Console input preparation only.',
  'Store screenshot upload is completed, but full Google Play Console input is still Pending.',
  'No production code, image file, Android packaging, signing, AAB, or full Console input changes are included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Google Play Console input: Completed',
  'Google Play Console input | Completed',
  'Google Play Console actual input: Completed',
  'Google Play Console actual input | Completed',
  'Google Play Console 입력 완료',
  'full Google Play Console input completed',
  'App icon final upload: Completed',
  'App icon final upload | Completed',
  '앱 아이콘 최종 업로드 완료',
  'Feature graphic final upload: Completed',
  'Feature graphic final upload | Completed',
  '그래픽 이미지 최종 업로드 완료',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'Google Play 데이터 보안 양식 최종 입력 | Completed',
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
  '- [x] Google Play Console 실제 입력 준비 문서화',
  '- [x] google play console input preparation 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] App icon final upload',
  '- [ ] Feature graphic final upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] App content rating / questionnaire',
  '- [ ] Target audience / content settings',
  '- [ ] App submission/review request',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];

const requiredDevLogSnippets = [
  '## Google Play Console Input Preparation',
  'PR 목적: Google Play Console 실제 입력 준비 문서화',
  'Status: Docs/check-only',
  'Google Play Console 실제 입력 준비 문서화: Completed',
  'Store screenshot upload: Completed',
  'Google Play Console input: Partial screenshot upload only',
  'Google Play Console actual input: Pending',
  'App icon final upload: Pending',
  'Feature graphic final upload: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'App content rating / questionnaire: Pending',
  'Target audience / content settings: Pending',
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
  'full Google Play Console input 완료 없음',
  'Google Play 데이터 보안 양식 최종 입력 없음',
  'app submission/review request 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'AAB 생성 없음',
];

const requiredChangelogSnippets = [
  'Added Google Play Console input preparation checklist after Store screenshot upload completion.',
  'Kept full Google Play Console input, app icon final upload, feature graphic final upload, Google Play 데이터 보안 양식 최종 입력, app submission/review request, release build, signing setup, and AAB generation out of scope.',
  'Added Google Play Console input preparation check.',
];

const requiredPackageJsonSnippets = [
  '"check:google-play-console-input-prep": "node scripts/checkGooglePlayConsoleInputPrep.mjs"',
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
  console.error('Google Play Console input preparation check failed.');
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

// docs/GOOGLE_PLAY_CONSOLE_INPUT_PREP.md and CHANGELOG.md have no history of legitimately
// referencing these wrong phrases, so a whole-file scan is safe for them. TODO.md and
// DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g. documenting that
// a check for these phrases exists), so their scan is scoped to this PR's section only.
const todoSection = sectionText(todo, '## Google Play Console Input Preparation TODO');
const devLogSection = sectionText(devLog, '## Google Play Console Input Preparation');

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
  console.error('Google Play Console input preparation check failed.');
  process.exit(1);
}

console.log('Google Play Console input preparation check passed');
