# Project state

이 문서는 긴 개발 로그를 대체하지 않습니다. 현재 출시 단계와 주요 blocker를 짧게 전달하는 rolling state 문서입니다.

## 기준

- 기준일: 2026-07-29
- State baseline main HEAD: `c8b27e34d6b63021b72b39b18d4093a37d20fa3d`
- 작업 시작 전 Open PR: 없음
- 현재 앱: Google Play 공개 상태
- 현재 플랫폼: React + Vite + Capacitor Android
- Android versionCode: 2
- Android versionName: 1.0.1
- 데이터: 주로 `localStorage`에 저장하며 별도 사용자 계정 서버는 없음
- AI workflow harness: merged / active
- PR #417: Merged
- PR #419: Merged

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
- internal-testing release name: `1.0.1 Internal Rewarded QA`
- Google Play 제출 활동 상태: 출시됨 (Owner-confirmed)
- Production-configured registered-test-device request/load/show: Pass - Test Ad
- Production-configured internal-test device QA: Pass
- Exactly-once reward: Pass
- Rapid-tap duplicate ad prevention: Pass
- Production-configured internal-test offline failure/recovery: Not performed / Pending
- Restart reward persistence: Pass
- Duplicate reward after restart: Not observed
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
- Rollout monitoring and rollback operational verification: Pending

## 현재 남은 단계

1. 앱 내부 `PrivacyInfoPage` 정합화 보정 후 후속 production UI PR
2. 후속 PR 독립 검토와 Owner merge 승인
3. Production-track 업데이트 전 최종 release 검토
4. Play Console Production-track 업로드 및 일반 사용자 업데이트
5. 실제 일반 사용자 production serving 모니터링과 device QA
6. rollback 기준 및 초기 운영 검증

## 미완료 또는 deferred QA

- 실제 early-dismiss device QA: 관찰된 광고가 중도 종료를 허용하지 않아
  N/A / 향후 중도 종료 가능한 광고가 제공되면 재검증 Pending
- repeated ADB listener-accumulation diagnostics: Pending
- TalkBack announcement QA: Not performed / Pending

## 문서 갱신 규칙

- 모든 PR마다 갱신하지 않습니다.
- 출시 단계, production capability, 주요 blocker, open PR stack이 바뀔 때만 갱신합니다.
- 과거 세부 이력은 `CHANGELOG.md`, `DEVELOPMENT_LOG.md`, PR에 남깁니다.
- secret, private key, token, signing material과 실제 production Rewarded ad unit ID는 기록하지 않습니다. 기존에 승인되어 커밋된 비밀이 아닌 식별자는 이에 포함되지 않습니다.
