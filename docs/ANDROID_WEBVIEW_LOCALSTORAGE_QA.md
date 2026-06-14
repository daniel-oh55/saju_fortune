# ANDROID_WEBVIEW_LOCALSTORAGE_QA

이 문서는 하루풀이 Android WebView 환경에서 localStorage 기반 데이터가 정상적으로 저장, 유지, 초기화되는지 확인하기 위한 QA 기준을 정리한 문서입니다.
이번 PR은 QA 기준 정리가 목적이며, production 앱 로직과 localStorage key는 변경하지 않습니다.

## 1. 목적

- Android WebView에서 기존 웹앱의 저장 구조가 그대로 동작하는지 확인한다.
- 온보딩, 운세 캐시, 동의 설정, 저장한 풀이, 방문 streak, 광고 보상 unlock 상태가 유지되는지 확인한다.
- 앱 강제 종료, 재실행, Android debug APK 재설치 시나리오를 점검한다.

## 2. 현재 Android build 상태

- GitHub Actions Android Debug Build 성공
- debug APK artifact 생성 확인
- artifact 이름: `harupuli-debug-apk`
- artifact 경로: `android/app/build/outputs/apk/debug/app-debug.apk`
- release build 미진행
- signing 미진행
- 실제 기기 QA 미진행
- Android 리소스 수동 적용 미진행

## 3. 확인 대상 localStorage key

현재 코드 기준으로 확인한 localStorage key는 아래와 같습니다. QA 중 key 이름을 새로 만들거나 변경하지 않습니다.

| 저장 항목 | localStorage key | 관련 파일 |
| --- | --- | --- |
| 프로필 입력 정보 | `aiTodayFortune.profile` | `src/utils/storage.js` |
| 오늘 운세/사주 cache | `aiTodayFortune.todayFortune` | `src/utils/storage.js` |
| 보상형 광고 unlock 상태 | `aiTodayFortune.rewardUnlocks` | `src/utils/storage.js` |
| 데이터 사용 동의 설정 | `harupuli_consent_preferences_v1` | `src/utils/consentPreferencesStorage.js` |
| 저장한 풀이 | `harupuli_saved_readings_v1` | `src/utils/savedReadingsStorage.js` |
| 방문 streak | `harupuli_visit_streak_v1` | `src/utils/visitStreakStorage.js` |

## 4. QA 시나리오

### 최초 실행

- [ ] 앱 설치 후 첫 실행
- [ ] 온보딩 화면 표시
- [ ] 프로필 입력
- [ ] 오늘 운세 생성
- [ ] 데이터 사용 동의 배너 표시 여부
- [ ] 기본 운세 표시

### 앱 재실행

- [ ] 앱 종료 후 재실행
- [ ] 프로필 유지
- [ ] 오늘 운세 cache 유지
- [ ] 사주 분석 결과 유지
- [ ] 방문 streak 증가 또는 유지 정책 확인
- [ ] 동의 설정 유지

### 저장한 풀이

- [ ] 운세 또는 사주 풀이 저장
- [ ] 저장 목록에서 확인
- [ ] 앱 종료 후 재실행
- [ ] 저장 목록 유지 확인
- [ ] 저장 삭제 후 재실행
- [ ] 삭제 상태 유지 확인

### 광고 보상 unlock

- [ ] mock rewarded ad로 상세 해석 unlock
- [ ] 앱 종료 후 재실행
- [ ] unlock 상태 유지 여부 확인
- [ ] 날짜가 바뀌면 정책대로 초기화되는지 확인

### 동의 설정

- [ ] 데이터 사용 설정 열기
- [ ] 광고/분석/개인화 동의 상태 변경
- [ ] 앱 종료 후 재실행
- [ ] 설정값 유지 확인

### 앱 데이터 초기화

- [ ] Android 앱 정보에서 저장공간/데이터 삭제
- [ ] 앱 재실행
- [ ] 온보딩부터 다시 시작하는지 확인
- [ ] 기존 저장 데이터가 초기화되었는지 확인

### 앱 업데이트 시나리오

- [ ] 동일 packageName으로 debug APK 재설치 또는 업데이트
- [ ] 앱 데이터 유지 여부 확인
- [ ] localStorage key가 유지되는지 확인

## 5. 통과 기준

- 기존 localStorage key 변경 없음
- 앱 종료/재실행 후 저장 데이터 유지
- 저장한 풀이 유지
- 동의 설정 유지
- 방문 streak 정책 유지
- 보상 unlock 정책 유지
- Android 앱 데이터 삭제 시 초기화 정상
- production 웹앱과 Android WebView 동작이 크게 다르지 않음

## 6. 실패 시 기록 기준

실패 시 아래 항목을 기록합니다.

- 기기/에뮬레이터 정보
- Android 버전
- APK artifact run 정보
- 재현 단계
- 기대 결과
- 실제 결과
- 관련 localStorage key
- 화면 캡처 필요 여부
- 수정 필요 파일 후보

## 7. 다음 단계

- Android WebView localStorage 실제 QA 수행
- Android back button QA
- Android 리소스 적용
- release build/signing 준비
