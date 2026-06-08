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

### Fixed

-

### Removed

-

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
