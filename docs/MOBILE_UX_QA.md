# MOBILE_UX_QA

## Android WebView QA 연계

- Android 앱에서는 현재 모바일 웹 화면이 WebView 안에서 표시됩니다.
- Android back button, safe-area, 하단 네비게이션, 모달, 동의 배너는 실제 기기에서 다시 확인해야 합니다.
- Android 패키징 준비 기준은 `docs/ANDROID_PACKAGING_READINESS.md`를 참고합니다.

## Capacitor WebView QA 연계

- Capacitor 앱에서는 현재 모바일 웹 화면이 WebView 안에서 표시됩니다.
- 하단 네비게이션, safe-area, 모달, consent banner는 실제 기기에서 다시 확인해야 합니다.
- Capacitor 도입 준비 기준은 `docs/CAPACITOR_READINESS.md`를 참고합니다.

## 앱화 방식 결정 연계

- 모바일 UX QA 결과는 앱화 방식 결정에 영향을 줍니다.
- Capacitor/WebView 방식에서는 현재 모바일 웹 화면 완성도와 직접 연결됩니다.
- 앱화 방식 결정 기준은 `docs/APP_PACKAGING_STRATEGY.md`를 참고합니다.

## 앱 리소스 준비 연계

- 모바일 UX 보정 이후 앱 아이콘과 스플래시 리소스를 준비합니다.
- 자세한 기준은 `docs/APP_ASSET_READINESS.md`를 참고합니다.
- 실제 기기 테스트와 splash 화면 확인은 앱 패키징 단계에서 진행합니다.

## PWA 기본 준비 연계

- 모바일 UX 보정 이후 PWA manifest를 준비합니다.
- PWA 기본 준비 내용은 `docs/PWA_READINESS.md`를 참고합니다.
- service worker와 오프라인 캐싱은 아직 구현하지 않습니다.

이 문서는 하루풀리를 앱처럼 모바일 중심으로 전환하기 위한 모바일 사용성 점검 기준입니다.
이번 PR은 모바일 화면 보정과 QA 기준 정리가 목적이며, 실제 네이티브 앱 패키징은 아직 진행하지 않습니다.

## 1. 목적

- 모바일 화면에서 주요 기능이 자연스럽게 보이는지 점검합니다.
- 하단 네비게이션, 동의 배너, 모달, 설정 패널이 서로 겹치지 않도록 확인합니다.
- 앱 패키징 시 안전 영역, 스크롤, 문구 줄바꿈, 고정 요소 위치를 점검합니다.

## 2. 점검 대상 화면

- 온보딩 화면
- 홈 화면
- 오늘운세 상세 화면
- 사주 흐름 페이지
- 사주 심화 해석 영역
- 저장한 풀이 페이지
- 개인정보 안내 페이지
- 설정 페이지
- 동의 배너
- 데이터 사용 설정 패널
- 광고 보상 모달
- 만세력 debug 페이지

## 3. 모바일 폭 기준

아래 폭을 기준으로 점검합니다.

- 360px
- 375px
- 390px
- 414px
- 430px
- 480px

## 4. 주요 QA 항목

- 하단 네비게이션이 주요 버튼을 가리지 않는지
- consent banner가 하단 네비게이션과 겹치지 않는지
- consent settings panel이 작은 화면에서 스크롤 가능한지
- reward modal이 작은 화면에서 잘리지 않는지
- 저장한 풀이 카드의 삭제/공유 버튼을 누르기 쉬운지
- 개인정보 안내 페이지의 긴 문서명이 줄바꿈되는지
- 홈 카드들이 너무 빽빽하지 않은지
- 버튼 높이가 모바일 터치 영역으로 충분한지
- 화면 하단 고정 요소가 safe-area를 고려하는지
- 불필요한 가로 스크롤이 생기지 않는지

## 5. 보정 원칙

- 기능 구조는 유지합니다.
- CSS 중심으로 보정합니다.
- 모바일에서 버튼 최소 높이와 여백을 확보합니다.
- 긴 문구는 줄바꿈되도록 합니다.
- 하단 fixed 요소는 bottom nav와 겹치지 않게 합니다.
- 불필요한 애니메이션이나 복잡한 라이브러리는 추가하지 않습니다.

## 6. 앱 패키징 전 추가 확인 사항

- PWA manifest 준비
- 앱 아이콘 준비
- splash screen 준비
- Capacitor 또는 WebView 방식 결정
- 실제 기기 테스트
- iOS safe-area 확인
- Android back button 동작 검토
