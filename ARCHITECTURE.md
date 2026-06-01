# ARCHITECTURE

## 전체 구조

```text
src/
  App.jsx
  main.jsx
  styles.css
  components/
    AdRewardBox.jsx
    BottomNav.jsx
    FortuneCard.jsx
    ProfileForm.jsx
    RewardAdModal.jsx
  data/
    fortuneTemplates.js
    yearFortuneTemplates.js
  domain/
    fortune/
      yearFortuneEngine.js
    saju/
      createSajuAnalysis.js
  pages/
    AiConsultPage.jsx
    CompatibilityPage.jsx
    FortuneDetailPage.jsx
    HomePage.jsx
    OnboardingPage.jsx
    PremiumPage.jsx
    SettingsPage.jsx
    YearFortunePage.jsx
  utils/
    date.js
    fortuneEngine.js
    storage.js
```

## 주요 파일 역할

- `src/App.jsx`: 전체 화면 상태, 페이지 전환, 오늘운세 생성, 광고 해금 상태 연결
- `src/main.jsx`: React 앱 진입점
- `src/styles.css`: 전체 스타일
- `src/utils/date.js`: KST 기준 날짜 키 생성
- `src/utils/fortuneEngine.js`: 오늘운세 seed 기반 생성
- `src/utils/storage.js`: localStorage 저장/조회
- `src/domain/saju/createSajuAnalysis.js`: 추후 만세력 엔진으로 교체할 mock 사주 분석
- `src/domain/fortune/yearFortuneEngine.js`: 2026운세 mock 생성
- `src/components/AdRewardBox.jsx`: 광고 영역과 상세 해금 버튼
- `src/components/RewardAdModal.jsx`: 광고 시청 시뮬레이션 모달
- `src/components/ProfileForm.jsx`: 프로필 입력 폼
- `src/components/BottomNav.jsx`: 하단 네비게이션

## 화면 흐름

1. 신규 사용자: `OnboardingPage`에서 프로필 입력
2. 프로필 저장 후 `HomePage` 이동
3. 홈 메뉴에서 오늘운세, 2026운세, AI상담, 궁합, 마이 화면으로 이동
4. 오늘운세 상세는 `FortuneDetailPage`에서 카테고리별 확인
5. 상세 운세는 광고 시청 시뮬레이션 완료 후 열람
6. 2026운세는 `YearFortunePage`에서 mock 연간 흐름 표시

## 데이터 흐름

- 프로필 입력값은 `localStorage`에 저장됩니다.
- 오늘 날짜는 `getKoreaDateKey()`로 KST 기준 생성됩니다.
- `createTodayFortune(profile, dateKey)`가 오늘운세를 생성합니다.
- `createTodayFortune` 내부에서 `createSajuAnalysis(profile, dateKey)`를 호출합니다.
- 생성된 운세에는 `sajuAnalysis`가 포함됩니다.
- 광고 해금 상태는 운세 id와 카테고리 id 기준으로 저장됩니다.

## localStorage 키

- `aiTodayFortune.profile`: 사용자 프로필
- `aiTodayFortune.todayFortune`: 오늘 운세
- `aiTodayFortune.rewardUnlocks`: 광고 보상 해금 상태

## API / DB 연동 구조

현재 실제 API 또는 DB 연동은 없습니다.

향후 연결 후보:
- AI 상담 API: 확인 필요
- 사용자/운세 저장 DB: Firebase, Supabase, Neon 등 확인 필요
- 광고 SDK: 확인 필요
- 결제 SDK: 확인 필요

## 배포 구조

- GitHub 저장소에 코드를 push합니다.
- Vercel이 GitHub 저장소의 `main` 브랜치를 기준으로 배포할 수 있습니다.
- 기능 개발은 별도 브랜치와 PR을 사용합니다.
- PR Preview 또는 Vercel Preview에서 확인 후 `main`에 merge합니다.

## 외부 서비스 연동 구조

현재 확인된 외부 서비스:
- GitHub
- Vercel

향후 연동 가능 서비스:
- AI API: 확인 필요
- DB: 확인 필요
- 광고 SDK: 확인 필요
- 결제 SDK: 확인 필요

## 향후 확장 시 주의사항

- `createSajuAnalysis.js`는 추후 만세력 계산 엔진으로 교체될 영역입니다.
- 기존 localStorage 데이터와 호환되도록 새 필드는 optional하게 추가합니다.
- Vercel 환경변수 누락은 배포 오류의 주요 원인이 될 수 있습니다.
- `main` 브랜치 merge 전 반드시 Preview 배포를 확인합니다.
