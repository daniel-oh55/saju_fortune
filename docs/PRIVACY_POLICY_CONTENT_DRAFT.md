# Privacy Policy Content Draft

## Purpose

이 문서는 하루풀이의 개인정보처리방침 URL 확정 전에 사용할 개인정보처리방침 내용 초안을 정리한다.

이번 문서는 개인정보처리방침 초안 문서이며, 실제 개인정보처리방침 URL 확정은 포함하지 않는다.

이번 PR에서는 실제 Google Play Console 입력을 수행하지 않는다.

주의:

- 이 문서는 출시 준비용 초안이다.
- 실제 공개 전에는 운영자 정보, 문의처, 게시 위치, 적용일을 최종 확인해야 한다.

## Draft Status

- 개인정보처리방침 내용 초안: Draft
- 개인정보처리방침 URL 확정: Pending
- 문의처 확정: Pending
- 실제 Google Play Console 입력: Pending
- 실제 Google Play 데이터 보안 양식 입력: Pending
- localStorage key 최종 점검: Draft
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending
- release build: Pending
- signing 설정: Pending
- AAB 생성: Pending

## Current App Data Scope

현재 앱 구조:

- 서버 DB 없음
- 로그인 없음
- 회원가입 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- 외부 서버로 사용자 입력값 전송 없음
- localStorage 중심 사용자 입력 저장 구조

현재 앱에서 기기 내부 저장소에 저장될 수 있는 정보:

- 생년월일
- 출생시간
- 성별
- 이름 또는 별칭 계열 값
- 오늘운세 결과 캐시
- 저장한 풀이
- 동의 설정
- 방문 기록/연속 방문 정보
- 알림 설정
- 지역 선택 보조 정보
- 홈 빠른 메뉴 설정

주의:

- 위 항목은 docs/LOCAL_STORAGE_DATA_INVENTORY.md 기준 초안이다.
- 실제 Google Play 데이터 보안 양식 입력 전 최종 점검이 필요하다.

## Privacy Policy Draft Text

아래 초안은 실제 공개 전 운영자 정보, 문의처, 게시 위치, 적용일을 확정해야 한다.

```md
# 하루풀이 개인정보처리방침 초안

하루풀이(이하 "앱")는 사용자의 개인정보 보호를 중요하게 생각합니다.

본 개인정보처리방침은 하루풀이 앱이 어떤 정보를 처리할 수 있는지, 해당 정보가 어떤 방식으로 저장되는지, 사용자가 어떤 점을 확인해야 하는지 설명하기 위한 초안입니다.

## 1. 처리할 수 있는 정보

앱은 운세 콘텐츠 제공을 위해 사용자가 입력한 정보를 기기 내부 저장소에 저장할 수 있습니다.

저장될 수 있는 정보는 다음과 같습니다.

- 생년월일
- 출생시간
- 성별
- 이름 또는 별칭 계열 값
- 오늘운세 결과
- 저장한 풀이
- 동의 설정
- 방문 기록/연속 방문 정보
- 알림 설정
- 지역 선택 보조 정보
- 홈 빠른 메뉴 설정

## 2. 정보의 저장 방식

현재 앱은 서버 DB를 사용하지 않습니다.

현재 앱은 로그인 또는 회원가입 기능을 제공하지 않습니다.

현재 앱은 사용자가 입력한 정보를 외부 서버로 전송하지 않습니다.

현재 앱의 주요 저장 구조는 사용자의 기기 브라우저 저장소인 localStorage를 기준으로 합니다.

## 3. 정보의 이용 목적

앱은 저장된 정보를 다음 목적을 위해 사용할 수 있습니다.

- 오늘운세 및 기본 사주 흐름 제공
- 사용자가 입력한 정보 불러오기
- 저장한 풀이 관리
- 동의 설정 유지
- 방문 기록 및 연속 방문 표시
- 알림 설정 유지
- 홈 빠른 메뉴 설정 유지

## 4. 제3자 제공 및 외부 전송

현재 앱은 서버 DB, 로그인, 실제 광고 SDK, 실제 결제 SDK, 외부 분석 SDK를 사용하지 않습니다.

현재 release scope 기준으로 사용자가 입력한 정보는 외부 서버로 전송하지 않습니다.

향후 광고 SDK, 결제 SDK, 외부 분석 SDK, 로그인, 서버 DB가 추가될 경우 개인정보처리방침과 데이터 보안 관련 문서를 별도로 갱신해야 합니다.

## 5. 사용자의 관리 방법

사용자는 브라우저 또는 앱 환경의 저장 데이터 삭제 기능을 통해 기기 내 저장된 정보를 삭제할 수 있습니다.

앱 내에서 제공되는 삭제 또는 초기화 기능이 있는 경우 해당 기능을 통해 일부 저장 정보를 삭제할 수 있습니다.

## 6. 아동 및 민감정보 관련 주의

앱은 운세 콘텐츠를 참고용으로 제공하는 앱입니다.

앱은 사용자의 중요한 결정을 대신하지 않습니다.

민감한 개인정보나 타인의 정보를 임의로 입력하지 않도록 주의가 필요합니다.

## 7. 문의처

문의처는 실제 서비스 운영 전 확정이 필요합니다.

- 문의처: Pending

## 8. 적용일

실제 개인정보처리방침 공개 전 적용일을 확정해야 합니다.

- 적용일: Pending
```

## Google Play Data Safety Alignment

- 실제 Google Play 데이터 보안 양식 입력 전 docs/LOCAL_STORAGE_DATA_INVENTORY.md와 대조해야 한다.
- 실제 Google Play 데이터 보안 양식 입력 전 docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md와 대조해야 한다.
- 실제 Google Play Console 입력 전 개인정보처리방침 URL, 문의처, 적용일을 확정해야 한다.
- 실제 광고 SDK, 실제 결제 SDK, 외부 분석 SDK, 로그인, 서버 DB가 추가되면 본 초안을 다시 갱신해야 한다.

## Pending Items

- 개인정보처리방침 URL 확정: Pending
- 문의처 확정: Pending
- 적용일 확정: Pending
- 실제 Google Play Console 입력: Pending
- 실제 Google Play 데이터 보안 양식 입력: Pending
- localStorage key 최종 점검: Draft
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- 실제 개인정보처리방침 URL 확정 없음
- 실제 문의처 확정 없음
- 실제 적용일 확정 없음
- 실제 Google Play Console 입력 없음
- 실제 Google Play 데이터 보안 양식 입력 없음
- 공개 개인정보처리방침 페이지 생성 없음
- production 분석 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- Android native code 변경 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- localStorage key 변경 없음
- localStorage key 추가 없음
- schemaVersion 변경 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 로그인 추가 없음
- 회원가입 추가 없음
- 서버 DB 추가 없음
- 외부 분석 SDK 추가 없음
- iOS 프로젝트 추가 없음

## Related Docs

- Local storage data inventory: docs/LOCAL_STORAGE_DATA_INVENTORY.md
- Google Play data safety draft checklist: docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md
- Google Play data safety input readiness: docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md
- Google Play privacy URL input readiness: docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md
- Privacy policy URL readiness: docs/PRIVACY_POLICY_URL_READINESS.md
- Privacy policy draft: docs/PRIVACY_POLICY_DRAFT.md
- Privacy policy contact readiness: docs/PRIVACY_POLICY_CONTACT_READINESS.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: privacy policy contact readiness update`
   - 실제 문의처 확정 전 점검 항목 갱신

2. `docs: privacy policy public page content alignment`
   - 공개 개인정보처리방침 페이지 생성 전 초안 문구 대조

3. `docs: google play privacy url final check`
   - 실제 URL 확정 전 HTTPS 접근, 문의처, 적용일, Google Play 입력 가능 여부 확인
