import ProfileForm from '../components/ProfileForm.jsx';

function OnboardingPage({ initialProfile, onSave }) {
  return (
    <main className="onboarding-page">
      <section className="onboarding-hero">
        <div className="brand-mark">AI</div>
        <p className="eyebrow">AI 오늘운세</p>
        <h1>매일 아침, 나에게 맞춘 운세 루틴</h1>
        <p>
          생년월일과 태어난 시간을 저장하면 오늘의 총운, 재물운, 연애운, 직장운,
          건강운을 간단히 확인할 수 있습니다.
        </p>
      </section>
      <ProfileForm initialProfile={initialProfile} onSave={onSave} />
    </main>
  );
}

export default OnboardingPage;
