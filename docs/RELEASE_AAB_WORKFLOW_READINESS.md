# Release AAB Workflow Readiness

- Status: Release AAB workflow readiness recorded
- Release signing config: Completed
- Keystore file: Not committed
- Signing credentials: Not committed
- Release AAB workflow: Existing workflow recorded
- Release build: Pending manual workflow run
- AAB generation: Pending manual workflow run
- Release AAB verification: Not started
- Google Play AAB upload: Not started
- App submission/review request: Pending

## 1. Scope

- Purpose: Record release AAB workflow readiness
- PR type: workflow/docs/check
- Release signing configuration was already recorded in PR #387
- This PR does not add real keystore files
- This PR does not add signing credentials
- This PR does not upload AAB to Google Play Console
- This PR does not submit the app for review
- This PR does not change production UI or app logic

## 2. Required GitHub Secrets

- ANDROID_KEYSTORE_BASE64
- ANDROID_KEYSTORE_PASSWORD
- ANDROID_KEY_ALIAS
- ANDROID_KEY_PASSWORD

Real secret values must be stored only in GitHub Secrets.
Real secret values must not be committed to the repository.

## 3. Workflow readiness checklist

| Item | Status | Note |
| --- | --- | --- |
| Release signing config | Completed | Recorded in PR #387 |
| Keystore file | Not committed | Must remain outside repo |
| Signing credentials | Not committed | Must be provided via GitHub Secrets |
| Release AAB workflow | Ready | Manual GitHub Actions run required |
| Release build | Pending manual workflow run | Not completed in this PR |
| AAB generation | Pending manual workflow run | Not completed in this PR |
| Release AAB verification | Not started | Requires generated AAB artifact |
| Google Play AAB upload | Not started | Requires verified AAB |
| App submission/review request | Pending | Submit only after final checks pass |

## 4. Existing workflow summary

`.github/workflows/android-release-aab.yml` already exists and covers the required steps:

- Manual trigger via `workflow_dispatch`
- `npm ci` and `npm run build`
- `npx cap sync android`
- `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD` GitHub Secrets validation
- Release keystore restored from `ANDROID_KEYSTORE_BASE64` into a runner temp path only
- `./gradlew bundleRelease` to produce the release AAB
- `jarsigner -verify` signed AAB verification
- `actions/upload-artifact` to expose the release AAB

No workflow changes were required in this PR because the existing workflow is already correct.

## 5. Not included in this PR

- No real keystore file
- No signing credentials
- No committed secrets
- No release build completion
- No AAB generation completion
- No Google Play AAB upload
- No app submission/review request
- No image file changes
- No new screenshot capture
- No new image generation
- No image redesign
- No src changes
- No CSS changes
- No AndroidManifest.xml changes
- No Android native/resource changes
- No fortune copy/content changes
- No fortune calculation logic changes
- No routing changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes

## 6. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| GitHub Secrets final input | Pending user confirmation |
| Release build | Pending manual workflow run |
| AAB generation | Pending manual workflow run |
| Release AAB verification | Not started |
| Google Play AAB upload | Not started |
| App submission/review request | Pending |

## 7. Recommended next sequence

1. User creates or confirms release keystore outside the repository
2. User registers required GitHub Secrets
3. User manually runs release AAB workflow
4. Record release AAB generation completion
5. Verify generated AAB artifact
6. Upload verified AAB to Google Play Console
7. Submit app for review only after final checks pass

## 8. Conclusion

- This PR records release AAB workflow readiness only.
- Release build and AAB generation require a separate manual workflow run.
- Google Play AAB upload and app submission/review request remain Pending/Not started.
- No production UI, fortune logic, routing, schemaVersion, localStorage key, image, signing credential, AAB upload, or app submission changes are included.
