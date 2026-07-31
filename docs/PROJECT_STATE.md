# Project state

이 문서는 긴 개발 로그를 대체하지 않습니다. 현재 출시 단계와 주요 blocker를 짧게 전달하는 rolling state 문서입니다.

## 기준

- 기준일: 2026-07-31
- State baseline main HEAD: `7f00595e41d5b1dd15f88f4781cd15baff2eb646`
- 작업 시작 전 Open PR: 없음
- 현재 앱: Google Play 공개 상태
- 현재 플랫폼: React + Vite + Capacitor Android
- Android versionCode: 3
- Android versionName: 1.0.2
- 데이터: 주로 `localStorage`에 저장하며 별도 사용자 계정 서버는 없음
- AI workflow harness: merged / active
- PR #420: Merged
- PR #421: Merged
- PR #422: Merged
- PR #424: Merged

## PR #424 Owner QA

- Rewarded modal accessibility capability: body portal/background isolation/focus containment implemented
- Desktop keyboard Preview QA: Pass (Owner-confirmed)
- Galaxy Chrome TalkBack Preview QA: Pass (Owner-confirmed)
- Consent settings handoff QA: Pass (Owner-confirmed)
- Capacitor Android WebView final TalkBack QA: Pending

## 현재 AdMob 상태

- AdMob plugin 설치 및 Android App ID 구성 완료
- UMP runtime consent coordinator 구현 완료
- 개인정보 및 쿠키 설정 UI 구현 및 기기 QA 완료
- Google 공식 Rewarded Test Ad 구현 및 Galaxy S23 Ultra 기능 QA 완료
- production Rewarded ad unit은 Owner가 AdMob Console에서 생성 완료
- 실제 production ad unit ID 값은 저장소 밖에서 관리
- production source connection capability: Implemented
- production Rewarded mode-aware UI copy: Implemented
- 인앱 개인정보/동의 문구 capability 정합화: Implemented
- production Rewarded release workflow injection support: Implemented
- release environment preflight support: Implemented
- App ID/ad-unit publisher prefix verification: Implemented
- full Rewarded provider checker before release build: Implemented
- GitHub Secret actual value configuration: Completed (Owner-confirmed)
- Production-configured release workflow run: Completed
- Production Rewarded-configured signed AAB: Completed
- signed AAB verification: Completed
- Play Console internal-testing AAB upload: Completed (Owner-confirmed)
- Play Console internal-testing release activation: Completed (Owner-confirmed)

과거 production-configured 내부 테스트 baseline은 등록된 테스트 기기에서
검증되었으며, 아래 Pass는 현재 Android 1.0.2 후속 재시험의 결과를 뜻하지 않습니다.

- Google Play 제출 활동 상태: 출시됨
- Production-configured registered-test-device request/load/show: Pass - Test Ad
- Production-configured internal-test device QA: Pass
- Exactly-once reward: Pass
- Rapid-tap duplicate ad prevention: Pass
- Production-configured internal-test offline failure/recovery: Not performed / Pending
- Restart reward persistence: Pass
- Duplicate reward after restart: Not observed

`Google Play 제출 활동 상태: 출시됨`은 내부 테스트 제출 활동 상태이며, 일반 사용자
대상 Production 트랙 출시 완료를 뜻하지 않습니다.

현재 Android 1.0.2 후속 재시험에서는 요청이 AdMob SDK와 서버까지 도달했지만 광고
표시와 보상 재검증은 아직 Pending입니다.

- Google Play 내부 테스트 1.0.2 설치 및 실행: Pass
- 내부 테스트 설치 출처 `com.android.vending`: Confirmed by ADB
- Production-configured Rewarded 요청 실행 및 AdMob SDK 도달: Confirmed
- 최근 Rewarded 요청 결과: HTTP 403 / load error code 3 (`NO_FILL`)
- 등록 테스트 기기 광고 ID 재설정 및 재등록: Completed by Owner
- Test device configuration application: Pending verification
- Ad Inspector: Not verified
- 현재 광고 표시 및 보상 재검증: Pending
- Privacy/Data Safety final review: Completed (Owner-confirmed)
- Advertising ID and advertising disclosure final review: Completed (Owner-confirmed)
- 외부 개인정보처리방침 PR #4: Merged
- 외부 개인정보처리방침 merge SHA: `c2aa156c8036476ae95b9df070b27771f834dd41`
- 외부 개인정보처리방침 Vercel status: success
- Actual general-user production serving: Not started
- General-user Production update: Not started
- Play Console Production-track upload: Not started
- Actual production-serving device QA: Not started
- Actual advertisement revenue: Not verified
- Google Play internal-testing 1.0.2 general-function regression QA: Pass (Owner-confirmed)
- Profile/settings save and app restart QA: Pass (Owner-confirmed)
- Rollout monitoring and rollback operational verification: Pending

## 현재 남은 단계

1. 재등록한 테스트 기기 설정 반영 후 앱을 완전히 종료·재실행하고 Rewarded를 다시 요청
2. 광고 표시, Test Ad 표시, 보상 exactly-once 및 Ad Inspector 실행 여부 확인
3. 반복 `NO_FILL` 발생 시 식별정보를 제거한 ADB 로그와 AdMob serving 상태를 비교
4. 코드 변경 근거가 확인된 경우에만 별도 HIGH-risk 진단 PR 계획
5. Owner 승인 후 Play Console Production-track 단계 업데이트
6. 실제 일반 사용자 production serving, crash/ANR, 동의, 보상, 매출 및 rollback 모니터링
7. 증거가 확인된 항목만 Completed 또는 Pass로 전환

## 미완료 또는 deferred QA

- 실제 early-dismiss device QA: 관찰된 광고가 중도 종료를 허용하지 않아
  N/A / 향후 중도 종료 가능한 광고가 제공되면 재검증 Pending
- repeated ADB listener-accumulation diagnostics: Pending
- Browser/Preview TalkBack QA: Pass
- Capacitor Android WebView final QA: Pending

## 문서 갱신 규칙

- 모든 PR마다 갱신하지 않습니다.
- 출시 단계, production capability, 주요 blocker, open PR stack이 바뀔 때만 갱신합니다.
- 과거 세부 이력은 `CHANGELOG.md`, `DEVELOPMENT_LOG.md`, PR에 남깁니다.
- secret, private key, token, signing material과 실제 production Rewarded ad unit ID는 기록하지 않습니다. 기존에 승인되어 커밋된 비밀이 아닌 식별자는 이에 포함되지 않습니다.
