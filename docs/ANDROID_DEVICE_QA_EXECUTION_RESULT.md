# ANDROID_DEVICE_QA_EXECUTION_RESULT

## run #38 artifact 기준 갱신

- Android device QA execution result 갱신 전 run #38 artifact 기준을 확인합니다.
- 갱신 문서는 `docs/ANDROID_DEBUG_APK_ARTIFACT_REFRESH_RUN38.md`입니다.
- 실제 기기 또는 Emulator 준비 전까지 QA 성공 판정으로 기록하지 않습니다.

## Android device QA unblock readiness 연결

- Android device QA execution result는 unblock readiness 확인 이후 갱신합니다.
- 문서 경로는 `docs/ANDROID_DEVICE_QA_UNBLOCK_READINESS.md`입니다.
- 실제 기기 또는 Emulator 준비 전까지 QA 성공 판정으로 기록하지 않습니다.

## APK 설치/앱 실행 QA 결과 연결

- Android device QA 실행 전 debug APK 설치 및 앱 실행 QA 결과를 확인해야 합니다.
- 문서 경로는 `docs/ANDROID_DEBUG_APK_INSTALL_LAUNCH_QA_RESULT.md`입니다.
- APK 설치와 앱 실행이 완료되기 전까지 주요 화면 확인 상태는 Pending입니다.

## debug APK QA handoff 준비

- Android Debug Build run #35의 harupuli-debug-apk artifact 정보를 QA handoff 기준으로 기록했습니다.
- handoff 준비 문서는 `docs/ANDROID_DEBUG_APK_QA_HANDOFF_READINESS.md`입니다.
- 실제 APK 다운로드, 설치, 앱 실행은 아직 Pending입니다.
- Android 실제 기기 QA는 여전히 Blocked입니다.

이 문서는 하루풀이 Android 실제 기기 또는 에뮬레이터 QA 실행 결과를 기록하기 위한 템플릿입니다.
이번 PR은 QA 실행 결과 기록 양식 준비가 목적이며, 실제 Android 기기 QA 성공 판정, 실제 스크린샷 이미지 생성, Google Play Console 입력, release build, signing, AAB 생성, production 앱 로직 변경은 진행하지 않습니다.

## 1. 목적

- Android 실제 기기 또는 에뮬레이터에서 debug APK를 설치하고 주요 기능을 확인하기 위한 결과 양식을 준비합니다.
- QA가 수행되지 않은 경우 Blocked 또는 Pending 상태를 명확히 유지합니다.
- Google Play 제출 전 Android WebView, localStorage, 뒤로가기, 아이콘, 스플래시, 개인정보 안내 상태를 점검합니다.
- 스토어 스크린샷 제작 전 주요 화면 표시 상태를 확인할 수 있도록 합니다.

## 2. 현재 상태

- Android Debug Build run: #34
- Android Debug Build 상태: success
- debug APK artifact 이름: harupuli-debug-apk
- artifact id: 7661684907
- artifact digest: sha256:f7192602896ceba827ac80ec1de8f24168eff5cd9d8ccaa4aa0c0e09bb2c18ca
- Android 실제 기기 QA 상태: Blocked
- Android Emulator QA 상태: Pending
- APK 실제 설치 상태: Pending
- 앱 실제 실행 상태: Pending
- 주요 화면 확인 상태: Pending
- WebView localStorage 실제 QA 상태: Pending
- Android back button 실제 QA 상태: Pending
- launcher icon 실제 QA 상태: Pending
- splash 실제 QA 상태: Pending
- 실제 스토어 스크린샷 이미지 생성 상태: Pending
- Google Play Console 입력 상태: Not started

## 3. 기준 문서

- Android device QA runbook: `docs/ANDROID_DEVICE_QA_RUNBOOK.md`
- Android QA status summary: `docs/ANDROID_QA_STATUS_SUMMARY.md`
- Android WebView localStorage QA result: `docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md`
- Android back button QA result: `docs/ANDROID_BACK_BUTTON_QA_RESULT.md`
- Android icon/splash QA result: `docs/ANDROID_ICON_SPLASH_QA_RESULT.md`
- Store screenshot sample profile screen QA result: `docs/STORE_SCREENSHOT_SAMPLE_PROFILE_SCREEN_QA_RESULT.md`
- Store screenshot capture QA result: `docs/STORE_SCREENSHOT_CAPTURE_QA_RESULT.md`
- Android debug build recovery result: `docs/ANDROID_DEBUG_BUILD_RECOVERY_RESULT.md`

## 4. QA 실행 전 준비 항목

- harupuli-debug-apk artifact 다운로드
- app-debug.apk 압축 해제 또는 확인
- Android 실제 기기 또는 Android Emulator 준비
- ADB 연결 확인
- APK 설치 가능 여부 확인
- 앱 실행 가능 여부 확인
- 앱 데이터 초기화 절차 확인
- 네트워크 연결 상태 확인
- 개인정보 처리방침 페이지 접근 경로 확인
- 테스트용 샘플 프로필 입력 기준 확인

## 5. QA 결과 표

| 항목 | 상태 | 비고 |
| --- | --- | --- |
| APK 다운로드 | Pending | 실제 다운로드 전 |
| APK 설치 | Pending | 실제 기기 또는 에뮬레이터 필요 |
| 앱 실행 | Pending | 실제 실행 전 |
| 홈 화면 표시 | Pending | 실제 확인 전 |
| 프로필 입력 화면 표시 | Pending | 실제 확인 전 |
| 오늘의 풀이 화면 표시 | Pending | 실제 확인 전 |
| 사주 인사이트 화면 표시 | Pending | 실제 확인 전 |
| 저장한 풀이 화면 표시 | Pending | 실제 확인 전 |
| localStorage 유지 | Pending | 실제 재실행/재설치 확인 필요 |
| Android back button | Pending | 실제 기기 또는 에뮬레이터 필요 |
| launcher icon 표시 | Pending | 실제 기기 또는 에뮬레이터 필요 |
| splash 표시 | Pending | 실제 기기 또는 에뮬레이터 필요 |
| 개인정보 안내 화면 표시 | Pending | 실제 확인 전 |
| 테스트용 샘플 프로필 입력 | Pending | 실제 입력 전 |
| 스토어 스크린샷 캡처 | Pending | 실제 이미지 생성 전 |

## 6. Blocked 조건

아래 조건 중 하나라도 해당하면 QA를 Pass로 기록하지 않습니다.

- Android 실제 기기 또는 에뮬레이터가 없는 경우
- ADB 연결이 불가능한 경우
- APK를 설치하지 않은 경우
- 앱을 실제로 실행하지 않은 경우
- 화면을 실제로 확인하지 않은 경우
- localStorage 유지 여부를 실제로 확인하지 않은 경우
- back button 동작을 실제로 확인하지 않은 경우
- icon/splash 표시를 실제로 확인하지 않은 경우
- 테스트용 샘플 프로필을 실제로 입력하지 않은 경우

## 7. 현재 보류 항목

- Android 실제 기기 QA 미진행
- Android Emulator QA 미진행
- APK 실제 설치 미진행
- 앱 실제 실행 미진행
- 주요 화면 실제 확인 미진행
- WebView localStorage 실제 QA 미진행
- Android back button 실제 QA 미진행
- launcher icon 실제 QA 미진행
- splash 실제 QA 미진행
- 테스트용 샘플 프로필 실제 입력 미진행
- 실제 스토어 스크린샷 이미지 제작 미진행
- Google Play Console 입력 미진행
- release build 미진행
- signing 미진행
- AAB 생성 미진행

## 8. 다음 단계

- Android 실제 기기 또는 에뮬레이터 준비
- harupuli-debug-apk artifact 다운로드
- APK 설치 및 앱 실행
- 테스트용 샘플 프로필 입력
- 주요 화면 확인
- localStorage 유지 확인
- Android back button 확인
- icon/splash 확인
- 스토어 스크린샷 캡처 준비
