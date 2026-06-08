import { analyzeElements } from './elementAnalyzer.js';
import { calculateManseryeok } from './manseryeokEngine.js';

function hashString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickMany(items, seed, count) {
  return Array.from({ length: count }, (_, index) => items[(seed + index * 3) % items.length]);
}

function createMockSajuAnalysis(profile, dateKey, fallbackReason) {
  const seed = hashString(`${profile.id}-${profile.birthDate}-${profile.birthTime}-${dateKey}`);
  const elements = ['목', '화', '토', '금', '수'];
  const traits = ['차분함', '직관', '실행력', '관계 감각', '회복력', '계획성'];
  const weakPoints = ['과로', '충동 지출', '감정 소모', '미루기', '수면 부족'];
  const luckyKeywords = ['정리', '대화', '기회', '균형', '집중', '휴식', '성장'];

  return {
    profileId: profile.id,
    birth: {
      birthDate: profile.birthDate,
      birthTime: profile.birthTimeUnknown ? null : profile.birthTime,
      birthTimeUnknown: Boolean(profile.birthTimeUnknown),
      calendarType: profile.calendarType,
      isLeapMonth: Boolean(profile.isLeapMonth),
      gender: profile.gender,
    },
    pillars: {
      year: `mock-${elements[seed % elements.length]}`,
      month: `mock-${elements[(seed + 1) % elements.length]}`,
      day: `mock-${elements[(seed + 2) % elements.length]}`,
      hour: profile.birthTimeUnknown ? 'unknown' : `mock-${elements[(seed + 3) % elements.length]}`,
    },
    elements: {
      dominant: elements[seed % elements.length],
      supportive: elements[(seed + 2) % elements.length],
      balanceHint: `${elements[(seed + 4) % elements.length]} 기운을 보완하면 흐름이 안정됩니다.`,
    },
    traits: pickMany(traits, seed, 3),
    weakPoints: pickMany(weakPoints, seed + 5, 2),
    luckyKeywords: pickMany(luckyKeywords, seed + 9, 3),
    engineStatus: fallbackReason ? 'mock_fallback_manseryeok_failed' : 'mock_until_manseryeok_engine',
    fallbackReason,
  };
}

function buildTraits(elementAnalysis, dayMaster) {
  const dominant = elementAnalysis.dominant;
  const dayMasterLabel = dayMaster?.element || dominant;

  return [
    `${dayMasterLabel} 일간의 관찰력`,
    `${dominant} 기운의 흐름 감각`,
    '균형을 맞추려는 현실 감각',
  ];
}

function buildWeakPoints(elementAnalysis) {
  return [
    `${elementAnalysis.weak} 기운이 약하게 느껴질 때의 리듬 저하`,
    '한쪽 흐름에 치우치지 않도록 점검하기',
  ];
}

function buildLuckyKeywords(elementAnalysis, manseryeok) {
  const dominant = elementAnalysis.dominantList?.[0] || elementAnalysis.dominant;
  const dayElement = manseryeok.dayMaster?.element || dominant;

  return [`${dominant} 균형`, `${dayElement} 정리`, '차분한 점검'];
}

function formatPillar(pillar) {
  return pillar?.ganji || '시주 미상';
}

export function createSajuAnalysis(profile, dateKey) {
  const manseryeok = calculateManseryeok(profile);

  if (!manseryeok.ok) {
    return createMockSajuAnalysis(profile, dateKey, manseryeok.reason);
  }

  const elementAnalysis = analyzeElements(manseryeok.pillars);

  return {
    profileId: profile.id,
    birth: {
      birthDate: profile.birthDate,
      birthTime: profile.birthTimeUnknown ? null : profile.birthTime,
      birthTimeUnknown: Boolean(profile.birthTimeUnknown),
      calendarType: profile.calendarType,
      isLeapMonth: Boolean(profile.isLeapMonth),
      gender: profile.gender,
    },
    pillars: {
      year: formatPillar(manseryeok.pillars.year),
      month: formatPillar(manseryeok.pillars.month),
      day: formatPillar(manseryeok.pillars.day),
      hour: manseryeok.pillars.hour ? formatPillar(manseryeok.pillars.hour) : '시주 미상',
    },
    manseryeok,
    elements: {
      dominant: elementAnalysis.dominant,
      weak: elementAnalysis.weak,
      counts: elementAnalysis.counts,
      labels: elementAnalysis.labels,
      percentages: elementAnalysis.percentages,
      dominantList: elementAnalysis.dominantList,
      weakList: elementAnalysis.weakList,
      balanceLabel: elementAnalysis.balanceLabel,
      balanceHint: `${elementAnalysis.weak} 기운을 의식적으로 보완하면 흐름이 안정될 수 있습니다.`,
      notes: elementAnalysis.notes,
    },
    traits: buildTraits(elementAnalysis, manseryeok.dayMaster),
    weakPoints: buildWeakPoints(elementAnalysis),
    luckyKeywords: buildLuckyKeywords(elementAnalysis, manseryeok),
    engineStatus: manseryeok.engine,
  };
}
