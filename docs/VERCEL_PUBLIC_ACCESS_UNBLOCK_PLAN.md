# Vercel Public Access Unblock Plan

## Purpose

This document records the current Vercel Login blocked state for the Harupuli static privacy policy page and lists the checks required before the page can be used as a Google Play Console public no-login privacy policy URL.

This document is not a Vercel setting change completion record.

## Current Blocked Status

| Item | Status | Note |
|---|---|---|
| Static page path | Confirmed | public/privacy-policy.html |
| Vercel production deployment check | Confirmed | deployment exists |
| HTTPS request | Confirmed | request completed |
| `/privacy-policy.html` public access | Blocked | Vercel Login response |
| No-login access | Blocked | public access not available |
| Desktop browser check | Blocked | Vercel Login response |
| Mobile browser check | Blocked | Vercel Login response |
| Page title check | Blocked | privacy policy page not returned |
| Privacy policy public URL | Pending | actual URL not recorded |
| Privacy policy URL Play Console input | Pending | not entered |

## Required Vercel Setting Checks

| Item | Status | Note |
|---|---|---|
| Vercel project access protection check | Pending | verify project/deployment protection setting |
| Production deployment public access check | Pending | verify production URL can be opened without login |
| Password protection check | Pending | verify whether password or login protection is enabled |
| Vercel authentication/login requirement check | Pending | verify why Vercel Login is returned |
| Preview deployment protection check | Pending | not required for Play Console, but note if enabled |
| Production redeploy after setting change | Pending | if required |
| `/privacy-policy.html` no-login re-check | Pending | after Vercel setting change |
| Desktop browser re-check | Pending | after Vercel setting change |
| Mobile browser re-check | Pending | after Vercel setting change |
| HTTPS re-check | Pending | after Vercel setting change |

## Play Console Impact

| Item | Status | Note |
|---|---|---|
| Play Console privacy policy URL readiness | Blocked | public no-login access not available yet |
| Privacy policy final URL confirmation | Pending | not confirmed |
| Play Console URL input | Pending | not entered |
| Actual Google Play Console input | Pending | not completed |
| Contact email confirmation | Pending | actual value not recorded |
| Data safety form submission | Pending | not submitted |
| AAB internal test upload | Pending | not uploaded |
| Real device QA | Pending | not performed |

## Required Follow-up

| Item | Status | Note |
|---|---|---|
| Vercel protection setting review | Pending | manual Vercel dashboard action |
| Public no-login access restore | Pending | manual Vercel dashboard action |
| URL accessibility re-check | Pending | separate PR after setting change |
| Privacy policy public URL final confirmation | Pending | separate PR |
| Privacy policy final content confirmation | Pending | separate PR |
| Contact email confirmation | Pending | separate PR or Play Console task |
| Play Console URL input | Pending | separate Play Console task |

## Guardrails

- This PR is not a Vercel setting change completion record.
- The actual Vercel URL string is not recorded in this PR.
- The actual privacy policy URL is not confirmed in this PR.
- Actual Google Play Console input is not performed in this PR.
- Actual contact email value is not recorded in this PR.
- Actual tester email list is not recorded in this PR.
- Privacy policy final content remains Pending.
- Data safety form submission remains Pending.
- AAB internal test upload remains Pending.
- Real device QA remains Pending.
- React routing is not changed.
- Production saju/fortune calculation logic is not changed.
- schemaVersion and existing localStorage keys are not changed.
- `.aab`, `.zip`, `.jks`, and `.keystore` files are not added to the repository.
- Secret actual values are not recorded in docs, code, PR, or logs.

## Non-goals for This PR

- Vercel setting change confirmation
- Public URL final confirmation
- Play Console app creation
- Actual Google Play Console input
- Privacy policy final content confirmation
- Contact email final confirmation
- Data safety form submission
- Play Console internal test upload
- Internal test rollout
- Real device installation QA
- AndroidManifest.xml change
- Android resource change
- Gradle setting change
- Production logic change
- UI/design change
- React routing change
- localStorage key change
- schemaVersion change

## Related Docs

- docs/PRIVACY_POLICY_URL_ACCESSIBILITY_CHECK.md
- docs/PRIVACY_POLICY_HOSTING_OPTIONS.md
- docs/PRIVACY_POLICY_FINALIZATION_READINESS.md
- docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md
- public/privacy-policy.html

