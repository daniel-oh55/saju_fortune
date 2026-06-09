import { Lunar, Solar } from 'lunar-javascript';
import { BRANCH_BY_HANJA, STEM_BY_HANJA } from './sajuConstants.js';

const ENGINE_VERSION = 'manseryeok_core_v0';
const TIMEZONE = 'Asia/Seoul';
const SOLAR_TERM_TIMEZONE_ADJUSTMENT_HOURS = 1;

function parseBirthDate(birthDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate || '');
  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function parseBirthTime(birthTime, birthTimeUnknown) {
  if (birthTimeUnknown) {
    return { hour: 12, minute: 0, usedFallbackNoon: true };
  }

  const match = /^(\d{2}):(\d{2})$/.exec(birthTime || '');
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute, usedFallbackNoon: false };
}

function isLateNightBirthTimeParts(timeParts, birthTimeUnknown) {
  return !birthTimeUnknown && timeParts.hour === 23;
}

function shouldUseNextDayJasi(profile, timeParts, birthTimeUnknown) {
  return (
    profile.lateNightJasiPolicy === 'next_day' &&
    isLateNightBirthTimeParts(timeParts, birthTimeUnknown)
  );
}

function parseGanji(ganji) {
  if (!ganji || ganji.length < 2) return null;

  const stem = STEM_BY_HANJA[ganji[0]];
  const branch = BRANCH_BY_HANJA[ganji[1]];

  if (!stem || !branch) return null;

  return {
    stem: stem.ko,
    branch: branch.ko,
    ganji: `${stem.ko}${branch.ko}`,
    stemElement: stem.element,
    branchElement: branch.element,
    stemElementKey: stem.elementKey,
    branchElementKey: branch.elementKey,
    element: stem.element,
    yinYang: stem.yinYang,
    branchYinYang: branch.yinYang,
  };
}

function tryParseGanjiFromMethod(source, methodName) {
  if (!source || typeof source[methodName] !== 'function') return null;

  try {
    return parseGanji(source[methodName]());
  } catch {
    return null;
  }
}

function tryParseGanjiFromPartMethods(source, stemMethodName, branchMethodName) {
  if (
    !source ||
    typeof source[stemMethodName] !== 'function' ||
    typeof source[branchMethodName] !== 'function'
  ) {
    return null;
  }

  try {
    return parseGanji(`${source[stemMethodName]()}${source[branchMethodName]()}`);
  } catch {
    return null;
  }
}

function parseSolarYmdHms(solar) {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(
    solar?.toYmdHms?.() || '',
  );
  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6]),
  };
}

function subtractHoursFromSolar(solar, hours) {
  const parts = parseSolarYmdHms(solar);
  if (!parts) return null;

  const date = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second),
  );
  date.setUTCHours(date.getUTCHours() - hours);

  return Solar.fromYmdHms(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

function createNextDayJasiSolar(solar, minute) {
  const parts = parseSolarYmdHms(solar);
  if (!parts) return solar;

  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 0, minute, 0));
  date.setUTCDate(date.getUTCDate() + 1);

  return Solar.fromYmdHms(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    0,
    minute,
    0,
  );
}

function createSolarTermAdjustedLunar(solar) {
  try {
    return subtractHoursFromSolar(solar, SOLAR_TERM_TIMEZONE_ADJUSTMENT_HOURS)?.getLunar() || null;
  } catch {
    return null;
  }
}

function resolveExactYearMonthPillars(source) {
  const yearPillar =
    tryParseGanjiFromMethod(source, 'getYearInGanZhiExact') ||
    tryParseGanjiFromPartMethods(source, 'getYearGanExact', 'getYearZhiExact');
  const monthPillar =
    tryParseGanjiFromMethod(source, 'getMonthInGanZhiExact') ||
    tryParseGanjiFromPartMethods(source, 'getMonthGanExact', 'getMonthZhiExact');

  if (!yearPillar || !monthPillar) return null;
  return { yearPillar, monthPillar };
}

function resolveYearMonthPillars({ lunar, eightChar, solar }) {
  const fallbackYearPillar = parseGanji(eightChar.getYear());
  const fallbackMonthPillar = parseGanji(eightChar.getMonth());
  const termAdjustedLunar = createSolarTermAdjustedLunar(solar);
  const termAdjustedPillars = resolveExactYearMonthPillars(termAdjustedLunar);

  if (termAdjustedPillars) {
    return {
      ...termAdjustedPillars,
      notes: [
        '년주/월주는 KST 입력을 CST 기준으로 1시간 보정한 뒤 lunar-javascript exact API를 우선 사용합니다.',
      ],
    };
  }

  const exactYearPillar =
    tryParseGanjiFromMethod(lunar, 'getYearInGanZhiExact') ||
    tryParseGanjiFromPartMethods(lunar, 'getYearGanExact', 'getYearZhiExact');
  const exactMonthPillar =
    tryParseGanjiFromMethod(lunar, 'getMonthInGanZhiExact') ||
    tryParseGanjiFromPartMethods(lunar, 'getMonthGanExact', 'getMonthZhiExact');

  if (exactYearPillar && exactMonthPillar) {
    return {
      yearPillar: exactYearPillar,
      monthPillar: exactMonthPillar,
      notes: [
        '년주/월주는 lunar-javascript의 getYearInGanZhiExact/getMonthInGanZhiExact 계열 API를 우선 사용합니다.',
      ],
    };
  }

  return {
    yearPillar: exactYearPillar || fallbackYearPillar,
    monthPillar: exactMonthPillar || fallbackMonthPillar,
    notes: ['년주/월주 exact API 사용에 실패해 EightChar 기본 계산값으로 fallback했습니다.'],
  };
}

function buildUnsupported(reason, detail) {
  return {
    ok: false,
    reason,
    detail,
    fallbackRequired: true,
    engine: ENGINE_VERSION,
  };
}

function createLunarFromProfile(dateParts, timeParts, profile, useNextDayJasi) {
  const calendarType = profile.calendarType || 'solar';

  if (calendarType === 'solar') {
    const solar = Solar.fromYmdHms(
      dateParts.year,
      dateParts.month,
      dateParts.day,
      timeParts.hour,
      timeParts.minute,
      0,
    );
    return (useNextDayJasi ? createNextDayJasiSolar(solar, timeParts.minute) : solar).getLunar();
  }

  if (calendarType === 'lunar') {
    const lunarMonth = profile.isLeapMonth ? -dateParts.month : dateParts.month;
    const lunar = Lunar.fromYmdHms(
      dateParts.year,
      lunarMonth,
      dateParts.day,
      timeParts.hour,
      timeParts.minute,
      0,
    );
    const convertedMonth = lunar.getMonth();

    if (Boolean(profile.isLeapMonth) !== convertedMonth < 0) {
      throw new Error('lunar_leap_month_mismatch');
    }

    if (useNextDayJasi) {
      return createNextDayJasiSolar(lunar.getSolar(), timeParts.minute).getLunar();
    }

    return lunar;
  }

  throw new Error('unsupported_calendar_type');
}

export function calculateManseryeok(profile) {
  const birthDate = parseBirthDate(profile.birthDate);
  if (!birthDate) {
    return buildUnsupported('invalid_birth_date', 'birthDate must use YYYY-MM-DD format');
  }

  const birthTimeUnknown = Boolean(profile.birthTimeUnknown);
  const birthTime = parseBirthTime(profile.birthTime, birthTimeUnknown);
  if (!birthTime) {
    return buildUnsupported('invalid_birth_time', 'birthTime must use HH:mm format when known');
  }

  try {
    const useNextDayJasi = shouldUseNextDayJasi(profile, birthTime, birthTimeUnknown);
    const lunar = createLunarFromProfile(birthDate, birthTime, profile, useNextDayJasi);
    const solar = lunar.getSolar();
    const eightChar = lunar.getEightChar();
    const yearMonthResolution = resolveYearMonthPillars({ lunar, eightChar, solar });
    const yearPillar = yearMonthResolution.yearPillar;
    const monthPillar = yearMonthResolution.monthPillar;
    const dayPillar = parseGanji(eightChar.getDay());
    const hourPillar = birthTimeUnknown ? null : parseGanji(eightChar.getTime());

    if (!yearPillar || !monthPillar || !dayPillar || (!birthTimeUnknown && !hourPillar)) {
      return buildUnsupported('invalid_eight_char_result', eightChar.toString());
    }

    const notes = [
      'lunar-javascript 기반 계산 결과이며 외부 만세력 기준 샘플 검증이 필요합니다.',
      '절기 경계 및 23시 이후 자시 기준은 추가 정책 검토가 필요합니다.',
    ];

    notes.unshift(
      '태양시 보정은 아직 적용하지 않으며, 23시 이후 자시 기준은 사용자가 다음 날 자시 기준을 선택한 경우에만 적용합니다.',
      ...yearMonthResolution.notes,
    );

    if (birthTimeUnknown) {
      notes.push('시주 미상: birthTimeUnknown=true');
    }

    if (isLateNightBirthTimeParts(birthTime, birthTimeUnknown)) {
      notes.push(
        useNextDayJasi
          ? '사용자가 선택한 다음 날 자시 기준에 따라 23시 이후 출생 시간을 다음 날 00시로 보정해 계산했습니다.'
          : '23시 이후 자시 기준은 입력한 날짜 기준으로 계산했습니다.',
      );
    }

    return {
      ok: true,
      engine: ENGINE_VERSION,
      accuracyStatus: 'library_based_needs_reference_verification',
      timezone: TIMEZONE,
      input: {
        calendarType: profile.calendarType || 'solar',
        isLeapMonth: Boolean(profile.isLeapMonth),
        birthDate: profile.birthDate,
        birthTime: birthTimeUnknown ? null : profile.birthTime,
        birthTimeUnknown,
        lateNightJasiPolicy: profile.lateNightJasiPolicy || 'same_day',
      },
      convertedSolar: solar.toYmdHms(),
      convertedLunar: {
        year: lunar.getYear(),
        month: Math.abs(lunar.getMonth()),
        day: lunar.getDay(),
        isLeapMonth: lunar.getMonth() < 0,
      },
      pillars: {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar,
      },
      dayMaster: {
        stem: dayPillar.stem,
        element: dayPillar.stemElement,
        yinYang: dayPillar.yinYang,
      },
      notes,
    };
  } catch (error) {
    const reason = error.message?.startsWith('wrong lunar year')
      ? 'unsupported_lunar_date'
      : error.message;
    return buildUnsupported(reason || 'manseryeok_calculation_failed', error.message);
  }
}
