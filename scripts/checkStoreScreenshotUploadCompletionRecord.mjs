import fs from 'node:fs';

const docPath = 'docs/STORE_SCREENSHOT_UPLOAD_COMPLETION_RECORD.md';
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
  '# Store Screenshot Upload Completion Record',
  'Status: Store screenshot upload completion recorded',
  'Store screenshot file QA: Recorded',
  'Store screenshot upload: Completed',
  'Uploaded screenshot count: 6',
  'Google Play Console input: Partial screenshot upload only',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Purpose: Record manual Google Play store screenshot upload completion',
  'PR type: docs/check-only',
  'Screenshot upload was completed manually in Google Play Console',
  'This PR records screenshot upload completion only',
  'This PR does not modify screenshot image files',
  'This PR does not complete full Google Play Console input',
  'This PR does not complete Google Play 데이터 보안 양식 최종 입력',
  'This PR does not create release build/signing/AAB',
  'This PR does not change production UI or app logic',
  '## 2. Uploaded screenshot files',
  '| 1 | store-assets/google-play/screenshots/01-home.png | YES | Uploaded |',
  '| 2 | store-assets/google-play/screenshots/02-time-slot-fortune.png | YES | Uploaded |',
  '| 3 | store-assets/google-play/screenshots/03-today-flow-five-elements.png | YES | Uploaded |',
  '| 4 | store-assets/google-play/screenshots/04-year-monthly-fortune.png | YES | Uploaded |',
  '| 5 | store-assets/google-play/screenshots/05-zodiac-fortune.png | YES | Uploaded |',
  '| 6 | store-assets/google-play/screenshots/06-daily-hints.png | YES | Uploaded |',
  'Google Play Console app listing screenshot section was accessed',
  '6 screenshot files were uploaded manually',
  'Upload order follows the file numbering',
  'Store screenshot upload is completed',
  'Google Play Console full listing input is not completed in this PR',
  'Google Play 데이터 보안 양식 최종 입력 is not completed in this PR',
  'App submission/review request is not completed in this PR',
  'No image file changes',
  'No new screenshot capture',
  'No new screenshot generation',
  'No image redesign',
  'No full Google Play Console input completion',
  'No Google Play 데이터 보안 양식 최종 입력',
  'No app submission/review request',
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
  '| Google Play Console actual input | Pending |',
  '| Google Play 데이터 보안 양식 최종 입력 | Pending |',
  '| App submission/review request | Pending |',
  '| Release build | Not started |',
  '| Signing setup | Not started |',
  '| AAB generation | Not started |',
  'This PR records Store screenshot upload completion only.',
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
  '- [x] Store screenshot upload',
  '- [x] Store screenshot upload 완료 기록',
  '- [x] store screenshot upload completion record 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] Google Play Console 실제 입력',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] App submission/review request',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];

const requiredDevLogSnippets = [
  '## Store Screenshot Upload Completion Record',
  'PR 목적: Store screenshot upload 완료 기록',
  'Status: Docs/check-only',
  'Store screenshot upload: Completed',
  'Store screenshot upload 완료 기록: Completed',
  'Uploaded screenshot count: 6',
  'Google Play Console input: Partial screenshot upload only',
  'Google Play Console actual input: Pending',
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
  'full Google Play Console input 완료 없음',
  'Google Play 데이터 보안 양식 최종 입력 없음',
  'app submission/review request 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'AAB 생성 없음',
];

const requiredChangelogSnippets = [
  'Recorded Store screenshot upload completion.',
  'Kept full Google Play Console input, Google Play 데이터 보안 양식 최종 입력, app submission/review request, release build, signing setup, and AAB generation out of scope.',
  'Added store screenshot upload completion record check.',
];

const requiredPackageJsonSnippets = [
  '"check:store-screenshot-upload-completion-record": "node scripts/checkStoreScreenshotUploadCompletionRecord.mjs"',
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
  console.error('Store screenshot upload completion record check failed.');
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

// docs/STORE_SCREENSHOT_UPLOAD_COMPLETION_RECORD.md and CHANGELOG.md have no history of
// legitimately referencing these wrong phrases, so a whole-file scan is safe for them.
// TODO.md and DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g.
// documenting that a check for these phrases exists), so their scan is scoped to this
// PR's section only.
const todoSection = sectionText(todo, '## Store Screenshot Upload Completion Record TODO');
const devLogSection = sectionText(devLog, '## Store Screenshot Upload Completion Record');

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
  console.error('Store screenshot upload completion record check failed.');
  process.exit(1);
}

console.log('Store screenshot upload completion record check passed');
