# Android Release AAB Workflow

## Purpose

This document explains the 하루풀이 Android release AAB workflow and the signing secrets required to prepare a Google Play upload artifact.

This PR prepares the workflow and documentation only. It does not create, register, upload, or commit a real keystore. It does not upload an AAB to Google Play.

## Current Status

- Debug APK: Available through the `Android Debug Build` workflow.
  - artifact name: `harupuli-debug-apk`
  - artifact path: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release AAB: User-confirmed success.
- Release AAB artifact: User-confirmed (`harupuli-release-aab`).
- AAB extracted from artifact: User-confirmed.
- Signing config: Prepared for environment variables in `android/app/build.gradle`.
- Upload keystore: Not committed to repo.
- GitHub Secrets: Configured enough for the user-confirmed workflow run; do not record actual values.
- Google Play upload: Not started.
- Real-device QA: Pending.

## Required GitHub Secrets

The release workflow expects these repository secrets:

- `ANDROID_UPLOAD_KEYSTORE_BASE64`
- `ANDROID_UPLOAD_KEYSTORE_PASSWORD`
- `ANDROID_UPLOAD_KEY_ALIAS`
- `ANDROID_UPLOAD_KEY_PASSWORD`

Do not commit real passwords, key aliases, keystore files, or decoded keystore material to the repository.

## How To Create Upload Keystore Locally

Example only. Replace placeholder values locally and do not paste real passwords into documentation, commits, issues, or PR comments.

```bash
keytool -genkeypair \
  -v \
  -storetype JKS \
  -keystore upload-keystore.jks \
  -alias <upload-key-alias> \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Store the generated keystore outside the repository. Keep a secure backup.

## How To Encode Keystore

macOS/Linux:

```bash
base64 -w 0 upload-keystore.jks > upload-keystore.base64
```

If `base64 -w 0` is unavailable:

```bash
base64 upload-keystore.jks | tr -d '\n' > upload-keystore.base64
```

Windows PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("upload-keystore.jks")) | Set-Content -NoNewline "upload-keystore.base64"
```

Copy the contents of `upload-keystore.base64` into `ANDROID_UPLOAD_KEYSTORE_BASE64`.

## How To Add GitHub Secrets

1. Open GitHub repository settings.
2. Go to `Settings > Secrets and variables > Actions`.
3. Select `New repository secret`.
4. Add each required secret exactly as named above.

## How To Run Workflow

1. Open the repository `Actions` tab.
2. Select `Android Release AAB`.
3. Select `Run workflow`.

If any required signing secret is missing, the workflow stops before Gradle release build and prints which secret is not configured. This is expected until signing setup is complete.

## Expected Artifact

- artifact name: `harupuli-release-aab`
- artifact path: `android/app/build/outputs/bundle/release/*.aab`
- status: User-confirmed artifact generation and extracted `.aab` existence

## Google Play Release Criteria

- Google Play 신규 앱은 Android App Bundle (`.aab`)로 게시해야 합니다.
- App Bundle은 Play Console 업로드 전에 upload key로 서명해야 합니다.
- 2025-08-31 이후 Google Play 신규 앱/업데이트는 Android 15/API 35 이상 target이 필요합니다.
- 현재 프로젝트는 `targetSdk=36`이므로 API 35 이상 조건은 충족합니다.

## Pending Before Real Play Upload

- 실제 upload keystore 생성
- GitHub Secrets 등록
- release AAB artifact 안전 보관
- 실제 기기 QA
- Google Play Console 앱 생성
- Google Play Console 내부 테스트 트랙 업로드
- 개인정보처리방침 URL 확정
- 데이터 보안 양식 입력
- 실제 스토어 스크린샷 이미지 제작
- feature graphic 제작
- 앱 설명문 확정
