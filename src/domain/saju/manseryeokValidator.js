import { calculateManseryeok } from './manseryeokEngine.js';

const COMPARISON_FIELDS = [
  ['pillars', 'year'],
  ['pillars', 'month'],
  ['pillars', 'day'],
  ['pillars', 'hour'],
  ['dayMaster', 'stem'],
  ['convertedSolar'],
];

function getByPath(value, path) {
  return path.reduce((current, key) => (current == null ? undefined : current[key]), value);
}

function formatPillar(pillar) {
  return pillar?.ganji || '시주 미상';
}

function buildActual(calculation) {
  if (!calculation.ok) {
    return {
      fallbackRequired: Boolean(calculation.fallbackRequired),
      reason: calculation.reason,
      detail: calculation.detail,
    };
  }

  return {
    pillars: {
      year: formatPillar(calculation.pillars.year),
      month: formatPillar(calculation.pillars.month),
      day: formatPillar(calculation.pillars.day),
      hour: calculation.pillars.hour ? formatPillar(calculation.pillars.hour) : '시주 미상',
    },
    dayMaster: calculation.dayMaster,
    convertedSolar: calculation.convertedSolar,
    convertedLunar: calculation.convertedLunar,
    notes: calculation.notes,
  };
}

function compareExpected(actual, expected) {
  const mismatchFields = COMPARISON_FIELDS.filter((path) => {
    const actualValue = getByPath(actual, path);
    const expectedValue = getByPath(expected, path);

    return expectedValue !== undefined && actualValue !== expectedValue;
  }).map((path) => path.join('.'));

  return {
    comparisonStatus: mismatchFields.length > 0 ? 'fail' : 'pass',
    mismatchFields,
  };
}

function validateSample(sample) {
  try {
    if (sample.referenceStatus === 'not_applicable') {
      return {
        id: sample.id,
        title: sample.title,
        referenceStatus: sample.referenceStatus,
        referenceSource: sample.referenceSource,
        engineStatus: 'manseryeok_core_v0',
        comparisonStatus: 'not_applicable',
        actual: buildActual(calculateManseryeok(sample.profile)),
        expected: sample.expected,
        mismatchFields: [],
        notes: sample.notes || [],
      };
    }

    const calculation = calculateManseryeok(sample.profile);
    const actual = buildActual(calculation);

    if (!calculation.ok) {
      return {
        id: sample.id,
        title: sample.title,
        referenceStatus: sample.referenceStatus,
        referenceSource: sample.referenceSource,
        engineStatus: calculation.engine || 'manseryeok_core_v0',
        comparisonStatus: 'calculation_failed',
        actual,
        expected: sample.expected,
        mismatchFields: [],
        notes: [...(sample.notes || []), calculation.reason].filter(Boolean),
      };
    }

    const comparison = sample.expected
      ? compareExpected(actual, sample.expected)
      : { comparisonStatus: 'reference_pending', mismatchFields: [] };

    return {
      id: sample.id,
      title: sample.title,
      referenceStatus: sample.referenceStatus,
      referenceSource: sample.referenceSource,
      engineStatus: calculation.engine,
      comparisonStatus: comparison.comparisonStatus,
      actual,
      expected: sample.expected,
      mismatchFields: comparison.mismatchFields,
      notes: sample.notes || [],
    };
  } catch (error) {
    return {
      id: sample.id,
      title: sample.title,
      referenceStatus: sample.referenceStatus,
      referenceSource: sample.referenceSource,
      engineStatus: 'manseryeok_core_v0',
      comparisonStatus: 'calculation_failed',
      actual: {
        fallbackRequired: true,
        reason: 'validator_exception',
        detail: error.message,
      },
      expected: sample.expected,
      mismatchFields: [],
      notes: [...(sample.notes || []), error.message].filter(Boolean),
    };
  }
}

export function validateManseryeokSamples(samples) {
  const results = samples.map(validateSample);

  return {
    total: results.length,
    passed: results.filter((result) => result.comparisonStatus === 'pass').length,
    failed: results.filter(
      (result) => result.comparisonStatus === 'fail' || result.comparisonStatus === 'calculation_failed',
    ).length,
    pending: results.filter((result) => result.comparisonStatus === 'reference_pending').length,
    notApplicable: results.filter((result) => result.comparisonStatus === 'not_applicable').length,
    results,
  };
}
