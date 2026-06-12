# REWARDED_AD_SDK_INTEGRATION_PLAN

## placement readiness

- 실제 provider placement ID 적용 전 `docs/REWARDED_AD_PLACEMENT_READINESS.md`를 참고합니다.
- 내부 placement ID와 provider placement ID를 구분합니다.
- 실제 provider placement ID는 코드에 하드코딩하지 않고 환경변수로 관리합니다.
- placement readiness 검증은 `npm run check:rewarded-ad-placement-readiness`로 수행합니다.

## ads consent gate 연결 상태

- rewarded ad provider layer에서 SDK provider 호출 전 ads consent를 확인합니다.
- provider가 mock이면 개발/테스트용으로 기존 동작을 유지합니다.
- `provider=sdk`, `sdkEnabled=true`, `ads=false`이면 `ads_consent_required`를 반환합니다.
- 현재 실제 SDK는 아직 없으므로 `ads=true`여도 SDK scaffold는 `sdk_unavailable`을 반환합니다.

## SDK adapter scaffold 상태

- `src/services/rewardedAdProvider.sdk.js`가 추가되어 실제 SDK adapter 후보 구조를 제공합니다.
- 현재 adapter는 실제 SDK를 호출하지 않고 `sdk_unavailable`을 반환합니다.
- `src/services/rewardedAdProvider.loader.js`가 provider 선택을 담당합니다.
- 기본 provider는 mock입니다.
- `VITE_REWARDED_AD_PROVIDER=sdk`와 `VITE_REWARDED_AD_SDK_ENABLED=true`를 사용하면 향후 SDK provider로 전환할 수 있는 구조가 있습니다.
- 현재 MVP에서는 실제 광고 SDK가 없으므로 SDK provider는 보상 지급을 하지 않습니다.

이 문서는 하루풀이 MVP 기준의 실제 rewarded ad SDK 연동 전 검토 문서입니다.
이번 문서는 구현 계획이며, 실제 광고 SDK와 외부 광고 라이브러리는 아직 추가하지 않습니다.
실제 SDK 도입 전에는 provider 정책, 개인정보 처리방침, 쿠키/광고 동의 UX, 앱스토어/플랫폼 정책을 별도로 검토해야 합니다.

## 1. 목적

- 현재 mock rewarded ad 구조를 실제 rewarded ad SDK로 확장하기 전 필요한 검토 항목을 정리한다.
- 광고 해금 UX와 개인정보 동의 UX를 분리한다.
- 실제 SDK provider가 정해진 뒤 adapter 단위로 교체할 수 있게 준비한다.
- 기본 운세 기능은 광고와 무관하게 계속 사용할 수 있도록 유지한다.

## 2. 현재 rewarded ad 구조

현재 코드에는 아래 구조가 준비되어 있다.

- `RewardAdModal`: 광고 시청과 보상 확인 UI
- `AdRewardBox`: 광고 보고 상세 풀이를 여는 CTA UI
- `rewardedAdService`: UI가 호출하는 service facade
- `rewardedAdProvider.mock`: 현재 mock provider
- `rewardedAdProvider.types`: provider/outcome 상수
- `rewardedAdPlacements`: placementId와 환경변수 resolver
- `REWARDED_AD_PLACEMENTS`: 광고 위치 식별자
- today fortune detail placement
- saju insight deep dive placement
- mock outcome
- unlock 상태 저장

현재는 mock provider가 `completed`, `load_failed`, `canceled`, `no_reward` 상태를 흉내낸다. 실제 광고 네트워크 호출은 없고, 광고 해금 상태는 기존 reward unlock storage에 저장된다.

## 3. 실제 SDK 연동 전 결정 사항

실제 provider를 확정하기 전 아래 항목을 확인한다.

- 사용할 광고 provider 후보
- 웹앱에서 rewarded ad를 지원하는지
- Vercel 배포 환경에서 사용할 수 있는지
- SDK 로딩 방식
- 광고 placement ID 관리 방식
- 환경변수 관리 방식
- 광고 로딩 실패 처리
- 광고 시청 중 취소 처리
- 보상 지급 실패 처리
- 사용자 동의 상태 확인 방식
- 개인정보 처리방침 업데이트 필요 여부
- 쿠키/광고 식별자 사용 여부
- 맞춤형 광고 사용 여부

특정 provider는 이 문서에서 확정하지 않는다. provider 정책은 실제 도입 시점의 공식 문서와 약관을 기준으로 다시 확인한다.

## 4. consent preferences와 광고 호출 조건

현재 consent 상태는 아래 필드로 관리한다.

- `analytics`
- `ads`
- `personalizedAds`

실제 rewarded ad 호출 시 권장 조건은 아래와 같다.

- `ads`가 `true`일 때만 실제 광고 SDK를 호출한다.
- `ads`가 `false`이면 실제 광고를 호출하지 않고 데이터 사용 설정으로 안내한다.
- `personalizedAds`는 맞춤형 광고 여부에만 사용하고, `ads` consent와 구분한다.
- `analytics`는 광고 호출 조건과 분리한다.

예시 UX:

- ads 미동의 상태에서 광고 해금 버튼 클릭 시: "광고와 데이터 사용 동의가 필요한 기능입니다. 데이터 사용 설정에서 변경할 수 있습니다."
- 기본 운세와 무료 요약은 계속 이용 가능하게 유지한다.
- 설정 열기 버튼을 함께 제공한다.

이번 문서는 정책만 정리하며, 코드 구현은 하지 않는다.

## 5. adapter 구조 초안

현재 mock provider를 유지하면서 실제 SDK provider를 별도 adapter로 추가하는 방향을 권장한다.

예상 파일 후보:

- `src/services/rewardedAdProvider.sdk.js`
- `src/services/rewardedAdProvider.loader.js`
- `src/services/rewardedAdService.js`
- `src/config/rewardedAdPlacements.js`

권장 원칙:

- service는 provider별 구현을 직접 알지 않게 한다.
- provider adapter는 `showRewardedAd` 형태의 공통 인터페이스를 유지한다.
- 반환값은 기존 구조와 맞춘다.
  - `ok`
  - `provider`
  - `placementId`
  - `categoryLabel`
  - `reason`
  - `rewardedAt`

## 6. 환경변수 계획

향후 필요할 수 있는 환경변수 후보:

- `VITE_REWARDED_AD_PROVIDER`
- `VITE_REWARDED_AD_SDK_ENABLED`
- `VITE_REWARDED_AD_PLACEMENT_TODAY_FORTUNE_DETAIL`
- `VITE_REWARDED_AD_PLACEMENT_SAJU_INSIGHT_DEEP_DIVE`
- `VITE_REWARDED_AD_PLACEMENT_YEAR_FORTUNE_DETAIL`
- `VITE_REWARDED_AD_PLACEMENT_ZODIAC_FORTUNE_DETAIL`

이번 PR에서는 실제 env 사용 코드를 추가하지 않는다. 위 항목은 도입 전 검토 후보로만 둔다.

## 7. 실패/취소/보상 없음 처리 원칙

기존 mock outcome과 맞춰 아래 상태를 유지한다.

- `completed`
- `load_failed`
- `canceled`
- `no_reward`

처리 원칙:

- `completed`일 때만 unlock을 저장한다.
- `load_failed`이면 다시 시도 안내를 제공한다.
- `canceled`이면 기본 운세는 계속 이용할 수 있음을 안내한다.
- `no_reward`이면 보상이 지급되지 않았다고 차분하게 안내한다.
- 실패를 과도하게 불안하게 표현하지 않는다.

## 8. 광고 해금 UX 원칙

- 무료 기본 해석은 광고 없이 제공한다.
- 광고는 선택형 심화 해석 해금 수단으로만 제공한다.
- 광고를 보지 않아도 기본 운세 이용은 가능해야 한다.
- 광고 해금은 결제처럼 보이지 않게 문구를 유지한다.
- 광고 실패/취소가 사용자에게 불이익처럼 보이지 않게 처리한다.
- 개인정보 동의와 광고 시청 동작은 문구와 UX에서 분리한다.

## 9. 개인정보/동의 체크리스트

실제 SDK 도입 전 확인할 항목:

- ads consent 확인
- personalizedAds consent 확인
- 쿠키 사용 여부
- 광고 식별자 사용 여부
- 맞춤형 광고 여부
- provider 개인정보 처리방침 확인
- provider 약관 확인
- 개인정보 처리방침 업데이트
- `COOKIE_AD_CONSENT_UX` 문서 업데이트
- `CONSENT_BANNER_UI_PLAN` 문서 업데이트
- PrivacyInfoPage 문구 업데이트
- 광고 provider로 생년월일, 출생시간, 성별, 사주 정보 직접 전달 금지

## 10. 실제 구현 PR 후보

1. rewarded ad SDK provider adapter 추가
2. rewarded ad SDK loader 추가
3. rewarded ad service provider switch 추가
4. consent ads 상태와 광고 호출 조건 연결
5. SDK env flag 추가
6. 실제 provider placement ID 적용
7. 광고 실패/취소 QA
8. Vercel 환경변수 설정 문서화

## 11. 테스트 체크리스트

실제 SDK 도입 후 테스트 항목:

- mock provider 기존 테스트 유지
- consent ads false일 때 실제 광고 호출 차단
- consent ads true일 때 광고 호출 허용
- 광고 완료 후 unlock 저장
- 광고 실패 후 unlock 저장 안 됨
- 광고 취소 후 unlock 저장 안 됨
- `no_reward` 후 unlock 저장 안 됨
- 오늘운세 상세 해금 유지
- 사주 심화 해석 해금 유지
- 기본 운세 무료 이용 유지
- 개인정보 필드 외부 전송 없음
