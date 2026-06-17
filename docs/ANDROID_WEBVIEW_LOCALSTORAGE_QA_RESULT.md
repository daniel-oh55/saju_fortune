# ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT

## Android device QA unblock readiness 연결

- WebView localStorage 실제 QA는 Android device QA unblock readiness 확인 이후 진행합니다.
- 문서 경로는 `docs/ANDROID_DEVICE_QA_UNBLOCK_READINESS.md`입니다.
- 실제 설치와 앱 실행 전까지 localStorage QA는 Pending 또는 Blocked 상태를 유지합니다.

## APK 설치/앱 실행 선행 조건

- WebView localStorage 실제 QA는 APK 설치와 앱 실행 이후 진행할 수 있습니다.
- 선행 확인 문서는 `docs/ANDROID_DEBUG_APK_INSTALL_LAUNCH_QA_RESULT.md`입니다.
- 실제 설치 전까지 localStorage QA는 Pending 또는 Blocked 상태를 유지합니다.

## Android device QA execution result 연계

- WebView localStorage 실제 QA는 Android device QA execution result와 함께 확인합니다.
- 문서 경로는 `docs/ANDROID_DEVICE_QA_EXECUTION_RESULT.md`입니다.
- 실제 기기 또는 에뮬레이터에서 확인되기 전까지 Pending 또는 Blocked 상태를 유지합니다.

## QA 상태 요약 연결

- 현재 WebView localStorage QA 상태는 `docs/ANDROID_QA_STATUS_SUMMARY.md`에서도 관리합니다.
- Blocked 해소 후 실제 QA 결과를 본 문서와 summary 문서에 함께 반영합니다.

## QA 환경 준비 연결

- 현재 localStorage QA 결과는 Blocked입니다.
- Blocked 해소를 위해 `docs/ANDROID_QA_ENVIRONMENT_SETUP.md`를 참고합니다.
- adb, 실제 기기 또는 에뮬레이터 준비 후 QA를 재시도합니다.

이 문서는 하루풀이 Android debug APK를 실제 기기 또는 에뮬레이터에서 실행하여 WebView localStorage 유지 동작을 확인한 결과를 기록하는 문서입니다.
이번 PR은 QA 결과 기록이 목적이며, production 앱 로직과 localStorage key는 변경하지 않습니다.

## 1. QA 대상 빌드

- GitHub Actions workflow: Android Debug Build
- workflow run 번호: 미기록, 현재 Codex 세션에서 GitHub Actions run 번호 조회 및 artifact 다운로드를 수행하지 못했습니다.
- artifact 이름: `harupuli-debug-apk`
- artifact 경로: `android/app/build/outputs/apk/debug/app-debug.apk`
- APK 설치 방식: Blocked, 현재 Codex 실행 환경에서 `adb` 명령을 찾을 수 없고 Android 기기 또는 에뮬레이터 접근도 불가
- 테스트 기기 또는 에뮬레이터: Blocked, 준비 필요
- Android 버전: Blocked, 확인 필요
- 테스트 일자: 2026-06-14
- QA 수행자: Codex 기록 보조, 실제 기기 QA는 사용자 또는 Android QA 환경에서 재시도 필요
- release build 미진행
- signing 미진행
- QA 상태: Blocked
- 사유: 현재 작업 환경에는 `adb`가 설치되어 있지 않고 Android 기기, Android Emulator, APK 설치 및 실행 환경이 연결되어 있지 않아 실제 WebView localStorage 동작을 확인할 수 없습니다.
- 필요한 준비: Android Platform Tools 설치, `adb version` 실행 가능 상태 확보, `harupuli-debug-apk` artifact 다운로드, Android 기기 또는 에뮬레이터 준비, APK 설치 권한 확인
- 다음 재시도 조건: `adb devices`에서 실제 기기 또는 에뮬레이터가 표시되고, `app-debug.apk` 설치 후 앱 실행 가능 상태 확보

## 2. 확인 대상 localStorage key

아래 key를 유지합니다.

- `aiTodayFortune.profile`
- `aiTodayFortune.todayFortune`
- `aiTodayFortune.rewardUnlocks`
- `harupuli_consent_preferences_v1`
- `harupuli_saved_readings_v1`
- `harupuli_visit_streak_v1`

주의:

- key 이름을 새로 만들지 않습니다.
- 기존 key를 변경하지 않습니다.

## 3. QA 결과 요약

| 항목 | 결과 | 메모 |
| --- | --- | --- |
| 최초 실행 | Blocked | Android 기기 또는 에뮬레이터 미연결 |
| 앱 재실행 후 프로필 유지 | Blocked | 실제 WebView 실행 환경 필요 |
| 오늘 운세 cache 유지 | Blocked | 실제 WebView 실행 환경 필요 |
| 동의 설정 유지 | Blocked | 실제 WebView 실행 환경 필요 |
| 저장한 풀이 유지 | Blocked | 실제 WebView 실행 환경 필요 |
| 저장한 풀이 삭제 유지 | Blocked | 실제 WebView 실행 환경 필요 |
| 방문 streak 유지 | Blocked | 실제 WebView 실행 환경 필요 |
| 보상 unlock 유지 | Blocked | 실제 WebView 실행 환경 필요 |
| 앱 데이터 삭제 후 초기화 | Blocked | Android 앱 정보 화면 접근 필요 |
| 동일 packageName 재설치/업데이트 | Blocked | APK 설치 및 업데이트 시나리오 필요 |

## 4. 상세 QA 시나리오

### 4.1 최초 실행

기대 결과:

- 앱 설치 후 첫 실행 시 온보딩 화면이 표시된다.
- 프로필 입력 후 오늘 운세가 생성된다.
- 데이터 사용 동의 배너가 표시된다.
- 기본 운세가 표시된다.

실제 결과:

- 결과: Blocked
- 메모: Android 기기 또는 에뮬레이터 환경이 준비되지 않아 APK 설치 및 최초 실행을 확인하지 못했습니다.

### 4.2 앱 재실행 후 데이터 유지

기대 결과:

- 앱 종료 후 재실행해도 프로필이 유지된다.
- 오늘 운세 cache가 유지된다.
- 사주 분석 결과가 유지된다.
- 동의 설정이 유지된다.

실제 결과:

- 결과: Blocked
- 메모: 실제 WebView 실행 환경에서 앱 종료 후 재실행이 필요합니다.

### 4.3 저장한 풀이 유지

기대 결과:

- 운세 또는 사주 풀이를 저장할 수 있다.
- 저장 목록에 표시된다.
- 앱 재실행 후에도 저장 목록이 유지된다.
- 저장 삭제 후 재실행해도 삭제 상태가 유지된다.

실제 결과:

- 결과: Blocked
- 메모: 실제 WebView 실행 환경에서 저장, 재실행, 삭제 유지 시나리오 확인이 필요합니다.

### 4.4 방문 streak 유지

기대 결과:

- 방문 streak가 정책대로 기록된다.
- 앱 재실행 후 streak 정보가 유지된다.
- 날짜 변경 전후 정책은 별도 확인이 필요하면 메모한다.

실제 결과:

- 결과: Blocked
- 메모: 실제 WebView 실행 환경에서 방문 streak 저장과 유지 여부 확인이 필요합니다.

### 4.5 보상 unlock 유지

기대 결과:

- mock rewarded ad를 통해 상세 해석이 unlock된다.
- 앱 재실행 후 unlock 상태가 정책대로 유지된다.
- 날짜가 바뀌면 정책대로 초기화된다.

실제 결과:

- 결과: Blocked
- 메모: 실제 WebView 실행 환경에서 mock rewarded ad unlock과 앱 재실행 후 유지 여부 확인이 필요합니다.

### 4.6 동의 설정 유지

기대 결과:

- 데이터 사용 설정에서 광고/분석/개인화 동의 상태를 변경할 수 있다.
- 앱 재실행 후 설정값이 유지된다.

실제 결과:

- 결과: Blocked
- 메모: 실제 WebView 실행 환경에서 동의 설정 변경과 재실행 후 유지 여부 확인이 필요합니다.

### 4.7 앱 데이터 삭제 후 초기화

기대 결과:

- Android 앱 정보에서 저장공간/데이터 삭제 후 앱을 재실행하면 온보딩부터 다시 시작한다.
- 기존 localStorage 데이터가 초기화된다.

실제 결과:

- 결과: Blocked
- 메모: Android 앱 정보의 저장공간/데이터 삭제 화면 접근이 필요합니다.

### 4.8 동일 packageName 재설치/업데이트

기대 결과:

- 동일 packageName으로 debug APK를 재설치 또는 업데이트하면 앱 데이터가 유지된다.
- localStorage key가 유지된다.

실제 결과:

- 결과: Blocked
- 메모: 동일 packageName APK 재설치 또는 업데이트 시나리오를 실제 기기/에뮬레이터에서 확인해야 합니다.

## 5. 발견 이슈

- 현재 기록된 앱 이슈 없음
- 단, 실제 기기/에뮬레이터 환경 부재로 QA 수행이 Blocked 상태입니다.

## 6. 결론

Blocked: 실제 기기/에뮬레이터 환경 또는 APK 설치 조건이 준비되지 않아 QA를 완료하지 못했습니다.

## 7. 다음 단계

- 실제 기기 또는 에뮬레이터 준비
- `harupuli-debug-apk` artifact 다운로드
- `app-debug.apk` 설치 재시도
- Android WebView localStorage QA 재실행

## 실제 QA 재시도 준비

- PR #76의 QA 상태는 Blocked입니다.
- 실제 기기 또는 에뮬레이터에서 QA를 수행하기 위한 runbook을 추가했습니다.
- runbook 문서는 `docs/ANDROID_DEVICE_QA_RUNBOOK.md`입니다.
- 다음 재시도 시 artifact `harupuli-debug-apk`를 다운로드해 `app-debug.apk`를 설치합니다.
- 실제 QA 수행 후 이 문서의 QA 상태를 Pass, Partial Pass, Fail, Blocked 중 하나로 갱신합니다.
