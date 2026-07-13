import fs from 'node:fs';

const docPath = 'docs/STORE_SCREENSHOT_PRODUCTION_GUIDE.md';

const requiredDocSnippets = [
  '# Store Screenshot Production Guide',
  'Status: Store screenshot production guide recorded',
  'PR type: docs/check-only',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  'Store screenshot upload: Pending',
  'Google Play Console input: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Purpose: Define production criteria before creating actual store screenshot images',
  'This PR records screenshot production standards only',
  'This PR does not create actual store screenshot image files',
  'This PR does not upload screenshots to Google Play Console',
  'This PR does not change production UI or Android packaging',
  'Minimum required screenshot count: 6',
  'Recommended screenshot count: 6 to 8',
  '## 4. Recommended screenshot set',
  '## 5. Copy guidelines',
  '## 6. Production checklist before image creation',
  'Store screenshot copy improvements are not part of this PR',
  'Actual store screenshot image files will be created in a later PR',
  'No actual store screenshot image files',
  'No Store screenshot upload',
  'No Google Play Console input',
  'No Google Play 데이터 보안 양식 최종 입력',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
  'No src changes',
  'No CSS changes',
  'No image file changes',
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
  '| 실제 스토어 스크린샷 이미지 제작 | Pending |',
  '| Store screenshot upload | Pending |',
  '| Google Play Console actual input | Pending |',
  '| Google Play 데이터 보안 양식 최종 입력 | Pending |',
  '| Release build | Not started |',
  '| Signing setup | Not started |',
  '| AAB generation | Not started |',
  'This PR records store screenshot production standards only.',
  'No production code, UI, image file, Android packaging, signing, AAB, or Console input changes are included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  '실제 스토어 스크린샷 이미지 제작: Completed',
  '실제 스토어 스크린샷 이미지 제작 완료',
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
  '- [x] 실제 스토어 스크린샷 이미지 제작 기준 정리',
  '- [x] store screenshot production guide 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] 실제 스토어 스크린샷 이미지 제작',
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];

const requiredDevLogSnippets = [
  'Store Screenshot Production Guide',
  'PR 목적: 실제 스토어 스크린샷 이미지 제작 기준 정리',
  'Status: Docs/check-only',
  '실제 스토어 스크린샷 이미지 제작 기준 정리: Completed',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  'Store screenshot upload: Pending',
  'Google Play Console actual input: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'production UI 변경 없음',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  '이미지 파일 변경 없음',
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
  'Added store screenshot production guide before creating actual store screenshot image files.',
  'Kept actual store screenshot image production, Store screenshot upload, Google Play Console input, release build, signing setup, and AAB generation out of scope.',
  'Added store screenshot production guide check.',
];

const requiredPackageJsonSnippets = [
  '"check:store-screenshot-production-guide": "node scripts/checkStoreScreenshotProductionGuide.mjs"',
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
  console.error('Store screenshot production guide check failed.');
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

// docs/STORE_SCREENSHOT_PRODUCTION_GUIDE.md and CHANGELOG.md have no history of
// legitimately referencing these wrong phrases, so a whole-file scan is safe for them.
// TODO.md and DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g.
// documenting that a check for these phrases exists), so their scan is scoped to this
// PR's section only.
const todoSection = sectionText(todo, '## Store Screenshot Production Guide TODO');
const devLogSection = sectionText(devLog, '## Store Screenshot Production Guide');

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
  console.error('Store screenshot production guide check failed.');
  process.exit(1);
}

console.log('Store screenshot production guide check passed');
