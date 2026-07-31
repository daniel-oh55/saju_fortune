# 하루풀이 - AI 오늘운세 MVP

하루풀이는 React + Vite + Capacitor Android 기반으로 운영되는 사주·운세 라이프스타일 앱입니다. Google Play 공개 상태와 내부 테스트 릴리스를 구분하여 관리하며, 사용자 프로필과 설정은 주로 `localStorage`에 저장합니다. 별도의 사용자 계정 서버와 로그 분석 시스템은 현재 사용하지 않습니다.

## 프로젝트 목적

- 출시된 Android 앱의 기존 운세 기능과 사용자 데이터 호환성을 유지하면서 단계적으로 개선합니다.
- 사주·운세 production 계산, AdMob Rewarded, UMP 동의 및 Android release 기반은 구현되어 있으며, 일반 사용자 대상 production serving·확인·운영 검증은 별도 단계로 관리합니다.
- 결제, 로그용 사용자 계정 서버, 외부 분석 전용 SDK는 명시적인 별도 작업 승인 전까지 추가하지 않습니다.

## 주요 기능

- 온보딩/프로필 입력
- KST 기준 오늘운세 생성
- 총운, 재물운, 연애운, 직장운, 건강운 요약 및 상세
- Rewarded 광고 시청 후 상세 운세 해금
- 2026년 운세 리포트
- AI 상담 화면 구조
- 궁합 입력 화면
- 더 깊은 풀이 기능 준비 중 화면
- 마이/설정 화면
- localStorage 기반 임시 저장
- 만세력·사주 풀이 production 계산을 위한 `src/domain/saju` 구조

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

Android release와 AdMob production 구성은 Owner가 저장소 밖에서 관리하는 환경변수 또는 GitHub Secret을 사용할 수 있습니다. 실제 production Rewarded 광고 단위 ID, signing material, private key, token 또는 비밀번호는 코드·문서·로그에 기록하지 않습니다.

`.env.example`에는 실제 값이 아닌 변수명과 안전한 설명만 작성합니다.

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

## AI-assisted development workflow

ChatGPT는 제품 우선순위·정책·acceptance criteria와 PR 검토를 담당하고, Codex 또는 Claude Code 중 한 명이 primary implementer로 작업합니다. Claude는 운세·UX 콘텐츠 작업에 활용하며, 위험도에 따라 구현자와 다른 모델이 독립 검토합니다.

- AI 작업 canonical 규칙: [AGENTS.md](AGENTS.md)
- 사람용 운영 설명: [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md)
- 현재 프로젝트 상태: [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md)
- 브랜치·검토·배포 흐름: [docs/WORKFLOW.md](docs/WORKFLOW.md)

브랜드 문구 기준은 [docs/BRAND_GUIDE.md](docs/BRAND_GUIDE.md)를, 운세 콘텐츠 작성 기준은 [docs/CONTENT_STYLE_GUIDE.md](docs/CONTENT_STYLE_GUIDE.md)를 참고합니다.
