export const FIVE_ELEMENT_INFO = {
  화: {
    label: '화(火)',
    summary: '활력, 표현, 열정, 추진력',
    description: '화(火)는 활력과 표현의 기운입니다. 생각을 밖으로 드러내고 미뤄둔 일을 시작하는 힘과 연결해볼 수 있습니다.',
    balanceTip: '가볍게 몸을 움직이고, 생각을 말로 표현하거나 작은 일을 먼저 시작해보세요.',
  },
  수: {
    label: '수(水)',
    summary: '감정, 휴식, 유연함, 흐름',
    description: '수(水)는 감정과 휴식, 유연함의 기운입니다. 마음의 흐름을 살피고 급한 판단보다 여유를 두는 태도와 연결됩니다.',
    balanceTip: '충분히 쉬고, 감정을 차분히 기록하며, 급하게 결정하기보다 흐름을 살펴보세요.',
  },
  목: {
    label: '목(木)',
    summary: '성장, 시작, 배움, 확장',
    description: '목(木)은 성장과 시작의 기운입니다. 새 계획을 세우고 배우며 조금씩 넓혀가는 흐름과 연결됩니다.',
    balanceTip: '새 계획을 세우고, 공부하거나 작은 목표부터 차근히 시작해보세요.',
  },
  금: {
    label: '금(金)',
    summary: '정리, 기준, 집중, 절제',
    description: '금(金)은 정리와 기준의 기운입니다. 할 일을 고르고 우선순위를 세우며 집중하는 흐름과 연결됩니다.',
    balanceTip: '할 일을 정리하고, 우선순위를 세우며, 불필요한 물건이나 생각을 덜어내보세요.',
  },
  토: {
    label: '토(土)',
    summary: '안정, 균형, 돌봄, 기반',
    description: '토(土)는 안정과 균형의 기운입니다. 생활의 기반을 챙기고 무리한 변화보다 편안한 리듬을 회복하는 흐름과 연결됩니다.',
    balanceTip: '식사와 수면을 챙기고, 주변을 정돈하며, 무리한 변화보다 안정감을 먼저 회복해보세요.',
  },
};

export const FIVE_ELEMENT_ORDER = ['화', '수', '목', '금', '토'];

export function getFiveElementInfo(element) {
  return FIVE_ELEMENT_INFO[String(element || '').trim()] || null;
}

export function displayFiveElement(element) {
  const info = getFiveElementInfo(element);
  return info?.label || element || '확인 중';
}

export function displayFiveElementText(value) {
  if (!value) return '확인 중';

  return String(value)
    .split('/')
    .map((item) => displayFiveElement(item.trim()))
    .join(' / ');
}

export function getElementsFromText(value) {
  return String(value || '')
    .split('/')
    .map((item) => item.trim())
    .filter((item) => Boolean(getFiveElementInfo(item)));
}
