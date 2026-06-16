# ANDROID_RESOURCE_ASSETS

## Android icon/splash QA 결과 연결

- 실제 표시 QA 결과 문서는 `docs/ANDROID_ICON_SPLASH_QA_RESULT.md`입니다.
- 표시 문제가 확인되면 관련 Android resource 파일은 별도 PR에서 수정합니다.
- 이번 단계에서는 리소스 파일을 변경하지 않았습니다.

## 2026-06-14 Android icon/splash 표시 QA 기준

- 실제 표시 QA 기준은 `docs/ANDROID_ICON_SPLASH_QA.md`에 정리합니다.
- launcher icon, round icon, adaptive icon, Android 12 이상 splash를 실제 기기 또는 에뮬레이터에서 확인해야 합니다.
- 이번 단계에서는 리소스 파일 자체를 변경하지 않았습니다.

## 2026-06-14 Android 리소스 적용 후 build verification

- Android 리소스 적용 후 GitHub Actions Android Debug Build가 성공했습니다.
- 결과 문서는 `docs/ANDROID_RESOURCE_BUILD_VERIFICATION.md`입니다.
- debug APK artifact `harupuli-debug-apk`가 생성되었습니다.
- 실제 Android 기기에서 icon/splash 표시 확인은 아직 후속 QA가 필요합니다.

## 목적

하루풀리 Android 앱에서 사용할 앱 아이콘, 라운드 아이콘, adaptive icon, splash 후보 PNG를 Capacitor Android 프로젝트의 `res` 경로에 적용한 내용을 기록합니다.

이번 작업은 기존에 생성된 `public/generated-*` PNG를 Android 리소스 폴더로 복사하는 단계입니다. 새 이미지를 생성하지 않았고, production 계산 로직이나 웹앱 기능은 변경하지 않았습니다.

## 적용한 Android 앱 아이콘

| 원본 파일 | 적용 경로 |
| --- | --- |
| `public/generated-icons/android/icon-48.png` | `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` |
| `public/generated-icons/android/icon-72.png` | `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` |
| `public/generated-icons/android/icon-96.png` | `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` |
| `public/generated-icons/android/icon-144.png` | `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` |
| `public/generated-icons/android/icon-192.png` | `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` |

## 적용한 Android 라운드 아이콘

| 원본 파일 | 적용 경로 |
| --- | --- |
| `public/generated-icons/android/icon-48.png` | `android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png` |
| `public/generated-icons/android/icon-72.png` | `android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png` |
| `public/generated-icons/android/icon-96.png` | `android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png` |
| `public/generated-icons/android/icon-144.png` | `android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png` |
| `public/generated-icons/android/icon-192.png` | `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png` |

## 적용한 Android adaptive icon

| 원본 파일 | 적용 경로 |
| --- | --- |
| `public/generated-icons/android-adaptive/background-432.png` | `android/app/src/main/res/drawable-nodpi/ic_launcher_background.png` |
| `public/generated-icons/android-adaptive/foreground-432.png` | `android/app/src/main/res/drawable-nodpi/ic_launcher_foreground.png` |

아래 XML 리소스는 foreground/background drawable을 참조합니다.

- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`

## 적용한 Android splash 후보 리소스

| 원본 파일 | 적용 경로 |
| --- | --- |
| `public/generated-splash/android/splash-1080x1920.png` | `android/app/src/main/res/drawable-nodpi/harupuli_splash.png` |
| `public/generated-splash/android/splash-icon-432.png` | `android/app/src/main/res/drawable-nodpi/harupuli_splash_icon.png` |

현재 Android launch theme은 기존 `@drawable/splash` 참조를 유지합니다. `harupuli_splash`와 `harupuli_splash_icon`은 후속 Android 12 이상 splash QA와 실제 기기 확인을 위한 후보 리소스로 추가했습니다.

## Manifest 참조 상태

`android/app/src/main/AndroidManifest.xml`의 아이콘 참조는 기존 값을 유지합니다.

- `android:icon="@mipmap/ic_launcher"`
- `android:roundIcon="@mipmap/ic_launcher_round"`

## 유지한 범위

- `public/generated-*` 원본 PNG는 삭제하지 않았습니다.
- `src` production 코드는 수정하지 않았습니다.
- 계산 로직, 라우팅, localStorage key, schemaVersion은 변경하지 않았습니다.
- rewarded ad 구조와 실제 광고 SDK 설정은 변경하지 않았습니다.
- iOS 프로젝트와 iOS asset catalog는 생성하지 않았습니다.
- release build, signing, 스토어 제출은 진행하지 않았습니다.

## 검증 명령

- `npm run apply:android-resources`
- `npm run check:android-resources`
- `npm run build`
- `npx cap sync android`

## 남은 확인사항

- Android debug build에서 아이콘과 adaptive icon 표시 확인
- Android 12 이상 splash 화면 표시 확인
- 실제 기기 또는 에뮬레이터에서 launcher icon, round icon, splash 후보 리소스 확인
- release build와 signing은 별도 PR에서 진행
