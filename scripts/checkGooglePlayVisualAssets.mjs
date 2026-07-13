import fs from 'node:fs';

const docPath = 'docs/GOOGLE_PLAY_VISUAL_ASSET_RECORD.md';
const assetDir = 'store-assets/google-play/visual';

const appIconFile = `${assetDir}/app-icon-512.png`;
const featureGraphicFile = `${assetDir}/feature-graphic-1024x500.png`;

const ONE_MB = 1024 * 1024;
const FIFTEEN_MB = 15 * 1024 * 1024;

function readImageDimensions(buffer) {
  if (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer.toString('ascii', 1, 4) === 'PNG'
  ) {
    return {
      format: 'PNG',
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      const isSofMarker =
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf);
      if (isSofMarker) {
        return {
          format: 'JPEG',
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      const segmentLength = buffer.readUInt16BE(offset + 2);
      offset += 2 + segmentLength;
    }
    return { format: 'JPEG', width: null, height: null };
  }
  return { format: 'UNKNOWN', width: null, height: null };
}

function checkImageAsset(label, filePath, requiredWidth, requiredHeight, maxBytes) {
  const exists = fs.existsSync(filePath);
  logResult(`${label}_exists`, exists, filePath);
  if (!exists) return;

  const buffer = fs.readFileSync(filePath);
  logResult(`${label}_not_empty`, buffer.length > 0, `${buffer.length} bytes`);
  logResult(`${label}_max_size`, buffer.length <= maxBytes, `${buffer.length} bytes <= ${maxBytes} bytes`);

  const dimensions = readImageDimensions(buffer);
  logResult(`${label}_is_png_or_jpeg`, dimensions.format === 'PNG' || dimensions.format === 'JPEG', dimensions.format);
  logResult(
    `${label}_dimensions`,
    dimensions.width === requiredWidth && dimensions.height === requiredHeight,
    `${dimensions.width}x${dimensions.height} (expected ${requiredWidth}x${requiredHeight})`,
  );
}

const requiredDocSnippets = [
  '# Google Play Visual Asset Record',
  'Status: Google Play visual assets recorded',
  'App icon final asset: Completed',
  'Feature graphic final asset: Completed',
  'App icon final upload: Pending',
  'Feature graphic final upload: Pending',
  'Google Play Console actual input: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'App submission/review request: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Purpose: Record final Google Play app icon and feature graphic assets',
  'PR type: visual asset/docs/check',
  'This PR adds final visual asset files only',
  'This PR does not upload app icon or feature graphic to Google Play Console',
  'This PR does not complete full Google Play Console input',
  'This PR does not complete Google Play 데이터 보안 양식 최종 입력',
  'This PR does not submit the app for review',
  'This PR does not create release build/signing/AAB',
  'This PR does not change production UI or app logic',
  '## 2. Visual asset files',
  '| App icon | store-assets/google-play/visual/app-icon-512.png | 512 x 512px, <= 1MB | Completed |',
  '| Feature graphic | store-assets/google-play/visual/feature-graphic-1024x500.png | 1024 x 500px, <= 15MB | Completed |',
  'No Google Play Console upload',
  'No app icon final upload completion',
  'No feature graphic final upload completion',
  'No full Google Play Console input completion',
  'No Google Play 데이터 보안 양식 최종 입력',
  'No app submission/review request',
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
  '| App icon final upload | Pending |',
  '| Feature graphic final upload | Pending |',
  '| Google Play Console actual input | Pending |',
  '| Google Play 데이터 보안 양식 최종 입력 | Pending |',
  '| App content rating / questionnaire | Pending |',
  '| Target audience / content settings | Pending |',
  '| App submission/review request | Pending |',
  '| Release build | Not started |',
  '| Signing setup | Not started |',
  '| AAB generation | Not started |',
  'This PR records final Google Play visual assets only.',
  'No production code, Android packaging, signing, AAB, or Console input changes are included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'App icon final upload: Completed',
  'App icon final upload | Completed',
  '앱 아이콘 최종 업로드 완료',
  'Feature graphic final upload: Completed',
  'Feature graphic final upload | Completed',
  '그래픽 이미지 최종 업로드 완료',
  'Google Play Console actual input: Completed',
  'Google Play Console actual input | Completed',
  'Google Play Console 입력 완료',
  'full Google Play Console input completed',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'Google Play 데이터 보안 양식 최종 입력 | Completed',
  'App submission/review request: Completed',
  'App submission/review request | Completed',
  'app submission 완료',
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
  '- [x] App icon final asset 등록',
  '- [x] Feature graphic final asset 등록',
  '- [x] google play visual assets 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] App icon final upload',
  '- [ ] Feature graphic final upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] App content rating / questionnaire',
  '- [ ] Target audience / content settings',
  '- [ ] App submission/review request',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];

const requiredDevLogSnippets = [
  '## Google Play Visual Assets',
  'PR 목적: Google Play app icon and feature graphic final asset 등록',
  'Status: Visual asset/docs/check',
  'App icon final asset: Completed',
  'App icon file: store-assets/google-play/visual/app-icon-512.png',
  'App icon requirement: 512 x 512px, <= 1MB',
  'Feature graphic final asset: Completed',
  'Feature graphic file: store-assets/google-play/visual/feature-graphic-1024x500.png',
  'Feature graphic requirement: 1024 x 500px, <= 15MB',
  'App icon final upload: Pending',
  'Feature graphic final upload: Pending',
  'Google Play Console actual input: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'App content rating / questionnaire: Pending',
  'Target audience / content settings: Pending',
  'App submission/review request: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'production UI 변경 없음',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android native/resource 변경 없음',
  'Gradle 변경 없음',
  'Capacitor config 변경 없음',
  '운세 문구/content 변경 없음',
  '운세 계산 로직 변경 없음',
  'routing 변경 없음',
  'schemaVersion 변경 없음',
  'CURRENT_FORTUNE_SCHEMA_VERSION 변경 없음',
  '기존 localStorage key 변경 없음',
  'Google Play Console upload 없음',
  'Google Play Console actual input 완료 없음',
  'Google Play 데이터 보안 양식 최종 입력 없음',
  'app submission/review request 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'AAB 생성 없음',
];

const requiredChangelogSnippets = [
  'Added final Google Play app icon and feature graphic assets.',
  'Recorded Google Play visual asset readiness.',
  'Added Google Play visual assets check.',
];

const requiredPackageJsonSnippets = [
  '"check:google-play-visual-assets": "node scripts/checkGooglePlayVisualAssets.mjs"',
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

checkImageAsset('app_icon', appIconFile, 512, 512, ONE_MB);
checkImageAsset('feature_graphic', featureGraphicFile, 1024, 500, FIFTEEN_MB);

logResult('doc_exists', fs.existsSync(docPath));
if (!fs.existsSync(docPath)) {
  console.error('Google Play visual assets check failed.');
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

// docs/GOOGLE_PLAY_VISUAL_ASSET_RECORD.md and CHANGELOG.md have no history of legitimately
// referencing these wrong phrases, so a whole-file scan is safe for them. TODO.md and
// DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g. documenting that
// a check for these phrases exists), so their scan is scoped to this PR's section only.
const todoSection = sectionText(todo, '## Google Play Visual Assets TODO');
const devLogSection = sectionText(devLog, '## Google Play Visual Assets');

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
  console.error('Google Play visual assets check failed.');
  process.exit(1);
}

console.log('Google Play visual assets check passed');
