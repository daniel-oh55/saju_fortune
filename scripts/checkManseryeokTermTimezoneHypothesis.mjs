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
    id: 'solar_ipchun_boundary',
    inputKst: '1990-02-04 10:30',
    expectedYearMonth: { year: '기사', month: '정축' },
  },
  {
    id: 'solar_after_ipchun',
    inputKst: '1990-02-05 00:30',
    expectedYearMonth: { year: '경오', month: '무인' },
  },
  {
    id: 'solar_regular_known_time',
    inputKst: '1990-05-15 09:30',
    expectedYearMonth: { year: '경오', month: '신사' },
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

function subtractHours(parts, hours) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0));
  date.setUTCHours(date.getUTCHours() - hours);

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

function getExactYearMonth(parts) {
  const lunar = Solar.fromYmdHms(parts.year, parts.month, parts.day, parts.hour, parts.minute, 0).getLunar();

  return {
    year: toKoreanGanji(lunar.getYearInGanZhiExact()),
    month: toKoreanGanji(lunar.getMonthInGanZhiExact()),
  };
}

function formatYearMonth(value) {
  return `${value.year} / ${value.month}`;
}

function compareYearMonth(left, right) {
  return left.year === right.year && left.month === right.month;
}

const results = samples.map((sample) => {
  const inputParts = parseDateTime(sample.inputKst);
  const cstAdjustedParts = subtractHours(inputParts, 1);
  const originalExactYearMonth = getExactYearMonth(inputParts);
  const cstAdjustedExactYearMonth = getExactYearMonth(cstAdjustedParts);

  return {
    sampleId: sample.id,
    inputKst: sample.inputKst,
    termCheckAsCst: formatDateTime(cstAdjustedParts),
    expectedYearMonth: formatYearMonth(sample.expectedYearMonth),
    originalExactYearMonth: formatYearMonth(originalExactYearMonth),
    cstAdjustedExactYearMonth: formatYearMonth(cstAdjustedExactYearMonth),
    hypothesisResult: compareYearMonth(cstAdjustedExactYearMonth, sample.expectedYearMonth)
      ? 'pass'
      : 'fail',
  };
});

for (const result of results) {
  console.log(`sampleId: ${result.sampleId}`);
  console.log(`inputKst: ${result.inputKst}`);
  console.log(`termCheckAsCst: ${result.termCheckAsCst}`);
  console.log(`expectedYearMonth: ${result.expectedYearMonth}`);
  console.log(`originalExactYearMonth: ${result.originalExactYearMonth}`);
  console.log(`cstAdjustedExactYearMonth: ${result.cstAdjustedExactYearMonth}`);
  console.log(`hypothesisResult: ${result.hypothesisResult}`);
  console.log('');
}
