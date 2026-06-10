import { useState } from 'react';

async function copyWithFallback(text) {
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

function CopyShareButton({ getText, label = '공유 문구 복사', copiedLabel = '복사됨' }) {
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopy = async () => {
    setCopied(false);
    setErrorMessage('');

    try {
      await copyWithFallback(getText());
      setCopied(true);
      globalThis.setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMessage('복사하지 못했습니다. 텍스트를 직접 선택해 복사해주세요.');
    }
  };

  return (
    <div className="copy-share-button-wrap">
      <button className="copy-share-button" type="button" onClick={handleCopy}>
        {copied ? copiedLabel : label}
      </button>
      {copied && <span className="copy-share-status">공유 문구가 복사되었습니다.</span>}
      {errorMessage && <span className="copy-share-status error">{errorMessage}</span>}
    </div>
  );
}

export default CopyShareButton;
