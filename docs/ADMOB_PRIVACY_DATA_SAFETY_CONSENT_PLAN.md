# AdMob Privacy, Data Safety, and Consent Plan

- Status: Privacy, Data safety, and consent plan recorded
- Verification date: 2026-07-26
- PR type: docs/check-only
- AdMob app verification: Completed
- App readiness review: Completed — Approved
- App-level ad serving limit: Lifted
- AdMob account verification: In progress
- Ad units: 0
- Google Mobile Ads SDK integration: Not started
- UMP SDK integration: Not started
- Privacy policy advertising update: Pending
- Google Play Data safety update: Pending
- AdMob Privacy & Messaging configuration: Pending
- Actual advertisement serving: Pending
- First advertising update release: Pending

## 1. Purpose and evidence

- AdMob 앱 인증과 앱 준비 상태 승인은 실제로 완료됐다.
- 앱 단위 광고 게재 제한은 실제로 해제됐다.
- AdMob 계정 인증은 앱 승인과 별개이며 아직 진행 중이다.
- 광고 단위가 0개이고 광고 SDK가 없으므로 실제 광고 요청이나 게재는 아직 없다.
- 이 PR은 향후 광고 SDK 도입 전에 필요한 정책, 동의, 데이터 보안 변경안을 설계하는 문서 PR이다.
- 실제 production 변경과 Console 제출은 별도 PR 및 수동 작업으로 수행한다.
- PR #398의 Pending 상태는 당시 확인 시점의 역사적 기록이므로 소급 수정하지 않는다.

| Area | Status | Evidence or interpretation |
| --- | --- | --- |
| AdMob app verification | Completed | App approved |
| App readiness review | Completed | First app approved |
| App-level ad serving limit | Lifted | Restriction removed |
| AdMob account verification | In progress | Account verification message still displayed |
| Ad units | Pending | 0 ad units |
| Mobile Ads SDK | Not started | No SDK dependency |
| UMP SDK | Not started | No SDK dependency |
| Actual ad requests | No data | No SDK or ad units |
| Actual ad serving | Pending | No ads serving |

## 2. Existing privacy baseline investigation

### 개인정보처리방침과 앱 내 안내

- 현재 production 개인정보처리방침 파일은 `public/privacy-policy/index.html`이며 공개 경로는 `/privacy-policy/`다.
- 저장소에는 이전 또는 후보 사본인 `public/privacy-policy.html`과 `public/privacy/index.html`도 존재한다.
- 정책의 작성 근거와 이력은 `docs/PRIVACY_POLICY_*` 문서군과 `docs/PRIVACY_DATA_MAP.md`에 기록돼 있다.
- 앱 내부 개인정보 안내는 `src/pages/PrivacyInfoPage.jsx`의 `privacyInfo` 라우트다.
- 설정 화면, consent 배너, consent 설정 패널에서 앱 내부 개인정보 안내로 이동할 수 있다.
- 현재 저장소에서는 HYM LOUNGE 홈페이지 개인정보처리방침 URL 참조를 찾지 못했다. `hymlounge.com` 참조는 기존 AdMob readiness 문서의 별도 `app-ads.txt` 공개 URL뿐이다.
- 이 조사는 현재 위치를 기록한 것이며 production 개인정보처리방침이나 앱 UI를 변경하지 않는다.

### 현재 데이터 보안 기준

- `docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_RECORD.md`는 광고 SDK가 없던 현재 앱 기준의 Google Play 데이터 보안 최종 입력 완료를 기록한다.
- 해당 기록의 기준은 서버 DB, 로그인, 실제 광고 SDK, 결제 SDK, 외부 분석 SDK가 없고 localStorage를 중심으로 사용하는 상태다.
- 현재 선언은 앱 데이터의 별도 서버 전송 또는 제3자 공유가 없다는 구현 기준이다.
- Google Mobile Ads SDK가 production AAB에 포함되면 기존 응답을 그대로 유지하지 않고 앱 자체 처리와 SDK 처리를 합산해 다시 검토해야 한다.
- 현재 production 정책에는 향후 광고·결제·분석 기능이 추가되면 정책을 업데이트한다는 일반 문구가 있으나 Google AdMob 데이터 처리에 대한 구체적 고지는 아직 없다.
- 현재 production 정책과 앱 내부 안내에는 외부 SDK 도입 시 재검토가 필요하다는 미래형 문구가 있으나 Mobile Ads SDK 또는 UMP의 실제 적용 고지는 없다.

### 현재 consent와 rewarded-ad 구조

- `src/utils/consentPreferencesStorage.js`는 `harupuli_consent_preferences_v1` localStorage key에 analytics, ads, personalizedAds 선택 상태를 저장한다.
- `ConsentBanner`와 `ConsentSettingsPanel`은 실제 광고·분석 SDK가 아직 없음을 안내하고 사용자가 선택 상태를 저장하거나 다시 변경할 수 있게 한다.
- 이 선택 상태는 향후 기능을 위한 앱 내부 사전 구조이며, UMP가 제공하는 법적 광고 동의 상태나 Privacy & Messaging 양식과 동일하지 않다.
- `rewardedAdProvider.mock.js`가 현재 기본 provider이며, `rewardedAdProvider.sdk.js`는 `sdk_unavailable`을 반환하는 scaffold다.
- SDK provider 경로에는 앱 내부 `ads` 선택 확인 gate가 있지만 실제 SDK 호출이나 광고 요청은 없다.
- mock 완료 결과는 기존 `aiTodayFortune.rewardUnlocks` 구조에 해금 상태만 저장한다.
- `package.json`에는 Google Mobile Ads SDK, UMP SDK, 광고 플러그인, 분석 SDK가 없다.
- 현재 광고·분석·결제 목적의 외부 SDK 전송이나 실제 광고 요청은 없다. Capacitor 런타임과 앱 내 계산 라이브러리는 광고 SDK가 아니다.

현재 정책과 앱 내부 사전 consent가 광고 SDK 도입 이후에도 충분하다고 단정하지 않는다. UMP 동의, Google Play 응답, production 정책 고지는 실제 구현과 Console 설정을 기준으로 별도로 확정한다.

## 3. Google Mobile Ads SDK data disclosure candidate

정확한 SDK 버전과 optional feature 설정이 아직 Pending이므로 다음 항목은 Google Mobile Ads SDK 도입 시 검토할 candidate 또는 expected impact다.

1. IP address
   - 대략적인 위치 추정에 사용될 수 있다.
   - Play 데이터 유형 후보: Approximate location
2. User product interactions
   - 앱 실행, 탭, 광고 또는 동영상 상호작용 등이 포함될 수 있다.
   - Play 데이터 유형 후보: App interactions 또는 기타 App activity
3. Diagnostic information
   - 앱 또는 SDK 실행, 성능, 중단 관련 정보가 포함될 수 있다.
   - Play 데이터 유형 후보: Diagnostics
4. Device and account identifiers
   - Android Advertising ID, App Set ID, 기타 적용 가능한 기기 또는 계정 식별자가 포함될 수 있다.
   - Play 데이터 유형 후보: Device or other IDs

예상 목적 후보:

- Advertising or marketing
- Analytics
- Fraud prevention, security, and compliance

예상 처리 후보:

- Collected
- Shared
- Encrypted in transit

이 목록은 최종 Play Console 답변이 아니다. 실제 SDK 버전과 optional feature 사용 여부를 정한 뒤 공식 데이터 공개 문서를 다시 확인한다. mediation을 사용하면 각 adapter와 SDK를 별도로 검토하며, 첫 광고 업데이트에서는 mediation을 사용하지 않는 방향을 우선 검토한다. 최종 응답은 앱 자체 데이터와 SDK 데이터를 합산하고 implementation PR의 dependency, merged manifest, 공식 공개 문서, 실제 설정을 기준으로 확정한다.

## 4. Google Play Data safety response candidate

이 섹션은 향후 Play Console 입력을 위한 초안이며 실제 제출 완료를 의미하지 않는다.

### Does your app collect or share required user data types?

예상 후보:

`Yes`

단, 실제 SDK가 production AAB에 포함된 후 최종 확정한다.

### Data type candidate matrix

| Data category | Data type candidate | Collected candidate | Shared candidate | Purpose candidate | Final decision |
| --- | --- | --- | --- | --- | --- |
| Location | Approximate location | Expected | Expected | Advertising, analytics, fraud prevention | Pending |
| App activity | App interactions | Expected | Expected | Advertising, analytics | Pending |
| App info and performance | Diagnostics | Expected | Expected | Analytics, fraud prevention | Pending |
| Device or other IDs | Device or other IDs | Expected | Expected | Advertising, analytics, fraud prevention | Pending |

추가 검토 항목:

- 데이터가 일시적으로만 처리되는지
- 수집이 필수인지 또는 사용자가 선택할 수 있는지
- 삭제 요청 지원 방식
- 계정이 없는 앱에서 데이터 삭제 질문을 처리하는 방식
- 전송 중 암호화 여부
- 데이터 처리 목적별 세부 선택
- 광고 ID 수집을 유지하거나 제거할지
- 맞춤 광고, 비맞춤 광고, 제한적 광고 설정에 따른 차이
- SDK optional feature에 따른 추가 데이터

- Data safety response draft: Completed
- Data safety final answers: Pending
- Play Console Data safety submission: Pending
- Post-submission review: Pending

기존 Google Play 입력 기록은 광고 SDK가 없던 버전의 실제 제출 이력이다. 이 candidate draft는 향후 광고 포함 빌드에 대한 신규 검토안이며 actual submission이 아니다.

## 5. Advertising ID decision

향후 implementation PR에서 다음을 확인한다.

- Google Mobile Ads SDK library manifest에서 AD_ID permission이 병합되는지
- 최종 merged manifest에 `com.google.android.gms.permission.AD_ID`가 포함되는지
- Google Play 광고 ID 선언이 필요한지
- 광고 ID 수집을 허용할지
- manifest에서 광고 ID permission을 제거할지
- 광고 ID를 제거할 경우 광고 기능, 수익, 측정에 미치는 영향
- Limited Ads 사용 여부
- 사용자가 Android 설정에서 광고 ID를 삭제한 경우의 처리
- 광고 이외의 persistent identifier를 광고 목적으로 사용하지 않는지

- Advertising ID collection decision: Pending
- AD_ID manifest review: Pending
- Play advertising ID declaration: Pending
- 실제 permission 변경: 없음

## 6. Privacy policy update draft

후보 섹션 제목:

### 광고 서비스 및 제3자 광고 제공업체

하루풀이는 향후 Google AdMob을 사용할 수 있으며, Google Mobile Ads SDK를 통해 광고가 제공될 수 있습니다. 광고 제공, 측정, 분석, 사기 방지를 위해 기기 정보, 광고 식별자, 대략적 위치, 앱 상호작용, 진단 정보가 처리될 수 있습니다. Google 및 광고 파트너가 관련 데이터를 수집하거나 공유할 수 있으며, 설정과 적용 지역에 따라 맞춤 광고, 비맞춤 광고 또는 제한적 광고가 제공될 수 있습니다.

적용 지역에서는 필요한 동의 또는 개인정보 선택 절차를 제공할 예정입니다. Android 설정에서 광고 ID를 재설정하거나 삭제할 수 있으며, 앱 내 개인정보 옵션이 필요한 경우 선택을 다시 확인하거나 변경할 진입점을 제공할 예정입니다. 광고 동의 여부와 관계없이 핵심 운세 기능은 이용할 수 있습니다. 외부 서비스 제공자의 개인정보처리방침이 함께 적용될 수 있으며, 문의 방법과 시행일은 실제 배포 전에 확정합니다.

이 문구는 미래형·조건부 초안이다. 현재 실제 광고 제공이나 production 게시를 의미하지 않으며, Google의 개인정보처리방침이 앱 자체 개인정보처리방침을 대체하지 않는다. 법률 자문이 완료됐다는 의미도 아니다.

- Privacy policy change draft: Completed
- Legal wording review: Pending
- Website production deployment: Pending
- In-app privacy disclosure update: Pending
- Google Play privacy policy URL update: Pending 또는 Not applicable 여부 확인 Pending

## 7. UMP consent flow design

향후 Android 구현 흐름:

1. 앱 실행 또는 적절한 Activity 초기화 시 consent information update를 요청한다.
2. 매 앱 실행마다 동의 정보를 갱신한다.
3. 동의 양식이 필요하면 load and show를 수행한다.
4. 양식 처리 후 `canRequestAds()`를 확인한다.
5. 광고 요청 가능 상태가 된 후에만 광고 SDK를 초기화하거나 광고를 요청한다.
6. privacy options requirement status를 확인한다.
7. 개인정보 옵션이 필요하면 앱 설정 또는 내정보 화면에 재진입점을 표시한다.
8. 사용자가 진입점을 누르면 privacy options form을 표시한다.
9. 동의 정보 업데이트 실패가 앱 실행이나 핵심 운세 기능을 막지 않게 한다.
10. 동의 확인 전에는 광고를 요청하지 않는다.
11. 광고 요청이 불가능하면 빈 광고 컨테이너를 표시하지 않는다.
12. 동의를 거부해도 핵심 운세 기능을 유지한다.
13. 별도 저장이 필요하더라도 기존 fortune schema나 기존 localStorage key에 동의 상태를 혼합하지 않는다.
14. UMP 자체 상태를 임의로 localStorage에 복제하지 않는 방향을 우선한다.
15. 테스트 geography와 test device ID는 개발 환경에서만 사용한다.
16. test device ID를 저장소에 커밋하지 않는다.

- Consent flow design: Completed
- AdMob Privacy & Messaging message creation: Pending
- UMP SDK integration: Not started
- Privacy options UI entry point: Pending
- Consent Android QA: Pending

## 8. Consent failure and fallback behavior

- consent info update가 실패해도 앱은 정상 실행한다.
- 오류 때문에 운세 콘텐츠를 잠그지 않는다.
- 광고 요청 가능 여부는 UMP의 공식 상태를 기준으로 판단한다.
- 광고 요청이 불가능하면 광고를 표시하지 않는다.
- 동의 양식 로드 실패 시 가짜 동의 상태를 저장하지 않는다.
- 광고 실패, no-fill, 오프라인과 동의 거부를 서로 구분한다.
- 어떤 실패에서도 빈 광고 박스나 라벨을 남기지 않는다.
- 광고 관련 오류를 사용자에게 과도하게 노출하지 않는다.
- 필요한 경우 개발 로그만 남기며 개인정보를 기록하지 않는다.
- 재시도 정책은 implementation PR에서 확정한다.

## 9. Privacy options entry point candidate

사용자 진입점 후보:

- 내정보 화면
- 앱 설정 화면이 존재한다면 설정 화면
- 개인정보처리방침 링크 주변

권장 후보:

`내정보 → 개인정보 및 광고 설정`

실제 production UI 위치는 Pending이다.

- UMP가 privacy options entry point를 요구하는 경우에만 표시하는 방식을 우선 검토한다.
- 항상 표시하는 정책도 별도로 검토할 수 있다.
- 기존 운세 메뉴와 혼동되지 않는 문구를 사용한다.
- 동의 철회 또는 변경 기능임을 명확히 표시한다.
- 클릭하면 UMP privacy options form을 호출한다.
- 단순 웹 개인정보처리방침 링크로 대체하지 않는다.

- Entry point candidate: Recorded
- Final UI location: Pending
- UI implementation: Pending
- Android QA: Pending

## 10. General audience and child-directed review

현재 Play Console 설정을 실제 확인한 뒤 다음을 확정한다.

- 현재 타겟 연령 설정
- 어린이 대상 앱으로 선언돼 있는지
- Families 정책 적용 여부
- 광고 SDK의 어린이 대상 요구사항
- 콘텐츠 등급과 광고 적합성
- child-directed treatment 설정 필요 여부
- under-age-of-consent 처리 필요 여부

이 PR은 앱이 어린이 대상인지 여부 또는 Families 정책 적용 여부를 단정하지 않는다. Target audience/Families status confirmation: Pending.

## 11. Required Console actions

### AdMob

- Privacy & Messaging에서 필요한 메시지 유형 확인: Pending
- EEA, 영국, 스위스 등의 사용자에 대한 동의 메시지 설정: Pending
- 개인정보 옵션 설정: Pending
- 메시지 게시: Pending
- 계정 인증 완료 확인: Pending
- 광고 단위 생성: Pending

### Google Play

- 데이터 보안 양식 수정: Pending
- 광고 ID 선언 검토: Pending
- 광고 포함 여부 및 관련 앱 콘텐츠 질문 검토: Pending
- 개인정보처리방침 URL과 내용 확인: Pending
- 타겟층과 Families 상태 재확인: Pending

## 12. Implementation and release gates

SDK 구현 PR 전 필수 조건:

| Gate | Required state | Current state |
| --- | --- | --- |
| AdMob account verification | Completed 또는 구현 진행 가능 여부 확인 | In progress |
| Final SDK/plugin approach | Selected | Pending |
| Exact SDK versions | Selected | Pending |
| Privacy policy draft | Reviewed | Draft only |
| Data safety answer candidates | Reviewed | Draft only |
| Advertising ID decision | Finalized | Pending |
| Consent flow | Finalized | Design only |
| Privacy options entry point | Finalized | Candidate only |
| Target audience/Families status | Confirmed | Pending |

첫 광고 포함 업데이트 전 필수 조건:

| Gate | Required state | Current state |
| --- | --- | --- |
| Privacy policy production update | Completed | Pending |
| Data safety form update | Completed | Pending |
| Advertising ID declaration | Completed or confirmed Not applicable | Pending |
| Privacy & Messaging configuration | Completed | Pending |
| UMP test verification | Completed | Pending |
| Official test ad verification | Completed | Pending |
| Android real-device QA | Completed | Pending |
| Release build | Completed | Pending |
| Signing | Completed | Pending |
| AAB generation | Completed | Pending |
| Internal testing upload | Completed | Pending |
| Internal testing installation | Completed | Pending |
| Production rollout decision | Completed | Pending |

실제 수행되지 않은 항목의 현재 상태는 모두 Pending으로 유지한다.

## 13. Proposed follow-up sequence

- PR #400 후보: AdMob SDK 및 Capacitor 구현 접근 방식 기술 검토
- PR #401 후보: 개인정보처리방침 production 변경과 홈페이지 배포
- PR #402 후보: Google Play 데이터 보안 및 광고 ID 입력 준비 기록
- PR #403 후보: Google 공식 테스트 광고와 UMP SDK 연동
- PR #404 후보: 개인정보 옵션 UI와 테스트 광고 Android QA
- PR #405 후보: 실제 광고 단위 release configuration
- PR #406 후보: 첫 광고 포함 AAB 및 내부 테스트
- PR #407 후보: Google Play 첫 광고 업데이트 준비

위 번호는 계획 후보이며 실제 PR 번호는 달라질 수 있다.

## 14. Status interpretation rules

- Completed: 실제 작업 또는 확인 수행
- Approved: Google의 앱 준비 상태 승인
- Lifted: 앱 단위 광고 게재 제한 해제
- In progress: 계정 또는 외부 검토 진행 중
- Pending: 수행 또는 확인 전
- Not started: 구현 시작 전
- No data: 확인할 실제 데이터 없음
- App approval does not mean account verification completed
- App approval does not mean actual ads are serving
- A policy draft does not mean the production policy is updated
- Data safety response candidates do not mean the Play form is submitted
- Consent flow design does not mean UMP is integrated
- Build success does not mean Android QA is completed
- Internal testing does not mean production release is completed

## 15. Not included in this PR

- No Google Play Console changes
- No AdMob Console changes
- No Privacy & Messaging changes
- No production privacy policy changes
- No website deployment
- No Google Mobile Ads SDK
- No UMP SDK
- No advertising plugin
- No AdMob App ID
- No ad unit ID
- No publisher ID
- No test device ID
- No AD_ID permission
- No AndroidManifest changes
- No Gradle changes
- No Capacitor changes
- No production UI changes
- No localStorage changes
- No dependency or package-lock changes
- No actual advertisement request
- No actual advertisement serving
- No release build
- No signing
- No AAB generation
