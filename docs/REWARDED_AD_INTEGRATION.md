# REWARDED_AD_INTEGRATION

## 목적

보상형 광고 연동 구조를 정리한다.
현재는 mock provider를 사용하고, 실제 광고 SDK는 아직 연결하지 않는다.

## 현재 구조

- `AdRewardBox`: 사용자가 광고 보기 버튼을 누르는 UI
- `RewardAdModal`: mock 광고 모달과 보상 완료 처리
- `rewardedAdService`: 광고 provider 추상화 계층
- `storage.js`: reward unlock 저장
- `App.jsx`: unlock handler 전달

## 현재 Provider

- provider: `mock_rewarded_ad`
- duration: 2초
- 실제 광고 SDK 없음

## 광고 결과 상태

현재 mock provider는 실제 광고 SDK 없이 아래 결과 상태를 반환할 수 있다.
기본 결과는 `completed`이며, 테스트에서는 `mockOutcome` 또는 `globalThis.__HARUPULI_REWARDED_AD_MOCK_OUTCOME__` 값으로 실패 상태를 검증한다.

- `completed`: 보상 조건이 충족된 상태
- `load_failed`: 광고를 불러오지 못한 상태
- `canceled`: 사용자가 광고 시청을 완료하지 않은 상태
- `no_reward`: 광고는 종료되었지만 보상 완료 이벤트를 받지 못한 상태

실제 SDK 연동 전에는 `npm run check:rewarded-ad-outcomes`로 상태별 회귀 검증을 먼저 확인한다.

## RewardAdModal 처리 원칙

- `completed`일 때만 `onRewardComplete`를 호출한다.
- `load_failed`, `canceled`, `no_reward` 상태에서는 상세 콘텐츠를 해금하지 않는다.
- 실패 상태에서는 사용자가 다시 시도할 수 있도록 모달을 유지한다.
- 실패 안내 문구는 짧고 불안감을 주지 않는 표현으로 제공한다.
- mock 광고 카운트다운이 끝난 뒤 보상 확인 단계에서는 중복 대기 시간을 만들지 않는다.

## Placement ID 정책

현재 광고 위치는 내부 placementId로 구분한다.

- `today_fortune_detail`: 오늘운세 상세 풀이
- `saju_insight_deep_dive`: 사주 흐름 심화 해석
- `year_fortune_detail`: 연간운 상세 풀이
- `zodiac_fortune_detail`: 띠별 운세 상세 풀이

주의:

- placementId는 광고 SDK 위치 식별자다.
- unlock key는 localStorage 해금 상태 저장 키다.
- 두 값은 반드시 구분한다.
- 예: unlock key는 `sajuInsightDeepDive`, placementId는 `saju_insight_deep_dive`

향후 실제 SDK 연동 시:

- `rewardedAdPlacements.js`에서 provider별 실제 placementId로 확장한다.
- UI 컴포넌트에서는 직접 SDK ID를 쓰지 않는다.

## 환경변수 기반 placementId

현재는 내부 mock placementId를 사용한다.
향후 실제 광고 SDK 연동 시에는 Vite 환경변수로 실제 placementId를 주입한다.

사용 예정 환경변수:

- `VITE_REWARDED_AD_PLACEMENT_TODAY_FORTUNE_DETAIL`
- `VITE_REWARDED_AD_PLACEMENT_SAJU_INSIGHT_DEEP_DIVE`
- `VITE_REWARDED_AD_PLACEMENT_YEAR_FORTUNE_DETAIL`
- `VITE_REWARDED_AD_PLACEMENT_ZODIAC_FORTUNE_DETAIL`

동작 원칙:

- 환경변수가 비어 있으면 내부 mock placementId를 사용한다.
- UI 컴포넌트는 실제 SDK ID를 직접 알지 않는다.
- placement resolver가 내부 key를 실제 provider placementId로 변환한다.
- unlock key와 placementId는 계속 분리한다.

## 향후 실제 SDK 연동 원칙

- `RewardAdModal` UI는 최대한 유지한다.
- 실제 광고 SDK 호출은 `rewardedAdService` 내부로 격리한다.
- SDK 성공 이벤트가 발생한 경우에만 `onRewardComplete`를 호출한다.
- 광고 로딩 실패, 사용자의 광고 중단, 보상 미지급 상태를 구분한다.
- localStorage key 이름은 변경하지 않는다.
- `rewardType` 값은 provider 이름과 맞춰 관리한다.

## 현재 적용 위치

- 오늘운세 상세 풀이
- 사주 흐름 심화 해석

## 주의사항

- 광고 해금은 결제 기능이 아니다.
- 광고 시청을 과도하게 강요하지 않는다.
- 무료 기본 해석은 계속 제공한다.
- 실제 광고 SDK 연동 전까지는 mock provider만 사용한다.
