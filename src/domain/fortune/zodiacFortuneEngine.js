import {
  composeZodiacFortune,
  getZodiacAnimalByLabel,
} from '../../lib/zodiacFortuneComposer';

export const zodiacAnimals = [
  { animal: '쥐', icon: '🐭' },
  { animal: '소', icon: '🐮' },
  { animal: '호랑이', icon: '🐯' },
  { animal: '토끼', icon: '🐰' },
  { animal: '용', icon: '🐲' },
  { animal: '뱀', icon: '🐍' },
  { animal: '말', icon: '🐴' },
  { animal: '양', icon: '🐑' },
  { animal: '원숭이', icon: '🐵' },
  { animal: '닭', icon: '🐔' },
  { animal: '개', icon: '🐶' },
  { animal: '돼지', icon: '🐷' },
];

const earthlyBranchAnimals = {
  자: { animal: '쥐', icon: '🐭' },
  축: { animal: '소', icon: '🐮' },
  인: { animal: '호랑이', icon: '🐯' },
  묘: { animal: '토끼', icon: '🐰' },
  진: { animal: '용', icon: '🐲' },
  사: { animal: '뱀', icon: '🐍' },
  오: { animal: '말', icon: '🐴' },
  미: { animal: '양', icon: '🐑' },
  신: { animal: '원숭이', icon: '🐵' },
  유: { animal: '닭', icon: '🐔' },
  술: { animal: '개', icon: '🐶' },
  해: { animal: '돼지', icon: '🐷' },
};

export const zodiacYears = Array.from({ length: 2019 - 1948 + 1 }, (_, index) => {
  const year = 1948 + index;
  const zodiac = zodiacAnimals[index % zodiacAnimals.length];

  return {
    year,
    animal: zodiac.animal,
    icon: zodiac.icon,
  };
});

const categoryTemplates = {
  overall: [
    '오늘은 무리하게 앞서가기보다 흐름을 살피며 움직이면 좋은 날입니다.',
    '작은 계획을 먼저 정리하면 하루가 한결 편안하게 흘러갈 수 있습니다.',
    '익숙한 일 안에서도 참고할 만한 힌트가 보이는 날입니다.',
  ],
  money: [
    '지출 전 한 번 더 확인하면 불필요한 소비를 줄이는 데 도움이 됩니다.',
    '정산이나 송금처럼 숫자가 오가는 일은 차분히 확인해보세요.',
    '큰 판단보다 생활 속 돈의 흐름을 점검하는 쪽이 더 잘 맞습니다.',
  ],
  relationship: [
    '관계에서는 빠른 결론보다 대화의 온도를 살피는 태도가 좋습니다.',
    '상대의 속도를 존중하면 작은 오해를 줄이는 데 도움이 됩니다.',
    '먼저 안부를 묻는 가벼운 말이 분위기를 부드럽게 만들 수 있습니다.',
  ],
  work: [
    '업무나 학업에서는 우선순위를 다시 정리하면 집중이 쉬워집니다.',
    '문서, 일정, 메시지를 한 번 더 확인하는 습관이 도움이 됩니다.',
    '협업에서는 가능한 범위를 분명히 말하는 편이 안정적입니다.',
  ],
  health: [
    '오늘은 컨디션을 살피며 속도를 조절하는 것이 좋습니다.',
    '수면, 수분, 식사처럼 기본적인 루틴을 챙겨보세요.',
    '가벼운 스트레칭이나 짧은 휴식이 몸의 긴장을 푸는 데 도움이 됩니다.',
  ],
};

const categoryMeta = [
  { id: 'overall', label: '오늘 흐름' },
  { id: 'money', label: '재물' },
  { id: 'relationship', label: '관계' },
  { id: 'work', label: '일·학업' },
  { id: 'health', label: '컨디션' },
];

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

function clampZodiacScore(score) {
  return Math.max(45, Math.min(98, Math.round(score)));
}

const animalTone = {
  rat: '빠른 판단과 정보 감각이 살아나는 흐름',
  ox: '차분한 지속력과 현실적인 선택이 힘을 받는 흐름',
  tiger: '추진력과 결단이 필요한 흐름',
  rabbit: '섬세한 관계 감각과 조율이 어울리는 흐름',
  dragon: '자신감과 확장성이 살아나는 흐름',
  snake: '관찰력과 전략적인 선택이 중요한 흐름',
  horse: '움직임과 실행력이 리듬을 만드는 흐름',
  goat: '배려와 균형 감각이 도움이 되는 흐름',
  monkey: '재치와 응용력이 문제를 푸는 흐름',
  rooster: '정리와 기준 세우기가 힘이 되는 흐름',
  dog: '신뢰와 책임감이 관계를 안정시키는 흐름',
  pig: '여유와 회복, 꾸준함이 필요한 흐름',
};

const categoryFocus = {
  overall: '하루 전체의 리듬과 선택 방향',
  money: '지출 조건 확인과 작은 절약',
  relationship: '대화의 거리감과 감정 온도',
  work: '업무 정리와 우선순위 실행',
  health: '컨디션, 수면, 무리하지 않는 루틴',
};

const categoryAdvice = {
  overall: [
    '큰 방향을 바꾸기보다 오늘 해야 할 일을 작게 나누면 좋습니다.',
    '먼저 정리하고 움직이면 흐름을 안정적으로 잡을 수 있습니다.',
    '서두르기보다 필요한 선택을 하나씩 확인해 보세요.',
  ],
  money: [
    '즉흥 지출보다 조건과 잔액을 한 번 더 확인하는 쪽이 유리합니다.',
    '작은 예약이나 결제는 기록을 남겨 두면 마음이 가벼워집니다.',
    '새로운 소비보다 이미 정한 예산 안에서 조절해 보세요.',
  ],
  relationship: [
    '상대의 반응을 단정하기보다 말의 온도를 부드럽게 맞춰 보세요.',
    '짧은 안부나 확인 메시지가 관계의 긴장을 낮출 수 있습니다.',
    '가까운 사이일수록 설명을 조금 더 보태면 오해를 줄일 수 있습니다.',
  ],
  work: [
    '중요한 일부터 순서를 잡고, 남은 일은 작게 끊어 처리해 보세요.',
    '문서와 메시지를 한 번 더 확인하면 불필요한 되돌림을 줄일 수 있습니다.',
    '혼자 밀어붙이기보다 필요한 범위를 분명히 말하는 편이 안정적입니다.',
  ],
  health: [
    '무리한 계획보다 수면, 물, 식사 리듬을 먼저 챙겨 보세요.',
    '몸의 신호를 참고하면서 휴식 시간을 짧게라도 확보하는 편이 좋습니다.',
    '과한 긴장보다 가벼운 스트레칭과 정돈된 루틴이 도움이 됩니다.',
  ],
};

const categoryCaution = {
  overall: '중요한 선택은 한 번 더 확인하고 움직이세요.',
  money: '급한 결제나 약속은 조건을 다시 보는 것이 좋습니다.',
  relationship: '말이 짧아지면 의도와 다르게 전해질 수 있습니다.',
  work: '우선순위가 흐려지면 작은 일부터 정리해 보세요.',
  health: '피로가 느껴지면 속도를 낮추고 회복을 먼저 챙기세요.',
};

const categoryScoreModifier = {
  overall: 1,
  money: -1,
  relationship: 0,
  work: 1,
  health: -1,
};

function getAnimalTone(selectedAnimal, animalKey) {
  return animalTone[animalKey] || `${selectedAnimal || '선택한 띠'}의 장점을 차분히 살리는 흐름`;
}

function getZodiacCategoryFocus(categoryId) {
  return categoryFocus[categoryId] || '오늘의 작은 선택';
}

function getCategoryAdvice(categoryId, seed) {
  return pickBySeed(categoryAdvice[categoryId] || categoryAdvice.overall, seed);
}

function composeZodiacCategorySummary({ categoryId, selectedAnimal, animalKey, score, seed, baseSummary }) {
  const tone = getAnimalTone(selectedAnimal, animalKey);
  const focus = getZodiacCategoryFocus(categoryId);
  const advice = getCategoryAdvice(categoryId, seed);
  const caution = categoryCaution[categoryId] || categoryCaution.overall;
  const scoreHint =
    score >= 82
      ? '흐름이 비교적 선명합니다.'
      : score >= 68
        ? '차분히 맞춰 가기 좋습니다.'
        : '무리하지 않는 조절이 필요합니다.';

  return `${baseSummary} ${tone}을 바탕으로 ${focus}를 살펴보세요. ${scoreHint} ${advice} ${caution}`;
}

function composeZodiacDetail({ selectedAnimal, animalKey, categories, seed }) {
  const tone = getAnimalTone(selectedAnimal, animalKey);
  const strongest = [...categories].sort((a, b) => b.score - a.score)[0] || categories[0];
  const softest = [...categories].sort((a, b) => a.score - b.score)[0] || categories[0];
  const strongestFocus = getZodiacCategoryFocus(strongest.id);
  const softestFocus = getZodiacCategoryFocus(softest.id);
  const advice = getCategoryAdvice(strongest.id, seed + strongest.score);
  const caution = categoryCaution[softest.id] || categoryCaution.overall;

  return `${selectedAnimal || '선택한 띠'}의 오늘 흐름은 ${tone}입니다. 강하게 살릴 부분은 ${strongest.label}의 ${strongestFocus}이고, 천천히 조절할 부분은 ${softest.label}의 ${softestFocus}입니다. ${advice} ${caution}`;
}

function getDateFromDateKey(dateKey) {
  const [year, month, day] = String(dateKey || '')
    .split('-')
    .map((value) => Number(value));

  if (!year || !month || !day) return new Date();

  return new Date(year, month - 1, day);
}

export function getZodiacByYear(year) {
  const found = zodiacYears.find((item) => item.year === Number(year));
  return found || null;
}

export function getZodiacAnimalByYear(year) {
  return getZodiacByYear(year)?.animal || null;
}

export function getZodiacByYearPillar(yearPillar) {
  const branch = String(yearPillar || '').trim().slice(-1);
  return earthlyBranchAnimals[branch] || null;
}

export function getYearsByAnimal(animal) {
  return zodiacYears.filter((item) => item.animal === animal);
}

export function createZodiacFortune({ profile, selectedYear, selectedAnimal, selectedIcon, dateKey }) {
  const zodiac = {
    ...(getZodiacByYear(selectedYear) || getZodiacByYear(1996)),
    ...(selectedAnimal ? { animal: selectedAnimal } : {}),
    ...(selectedIcon ? { icon: selectedIcon } : {}),
  };
  const seed = hashString(`${profile.id}-${dateKey}-${zodiac.year}-${zodiac.animal}`);
  const animalKey = getZodiacAnimalByLabel(zodiac.animal);
  const composition = composeZodiacFortune(animalKey || 'dragon', {
    date: getDateFromDateKey(dateKey),
    variantSeed: seed,
  });
  const categorySummaryMap = {
    overall: composition.dailyFlow,
    money: composition.money,
    relationship: composition.relationship,
    work: composition.routine,
    health: composition.health,
  };

  const categories = categoryMeta.map((category, index) => {
    const categorySeed = hashString(`${seed}-${category.id}-${index}`);
    const baseScore = scoreFromSeed(categorySeed);
    const score = clampZodiacScore(baseScore + (categoryScoreModifier[category.id] || 0));
    const baseSummary = categorySummaryMap[category.id] || pickBySeed(categoryTemplates[category.id], categorySeed);

    return {
      ...category,
      score,
      summary: composeZodiacCategorySummary({
        categoryId: category.id,
        selectedAnimal: zodiac.animal,
        animalKey,
        score,
        seed: categorySeed,
        baseSummary,
      }),
    };
  });

  const score = Math.round(
    categories.reduce((total, category) => total + category.score, 0) / categories.length,
  );

  return {
    year: zodiac.year,
    animal: zodiac.animal,
    icon: zodiac.icon,
    score,
    summary: `${zodiac.year}년 ${zodiac.animal}띠의 오늘은 ${composition.summary}`,
    detail:
      `${composeZodiacDetail({
        selectedAnimal: zodiac.animal,
        animalKey,
        categories,
        seed,
      })} ${composition.caution}`,
    categories,
  };
}
