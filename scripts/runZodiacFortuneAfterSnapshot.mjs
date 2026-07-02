import fs from 'node:fs';
import { createServer } from 'vite';

const dateKey = '2026-06-30';
const targetYear = 2026;
const practicalBaselinePath = 'docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json';
const outputPath = 'docs/generated/fortune-engine-sample-snapshot-after-zodiac-improvement.json';

function summarizeCategories(categories = []) {
  return {
    categoryIds: categories.map((category) => category.id),
    categoryScores: Object.fromEntries(categories.map((category) => [category.id, category.score])),
    categorySummaries: Object.fromEntries(categories.map((category) => [category.id, category.summary])),
  };
}

function summarizeTodayFortune(todayFortune) {
  const categories = summarizeCategories(todayFortune.categories);

  return {
    id: todayFortune.id,
    schemaVersion: todayFortune.schemaVersion,
    profileId: todayFortune.profileId,
    dateKey: todayFortune.dateKey,
    averageScore: todayFortune.averageScore,
    keyword: todayFortune.keyword,
    greeting: todayFortune.greeting,
    categoryIds: categories.categoryIds,
    categoryScores: categories.categoryScores,
    categorySummaries: categories.categorySummaries,
    monetization: {
      freeSummaryEnabled: Boolean(todayFortune.monetization?.freeSummaryEnabled),
      rewardedAdDetailEnabled: Boolean(todayFortune.monetization?.rewardedAdDetailEnabled),
      premiumUpsellEnabled: Boolean(todayFortune.monetization?.premiumUpsellEnabled),
    },
    aiConsult: {
      enabled: Boolean(todayFortune.aiConsult?.enabled),
    },
  };
}

function summarizeSajuAnalysis(sajuAnalysis) {
  return {
    engineStatus: sajuAnalysis.engineStatus,
    birth: sajuAnalysis.birth,
    pillars: sajuAnalysis.pillars,
    elements: {
      dominant: sajuAnalysis.elements?.dominant,
      weak: sajuAnalysis.elements?.weak,
      counts: sajuAnalysis.elements?.counts,
      percentages: sajuAnalysis.elements?.percentages,
      balanceLabel: sajuAnalysis.elements?.balanceLabel,
    },
    traits: sajuAnalysis.traits,
    weakPoints: sajuAnalysis.weakPoints,
    luckyKeywords: sajuAnalysis.luckyKeywords,
  };
}

function summarizeManseryeok(manseryeok) {
  if (!manseryeok?.ok) {
    return {
      ok: false,
      engine: manseryeok?.engine,
      reason: manseryeok?.reason,
      detail: manseryeok?.detail,
    };
  }

  return {
    ok: true,
    engine: manseryeok.engine,
    accuracyStatus: manseryeok.accuracyStatus,
    timezone: manseryeok.timezone,
    convertedSolar: manseryeok.convertedSolar,
    convertedLunar: manseryeok.convertedLunar,
    dayMaster: manseryeok.dayMaster,
    notes: manseryeok.notes,
  };
}

function summarizeYearFortune(yearFortune) {
  const categories = summarizeCategories(yearFortune.categories);

  return {
    targetYear: yearFortune.targetYear,
    averageScore: yearFortune.averageScore,
    summary: yearFortune.summary,
    keyword: yearFortune.keyword,
    categoryIds: categories.categoryIds,
    categoryScores: categories.categoryScores,
    categorySummaries: categories.categorySummaries,
    monthsCount: yearFortune.months?.length || 0,
    monthScores: Object.fromEntries((yearFortune.months || []).map((month) => [month.month, month.score])),
    monthNotes: Object.fromEntries((yearFortune.months || []).map((month) => [month.month, month.note])),
  };
}

function summarizeZodiacFortune(zodiacFortune) {
  const categories = summarizeCategories(zodiacFortune.categories);

  return {
    selectedYear: zodiacFortune.year,
    selectedAnimal: zodiacFortune.animal,
    score: zodiacFortune.score,
    summary: zodiacFortune.summary,
    categoryIds: categories.categoryIds,
    categoryScores: categories.categoryScores,
    categorySummaries: categories.categorySummaries,
    detail: zodiacFortune.detail,
  };
}

function normalizeProfile(profileInputSummary) {
  return {
    id: profileInputSummary.id,
    nickname: profileInputSummary.nickname,
    birthDate: profileInputSummary.birthDate,
    birthTime: profileInputSummary.birthTimeUnknown ? null : profileInputSummary.birthTime,
    birthTimeUnknown: Boolean(profileInputSummary.birthTimeUnknown),
    calendarType: profileInputSummary.calendarType,
    isLeapMonth: Boolean(profileInputSummary.isLeapMonth),
    lateNightJasiPolicy: profileInputSummary.lateNightJasiPolicy,
    gender: profileInputSummary.gender,
  };
}

function getBirthYear(profile) {
  return Number(String(profile.birthDate).slice(0, 4));
}

async function main() {
  if (fs.existsSync(outputPath)) {
    throw new Error(`${outputPath} already exists. Refusing to overwrite an existing zodiac after snapshot.`);
  }

  const practicalBaseline = JSON.parse(fs.readFileSync(practicalBaselinePath, 'utf8'));
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: {
      entries: [],
      noDiscovery: true,
    },
  });

  try {
    const { createTodayFortune } = await server.ssrLoadModule('/src/utils/fortuneEngine.js');
    const { createSajuAnalysis } = await server.ssrLoadModule('/src/domain/saju/createSajuAnalysis.js');
    const { calculateManseryeok } = await server.ssrLoadModule('/src/domain/saju/manseryeokEngine.js');
    const { createYearFortune } = await server.ssrLoadModule('/src/domain/fortune/yearFortuneEngine.js');
    const {
      createZodiacFortune,
      getZodiacByYear,
      getZodiacByYearPillar,
    } = await server.ssrLoadModule('/src/domain/fortune/zodiacFortuneEngine.js');

    const samples = practicalBaseline.samples.map((baselineSample) => {
      const profile = normalizeProfile(baselineSample.profileInputSummary);
      const todayFortune = createTodayFortune(profile, dateKey);
      const sajuAnalysis = createSajuAnalysis(profile, dateKey);
      const manseryeok = calculateManseryeok(profile);
      const yearFortune = createYearFortune(profile, sajuAnalysis, targetYear);
      const yearPillarZodiac = getZodiacByYearPillar(sajuAnalysis.pillars?.year);
      const birthYearZodiac = getZodiacByYear(getBirthYear(profile));
      const zodiac = yearPillarZodiac || birthYearZodiac;
      const zodiacFortune = createZodiacFortune({
        profile,
        selectedYear: getBirthYear(profile),
        selectedAnimal: zodiac?.animal,
        selectedIcon: zodiac?.icon,
        dateKey,
      });

      return {
        sampleId: baselineSample.sampleId,
        purpose: baselineSample.purpose,
        profileInputSummary: normalizeProfile(baselineSample.profileInputSummary),
        todayFortuneSummary: summarizeTodayFortune(todayFortune),
        sajuAnalysisSummary: summarizeSajuAnalysis(sajuAnalysis),
        manseryeokSummary: summarizeManseryeok(manseryeok),
        yearFortuneSummary: summarizeYearFortune(yearFortune),
        zodiacFortuneSummary: summarizeZodiacFortune(zodiacFortune),
      };
    });

    const snapshot = {
      snapshotVersion: 'fortune_engine_sample_snapshot_after_zodiac_improvement_v1',
      source: 'artificial_sample_profiles_only',
      productionLogicChanged: true,
      productionLogicChangeScope: 'zodiac_first_scope_only',
      practicalBaselineSnapshot: practicalBaselinePath,
      dateKey,
      targetYear,
      engineAccuracyApproval: 'Pending',
      externalReferenceComparison: 'Pending',
      lunarLeapExternalVerification: 'Pending',
      solarTimeCorrectionPolicy: 'Pending',
      samples,
    };

    fs.mkdirSync('docs/generated', { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
    console.log(`Zodiac fortune after snapshot written to ${outputPath}`);
  } finally {
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
