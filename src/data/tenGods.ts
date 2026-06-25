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

export type TenGodKey =
  | 'bijian'
  | 'jiecai'
  | 'shishen'
  | 'shangguan'
  | 'piancai'
  | 'zhengcai'
  | 'qisha'
  | 'zhengguan'
  | 'pianyin'
  | 'zhengyin';

export type TenGodProfile = {
  key: TenGodKey;
  labelKo: string;
  hanja: string;
  relationSummary: string;
};

export type StemMeta = {
  stem: HeavenlyStemHanja;
  labelKo: string;
  element: FiveElement;
  yinYang: YinYang;
};

export type TenGodMappingEntry = {
  dayStem: HeavenlyStemHanja;
  targetStem: HeavenlyStemHanja;
  tenGod: TenGodKey;
  verificationStatus: 'Pending external verification';
  notes: string;
};

export const heavenlyStemMeta: Record<HeavenlyStemHanja, StemMeta> = {
  甲: { stem: '甲', labelKo: '갑', element: 'wood', yinYang: 'yang' },
  乙: { stem: '乙', labelKo: '을', element: 'wood', yinYang: 'yin' },
  丙: { stem: '丙', labelKo: '병', element: 'fire', yinYang: 'yang' },
  丁: { stem: '丁', labelKo: '정', element: 'fire', yinYang: 'yin' },
  戊: { stem: '戊', labelKo: '무', element: 'earth', yinYang: 'yang' },
  己: { stem: '己', labelKo: '기', element: 'earth', yinYang: 'yin' },
  庚: { stem: '庚', labelKo: '경', element: 'metal', yinYang: 'yang' },
  辛: { stem: '辛', labelKo: '신', element: 'metal', yinYang: 'yin' },
  壬: { stem: '壬', labelKo: '임', element: 'water', yinYang: 'yang' },
  癸: { stem: '癸', labelKo: '계', element: 'water', yinYang: 'yin' },
};

export const tenGodProfiles: Record<TenGodKey, TenGodProfile> = {
  bijian: {
    key: 'bijian',
    labelKo: '비견',
    hanja: '比肩',
    relationSummary: '나와 같은 기운으로 자립성, 자기표현, 동료성을 살피는 기준',
  },
  jiecai: {
    key: 'jiecai',
    labelKo: '겁재',
    hanja: '劫財',
    relationSummary: '나와 같은 오행이지만 음양이 달라 경쟁, 분산, 협업의 긴장을 살피는 기준',
  },
  shishen: {
    key: 'shishen',
    labelKo: '식신',
    hanja: '食神',
    relationSummary: '내가 생하는 기운으로 표현, 생산성, 꾸준한 산출을 살피는 기준',
  },
  shangguan: {
    key: 'shangguan',
    labelKo: '상관',
    hanja: '傷官',
    relationSummary: '내가 생하는 기운 중 음양이 다른 흐름으로 창의성, 변화, 표현의 날카로움을 살피는 기준',
  },
  piancai: {
    key: 'piancai',
    labelKo: '편재',
    hanja: '偏財',
    relationSummary: '내가 극하는 기운 중 음양이 같은 흐름으로 유동적 자원, 활동성, 기회 포착을 살피는 기준',
  },
  zhengcai: {
    key: 'zhengcai',
    labelKo: '정재',
    hanja: '正財',
    relationSummary: '내가 극하는 기운 중 음양이 다른 흐름으로 안정적 자원, 책임감, 현실 감각을 살피는 기준',
  },
  qisha: {
    key: 'qisha',
    labelKo: '편관',
    hanja: '偏官',
    relationSummary: '나를 극하는 기운 중 음양이 같은 흐름으로 압박, 도전, 긴장 관리를 살피는 기준',
  },
  zhengguan: {
    key: 'zhengguan',
    labelKo: '정관',
    hanja: '正官',
    relationSummary: '나를 극하는 기운 중 음양이 다른 흐름으로 규칙, 책임, 질서 감각을 살피는 기준',
  },
  pianyin: {
    key: 'pianyin',
    labelKo: '편인',
    hanja: '偏印',
    relationSummary: '나를 생하는 기운 중 음양이 같은 흐름으로 직관, 학습, 비정형적 도움을 살피는 기준',
  },
  zhengyin: {
    key: 'zhengyin',
    labelKo: '정인',
    hanja: '正印',
    relationSummary: '나를 생하는 기운 중 음양이 다른 흐름으로 보호, 안정, 학습 기반을 살피는 기준',
  },
};

function tenGodEntry(
  dayStem: HeavenlyStemHanja,
  targetStem: HeavenlyStemHanja,
  tenGod: TenGodKey,
): TenGodMappingEntry {
  return {
    dayStem,
    targetStem,
    tenGod,
    verificationStatus: 'Pending external verification',
    notes: 'External verification pending; not connected to production analysis.',
  };
}

export const tenGodMappingByDayStem: Record<
  HeavenlyStemHanja,
  Record<HeavenlyStemHanja, TenGodMappingEntry>
> = {
  甲: {
    甲: tenGodEntry('甲', '甲', 'bijian'),
    乙: tenGodEntry('甲', '乙', 'jiecai'),
    丙: tenGodEntry('甲', '丙', 'shishen'),
    丁: tenGodEntry('甲', '丁', 'shangguan'),
    戊: tenGodEntry('甲', '戊', 'piancai'),
    己: tenGodEntry('甲', '己', 'zhengcai'),
    庚: tenGodEntry('甲', '庚', 'qisha'),
    辛: tenGodEntry('甲', '辛', 'zhengguan'),
    壬: tenGodEntry('甲', '壬', 'pianyin'),
    癸: tenGodEntry('甲', '癸', 'zhengyin'),
  },
  乙: {
    甲: tenGodEntry('乙', '甲', 'jiecai'),
    乙: tenGodEntry('乙', '乙', 'bijian'),
    丙: tenGodEntry('乙', '丙', 'shangguan'),
    丁: tenGodEntry('乙', '丁', 'shishen'),
    戊: tenGodEntry('乙', '戊', 'zhengcai'),
    己: tenGodEntry('乙', '己', 'piancai'),
    庚: tenGodEntry('乙', '庚', 'zhengguan'),
    辛: tenGodEntry('乙', '辛', 'qisha'),
    壬: tenGodEntry('乙', '壬', 'zhengyin'),
    癸: tenGodEntry('乙', '癸', 'pianyin'),
  },
  丙: {
    甲: tenGodEntry('丙', '甲', 'pianyin'),
    乙: tenGodEntry('丙', '乙', 'zhengyin'),
    丙: tenGodEntry('丙', '丙', 'bijian'),
    丁: tenGodEntry('丙', '丁', 'jiecai'),
    戊: tenGodEntry('丙', '戊', 'shishen'),
    己: tenGodEntry('丙', '己', 'shangguan'),
    庚: tenGodEntry('丙', '庚', 'piancai'),
    辛: tenGodEntry('丙', '辛', 'zhengcai'),
    壬: tenGodEntry('丙', '壬', 'qisha'),
    癸: tenGodEntry('丙', '癸', 'zhengguan'),
  },
  丁: {
    甲: tenGodEntry('丁', '甲', 'zhengyin'),
    乙: tenGodEntry('丁', '乙', 'pianyin'),
    丙: tenGodEntry('丁', '丙', 'jiecai'),
    丁: tenGodEntry('丁', '丁', 'bijian'),
    戊: tenGodEntry('丁', '戊', 'shangguan'),
    己: tenGodEntry('丁', '己', 'shishen'),
    庚: tenGodEntry('丁', '庚', 'zhengcai'),
    辛: tenGodEntry('丁', '辛', 'piancai'),
    壬: tenGodEntry('丁', '壬', 'zhengguan'),
    癸: tenGodEntry('丁', '癸', 'qisha'),
  },
  戊: {
    甲: tenGodEntry('戊', '甲', 'qisha'),
    乙: tenGodEntry('戊', '乙', 'zhengguan'),
    丙: tenGodEntry('戊', '丙', 'pianyin'),
    丁: tenGodEntry('戊', '丁', 'zhengyin'),
    戊: tenGodEntry('戊', '戊', 'bijian'),
    己: tenGodEntry('戊', '己', 'jiecai'),
    庚: tenGodEntry('戊', '庚', 'shishen'),
    辛: tenGodEntry('戊', '辛', 'shangguan'),
    壬: tenGodEntry('戊', '壬', 'piancai'),
    癸: tenGodEntry('戊', '癸', 'zhengcai'),
  },
  己: {
    甲: tenGodEntry('己', '甲', 'zhengguan'),
    乙: tenGodEntry('己', '乙', 'qisha'),
    丙: tenGodEntry('己', '丙', 'zhengyin'),
    丁: tenGodEntry('己', '丁', 'pianyin'),
    戊: tenGodEntry('己', '戊', 'jiecai'),
    己: tenGodEntry('己', '己', 'bijian'),
    庚: tenGodEntry('己', '庚', 'shangguan'),
    辛: tenGodEntry('己', '辛', 'shishen'),
    壬: tenGodEntry('己', '壬', 'zhengcai'),
    癸: tenGodEntry('己', '癸', 'piancai'),
  },
  庚: {
    甲: tenGodEntry('庚', '甲', 'piancai'),
    乙: tenGodEntry('庚', '乙', 'zhengcai'),
    丙: tenGodEntry('庚', '丙', 'qisha'),
    丁: tenGodEntry('庚', '丁', 'zhengguan'),
    戊: tenGodEntry('庚', '戊', 'pianyin'),
    己: tenGodEntry('庚', '己', 'zhengyin'),
    庚: tenGodEntry('庚', '庚', 'bijian'),
    辛: tenGodEntry('庚', '辛', 'jiecai'),
    壬: tenGodEntry('庚', '壬', 'shishen'),
    癸: tenGodEntry('庚', '癸', 'shangguan'),
  },
  辛: {
    甲: tenGodEntry('辛', '甲', 'zhengcai'),
    乙: tenGodEntry('辛', '乙', 'piancai'),
    丙: tenGodEntry('辛', '丙', 'zhengguan'),
    丁: tenGodEntry('辛', '丁', 'qisha'),
    戊: tenGodEntry('辛', '戊', 'zhengyin'),
    己: tenGodEntry('辛', '己', 'pianyin'),
    庚: tenGodEntry('辛', '庚', 'jiecai'),
    辛: tenGodEntry('辛', '辛', 'bijian'),
    壬: tenGodEntry('辛', '壬', 'shangguan'),
    癸: tenGodEntry('辛', '癸', 'shishen'),
  },
  壬: {
    甲: tenGodEntry('壬', '甲', 'shishen'),
    乙: tenGodEntry('壬', '乙', 'shangguan'),
    丙: tenGodEntry('壬', '丙', 'piancai'),
    丁: tenGodEntry('壬', '丁', 'zhengcai'),
    戊: tenGodEntry('壬', '戊', 'qisha'),
    己: tenGodEntry('壬', '己', 'zhengguan'),
    庚: tenGodEntry('壬', '庚', 'pianyin'),
    辛: tenGodEntry('壬', '辛', 'zhengyin'),
    壬: tenGodEntry('壬', '壬', 'bijian'),
    癸: tenGodEntry('壬', '癸', 'jiecai'),
  },
  癸: {
    甲: tenGodEntry('癸', '甲', 'shangguan'),
    乙: tenGodEntry('癸', '乙', 'shishen'),
    丙: tenGodEntry('癸', '丙', 'zhengcai'),
    丁: tenGodEntry('癸', '丁', 'piancai'),
    戊: tenGodEntry('癸', '戊', 'zhengguan'),
    己: tenGodEntry('癸', '己', 'qisha'),
    庚: tenGodEntry('癸', '庚', 'zhengyin'),
    辛: tenGodEntry('癸', '辛', 'pianyin'),
    壬: tenGodEntry('癸', '壬', 'jiecai'),
    癸: tenGodEntry('癸', '癸', 'bijian'),
  },
};
