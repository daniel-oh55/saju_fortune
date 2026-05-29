import { useState } from 'react';

function CompatibilityPage({ profile }) {
  const [partner, setPartner] = useState({
    nickname: '',
    birthDate: '',
    birthTime: '',
    gender: 'other',
  });

  const updatePartner = (field, value) => {
    setPartner((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="page-stack">
      <section className="section-header">
        <p className="eyebrow">궁합 입력</p>
        <h1>{profile.nickname}님과 상대의 흐름 보기</h1>
      </section>

      <form className="profile-form compact">
        <label>
          상대 닉네임
          <input
            placeholder="예: 준호"
            value={partner.nickname}
            onChange={(event) => updatePartner('nickname', event.target.value)}
          />
        </label>
        <label>
          상대 생년월일
          <input
            type="date"
            value={partner.birthDate}
            onChange={(event) => updatePartner('birthDate', event.target.value)}
          />
        </label>
        <label>
          상대 태어난 시간
          <input
            type="time"
            value={partner.birthTime}
            onChange={(event) => updatePartner('birthTime', event.target.value)}
          />
        </label>
        <label>
          상대 성별
          <select
            value={partner.gender}
            onChange={(event) => updatePartner('gender', event.target.value)}
          >
            <option value="other">선택 안 함</option>
            <option value="female">여성</option>
            <option value="male">남성</option>
          </select>
        </label>
      </form>

      <section className="placeholder-card">
        <strong>궁합 결과 영역</strong>
        <p>추후 두 사람의 사주 계산 결과와 AI 해석을 연결할 수 있도록 입력 구조를 먼저 준비했습니다.</p>
      </section>
    </div>
  );
}

export default CompatibilityPage;
