# Android AAB Signing Verification Plan

## Purpose

이 문서는 하루풀이 Android Release AAB artifact `app-release.aab`의 signing 상태를 실제 확인하기 위한 기준과 절차를 정리한다.

이번 문서는 signing verification 계획 문서이며, signing 설정 적용이나 keystore 추가를 포함하지 않는다.

## Current Artifact Status

| Item | Status | Note |
|---|---|---|
| Android Release AAB workflow run number 3 | Confirmed | completed / success |
| AAB artifact name | Confirmed | harupuli-release-aab |
| artifact 다운로드 | Confirmed | PR #187 기준 |
| artifact 압축 해제 | Confirmed | PR #187 기준 |
| `.aab` 파일 존재 확인 | Confirmed | app-release.aab |
| AAB 파일 크기 | Confirmed | 6,016,271 bytes |
| signing 상태 확인 | Confirmed | jarsigner 기준 Unsigned |
| Play Console 업로드 가능 여부 | Pending | 실제 업로드 전까지 Pending |
| 실제 기기 QA | Pending | 실제 설치/실행 전까지 Pending |

## Signing Verification Questions

확인해야 할 질문:

1. 현재 `app-release.aab`가 서명되어 있는가?
2. 현재 signing 상태가 Play Console 업로드에 적합한가?
3. 별도 upload key/keystore가 필요한가?
4. GitHub Actions release workflow에 signing 설정을 추가해야 하는가?
5. signing 설정 추가 시 GitHub Secrets로 관리해야 할 항목은 무엇인가?
6. signing 검증 결과와 Play Console 내부 테스트 업로드 가능 여부를 어떻게 구분할 것인가?

현재 답변 상태:

- signing 상태: Pending
- Play Console 업로드 가능 여부: Pending
- upload key/keystore 필요 여부: Pending
- GitHub Secrets 필요 여부: Pending

## Proposed Verification Commands

후속 PR에서 검토할 명령 후보:

```bash
jarsigner -verify -verbose -certs app-release.aab
```

가능한 경우 Android build tools의 apksigner 사용 가능 여부도 확인한다.

```bash
apksigner verify --verbose app-release.aab
```

## Signing Verification Result

실제 확인 결과:

- signing 검증 명령 실제 실행: Confirmed
- artifact 확인 위치: 임시 디렉터리
- AAB 파일명: app-release.aab
- AAB 파일 크기: 6,016,271 bytes
- jarsigner 실행 가능 여부: Confirmed
- jarsigner command: `jarsigner -verify -verbose -certs app-release.aab`
- jarsigner result: Unsigned
- jarsigner result summary: `jar is unsigned.`
- apksigner 실행 가능 여부: Not available
- apksigner result: Not available
- signing 상태 확인 결과: Unsigned
- Play Console 업로드 가능 여부: Pending
- signing setup plan: Required
- GitHub Secrets 실제 입력: Pending
- Play Console 내부 테스트 업로드: Pending
- 실제 Google Play Console 입력: Pending
- 실제 기기 QA: Pending

주의:

- Signed는 Play Console 업로드 완료가 아니다.
- Signed는 실제 기기 QA 완료가 아니다.
- Unsigned는 바로 signing 설정을 적용한다는 뜻이 아니다.
- signing setup은 별도 PR에서 진행한다.
- keystore 파일을 repository에 추가하지 않는다.
- signing password를 문서나 로그에 기록하지 않는다.

주의:

- 실제 명령 실행 결과는 PR #189에서 기록했다.
- 후속 PR에서는 signing setup plan을 별도로 검토한다.
- 명령 실행이 실패하더라도 실패 결과를 그대로 기록한다.
- signing 설정을 즉시 적용하지 않는다.
- keystore를 repository에 추가하지 않는다.
- signing password를 문서나 로그에 기록하지 않는다.

## Expected Result Categories

후속 PR에서는 결과를 아래 중 하나로 기록한다.

| Result | Meaning | Next Step |
|---|---|---|
| Signed | AAB signing 확인됨 | Play Console 업로드 가능 여부 별도 검토 |
| Unsigned | AAB signing 확인 안 됨 | signing setup plan 필요 |
| Unknown | 도구/명령 제한으로 확인 불가 | 추가 검증 방법 조사 |
| Failed | 검증 명령 실행 실패 | 실패 원인 기록 및 후속 조치 |

주의:

- Signed는 Play Console 업로드 완료가 아니다.
- Signed는 실제 기기 QA 완료가 아니다.
- Unsigned는 바로 signing 설정을 적용한다는 뜻이 아니다.
- signing setup은 별도 PR에서 진행한다.

## Secret and Keystore Policy

보안 기준:

- keystore 파일을 repository에 commit하지 않는다.
- signing password를 코드, 문서, 로그에 기록하지 않는다.
- GitHub Secrets 실제값을 문서에 기록하지 않는다.
- signing 설정 적용은 별도 plan PR이 필요하다.
- upload key 생성 여부는 후속 PR에서 검토한다.

## Current Pending Items

- signing 상태 확인: Confirmed
- signing 상태 확인 결과: Unsigned
- signing 검증 명령 실제 실행: Confirmed
- Play Console 업로드 가능 여부: Pending
- signing setup plan: Required
- GitHub Secrets 실제 입력: Pending
- Play Console 내부 테스트 업로드: Pending
- 실제 Google Play Console 입력: Pending
- 실제 기기 QA: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- signing 설정 적용 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- GitHub Secrets 실제 입력 없음
- Play Console 내부 테스트 업로드 없음
- 실제 Google Play Console 입력 없음
- 실제 기기 QA 없음
- workflow 파일 변경 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- Gradle 설정 변경 없음
- artifact zip 파일 commit 없음
- `.aab` 파일 commit 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음

## Related Docs

- Android signing setup plan: docs/ANDROID_SIGNING_SETUP_PLAN.md
- Android release AAB artifact QA: docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md
- Android release AAB workflow run result: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md
- Android release AAB workflow: docs/ANDROID_RELEASE_AAB_WORKFLOW.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: record Android AAB signing verification result`
   - `app-release.aab` signing 상태 확인 결과 기록

2. `docs: signing setup plan`
   - 실제 signing 설정 및 keystore/secrets 운영 계획 정리

3. `docs: google play internal test checklist`
   - Play Console 내부 테스트 업로드 전 확인 항목 정리
