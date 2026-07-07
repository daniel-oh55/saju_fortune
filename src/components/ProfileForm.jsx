import { useState } from 'react';
import { buildProfileId } from '../utils/fortuneEngine.js';
import {
  getDistrictsByProvince,
  isOverseasRegionProvince,
  loadProfileRegionMeta,
  MAX_OVERSEAS_REGION_DISTRICT_LENGTH,
  normalizeProfileRegionMeta,
  PROFILE_REGION_SELECT_OPTIONS,
  saveProfileRegionMeta,
} from '../utils/profileRegionMetaStorage.js';

const defaultProfile = {
  nickname: '',
  birthDate: '1990-01-01',
  birthTime: '08:00',
  birthTimeUnknown: false,
  lateNightJasiPolicy: 'same_day',
  calendarType: 'solar',
  isLeapMonth: false,
  gender: 'male',
};

function normalizeInitialProfile(initialProfile) {
  return {
    ...defaultProfile,
    ...(initialProfile || {}),
    gender: ['male', 'female'].includes(initialProfile?.gender) ? initialProfile.gender : defaultProfile.gender,
    birthTimeUnknown: Boolean(initialProfile?.birthTimeUnknown),
    isLeapMonth: Boolean(initialProfile?.isLeapMonth),
    lateNightJasiPolicy: initialProfile?.lateNightJasiPolicy || 'same_day',
  };
}

function isLateNightBirthTime(birthTime, birthTimeUnknown) {
  if (birthTimeUnknown) return false;
  return /^23:\d{2}$/.test(birthTime || '');
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function splitDate(value) {
  const [year, month, day] = String(value || '').split('-');
  return {
    year: year || '1990',
    month: month || '01',
    day: day || '01',
  };
}

function splitTime(value) {
  const [hourText, minuteText] = String(value || '08:00').split(':');
  const hour24 = Number(hourText);
  const minute = minuteText || '00';
  const period = hour24 >= 12 ? 'pm' : 'am';
  const hour12 = hour24 % 12 || 12;

  return {
    period,
    hour: pad2(hour12),
    minute: pad2(minute),
  };
}

function joinTime({ period, hour, minute }) {
  const hourNumber = Number(hour);
  const hour24 = period === 'pm' ? (hourNumber % 12) + 12 : hourNumber % 12;
  return `${pad2(hour24)}:${pad2(minute)}`;
}

function getDaysInMonth(year, month) {
  return new Date(Number(year), Number(month), 0).getDate();
}

const YEARS = Array.from({ length: 91 }, (_, index) => String(1940 + index));
const MONTHS = Array.from({ length: 12 }, (_, index) => pad2(index + 1));
const HOURS = Array.from({ length: 12 }, (_, index) => pad2(index + 1));
const MINUTES = Array.from({ length: 60 }, (_, index) => pad2(index));

function ProfileForm({ initialProfile, onSave }) {
  const [form, setForm] = useState(() => normalizeInitialProfile(initialProfile));
  const [regionMeta, setRegionMeta] = useState(() => loadProfileRegionMeta());
  const [regionError, setRegionError] = useState('');
  const dateParts = splitDate(form.birthDate);
  const days = Array.from({ length: getDaysInMonth(dateParts.year, dateParts.month) }, (_, index) => pad2(index + 1));
  const timeParts = splitTime(form.birthTime || '08:00');
  const isOverseasRegion = isOverseasRegionProvince(regionMeta.province);
  const districts = isOverseasRegion ? [] : getDistrictsByProvince(regionMeta.province);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateBirthDatePart = (field, value) => {
    const nextDateParts = { ...dateParts, [field]: value };
    const lastDay = getDaysInMonth(nextDateParts.year, nextDateParts.month);
    if (Number(nextDateParts.day) > lastDay) {
      nextDateParts.day = pad2(lastDay);
    }
    updateField('birthDate', `${nextDateParts.year}-${nextDateParts.month}-${nextDateParts.day}`);
  };

  const updateBirthTimePart = (field, value) => {
    const nextTimeParts = { ...timeParts, [field]: value };
    updateField('birthTime', joinTime(nextTimeParts));
  };

  const updateRegionProvince = (province) => {
    setRegionError('');

    if (isOverseasRegionProvince(province)) {
      setRegionMeta((current) => ({
        province,
        district: isOverseasRegionProvince(current.province) ? current.district : '',
      }));
      return;
    }

    const nextDistrict = getDistrictsByProvince(province)[0];
    setRegionMeta({ province, district: nextDistrict });
  };

  const updateOverseasRegionDistrict = (value) => {
    setRegionError('');
    setRegionMeta((current) => ({
      ...current,
      district: value.replace(/[<>]/g, '').slice(0, MAX_OVERSEAS_REGION_DISTRICT_LENGTH),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextRegionMeta = normalizeProfileRegionMeta(regionMeta);
    if (isOverseasRegionProvince(nextRegionMeta.province) && !nextRegionMeta.district) {
      setRegionError('해외 도시/지역명을 입력해 주세요.');
      return;
    }
    setRegionError('');

    const normalizedForm = {
      ...form,
      birthTime: form.birthTimeUnknown ? '' : form.birthTime,
      isLeapMonth: form.calendarType === 'lunar' ? form.isLeapMonth : false,
      lateNightJasiPolicy: isLateNightBirthTime(form.birthTime, form.birthTimeUnknown)
        ? form.lateNightJasiPolicy || 'same_day'
        : 'same_day',
    };

    const profile = {
      ...normalizedForm,
      id: buildProfileId(normalizedForm),
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(profile);
    saveProfileRegionMeta(nextRegionMeta);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <label className="profile-field-card">
        <span>이름</span>
        <input
          required
          placeholder="이름을 입력해 주세요"
          value={form.nickname}
          onChange={(event) => updateField('nickname', event.target.value)}
        />
      </label>

      <div className="profile-field-card">
        <span>성별</span>
        <div className="profile-segmented-control" role="radiogroup" aria-label="성별 선택">
          <button
            className={form.gender === 'male' ? 'selected' : ''}
            type="button"
            onClick={() => updateField('gender', 'male')}
          >
            남성
          </button>
          <button
            className={form.gender === 'female' ? 'selected' : ''}
            type="button"
            onClick={() => updateField('gender', 'female')}
          >
            여성
          </button>
        </div>
      </div>

      <div className="profile-field-card">
        <span>생년월일</span>
        <div className="profile-picker-row profile-date-picker">
          <select value={dateParts.year} onChange={(event) => updateBirthDatePart('year', event.target.value)}>
            {YEARS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select value={dateParts.month} onChange={(event) => updateBirthDatePart('month', event.target.value)}>
            {MONTHS.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select value={dateParts.day} onChange={(event) => updateBirthDatePart('day', event.target.value)}>
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="profile-field-card">
        <span>출생시간</span>
        <div className="profile-picker-row profile-time-picker">
          <select
            disabled={form.birthTimeUnknown}
            value={timeParts.period}
            onChange={(event) => updateBirthTimePart('period', event.target.value)}
          >
            <option value="am">오전</option>
            <option value="pm">오후</option>
          </select>
          <select
            disabled={form.birthTimeUnknown}
            value={timeParts.hour}
            onChange={(event) => updateBirthTimePart('hour', event.target.value)}
          >
            {HOURS.map((hour) => (
              <option key={hour} value={hour}>{hour}시</option>
            ))}
          </select>
          <select
            disabled={form.birthTimeUnknown}
            value={timeParts.minute}
            onChange={(event) => updateBirthTimePart('minute', event.target.value)}
          >
            {MINUTES.map((minute) => (
              <option key={minute} value={minute}>{minute}분</option>
            ))}
          </select>
        </div>
        <label className="inline-check">
          <input
            type="checkbox"
            checked={form.birthTimeUnknown}
            onChange={(event) => {
              const isUnknown = event.target.checked;
              setForm((current) => ({
                ...current,
                birthTimeUnknown: isUnknown,
                birthTime: isUnknown ? current.birthTime : current.birthTime || defaultProfile.birthTime,
              }));
            }}
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
            현재 하루풀이는 선택한 23시 이후 기준을 바탕으로 참고용 풀이를 제공하며, 기준 정책은
            추가 검증 후 조정될 수 있습니다.
          </p>
          <div className="late-night-policy-options" role="radiogroup" aria-label="23시 이후 기준 선택">
            <span>23시 이후 기준 선택</span>
            <label>
              <input
                type="radio"
                name="lateNightJasiPolicy"
                value="same_day"
                checked={(form.lateNightJasiPolicy || 'same_day') === 'same_day'}
                onChange={(event) => updateField('lateNightJasiPolicy', event.target.value)}
              />
              <strong>입력한 날짜 기준</strong>
              <small>입력한 생년월일을 그대로 기준으로 풀이합니다.</small>
            </label>
            <label>
              <input
                type="radio"
                name="lateNightJasiPolicy"
                value="next_day"
                checked={form.lateNightJasiPolicy === 'next_day'}
                onChange={(event) => updateField('lateNightJasiPolicy', event.target.value)}
              />
              <strong>다음 날 자시 기준</strong>
              <small>23시 이후를 다음 날 자시로 보고 풀이합니다.</small>
            </label>
          </div>
        </div>
      )}

      <div className="profile-field-card">
        <span>양력/음력</span>
        <div className="profile-segmented-control" aria-label="양력 음력 선택">
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
      </div>

      {form.calendarType === 'lunar' && (
        <div className="profile-segmented-control profile-leap-month-control" aria-label="윤달 여부 선택">
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

      <div className="profile-field-card">
        <span>출생지역</span>
        <div className={`profile-picker-row profile-region-picker${isOverseasRegion ? ' overseas' : ''}`}>
          <select value={regionMeta.province} onChange={(event) => updateRegionProvince(event.target.value)}>
            {PROFILE_REGION_SELECT_OPTIONS.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
          {isOverseasRegion ? (
            <label className="profile-overseas-region-field">
              <span>해외 도시/지역</span>
              <input
                aria-label="해외 도시/지역"
                maxLength={MAX_OVERSEAS_REGION_DISTRICT_LENGTH}
                placeholder="예: Los Angeles, Tokyo, Vancouver"
                value={regionMeta.district}
                onChange={(event) => updateOverseasRegionDistrict(event.target.value)}
              />
            </label>
          ) : (
            <select
              value={regionMeta.district}
              onChange={(event) => setRegionMeta((current) => ({ ...current, district: event.target.value }))}
            >
              {districts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          )}
        </div>
        {isOverseasRegion && (
          <small>해외 출생지는 우선 도시/지역명만 저장하며 태양시 보정 적용 여부는 추후 검토 예정입니다.</small>
        )}
        {regionError && <small className="profile-field-error">{regionError}</small>}
        <small>출생지역은 입력 UI용으로만 저장되며 현재 계산 로직에는 사용하지 않습니다.</small>
      </div>

      <button className="primary-button full-width" type="submit">
        하루풀이 시작하기
      </button>
    </form>
  );
}

export default ProfileForm;
