export const HEAVENLY_STEMS = [
  { ko: '갑', hanja: '甲', element: '목', elementKey: 'wood', yinYang: '양' },
  { ko: '을', hanja: '乙', element: '목', elementKey: 'wood', yinYang: '음' },
  { ko: '병', hanja: '丙', element: '화', elementKey: 'fire', yinYang: '양' },
  { ko: '정', hanja: '丁', element: '화', elementKey: 'fire', yinYang: '음' },
  { ko: '무', hanja: '戊', element: '토', elementKey: 'earth', yinYang: '양' },
  { ko: '기', hanja: '己', element: '토', elementKey: 'earth', yinYang: '음' },
  { ko: '경', hanja: '庚', element: '금', elementKey: 'metal', yinYang: '양' },
  { ko: '신', hanja: '辛', element: '금', elementKey: 'metal', yinYang: '음' },
  { ko: '임', hanja: '壬', element: '수', elementKey: 'water', yinYang: '양' },
  { ko: '계', hanja: '癸', element: '수', elementKey: 'water', yinYang: '음' },
];

export const EARTHLY_BRANCHES = [
  { ko: '자', hanja: '子', element: '수', elementKey: 'water', yinYang: '양' },
  { ko: '축', hanja: '丑', element: '토', elementKey: 'earth', yinYang: '음' },
  { ko: '인', hanja: '寅', element: '목', elementKey: 'wood', yinYang: '양' },
  { ko: '묘', hanja: '卯', element: '목', elementKey: 'wood', yinYang: '음' },
  { ko: '진', hanja: '辰', element: '토', elementKey: 'earth', yinYang: '양' },
  { ko: '사', hanja: '巳', element: '화', elementKey: 'fire', yinYang: '음' },
  { ko: '오', hanja: '午', element: '화', elementKey: 'fire', yinYang: '양' },
  { ko: '미', hanja: '未', element: '토', elementKey: 'earth', yinYang: '음' },
  { ko: '신', hanja: '申', element: '금', elementKey: 'metal', yinYang: '양' },
  { ko: '유', hanja: '酉', element: '금', elementKey: 'metal', yinYang: '음' },
  { ko: '술', hanja: '戌', element: '토', elementKey: 'earth', yinYang: '양' },
  { ko: '해', hanja: '亥', element: '수', elementKey: 'water', yinYang: '음' },
];

export const ELEMENT_LABELS = {
  wood: '목',
  fire: '화',
  earth: '토',
  metal: '금',
  water: '수',
};

export const ELEMENT_ORDER = ['wood', 'fire', 'earth', 'metal', 'water'];

export const STEM_BY_HANJA = Object.fromEntries(HEAVENLY_STEMS.map((stem) => [stem.hanja, stem]));
export const BRANCH_BY_HANJA = Object.fromEntries(EARTHLY_BRANCHES.map((branch) => [branch.hanja, branch]));
export const STEM_BY_KO = Object.fromEntries(HEAVENLY_STEMS.map((stem) => [stem.ko, stem]));
export const BRANCH_BY_KO = Object.fromEntries(EARTHLY_BRANCHES.map((branch) => [branch.ko, branch]));
