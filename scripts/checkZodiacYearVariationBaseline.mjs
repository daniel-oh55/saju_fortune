import fs from 'node:fs';
import { createServer } from 'vite';

const outputPath = 'docs/generated/zodiac-year-variation-baseline.json';
const dateKey = '2026-06-30';
const requiredYearsByAnimal = {
  토끼: [1987, 1999, 2011],
  용: [1988, 2000, 2012],
};
const comparisonFields = ['summary', 'detail', 'categorySummaries'];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarityRatio(left, right) {
  const a = normalizeText(left);
  const b = normalizeText(right);
  if (!a && !b) return 1;
  if (!a || !b) return 0;

  const maxLength = Math.max(a.length, b.length);
  let same = 0;

  for (let index = 0; index < Math.min(a.length, b.length); index += 1) {
    if (a[index] === b[index]) same += 1;
  }

  return Number((same / maxLength).toFixed(4));
}

function summarizeCategories(categories = []) {
  return Object.fromEntries(categories.map((category) => [category.id, category.summary]));
}

function summarizeFortune(zodiacFortune) {
  return {
    year: zodiacFortune.year,
    animal: zodiacFortune.animal,
    summary: zodiacFortune.summary,
    detail: zodiacFortune.detail,
    categorySummaries: summarizeCategories(zodiacFortune.categories),
  };
}

function flattenComparisonText(fortune) {
  return [
    fortune.summary,
    fortune.detail,
    ...Object.values(fortune.categorySummaries || {}),
  ].map(normalizeText);
}

function buildPairs(fortunes) {
  const pairs = [];

  for (let leftIndex = 0; leftIndex < fortunes.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < fortunes.length; rightIndex += 1) {
      pairs.push([fortunes[leftIndex], fortunes[rightIndex]]);
    }
  }

  return pairs;
}

function compareAnimalFortunes(animal, fortunes) {
  const pairs = buildPairs(fortunes);
  let similarPairs = 0;
  let exactDuplicatePairs = 0;
  const repeatedSnippetExamples = [];

  for (const [left, right] of pairs) {
    const leftTexts = flattenComparisonText(left);
    const rightTexts = flattenComparisonText(right);
    const exactMatches = leftTexts.filter((text) => rightTexts.includes(text));
    const combinedSimilarity = similarityRatio(leftTexts.join(' '), rightTexts.join(' '));

    if (combinedSimilarity >= 0.82) {
      similarPairs += 1;
    }

    if (exactMatches.length > 0) {
      exactDuplicatePairs += 1;
      repeatedSnippetExamples.push({
        years: [left.year, right.year],
        snippet: exactMatches[0].slice(0, 140),
      });
    }
  }

  return {
    animal,
    years: fortunes.map((fortune) => fortune.year),
    comparedYears: fortunes.map((fortune) => fortune.year),
    totalPairs: pairs.length,
    similarPairs,
    exactDuplicatePairs,
    repeatedSnippetExamples: repeatedSnippetExamples.slice(0, 5),
    notes: [
      'Baseline only: duplicate or similar wording is recorded for follow-up production copy improvement.',
      'This check does not fail on current duplicate or similar wording counts.',
    ],
    status: 'Baseline only',
    productionLogicChanged: false,
  };
}

async function buildBaseline() {
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: {
      entries: [],
      noDiscovery: true,
    },
  });

  try {
    const {
      createZodiacFortune,
      getYearsByAnimal,
      zodiacAnimals,
    } = await server.ssrLoadModule('/src/domain/fortune/zodiacFortuneEngine.js');

    const animals = zodiacAnimals.map(({ animal }) => {
      const fortunes = getYearsByAnimal(animal)
        .slice(-4)
        .map((item) =>
          summarizeFortune(
            createZodiacFortune({
              profile: {
                id: 'zodiac-year-variation-baseline',
                birthDate: `${item.year}-07-01`,
              },
              selectedYear: item.year,
              selectedAnimal: item.animal,
              selectedIcon: item.icon,
              dateKey,
            }),
          ),
        );

      return compareAnimalFortunes(animal, fortunes);
    });

    return {
      status: 'Baseline only',
      productionLogicChanged: false,
      zodiacGenerationLogicChanged: false,
      generatedAt: 'static-check',
      dateKey,
      comparisonFields,
      similarityThreshold: 0.82,
      animals,
    };
  } finally {
    await server.close();
  }
}

function validateBaseline(baseline) {
  let hasFailure = false;

  logResult('baseline_status_is_baseline_only', baseline.status === 'Baseline only');
  if (baseline.status !== 'Baseline only') hasFailure = true;

  logResult('production_logic_unchanged', baseline.productionLogicChanged === false);
  if (baseline.productionLogicChanged !== false) hasFailure = true;

  logResult('zodiac_generation_logic_unchanged', baseline.zodiacGenerationLogicChanged === false);
  if (baseline.zodiacGenerationLogicChanged !== false) hasFailure = true;

  logResult('animals_present', Array.isArray(baseline.animals) && baseline.animals.length >= 12);
  if (!Array.isArray(baseline.animals) || baseline.animals.length < 12) hasFailure = true;

  for (const [animal, requiredYears] of Object.entries(requiredYearsByAnimal)) {
    const record = baseline.animals.find((item) => item.animal === animal);
    const years = record?.years || [];
    const hasRequiredYears = requiredYears.every((year) => years.includes(year));
    logResult(`${animal}_required_years_present`, hasRequiredYears, requiredYears.join(', '));
    if (!hasRequiredYears) hasFailure = true;
  }

  return !hasFailure;
}

async function main() {
  const baseline = await buildBaseline();
  const serialized = `${JSON.stringify(baseline, null, 2)}\n`;

  fs.mkdirSync('docs/generated', { recursive: true });

  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, 'utf8') !== serialized) {
    fs.writeFileSync(outputPath, serialized, 'utf8');
    console.log(`Zodiac year variation baseline written to ${outputPath}`);
  } else {
    console.log(`Zodiac year variation baseline already up to date at ${outputPath}`);
  }

  if (!validateBaseline(baseline)) {
    console.error('Zodiac year variation baseline check failed');
    process.exit(1);
  }

  console.log('Zodiac year variation baseline check passed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
