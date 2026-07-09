import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const failures = [];

function mark(condition, label) {
  if (!condition) failures.push(label);
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function extractCssBlock(source, selector) {
  const index = source.indexOf(selector);
  if (index === -1) return '';
  const braceStart = source.indexOf('{', index);
  const braceEnd = source.indexOf('}', braceStart);
  if (braceStart === -1 || braceEnd === -1) return '';
  return source.slice(braceStart, braceEnd + 1);
}

const stylesPath = 'src/styles.css';
const shareButtonPath = 'src/components/SavedReadingShareButton.jsx';
const savedReadingsPagePath = 'src/pages/SavedReadingsPage.jsx';
const fortuneDetailPagePath = 'src/pages/FortuneDetailPage.jsx';
const saveReadingButtonPath = 'src/components/SaveReadingButton.jsx';
const copyShareButtonPath = 'src/components/CopyShareButton.jsx';
const packageJsonPath = 'package.json';

const stylesSource = readFile(stylesPath);
const shareButtonSource = readFile(shareButtonPath);
const savedReadingsPageSource = readFile(savedReadingsPagePath);
const fortuneDetailPageSource = readFile(fortuneDetailPagePath);
const saveReadingButtonSource = readFile(saveReadingButtonPath);
const copyShareButtonSource = readFile(copyShareButtonPath);

// A. Saved reading share/delete action row must be a stable, fixed two-column layout.
mark(savedReadingsPageSource.includes('saved-reading-action-row'), 'saved_readings_page_uses_action_row');
mark(savedReadingsPageSource.includes('saved-reading-delete-button'), 'saved_readings_page_has_delete_button_class');
mark(shareButtonSource.includes('saved-reading-share-button'), 'share_button_has_class');
mark(shareButtonSource.includes('saved-reading-share-status'), 'share_button_has_status_class');

const savedReadingActionRowBlock = extractCssBlock(stylesSource, '.saved-reading-action-row {');
mark(savedReadingActionRowBlock.includes('grid-template-columns'), 'saved_reading_action_row_uses_grid_template_columns');
mark(savedReadingActionRowBlock.includes('align-items'), 'saved_reading_action_row_uses_stable_align_items');

// B. Fortune result save/copy action row must be a stable, fixed two-column layout.
mark(fortuneDetailPageSource.includes('fortune-result-actions'), 'fortune_detail_page_uses_result_action_row');
mark(saveReadingButtonSource.includes('save-reading-button'), 'save_reading_button_has_class');
mark(copyShareButtonSource.includes('copy-share-button'), 'copy_share_button_has_class');
mark(copyShareButtonSource.includes('copy-share-status'), 'copy_share_button_has_status_class');

const fortuneResultActionsBlock = extractCssBlock(stylesSource, '.fortune-result-actions {');
mark(fortuneResultActionsBlock.includes('grid-template-columns'), 'fortune_result_actions_uses_grid_template_columns');
mark(fortuneResultActionsBlock.includes('align-items'), 'fortune_result_actions_uses_stable_align_items');

// C. Forbidden Kakao/SMS/native-share/store-link markers must stay out of this PR's implementation scope.
// Scoped to the files actually touched by this PR, not the whole repo, so unrelated docs
// that discuss Kakao/SMS review status elsewhere do not produce false positives.
const scopedImplementationFiles = [
  shareButtonPath,
  savedReadingsPagePath,
  fortuneDetailPagePath,
  saveReadingButtonPath,
  copyShareButtonPath,
  stylesPath,
  packageJsonPath,
];
const forbiddenPatterns = [
  { label: 'capacitor_share_package', pattern: /@capacitor\/share/i },
  { label: 'capacitor_share_class', pattern: /CapacitorShare/ },
  { label: 'kakao_any_case', pattern: /kakao/i },
  { label: 'send_sms_permission_constant', pattern: /android\.permission\.SEND_SMS/ },
  { label: 'action_sendto', pattern: /ACTION_SENDTO/ },
  { label: 'android_manifest_share_change_complete', pattern: /AndroidManifest\.xml 공유 변경 완료/ },
  { label: 'play_google_link', pattern: /play\.google\.com/ },
  { label: 'apple_app_store_link', pattern: /apps\.apple\.com/ },
];

for (const relativePath of scopedImplementationFiles) {
  const source = readFile(relativePath);
  for (const { label, pattern } of forbiddenPatterns) {
    mark(!pattern.test(source), `${relativePath}_forbidden_absent_${label}`);
  }
}

// D/E. TODO.md must record this PR's completed scope while keeping deferred items pending.
const todoPath = 'TODO.md';
const todoSource = readFile(todoPath);
const requiredTodoCompletedSnippets = [
  '- [x] 저장한 풀이 공유/삭제 버튼 크기 흔들림 수정',
  '- [x] 운세 결과 풀이 저장/복사 버튼 크기 흔들림 수정',
  '- [x] Share/copy action button layout 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] Android share sheet 실제 확인 재검토',
  '- [ ] 실제 외부 공유 발송 확인',
  '- [ ] Kakao SDK 연동 검토',
  '- [ ] SMS permission/native integration 검토',
  '- [ ] @capacitor/share 도입 여부 검토',
  '- [ ] AndroidManifest.xml 공유 관련 변경 필요 여부 검토',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
  '- [ ] Google Play Console 실제 입력',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

const developmentLogPath = 'DEVELOPMENT_LOG.md';
const developmentLogSource = readFile(developmentLogPath);
mark(developmentLogSource.includes('## Share Copy Action Button Layout'), 'development_log_has_section');

const changelogPath = 'CHANGELOG.md';
const changelogSource = readFile(changelogPath);
mark(
  changelogSource.includes(
    'Stabilized saved reading share/delete action button layout when share status text is shown.',
  ),
  'changelog_records_saved_reading_fix',
);
mark(
  changelogSource.includes(
    'Stabilized fortune result save/copy action button layout when copy status text is shown.',
  ),
  'changelog_records_fortune_result_fix',
);

if (failures.length > 0) {
  console.error('Share copy action button layout check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Share copy action button layout check passed');
