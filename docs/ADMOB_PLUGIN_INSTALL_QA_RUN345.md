# AdMob Plugin Install QA - Android Debug Build Run #345

- Verification date: 2026-07-27
- Repository: `daniel-oh55/saju_fortune`
- Pull request: `#405`
- Tested branch: `build/admob-plugin-install-baseline`
- Tested HEAD: `07f85a8dfe2b9fbc6551b25dd6731c81ee04d231`
- Workflow: `Android Debug Build`
- Workflow run: `#345`
- Workflow run ID: `30230115096`
- Workflow conclusion: Success
- Artifact: `harupuli-debug-apk`
- Artifact ID: `8639819148`
- Artifact digest: `sha256:4290933add6503a9fe55c8ca02514660fa7f3936b9529f9d06503dfaa196bb26`
- Test device: Galaxy S23 Ultra

## Build and artifact result

- Web build: Completed
- Capacitor Android sync: Completed
- Android Debug APK build: Completed
- Debug APK artifact generation: Completed
- Debug APK artifact download: Completed
- APK installation: Completed

The Node.js 20 deprecation annotation shown by GitHub Actions did not fail the
workflow. It is recorded as a non-blocking workflow-maintenance item and is not
an AdMob App ID or Android build failure.

## Compiled APK manifest verification

The downloaded run #345 APK was inspected directly.

- Android package: `com.harupuli.app`
- `com.google.android.gms.ads.APPLICATION_ID`: present exactly once in the compiled manifest
- APPLICATION_ID value resource: `@0x7f0d001b`
- Resource key resolved from `resources.arsc`: `admob_app_id`
- Resource value: `ca-app-pub-9536468405324805~1921427615`
- `com.google.android.gms.ads.MobileAdsInitProvider`: present
- `com.google.android.gms.permission.AD_ID`: inherited in the compiled manifest
- `android.permission.ACCESS_ADSERVICES_AD_ID`: inherited in the compiled manifest
- Source manifest manual AD_ID declaration: absent
- Google sample App ID: absent
- Ad unit ID: absent
- Placeholder App ID: absent

This confirms that the App ID metadata in the compiled Debug APK resolves to
the approved Harupuli AdMob App ID.

## Android startup smoke QA

The user installed the run #345 Debug APK on a Galaxy S23 Ultra and reported:

- App launch: Completed
- Home screen display: Normal
- Immediate force close: Not observed
- `Missing application ID` error: Not observed during actual device launch

The startup smoke QA result for the PR #405 App ID baseline is Pass.

## Verification limits

- ADB logcat verification: Not performed
- Full Android regression QA: Not completed
- Mobile Ads runtime initialization: Not started
- UMP consent flow: Not started
- Privacy options runtime UI: Not started
- Official test-ad request: Not started
- Android advertising QA: Not started
- Production ad units: 0
- Actual ad requests: No data
- Actual ad serving: Pending

No advertising is expected to appear in this APK because runtime initialization,
consent coordination, ad units, and ad load/show code remain outside PR #405.

## Release status

- Release dependency verification: Blocked by the existing release-signing environment guard
- Release build verification: Blocked by the existing release-signing environment guard
- Release merged manifest verification: Blocked by the existing release-signing environment guard
- Release signing for this update: Not started
- Signed APK for this update: Not started
- AAB generation for this update: Not started
- Google Play advertising update upload: Not started
