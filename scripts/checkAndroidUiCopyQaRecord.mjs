import fs from 'node:fs';

const docPath = 'docs/ANDROID_UI_COPY_QA_RECORD.md';

const requiredDocSnippets = [
  '# Android UI And Copy QA Record',
  'Status: Android UI and copy QA recorded',
  'Android 실제 기기 또는 에뮬레이터 화면 QA: Recorded',
  '오늘운세 문구 실생활형 개선 화면 확인: Verified',
  '홈 화면 오늘운세 카드 문구 잘림 없음: Verified',
  '홈 화면 아침/점심/저녁 카드 문구 표시 정상: Verified',
  '오늘의 시간대 운세 카드 배경 이미지 적용: Verified',
  '오늘의 시간대 운세 카드 배경 톤 밝기 보정: Verified',
  '오늘의 힌트 카드 통합: Verified',
  '띠별운세 동물 이미지 크기 확대: Verified',
  '오늘흐름 오행 이미지 추가: Verified',
  '화(火), 수(水), 목(木), 금(金), 토(土) 이미지 매핑: Verified',
  'Purpose: Record Android actual device or emulator QA after UI polish and practical today fortune copy improvement',
  'PR type: docs/check-only',
  'No production code changes',
  'No fortune copy/content changes',
  'No image file changes',
  'No Android native/resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No Google Play Console input',
  'No Store screenshot upload',
  'No release build/signing/AAB',
  '## 2. Android QA checklist',
  '| App install | YES | Recorded |',
  '| App launch | YES | Recorded |',
  '| Home today fortune card copy clipping | YES | Recorded |',
  '| Home time-slot card copy display | YES | Recorded |',
  '| Home time-slot background images | YES | Recorded |',
  '| Home time-slot brighter ivory/cream tone | YES | Recorded |',
  '| 오늘의 힌트 card | YES | Recorded |',
  '| Zodiac animal icon size | YES | Recorded |',
  '| Today flow five element images | YES | Recorded |',
  '| 화(火), 수(水), 목(木), 금(金), 토(土) image mapping | YES | Recorded |',
  '| Main screen navigation | YES | Recorded |',
  '| Android back behavior | YES | Recorded |',
  '| No obvious layout clipping/breakage | YES | Recorded |',
  'No src changes',
  'No CSS changes',
  'No new image files',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No routing changes',
  'No fortune calculation logic changes',
  'No fortune result generation logic changes',
  'No five element calculation logic changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  'No Google Play 데이터 보안 양식 최종 입력',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
  '| 디자인 변경 후 실제 스토어 스크린샷 이미지 제작 | Pending |',
  '| Store screenshot upload | Pending |',
  '| Google Play Console actual input | Pending |',
  '| Google Play 데이터 보안 양식 최종 입력 | Pending |',
  '| Release build | Not started |',
  '| Signing setup | Not started |',
  '| AAB generation | Not started |',
  'This PR records Android UI and copy QA results only.',
  'No production code, copy/content, image file, Android packaging, signing, AAB, or Console input changes are included.',
];

// Placeholder tokens that must never remain in the final recorded doc.
const placeholderPatterns = [
  '<ACTUAL_DEVICE_OR_EMULATOR>',
  '<USER_PROVIDED_DEVICE_OR_EMULATOR>',
  '<USER_PROVIDED_BUILD_BASIS>',
  '<YES_OR_NO>',
  'TBD',
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
  '- [x] Android 실제 기기 또는 에뮬레이터 UI/copy QA 기록',
  '- [x] Android UI and copy QA record 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] 디자인 변경 후 실제 스토어 스크린샷 이미지 제작',
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];

const requiredDevLogSnippets = [
  'Android UI And Copy QA Record',
  'PR 목적: Android 실제 기기 또는 에뮬레이터 UI/copy QA 기록',
  'Status: Android UI and copy QA recorded',
  'Android 실제 기기 또는 에뮬레이터 화면 QA: Recorded',
  '오늘운세 문구 실생활형 개선 화면 확인: Verified',
  '디자인 변경 후 실제 스토어 스크린샷 이미지 제작: Pending',
  'Google Play Console actual input: Pending',
  'Release build: Not started',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  '운세 문구/content 변경 없음',
  '이미지 파일 변경 없음',
  'Google Play Console 입력 없음',
  'Store screenshot upload 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'AAB 생성 없음',
];

const requiredChangelogSnippets = [
  'Recorded Android actual device or emulator UI/copy QA result after practical today fortune copy improvement.',
  'Kept Store screenshot upload, Google Play Console input, Google Play 데이터 보안 양식 최종 입력, release build, signing setup, and AAB generation as Pending/Not started.',
  'Added Android UI and copy QA record check.',
];

const requiredPackageJsonSnippets = [
  '"check:android-ui-copy-qa-record": "node scripts/checkAndroidUiCopyQaRecord.mjs"',
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
  console.error('Android UI and copy QA record check failed.');
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

for (const placeholder of placeholderPatterns) {
  logResult(`doc_excludes_placeholder_${labelFromSnippet(placeholder)}`, !doc.includes(placeholder));
}

// Every "QA item | Result | Status" table row must record YES or NO, never a
// placeholder or any other token, in the Result column. [^|\n] keeps each field
// scoped to a single line so this can't span across unrelated tables.
const qaRows = [...doc.matchAll(/\|[^|\n]+\|\s*([^|\n]+?)\s*\|\s*(?:Recorded|Not started|Pending)\s*\|/g)];
logResult('qa_table_has_rows', qaRows.length >= 13, `${qaRows.length} rows found`);
for (const row of qaRows) {
  const resultValue = row[1].trim();
  logResult(`qa_result_is_yes_or_no_${labelFromSnippet(row[0])}`, resultValue === 'YES' || resultValue === 'NO');
}

// docs/FORTUNE_COPY_STYLE_GUIDE.md and this new doc have no history of legitimately
// referencing these wrong phrases, so a whole-file scan is safe for them. TODO.md and
// DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g. documenting
// that a check for these phrases exists), so their scan is scoped to this PR's section.
const todoSection = sectionText(todo, '## Android UI And Copy QA Record TODO');
const devLogSection = sectionText(devLog, '## Android UI And Copy QA Record');

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
  console.error('Android UI and copy QA record check failed.');
  process.exit(1);
}

console.log('Android UI and copy QA record check passed');
