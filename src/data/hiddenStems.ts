export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type YinYang = 'yang' | 'yin';

export type HeavenlyStemHanja =
  | '甲'
  | '乙'
  | '丙'
  | '丁'
  | '戊'
  | '己'
  | '庚'
  | '辛'
  | '壬'
  | '癸';

export type EarthlyBranchHanja =
  | '子'
  | '丑'
  | '寅'
  | '卯'
  | '辰'
  | '巳'
  | '午'
  | '未'
  | '申'
  | '酉'
  | '戌'
  | '亥';

export type HiddenStemRole = 'main' | 'middle' | 'residual';

export type HiddenStemEntry = {
  stem: HeavenlyStemHanja;
  labelKo: string;
  element: FiveElement;
  yinYang: YinYang;
  role: HiddenStemRole;
};

export type HiddenStemBranchProfile = {
  branch: EarthlyBranchHanja;
  branchKo: string;
  animalKo: string;
  hiddenStems: HiddenStemEntry[];
  verificationStatus: 'Pending external verification';
  notes: string;
};

const stemMeta: Record<HeavenlyStemHanja, Omit<HiddenStemEntry, 'stem' | 'role'>> = {
  甲: { labelKo: '갑', element: 'wood', yinYang: 'yang' },
  乙: { labelKo: '을', element: 'wood', yinYang: 'yin' },
  丙: { labelKo: '병', element: 'fire', yinYang: 'yang' },
  丁: { labelKo: '정', element: 'fire', yinYang: 'yin' },
  戊: { labelKo: '무', element: 'earth', yinYang: 'yang' },
  己: { labelKo: '기', element: 'earth', yinYang: 'yin' },
  庚: { labelKo: '경', element: 'metal', yinYang: 'yang' },
  辛: { labelKo: '신', element: 'metal', yinYang: 'yin' },
  壬: { labelKo: '임', element: 'water', yinYang: 'yang' },
  癸: { labelKo: '계', element: 'water', yinYang: 'yin' },
};

function hiddenStem(stem: HeavenlyStemHanja, role: HiddenStemRole): HiddenStemEntry {
  return {
    stem,
    ...stemMeta[stem],
    role,
  };
}

export const hiddenStemsByBranch: Record<EarthlyBranchHanja, HiddenStemBranchProfile> = {
  子: {
    branch: '子',
    branchKo: '자',
    animalKo: '쥐',
    hiddenStems: [hiddenStem('癸', 'main')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  丑: {
    branch: '丑',
    branchKo: '축',
    animalKo: '소',
    hiddenStems: [hiddenStem('己', 'main'), hiddenStem('癸', 'middle'), hiddenStem('辛', 'residual')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  寅: {
    branch: '寅',
    branchKo: '인',
    animalKo: '호랑이',
    hiddenStems: [hiddenStem('甲', 'main'), hiddenStem('丙', 'middle'), hiddenStem('戊', 'residual')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  卯: {
    branch: '卯',
    branchKo: '묘',
    animalKo: '토끼',
    hiddenStems: [hiddenStem('乙', 'main')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  辰: {
    branch: '辰',
    branchKo: '진',
    animalKo: '용',
    hiddenStems: [hiddenStem('戊', 'main'), hiddenStem('乙', 'middle'), hiddenStem('癸', 'residual')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  巳: {
    branch: '巳',
    branchKo: '사',
    animalKo: '뱀',
    hiddenStems: [hiddenStem('丙', 'main'), hiddenStem('庚', 'middle'), hiddenStem('戊', 'residual')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  午: {
    branch: '午',
    branchKo: '오',
    animalKo: '말',
    hiddenStems: [hiddenStem('丁', 'main'), hiddenStem('己', 'residual')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  未: {
    branch: '未',
    branchKo: '미',
    animalKo: '양',
    hiddenStems: [hiddenStem('己', 'main'), hiddenStem('丁', 'middle'), hiddenStem('乙', 'residual')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  申: {
    branch: '申',
    branchKo: '신',
    animalKo: '원숭이',
    hiddenStems: [hiddenStem('庚', 'main'), hiddenStem('壬', 'middle'), hiddenStem('戊', 'residual')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  酉: {
    branch: '酉',
    branchKo: '유',
    animalKo: '닭',
    hiddenStems: [hiddenStem('辛', 'main')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  戌: {
    branch: '戌',
    branchKo: '술',
    animalKo: '개',
    hiddenStems: [hiddenStem('戊', 'main'), hiddenStem('辛', 'middle'), hiddenStem('丁', 'residual')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
  亥: {
    branch: '亥',
    branchKo: '해',
    animalKo: '돼지',
    hiddenStems: [hiddenStem('壬', 'main'), hiddenStem('甲', 'residual')],
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  },
};
