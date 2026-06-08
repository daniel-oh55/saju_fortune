import { Lunar, Solar } from 'lunar-javascript';
import { BRANCH_BY_HANJA, STEM_BY_HANJA } from './sajuConstants.js';

const ENGINE_VERSION = 'manseryeok_core_v0';
const TIMEZONE = 'Asia/Seoul';

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

function buildUnsupported(reason, detail) {
  return {
    ok: false,
    reason,
    detail,
    fallbackRequired: true,
    engine: ENGINE_VERSION,
  };
}

function createLunarFromProfile(dateParts, timeParts, profile) {
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
    return solar.getLunar();
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
    const lunar = createLunarFromProfile(birthDate, birthTime, profile);
    const solar = lunar.getSolar();
    const eightChar = lunar.getEightChar();
    const yearPillar = parseGanji(eightChar.getYear());
    const monthPillar = parseGanji(eightChar.getMonth());
    const dayPillar = parseGanji(eightChar.getDay());
    const hourPillar = birthTimeUnknown ? null : parseGanji(eightChar.getTime());

    if (!yearPillar || !monthPillar || !dayPillar || (!birthTimeUnknown && !hourPillar)) {
      return buildUnsupported('invalid_eight_char_result', eightChar.toString());
    }

    const notes = [
      'lunar-javascript 기반 계산 결과이며 외부 만세력 기준 샘플 검증이 필요합니다.',
      '절기 경계 및 23시 이후 자시 기준은 추가 정책 검토가 필요합니다.',
    ];

    if (birthTimeUnknown) {
      notes.push('시주 미상: birthTimeUnknown=true');
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
