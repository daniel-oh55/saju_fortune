import { yearCategories, yearFortuneTemplates } from '../../data/yearFortuneTemplates.js';

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
  return 62 + (seed % 35);
}

export function createYearFortune(profile, sajuAnalysis, targetYear = 2026) {
  const seed = hashString(`${profile.id}-${targetYear}-${sajuAnalysis.elements.dominant}`);
  const categories = yearCategories.map((category, index) => {
    const categorySeed = hashString(`${seed}-${category.id}-${index}`);

    return {
      ...category,
      score: scoreFromSeed(categorySeed),
      summary: pickBySeed(yearFortuneTemplates[category.id], categorySeed),
    };
  });

  const averageScore = Math.round(
    categories.reduce((total, category) => total + category.score, 0) / categories.length,
  );

  return {
    id: `${profile.id}-${targetYear}`,
    targetYear,
    averageScore,
    summary: pickBySeed(yearFortuneTemplates.overall, seed),
    keyword: sajuAnalysis.luckyKeywords[0],
    categories,
    months: Array.from({ length: 12 }, (_, index) => {
      const monthSeed = hashString(`${seed}-month-${index + 1}`);
      return {
        month: index + 1,
        score: scoreFromSeed(monthSeed),
        note: pickBySeed(
          ['정리와 준비', '관계 확장', '재정 점검', '휴식과 회복', '새로운 기회', '집중 실행'],
          monthSeed,
        ),
      };
    }),
  };
}
