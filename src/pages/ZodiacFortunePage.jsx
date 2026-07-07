import { useMemo, useState } from 'react';
import {
  createZodiacFortune,
  getYearsByAnimal,
  getZodiacByYear,
  getZodiacByYearPillar,
  zodiacAnimals,
} from '../domain/fortune/zodiacFortuneEngine.js';
import PageTopBar from '../components/PageTopBar.jsx';
import RewardAdModal from '../components/RewardAdModal.jsx';

function getProfileZodiac(profile, fortune) {
  const birthYear = Number(profile.birthDate?.slice(0, 4));
  const pillarZodiac = getZodiacByYearPillar(fortune?.sajuAnalysis?.pillars?.year);
  const fallbackZodiac = getZodiacByYear(birthYear);
  const resolvedZodiac = pillarZodiac || fallbackZodiac;

  if (!birthYear || !resolvedZodiac) return null;

  return {
    year: birthYear,
    animal: resolvedZodiac.animal,
    icon: resolvedZodiac.icon,
    birthYearAnimal: fallbackZodiac?.animal || null,
    sajuYearPillarAnimal: pillarZodiac?.animal || null,
    isSajuYearPillarBased: Boolean(pillarZodiac),
    isDifferentFromBirthYearAnimal: Boolean(
      pillarZodiac && fallbackZodiac && pillarZodiac.animal !== fallbackZodiac.animal,
    ),
  };
}

function getInitialState(profile, fortune) {
  const profileZodiac = getProfileZodiac(profile, fortune);
  const profileZodiacYears = profileZodiac ? getYearsByAnimal(profileZodiac.animal) : [];

  if (profileZodiac) {
    return {
      selectedAnimal: profileZodiac.animal,
      openYears: profileZodiacYears.some((item) => item.year === profileZodiac.year) ? [profileZodiac.year] : [],
      hasSupportedBirthYear: true,
    };
  }

  return {
    selectedAnimal: zodiacAnimals[0].animal,
    openYears: [],
    hasSupportedBirthYear: false,
  };
}

function ZodiacFortunePage({ profile, fortune, onNavigate, onOpenReminderSettings, isReminderEnabled }) {
  const initialState = useMemo(() => getInitialState(profile, fortune), [fortune, profile]);
  const profileZodiac = useMemo(() => getProfileZodiac(profile, fortune), [fortune, profile]);
  const [selectedAnimal, setSelectedAnimal] = useState(initialState.selectedAnimal);
  const [openYears, setOpenYears] = useState(initialState.openYears);
  const [unlockedZodiacAdvice, setUnlockedZodiacAdvice] = useState({});
  const [activeAdYear, setActiveAdYear] = useState(null);

  const years = useMemo(() => {
    const baseYears = getYearsByAnimal(selectedAnimal);
    return baseYears;
  }, [selectedAnimal]);

  const toggleYear = (year) => {
    setOpenYears((current) =>
      current.includes(year) ? current.filter((item) => item !== year) : [...current, year],
    );
  };

  const handleSelectAnimal = (animal) => {
    setSelectedAnimal(animal);
    setOpenYears(profileZodiac?.animal === animal ? [profileZodiac.year] : []);
  };

  const unlockAdvice = (year) => {
    setUnlockedZodiacAdvice((current) => ({ ...current, [year]: true }));
  };

  return (
    <div className="page-stack zodiac-page">
      <PageTopBar
        title="띠별운세"
        profileName={profile.nickname}
        isReminderEnabled={isReminderEnabled}
        onProfileClick={() => onNavigate('settings')}
        onReminderClick={onOpenReminderSettings}
      />

      <section className="zodiac-hero-card shared-hero-artwork-card">
        <div>
          <p className="eyebrow">Zodiac Fortune</p>
          <h1>띠별 운세</h1>
          <p>12가지 띠 중 하나를 선택하고, 연도별 오늘의 흐름을 확인해보세요.</p>
        </div>
      </section>

      <section className="zodiac-animal-grid" aria-label="띠 선택">
        {zodiacAnimals.map((item) => (
          <button
            className={selectedAnimal === item.animal ? 'is-active' : ''}
            key={item.animal}
            type="button"
            onClick={() => handleSelectAnimal(item.animal)}
          >
            <span>{item.icon}</span>
            <strong>{item.animal}</strong>
          </button>
        ))}
      </section>

      <section className="zodiac-notice-card">
        <strong>앱 기준 띠 안내</strong>
        <p>
          하루풀이는 입력한 생년월일을 바탕으로 사주 기준 띠 흐름을 안내합니다. 일반적인 출생연도 기준 띠와 다르게 보일 수 있으며,
          특히 1~2월 출생자는 절기 기준에 따라 차이가 날 수 있습니다.
          {profileZodiac?.isDifferentFromBirthYearAnimal &&
            ` 입력하신 생년월일은 일반 출생연도 기준으로는 ${profileZodiac.birthYearAnimal}띠에 가깝지만, 현재 앱의 사주 연주 기준으로는 ${profileZodiac.sajuYearPillarAnimal}띠 흐름을 우선 표시합니다.`}
        </p>
      </section>

      <section className="zodiac-notice-card">
        <strong>연도별 목록 안내</strong>
        <p>
          같은 띠라도 태어난 연도에 따라 해석의 결이 달라질 수 있습니다. 연도별 목록은 참고용이며, 실제 개인 풀이에는
          입력한 생년월일 정보가 함께 반영됩니다.
          {!initialState.hasSupportedBirthYear &&
            ' 프로필의 출생연도가 지원 범위 밖이면 기본 띠가 먼저 표시되니, 아래에서 원하는 띠와 연도를 직접 선택해보세요.'}
        </p>
      </section>

      <section className="zodiac-year-list">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">{selectedAnimal}띠 연도</p>
            <h2>연도별 오늘의 흐름</h2>
          </div>
        </div>

        {years.map((item) => {
          const isOpen = openYears.includes(item.year);
          const zodiacFortune = createZodiacFortune({
            profile,
            selectedYear: item.year,
            selectedAnimal: item.animal,
            selectedIcon: item.icon,
            dateKey: fortune.dateKey,
          });

          return (
            <article className={`zodiac-accordion ${isOpen ? 'is-open' : ''}`} key={item.year}>
              <button type="button" onClick={() => toggleYear(item.year)}>
                <span>
                  {item.year}년 {item.animal}띠
                </span>
                <strong>{isOpen ? '⌃' : '⌄'}</strong>
              </button>

              {isOpen && (
                <div className="zodiac-accordion-body">
                  <div className="zodiac-score-card">
                    <div>
                      <span>{zodiacFortune.year}년생</span>
                      <h2>{zodiacFortune.animal}띠</h2>
                    </div>
                    <strong>{zodiacFortune.score}</strong>
                    <p>{zodiacFortune.summary}</p>
                  </div>

                  <div className="zodiac-category-grid">
                    {zodiacFortune.categories.map((category) => (
                      <article key={category.id} className="zodiac-mini-card">
                        <div>
                          <span>{category.label}</span>
                          <strong>{category.score}</strong>
                        </div>
                        <p>{category.summary}</p>
                      </article>
                    ))}
                  </div>

                  {unlockedZodiacAdvice[item.year] ? (
                    <section className="zodiac-advice-card">
                      <p className="eyebrow">오늘의 조언</p>
                      <h2>띠별 흐름은 참고용으로 가볍게 살펴보세요</h2>
                      <p>{zodiacFortune.detail}</p>
                    </section>
                  ) : (
                    <section className="zodiac-advice-locked">
                      <div>
                        <p className="eyebrow">잠금 콘텐츠</p>
                        <h2>오늘의 조언은 광고 시청 후 열립니다</h2>
                        <p>연도별 흐름에 맞춘 조언을 부담 없이 확인해보세요.</p>
                      </div>
                      <button
                        className="primary-button"
                        type="button"
                        onClick={() => setActiveAdYear(item.year)}
                      >
                        광고 보고 오늘의 조언 열기
                      </button>
                    </section>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>

      {activeAdYear && (
        <RewardAdModal
          categoryLabel={`${activeAdYear}년 ${selectedAnimal}띠 오늘의 조언`}
          onClose={() => setActiveAdYear(null)}
          onRewardComplete={() => unlockAdvice(activeAdYear)}
        />
      )}
    </div>
  );
}

export default ZodiacFortunePage;
