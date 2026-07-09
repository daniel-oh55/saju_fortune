# Capacitor Share Readiness

## 1. Scope

- Purpose: Review whether `@capacitor/share` should be introduced after Web Share API fallback behavior on Android WebView
- Related implementation PR: #319
- Layout fix PR: #322
- Share fallback QA PR: #323
- QA consistency PR: #324
- Share text paste QA PR: #325
- PR type: docs/check-only
- Current implementation: Web Share API attempt with clipboard fallback
- Current Android observed result: Android share sheet not opened
- Current fallback result: Clipboard fallback completed
- Current external share send status: Not performed
- `@capacitor/share` status: Not started

## 2. Current observed behavior

| Item | Status | Note |
| --- | --- | --- |
| Web Share API implementation | Completed | Implemented in PR #319 |
| Android share sheet via navigator.share | Not opened | Tested Android WebView path did not open share sheet |
| Clipboard fallback | Completed | Fallback message and copy behavior confirmed |
| Share text paste verification | Completed | Sensitive fields and real store URLs excluded |
| Actual external share send | Not performed | No external app send performed |
| `@capacitor/share` integration | Not started | Not installed or imported |
| Kakao SDK integration | Not started | Not added |
| SMS permission/native integration | Not started | Not added |

## 3. Candidate options

### Option A. Keep current Web Share API + clipboard fallback

Pros:
- No new dependency
- No native code change
- No AndroidManifest.xml change
- Already tested clipboard fallback path
- Low implementation risk

Cons:
- Android share sheet does not open in tested WebView environment
- User experience is limited to copied text
- User must manually paste into another app

Status:
- Current implementation
- Stable fallback path confirmed

### Option B. Add `@capacitor/share`

Pros:
- May provide native Android share sheet integration in Capacitor app context
- Could improve user experience by opening system share sheet
- Better fit for packaged Android app than browser-only Web Share API

Cons:
- Adds new dependency
- Requires implementation PR
- Requires Android APK QA after integration
- May require additional Capacitor sync/build validation
- Must verify no unintended AndroidManifest.xml or native permission changes
- Must keep external share send as Not performed unless actually tested

Status:
- Candidate
- Not implemented in this PR

### Option C. Direct KakaoTalk/SMS integration

Pros:
- Could provide targeted sharing path later

Cons:
- Higher policy/review burden
- Kakao SDK/platform settings may be required
- SMS permission/native integration may introduce Android policy/privacy concerns
- Not needed for first MVP sharing path

Status:
- Deferred
- Not recommended for next implementation step

## 4. Recommended direction

- Keep current clipboard fallback as a stable baseline.
- If native share UX is important before launch, consider a separate implementation PR for `@capacitor/share`.
- Do not add Kakao SDK or SMS permission for the next step.
- Do not modify AndroidManifest.xml unless a future implementation PR proves it is required.
- Any `@capacitor/share` implementation must be separated from this docs/check-only PR.
- After any `@capacitor/share` implementation, Android Debug APK QA must verify:
  - share button still visible
  - native share sheet opens
  - cancel handling
  - clipboard fallback remains available if native share fails
  - share text excludes sensitive fields
  - no external share send unless explicitly tested

## 5. Not included in this PR

- No src changes
- No CSS changes
- No share logic changes
- No copy logic changes
- No `@capacitor/share` dependency
- No `@capacitor/share` import
- No Capacitor Share implementation
- No AndroidManifest.xml changes
- No Android native code changes
- No Android resource changes
- No Gradle changes
- No Capacitor config changes
- No Kakao SDK integration
- No SMS permission/native integration
- No server DB
- No login
- No actual ad SDK
- No actual payment SDK
- No external analytics SDK
- No production fortune logic changes
- No routing changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes
- No release build
- No signing setup
- No AAB generation
- No Google Play Console input

## 6. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| `@capacitor/share` implementation | Pending |
| Native Android share sheet actual verification | Pending |
| Actual external share send | Not performed |
| Kakao SDK integration | Not started |
| SMS permission/native integration | Not started |
| AndroidManifest.xml update for sharing | Not started |
| Share image generation | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |
| Google Play Console actual input | Pending |

## 7. Conclusion

- Android WebView testing confirmed the current Web Share API path does not open the Android share sheet.
- Clipboard fallback and share text safety have been confirmed.
- `@capacitor/share` is a reasonable candidate for a future native share implementation PR, but it is not implemented in this PR.
- Direct KakaoTalk/SMS integration should remain deferred.
- This PR only documents readiness and does not change production code, Android native code, Android resources, Capacitor config, routing, schemaVersion, or localStorage keys.
