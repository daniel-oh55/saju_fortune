import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const resultDocPath = 'docs/UI_POLISH_MAIN_BROWSER_QA_RECORD.md';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';
const packageJsonPath = 'package.json';

const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(path.join(projectRoot, resultDocPath)), 'result_doc_exists');
if (!fs.existsSync(path.join(projectRoot, resultDocPath))) {
  console.error('UI polish main browser QA record check failed');
  console.error('- result_doc_exists');
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);
const packageJsonSource = read(packageJsonPath);

const requiredDocSnippets = [
  'UI Polish Main Browser QA Record',
  'Status: UI polish main browser QA recorded',
  'PR #364 UI polish main merge recovery: Completed',
  '오늘의 시간대 운세 카드 배경 이미지 적용: Completed',
  '오늘의 힌트 카드 통합: Completed',
  '띠별운세 동물 이미지 크기 확대: Completed',
  '오늘의 시간대 운세 카드 배경 톤 밝기 보정: Completed',
  '오늘흐름 오행 이미지 추가: Not started',
  'main 브라우저 화면 QA: Recorded',
  'Android 실제 기기 또는 에뮬레이터 화면 QA: Pending',
  '디자인 변경 후 실제 스토어 스크린샷 이미지 제작: Pending',
  'Store screenshot upload: Pending',
  'Google Play Console input: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Purpose: Record browser QA for UI polish changes after they were applied to main',
  'PR type: docs/check-only',
  'Related UI polish main recovery PR: #364',
  'Related time fortune card brightness polish PR: #365',
  'Android actual device QA remains Pending',
  'Emulator QA remains Pending',
  'APK install/launch QA remains Pending',
  'Home time-slot morning card background',
  'Home time-slot noon card background',
  'Home time-slot evening card background',
  'Deep navy text remains readable',
  '오늘의 힌트 card',
  'Zodiac animal icon size',
  'Mobile browser width layout',
  'src/assets/fortune-time/morning-fortune-bg.png',
  'src/assets/fortune-time/noon-fortune-bg.png',
  'src/assets/fortune-time/evening-fortune-bg.png',
  'src/pages/HomePage.jsx',
  'src/styles.css',
  'No src changes',
  'No CSS changes',
  'No image file changes',
  'No new image files',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No routing changes',
  'No fortune calculation logic changes',
  'No fortune result generation logic changes',
  'No zodiac result generation logic changes',
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
  'No Android actual device QA completion',
  'No Emulator QA completion',
  'No APK install QA completion',
  'No app launch QA completion',
  'Recommended next sequence',
];
for (const snippet of requiredDocSnippets) {
  mark(resultDoc.includes(snippet), `result_doc_includes_${snippet}`);
}

const forbiddenPatterns = [
  /Store screenshot upload\s*[|:]\s*Completed/,
  /Google Play Console actual input\s*[|:]\s*Completed/,
  /Google Play 데이터 보안 양식 최종 입력\s*[|:]\s*Completed/,
  /Release build\s*[|:]\s*Completed/,
  /Signing setup\s*[|:]\s*Completed/,
  /AAB generation\s*[|:]\s*Completed/,
  /Android 실제 기기 또는 에뮬레이터 화면 QA\s*[|:]\s*Completed/,
  /Emulator QA 완료/,
  /APK 설치 완료/,
  /앱 실행 완료/,
  /실제 스토어 스크린샷 이미지 시작/,
  /서양식 보정 적용 여부/,
  /양력\/음력 샘플 추가 검증/,
  /Google Play Console 입력 완료/,
  /Store screenshot upload 완료/,
  /release build 완료/,
  /signing 설정 완료/,
  /AAB 생성 완료/,
];
mark(
  !forbiddenPatterns.some((pattern) => pattern.test(resultDoc)),
  'result_doc_no_forbidden_snippets',
);

const requiredTodoCompletedSnippets = [
  '- [x] main 브라우저 화면 QA 기록',
  '- [x] UI polish main browser QA record 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] 오늘흐름 오행 이미지 추가',
  '- [ ] Android 실제 기기 또는 에뮬레이터 화면 QA',
  '- [ ] 디자인 변경 후 실제 스토어 스크린샷 이미지 제작',
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

const requiredDevelopmentLogSnippets = [
  '## UI Polish Main Browser QA Record',
  'PR 목적: UI polish main 브라우저 화면 QA 기록',
  'Status: UI polish main browser QA recorded',
  'PR #364 UI polish main merge recovery: Completed',
  '오늘의 시간대 운세 카드 배경 이미지 적용: Completed',
  '오늘의 힌트 카드 통합: Completed',
  '띠별운세 동물 이미지 크기 확대: Completed',
  '오늘의 시간대 운세 카드 배경 톤 밝기 보정: Completed',
  '오늘흐름 오행 이미지 추가: Not started',
  'main 브라우저 화면 QA: Recorded',
  'Android 실제 기기 또는 에뮬레이터 화면 QA: Pending',
  '디자인 변경 후 실제 스토어 스크린샷 이미지 제작: Pending',
  'Store screenshot upload: Pending',
  'Google Play Console actual input: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  '이미지 파일 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android native/resource 변경 없음',
  'Gradle 변경 없음',
  'Capacitor config 변경 없음',
  'routing 변경 없음',
  '운세 계산 로직 변경 없음',
  '운세 결과 생성 로직 변경 없음',
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
for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_includes_${snippet}`);
}

const requiredChangelogSnippets = [
  'Recorded main-branch browser QA result for UI polish changes.',
  'Kept Android actual device QA, Store screenshot upload, Google Play Console input, Google Play 데이터 보안 양식 최종 입력, release build, signing setup, and AAB generation as Pending/Not started.',
];
for (const snippet of requiredChangelogSnippets) {
  mark(changelogSource.includes(snippet), `changelog_includes_${snippet}`);
}

mark(
  packageJsonSource.includes(
    '"check:ui-polish-main-browser-qa-record": "node scripts/checkUiPolishMainBrowserQaRecord.mjs"',
  ),
  'package_json_has_check_script',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('UI polish main browser QA record check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('UI polish main browser QA record check passed');
