# DEVELOPMENT_LOG

## 현재 상태

- 배포 방식: GitHub 저장소와 Vercel 연동 구조 사용
- 주요 기능: 프로필 입력, 오늘운세, 2026운세, 광고 보상 시뮬레이션, AI 상담 화면, 궁합 입력, 더 깊은 풀이 기능 준비 중 화면, 마이 화면
- 현재 브랜치: `feature/brand-content-foundation`
- 최근 수정 내용: 앱 브랜드/콘텐츠 작성 기준 정리

## 현재 이슈

- [ ] 확인 필요: Vercel Production URL
- [ ] 확인 필요: Vercel Preview 배포 설정
- [ ] 확인 필요: 모바일 실기기 화면 테스트 결과
- [ ] 확인 필요: 향후 실제 AI API, DB, 광고 SDK, 결제 SDK 연결 범위

## 다음 작업

- [ ] 우선순위 1: Vercel Preview에서 주요 화면 동작 확인
- [ ] 우선순위 2: 운세 문구 템플릿 1차 확장
- [ ] 우선순위 3: AI 상담 mock 답변 톤 정리

## ChatGPT 검토 요청 포인트

- 기존 기능 삭제 여부
- JS 오류 가능성
- 모바일 반응형 문제
- Vercel 배포 위험
- API / DB / 환경변수 문제
- 운세 문구가 불안을 과도하게 자극하지 않는지
- 결제/광고 문구가 과장되지 않았는지

## 작업 로그

### 2026-06-01

#### 작업 내용

- 브랜드명 `하루풀이` 확정
- 앱 소개 문구 확정
- 브랜드 가이드 추가
- 콘텐츠 스타일 가이드 추가
- 화면 문구 일부를 브랜드 톤에 맞게 정리
- 기능 로직 변경 없음

#### 수정 파일

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

#### 테스트 결과

- `npm run build` 실행 예정

#### 남은 이슈

- Vercel Preview에서 실제 화면 문구 확인 필요
- 앱스토어 소개 문구 초안 작성 필요

### 2026-05-29

#### 작업 내용

- 프로젝트 운영 문서 구조 생성
- Codex 작업 규칙 정리
- GitHub PR 기반 개발 흐름 문서화
- Vercel 배포 전 체크리스트 초안 작성

#### 수정 파일

- `README.md`
- `DEVELOPMENT_LOG.md`
- `TODO.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `AGENTS.md`
- `.env.example`
- `docs/WORKFLOW.md`
- `docs/DEPLOY_CHECKLIST.md`
- `docs/PR_TEMPLATE.md`
- `.gitignore`

#### 테스트 결과

- 기능 코드 수정 없음

#### 남은 이슈

- Vercel Preview/Production URL 확인 필요
- 실기기 모바일 테스트 필요
