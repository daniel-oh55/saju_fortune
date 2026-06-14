# ANDROID_QA_STATUS_SUMMARY

이 문서는 하루풀이 Android 앱 패키지 이후 실제 기기 또는 에뮬레이터 QA의 현재 상태를 한곳에서 관리하기 위한 요약 문서입니다.

이번 PR은 QA 상태 요약 문서화가 목적이며, production 로직과 Android 리소스는 변경하지 않습니다.

## 1. 목적

- Android debug build와 APK artifact 생성은 성공했지만 실제 기기/에뮬레이터 QA가 Blocked 상태임을 정리합니다.
- Android icon/splash, WebView localStorage, back button QA의 현재 상태를 한눈에 확인합니다.
- 실제 기기 또는 에뮬레이터 준비 후 재시도 순서를 정의합니다.

## 2. 빌드 상태

- Android Debug Build: success
- 최근 확인 run number: 13
- artifact 이름: `harupuli-debug-apk`
- artifact 경로: `android/app/build/outputs/apk/debug/app-debug.apk`
- debug APK 생성: 완료
- release build: 미진행
- signing: 미진행
- Google Play internal test: 미진행

## 3. QA 상태 요약

| QA 항목 | 현재 상태 | 결과 문서 | 차단 사유 |
| --- | --- | --- | --- |
| Android icon/splash 표시 QA | Blocked | `docs/ANDROID_ICON_SPLASH_QA_RESULT.md` | adb 또는 실제 기기/에뮬레이터 환경 부족 |
| Android WebView localStorage QA | Blocked | `docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md` | adb 또는 실제 기기/에뮬레이터 환경 부족 |
| Android back button QA | Blocked | `docs/ANDROID_BACK_BUTTON_QA_RESULT.md` | adb 또는 실제 기기/에뮬레이터 환경 부족 |

## 4. 공통 Blocked 원인

- 현재 실행 환경에서 adb 명령을 사용할 수 없습니다.
- 실제 Android 기기 또는 Android Emulator 연결을 확인하지 못했습니다.
- `app-debug.apk` 설치가 수행되지 않았습니다.
- 따라서 실제 Android WebView 동작, 시스템 back button, launcher icon, splash 표시를 판정할 수 없습니다.

## 5. QA 환경 준비 문서

- QA 환경 준비 문서: `docs/ANDROID_QA_ENVIRONMENT_SETUP.md`
- Android device QA runbook: `docs/ANDROID_DEVICE_QA_RUNBOOK.md`

필요한 준비:

- Android Studio 또는 Android SDK Platform Tools
- adb PATH 설정
- 실제 Android 기기 USB debugging 허용
- Android Emulator 실행
- `harupuli-debug-apk` artifact 다운로드
- `app-debug.apk` 설치

## 6. 재시도 순서

1. Android QA 환경 준비
2. `adb version` 확인
3. `adb devices` 확인
4. `harupuli-debug-apk` 다운로드
5. `app-debug.apk` 설치
6. 앱 실행
7. icon/splash 표시 QA 재시도
8. WebView localStorage QA 재시도
9. back button QA 재시도
10. 결과 문서 갱신
11. 필요 시 수정 PR 분리

## 7. QA별 다음 판단 기준

### icon/splash QA

Pass라면:

- Google Play 내부 테스트 전 icon/splash 기본 검증 통과

Fail이라면:

- Android resource 수정 PR
- adaptive icon safe area 조정
- splash theme 수정 검토

Blocked라면:

- adb 또는 기기/에뮬레이터 준비 후 재시도

### WebView localStorage QA

Pass라면:

- 프로필, fortune cache, consent, saved readings, visit streak, reward unlock 유지 확인

Fail이라면:

- localStorage 저장/복원 로직 수정 PR

Blocked라면:

- adb 또는 기기/에뮬레이터 준비 후 재시도

### back button QA

Pass라면:

- 별도 handler 없이 현재 UX 허용 가능

Fail이라면:

- `@capacitor/app` 도입 및 backButton listener 구현 검토

Blocked라면:

- adb 또는 기기/에뮬레이터 준비 후 재시도

## 8. 출시 전 필수 QA

- Android icon/splash 실제 표시 QA
- Android WebView localStorage 실제 QA
- Android back button 실제 QA
- Android 12 이상 splash 확인
- 앱 삭제 후 재설치 확인
- `adb install -r` 업데이트 설치 확인
- 앱 데이터 삭제 후 초기화 확인
- 실제 광고 SDK 연동 전 consent 상태 재확인

## 9. 금지/보류 상태

- release build 미진행
- signing 미진행
- iOS 프로젝트 미생성
- 실제 광고 SDK 미연동
- service worker 미구현
- `@capacitor/app` 미추가
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- localStorage key 변경 없음

## 10. 다음 단계

- 실제 기기 또는 에뮬레이터 준비
- Android QA 재시도
- QA 결과가 Pass 또는 Partial Pass가 되면 Google Play 내부 테스트 준비
- Fail이 발생하면 수정 PR 분리
