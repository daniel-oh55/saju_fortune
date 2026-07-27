import { useEffect, useState } from 'react';

function ConsentSettingsPanel({ preferences, onSave, onClose, onOpenPrivacyInfo }) {
  const [draft, setDraft] = useState({
    analytics: Boolean(preferences?.analytics),
    ads: Boolean(preferences?.ads),
    personalizedAds: Boolean(preferences?.personalizedAds),
  });

  useEffect(() => {
    setDraft({
      analytics: Boolean(preferences?.analytics),
      ads: Boolean(preferences?.ads),
      personalizedAds: Boolean(preferences?.personalizedAds),
    });
  }, [preferences]);

  const handleToggle = (key) => {
    setDraft((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleRejectAll = () => {
    onSave({
      analytics: false,
      ads: false,
      personalizedAds: false,
    });
  };

  return (
    <div className="consent-settings-backdrop" role="presentation">
      <section className="consent-settings-panel" role="dialog" aria-modal="true" aria-labelledby="consent-settings-title">
        <div>
          <p className="eyebrow">Consent Settings</p>
          <h2 id="consent-settings-title">데이터 사용 설정</h2>
          <p>
            아래 항목은 하루풀이 앱 내부의 app-level 선택 설정으로 Google UMP 개인정보 선택과
            별도이며, UMP 선택을 대신하지 않습니다. AdMob SDK와 UMP 동의 확인 절차는 연결되어
            있지만 광고 request/load/show 기능은 아직 구현되지 않았습니다.
          </p>
        </div>

        <div className="consent-settings-options">
          <label className="consent-settings-option">
            <input
              type="checkbox"
              checked={draft.analytics}
              onChange={() => handleToggle('analytics')}
            />
            <span>
              <strong>분석 데이터 사용</strong>
              <small>
                외부 분석 SDK는 아직 연결되지 않았으며, 향후 분석 기능을 위한 app-level
                선택입니다.
              </small>
            </span>
          </label>

          <label className="consent-settings-option">
            <input type="checkbox" checked={draft.ads} onChange={() => handleToggle('ads')} />
            <span>
              <strong>광고 데이터 사용</strong>
              <small>
                향후 실제 광고 요청 경로에서 확인할 app-level 선택이며 Google UMP 선택을
                대신하지 않습니다.
              </small>
            </span>
          </label>

          <label className="consent-settings-option">
            <input
              type="checkbox"
              checked={draft.personalizedAds}
              onChange={() => handleToggle('personalizedAds')}
            />
            <span>
              <strong>맞춤형 광고</strong>
              <small>
                향후 맞춤형 광고 기능을 위한 app-level 선택이며 Google UMP 선택을 대신하지
                않습니다.
              </small>
            </span>
          </label>
        </div>

        <div className="consent-settings-actions">
          <button className="primary-button" type="button" onClick={() => onSave(draft)}>
            저장
          </button>
          <button className="ghost-button" type="button" onClick={handleRejectAll}>
            모두 거부
          </button>
          <button className="ghost-button" type="button" onClick={onOpenPrivacyInfo}>
            개인정보 안내
          </button>
          <button className="text-button" type="button" onClick={onClose}>
            닫기
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConsentSettingsPanel;
