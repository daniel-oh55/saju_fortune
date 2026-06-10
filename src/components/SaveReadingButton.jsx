function SaveReadingButton({ isSaved, onSave, onRemove, label }) {
  const handleClick = () => {
    if (isSaved) {
      onRemove?.();
      return;
    }

    onSave?.();
  };

  return (
    <button
      className={`save-reading-button ${isSaved ? 'is-saved' : ''}`}
      type="button"
      onClick={handleClick}
    >
      {label || (isSaved ? '저장됨' : '풀이 저장')}
    </button>
  );
}

export default SaveReadingButton;
