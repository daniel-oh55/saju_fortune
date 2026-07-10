import fs from 'node:fs';

// U+91D1 (CJK Unified Ideograph) was accidentally introduced in PR #367 docs entries.
// U+F90A (CJK Compatibility Ideograph) is the project-standard glyph for 金, used
// consistently across src/ (fiveElementsInfo.js, SajuInsightPage.jsx, DailyRoutineCard.jsx).
const WRONG_METAL_CHAR = '\u{91D1}';
const CORRECT_METAL_CHAR = '\u{F90A}';

const wrongMetalNotation = `\u{AE08}(${WRONG_METAL_CHAR})`;
const correctMetalNotation = `\u{AE08}(${CORRECT_METAL_CHAR})`;

// DEVELOPMENT_LOG.md and TODO.md are running logs that legitimately reference these
// wrong phrases in past entries documenting that a check for them exists/passed
// (e.g. "Wrong phrase `서양식 보정 적용 여부` remains checked"). So the wrong-phrase
// scan is scoped to just the section this PR adds, not the whole running log.
const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const sectionHeadingByFile = {
  'CHANGELOG.md': '## Docs',
  'DEVELOPMENT_LOG.md': '## Five Element Metal Notation Alignment',
  'TODO.md': '## Five Element Metal Notation Alignment TODO',
};

function sectionText(markdown, heading) {
  const start = markdown.indexOf(heading);
  if (start === -1) return '';
  const nextHeading = markdown.indexOf('\n## ', start + heading.length);
  return nextHeading === -1 ? markdown.slice(start) : markdown.slice(start, nextHeading);
}

let hasFailure = false;

function logResult(name, passed, detail = '') {
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${name}${detail ? ` - ${detail}` : ''}`);
  if (!passed) hasFailure = true;
}

for (const [file, heading] of Object.entries(sectionHeadingByFile)) {
  const content = fs.readFileSync(file, 'utf8');

  logResult(`${file}_excludes_wrong_metal_notation_anywhere`, !content.includes(wrongMetalNotation));

  const section = sectionText(content, heading);
  logResult(`${file}_has_metal_notation_alignment_section`, section.length > 0);
  logResult(`${file}_section_contains_correct_metal_notation`, section.includes(correctMetalNotation));

  for (const phrase of wrongPhrases) {
    logResult(`${file}_section_excludes_${phrase}`, !section.includes(phrase));
  }
}

if (hasFailure) {
  console.error('Five element metal notation check failed.');
  process.exit(1);
}

console.log('Five element metal notation check passed');
