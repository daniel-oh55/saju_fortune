# Release Build Signing Checklist

## Purpose

이 문서는 하루풀이 Android 출시 준비를 위해 release build, signing 설정, AAB 생성 전에 확인할 항목을 정리한다.

이번 문서는 release build/signing/AAB 준비 체크리스트 문서이며, 실제 release build 생성은 포함하지 않는다.

이번 PR에서는 signing 설정, keystore 생성, AAB 생성을 수행하지 않는다.

## Current Android Build Status

현재 상태:

- Android Debug Build GitHub Actions 사용 중
- Debug APK artifact 생성 가능
- release build: Pending
- signing 설정: Pending
- keystore 파일: Pending
- AAB 생성: Pending
- Play Console 내부 테스트 업로드: Pending
- 실제 기기 QA: Pending

주의:

- Debug APK 성공은 release build 완료가 아니다.
- Debug APK artifact 생성은 Google Play 업로드 가능 AAB 생성이 아니다.
- signing 설정 없이 Play Console 업로드용 release AAB를 완료했다고 표시하지 않는다.

## Release Preparation Checklist

| Item | Status | Note |
|---|---|---|
| release build 설정 검토 | Pending | 실제 설정 전까지 Pending |
| signing keystore 생성 | Pending | keystore 파일은 repo에 commit하지 않음 |
| signing config 적용 | Pending | 비밀번호/alias는 secrets로 관리 필요 |
| GitHub Actions release workflow 검토 | Pending | 실제 생성 전까지 Pending |
| AAB 생성 | Pending | 실제 bundle 생성 전까지 Pending |
| AAB artifact 확인 | Pending | 실제 artifact 확인 전까지 Pending |
| Play Console 내부 테스트 업로드 | Pending | 실제 업로드 전까지 Pending |
| 실제 기기 QA | Pending | 실제 설치/실행 확인 전까지 Pending |

## Secret and Keystore Policy

보안 기준:

- keystore 파일은 repository에 commit하지 않는다.
- signing password를 코드, 문서, 로그에 기록하지 않는다.
- GitHub Actions secrets 사용 여부는 후속 PR에서 검토한다.
- keystore alias, store password, key password는 실제값 확정 전까지 Pending으로 유지한다.
- 실제 signing 설정 적용은 별도 PR로 분리한다.

## AAB Readiness Notes

AAB 준비 전 확인할 항목:

- Android package name 최종 확인
- versionCode/versionName 정책 확인
- release build type 확인
- signing config 적용 방식 확인
- AAB 생성 명령 확인
- artifact 업로드 방식 확인
- Play Console 내부 테스트 트랙 업로드 준비 확인

모든 항목은 실제 확인 전까지 Pending으로 유지한다.

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- release build 생성 없음
- signing 설정 적용 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- AAB 생성 없음
- Play Console 내부 테스트 업로드 없음
- 실제 기기 QA 없음
- Android native code 변경 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- Gradle 설정 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 로그인 추가 없음
- 서버 DB 추가 없음
- 외부 분석 SDK 추가 없음
- iOS 프로젝트 추가 없음

## Related Docs

- Google Play screenshot production checklist: docs/GOOGLE_PLAY_SCREENSHOT_PRODUCTION_CHECKLIST.md
- Google Play app metadata checklist: docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md
- Google Play data safety draft checklist: docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md
- Privacy policy content draft: docs/PRIVACY_POLICY_CONTENT_DRAFT.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: release workflow design`
   - 실제 release AAB workflow 작성 전 설계 문서 추가

2. `docs: google play internal test checklist`
   - Play Console 내부 테스트 업로드 전 확인 항목 정리

3. `docs: privacy policy url publishing checklist`
   - 개인정보처리방침 초안을 실제 URL로 공개하기 전 준비 항목 정리
