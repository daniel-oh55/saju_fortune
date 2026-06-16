# ANDROID_ICON_SPLASH_QA_RESULT

## QA 상태 요약 연결

- 현재 icon/splash QA 상태는 `docs/ANDROID_QA_STATUS_SUMMARY.md`에서도 관리합니다.
- Blocked 해소 후 실제 QA 결과를 본 문서와 summary 문서에 함께 반영합니다.

## QA 환경 준비 연결

- 현재 icon/splash QA 결과는 Blocked입니다.
- Blocked 해소를 위해 `docs/ANDROID_QA_ENVIRONMENT_SETUP.md`를 추가했습니다.
- adb 사용 가능 환경과 실제 기기 또는 에뮬레이터 준비 후 QA를 재시도합니다.

이 문서는 하루풀리 Android debug APK를 실제 Android 기기 또는 에뮬레이터에서 실행하여 launcher icon, round icon, adaptive icon, splash 표시 상태를 확인한 결과를 기록하는 문서입니다.

이번 PR은 QA 결과 기록이 목적이며, Android 리소스와 production 앱 로직은 변경하지 않습니다.

## 1. QA 대상 빌드

- GitHub Actions workflow: Android Debug Build
- workflow run number: 10
- workflow run id: 확인 필요
- artifact 이름: `harupuli-debug-apk`
- artifact 경로: `android/app/build/outputs/apk/debug/app-debug.apk`
- APK 파일명: `app-debug.apk`
- APK 설치 방식: 미수행
- 테스트 기기 또는 에뮬레이터: 미확인
- Android 버전: 미확인
- launcher 종류: 미확인
- 테스트 일자: 2026-06-14
- QA 수행자: Codex

실제 QA를 수행하지 못했습니다.

- QA 상태: Blocked
- 사유: 현재 Codex 실행 환경에서 `adb` 명령을 사용할 수 없어 Android 기기 또는 에뮬레이터 연결과 APK 설치를 진행할 수 없습니다.
- 필요한 준비: Android SDK Platform Tools 또는 Android Studio 설치, `adb` PATH 설정, 실제 Android 기기 또는 에뮬레이터 준비, `harupuli-debug-apk` artifact 다운로드
- 다음 재시도 조건: `adb version`, `adb devices`, `adb install -r app-debug.apk` 실행 가능 상태 확인

## 2. 확인 대상 리소스

### Launcher icon

- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

### Round icon

- `android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png`
- `android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png`
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png`
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png`
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png`

### Adaptive icon

- `android/app/src/main/res/drawable-nodpi/ic_launcher_foreground.png`
- `android/app/src/main/res/drawable-nodpi/ic_launcher_background.png`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`

### Splash 후보 리소스

- `android/app/src/main/res/drawable-nodpi/harupuli_splash.png`
- `android/app/src/main/res/drawable-nodpi/harupuli_splash_icon.png`

## 3. QA 결과 요약

| 항목 | 결과 | 메모 |
| --- | --- | --- |
| Launcher icon | Blocked | `adb` 미사용으로 실제 홈 화면 확인 불가 |
| Round icon | Blocked | round icon 지원 launcher 확인 불가 |
| Adaptive icon | Blocked | Android 8 이상 launcher 확인 불가 |
| Android 12 splash | Blocked | Android 12 이상 기기 또는 에뮬레이터 확인 불가 |
| Recent apps icon | Blocked | 앱 실행 및 최근 앱 화면 확인 불가 |
| App info icon | Blocked | Android 앱 정보 화면 확인 불가 |
| 앱 삭제 후 재설치 | Blocked | APK 설치 미수행 |
| 업데이트 설치 | Blocked | `adb install -r` 미수행 |

## 4. 상세 QA 결과

### 4.1 Launcher icon

기대 결과:

- 앱 설치 후 홈 화면에 하루풀리 아이콘이 표시됩니다.
- 기본 Capacitor 아이콘으로 보이지 않습니다.
- 아이콘이 깨지거나 잘리지 않습니다.

실제 결과:

- 결과: Blocked
- 메모: `adb` 명령을 사용할 수 없어 APK 설치와 홈 화면 확인을 진행하지 못했습니다.

### 4.2 Round icon

기대 결과:

- round icon 지원 launcher에서 둥근 아이콘이 표시됩니다.
- 아이콘이 과하게 잘리거나 깨지지 않습니다.

실제 결과:

- 결과: Blocked
- 메모: 실제 launcher 환경을 준비하지 못해 확인하지 못했습니다.

### 4.3 Adaptive icon

기대 결과:

- Android 8 이상 launcher에서 foreground/background 조합이 정상 표시됩니다.
- foreground가 과하게 잘리지 않습니다.
- background가 어색하게 보이지 않습니다.

실제 결과:

- 결과: Blocked
- 메모: Android 기기 또는 에뮬레이터 연결이 불가해 확인하지 못했습니다.

### 4.4 Android 12 이상 splash

기대 결과:

- Android 12 이상에서 앱 실행 시 splash 또는 launch 화면이 어색하지 않습니다.
- 브랜드 색상과 아이콘이 자연스럽게 표시됩니다.
- 현재 launch theme이 `harupuli_splash` 후보 리소스를 실제로 참조하는지 확인합니다.

실제 결과:

- 결과: Blocked
- 메모: Android 12 이상 기기 또는 에뮬레이터를 준비하지 못해 확인하지 못했습니다.

### 4.5 Recent apps / App info icon

기대 결과:

- 최근 앱 화면에서 앱 아이콘이 정상 표시됩니다.
- Android 앱 정보 화면에서 앱 아이콘이 정상 표시됩니다.

실제 결과:

- 결과: Blocked
- 메모: 앱 설치와 실행을 진행하지 못해 확인하지 못했습니다.

### 4.6 삭제 후 재설치 / 업데이트 설치

기대 결과:

- 앱 삭제 후 재설치해도 아이콘이 정상 표시됩니다.
- `adb install -r` 업데이트 설치 후에도 아이콘이 정상 표시됩니다.

실제 결과:

- 결과: Blocked
- 메모: `adb` 사용 불가로 설치 시나리오를 진행하지 못했습니다.

## 5. 발견 이슈

- 현재 기록된 표시 이슈 없음
- 단, 실제 QA가 Blocked 상태라 icon/splash 표시 품질은 아직 검증되지 않았습니다.

Blocked 재시도 필요 항목:

- 관련 리소스 경로: Android icon/splash resource 전체
- 재현 단계: `harupuli-debug-apk` 다운로드 후 `adb install -r app-debug.apk`
- 기대 결과: launcher icon, round icon, adaptive icon, Android 12 splash 정상 표시
- 실제 결과: `adb` 사용 불가로 미확인
- 후속 PR 필요 여부: 실제 QA 결과에 따라 결정

## 6. 결론

- Blocked: 실제 기기/에뮬레이터 또는 adb 환경이 준비되지 않아 QA를 완료하지 못했습니다.
- Android 리소스 변경 없음
- production 앱 로직 변경 없음
- release build와 signing은 아직 미진행입니다.

## 7. 다음 단계

- 실제 기기 또는 에뮬레이터 준비
- adb 설치 및 PATH 설정
- APK 설치 재시도
- Android icon/splash 표시 QA 재실행
- QA 결과에 따라 Android resource 수정 PR 또는 splash theme 설정 PR 분리
