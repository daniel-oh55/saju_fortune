import { ELEMENT_LABELS, ELEMENT_ORDER } from './sajuConstants.js';

function createEmptyCounts() {
  return Object.fromEntries(ELEMENT_ORDER.map((elementKey) => [elementKey, 0]));
}

function getElementEntries(pillars) {
  return Object.values(pillars || {})
    .filter(Boolean)
    .flatMap((pillar) => [pillar.stemElementKey, pillar.branchElementKey])
    .filter(Boolean);
}

export function analyzeElements(pillars) {
  const counts = createEmptyCounts();
  const elementEntries = getElementEntries(pillars);

  elementEntries.forEach((elementKey) => {
    counts[elementKey] += 1;
  });

  const total = elementEntries.length || 1;
  const percentages = Object.fromEntries(
    ELEMENT_ORDER.map((elementKey) => [elementKey, Math.round((counts[elementKey] / total) * 100)]),
  );
  const maxCount = Math.max(...ELEMENT_ORDER.map((elementKey) => counts[elementKey]));
  const minCount = Math.min(...ELEMENT_ORDER.map((elementKey) => counts[elementKey]));
  const dominantList = ELEMENT_ORDER.filter((elementKey) => counts[elementKey] === maxCount).map(
    (elementKey) => ELEMENT_LABELS[elementKey],
  );
  const weakList = ELEMENT_ORDER.filter((elementKey) => counts[elementKey] === minCount).map(
    (elementKey) => ELEMENT_LABELS[elementKey],
  );
  const dominant = dominantList.join('/');
  const weak = weakList.join('/');
  const balanceLabel =
    dominantList.length > 1
      ? `${dominant} 기운이 비슷하게 드러나는 구조`
      : `${dominant} 기운이 비교적 두드러지는 구조`;

  return {
    counts,
    labels: ELEMENT_LABELS,
    percentages,
    dominant,
    dominantList,
    weak,
    weakList,
    balanceLabel,
    notes: ['현재 오행 분포는 지장간을 제외한 천간/지지 겉오행 기준입니다.'],
  };
}
