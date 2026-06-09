import { Solar } from 'lunar-javascript';

const STEMS = {
  甲: '갑',
  乙: '을',
  丙: '병',
  丁: '정',
  戊: '무',
  己: '기',
  庚: '경',
  辛: '신',
  壬: '임',
  癸: '계',
};

const BRANCHES = {
  子: '자',
  丑: '축',
  寅: '인',
  卯: '묘',
  辰: '진',
  巳: '사',
  午: '오',
  未: '미',
  申: '신',
  酉: '유',
  戌: '술',
  亥: '해',
};

const samples = [
  {
    id: 'solar_before_23',
    inputKst: '1990-02-03 22:30',
    purpose: '23시 이전 기준 확인',
  },
  {
    id: 'solar_after_23',
    inputKst: '1990-02-03 23:30',
    purpose: '23시 이후 자시 경계 확인',
  },
  {
    id: 'solar_next_day_0030',
    inputKst: '1990-02-04 00:30',
    purpose: '자정 이후 기준 확인',
  },
  {
    id: 'solar_after_ipchun',
    inputKst: '1990-02-05 00:30',
    purpose: '기존 pass 샘플 영향 확인',
  },
];

const externalReferences = {
  solar_after_23: [
    {
      source: 'sky.told.me',
      pillars: {
        year: '기사',
        month: '정축',
        day: '경자',
        hour: '병자',
      },
      memo: '사용자 제공 이미지 기준. Seoul, South Korea 입력.',
    },
    {
      source: 'posteller',
      pillars: {
        year: '기사',
        month: '정축',
        day: '기해',
        hour: '을해',
      },
      memo: '사용자 제공 이미지 기준.',
    },
  ],
};

function parseDateTime(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid date time: ${value}`);

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
  };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function formatDateTime(parts) {
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hour)}:${pad(parts.minute)}`;
}

function addDaysAtTime(parts, days, hour, minute) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, hour, minute, 0));
  date.setUTCDate(date.getUTCDate() + days);

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
  };
}

function toKoreanGanji(ganji) {
  if (!ganji || ganji.length < 2) return ganji;
  return `${STEMS[ganji[0]] || ganji[0]}${BRANCHES[ganji[1]] || ganji[1]}`;
}

function getPillars(parts) {
  const lunar = Solar.fromYmdHms(parts.year, parts.month, parts.day, parts.hour, parts.minute, 0).getLunar();
  const eightChar = lunar.getEightChar();

  return {
    year: toKoreanGanji(eightChar.getYear()),
    month: toKoreanGanji(eightChar.getMonth()),
    day: toKoreanGanji(eightChar.getDay()),
    hour: toKoreanGanji(eightChar.getTime()),
  };
}

function formatPillars(pillars) {
  if (!pillars) return 'not applicable';
  return `${pillars.year} / ${pillars.month} / ${pillars.day} / ${pillars.hour}`;
}

function comparePillars(left, right) {
  if (!left || !right) return false;
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day &&
    left.hour === right.hour
  );
}

function printExternalReferenceComparison(sampleId, candidates) {
  const references = externalReferences[sampleId] || [];
  if (references.length === 0) return;

  for (const reference of references) {
    console.log(`externalReference: ${reference.source}`);
    console.log(`externalPillars: ${formatPillars(reference.pillars)}`);
    console.log(`externalMemo: ${reference.memo}`);
    console.log('matches:');
    console.log(`- original: ${comparePillars(candidates.original, reference.pillars)}`);
    console.log(`- sameDayJasi: ${comparePillars(candidates.sameDayJasi, reference.pillars)}`);
    console.log(`- nextDayCandidate: ${comparePillars(candidates.nextDayCandidate, reference.pillars)}`);
    console.log(`- midnightReference: ${comparePillars(candidates.midnightReference, reference.pillars)}`);
    console.log('');
  }

  console.log('policyObservation:');
  console.log('- sky.told.me는 다음 날 자시 후보와 일치합니다.');
  console.log('- posteller는 현재 후보 중 완전 일치하는 결과가 없습니다.');
  console.log('- 따라서 한 곳만 기준으로 production 정책을 확정하지 않고, 세 번째 기준 확인이 필요합니다.');
  console.log('');
}

for (const sample of samples) {
  const inputParts = parseDateTime(sample.inputKst);
  const isLateNightJasi = inputParts.hour === 23;
  const nextDayCandidateParts = isLateNightJasi
    ? addDaysAtTime(inputParts, 1, 0, inputParts.minute)
    : null;
  const midnightReferenceParts = inputParts.hour === 23
    ? nextDayCandidateParts
    : inputParts.hour === 0
      ? inputParts
      : addDaysAtTime(inputParts, 1, 0, 30);

  const candidates = {
    original: getPillars(inputParts),
    sameDayJasi: isLateNightJasi ? getPillars(inputParts) : null,
    nextDayCandidate: nextDayCandidateParts ? getPillars(nextDayCandidateParts) : null,
    midnightReference: getPillars(midnightReferenceParts),
  };

  console.log(`sampleId: ${sample.id}`);
  console.log(`purpose: ${sample.purpose}`);
  console.log(`inputKst: ${sample.inputKst}`);
  console.log(`originalPillars: ${formatPillars(candidates.original)}`);
  console.log(`sameDayJasiPillars: ${formatPillars(candidates.sameDayJasi)}`);
  console.log(
    `nextDayCandidateInput: ${nextDayCandidateParts ? formatDateTime(nextDayCandidateParts) : 'not applicable'}`,
  );
  console.log(`nextDayCandidatePillars: ${formatPillars(candidates.nextDayCandidate)}`);
  console.log(`midnightReferenceInput: ${formatDateTime(midnightReferenceParts)}`);
  console.log(`midnightReferencePillars: ${formatPillars(candidates.midnightReference)}`);
  console.log(
    'policyQuestion: 23시 이후 출생을 같은 날짜의 자시로 볼지, 다음 날짜의 자시로 볼지 정책 결정 필요',
  );
  console.log('');

  printExternalReferenceComparison(sample.id, candidates);
}
