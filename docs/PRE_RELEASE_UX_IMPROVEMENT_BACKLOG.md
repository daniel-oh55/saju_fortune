# Pre-release UX Improvement Backlog

## Current Status

- Current status: Pending
- Pre-release UX backlog: Documented
- Production UI implementation: Not started
- Android native/resource changes: Not started
- App icon asset creation: Pending
- App icon Android resource integration: Pending
- Loading screen implementation: Pending
- Saved reading share feature: Pending
- Home fortune time-slot display update: Pending
- Profile CTA copy update: Pending
- No src changes in this PR
- No Android/Gradle changes in this PR
- No icon asset files added in this PR
- No sharing SDK added in this PR

This document tracks pre-release UX improvement items to prepare before implementation. It does not implement any production UI, Android resource, icon asset, or sharing feature in this PR.

## Improvement Backlog

| ID | Area | Improvement item | Status | Implementation note |
|---|---|---|---|---|
| UX-001 | Home | Show morning, lunch, and evening fortune cards on the home screen | Pending | Production UI PR required |
| UX-002 | App start | Add a short and simple app loading screen | Pending | Prefer React app loading screen first; native splash changes are separate |
| UX-003 | Branding | Create app icon asset | Pending | Actual icon image not added in this PR |
| UX-004 | Branding | Apply app icon to Android adaptive icon/resources | Pending | Android resource PR required after asset is finalized |
| UX-005 | Sharing | Add saved reading share feature | Pending | Review Web Share API / Capacitor Share approach later |
| UX-006 | Sharing | Support sharing via KakaoTalk or SMS when available | Pending | Prefer OS share sheet first; Kakao SDK direct integration is separate |
| UX-007 | Profile | Change 내정보 CTA from '하루풀이 시작하기' to '저장하고 하루풀이 시작하기' | Pending | Copy-only UI PR possible |

아침운세, 점심운세, 저녁운세 표시(UX-001)와 KakaoTalk or SMS 공유 검토(UX-006)는 모두 Pending 상태이며, 이번 PR에서는 실제 구현을 진행하지 않습니다.

## Recommended PR Split

1. Copy-only PR
   - UX-007: 내정보 CTA 문구 변경
   - 비교적 작은 변경이므로 먼저 진행 가능

2. Home UI PR
   - UX-001: 홈 화면에 아침운세/점심운세/저녁운세 모두 표시
   - 홈 구조 변경이므로 별도 PR

3. Loading screen PR
   - UX-002: React app 내부 짧은 loading screen 추가
   - Android native splash 변경은 별도 검토

4. Share feature policy PR
   - UX-005 / UX-006: 저장한 풀이 공유하기 기능 설계
   - Web Share API / Capacitor Share / Kakao SDK 직접 연동 여부 검토
   - 실제 SDK 추가 전 정책 문서화 권장

5. App icon asset PR
   - UX-003: 실제 앱 아이콘 이미지 제작
   - 이미지 확정 후 별도 PR

6. Android icon integration PR
   - UX-004: Android adaptive icon/resource 반영
   - Android resource 변경이므로 별도 PR

## Do Not Implement In This PR

- Do not change home production UI
- Do not add loading screen implementation
- Do not add app icon files
- Do not modify Android resources
- Do not add saved reading share implementation
- Do not add Kakao SDK
- Do not add Capacitor Share dependency
- Do not change ProfileForm or profile CTA copy in code
- Do not change src
- Do not change Android/Gradle
- Do not change package-lock.json
- Do not change schemaVersion
- Do not change localStorage keys
