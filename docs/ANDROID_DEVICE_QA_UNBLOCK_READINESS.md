# ANDROID_DEVICE_QA_UNBLOCK_READINESS

이 문서는 하루풀이 Android 실제 기기 또는 에뮬레이터 QA의 Blocked 상태를 해소하기 위한 준비 기준을 정리하는 문서입니다.
이번 PR은 QA unblock readiness 문서화가 목적이며, 실제 Android QA 수행, APK 설치 성공 판정, 앱 실행 성공 판정, Google Play Console 입력, release build, signing, AAB 생성, production 코드 로직 변경은 진행하지 않습니다.

## 1. 목적

- Android 실제 기기 QA가 Blocked 상태인 이유를 명확히 합니다.
- Blocked 상태를 해소하기 위한 준비 조건을 정리합니다.
- Emulator QA를 Pending에서 진행 가능한 상태로 전환하기 위한 조건을 정리합니다.
- 실제 QA가 수행되기 전에는 Pass 또는 완료로 기록하지 않습니다.

## 2. 현재 상태

- 기준 workflow: Android Debug Build
- 기준 run number: #37
- 기준 branch: docs/android-debug-apk-install-launch-qa-result
- 기준 head sha: ce1b4996ccee5ab38913fae9d75fccb1bde45762
- artifact 이름: harupuli-debug-apk
- artifact id: 7685195152
- artifact digest: sha256:ac6b93b40bd50c786f0ac302844da12a946c4b3ec0d63b74d2c21527c8ab39e7
- artifact 다운로드 상태: Pending
- APK 설치 상태: Pending
- 앱 실행 상태: Pending
- Android 실제 기기 QA 상태: Blocked
- Android Emulator QA 상태: Pending
- ADB 연결 상태: Pending
- 주요 화면 확인 상태: Pending
- localStorage QA 상태: Pending
- back button QA 상태: Pending
- icon/splash QA 상태: Pending

## 3. Blocked 이유

- Android 실제 기기 준비 미완료
- Android Emulator 준비 미완료
- ADB 연결 확인 미완료
- harupuli-debug-apk artifact 실제 다운로드 미완료
- app-debug.apk 실제 확인 미완료
- APK 실제 설치 미완료
- 앱 실제 실행 미완료
- 주요 화면 실제 확인 미완료

## 4. Blocked 해소 조건

- Android 실제 기기 또는 Emulator 준비
- USB debugging 또는 Emulator adb 연결 가능 상태 확인
- `adb devices`에서 target 확인
- harupuli-debug-apk artifact 다운로드
- artifact zip 압축 해제
- app-debug.apk 존재 확인
- `adb install` 또는 Android Studio를 통한 APK 설치
- 앱 실행 확인
- 첫 화면 표시 확인
- crash/logcat 확인
- 테스트용 샘플 프로필 입력 가능 여부 확인

## 5. QA 진행 전 차단 조건

아래 조건 중 하나라도 해당하면 QA를 성공 판정으로 기록하지 않습니다.

- 실제 기기 또는 Emulator가 없는 경우
- `adb devices`에서 target을 확인하지 않은 경우
- artifact를 실제로 다운로드하지 않은 경우
- app-debug.apk를 실제로 확인하지 않은 경우
- APK를 실제로 설치하지 않은 경우
- 앱을 실제로 실행하지 않은 경우
- 첫 화면을 실제로 확인하지 않은 경우
- crash/logcat 확인을 하지 않은 경우

## 6. 현재 상태 표

| 항목 | 상태 | 비고 |
| --- | --- | --- |
| 실제 Android 기기 준비 | Blocked | 실제 기기 필요 |
| Android Emulator 준비 | Pending | 에뮬레이터 준비 필요 |
| ADB 연결 | Pending | 실제 연결 전 |
| artifact 다운로드 | Pending | 실제 다운로드 전 |
| app-debug.apk 확인 | Pending | 실제 확인 전 |
| APK 설치 | Pending | 실제 설치 전 |
| 앱 실행 | Pending | 실제 실행 전 |
| 첫 화면 확인 | Pending | 실제 실행 후 가능 |
| crash/logcat 확인 | Pending | 실제 실행 후 가능 |
| 주요 화면 확인 | Pending | 실제 실행 후 가능 |
| localStorage QA | Pending | 실제 실행 후 가능 |
| back button QA | Pending | 실제 실행 후 가능 |
| icon/splash QA | Pending | 실제 실행 후 가능 |

## 7. 다음 단계

- Android 실제 기기 또는 Emulator 준비
- ADB 연결 확인
- run #37 harupuli-debug-apk 다운로드
- app-debug.apk 확인
- APK 설치
- 앱 실행
- 첫 화면 및 crash 여부 확인
- 주요 화면 QA 진행
