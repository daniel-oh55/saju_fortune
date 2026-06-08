import { manseryeokValidationSamples } from '../domain/saju/manseryeokValidationSamples.js';
import { validateManseryeokSamples } from '../domain/saju/manseryeokValidator.js';

const validation = validateManseryeokSamples(manseryeokValidationSamples);

function StatusBadge({ status }) {
  const labelMap = {
    pass: '통과',
    fail: '불일치',
    reference_pending: '기준값 대기',
    calculation_failed: '계산 실패',
  };

  return <span className={`validation-status-badge ${status}`}>{labelMap[status] || status}</span>;
}

function ProfileSummary({ profile }) {
  return (
    <dl className="validation-json-box">
      <div>
        <dt>생년월일</dt>
        <dd>{profile.birthDate}</dd>
      </div>
      <div>
        <dt>태어난 시간</dt>
        <dd>{profile.birthTimeUnknown ? '시간 미상' : profile.birthTime}</dd>
      </div>
      <div>
        <dt>달력</dt>
        <dd>
          {profile.calendarType}
          {profile.isLeapMonth ? ' / 윤달' : ''}
        </dd>
      </div>
    </dl>
  );
}

function PillarGrid({ actual }) {
  if (actual.reason) {
    return (
      <div className="validation-json-box">
        <strong>{actual.reason}</strong>
        <p>{actual.detail}</p>
      </div>
    );
  }

  return (
    <div className="validation-pillars-grid">
      {Object.entries(actual.pillars).map(([key, value]) => (
        <div key={key}>
          <span>{key}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function ManseryeokValidationPage() {
  return (
    <main className="validation-page">
      <section className="section-header">
        <p className="eyebrow">Internal Debug</p>
        <h1>만세력 검증 도구</h1>
        <p>외부 만세력 기준값과 lunar-javascript 결과를 비교하기 위한 내부 검증 화면입니다.</p>
      </section>

      <section className="validation-summary-grid">
        <div>
          <span>전체 샘플 수</span>
          <strong>{validation.total}</strong>
        </div>
        <div>
          <span>통과</span>
          <strong>{validation.passed}</strong>
        </div>
        <div>
          <span>실패</span>
          <strong>{validation.failed}</strong>
        </div>
        <div>
          <span>기준값 대기</span>
          <strong>{validation.pending}</strong>
        </div>
      </section>

      <section className="validation-result-list">
        {validation.results.map((result) => {
          const sample = manseryeokValidationSamples.find((item) => item.id === result.id);

          return (
            <article className="validation-result-card" key={result.id}>
              <div className="validation-result-head">
                <div>
                  <p className="eyebrow">{result.id}</p>
                  <h2>{result.title}</h2>
                </div>
                <StatusBadge status={result.comparisonStatus} />
              </div>

              <ProfileSummary profile={sample.profile} />
              <PillarGrid actual={result.actual} />

              {!result.actual.reason && (
                <div className="validation-json-box">
                  <div>
                    <dt>일간</dt>
                    <dd>
                      {result.actual.dayMaster?.stem} / {result.actual.dayMaster?.element}
                    </dd>
                  </div>
                  <div>
                    <dt>convertedSolar</dt>
                    <dd>{result.actual.convertedSolar}</dd>
                  </div>
                  <div>
                    <dt>convertedLunar</dt>
                    <dd>{JSON.stringify(result.actual.convertedLunar)}</dd>
                  </div>
                </div>
              )}

              <div className="validation-json-box">
                <dt>expected</dt>
                <dd>{result.expected ? JSON.stringify(result.expected, null, 2) : '외부 기준값 입력 대기'}</dd>
              </div>

              {result.mismatchFields.length > 0 && (
                <div className="validation-json-box">
                  <dt>mismatchFields</dt>
                  <dd>{result.mismatchFields.join(', ')}</dd>
                </div>
              )}

              <ul className="validation-note-list">
                {result.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default ManseryeokValidationPage;
