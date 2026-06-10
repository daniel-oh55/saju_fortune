import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

const targetFiles = [
  'src/config/contentSafetyCopy.js',
  'src/utils/shareTextBuilder.js',
  'src/pages/SajuInsightPage.jsx',
  'src/pages/FortuneDetailPage.jsx',
  'src/pages/SavedReadingsPage.jsx',
  'src/components/DailyRoutineCard.jsx',
  'src/components/SajuElementSummaryCard.jsx',
  'src/components/ContentAccessNotice.jsx',
  'src/components/ContentSafetyNotice.jsx',
  'src/components/SavedReadingsSummaryCard.jsx',
];

const forbiddenPatterns = [
  { label: '반드시', pattern: /반드시/ },
  { label: '무조건', pattern: /무조건/ },
  { label: '실패합니다', pattern: /실패합니다/ },
  { label: '위험합니다', pattern: /위험합니다/ },
  { label: '이별합니다', pattern: /이별합니다/ },
  { label: '손해를 봅니다', pattern: /손해를\s*봅니다/ },
  { label: '질병이 생깁니다', pattern: /질병이\s*생깁니다/ },
  { label: '질병 확정', pattern: /질병\s*확정/ },
  { label: '투자 확정', pattern: /투자\s*확정/ },
  { label: '손해 확정', pattern: /손해\s*확정/ },
  { label: '결제하지 않으면', pattern: /결제하지\s*않으면/ },
  { label: '지금 보지 않으면', pattern: /지금\s*보지\s*않으면/ },
  { label: '일이 꼬일지 모릅니다', pattern: /일이\s*꼬일지\s*모릅니다/ },
  { label: '광고를 보지 않으면 불리합니다', pattern: /광고를\s*보지\s*않으면\s*불리합니다/ },
  { label: '건강이 나빠집니다', pattern: /건강이\s*나빠집니다/ },
  { label: '병이 생깁니다', pattern: /병이\s*생깁니다/ },
  { label: '투자하세요', pattern: /투자하세요/ },
  { label: '매수하세요', pattern: /매수하세요/ },
  { label: '매도하세요', pattern: /매도하세요/ },
  { label: '법적으로 확실합니다', pattern: /법적으로\s*확실합니다/ },
  { label: '떨어집니다', pattern: /떨어집니다/ },
  { label: '결혼합니다', pattern: /결혼합니다/ },
];

const failures = [];

function readTargetFile(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);

  if (!fs.existsSync(absolutePath)) {
    failures.push({
      file: relativePath,
      label: 'missing_file',
      lineNumber: 0,
      line: '검사 대상 파일이 없습니다.',
    });
    return null;
  }

  return fs.readFileSync(absolutePath, 'utf8');
}

function checkFile(relativePath) {
  const content = readTargetFile(relativePath);
  if (content === null) return;

  const lines = content.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    for (const { label, pattern } of forbiddenPatterns) {
      if (pattern.test(line)) {
        failures.push({
          file: relativePath,
          label,
          lineNumber: index + 1,
          line: line.trim(),
        });
      }
    }
  }
}

for (const targetFile of targetFiles) {
  checkFile(targetFile);
}

if (failures.length > 0) {
  console.log('Content safety copy check failed');
  console.log('');

  for (const failure of failures) {
    console.log(`file: ${failure.file}`);
    console.log(`pattern: ${failure.label}`);
    console.log(`line: ${failure.lineNumber}`);
    console.log(`snippet: ${failure.line}`);
    console.log('');
  }

  process.exitCode = 1;
} else {
  console.log('Content safety copy check passed');
}
