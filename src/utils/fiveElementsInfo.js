export const FIVE_ELEMENT_INFO = {
  화: {
    label: '화(火)',
    summary: '추진력과 표현이 살아나는 기운',
    description: '화(火)는 추진력과 표현이 살아나는 기운입니다. 오늘 해야 할 일을 밖으로 꺼내고 마음을 밝게 전하는 흐름으로 이해해볼 수 있습니다.',
    balanceTip: '가볍게 몸을 움직이고, 꼭 전할 말을 한 문장으로 정리해보세요.',
  },
  수: {
    label: '수(水)',
    summary: '생각을 정리하고 흐름을 살피는 기운',
    description: '수(水)는 생각을 정리하고 흐름을 살피는 기운입니다. 감정과 상황을 차분히 바라보며 서두르지 않는 태도와 연결됩니다.',
    balanceTip: '잠깐 숨을 고르고, 마음에 남은 생각을 짧게 메모해보세요.',
  },
  목: {
    label: '목(木)',
    summary: '성장과 시작을 돕는 기운',
    description: '목(木)은 성장과 시작을 돕는 기운입니다. 새 계획을 세우고 배움이나 시도를 작게 넓혀가는 흐름으로 볼 수 있습니다.',
    balanceTip: '새로 시작할 일을 작게 나누고, 첫 단계만 가볍게 실행해보세요.',
  },
  금: {
    label: '금(金)',
    summary: '기준을 세우고 정돈하는 기운',
    description: '금(金)은 기준을 세우고 정돈하는 기운입니다. 할 일을 고르고 우선순위를 세우며 집중하는 흐름과 연결됩니다.',
    balanceTip: '할 일을 세 가지로 줄이고, 먼저 끝낼 순서를 정해보세요.',
  },
  토: {
    label: '토(土)',
    summary: '균형을 잡고 기반을 다지는 기운',
    description: '토(土)는 균형을 잡고 기반을 다지는 기운입니다. 식사, 휴식, 주변 정리처럼 생활의 기본 리듬을 챙기는 흐름과 연결됩니다.',
    balanceTip: '식사, 휴식, 주변 정리처럼 기본 리듬을 하나 챙겨보세요.',
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
