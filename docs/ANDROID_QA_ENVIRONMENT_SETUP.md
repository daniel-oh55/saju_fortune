# ANDROID_QA_ENVIRONMENT_SETUP

## 2026-06-15 Android back button QA 결과 연결

- Android back button 실제 QA 결과 문서는 `docs/ANDROID_BACK_BUTTON_QA_RESULT.md`입니다.
- 현재 로컬 환경에서는 `adb` 명령이 인식되지 않아 실제 기기 또는 에뮬레이터 QA가 Blocked 상태입니다.
- `adb version`, `adb devices`, `adb install -r app-debug.apk`가 가능한 환경을 준비한 뒤 결과 문서를 갱신합니다.

이 문서는 하루풀이 Android debug APK를 실제 기기 또는 에뮬레이터에서 QA하기 위해 필요한 로컬 Android QA 환경 준비 절차를 정리한 문서입니다.

이번 PR은 QA 환경 준비 문서화가 목적이며, production 앱 로직과 Android 리소스는 변경하지 않습니다.

## 1. 목적

- Android WebView localStorage QA, Android back button QA, Android icon/splash 표시 QA가 실제 환경 부재로 Blocked 상태입니다.
- 이를 해소하기 위해 Android Studio, SDK Platform Tools, adb, Emulator 또는 실제 기기 연결 준비 절차를 정리합니다.
- 실제 QA 수행 전 필요한 체크리스트를 제공합니다.

## 2. 현재 Blocked 상태

- Android WebView localStorage QA: Blocked
- Android icon/splash 표시 QA: Blocked
- Android back button 실제 QA: Pending
- 공통 사유: adb 사용 불가, 실제 Android 기기 또는 에뮬레이터 연결 불가
- debug APK artifact는 GitHub Actions에서 생성 가능
- QA 환경 준비 후 artifact를 다운로드해 설치해야 함

## 3. 필요한 준비물

- Android Studio 또는 Android SDK Platform Tools
- adb 명령 사용 가능 환경
- 실제 Android 기기 또는 Android Emulator
- USB debugging 활성화
- GitHub Actions artifact `harupuli-debug-apk`
- APK 파일 `app-debug.apk`
- 테스트 packageName `com.harupuli.app`

## 4. Android Studio 설치 후 확인 항목

- Android SDK 설치 확인
- SDK Platform Tools 설치 확인
- Android Emulator 설치 확인
- Android SDK 경로 확인
- 환경 변수 또는 PATH 설정 필요 여부 확인

## 5. adb PATH 확인

아래 명령으로 adb가 사용 가능한지 확인합니다.

```bash
adb version
adb devices
```

Windows PowerShell 기준 확인 예시:

```powershell
adb version
adb devices
```

기대 결과:

- `adb version`이 정상 출력됩니다.
- `adb devices`에서 실제 기기 또는 emulator가 표시됩니다.

## 6. 실제 Android 기기 준비

- 개발자 옵션 활성화
- USB debugging 활성화
- USB 케이블 연결
- 기기에서 USB debugging 허용
- `adb devices`에서 device 상태 확인
- `unauthorized` 상태면 기기 허용 팝업 확인

## 7. Android Emulator 준비

- Android Studio Device Manager 열기
- Android 12 이상 emulator 생성 권장
- Android 8 이상 emulator는 adaptive icon 확인용으로 사용 가능
- emulator 실행
- `adb devices`에서 emulator 표시 확인

## 8. APK 다운로드 및 설치

1. GitHub Actions > Android Debug Build > 성공한 run 선택
2. artifact `harupuli-debug-apk` 다운로드
3. zip 압축 해제
4. `app-debug.apk` 확인
5. 아래 명령으로 설치

```bash
adb install -r app-debug.apk
```

앱 데이터 초기화가 필요한 경우:

```bash
adb shell pm clear com.harupuli.app
```

주의:

- `pm clear`는 앱 데이터를 삭제합니다.
- localStorage도 초기화됩니다.
- localStorage 유지 QA와 초기화 QA는 구분해야 합니다.

## 9. 앱 실행 확인

아래 명령으로 앱 실행을 시도할 수 있습니다.

```bash
adb shell monkey -p com.harupuli.app 1
```

또는 앱 아이콘을 직접 눌러 실행합니다.

## 10. logcat 확인

아래 명령으로 로그를 확인합니다.

```bash
adb logcat | grep -i harupuli
```

Windows PowerShell 대체 예시:

```powershell
adb logcat | Select-String -Pattern "harupuli"
```

## 11. QA 재시도 순서

1. Android QA 환경 준비
2. `adb version` 확인
3. `adb devices` 확인
4. `harupuli-debug-apk` 다운로드
5. `app-debug.apk` 설치
6. 앱 실행
7. Android icon/splash 표시 QA 재시도
8. Android WebView localStorage QA 재시도
9. Android back button QA 재시도
10. 결과 문서 갱신

## 12. 통과 기준

- `adb version`이 정상 출력됩니다.
- `adb devices`에 실제 기기 또는 emulator가 표시됩니다.
- `app-debug.apk` 설치가 가능합니다.
- `com.harupuli.app` 실행이 가능합니다.
- logcat 확인이 가능합니다.
- icon/splash, localStorage, back button QA를 실제 수행할 수 있습니다.

## 13. 실패 시 확인 항목

- adb가 PATH에 있는지 확인
- Android SDK Platform Tools 설치 여부 확인
- USB debugging 허용 여부 확인
- emulator 실행 여부 확인
- packageName 확인
- APK 파일 위치 확인
- adb install 오류 메시지 기록
- logcat 오류 기록

## 14. 다음 단계

- Android icon/splash 실제 표시 QA 재시도
- Android WebView localStorage 실제 QA 재시도
- Android back button 실제 QA 재시도
- 필요 시 Android resource 수정 또는 back button handler 구현
