# Native Android Back Button QA Result

## Scope

- Review target: Native Android back button behavior after PR #289
- APK run number: Android Debug Build #218
- Artifact name: `harupuli-debug-apk`
- Branch: `fix/native-android-back-button`
- Related PR: #289
- Build type: Android Debug APK
- Test result source: user-confirmed real device test
- This document records only the user-confirmed native Android system back result
- This document does not confirm the in-app top-left back button
- This document does not confirm home screen exit behavior
- This document does not replace full Android smoke QA

## Test Environment

| Item | Value |
|---|---|
| Device model | Samsung Galaxy S23 Ultra |
| OS | One UI 8.0 |
| Artifact | `harupuli-debug-apk` |
| APK run number | Android Debug Build #218 |
| Build type | Android Debug APK |
| Related PR | #289 |
| Test result source | user-confirmed real device test |

## Status Summary

| Item | Status | Note |
|---|---|---|
| APK install | Completed | Existing install flow was used before this confirmation |
| App launch | Completed | Existing launch flow was used before this confirmation |
| Native Android system back | Completed | User confirmed the Android system back behavior works on device |
| App exits unexpectedly on non-home screens | Resolved | Considered resolved based on user confirmation for the PR #289 issue |
| In-app top-left back button | Pending | Not explicitly confirmed in this QA result |
| Home screen exit behavior | Pending | Not explicitly confirmed in this QA result |
| Full regression smoke QA after #289 | Pending | Not explicitly confirmed in this QA result |
| Google Play Console input | Pending | Not completed in this PR |
| Release build | Pending | Not completed in this PR |
| signing setup | Pending | Not completed in this PR |
| AAB generation | Pending | Not completed in this PR |

## Result Notes

- Android Debug Build #218 was installed and checked on Samsung Galaxy S23 Ultra / One UI 8.0.
- Native Android system back behavior was confirmed as working on the real device.
- The previous issue where Android system back exited the app from most non-home screens is considered resolved based on user confirmation.
- In-app top-left back button confirmation remains Pending until separately confirmed.
- Home screen exit behavior confirmation remains Pending until separately confirmed.
- Full Android smoke QA after PR #289 remains Pending until separately confirmed.

## Guardrails

- production fortune logic unchanged
- zodiac fortune engine unchanged
- src unchanged
- generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- existing localStorage keys unchanged
- no new localStorage key added
- routing unchanged
- privacy files unchanged
- Android native source unchanged
- AndroidManifest.xml unchanged
- Android resource files unchanged
- Gradle unchanged
- package-lock.json unchanged
- Capacitor dependencies unchanged
- release build remains Pending
- signing setup remains Pending
- AAB generation remains Pending
