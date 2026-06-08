import { useMemo, useState } from 'react';
import {
  createZodiacFortune,
  getYearsByAnimal,
  getZodiacByYear,
  zodiacAnimals,
} from '../domain/fortune/zodiacFortuneEngine.js';

function getInitialState(profile) {
  const birthYear = Number(profile.birthDate?.slice(0, 4));
  const birthZodiac = getZodiacByYear(birthYear);

  if (birthZodiac) {
    return {
      selectedAnimal: birthZodiac.animal,
      openYears: [birthYear],
      hasSupportedBirthYear: true,
    };
  }

  return {
    selectedAnimal: zodiacAnimals[0].animal,
    openYears: [],
    hasSupportedBirthYear: false,
  };
}

function ZodiacFortunePage({ profile, fortune }) {
  const initialState = useMemo(() => getInitialState(profile), [profile]);
  const [selectedAnimal, setSelectedAnimal] = useState(initialState.selectedAnimal);
  const [openYears, setOpenYears] = useState(initialState.openYears);

  const years = getYearsByAnimal(selectedAnimal);

  const toggleYear = (year) => {
    setOpenYears((current) =>
      current.includes(year) ? current.filter((item) => item !== year) : [...current, year],
    );
  };

  const handleSelectAnimal = (animal) => {
    setSelectedAnimal(animal);
    const birthYear = Number(profile.birthDate?.slice(0, 4));
    const birthZodiac = getZodiacByYear(birthYear);
    setOpenYears(birthZodiac?.animal === animal ? [birthYear] : []);
  };

  return (
    <div className="page-stack">
      <section className="section-header">
        <p className="eyebrow">Zodiac Fortune</p>
        <h1>띠별 운세</h1>
        <p>12가지 띠 중 하나를 선택하고, 연도별 오늘의 흐름을 확인해보세요.</p>
      </section>

      {!initialState.hasSupportedBirthYear && (
        <section className="zodiac-notice-card">
          프로필의 출생연도가 지원 범위 밖이면 기본 띠가 먼저 표시됩니다. 아래에서 원하는 띠와
          연도를 직접 선택해보세요.
        </section>
      )}

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
            dateKey: fortune.dateKey,
          });

          return (
            <article className={`zodiac-accordion ${isOpen ? 'is-open' : ''}`} key={item.year}>
              <button type="button" onClick={() => toggleYear(item.year)}>
                <span>
                  {item.year}년 {item.animal}띠
                </span>
                <strong>{isOpen ? '접기' : '열기'}</strong>
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

                  <section className="zodiac-advice-card">
                    <p className="eyebrow">오늘의 조언</p>
                    <h2>띠별 흐름은 참고용으로 가볍게 살펴보세요</h2>
                    <p>{zodiacFortune.detail}</p>
                  </section>

                  <section className="lucky-grid">
                    <div>
                      <span>키워드</span>
                      <strong>{zodiacFortune.luckyKeyword}</strong>
                    </div>
                    <div>
                      <span>색상</span>
                      <strong>{zodiacFortune.luckyColor}</strong>
                    </div>
                    <div>
                      <span>아이템</span>
                      <strong>{zodiacFortune.luckyItem}</strong>
                    </div>
                  </section>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default ZodiacFortunePage;
