# Android Release Readiness Audit

## Summary

- Audit date: 2026-06-24
- Current readiness: Android debug build path is prepared, but Google Play release submission remains Pending.
- Debug build status: Found. GitHub Actions builds `assembleDebug` and uploads `harupuli-debug-apk`.
- Release build status: Prepared/Pending. The Android Gradle project has a `release` build type and environment-variable-based release signing config, but real signing secrets are not configured.
- AAB status: User-confirmed. The `Android Release AAB` workflow succeeded, `harupuli-release-aab` was generated, and the extracted `.aab` file existence was confirmed by the user.
- Signing status: Prepared/Pending. Release signing uses environment variables; upload keystore and GitHub Secrets remain Pending.
- Google Play registration materials status: Draft/partial documents exist, but final Console values and real store assets remain Pending.

This audit is documentation and check-script only. It does not change production app logic, Android native resources, Gradle signing, keystore files, routing, schemaVersion, or localStorage keys.

## Android Project

- android 디렉토리: Found (`android/`)
- Capacitor 설정: Found (`capacitor.config.json`)
- Capacitor appId: `com.harupuli.app`
- Capacitor appName: `하루풀이`
- applicationId: `com.harupuli.app`
- app name: `하루풀이` (`android/app/src/main/res/values/strings.xml`)
- versionCode: `1`
- versionName: `1.0`
- minSdk: `24`
- compileSdk: `36`
- targetSdk: `36`

Notes:

- Current package name is already a stable reverse-domain style identifier for Google Play registration.
- Google Play's target API level requirement says new apps and app updates must target Android 15/API 35 or higher from 2025-08-31. Current `targetSdk=36` satisfies that threshold.
- Version values are still initial release defaults and should be reviewed before the first release AAB.

Source checked for target SDK requirement:

- https://developer.android.com/google/play/requirements/target-sdk

## Build Status

- Web build: Found. `npm run build` is available and currently succeeds.
- Android debug build: Found. `.github/workflows/android-debug-build.yml` runs:
  - `npm ci`
  - `npm run build`
  - `npx cap sync android`
  - `./gradlew assembleDebug --stacktrace`
- Android release build: Prepared/Pending. `android/app/build.gradle` has a `release` build type and env-based release signing config, but signed output requires GitHub Secrets.
- AAB generation: User-confirmed. `.github/workflows/android-release-aab.yml` succeeded and the extracted `.aab` file existence was confirmed by the user.
- GitHub Actions debug artifact: Found.
  - artifact name: `harupuli-debug-apk`
  - artifact path: `android/app/build/outputs/apk/debug/app-debug.apk`
- GitHub Actions release artifact: User-confirmed. Release workflow produced `harupuli-release-aab`; extracted `.aab` existence was confirmed by the user.

## Signing Status

- release signing config: Prepared. `android/app/build.gradle` defines `signingConfigs.release` from environment variables only.
- keystore in repo: Found safe state. No `.jks`, `.keystore`, `.p12`, `.pem`, `.key`, or keystore-like files were found outside ignored directories by `npm run check:android-release-readiness`.
- GitHub Secrets: Pending/Not verifiable locally. Release workflow references required signing secrets, but their actual repository values cannot be checked from local files.
- upload key: Pending. No upload keystore is generated or documented as registered.
- Play App Signing: Pending. No Google Play Console app/signing setup has been completed in this repository.
- status: Release signing must be handled in a future PR using secrets and without committing keystore material.

## Permissions And Notifications

- Current AndroidManifest permissions: `android.permission.INTERNET`
- Native notification permission: Pending/Not configured.
- App code includes reminder/notification settings UI and uses browser `Notification` permission checks, with user-facing copy stating Android app notification integration is still being prepared.
- If native Android notifications are implemented later, Android 13+ notification permission handling and `AndroidManifest.xml` changes should be reviewed in a separate PR.

## Google Play Requirements

- targetSdk requirement: Found. Current `targetSdk=36` satisfies the current Android 15/API 35+ requirement for new apps/app updates.
- AAB requirement: Pending. No signed `.aab` artifact exists.
- signing requirement: Pending. Release signing config, upload keystore, and Play App Signing setup are not complete.
- privacy policy: Partial/Pending.
  - Public privacy page candidate exists: `public/privacy/index.html`
  - Readiness docs exist, but actual HTTPS URL confirmation and Console input remain Pending.
- data safety: Draft/Pending.
  - Draft exists: `docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT.md`
  - Final Google Play Console input remains Pending.
- screenshots: Pending.
  - Readiness/sample docs exist.
  - Real store screenshot image generation and upload remain Pending.
- contact email: Pending.
  - Contact readiness docs exist, but final public contact email is not confirmed here.
- app category: Draft.
  - `docs/GOOGLE_PLAY_STORE_LISTING_DRAFT.md` lists `Lifestyle` and `Entertainment` candidates.
- ads declaration: Pending.
  - Current app has no real ad SDK, but future rewarded ad structure is documented.
  - Play Console "Contains ads" value must match the final release build.
- in-app purchases: Pending/None currently.
  - No real payment SDK is present.
  - Play Console in-app purchase declarations must remain consistent with final implementation.
- app icon / feature graphic:
  - App icon/adaptive icon readiness docs and generated assets exist.
  - Feature graphic remains Pending unless separately produced and verified.
- short description / full description:
  - Draft content exists in `docs/GOOGLE_PLAY_STORE_LISTING_DRAFT.md`
  - Final store listing copy remains Pending.
- status: Not ready for production Play submission until signing, release AAB, QA, and Console materials are completed.
- Google Play upload: Not started.
- Real-device QA: Pending.

## Pending Items

Keep these items Pending until actually completed:

- release signing 설정
- upload keystore 생성
- GitHub Secrets 등록
- release AAB artifact 안전 보관
- 실제 기기 QA
- Google Play Console 앱 생성
- 개인정보처리방침 URL 확정
- 데이터 보안 양식 입력
- 실제 스토어 스크린샷 이미지 제작
- feature graphic 제작
- 앱 설명문 확정
- 내부 테스트 트랙 업로드

Additional pending checks:

- release `versionCode` and `versionName` policy for first Play upload
- Play App Signing enrollment
- release artifact retention/download instructions
- native notification permission plan if Android notifications become real

## Next Recommended PR

Recommended next PR:

- Create the upload keystore locally and store it securely outside the repo.
- Register the four Android upload signing secrets in GitHub Actions.
- Complete real-device QA using the release candidate path.
- Prepare Google Play internal test upload materials and tester list.
- Keep privacy policy URL, data safety form, and store screenshots Pending until final values are confirmed.

