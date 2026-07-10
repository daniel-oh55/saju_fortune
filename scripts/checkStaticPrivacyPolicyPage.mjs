import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const privacyPagePath = 'public/privacy-policy/index.html';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';
const packageJsonPath = 'package.json';

const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(path.join(projectRoot, privacyPagePath)), 'privacy_page_exists');
if (!fs.existsSync(path.join(projectRoot, privacyPagePath))) {
  console.error('Static privacy policy page check failed');
  console.error('- privacy_page_exists');
  process.exit(1);
}

const privacyPage = read(privacyPagePath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);
const packageJsonSource = read(packageJsonPath);

const requiredPageSnippets = [
  '하루풀이 개인정보 처리방침',
  '시행일: 2026년 7월 12일',
  '제공자/운영자: 하루풀이 운영자',
  'support.hym@gmail.com',
  '개인정보 처리방침 목적',
  '수집 또는 입력될 수 있는 정보',
  '생년월일',
  '출생시간',
  '출생지역',
  '성별',
  '사용자가 입력한 프로필 정보',
  '저장한 운세/풀이 기록',
  '앱 사용 중 사용자가 직접 저장한 데이터',
  '개인정보 저장 방식',
  '현재 하루풀이는 서버 DB를 사용하지 않습니다.',
  '현재 하루풀이는 로그인 기능을 사용하지 않습니다.',
  '기기 내 저장소',
  'localStorage',
  'Android 앱 환경',
  'WebView 저장소',
  '개인정보 이용 목적',
  '오늘의 운세 제공',
  '나의 사주 흐름 제공',
  '2026 운세 제공',
  '띠별운세 제공',
  '저장한 풀이 다시 보기',
  '제3자 제공',
  '실제 광고 SDK',
  '결제 SDK',
  '외부 분석 SDK',
  '개인정보 보관 및 삭제',
  '아동의 개인정보',
  '이용자 권리',
  '문의처',
  '변경 고지',
  '본 개인정보 처리방침은 하루풀이 앱의 현재 구현 상태를 기준으로 작성되었습니다.',
  '현재 하루풀이는 서버 DB, 로그인, 실제 광고 SDK, 실제 결제 SDK, 외부 분석 SDK를 사용하지 않습니다.',
];
for (const snippet of requiredPageSnippets) {
  mark(privacyPage.includes(snippet), `page_includes_${snippet}`);
}

const forbiddenPageSnippets = [
  '회원가입 정보를 수집합니다',
  '결제 정보를 수집합니다',
  '광고 식별자를 수집합니다',
  '외부 분석 SDK를 사용합니다',
  '서버 DB에 저장합니다',
  '제3자에게 판매합니다',
  'Google Analytics',
  'Firebase Analytics',
  'AdMob',
  '결제 SDK를 사용합니다',
  '로그인 기능을 사용합니다',
  '개인정보 처리방침 URL 확정',
  'Google Play Console 입력 완료',
  'Store screenshot upload 완료',
  'release build 완료',
  'signing 설정 완료',
  'AAB 생성 완료',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];
for (const snippet of forbiddenPageSnippets) {
  mark(!privacyPage.includes(snippet), `page_excludes_${snippet}`);
}

const forbiddenExternalResourcePatterns = [
  /<script/i,
  /http:\/\//,
  /https:\/\//,
  /fonts\.googleapis/i,
  /googletagmanager/i,
  /google-analytics/i,
  /firebase/i,
  /admob/i,
  /<iframe/i,
  /<img/i,
  /<link\s+rel="stylesheet"/i,
];
mark(
  !forbiddenExternalResourcePatterns.some((pattern) => pattern.test(privacyPage)),
  'page_has_no_external_resource_patterns',
);

const requiredTodoCompletedSnippets = [
  '- [x] 개인정보 처리방침 정적 공개 페이지 추가',
  '- [x] Static privacy policy page 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] 문의처 이메일/지원 연락처 확정',
  '- [ ] 시행일 확정',
  '- [ ] 제공자 정보 확정',
  '- [ ] 개인정보 처리방침 URL 후보 선정',
  '- [ ] 개인정보 처리방침 URL 확정',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

const requiredDevelopmentLogSnippets = [
  '## Static Privacy Policy Page Check',
  'PR 목적: 개인정보 처리방침 정적 공개 페이지 검증 스크립트 추가',
  'Status: Check alignment only',
  'Static privacy policy page check: Completed',
  'Privacy policy public page implementation: Completed',
  'Privacy page route implementation: Not changed',
  '개인정보 처리방침 URL 후보 선정: Pending',
  '개인정보 처리방침 URL 확정: Pending',
  '문의처 이메일/지원 연락처 확정: Pending',
  '시행일 확정: Pending',
  '제공자 정보 확정: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Google Play Console actual input: Pending',
  'Store screenshot upload: Pending',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  'production 앱 UI 변경 없음',
  'React routing 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android native/resource 변경 없음',
  'Gradle 변경 없음',
  'Capacitor config 변경 없음',
  'Google Play Console 입력 없음',
  '개인정보 처리방침 URL 확정 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'AAB 생성 없음',
  'production 계산 로직 변경 없음',
  'schemaVersion 변경 없음',
  'CURRENT_FORTUNE_SCHEMA_VERSION 변경 없음',
  '기존 localStorage key 변경 없음',
];
for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_includes_${snippet}`);
}

const requiredChangelogSnippets = [
  'Added static privacy policy page verification check.',
  'Aligned privacy checks after adding public/privacy-policy/index.html.',
];
for (const snippet of requiredChangelogSnippets) {
  mark(changelogSource.includes(snippet), `changelog_includes_${snippet}`);
}

mark(
  packageJsonSource.includes(
    '"check:static-privacy-policy-page": "node scripts/checkStaticPrivacyPolicyPage.mjs"',
  ),
  'package_json_has_check_script',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Static privacy policy page check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Static privacy policy page check passed');
