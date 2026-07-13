import fs from 'node:fs';

const docPath = 'docs/STORE_SCREENSHOT_ASSET_RECORD.md';
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
  '# Store Screenshot Asset Record',
  'Status: Actual store screenshot image production recorded',
  '기존 생성 스토어 스크린샷 이미지 사용: Confirmed',
  '실제 스토어 스크린샷 이미지 제작: Completed',
  'Store screenshot upload: Pending',
  'Google Play Console input: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Purpose: Record existing generated store screenshot image files for Google Play preparation',
  'PR type: asset/docs/check',
  'Existing generated screenshot images are used as final assets',
  'Output folder: store-assets/google-play/screenshots',
  'No new screenshot capture',
  'No new screenshot generation',
  'No image redesign',
  '## 2. Screenshot files',
  '| store-assets/google-play/screenshots/01-home.png | Home / 오늘의 운세 진입 화면 | Added |',
  '| store-assets/google-play/screenshots/02-time-slot-fortune.png | 오늘의 시간대 운세 / 아침·점심·저녁 카드 | Added |',
  '| store-assets/google-play/screenshots/03-today-flow-five-elements.png | 오늘흐름 / 오행 이미지 화면 | Added |',
  '| store-assets/google-play/screenshots/04-year-monthly-fortune.png | 2026년 월별 운세 화면 | Added |',
  '| store-assets/google-play/screenshots/05-zodiac-fortune.png | 띠별운세 화면 | Added |',
  '| store-assets/google-play/screenshots/06-daily-hints.png | 오늘의 힌트 / 저장한 풀이 화면 | Added |',
  'Existing generated images are used without redesign',
  'No unavailable features shown',
  'No login shown',
  'No payment or premium feature shown',
  'No actual ad SDK shown',
  'No server sync or account sync shown',
  'No AI 상담 feature shown as active',
  'No medical/legal/investment guarantee copy',
  'No exaggerated fortune guarantee copy',
  'No Store screenshot upload',
  'No Google Play Console input',
  'No Google Play 데이터 보안 양식 최종 입력',
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
  '| Store screenshot file QA | Pending |',
  '| Store screenshot upload | Pending |',
  '| Google Play Console actual input | Pending |',
  '| Google Play 데이터 보안 양식 최종 입력 | Pending |',
  '| Release build | Not started |',
  '| Signing setup | Not started |',
  '| AAB generation | Not started |',
  'This PR adds existing generated store screenshot image files as final Google Play screenshot assets.',
  'No production code, Android packaging, signing, AAB, or Console input changes are included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  'Store screenshot upload | Completed',
  'Store screenshot upload: Completed',
  'Store screenshot upload 완료',
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
  '- [x] 기존 생성 스토어 스크린샷 이미지 asset 등록',
  '- [x] 실제 스토어 스크린샷 이미지 제작',
  '- [x] store screenshot assets 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] Store screenshot file QA',
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];

const requiredDevLogSnippets = [
  'Store Screenshot Assets',
  'PR 목적: 기존 생성 스토어 스크린샷 이미지 asset 등록',
  'Status: Asset/docs/check',
  '기존 생성 스토어 스크린샷 이미지 사용: Confirmed',
  '실제 스토어 스크린샷 이미지 제작: Completed',
  '최종 이미지 수: 6',
  '출력 경로: store-assets/google-play/screenshots',
  'Store screenshot file QA: Pending',
  'Store screenshot upload: Pending',
  'Google Play Console actual input: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'production UI 변경 없음',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  'Google Play Console 입력 없음',
  'Store screenshot upload 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'AAB 생성 없음',
];

const requiredChangelogSnippets = [
  'Added 6 existing generated Google Play store screenshot image files as final screenshot assets.',
  'Recorded existing generated store screenshot image asset registration.',
  'Added store screenshot assets check.',
];

const requiredPackageJsonSnippets = [
  '"check:store-screenshot-assets": "node scripts/checkStoreScreenshotAssets.mjs"',
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
    const size = fs.statSync(fullPath).size;
    logResult(`screenshot_not_empty_${labelFromSnippet(file)}`, size > 0, `${size} bytes`);
  }
}

logResult('doc_exists', fs.existsSync(docPath));
if (!fs.existsSync(docPath)) {
  console.error('Store screenshot assets check failed.');
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

// docs/STORE_SCREENSHOT_ASSET_RECORD.md and CHANGELOG.md have no history of
// legitimately referencing these wrong phrases, so a whole-file scan is safe for them.
// TODO.md and DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g.
// documenting that a check for these phrases exists), so their scan is scoped to this
// PR's section only.
const todoSection = sectionText(todo, '## Store Screenshot Assets TODO');
const devLogSection = sectionText(devLog, '## Store Screenshot Assets');

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
  console.error('Store screenshot assets check failed.');
  process.exit(1);
}

console.log('Store screenshot assets check passed');
