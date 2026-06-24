import fs from 'node:fs';

const docPath = 'docs/ZODIAC_FORTUNE_SAMPLE_QA.md';
const dataPath = 'src/data/zodiacFortuneProfiles.ts';
const composerPath = 'src/lib/zodiacFortuneComposer.ts';
const pagePath = 'src/pages/ZodiacFortunePage.jsx';
const requiredLabels = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
const requiredHanja = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const requiredFields = ['Title', 'Summary', 'Daily flow', 'Relationship', 'Money', 'Health', 'Routine', 'Caution'];
const bannedPhrases = ['반드시', '무조건', '확정', '대박', '수익 보장', '투자하면', '병이 낫', '완치', '절대', '정답'];
const moneyRiskPhrases = ['투자', '수익 보장', '대박', '큰돈', '돈이 들어온다'];
const healthRiskPhrases = ['진단', '치료', '완치', '약 복용', '병명'];
const forbiddenChangeMentions = ['schemaVersion 변경', 'localStorage key 변경'];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function getSection(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start === -1) return '';
  const end = source.indexOf(endMarker, start + startMarker.length);
  return source.slice(start, end === -1 ? undefined : end);
}

function getFieldLines(source, field) {
  const pattern = new RegExp(`^- ${field}:.*$`, 'gm');
  return source.match(pattern) || [];
}

let hasFailure = false;

for (const path of [docPath, dataPath, composerPath, pagePath]) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const composer = fs.readFileSync(composerPath, 'utf8');
const page = fs.readFileSync(pagePath, 'utf8');
const sampleSection = getSection(doc, '## 12 Zodiac Sample Results', '## Safety Criteria');
const combinedImplementation = `${composer}\n${page}`;

const requiredDocSnippets = [
  ['sample_date_exists', 'Sample date: 2026-06-24'],
  ['qa_result_summary_exists', '## QA Result Summary'],
  ['actual_screen_qa_pending_exists', '실제 화면 QA: Pending'],
  ['actual_device_qa_pending_exists', '실제 기기 QA: Pending'],
  ['google_play_not_started_exists', 'Google Play 내부 테스트 업로드: Not started'],
];

for (const [label, snippet] of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(label, found);
  if (!found) hasFailure = true;
}

const sampleSectionExists = sampleSection.length > 0;
logResult('sample_results_section_exists', sampleSectionExists);
if (!sampleSectionExists) hasFailure = true;

for (const label of requiredLabels) {
  const found = sampleSection.includes(`### ${label} `);
  logResult(`sample_label_${label}_exists`, found);
  if (!found) hasFailure = true;
}

for (const hanja of requiredHanja) {
  const found = sampleSection.includes(` ${hanja}\n`);
  logResult(`sample_hanja_${hanja}_exists`, found);
  if (!found) hasFailure = true;
}

for (const field of requiredFields) {
  const count = getFieldLines(sampleSection, field).length;
  const passed = count === 12;
  logResult(`sample_field_${field.replaceAll(' ', '_')}_count_12`, passed, `count=${count}`);
  if (!passed) hasFailure = true;
}

for (const phrase of bannedPhrases) {
  const absent = !sampleSection.includes(phrase);
  logResult(`sample_banned_phrase_absent_${phrase}`, absent);
  if (!absent) hasFailure = true;
}

const moneyLines = getFieldLines(sampleSection, 'Money').join('\n');
for (const phrase of moneyRiskPhrases) {
  const absent = !moneyLines.includes(phrase);
  logResult(`sample_money_risk_phrase_absent_${phrase}`, absent);
  if (!absent) hasFailure = true;
}

const healthLines = getFieldLines(sampleSection, 'Health').join('\n');
for (const phrase of healthRiskPhrases) {
  const absent = !healthLines.includes(phrase);
  logResult(`sample_health_risk_phrase_absent_${phrase}`, absent);
  if (!absent) hasFailure = true;
}

const implementationChecks = [
  ['composer_avoids_math_random', !composer.includes('Math.random')],
  ['page_uses_createZodiacFortune', page.includes('createZodiacFortune')],
  ['composer_exports_composeZodiacFortune', composer.includes('export function composeZodiacFortune')],
  ['page_keeps_zodiac_result_connection', page.includes('zodiacFortune.summary') && page.includes('zodiacFortune.detail')],
];

for (const [label, passed] of implementationChecks) {
  logResult(label, passed);
  if (!passed) hasFailure = true;
}

for (const phrase of forbiddenChangeMentions) {
  const absent = !doc.includes(phrase) && !combinedImplementation.includes(phrase);
  logResult(`forbidden_change_phrase_absent_${phrase}`, absent);
  if (!absent) hasFailure = true;
}

if (hasFailure) {
  console.error('Zodiac fortune sample QA check failed');
  process.exit(1);
}

console.log('Zodiac fortune sample QA check passed');
