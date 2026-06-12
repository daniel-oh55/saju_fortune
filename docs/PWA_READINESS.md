# PWA_READINESS

## 앱화 방식 결정 연계

- PWA는 현재 기본 준비가 완료된 상태입니다.
- 네이티브 앱 전환 방식은 `docs/APP_PACKAGING_STRATEGY.md`를 기준으로 검토합니다.
- 현재 추천 흐름은 PWA 유지 후 Capacitor 도입 준비입니다.
- service worker와 오프라인 캐싱은 앱화 방식 결정 후 별도 검토합니다.

## 앱 아이콘/스플래시 리소스 연계

- 앱 아이콘과 스플래시 원본 리소스 기준은 `docs/APP_ASSET_READINESS.md`를 참고합니다.
- 현재 단계에서는 SVG master 리소스만 준비합니다.
- 실제 앱스토어/플레이스토어 제출 전 PNG 세트 생성이 필요합니다.
- Capacitor 또는 네이티브 앱 패키징은 아직 진행하지 않습니다.

이 문서는 하루풀이 앱을 모바일 런처에 설치 가능한 형태로 준비하기 위한 PWA 기본 점검 문서입니다.
이번 PR은 manifest와 기본 아이콘 연결이 목적이며, service worker, 오프라인 캐싱, 네이티브 앱 패키징은 아직 구현하지 않습니다.

## 1. 목적

- 앱 패키징 전 하루풀이의 기본 PWA 메타데이터를 준비합니다.
- 모바일 홈 화면 추가 시 앱 이름과 아이콘이 자연스럽게 보이도록 합니다.
- 추후 Capacitor 또는 WebView 앱 패키징 시 사용할 기본 앱 정보를 정리합니다.

## 2. 이번 PR 범위

- `manifest.webmanifest` 추가
- 기본 SVG 앱 아이콘 추가
- maskable SVG 앱 아이콘 추가
- `index.html` manifest/theme-color 연결
- PWA readiness 검증 스크립트 추가

제외 범위:

- service worker
- 오프라인 캐싱
- push notification
- Capacitor 설치
- 네이티브 앱 빌드
- 실제 광고 SDK

## 3. manifest 주요 값

- name: 하루풀이
- short_name: 하루풀이
- start_url: /
- scope: /
- display: standalone
- orientation: portrait
- lang: ko-KR
- theme_color: #338f8b
- background_color: #f7fbf8
- icons: 기본 SVG, maskable SVG

## 4. 아이콘 정책

- 현재는 SVG 아이콘만 준비합니다.
- 실제 앱스토어/플레이스토어 제출 시 PNG 아이콘 세트를 별도 PR에서 준비합니다.
- maskable icon은 중앙 safe area를 고려해 주요 도형을 중앙에 배치합니다.
- 외부 이미지나 폰트는 사용하지 않습니다.

## 5. service worker 보류 이유

- 현재 앱은 운세 계산과 localStorage 중심으로 동작합니다.
- 오프라인 캐싱은 사용자 데이터와 캐시 정책을 신중하게 검토해야 합니다.
- 실제 앱 패키징 전 service worker는 별도 PR에서 검토합니다.
- 이번 PR에서는 service worker를 추가하지 않습니다.

## 6. 앱 패키징 전 남은 항목

- 앱 아이콘 PNG 세트 준비
- splash screen 리소스 준비
- Capacitor 또는 WebView 방식 결정
- 실제 기기 테스트
- iOS safe-area 확인
- Android back button 동작 검토
- 개인정보/동의 문구 최종 검토

## 7. 테스트

- `npm run build`
- `npm run check:pwa-readiness`
- 모바일 브라우저에서 manifest 로딩 확인
- Lighthouse PWA 평가는 추후 별도 PR에서 검토
