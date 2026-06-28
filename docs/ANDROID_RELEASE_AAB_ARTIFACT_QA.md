# Android Release AAB Artifact QA

## Play Console Internal Test Upload Checklist

- Play Console internal test upload checklist: Added
- Play Console internal test upload: Pending
- Actual Google Play Console input: Pending
- Real device QA: Pending

## Android Release AAB Run 6 Artifact Inspection Result

| Item | Status | Note |
|---|---|---|
| Source workflow | Confirmed | Android Release AAB run number 6 |
| Run id | Confirmed | 28310971077 |
| Artifact id | Confirmed | 7930942301 |
| Artifact name | Confirmed | harupuli-release-aab |
| Artifact size | Confirmed | 5,925,298 bytes |
| Artifact digest | Confirmed | sha256:7a2efee684ee16f85d55de4c2e101c88efbf12611c312c9d73cc75084ffc796c |
| artifact download | Confirmed | temporary directory only |
| artifact extract | Confirmed | temporary directory only |
| `.aab` file existence | Confirmed | app-release.aab |
| `.aab` filename | Confirmed | app-release.aab |
| `.aab` file size | Confirmed | 6,046,282 bytes |
| artifact zip repository commit | Not committed | zip file not committed |
| `.aab` repository commit | Not committed | `.aab` file not committed |
| signed AAB re-verification | Confirmed | workflow jarsigner verified |
| Play Console internal test upload | Pending | not uploaded |
| real device QA | Pending | not performed |

주의:

- artifact inspection Confirmed는 Play Console 업로드 완료가 아니다.
- artifact inspection Confirmed는 실제 기기 QA 완료가 아니다.
- Play Console internal test upload는 별도 PR에서 기록한다.
- 실제 기기 QA는 별도 PR에서 기록한다.
- `.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.
- Secret 실제값은 기록하지 않는다.

## Android Release AAB Secret Correction Rerun Result

- ANDROID_KEYSTORE_BASE64 configuration: Confirmed
- Android Release AAB run number 6: completed / success
- Run id: 28310971077
- signed AAB regeneration: Confirmed
- signed AAB re-verification: Confirmed
- Artifact count: Confirmed 1
- Artifact name: harupuli-release-aab
- Artifact size: 5,925,298 bytes
- Artifact digest: sha256:7a2efee684ee16f85d55de4c2e101c88efbf12611c312c9d73cc75084ffc796c
- signed AAB artifact download/extract: Pending
- Play Console internal test upload: Pending
- real device QA: Pending

주의:

- artifact 다운로드/압축 해제 확인은 이번 PR에서 진행하지 않았다.
- `.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않았다.

## Android Release AAB Enforced Rerun Result

- Android Release AAB enforced rerun result: Failed
- Run number: 5
- Run id: 28309520915
- Failed step: Validate release signing secrets
- signed AAB regeneration: Failed
- signed AAB re-verification: Pending
- Artifact created: Not created
- Artifact name: Not created
- Artifact size: Not created
- Artifact digest: Pending
- signed AAB artifact download/extract: Pending
- Play Console internal test upload: Pending
- real device QA: Pending

주의:

- artifact가 생성되지 않았으므로 `.aab` 다운로드/압축 해제 확인은 진행하지 않았다.
- `.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않았다.
- Play Console internal test upload는 별도 PR에서 기록한다.

## Android Release Signing Enforcement Follow-up

- previous signed AAB verification: Failed
- previous jarsigner result summary: `jar is unsigned.`
- signing enforcement fix: Added
- release signing secrets validation: Added
- workflow jarsigner verification step: Added
- Gradle release signing env enforcement: Added
- signed AAB artifact regeneration: Pending
- signed AAB artifact re-inspection: Pending
- signed AAB regeneration: Pending
- signed AAB re-verification: Pending
- Play Console internal test upload: Pending
- real device QA: Pending

주의:

- signing enforcement fix Added는 signed AAB 재검증 완료가 아니다.
- signed AAB regeneration은 workflow 재실행 후 별도 PR에서 기록한다.
- signed AAB re-verification은 workflow 재실행 후 별도 PR에서 기록한다.

## Purpose

이 문서는 하루풀이 Android Release AAB workflow run number 4에서 생성된 signed AAB artifact의 QA 확인 항목을 정리한다.

이번 문서는 signed AAB generation Confirmed 상태와 signed AAB artifact inspection 결과를 기록한다.

## Artifact Metadata

| Item | Value |
|---|---|
| Workflow | Android Release AAB |
| Run number | 4 |
| Run id | 28293198750 |
| Branch | main |
| Status | completed |
| Conclusion | success |
| Artifact name | harupuli-release-aab |
| Artifact size | 5,875,942 bytes |
| Artifact digest | sha256:6a88573362f259fe6797a4c28a40678a32770e571714a5dd51a47a7351564b98 |
| Artifact 확인 | Confirmed |
| signed AAB generation | Confirmed |
| signed AAB verification | Failed |

Run metadata:

- Android Release AAB run number 4: completed / success
- Artifact digest: sha256:6a88573362f259fe6797a4c28a40678a32770e571714a5dd51a47a7351564b98

주의:

- AAB artifact 생성은 Play Console 업로드 완료가 아니다.
- AAB artifact 생성은 실제 기기 QA 완료가 아니다.
- AAB artifact 생성은 signing 설정 완료가 아니다.
- Play Console 업로드 가능 여부는 별도 검토가 필요하다.

## Signed AAB Artifact Inspection Result

| Item | Status | Note |
|---|---|---|
| signed AAB artifact download | Confirmed | temporary directory only |
| signed AAB artifact extract | Confirmed | temporary directory only |
| `.aab` file existence | Confirmed | app-release.aab |
| `.aab` filename | Confirmed | app-release.aab |
| `.aab` file size | Confirmed | 6,016,271 bytes |
| artifact zip repository commit | Not committed | zip file not committed |
| `.aab` repository commit | Not committed | `.aab` file not committed |
| signed AAB verification | Failed | jarsigner result: jar is unsigned |
| Play Console internal test upload | Pending | not uploaded |
| real device QA | Pending | not performed |

주의:

- signed AAB artifact inspection Confirmed는 signed AAB verification 완료가 아니다.
- signed AAB artifact inspection Confirmed는 Play Console 업로드 완료가 아니다.
- signed AAB artifact inspection Confirmed는 실제 기기 QA 완료가 아니다.
- signed AAB verification은 Failed로 기록하며, 실패 원인은 Secret 실제값 없이 `jar is unsigned.`로만 요약한다.

## Artifact QA Checklist

| Item | Status | Note |
|---|---|---|
| AAB artifact 생성 확인 | Confirmed | run number 4 기준 |
| AAB artifact name 확인 | Confirmed | harupuli-release-aab |
| AAB artifact size 기록 | Confirmed | 5,875,942 bytes |
| AAB artifact digest 기록 | Confirmed | sha256 기록 |
| artifact 다운로드 | Confirmed | signed AAB artifact 기준 |
| artifact 압축 해제 | Confirmed | signed AAB artifact 기준 |
| `.aab` 파일 존재 확인 | Confirmed | app-release.aab |
| AAB 파일명 기록 | Confirmed | app-release.aab |
| AAB 파일 크기 기록 | Confirmed | 6,016,271 bytes |
| Play Console 업로드 가능 여부 | Pending | 실제 업로드 전까지 Pending |
| signing 상태 확인 | Failed | jarsigner result: jar is unsigned |
| 실제 기기 QA | Pending | 실제 설치/실행 확인 전까지 Pending |

## Download and Inspection Notes

후속 PR에서 확인할 항목:

- GitHub Actions artifact 다운로드
- artifact zip 압축 해제
- zip 내부 `.aab` 파일 존재 확인
- AAB 파일명 기록
- AAB 파일 크기 기록
- AAB 파일 보관 위치 기록
- signing 상태 확인 가능 여부 검토
- Play Console 내부 테스트 업로드 전 추가 요구사항 확인

현재 상태:

- signed AAB generation: Confirmed
- artifact 다운로드: Confirmed
- artifact 압축 해제: Confirmed
- `.aab` 파일 존재 확인: Confirmed
- AAB 파일명: app-release.aab
- AAB 파일 크기: 6,016,271 bytes
- artifact 확인 위치: temporary directory only
- repository commit 여부: artifact zip과 `.aab` 파일은 commit하지 않음
- signing 상태 확인: Failed
- Play Console 내부 테스트 업로드: Pending

주의:

- artifact 다운로드/압축 해제 확인은 Play Console 업로드 완료가 아니다.
- `.aab` 파일 존재 확인은 signing 설정 완료가 아니다.
- `.aab` 파일 존재 확인은 실제 기기 QA 완료가 아니다.

## Signing and Upload Status

현재 상태:

- signing 검증 명령 실제 실행: Confirmed
- signing 상태 확인 결과: Failed
- jarsigner result: Failed
- jarsigner result summary: `jar is unsigned.`
- apksigner result: Not available
- Play Console 업로드 가능 여부: Pending
- signing setup plan: Required
- release workflow signing support: Added
- signing 설정: Added
- signed AAB generation: Confirmed
- signed AAB artifact QA: Confirmed
- signed AAB verification: Failed
- keystore 파일 추가: 없음
- signing password 기록: 없음
- GitHub Secrets 실제 입력: Confirmed
- Play Console 내부 테스트 업로드: Pending
- 실제 Google Play Console 입력: Pending
- 실제 기기 QA: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- signed AAB 검증 결과 기록: Failed
- keystore 파일 추가 없음
- signing password 기록 없음
- GitHub Secrets 실제값 기록 없음
- Play Console 내부 테스트 업로드 없음
- 실제 Google Play Console 입력 없음
- 실제 기기 QA 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음

## Related Docs

- Android signing setup plan: docs/ANDROID_SIGNING_SETUP_PLAN.md
- Android AAB signing verification plan: docs/ANDROID_AAB_SIGNING_VERIFICATION_PLAN.md
- Android release AAB workflow run result: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md
- Android release AAB workflow: docs/ANDROID_RELEASE_AAB_WORKFLOW.md
- Release workflow design: docs/RELEASE_WORKFLOW_DESIGN.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: record Android release AAB artifact inspection`
   - artifact 다운로드/압축 해제/내부 `.aab` 파일 확인 결과 기록

2. `docs: signing setup plan`
   - 실제 signing 설정 전 keystore/secrets 운영 계획 정리

3. `docs: google play internal test checklist`
   - Play Console 내부 테스트 업로드 전 확인 항목 정리
