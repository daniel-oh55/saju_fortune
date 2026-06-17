# ANDROID_BACK_BUTTON_QA_RESULT

## Android device QA execution result 연계

- Android back button 실제 QA는 Android device QA execution result와 함께 확인합니다.
- 문서 경로는 `docs/ANDROID_DEVICE_QA_EXECUTION_RESULT.md`입니다.
- 실제 기기 또는 에뮬레이터에서 확인되기 전까지 Pending 또는 Blocked 상태를 유지합니다.

## QA 상태 요약 연결

- 현재 Android back button QA 상태는 `docs/ANDROID_QA_STATUS_SUMMARY.md`에서도 관리합니다.
- Blocked 해소 후 실제 QA 결과를 본 문서와 summary 문서에 함께 반영합니다.

이 문서는 Android debug APK를 실제 Android 기기 또는 에뮬레이터에 설치한 뒤, Android 시스템 back button 동작을 확인한 결과를 기록하기 위한 문서입니다.

이번 PR은 QA 결과 기록과 검증 스크립트 추가가 목적이며, back button handler 변경 없음, `@capacitor/app` 추가 없음, production logic unchanged 상태를 유지합니다.

## 1. Build Info

- GitHub Actions workflow: Android Debug Build
- workflow run number: 12
- workflow run id: 확인 필요
- artifact name: `harupuli-debug-apk`
- artifact path: `android/app/build/outputs/apk/debug/app-debug.apk`
- APK filename: `app-debug.apk`
- install method: Blocked
- test device/emulator: 미확인, adb 사용 불가로 device/emulator 연결 확인 불가
- Android version: 미확인, adb 사용 불가로 Android version 확인 불가
- test date: 2026-06-15
- QA executor: Codex
- QA 상태: Blocked
- 사유: 현재 로컬 환경에서 `adb version`과 `adb devices` 명령이 실행되지 않아 실제 Android 기기 또는 에뮬레이터 연결을 확인할 수 없습니다.
- 필요한 준비: Android Studio 또는 Android SDK Platform Tools 설치, adb PATH 설정, 실제 Android 기기 USB debugging 허용 또는 Android Emulator 실행, `harupuli-debug-apk` artifact 다운로드
- 다음 재시도 조건: `adb version`이 정상 출력되고 `adb devices`에서 실제 device/emulator가 표시된 뒤 `adb install -r app-debug.apk`로 debug APK 설치가 가능해야 합니다.

## 2. QA Target Screens

- Home
- Today Fortune Detail
- Year Fortune Detail
- Zodiac Fortune Detail
- Saju Insight
- Saved Readings
- Settings
- Privacy Info
- Consent Settings Panel
- Reward Ad Modal
- Onboarding/Profile Input

## 3. Summary Table

| Screen | Expected | Actual | Status |
| --- | --- | --- | --- |
| Home | Back button이 앱 종료 또는 백그라운드 전환 흐름으로 자연스럽게 동작하는지 확인 | adb/device 미준비로 미확인 | Blocked |
| Today Fortune Detail | 이전 화면 또는 Home으로 돌아가는지 확인 | adb/device 미준비로 미확인 | Blocked |
| Year Fortune Detail | 이전 화면 또는 Home으로 돌아가는지 확인 | adb/device 미준비로 미확인 | Blocked |
| Zodiac Fortune Detail | 이전 화면 또는 Home으로 돌아가는지 확인 | adb/device 미준비로 미확인 | Blocked |
| Saju Insight | 이전 화면 또는 Home으로 돌아가는지 확인 | adb/device 미준비로 미확인 | Blocked |
| Saved Readings | 이전 화면 또는 Home으로 돌아가는지 확인 | adb/device 미준비로 미확인 | Blocked |
| Settings | 이전 화면 또는 Home으로 돌아가는지 확인 | adb/device 미준비로 미확인 | Blocked |
| Privacy Info | Settings 또는 이전 화면으로 돌아가는지 확인 | adb/device 미준비로 미확인 | Blocked |
| Consent Settings Panel | Panel만 먼저 닫히는지 확인 | adb/device 미준비로 미확인 | Blocked |
| Reward Ad Modal | Modal만 먼저 닫히거나 보상 흐름이 깨지지 않는지 확인 | adb/device 미준비로 미확인 | Blocked |
| Onboarding/Profile Input | 입력 중 예기치 않은 종료나 데이터 손상이 없는지 확인 | adb/device 미준비로 미확인 | Blocked |

## 4. Detailed QA Results

### Home

- 상태: Blocked
- 확인 예정: Home 화면에서 Android back button을 눌렀을 때 앱 종료, 백그라운드 전환, 또는 사용자에게 자연스러운 종료 흐름이 발생하는지 확인합니다.
- 실제 결과: adb/device 미준비로 미확인

### Fortune Detail

- 상태: Blocked
- 확인 예정: Today Fortune Detail, Year Fortune Detail, Zodiac Fortune Detail 화면에서 back button을 눌렀을 때 사용자가 길을 잃지 않고 이전 화면 또는 Home으로 돌아갈 수 있는지 확인합니다.
- 실제 결과: adb/device 미준비로 미확인

### Saju Insight

- 상태: Blocked
- 확인 예정: Saju Insight 화면에서 back button 동작이 기존 화면 전환 구조와 충돌하지 않는지 확인합니다.
- 실제 결과: adb/device 미준비로 미확인

### Saved Readings

- 상태: Blocked
- 확인 예정: Saved Readings 화면에서 back button을 눌렀을 때 저장 데이터가 손상되지 않고 이전 화면 또는 Home으로 이동하는지 확인합니다.
- 실제 결과: adb/device 미준비로 미확인

### Settings / Privacy Info

- 상태: Blocked
- 확인 예정: Settings와 Privacy Info 화면에서 back button이 설정 패널, 개인정보 안내 흐름, 이전 화면 이동과 자연스럽게 연결되는지 확인합니다.
- 실제 결과: adb/device 미준비로 미확인

### Reward Ad Modal

- 상태: Blocked
- 확인 예정: Reward Ad Modal이 열린 상태에서 back button을 눌렀을 때 모달 닫기 또는 보상 미지급/중단 처리가 기존 mock rewarded ad 흐름과 충돌하지 않는지 확인합니다.
- 실제 결과: adb/device 미준비로 미확인

### Consent Settings Panel

- 상태: Blocked
- 확인 예정: Consent Settings Panel이 열린 상태에서 back button을 눌렀을 때 패널만 먼저 닫히는지 확인합니다.
- 실제 결과: adb/device 미준비로 미확인

### Onboarding/Profile Input

- 상태: Blocked
- 확인 예정: Onboarding/Profile Input 화면에서 입력 중 back button을 눌렀을 때 입력값 손상, 예기치 않은 종료, 화면 복귀 혼동이 없는지 확인합니다.
- 실제 결과: adb/device 미준비로 미확인

## 5. 발견 이슈

- 현재 발견 이슈: 실제 Android 기기 또는 에뮬레이터 QA를 수행하지 못해 동작 이슈를 판정할 수 없습니다.
- 관련 화면: Home, Fortune Detail, Saju Insight, Saved Readings, Settings, Privacy, Modal, Panel, Onboarding
- 재현 단계: adb 환경 준비 후 debug APK 설치가 필요합니다.
- 실제 결과: `adb` 명령이 현재 로컬 환경에서 인식되지 않아 테스트를 시작할 수 없습니다.

## 6. Conclusion

- QA 상태: Blocked
- 결론: Android back button 실제 동작은 아직 Pass, Partial Pass, Fail로 판정하지 않습니다. 현재는 adb/device 준비가 되지 않아 실제 APK 설치와 시스템 back button 조작을 수행할 수 없는 상태입니다.
- production logic unchanged
- back button handler 변경 없음
- `@capacitor/app` 추가 없음

## 7. Next Steps

1. Android Studio 또는 Android SDK Platform Tools를 설치하고 adb PATH를 설정합니다.
2. 실제 Android 기기 USB debugging을 허용하거나 Android Emulator를 실행합니다.
3. GitHub Actions Android Debug Build run number 12의 `harupuli-debug-apk` artifact를 다운로드합니다.
4. `adb install -r app-debug.apk`로 설치합니다.
5. `adb shell monkey -p com.harupuli.app 1` 또는 앱 아이콘으로 실행합니다.
6. `docs/ANDROID_BACK_BUTTON_QA.md` 기준에 따라 화면별 back button QA를 수행합니다.
7. 이 문서를 Pass, Partial Pass, Fail, Blocked 중 실제 결과로 갱신합니다.
