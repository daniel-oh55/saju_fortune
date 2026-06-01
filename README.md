# 하루풀이 - AI 오늘운세 MVP

하루풀이는 매일 무료로 확인하는 따뜻한 사주·운세 풀이 앱입니다. 오늘의 흐름부터 궁금한 고민까지, 현실적인 조언으로 차근차근 풀어드립니다.

React + Vite 기반의 사주/운세 모바일 웹앱 MVP이며, 사용자가 프로필을 입력하면 KST 기준 오늘운세와 2026년 운세 화면을 확인할 수 있습니다. 현재 단계에서는 100% 무료 사용을 전제로 하며, 상세 풀이와 확장 콘텐츠는 광고 시청 후 열람하는 구조를 우선 검토합니다. 유료 결제/구독은 추후 사용자 규모가 커진 뒤 검토합니다.

## 프로젝트 목적

- 웹앱 MVP를 먼저 만들고 이후 Capacitor를 통해 Android/iOS 앱 패키징 가능성을 열어둡니다.
- 실제 만세력/사주 계산 엔진, AI 상담 API, 광고 SDK, 결제 SDK는 추후 단계로 분리합니다.
- 현재 버전은 seed 기반 mock 운세 생성과 localStorage 임시 저장으로 제품 흐름을 검증합니다.

## 주요 기능

- 온보딩/프로필 입력
- KST 기준 오늘운세 생성
- 총운, 재물운, 연애운, 직장운, 건강운 요약 및 상세
- 광고 시청 시뮬레이션 후 상세 운세 해금
- 2026운세 mock 리포트
- AI 상담 화면 구조
- 궁합 입력 화면
- 더 깊은 풀이 기능 준비 중 화면
- 마이/설정 화면
- localStorage 기반 임시 저장
- 추후 만세력 엔진 연결을 위한 `src/domain/saju` 구조

## 사용 기술

- React
- Vite
- JavaScript
- CSS
- localStorage
- GitHub
- Vercel

## 로컬 실행 방법

```bash
npm install
npm run dev
```

기본 개발 서버 주소:

```text
http://localhost:5188/
```

Windows PowerShell에서 `npm` 실행 정책 오류가 나면 아래처럼 실행합니다.

```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

## GitHub / Vercel 배포 구조

- GitHub 저장소: `https://github.com/daniel-oh55/saju_fortune.git`
- 기본 브랜치: `main`
- 권장 작업 방식: 기능별 브랜치 생성 후 PR을 통해 `main`에 merge
- Vercel은 `main` 브랜치와 연결되어 있을 수 있으므로 `main` 직접 push를 피합니다.

Vercel 설정:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## 환경변수 안내

현재 코드에서 실제로 사용하는 환경변수는 확인되지 않았습니다.

추후 AI API, DB, 광고 SDK, 결제 SDK를 연결할 경우 `.env.example`에 변수명을 먼저 추가하고, 실제 값은 로컬 `.env` 또는 Vercel Environment Variables에서 관리합니다.

주의:
- 실제 API Key, DB URL, Secret Key는 Git에 커밋하지 않습니다.
- `.env` 파일은 `.gitignore`에 포함되어 있습니다.

## 기본 폴더 구조

```text
src/
  App.jsx
  main.jsx
  styles.css
  components/
  data/
  domain/
    fortune/
    saju/
  pages/
  utils/
docs/
  BRAND_GUIDE.md
  CONTENT_STYLE_GUIDE.md
  WORKFLOW.md
  DEPLOY_CHECKLIST.md
  PR_TEMPLATE.md
```

## ChatGPT / Codex와 함께 사용하는 방법

1. 사용자가 ChatGPT 프로젝트에 요구사항을 설명합니다.
2. ChatGPT가 구현 방향, 검토 포인트, Codex 프롬프트를 정리합니다.
3. Codex는 기능별 브랜치에서 실제 파일 수정과 테스트를 진행합니다.
4. GitHub PR에서 변경사항을 검토합니다.
5. `main` merge 후 Vercel 배포 상태를 확인합니다.

브랜드 문구 기준은 [docs/BRAND_GUIDE.md](docs/BRAND_GUIDE.md)를, 운세 콘텐츠 작성 기준은 [docs/CONTENT_STYLE_GUIDE.md](docs/CONTENT_STYLE_GUIDE.md)를 참고합니다. 자세한 운영 흐름은 [docs/WORKFLOW.md](docs/WORKFLOW.md)를 참고합니다.
