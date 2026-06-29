# Play Console Actual Input Readiness

## Purpose

This document consolidates the confirmed values and remaining Pending tasks before manually entering information into Google Play Console for 하루풀이.

This document is not Google Play Console input completion.

## Confirmed Values Ready for Console

| Item | Status | Value |
|---|---|---|
| App name | Confirmed | 하루풀이 |
| App type | Confirmed | App |
| Free/Paid | Confirmed | Free |
| Default language | Confirmed | Korean |
| Category | Confirmed | Lifestyle |
| Contact email | Confirmed | support.hym@gmail.com |
| Privacy policy public URL | Confirmed | https://saju-fortune-nu.vercel.app/privacy-policy.html |
| Privacy policy final content confirmation | Confirmed | completed |
| Google Play Data safety form final review | Confirmed | completed |

## Data Safety Input Basis

| Item | Status | Note |
|---|---|---|
| Server DB | Not used | no backend database |
| Login/account creation | Not used | no account system |
| Payment SDK | Not used | no payment integration |
| Actual ad SDK | Not used | no real ad SDK integration |
| External analytics SDK | Not used | no external analytics SDK |
| Push notification SDK | Not used | no push notification SDK |
| Personal data server transfer | Not used | data is not sent to a server |
| localStorage | Used | device-local browser/app storage |
| Data safety final review | Confirmed | ready for manual Console input |

## Pending Console Inputs

| Item | Status | Note |
|---|---|---|
| Play Console app creation | Pending | not completed |
| Actual Google Play Console input | Pending | not completed |
| Privacy policy URL Play Console input | Pending | not entered |
| Actual Google Play Console Data safety input | Pending | not completed |
| Data safety form submission | Pending | not submitted |
| App access declaration | Pending | not completed |
| Ads declaration | Pending | not completed |
| Content rating questionnaire | Pending | not completed |
| Target audience and content | Pending | not completed |
| Store listing short description | Pending | not finalized |
| Store listing full description | Pending | not finalized |
| App icon | Pending | not finalized |
| Feature graphic | Pending | not finalized |
| 실제 스토어 스크린샷 이미지 제작 | Pending | not created |
| AAB internal test upload | Pending | not uploaded |
| Real device QA | Pending | not performed |

## Manual Console Entry Checklist

| Step | Status | Note |
|---|---|---|
| Create Play Console app | Pending | manual Console task |
| Enter app name | Pending | 하루풀이 |
| Enter default language | Pending | Korean |
| Select app/free/category fields | Pending | App / Free / Lifestyle |
| Enter contact email | Pending | support.hym@gmail.com |
| Enter privacy policy URL | Pending | https://saju-fortune-nu.vercel.app/privacy-policy.html |
| Fill Data safety form | Pending | based on final review document |
| Submit Data safety form | Pending | manual Console task |
| Complete app access declaration | Pending | manual Console task |
| Complete ads declaration | Pending | manual Console task |
| Complete content rating questionnaire | Pending | manual Console task |
| Complete target audience and content | Pending | manual Console task |
| Prepare store listing assets | Pending | separate work |
| Upload AAB to internal test | Pending | separate task |
| Perform real device QA | Pending | after internal test install |

## Guardrails

- This PR creates a Play Console actual input readiness checklist only.
- This PR is not Google Play Console input completion.
- Actual Google Play Console input remains Pending.
- Privacy policy URL Play Console input remains Pending.
- Actual Google Play Console Data safety input remains Pending.
- Data safety form submission remains Pending.
- Play Console app creation remains Pending.
- AAB internal test upload remains Pending.
- Real device QA remains Pending.
- public/privacy-policy.html is not changed in this PR.
- React routing is not changed.
- Production saju/fortune calculation logic is not changed.
- schemaVersion and existing localStorage keys are not changed.
- AndroidManifest.xml, Android resource files, and Gradle settings are not changed.
- `.aab`, `.zip`, `.jks`, and `.keystore` files are not added to the repository.
- GitHub Secret actual values, tester email lists, signing passwords, keystore paths, key aliases, and keystore base64 values are not recorded.

## Non-goals for This PR

- Actual Google Play Console input
- Play Console app creation completion
- Privacy policy URL Play Console input completion
- Data safety form submission
- Play Console internal test upload
- Internal test rollout
- Real device installation QA
- Store listing asset creation
- AndroidManifest.xml change
- Android resource change
- Gradle setting change
- Production logic change
- UI/design change
- React routing change
- localStorage key change
- schemaVersion change

## Related Docs

- docs/GOOGLE_PLAY_DATA_SAFETY_FORM_FINAL_REVIEW.md
- docs/GOOGLE_PLAY_DATA_SAFETY_FORM_DRAFT.md
- docs/PRIVACY_POLICY_FINAL_CONTENT_CONFIRMATION.md
- docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md
- docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md
- docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md
- docs/SAJU_ENGINE_ACCURACY_ROADMAP.md
