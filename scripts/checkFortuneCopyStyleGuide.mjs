import fs from 'node:fs';

const docPath = 'docs/FORTUNE_COPY_STYLE_GUIDE.md';

const requiredDocSnippets = [
  'Fortune Copy Style Guide',
  'Status: Fortune copy style guide recorded',
  'PR type: docs/check-only',
  '운세 문구 스타일 가이드 정리: Completed',
  '오늘운세 문구 실생활형 개선: Not included',
  '스토어 스크린샷 문구 개선: Not included',
  'Purpose: Define copy standards before improving today fortune copy',
  'This PR does not change production fortune copy',
  'This PR does not change store screenshot copy',
  '감성은 유지하되, 사용자가 오늘 실제로 무엇을 하면 좋은지 알 수 있게 쓴다.',
  '추상적인 운세 문구를 생활 행동으로 연결한다.',
  '단정적 예언보다 부드러운 제안형 문장으로 쓴다.',
  '불안감을 자극하지 않는다.',
  'Today fortune sentence structure',
  'Time-slot fortune sentence structure',
  'Monthly fortune sentence structure',
  'Good copy examples',
  'Avoid',
  'Tone',
  'Next PR target: 오늘운세 문구 실생활형 개선',
  'Store screenshot copy improvements: Not included',
  '2026 monthly fortune copy improvement: Later',
  'Zodiac fortune copy improvement: Later',
  'No src changes',
  'No CSS changes',
  'No image file changes',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No routing changes',
  'No fortune copy/content changes',
  'No store screenshot copy improvements',
  'No fortune calculation logic changes',
  'No fortune result generation logic changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  'No Google Play Console input',
  'No Store screenshot upload',
  'No Google Play 데이터 보안 양식 최종 입력',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Store screenshot upload | Completed',
  'Store screenshot upload: Completed',
  'Google Play Console actual input | Completed',
  'Google Play Console actual input: Completed',
  'Google Play 데이터 보안 양식 최종 입력 | Completed',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'Release build | Completed',
  'Release build: Completed',
  'Signing setup | Completed',
  'Signing setup: Completed',
  'AAB generation | Completed',
  'AAB generation: Completed',
  'Google Play Console 입력 완료',
  'Store screenshot upload 완료',
  'release build 완료',
  'signing 설정 완료',
  'AAB 생성 완료',
];

const requiredTodoSnippets = [
  '- [x] 운세 문구 스타일 가이드 정리',
  '- [x] fortune copy style guide 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] 오늘운세 문구 실생활형 개선',
  '- [ ] Android 실제 기기 또는 에뮬레이터 화면 QA',
  '- [ ] 디자인 변경 후 실제 스토어 스크린샷 이미지 제작',
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];

const requiredDevLogSnippets = [
  'Fortune Copy Style Guide',
  'PR 목적: 운세 문구 스타일 가이드 정리',
  'Status: Docs/check-only',
  '운세 문구 스타일 가이드 정리: Completed',
  '오늘운세 문구 실생활형 개선: Not included',
  '스토어 스크린샷 문구 개선: Not included',
  'production UI 변경 없음',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  '이미지 파일 변경 없음',
  '운세 문구 내용 변경 없음',
  '운세 계산 로직 변경 없음',
  '운세 결과 생성 로직 변경 없음',
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
  'Added fortune copy style guide before practical today fortune copy improvement.',
  'Kept production fortune copy/content and store screenshot copy improvements out of scope.',
];

const requiredPackageJsonSnippets = [
  '"check:fortune-copy-style-guide": "node scripts/checkFortuneCopyStyleGuide.mjs"',
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
  console.error('Fortune copy style guide check failed.');
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

// TODO.md and DEVELOPMENT_LOG.md are running logs that legitimately reference these
// wrong phrases in past entries documenting that a check for them exists/passed
// (e.g. "AAB artifact 생성은 signing 설정 완료가 아님"). So the wrong-phrase scan for
// those two files is scoped to just the section this PR adds, not the whole log.
// docs/FORTUNE_COPY_STYLE_GUIDE.md and CHANGELOG.md have no such history yet, so a
// whole-file scan is used for them.
const todoSection = sectionText(todo, '## Fortune Copy Style Guide TODO');
const devLogSection = sectionText(devLog, '## Fortune Copy Style Guide');

logResult('todo_has_fortune_copy_style_guide_section', todoSection.length > 0);
logResult('dev_log_has_fortune_copy_style_guide_section', devLogSection.length > 0);

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
  console.error('Fortune copy style guide check failed.');
  process.exit(1);
}

console.log('Fortune copy style guide check passed');
