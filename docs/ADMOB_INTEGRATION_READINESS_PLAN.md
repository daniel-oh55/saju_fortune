# AdMob Integration Readiness Plan

- Status: AdMob integration readiness plan recorded
- Verification date: 2026-07-25
- PR type: docs/check-only
- AdMob account creation: Completed
- Payment profile submission: Completed
- AdMob account verification: In progress
- AdMob app registration: Completed
- Google Play linking: Completed
- Package verification: Completed
- app-ads.txt production deployment: Completed
- Live app-ads.txt URL verification: Completed
- AdMob app-ads.txt verification: Pending
- AdMob app verification: Pending
- App readiness review: Pending
- Ad unit creation: Pending
- AdMob SDK integration: Not started
- UMP SDK integration: Not started
- Actual advertisement serving: Pending
- First advertising update release: Pending

## 1. Purpose and scope

- 이 문서는 실제 광고 구현 전에 필요한 결정, 정책 검토, 구현 경계와 검증 게이트를 기록한다.
- 이 PR은 AdMob Console 또는 Google Play Console을 변경하지 않는다.
- 이 PR은 Android, production 코드, production UI 또는 배포 설정을 변경하지 않는다.
- app-ads.txt는 별도 웹사이트 저장소에서 production 배포되었다.
- app-ads.txt 공개 URL 확인과 AdMob의 app-ads.txt 인증 완료는 별도 상태다.
- AdMob 계정 인증, 앱 인증, 앱 준비 상태 검토는 서로 다른 상태다.
- 이 단계에서 가능한 작업은 문서와 후속 구현·QA 계획을 확정하는 것이다.
- 실제 SDK 연동은 별도 production PR에서 수행한다.

## 2. Current evidence summary

| Area | Status | Observed result |
| --- | --- | --- |
| Google Play production release | Completed | App publicly available |
| Google Play installation | Completed | Store-installed app verified |
| Empty home ad placeholder | Completed | Removed by PR #397 |
| AdMob account creation | Completed | Account created |
| Payment profile submission | Completed | Submitted |
| AdMob account verification | In progress | Waiting for Google verification |
| AdMob app registration | Completed | Android app registered |
| Google Play link | Completed | Store link established |
| Package verification | Completed | `com.harupuli.app` |
| app-ads.txt repository publication | Completed | Published from separate website repository |
| app-ads.txt production deployment | Completed | `https://hymlounge.com/app-ads.txt` returns one-line plain text |
| AdMob update check | Completed | Check requested |
| AdMob app-ads.txt verification | Pending | Not confirmed by AdMob |
| AdMob app verification | Pending | Not confirmed |
| App readiness review | Pending | Not started or not confirmed |
| Ad units | Pending | 0 ad units |
| Advertising SDK | Not started | No SDK integrated |
| Advertising requests | No data | No production ad requests |
| Actual advertisements | Pending | Not serving |

해석 원칙:

- `No data`는 성공으로 처리하지 않는다.
- 공개 파일이 존재한다는 사실을 AdMob 인증 완료로 처리하지 않는다.
- `In progress`를 Completed로 처리하지 않는다.

## 3. Existing application advertising state

### 확인된 구조

- PR #397은 홈 화면의 정적인 빈 광고 placeholder와 불필요한 여백만 제거했다.
- `AdRewardBox`는 선택형 상세 풀이 해금 CTA와 `RewardAdModal` 진입을 담당한다.
- `RewardAdModal`은 2초 mock 카운트다운 뒤 광고 결과를 확인하는 시뮬레이션 UI다.
- `rewardedAdService`는 UI가 호출하는 facade다.
- `rewardedAdProvider.loader`는 provider 설정과 광고 동의 상태를 확인한다.
- `rewardedAdProvider.mock`이 현재 기본 provider다.
- `rewardedAdProvider.sdk`는 scaffold이며 현재 `sdk_unavailable`만 반환한다.
- `REWARDED_AD_PLACEMENTS`는 오늘운세, 사주 심화, 연운, 띠별운세의 논리적 placement를 정의한다.
- 실제 AdMob SDK import, 실제 광고 요청, 실제 App ID, 실제 광고 단위 ID는 없다.
- 리워드 해금은 기존 `aiTodayFortune.rewardUnlocks` localStorage 구조를 사용한다.

### 구현 경계

- 기존 리워드 광고 구조가 존재하더라도 실제 AdMob 광고 게재가 완료된 것은 아니다.
- mock provider 기반 보상 흐름과 실제 SDK 연동은 구분한다.
- 첫 광고 도입 PR에서 기존 리워드 mock 흐름을 실광고로 자연스럽게 전환하지 않는다.
- 첫 광고 후보는 별도 인라인 배너이며, 기존 리워드 해금 구조는 후속 결정 전까지 유지한다.
- 기존 production 운세 해제 로직, localStorage key와 schemaVersion은 이 PR에서 변경하지 않는다.

## 4. Initial ad format and placement

### Initial release candidate

- 광고 형식 후보: 반응형 배너 1개
- 표시 방식 후보: 콘텐츠 흐름 안의 inline 배너
- 배치 후보: 주요 운세 또는 결과 콘텐츠가 끝난 뒤
- 긴 핵심 콘텐츠 문단 사이에는 배치하지 않는다.
- 결과 확인 전에 광고를 강제하지 않는다.
- 하단 내비게이션 위에 고정 overlay로 겹치지 않는다.
- 앱 실행 광고를 사용하지 않는다.
- 전면 광고를 사용하지 않는다.
- 첫 광고 업데이트에서 실제 리워드 광고를 사용하지 않는다.
- 네이티브 광고를 사용하지 않는다.
- 미디에이션을 사용하지 않는다.

최종 광고 위치 확정: Pending

이 문서는 후보의 UX 원칙만 기록하며 실제 위치를 확정하거나 구현하지 않는다.

## 5. Empty and failed ad behavior

후속 구현 원칙:

- 광고가 실제로 로드된 경우에만 광고 DOM 또는 native view를 표시한다.
- 광고 로딩 전에는 광고 컨테이너를 표시하지 않는다.
- 광고 로드 실패 시 빈 박스를 표시하지 않는다.
- no-fill 상태에서 빈 박스를 표시하지 않는다.
- 오프라인 상태에서 빈 박스를 표시하지 않는다.
- 동의 거부 또는 광고 요청 불가 상태에서 빈 박스를 표시하지 않는다.
- 광고 라벨만 단독으로 표시하지 않는다.
- 고정 높이, min-height, 부자연스러운 margin 또는 padding을 남기지 않는다.
- 광고 실패가 운세 콘텐츠 접근을 막지 않는다.
- 광고 실패가 routing을 변경하지 않는다.
- 광고 실패가 기존 localStorage를 손상시키지 않는다.
- 광고가 하단 내비게이션 또는 safe-area와 겹치지 않는다.

## 6. Development and test-ad policy

- 개발 및 QA에서는 Google 공식 테스트 광고만 사용한다.
- 실제 광고 단위로 개발자 본인의 반복 노출 또는 클릭을 수행하지 않는다.
- Galaxy S23 Ultra를 실제 테스트 기기 후보로 사용한다.
- 테스트 기기 ID는 저장소에 커밋하지 않는다.
- 테스트 기기 설정 방식은 implementation PR에서 결정한다.
- 에뮬레이터 QA 가능 여부를 implementation PR에 기록한다.
- 테스트 광고에는 테스트 상태가 명확히 표시되어야 한다.
- production 배포에서는 테스트 ID를 제거하거나 production configuration과 분리한다.
- 실제 광고 단위 ID는 별도 release configuration에서 관리한다.
- 광고 클릭 테스트는 테스트 광고에서만 수행한다.

## 7. Consent and privacy flow plan

### 목표 흐름

1. 앱 시작 후 동의 정보를 업데이트한다.
2. 동의 양식이 필요한 경우에만 표시한다.
3. 광고 요청 가능 상태를 확인한 뒤에만 광고를 요청한다.
4. 개인정보 옵션 진입점이 필요한 경우 앱 설정 또는 개인정보 화면에서 제공한다.
5. 사용자가 동의 선택을 다시 열 수 있도록 설계한다.
6. 동의 요청 실패가 앱 실행을 막지 않는다.
7. 동의 요청 실패 시 광고 요청 가능 여부를 보수적으로 판단한다.
8. 동의를 거부해도 핵심 운세 기능을 정상 사용할 수 있게 한다.
9. 동의 상태를 기존 fortune schemaVersion 또는 기존 localStorage key와 결합하지 않는다.
10. 별도 저장이 필요하면 기존 key와 충돌하지 않는 별도 key를 검토하되 이 PR에서는 생성하지 않는다.

### Pending 상태

- AdMob Privacy & Messaging configuration: Pending
- UMP SDK dependency: Pending
- Consent form implementation: Pending
- Privacy options entry point: Pending
- Consent Android QA: Pending

UMP SDK는 Android production PR에서 Gradle 및 AndroidManifest 설정과 함께 검토한다.

## 8. Google Play Data safety impact

SDK와 정확한 버전이 확정된 뒤 다음 항목을 공식 데이터 공개 문서와 실제 구현 기준으로 다시 검토한다.

- 광고 SDK가 수집하거나 공유하는 데이터 유형
- 기기 또는 기타 식별자
- Advertising ID 사용 가능성
- 앱 활동 또는 광고 상호작용 데이터
- 진단 또는 성능 데이터
- 대략적 위치 데이터 사용 여부
- 데이터 수집 목적
- 데이터 공유 여부
- 전송 중 데이터 암호화 여부
- 삭제 요청 가능 여부
- 사용자 선택 가능 여부
- UMP 동의와 Data safety 선언의 관계
- SDK 버전별 공식 데이터 공개 문서

이 PR에서는 Google Play Data safety 양식을 수정하지 않는다. SDK 버전을 확정하기 전에는 수집 항목을 단정하지 않는다. SDK가 수집하는 데이터도 앱의 데이터 처리로 간주해 검토하며, 실제 구현 후 merged manifest와 SDK 공식 공개 문서를 다시 확인한다.

Data safety update: Pending

## 9. Advertising ID and manifest impact

후속 구현 PR의 확인 항목:

- Google Mobile Ads SDK dependency로 추가되는 manifest 항목
- merged manifest에 AD_ID 관련 permission이 포함되는지
- 현재 target SDK의 permission 요구사항
- AdMob Application ID meta-data
- AndroidManifest.xml 변경
- Gradle dependency 변경
- consumer ProGuard 또는 R8 영향
- Capacitor sync 영향
- release AAB의 merged manifest
- Google Play Console 광고 ID 선언 필요 여부

이 PR에서는 실제 permission 또는 meta-data를 추가하지 않는다.

## 10. Privacy policy impact

후속 개인정보처리방침 검토 범위:

- Google Mobile Ads 사용
- 광고 제공 목적
- 광고 식별자 또는 기기 식별자 처리 가능성
- 맞춤 또는 비맞춤 광고
- 동의 관리와 선택 변경 방법
- Google 및 광고 파트너의 데이터 처리
- 문의 방법
- 시행일과 변경일
- Google Play에 등록한 개인정보처리방침 URL 유지 여부
- 앱, 웹사이트와 스토어 설명의 정책 문구 일치 여부

- Privacy policy advertising update: Pending
- Website privacy policy deployment: Pending
- In-app privacy disclosure update: Pending

실제 문구를 이 PR에서 확정하거나 production 웹사이트를 변경하지 않는다.

## 11. Implementation approach decision gate

Capacitor 앱에서 SDK를 연결하는 방법은 다음 후보를 비교한 뒤 확정한다.

- 유지보수되는 Capacitor 광고 plugin
- Android native SDK와 Capacitor bridge
- 그 밖의 공식 지원 가능한 접근

평가 기준:

- 현재 Capacitor 버전 호환성
- Android target SDK 호환성
- UMP 지원
- 반응형 배너 지원
- 광고 lifecycle 처리
- 테스트 기기 지원
- Ad Inspector 지원
- 유지보수 상태
- 개인정보 및 동의 처리
- AndroidManifest와 Gradle 변경 범위
- release build와 AAB 영향

Implementation approach selection: Pending

이 PR에서는 특정 plugin을 설치하거나 최종 선택하지 않는다.

## 12. Android QA matrix

| Scenario | Expected result | Execution |
| --- | --- | --- |
| Web/Vercel | 광고 SDK 미로드 또는 안전한 fallback | Pending |
| Android debug build | 공식 테스트 구성으로 실행 | Pending |
| Galaxy S23 Ultra 실제 기기 | 테스트 광고와 레이아웃 확인 | Pending |
| 앱 최초 실행 | 동의 흐름과 앱 진입 정상 | Pending |
| 재실행 | 저장된 동의 상태에 맞게 동작 | Pending |
| 동의 필요 지역 debug mode | 동의 양식 표시 | Pending |
| 동의 불필요 지역 debug mode | 불필요한 양식 미표시 | Pending |
| 동의 수락 | 광고 요청 가능 상태 확인 | Pending |
| 동의 거부 | 핵심 운세 정상, 광고 요청 정책 준수 | Pending |
| 개인정보 옵션 다시 열기 | 선택 변경 가능 | Pending |
| 테스트 광고 로드 성공 | 콘텐츠 뒤 배너만 표시 | Pending |
| 광고 로드 실패 | 빈 공간 없음 | Pending |
| no-fill | 빈 공간 없음 | Pending |
| 오프라인 | 빈 공간과 기능 차단 없음 | Pending |
| 느린 네트워크 | 로딩 중 placeholder 없음 | Pending |
| 화면 회전 또는 viewport 변경 | 레이아웃과 배너 정상 | Pending |
| 백그라운드 후 복귀 | 중복 view 또는 요청 없음 | Pending |
| route 이동 | 광고 view 정리 | Pending |
| 하단 내비게이션 | 겹침 없음 | Pending |
| safe-area | 겹침 없음 | Pending |
| 광고 미로드 | 빈 공간 없음 | Pending |
| 운세 콘텐츠 | 정상 표시 | Pending |
| 기존 mock 리워드 | 흐름 회귀 없음 | Pending |
| 뒤로가기 | 동작 회귀 없음 | Pending |

모든 QA 실행 결과: Pending

이 PR은 QA 계획만 기록한다.

## 13. First advertising update release gates

| Gate | Required state before release | Current state | Gate result |
| --- | --- | --- | --- |
| AdMob account verification | Completed | In progress | Pending |
| app-ads.txt verification | Completed | Pending | Pending |
| AdMob app verification | Completed | Pending | Pending |
| App readiness review | Ready 또는 광고 요청 허용 상태 확인 | Pending | Pending |
| Initial ad format and placement | Finalized | Candidate only | Pending |
| Implementation approach | Finalized | Pending | Pending |
| Privacy & Messaging configuration | Completed | Pending | Pending |
| Test ad SDK integration | Completed | Not started | Pending |
| Google official test ad verification | Completed | Not started | Pending |
| Real-device Android QA | Completed | Not executed | Pending |
| Privacy policy update | Completed | Pending | Pending |
| Google Play Data safety update | Completed | Pending | Pending |
| Advertising ID declaration review | Completed | Pending | Pending |
| Release build | Completed | Not executed | Pending |
| Signing | Completed | Not executed | Pending |
| AAB generation | Completed | Not executed | Pending |
| Internal testing upload | Completed | Not executed | Pending |
| Internal testing installation | Completed | Not executed | Pending |
| Production rollout decision | Completed | Not made | Pending |

실제로 수행하지 않은 모든 게이트 결과는 Pending이다.

## 14. Proposed follow-up PR sequence

- PR #399 후보: 개인정보처리방침·Data safety·동의 관리 변경안 작성
- PR #400 후보: AdMob SDK 구현 접근 방식 기술 검토
- PR #401 후보: 공식 테스트 광고 SDK 및 UMP 연동
- PR #402 후보: 테스트 광고 Android 실제 기기 QA
- PR #403 후보: 실제 광고 단위 및 release configuration 준비
- PR #404 후보: 첫 광고 포함 AAB 및 내부 테스트
- PR #405 후보: Google Play 첫 광고 업데이트 출시 준비

위 번호는 계획상의 후보이며 실제 PR 번호는 달라질 수 있다.

## 15. Status interpretation rules

- Completed: 실제 작업 또는 확인을 수행했다.
- In progress: Google 또는 외부 검토가 진행 중이다.
- Pending: 아직 수행하거나 확인하지 않았다.
- Not started: 구현을 시작하지 않았다.
- No data: 확인할 데이터가 없다.
- Completed does not mean approved
- Production file availability does not mean AdMob verification completed
- AdMob account verification and app verification are separate
- App verification and app readiness review are separate
- Test advertisements do not mean production advertisements are serving
- SDK build success does not mean Android QA completed
- Internal testing does not mean production release completed

## 16. Not included in this PR

- No AdMob Console changes
- No Google Play Console changes
- No Google Mobile Ads SDK
- No UMP SDK
- No advertising plugin
- No actual AdMob App ID
- No actual ad unit ID
- No test device ID
- No Advertising ID value
- No AndroidManifest.xml changes
- No AD_ID permission changes
- No Gradle changes
- No Capacitor changes
- No production UI changes
- No ad placement implementation
- No privacy policy production changes
- No Data safety submission changes
- No Android QA execution
- No release build
- No AAB generation
- No actual advertisement requests
- No actual advertisement serving
- No src changes
- No CSS changes
- No routing changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes
- No dependency or package-lock changes
