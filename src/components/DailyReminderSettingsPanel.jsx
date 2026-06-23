function DailyReminderSettingsPanel({
  draft,
  message,
  onClose,
  onSave,
  onToggle,
  onTimeChange,
}) {
  return (
    <div className="home-modal-backdrop" role="presentation">
      <section className="home-bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="daily-reminder-title">
        <div className="home-modal-head">
          <div>
            <p className="eyebrow">Daily Reminder</p>
            <h2 id="daily-reminder-title">알림 설정</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="알림 설정 닫기">
            ×
          </button>
        </div>
        <p className="reminder-settings-copy">
          매일 아침 오늘의 흐름을 확인해보세요. 설정한 시간에 하루풀이가 오늘의 흐름 확인을 알려드릴게요.
        </p>
        <label className="reminder-toggle-row">
          <span>
            <strong>알림 받기</strong>
            <small>{draft.enabled ? '켜짐' : '꺼짐'}</small>
          </span>
          <input
            type="checkbox"
            checked={draft.enabled}
            onChange={(event) => onToggle(event.target.checked)}
          />
        </label>
        <label className="reminder-time-row">
          <span>알림 시간</span>
          <input
            type="time"
            value={draft.time}
            onChange={(event) => onTimeChange(event.target.value || '08:00')}
          />
        </label>
        <p className="reminder-settings-note" role="status">
          {message || '기본 시간은 오전 8시이며, 처음에는 알림이 꺼져 있습니다.'}
        </p>
        <button className="primary-button full-width" type="button" onClick={onSave}>
          저장
        </button>
      </section>
    </div>
  );
}

export default DailyReminderSettingsPanel;
