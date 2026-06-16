import ProfileForm from '../components/ProfileForm.jsx';

function OnboardingPage({ initialProfile, onSave }) {
  return (
    <main className="onboarding-page">
      <section className="onboarding-hero">
        <div className="brand-mark">하루</div>
        <p className="eyebrow">하루풀리</p>
        <h1>매일 무료로 확인하는 따뜻한 사주·운세 풀이</h1>
        <p>
          오늘의 흐름부터 궁금한 고민까지, 현실적인 조언으로 차근차근 풀어드립니다.
        </p>
      </section>
      <ProfileForm initialProfile={initialProfile} onSave={onSave} />
    </main>
  );
}

export default OnboardingPage;
