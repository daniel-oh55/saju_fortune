# ANDROID_DEBUG_APK_ARTIFACT_REFRESH_RUN38

이 문서는 하루풀이 Android Debug Build run #38에서 생성된 최신 debug APK artifact 정보를 QA 문서 기준에 반영하기 위한 문서입니다.
이번 PR은 artifact 기준 갱신과 문구 정합성 보정이 목적이며, 실제 APK 다운로드 수행, APK 설치 수행, 앱 실행 수행, 실제 기기 QA 성공 판정, Google Play Console 입력, release build, signing, AAB 생성, production 코드 로직 변경은 진행하지 않습니다.

## 1. 목적

- Android Debug Build run #38의 최신 harupuli-debug-apk artifact 정보를 기록합니다.
- QA 관련 문서에서 사용할 최신 artifact 기준을 정리합니다.
- 실제 다운로드, 압축 해제, 설치, 앱 실행 전까지 상태는 Pending으로 유지합니다.
- Android 실제 기기 QA는 Blocked 상태를 유지합니다.
- TODO 문구 정합성을 보정합니다.

## 2. 최신 artifact 정보

- 기준 workflow: Android Debug Build
- 기준 run number: #38
- 기준 branch: docs/android-device-qa-unblock-readiness
- 기준 head sha: 33a6ff4b60459fb9e9d9bb0b047df759b19bf559
- artifact 이름: harupuli-debug-apk
- artifact id: 7685703968
- artifact digest: sha256:69bea66d93fbe5e4d77e82aa2d93af318feb972e99c4e37cf6c08aafb217d076
- artifact 생성 상태: 생성됨
- artifact 다운로드 상태: Pending
- APK 압축 해제 상태: Pending
- app-debug.apk 확인 상태: Pending
- APK 설치 상태: Pending
- 앱 실행 상태: Pending
- Android 실제 기기 QA 상태: Blocked
- Android Emulator QA 상태: Pending
- ADB 연결 상태: Pending

## 3. 기존 기준과의 관계

- PR #108은 run #35 artifact 기준 handoff readiness를 기록했습니다.
- PR #109는 run #36 artifact 기준 install/launch QA result를 기록했습니다.
- PR #110은 run #37 artifact 기준 device QA unblock readiness를 기록했습니다.
- PR #111에서는 run #38 artifact 기준을 최신 QA 기준으로 문서화합니다.
- 이전 artifact 기준 문서는 이력으로 유지합니다.
- 실제 QA 진행 시에는 가장 최신 artifact 기준을 우선 확인합니다.

## 4. 현재 상태 표

| 항목 | 상태 | 비고 |
| --- | --- | --- |
| run #38 Android Debug Build | success | GitHub Actions 기준 |
| harupuli-debug-apk artifact | 생성됨 | id 7685703968 |
| artifact 다운로드 | Pending | 실제 다운로드 전 |
| APK 압축 해제 | Pending | 실제 압축 해제 전 |
| app-debug.apk 확인 | Pending | 실제 확인 전 |
| ADB 연결 | Pending | 실제 연결 전 |
| APK 설치 | Pending | 실제 설치 전 |
| 앱 실행 | Pending | 실제 실행 전 |
| Android 실제 기기 QA | Blocked | 실제 기기 필요 |
| Android Emulator QA | Pending | Emulator 준비 필요 |
| 주요 화면 확인 | Pending | 실제 실행 후 가능 |
| localStorage QA | Pending | 실제 실행 후 가능 |
| back button QA | Pending | 실제 실행 후 가능 |
| icon/splash QA | Pending | 실제 실행 후 가능 |

## 5. 완료로 기록하지 않는 항목

- artifact 실제 다운로드: 미진행
- APK 압축 해제: 미진행
- app-debug.apk 실제 확인: 미진행
- ADB 연결: 미진행
- APK 설치: 미진행
- 앱 실행: 미진행
- 첫 화면 확인: 미진행
- 실제 기기 QA: 미진행
- Emulator QA: 미진행
- 스토어 스크린샷 이미지 시작: 미진행

## 6. TODO 문구 보정 기준

- `실제 스토어 스크린샷 이미지 시작` 문구를 사용합니다.
- `서양식 보정 적용 여부` 문구를 사용합니다.
- `양력/음력 샘플 추가 검증` 문구를 사용합니다.

## 7. 다음 단계

- Android 실제 기기 또는 Emulator 준비
- ADB 연결 확인
- run #38 harupuli-debug-apk artifact 다운로드
- app-debug.apk 확인
- APK 설치
- 앱 실행
- 첫 화면 및 crash 여부 확인
- 주요 화면 QA 진행
