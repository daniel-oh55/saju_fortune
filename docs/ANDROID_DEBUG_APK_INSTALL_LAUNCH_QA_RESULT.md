# ANDROID_DEBUG_APK_INSTALL_LAUNCH_QA_RESULT

## run #38 artifact 기준 갱신

- APK 설치/앱 실행 QA 결과 기록 전 run #38 artifact 기준을 함께 확인합니다.
- 갱신 문서는 `docs/ANDROID_DEBUG_APK_ARTIFACT_REFRESH_RUN38.md`입니다.
- 실제 설치와 앱 실행 전까지 상태는 Pending입니다.

## Android device QA unblock readiness 연결

- Android 실제 기기 또는 Emulator QA의 Blocked 상태를 해소하기 위한 준비 문서를 추가했습니다.
- 문서 경로는 `docs/ANDROID_DEVICE_QA_UNBLOCK_READINESS.md`입니다.
- 실제 기기 또는 Emulator 준비, ADB 연결, APK 설치, 앱 실행 전까지 QA는 Pending 또는 Blocked 상태를 유지합니다.

이 문서는 하루풀이 Android debug APK 다운로드, 압축 해제, 설치, 앱 실행 QA 결과를 기록하기 위한 템플릿입니다.
이번 PR은 설치/실행 QA 결과 기록 양식 준비가 목적이며, 실제 APK 설치 성공 판정, 앱 실행 성공 판정, 실제 기기 QA 성공 판정, Google Play Console 입력, release build, signing, AAB 생성, production 코드 로직 변경은 진행하지 않습니다.

## 1. 목적

- 최신 Android Debug Build artifact를 기준으로 APK 다운로드, 압축 해제, 설치, 앱 실행 결과를 기록할 수 있도록 합니다.
- 실제 설치 또는 실행이 완료되지 않은 경우 Pending 상태를 유지합니다.
- 실제 기기 또는 에뮬레이터가 없는 경우 Blocked 상태를 유지합니다.
- 이후 localStorage, back button, icon/splash, 스토어 스크린샷 QA를 진행하기 전 선행 조건을 정리합니다.

## 2. 기준 artifact 정보

- 기준 workflow: Android Debug Build
- 기준 run number: #36
- 기준 branch: docs/android-debug-apk-qa-handoff-readiness
- 기준 head sha: ae8ddaf22d09f8ceae27d479fd30486cf87b41da
- artifact 이름: harupuli-debug-apk
- artifact id: 7684586472
- artifact digest: sha256:1a86909598d36127b1c9503e3c4e4bb2054a1543afe7bc5f53256c639ce4adc2
- artifact 생성 상태: 생성됨
- artifact 다운로드 상태: Pending
- APK 압축 해제 상태: Pending
- app-debug.apk 확인 상태: Pending
- APK 설치 상태: Pending
- 앱 실행 상태: Pending
- Android 실제 기기 QA 상태: Blocked
- Android Emulator QA 상태: Pending

## 3. 설치/실행 전 준비 항목

- harupuli-debug-apk artifact 다운로드
- artifact zip 압축 해제
- app-debug.apk 존재 확인
- Android 실제 기기 또는 Android Emulator 준비
- ADB 연결 확인
- 기존 앱 데이터 삭제 여부 확인
- APK 설치 명령 준비
- 앱 실행 방법 확인
- 설치 실패 시 로그 확인 방법 준비
- 앱 실행 실패 시 logcat 확인 방법 준비

## 4. 설치/실행 결과 표

| 항목 | 상태 | 비고 |
| --- | --- | --- |
| artifact 다운로드 | Pending | 실제 다운로드 전 |
| artifact 압축 해제 | Pending | 실제 압축 해제 전 |
| app-debug.apk 확인 | Pending | 실제 확인 전 |
| ADB 연결 | Pending | 실제 기기 또는 에뮬레이터 필요 |
| APK 설치 | Pending | 실제 설치 전 |
| 앱 실행 | Pending | 실제 실행 전 |
| 첫 화면 표시 | Pending | 실제 실행 후 확인 |
| crash 발생 여부 | Pending | 실제 실행 후 확인 |
| logcat 확인 | Pending | 실제 실행 후 확인 |
| Android 실제 기기 QA | Blocked | 실제 기기 필요 |
| Android Emulator QA | Pending | 에뮬레이터 준비 필요 |

## 5. 차단 조건

아래 조건 중 하나라도 해당하면 설치/실행 상태를 완료로 기록하지 않습니다.

- artifact를 실제로 다운로드하지 않은 경우
- artifact 압축을 실제로 해제하지 않은 경우
- app-debug.apk를 실제로 확인하지 않은 경우
- Android 실제 기기 또는 에뮬레이터가 없는 경우
- ADB 연결을 확인하지 않은 경우
- APK를 실제로 설치하지 않은 경우
- 앱을 실제로 실행하지 않은 경우
- 첫 화면을 실제로 확인하지 않은 경우
- crash 여부를 실제로 확인하지 않은 경우

## 6. 현재 보류 항목

- artifact 실제 다운로드 미진행
- APK 압축 해제 미진행
- app-debug.apk 실제 확인 미진행
- ADB 연결 확인 미진행
- APK 실제 설치 미진행
- 앱 실제 실행 미진행
- 첫 화면 실제 확인 미진행
- crash/logcat 확인 미진행
- Android 실제 기기 QA 미진행
- Android Emulator QA 미진행
- 실제 스토어 스크린샷 이미지 시작 미진행
- Google Play Console 입력 미진행
- release build 미진행
- signing 미진행
- AAB 생성 미진행

## 7. 다음 단계

- harupuli-debug-apk artifact 다운로드
- app-debug.apk 확인
- Android 실제 기기 또는 에뮬레이터 준비
- ADB 연결
- APK 설치
- 앱 실행
- 첫 화면 및 crash 여부 확인
- localStorage, back button, icon/splash QA 진행
