# CHANGELOG

## 2026-06-13 Android Debug Build CI

### Added
- GitHub Actions Android debug build workflow 추가
- Android debug build workflow 검증 스크립트 추가
- debug APK artifact 업로드 설정 추가

### Changed
- Android packaging, Capacitor readiness, 앱 패키징 전략 문서에 debug build CI 확인 흐름 반영

## 2026-06-13 Android Debug Build Retry

### Added
- Android Java/JDK 환경 확인 스크립트 추가
- Android debug build 성공 검증 스크립트 추가

### Changed
- Android build 확인 문서에 JDK/JAVA_HOME 확인 및 debug build 재시도 결과 반영
- Android packaging, Capacitor readiness 문서에 debug build 재시도 상태 반영

## 2026-06-13 Android Debug Build Check

### Added
- Android debug build 확인 문서 추가
- Android debug build readiness 검증 스크립트 추가

### Changed
- Android packaging, Capacitor readiness, 앱 패키징 전략 문서에 Android debug build 확인 상태 반영

## 2026-06-13 Android Platform Scaffold

### Added
- `@capacitor/android` 추가
- Capacitor Android 프로젝트 scaffold 추가
- Android platform scaffold 검증 스크립트 추가

### Changed
- 기존 readiness/check 스크립트를 Android 플랫폼 및 android 폴더 허용 기준으로 조정
- Capacitor readiness, Android packaging, 앱 패키징 전략, 앱 리소스 문서에 Android 플랫폼 scaffold 상태 반영

## 2026-06-13 Capacitor Base Config

### Added
- Capacitor core/cli 기본 의존성 추가
- `capacitor.config.json` 기본 설정 추가
- Capacitor base config 검증 스크립트 추가

### Changed
- 기존 readiness/check 스크립트를 Capacitor core/cli 허용, Android/iOS 플랫폼 미추가 기준으로 조정
- Capacitor readiness, Android packaging, 앱 패키징 전략, 앱 리소스 문서에 Capacitor base config 상태 반영

## 2026-06-13 Generated Android Adaptive Icons

### Added
- Android adaptive icon foreground/background PNG 생성
- Android adaptive icon PNG 생성 스크립트 추가
- Android adaptive icon PNG 검증 스크립트 추가

### Changed
- Android 패키징, 앱 리소스, 앱 아이콘 PNG, Capacitor readiness 문서에 adaptive icon PNG 생성 상태 반영

## 2026-06-13 Android Adaptive Icon Readiness

### Added
- Android adaptive icon 준비 문서 추가
- Android adaptive icon target manifest 추가
- Android adaptive icon readiness 검증 스크립트 추가

### Changed
- Android 패키징, 앱 리소스, 앱 아이콘 PNG, Capacitor readiness 문서에 adaptive icon 준비 기준 연결

## 2026-06-12 Generated Splash PNGs

### Added
- splash PNG 세트 생성
- splash PNG 생성 스크립트 추가
- splash PNG 검증 스크립트 추가

### Changed
- 앱 리소스, Android 패키징, Capacitor readiness 문서에 splash PNG 생성 상태 반영

## 2026-06-12 Generated App Icon PNGs

### Added
- 앱 아이콘 PNG 세트 생성
- 앱 아이콘 PNG 생성 스크립트 추가
- 앱 아이콘 PNG 검증 스크립트 추가

### Changed
- PWA manifest에 192x192, 512x512 PNG 아이콘 추가
- 앱 리소스, Android 패키징, PWA 문서에 앱 아이콘 PNG 생성 상태 반영

## 2026-06-12 Splash PNG Export Readiness

### Added
- splash PNG export 준비 문서 추가
- splash PNG target manifest 추가
- splash PNG export readiness 검증 스크립트 추가

### Changed
- 앱 리소스, Android 패키징, Capacitor readiness, PWA 문서에 splash PNG 출력 기준 연결

## 2026-06-12 App Icon PNG Export Readiness

### Added
- 앱 아이콘 PNG export 준비 문서 추가
- 앱 아이콘 PNG target manifest 추가
- 앱 아이콘 PNG export readiness 검증 스크립트 추가

### Changed
- 앱 리소스, Android 패키징, PWA 문서에 앱 아이콘 PNG 출력 기준 연결

## 2026-06-12 Android Packaging Readiness

### Added
- Android 우선 패키징 준비 문서 추가
- Android packaging readiness 검증 스크립트 추가

### Changed
- Capacitor readiness, 앱화 방식, 앱 리소스, 모바일 UX 문서에 Android 패키징 전 확인 기준 연결

## 2026-06-12 Capacitor Readiness

### Added
- Capacitor 도입 준비 문서 추가
- Capacitor readiness 검증 스크립트 추가

### Changed
- 앱화 방식, PWA, 앱 리소스, 모바일 UX 문서에 Capacitor 도입 전 확인 기준 연결

## [Unreleased]

### Added

- 앱화 방식 결정 문서 추가

- 앱 아이콘 master SVG 추가
- 스플래시 master SVG 추가
- 앱 리소스 준비 문서 및 검증 스크립트 추가

- PWA manifest 추가
- 기본 앱 아이콘 SVG 추가
- maskable 앱 아이콘 SVG 추가
- PWA readiness 문서 및 검증 스크립트 추가

- 모바일 UX QA 문서 추가
- rewarded ad placement readiness 문서 추가
- rewarded ad placement readiness 회귀 검증 스크립트 추가

- rewarded ad 호출 전 ads consent gate 추가
- `ads_consent_required` outcome/message 추가
- rewarded ad consent gate 회귀 검증 스크립트 추가
- rewarded ad SDK provider adapter scaffold 추가
- rewarded ad provider 선택 config 추가
- rewarded ad SDK adapter 회귀 검증 스크립트 추가
- 실제 rewarded ad SDK 연동 전 검토 문서 추가
- 동의 배너 UI 추가
- 데이터 사용 설정 패널 추가
- consent banner state 회귀 검증 스크립트 추가
- consent preferences 저장 유틸 추가
- consent storage 회귀 검증 스크립트 추가
- `check:consent-storage` npm script 추가
- 동의 배너 UI 구현 전 설계 문서 추가

- 앱 안 개인정보 안내 페이지 추가
- 홈/설정 화면에서 개인정보 안내 페이지 진입 추가
- 쿠키/광고 동의 UX 검토 문서 추가
- 개인정보 처리방침 초안 문서 추가
- 개인정보 데이터 맵 문서 추가
- 운세 콘텐츠 위험 표현 회귀 검증 스크립트 추가
- content safety 자동 검증 npm script 추가
- 운세 콘텐츠 공통 안전 문구 컴포넌트
- `CONTENT_SAFETY` 문서

- 공유용 텍스트 복사 기능
- 오늘운세 상세 공유 복사 버튼
- 사주 흐름 공유 복사 버튼
- 저장한 풀이 공유 복사 버튼
- share text 회귀 검증 스크립트
- `SHARE_READING` 문서
- 풀이 저장 기능
- 저장한 풀이 목록 페이지
- 홈 화면 저장한 풀이 요약 카드
- saved readings 회귀 검증 스크립트
- `SAVED_READINGS` 문서
- 홈 화면 연속 방문 streak 카드
- localStorage 기반 오늘 운세 확인 기록
- visit streak 회귀 검증 스크립트
- `VISIT_STREAK` 문서
- 홈 화면의 오늘의 작은 루틴 카드
- 오전, 오후, 저녁 루틴 가이드
- 무료 기본 해석과 광고 해금 심화 해석을 구분하는 안내 컴포넌트
- 사주 흐름 상세 페이지와 오늘운세 상세 페이지의 콘텐츠 접근 안내
- 사주 흐름 상세 페이지의 생활 흐름 가이드 섹션
- 관계 흐름, 일/공부 흐름, 돈 관리 흐름, 오늘의 루틴 카드
- 실제 광고 SDK 연동 전 체크리스트 문서
- rewarded ad provider adapter 구조
- mock rewarded ad provider adapter
- rewarded ad provider adapter 회귀 검증 스크립트
- 환경변수 기반 rewarded ad placement resolver
- rewarded ad placement resolver 회귀 검증 스크립트
- `.env.example`의 rewarded ad placement 환경변수 예시
- 보상형 광고 placementId 설정 파일
- rewarded ad placement 설정 회귀 검증 스크립트
- 보상형 광고 mock outcome 상태 처리
- rewarded ad outcome 회귀 검증 스크립트
- 보상형 광고 provider 추상화 서비스
- rewarded ad service 회귀 검증 스크립트
- 보상형 광고 SDK 연동 준비 문서
- 사주 심화 해석 광고 해금 상태 검증 스크립트
- 사주 흐름 상세 페이지의 광고 시청 후 열람 가능한 심화 해석 영역
- 사주 흐름 상세 페이지
- 홈 화면 사주 요약 카드에서 상세 페이지로 이동하는 버튼
- 홈 화면의 사주 오행 요약 카드
- 설정 화면의 사주 계산 기준 요약 카드
- `lateNightJasiPolicy` 동작 확인을 위한 회귀 검증 스크립트
- 23시 이후 출생자용 자시 기준 선택 옵션

- 23시 이후 출생 시간 입력 시 자시 기준 차이 안내 문구 추가
- 자시 경계 후보와 외부 기준값 비교 출력 추가
- 23시 이후 자시/야자시/조자시 기준 조사 문서 추가
- 23시 경계 후보 비교 스크립트 추가
- KST→CST 절기 경계 보정 가설 검증 스크립트 추가
- 입춘 절입 시각 기준 조사 문서 추가

- 프로젝트 운영 문서 구조
- Codex 작업 규칙 문서
- GitHub PR 기반 개발 흐름 문서
- Vercel 배포 체크리스트
- 브랜드 가이드 문서
- 콘텐츠 스타일 가이드 문서
- 광고 해금 상세풀이 확장 템플릿
- 띠별 운세 페이지
- 1948~2019년생 띠별 운세 선택 기능
- 홈 화면 오늘운세 요약 섹션
- 띠별 운세 12지 선택 UI
- 띠별 연도별 아코디언 해설
- 2026운세 카테고리별 광고 해금 상세 풀이
- 2026 월별 상세 흐름 광고 해금
- 홈 화면 오늘의 점수 도넛 그래프
- 2026 월별 점수 물결 그래프
- 띠별운세 오늘의 조언 광고 해금
- 오늘운세 학업운 카테고리
- 2026 월별운세흐름 곡선형 그래프 개선
- 만세력 기반 사주팔자 계산 엔진 v0
- 오행 분포 분석기
- fortune schemaVersion 캐시 무효화 구조
- 내부용 만세력 검증 도구
- 만세력 검증 샘플 데이터 구조
- 외부 기준값 비교용 validation 문서
- 만세력 검증 expected/referenceSource 입력 구조 보강
- 입춘 전후 및 23시 전후 검증 샘플 보강
- `solar_regular_known_time` 샘플의 sky.told.me 기준 expected 1차 입력
- 입춘 경계 및 입춘 후 샘플의 외부 만세력 기준값 입력
- 만세력 시간 경계 및 입춘/자시/태양시 정책 문서 추가

### Changed

- PWA readiness, 앱 리소스 준비, 모바일 UX QA 문서에 앱화 방식 결정 기준 연결

- PWA readiness 문서와 모바일 UX QA 문서에 앱 아이콘/스플래시 준비 기준 연결

- `index.html`에 manifest와 theme-color 메타데이터 연결

- 앱 패키징 전 모바일 화면에서 동의 배너, 설정 패널, 광고 모달, 저장한 풀이, 개인정보 안내 페이지의 가독성과 터치 사용성을 보완
- 광고 SDK readiness 문서에 provider placement ID 환경변수 적용 기준 보완

- SDK provider scaffold 호출 시 ads consent가 없으면 실제 광고 호출 대신 데이터 사용 설정 안내를 반환하도록 준비
- rewarded ad service가 provider loader를 통해 mock/sdk scaffold를 선택할 수 있도록 준비
- 광고 SDK readiness, 쿠키/광고 동의 UX, 동의 배너 UI 계획, 개인정보 데이터 맵에 rewarded ad SDK 연동 검토 기준 보완
- SettingsPage와 PrivacyInfoPage에서 동의 상태를 확인하고 관리할 수 있도록 보완
- 동의 배너 UI 계획, 쿠키/광고 동의 UX, 개인정보 데이터 맵, 개인정보 처리방침 초안에 consent storage 준비 상태 반영
- 쿠키/광고 동의 UX 문서, 개인정보 처리방침 초안, 개인정보 데이터 맵에 동의 배너 UI 계획 문서 연결

- 사용자가 현재 MVP의 브라우저 저장 정보와 외부 전송 여부를 앱 안에서 확인할 수 있도록 보완
- 개인정보 처리방침 초안, 개인정보 데이터 맵, 광고 SDK readiness 문서에 동의 UX 검토 항목 보완
- 저장한 풀이, 방문 streak, 광고 SDK readiness 문서에 개인정보 관련 원칙 보완
- 콘텐츠 안전 정책 문서에 자동 검증 기준 추가
- 오늘운세, 사주 흐름, 저장한 풀이 화면의 참고용 해석 안내를 일관되게 보완

- 저장한 풀이와 주요 해석을 외부 메신저에 붙여넣기 쉽도록 UI 보완
- 오늘운세 상세와 사주 흐름 해석을 나중에 다시 볼 수 있도록 UI 보완
- 홈 화면에서 오늘의 운세 확인 습관을 가볍게 확인할 수 있도록 보완
- 홈 화면에서 오늘 실천할 수 있는 사주 흐름 가이드를 더 쉽게 확인하도록 보완
- 광고 해금 콘텐츠가 선택형 심화 해석임을 사용자에게 더 명확히 안내하도록 UI 보완
- 사주 상세 페이지의 무료 기본 해석을 일상 적용 중심으로 보완
- 보상형 광고 연동 문서에 SDK readiness 문서 링크 추가
- `rewardedAdService`가 provider adapter를 호출하는 facade 구조로 정리
- 실제 광고 SDK 연동 시 placementId를 환경변수로 주입할 수 있도록 구조 보완
- 오늘운세 상세 풀이와 사주 심화 해석 광고 영역이 명시적 placementId를 사용하도록 보완
- `RewardAdModal`이 광고 로딩 실패, 사용자 중단, 보상 미지급 상태를 구분해 안내하도록 보완
- mock 광고 완료 후 중복 대기 시간을 줄이도록 보상 확인 흐름 보완
- `RewardAdModal`이 mock rewarded ad provider를 통해 보상 완료를 처리하도록 구조 보완
- rewarded unlock 저장 구조가 사주 심화 해석 key에도 적용되는지 회귀 검증 기준 추가
- 사주 상세 콘텐츠를 무료 기본 해석과 광고 해금 심화 해석으로 구분
- 사용자가 사주 오행, 성향 키워드, 보완 포인트, 활용 키워드를 상세히 확인할 수 있도록 UI 보완
- 오늘운세 홈에서 사주 원국 기반의 중심 기운, 보완 기운, 활용 키워드를 확인할 수 있도록 UI 보완
- 23시 이후 기준 선택값과 계산 기준 일시를 사용자가 확인할 수 있도록 설정 화면 보완
- 23시 이후 자시 기준 선택 정책 문서에 회귀 검증 기준 추가
- 프로필 ID에 `lateNightJasiPolicy`를 포함하고 fortune schemaVersion을 4에서 5로 증가
- `next_day` 선택 시 23시 이후 출생 시간을 다음 날 자시 기준으로 계산하도록 만세력 엔진 보완

- 23시 이후 기준 확정 전까지 사용자에게 참고 안내를 제공하도록 온보딩 UI 보완
- 자시 경계 정책 문서에 sky.told.me / 포스텔러 비교 결과 추가
- 만세력 시간 정책 문서에 23시 이후 기준 후보 정리
- 만세력 검증 도구의 상태/요약/입력 라벨을 한국어 기준으로 정리
- 만세력 검증 도구에서 reference_conflict 샘플의 comparisonStatus 표시 개선
- 만세력 엔진의 년주/월주 exact 계산에 KST→CST 1시간 보정 적용
- fortune schemaVersion을 3에서 4로 증가

- 입춘 경계 mismatch 원인 후보에 시간대 기준 차이를 추가
- `solar_ipchun_boundary`를 즉시 엔진 보정 대상이 아니라 추가 조사 대상으로 문서화

- 만세력 엔진의 년주/월주 계산 경로를 `lunar-javascript` exact 절기 API 우선 사용 구조로 명시
- `solar_ipchun_boundary`는 exact API만으로 외부 기준 mismatch가 해소되지 않아 추가 정책 검토 대상으로 문서화

- README를 프로젝트 운영 기준에 맞게 보완
- `.gitignore` 배포/환경 파일 제외 항목 보강
- README에 하루풀이 브랜드 컨셉 반영
- 주요 화면 문구를 브랜드 톤에 맞게 정리
- 오늘운세 상세풀이를 8~12문장 수준의 조언형 콘텐츠로 개선
- 상세풀이 문단 표시 방식 개선
- 홈 화면에서 2026 추천 영역 제거
- 하단 네비게이션에 띠별 탭 추가
- 띠별운세 화면을 연도 select 중심에서 12지/연도 아코디언 구조로 개선
- 2026운세 상세 콘텐츠를 광고 해금 구조로 정리
- 2026운세 카테고리 상세풀이를 광고 박스 상시 노출에서 상세보기 클릭형 광고 해금으로 변경
- 띠별운세에서 키워드/색상/아이템 표시 제거
- 광고 mock 해금 시간을 2초로 단축
- 월별운세흐름 그래프를 모바일에서 읽기 쉬운 곡선형/가로 스크롤 구조로 개선
- `createSajuAnalysis`가 만세력 엔진 성공 시 실제 사주팔자 기반 데이터를 사용하도록 변경
- 만세력 검증 페이지에 referenceStatus와 not_applicable 상태 표시 보강
- 1990-02-03 23:30 샘플을 reference_conflict로 분류
- 만세력 검증 문서에 reference_conflict 처리 원칙 보강

### Fixed

- PR #21 이후 일부 debug 화면 문구가 영어로 표시되던 부분 복구
- expected가 없는 reference_conflict 샘플이 reference_pending처럼 보일 수 있는 혼동 수정
- KST 입력 기준의 입춘/절기 경계에서 년주/월주 계산이 외부 기준값과 맞도록 보정

- 입춘/절기 경계의 년주/월주 계산 경로에 exact API fallback 구조 추가

- 기존 localStorage 오늘운세 캐시에 학업운이 없는 경우 새 운세를 생성하도록 캐시 유효성 검사 보완
- 기존 mock 캐시가 만세력 엔진 적용 후에도 계속 재사용되지 않도록 schemaVersion 검사 추가

### Removed

-

## 2026-06-08

### Added

- 만세력 검증 expected/referenceSource 입력 구조 보강
- 입춘 전후 및 23시 전후 검증 샘플 보강

### Changed

- 만세력 검증 페이지에 referenceStatus와 not_applicable 상태 표시 보강

### Files

- `src/domain/saju/manseryeokValidationSamples.js`
- `src/domain/saju/manseryeokValidator.js`
- `src/pages/ManseryeokValidationPage.jsx`
- `docs/MANSERYEOK_VALIDATION.md`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

### Deployed

- 확인 필요

## 2026-06-08

### Added

- 내부용 만세력 검증 도구
- 만세력 검증 샘플 데이터 구조
- 외부 기준값 비교용 validation 문서

### Files

- `src/domain/saju/manseryeokValidationSamples.js`
- `src/domain/saju/manseryeokValidator.js`
- `src/pages/ManseryeokValidationPage.jsx`
- `docs/MANSERYEOK_VALIDATION.md`
- `src/App.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

### Deployed

- 확인 필요

## 2026-06-08

### Added

- 만세력 기반 사주팔자 계산 엔진 v0
- 오행 분포 분석기
- fortune schemaVersion 캐시 무효화 구조
- 만세력 엔진 범위와 검증 필요 사항 문서

### Changed

- `createSajuAnalysis`가 만세력 엔진 성공 시 실제 사주팔자 기반 데이터를 사용하도록 변경

### Fixed

- 기존 mock 캐시가 만세력 엔진 적용 후에도 계속 재사용되지 않도록 schemaVersion 검사 추가

### Files

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

### Deployed

- 확인 필요

## 2026-06-08

### Fixed

- 기존 localStorage 오늘운세 캐시에 학업운이 없는 경우 새 운세를 생성하도록 캐시 유효성 검사 보완

### Files

- `src/App.jsx`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

### Deployed

- 확인 필요

## 2026-06-08

### Added

- 오늘운세 학업운 카테고리
- 2026 월별운세흐름 곡선형 그래프 개선

### Changed

- 광고 mock 해금 시간을 2초로 단축
- 월별운세흐름 그래프를 모바일에서 읽기 쉬운 곡선형/가로 스크롤 구조로 개선

### Files

- `src/components/MonthlyWaveChart.jsx`
- `src/components/RewardAdModal.jsx`
- `src/data/fortuneTemplates.js`
- `src/pages/HomePage.jsx`
- `src/styles.css`
- `docs/CONTENT_STYLE_GUIDE.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

### Deployed

- 확인 필요

## 2026-06-08

### Added

- 홈 화면 오늘의 점수 도넛 그래프
- 2026 월별 점수 물결 그래프
- 띠별운세 오늘의 조언 광고 해금

### Changed

- 2026운세 카테고리 상세풀이를 광고 박스 상시 노출에서 상세보기 클릭형 광고 해금으로 변경
- 띠별운세에서 키워드/색상/아이템 표시 제거

### Files

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

### Deployed

- 확인 필요

## 2026-06-08

### Added

- 띠별 운세 12지 선택 UI
- 띠별 연도별 아코디언 해설
- 2026운세 카테고리별 광고 해금 상세 풀이
- 2026 월별 상세 흐름 광고 해금

### Changed

- 띠별운세 화면을 연도 select 중심에서 12지/연도 아코디언 구조로 개선
- 2026운세 상세 콘텐츠를 광고 해금 구조로 정리

### Files

- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/pages/ZodiacFortunePage.jsx`
- `src/data/yearFortuneTemplates.js`
- `src/domain/fortune/yearFortuneEngine.js`
- `src/pages/YearFortunePage.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

### Deployed

- 확인 필요

## 2026-06-08

### Added

- 띠별 운세 페이지
- 1948~2019년생 띠별 운세 선택 기능
- 홈 화면 오늘운세 요약 섹션

### Changed

- 홈 화면에서 2026 추천 영역 제거
- 홈 화면을 오늘운세 요약 중심으로 재구성
- 하단 네비게이션에 띠별 탭 추가

### Files

- `src/App.jsx`
- `src/components/BottomNav.jsx`
- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/pages/ZodiacFortunePage.jsx`
- `src/pages/HomePage.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

### Deployed

- 확인 필요
