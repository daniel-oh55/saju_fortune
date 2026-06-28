# Play Console Contact and Privacy Readiness

## Privacy Policy Hosting Options

- Privacy policy hosting options checklist: Added
- Privacy policy hosting decision: Added
- Static privacy policy page draft: Added
- Static page path: Confirmed / public/privacy-policy.html
- Privacy policy page draft implementation: Confirmed
- Hosting option selected: Confirmed
- Preferred hosting option: Confirmed
- Privacy policy public URL: Pending
- Privacy policy URL accessibility check: Pending
- Privacy policy URL Play Console input: Pending
- Contact email: Pending
- Data safety form: Pending
- AAB upload: Pending
- Real device QA: Pending

## Privacy Policy URL Accessibility Check

- Privacy policy URL accessibility check document: Added
- Static page path: Confirmed / public/privacy-policy.html
- Vercel production deployment check: Confirmed
- /privacy-policy.html public access: Blocked
- HTTPS access check: Confirmed
- No-login access check: Blocked
- Desktop browser check: Blocked
- Mobile browser check: Blocked
- Contact email: Pending
- Privacy policy public URL: Pending
- Privacy policy URL Play Console input: Pending
- Data safety form: Pending
- AAB upload: Pending
- Real device QA: Pending

## Privacy Policy Finalization Readiness

- Privacy policy finalization readiness checklist: Added
- Privacy policy final content: Pending
- Privacy policy hosting location: Pending
- Privacy policy public URL: Pending
- Privacy policy URL accessibility check: Pending
- Privacy policy URL Play Console input: Pending
- Contact email: Pending
- Data safety form: Pending
- AAB upload: Pending
- Real device QA: Pending

## Purpose

이 문서는 하루풀이 앱의 Google Play Console 입력 전에 문의 이메일과 개인정보 처리방침 URL 확정 준비 상태를 정리한다.

이번 문서는 실제 문의 이메일 값 또는 실제 개인정보 처리방침 URL 확정 기록이 아니다.

## Current Status

| Item | Status | Note |
|---|---|---|
| App name | Confirmed | 하루풀이 |
| App or game | Confirmed | App |
| Free or paid | Confirmed | Free |
| Default language | Confirmed | Korean |
| App category | Confirmed | Lifestyle |
| Contact email | Pending | actual value not recorded |
| Privacy policy URL | Pending | actual URL not confirmed |
| Developer name | Pending | actual Play Console value not recorded |
| Play Console app creation | Pending | not created |
| Actual Google Play Console input | Pending | not completed |
| Data safety form | Pending | not submitted |
| AAB upload | Pending | not uploaded |
| Real device QA | Pending | not performed |

## Contact Email Readiness

| Item | Status | Note |
|---|---|---|
| Contact email candidate selected | Pending | actual email not recorded |
| Contact email accessibility check | Pending | not checked |
| Contact email display policy | Pending | not confirmed |
| Contact email Play Console input | Pending | not entered |
| Contact email actual value in repository | Not recorded | keep private from docs and PRs |

## Privacy Policy URL Readiness

| Item | Status | Note |
|---|---|---|
| Privacy policy draft | Confirmed | existing draft document only |
| Privacy policy final content | Pending | not finalized |
| Privacy policy hosting location | Pending | not selected |
| Privacy policy public URL | Pending | actual URL not confirmed |
| Privacy policy URL accessibility check | Pending | not checked |
| Privacy policy URL Play Console input | Pending | not entered |
| Privacy policy actual URL in repository | Not recorded | keep Pending until confirmed |

## Current App Data Handling Summary

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

- 실제 문의 이메일 값은 이번 PR에서 기록하지 않는다.
- 실제 개인정보 처리방침 URL은 확정 전까지 Pending으로 유지한다.
- 실제 테스터 이메일 목록은 이번 PR에서 기록하지 않는다.
- 실제 Play Console 앱 생성은 이번 PR에서 진행하지 않는다.
- 실제 Google Play Console 입력은 이번 PR에서 진행하지 않는다.
- Data safety form 제출은 Pending으로 유지한다.
- AAB 내부 테스트 업로드는 Pending으로 유지한다.
- 실제 기기 QA는 Pending으로 유지한다.
- `.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.
- Secret 실제값은 문서, 코드, PR, 로그에 기록하지 않는다.

## Non-goals for This PR

- Contact email final confirmation
- Privacy policy URL final confirmation
- Play Console app creation
- Actual Google Play Console input
- Data safety form submission
- Play Console internal test upload
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

- docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md
- docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md
- docs/PRIVACY_POLICY_DRAFT.md
- docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md
