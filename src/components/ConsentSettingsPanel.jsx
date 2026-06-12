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
            현재 MVP에서는 실제 광고/분석 SDK가 연결되어 있지 않습니다. 아래 설정은 향후 기능
            도입에 대비한 선택 동의 상태입니다.
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
              <small>향후 기능 사용 통계를 개선 목적으로 사용할 때 필요한 선택 항목입니다.</small>
            </span>
          </label>

          <label className="consent-settings-option">
            <input type="checkbox" checked={draft.ads} onChange={() => handleToggle('ads')} />
            <span>
              <strong>광고 데이터 사용</strong>
              <small>향후 실제 광고 SDK를 사용할 때 필요한 선택 항목입니다.</small>
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
              <small>향후 맞춤형 광고를 제공할 경우 필요한 선택 항목입니다.</small>
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
