# ANDROID_ICON_SPLASH_QA

## 실제 QA 결과 문서

- 실제 icon/splash 표시 QA 결과는 `docs/ANDROID_ICON_SPLASH_QA_RESULT.md`에 기록합니다.
- QA 결과는 Pass, Partial Pass, Fail, Blocked 중 하나로 분류합니다.
- 문제가 발견되면 관련 리소스 경로와 재현 단계를 기록합니다.
- 이번 단계에서는 Android 리소스 파일을 변경하지 않았습니다.

이 문서는 하루풀리 Android 앱의 launcher icon, round icon, adaptive icon, splash 표시를 실제 Android 기기 또는 에뮬레이터에서 확인하기 위한 QA 기준을 정리한 문서입니다.

이번 PR은 QA 기준 정리가 목적이며, Android 리소스와 production 앱 로직은 변경하지 않습니다.

## 1. 목적

- Android `res` 경로에 적용한 앱 아이콘과 splash 후보 리소스가 실제 기기에서 어떻게 표시되는지 확인합니다.
- launcher icon, round icon, adaptive icon, Android 12 이상 splash 표시를 구분해 확인합니다.
- Google Play 내부 테스트 전에 아이콘과 splash 표시 문제를 사전에 발견합니다.

## 2. 현재 리소스 적용 상태

- Android launcher icon 적용 완료
- Android round icon 적용 완료
- Android adaptive icon foreground/background 적용 완료
- Android adaptive icon XML 적용 완료
- Android splash 후보 PNG 추가 완료
- Android Debug Build run number 9 success 확인
- debug APK artifact `harupuli-debug-apk` 생성 확인
- 실제 기기 icon/splash 표시 QA는 아직 미진행
- release build와 signing은 아직 미진행

## 3. 확인 대상 리소스

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

주의:

- 현재 launch theme이 실제로 `harupuli_splash`를 참조하는지는 후속 QA에서 확인합니다.
- Android 12 이상 splash 표시 방식은 기기 OS 버전에 따라 다를 수 있습니다.

## 4. QA 준비물

- GitHub Actions artifact `harupuli-debug-apk`
- `app-debug.apk`
- Android 실제 기기 또는 Emulator
- adb 사용 가능 환경
- Android 버전 확인 가능 상태
- 필요 시 다양한 launcher 환경

## 5. QA 시나리오

| 항목 | 조작 | 기대 결과 | 실제 결과 | 상태 |
| --- | --- | --- | --- | --- |
| Launcher icon | 앱 설치 후 홈 화면 확인 | 하루풀리 아이콘 표시 | 미확인 | Pending |
| Round icon | round icon 지원 launcher에서 확인 | 둥근 아이콘 표시 | 미확인 | Pending |
| Adaptive icon | Android 8 이상 launcher에서 확인 | foreground/background 조합 표시 | 미확인 | Pending |
| Android 12 splash | Android 12 이상에서 앱 실행 | splash 또는 기본 launch 화면 확인 | 미확인 | Pending |
| Recent apps icon | 앱 실행 후 최근 앱 화면 확인 | 앱 아이콘 정상 표시 | 미확인 | Pending |
| App info icon | Android 앱 정보 화면 확인 | 앱 아이콘 정상 표시 | 미확인 | Pending |
| 앱 삭제 후 재설치 | 삭제 후 재설치 | 아이콘 깨짐 없음 | 미확인 | Pending |
| 업데이트 설치 | `adb install -r` | 아이콘 유지 | 미확인 | Pending |

## 6. 통과 기준

- launcher icon이 기본 Capacitor 아이콘이 아니라 하루풀리 아이콘으로 표시됩니다.
- round icon 지원 launcher에서 둥근 아이콘이 깨지지 않습니다.
- adaptive icon foreground/background가 과하게 잘리거나 깨지지 않습니다.
- Android 12 이상 splash 화면에서 앱 브랜드가 어색하게 보이지 않습니다.
- recent apps, app info 화면에서 앱 아이콘이 정상 표시됩니다.
- 앱 삭제 후 재설치, 업데이트 설치 전후에도 아이콘 표시가 유지됩니다.

## 7. 실패 시 기록 기준

실패 시 아래 내용을 기록합니다.

- 기기/에뮬레이터 정보
- Android 버전
- launcher 종류
- 확인 위치
- 기대 결과
- 실제 결과
- 화면 캡처 필요 여부
- 관련 리소스 경로
- 수정 후보
- 후속 PR 필요 여부

## 8. 후속 구현 후보

- splash 후보 PNG가 실제 launch theme에 반영되지 않는 경우 theme/style 수정 PR 검토
- Android 12 이상 splash가 기본 아이콘만 표시되는 경우 `values-v31` splash 설정 검토
- adaptive icon이 잘리는 경우 foreground safe area 재생성 검토
- round icon이 어색한 경우 별도 round icon PNG 생성 검토

이번 PR에서는 위 구현을 진행하지 않습니다.

## 9. 다음 단계

- Android icon/splash 실제 표시 QA 수행
- 필요 시 Android splash theme 수정
- 필요 시 adaptive icon 조정
- Android WebView localStorage 실제 QA 재시도
- Android back button 실제 QA
