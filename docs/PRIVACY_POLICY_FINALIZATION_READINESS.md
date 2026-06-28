# Privacy Policy Finalization Readiness

## Privacy Policy Hosting Options

- Privacy policy hosting options checklist: Added
- Privacy policy hosting decision: Added
- Hosting option selected: Confirmed / Vercel static privacy page
- Preferred hosting option: Confirmed / Vercel static privacy page
- Privacy policy public URL: Pending
- Privacy policy page implementation: Pending
- Routing change: Pending
- Privacy policy final content: Pending
- URL accessibility check: Pending
- Play Console URL input: Pending

## Purpose

이 문서는 하루풀이 앱의 개인정보 처리방침 최종화 전에 확인해야 할 항목을 정리한다.

이번 문서는 개인정보 처리방침 최종 URL 확정 기록이 아니다.

## Current Privacy Policy Status

| Item | Status | Note |
|---|---|---|
| Privacy policy draft | Confirmed | existing draft document only |
| Privacy policy final content | Pending | not finalized |
| Privacy policy hosting location | Pending | not selected |
| Privacy policy public URL | Pending | actual URL not confirmed |
| Privacy policy URL accessibility check | Pending | not checked |
| Privacy policy URL Play Console input | Pending | not entered |
| Privacy policy actual URL in repository | Not recorded | keep Pending until confirmed |

## Current App Data Handling Basis

| Item | Status | Note |
|---|---|---|
| Server DB | Not used | current app uses localStorage only |
| Login | Not used | no login |
| Account creation | Not used | no account system |
| Payment SDK | Not used | no payment SDK |
| Ad SDK | Not used | no actual ad SDK |
| External analytics SDK | Not used | no external analytics SDK |
| Push notification | Not used | no push SDK |
| Personal data server transfer | Not used | no server transfer confirmed |
| localStorage usage | Used | local app storage only |
| Device-only saved readings | Used | localStorage only |
| Consent/preferences storage | Used | localStorage only |
| Profile/birth info storage | Used | localStorage only |

## Privacy Policy Final Content Checklist

| Item | Status | Note |
|---|---|---|
| App name reflected | Pending | 하루풀이 |
| Data controller/operator section | Pending | actual operator/contact not finalized |
| Contact email section | Pending | actual value not recorded |
| Collected/used data section | Pending | localStorage-based app data only |
| Local storage explanation | Pending | browser/app localStorage |
| No server transfer statement | Pending | current app has no server DB |
| No login/account statement | Pending | current app has no login |
| No payment SDK statement | Pending | current app has no payment SDK |
| No ad SDK statement | Pending | current app has no actual ad SDK |
| No external analytics SDK statement | Pending | current app has no external analytics SDK |
| User deletion/reset guidance | Pending | app/local data deletion guidance needed |
| Third-party sharing section | Pending | no external transfer confirmed |
| Children/age-related section | Pending | wording not finalized |
| Effective date | Pending | actual date not finalized |
| Revision history | Pending | not finalized |

## Hosting Readiness Checklist

| Item | Status | Note |
|---|---|---|
| Hosting option selected | Pending | not selected |
| Public URL format decided | Pending | not decided |
| Mobile accessibility check | Pending | not checked |
| Desktop accessibility check | Pending | not checked |
| No-login access check | Pending | not checked |
| HTTPS access check | Pending | not checked |
| Play Console URL input | Pending | not entered |

## Guardrails

- 실제 개인정보 처리방침 URL은 이번 PR에서 기록하지 않는다.
- 실제 문의 이메일 값은 이번 PR에서 기록하지 않는다.
- 실제 개인정보 처리방침 최종 내용 확정은 이번 PR에서 완료 처리하지 않는다.
- 실제 Play Console 앱 생성은 이번 PR에서 진행하지 않는다.
- 실제 Google Play Console 입력은 이번 PR에서 진행하지 않는다.
- Data safety form 제출은 Pending으로 유지한다.
- AAB 내부 테스트 업로드는 Pending으로 유지한다.
- 실제 기기 QA는 Pending으로 유지한다.
- `.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.
- Secret 실제값은 문서, 코드, PR, 로그에 기록하지 않는다.

## Non-goals for This PR

- Privacy policy final content confirmation
- Privacy policy public URL confirmation
- Contact email final confirmation
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

- docs/PRIVACY_POLICY_DRAFT.md
- docs/PRIVACY_POLICY_HOSTING_OPTIONS.md
- docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md
- docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md
- docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md
- docs/LOCAL_STORAGE_DATA_INVENTORY.md
