# Privacy Policy Hosting Options

## Purpose

이 문서는 하루풀이 개인정보 처리방침을 공개할 hosting location 후보와 선택 기준을 정리한다.

이번 문서는 실제 개인정보 처리방침 URL 확정 기록이 아니다.

## Current Status

| Item | Status | Note |
|---|---|---|
| Privacy policy draft | Confirmed | existing draft document only |
| Privacy policy final content | Pending | not finalized |
| Hosting option selected | Pending | not selected |
| Preferred hosting option | Candidate | Vercel static privacy page |
| Privacy policy public URL | Pending | actual URL not confirmed |
| Privacy policy URL accessibility check | Pending | not checked |
| Privacy policy URL Play Console input | Pending | not entered |
| Contact email | Pending | actual value not recorded |
| Data safety form | Pending | not submitted |
| AAB upload | Pending | not uploaded |
| Real device QA | Pending | not performed |

## Hosting Option Candidates

| Option | Status | Pros | Cons |
|---|---|---|---|
| Vercel static privacy page | Candidate | Same project/repo, stable deployment flow, easy to update with PRs | Requires a later production route/page PR |
| GitHub Pages | Candidate | Simple static hosting, separate from app runtime | Requires Pages setup and URL management |
| Google Sites | Candidate | Easy manual editing, no code change needed | Less tied to repository review history |
| Notion/public document | Candidate | Easy drafting and publishing | Public URL/stability/policy presentation may be less formal |
| External website | Candidate | Flexible and brandable | Requires domain/hosting management |

## Preferred Direction

| Item | Status | Note |
|---|---|---|
| Preferred hosting option | Candidate | Vercel static privacy page |
| Reason | Draft | Same app/repo deployment flow and PR-based review history |
| Actual implementation | Pending | separate PR required |
| Routing change | Pending | not changed in this PR |
| Public URL confirmation | Pending | not confirmed |
| Accessibility check | Pending | not checked |
| Play Console input | Pending | not entered |

## Required Follow-up Before URL Confirmation

| Item | Status | Note |
|---|---|---|
| Privacy policy final content confirmation | Pending | not finalized |
| Contact email confirmation | Pending | actual value not recorded |
| Hosting implementation PR | Pending | not started |
| Production deployment check | Pending | not checked |
| Public URL accessibility check | Pending | not checked |
| Mobile browser check | Pending | not checked |
| No-login access check | Pending | not checked |
| HTTPS check | Pending | not checked |
| Play Console URL input | Pending | not entered |

## Guardrails

- 실제 개인정보 처리방침 URL은 이번 PR에서 기록하지 않는다.
- 실제 개인정보 처리방침 페이지 구현은 이번 PR에서 진행하지 않는다.
- routing 변경은 이번 PR에서 진행하지 않는다.
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

- Privacy policy page implementation
- Privacy policy public URL confirmation
- Privacy policy final content confirmation
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

- docs/PRIVACY_POLICY_FINALIZATION_READINESS.md
- docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md
- docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md
- docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md
- docs/PRIVACY_POLICY_DRAFT.md
