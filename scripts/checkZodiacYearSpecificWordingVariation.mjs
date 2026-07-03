import { createServer } from 'vite';

const dateKey = '2026-06-30';
const expectedCategoryIds = ['overall', 'money', 'relationship', 'work', 'health'];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function flattenFortune(fortune) {
  return [
    fortune.summary,
    fortune.detail,
    ...(fortune.categories || []).map((category) => category.summary),
  ].map(normalizeText).join('\n');
}

function sameArray(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

async function main() {
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

  let hasFailure = false;

  try {
    const { createZodiacFortune, getYearsByAnimal } = await server.ssrLoadModule(
      '/src/domain/fortune/zodiacFortuneEngine.js',
    );

    const rabbitYears = getYearsByAnimal('토끼').filter((item) => [1987, 1999, 2011].includes(item.year));
    const dragonYears = getYearsByAnimal('용').filter((item) => [1988, 2000, 2012].includes(item.year));

    const rabbitYearsPresent = sameArray(rabbitYears.map((item) => item.year), [1987, 1999, 2011]);
    logResult('rabbit_representative_years_present', rabbitYearsPresent);
    if (!rabbitYearsPresent) hasFailure = true;

    const dragonYearsPresent = sameArray(dragonYears.map((item) => item.year), [1988, 2000, 2012]);
    logResult('dragon_representative_years_present', dragonYearsPresent);
    if (!dragonYearsPresent) hasFailure = true;

    const rabbitFortunes = rabbitYears.map((item) =>
      createZodiacFortune({
        profile: { id: 'zodiac-year-specific-wording-check', birthDate: `${item.year}-07-01` },
        selectedYear: item.year,
        selectedAnimal: item.animal,
        selectedIcon: item.icon,
        dateKey,
      }),
    );

    const selectedYearPreserved = rabbitFortunes.every((fortune, index) => fortune.year === rabbitYears[index].year);
    logResult('selected_year_preserved', selectedYearPreserved);
    if (!selectedYearPreserved) hasFailure = true;

    const selectedAnimalPreserved = rabbitFortunes.every((fortune) => fortune.animal === '토끼');
    logResult('selected_animal_preserved', selectedAnimalPreserved);
    if (!selectedAnimalPreserved) hasFailure = true;

    const categoryIdsPreserved = rabbitFortunes.every((fortune) =>
      sameArray((fortune.categories || []).map((category) => category.id), expectedCategoryIds),
    );
    logResult('category_ids_preserved', categoryIdsPreserved);
    if (!categoryIdsPreserved) hasFailure = true;

    const flattened = rabbitFortunes.map(flattenFortune);
    const exactDuplicatePairs = [];
    for (let left = 0; left < flattened.length; left += 1) {
      for (let right = left + 1; right < flattened.length; right += 1) {
        if (flattened[left] === flattened[right]) {
          exactDuplicatePairs.push([rabbitFortunes[left].year, rabbitFortunes[right].year]);
        }
      }
    }

    const sameAnimalYearsDiffer = exactDuplicatePairs.length === 0;
    logResult('same_animal_year_outputs_not_exact_duplicates', sameAnimalYearsDiffer);
    if (!sameAnimalYearsDiffer) hasFailure = true;

    const rabbit1988Absent = !rabbitYears.some((item) => item.year === 1988);
    logResult('rabbit_1988_not_in_representative_year_list', rabbit1988Absent);
    if (!rabbit1988Absent) hasFailure = true;
  } finally {
    await server.close();
  }

  if (hasFailure) {
    console.error('Zodiac year specific wording variation check failed');
    process.exit(1);
  }

  console.log('Zodiac year specific wording variation check passed');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
