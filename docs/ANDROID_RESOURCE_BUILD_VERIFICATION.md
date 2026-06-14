# ANDROID_RESOURCE_BUILD_VERIFICATION

## 실제 표시 QA 연결

- Android 리소스 적용 후 debug build는 성공했습니다.
- 다음 확인 단계는 실제 Android 기기 또는 에뮬레이터에서 icon/splash 표시 QA입니다.
- QA 기준은 `docs/ANDROID_ICON_SPLASH_QA.md`를 참고합니다.

이 문서는 Android 리소스 적용 후 Android Debug Build가 성공했는지 확인한 결과를 기록하는 문서입니다. 이번 PR은 build verification 문서화가 목적이며, Android 리소스와 production 앱 로직은 변경하지 않습니다.

## 1. 목적

- Android 앱 아이콘, 라운드 아이콘, adaptive icon, splash 후보 리소스 적용 후 build가 깨지지 않았는지 확인합니다.
- GitHub Actions Android Debug Build 성공 결과를 기록합니다.
- debug APK artifact 생성 여부를 기록합니다.
- 실제 기기 표시 QA와 release build/signing은 후속 단계로 둡니다.

## 2. 기준 PR

- Resource 적용 PR: PR #80
- PR 제목: `feature: apply Android app icon and splash resources`
- Android Debug Build run number: 8
- workflow run id: 27488348184
- workflow 결과: success
- artifact 이름: `harupuli-debug-apk`
- artifact 경로: `android/app/build/outputs/apk/debug/app-debug.apk`
- artifact size: 약 4.7MB
- artifact 상태: 생성 확인

## 3. 확인한 workflow 단계

- Set up Node.js: success
- Install dependencies: success
- Build web app: success
- Set up JDK: success
- Sync Android project: success
- Verify Java environment: success
- Make Gradle wrapper executable: success
- Verify Gradle wrapper: success
- Build Android debug APK: success
- Upload debug APK: success

## 4. 적용된 Android 리소스 확인

- launcher icon: `android/app/src/main/res/mipmap-*/ic_launcher.png`
- round icon: `android/app/src/main/res/mipmap-*/ic_launcher_round.png`
- adaptive icon foreground: `android/app/src/main/res/drawable-nodpi/ic_launcher_foreground.png`
- adaptive icon background: `android/app/src/main/res/drawable-nodpi/ic_launcher_background.png`
- adaptive icon XML:
  - `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
  - `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`
- splash 후보 PNG:
  - `android/app/src/main/res/drawable-nodpi/harupuli_splash.png`
  - `android/app/src/main/res/drawable-nodpi/harupuli_splash_icon.png`

## 5. 결론

- Android resource 적용 후 debug build 성공을 확인했습니다.
- debug APK artifact 생성이 확인되었습니다.
- Android 리소스가 build를 깨뜨리지 않았습니다.
- release build는 아직 미진행입니다.
- signing은 아직 미진행입니다.
- 실제 기기 icon/splash 표시 QA는 아직 미진행입니다.

## 6. 후속 확인사항

- 실제 Android 기기 또는 에뮬레이터에서 launcher icon 표시 확인
- round icon 표시 확인
- Android 12 이상 adaptive icon 표시 확인
- Android 12 이상 splash 표시 확인
- splash 후보 리소스가 실제 launch theme에 반영되어야 하는지 확인
- release build/signing 준비
- Google Play 내부 테스트에서 icon/splash 최종 확인
