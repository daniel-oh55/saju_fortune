# Google Play Data Safety Draft Checklist

## Purpose

이 문서는 하루풀이의 Google Play 데이터 보안 양식 입력 전에 확인할 항목을 초안 형태로 정리한다.

이번 문서는 데이터 보안 양식 초안 체크리스트 문서이며, 실제 Google Play Console 입력은 포함하지 않는다.

이번 PR에서는 Google Play 데이터 보안 양식을 실제로 입력하지 않는다.

## Draft Status

- Google Play 데이터 보안 양식 초안 체크리스트: Draft
- 실제 Google Play 데이터 보안 양식 입력: Pending
- 실제 Google Play Console 입력: Pending
- 개인정보 처리방침 URL 확정: Pending
- 문의처 확정: Pending
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending
- release build: Pending
- signing 설정: Pending
- AAB 생성: Pending

## Current App Data Architecture

현재 앱 구조:

- 서버 DB 없음
- 로그인 없음
- 회원가입 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- 외부 서버로 사용자 입력값 전송 없음
- localStorage 중심 사용자 입력 저장 구조
- 사용자가 입력한 생년월일, 출생시간, 성별 등은 현재 앱 내부 저장 기준으로 관리

## Data Safety Review Items

실제 Google Play 데이터 보안 양식 입력 전 확인할 항목:

| Item | Current status | Review note |
|---|---|---|
| 서버 DB 사용 여부 | 없음 | 현재 서버 저장 구조 없음 |
| 로그인 계정 생성 여부 | 없음 | 현재 계정 기반 사용자 식별 없음 |
| 광고 SDK 사용 여부 | 없음 | 실제 광고 SDK 추가 전까지 없음 |
| 결제 SDK 사용 여부 | 없음 | 실제 결제 SDK 추가 전까지 없음 |
| 외부 분석 SDK 사용 여부 | 없음 | Firebase/GA 등 외부 분석 SDK 추가 전까지 없음 |
| 사용자 입력값 외부 전송 여부 | 없음 | 현재 release scope 기준 외부 서버 전송 없음 |
| localStorage 저장 여부 | 사용 | 사용자가 입력한 정보를 기기 브라우저 저장소에 저장 |
| 개인정보 처리방침 URL | Pending | 실제 URL 확정 전까지 Pending |
| 문의처 | Pending | 실제 문의처 확정 전까지 Pending |

## localStorage Data Notes

현재 앱은 localStorage 중심 저장 구조를 사용한다.

확인 필요 항목:

- 어떤 localStorage key가 사용되는지 확인 필요
- 사용자가 입력한 생년월일/출생시간/성별 정보 저장 여부 확인 필요
- 사주 결과 캐시 또는 최근 입력값 저장 여부 확인 필요
- 기존 localStorage key 변경 없음
- schemaVersion 변경 없음
- 데이터 보안 양식 입력 전 실제 저장 항목을 다시 확인한다

## Pending Items Before Actual Console Input

아래 항목은 실제 확인 전까지 Pending으로 유지한다.

- 실제 Google Play 데이터 보안 양식 입력: Pending
- 실제 Google Play Console 입력: Pending
- 개인정보 처리방침 URL 확정: Pending
- 문의처 확정: Pending
- localStorage key 최종 점검: Pending
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending
- release build: Pending
- signing 설정: Pending
- AAB 생성: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- 실제 Google Play 데이터 보안 양식 입력 없음
- 실제 Google Play Console 입력 없음
- 개인정보 처리방침 URL 확정 없음
- 문의처 확정 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- Android native code 변경 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- Gradle 설정 변경 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 로그인 추가 없음
- 서버 DB 추가 없음
- 외부 분석 SDK 추가 없음
- iOS 프로젝트 추가 없음

## Related Docs

- Local storage data inventory: docs/LOCAL_STORAGE_DATA_INVENTORY.md
- Google Play app metadata checklist: docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md
- Google Play data safety input readiness: docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md
- Google Play privacy URL input readiness: docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md
- Google Play listing claim safety: docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md
- Google Play description draft: docs/GOOGLE_PLAY_DESCRIPTION_DRAFT.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: privacy policy content draft`
   - 개인정보 처리방침 URL 확정 전 문서 초안 작성

2. `docs: google play screenshot production checklist`
   - 실제 스토어 스크린샷 이미지 제작 전 준비 항목 정리

3. `docs: release build signing checklist`
   - release build, signing 설정, AAB 생성 전 준비 항목 정리
