import { useMemo, useState } from 'react';
import MonthlyWaveChart from '../components/MonthlyWaveChart.jsx';
import RewardAdModal from '../components/RewardAdModal.jsx';
import { createYearFortune } from '../domain/fortune/yearFortuneEngine.js';

function YearFortunePage({ profile, fortune, onNavigate }) {
  const [unlockedYearCategories, setUnlockedYearCategories] = useState({});
  const [isMonthlyDetailUnlocked, setIsMonthlyDetailUnlocked] = useState(false);
  const [activeCategoryAd, setActiveCategoryAd] = useState(null);
  const [isMonthlyAdOpen, setIsMonthlyAdOpen] = useState(false);
  const yearFortune = useMemo(
    () => createYearFortune(profile, fortune.sajuAnalysis, 2026),
    [profile, fortune.sajuAnalysis],
  );

  const unlockCategory = (categoryId) => {
    setUnlockedYearCategories((current) => ({ ...current, [categoryId]: true }));
  };

  return (
    <div className="page-stack year-page">
      <section className="year-hero-card">
        <div className="year-hero-copy">
          <p className="eyebrow">2026 Fortune</p>
          <h1>2026년 나의 흐름</h1>
          <p>
            {profile.nickname}님의 {fortune.sajuAnalysis.elements.dominant} 기운과
            {yearFortune.keyword} 키워드를 바탕으로 본 2026년 참고용 풀이입니다.
          </p>
          <div className="year-score-panel">
            <span>2026 총운 점수</span>
            <strong>{yearFortune.averageScore}</strong>
            <p>{yearFortune.summary}</p>
          </div>
        </div>
        <div className="sunrise-art" aria-hidden="true">
          <span className="sunrise-sun" />
          <span className="sunrise-orbit" />
          <span className="sunrise-mountain front" />
          <span className="sunrise-mountain back" />
        </div>
      </section>

      <section className="year-category-grid">
        {yearFortune.categories.map((category) => {
          const isUnlocked = Boolean(unlockedYearCategories[category.id]);

          return (
            <article key={category.id} className="year-mini-card year-unlock-card">
              <span className="year-card-icon">{category.icon}</span>
              <h3>{category.label}</h3>
              <strong>{category.score}점</strong>
              <p>{category.summary}</p>

              <button
                className={`detail-toggle-button year-detail-button ${isUnlocked ? 'is-unlocked' : ''}`}
                type="button"
                onClick={() => setActiveCategoryAd(category)}
                disabled={isUnlocked}
              >
                {isUnlocked ? '상세 풀이 열림' : '상세보기'}
              </button>

              {isUnlocked && (
                <div className="year-detail-copy">
                  <h4>상세 풀이</h4>
                  <p>{category.detail}</p>
                </div>
              )}
            </article>
          );
        })}
      </section>

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
              <i aria-hidden="true">✧</i>
            </div>
          ))}
        </div>
      </section>

      {!isMonthlyDetailUnlocked && (
        <section className="monthly-unlock-card">
          <div>
            <p className="eyebrow">잠금 콘텐츠</p>
            <h2>월별 상세 흐름은 광고 시청 후 열리는 구조로 준비 중입니다</h2>
            <p>실제 광고 SDK 없이, 향후 흐름을 확인할 수 있는 자리만 미리 잡아두었습니다.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setIsMonthlyAdOpen(true)}>
            광고 보고 월별 상세 흐름 전체 열기
          </button>
        </section>
      )}

      {isMonthlyDetailUnlocked && (
        <section className="monthly-detail-card">
          <p className="eyebrow">Monthly Detail</p>
          <h2>2026 월별 상세 흐름</h2>
          <MonthlyWaveChart months={yearFortune.months} />
          <div className="monthly-detail-list">
            {yearFortune.months.map((month) => (
              <article key={month.month}>
                <strong>{month.month}월 · {month.score}점</strong>
                <p>{month.detail}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="premium-nudge-card">
        <div>
          <h2>더 깊은 2026 풀이를 준비하고 있어요</h2>
          <p>현재는 무료 사용과 광고 해금 구조를 우선 검토하고 있습니다.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => onNavigate('premium')}>
          안내 보기
        </button>
      </section>

      {activeCategoryAd && (
        <RewardAdModal
          categoryLabel={`2026 ${activeCategoryAd.label}`}
          onClose={() => setActiveCategoryAd(null)}
          onRewardComplete={() => unlockCategory(activeCategoryAd.id)}
        />
      )}

      {isMonthlyAdOpen && (
        <RewardAdModal
          categoryLabel="2026 월별 상세 흐름"
          onClose={() => setIsMonthlyAdOpen(false)}
          onRewardComplete={() => setIsMonthlyDetailUnlocked(true)}
        />
      )}
    </div>
  );
}

export default YearFortunePage;
