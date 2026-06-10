# DEVELOPMENT_LOG

## 2026-06-10 쿠키/광고 동의 UX 검토 문서 추가

### 작업 내용
- PR 목적: 쿠키/광고 동의 UX 검토 문서 추가
- `docs/COOKIE_AD_CONSENT_UX.md` 신규 추가
- `docs/PRIVACY_POLICY_DRAFT.md`에 쿠키 및 동의 UX 검토 항목 추가
- `docs/PRIVACY_DATA_MAP.md`에 consent preferences 후보 항목 추가
- `docs/REWARDED_AD_SDK_READINESS.md`에 쿠키/광고 동의 UX 연계 내용 추가
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 실제 consent localStorage key 구현 없음
- rewarded ad 구조 변경 없음
- 저장/공유/streak 기능 동작 변경 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- `npm run check:visit-streak`: 성공

## 2026-06-10 개인정보 처리방침 초안 문서 추가

### 작업 내용
- PR 목적: 개인정보 처리방침 초안 문서 추가
- `docs/PRIVACY_POLICY_DRAFT.md` 신규 추가
- `docs/PRIVACY_DATA_MAP.md` 신규 추가
- SAVED_READINGS / VISIT_STREAK / REWARDED_AD_SDK_READINESS 문서에 개인정보 관련 원칙 추가
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad 구조 변경 없음
- 저장/공유/streak 기능 동작 변경 없음
- 실제 광고 SDK 추가 없음
- 외부 광고 라이브러리 설치 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- `npm run check:visit-streak`: 성공

## 2026-06-10 위험 표현 검증 스크립트 추가

### 작업 내용
- PR 목적: 위험 표현 검증 스크립트 추가
- 신규 스크립트: `scripts/checkContentSafetyCopyRegression.mjs`
- 신규 npm script: `check:content-safety`
- `docs/CONTENT_SAFETY.md` 자동 검증 항목 추가
- production UI 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad 구조 변경 없음
- 저장/공유 기능 동작 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 운세 콘텐츠 안전 문구 통합

### 작업 내용
- PR 목적: 운세 콘텐츠 안전 문구 통합
- `contentSafetyCopy` 신규 추가
- `ContentSafetyNotice` 신규 추가
- HomePage에 참고용 해석 안내 추가
- FortuneDetailPage에 오늘운세 참고 안내 추가
- SajuInsightPage에 사주 흐름 참고 안내 추가
- SavedReadingsPage에 저장한 풀이 참고 안내 추가
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad 구조 변경 없음
- 저장/공유 기능 동작 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 공유용 텍스트 복사 기능 추가

### 작업 내용
- PR 목적: 공유용 텍스트 복사 기능 추가
- `shareTextBuilder` 신규 추가
- `CopyShareButton` 신규 추가
- FortuneDetailPage에 오늘운세 공유 복사 추가
- SajuInsightPage에 사주 흐름 공유 복사 추가
- SavedReadingsPage에 저장한 풀이 공유 복사 추가
- profile 원본 정보 공유 없음
- locked 상세 전문 공유 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad 구조 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:share-text`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 풀이 저장 기능 추가

### 작업 내용
- PR 목적: 풀이 저장 기능 추가
- `savedReadingsStorage` 신규 추가
- `SaveReadingButton` 신규 추가
- `SavedReadingsSummaryCard` 신규 추가
- `SavedReadingsPage` 신규 추가
- HomePage에 저장한 풀이 카드 표시
- FortuneDetailPage에 풀이 저장 버튼 추가
- SajuInsightPage에 사주 흐름 저장 버튼 추가
- 신규 localStorage key: `harupuli_saved_readings_v1`
- 기존 localStorage key 변경 없음
- profile 원본 정보 저장 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- expected/referenceStatus 변경 없음
- rewarded ad 구조 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:saved-readings`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 연속 방문 streak 기능 추가

### 작업 내용
- PR 목적: 연속 방문 streak 기능 추가
- `visitStreakStorage` 신규 추가
- `VisitStreakCard` 신규 추가
- App에서 오늘 방문 기록
- HomePage에 streak 카드 표시
- 신규 localStorage key: `harupuli_visit_streak_v1`
- 기존 localStorage key 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- expected/referenceStatus 변경 없음
- rewarded ad 구조 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:visit-streak`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 홈 오늘의 루틴 카드 추가

### 작업 내용
- PR 목적: 홈 화면 오늘의 루틴 카드 추가
- `DailyRoutineCard` 컴포넌트 신규 추가
- HomePage에 오늘의 루틴 카드 표시
- 기존 sajuAnalysis 데이터만 사용
- production 계산 로직 변경 없음
- sajuAnalysis 데이터 구조 변경 없음
- schemaVersion 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- rewarded ad 구조 변경 없음
- storage.js 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 무료/광고 해금 콘텐츠 안내 추가

### 작업 내용
- PR 목적: 무료/광고 해금 콘텐츠 구분 안내 추가
- `ContentAccessNotice` 컴포넌트 신규 추가
- SajuInsightPage에 무료 기본 해석 안내 추가
- SajuInsightPage에 광고 해금 심화 해석 안내 추가
- FortuneDetailPage에 광고 해금 상세 풀이 안내 추가
- 기존 unlock key 유지
- 기존 placementId 유지
- rewarded ad 구조 변경 없음
- storage.js 변경 없음
- 계산 로직 변경 없음
- sajuAnalysis 데이터 구조 변경 없음
- schemaVersion 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 사주 상세 콘텐츠 품질 개선

### 작업 내용
- PR 목적: 사주 상세 페이지 콘텐츠 품질 개선
- SajuInsightPage에 생활 흐름 가이드 섹션 추가
- 관계 흐름, 일/공부 흐름, 돈 관리 흐름, 오늘의 루틴 카드 추가
- 기존 sajuAnalysis 데이터만 사용
- production 계산 로직 변경 없음
- sajuAnalysis 데이터 구조 변경 없음
- schemaVersion 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- rewarded ad 구조 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 rewarded ad SDK readiness 체크리스트 추가

### 작업 내용
- PR 목적: rewarded ad SDK 연동 전 체크리스트 문서 추가
- 신규 문서: `docs/REWARDED_AD_SDK_READINESS.md`
- 실제 광고 SDK 연동 없음
- 외부 광고 라이브러리 설치 없음
- production 코드 변경 없음
- storage.js 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-provider-adapter`: 성공

## 2026-06-10 rewarded ad provider adapter 구조 추가

### 작업 내용
- PR 목적: rewarded ad provider adapter 구조 추가
- mock provider를 `rewardedAdProvider.mock.js`로 분리
- provider/outcome 상수를 `rewardedAdProvider.types.js`로 분리
- `rewardedAdService.js`는 facade 역할로 정리
- 실제 광고 SDK 연동 없음
- 외부 광고 라이브러리 설치 없음
- storage.js 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- 신규 npm script: `check:rewarded-ad-provider-adapter`

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-provider-adapter`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:rewarded-ad-outcomes`: 성공
- `npm run check:rewarded-ad-placements`: 성공
- `npm run check:rewarded-ad-placement-resolver`: 성공
- `npm run check:saju-insight-reward-unlock`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 rewarded ad placement resolver 추가

### 작업 내용
- PR 목적: 환경변수 기반 rewarded ad placement resolver 추가
- `rewardedAdPlacements.js`에 resolver 추가
- `.env.example`에 rewarded ad placement 환경변수 추가
- 실제 광고 SDK 연동 없음
- 외부 광고 라이브러리 설치 없음
- storage.js 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- 신규 npm script: `check:rewarded-ad-placement-resolver`

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-placements`: 성공
- `npm run check:rewarded-ad-placement-resolver`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:rewarded-ad-outcomes`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 rewarded ad placement 설정 구조 추가

### 작업 내용
- PR 목적: rewarded ad placement 설정 구조 추가
- `rewardedAdPlacements.js` 신규 추가
- `AdRewardBox`에 `placementId` prop 추가
- `RewardAdModal`이 `placementId`를 `showRewardedAd`로 전달하도록 보완
- FortuneDetailPage에 `today_fortune_detail` placement 적용
- SajuInsightPage에 `saju_insight_deep_dive` placement 적용
- unlock key와 placementId는 분리 유지
- 실제 광고 SDK 연동 없음
- storage.js 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- 신규 npm script: `check:rewarded-ad-placements`

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-placements`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:rewarded-ad-outcomes`: 성공
- `npm run check:saju-insight-reward-unlock`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 rewarded ad outcome 상태 처리 추가

### 작업 내용
- PR 목적: rewarded ad outcome 상태 처리 추가
- `rewardedAdService`에 `completed`, `load_failed`, `canceled`, `no_reward` 상태 추가
- `RewardAdModal`이 광고 결과 상태별 안내 문구를 표시하도록 보완
- 기본 mock provider 결과는 기존처럼 `completed` 유지
- mock 광고 카운트다운 이후 보상 확인 단계는 `delayMs: 0`으로 처리해 중복 대기 시간 제거
- 실제 광고 SDK 연동 없음
- storage.js production 로직 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- 신규 npm script: `check:rewarded-ad-outcomes`

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:rewarded-ad-outcomes`: 성공
- `npm run check:saju-insight-reward-unlock`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 rewarded ad service abstraction 추가

### 작업 내용
- PR 목적: rewarded ad service abstraction 추가
- `rewardedAdService` 신규 추가
- `RewardAdModal`이 mock provider service를 사용하도록 수정
- 실제 광고 SDK 연동 없음
- storage.js production 로직 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- 신규 npm script: `check:rewarded-ad-service`

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:saju-insight-reward-unlock`: 성공
- `npm run check:late-night-jasi-policy`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 사주 심화 해석 광고 해금 회귀 검증 추가

### 작업 내용
- PR 목적: 사주 심화 해석 광고 해금 상태 회귀 검증 스크립트 추가
- 신규 스크립트: `scripts/checkSajuInsightRewardUnlockRegression.mjs`
- 신규 npm script: `check:saju-insight-reward-unlock`
- production UI 변경 없음
- production 계산 로직 변경 없음
- storage.js production 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:saju-insight-reward-unlock`: 성공
- `npm run check:late-night-jasi-policy`: 성공
- `npm run check:manseryeok-jasi-boundary`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 사주 흐름 심화 해석 광고 해금 추가

### 작업 내용
- PR 목적: 사주 흐름 상세 페이지에 광고 해금 심화 해석 영역 추가
- `SajuInsightPage`에 rewarded unlock key `sajuInsightDeepDive` 추가
- App.jsx에서 `unlockedDetails`와 `onUnlockDetail` 전달
- 기존 storage/saveRewardUnlock 구조 재사용
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음

### 테스트 결과
- `npm run build`: 성공
- SajuInsightPage 잠금/해금 상태 수동 확인 필요
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 사주 흐름 상세 페이지 추가

### 작업 내용
- PR 목적: 사주 흐름 상세 페이지 추가
- `SajuInsightPage` 신규 추가
- `SajuElementSummaryCard`에 상세 페이지 진입 버튼 추가
- HomePage에서 `sajuInsight` 페이지 이동 연결
- App.jsx는 `SajuInsightPage` 라우팅만 추가
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 일반 `/` 접속 후 홈 카드 버튼 및 상세 페이지 표시: 수동 확인 필요
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 홈 화면 사주 오행 요약 카드 추가

### 작업 내용
- PR 목적: 홈 화면 사주 오행 요약 카드 추가
- `SajuElementSummaryCard` 신규 추가
- HomePage에 `fortune.sajuAnalysis` 기반 카드 배치
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 일반 `/` 접속 후 홈 카드 표시: 수동 확인 필요
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 사주 계산 기준 요약 카드 추가

### 작업 내용
- PR 목적: 설정 화면에 사주 계산 기준 요약 카드 추가
- `SajuCalculationBasisCard` 신규 추가
- SettingsPage에 `SajuCalculationBasisCard` 배치
- App.jsx는 SettingsPage로 `fortune` prop 전달만 추가
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- `same_day` / `next_day` 프로필에서 계산 기준 일시 표시 확인 필요

### 테스트 결과
- `npm run build`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지
- 브라우저 SettingsPage 카드 표시: 수동 확인 필요

## 2026-06-09 lateNightJasiPolicy 회귀 검증 스크립트 추가

### 작업 내용
- PR 목적: `lateNightJasiPolicy` 동작 검증 스크립트 추가
- `scripts/checkLateNightJasiPolicyRegression.mjs` 신규 추가
- `npm run check:late-night-jasi-policy` script 추가
- production 계산 로직 변경 없음
- UI 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:late-night-jasi-policy`: 성공
- `npm run check:manseryeok-jasi-boundary`: 성공
- same_day / next_day convertedSolar 차이 확인:
  - `same_day`: `1990-02-03 23:30:00`
  - `next_day`: `1990-02-04 00:30:00`
- profileId 차이 확인:
  - `same_day`: `c9xk6d`
  - `next_day`: `b3kv9b`
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 23시 이후 자시 기준 선택 옵션 추가

### 작업 내용
- PR 목적: 23:00~23:59 출생자의 자시 기준 선택 옵션 추가
- `ProfileForm`에 `lateNightJasiPolicy` 필드를 추가하고 기본값을 `same_day`로 설정
- 23:00~23:59 입력 시 `입력한 날짜 기준` / `다음 날 자시 기준` 선택 UI 표시
- `SettingsPage`에서 저장된 23시 이후 기준 표시
- `next_day` 선택 시 production 만세력 엔진이 23시 이후 출생 시간을 다음 날 00:분 기준으로 계산
- `same_day` 기본값에서는 기존 계산 흐름 유지
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- App.jsx 변경 없음
- fortune schemaVersion을 4에서 5로 증가

### 테스트 결과
- `npm run build`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지
  - `solar_after_ipchun`: pass 유지
  - `solar_regular_known_time`: pass 유지
- 엔진 샘플 확인:
  - `same_day`: `1990-02-03 23:30:00`
  - `next_day`: `1990-02-04 00:30:00`
  - `same_day`와 `next_day`의 profileId가 다르게 생성됨
- 브라우저 온보딩/설정 UI: 수동 확인 필요

## 2026-06-09 23시 이후 출생 안내 UI 추가

### 작업 내용
- PR 목적: 23시 이후 출생 시간 안내 UI 추가
- `ProfileForm`에서 23:00~23:59 입력 시 안내 표시
- `SettingsPage`는 시간 입력 UI가 아니라 저장된 프로필 시간이 23시대일 때 안내 표시
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 일반 `/` 접속 테스트: 브라우저 수동 확인 필요
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 자시 후보와 외부 기준 비교 추가

### 작업 내용
- PR 목적: 자시 경계 후보와 외부 기준값 비교
- `scripts/checkManseryeokJasiBoundaryHypothesis.mjs`에 sky.told.me / posteller 기준값 비교 출력 추가
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:manseryeok-jasi-boundary`: 성공
- 1990-02-03 23:30 비교 결과:
  - sky.told.me는 nextDayCandidate/midnightReference와 일치
  - posteller는 현재 후보 중 완전 일치 없음
  - 세 번째 기준 확인 필요

## 2026-06-09 자시 경계 기준 조사 스크립트 추가

### 작업 내용
- PR 목적: 23시 이후 자시/야자시/조자시 기준 조사
- `scripts/checkManseryeokJasiBoundaryHypothesis.mjs` 신규 추가
- `npm run check:manseryeok-jasi-boundary` 스크립트 추가
- `docs/MANSERYEOK_JASI_POLICY.md` 신규 추가
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:manseryeok-jasi-boundary`: 성공
- `solar_after_23` 1990-02-03 23:30:
  - original/sameDayJasi: 기사 / 정축 / 기해 / 병자
  - nextDayCandidate/midnightReference: 기사 / 정축 / 경자 / 병자
- 내부 validator 기준:
  - `solar_before_ipchun`: referenceStatus `reference_conflict`, comparisonStatus `reference_conflict`, expected null 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 만세력 검증 도구 한글 라벨 복구

### 작업 내용
- PR 목적: 만세력 검증 도구 한글 라벨 복구
- PR #21의 `reference_conflict` 표시 기능은 유지
- 상태, 요약, 입력, expected 안내 문구를 한국어 기준으로 정리
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `/?debug=manseryeok` 한글 라벨은 코드 기준으로 제목/요약/입력/expected 안내 문구 반영 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: referenceStatus `reference_conflict`, comparisonStatus `reference_conflict`, expected null 유지
  - `solar_ipchun_boundary`: pass 유지, mismatchFields 없음

## 2026-06-09 reference_conflict 검증 표시 개선

### 작업 내용
- PR 목적: `reference_conflict` 샘플의 내부 검증 표시 개선
- `expected`가 null인 `reference_conflict` 샘플을 `reference_pending` 대신 `reference_conflict`로 표시
- `solar_before_ipchun`의 `comparisonStatus`가 `reference_conflict`로 표시되도록 개선
- debug 페이지 요약에 conflict 건수 추가
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `/?debug=manseryeok` 내부 validator 기준 확인:
  - `solar_before_ipchun`: referenceStatus `reference_conflict`, comparisonStatus `reference_conflict`, expected null 유지
  - `solar_ipchun_boundary`: pass 유지, mismatchFields 없음
  - `solar_after_ipchun`: pass 유지, mismatchFields 없음
  - `solar_regular_known_time`: pass 유지, mismatchFields 없음

## 2026-06-09 KST/CST 절기 보정 production 반영

### 작업 내용
- PR 목적: KST→CST 절기 경계 보정 production 반영
- PR #19 검증 결과를 바탕으로 년주/월주 exact 계산에 1시간 보정 적용
- 수정 파일: `src/domain/saju/manseryeokEngine.js`, `src/utils/fortuneEngine.js`, 문서 파일
- 일주/시주 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 변경 없음
- schemaVersion 3 → 4 증가
- App.jsx 변경 없음
- 태양시 보정 미적용
- 23시 이후 자시 정책 미변경

### 테스트 결과
- `npm run build`: 성공
- `npm run check:manseryeok-term-timezone`: 성공
- `/?debug=manseryeok` 내부 validator 기준 확인:
  - `solar_ipchun_boundary`: pass, mismatchFields 없음
  - `solar_after_ipchun`: pass 유지, mismatchFields 없음
  - `solar_regular_known_time`: pass 유지, mismatchFields 없음
  - `solar_before_ipchun`: reference_conflict 유지, expected null 유지

## 2026-06-09 KST/CST 절기 경계 보정 가설 검증

### 작업 내용
- PR 목적: KST→CST 절기 경계 보정 가설 검증
- `scripts/checkManseryeokTermTimezoneHypothesis.mjs` 신규 추가
- `npm run check:manseryeok-term-timezone` 스크립트 추가
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:manseryeok-term-timezone`: 성공
- `solar_ipchun_boundary`: KST→CST 보정 후 `기사 / 정축`, hypothesisResult `pass`
- `solar_after_ipchun`: KST→CST 보정 후 `경오 / 무인`, hypothesisResult `pass`
- `solar_regular_known_time`: KST→CST 보정 후 `경오 / 신사`, hypothesisResult `pass`

### 검증 포인트
- `solar_ipchun_boundary`의 1시간 보정 결과가 `기사 / 정축`이 되는지 확인
- `solar_after_ipchun`의 1시간 보정 결과가 `경오 / 무인`으로 유지되는지 확인
- `solar_regular_known_time`이 불필요하게 달라지지 않는지 확인

## 2026-06-09 입춘 절입 시각 조사 문서 추가

### 작업 내용
- PR 목적: `solar_ipchun_boundary` 입춘 절입 시각 조사 문서 추가
- PR #17 결과: `lunar-javascript` exact API 적용 후에도 `pillars.year`, `pillars.month` mismatch 유지
- `docs/MANSERYEOK_IPCHUN_INVESTIGATION.md` 신규 추가
- 입춘 절입 시각 확인 전에는 수동 보정이나 하드코딩을 하지 않는다는 원칙 기록

### 변경하지 않은 항목
- 계산 로직 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음
- expected/referenceStatus 변경 없음

### 다음 작업
- 1990년 입춘 절입 시각 한국 표준시 기준 확인
- sky.told.me와 포스텔러의 태양시 보정 여부 확인
- 세 번째 한국 만세력 기준으로 1990-02-04 10:30 추가 확인

### 테스트 결과
- `npm run build`: 성공
- 참고: Vite chunk size warning은 표시되었으나 빌드는 정상 완료

## 2026-06-09 만세력 입춘 경계 년주/월주 검토

### 작업 내용
- `solar_ipchun_boundary`의 년주/월주 mismatch 원인을 확인했다.
- `lunar-javascript`의 `getYearInGanZhiExact()`와 `getMonthInGanZhiExact()` 계열 API를 우선 사용하는 helper를 엔진에 분리했다.
- exact API 호출 실패 시 기존 `EightChar` 계산값으로 fallback하도록 정리했다.
- `solar_ipchun_boundary`는 exact API에서도 `경오년 무인월`로 계산되어 외부 기준값 `기사년 정축월`과 여전히 불일치한다.
- 샘플별 하드코딩, 수동 절기 테이블, 태양시 보정은 적용하지 않았다.
- 23시 이후 자시/야자시/조자시 정책은 변경하지 않았다.
- localStorage key 변경 없음.
- App.jsx 변경 없음.
- schemaVersion 변경 없음: 실제 pillar 결과가 변경되지 않았고, 캐시 무효화가 필요한 계산 결과 변경은 발생하지 않았다.

### 수정 파일
- `src/domain/saju/manseryeokEngine.js`
- `docs/MANSERYEOK_ENGINE.md`
- `docs/MANSERYEOK_TIME_POLICY.md`
- `CHANGELOG.md`
- `TODO.md`

### 테스트 결과
- `npm run build`: 성공
- `solar_ipchun_boundary`: fail, mismatchFields `pillars.year`, `pillars.month`
- `solar_after_ipchun`: pass 유지, mismatchFields 없음
- `solar_before_ipchun`: `reference_conflict` 유지, expected null 유지
- `solar_regular_known_time`: pass 유지, mismatchFields 없음

### 남은 이슈
- `lunar-javascript` exact API와 sky.told.me / 포스텔러 외부 기준값이 다른 입춘 당일 경계 정책 결정 필요.
- 태양시 보정 적용 여부는 별도 PR에서 검토 필요.
- 23시 이후 자시/야자시/조자시 기준은 별도 정책 결정 필요.

## 현재 상태

- 배포 방식: GitHub 저장소와 Vercel 연동 구조 사용
- 주요 기능: 프로필 입력, 오늘운세, 띠별 운세, 2026운세, 광고 보상 시뮬레이션, AI 상담 화면, 궁합 입력, 더 깊은 풀이 기능 준비 중 화면, 마이 화면
- 현재 브랜치: `docs/manseryeok-time-policy`
- 최근 수정 내용: 계산 엔진 수정 전 시간/입춘/자시/태양시 정책 문서화

## 현재 이슈

- [ ] 확인 필요: Vercel Production URL
- [ ] 확인 필요: Vercel Preview 배포 설정
- [ ] 확인 필요: 모바일 실기기 화면 테스트 결과
- [ ] 확인 필요: 2026운세 광고 해금 개수가 과하게 느껴지지 않는지
- [ ] 확인 필요: 홈 도넛 그래프와 2026 월별 물결 그래프의 모바일 가독성
- [ ] 확인 필요: 학업운 문구가 학생/성인 학습 모두에 자연스럽게 적용되는지
- [ ] 확인 필요: 기존 사용자의 당일 캐시에서 학업운 누락 시 새 운세가 정상 생성되는지
- [ ] 확인 필요: 외부 만세력 기준 샘플과 `lunar-javascript` 계산 결과 비교
- [ ] 확인 필요: 음력/윤달 입력 샘플 검증
- [ ] 확인 필요: Vercel Preview에서 `/?debug=manseryeok` 접근 가능 여부
- [ ] 확인 필요: 외부 만세력 기준값 1차 입력 후 pass/fail 결과
- [ ] 확인 필요: `solar_regular_known_time` 샘플의 출생도시 Seoul, South Korea 및 태양시 보정 여부
- [ ] 확인 필요: `solar_before_ipchun` 기준 충돌 원인
- [ ] 확인 필요: 시간 경계 정책 확정 전 사용자 표시 문구

## 다음 작업

- [ ] 우선순위 1: Vercel Preview에서 띠별 아코디언과 2026 광고 해금 흐름 확인
- [ ] 우선순위 2: 월별 상세 흐름 모바일 스크롤감 확인
- [ ] 우선순위 3: 띠별운세 연도별 문구 반복감 점검
- [ ] 우선순위 4: 광고 해금 포인트가 과하지 않은지 실사용 흐름 점검
- [ ] 우선순위 5: 월별 곡선 그래프 가로 스크롤 UX 확인
- [ ] 우선순위 6: 오늘운세 카테고리 추가 시 캐시 버전 관리 방식 검토
- [ ] 우선순위 7: 만세력 기준 샘플 검증표 작성
- [ ] 우선순위 8: 외부 기준값을 검증 샘플 expected에 입력
- [ ] 우선순위 9: 입춘 전후/23시 전후 샘플 기준값 우선 확인
- [ ] 우선순위 10: `solar_regular_known_time`을 두 번째 외부 만세력 기준으로 교차검증
- [ ] 우선순위 11: `solar_before_ipchun`을 세 번째 기준 만세력으로 추가 확인
- [ ] 우선순위 12: 입춘 경계 엔진 보정 방식 검토

## ChatGPT 검토 요청 포인트

- 기존 기능 삭제 여부
- JS 오류 가능성
- 모바일 반응형 문제
- Vercel 배포 위험
- API / DB / 환경변수 문제
- 띠별 연도 아코디언 UX가 사용하기 쉬운지
- 2026운세 카테고리별/월별 광고 해금이 과하지 않은지
- 홈 도넛 그래프와 2026 월별 물결 그래프가 모바일에서 자연스럽게 읽히는지
- 학업운 카테고리 추가로 오늘운세 탭/홈 요약/광고 해금 흐름이 깨지지 않았는지
- study 없는 기존 오늘운세 캐시가 삭제 없이 재생성되는지
- 만세력 엔진 실패 시 mock fallback으로 앱이 깨지지 않는지
- schemaVersion 도입으로 기존 mock 캐시가 새 fortune으로 갱신되는지
- 내부 debug 페이지가 일반 사용자 메뉴에 노출되지 않는지
- expected가 없는 샘플이 reference_pending으로 표시되는지
- not_applicable 샘플이 calculation_failed와 구분되어 표시되는지

## 작업 로그

### 2026-06-08

#### 작업 내용

- PR 목적: 계산 엔진 수정 전 시간/절기/자시/태양시 정책 문서화
- PR #15 검증 결과를 바탕으로 `docs/MANSERYEOK_TIME_POLICY.md` 작성
- `solar_ipchun_boundary`를 입춘/절기 기준 엔진 보정 우선 후보로 문서화
- `solar_before_ipchun`을 reference_conflict 샘플로 문서화하고 expected를 null로 유지해야 한다는 원칙 정리
- 23시 이후 자시/야자시/조자시 기준과 태양시 보정 여부를 미정 정책으로 명시
- 시간 미상은 시주 미상으로 유지한다는 원칙 정리
- `docs/MANSERYEOK_ENGINE.md`와 `docs/MANSERYEOK_VALIDATION.md`에 시간 정책 문서 참조 추가
- 계산 로직 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음
- 다음 작업은 입춘 경계 엔진 보정 검토

#### 수정 파일

- `docs/MANSERYEOK_TIME_POLICY.md`
- `docs/MANSERYEOK_ENGINE.md`
- `docs/MANSERYEOK_VALIDATION.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함으로 JS chunk가 500kB를 초과함

#### 남은 이슈

- `solar_ipchun_boundary` 년주/월주 mismatch 원인 분석 필요
- 23시 이후 자시/야자시/조자시 정책 결정 필요
- 태양시 보정 적용 여부 결정 필요

### 2026-06-08

#### 작업 내용

- sky.told.me와 포스텔러의 입춘 전후 샘플 비교 결과 반영
- `solar_before_ipchun`은 두 기준이 불일치해 `reference_conflict`로 분류하고 expected 미입력
- `solar_before_ipchun` 충돌 내용 기록: sky.told.me 기사년 정축월 경자일 병자시, 포스텔러 기사년 정축월 기해일 을해시
- `solar_ipchun_boundary`는 두 기준이 기사년 정축월 경자일 신사시로 일치해 `reference_verified` expected 입력
- `solar_after_ipchun`은 두 기준이 경오년 무인월 신축일 무자시로 일치해 `reference_verified` expected 입력
- convertedLunar는 외부 결과에서 명확히 확인되지 않아 입력하지 않음
- 대운, 신살, 자미두수, Natal Chart 값은 검증 범위에서 제외
- localStorage key 구조 변경 없음
- fortune schemaVersion 변경 없음
- 만세력 계산 로직 변경 없음

#### 수정 파일

- `src/domain/saju/manseryeokValidationSamples.js`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함으로 JS chunk가 500kB를 초과함
- `solar_before_ipchun`: referenceStatus `reference_conflict`, expected 미입력
- `solar_ipchun_boundary`: comparisonStatus `fail`, mismatchFields `pillars.year`, `pillars.month`
- `solar_after_ipchun`: comparisonStatus `pass`, mismatchFields 없음

#### 남은 이슈

- 23시 이후 자시/야자시/조자시 기준 정책 결정 필요
- 태양시 보정 여부 확인 필요
- `solar_before_ipchun`을 세 번째 기준 만세력으로 추가 확인 필요

### 2026-06-08

#### 작업 내용

- sky.told.me에서 수동 확인한 `solar_regular_known_time` 사주팔자 기준값 1차 입력
- profile gender를 sky.told.me 입력 기준에 맞춰 `male`로 변경
- expected에는 년주, 월주, 일주, 시주, 일간, convertedSolar만 입력
- convertedLunar는 외부 결과에서 명확히 확인되지 않아 입력하지 않음
- referenceSource에 `sky.told.me`, 수동 확인일, 출생도시 Seoul, South Korea 입력 기준을 기록
- 대운, 신살, 자미두수, Natal Chart 값은 검증 범위에서 제외
- 만세력 계산 로직 변경 없음
- localStorage key 구조 변경 없음
- fortune schemaVersion 변경 없음

#### 수정 파일

- `src/domain/saju/manseryeokValidationSamples.js`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함으로 JS chunk가 500kB를 초과함
- validator 실행 결과: `solar_regular_known_time` comparisonStatus `pass`
- mismatchFields 없음

#### 남은 이슈

- 같은 샘플을 두 번째 외부 만세력 기준으로 교차검증 필요
- 출생도시 입력값 재확인 필요
- 태양시 보정 여부 확인 필요

### 2026-06-08

#### 작업 내용

- 만세력 검증 샘플의 expected/referenceSource 권장 구조를 문서화
- referenceStatus 허용값을 `reference_pending`, `reference_verified`, `reference_conflict`, `not_applicable`로 정리
- 입춘 전 샘플 `solar_before_ipchun` 추가
- 입춘 후 샘플 `solar_after_ipchun` 추가
- 23시 직전 샘플 `solar_before_23` 추가
- 기존 23시 이후 샘플은 유지
- 잘못된 시간/날짜 입력 샘플은 referenceStatus를 `not_applicable`로 변경
- validator summary에 `notApplicable` 카운트 추가
- debug 페이지에 referenceStatus와 referenceSource 표시 추가
- expected 값은 외부 기준값 없이 임의 입력하지 않음
- localStorage key 구조 변경 없음
- fortune schemaVersion 변경 없음
- 만세력 계산 로직 `calculateManseryeok` 변경 없음

#### 수정 파일

- `src/domain/saju/manseryeokValidationSamples.js`
- `src/domain/saju/manseryeokValidator.js`
- `src/pages/ManseryeokValidationPage.jsx`
- `docs/MANSERYEOK_VALIDATION.md`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함으로 JS chunk가 500kB를 초과함
- validator 실행 결과: 전체 11개, 기준값 대기 9개, 비교 대상 아님 2개

#### 남은 이슈

- 실제 외부 만세력 기준값 1차 입력 필요
- 입춘 전후 기준값 확인 필요
- 23시 전후 기준값 확인 필요
- 음력/윤달 기준값 확인 필요

### 2026-06-08

#### 작업 내용

- 만세력 검증 샘플 데이터 구조 추가
- 양력 일반, 시간 미상, 23시 이후, 입춘 전후, 음력 일반, 음력 윤달 후보, 잘못된 시간, 잘못된 날짜 샘플 추가
- `calculateManseryeok` 결과를 샘플별로 수집하는 validator 추가
- expected가 없는 샘플은 `reference_pending`으로 표시하도록 구성
- 계산 실패 샘플은 전체 검증을 중단하지 않고 `calculation_failed` 결과로 표시
- `/?debug=manseryeok` 전용 내부 검증 페이지 추가
- 일반 하단 네비게이션에는 검증 페이지를 노출하지 않음
- debug 페이지에서는 `saveFortune`, `saveProfile`, `saveRewardUnlock`을 호출하지 않음
- localStorage key 구조 변경 없음
- schemaVersion 값 변경 없음

#### 수정 파일

- `src/domain/saju/manseryeokValidationSamples.js`
- `src/domain/saju/manseryeokValidator.js`
- `src/pages/ManseryeokValidationPage.jsx`
- `docs/MANSERYEOK_VALIDATION.md`
- `src/App.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함으로 JS chunk가 500kB를 초과함
- validator 실행 결과: 전체 8개, 기준값 대기 6개, 계산 실패 2개

#### 남은 이슈

- 외부 만세력 기준값 입력 필요
- Vercel Preview에서 `/?debug=manseryeok` 접근 확인 필요
- 브라우저에서 잘못된 날짜/시간 샘플의 `calculation_failed` 표시 확인 필요

### 2026-06-08

#### 작업 내용

- `lunar-javascript` 패키지 설치 및 실제 `Solar`, `Lunar`, `EightChar` API 확인
- 만세력 기반 년주, 월주, 일주, 시주 계산 adapter 추가
- 한자 천간/지지를 한글 천간/지지로 변환하는 사주 상수 추가
- 천간/지지 겉오행 기준 오행 분포 분석기 추가
- `createSajuAnalysis`가 만세력 계산 성공 시 실제 사주팔자/오행 분석 기반 결과를 반환하도록 연결
- 시간 미상 사용자는 내부 계산에 12:00을 사용하되 결과의 시주는 `시주 미상`으로 처리
- 음력/윤달 입력은 `lunar-javascript` 지원 범위에서 처리하고 실패 시 mock fallback 유지
- fortune `schemaVersion` 도입 및 App 캐시 유효성 검사에 schemaVersion 확인 추가
- localStorage key 구조 변경 없음
- 기존 캐시 데이터 일괄 삭제 없음
- 대운, 신강신약, 용신, 세운, 월운 고도화 구현 없음

#### 외부 라이브러리

- `lunar-javascript@1.7.7`
- 사용 이유: 양력/음력 변환과 EightChar 기반 사주팔자 계산을 직접 임의 구현하지 않기 위함
- 정확도 상태: 외부 만세력 기준 샘플 검증 필요

#### 수정 파일

- `src/domain/saju/sajuConstants.js`
- `src/domain/saju/manseryeokEngine.js`
- `src/domain/saju/elementAnalyzer.js`
- `src/domain/saju/createSajuAnalysis.js`
- `src/utils/fortuneEngine.js`
- `src/App.jsx`
- `docs/MANSERYEOK_ENGINE.md`
- `package.json`
- `package-lock.json`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함 후 JS chunk가 500kB를 초과함
- 양력 샘플에서 `engineStatus: manseryeok_core_v0` 확인
- `birthTimeUnknown=true` 샘플에서 시주가 `시주 미상`으로 처리되는지 확인
- 지원되지 않는 음력 윤달 샘플에서 mock fallback 확인
- 새 fortune에 `schemaVersion: 3` 포함 확인

#### 남은 이슈

- 외부 만세력 기준 샘플 비교 필요
- 절기 경계 출생자 검증 필요
- 23시 이후 자시 기준 정책 검토 필요
- 음력/윤달 입력 샘플 추가 검증 필요

### 2026-06-08

#### 작업 내용

- 오늘운세 캐시 유효성 검사에 필수 카테고리 목록 확인 추가
- `study` 카테고리가 없는 기존 당일 캐시는 유효하지 않은 것으로 판단해 `createTodayFortune`으로 새 운세 생성
- 새로 생성된 운세는 기존 `saveFortune` 흐름으로 덮어쓰기
- localStorage key 구조 변경 없음
- 기존 캐시 데이터 일괄 삭제 없음
- 광고 해금 저장 구조 변경 없음

#### 수정 파일

- `src/App.jsx`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 study 없는 기존 캐시를 넣은 뒤 새 운세가 생성되는지 확인 필요
- 브라우저에서 study 포함 캐시가 같은 날짜/같은 프로필에서 재사용되는지 확인 필요

### 2026-06-08

#### 작업 내용

- 2026 월별운세흐름 그래프를 넓은 SVG와 cubic bezier 곡선형 path로 개선
- 모바일에서 월별 점수와 라벨이 겹치지 않도록 가로 스크롤 구조 적용
- 광고 mock 해금 시간을 개발/테스트용으로 2초로 단축
- 오늘운세 카테고리에 학업운 추가
- 학업운 상세풀이 템플릿에 공부, 시험 준비, 자격증, 업무 학습, 자료 이해, 메모/복습 조언 반영
- 학업운 문구 기준을 콘텐츠 스타일 가이드에 추가
- localStorage key 구조 변경 없음
- 실제 광고 SDK, AI API, DB, 결제 연동 없음

#### 수정 파일

- `src/components/MonthlyWaveChart.jsx`
- `src/components/RewardAdModal.jsx`
- `src/data/fortuneTemplates.js`
- `src/pages/HomePage.jsx`
- `src/styles.css`
- `docs/CONTENT_STYLE_GUIDE.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 월별 곡선 그래프의 가로 스크롤 UX 확인 필요
- 브라우저에서 광고 mock 모달이 약 2초 후 완료되는지 확인 필요
- 브라우저에서 학업운 탭/요약/상세 광고 해금 흐름 확인 필요

### 2026-06-08

#### 작업 내용

- 홈 화면 오늘의 점수를 SVG 도넛 그래프로 시각화
- 띠별운세 연도별 아코디언에서 오늘의 조언을 광고 mock 모달 해금 후 표시하도록 변경
- 띠별운세의 키워드/색상/아이템 표시 제거
- 2026운세 재물운, 연애운, 직장운, 건강운 카테고리의 광고 박스 상시 노출을 제거하고 상세보기 클릭형 광고 UX로 변경
- 2026 월별 상세 흐름 해금 후 1월~12월 점수 물결 그래프 표시
- localStorage key 구조 변경 없음
- 실제 광고 SDK, AI API, DB, 결제 연동 없음

#### 수정 파일

- `src/components/ScoreDonut.jsx`
- `src/components/MonthlyWaveChart.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/ZodiacFortunePage.jsx`
- `src/pages/YearFortunePage.jsx`
- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 홈 도넛 그래프 중앙 점수와 `fortune.averageScore` 일치 여부 확인 필요
- 브라우저에서 띠별운세 오늘의 조언 광고 해금 흐름 확인 필요
- 브라우저에서 2026 상세보기 클릭형 광고 UX와 월별 물결 그래프 확인 필요

### 2026-06-08

#### 작업 내용

- 띠별 운세 화면을 연도 select 중심에서 12지 선택/연도별 아코디언 구조로 개선
- 선택한 띠에 해당하는 1948~2019년 사이 연도만 표시
- 여러 연도 아코디언을 동시에 열 수 있도록 구성
- 2026운세 재물운, 연애운, 직장운, 건강운에 광고 해금 상세 풀이 추가
- 2026 월별 상세 흐름을 광고 1회로 전체 해금하는 구조 추가
- localStorage key 구조 변경 없음
- 실제 광고 SDK, AI API, DB, 결제 연동 없음

#### 수정 파일

- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/pages/ZodiacFortunePage.jsx`
- `src/data/yearFortuneTemplates.js`
- `src/domain/fortune/yearFortuneEngine.js`
- `src/pages/YearFortunePage.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- 1948년 쥐띠, 2019년 돼지띠 기준 확인
- 토끼띠 연도 목록이 1951, 1963, 1975, 1987, 1999, 2011년으로 표시되는지 데이터 확인
- 2026 카테고리별 detail과 월별 detail 생성 확인

#### 남은 이슈

- 브라우저에서 토끼띠 연도 목록과 여러 아코디언 동시 열림 확인 필요
- 2026 카테고리별/월별 광고 해금 UX 확인 필요

### 2026-06-08

#### 작업 내용

- 하단 네비게이션에 띠별 운세 탭 추가
- 띠별 운세 페이지 추가
- 1948~2019년생 띠별 운세 선택 기능 추가
- 홈 화면을 오늘운세 요약 중심으로 재구성
- 홈 화면에서 2026 추천 영역 제거
- 2026운세는 하단 탭에서 접근하도록 정리
- 기능 저장 구조/localStorage key 변경 없음

#### 수정 파일

- `src/App.jsx`
- `src/components/BottomNav.jsx`
- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/pages/ZodiacFortunePage.jsx`
- `src/pages/HomePage.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 모바일에서 6개 하단 탭 간격 확인 필요

### 2026-06-01

#### 작업 내용

- 광고 해금 상세풀이 길이와 구조 개선
- 카테고리별 상세풀이 템플릿 확장
- `category.detail` 표시 방식을 문단 단위로 개선
- 기능 로직/저장 구조 변경 없음
- localStorage key 구조 변경 없음
- 광고 해금 흐름 변경 없음

#### 수정 파일

- `src/data/fortuneTemplates.js`
- `src/utils/fortuneEngine.js`
- `src/pages/FortuneDetailPage.jsx`
- `docs/CONTENT_STYLE_GUIDE.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 광고 해금 후 상세풀이 문단 표시 확인 필요
