import { categoryMeta, fortuneTemplates } from '../data/fortuneTemplates.js';
import { createSajuAnalysis } from '../domain/saju/createSajuAnalysis.js';

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

    return {
      ...category,
      score: scoreFromSeed(seed),
      summary: pickBySeed(template.summary, seed),
      detail: `${pickBySeed(template.detail, seed + 7)} 오늘의 키워드는 ${sajuAnalysis.luckyKeywords[index % sajuAnalysis.luckyKeywords.length]}입니다.`,
      luckyColor: pickBySeed(['코랄', '민트', '라벤더', '하늘색', '아이보리'], seed + 11),
      luckyItem: pickBySeed(['메모장', '텀블러', '이어폰', '손수건', '캘린더'], seed + 17),
    };
  });

  const averageScore = Math.round(
    categories.reduce((total, category) => total + category.score, 0) / categories.length,
  );

  return {
    id: `${profileId}-${dateKey}`,
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
