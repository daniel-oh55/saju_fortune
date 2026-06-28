# Android Release AAB Workflow

## Android Release AAB Secret Correction Rerun Result

- ANDROID_KEYSTORE_BASE64 configuration: Confirmed
- Android Release AAB run number 6: completed / success
- Run id: 28310971077
- Commit sha: c2c6f21db45d5cb9605a0133100e1fcb09569b42
- Validate release signing secrets: Confirmed
- Restore release keystore: Confirmed
- Build signed release AAB: Confirmed
- Verify signed release AAB: Confirmed
- Upload release AAB: Confirmed
- signed AAB regeneration: Confirmed
- signed AAB re-verification: Confirmed
- Artifact count: Confirmed 1
- Artifact name: harupuli-release-aab
- Artifact size: 5,925,298 bytes
- Artifact digest: sha256:7a2efee684ee16f85d55de4c2e101c88efbf12611c312c9d73cc75084ffc796c
- signed AAB artifact download/extract: Pending
- Play Console internal test upload: Pending
- real device QA: Pending
- Secret actual values: Not recorded

주의:

- Secret 실제값은 기록하지 않는다.
- `.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.

## Android Release AAB Enforced Rerun Result

- Android Release AAB enforced rerun result: Failed
- Run number: 5
- Run id: 28309520915
- Branch: main
- Commit sha: ed5f2a415de6bd0971274d6f87e4f25f99ae961d
- Status: completed
- Conclusion: failure
- Failed step: Validate release signing secrets
- Failure summary: `ANDROID_KEYSTORE_BASE64 is not configured`
- Validate release signing secrets: Failed
- Restore release keystore: Not reached
- Build signed release AAB: Not reached
- Verify signed release AAB: Not reached
- Upload release AAB: Not reached
- unsigned artifact upload prevention: Confirmed
- signed AAB regeneration: Failed
- signed AAB re-verification: Pending
- Artifact created: Not created
- Artifact name: Not created
- Play Console internal test upload: Pending
- real device QA: Pending

주의:

- Secret 실제값은 기록하지 않는다.
- keystore base64 실제값, signing password, key alias 실제값은 기록하지 않는다.
- `.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.

## Android Release Signing Enforcement Update

- previous signed AAB verification: Failed
- previous jarsigner result summary: `jar is unsigned.`
- signing enforcement fix: Added
- release signing secrets validation: Added
- Validate release signing secrets step: Added
- workflow jarsigner verification step: Added
- Verify signed release AAB step: Added
- artifact upload after verification: Added
- Gradle release signing env enforcement: Added
- signed AAB regeneration: Pending
- signed AAB re-verification: Pending
- Play Console internal test upload: Pending
- real device QA: Pending

주의:

- signing enforcement fix Added는 signed AAB 재검증 완료가 아니다.
- signed AAB regeneration은 workflow 재실행 후 별도 PR에서 기록한다.
- signed AAB re-verification은 workflow 재실행 후 별도 PR에서 기록한다.

## Purpose

이 문서는 하루풀이 Android release AAB GitHub Actions workflow 추가 내용을 정리한다.

이번 PR에서는 Android release AAB workflow에 GitHub Secrets 기반 signing support를 추가한다.
keystore 파일은 repository에 추가하지 않는다.

이번 PR에서는 Play Console 업로드를 수행하지 않는다.

## Workflow Status

- Android release AAB workflow 파일 추가: Added
- Node.js version: 22
- Node.js version 보정: 20에서 22로 변경
- workflow_dispatch 수동 실행: Added
- GitHub Secrets 기반 signing support: Added
- keystore runner temp 임시 복원: Added
- release build 실행 시도: Pending workflow run
- signing 설정: Added
- keystore 파일: Not committed
- GitHub Secrets 실제 입력: Confirmed
- signed AAB generation: Confirmed
- signed AAB verification: Failed
- AAB artifact 확인: Confirmed
- signed AAB artifact download: Confirmed
- signed AAB artifact extract: Confirmed
- Play Console 내부 테스트 업로드: Pending
- 실제 기기 QA: Pending

## Workflow File

- `.github/workflows/android-release-aab.yml`

## Workflow Steps

예상 단계:

- Checkout repository
- Set up Node.js 22
- Install dependencies
- Build web app
- Set up JDK
- Sync Android project
- Make Gradle wrapper executable
- Restore release keystore
- Build signed release AAB
- Upload release AAB

Signing support details:

- `ANDROID_KEYSTORE_BASE64`를 runner temp의 임시 keystore 파일로 복원한다.
- `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`는 workflow env로만 전달한다.
- 임시 keystore 파일은 repository tracked file이 아니다.
- secrets 값은 log로 출력하지 않는다.

## Signing Status

현재 signing 상태:

- release workflow signing support: Added
- signing 설정: Added
- keystore 파일 commit: 없음
- signing password 기록: 없음
- GitHub Secrets 실제 입력: Confirmed
- signed AAB generation: Confirmed
- signed AAB verification: Failed

주의:

- keystore 파일은 repository에 commit하지 않는다.
- signing password를 코드, 문서, 로그에 기록하지 않는다.
- 실제 Play Console 업로드 가능 여부는 signing 설정 후 별도 확인한다.

## AAB Artifact Status

현재 AAB 상태:

- release AAB workflow 추가: Added
- release workflow signing support: Added
- AAB 생성 결과: Confirmed
- AAB artifact 확인: Confirmed
- Android Release AAB run number 4: completed / success
- Android Release AAB run id: 28293198750
- AAB artifact `harupuli-release-aab`: Confirmed
- AAB artifact size: 5,875,942 bytes
- Artifact digest: sha256:6a88573362f259fe6797a4c28a40678a32770e571714a5dd51a47a7351564b98
- signed AAB artifact download: Confirmed
- signed AAB artifact extract: Confirmed
- `.aab` file existence: Confirmed
- `.aab` filename: app-release.aab
- `.aab` file size: 6,016,271 bytes
- signed AAB verification: Failed
- jarsigner result: Failed
- jarsigner result summary: `jar is unsigned.`
- signing 설정: Added
- Play Console 내부 테스트 업로드: Pending
- 실제 기기 QA: Pending
- Play Console 업로드: Pending

주의:

- AAB artifact 생성은 Play Console 업로드 완료가 아니다.
- signing 설정이 없는 AAB는 Play Console 업로드 가능 상태가 아닐 수 있다.
- 실제 내부 테스트 업로드 전 별도 QA와 signing 확인이 필요하다.

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- signed AAB verification 결과 기록: Failed
- keystore 파일 추가 없음
- signing password 기록 없음
- GitHub Secrets 실제값 기록 없음
- Play Console 내부 테스트 업로드 없음
- 실제 기기 QA 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
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

- Android release AAB artifact QA: docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md
- Android release AAB workflow run result: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md
  - current `.github/workflows/android-release-aab.yml` 기준 수동 실행 결과 문서
- Release workflow design: docs/RELEASE_WORKFLOW_DESIGN.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Google Play app metadata checklist: docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: android release AAB workflow run result`
   - release AAB workflow 수동 실행 결과 기록

2. `docs: signing setup plan`
   - 실제 signing 설정 전 keystore/secrets 운영 계획 정리

3. `docs: google play internal test checklist`
   - Play Console 내부 테스트 업로드 전 확인 항목 정리
