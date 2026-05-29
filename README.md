# AI 오늘운세 MVP

React + Vite 기반의 사주/운세 모바일 웹앱 MVP입니다.  
현재는 웹앱으로 개발하고, 이후 Capacitor를 이용해 Android/iOS 앱으로 패키징할 수 있는 구조를 목표로 합니다.

## 주요 기능

- 온보딩/프로필 입력
- KST 기준 오늘운세 생성
- 총운, 재물운, 연애운, 직장운, 건강운 요약 및 상세
- 광고 시청 시뮬레이션 후 상세 운세 해금
- 2026운세 mock 리포트
- AI 상담 화면 구조
- 궁합 입력 화면
- 프리미엄 안내 화면
- 마이/설정 화면
- localStorage 기반 임시 저장
- 추후 만세력 엔진 연결을 위한 `domain/saju` 구조

## 실행 방법

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

## Vercel 배포 설정

Vercel에서 GitHub 저장소를 연결한 뒤 아래 설정을 사용합니다.

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## 현재 데이터 구조 메모

- 사용자 프로필: `localStorage`의 `aiTodayFortune.profile`
- 오늘 운세: `localStorage`의 `aiTodayFortune.todayFortune`
- 광고 해금 상태: `localStorage`의 `aiTodayFortune.rewardUnlocks`

향후 Firebase, Supabase, Neon 같은 외부 DB를 붙일 때 위 구조를 서버 저장 모델로 이전하면 됩니다.
