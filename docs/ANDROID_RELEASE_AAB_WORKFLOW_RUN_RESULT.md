# Android Release AAB Workflow Run Result

## Purpose

이 문서는 하루풀이 Android Release AAB workflow의 실제 수동 실행 결과를 기록한다.

이번 PR은 Android signed AAB workflow run result 기록 PR이며, signing Secret 실제값, keystore 파일, Play Console 업로드, 실제 기기 QA는 포함하지 않는다.

## Android Signed Release AAB Workflow Run Result

아래 값은 GitHub Actions의 actual current Android Release AAB workflow run 결과를 기준으로 작성한다.

| Item | Value |
|---|---|
| Workflow | Android Release AAB |
| Trigger | workflow_dispatch |
| Branch | main |
| Run number | 4 |
| Run id | 28293198750 |
| Commit sha | fbf84f5102b75e2b999902b4c4755ba8214d60ef |
| Status | completed |
| Conclusion | success |
| release workflow signing support | Added |
| signed AAB generation | Confirmed |
| Artifact name | harupuli-release-aab |
| Artifact size | 5,875,942 bytes |
| Artifact digest | sha256:6a88573362f259fe6797a4c28a40678a32770e571714a5dd51a47a7351564b98 |
| signed AAB artifact download | Confirmed |
| signed AAB artifact extract | Confirmed |
| `.aab` file existence | Confirmed |
| `.aab` filename | app-release.aab |
| `.aab` file size | 6,016,271 bytes |
| jarsigner result | Failed |
| signed AAB verification | Failed |
| Play Console internal test upload | Pending |
| real device QA | Pending |

Run URL:

- https://github.com/daniel-oh55/saju_fortune/actions/runs/28293198750

## Job Result Summary

| Step | Result |
|---|---|
| Checkout | success |
| Set up Node.js | success |
| Install dependencies | success |
| Build web app | success |
| Set up JDK | success |
| Sync Android project | success |
| Make Gradle wrapper executable | success |
| Restore release keystore | success |
| Build signed release AAB | success |
| Upload release AAB | success |

## Result Details

실제 결과:

- Android Release AAB workflow 수동 실행: completed / success
- release workflow signing support: Added
- signed AAB generation: Confirmed
- artifact name: harupuli-release-aab
- artifact size: 5,875,942 bytes
- artifact digest: sha256:6a88573362f259fe6797a4c28a40678a32770e571714a5dd51a47a7351564b98
- signed AAB artifact download: Confirmed
- signed AAB artifact extract: Confirmed
- `.aab` file existence: Confirmed
- `.aab` filename: app-release.aab
- `.aab` file size: 6,016,271 bytes
- GitHub Actions run number: 4
- GitHub Actions run id: 28293198750
- GitHub Actions commit sha: fbf84f5102b75e2b999902b4c4755ba8214d60ef
- jarsigner result: Failed
- jarsigner result summary: `jar is unsigned.`
- signed AAB verification: Failed
- Play Console internal test upload: Pending
- real device QA: Pending

주의:

- signed AAB generation Confirmed is not Play Console upload complete.
- signed AAB generation Confirmed is not signed AAB verification complete.
- signed AAB generation Confirmed is not real device QA complete.
- signed AAB artifact inspection Confirmed is not signed AAB verification complete.
- signed AAB verification Failed는 Play Console upload complete가 아니다.

## Signing and Upload Status

현재 상태:

- keystore file commit: 없음
- signing password record: 없음
- GitHub Secrets actual values record: 없음
- signed AAB generation: Confirmed
- signed AAB artifact download: Confirmed
- signed AAB artifact extract: Confirmed
- `.aab` file existence: Confirmed
- `.aab` filename: app-release.aab
- `.aab` file size: 6,016,271 bytes
- jarsigner result: Failed
- signed AAB verification: Failed
- Play Console internal test upload: Pending
- actual Google Play Console input: Pending
- real device QA: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- keystore 파일 추가 없음
- `.jks` 파일 추가 없음
- `.keystore` 파일 추가 없음
- signing password 기록 없음
- key alias 실제값 기록 없음
- keystore base64 실제값 기록 없음
- GitHub Secrets 실제값 기록 없음
- Play Console 내부 테스트 업로드 없음
- 실제 Google Play Console 입력 없음
- 실제 기기 QA 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- Gradle 설정 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음

## Related Docs

- Android release AAB workflow: docs/ANDROID_RELEASE_AAB_WORKFLOW.md
- Android release AAB artifact QA: docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md
- Android signing setup plan: docs/ANDROID_SIGNING_SETUP_PLAN.md
- Android signing secrets checklist: docs/ANDROID_SIGNING_SECRETS_CHECKLIST.md
- Android AAB signing verification plan: docs/ANDROID_AAB_SIGNING_VERIFICATION_PLAN.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: record signed AAB artifact verification`
   - artifact download, extract, and signed AAB verification result 기록

2. `docs: google play internal test upload checklist`
   - Play Console internal test upload 전 확인 항목 정리
