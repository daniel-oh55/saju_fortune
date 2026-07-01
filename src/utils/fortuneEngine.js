import { categoryMeta, fortuneTemplates } from '../data/fortuneTemplates.js';
import { createSajuAnalysis } from '../domain/saju/createSajuAnalysis.js';

export const CURRENT_FORTUNE_SCHEMA_VERSION = 6;

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

function clampScore(score) {
  return Math.max(55, Math.min(98, score));
}

function getCategoryFocus(categoryId) {
  const focusByCategory = {
    overall: {
      tone: '하루 전체의 균형',
      reason: '전체 흐름은 오늘의 기본 리듬과 주변 상황을 함께 살필 때 더 선명해집니다.',
      advice: '가장 중요한 일부터 차분히 정리하면 하루의 중심을 잡기 쉽습니다.',
      caution: '한 번에 많은 것을 바꾸려 하기보다 작은 선택부터 안정적으로 다뤄보세요.',
    },
    money: {
      tone: '지출과 조건 확인',
      reason: '재물 흐름은 필요한 소비와 미뤄도 되는 소비를 구분할 때 안정됩니다.',
      advice: '결제, 정산, 약속처럼 숫자가 오가는 일은 기록으로 남겨두면 좋습니다.',
      caution: '권유나 기분에 따라 급히 움직이는 돈은 잠시 시간을 두고 판단하세요.',
    },
    love: {
      tone: '관계의 온도와 대화',
      reason: '관계운은 말의 속도와 상대의 리듬을 함께 살필 때 부드러워집니다.',
      advice: '짧더라도 진심이 담긴 표현을 먼저 건네면 분위기가 한결 편안해질 수 있습니다.',
      caution: '상대의 반응을 단정하거나 결론을 재촉하지 않도록 마음의 여유를 남겨두세요.',
    },
    work: {
      tone: '업무 정리와 신뢰',
      reason: '직장운은 속도보다 우선순위와 확인이 성과의 안정감을 만들어줍니다.',
      advice: '일정, 메시지, 약속 범위를 한 번 더 점검하면 불필요한 반복을 줄일 수 있습니다.',
      caution: '가능 범위를 넘는 약속은 피하고 필요한 조율은 미리 말해두는 편이 좋습니다.',
    },
    study: {
      tone: '집중과 복습 리듬',
      reason: '학업운은 새로운 양을 늘리기보다 핵심을 다시 붙잡을 때 힘이 납니다.',
      advice: '짧게 나누어 반복하고 헷갈린 부분을 따로 적어두면 이해가 더 분명해집니다.',
      caution: '결과를 단정하거나 무리하게 범위를 넓히기보다 오늘 가능한 분량에 집중하세요.',
    },
    health: {
      tone: '컨디션 회복과 리듬',
      reason: '건강운은 몸의 기본 리듬을 살피고 작은 회복 루틴을 챙길 때 안정됩니다.',
      advice: '수분, 식사, 휴식처럼 바로 조절할 수 있는 것부터 부드럽게 챙겨보세요.',
      caution: '불편함이 이어진다면 운세로 판단하지 말고 전문가의 도움을 우선하세요.',
    },
  };

  return focusByCategory[categoryId] || focusByCategory.overall;
}

function getElementTone(elementKey) {
  const toneByElement = {
    wood: '성장과 조율',
    fire: '표현과 활력',
    earth: '안정과 정리',
    metal: '기준과 판단',
    water: '유연함과 회복',
  };

  return toneByElement[elementKey] || '균형과 점검';
}

function getCategoryScoreModifier(categoryId, categorySeed, sajuAnalysis) {
  const categoryBias = {
    overall: 1,
    money: -1,
    love: 0,
    work: 1,
    study: 0,
    health: -1,
  };
  const dominantElement = sajuAnalysis.elements?.dominant || '';
  const weakElement = sajuAnalysis.elements?.weak || '';
  const dominantSeed = hashString(`${categoryId}-${dominantElement}`) % 5;
  const weakSeed = hashString(`${categoryId}-${weakElement}`) % 3;
  const seedMovement = (categorySeed % 7) - 3;
  const categoryModifier = (categoryBias[categoryId] || 0) + dominantSeed - weakSeed + seedMovement;

  return Math.max(-5, Math.min(5, categoryModifier));
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

function composeCategoryDetail({ categoryId, score, baseDetail, sajuAnalysis, categoryFocus }) {
  const dominantTone = getElementTone(sajuAnalysis.elements?.dominant);
  const weakTone = getElementTone(sajuAnalysis.elements?.weak);
  const scoreTone =
    score >= 82 ? '흐름이 비교적 또렷한 편' : score >= 68 ? '균형을 맞추기 좋은 편' : '천천히 점검할수록 안정되는 편';
  const reason = `이 카테고리는 ${categoryFocus.tone}이 핵심입니다. ${categoryFocus.reason} 사주의 강한 기운은 ${dominantTone}, 보완할 기운은 ${weakTone} 쪽으로 읽힙니다.`;
  const advice = `${scoreTone}이니 ${categoryFocus.advice}`;
  const caution = categoryFocus.caution;

  return [reason, advice, caution, baseDetail].join('\n\n');
}

export function buildProfileId(profile) {
  return hashString(
    `${profile.nickname}-${profile.birthDate}-${profile.birthTime}-${profile.birthTimeUnknown}-${profile.lateNightJasiPolicy || 'same_day'}-${profile.calendarType}-${profile.isLeapMonth}-${profile.gender}`,
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
    const categoryFocus = getCategoryFocus(category.id);
    const score = clampScore(scoreFromSeed(seed) + getCategoryScoreModifier(category.id, seed, sajuAnalysis));
    const baseDetail = buildDetailedFortuneText({
      template,
      seed,
      sajuAnalysis,
      luckyColor,
      luckyItem,
    });

    return {
      ...category,
      score,
      summary: `${pickBySeed(template.summary, seed)} 오늘은 ${categoryFocus.tone}에 초점을 맞춰보세요.`,
      detail: composeCategoryDetail({
        categoryId: category.id,
        score,
        baseDetail,
        sajuAnalysis,
        categoryFocus,
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
