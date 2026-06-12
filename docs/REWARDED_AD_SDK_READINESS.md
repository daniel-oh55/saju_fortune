# REWARDED_AD_SDK_READINESS

## 실제 SDK 연동 계획 문서

- 실제 rewarded ad SDK를 붙이기 전 `docs/REWARDED_AD_SDK_INTEGRATION_PLAN.md`를 검토한다.
- 해당 문서는 provider 결정 전 검토 항목, adapter 구조, consent 연결 방식, 실패/취소/보상 없음 처리 원칙을 정리한다.
- 현재 MVP에서는 실제 광고 SDK를 추가하지 않는다.

## 쿠키/광고 동의 UX 연계

- 실제 광고 SDK를 도입하기 전 `docs/COOKIE_AD_CONSENT_UX.md`를 검토합니다.
- 광고 provider가 쿠키, 광고 식별자, 맞춤형 광고를 사용하는 경우 동의 UX가 필요할 수 있습니다.
- 광고 동의 여부와 광고 해금 UX를 어떻게 연결할지는 별도 PR에서 결정합니다.
- 광고 provider에 생년월일, 출생시간, 성별, 사주 정보 등을 직접 전달하지 않는 원칙은 유지합니다.

## 개인정보 처리방침 연계

- 실제 광고 SDK를 도입하기 전 `docs/PRIVACY_POLICY_DRAFT.md`를 검토합니다.
- 실제 광고 SDK가 쿠키, 광고 식별자, 맞춤형 광고, 기기 정보 등을 사용하는 경우 개인정보 처리방침을 업데이트해야 합니다.
- 광고 provider에 생년월일, 출생시간, 성별, 사주 정보 등을 직접 전달하지 않는 것을 원칙으로 합니다.

## 목적

- 실제 광고 SDK를 붙이기 전 확인해야 할 항목을 정리한다.
- 이 문서는 구현 문서가 아니라 사전 검토 체크리스트다.
- 현재 앱은 mock provider만 사용한다.

## 1. 현재 광고 구조 요약

- `AdRewardBox`: 광고 보기 버튼 UI
- `RewardAdModal`: 광고 시청/보상 확인 UI
- `rewardedAdService.js`: UI가 호출하는 service facade
- `rewardedAdProvider.mock.js`: 현재 mock provider
- `rewardedAdProvider.types.js`: provider/outcome 상수
- `rewardedAdPlacements.js`: placementId와 환경변수 resolver
- `storage.js`: unlock 저장
- `App.jsx`: unlock handler 전달

## 2. 현재 적용된 광고 해금 위치

### 오늘운세 상세 풀이

- unlock key: `category.id`
- placementId: `today_fortune_detail`

### 사주 흐름 심화 해석

- unlock key: `sajuInsightDeepDive`
- placementId: `saju_insight_deep_dive`

주의:

- unlock key와 placementId는 다른 개념이다.
- unlock key는 저장 상태 식별자다.
- placementId는 광고 위치 식별자다.

## 3. 실제 SDK 후보 검토 항목

특정 SDK를 확정하지 않고, 아래 후보와 기준을 중심으로 검토한다.
최신 정책은 반드시 각 provider의 공식 문서를 확인해야 한다.

검토 후보 예시:

- Google AdSense
- Google Ad Manager
- AdMob WebView 앱 전환 후 사용
- 기타 보상형 광고 네트워크

검토 기준:

- 웹앱에서 보상형 광고가 가능한지
- 모바일 웹에서 정상 동작하는지
- 앱 전환이 필요한지
- 한국 사용자 대상 광고 노출이 가능한지
- 수익 정산 조건
- 개인정보/쿠키 동의 요구사항
- 심사 조건
- 광고 실패/중단/보상 미지급 이벤트 제공 여부
- Vercel 배포 환경에서 적용 가능한지

## 4. 개인정보/동의 체크리스트

- [ ] 개인정보 처리방침 필요 여부
- [ ] 쿠키/광고 식별자 사용 여부
- [ ] 맞춤형 광고 사용 여부
- [ ] 사용자 동의 배너 필요 여부
- [ ] 미성년자 대상 서비스 가능성
- [ ] 민감정보를 광고 provider에 전달하지 않는 구조인지
- [ ] 생년월일/성별/출생시간을 광고 SDK에 직접 전달하지 않는지
- [ ] 광고 provider로 전송되는 데이터 범위 확인
- [ ] 각 SDK의 개인정보 처리 약관 확인

원칙:

- 생년월일, 성별, 출생시간, 사주 정보는 광고 SDK에 직접 전달하지 않는다.
- 광고 SDK에는 광고 노출과 보상 확인에 필요한 최소 정보만 전달한다.

## 5. 광고 UX 운영 원칙

- 무료 기본 해석은 계속 제공한다.
- 광고는 심화 해석 열람 선택지로만 제공한다.
- 광고 시청을 강요하지 않는다.
- 광고 실패 시 사용자는 다시 시도할 수 있어야 한다.
- 광고 실패 때문에 기본 운세 이용이 막히면 안 된다.
- `completed`일 때만 unlock을 저장한다.
- `load_failed`, `canceled`, `no_reward`는 unlock을 저장하지 않는다.
- 실패 안내 문구는 짧고 불안감을 주지 않게 작성한다.

## 6. 실제 SDK 연동 전 기술 체크리스트

- [ ] provider adapter 파일을 별도 생성할 것
- [ ] `rewardedAdService.js`에서 provider 선택 로직을 통제할 것
- [ ] `RewardAdModal`은 `showRewardedAd`만 호출할 것
- [ ] UI 컴포넌트에서 SDK를 직접 import하지 않을 것
- [ ] placementId는 환경변수 resolver를 통해 전달할 것
- [ ] 실제 SDK ID는 `.env`에만 둘 것
- [ ] localStorage unlock key는 변경하지 않을 것
- [ ] 기존 mock provider 테스트를 유지할 것
- [ ] 실패/중단/미보상 outcome 테스트를 유지할 것

## 7. 실제 SDK 연동 전 테스트 체크리스트

명령어:

- [ ] `npm run build`
- [ ] `npm run check:rewarded-ad-provider-adapter`
- [ ] `npm run check:rewarded-ad-service`
- [ ] `npm run check:rewarded-ad-outcomes`
- [ ] `npm run check:rewarded-ad-placements`
- [ ] `npm run check:rewarded-ad-placement-resolver`
- [ ] `npm run check:saju-insight-reward-unlock`

수동 테스트:

- [ ] 오늘운세 상세 광고 해금
- [ ] 사주 심화 해석 광고 해금
- [ ] 광고 실패 mock 상태
- [ ] 새로고침 후 unlock 유지
- [ ] 모바일 화면
- [ ] `/?debug=manseryeok` 기존 검증 유지

## 8. 실제 SDK 연동 보류 사유

- 현재는 mock provider로 서비스 UX와 저장 구조를 먼저 검증한다.
- 실제 SDK는 개인정보/정책/심사/수익 조건 확인 후 진행한다.
- 실제 SDK 연동은 별도 PR에서 진행한다.
