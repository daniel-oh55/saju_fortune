import { calculateManseryeok } from '../src/domain/saju/manseryeokEngine.js';

const sampleProfiles = [
  {
    caseId: 'SOLAR-001',
    calendarType: 'solar',
    birthDate: '1990-01-15',
    birthTime: '09:30',
    birthTimeUnknown: false,
    isLeapMonth: false,
    lateNightJasiPolicy: 'same_day',
  },
  {
    caseId: 'SOLAR-TERM-001',
    calendarType: 'solar',
    birthDate: '1990-02-04',
    birthTime: '00:30',
    birthTimeUnknown: false,
    isLeapMonth: false,
    lateNightJasiPolicy: 'same_day',
  },
  {
    caseId: 'LUNAR-001',
    calendarType: 'lunar',
    birthDate: '1990-01-15',
    birthTime: '09:30',
    birthTimeUnknown: false,
    isLeapMonth: false,
    lateNightJasiPolicy: 'same_day',
  },
  {
    caseId: 'LEAP-001',
    calendarType: 'lunar',
    birthDate: '1995-08-15',
    birthTime: '09:30',
    birthTimeUnknown: false,
    isLeapMonth: true,
    lateNightJasiPolicy: 'same_day',
  },
  {
    caseId: 'JASI-001',
    calendarType: 'solar',
    birthDate: '1990-06-15',
    birthTime: '23:30',
    birthTimeUnknown: false,
    isLeapMonth: false,
    lateNightJasiPolicy: 'same_day',
  },
  {
    caseId: 'JASI-002',
    calendarType: 'solar',
    birthDate: '1990-06-15',
    birthTime: '23:30',
    birthTimeUnknown: false,
    isLeapMonth: false,
    lateNightJasiPolicy: 'next_day',
  },
  {
    caseId: 'UNKNOWN-TIME-001',
    calendarType: 'solar',
    birthDate: '1990-06-15',
    birthTime: '',
    birthTimeUnknown: true,
    isLeapMonth: false,
    lateNightJasiPolicy: 'same_day',
  },
  {
    caseId: 'SOLAR-TIME-001',
    calendarType: 'solar',
    birthDate: '1990-06-15',
    birthTime: '09:30',
    birthTimeUnknown: false,
    isLeapMonth: false,
    lateNightJasiPolicy: 'same_day',
  },
];

function buildProfile(sample) {
  return {
    id: sample.caseId.toLowerCase(),
    nickname: sample.caseId,
    birthDate: sample.birthDate,
    birthTime: sample.birthTime,
    birthTimeUnknown: sample.birthTimeUnknown,
    calendarType: sample.calendarType,
    isLeapMonth: sample.isLeapMonth,
    gender: 'female',
    lateNightJasiPolicy: sample.lateNightJasiPolicy,
  };
}

function formatPillar(pillar) {
  if (!pillar) return null;
  return pillar.ganji || `${pillar.stem || ''}${pillar.branch || ''}` || null;
}

function formatSnapshot(sample) {
  const profile = buildProfile(sample);
  const result = calculateManseryeok(profile);

  return {
    caseId: sample.caseId,
    ok: result.ok,
    reason: result.reason || null,
    engine: result.engine || null,
    accuracyStatus: result.accuracyStatus || null,
    input: result.input || profile,
    convertedSolar: result.convertedSolar || null,
    convertedLunar: result.convertedLunar || null,
    pillars: {
      year: formatPillar(result.pillars?.year),
      month: formatPillar(result.pillars?.month),
      day: formatPillar(result.pillars?.day),
      hour: formatPillar(result.pillars?.hour),
    },
    dayMaster: result.dayMaster || null,
    notes: result.notes || [],
  };
}

const snapshots = sampleProfiles.map(formatSnapshot);

console.log(JSON.stringify(snapshots, null, 2));
