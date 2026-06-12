# APP_ICON_PNG_EXPORT_READINESS

## 실제 PNG 생성 상태

- 앱 아이콘 PNG 세트가 `public/generated-icons` 아래에 생성되었습니다.
- 생성 대상은 `public/brand/app-icon-png-targets.json`을 기준으로 합니다.
- 생성 스크립트는 `npm run generate:app-icons`입니다.
- 검증 스크립트는 `npm run check:generated-app-icons`입니다.
- 이번 단계에서는 외부 이미지 변환 라이브러리를 설치하지 않았습니다.
- splash PNG는 아직 생성하지 않았습니다.

이 문서는 하루풀이 앱 아이콘 PNG 세트를 생성하기 전 필요한 출력 규격과 검증 기준을 정리한 문서입니다.
이번 PR은 PNG 생성 준비가 목적이며, 실제 PNG 바이너리 생성과 이미지 변환 라이브러리 설치는 아직 진행하지 않습니다.

## 1. 목적

- app icon master SVG를 기준으로 향후 PNG 아이콘 세트를 생성하기 위한 규격을 정리합니다.
- PWA, Android, iOS, 스토어 제출용 아이콘 크기를 구분합니다.
- 실제 변환 작업 전 출력 경로와 파일명을 확정합니다.

## 2. 현재 원본 리소스

- `public/brand/harupuli-app-icon-master.svg`
- `public/icons/harupuli-icon.svg`
- `public/icons/harupuli-maskable-icon.svg`
- `public/manifest.webmanifest`

## 3. PNG 출력 대상

PWA 후보:

- 192x192
- 512x512

Android 후보:

- 48x48
- 72x72
- 96x96
- 144x144
- 192x192
- 512x512

iOS 후보:

- 120x120
- 152x152
- 167x167
- 180x180
- 1024x1024

Store 후보:

- 512x512
- 1024x1024

## 4. 권장 출력 경로

- `public/generated-icons/pwa/icon-192.png`
- `public/generated-icons/pwa/icon-512.png`
- `public/generated-icons/android/icon-48.png`
- `public/generated-icons/android/icon-72.png`
- `public/generated-icons/android/icon-96.png`
- `public/generated-icons/android/icon-144.png`
- `public/generated-icons/android/icon-192.png`
- `public/generated-icons/android/icon-512.png`
- `public/generated-icons/ios/icon-120.png`
- `public/generated-icons/ios/icon-152.png`
- `public/generated-icons/ios/icon-167.png`
- `public/generated-icons/ios/icon-180.png`
- `public/generated-icons/store/icon-1024.png`

이번 PR에서는 위 PNG 파일을 생성하지 않습니다.

## 5. 변환 방식 후보

### 5.1 외부 디자인 도구 사용

예:

- Figma
- Illustrator
- Affinity Designer
- SVG to PNG export tool

장점:

- 결과물을 눈으로 확인하기 쉽습니다.
- 스토어 제출 전 검수에 유리합니다.

단점:

- 자동화가 약합니다.
- 수동 작업이 필요합니다.

### 5.2 Node 기반 변환 스크립트

예:

- sharp

장점:

- 반복 생성이 가능합니다.
- 크기별 자동화가 가능합니다.

단점:

- native dependency 추가가 필요합니다.
- Vercel/CI 설치 영향 검토가 필요합니다.

현재 추천:

- 초기에는 외부 디자인 도구 또는 로컬 변환으로 PNG를 생성하고, 이후 필요 시 sharp 기반 자동화를 검토합니다.

## 6. 품질 체크 기준

- 48px에서도 중심 문양과 경계가 식별 가능한지 확인
- 배경 투명 여부 확인
- maskable 영역 잘림 확인
- Android adaptive icon 적용 가능성 확인
- iOS rounded corner 자동 적용 고려
- 스토어 1024px 아이콘에 투명 배경 사용 여부 검토
- 과도한 텍스트 사용 금지

## 7. 향후 PR 후보

- 앱 아이콘 PNG 세트 실제 생성
- Android adaptive icon foreground/background 생성
- iOS icon asset catalog 준비
- manifest icons에 PNG 아이콘 추가 여부 검토
- splash PNG 세트 생성
