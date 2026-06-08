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

export function getZodiacByYear(year) {
  const found = zodiacYears.find((item) => item.year === Number(year));
  return found || null;
}

export function getZodiacAnimalByYear(year) {
  return getZodiacByYear(year)?.animal || null;
}

export function getYearsByAnimal(animal) {
  return zodiacYears.filter((item) => item.animal === animal);
}

export function createZodiacFortune({ profile, selectedYear, dateKey }) {
  const zodiac = getZodiacByYear(selectedYear) || getZodiacByYear(1996);
  const seed = hashString(`${profile.id}-${dateKey}-${zodiac.year}-${zodiac.animal}`);

  const categories = categoryMeta.map((category, index) => {
    const categorySeed = hashString(`${seed}-${category.id}-${index}`);

    return {
      ...category,
      score: scoreFromSeed(categorySeed),
      summary: pickBySeed(categoryTemplates[category.id], categorySeed),
    };
  });

  const score = Math.round(
    categories.reduce((total, category) => total + category.score, 0) / categories.length,
  );
  const luckyKeyword = pickBySeed(['정리', '대화', '점검', '균형', '휴식', '집중'], seed + 11);
  const luckyColor = pickBySeed(['민트', '코랄', '하늘색', '아이보리', '라벤더'], seed + 17);
  const luckyItem = pickBySeed(['메모장', '텀블러', '캘린더', '손수건', '이어폰'], seed + 23);

  return {
    year: zodiac.year,
    animal: zodiac.animal,
    icon: zodiac.icon,
    score,
    summary: `${zodiac.year}년 ${zodiac.animal}띠의 오늘은 ${luckyKeyword}을 중심으로 흐름을 살피면 편안합니다.`,
    detail:
      '오늘의 띠별 흐름은 참고용으로 가볍게 살펴보면 좋습니다. 중요한 결정은 여러 정보를 함께 확인하고, 사람과의 대화에서는 부드러운 표현을 선택해보세요. 속도를 조금 낮추면 놓치기 쉬운 부분을 차분히 점검하는 데 도움이 됩니다.',
    categories,
    luckyKeyword,
    luckyColor,
    luckyItem,
  };
}
