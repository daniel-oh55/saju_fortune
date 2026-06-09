import { categoryMeta, fortuneTemplates } from '../data/fortuneTemplates.js';
import { createSajuAnalysis } from '../domain/saju/createSajuAnalysis.js';

export const CURRENT_FORTUNE_SCHEMA_VERSION = 4;

function hashString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickBySeed(items, seed) {
  return items[seed % items.length];
}

function scoreFromSeed(seed) {
  return 58 + (seed % 41);
}

function pickSectionPair(items, seed) {
  const first = pickBySeed(items, seed);
  const secondCandidates = items.filter((item) => item !== first);
  const second = pickBySeed(secondCandidates.length ? secondCandidates : items, seed + 3);
  return [first, second];
}

function buildDetailedFortuneText({ template, seed, sajuAnalysis, luckyColor, luckyItem }) {
  if (!template.detailSections) {
    return `${pickBySeed(template.detail, seed + 7)} 오늘의 키워드는 ${sajuAnalysis.luckyKeywords[0]}입니다.`;
  }

  const [flowOne, flowTwo] = pickSectionPair(template.detailSections.flow, seed + 1);
  const [adviceOne, adviceTwo] = pickSectionPair(template.detailSections.advice, seed + 5);
  const [cautionOne, cautionTwo] = pickSectionPair(template.detailSections.caution, seed + 9);
  const [actionOne, actionTwo] = pickSectionPair(template.detailSections.action, seed + 13);
  const closing = pickBySeed(template.detailSections.closing, seed + 17);
  const keyword = pickBySeed(sajuAnalysis.luckyKeywords, seed + 19);
  const supportiveTrait = pickBySeed(sajuAnalysis.traits, seed + 23);

  const firstParagraph = [flowOne, flowTwo, adviceOne, cautionOne].join(' ');
  const secondParagraph = [adviceTwo, cautionTwo, actionOne, actionTwo].join(' ');
  const thirdParagraph = [
    `오늘의 키워드는 ${keyword}이며, ${supportiveTrait} 성향을 부드럽게 살려보면 좋습니다.`,
    `행운 색상 ${luckyColor}와 행운 아이템 ${luckyItem}은 하루의 분위기를 가볍게 환기하는 참고용으로 활용해보세요.`,
    closing,
  ].join(' ');

  return [firstParagraph, secondParagraph, thirdParagraph].join('\n\n');
}

export function buildProfileId(profile) {
  return hashString(
    `${profile.nickname}-${profile.birthDate}-${profile.birthTime}-${profile.birthTimeUnknown}-${profile.calendarType}-${profile.isLeapMonth}-${profile.gender}`,
  ).toString(36);
}

export function createTodayFortune(profile, dateKey) {
  const profileId = profile.id || buildProfileId(profile);
  const normalizedProfile = { ...profile, id: profileId };
  const sajuAnalysis = createSajuAnalysis(normalizedProfile, dateKey);
  const baseSeed = hashString(`${profileId}-${dateKey}-${sajuAnalysis.elements.dominant}`);

  const categories = categoryMeta.map((category, index) => {
    const seed = hashString(`${baseSeed}-${category.id}-${index}`);
    const template = fortuneTemplates[category.id];
    const luckyColor = pickBySeed(['코랄', '민트', '라벤더', '하늘색', '아이보리'], seed + 11);
    const luckyItem = pickBySeed(['메모장', '텀블러', '이어폰', '손수건', '캘린더'], seed + 17);

    return {
      ...category,
      score: scoreFromSeed(seed),
      summary: pickBySeed(template.summary, seed),
      detail: buildDetailedFortuneText({
        template,
        seed,
        sajuAnalysis,
        luckyColor,
        luckyItem,
      }),
      luckyColor,
      luckyItem,
    };
  });

  const averageScore = Math.round(
    categories.reduce((total, category) => total + category.score, 0) / categories.length,
  );

  return {
    id: `${profileId}-${dateKey}`,
    schemaVersion: CURRENT_FORTUNE_SCHEMA_VERSION,
    profileId,
    dateKey,
    averageScore,
    greeting: `${profile.nickname}님의 오늘 흐름은 ${averageScore}점입니다.`,
    keyword: sajuAnalysis.luckyKeywords[0],
    categories,
    sajuAnalysis,
    monetization: {
      freeSummaryEnabled: true,
      rewardedAdDetailEnabled: true,
      premiumUpsellEnabled: true,
    },
    aiConsult: {
      enabled: false,
      plannedProvider: 'future-ai-api',
      contextKeys: ['profile', 'todayFortune', 'selectedQuestion', 'sajuAnalysis'],
    },
  };
}
