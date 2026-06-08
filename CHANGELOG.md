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

### Changed

- README를 프로젝트 운영 기준에 맞게 보완
- `.gitignore` 배포/환경 파일 제외 항목 보강
- README에 하루풀이 브랜드 컨셉 반영
- 주요 화면 문구를 브랜드 톤에 맞게 정리
- 오늘운세 상세풀이를 8~12문장 수준의 조언형 콘텐츠로 개선
- 상세풀이 문단 표시 방식 개선
- 홈 화면에서 2026 추천 영역 제거
- 하단 네비게이션에 띠별 탭 추가

### Fixed

-

### Removed

-

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

## 2026-06-01

### Added

- 광고 해금 상세풀이 확장 템플릿
- 카테고리별 상세풀이 섹션 구조

### Changed

- 오늘운세 상세풀이를 8~12문장 수준의 조언형 콘텐츠로 개선
- 상세풀이 문단 표시 방식 개선
- 콘텐츠 스타일 가이드의 광고 해금 상세풀이 기준을 8~12문장 또는 2~3문단으로 조정

### Files

- `src/data/fortuneTemplates.js`
- `src/utils/fortuneEngine.js`
- `src/pages/FortuneDetailPage.jsx`
- `docs/CONTENT_STYLE_GUIDE.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

### Deployed

- 확인 필요

## 2026-06-01

### Added

- `docs/BRAND_GUIDE.md`
- `docs/CONTENT_STYLE_GUIDE.md`

### Changed

- 하루풀이 브랜드명과 앱 소개 문구 반영
- 광고 해금, AI 상담, 더 깊은 풀이 준비 중 문구 정리

### Files

- `README.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`
- `AGENTS.md`
- `docs/BRAND_GUIDE.md`
- `docs/CONTENT_STYLE_GUIDE.md`
- `src/pages/OnboardingPage.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/AiConsultPage.jsx`
- `src/pages/PremiumPage.jsx`
- `src/components/AdRewardBox.jsx`
- `src/components/RewardAdModal.jsx`

### Deployed

- 확인 필요

## 2026-05-29

### Changed

- React + Vite 기반 AI 오늘운세 MVP 초기 구조 정리
- GitHub/Vercel 배포 준비 파일 추가

### Files

- `src/`
- `README.md`
- `vercel.json`
- `.gitignore`

### Deployed

- 확인 필요
