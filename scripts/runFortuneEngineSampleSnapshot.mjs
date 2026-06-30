import fs from 'node:fs';
import { createServer } from 'vite';

const dateKey = '2026-06-30';
const targetYear = 2026;
const outputPath = 'docs/generated/fortune-engine-sample-snapshot.json';

const sampleProfiles = [
  {
    sampleId: 'solar-known-time-01',
    purpose: 'standard solar known-time sample',
    profile: {
      id: 'sample-solar-known-time-01',
      nickname: 'Sample A',
      birthDate: '1990-03-15',
      birthTime: '09:30',
      birthTimeUnknown: false,
      calendarType: 'solar',
      isLeapMonth: false,
      lateNightJasiPolicy: 'same_day',
      gender: 'female',
    },
  },
  {
    sampleId: 'solar-unknown-time-01',
    purpose: 'birthTimeUnknown 시주 미상 sample',
    profile: {
      id: 'sample-solar-unknown-time-01',
      nickname: 'Sample B',
      birthDate: '1988-07-21',
      birthTime: null,
      birthTimeUnknown: true,
      calendarType: 'solar',
      isLeapMonth: false,
      lateNightJasiPolicy: 'same_day',
      gender: 'male',
    },
  },
  {
    sampleId: 'solar-late-night-same-day-01',
    purpose: '23시 이후 자시 same-day policy sample',
    profile: {
      id: 'sample-solar-late-night-same-day-01',
      nickname: 'Sample C',
      birthDate: '1992-11-08',
      birthTime: '23:30',
      birthTimeUnknown: false,
      calendarType: 'solar',
      isLeapMonth: false,
      lateNightJasiPolicy: 'same_day',
      gender: 'female',
    },
  },
  {
    sampleId: 'solar-late-night-next-day-01',
    purpose: '23시 이후 자시 next-day policy sample',
    profile: {
      id: 'sample-solar-late-night-next-day-01',
      nickname: 'Sample D',
      birthDate: '1992-11-08',
      birthTime: '23:30',
      birthTimeUnknown: false,
      calendarType: 'solar',
      isLeapMonth: false,
      lateNightJasiPolicy: 'next_day',
      gender: 'female',
    },
  },
  {
    sampleId: 'lunar-non-leap-01',
    purpose: '음력 일반 월 sample',
    profile: {
      id: 'sample-lunar-non-leap-01',
      nickname: 'Sample E',
      birthDate: '1991-01-10',
      birthTime: '14:20',
      birthTimeUnknown: false,
      calendarType: 'lunar',
      isLeapMonth: false,
      lateNightJasiPolicy: 'same_day',
      gender: 'male',
    },
  },
  {
    sampleId: 'lunar-leap-01',
    purpose: '음력/윤달 샘플 외부 검증 대상',
    profile: {
      id: 'sample-lunar-leap-01',
      nickname: 'Sample F',
      birthDate: '1995-08-10',
      birthTime: '10:10',
      birthTimeUnknown: false,
      calendarType: 'lunar',
      isLeapMonth: true,
      lateNightJasiPolicy: 'same_day',
      gender: 'female',
    },
  },
  {
    sampleId: 'term-boundary-01',
    purpose: '절기 경계 sample',
    profile: {
      id: 'sample-term-boundary-01',
      nickname: 'Sample G',
      birthDate: '1990-02-04',
      birthTime: '05:00',
      birthTimeUnknown: false,
      calendarType: 'solar',
      isLeapMonth: false,
      lateNightJasiPolicy: 'same_day',
      gender: 'male',
    },
  },
  {
    sampleId: 'profile-zodiac-boundary-01',
    purpose: '사주 연주 띠와 일반 출생연도 띠 차이 검토 sample',
    profile: {
      id: 'sample-profile-zodiac-boundary-01',
      nickname: 'Sample H',
      birthDate: '1988-02-03',
      birthTime: '12:00',
      birthTimeUnknown: false,
      calendarType: 'solar',
      isLeapMonth: false,
      lateNightJasiPolicy: 'same_day',
      gender: 'female',
    },
  },
];

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

function summarizeProfileInput(profile) {
  return {
    id: profile.id,
    nickname: profile.nickname,
    birthDate: profile.birthDate,
    birthTime: profile.birthTimeUnknown ? null : profile.birthTime,
    birthTimeUnknown: Boolean(profile.birthTimeUnknown),
    calendarType: profile.calendarType,
    isLeapMonth: Boolean(profile.isLeapMonth),
    lateNightJasiPolicy: profile.lateNightJasiPolicy,
    gender: profile.gender,
  };
}

function getBirthYear(profile) {
  return Number(String(profile.birthDate).slice(0, 4));
}

async function main() {
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

    const samples = sampleProfiles.map(({ sampleId, purpose, profile }) => {
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
        sampleId,
        purpose,
        profileInputSummary: summarizeProfileInput(profile),
        todayFortuneSummary: summarizeTodayFortune(todayFortune),
        sajuAnalysisSummary: summarizeSajuAnalysis(sajuAnalysis),
        manseryeokSummary: summarizeManseryeok(manseryeok),
        yearFortuneSummary: summarizeYearFortune(yearFortune),
        zodiacFortuneSummary: summarizeZodiacFortune(zodiacFortune),
      };
    });

    const snapshot = {
      snapshotVersion: 'fortune_engine_sample_snapshot_v1',
      dateKey,
      targetYear,
      source: 'artificial_sample_profiles_only',
      productionLogicChanged: false,
      engineAccuracyApproval: 'Pending',
      externalVerification: {
        '음력/윤달 샘플 외부 검증': 'Pending',
        '태양시 보정 적용 여부': 'Pending',
      },
      samples,
    };

    fs.mkdirSync('docs/generated', { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
    console.log(`Fortune engine sample snapshot written to ${outputPath}`);
  } finally {
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
