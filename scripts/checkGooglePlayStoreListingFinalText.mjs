import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const resultDocPath = 'docs/GOOGLE_PLAY_STORE_LISTING_FINAL_TEXT.md';
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
  console.error('Google Play store listing final text check failed');
  console.error('- result_doc_exists');
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);
const packageJsonSource = read(packageJsonPath);

const requiredDocSnippets = [
  'Google Play Store Listing Final Text',
  'Status: Final text ready',
  'Store listing final text: Completed',
  'Google Play Console input: Pending',
  'Store screenshot upload: Pending',
  '개인정보 처리방침 URL: Pending',
  '문의처 이메일/지원 연락처: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Purpose: Finalize Google Play Store listing text before Console input',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Related Store listing draft PR: #332',
  'Related Store screenshot image QA PR: #341',
  'App title',
  '하루풀이',
  '오늘의 운세와 나의 사주 흐름을 차분하게 확인하는 운세 다이어리',
  '하루풀이는 오늘의 운세와 나의 사주 흐름을 차분하게 확인할 수 있는 운세 다이어리 앱입니다.',
  '운세 결과는 참고용 콘텐츠입니다.',
  '의료, 법률, 투자, 안전 관련 판단은 전문가의 조언을 우선하세요.',
  'Store asset reference',
  'No image file changes',
  'No new screenshot image files',
  'No src changes',
  'No CSS changes',
  'No production UI changes',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No Google Play Console input',
  'No Store screenshot upload',
  'No 개인정보 처리방침 URL finalization',
  'No 문의처 이메일/지원 연락처 finalization',
  'No Google Play 데이터 보안 양식 completion',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
  'No production fortune logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  'Recommended next sequence',
];
for (const snippet of requiredDocSnippets) {
  mark(resultDoc.includes(snippet), `result_doc_includes_${snippet}`);
}

const forbiddenPatterns = [
  /Store screenshot upload \| Completed/,
  /Google Play Console actual input \| Completed/,
  /개인정보 처리방침 URL \| Completed/,
  /문의처 이메일\/지원 연락처 확정 \| Completed/,
  /Google Play 데이터 보안 양식 \| Completed/,
  /Google Play 데이터 보안 양식 최종 입력 \| Completed/,
  /Release build \| Completed/,
  /Signing setup \| Completed/,
  /AAB generation \| Completed/,
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
  '- [x] Store listing 최종 문구 확정',
  '- [x] Google Play store listing final text 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] 개인정보 처리방침 URL 확정',
  '- [ ] 문의처 이메일/지원 연락처 확정',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(
  developmentLogSource.includes('## Google Play Store Listing Final Text'),
  'development_log_has_section',
);
mark(
  changelogSource.includes('Finalized Google Play Store listing text for launch preparation.'),
  'changelog_records_result_doc',
);

mark(
  packageJsonSource.includes(
    '"check:google-play-store-listing-final-text": "node scripts/checkGooglePlayStoreListingFinalText.mjs"',
  ),
  'package_json_has_check_script',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Google Play store listing final text check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Google Play store listing final text check passed');
