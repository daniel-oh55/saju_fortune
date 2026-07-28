# Project state

이 문서는 긴 개발 로그를 대체하지 않습니다. 현재 출시 단계와 주요 blocker를 짧게 전달하는 rolling state 문서입니다.

## 기준

- 기준일: 2026-07-28
- State baseline main HEAD: `2ea0e017abf7ac6df1ba3d4132671194a078b826`
- 작업 시작 전 Open PR: 없음
- 현재 앱: Google Play 공개 상태
- 현재 플랫폼: React + Vite + Capacitor Android
- 데이터: 주로 `localStorage`에 저장하며 별도 사용자 계정 서버는 없음
- AI workflow harness: merged / active

## 현재 AdMob 상태

- AdMob plugin 설치 및 Android App ID 구성 완료
- UMP runtime consent coordinator 구현 완료
- 개인정보 및 쿠키 설정 UI 구현 및 기기 QA 완료
- Google 공식 Rewarded Test Ad 구현 및 Galaxy S23 Ultra 기능 QA 완료
- production Rewarded ad unit은 Owner가 AdMob Console에서 생성 완료
- 실제 production ad unit ID 값은 저장소 밖에서 관리
- production source connection capability 구현 완료
- production Rewarded release workflow injection support 구현 완료
- release environment preflight support 구현 완료
- GitHub Secret actual value configuration은 시작하지 않음
- production-configured release workflow run은 시작하지 않음
- production request/load/show와 serving은 시작하지 않음
- existing release signing infrastructure: Confirmed
- existing signed AAB workflow: Confirmed
- production Rewarded-configured signed AAB: Not started

## 현재 남은 단계

1. GitHub Secret actual value configuration
2. owner-confirmed production-configured release workflow run
3. production Rewarded-configured signed AAB generation
4. production request/load/show 및 serving
5. production Android device QA
6. Privacy / Data Safety 및 advertising disclosure 최종 검토
7. Play 테스트 트랙과 staged rollout
8. rollback 기준 검증

## 미완료 또는 deferred QA

- 실제 early-dismiss device QA: Pending
- repeated ADB listener-accumulation diagnostics: Pending
- TalkBack announcement QA: Not performed / Pending

## 문서 갱신 규칙

- 모든 PR마다 갱신하지 않습니다.
- 출시 단계, production capability, 주요 blocker, open PR stack이 바뀔 때만 갱신합니다.
- 과거 세부 이력은 `CHANGELOG.md`, `DEVELOPMENT_LOG.md`, PR에 남깁니다.
- secret, private key, token, signing material과 실제 production Rewarded ad unit ID는 기록하지 않습니다. 기존에 승인되어 커밋된 비밀이 아닌 식별자는 이에 포함되지 않습니다.
