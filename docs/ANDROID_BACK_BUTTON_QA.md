# ANDROID_BACK_BUTTON_QA

이 문서는 하루풀이 Android WebView 환경에서 시스템 뒤로가기 버튼 동작을 확인하기 위한 QA 기준을 정리한 문서입니다.
이번 PR은 QA 기준 정리가 목적이며, production 앱 로직과 Android native 코드는 변경하지 않습니다.

## 1. 목적

- Android 시스템 뒤로가기 버튼이 주요 화면에서 사용자가 기대하는 흐름으로 동작하는지 확인한다.
- 모달, 설정 패널, 상세 화면, 저장 목록, 개인정보 안내 화면에서 뒤로가기 동작을 점검한다.
- 필요 시 후속 PR에서 Capacitor back button handling 구현 여부를 판단한다.

## 2. 현재 상태

- Android Debug Build workflow 성공
- debug APK artifact 생성 확인
- Android WebView localStorage QA는 아직 Blocked
- 실제 기기/에뮬레이터 QA는 아직 수행 전
- 이번 문서는 back button QA 기준만 정리
- production 코드 변경 없음

## 3. 확인 대상 화면

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

## 4. 기대 동작 기준

### Home 화면

- Home에서 Android 뒤로가기를 누르면 앱 종료 또는 백그라운드 전환 후보 동작을 확인한다.
- 실제 기대 동작은 QA 결과에 따라 확정한다.

### 상세 화면

- Fortune Detail에서 뒤로가기를 누르면 Home으로 돌아가는 것이 자연스러운지 확인한다.
- Saju Insight에서 뒤로가기를 누르면 Home 또는 이전 화면으로 돌아가는 것이 자연스러운지 확인한다.
- Saved Readings에서 뒤로가기를 누르면 Home으로 돌아가는 것이 자연스러운지 확인한다.
- Settings에서 뒤로가기를 누르면 Home으로 돌아가는 것이 자연스러운지 확인한다.
- Privacy Info에서 뒤로가기를 누르면 Settings 또는 Home으로 돌아가는 것이 자연스러운지 확인한다.

### 모달/패널

- Reward Ad Modal이 열린 상태에서 뒤로가기를 누르면 모달만 닫히는 것이 자연스러운지 확인한다.
- Consent Settings Panel이 열린 상태에서 뒤로가기를 누르면 패널만 닫히는 것이 자연스러운지 확인한다.
- 모달이 닫힌 후 다시 뒤로가기를 누르면 화면 이동 또는 앱 종료 후보 동작을 확인한다.

### 온보딩

- 온보딩 중 뒤로가기를 누르면 앱 종료, 이전 입력 단계, 또는 아무 동작 없음 중 어떤 흐름이 적절한지 확인한다.
- 프로필 입력 중 실수로 앱이 종료되는 UX 문제가 있는지 확인한다.

## 5. QA 시나리오

| 화면 | 조작 | 기대 결과 | 실제 결과 | 상태 |
| --- | --- | --- | --- | --- |
| Home | Back | 앱 종료 또는 백그라운드 후보 | 미확인 | Pending |
| Fortune Detail | Back | Home 또는 이전 화면 | 미확인 | Pending |
| Saju Insight | Back | Home 또는 이전 화면 | 미확인 | Pending |
| Saved Readings | Back | Home 또는 이전 화면 | 미확인 | Pending |
| Settings | Back | Home 또는 이전 화면 | 미확인 | Pending |
| Privacy Info | Back | Settings 또는 이전 화면 | 미확인 | Pending |
| Reward Ad Modal | Back | 모달 닫힘 | 미확인 | Pending |
| Consent Settings Panel | Back | 패널 닫힘 | 미확인 | Pending |
| Onboarding | Back | UX 확인 필요 | 미확인 | Pending |

## 6. 통과 기준

- 뒤로가기 버튼이 앱을 예기치 않게 종료하지 않는다.
- 모달/패널이 열린 상태에서는 먼저 모달/패널이 닫힌다.
- 주요 상세 화면에서 사용자가 길을 잃지 않는다.
- 저장 데이터나 localStorage가 뒤로가기 조작으로 손상되지 않는다.
- 사용자가 다시 Home으로 돌아갈 수 있는 흐름이 명확하다.

## 7. 실패 시 기록 기준

실패 시 아래 항목을 기록합니다.

- 기기/에뮬레이터 정보
- Android 버전
- 현재 화면
- 조작 단계
- 기대 결과
- 실제 결과
- 재현 가능 여부
- 관련 화면 컴포넌트 후보
- Capacitor backButton handler 필요 여부

## 8. 후속 구현 후보

- 현재 앱이 내부 activePage 상태 기반이라 Android 시스템 back button이 원하는 화면 이동과 다를 수 있다.
- 실제 QA 결과에 따라 `@capacitor/app`의 backButton listener 도입 여부를 검토한다.
- 구현 PR은 별도 단계에서 진행한다.
- 이번 PR에서는 구현하지 않는다.

## 9. 다음 단계

- Android back button 실제 QA 수행
- 필요 시 back button handler 구현 PR
- Android 리소스 적용
- release build/signing 준비
