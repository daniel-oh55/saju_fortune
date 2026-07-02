import {
  monthDetailTemplates,
  yearCategories,
  yearDetailTemplates,
  yearFortuneTemplates,
} from '../../data/yearFortuneTemplates.js';

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

function clampYearMonthlyScore(score) {
  return Math.max(58, Math.min(98, score));
}

function getAnnualElementTone(sajuAnalysis) {
  const dominant = sajuAnalysis.elements?.dominant || '균형';
  const weak = sajuAnalysis.elements?.weak || '보완';

  return {
    dominant,
    weak,
    summary: `${dominant} 기운을 중심에 두고 ${weak} 기운을 천천히 보완하면 2026년의 선택이 더 안정적으로 정리됩니다.`,
    detail: `강하게 드러나는 ${dominant} 흐름은 살리고, 부족하게 느껴지는 ${weak} 영역은 무리 없이 채워가는 방향이 좋습니다.`,
  };
}

function getMonthFocus(month) {
  const monthFocuses = [
    { label: '정리와 계획', reason: '새 흐름을 열기 전 기준을 세우기 좋은 달', advice: '일정과 지출을 먼저 정리해보세요', caution: '한 번에 너무 많은 약속을 잡지 않는 편이 좋습니다' },
    { label: '관계 조율', reason: '주변의 요청과 내 속도를 맞춰야 하는 달', advice: '중요한 대화는 짧게 미루지 말고 확인해보세요', caution: '감정적인 단정은 피하는 것이 안정적입니다' },
    { label: '실행 리듬', reason: '작게 시작한 일이 실제 움직임으로 이어지기 쉬운 달', advice: '우선순위를 세 가지 안쪽으로 좁혀보세요', caution: '속도보다 지속 가능성을 먼저 보세요' },
    { label: '휴식과 회복', reason: '쌓인 피로와 마음의 긴장을 풀어야 다음 흐름이 살아나는 달', advice: '수면과 식사 리듬을 먼저 챙겨보세요', caution: '불편함이 이어지면 전문가 상담을 권합니다' },
    { label: '기회 탐색', reason: '새 제안이나 배움의 실마리가 보이기 쉬운 달', advice: '조건과 역할을 차분히 비교해보세요', caution: '좋아 보이는 말만 믿고 서두르지 마세요' },
    { label: '집중 마무리', reason: '흩어진 일을 정리하고 성과를 확인하기 좋은 달', advice: '완료 기준을 분명히 적어두면 도움이 됩니다', caution: '완벽주의로 마무리를 늦추지 않는 편이 좋습니다' },
    { label: '균형 점검', reason: '관계, 일, 컨디션의 균형을 다시 맞추기 좋은 달', advice: '최근 반복되는 부담을 하나씩 덜어보세요', caution: '무리한 약속은 뒤로 미루는 선택도 필요합니다' },
    { label: '성장과 배움', reason: '새 지식이나 경험이 이후 선택의 기준이 되는 달', advice: '배운 내용을 기록하고 바로 써먹어보세요', caution: '비교심이 커지면 내 속도를 먼저 확인하세요' },
    { label: '재정 점검', reason: '돈의 흐름과 생활 리듬을 함께 살피기 좋은 달', advice: '고정비와 반복 지출을 점검해보세요', caution: '투자나 계약은 실제 조건을 직접 확인하세요' },
    { label: '대화와 신뢰', reason: '말의 온도와 약속의 정확함이 중요해지는 달', advice: '고마움과 요청을 분리해 표현해보세요', caution: '오해가 생기면 빠르게 확인하는 편이 좋습니다' },
    { label: '정돈과 선택', reason: '올해의 성과와 아쉬움을 구분하기 좋은 달', advice: '남길 것과 줄일 것을 명확히 정해보세요', caution: '아쉬움만 붙잡기보다 다음 선택을 준비하세요' },
    { label: '회고와 충전', reason: '다음 해를 위한 에너지를 천천히 모으기 좋은 달', advice: '무리한 확장보다 회복과 정리에 집중해보세요', caution: '연말 분위기에 휩쓸려 과소비하지 않도록 살펴보세요' },
  ];

  return monthFocuses[month - 1] || monthFocuses[0];
}

function getMonthlyScoreModifier(month, seed, sajuAnalysis) {
  const dominant = sajuAnalysis.elements?.dominant || '';
  const weak = sajuAnalysis.elements?.weak || '';
  const seedMovement = (seed % 7) - 3;
  const monthlyModifier = ((month * 2 + hashString(`${dominant}-${weak}-${month}`)) % 5) - 2;

  return seedMovement + monthlyModifier;
}

function composeMonthlyAdvice({ month, score, baseText, sajuAnalysis, monthFocus }) {
  const dominant = sajuAnalysis.elements?.dominant || '강한';
  const weak = sajuAnalysis.elements?.weak || '부족한';
  const scoreTone =
    score >= 82 ? '흐름이 비교적 또렷한 편' : score >= 68 ? '균형을 맞추기 좋은 편' : '천천히 점검할수록 안정되는 편';

  return `${month}월은 ${monthFocus.label}에 초점이 있습니다. reason: ${monthFocus.reason}이라 ${dominant} 기운의 장점을 살리면 ${scoreTone}입니다. advice: ${monthFocus.advice}. caution: ${weak} 기운이 부족하게 느껴질 수 있으니 ${monthFocus.caution}. ${baseText}`;
}

export function createYearFortune(profile, sajuAnalysis, targetYear = 2026) {
  const seed = hashString(`${profile.id}-${targetYear}-${sajuAnalysis.elements.dominant}`);
  const annualElementTone = getAnnualElementTone(sajuAnalysis);
  const categories = yearCategories.map((category, index) => {
    const categorySeed = hashString(`${seed}-${category.id}-${index}`);
    const baseSummary = pickBySeed(yearFortuneTemplates[category.id], categorySeed);
    const baseDetail = pickBySeed(yearDetailTemplates[category.id], categorySeed + 7);
    const score = clampYearMonthlyScore(scoreFromSeed(categorySeed) + ((categorySeed % 5) - 2));

    return {
      ...category,
      score,
      summary: `${baseSummary} ${annualElementTone.dominant} 기운은 살리고 ${annualElementTone.weak} 기운은 천천히 보완해보세요.`,
      detail: `${baseDetail} ${annualElementTone.detail}`,
    };
  });

  const averageScore = Math.round(
    categories.reduce((total, category) => total + category.score, 0) / categories.length,
  );

  return {
    id: `${profile.id}-${targetYear}`,
    targetYear,
    averageScore,
    summary: `${pickBySeed(yearFortuneTemplates.overall, seed)} ${annualElementTone.summary}`,
    keyword: sajuAnalysis.luckyKeywords[0],
    categories,
    months: Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthSeed = hashString(`${seed}-month-${month}`);
      const monthFocus = getMonthFocus(month);
      const score = clampYearMonthlyScore(
        scoreFromSeed(monthSeed) + getMonthlyScoreModifier(month, monthSeed, sajuAnalysis),
      );
      const note = `${monthFocus.label} · ${pickBySeed(
        ['정리와 준비', '관계 조율', '재정 점검', '휴식과 회복', '새로운 기회', '집중 실행'],
        monthSeed,
      )}`;
      const baseText = pickBySeed(monthDetailTemplates, monthSeed + 5);

      return {
        month,
        score,
        note,
        detail: composeMonthlyAdvice({ month, score, baseText, sajuAnalysis, monthFocus }),
      };
    }),
  };
}
