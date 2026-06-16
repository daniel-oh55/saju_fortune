import {
  buildFortuneCategoryShareText,
  buildSajuInsightShareText,
  buildSavedReadingShareText,
  normalizeShareText,
} from '../src/utils/shareTextBuilder.js';

const failures = [];

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

const fortune = {
  keyword: '정리',
  dateKey: '2026-06-10',
};
const category = {
  label: '전체운',
  summary: '오늘은 차분히 정리하면 좋은 흐름입니다.',
  detail: '아주 긴 상세 풀이 전문입니다. 광고 해금 전에는 이 문장이 공유되면 안 됩니다.',
  luckyColor: '민트',
  luckyItem: '메모장',
};

const fortuneText = buildFortuneCategoryShareText({ fortune, category, isUnlocked: true });
const fortuneBasicPass =
  fortuneText.includes('하루풀리') &&
  fortuneText.includes(category.summary) &&
  fortuneText.includes(category.luckyColor) &&
  fortuneText.includes(category.luckyItem) &&
  fortuneText.includes('참고용');
logResult('fortune_share_text_basic', fortuneBasicPass);
assertCondition(fortuneBasicPass, 'fortune share text should include app name, summary, luck fields, and 참고용');

const lockedText = buildFortuneCategoryShareText({ fortune, category, isUnlocked: false });
const lockedPass = !lockedText.includes(category.detail);
logResult('fortune_locked_does_not_include_full_detail', lockedPass);
assertCondition(lockedPass, 'locked fortune share text should not include full detail');

const sajuText = buildSajuInsightShareText({
  fortune,
  sajuAnalysis: {
    elements: { balanceHint: '균형을 살피면 도움이 될 수 있습니다.' },
    luckyKeywords: ['정리', '대화'],
    traits: ['차분함'],
  },
  lifeSections: [
    { title: '관계 흐름', description: '대화의 속도를 늦춰보세요.' },
  ],
});
const sajuPass =
  sajuText.includes('하루풀리') &&
  sajuText.includes('사주 흐름') &&
  sajuText.includes('정리') &&
  sajuText.includes('참고용');
logResult('saju_share_text_basic', sajuPass);
assertCondition(sajuPass, 'saju share text should include app name, saju title, keywords, and 참고용');

const savedText = buildSavedReadingShareText({
  title: '저장 제목',
  summary: '저장 요약',
  body: '저장 본문',
});
const savedPass =
  savedText.includes('하루풀리') &&
  savedText.includes('저장 제목') &&
  savedText.includes('저장 요약') &&
  savedText.includes('저장 본문') &&
  savedText.includes('참고용');
logResult('saved_reading_share_text_basic', savedPass);
assertCondition(savedPass, 'saved reading share text should include title, summary, body, app name, and 참고용');

const sensitiveText = `${fortuneText}\n${sajuText}\n${savedText}`;
const sensitiveValues = ['birthDate', 'birthTime', 'gender', 'calendarType', 'lateNightJasiPolicy', '1990-01-01', '09:00', 'male'];
const noSensitivePass = sensitiveValues.every((value) => !sensitiveText.includes(value));
logResult('no_sensitive_profile_fields', noSensitivePass);
assertCondition(noSensitivePass, 'share text should not include sensitive profile field names or values');

const normalizedLongText = normalizeShareText('a'.repeat(2000));
const lengthPass = normalizedLongText.length <= 1200;
logResult('normalize_share_text_length', lengthPass);
assertCondition(lengthPass, `normalized share text should be <= 1200, got ${normalizedLongText.length}`);

if (failures.length > 0) {
  console.log('failures:');
  for (const failure of failures) {
    console.log(`- ${failure}`);
  }
  process.exitCode = 1;
}
