# Release Workflow Design

## Purpose

이 문서는 하루풀이 Android release AAB 생성을 위한 GitHub Actions workflow를 실제 작성하기 전에 설계 기준을 정리한다.

이번 문서는 release workflow 설계 문서이며, 실제 workflow 파일 추가는 포함하지 않는다.

이번 PR에서는 release build, signing 설정, keystore 생성, AAB 생성을 수행하지 않는다.

## Current Build Status

현재 상태:

- Android Debug Build GitHub Actions 사용 중
- Debug APK artifact 생성 가능
- release workflow: Pending
- release build: Pending
- signing 설정: Pending
- keystore 파일: Pending
- AAB 생성: Pending
- Play Console 내부 테스트 업로드: Pending
- 실제 기기 QA: Pending

주의:

- Debug APK 성공은 release build 완료가 아니다.
- Debug APK artifact 생성은 Google Play 업로드 가능 AAB 생성이 아니다.
- release workflow 설계는 실제 release workflow 추가와 분리한다.
- signing 설정 없이 Play Console 업로드용 release AAB를 완료했다고 표시하지 않는다.

## Proposed Release Workflow Scope

후속 release workflow에서 검토할 범위:

| Step | Purpose | Status |
|---|---|---|
| Checkout repository | repository 소스 체크아웃 | Proposed |
| Set up Node.js | web build 환경 준비 | Proposed |
| Install dependencies | npm dependency 설치 | Proposed |
| Build web app | Vite production build 실행 | Proposed |
| Set up JDK | Android build 환경 준비 | Proposed |
| Sync Android project | Capacitor Android sync 실행 | Proposed |
| Decode keystore from secret | GitHub Actions secret 기반 keystore 복원 | Pending design |
| Configure signing env | signing 관련 환경 변수 구성 | Pending design |
| Build release AAB | Gradle bundleRelease 실행 | Pending |
| Upload AAB artifact | release AAB artifact 업로드 | Pending |

주의:

- 이 내용은 설계 초안이며 이번 PR에서는 workflow 파일을 만들지 않는다.
- 실제 keystore secret 이름과 signing env 이름은 후속 PR에서 확정한다.

## Secret and Signing Design Notes

보안 설계 기준:

- keystore 파일은 repository에 commit하지 않는다.
- signing password를 코드, 문서, 로그에 기록하지 않는다.
- GitHub Actions secrets로 관리할 항목은 실제값 확정 전까지 Pending으로 유지한다.
- keystore base64 secret 이름은 후속 PR에서 결정한다.
- store password secret 이름은 후속 PR에서 결정한다.
- key alias secret 이름은 후속 PR에서 결정한다.
- key password secret 이름은 후속 PR에서 결정한다.
- 실제 signing 설정 적용은 별도 PR로 분리한다.

후속 PR에서 검토할 secret 후보:

| Secret candidate | Purpose | Status |
|---|---|---|
| ANDROID_KEYSTORE_BASE64 | keystore 파일 복원용 base64 값 | Pending |
| ANDROID_KEYSTORE_PASSWORD | keystore store password | Pending |
| ANDROID_KEY_ALIAS | signing key alias | Pending |
| ANDROID_KEY_PASSWORD | signing key password | Pending |

주의:

- 이 이름은 후보이며 실제 GitHub Secrets 입력 전 최종 확인이 필요하다.
- 실제 secret 값은 문서에 기록하지 않는다.

## AAB Artifact Policy

AAB artifact 정책:

- release AAB artifact는 실제 생성 전까지 Pending으로 유지한다.
- artifact 이름은 후속 PR에서 결정한다.
- artifact 보관 기간은 후속 PR에서 결정한다.
- 실제 AAB 생성 전에는 Play Console 업로드 완료와 구분한다.
- AAB artifact 생성은 내부 테스트 업로드 완료가 아니다.

## Versioning Review Notes

후속 PR에서 확인할 항목:

- Android package name 최종 확인
- versionCode 정책 확인
- versionName 정책 확인
- release 빌드 전 versionCode 증가 방식 확인
- Play Console 내부 테스트 업로드 전 versionCode 중복 여부 확인

현재 상태:

- package name 최종 확인: Pending
- versionCode 정책: Pending
- versionName 정책: Pending
- Play Console 업로드 가능 여부: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- GitHub Actions release workflow 파일 추가 없음
- release build 생성 없음
- signing 설정 적용 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- GitHub Secrets 실제 입력 없음
- AAB 생성 없음
- AAB artifact 업로드 없음
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

- Android release AAB workflow run result: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md
- Android release AAB workflow: docs/ANDROID_RELEASE_AAB_WORKFLOW.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Google Play app metadata checklist: docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md
- Google Play screenshot production checklist: docs/GOOGLE_PLAY_SCREENSHOT_PRODUCTION_CHECKLIST.md
- Privacy policy content draft: docs/PRIVACY_POLICY_CONTENT_DRAFT.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `ci: add Android release AAB workflow`
   - 설계 문서 기준으로 실제 release AAB workflow 추가

2. `docs: google play internal test checklist`
   - Play Console 내부 테스트 업로드 전 확인 항목 정리

3. `docs: privacy policy url publishing checklist`
   - 개인정보처리방침 초안을 실제 URL로 공개하기 전 준비 항목 정리
