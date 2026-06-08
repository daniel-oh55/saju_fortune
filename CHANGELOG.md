# CHANGELOG

## [Unreleased]

### Added

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
