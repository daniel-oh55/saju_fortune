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

export function createSajuAnalysis(profile, dateKey) {
  // 추후 만세력 계산 엔진으로 교체할 영역입니다.
  // 지금은 프로필과 날짜를 기반으로 안정적인 mock 분석값만 생성합니다.
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
    engineStatus: 'mock_until_manseryeok_engine',
  };
}
