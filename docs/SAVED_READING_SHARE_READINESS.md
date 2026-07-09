# Saved Reading Share Readiness

## 1. Scope

- Purpose: Review saved reading share feature readiness before implementation
- Feature target: Saved reading share
- Current app storage: localStorage-based saved readings
- Current implementation status: Pending
- PR type: docs/check-only
- No production code changes
- No native Android changes
- No sharing SDK integration

## 2. Current app constraints

| Item | Status |
|---|---|
| Server DB | Not used |
| Login | Not used |
| Saved readings storage | localStorage |
| Actual ad SDK | Not used |
| Actual payment SDK | Not used |
| External analytics SDK | Not used |
| Kakao SDK | Not started |
| SMS native permission | Not started |
| Android native share integration | Not started |
| Share image generation | Pending |

## 3. Candidate sharing approaches

### Option A. Web Share API

- Browser/WebView supported environments can open the native share sheet.
- May allow users to select KakaoTalk, SMS, email, or other apps if installed and supported by the device.
- Does not require direct Kakao SDK integration.
- Does not require direct SMS permission.
- Availability depends on Android WebView/device support.
- Recommended first implementation candidate for MVP.

Status:

- Candidate
- Not implemented in this PR

### Option B. Copy share text to clipboard

- Generates safe share text and lets the user copy it.
- Useful fallback when Web Share API is unavailable.
- Does not require native permission.
- Does not require Kakao SDK.
- Recommended fallback candidate.

Status:

- Candidate
- Not implemented in this PR

### Option C. Direct KakaoTalk/SMS integration

- Direct KakaoTalk integration may require Kakao SDK, platform settings, app key management, and policy review.
- Direct SMS integration may require Android permission or native intent review.
- Higher implementation and policy risk than Web Share API.
- Not recommended as the first MVP step.

Status:

- Deferred
- Not implemented in this PR

## 4. Recommended MVP direction

- Use Web Share API as the first candidate.
- Provide copy-to-clipboard fallback.
- Do not add Kakao SDK in the first implementation PR.
- Do not add SMS permission in the first implementation PR.
- Do not modify AndroidManifest.xml for the first implementation PR unless explicitly required later.
- Do not generate share images in the first implementation PR.
- Start with text-based sharing only.
- Keep shared text short, non-deterministic, and non-sensitive.

## 5. Safe share text guidelines

공유 문구는 아래 원칙을 따라야 합니다.

- 과도하게 단정적인 운세 표현 금지
- 투자, 건강, 법률, 진로 결과 보장 문구 금지
- 개인정보 과다 포함 금지
- 생년월일, 출생시간, 출생지 전체를 그대로 공유하지 않음
- 사용자가 저장한 풀이의 짧은 요약 중심
- 앱 홍보 문구는 짧고 자연스럽게
- 공유 문구에 광고/결제/프리미엄 기능이 이미 있는 것처럼 쓰지 않음

예시 문구는 아래 정도로 제한합니다.

```
오늘의 하루풀이를 확인했어요.
오늘의 흐름을 가볍게 참고해보세요.

하루풀이에서 보기
```

주의:

- 실제 URL, 실제 Google Play 링크, 실제 앱스토어 링크는 아직 Pending으로 유지합니다.
- 존재하지 않는 링크를 Completed처럼 쓰지 않습니다.

## 6. Not included in this PR

- No src changes
- No production UI changes
- No share button implementation
- No Web Share API implementation
- No clipboard implementation
- No Kakao SDK integration
- No SMS native integration
- No AndroidManifest.xml changes
- No Android native code changes
- No Android resource changes
- No Gradle changes
- No Capacitor config changes
- No production fortune logic changes
- No routing changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes
- No server DB
- No login
- No actual ad SDK
- No actual payment SDK
- No external analytics SDK
- No release build
- No signing setup
- No AAB generation
- No Google Play Console input

## 7. Remaining Pending / Not started items

| Item | Status |
|---|---|
| Saved reading share feature implementation | Pending |
| Web Share API implementation | Pending |
| Copy-to-clipboard fallback implementation | Pending |
| KakaoTalk/SMS sharing implementation | Pending |
| Kakao SDK integration | Not started |
| SMS permission/native integration | Not started |
| Android native share integration | Not started |
| Share image generation | Pending |
| AndroidManifest.xml update for sharing | Not started |
| Google Play Console actual input | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 8. Conclusion

- The first implementation candidate should be text-based sharing using Web Share API with a copy-to-clipboard fallback.
- Direct KakaoTalk/SMS integration should remain deferred.
- This PR only documents readiness and does not implement sharing.
- No production code, Android native code, Android resources, routing, schemaVersion, or localStorage key changes are included.
