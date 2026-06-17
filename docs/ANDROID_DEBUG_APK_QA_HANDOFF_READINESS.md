# ANDROID_DEBUG_APK_QA_HANDOFF_READINESS

## APK 설치/앱 실행 QA 결과 연결

- debug APK 설치 및 앱 실행 QA 결과 문서를 추가했습니다.
- 문서 경로는 `docs/ANDROID_DEBUG_APK_INSTALL_LAUNCH_QA_RESULT.md`입니다.
- 실제 artifact 다운로드, APK 설치, 앱 실행은 아직 Pending입니다.
- APK 설치/앱 실행 전에는 실제 기기 QA를 성공 판정으로 기록하지 않습니다.

이 문서는 하루풀이 Android 실제 기기 또는 에뮬레이터 QA를 진행하기 전 debug APK artifact 다운로드 및 설치 준비 상태를 정리하기 위한 문서입니다.
이번 PR은 QA handoff 준비 문서화가 목적이며, 실제 APK 설치 수행, 앱 실행 수행, 실제 기기 QA 성공 판정, Google Play Console 입력, release build, signing, AAB 생성, production 코드 로직 변경은 진행하지 않습니다.

## 1. 목적

- 최신 Android Debug Build artifact 정보를 QA 준비 단계에서 확인합니다.
- 실제 기기 또는 에뮬레이터 QA를 진행하기 전 APK 다운로드, 압축 해제, 설치 준비 항목을 정리합니다.
- 실제 설치 또는 실행이 완료되지 않은 경우 Pending 상태를 유지합니다.
- QA 담당자가 어떤 artifact를 기준으로 테스트해야 하는지 명확히 합니다.

## 2. 기준 artifact 정보

- 기준 workflow: Android Debug Build
- 기준 run number: #35
- 기준 branch: docs/android-device-qa-execution-result
- 기준 head sha: 6671ddde9f0362e8a4115b4ba7d9a748f0383243
- artifact 이름: harupuli-debug-apk
- artifact id: 7684142019
- artifact digest: sha256:f6c09f8c5d971f8680484bedf9dc175943d0ca1ec67f862390cd10f3c5e78754
- artifact 생성 상태: 생성됨
- artifact 다운로드 상태: Pending
- APK 압축 해제 상태: Pending
- APK 설치 상태: Pending
- 앱 실행 상태: Pending
- Android 실제 기기 QA 상태: Blocked
- Android Emulator QA 상태: Pending

## 3. QA handoff 전 확인 항목

- GitHub Actions artifact 다운로드 가능 여부 확인
- harupuli-debug-apk artifact 이름 확인
- artifact id 확인
- artifact digest 확인
- app-debug.apk 포함 여부 확인
- Android 실제 기기 또는 에뮬레이터 준비 여부 확인
- ADB 연결 가능 여부 확인
- APK 설치 명령 준비
- 앱 실행 확인 절차 준비
- 앱 데이터 초기화 절차 준비

## 4. 설치 전 차단 조건

아래 조건 중 하나라도 해당하면 APK 설치 상태를 완료로 바꾸거나 QA 성공 판정으로 기록하지 않습니다.

- artifact를 실제로 다운로드하지 않은 경우
- app-debug.apk를 실제로 확인하지 않은 경우
- Android 실제 기기 또는 에뮬레이터가 없는 경우
- ADB 연결이 불가능한 경우
- APK를 실제로 설치하지 않은 경우
- 앱을 실제로 실행하지 않은 경우
- 주요 화면을 실제로 확인하지 않은 경우

## 5. 현재 상태 표

| 항목 | 상태 | 비고 |
| --- | --- | --- |
| artifact 생성 | 생성됨 | run #35 기준 |
| artifact 다운로드 | Pending | 실제 다운로드 전 |
| APK 압축 해제 | Pending | 실제 확인 전 |
| APK 설치 | Pending | 실제 기기 또는 에뮬레이터 필요 |
| 앱 실행 | Pending | 실제 실행 전 |
| Android 실제 기기 QA | Blocked | 실제 기기 필요 |
| Android Emulator QA | Pending | 에뮬레이터 준비 필요 |
| 주요 화면 확인 | Pending | 실제 실행 후 가능 |
| localStorage 확인 | Pending | 실제 실행 후 가능 |
| back button 확인 | Pending | 실제 실행 후 가능 |
| icon/splash 확인 | Pending | 실제 실행 후 가능 |

## 6. 다음 단계

- harupuli-debug-apk artifact 다운로드
- app-debug.apk 확인
- Android 실제 기기 또는 에뮬레이터 준비
- ADB 연결 확인
- APK 설치
- 앱 실행
- 테스트용 샘플 프로필 입력
- 주요 화면 확인
- localStorage, back button, icon/splash 확인
