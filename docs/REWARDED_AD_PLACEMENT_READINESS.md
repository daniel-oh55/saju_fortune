# REWARDED_AD_PLACEMENT_READINESS

이 문서는 하루풀리 MVP 기준의 rewarded ad placement ID 적용 준비 문서입니다.
이번 문서는 운영 준비 기준이며, 실제 광고 SDK와 실제 provider placement ID는 아직 추가하지 않습니다.
실제 SDK 도입 후 provider 콘솔에서 발급한 placement ID를 Vercel 환경변수로 별도 설정해야 합니다.

## 목적

- mock rewarded ad 구조를 유지하면서 실제 SDK 도입 전 placement ID 관리 기준을 정리합니다.
- 내부 fallback placement ID와 실제 provider placement ID를 구분합니다.
- 실제 provider placement ID를 코드에 하드코딩하지 않고 환경변수로 관리하는 원칙을 문서화합니다.
- consent 조건, SDK provider 설정, placement resolver가 함께 확인되어야 하는 지점을 정리합니다.

## 현재 placement 구조

현재 코드에는 아래 placement key가 준비되어 있습니다.

- `TODAY_FORTUNE_DETAIL`: 오늘운세 상세 풀이
- `SAJU_INSIGHT_DEEP_DIVE`: 사주 흐름 심화 해석
- `YEAR_FORTUNE_DETAIL`: 2026운세 상세 풀이
- `ZODIAC_FORTUNE_DETAIL`: 띠별운세 상세 풀이

현재 `REWARDED_AD_PLACEMENTS`의 값은 앱 내부 fallback ID입니다.
이는 실제 광고 provider 콘솔에서 발급한 placement ID가 아닙니다.
실제 SDK를 연결할 때는 provider placement ID를 Vercel Environment Variables에 설정해야 합니다.

## 환경변수 목록

### provider 설정

- `VITE_REWARDED_AD_PROVIDER`
  - 목적: rewarded ad provider 선택
  - 현재 MVP: `mock`
  - 실제 SDK 도입 시: `sdk`

- `VITE_REWARDED_AD_SDK_ENABLED`
  - 목적: SDK provider 활성화 여부
  - 현재 MVP: `false`
  - 실제 SDK 도입 시: QA가 끝난 환경에서 `true`

### placement 설정

- `VITE_REWARDED_AD_PLACEMENT_TODAY_FORTUNE_DETAIL`
  - 목적: 오늘운세 상세 풀이 광고 위치
  - 예시 값: `provider_today_test`

- `VITE_REWARDED_AD_PLACEMENT_SAJU_INSIGHT_DEEP_DIVE`
  - 목적: 사주 흐름 심화 해석 광고 위치
  - 예시 값: `provider_saju_test`

- `VITE_REWARDED_AD_PLACEMENT_YEAR_FORTUNE_DETAIL`
  - 목적: 2026운세 상세 풀이 광고 위치
  - 예시 값: `provider_year_test`

- `VITE_REWARDED_AD_PLACEMENT_ZODIAC_FORTUNE_DETAIL`
  - 목적: 띠별운세 상세 풀이 광고 위치
  - 예시 값: `provider_zodiac_test`

위 예시 값은 테스트용 문자열입니다.
실제 운영 placement ID는 provider 콘솔에서 발급받은 값을 사용해야 합니다.

## Vercel 설정 체크리스트

- [ ] Preview 환경과 Production 환경의 provider 설정을 구분합니다.
- [ ] 실제 provider placement ID를 코드에 직접 작성하지 않습니다.
- [ ] 모든 placement 환경변수가 Vercel에 등록되어 있는지 확인합니다.
- [ ] `VITE_REWARDED_AD_PROVIDER=sdk` 전환 전 consent gate가 정상 동작하는지 확인합니다.
- [ ] `VITE_REWARDED_AD_SDK_ENABLED=true` 전환 전 SDK adapter QA를 완료합니다.
- [ ] placement가 비어 있을 때 내부 fallback ID로 동작하는 현재 MVP 흐름을 확인합니다.

## placement ID 적용 원칙

- unlock key와 placement ID는 다른 개념입니다.
- unlock key는 앱 내부 보상 해금 상태를 식별합니다.
- placement ID는 광고 provider에서 광고 위치를 식별합니다.
- 실제 provider placement ID는 환경변수로만 주입합니다.
- 코드에는 실제 provider placement ID를 하드코딩하지 않습니다.
- provider placement ID가 누락되어도 앱이 깨지지 않도록 내부 fallback ID를 유지합니다.

## consent와 placement 관계

- placement ID가 설정되어 있어도 ads consent가 실제 SDK 호출의 선행 조건입니다.
- `ads=false`인 경우 실제 SDK provider 호출을 하지 않습니다.
- mock provider는 개발과 회귀 테스트를 위해 기존 동작을 유지합니다.
- personalized ads 여부는 provider 정책과 법률 검토에 따라 별도 처리합니다.

## 실제 SDK 도입 후 QA

- [ ] 각 placement key가 올바른 provider placement ID로 resolve되는지 확인합니다.
- [ ] 오늘운세 상세, 사주 심화, 2026운세, 띠별운세에서 광고 해금이 각각 정상 동작하는지 확인합니다.
- [ ] ads consent가 false일 때 실제 SDK 호출이 차단되는지 확인합니다.
- [ ] 광고 로드 실패, 취소, 보상 없음, 완료 상태가 UI에 자연스럽게 표시되는지 확인합니다.
- [ ] Vercel Preview와 Production 환경변수 차이를 확인합니다.

## 향후 구현 PR 후보

- 실제 provider placement ID를 Vercel 환경변수에 등록
- SDK adapter에서 provider placement ID 전달
- SDK provider 완료 이벤트 기반 보상 지급 연결
- provider별 오류 코드와 사용자 안내 문구 정리
- 운영 환경에서 consent gate와 placement resolver 통합 QA
