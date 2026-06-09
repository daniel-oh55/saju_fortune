import { manseryeokValidationSamples } from '../domain/saju/manseryeokValidationSamples.js';
import { validateManseryeokSamples } from '../domain/saju/manseryeokValidator.js';

const validation = validateManseryeokSamples(manseryeokValidationSamples);

function StatusBadge({ status }) {
  const labelMap = {
    pass: 'pass',
    fail: 'mismatch',
    reference_pending: 'reference pending',
    reference_conflict: 'external reference conflict',
    calculation_failed: 'calculation failed',
    not_applicable: 'not applicable',
    reference_verified: 'reference verified',
  };

  return <span className={`validation-status-badge ${status}`}>{labelMap[status] || status}</span>;
}

function ProfileSummary({ profile }) {
  return (
    <dl className="validation-json-box">
      <div>
        <dt>birthDate</dt>
        <dd>{profile.birthDate}</dd>
      </div>
      <div>
        <dt>birthTime</dt>
        <dd>{profile.birthTimeUnknown ? 'unknown' : profile.birthTime}</dd>
      </div>
      <div>
        <dt>calendarType</dt>
        <dd>
          {profile.calendarType}
          {profile.isLeapMonth ? ' / leap month' : ''}
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

function ReferenceSource({ source }) {
  if (!source) {
    return (
      <div className="validation-json-box">
        <dt>referenceSource</dt>
        <dd>reference value pending</dd>
      </div>
    );
  }

  return (
    <div className="validation-json-box">
      <div>
        <dt>name</dt>
        <dd>{source.name}</dd>
      </div>
      <div>
        <dt>checkedAt</dt>
        <dd>{source.checkedAt}</dd>
      </div>
      <div>
        <dt>memo</dt>
        <dd>{source.memo}</dd>
      </div>
    </div>
  );
}

function formatExpected(result) {
  if (result.expected) return JSON.stringify(result.expected, null, 2);
  if (result.comparisonStatus === 'reference_conflict') {
    return 'expected is intentionally empty because external references conflict';
  }
  return 'reference value pending';
}

function ManseryeokValidationPage() {
  return (
    <main className="validation-page">
      <section className="section-header">
        <p className="eyebrow">Internal Debug</p>
        <h1>Manseryeok Validation</h1>
        <p>Internal comparison view for external manseryeok reference samples and current engine results.</p>
      </section>

      <section className="validation-summary-grid">
        <div>
          <span>total</span>
          <strong>{validation.total}</strong>
        </div>
        <div>
          <span>pass</span>
          <strong>{validation.passed}</strong>
        </div>
        <div>
          <span>failed</span>
          <strong>{validation.failed}</strong>
        </div>
        <div>
          <span>pending</span>
          <strong>{validation.pending}</strong>
        </div>
        <div>
          <span>conflict</span>
          <strong>{validation.referenceConflict}</strong>
        </div>
        <div>
          <span>not applicable</span>
          <strong>{validation.notApplicable}</strong>
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

              <div className="validation-meta-row">
                <span>referenceStatus</span>
                <StatusBadge status={result.referenceStatus} />
              </div>

              <ProfileSummary profile={sample.profile} />
              <PillarGrid actual={result.actual} />
              <ReferenceSource source={result.referenceSource} />

              {!result.actual.reason && (
                <div className="validation-json-box">
                  <div>
                    <dt>dayMaster</dt>
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
                <dd>{formatExpected(result)}</dd>
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
