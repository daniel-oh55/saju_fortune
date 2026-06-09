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

  const originalPillars = getPillars(inputParts);
  const sameDayJasiPillars = isLateNightJasi ? getPillars(inputParts) : null;
  const nextDayCandidatePillars = nextDayCandidateParts ? getPillars(nextDayCandidateParts) : null;
  const midnightReferencePillars = getPillars(midnightReferenceParts);

  console.log(`sampleId: ${sample.id}`);
  console.log(`purpose: ${sample.purpose}`);
  console.log(`inputKst: ${sample.inputKst}`);
  console.log(`originalPillars: ${formatPillars(originalPillars)}`);
  console.log(`sameDayJasiPillars: ${formatPillars(sameDayJasiPillars)}`);
  console.log(
    `nextDayCandidateInput: ${nextDayCandidateParts ? formatDateTime(nextDayCandidateParts) : 'not applicable'}`,
  );
  console.log(`nextDayCandidatePillars: ${formatPillars(nextDayCandidatePillars)}`);
  console.log(`midnightReferenceInput: ${formatDateTime(midnightReferenceParts)}`);
  console.log(`midnightReferencePillars: ${formatPillars(midnightReferencePillars)}`);
  console.log(
    'policyQuestion: 23시 이후 출생을 같은 날짜의 자시로 볼지, 다음 날짜의 자시로 볼지 정책 결정 필요',
  );
  console.log('');
}
