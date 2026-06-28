# Play Console App Creation Fields

## Contact and Privacy Readiness

- Privacy policy hosting options checklist: Added
- Preferred hosting option: Candidate
- Privacy policy finalization readiness checklist: Added
- Contact and privacy readiness checklist: Added
- Contact email candidate selected: Pending
- Contact email Play Console input: Pending
- Privacy policy final content: Pending
- Privacy policy public URL: Pending
- Contact email: Pending
- Data safety form: Pending
- Privacy policy URL Play Console input: Pending
- Actual Google Play Console input: Pending
- Real device QA: Pending

## Purpose

이 문서는 하루풀이 앱을 Google Play Console에 생성하기 전에 필요한 입력값의 확정/보류 상태를 정리한다.

이번 문서는 실제 Play Console 입력 결과가 아니다.

## App Creation Field Status

| Field | Status | Note |
|---|---|---|
| App name | Confirmed | 하루풀이 |
| App or game | Confirmed | App |
| Free or paid | Confirmed | Free |
| Default language | Confirmed | Korean |
| App category | Confirmed | Lifestyle |
| Store listing short description | Pending | not finalized |
| Store listing full description | Pending | not finalized |
| Contact email | Pending | actual value not recorded |
| Privacy policy URL | Pending | actual URL not confirmed |
| Developer name | Pending | actual Play Console value not recorded |
| App icon | Pending | final asset not confirmed |
| Feature graphic | Pending | final asset not confirmed |
| Phone screenshots | Pending | 실제 스토어 스크린샷 이미지 제작 필요 |
| Tablet screenshots | Pending | required 여부 확인 필요 |
| Content rating questionnaire | Pending | not submitted |
| Data safety form | Pending | not submitted |
| App access declaration | Pending | not submitted |
| Ads declaration | Pending | no actual ad SDK currently |
| Target audience and content | Pending | not submitted |
| Internal test track | Pending | not created |
| Tester list | Pending | actual emails not recorded |
| AAB upload | Pending | not uploaded |
| Internal test rollout | Pending | not started |
| Real device QA | Pending | not performed |

## App Creation Field Decision Result

| Field | Status | Note |
|---|---|---|
| App name | Confirmed | 하루풀이 |
| App or game | Confirmed | App |
| Free or paid | Confirmed | Free |
| Default language | Confirmed | Korean |
| App category | Confirmed | Lifestyle |
| Store listing short description | Pending | not finalized |
| Store listing full description | Pending | not finalized |
| Contact email | Pending | actual value not recorded |
| Privacy policy URL | Pending | actual URL not confirmed |
| Developer name | Pending | actual Play Console value not recorded |
| App icon | Pending | final asset not confirmed |
| Feature graphic | Pending | final asset not confirmed |
| Phone screenshots | Pending | 실제 스토어 스크린샷 이미지 제작 필요 |
| Tablet screenshots | Pending | required 여부 확인 필요 |
| Content rating questionnaire | Pending | not submitted |
| Data safety form | Pending | not submitted |
| App access declaration | Pending | not submitted |
| Ads declaration | Pending | no actual ad SDK currently |
| Target audience and content | Pending | not submitted |
| Internal test track | Pending | not created |
| Tester list | Pending | actual emails not recorded |
| AAB upload | Pending | not uploaded |
| Internal test rollout | Pending | not started |
| Real device QA | Pending | not performed |

주의:

- 이번 결정은 Play Console 입력 완료가 아니다.
- 실제 Play Console 앱 생성은 별도 작업에서 진행한다.
- 실제 Contact email 값은 문서에 기록하지 않는다.
- 실제 Privacy policy URL은 확정 전까지 Pending으로 유지한다.
- 실제 tester email list는 문서에 기록하지 않는다.
- 실제 스토어 스크린샷 이미지 제작은 Pending으로 유지한다.
- Data safety form 제출은 Pending으로 유지한다.
- AAB 내부 테스트 업로드는 Pending으로 유지한다.
- 실제 기기 QA는 Pending으로 유지한다.

## Confirmed Technical Status

| Item | Status | Note |
|---|---|---|
| Signed AAB generation | Confirmed | Android Release AAB run number 6 |
| Signed AAB re-verification | Confirmed | workflow jarsigner verified |
| AAB filename | Confirmed | app-release.aab |
| AAB file size | Confirmed | 6,046,282 bytes |
| Artifact name | Confirmed | harupuli-release-aab |
| Artifact id | Confirmed | 7930942301 |
| Artifact digest | Confirmed | sha256:7a2efee684ee16f85d55de4c2e101c88efbf12611c312c9d73cc75084ffc796c |

## Current App Capability Status

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

## Guardrails

- 실제 Play Console 앱 생성은 이번 PR에서 진행하지 않는다.
- 실제 Google Play Console 입력은 이번 PR에서 진행하지 않는다.
- 실제 문의 이메일 값은 문서에 기록하지 않는다.
- 실제 개인정보 처리방침 URL은 확정 전까지 Pending으로 유지한다.
- 실제 테스터 이메일 목록은 문서에 기록하지 않는다.
- 실제 스토어 스크린샷 이미지 제작은 Pending으로 유지한다.
- Data safety form 제출은 Pending으로 유지한다.
- AAB 내부 테스트 업로드는 Pending으로 유지한다.
- 실제 기기 QA는 Pending으로 유지한다.
- `.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.
- Secret 실제값은 문서, 코드, PR, 로그에 기록하지 않는다.

## Non-goals for This PR

- Play Console app creation
- Actual Google Play Console input
- Play Console internal test upload
- Data safety form submission
- Privacy policy URL final confirmation
- Contact email final confirmation
- Store listing final submission
- Store screenshots upload
- Internal test rollout
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

- docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md
- docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md
- docs/PRIVACY_POLICY_FINALIZATION_READINESS.md
- docs/PRIVACY_POLICY_HOSTING_OPTIONS.md
- docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md
- docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md
- docs/ANDROID_SIGNING_SETUP_PLAN.md
