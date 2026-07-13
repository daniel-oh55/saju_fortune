import fs from 'node:fs';

const docPath = 'docs/STORE_SCREENSHOT_UPLOAD_PREP.md';
const screenshotDir = 'store-assets/google-play/screenshots';

const requiredScreenshotFiles = [
  '01-home.png',
  '02-time-slot-fortune.png',
  '03-today-flow-five-elements.png',
  '04-year-monthly-fortune.png',
  '05-zodiac-fortune.png',
  '06-daily-hints.png',
];

const requiredDocSnippets = [
  '# Store Screenshot Upload Preparation',
  'Status: Store screenshot upload preparation recorded',
  'Store screenshot file QA: Recorded',
  'Store screenshot upload: Pending',
  'Google Play Console input: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Purpose: Prepare manual Google Play store screenshot upload',
  'PR type: docs/check-only',
  'This PR does not upload screenshots',
  'This PR does not input anything into Google Play Console',
  'This PR does not modify screenshot image files',
  'This PR does not create release build/signing/AAB',
  'This PR does not change production UI or app logic',
  '## 2. Screenshot files ready for manual upload',
  '| 1 | store-assets/google-play/screenshots/01-home.png | Ready | Pending upload |',
  '| 2 | store-assets/google-play/screenshots/02-time-slot-fortune.png | Ready | Pending upload |',
  '| 3 | store-assets/google-play/screenshots/03-today-flow-five-elements.png | Ready | Pending upload |',
  '| 4 | store-assets/google-play/screenshots/04-year-monthly-fortune.png | Ready | Pending upload |',
  '| 5 | store-assets/google-play/screenshots/05-zodiac-fortune.png | Ready | Pending upload |',
  '| 6 | store-assets/google-play/screenshots/06-daily-hints.png | Ready | Pending upload |',
  'Confirm Google Play Console app entry is available',
  'Confirm app listing screenshot section is ready for manual upload',
  'Upload the 6 prepared screenshot files manually',
  'Keep screenshot order consistent with the file numbering',
  'Do not upload unrelated draft/candidate images',
  'Do not mark upload as completed until actual upload is done in Google Play Console',
  'After upload, create a separate PR to record upload completion',
  'Dedicated 오늘운세 결과 화면 screenshot is not included in the current 6 existing generated images.',
  'No Store screenshot upload',
  'No Google Play Console input',
  'No Google Play 데이터 보안 양식 최종 입력',
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
  '| Store screenshot upload | Pending |',
  '| Google Play Console actual input | Pending |',
  '| Google Play 데이터 보안 양식 최종 입력 | Pending |',
  '| Release build | Not started |',
  '| Signing setup | Not started |',
  '| AAB generation | Not started |',
  'This PR records store screenshot upload preparation only.',
  'No production code, image file, Android packaging, signing, AAB, or Console input changes are included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  'Store screenshot file QA: Pending',
  'Store screenshot upload | Completed',
  'Store screenshot upload: Completed',
  // Excludes the legitimate "Store screenshot upload 완료 기록" (upload *completion
  // record*, itself Pending in this PR) via negative lookahead, while still catching a
  // false claim like "Store screenshot upload 완료" on its own.
  /Store screenshot upload 완료(?! 기록)/,
  'Upload readiness: Completed',
  'Pending upload | Completed',
  'Google Play Console input: Completed',
  'Google Play Console actual input: Completed',
  'Google Play Console actual input | Completed',
  'Google Play Console 입력 완료',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'Google Play 데이터 보안 양식 최종 입력 | Completed',
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
  '- [x] Store screenshot upload 준비 문서화',
  '- [x] store screenshot upload preparation 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] Store screenshot upload',
  '- [ ] Store screenshot upload 완료 기록',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];

const requiredDevLogSnippets = [
  '## Store Screenshot Upload Preparation',
  'PR 목적: Store screenshot upload 준비 문서화',
  'Status: Docs/check-only',
  'Store screenshot upload 준비 문서화: Completed',
  'Store screenshot file QA: Recorded',
  'Store screenshot upload: Pending',
  'Store screenshot upload 완료 기록: Pending',
  'Google Play Console actual input: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
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
  'Google Play Console 입력 없음',
  'Store screenshot upload 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'AAB 생성 없음',
];

const requiredChangelogSnippets = [
  'Added store screenshot upload preparation checklist.',
  'Kept Store screenshot upload and Google Play Console input out of scope.',
  'Added store screenshot upload preparation check.',
];

const requiredPackageJsonSnippets = [
  '"check:store-screenshot-upload-prep": "node scripts/checkStoreScreenshotUploadPrep.mjs"',
];

let hasFailure = false;

function logResult(name, passed, detail = '') {
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${name}${detail ? ` - ${detail}` : ''}`);
  if (!passed) hasFailure = true;
}

function labelFromSnippet(snippet) {
  const text = snippet instanceof RegExp ? snippet.source : snippet;
  return text
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\p{L}\p{N}_/-]/gu, '')
    .slice(0, 80);
}

function contentExcludesPhrase(content, phrase) {
  return phrase instanceof RegExp ? !phrase.test(content) : !content.includes(phrase);
}

for (const file of requiredScreenshotFiles) {
  const fullPath = `${screenshotDir}/${file}`;
  const exists = fs.existsSync(fullPath);
  logResult(`screenshot_exists_${labelFromSnippet(file)}`, exists);
  if (exists) {
    const buffer = fs.readFileSync(fullPath);
    logResult(`screenshot_not_empty_${labelFromSnippet(file)}`, buffer.length > 0, `${buffer.length} bytes`);
  }
}

logResult('doc_exists', fs.existsSync(docPath));
if (!fs.existsSync(docPath)) {
  console.error('Store screenshot upload preparation check failed.');
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

// docs/STORE_SCREENSHOT_UPLOAD_PREP.md and CHANGELOG.md have no history of
// legitimately referencing these wrong phrases, so a whole-file scan is safe for them.
// TODO.md and DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g.
// documenting that a check for these phrases exists), so their scan is scoped to this
// PR's section only.
const todoSection = sectionText(todo, '## Store Screenshot Upload Preparation TODO');
const devLogSection = sectionText(devLog, '## Store Screenshot Upload Preparation');

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
    logResult(`${label}_excludes_${labelFromSnippet(phrase)}`, contentExcludesPhrase(content, phrase));
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
  console.error('Store screenshot upload preparation check failed.');
  process.exit(1);
}

console.log('Store screenshot upload preparation check passed');
