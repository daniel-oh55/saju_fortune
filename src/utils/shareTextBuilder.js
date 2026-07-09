const MAX_SHARE_TEXT_LENGTH = 1200;

function takeItems(items, count = 3) {
  return Array.isArray(items) ? items.filter(Boolean).map(String).slice(0, count) : [];
}

function truncateText(text, maxLength = MAX_SHARE_TEXT_LENGTH) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function normalizeShareText(text) {
  return truncateText(
    String(text || '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
}

export function buildFortuneCategoryShareText({ fortune, category, isUnlocked }) {
  const detailText = isUnlocked && category?.detail ? `\n상세 풀이: ${category.detail}` : '';

  return normalizeShareText(`
[하루풀이] 오늘운세 - ${category?.label || '오늘운세'}
한 줄 요약: ${category?.summary || '오늘의 흐름을 차분히 살펴보세요.'}
오늘의 키워드: ${fortune?.keyword || '정리와 균형'}
행운 색상: ${category?.luckyColor || '확인 중'}
행운 아이템: ${category?.luckyItem || '확인 중'}${detailText}

이 내용은 참고용 운세 해석입니다.
  `);
}

export function buildSajuInsightShareText({ fortune, sajuAnalysis, lifeSections }) {
  const keywords = takeItems(sajuAnalysis?.luckyKeywords, 3);
  const sections = Array.isArray(lifeSections) ? lifeSections.slice(0, 2) : [];
  const guideText = sections
    .map((section) => `${section.title}: ${section.description}`)
    .join('\n');

  return normalizeShareText(`
[하루풀이] 사주 흐름
오늘의 흐름: ${sajuAnalysis?.elements?.balanceHint || '오늘의 흐름을 가볍게 정리해보세요.'}
활용 키워드: ${keywords.length > 0 ? keywords.join(', ') : fortune?.keyword || '정리와 균형'}
생활 가이드: ${guideText || '작은 루틴을 중심으로 하루를 차분히 조율해보세요.'}

이 내용은 참고용 해석입니다.
  `);
}

export function buildSavedReadingShareText(item) {
  return normalizeShareText(`
[하루풀이] 저장한 풀이
제목: ${item?.title || '저장한 풀이'}
요약: ${item?.summary || '저장한 풀이를 다시 확인해보세요.'}
내용: ${item?.body || ''}

이 내용은 참고용 해석입니다.
  `);
}

async function copyShareTextToClipboard(text) {
  if (globalThis.navigator?.clipboard?.writeText) {
    await globalThis.navigator.clipboard.writeText(text);
    return;
  }

  const documentRef = globalThis.document;
  if (!documentRef?.createElement || !documentRef?.execCommand) {
    throw new Error('clipboard_unavailable');
  }

  const textarea = documentRef.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  documentRef.body.appendChild(textarea);
  textarea.select();

  const isCopied = documentRef.execCommand('copy');
  documentRef.body.removeChild(textarea);

  if (!isCopied) {
    throw new Error('copy_failed');
  }
}

export async function shareSavedReadingText(item) {
  const text = buildSavedReadingShareText(item);
  const canUseWebShare = typeof globalThis.navigator?.share === 'function';

  if (canUseWebShare) {
    try {
      await globalThis.navigator.share({ text, title: '하루풀이' });
      return { status: 'shared', text };
    } catch (error) {
      if (error?.name === 'AbortError') {
        return { status: 'cancelled', text };
      }
    }

    try {
      await copyShareTextToClipboard(text);
      return { status: 'copied_after_share_failure', text };
    } catch {
      return { status: 'copy_failed', text };
    }
  }

  try {
    await copyShareTextToClipboard(text);
    return { status: 'copied_unsupported', text };
  } catch {
    return { status: 'copy_failed', text };
  }
}
