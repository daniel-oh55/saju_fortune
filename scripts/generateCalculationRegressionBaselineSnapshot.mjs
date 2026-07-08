// Candidate-only scaffold for a future calculation regression baseline snapshot generator.
// This script intentionally does not write any file, does not import src/ or any production
// calculation module, and does not call any external API. It only builds an in-memory
// candidate-only object and prints it. File generation is deferred to a future PR.

import { fileURLToPath } from 'node:url';

const SAMPLE_DEFINITIONS = [
  { sampleId: 'LUNAR-001', category: 'representative-lunar-birth-sample' },
  { sampleId: 'LEAP-001', category: 'representative-leap-month-sample' },
  { sampleId: 'BOUNDARY-001', category: 'month-boundary-sample' },
  { sampleId: 'BOUNDARY-002', category: 'year-boundary-sample' },
  { sampleId: 'LATE-NIGHT-001', category: 'late-night-birth-time-sample' },
  { sampleId: 'SOLAR-TIME-001', category: 'solar-time-separation-sample' },
  { sampleId: 'REGRESSION-001', category: 'regression-baseline-sample' },
];

export function buildCandidateSnapshot() {
  return {
    status: 'not_started',
    snapshotType: 'calculation-regression-baseline',
    snapshotVersion: 'candidate-only',
    generatedAt: 'not_recorded',
    appBuild: 'not_recorded',
    schemaVersion: 'unchanged',
    source: {
      name: 'not_recorded',
      version: 'not_recorded',
      accessDate: 'not_recorded',
    },
    pendingItems: {
      lunarLeapExternalVerification: 'Pending',
      solarTimeCorrectionDecision: 'Pending',
    },
    samples: SAMPLE_DEFINITIONS.map((definition) => ({
      sampleId: definition.sampleId,
      category: definition.category,
      input: 'not_recorded',
      currentOutput: 'not_recorded',
      comparisonResult: 'not_recorded',
      status: 'pending',
    })),
  };
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--write') || args.includes('-w')) {
    console.error(
      'This scaffold does not support writing a snapshot file yet. File generation is deferred to a future PR.',
    );
    process.exit(1);
  }

  const snapshot = buildCandidateSnapshot();
  console.log(JSON.stringify(snapshot, null, 2));
}

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) {
  main();
}
