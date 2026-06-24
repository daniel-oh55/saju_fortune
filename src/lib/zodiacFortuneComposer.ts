import {
  zodiacFortuneProfiles,
  type ZodiacAnimal,
  type ZodiacFortuneProfile,
} from '../data/zodiacFortuneProfiles';

export type ZodiacFortuneComposition = {
  animal: ZodiacAnimal;
  labelKo: string;
  hanja?: string;
  title: string;
  summary: string;
  dailyFlow: string;
  relationship: string;
  money: string;
  health: string;
  routine: string;
  caution: string;
};

const zodiacAnimalLabelMap: Record<string, ZodiacAnimal> = {
  쥐: 'rat',
  소: 'ox',
  호랑이: 'tiger',
  토끼: 'rabbit',
  용: 'dragon',
  뱀: 'snake',
  말: 'horse',
  양: 'goat',
  원숭이: 'monkey',
  닭: 'rooster',
  개: 'dog',
  돼지: 'pig',
};

function getDateSeed(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function hashText(text: string): number {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickBySeed<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function buildSeed(profile: ZodiacFortuneProfile, date: Date, variantSeed = 0): number {
  return hashText(`${profile.animal}-${profile.labelKo}-${getDateSeed(date)}-${variantSeed}`);
}

export function isZodiacAnimal(value: string): value is ZodiacAnimal {
  return value in zodiacFortuneProfiles;
}

export function getZodiacAnimalByLabel(label: string): ZodiacAnimal | null {
  return zodiacAnimalLabelMap[label] || null;
}

export function composeZodiacFortune(
  animal: ZodiacAnimal,
  options: {
    date?: Date;
    variantSeed?: number;
  } = {},
): ZodiacFortuneComposition {
  const profile = zodiacFortuneProfiles[animal] || zodiacFortuneProfiles.dragon;
  const seed = buildSeed(profile, options.date || new Date(), options.variantSeed || 0);
  const baseTrait = pickBySeed(profile.baseTraits, seed + 1);
  const strength = pickBySeed(profile.strengths, seed + 3);
  const dailyTheme = pickBySeed(profile.dailyThemes, seed + 5);
  const relationshipHint = pickBySeed(profile.relationshipHints, seed + 7);
  const moneyTone = pickBySeed(profile.moneyTone, seed + 11);
  const healthTone = pickBySeed(profile.healthTone, seed + 13);
  const routineHint = pickBySeed(profile.routineHints, seed + 17);
  const caution = pickBySeed(profile.cautions, seed + 19);

  return {
    animal: profile.animal,
    labelKo: profile.labelKo,
    hanja: profile.hanja,
    title: `오늘의 ${profile.labelKo}띠 흐름`,
    summary: `${baseTrait} 오늘은 ${strength}`,
    dailyFlow: `${dailyTheme} 하루의 방향을 크게 바꾸기보다 지금 보이는 흐름을 차분히 살펴보세요.`,
    relationship: `${relationshipHint} 대화에서는 결론보다 서로의 속도를 맞추는 태도가 도움이 됩니다.`,
    money: `${moneyTone} 지출 흐름과 예산 범위를 차분히 확인하는 정도가 어울립니다.`,
    health: `${healthTone} 컨디션을 살피며 휴식과 수면 리듬을 가볍게 챙겨보세요.`,
    routine: `${routineHint} 바로 할 수 있는 작은 루틴 하나가 하루를 정돈하는 데 도움이 됩니다.`,
    caution: `${caution} 오늘의 흐름은 참고용으로 살펴보고, 중요한 선택은 여러 정보를 함께 확인해보세요.`,
  };
}
