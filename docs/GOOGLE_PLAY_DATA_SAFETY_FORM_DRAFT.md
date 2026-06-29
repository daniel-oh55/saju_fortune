# Google Play Data Safety Form Draft

## Purpose

This document prepares a draft answer set for the Google Play Data safety form based on the current 하루풀이 app implementation.

This document is not Google Play Console submission completion.

## Current App Data Architecture

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
| Privacy policy final content confirmation | Confirmed | final content confirmed before this draft |
| Privacy policy public URL | Confirmed | https://saju-fortune-nu.vercel.app/privacy-policy.html |

## Data Safety Draft Answers

| Question Area | Draft Answer | Rationale |
|---|---|---|
| Does the app collect user data? | No server-side collection | Current implementation stores data locally only and does not send it to a server |
| Is user data shared with third parties? | No | No server transfer, no external analytics SDK, no ad SDK, no payment SDK |
| Is data encrypted in transit? | Not applicable for app data collection | Current app does not transmit personal data to a server |
| Can users request data deletion? | Local deletion/reset guidance applies | Data is stored in localStorage and can be removed by app/browser data deletion |
| Does the app use account creation? | No | Login/account system is not implemented |
| Does the app use payment data? | No | Payment SDK is not implemented |
| Does the app use advertising ID or ad data? | No | Actual ad SDK is not implemented |
| Does the app use analytics data? | No external analytics SDK | External analytics SDK is not implemented |
| Does the app use precise location? | No | No location SDK or server transfer is implemented |
| Does the app use contacts, photos, files, or device identifiers? | No | No related SDK or permission is implemented |

## Local Data Stored on Device

| Local Data Type | Status | Storage |
|---|---|---|
| Birth/profile input for fortune content | Used locally | localStorage |
| Calendar type/preferences | Used locally | localStorage |
| Saved readings | Used locally | localStorage |
| Consent/preferences | Used locally | localStorage |
| Reminder settings if present in current app state | Used locally | localStorage |
| Visit streak if present in current app state | Used locally | localStorage |

## Not Used Capabilities

| Capability | Status |
|---|---|
| Server database | Not used |
| Login/account | Not used |
| Payment SDK | Not used |
| Actual ad SDK | Not used |
| External analytics SDK | Not used |
| Push notification SDK | Not used |
| Personal data server transfer | Not used |
| Location SDK | Not used |
| Contacts access | Not used |
| Photos/files access | Not used |

## Remaining Before Data Safety Submission

| Item | Status | Note |
|---|---|---|
| Data safety form draft | Added | this document |
| Data safety form final review | Pending | before Console input |
| Actual Google Play Console Data safety input | Pending | not completed |
| Data safety form submission | Pending | not submitted |
| Privacy policy URL Play Console input | Pending | not entered |
| AAB internal test upload | Pending | not uploaded |
| Real device QA | Pending | not performed |

## Guardrails

- This PR creates a Data safety form draft only.
- This PR is not Google Play Console submission completion.
- Actual Google Play Console input remains Pending.
- Data safety form submission remains Pending.
- Privacy policy URL Play Console input remains Pending.
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
- Data safety form submission
- Play Console app creation
- Privacy policy URL Play Console input
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

- docs/PRIVACY_POLICY_FINAL_CONTENT_CONFIRMATION.md
- docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md
- docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md
- docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md
- docs/SAJU_ENGINE_ACCURACY_ROADMAP.md
