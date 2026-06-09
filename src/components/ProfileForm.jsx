import { useState } from 'react';
import { buildProfileId } from '../utils/fortuneEngine.js';

const defaultProfile = {
  nickname: '',
  birthDate: '',
  birthTime: '',
  birthTimeUnknown: false,
  calendarType: 'solar',
  isLeapMonth: false,
  gender: 'other',
};

function normalizeInitialProfile(initialProfile) {
  return {
    ...defaultProfile,
    ...(initialProfile || {}),
    gender: initialProfile?.gender || 'other',
    birthTimeUnknown: Boolean(initialProfile?.birthTimeUnknown),
    isLeapMonth: Boolean(initialProfile?.isLeapMonth),
  };
}

function isLateNightBirthTime(birthTime, birthTimeUnknown) {
  if (birthTimeUnknown) return false;
  return /^23:\d{2}$/.test(birthTime || '');
}

function ProfileForm({ initialProfile, onSave }) {
  const [form, setForm] = useState(() => normalizeInitialProfile(initialProfile));

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedForm = {
      ...form,
      birthTime: form.birthTimeUnknown ? '' : form.birthTime,
      isLeapMonth: form.calendarType === 'lunar' ? form.isLeapMonth : false,
    };

    const profile = {
      ...normalizedForm,
      id: buildProfileId(normalizedForm),
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(profile);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <label>
        닉네임
        <input
          required
          placeholder="예: 민지"
          value={form.nickname}
          onChange={(event) => updateField('nickname', event.target.value)}
        />
      </label>

      <label>
        생년월일
        <input
          required
          type="date"
          value={form.birthDate}
          onChange={(event) => updateField('birthDate', event.target.value)}
        />
      </label>

      <div className="field-group">
        <label>
          태어난 시간
          <input
            required={!form.birthTimeUnknown}
            disabled={form.birthTimeUnknown}
            type="time"
            value={form.birthTime}
            onChange={(event) => updateField('birthTime', event.target.value)}
          />
        </label>
        <label className="inline-check">
          <input
            type="checkbox"
            checked={form.birthTimeUnknown}
            onChange={(event) => updateField('birthTimeUnknown', event.target.checked)}
          />
          시간 모름
        </label>
      </div>

      {isLateNightBirthTime(form.birthTime, form.birthTimeUnknown) && (
        <div className="late-night-time-notice">
          <strong>23시 이후 출생 안내</strong>
          <p>
            23:00~23:59 출생은 만세력 기준에 따라 같은 날짜 기준 또는 다음 날 자시 기준으로
            일주와 시주가 달라질 수 있습니다.
          </p>
          <p>
            현재 하루풀이는 입력한 생년월일과 시간을 기준으로 참고용 풀이를 제공하며, 23시 이후
            기준 선택 기능은 추후 검토 중입니다.
          </p>
        </div>
      )}

      <div className="segmented-control" aria-label="양력 음력 선택">
        <button
          className={form.calendarType === 'solar' ? 'selected' : ''}
          type="button"
          onClick={() => updateField('calendarType', 'solar')}
        >
          양력
        </button>
        <button
          className={form.calendarType === 'lunar' ? 'selected' : ''}
          type="button"
          onClick={() => updateField('calendarType', 'lunar')}
        >
          음력
        </button>
      </div>

      {form.calendarType === 'lunar' && (
        <div className="segmented-control" aria-label="윤달 여부 선택">
          <button
            className={!form.isLeapMonth ? 'selected' : ''}
            type="button"
            onClick={() => updateField('isLeapMonth', false)}
          >
            평달
          </button>
          <button
            className={form.isLeapMonth ? 'selected' : ''}
            type="button"
            onClick={() => updateField('isLeapMonth', true)}
          >
            윤달
          </button>
        </div>
      )}

      <label>
        성별
        <select value={form.gender} onChange={(event) => updateField('gender', event.target.value)}>
          <option value="other">선택 안 함</option>
          <option value="female">여성</option>
          <option value="male">남성</option>
        </select>
      </label>

      <button className="primary-button full-width" type="submit">
        오늘의 운세 시작하기
      </button>
    </form>
  );
}

export default ProfileForm;
