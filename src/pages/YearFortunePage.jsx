import { useMemo, useState } from 'react';
import AdRewardBox from '../components/AdRewardBox.jsx';
import { createYearFortune } from '../domain/fortune/yearFortuneEngine.js';

function YearFortunePage({ profile, fortune, onNavigate }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const yearFortune = useMemo(
    () => createYearFortune(profile, fortune.sajuAnalysis, 2026),
    [profile, fortune.sajuAnalysis],
  );

  return (
    <div className="page-stack">
      <section className="year-hero-card">
        <p className="eyebrow">2026 Fortune</p>
        <h1>2026년 나의 흐름</h1>
        <p>
          {profile.nickname}님의 {fortune.sajuAnalysis.elements.dominant} 기운과
          {yearFortune.keyword} 키워드를 바탕으로 본 2026년 흐름입니다.
        </p>
      </section>

      <section className="year-score-card">
        <span>2026 총운 점수</span>
        <strong>{yearFortune.averageScore}</strong>
        <p>{yearFortune.summary}</p>
      </section>

      <section className="year-category-grid">
        {yearFortune.categories.map((category) => (
          <article key={category.id} className="year-mini-card">
            <span>{category.icon}</span>
            <h3>{category.label}</h3>
            <strong>{category.score}점</strong>
            <p>{category.summary}</p>
          </article>
        ))}
      </section>

      <AdRewardBox
        categoryLabel="2026운세"
        isUnlocked={isUnlocked}
        buttonLabel="광고 보고 상세 2026운세 열기"
        onUnlock={() => setIsUnlocked(true)}
      />

      {isUnlocked && (
        <section className="detail-copy">
          <h3>2026 상세 리포트 미리보기</h3>
          <p>
            상반기에는 {yearFortune.months[0].note} 흐름이 강하고, 하반기에는
            {yearFortune.months[8].note}에 집중하면 좋습니다. 프리미엄 리포트에서는 월별
            세부 해석과 행동 가이드를 확장할 수 있습니다.
          </p>
        </section>
      )}

      <section className="month-preview-card">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Monthly Preview</p>
            <h2>월별 흐름 미리보기</h2>
          </div>
        </div>
        <div className="month-grid">
          {yearFortune.months.map((month) => (
            <div key={month.month}>
              <strong>{month.month}월</strong>
              <span>{month.score}</span>
              <p>{month.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-nudge-card">
        <div>
          <h2>프리미엄 2026 리포트</h2>
          <p>월별 상세 운세, 재물/연애/직장/건강 심화 해석, AI 상담 질문을 준비 중입니다.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => onNavigate('premium')}>
          안내 보기
        </button>
      </section>
    </div>
  );
}

export default YearFortunePage;
