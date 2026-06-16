# SPLASH_PNG_EXPORT_READINESS

## 실제 PNG 생성 상태

- splash PNG 세트가 `public/generated-splash` 아래에 생성되었습니다.
- 생성 대상은 `public/brand/splash-png-targets.json`을 기준으로 합니다.
- 생성 스크립트는 `npm run generate:splash-pngs`입니다.
- 검증 스크립트는 `npm run check:generated-splash-pngs`입니다.
- 이번 단계에서는 외부 이미지 변환 라이브러리를 설치하지 않았습니다.
- 앱 아이콘 PNG 세트는 기존 생성 상태를 유지합니다.

이 문서는 하루풀이 splash PNG 세트를 생성하기 전 필요한 출력 규격과 검증 기준을 정리한 문서입니다.
이번 PR은 splash PNG 생성 준비가 목적이며, 실제 PNG 바이너리 생성과 이미지 변환 라이브러리 설치는 아직 진행하지 않습니다.

## 1. 목적

- splash master SVG를 기준으로 향후 Android/iOS splash PNG 세트를 생성하기 위한 규격을 정리합니다.
- Android splash screen, Android 12 splash, iOS launch screen 후보 크기를 구분합니다.
- 실제 변환 작업 전 출력 경로와 파일명을 확정합니다.

## 2. 현재 원본 리소스

- `public/brand/harupuli-splash-master.svg`
- `public/brand/harupuli-app-icon-master.svg`
- `public/icons/harupuli-icon.svg`
- `public/manifest.webmanifest`

## 3. PNG 출력 대상

Android portrait 후보:

- 1080x1920
- 1080x2160
- 1440x2560

Android 12 splash icon 후보:

- 432x432
- 960x960

iOS portrait 후보:

- 1170x2532
- 1242x2688
- 1290x2796

Store/marketing preview 후보:

- 1290x2796

## 4. 권장 출력 경로

- `public/generated-splash/android/splash-1080x1920.png`
- `public/generated-splash/android/splash-1080x2160.png`
- `public/generated-splash/android/splash-1440x2560.png`
- `public/generated-splash/android/splash-icon-432.png`
- `public/generated-splash/android/splash-icon-960.png`
- `public/generated-splash/ios/splash-1170x2532.png`
- `public/generated-splash/ios/splash-1242x2688.png`
- `public/generated-splash/ios/splash-1290x2796.png`
- `public/generated-splash/store/splash-1290x2796.png`

이번 PR에서는 위 PNG 파일을 생성하지 않습니다.

## 5. 변환 방식 후보

### 5.1 외부 디자인 도구 사용

예:

- Figma
- Illustrator
- Affinity Designer
- SVG to PNG export tool

장점:

- 실제 기기 화면에서 보일 여백을 눈으로 검수하기 좋습니다.
- safe-area, 로고 위치, 텍스트 크기 조정이 쉽습니다.

단점:

- 수동 작업이 필요합니다.
- 반복 생성 자동화가 약합니다.

### 5.2 Node 기반 변환 스크립트

예:

- sharp

장점:

- 크기별 반복 생성이 가능합니다.
- Android/iOS 후보 리소스를 자동화할 수 있습니다.

단점:

- native dependency 추가가 필요합니다.
- CI/Vercel 설치 영향 검토가 필요합니다.
- 결과물 시각 검수는 별도로 필요합니다.

현재 추천:

- 초기에는 외부 디자인 도구 또는 로컬 변환으로 PNG를 생성하고, 이후 필요 시 sharp 기반 자동화를 검토합니다.

## 6. 품질 체크 기준

- 중앙 로고가 safe-area 안에 위치하는지 확인
- 작은 화면에서 로고와 문구가 잘리지 않는지 확인
- Android navigation bar 영역과 겹치지 않는지 확인
- iOS notch/safe-area와 겹치지 않는지 확인
- 배경색이 앱 theme와 일관되는지 확인
- 지나치게 많은 텍스트 사용 금지
- Android 12 splash icon 후보는 중앙 문양 위주로 단순하게 유지
- 실제 앱 패키지 후 기기별 표시 확인 필요

## 7. 향후 PR 후보

- splash PNG 세트 실제 생성
- Android splash 적용 준비
- Android 12 splash icon 적용 준비
- iOS launch screen 리소스 준비
- Capacitor Android 프로젝트 생성 후 splash 적용
- 실제 기기 splash QA
