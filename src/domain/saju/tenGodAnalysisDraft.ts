import {
  tenGodMappingByDayStem,
  tenGodProfiles,
  type HeavenlyStemHanja,
  type TenGodKey,
} from '../../data/tenGods';

export type TenGodPillarTarget = 'yearStem' | 'monthStem' | 'dayStem' | 'hourStem';

export type TenGodTargetInput = {
  target: TenGodPillarTarget;
  stem: HeavenlyStemHanja;
};

export type TenGodTargetResult = {
  target: TenGodPillarTarget;
  stem: HeavenlyStemHanja;
  tenGod: TenGodKey;
  labelKo: string;
  hanja: string;
  source: 'heavenly-stem';
};

export type TenGodAnalysisDraft = {
  source: 'ten-gods';
  dayStem: HeavenlyStemHanja;
  targets: TenGodTargetResult[];
  summaryByTenGod: Record<TenGodKey, number>;
  verificationStatus: 'Pending external verification';
  connectionStatus: 'Not connected to production analysis';
  notes: string[];
};

const TEN_GOD_KEYS: TenGodKey[] = [
  'bijian',
  'jiecai',
  'shishen',
  'shangguan',
  'piancai',
  'zhengcai',
  'qisha',
  'zhengguan',
  'pianyin',
  'zhengyin',
];

function createEmptySummary(): Record<TenGodKey, number> {
  return {
    bijian: 0,
    jiecai: 0,
    shishen: 0,
    shangguan: 0,
    piancai: 0,
    zhengcai: 0,
    qisha: 0,
    zhengguan: 0,
    pianyin: 0,
    zhengyin: 0,
  };
}

export function analyzeTenGodsFromStems(
  dayStem: HeavenlyStemHanja,
  targets: TenGodTargetInput[],
): TenGodAnalysisDraft {
  const summaryByTenGod = createEmptySummary();

  const targetResults = targets.map((target) => {
    const mapping = tenGodMappingByDayStem[dayStem][target.stem];
    const profile = tenGodProfiles[mapping.tenGod];

    summaryByTenGod[mapping.tenGod] += 1;

    return {
      target: target.target,
      stem: target.stem,
      tenGod: mapping.tenGod,
      labelKo: profile.labelKo,
      hanja: profile.hanja,
      source: 'heavenly-stem' as const,
    };
  });

  return {
    source: 'ten-gods',
    dayStem,
    targets: targetResults,
    summaryByTenGod: TEN_GOD_KEYS.reduce((summary, key) => {
      summary[key] = summaryByTenGod[key];
      return summary;
    }, createEmptySummary()),
    verificationStatus: 'Pending external verification',
    connectionStatus: 'Not connected to production analysis',
    notes: [
      'Production analysis is not connected to this draft result.',
      'This draft calculates heavenly-stem ten gods only.',
      'Hidden-stem ten gods are not included in this draft.',
      'External verification remains Pending.',
    ],
  };
}
