import fs from 'node:fs';
import path from 'node:path';
import {
  buildSavedReadingShareText,
  shareSavedReadingText,
} from '../src/utils/shareTextBuilder.js';

const rootDir = process.cwd();
const failures = [];

function mark(condition, label) {
  if (!condition) failures.push(label);
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

// A. Share utility source must expose the expected implementation surface.
const shareUtilPath = 'src/utils/shareTextBuilder.js';
const shareUtilSource = readFile(shareUtilPath);
const requiredUtilTokens = [
  'buildSavedReadingShareText',
  'shareSavedReadingText',
  'navigator.share',
  'navigator.clipboard',
  'writeText',
  '하루풀이',
];
for (const token of requiredUtilTokens) {
  mark(shareUtilSource.includes(token), `share_util_includes_${token}`);
}

// B. Share button component must expose the expected UI/a11y surface.
const shareButtonPath = 'src/components/SavedReadingShareButton.jsx';
const shareButtonSource = readFile(shareButtonPath);
const requiredUiTokens = ['공유하기', 'aria-label', 'aria-live'];
for (const token of requiredUiTokens) {
  mark(shareButtonSource.includes(token), `share_button_includes_${token}`);
}

const savedReadingsPagePath = 'src/pages/SavedReadingsPage.jsx';
const savedReadingsPageSource = readFile(savedReadingsPagePath);
mark(
  savedReadingsPageSource.includes('SavedReadingShareButton'),
  'saved_readings_page_uses_share_button',
);

// C. Forbidden Kakao/SMS/native-share/store-link markers must stay out of this PR's implementation scope.
// Scoped to the files actually touched by this PR, not the whole repo, so unrelated docs
// that discuss Kakao/SMS review status elsewhere do not produce false positives.
const scopedImplementationFiles = [shareUtilPath, shareButtonPath, savedReadingsPagePath, 'package.json'];
const forbiddenPatterns = [
  { label: 'kakao_any_case', pattern: /kakao/i },
  { label: 'send_sms_function', pattern: /sendSMS/i },
  { label: 'sms_permission_phrase', pattern: /SMS\s*permission/i },
  { label: 'send_sms_permission_constant', pattern: /android\.permission\.SEND_SMS/ },
  { label: 'action_sendto', pattern: /ACTION_SENDTO/ },
  { label: 'android_intent', pattern: /\bIntent\b/ },
  { label: 'capacitor_share_package', pattern: /@capacitor\/share/i },
  { label: 'capacitor_share_import', pattern: /Share from '@capacitor/ },
  { label: 'capacitor_share_class', pattern: /CapacitorShare(?!Readiness)/ },
  { label: 'play_google_link', pattern: /play\.google\.com/ },
  { label: 'apple_app_store_link', pattern: /apps\.apple\.com/ },
];

for (const relativePath of scopedImplementationFiles) {
  const source = readFile(relativePath);
  for (const { label, pattern } of forbiddenPatterns) {
    mark(!pattern.test(source), `${relativePath}_forbidden_absent_${label}`);
  }
}

// D. Android native/resource/Gradle/Kakao/SMS non-change must be documented for this PR.
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const developmentLogSource = readFile(developmentLogPath);
mark(developmentLogSource.includes('## Saved Reading Text Share'), 'development_log_has_section');

const requiredNonChangeNotes = [
  'AndroidManifest.xml 변경 없음',
  'Android native code 변경 없음',
  'Android resource 변경 없음',
  'Gradle 변경 없음',
  'Kakao SDK 연동 없음',
  'SMS permission/native integration 없음',
];
for (const note of requiredNonChangeNotes) {
  mark(developmentLogSource.includes(note), `development_log_includes_${note}`);
}

// E. TODO.md must record this PR's completed scope while keeping deferred items pending.
const todoPath = 'TODO.md';
const todoSource = readFile(todoPath);
const requiredCompletedItems = [
  '- [x] 저장한 풀이 텍스트 공유 기능 최소 구현',
  '- [x] Web Share API 기반 공유 시도 추가',
  '- [x] 공유 문구 복사 fallback 추가',
  '- [x] Saved reading text share 검증 스크립트 추가',
];
for (const item of requiredCompletedItems) {
  mark(todoSource.includes(item), `todo_includes_completed_${item}`);
}

const requiredPendingItems = [
  '- [ ] Kakao SDK 연동 검토',
  '- [ ] SMS permission/native integration 검토',
  '- [ ] 공유 이미지 생성 기능 검토',
  '- [ ] AndroidManifest.xml 공유 관련 변경 필요 여부 검토',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
  '- [ ] Google Play Console 실제 입력',
];
for (const item of requiredPendingItems) {
  mark(todoSource.includes(item), `todo_includes_pending_${item}`);
}

// CHANGELOG.md must record this PR's scope.
const changelogPath = 'CHANGELOG.md';
const changelogSource = readFile(changelogPath);
mark(
  changelogSource.includes('Added minimum saved reading text sharing using Web Share API when available.'),
  'changelog_records_share_feature',
);
mark(
  changelogSource.includes('Added saved reading text share check script.'),
  'changelog_records_check_script',
);

// Functional regression: exercise the real share/clipboard-fallback state machine.
// Node ships a built-in read-only `navigator` global, so it must be overridden via
// defineProperty rather than direct assignment.
function setMockNavigator(value) {
  Object.defineProperty(globalThis, 'navigator', {
    value,
    configurable: true,
    writable: true,
  });
}

async function testSharedSuccess() {
  delete globalThis.document;
  setMockNavigator({ share: async () => {} });

  const result = await shareSavedReadingText({ title: '제목', summary: '요약', body: '본문' });
  mark(result.status === 'shared', 'functional_share_success_status');
}

async function testShareCancelled() {
  setMockNavigator({
    share: async () => {
      const error = new Error('user aborted');
      error.name = 'AbortError';
      throw error;
    },
  });

  const result = await shareSavedReadingText({ title: '제목' });
  mark(result.status === 'cancelled', 'functional_share_cancelled_status');
}

async function testShareUnsupportedFallsBackToClipboard() {
  let writtenText = '';
  setMockNavigator({
    clipboard: {
      writeText: async (text) => {
        writtenText = text;
      },
    },
  });

  const result = await shareSavedReadingText({ title: '제목', summary: '요약', body: '본문' });
  mark(result.status === 'copied_unsupported', 'functional_unsupported_falls_back_to_clipboard');
  mark(writtenText.includes('하루풀이'), 'functional_clipboard_text_includes_app_name');
}

async function testShareFailureFallsBackToClipboard() {
  let writtenText = '';
  setMockNavigator({
    share: async () => {
      throw new Error('share_failed');
    },
    clipboard: {
      writeText: async (text) => {
        writtenText = text;
      },
    },
  });

  const result = await shareSavedReadingText({ title: '제목' });
  mark(result.status === 'copied_after_share_failure', 'functional_share_failure_falls_back_to_clipboard');
  mark(writtenText.length > 0, 'functional_share_failure_clipboard_text_written');
}

async function testCopyFailedWhenNoFallbackAvailable() {
  delete globalThis.document;
  setMockNavigator({
    share: async () => {
      throw new Error('share_failed');
    },
  });

  const result = await shareSavedReadingText({ title: '제목' });
  mark(result.status === 'copy_failed', 'functional_copy_failed_when_no_clipboard_or_document');
}

await testSharedSuccess();
await testShareCancelled();
await testShareUnsupportedFallsBackToClipboard();
await testShareFailureFallsBackToClipboard();
await testCopyFailedWhenNoFallbackAvailable();

// Share text must stay free of personal profile fields and real store URLs even if present on the item.
const sensitiveItem = {
  title: '제목',
  summary: '요약',
  body: '본문',
  birthDate: '1990-01-01',
  birthTime: '09:00',
  birthPlace: '서울',
  gender: 'male',
  name: '홍길동',
};
const sensitiveText = buildSavedReadingShareText(sensitiveItem);
const sensitiveValues = ['1990-01-01', '09:00', '서울', 'male', '홍길동'];
mark(
  sensitiveValues.every((value) => !sensitiveText.includes(value)),
  'share_text_excludes_sensitive_fields',
);
mark(
  !/play\.google\.com/.test(sensitiveText) && !/apps\.apple\.com/.test(sensitiveText),
  'share_text_excludes_store_urls',
);

if (failures.length > 0) {
  console.error('Saved reading text share check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Saved reading text share check passed');
