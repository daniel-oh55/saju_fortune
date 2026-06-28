# Play Console Internal Test Upload Checklist

## Play Console App Creation Fields Checklist

- Play Console app creation fields checklist: Added
- Free or paid: Confirmed
- Default language: Confirmed
- App category: Confirmed
- Play Console app creation: Pending
- Actual Google Play Console input: Pending
- Contact email: Pending
- Privacy policy URL: Pending
- Store screenshots upload: Pending
- Data safety form: Pending
- AAB upload to internal test: Pending
- Real device QA: Pending

## Purpose

이 문서는 하루풀이 Android signed AAB를 Google Play Console 내부 테스트 트랙에 업로드하기 전에 확인해야 할 항목을 정리한다.

이번 문서는 업로드 전 체크리스트이며, 실제 Play Console 업로드 결과 기록이 아니다.

## Current Signed AAB Status

| Item | Status | Note |
|---|---|---|
| Android Release AAB run number | Confirmed | 6 |
| Run id | Confirmed | 28310971077 |
| Artifact id | Confirmed | 7930942301 |
| Artifact name | Confirmed | harupuli-release-aab |
| Artifact size | Confirmed | 5,925,298 bytes |
| Artifact digest | Confirmed | sha256:7a2efee684ee16f85d55de4c2e101c88efbf12611c312c9d73cc75084ffc796c |
| `.aab` file existence | Confirmed | app-release.aab |
| `.aab` file size | Confirmed | 6,046,282 bytes |
| signed AAB regeneration | Confirmed | workflow success |
| signed AAB re-verification | Confirmed | workflow jarsigner verified |
| signed AAB artifact download/extract | Confirmed | temporary directory only |

## Pre-upload Checklist

| Item | Status | Note |
|---|---|---|
| Play Console app creation | Pending | not confirmed |
| App name entry | Pending | not confirmed |
| Free or paid | Confirmed | Free |
| Default language | Confirmed | Korean |
| App category | Confirmed | Lifestyle |
| Contact email | Pending | actual value not recorded |
| Privacy policy URL | Pending | actual URL not confirmed |
| Data safety form | Pending | not submitted |
| App access declaration | Pending | not submitted |
| Ads declaration | Pending | no actual ad SDK currently |
| Content rating questionnaire | Pending | not submitted |
| Target audience and content | Pending | not submitted |
| News app declaration | Pending | not submitted |
| Government app declaration | Pending | not submitted |
| Financial features declaration | Pending | not submitted |
| Health features declaration | Pending | not submitted |
| Internal test track creation | Pending | not confirmed |
| Tester email list | Pending | actual emails not recorded |
| AAB upload to internal test | Pending | not uploaded |
| Release notes | Pending | draft only |
| Internal test rollout | Pending | not started |
| Real device install QA | Pending | not performed |

## App Capability Status

| Item | Status | Note |
|---|---|---|
| Server DB | Not used | current app uses localStorage only |
| Login | Not used | no login |
| Payment SDK | Not used | no payment SDK |
| Ad SDK | Not used | no actual ad SDK |
| External analytics SDK | Not used | no external analytics SDK |
| Push notification | Not used | no push SDK |
| Personal data server transfer | Not used | no server transfer confirmed |
| localStorage usage | Used | local app storage only |

## Upload Scope Guardrails

- Play Console internal test upload은 이번 PR에서 진행하지 않는다.
- 실제 Google Play Console 입력은 이번 PR에서 진행하지 않는다.
- 실제 Contact email 값은 문서에 기록하지 않는다.
- 실제 Privacy policy URL은 확정 전까지 Pending으로 유지한다.
- 실제 tester email list는 문서에 기록하지 않는다.
- 실제 release notes는 별도 PR 또는 Play Console 작업에서 확정한다.
- `.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.
- Secret 실제값은 문서, 코드, PR, 로그에 기록하지 않는다.

## Upload Result Status

| Item | Status | Note |
|---|---|---|
| Play Console internal test upload | Pending | not uploaded |
| Actual Google Play Console input | Pending | not completed |
| Internal test rollout | Pending | not started |
| Real device QA | Pending | not performed |

## Non-goals for This PR

- Play Console app creation
- Play Console internal test upload
- Actual Google Play Console input
- Data safety form submission
- Privacy policy URL final confirmation
- Contact email final confirmation
- Store listing text final submission
- Store screenshots upload
- Real device installation QA
- AndroidManifest.xml change
- Android resource change
- Gradle setting change
- Production logic change
- UI/design change
- routing change
- localStorage key change
- schemaVersion change

## Related Docs

- docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md
- docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md
- docs/ANDROID_SIGNING_SETUP_PLAN.md
- docs/ANDROID_SIGNING_SECRETS_CHECKLIST.md
