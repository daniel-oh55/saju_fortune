# APP_ASSET_READINESS

## Capacitor base config와 앱 리소스 관계

- Capacitor 기본 config가 추가되었지만 Android 프로젝트는 아직 없습니다.
- 생성된 앱 아이콘, splash, adaptive icon PNG는 Android 프로젝트 생성 후 실제 리소스 적용 단계에서 사용합니다.
- 현재 단계에서는 public 리소스 기준으로만 유지합니다.

## Android adaptive icon PNG 실제 생성

- Android adaptive icon foreground/background PNG가 생성되었습니다.
- 생성된 파일은 `public/generated-icons/android-adaptive` 아래에 있습니다.
- 기존 앱 아이콘 PNG와 splash PNG는 유지합니다.
- 실제 Android 프로젝트 적용은 별도 PR에서 진행합니다.

## Android adaptive icon 준비

- Android adaptive icon foreground/background 리소스 기준을 추가했습니다.
- 기준 문서는 `docs/ANDROID_ADAPTIVE_ICON_READINESS.md`입니다.
- target manifest는 `public/brand/android-adaptive-icon-targets.json`입니다.
- 실제 adaptive icon PNG 생성은 별도 PR에서 진행합니다.

## splash PNG 실제 생성

- splash PNG 세트가 생성되었습니다.
- 생성된 파일은 `public/generated-splash` 아래에 있습니다.
- Android/iOS/store 후보 splash PNG가 준비되었습니다.
- 실제 Capacitor 프로젝트 적용은 별도 PR에서 진행합니다.

## 앱 아이콘 PNG 실제 생성

- 앱 아이콘 PNG 세트가 생성되었습니다.
- 생성된 파일은 `public/generated-icons` 아래에 있습니다.
- PWA manifest에는 192x192, 512x512 PNG 아이콘이 추가되었습니다.
- splash PNG는 별도 PR에서 생성합니다.

## splash PNG export 준비

- splash PNG 세트 생성 전 기준은 `docs/SPLASH_PNG_EXPORT_READINESS.md`를 참고합니다.
- PNG 출력 target manifest는 `public/brand/splash-png-targets.json`입니다.
- 이번 단계에서는 실제 splash PNG 바이너리를 생성하지 않습니다.
- 실제 splash PNG 생성은 별도 PR에서 진행합니다.

## 앱 아이콘 PNG export 준비

- 앱 아이콘 PNG 세트 생성 전 기준은 `docs/APP_ICON_PNG_EXPORT_READINESS.md`를 참고합니다.
- PNG 출력 target manifest는 `public/brand/app-icon-png-targets.json`입니다.
- 이번 단계에서는 실제 PNG 바이너리를 생성하지 않습니다.
- 실제 PNG 생성은 별도 PR에서 진행합니다.

## Android 리소스 준비 연계

- Android 패키징 전 앱 아이콘 PNG 세트와 splash PNG 세트가 필요합니다.
- 현재 SVG master 리소스는 Android 리소스 생성 시 기준으로 사용합니다.
- Android 패키징 준비 기준은 `docs/ANDROID_PACKAGING_READINESS.md`를 참고합니다.

## Capacitor 리소스 준비 연계

- Capacitor로 Android/iOS 프로젝트를 생성하기 전 PNG 아이콘과 splash 리소스가 필요합니다.
- 현재 SVG master 리소스는 PNG 세트 생성 시 기준으로 사용합니다.
- Capacitor 도입 준비 기준은 `docs/CAPACITOR_READINESS.md`를 참고합니다.

## 앱화 방식과 리소스 관계

- Capacitor 또는 WebView 앱 패키징 시 현재 master SVG를 기준으로 PNG 세트를 생성할 수 있습니다.
- 앱화 방식 결정 기준은 `docs/APP_PACKAGING_STRATEGY.md`를 참고합니다.
- 실제 Android/iOS 리소스 생성은 앱화 방식 결정 후 별도 PR에서 진행합니다.

이 문서는 하루풀이 앱을 모바일 앱으로 패키징하기 위한 앱 아이콘과 스플래시 리소스 준비 기준입니다.
이번 PR은 원본 SVG 리소스와 체크리스트 준비가 목적이며, 실제 네이티브 앱 패키징과 PNG 변환은 아직 진행하지 않습니다.

## 1. 목적

- 앱 패키징용 아이콘과 스플래시 리소스 기준을 정리합니다.
- PWA 아이콘과 네이티브 앱 아이콘의 관계를 정리합니다.
- 앱스토어/플레이스토어 제출 시 필요한 추가 리소스를 목록화합니다.

## 2. 이번 PR 범위

포함:

- app icon master SVG
- splash master SVG
- asset readiness 검증 스크립트
- PWA 문서와 모바일 UX 문서 업데이트

제외:

- PNG 아이콘 세트 생성
- iOS asset catalog 생성
- Android mipmap 리소스 생성
- Capacitor 설치
- 네이티브 앱 빌드
- service worker
- 실제 광고 SDK

## 3. 현재 준비된 리소스

- `public/icons/harupuli-icon.svg`
- `public/icons/harupuli-maskable-icon.svg`
- `public/brand/harupuli-app-icon-master.svg`
- `public/brand/harupuli-splash-master.svg`
- `public/manifest.webmanifest`

## 4. 앱 아이콘 제작 기준

- master SVG는 1024x1024 기준입니다.
- 주요 도형은 중앙 safe area 안에 배치합니다.
- 작은 크기에서도 식별 가능하도록 단순한 형태를 유지합니다.
- 텍스트는 최소화합니다.
- 외부 폰트나 이미지를 사용하지 않습니다.
- 최종 제출 전 PNG 세트가 필요합니다.

추후 필요한 PNG 후보:

- 1024x1024
- 512x512
- 192x192
- 180x180
- 167x167
- 152x152
- 144x144
- 120x120
- 96x96
- 72x72
- 48x48

## 5. 스플래시 리소스 제작 기준

- portrait 기준입니다.
- safe-area를 고려합니다.
- 중앙 로고/도형 중심으로 구성합니다.
- 배경색은 앱 theme와 어울리게 유지합니다.
- 과도한 텍스트는 피합니다.
- 실제 iOS/Android 빌드 전 PNG 세트가 필요합니다.

## 6. 스토어 제출 전 추가 준비 항목

- 앱 아이콘 PNG 세트
- splash PNG 세트
- 앱 스크린샷
- 앱 이름
- 짧은 설명
- 긴 설명
- 개인정보 처리방침 URL
- 광고 포함 여부
- 카테고리
- 콘텐츠 등급
- 지원 이메일 또는 문의 채널

## 7. 향후 PR 후보

- PNG 아이콘 세트 생성
- splash PNG 세트 생성
- 앱스토어 등록 정보 초안
- Capacitor 도입 준비
- 실제 기기 테스트 체크리스트
