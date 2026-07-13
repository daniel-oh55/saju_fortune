# Release Signing Config Record

- Status: Release signing configuration recorded
- Release signing config: Already implemented (android/app/build.gradle)
- Keystore file: Not committed
- Signing credentials: Not committed
- Release build: Not started
- AAB generation: Not started
- Google Play AAB upload: Not started
- App submission/review request: Pending

## 1. Scope

- Purpose: Record the existing Android release signing configuration
- PR type: Android signing config docs/check
- Release signing configuration in android/app/build.gradle was already added in an earlier PR
- This PR does not add a new signing configuration
- This PR does not add real keystore files
- This PR does not add signing credentials
- This PR does not create release build
- This PR does not generate AAB
- This PR does not upload AAB to Google Play Console
- This PR does not submit the app for review
- This PR does not change production UI or app logic

## 2. Signing input sources

- Gradle release signing (android/app/build.gradle), environment variable based:
  - ANDROID_KEYSTORE_FILE
  - ANDROID_KEYSTORE_PASSWORD
  - ANDROID_KEY_ALIAS
  - ANDROID_KEY_PASSWORD
- CI workflow signing (.github/workflows/android-release-aab.yml), GitHub Secrets based:
  - ANDROID_KEYSTORE_BASE64
  - ANDROID_KEYSTORE_PASSWORD
  - ANDROID_KEY_ALIAS
  - ANDROID_KEY_PASSWORD
- Real values must be provided outside the repository
- Real keystore files must not be committed
- Release build tasks fail fast when release signing environment variables are missing (enforced in build.gradle)

## 3. Security notes

- Do not commit *.jks files
- Do not commit *.keystore files
- Do not commit *.p12 files
- Do not commit *.pem files
- Do not commit keystore.properties
- Do not commit keystore passwords
- Do not commit key passwords
- Do not commit signing credentials
- Keep release signing credentials in a secure local location or CI secrets
- Android Debug Build success does not mean release build or AAB generation is complete

## 4. Not included in this PR

- No real keystore file
- No signing credentials
- No new signing configuration (existing configuration only recorded)
- No release build
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
- No Gradle configuration changes
- No fortune copy/content changes
- No fortune calculation logic changes
- No routing changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes

## 5. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| Keystore creation | Manual outside repo |
| Release build | Not started |
| AAB generation | Not started |
| Release AAB verification | Not started |
| Google Play AAB upload | Not started |
| App submission/review request | Pending |

## 6. Recommended next sequence

1. Create or confirm release keystore securely outside the repository
2. Set signing values locally or in CI secrets
3. Generate release AAB
4. Verify release AAB
5. Upload release AAB to Google Play Console
6. Submit app for review only after final checks pass

## 7. Conclusion

- This PR records the existing release signing configuration only.
- Keystore file, signing credentials, release build, AAB generation, Google Play AAB upload, and app submission/review request remain outside this PR.
- No production UI, fortune logic, routing, schemaVersion, localStorage key, image, AAB, or app submission changes are included.
