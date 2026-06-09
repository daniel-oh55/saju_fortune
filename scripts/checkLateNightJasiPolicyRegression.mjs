import { calculateManseryeok } from '../src/domain/saju/manseryeokEngine.js';
import { buildProfileId } from '../src/utils/fortuneEngine.js';

const samples = [
  {
    id: 'late_night_same_day',
    profile: {
      nickname: 'late-night-same-day',
      birthDate: '1990-02-03',
      birthTime: '23:30',
      birthTimeUnknown: false,
      calendarType: 'solar',
      isLeapMonth: false,
      gender: 'male',
      lateNightJasiPolicy: 'same_day',
    },
    expected: {
      convertedSolar: '1990-02-03 23:30:00',
      inputPolicy: 'same_day',
      noteIncludes: '입력한 날짜 기준',
    },
  },
  {
    id: 'late_night_next_day',
    profile: {
      nickname: 'late-night-next-day',
      birthDate: '1990-02-03',
      birthTime: '23:30',
      birthTimeUnknown: false,
      calendarType: 'solar',
      isLeapMonth: false,
      gender: 'male',
      lateNightJasiPolicy: 'next_day',
    },
    expected: {
      convertedSolar: '1990-02-04 00:30:00',
      inputPolicy: 'next_day',
      noteIncludes: '다음 날 자시 기준',
    },
  },
  {
    id: 'non_late_night_next_day_ignored',
    profile: {
      nickname: 'non-late-next-day',
      birthDate: '1990-02-03',
      birthTime: '22:30',
      birthTimeUnknown: false,
      calendarType: 'solar',
      isLeapMonth: false,
      gender: 'male',
      lateNightJasiPolicy: 'next_day',
    },
    expected: {
      convertedSolar: '1990-02-03 22:30:00',
      inputPolicy: 'next_day',
      noteExcludes: '사용자가 선택한 다음 날 자시 기준에 따라',
    },
  },
  {
    id: 'unknown_time_next_day_ignored',
    profile: {
      nickname: 'unknown-time-next-day',
      birthDate: '1990-02-03',
      birthTime: '',
      birthTimeUnknown: true,
      calendarType: 'solar',
      isLeapMonth: false,
      gender: 'male',
      lateNightJasiPolicy: 'next_day',
    },
    expected: {
      convertedSolar: '1990-02-03 12:00:00',
      inputPolicy: 'next_day',
      hourPillar: null,
      noteIncludes: '시주 미상',
      noteExcludes: '사용자가 선택한 다음 날 자시 기준에 따라',
    },
  },
];

function formatPillar(pillar) {
  return pillar?.ganji || '미상';
}

function formatPillars(pillars) {
  if (!pillars) return 'not applicable';
  return [
    formatPillar(pillars.year),
    formatPillar(pillars.month),
    formatPillar(pillars.day),
    formatPillar(pillars.hour),
  ].join(' / ');
}

function hasNote(result, text) {
  return (result.notes || []).some((note) => note.includes(text));
}

function assertCondition(failures, condition, message) {
  if (!condition) failures.push(message);
}

function checkSample(sample) {
  const result = calculateManseryeok(sample.profile);
  const failures = [];

  assertCondition(failures, result.ok === true, 'calculateManseryeok result.ok should be true');
  assertCondition(
    failures,
    result.convertedSolar === sample.expected.convertedSolar,
    `convertedSolar expected ${sample.expected.convertedSolar}, got ${result.convertedSolar}`,
  );
  assertCondition(
    failures,
    result.input?.lateNightJasiPolicy === sample.expected.inputPolicy,
    `input.lateNightJasiPolicy expected ${sample.expected.inputPolicy}, got ${result.input?.lateNightJasiPolicy}`,
  );

  if ('hourPillar' in sample.expected) {
    assertCondition(
      failures,
      result.pillars?.hour === sample.expected.hourPillar,
      `hour pillar expected ${sample.expected.hourPillar}, got ${formatPillar(result.pillars?.hour)}`,
    );
  }

  if (sample.expected.noteIncludes) {
    assertCondition(
      failures,
      hasNote(result, sample.expected.noteIncludes),
      `notes should include "${sample.expected.noteIncludes}"`,
    );
  }

  if (sample.expected.noteExcludes) {
    assertCondition(
      failures,
      !hasNote(result, sample.expected.noteExcludes),
      `notes should not include "${sample.expected.noteExcludes}"`,
    );
  }

  return {
    sample,
    result,
    profileId: buildProfileId(sample.profile),
    failures,
  };
}

const checked = samples.map(checkSample);
const sameDay = checked.find((item) => item.sample.id === 'late_night_same_day');
const nextDay = checked.find((item) => item.sample.id === 'late_night_next_day');

const crossFailures = [];
assertCondition(
  crossFailures,
  sameDay.profileId !== nextDay.profileId,
  'late_night_same_day and late_night_next_day profileId values should differ',
);
assertCondition(
  crossFailures,
  sameDay.result.convertedSolar !== nextDay.result.convertedSolar,
  'late_night_same_day and late_night_next_day convertedSolar values should differ',
);
assertCondition(
  crossFailures,
  sameDay.result.pillars?.day?.ganji !== nextDay.result.pillars?.day?.ganji ||
    sameDay.result.pillars?.hour?.ganji !== nextDay.result.pillars?.hour?.ganji,
  'day or hour pillar should differ between same_day and next_day',
);

for (const item of checked) {
  console.log(`sampleId: ${item.sample.id}`);
  console.log(`policy: ${item.sample.profile.lateNightJasiPolicy}`);
  console.log(`profileId: ${item.profileId}`);
  console.log(`convertedSolar: ${item.result.convertedSolar}`);
  console.log(`pillars: ${formatPillars(item.result.pillars)}`);
  console.log(`result: ${item.failures.length === 0 ? 'pass' : 'fail'}`);

  if (item.failures.length > 0) {
    for (const failure of item.failures) {
      console.log(`- ${failure}`);
    }
  }

  console.log('');
}

console.log('profileIdComparison:');
console.log(`same_day !== next_day: ${sameDay.profileId !== nextDay.profileId ? 'pass' : 'fail'}`);
console.log('convertedSolarComparison:');
console.log(
  `same_day convertedSolar !== next_day convertedSolar: ${
    sameDay.result.convertedSolar !== nextDay.result.convertedSolar ? 'pass' : 'fail'
  }`,
);
console.log('pillarComparison:');
console.log(
  `same_day day/hour differs from next_day: ${
    sameDay.result.pillars?.day?.ganji !== nextDay.result.pillars?.day?.ganji ||
    sameDay.result.pillars?.hour?.ganji !== nextDay.result.pillars?.hour?.ganji
      ? 'pass'
      : 'fail'
  }`,
);

if (crossFailures.length > 0) {
  console.log('');
  console.log('crossSampleFailures:');
  for (const failure of crossFailures) {
    console.log(`- ${failure}`);
  }
}

const failedSamples = checked.filter((item) => item.failures.length > 0);
if (failedSamples.length > 0 || crossFailures.length > 0) {
  process.exitCode = 1;
}
