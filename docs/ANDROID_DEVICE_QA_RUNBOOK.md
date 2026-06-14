# ANDROID_DEVICE_QA_RUNBOOK

## 2026-06-15 Android back button QA 결과 문서

- Android back button 실제 QA 결과는 `docs/ANDROID_BACK_BUTTON_QA_RESULT.md`에 기록합니다.
- 현재 결과는 adb/device 준비 전이므로 Blocked이며, 실제 기기 또는 에뮬레이터 연결 후 재시도해야 합니다.
- 이 결과 문서는 back button handler 구현 여부를 결정하기 전 참고 자료로 사용합니다.

## Android QA 환경 준비 문서

- 실제 기기 또는 에뮬레이터 QA 환경 준비 절차는 `docs/ANDROID_QA_ENVIRONMENT_SETUP.md`를 참고합니다.
- adb 설치, `adb devices` 확인, APK 설치, 앱 데이터 삭제, logcat 확인 절차를 해당 문서에서 관리합니다.

## 2026-06-14 Android icon/splash QA 결과 연결

- Android icon/splash 표시 QA 결과는 `docs/ANDROID_ICON_SPLASH_QA_RESULT.md`에 기록합니다.
- 현재 결과가 Blocked이면 실제 기기 또는 에뮬레이터와 adb 환경 준비 후 재시도합니다.
- APK 설치 후 launcher icon, round icon, adaptive icon, Android 12 splash 표시를 다시 확인합니다.

## 2026-06-14 Android icon/splash 표시 QA 연결

- Android 앱 아이콘과 splash 표시 QA 기준은 `docs/ANDROID_ICON_SPLASH_QA.md`를 참고합니다.
- APK 설치 후 홈 화면, 최근 앱, 앱 정보 화면, Android 12 이상 splash 표시를 확인합니다.

이 문서는 하루풀이 Android debug APK를 실제 Android 기기 또는 에뮬레이터에 설치하고 WebView localStorage QA를 수행하기 위한 실행 절차를 정리한 문서입니다.
이번 PR은 QA 실행 준비 문서화가 목적이며, production 앱 로직과 localStorage key는 변경하지 않습니다.

## 1. 목적

- GitHub Actions에서 생성된 debug APK를 실제 Android 환경에 설치한다.
- Android WebView localStorage QA를 수행할 수 있는 준비 절차를 정리한다.
- PR #76의 QA Blocked 상태를 해소하기 위한 준비 단계를 명확히 한다.

## 2. 필요한 준비물

- Android 실제 기기 또는 Android Emulator
- USB debugging 활성화 또는 Emulator 실행 상태
- Android Platform Tools 또는 `adb` 사용 가능 환경
- GitHub Actions artifact `harupuli-debug-apk`
- APK 파일: `app-debug.apk`
- 테스트할 packageName: `com.harupuli.app`

## 3. debug APK artifact 다운로드

GitHub UI 기준 절차:

- GitHub repository로 이동
- Actions 탭으로 이동
- Android Debug Build workflow 선택
- 성공한 run 선택
- Artifacts에서 `harupuli-debug-apk` 다운로드
- zip 압축 해제
- `app-debug.apk` 확인

GitHub CLI 사용 시 후보 명령:

```bash
gh run list --workflow "Android Debug Build"
gh run download <RUN_ID> -n harupuli-debug-apk
```

## 4. ADB 연결 확인

아래 명령으로 `adb` 설치와 기기 연결 상태를 확인합니다.

```bash
adb version
adb devices
```

기대 결과:

- 실제 기기 또는 emulator가 devices 목록에 표시된다.
- `unauthorized` 상태라면 기기에서 USB debugging 허용을 확인한다.

## 5. APK 설치

아래 명령으로 debug APK를 설치합니다.

```bash
adb install -r app-debug.apk
```

필요 시 기존 앱 데이터 초기화를 위해 아래 명령을 사용합니다.

```bash
adb shell pm clear com.harupuli.app
```

주의:

- `pm clear`는 앱 데이터를 삭제하므로 localStorage도 초기화됩니다.
- localStorage 유지 QA와 앱 데이터 초기화 QA는 별도 시나리오로 구분합니다.

## 6. 앱 실행

아래 명령 후보로 앱을 실행합니다.

```bash
adb shell monkey -p com.harupuli.app 1
```

또는 실제 기기에서 앱 아이콘을 눌러 실행합니다.

## 7. logcat 확인

Android/macOS/Linux shell 후보:

```bash
adb logcat | grep -i harupuli
```

Windows PowerShell 대체 예시:

```powershell
adb logcat | Select-String -Pattern "harupuli"
```

## 8. Android WebView localStorage QA 실행 순서

1. 앱 데이터 초기화 상태에서 앱 실행
2. 온보딩 진행
3. 프로필 입력
4. 오늘 운세 생성
5. 동의 설정 변경
6. 저장한 풀이 추가
7. mock rewarded ad unlock 수행
8. 앱 종료
9. 앱 재실행
10. 프로필 유지 확인
11. 오늘 운세 cache 유지 확인
12. 동의 설정 유지 확인
13. 저장한 풀이 유지 확인
14. 방문 streak 유지 확인
15. reward unlock 유지 확인
16. 저장한 풀이 삭제 후 재실행
17. 앱 데이터 삭제 후 초기화 확인
18. 동일 packageName 재설치/업데이트 후 데이터 유지 여부 확인

## 9. QA 결과 기록 위치

실제 QA 결과는 `docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md`에 기록합니다.
PR #76에서는 실제 기기/에뮬레이터 접근 불가로 Blocked 상태였으므로, 실제 QA 수행 후 해당 문서를 Pass, Partial Pass, Fail, Blocked 중 하나로 갱신합니다.

## 10. 실패 시 확인 항목

- `adb devices`에 기기가 보이지 않는지 확인
- USB debugging 허용 여부 확인
- emulator 실행 여부 확인
- APK 설치 실패 메시지 확인
- packageName이 `com.harupuli.app`인지 확인
- 앱 데이터 삭제 여부 확인
- Android 버전 기록
- logcat 오류 기록
- localStorage key 변경 여부 확인

## 11. 다음 단계

- 실제 기기 또는 에뮬레이터에서 localStorage QA 재실행
- QA 결과 문서 갱신
- Android back button QA
- Android 리소스 적용

## Android back button QA 연계

- Android 시스템 뒤로가기 버튼 QA 기준은 `docs/ANDROID_BACK_BUTTON_QA.md`를 참고합니다.
- localStorage QA와 별도로 화면 이동, 모달 닫힘, 앱 종료 후보 동작을 확인합니다.
- 실제 QA 결과에 따라 별도 back button handler 구현 PR을 검토합니다.
