# Release Build Signing AAB Preparation

- Status: Release build signing AAB preparation recorded
- Google Play Console actual input: Completed
- Google Play 데이터 보안 양식 최종 입력: Completed
- App submission/review request: Pending
- Release build: Not started
- Signing setup: Not started
- Keystore file: Not started
- AAB generation: Not started

## 1. Scope

- Purpose: Prepare release build, signing setup, and AAB generation
- PR type: docs/check-only
- Google Play Console input and Google Play 데이터 보안 양식 최종 입력 were already completed
- This PR records release preparation only
- This PR does not create release build
- This PR does not configure signing
- This PR does not add keystore files
- This PR does not generate AAB
- This PR does not submit the app for review
- This PR does not change production UI or app logic

## 2. Completed pre-release items

| Item | Status | Note |
| --- | --- | --- |
| Store screenshot upload | Completed | Recorded in PR #380 |
| App icon final upload | Completed | Recorded in PR #383 |
| Feature graphic final upload | Completed | Recorded in PR #383 |
| Google Play Console actual input | Completed | Recorded in PR #384 |
| Google Play 데이터 보안 양식 최종 입력 | Completed | Recorded in PR #385 |

## 3. Release preparation checklist

| Item | Status | Note |
| --- | --- | --- |
| Release build strategy | Pending | Define before implementation |
| Signing setup plan | Pending | Do not commit real keystore or passwords |
| Keystore creation | Not started | Must be handled securely outside docs/check PR |
| Keystore storage policy | Pending | Secrets must not be committed |
| Gradle signing configuration | Not started | Separate implementation PR required |
| AAB generation | Not started | Separate build PR/run required |
| Release AAB verification | Not started | Requires actual generated AAB |
| Google Play AAB upload | Not started | Requires actual release AAB |
| App submission/review request | Pending | Submit only after release checks pass |

## 4. Security notes

- Do not commit real keystore files
- Do not commit keystore passwords
- Do not commit signing credentials
- Use secure local storage or repository secrets for sensitive signing values
- Keep debug build and release build status clearly separated
- Android Debug Build success does not mean release build, signing, or AAB generation is complete

## 5. Not included in this PR

- No release build
- No signing setup
- No keystore file added
- No signing credentials added
- No AAB generation
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
- No Gradle changes
- No Capacitor config changes
- No fortune copy/content changes
- No fortune calculation logic changes
- No routing changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes

## 6. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| Release build strategy | Pending |
| Signing setup | Not started |
| Keystore file | Not started |
| AAB generation | Not started |
| Release AAB verification | Not started |
| Google Play AAB upload | Not started |
| App submission/review request | Pending |

## 7. Recommended next sequence

1. Prepare signing setup implementation plan
2. Create keystore securely outside the repository
3. Configure release signing in a separate implementation PR
4. Generate release AAB
5. Verify release AAB
6. Upload release AAB to Google Play Console
7. Submit app for review only after final checks pass

## 8. Conclusion

- This PR records release build, signing, and AAB preparation only.
- Release build, signing setup, keystore file, AAB generation, Google Play AAB upload, and app submission/review request remain Pending/Not started.
- No production code, Android packaging, signing, AAB, or app submission changes are included.
