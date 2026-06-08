import { useMemo, useState } from 'react';
import {
  createZodiacFortune,
  getZodiacByYear,
  zodiacYears,
} from '../domain/fortune/zodiacFortuneEngine.js';

function getInitialYear(profile) {
  const birthYear = Number(profile.birthDate?.slice(0, 4));
  return getZodiacByYear(birthYear) ? birthYear : 1996;
}

function ZodiacFortunePage({ profile, fortune }) {
  const birthYear = Number(profile.birthDate?.slice(0, 4));
  const hasSupportedBirthYear = Boolean(getZodiacByYear(birthYear));
  const [selectedYear, setSelectedYear] = useState(() => getInitialYear(profile));

  const zodiacFortune = useMemo(
    () =>
      createZodiacFortune({
        profile,
        selectedYear,
        dateKey: fortune.dateKey,
      }),
    [fortune.dateKey, profile, selectedYear],
  );

  return (
    <div className="page-stack">
      <section className="section-header">
        <p className="eyebrow">Zodiac Fortune</p>
        <h1>띠별 운세</h1>
        <p>태어난 해를 선택해 오늘의 띠별 흐름을 확인해보세요.</p>
      </section>

      <section className="zodiac-selector-card">
        <label>
          태어난 해
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
          >
            {zodiacYears.map((item) => (
              <option key={item.year} value={item.year}>
                {item.year}년 {item.animal}띠
              </option>
            ))}
          </select>
        </label>
        {!hasSupportedBirthYear && (
          <p>
            프로필의 출생연도가 지원 범위 밖이면 기본값으로 표시됩니다. 목록에서 태어난 해를
            직접 선택해보세요.
          </p>
        )}
      </section>

      <section className="zodiac-score-card">
        <div>
          <span>{zodiacFortune.year}년생</span>
          <h2>{zodiacFortune.animal}띠</h2>
        </div>
        <strong>{zodiacFortune.score}</strong>
        <p>{zodiacFortune.summary}</p>
      </section>

      <section className="zodiac-category-grid">
        {zodiacFortune.categories.map((category) => (
          <article key={category.id} className="zodiac-mini-card">
            <div>
              <span>{category.label}</span>
              <strong>{category.score}</strong>
            </div>
            <p>{category.summary}</p>
          </article>
        ))}
      </section>

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
  );
}

export default ZodiacFortunePage;
