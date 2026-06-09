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
