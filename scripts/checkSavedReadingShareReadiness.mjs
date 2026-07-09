import fs from 'node:fs';

const resultDocPath = 'docs/SAVED_READING_SHARE_READINESS.md';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';

const read = (path) => fs.readFileSync(path, 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(resultDocPath), 'result_doc_exists');
if (!fs.existsSync(resultDocPath)) {
  console.error('Saved reading share readiness check failed');
  console.error('- result_doc_exists');
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);

const requiredSnippets = [
  'Saved Reading Share Readiness',
  'Purpose: Review saved reading share feature readiness before implementation',
  'Current implementation status: Pending',
  'PR type: docs/check-only',
  'Web Share API',
  'Copy share text to clipboard',
  'Direct KakaoTalk/SMS integration',
  'Recommended first implementation candidate for MVP',
  'Provide copy-to-clipboard fallback',
  'Do not add Kakao SDK',
  'Do not add SMS permission',
  'Start with text-based sharing only',
  'Safe share text guidelines',
  'No src changes',
  'No production UI changes',
  'No share button implementation',
  'No Web Share API implementation',
  'No clipboard implementation',
  'No Kakao SDK integration',
  'No SMS native integration',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No production fortune logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  'Saved reading share feature implementation',
  'Pending',
  'Kakao SDK integration',
  'Not started',
  'SMS permission/native integration',
  'Release build',
  'Signing setup',
  'AAB generation',
];
for (const snippet of requiredSnippets) {
  mark(resultDoc.includes(snippet), `result_doc_includes_${snippet}`);
}

const forbiddenSnippets = [
  'Saved reading share feature implementation: Completed',
  'KakaoTalk/SMS sharing implementation: Completed',
  'Kakao SDK integration: Completed',
  'SMS permission/native integration: Completed',
  'Android native share integration: Completed',
  'Share image generation: Completed',
  'AndroidManifest.xml update for sharing: Completed',
  'Web Share API implementation: Completed',
  'Copy-to-clipboard fallback implementation: Completed',
  '실제 공유 기능 구현 완료',
  '카카오톡 공유 구현 완료',
  'SMS 공유 구현 완료',
  'Kakao SDK 연동 완료',
  'AndroidManifest.xml 공유 권한 추가 완료',
  '공유 이미지 생성 완료',
];
for (const snippet of forbiddenSnippets) {
  mark(!resultDoc.includes(snippet), `result_doc_forbidden_absent_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] 저장한 풀이 공유 기능 구현',
  '- [ ] Web Share API 기반 공유 기능 검토',
  '- [ ] 공유 문구 복사 fallback 구현 검토',
  '- [ ] KakaoTalk/SMS 공유 경로 검토',
  '- [ ] Kakao SDK 연동 검토',
  '- [ ] SMS permission/native integration 검토',
  '- [ ] 공유 이미지 생성 기능 검토',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(developmentLogSource.includes('## Saved Reading Share Readiness'), 'development_log_has_section');
mark(
  changelogSource.includes('Documented saved reading share readiness before implementation.'),
  'changelog_records_readiness',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Saved reading share readiness check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Saved reading share readiness check passed');
