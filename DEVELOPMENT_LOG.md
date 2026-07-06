# DEVELOPMENT_LOG

## Zodiac Explanation Card Order

- Moved zodiac explanation cards below the zodiac card grid
- Kept zodiac fortune logic unchanged
- Kept generated JSON/docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- Android/Gradle unchanged
- Android re-test remains Pending

## Five Elements Guidance Deduplication

- Deduplicated overlapping five elements guidance cards
- Removed the repeated five elements guide block from the daily routine card
- Kept five elements explanation available through routine detail copy and saju element help
- Added regression check for five elements guidance deduplication
- Production fortune logic unchanged
- Zodiac fortune engine unchanged
- Generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- Android/Gradle unchanged
- Android re-test remains Pending

## Birth Region District Options Fix

- Completed Seoul district options for birth region selection
- Added regression check for Seoul district options
- Existing profile storage shape unchanged
- Existing localStorage keys unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Production fortune logic unchanged
- Zodiac fortune engine unchanged
- Generated JSON unchanged
- docs/generated unchanged
- Routing unchanged
- privacy files unchanged
- Android/Gradle unchanged
- Android re-test remains Pending

## Scroll To Top Navigation Fix

- Added shared scroll-to-top handling for app page navigation
- Applied scroll-to-top to bottom navigation, home quick menu navigation, and major CTA navigation paths
- Kept today fortune detail category switching separate from page navigation
- Kept PR #283 today fortune detail back navigation behavior unchanged
- Production fortune logic unchanged
- Zodiac fortune engine unchanged
- Generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- Routing structure unchanged
- privacy files unchanged
- Android/Gradle unchanged
- Android re-test remains Pending

## Today Fortune Detail Back Navigation Fix

- Added browser and Android system back handling for today fortune detail state
- Detail page now closes back to the previous app page instead of letting Android exit the app first
- Added a small close button using the same close handler
- Added regression check for today fortune back navigation
- Production fortune logic unchanged
- Zodiac fortune engine unchanged
- Generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- Routing structure unchanged
- privacy files unchanged
- Android/Gradle unchanged
- Android re-test remains Pending

## Android Debug APK QA Result

- Recorded actual Android Debug APK download/install/launch result
- Test device: Samsung Galaxy S23 Ultra
- OS info: One UI 8.0
- Workflow run: #210
- Checked screens: Home, 오늘운세, 오늘흐름, 2026운세, 띠별운세, 내정보
- APK download marked Completed
- APK install marked Completed
- App launch test marked Completed
- Basic Android smoke QA marked Completed with follow-up issues
- Follow-up UI/UX and feature improvements documented
- Production fortune logic unchanged
- Zodiac fortune engine unchanged
- src production UI unchanged
- Generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- Routing unchanged
- privacy files unchanged
- Android/Gradle unchanged
- Google Play Console input remains Pending
- release build remains Pending
- signing setup remains Pending
- AAB generation remains Pending

## Android Debug APK QA Checklist

- Added Android Debug APK manual QA checklist
- Documented APK download, install, launch, and device QA steps as Pending
- Documented Google Play Console, release build, signing, and AAB as Pending
- Production fortune logic unchanged
- Zodiac fortune engine unchanged
- src production UI unchanged
- Generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- Routing unchanged
- privacy files unchanged
- Android/Gradle unchanged

## Home Quick Menu QA Checklist

- Added QA checklist for home quick menu customization
- Documented localStorage key and storage contract
- Documented manual QA steps for save, restore, max 4, min 1, and fallback behavior
- Production fortune logic unchanged
- Zodiac fortune engine unchanged
- src production UI unchanged
- Generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- Routing unchanged
- privacy files unchanged
- Android/Gradle unchanged
- Android device QA remains Pending
- APK download/install/app launch remain Pending
- Google Play Console input remains Pending
- release build/signing/AAB remain Pending

## Zodiac Year Variation Output Review

- Added wording quality review for same-animal birth-year variation after PR #272
- Confirmed after-baseline exact duplicate count improvement from PR #273
- Reviewed wording quality without changing production logic
- Production fortune logic unchanged
- Zodiac generation logic unchanged
- src production UI unchanged
- Generated production JSON unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- UI/routing unchanged
- privacy files unchanged
- Android/Gradle unchanged
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending

## Zodiac Output Quality Review Pending Spacing Correction

- Corrected docs/ZODIAC_OUTPUT_QUALITY_REVIEW.md row to `음력/윤달 샘플 외부 검증| Pending`
- Removed the incorrect `intentionally uses` note from the review document
- Removed missing-space Pending row from requiredDocSnippets
- Added missing-space Pending row to forbiddenDocSnippets
- Korean zodiac animal labels remain in place
- Production logic unchanged
- src unchanged
- Generated snapshot JSON unchanged
- Zodiac comparison result JSON unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- UI/routing unchanged
- privacy files unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending

## Zodiac Output Quality Review Table Spacing Final V3

- Fixed actual docs/ZODIAC_OUTPUT_QUALITY_REVIEW.md row to `음력/윤달 샘플 외부 검증| Pending`
- Updated checkZodiacOutputQualityReview guardrail to reject missing-space table row forms
- Korean zodiac animal labels remain in place
- Production logic unchanged
- src unchanged
- Generated snapshot JSON unchanged
- Zodiac comparison result JSON unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- UI/routing unchanged
- privacy files unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending

## Zodiac Output Quality Review Table Spacing Final V2

- Fixed actual docs/ZODIAC_OUTPUT_QUALITY_REVIEW.md row to `음력/윤달 샘플 외부 검증| Pending`
- Removed required check for the incorrect `음력/윤달 샘플 외부 검증 Pending` string
- Added guardrail against the incorrect `음력/윤달 샘플 외부 검증 Pending` string
- Added guardrail against the incorrect full row with missing space before `|`
- Korean zodiac animal labels remain in place
- Production engine logic unchanged
- Generated snapshot JSON unchanged
- Zodiac comparison result JSON unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- UI/routing unchanged
- privacy files unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending

## Zodiac Output Quality Review Table Spacing Final Fix

- Fixed remaining `음력/윤달 샘플 외부 검증| Pending` table spacing issue
- Removed required check for the incorrect `음력/윤달 샘플 외부 검증 Pending` string
- Added guardrail against the incorrect `음력/윤달 샘플 외부 검증 Pending` string
- Korean zodiac animal labels remain in place
- Production engine logic unchanged
- Generated snapshot JSON unchanged
- Zodiac comparison result JSON unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- UI/routing unchanged
- privacy files unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending

## Zodiac Output Quality Review Wording Fix

- Fixed 음력/윤달 샘플 외부 검증 table spacing
- Replaced animal tone review matrix labels with Korean zodiac labels
- Added guardrail for Korean zodiac labels
- Production engine logic unchanged
- Generated snapshot JSON unchanged
- Zodiac comparison result JSON unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- UI/routing unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending

## Zodiac Output Quality Review

- Zodiac output quality review completed
- Animal-specific tone clarity reviewed
- Category-specific guidance clarity reviewed
- Summary/detail readability reviewed
- Particle wording quality reviewed
- Money focus wording quality reviewed
- Fear-based wording risk reviewed
- Health safety wording reviewed
- Zodiac category IDs preserved
- selectedYear and selectedAnimal preserved
- Today fortune output unchanged
- Year/monthly fortune output unchanged
- Manseryeok output unchanged
- Saju analysis output unchanged
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Production engine logic unchanged in this PR
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged in this PR
- schemaVersion unchanged in this PR
- Existing localStorage keys unchanged
- Existing baseline snapshot JSON unchanged
- Today after snapshot JSON unchanged
- Today comparison result JSON unchanged
- Year/monthly after snapshot JSON unchanged
- Year/monthly comparison result JSON unchanged
- Zodiac after snapshot JSON unchanged
- Zodiac comparison result JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Zodiac After Snapshot Regeneration

- Zodiac after snapshot regenerated after category focus particle fix
- Snapshot comparison for zodiac improvement regenerated
- Corrected category focus particle wording confirmed
- Awkward focus particle wording removed
- Today fortune output unchanged
- Year/monthly fortune output unchanged
- Manseryeok output unchanged
- Saju analysis output unchanged
- Zodiac category IDs preserved
- selectedYear and selectedAnimal preserved
- Zodiac output quality review remains Pending
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Production engine logic unchanged in this PR
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged in this PR
- schemaVersion unchanged in this PR
- Existing localStorage keys unchanged
- Existing baseline snapshot JSON unchanged
- Today after snapshot JSON unchanged
- Today comparison result JSON unchanged
- Year/monthly after snapshot JSON unchanged
- Year/monthly comparison result JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Zodiac Category Focus Particle Fix

- Corrected zodiac category focus particle wording
- Replaced focus + 를 pattern with focus + 에 집중해 보세요 pattern
- Production change limited to zodiac fortune text wording
- Snapshot JSON files unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- UI/routing unchanged
- Android/privacy/Gradle unchanged

## Zodiac After Snapshot Comparison

- Zodiac after snapshot generated
- Before/after snapshot comparison result generated
- Sample count and sample IDs preserved
- Today fortune output unchanged
- Year/monthly fortune output unchanged
- Manseryeok output unchanged
- Saju analysis output unchanged
- Zodiac category IDs preserved
- selectedYear and selectedAnimal preserved
- Zodiac output quality review remains Pending
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Production engine logic unchanged in this PR
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged in this PR
- schemaVersion unchanged in this PR
- Existing localStorage keys unchanged
- Existing baseline snapshot JSON unchanged
- Today after snapshot JSON unchanged
- Today comparison result JSON unchanged
- Year/monthly after snapshot JSON unchanged
- Year/monthly comparison result JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Zodiac Money Focus Wording Fix

- Corrected zodiac money focus wording
- Production change limited to zodiac fortune text wording
- Snapshot JSON files unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- UI/routing unchanged
- Android/privacy/Gradle unchanged

## Zodiac First Production Change

- Production zodiac fortune engine improvement implemented
- Animal-specific tone added
- Category-specific guidance improved
- Detail text composition improved
- Zodiac category IDs preserved
- selectedYear and selectedAnimal behavior preserved
- Production engine logic changed only for zodiac fortune
- Today fortune output logic unchanged
- Year/monthly fortune output logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Zodiac after snapshot generation remains Pending
- Snapshot comparison for zodiac improvement remains Pending
- Zodiac output quality review remains Pending
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Zodiac First Production Scope

- Zodiac first production scope added
- First production PR target file documented
- Output compatibility requirements documented
- SchemaVersion no-change decision documented
- Snapshot comparison requirement documented
- Zodiac fortune engine improvement remains Pending
- Production engine logic unchanged
- Zodiac fortune output logic unchanged
- Today fortune output logic unchanged
- Year/monthly fortune output logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Zodiac Snapshot Comparison Check Design

- Zodiac snapshot comparison check design added
- Practical baseline documented
- Future comparison files documented
- Comparison targets documented
- Allowed difference policy documented
- Zodiac fortune engine improvement remains Pending
- Production engine logic unchanged
- Zodiac fortune output logic unchanged
- Today fortune output logic unchanged
- Year/monthly fortune output logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Zodiac Fortune Implementation Plan

- Zodiac fortune implementation plan added
- Planned production scope documented
- Practical snapshot baseline documented
- Schema version decision plan documented
- Before/after snapshot comparison plan documented
- Zodiac fortune engine improvement remains Pending
- Production engine logic unchanged
- Zodiac fortune output logic unchanged
- Today fortune output logic unchanged
- Year/monthly fortune output logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Zodiac Fortune Engine Improvement Design

- Zodiac fortune engine improvement design added
- Current zodiac fortune baseline documented
- Animal-specific tone improvement goal documented
- Category-specific guidance improvement goal documented
- Output compatibility requirements documented
- Zodiac fortune engine improvement remains Pending
- Production engine logic unchanged
- Zodiac fortune output logic unchanged
- Today fortune output logic unchanged
- Year/monthly fortune output logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Year Monthly Output Quality Review

- Year/monthly output quality review completed
- Annual narrative relevance reviewed
- Monthly focus label clarity reviewed
- Monthly score rationale reviewed
- Reason/advice/caution structure reviewed
- Monthly entries count preserved
- Today fortune output unchanged
- Manseryeok output unchanged
- Saju analysis output unchanged
- Zodiac fortune output unchanged
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Production engine logic unchanged in this PR
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged in this PR
- schemaVersion unchanged in this PR
- Existing localStorage keys unchanged
- Existing baseline snapshot JSON unchanged
- Today after snapshot JSON unchanged
- Today comparison result JSON unchanged
- Year/monthly after snapshot JSON unchanged
- Year/monthly comparison result JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Year Monthly After Snapshot Comparison

- Year/monthly after snapshot generated
- Before/after snapshot comparison result generated
- Sample count and sample IDs preserved
- Today fortune output unchanged
- Manseryeok output unchanged
- Saju analysis output unchanged
- Zodiac fortune output unchanged
- Monthly entries count preserved
- Target year preserved
- Year/monthly output quality review remains Pending
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Production engine logic unchanged in this PR
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged in this PR
- schemaVersion unchanged in this PR
- Existing localStorage keys unchanged
- Existing baseline snapshot JSON unchanged
- Today after snapshot JSON unchanged
- Today comparison result JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Doc Check Src Guardrail Restore

- Docs-only check scripts src guardrails restored
- Year/monthly production change check keeps targeted src allowlist
- Production engine logic unchanged in this PR
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Year Monthly First Production Change

- First year/monthly production change implemented
- Annual narrative relevance improved
- Monthly score/text composition improved
- Monthly entries count preserved
- Production engine logic changed only for year/monthly fortune
- Today fortune output logic unchanged
- Zodiac fortune output logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Year/monthly after snapshot generation remains Pending
- Snapshot comparison for year/monthly improvement remains Pending
- Year/monthly output quality review remains Pending
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Year Monthly First Production Scope

- Year/monthly first production scope added
- First production PR target file documented
- Output compatibility requirements documented
- SchemaVersion no-change decision documented
- Snapshot comparison requirement documented
- Year/monthly fortune engine improvement remains Pending
- Production engine logic unchanged
- Year/monthly fortune output logic unchanged
- Today fortune output logic unchanged
- Zodiac fortune output logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Year Monthly Snapshot Comparison Check Design

- Year/monthly snapshot comparison check design added
- Practical baseline documented
- Future comparison files documented
- Comparison targets documented
- Allowed difference policy documented
- Year/monthly fortune engine improvement remains Pending
- Production engine logic unchanged
- Year/monthly fortune output logic unchanged
- Today fortune output logic unchanged
- Zodiac fortune output logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Year Monthly Fortune Implementation Plan

- Year/monthly fortune implementation plan added
- Planned production scope documented
- Practical snapshot baseline documented
- Schema version decision plan documented
- Before/after snapshot comparison plan documented
- Year/monthly fortune engine improvement remains Pending
- Production engine logic unchanged
- Year/monthly fortune output logic unchanged
- Today fortune output logic unchanged
- Zodiac fortune output logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Year Monthly Fortune Engine Improvement Design

- Year/monthly fortune engine improvement design added
- Current year/monthly fortune baseline documented
- Annual improvement goals documented
- Monthly improvement goals documented
- Output compatibility requirements documented
- Year/monthly fortune engine improvement remains Pending
- Production engine logic unchanged
- Year/monthly fortune output logic unchanged
- Today fortune output logic unchanged
- Zodiac fortune output logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON files unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Today Fortune Output Quality Review

- Output quality review after implementation completed
- Category-specific summary clarity reviewed
- Reason/advice/caution structure reviewed
- Required category IDs preserved
- Health safety wording reviewed
- Engine accuracy approval remains Pending
- External reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Production engine logic unchanged in this PR
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged in this PR
- schemaVersion unchanged in this PR
- Existing localStorage keys unchanged
- Existing baseline snapshot JSON unchanged
- After snapshot JSON unchanged
- Comparison result JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Today Fortune After Snapshot Comparison

- After snapshot generated
- Before/after snapshot comparison result generated
- Required today category IDs preserved
- Manseryeok output unchanged
- Year/monthly fortune output unchanged
- Zodiac fortune output unchanged
- Output quality review after implementation remains Pending
- Engine accuracy approval remains Pending
- Production engine logic unchanged in this PR
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged in this PR
- schemaVersion unchanged in this PR
- Existing localStorage keys unchanged
- Existing baseline snapshot JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Today Fortune First Production Change

- First today fortune production change implemented
- Category-specific scoring adjustment added
- Category text composition improved
- CURRENT_FORTUNE_SCHEMA_VERSION incremented for cache refresh
- Production engine logic changed only for today fortune
- Year/monthly fortune logic unchanged
- Zodiac fortune logic unchanged
- Manseryeok logic unchanged
- Saju analysis logic unchanged
- Existing localStorage keys unchanged
- Existing baseline snapshot JSON unchanged
- After snapshot generation remains Pending
- Snapshot comparison after implementation remains Pending
- Engine accuracy approval remains Pending
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Today Fortune First Production Scope

- Today fortune first production scope added
- First production PR target file documented
- Category/output compatibility requirements documented
- CURRENT_FORTUNE_SCHEMA_VERSION proposed decision documented
- Snapshot comparison requirement documented
- Production today fortune engine improvement remains Pending
- Production engine logic unchanged
- Today fortune output logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged in this PR
- schemaVersion unchanged in this PR
- Existing localStorage keys unchanged
- Existing snapshot JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Today Fortune Snapshot Comparison Check Design

- Today fortune snapshot comparison check design added
- Comparison targets documented
- Allowed difference policy documented
- Future comparison file names documented
- Before/after snapshot comparison check remains Pending
- Production today fortune engine improvement remains Pending
- Production engine logic unchanged
- Today fortune output logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Existing snapshot JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Today Fortune Engine Implementation Plan

- Today fortune engine implementation plan added
- Planned production scope documented
- Implementation principles documented
- Proposed first production PR scope documented
- Schema version decision plan documented
- Before/after snapshot comparison plan documented
- Today fortune engine improvement remains Pending
- Production engine logic unchanged
- Today fortune output logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Today Fortune Engine Improvement Design

- Today fortune engine improvement design added
- Current today fortune baseline documented
- Improvement goals documented
- Proposed input signals documented
- Proposed category design documented
- Proposed score/text design documented
- Today fortune engine improvement remains Pending
- Production engine logic unchanged
- Today fortune output logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Manseryeok Reference Standard Time Wording Fix

- 기준점 wording corrected to 기준시
- Manseryeok external reference candidates wording updated
- Manseryeok external reference selection criteria wording updated
- Related check scripts updated
- External reference 2 selection remains Pending
- Actual external reference comparison remains Pending
- Manual comparison sheet completion remains Pending
- Discrepancy log remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Engine accuracy approval remains Pending
- Production engine logic unchanged
- Manseryeok logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Manseryeok External Reference Candidates

- Manseryeok external reference candidates added
- External reference 1 candidate recorded
- Candidate 2 selection requirements documented
- 기준시 wording corrected in reference selection criteria
- External reference 2 selection remains Pending
- Actual external reference comparison remains Pending
- Manual comparison sheet completion remains Pending
- Discrepancy log remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Engine accuracy approval remains Pending
- Production engine logic unchanged
- Manseryeok logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Manseryeok External Reference Selection Criteria

- Manseryeok external reference selection criteria added
- Reference selection requirements documented
- Preferred reference types documented
- Reference candidate slots documented
- Policy fields per reference documented
- External manseryeok reference selection remains Pending
- Actual external reference comparison remains Pending
- Manual comparison sheet completion remains Pending
- Discrepancy log remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Engine accuracy approval remains Pending
- Production engine logic unchanged
- Manseryeok logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Manseryeok External Comparison Template

- Manseryeok external comparison template added
- External reference columns documented
- Sample comparison template documented
- Match status values documented
- Discrepancy log template documented
- Actual external reference comparison remains Pending
- External manseryeok reference selection remains Pending
- Manual comparison sheet completion remains Pending
- Discrepancy log remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Engine accuracy approval remains Pending
- Production engine logic unchanged
- Manseryeok logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Manseryeok External Verification Plan

- Manseryeok external verification plan added
- External verification sample matrix documented
- Verification fields documented
- Pass/fail criteria draft documented
- Discrepancy handling plan documented
- Actual external reference comparison remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Engine accuracy approval remains Pending
- Production engine logic unchanged
- Manseryeok logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Snapshot JSON unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Fortune Engine Sample Snapshot Quality Review

- Fortune engine sample snapshot quality review added
- Snapshot fixed input review documented
- Sample coverage review documented
- Output shape review documented
- Quality observations documented
- Engine accuracy approval remains Pending
- 음력/윤달 샘플 외부 검증 remains Pending
- 태양시 보정 적용 여부 remains Pending
- Production engine logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- docs/generated/fortune-engine-sample-snapshot.json unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Fortune Engine Sample Snapshot

- Fortune engine sample snapshot runner added
- Fortune engine sample snapshot JSON generated
- Fixed dateKey 2026-06-30 used
- targetYear 2026 used
- Artificial sample profiles only
- Today fortune sample output recorded
- Saju analysis sample output recorded
- Manseryeok sample output recorded
- Year/monthly fortune sample output recorded
- Zodiac fortune sample output recorded
- Production engine logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Fortune Engine Sample Snapshot Readiness

- Fortune engine sample snapshot readiness added
- Sample snapshot target areas documented
- Fixed dateKey and targetYear documented
- Artificial sample profile safety rules documented
- 시주 미상 wording corrected in sample QA baseline
- Actual output snapshot generation remains Pending
- Production engine logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Fortune Engine Sample QA Baseline

- Fortune engine sample QA baseline added
- Sample profile matrix documented
- Today fortune output shape checks documented
- Saju analysis shape checks documented
- Manseryeok QA notes documented
- Year/monthly fortune shape checks documented
- Zodiac fortune shape checks documented
- Actual output snapshot generation remains Pending
- Production engine logic unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- schemaVersion unchanged
- Existing localStorage keys unchanged
- Routing unchanged
- UI/design unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Fortune Engine Current State Audit

- Fortune engine current state audit document added
- Current engine areas documented before production improvement planning
- Today fortune engine current status recorded
- Saju analysis engine current status recorded
- Manseryeok engine current status recorded
- Element analysis current status recorded
- Year/monthly fortune engine current status recorded
- Zodiac fortune engine current status recorded
- Production fortune engine logic unchanged
- Today fortune output logic unchanged
- Saju analysis logic unchanged
- Manseryeok logic unchanged
- Year/monthly fortune logic unchanged
- Zodiac fortune logic unchanged
- schemaVersion and existing localStorage keys unchanged
- public/privacy-policy.html unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- UI/design unchanged
- `.aab`, `.zip`, `.jks`, and `.keystore` repository commit not added
- GitHub Secret actual values not recorded

## Play Console Actual Input Readiness

- Play Console actual input readiness checklist added
- Confirmed Console-ready values consolidated
- Privacy policy public URL remains Confirmed
- Contact email remains Confirmed
- Privacy policy final content confirmation remains Confirmed
- Google Play Data safety form final review remains Confirmed
- Actual Google Play Console input remains Pending
- Play Console app creation remains Pending
- Privacy policy URL Play Console input remains Pending
- Actual Google Play Console Data safety input remains Pending
- Data safety form submission remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- public/privacy-policy.html unchanged
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded
- Tester email list not recorded
- Signing password, keystore path, key alias, and keystore base64 not recorded

## Google Play Data Safety Form Final Review

- Google Play Data safety form final review recorded
- Data safety draft answers reviewed against current app implementation
- Server DB not used
- Login/account creation not used
- Payment SDK not used
- Actual ad SDK not used
- External analytics SDK not used
- Push notification SDK not used
- Personal data server transfer not used
- localStorage used for device-local storage
- Privacy policy final content confirmation remains Confirmed
- Actual Google Play Console Data safety input remains Pending
- Data safety form submission remains Pending
- Privacy policy URL Play Console input remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- public/privacy-policy.html unchanged
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded
- Tester email list not recorded
- Signing password, keystore path, key alias, and keystore base64 not recorded

## Google Play Data Safety Form Draft

- Google Play Data safety form draft added
- Current app data architecture summarized
- Server DB not used
- Login/account creation not used
- Payment SDK not used
- Actual ad SDK not used
- External analytics SDK not used
- Push notification SDK not used
- Personal data server transfer not used
- localStorage used for device-local storage
- Privacy policy final content confirmation remains Confirmed
- Data safety form final review remains Pending
- Actual Google Play Console Data safety input remains Pending
- Data safety form submission remains Pending
- Privacy policy URL Play Console input remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- public/privacy-policy.html unchanged
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded
- Tester email list not recorded
- Signing password, keystore path, key alias, and keystore base64 not recorded

## Privacy Policy Final Content Confirmation

- Privacy policy final content confirmation recorded
- Privacy policy public URL remains Confirmed
- public/privacy-policy.html final content update remains Confirmed
- Privacy policy final HTML deployment re-check remains Confirmed
- Privacy policy URL Play Console input remains Pending
- Actual Google Play Console input remains Pending
- Data safety form remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- public/privacy-policy.html unchanged
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded
- Tester email list not recorded
- Signing password, keystore path, key alias, and keystore base64 not recorded

## Privacy Policy Final HTML Deployment Re-check

- Recorded deployed privacy policy final HTML re-check results.
- Confirmed public URL, no-login access, HTTPS access, desktop/mobile browser re-check, deployed contact email, deployed effective date, old placeholder removal, and final review notice removal.
- Kept Privacy policy final content confirmation, Privacy policy URL Play Console input, Actual Google Play Console input, Data safety form submission, AAB internal test upload, and Real device QA as Pending.
- Added `scripts/checkPrivacyPolicyFinalHtmlDeploymentRecheck.mjs` and `check:privacy-policy-final-html-deployment-recheck`.

## Privacy Policy Final HTML Update

- public/privacy-policy.html final content update completed
- Contact email replaced in HTML
- Effective date replaced in HTML
- Google Play final review notice removed
- Privacy policy final content confirmation remains Pending
- Privacy policy URL Play Console input remains Pending
- Actual Google Play Console input remains Pending
- Data safety form remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded
- Tester email list not recorded
- Signing password, keystore path, key alias, and keystore base64 not recorded

## Privacy Policy Contact and Effective Date Confirmation

- Contact email confirmation recorded
- Effective date confirmation recorded
- public/privacy-policy.html final content update remains Pending
- Privacy policy final content confirmation remains Pending
- Privacy policy URL Play Console input remains Pending
- Actual Google Play Console input remains Pending
- Data safety form remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- public/privacy-policy.html unchanged
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded
- Tester email list not recorded
- Signing password, keystore path, key alias, and keystore base64 not recorded

## Privacy Policy Final Content Review Readiness

- Privacy policy final content review readiness added
- Contact email placeholder state recorded
- Effective date placeholder state recorded
- Privacy policy final content confirmation remains Pending
- public/privacy-policy.html final content update remains Pending
- Privacy policy URL Play Console input remains Pending
- Actual Google Play Console input remains Pending
- Data safety form remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- Actual contact email value not recorded
- Actual effective date not recorded
- public/privacy-policy.html unchanged
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Privacy Policy Public URL Confirmation

- Privacy policy public URL final confirmation recorded
- Public no-login access restore remains Confirmed
- URL accessibility re-check remains Confirmed
- Play Console URL input remains Pending
- Actual Google Play Console input remains Pending
- Contact email confirmation remains Pending
- Data safety form remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- Actual contact email value not recorded
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Vercel Public Access Re-check Result

- Vercel protection setting review result recorded
- public/privacy-policy.html no-login access re-check result recorded
- HTTPS re-check result recorded
- desktop/mobile browser re-check result recorded
- actual Vercel URL string not recorded
- actual contact email value not recorded
- Privacy policy public URL final confirmation remains Pending
- Privacy policy URL Play Console input remains Pending
- Contact email confirmation remains Pending
- Data safety form remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Vercel Public Access Unblock Plan

- Vercel Login blocked status documented
- public/privacy-policy.html path retained
- Vercel production deployment remains Confirmed
- /privacy-policy.html public access remains Blocked
- no-login access remains Blocked
- Play Console privacy policy URL readiness remains Blocked
- Vercel protection setting review remains Pending
- public no-login access restore remains Pending
- URL accessibility re-check remains Pending
- actual Vercel URL string not recorded
- actual contact email value not recorded
- Privacy policy final content remains Pending
- Privacy policy URL Play Console input remains Pending
- Data safety form remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Privacy Policy URL Accessibility Check

- Privacy policy URL accessibility check document added
- public/privacy-policy.html path retained
- Vercel production deployment status checked after PR 213 merge
- /privacy-policy.html public access blocked by Vercel Login response
- HTTPS request completed
- Desktop and mobile user-agent checks returned Vercel Login instead of the privacy policy page
- Actual Vercel URL string not recorded in docs
- Actual contact email value not recorded
- Privacy policy final content remains Pending
- Privacy policy public URL remains Pending
- Privacy policy URL Play Console input remains Pending
- Data safety form remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Static Privacy Policy Page Draft

- Static privacy policy page draft added
- public/privacy-policy.html path used
- Vercel static privacy page direction retained
- Current app data handling status reflected
- Server DB/Login/Account creation/Payment SDK/Ad SDK/External analytics SDK/Push notification SDK not used
- localStorage usage retained
- Actual contact email value not recorded
- Actual privacy policy URL not recorded
- Privacy policy final content remains Pending
- Privacy policy public URL remains Pending
- Privacy policy URL Play Console input remains Pending
- Data safety form remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- React routing unchanged
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged
- `.aab` repository commit not added
- `.zip` repository commit not added
- Secret actual values not recorded

## Privacy Policy Hosting Decision

- Privacy policy hosting option decision result recorded
- Vercel static privacy page recorded as selected hosting option
- Privacy policy page implementation remains Pending
- Routing change remains Pending
- Privacy policy public URL remains Pending
- Privacy policy URL Play Console input remains Pending
- Contact email remains Pending
- Data safety form remains Pending
- AAB internal test upload remains Pending
- Real device QA remains Pending
- Actual contact email value not recorded
- Actual privacy policy URL not recorded
- Routing unchanged
- Secret actual values not recorded
- `.aab` repository commit not added
- `.zip` repository commit not added
- AndroidManifest.xml/resource unchanged
- Gradle settings unchanged
- Production calculation logic unchanged
- Saju/fortune result generation logic unchanged
- UI/design unchanged

## Privacy Policy Hosting Options

- 개인정보 처리방침 hosting option 후보 정리
- Vercel static privacy page를 우선 후보로 기록
- 실제 hosting option selected는 Pending 유지
- 실제 개인정보 처리방침 page implementation은 Pending 유지
- 실제 개인정보 처리방침 public URL은 Pending 유지
- Privacy policy URL Play Console input은 Pending 유지
- Contact email은 Pending 유지
- Data safety form은 Pending 유지
- AAB 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- 실제 Contact email 값 기록 없음
- 실제 Privacy policy URL 기록 없음
- routing 변경 없음
- Secret 실제값 기록 없음
- `.aab` repository commit 없음
- `.zip` repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- Gradle 설정 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Privacy Policy Finalization Readiness

- 개인정보 처리방침 최종화 준비 체크리스트 추가
- 현재 앱 데이터 처리 기준 반영
- Server DB/Login/Account creation/Payment SDK/Ad SDK/External analytics SDK는 Not used 유지
- localStorage usage는 Used 유지
- Device-only saved readings/Consent preferences/Profile birth info storage는 localStorage 기반 Used로 기록
- Privacy policy final content는 Pending 유지
- Privacy policy hosting location은 Pending 유지
- Privacy policy public URL은 Pending 유지
- Privacy policy URL Play Console input은 Pending 유지
- Contact email은 Pending 유지
- Data safety form은 Pending 유지
- AAB 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- 실제 Contact email 값 기록 없음
- 실제 Privacy policy URL 기록 없음
- Secret 실제값 기록 없음
- `.aab` repository commit 없음
- `.zip` repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- Gradle 설정 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Play Console Contact and Privacy Readiness

- 문의 이메일 / 개인정보 처리방침 URL 확정 준비 체크리스트 추가
- Contact email은 Pending 유지
- Contact email 실제값 기록 없음
- Privacy policy final content는 Pending 유지
- Privacy policy public URL은 Pending 유지
- Privacy policy 실제 URL 기록 없음
- Data safety form은 Pending 유지
- AAB 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- 현재 앱 데이터 처리 상태 반영
- Server DB/Login/Payment SDK/Ad SDK/External analytics SDK는 Not used 유지
- localStorage usage는 Used 유지
- Secret 실제값 기록 없음
- `.aab` repository commit 없음
- `.zip` repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- Gradle 설정 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Play Console App Creation Field Decisions

- Play Console 앱 생성 입력값 1차 결정 결과 기록
- Free or paid는 Free로 Confirmed 기록
- Default language는 Korean으로 Confirmed 기록
- App category는 Lifestyle로 Confirmed 기록
- 실제 Play Console 앱 생성은 Pending 유지
- 실제 Google Play Console 입력은 Pending 유지
- Contact email은 Pending 유지
- Privacy policy URL은 Pending 유지
- 실제 스토어 스크린샷 이미지 제작은 Pending 유지
- Data safety form은 Pending 유지
- AAB 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- 실제 Contact email 값 기록 없음
- 실제 Privacy policy URL 기록 없음
- 실제 tester email list 기록 없음
- Secret 실제값 기록 없음
- `.aab` repository commit 없음
- `.zip` repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- Gradle 설정 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Play Console App Creation Fields

- Play Console 앱 생성 입력값 체크리스트 추가
- App name은 하루풀이로 Confirmed 기록
- App or game은 App으로 Confirmed 기록
- Free or paid는 Pending 유지
- Default language는 Pending 유지
- App category는 Pending 유지
- Contact email은 Pending 유지
- Privacy policy URL은 Pending 유지
- 실제 스토어 스크린샷 이미지 제작은 Pending 유지
- Data safety form은 Pending 유지
- AAB 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- signed AAB run number 6 기술 상태 반영
- 실제 Contact email 값 기록 없음
- 실제 Privacy policy URL 기록 없음
- 실제 tester email list 기록 없음
- Secret 실제값 기록 없음
- `.aab` repository commit 없음
- `.zip` repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- Gradle 설정 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Play Console Internal Test Upload Checklist

- Play Console 내부 테스트 업로드 전 체크리스트 추가
- signed AAB run number 6 artifact 상태 반영
- Play Console app creation은 Pending 유지
- 실제 Google Play Console 입력은 Pending 유지
- Privacy policy URL은 Pending 유지
- Data safety form은 Pending 유지
- AAB 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- 실제 Contact email 값 기록 없음
- 실제 tester email list 기록 없음
- Secret 실제값 기록 없음
- `.aab` repository commit 없음
- `.zip` repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- Gradle 설정 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release AAB Run 6 Artifact Inspection

- Android Release AAB run number 6 artifact 다운로드/압축 해제 확인 결과 기록
- `.aab` 파일 존재 확인 결과 기록
- `.aab` 파일명과 크기 기록
- artifact zip repository commit 없음
- `.aab` repository commit 없음
- signed AAB re-verification은 workflow 기준 Confirmed 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 Google Play Console 입력은 Pending 유지
- 실제 기기 QA는 Pending 유지
- Secret 실제값 기록 없음
- keystore 파일 repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- Gradle 설정 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release AAB Secret Correction Rerun Result

- ANDROID_KEYSTORE_BASE64 Secret 보정 여부 Confirmed 기록
- Android Release AAB workflow run number 6 success 기록
- release signing secrets validation step success 기록
- Restore release keystore success 기록
- Build signed release AAB success 기록
- Verify signed release AAB success 기록
- Upload release AAB success 기록
- signed AAB regeneration Confirmed 기록
- signed AAB re-verification Confirmed 기록
- artifact 1개 생성 기록
- signed AAB artifact 다운로드/압축 해제 확인은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- Secret 실제값 기록 없음
- keystore 파일 repository commit 없음
- `.aab` repository commit 없음
- `.zip` repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release AAB Enforced Rerun Result

- Android Release AAB workflow 재실행 실패 결과 기록
- run number 5 / run id 28309520915 기록
- failed step 기록: Validate release signing secrets
- 실패 원인 요약 기록: `ANDROID_KEYSTORE_BASE64 is not configured`
- unsigned AAB artifact upload 방지 여부 기록
- Restore release keystore, Build signed release AAB, Verify signed release AAB, Upload release AAB는 skipped로 기록
- artifact 생성 없음 기록
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- Secret 실제값 기록 없음
- keystore 파일 repository commit 없음
- `.aab` repository commit 없음
- `.zip` repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release Signing Enforcement

- Android Release AAB workflow signing enforcement 보강
- release signing secrets validation step 추가
- Gradle release signing env enforcement 추가
- bundleRelease 후 jarsigner verification step 추가
- jarsigner가 `jar verified.`를 확인하지 못하면 workflow 실패 처리
- unsigned AAB artifact upload 방지 보강
- signed AAB regeneration은 Pending 유지
- signed AAB re-verification은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- Secret 실제값 기록 없음
- keystore 파일 repository commit 없음
- `.aab` repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Signed AAB Verification Result

- signed AAB signing verification 실패 결과 기록
- jarsigner command 실행 결과 기록
- 실패 원인 요약 기록: `jar is unsigned.`
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 Google Play Console 입력은 Pending 유지
- 실제 기기 QA는 Pending 유지
- Secret 실제값 기록 없음
- keystore 파일 repository commit 없음
- `.aab` repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Signed AAB Artifact Inspection

- signed AAB artifact 다운로드/압축 해제 확인 결과 기록
- `.aab` 파일 존재 확인 결과 기록
- `.aab` 파일명과 크기 기록
- AAB 파일명: app-release.aab
- AAB 파일 크기: 6,016,271 bytes
- artifact zip repository commit 없음
- `.aab` repository commit 없음
- signed AAB 검증은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- Secret 실제값 기록 없음
- keystore 파일 repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Signed AAB Workflow Result

- Android Release AAB workflow 수동 실행 결과 success 기록
- signed AAB generation Confirmed 기록
- artifact name과 metadata 기록
- signed AAB 검증은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- Secret 실제값 기록 없음
- keystore 파일 repository commit 없음
- AndroidManifest.xml/resource 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release Signing Workflow Support

- Android release AAB workflow에 GitHub Secrets 기반 signing support 추가
- keystore는 GitHub Actions runner temp에 임시 복원
- release Gradle signing config는 환경변수 기반으로 적용
- 실제 Secret 값 기록 없음
- keystore 파일 repository commit 없음
- signing password/key alias/base64 실제값 기록 없음
- signed AAB 생성은 Pending 유지
- signed AAB 검증은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- AndroidManifest.xml/resource 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Signing Secrets Input Status

- GitHub Secrets 실제 입력 여부 Confirmed로 기록
- 실제 Secret 값 기록 없음
- keystore base64 실제값 기록 없음
- signing password 기록 없음
- key alias 실제값 기록 없음
- keystore 파일명/경로 기록 없음
- signing 설정은 Pending 유지
- release workflow signing 적용은 Pending 유지
- signed AAB 생성은 Pending 유지
- signed AAB 검증은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Keystore Generation Confirmed

- 실제 keystore 생성 여부 Confirmed로 기록
- keystore는 repository 밖 비공개 안전 위치에 보관
- keystore backup은 별도 비공개 안전 위치에 보관
- 실제 keystore 파일명 기록 없음
- 실제 keystore 저장 경로 기록 없음
- 실제 key alias 기록 없음
- signing password 기록 없음
- keystore base64 실제값 기록 없음
- GitHub Secrets 실제 입력 없음
- signing 설정은 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Keystore Generation Status

- keystore generation status 기록
- 실제 keystore 생성은 Pending 유지
- 실제값 없는 사유만 기록
- 실제 keystore 파일명 기록 없음
- 실제 keystore 저장 경로 기록 없음
- 실제 key alias 기록 없음
- signing password 기록 없음
- keystore base64 실제값 기록 없음
- GitHub Secrets 실제 입력 없음
- signing 설정은 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Keystore Generation Decision

- Android keystore 생성/보관/백업 방식 결정 결과 문서화
- keystore 생성 방식은 local secure environment에서 JDK keytool 사용으로 결정
- keystore 보관 방식은 repository 외부 비공개 안전 위치로 결정
- keystore backup 방식은 별도 비공개 안전 위치로 결정
- password 보관 방식은 내부 보안 저장소 사용으로 결정
- 실제 keystore 파일 생성 없음
- keystore 파일 추가 없음
- `.jks`/`.keystore` 파일 commit 없음
- signing password 기록 없음
- keystore base64 실제값 기록 없음
- GitHub Secrets 실제 입력 없음
- signing 설정은 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Keystore Generation Storage Plan

- Android keystore generation/storage plan 문서 추가
- keytool 기반 keystore 생성 후보 명령 정리
- keystore 보관/백업 정책 초안 정리
- GitHub Secrets mapping 후보 정리
- 실제 keystore 파일 생성 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- keystore base64 실제값 기록 없음
- GitHub Secrets 실제 입력 없음
- signing 설정은 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Signing Secrets Checklist

- Android signing secrets 입력 전 체크리스트 문서 추가
- candidate GitHub Secrets 이름과 입력 전 확인 항목 정리
- 실제 GitHub Secrets 값은 기록하지 않음
- keystore 파일 생성 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- GitHub Secrets 실제 입력 없음
- signing 설정은 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Signing Setup Plan

- Unsigned AAB 결과를 바탕으로 Android signing setup plan 문서 추가
- candidate GitHub Secrets 이름 정리
- keystore/password 보안 기준 문서화
- signing 설정은 Pending 유지
- keystore 파일 생성 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- GitHub Secrets 실제 입력 없음
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android AAB Signing Verification Doc Consistency

- PR #189 signing verification result 기준 문서 상태값 정합성 보정
- signing 상태 확인은 Confirmed, 결과는 Unsigned로 정리
- 기존 후속 PR 기록 예정 문구를 PR #189 기록 완료 문구로 보정
- signing setup plan은 Required 유지
- Play Console 업로드 가능 여부는 Pending 유지
- GitHub Secrets 실제 입력은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android AAB Signing Verification Result

- `app-release.aab` signing 검증 명령 실행
- jarsigner 기준 signing 상태 Unsigned로 기록
- apksigner는 로컬 PATH 및 Android SDK build-tools 경로에서 Not available로 기록
- signing setup plan 필요 상태로 기록
- Play Console 업로드 가능 여부는 Pending 유지
- GitHub Secrets 실제 입력은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- artifact zip과 `.aab` 파일은 repository에 commit하지 않음
- workflow/Android native/Gradle/production/UI 변경 없음

## Android AAB Signing Verification Plan

- Android AAB signing 상태 확인 전 검증 계획 문서 추가
- `app-release.aab` signing 확인 질문과 명령 후보 정리
- signing 검증 명령 실제 실행은 Pending 유지
- signing 설정은 Pending 유지
- keystore 파일 추가 없음
- signing password 기록 없음
- GitHub Secrets 실제 입력 없음
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release AAB Artifact Inspection

- Android Release AAB run number 3 artifact 다운로드 확인
- artifact 압축 해제 확인
- 내부 `.aab` 파일 존재 확인
- AAB 파일명과 파일 크기 기록
- AAB 파일명: app-release.aab
- AAB 파일 크기: 6,016,271 bytes
- artifact zip과 `.aab` 파일은 repository에 commit하지 않음
- signing 상태 확인은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release AAB Artifact QA

- Android Release AAB run number 3 artifact QA 문서 추가
- artifact name, size, digest 기록
- AAB artifact 생성은 Play Console 업로드 완료가 아님
- AAB artifact 생성은 signing 설정 완료가 아님
- AAB artifact 생성은 실제 기기 QA 완료가 아님
- artifact 다운로드, 압축 해제, `.aab` 파일 존재 확인은 Pending 유지
- signing 설정은 Pending 유지
- GitHub Secrets 실제 입력은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release AAB Run 3 Success

- Android Release AAB workflow run number 3 success 결과 기록
- AAB artifact `harupuli-release-aab` 생성 확인
- AAB artifact size와 digest 기록
- AAB artifact 생성은 Play Console 업로드 완료가 아님
- signing 설정은 Pending 유지
- GitHub Secrets 실제 입력은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release AAB Workflow Node.js Version

- Android Release AAB workflow Node.js version을 20에서 22로 보정
- Capacitor CLI의 NodeJS >=22.0.0 요구 조건에 맞게 workflow 설정 갱신
- Android release AAB workflow check script에 Node.js 22 기준 추가
- Android release AAB workflow run result check script에 후속 보정 문구 반영
- signing 설정은 Pending 유지
- GitHub Secrets 실제 입력은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- keystore 파일 추가 없음
- signing password 기록 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Actual Current Android Release AAB Workflow Result

- actual current Android Release AAB workflow 수동 실행 결과 기록
- 실제 workflow run number, status, conclusion 기록
- run number 2, status completed, conclusion failure
- 실패 단계는 Sync Android project
- 실패 원인 요약은 Capacitor CLI가 NodeJS >=22.0.0을 요구했으나 workflow가 Node.js 20.20.2를 사용한 것
- AAB artifact 생성 여부 기록
- AAB artifact는 Not created
- signing 설정은 Pending 유지
- GitHub Secrets 실제 입력은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Current Android Release AAB Workflow Result

- current main 기준 Android Release AAB workflow run 결과 확인을 시도
- 현재 workflow 기준 신규 run 결과는 아직 Pending current workflow run으로 기록
- 이전 signing workflow run 기준 결과는 현재 workflow run 결과로 기록하지 않음
- signing 설정은 Pending 유지
- GitHub Secrets 실제 입력은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release AAB Workflow Run Result Alignment

- Android release AAB workflow 수동 실행 결과 문서의 기준 정합성 보정
- 이전 signing workflow run 기준 기록 제거
- 현재 main의 Android Release AAB workflow 기준 결과로 정리
- signing 설정은 Pending 유지
- GitHub Secrets 실제 입력은 Pending 유지
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release AAB Workflow Run Result

- Android Release AAB workflow 수동 실행 결과 기록
- 실제 workflow run number, status, conclusion 기록
- AAB artifact 생성 여부 기록
- signing 설정은 Pending 유지
- GitHub Secrets 실제 입력 없음
- Play Console 내부 테스트 업로드는 Pending 유지
- 실제 기기 QA는 Pending 유지
- workflow 파일 변경 없음
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Android Release AAB Workflow

- Android release AAB GitHub Actions workflow 파일 추가
- workflow_dispatch 기반 수동 실행 구조 추가
- web build, Capacitor sync, Gradle bundleRelease, AAB artifact upload 단계 구성
- signing 설정은 Pending 유지
- keystore 파일 추가 없음
- signing password 기록 없음
- GitHub Secrets 실제 입력 없음
- AAB artifact 확인은 Pending workflow run 유지
- Play Console 내부 테스트 업로드와 실제 기기 QA는 Pending 유지
- Android native/Manifest/resource 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Release Workflow Design

- release AAB workflow 작성 전 설계 문서 추가
- release workflow 단계, signing secret 후보, AAB artifact 정책, versioning 확인 항목 정리
- 실제 GitHub Actions release workflow 파일 추가 없음
- release build, signing 설정, AAB 생성은 Pending 유지
- GitHub Secrets 실제 입력 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- Play Console 내부 테스트 업로드와 실제 기기 QA는 Pending 유지
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음

## Release Build Signing Checklist

- release build/signing/AAB 준비 체크리스트 문서 추가
- Android Debug Build와 release build/AAB/signing 완료 상태 구분
- keystore 파일과 signing password를 repository에 기록하지 않는 보안 기준 정리
- release build, signing 설정, AAB 생성은 Pending 유지
- Play Console 내부 테스트 업로드와 실제 기기 QA는 Pending 유지
- Android native/Manifest/resource/Gradle 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 로그인/서버 DB 추가 없음

## Google Play Screenshot Production Checklist

- Google Play 스크린샷 제작 체크리스트 문서 추가
- 실제 스크린샷 제작 전 후보 화면, 캡션 출처, 시각 방향, 캡처 조건 정리
- 실제 스토어 스크린샷 이미지 제작은 Pending 유지
- 실제 Google Play Console 입력은 Pending 유지
- 실제 기기 QA와 Play Console 내부 테스트 업로드는 Pending 유지
- release build, signing 설정, AAB 생성은 Pending 유지
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- Android native/resource 변경 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 로그인/서버 DB 추가 없음

## Privacy Policy Content Draft

- 개인정보처리방침 내용 초안 문서 추가
- 개인정보처리방침 내용 초안 check script 추가
- localStorage 데이터 인벤토리 기준 저장 가능 항목 반영
- 개인정보처리방침 URL 확정은 Pending 유지
- 문의처와 적용일은 Pending 유지
- 실제 Google Play Console 입력 없음
- 실제 Google Play 데이터 보안 양식 입력 없음
- production 분석 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- Android native/resource 변경 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음
- 실제 광고 SDK, 결제 SDK, 로그인, 서버 DB, 외부 분석 SDK 추가 없음

## Local Storage Data Inventory

- localStorage 데이터 인벤토리 문서 추가
- 실제 코드 기준 localStorage 사용 위치와 저장 항목 정리
- localStorage 중심 사용자 입력 저장 구조 기준 유지
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- schemaVersion 변경 없음
- 실제 Google Play 데이터 보안 양식 입력은 Pending 유지
- 개인정보 처리방침 URL과 문의처는 Pending 유지
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- Android native/resource 변경 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 로그인/서버 DB 추가 없음

## Google Play Data Safety Draft Checklist

- Google Play data safety draft checklist document added
- Current app state documented as no server DB, no login, no real ad SDK, no real payment SDK, and no external analytics SDK
- Data safety review items documented based on localStorage centered user input storage
- Actual Google Play data safety form input remains Pending
- Privacy policy URL and contact remain Pending
- localStorage key final review remains Pending
- production calculation logic unchanged
- saju/fortune result generation logic unchanged
- UI/design unchanged
- schemaVersion unchanged
- existing localStorage keys unchanged
- Android native/resource unchanged
- real ad SDK not added
- real payment SDK not added
- login and server DB not added

## Google Play Check Phrase Alignment

- Google Play related check script forbidden phrase rules aligned
- Correct phrase `태양시 보정 적용 여부` is no longer treated as a forbidden phrase
- Wrong phrase `서양식 보정 적용 여부` remains checked
- Wrong phrase `실제 스토어 스크린샷 이미지 시작` is checked
- Wrong phrase `양력/음력 샘플 추가 검증` remains checked
- production calculation logic unchanged
- saju/fortune result generation logic unchanged
- UI/design unchanged
- actual Google Play Console input not performed
- real store screenshot image production not performed
- Android native/resource unchanged

## Google Play App Metadata Checklist

- Google Play app metadata checklist document added
- App name, default language, app type, app category, and tag readiness documented
- Short description, full description, and screenshot caption draft sources linked
- Contact, privacy policy URL, and data safety form readiness documented
- Real store screenshot image production remains Pending
- Actual Google Play Console input remains Pending
- Real device QA and Play Console internal test upload remain Pending
- release build, signing setup, and AAB generation remain Pending
- production calculation logic unchanged
- saju/fortune result generation logic unchanged
- UI/design unchanged
- routing unchanged
- schemaVersion unchanged
- existing localStorage keys unchanged
- localStorage key not added
- Android native/resource unchanged
- real ad SDK not added
- real payment SDK not added
- login and server DB not added

## Google Play Screenshot Caption Plan

- Google Play screenshot caption plan document added
- Candidate store screenshot screens and caption candidates documented
- Allowed captions and avoided captions separated
- Visual direction notes documented
- Real store screenshot image production remains Pending
- Actual Google Play Console input remains Pending
- Real device QA and Play Console internal test upload remain Pending
- production calculation logic unchanged
- saju/fortune result generation logic unchanged
- UI/design unchanged
- routing unchanged
- schemaVersion unchanged
- existing localStorage keys unchanged
- localStorage key not added
- Android native/resource unchanged
- real ad SDK not added
- real payment SDK not added
- login and server DB not added

## Google Play Description Draft

- Google Play description draft document added
- App name, short description candidates, and full description draft documented
- Reference-only fortune content positioning retained
- Current release scope safety criteria retained
- Actual Google Play Console input remains Pending
- Privacy policy URL, contact, data safety form, real store screenshot image production, real device QA, and Play Console internal test upload remain Pending
- release build, signing setup, and AAB generation remain Pending
- production calculation logic unchanged
- manseryeok calculation logic unchanged
- existing surface element analysis logic unchanged
- hidden-stem element analysis production connection not added
- ten gods analysis production connection not added
- solar time correction not applied
- createSajuAnalysis return structure unchanged
- production result shape unchanged
- saju/fortune result generation logic unchanged
- UI/design unchanged
- routing unchanged
- schemaVersion unchanged
- existing localStorage keys unchanged
- localStorage key not added
- server DB not added
- login not added
- real ad SDK not added
- real payment SDK not added
- external analysis SDK not added
- Android native/resource unchanged
- Play Console input not performed
- real device QA not performed

## Google Play Listing Claim Safety

- Google Play listing claim safety document added
- Current app capability and unavailable features separated
- Allowed listing claims and avoided listing claims separated
- App name, short description, full description, and screenshot caption guidance documented
- Privacy policy URL, contact, data safety form, real store screenshots, real device QA, and Play Console internal test upload remain Pending
- release build, signing setup, AAB generation, and actual Google Play Console input remain Pending
- production calculation logic unchanged
- manseryeok calculation logic unchanged
- existing surface element analysis logic unchanged
- hidden-stem element analysis production connection not added
- ten gods analysis production connection not added
- solar time correction not applied
- createSajuAnalysis return structure unchanged
- production result shape unchanged
- saju/fortune result generation logic unchanged
- UI/design unchanged
- routing unchanged
- schemaVersion unchanged
- existing localStorage keys unchanged
- localStorage key not added
- server DB not added
- login not added
- real ad SDK not added
- real payment SDK not added
- external analysis SDK not added
- Android native/resource unchanged
- Play Console input not performed
- real device QA not performed

## Advanced Saju Engine Release Scope

- Current release scope and future advanced saju engine expansion scope separated
- Current release scope includes basic manseryeok output, existing surface element analysis, and existing fortune result generation logic only
- Hidden-stem and ten-gods production connections remain Pending
- Solar time correction remains outside current release scope
- External manseryeok verification remains Pending
- Google Play listing should not claim completed advanced saju analysis
- Privacy policy URL, contact, data safety form, real store screenshots, real device QA, and Play Console internal test upload remain Pending
- production calculation logic unchanged
- manseryeok calculation logic unchanged
- existing surface element analysis logic unchanged
- hidden-stem element analysis production connection not added
- ten gods analysis production connection not added
- hidden-stem ten gods calculation not added
- solar time correction not applied
- birth-place longitude correction not added
- major luck, annual flow, and combination analysis not added
- createSajuAnalysis return structure unchanged
- production result shape unchanged
- saju/fortune result generation logic unchanged
- today fortune/2026 fortune/zodiac fortune result generation logic not connected
- ten gods copy UI application not added
- UI/design unchanged
- routing unchanged
- schemaVersion unchanged
- existing localStorage keys unchanged
- localStorage key not added
- server DB not added
- login not added
- real ad SDK not added
- real payment SDK not added
- external analysis SDK not added
- Android native/resource unchanged
- Play Console input not performed
- real device QA not performed

## Advanced Saju Result Structure

- Advanced saju result structure design document added
- Surface, hidden-stem, and ten-gods result separation structure proposed
- Current release scope and future advanced analysis scope separated
- Hidden-stem and ten-gods production connection remains Pending
- Solar time correction remains outside current release scope
- External manseryeok verification remains Pending
- production calculation logic unchanged
- manseryeok calculation logic unchanged
- existing surface element analysis logic unchanged
- hidden-stem element analysis production connection not added
- ten gods analysis production connection not added
- hidden-stem ten gods calculation not added
- solar time correction not applied
- createSajuAnalysis return structure unchanged
- production result shape unchanged
- saju/fortune result generation logic unchanged
- today fortune/2026 fortune/zodiac fortune result generation logic not connected
- ten gods copy UI application not added
- UI/design unchanged
- routing unchanged
- schemaVersion unchanged
- existing localStorage keys unchanged
- localStorage key not added
- server DB not added
- login not added
- real ad SDK not added
- real payment SDK not added
- external analysis SDK not added
- Android native/resource unchanged
- Play Console input not performed
- real device QA not performed

## Ten Gods Copy Guidelines

- Ten gods copy guidelines document added
- General-user explanations for 10 ten gods documented
- Allowed copy and avoided copy examples separated
- Tone criteria favoring reference copy over deterministic prediction documented
- production ten gods analysis connection remains Pending
- ten gods data external verification remains Pending
- hidden-stem ten gods calculation remains Pending
- ten gods copy UI application remains Pending
- production calculation logic unchanged
- manseryeok calculation logic unchanged
- existing surface element analysis logic unchanged
- hidden-stem element analysis unchanged
- ten gods analysis production connection not added
- ten gods copy UI application not added
- createSajuAnalysis return structure unchanged
- saju/fortune result generation logic unchanged
- today fortune/2026 fortune/zodiac fortune result generation logic not connected
- UI/design unchanged
- routing unchanged
- schemaVersion unchanged
- existing localStorage keys unchanged
- localStorage key not added
- server DB not added
- login not added
- real ad SDK not added
- real payment SDK not added
- external analysis SDK not added
- Android native/resource unchanged
- Play Console input not performed
- real device QA not performed

## Ten Gods Analysis QA

- Ten gods analysis QA document added
- Heavenly-stem ten gods draft function sample expectations documented
- summaryByTenGod verification criteria documented
- per-target tenGod result verification criteria documented
- verificationStatus remains Pending external verification
- connectionStatus remains Not connected to production analysis
- production ten gods analysis connection remains Pending
- hidden-stem ten gods calculation remains Pending
- ten gods data external verification remains Pending
- production calculation logic unchanged
- manseryeok calculation logic unchanged
- existing surface element analysis logic unchanged
- hidden-stem element analysis unchanged
- ten gods analysis production connection not added
- createSajuAnalysis return structure unchanged
- saju/fortune result generation logic unchanged
- today fortune/2026 fortune/zodiac fortune result generation logic not connected
- UI/design unchanged
- routing unchanged
- schemaVersion unchanged
- existing localStorage keys unchanged
- localStorage key not added
- server DB not added
- login not added
- real ad SDK not added
- real payment SDK not added
- external analysis SDK not added
- Android native/resource unchanged
- Play Console input not performed
- real device QA not performed

## Ten Gods Analysis Draft

- Ten gods analysis draft function added
- Heavenly-stem ten gods draft calculation added from dayStem to year/month/day/hour targets
- summaryByTenGod draft structure added
- verificationStatus remains Pending external verification
- connectionStatus remains Not connected to production analysis
- production ten gods analysis connection remains Pending
- hidden-stem ten gods calculation remains Pending
- ten gods data external verification remains Pending
- production calculation logic unchanged
- manseryeok calculation logic unchanged
- existing surface element analysis logic unchanged
- hidden-stem element analysis unchanged
- ten gods analysis production connection not added
- createSajuAnalysis return structure unchanged
- saju/fortune result generation logic unchanged
- today fortune/2026 fortune/zodiac fortune result generation logic not connected
- UI/design unchanged
- routing unchanged
- schemaVersion unchanged
- existing localStorage keys unchanged
- localStorage key not added
- server DB not added
- login not added
- real ad SDK not added
- real payment SDK not added
- external analysis SDK not added
- Android native/resource unchanged
- Play Console input not performed
- real device QA not performed

## Ten Gods Analysis Design

- 십성 분석 설계 문서 추가
- 기존 겉오행 분석, 지장간 반영 분석, 십성 분석을 분리하는 방향으로 설계
- 십성 분석 결과는 별도 draft 결과 구조로 검토
- 지장간 십성 산출은 후속 후보로 분리
- production 십성 분석 연결은 Pending 유지
- 십성 데이터 외부 기준 검증은 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 변경 없음
- 십성 분석 구현 없음
- 십성 분석 production 연결 없음
- createSajuAnalysis 반환 구조 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세/2026운세/띠별운세 결과 생성 로직 연결 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Ten Gods Mapping QA

- 십성 매핑 QA 문서 추가
- 10천간 metadata 확인 기준 정리
- 10개 십성 profile 확인 기준 정리
- 100개 mapping entry coverage 기준 정리
- 대표 샘플 매핑 기대값 정리
- 외부 검증 상태는 Pending external verification으로 유지
- production 십성 분석 연결은 Pending 유지
- 십성 데이터 외부 기준 검증은 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 변경 없음
- 십성 분석 production 연결 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Ten Gods Mapping

- 10천간 메타데이터 추가
- 10개 십성 기본 프로필 추가
- 10개 일간 x 10개 target 천간 매핑 데이터 추가
- 외부 검증 상태는 Pending external verification으로 유지
- production 십성 분석 연결은 Pending 유지
- 십성 반영 운세 결과 생성은 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 변경 없음
- 십성 분석 production 연결 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Hidden Stems Element Analysis QA

- 지장간 반영 오행 분석 QA 문서 추가
- simple count 방식의 샘플 기대값 정리
- dominant/weak 산출 기준 정리
- branchBreakdown 검증 기준 정리
- verificationStatus는 Pending external verification 유지
- connectionStatus는 Not connected to production analysis 유지
- weightingPolicy는 simple-count-draft 유지
- 지장간 가중치 정책은 Pending 유지
- production 오행 분석 연결은 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- production elementAnalyzer 연결 없음
- createSajuAnalysis 반환 구조 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세/2026운세/띠별운세 결과 생성 로직 연결 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Hidden Stems Element Analysis Draft

- 지장간 반영 오행 분석 draft 함수 추가
- 지장간 데이터셋 기반 simple count 방식 초안 추가
- branchBreakdown 초안 구조 추가
- verificationStatus는 Pending external verification 유지
- connectionStatus는 Not connected to production analysis 유지
- 지장간 가중치 정책은 Pending 유지
- production 오행 분석 연결은 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- production elementAnalyzer 연결 없음
- createSajuAnalysis 반환 구조 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세/2026운세/띠별운세 결과 생성 로직 연결 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Hidden Stems Element Analysis Design

- 지장간 반영 오행 분석 설계 문서 추가
- 기존 겉오행 분석과 지장간 반영 분석을 분리하는 방향으로 설계
- 지장간 가중치 정책은 Pending 유지
- 지장간 외부 기준 검증은 Pending 유지
- production 오행 분석 연결은 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 구현 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세/2026운세/띠별운세 결과 생성 로직 연결 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Hidden Stems Dataset QA

- 지장간 데이터셋 QA 문서 추가
- 12지지 coverage 확인 기준 정리
- 10천간 metadata 확인 기준 정리
- 지지별 지장간 count/role 확인 기준 정리
- 외부 검증 상태는 Pending external verification으로 유지
- production 오행 분석 연결은 Pending 유지
- 지장간 데이터 외부 기준 검증은 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 추가 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Hidden Stems Dataset

- 12지지별 지장간 데이터셋 추가
- 천간별 오행/음양 메타데이터 포함
- 지지별 한글명/동물명 포함
- 외부 검증 상태는 Pending external verification으로 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 추가 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Solar Time Correction Policy

- 태양시 보정 적용 여부 정책 문서 추가
- 현재 release scope에서는 태양시 보정을 적용하지 않는 것으로 문서화
- 현재 앱 산출값은 입력된 표준시 기준으로 유지
- 향후 적용 시 출생지 입력 UX, 저장 정책, 경도 기반 보정 계산, 외부 만세력 기준 샘플 검증이 필요함을 정리
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 태양시 보정 계산 로직 추가 없음
- 출생지 입력 UI 추가 없음
- 출생지 저장 구조 추가 없음
- localStorage key 추가 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Manseryeok Late-Night Jasi Sample Results

- 23시 이후 자시 기준 샘플 외부 기준값 기록 문서 추가
- PR #148의 현재 앱 산출값을 자시 기준 샘플 표에 참조
- same_day와 next_day 자시 기준 샘플을 구분
- 외부 기준값은 아직 Pending 유지
- Match status는 아직 Pending 유지
- 양력 샘플 외부 기준값 대조 결과는 Pending 유지
- 음력/윤달 샘플 외부 검증은 Pending 유지
- 태양시 보정 적용 여부는 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Manseryeok Lunar and Leap Month Sample Results

- 음력/윤달 샘플 외부 기준값 기록 문서 추가
- PR #148의 현재 앱 산출값을 음력/윤달 샘플 표에 참조
- 외부 기준값은 아직 Pending 유지
- Match status는 아직 Pending 유지
- 양력 샘플 외부 기준값 대조 결과는 Pending 유지
- 태양시 보정 적용 여부는 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Manseryeok Solar Sample Results

- 양력 샘플 외부 기준값 기록 문서 추가
- PR #148의 현재 앱 산출값을 양력 샘플 표에 참조
- 외부 기준값은 아직 Pending 유지
- Match status는 아직 Pending 유지
- 음력/윤달 샘플 외부 검증은 Pending 유지
- 태양시 보정 적용 여부는 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Manseryeok Current Sample Snapshot

- 현재 앱 만세력 샘플 산출값 스냅샷 문서 추가
- 현재 앱의 calculateManseryeok 결과를 샘플 케이스별로 출력할 수 있는 스크립트 추가
- snapshot 스크립트 실행 결과를 현재 앱 산출값으로 문서에 반영
- 외부 만세력 기준값 대조 결과는 Pending 유지
- 태양시 보정 적용 여부는 Pending 유지
- 음력/윤달 샘플 외부 검증은 Pending 유지
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Manseryeok External Sample Verification Plan

- 외부 만세력 기준 샘플 검증 준비 문서 추가
- 양력/음력/윤달/절기 경계/23시 이후 자시/출생시간 모름/태양시 보정 적용 여부 검토 샘플 케이스 정의
- 모든 실제 외부 검증 결과는 Pending 유지
- 외부 기준값 임의 입력 없음
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Saju Engine Accuracy Roadmap

- 현재 사주/운세 엔진 수준을 문서화
- 현재 엔진은 “전통 사주 이론 일부를 기반으로 한 개인화 운세 콘텐츠 엔진 1단계”로 정리
- 지장간/십성/용신/대운/세운/형충회합 등 미구현 항목을 Pending으로 정리
- 태양시 보정 적용 여부와 음력/윤달 샘플 외부 검증을 후속 검토 항목으로 분리
- 제품 설명에 사용할 수 있는 표현과 피해야 할 표현 정리
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Zodiac Fortune Sample QA Checks

- 12지 전체 띠별운세 샘플 결과 QA 문서 추가
- 샘플 결과의 필수 구성 필드 확인
- 재물운/건강운 과장 표현 방지 기준 확인
- 금지 표현 검사 추가
- composer의 deterministic 구조 유지 확인
- 실제 화면 QA는 아직 Pending
- 실제 기기 QA는 아직 Pending
- 오늘운세/사주풀이/2026운세 계산 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음

## Zodiac Year Pillar Policy Alignment

- 띠별운세의 안내 문구와 실제 초기 선택 로직 정합성 보정
- 사주 연주 지지가 계산 가능하면 사주 연주 기준 띠를 우선 사용
- 사주 연주 지지가 없으면 일반 출생연도 기준 띠를 fallback으로 사용
- 일반 출생연도 기준 띠와 사주 연주 기준 띠가 다를 수 있음을 안내
- 연도별 띠 목록은 일반 출생연도 기준 참고 목록으로 유지
- 띠별운세 composer 연결 유지
- 오늘운세/사주풀이/2026운세 계산 로직 변경 없음
- UI/디자인 대규모 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Zodiac Fortune Composition Logic Improvement

- PR #142의 12지 기본 성향 데이터셋을 활용한 띠별운세 결과 조합 로직 추가/개선
- 결과 조합 로직은 deterministic 방식으로 구성
- Math.random 직접 사용 없음
- 재물운/건강운 단정 표현 금지 기준 유지
- 띠별운세 화면 텍스트 소스를 조합 결과로 최소 연결
- 띠별운세 영역 외 production 계산 로직 변경 없음
- 오늘운세/사주풀이/2026운세 계산 로직 변경 없음
- UI/디자인 변경 없음 또는 최소 텍스트 연결 변경만 수행
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Zodiac Fortune Profile Dataset Expansion

- 12지 전체 기본 성향 데이터셋 추가/확장
- 각 띠별 기본 성향, 장점, 주의점, 일일 테마, 관계 힌트, 재물 톤, 건강 톤, 루틴 힌트 정리
- 띠별운세 결과 조합 로직은 아직 변경하지 않음
- UI 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## Zodiac Fortune Engine Improvement Plan

- 띠별운세 분석 엔진 보완을 위한 설계 문서 추가
- 현재 PR에서는 production 계산 로직 변경 없음
- 현재 PR에서는 UI 변경 없음
- 기존 routing 유지
- schemaVersion 유지
- 기존 localStorage key 유지
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native/resource 변경 없음
- Play Console 입력 없음
- 실제 기기 QA 없음

## PR #117 - PR #116 이후 Android artifact 문구 정합성 재수정

### 목적

- PR #116 merge 이후에도 남아 있던 Android artifact 문구 정합성 문제를 재수정했습니다.
- `시작`/`서양식` 기준으로 남아 있던 이전 표현을 제거했습니다.
- `checkAndroidDebugApkArtifactRefreshRun38`의 old/correct marker 기준을 올바른 방향으로 재수정했습니다.

### 문구 보정

- `실제 스토어 스크린샷 이미지 제작` 문구를 적용했습니다.
- `스토어 스크린샷 이미지 제작` 미진행 항목을 적용했습니다.
- `태양시 보정 적용 여부` 문구를 적용했습니다.
- `음력/윤달 샘플 외부 검증` 문구를 적용했습니다.
- 이전 스크린샷 시작 표현은 이번 기준에서 사용하지 않았습니다.
- 이전 보정 기준 표현은 이번 기준에서 사용하지 않았습니다.
- 이전 음력/윤달 샘플 외부 검증 표현은 이번 기준에서 사용하지 않았습니다.

### 검증 스크립트 보정

- `oldTodoMarkers`를 이전 표현 기준으로 수정했습니다.
- `correctTodoMarkers`를 올바른 표현 기준으로 수정했습니다.
- 올바른 `스토어 스크린샷 이미지 제작` 문구를 금지하던 추가 검증을 제거했습니다.
- `doc_does_not_claim_actual_done`의 완료 판정 금지 문구를 `스토어 스크린샷 이미지 제작 완료` 기준으로 수정했습니다.

### 유지 기준

- run #38 artifact 기준을 유지했습니다.
- run #39 artifact 기준으로 갱신하지 않았습니다.
- run #42 artifact 기준으로 갱신하지 않았습니다.
- run #43 artifact 기준으로 갱신하지 않았습니다.
- PR #114 홈 디자인 변경을 유지했습니다.
- 디자인 코드 변경은 하지 않았습니다.
- production 코드 로직 변경은 하지 않았습니다.
- Android native/resource 변경은 하지 않았습니다.
- routing 변경은 하지 않았습니다.
- schemaVersion 변경은 하지 않았습니다.
- 기존 localStorage key 변경은 하지 않았습니다.

### 실제 미수행 항목

- 실제 APK 다운로드는 수행하지 않았습니다.
- 실제 APK 설치는 수행하지 않았습니다.
- 실제 앱 실행은 수행하지 않았습니다.
- 실제 Android QA는 수행하지 않았습니다.
- 실제 스토어 스크린샷 이미지 파일은 추가하지 않았습니다.
- Google Play Console 입력은 수행하지 않았습니다.
- release build는 진행하지 않았습니다.
- signing 설정은 진행하지 않았습니다.
- AAB 생성은 진행하지 않았습니다.

### 검증

- `npm install`: 통과
  - 기존 audit 경고: high severity 2건 유지
- `npm run build`: 통과
  - 기존 Vite chunk size 경고 유지
- `npm run check:android-debug-apk-artifact-refresh-run38`: 통과
- `npm run check:android-device-qa-unblock-readiness`: 통과
- `npm run check:android-debug-apk-install-launch-qa-result`: 통과
- `npm run check:android-debug-apk-qa-handoff-readiness`: 통과
- `npm run check:android-device-qa-execution-result`: 통과
- `npm run check:android-qa-status-summary`: 통과
- `npm run check:capacitor-readiness`: 통과
- `npm run check:android-packaging-readiness`: 통과
- `npm run check:content-safety`: 통과
- `npm run check:share-text`: 통과
- `npm run check:google-play-screenshot-readiness`: 통과
- `npm run check:store-screenshot-capture-qa-result`: 통과
- `npm run check:store-screenshot-sample-profile-screen-qa-result`: 통과

## PR #116 - Android artifact refresh run #38 문구 정합성 최종 보정

### 목적

- Android artifact refresh run #38 문서와 TODO의 문구 정합성을 최종 보정했습니다.
- PR #115 이후에도 남아 있던 잘못된 문구 기준을 제거했습니다.
- `checkAndroidDebugApkArtifactRefreshRun38`의 old/correct marker 기준을 최종 확인했습니다.

### 문구 보정

- `실제 스토어 스크린샷 이미지 제작` 문구를 적용했습니다.
- `스토어 스크린샷 이미지 제작` 미진행 항목을 적용했습니다.
- `태양시 보정 적용 여부` 문구를 적용했습니다.
- `음력/윤달 샘플 외부 검증` 문구를 적용했습니다.
- 이전 스토어 스크린샷 제작 표현을 제거했습니다.
- 이전 보정 기준 표현은 이번 기준에서 사용하지 않았습니다.
- 이전 음력 샘플 추가 검증 표현은 이번 기준에서 사용하지 않았습니다.

### 유지 기준

- run #38 artifact 기준을 유지했습니다.
- run #39 artifact 기준으로 갱신하지 않았습니다.
- run #42 artifact 기준으로 갱신하지 않았습니다.
- run #43 artifact 기준으로 갱신하지 않았습니다.
- PR #114 홈 디자인 변경을 유지했습니다.
- 디자인 코드 변경은 하지 않았습니다.
- production 코드 로직 변경은 하지 않았습니다.
- Android native/resource 변경은 하지 않았습니다.
- routing 변경은 하지 않았습니다.
- schemaVersion 변경은 하지 않았습니다.
- 기존 localStorage key 변경은 하지 않았습니다.

### 실제 미수행 항목

- 실제 APK 다운로드는 수행하지 않았습니다.
- 실제 APK 설치는 수행하지 않았습니다.
- 실제 앱 실행은 수행하지 않았습니다.
- 실제 Android QA는 수행하지 않았습니다.
- 실제 스토어 스크린샷 이미지 파일은 추가하지 않았습니다.
- Google Play Console 입력은 수행하지 않았습니다.
- release build는 진행하지 않았습니다.
- signing 설정은 진행하지 않았습니다.
- AAB 생성은 진행하지 않았습니다.

### 검증

- `npm install`: 통과
  - 기존 audit 경고: high severity 2건 유지
- `npm run build`: 통과
  - 기존 Vite chunk size 경고 유지
- `npm run check:android-debug-apk-artifact-refresh-run38`: 통과
- `npm run check:android-device-qa-unblock-readiness`: 통과
- `npm run check:android-debug-apk-install-launch-qa-result`: 통과
- `npm run check:android-debug-apk-qa-handoff-readiness`: 통과
- `npm run check:android-device-qa-execution-result`: 통과
- `npm run check:android-qa-status-summary`: 통과
- `npm run check:capacitor-readiness`: 통과
- `npm run check:android-packaging-readiness`: 통과
- `npm run check:content-safety`: 통과
- `npm run check:share-text`: 통과
- `npm run check:google-play-screenshot-readiness`: 통과
- `npm run check:store-screenshot-capture-qa-result`: 통과
- `npm run check:store-screenshot-sample-profile-screen-qa-result`: 통과

# 2026-06-17 Android Artifact Refresh Wording Consistency V2

## 작업 내용

- PR 목적: Android artifact refresh run #38 문구 정합성 재보정
- PR #113에서 반대로 반영된 TODO 문구 기준 재보정
- `ANDROID_DEBUG_APK_ARTIFACT_REFRESH_RUN38.md`의 TODO 문구 기준 보강
- `checkAndroidDebugApkArtifactRefreshRun38`의 old/correct wording 검증 방향 재확인 및 라벨 보정
- `TODO.md`의 최신 완료 항목을 재보정 기준으로 수정
- `실제 스토어 스크린샷 이미지 제작` 문구 유지
- `태양시 보정 적용 여부` 문구 유지
- `음력/윤달 샘플 외부 검증` 문구 유지
- 이전 스토어 스크린샷 제작 표현을 이번 기준에서 사용하지 않음
- 이전 보정 기준 표현을 이번 기준에서 사용하지 않음
- 이전 음력 샘플 추가 검증 표현을 이번 기준에서 사용하지 않음
- run #38 artifact 기준 유지
- run #39 artifact 기준 미반영
- run #42 artifact 기준 미반영
- PR #114 홈 디자인 변경 유지
- 디자인 코드 변경 없음
- 실제 APK 다운로드 없음
- 실제 APK 설치 없음
- 실제 앱 실행 없음
- 실제 Android QA 없음
- 실제 스크린샷 이미지 추가 없음
- Google Play Console 입력 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- production 코드 로직 변경 없음
- Android native/resource 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

## 테스트 결과

- `npm install`: 통과
  - 기존 audit 경고: high severity 2건 유지
- `npm run build`: 통과
  - 기존 Vite chunk size 경고 유지
- `npm run check:android-debug-apk-artifact-refresh-run38`: 통과
- `npm run check:android-device-qa-unblock-readiness`: 통과
- `npm run check:android-debug-apk-install-launch-qa-result`: 통과
- `npm run check:android-debug-apk-qa-handoff-readiness`: 통과
- `npm run check:android-device-qa-execution-result`: 통과
- `npm run check:android-qa-status-summary`: 통과
- `npm run check:capacitor-readiness`: 통과
- `npm run check:android-packaging-readiness`: 통과
- `npm run check:content-safety`: 통과
- `npm run check:share-text`: 통과
- `npm run check:google-play-screenshot-readiness`: 통과
- `npm run check:store-screenshot-capture-qa-result`: 통과
- `npm run check:store-screenshot-sample-profile-screen-qa-result`: 통과

# 2026-06-17 Home UI Refresh V1

## 작업 내용

- PR 목적: 홈 화면 1차 디자인 리프레시
- 디자인 콘셉트: 고요한 밤의 운세 다이어리
- 따뜻한 아이보리 배경 적용
- 딥 네이비, 베이지, 은은한 금색 포인트 적용
- CSS design token 추가
- 카드형 UI 개선
- 홈 화면 CTA 개선
- 빠른 메뉴 구성 개선
- 신뢰/개인정보 안내 카드 추가
- 오늘의 한 줄 풀이 영역 정리
- 최근 본 풀이 영역 추가
- 광고 placeholder 위치 기준 추가
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android native/resource 변경 없음
- 실제 스크린샷 이미지 추가 없음
- Google Play Console 입력 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행

## 테스트 결과

- `npm install`: 통과
  - 기존 audit 경고: high severity 2건 유지
- `npm run build`: 통과
  - 기존 Vite chunk size 경고 유지
- `npm run check:content-safety`: 통과
- `npm run check:share-text`: 통과
- `npm run check:brand-copy-consistency`: 통과
- `npm run check:google-play-screenshot-readiness`: 통과
- `npm run check:store-screenshot-capture-qa-result`: 통과
- `npm run check:store-screenshot-sample-profile-screen-qa-result`: 통과
- `npm run check:android-qa-status-summary`: 통과
- `npm run check:android-packaging-readiness`: 통과
- `npm run check:capacitor-readiness`: 통과
- `npm run check:android-debug-apk-artifact-refresh-run38`: 통과
- `Invoke-WebRequest http://127.0.0.1:5173`: 200 응답 확인

# 2026-06-17 Android Artifact Refresh Wording Consistency

## 작업 내용

- PR 목적: Android artifact refresh run #38 문구 정합성 보정
- `ANDROID_DEBUG_APK_ARTIFACT_REFRESH_RUN38.md`의 TODO 문구 보정 기준 수정
- `checkAndroidDebugApkArtifactRefreshRun38`의 old/correct wording 검증 방향 수정
- `TODO.md` 전체 문구 보정
- `실제 스토어 스크린샷 이미지 제작` 문구 유지
- `태양시 보정 적용 여부` 문구 유지
- 이전 음력 샘플 추가 검증 문구 제거
- `음력/윤달 샘플 외부 검증` 문구 적용
- run #38 artifact 기준 유지
- run #39 artifact는 이번 PR에서 새 기준으로 갱신하지 않음
- 실제 APK 다운로드 없음
- 실제 APK 설치 없음
- 실제 앱 실행 없음
- 실제 Android QA 없음
- 실제 스크린샷 이미지 없음
- Google Play Console 입력 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- production 코드 로직 변경 없음
- Android native/resource 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

## 테스트 결과

- `npm install`: 통과
  - 기존 audit 경고: high severity 2건 유지
- `npm run build`: 통과
  - 기존 Vite chunk size 경고 유지
- `npm run check:android-debug-apk-artifact-refresh-run38`: 통과
- `npm run check:android-device-qa-unblock-readiness`: 통과
- `npm run check:android-debug-apk-install-launch-qa-result`: 통과
- `npm run check:android-debug-apk-qa-handoff-readiness`: 통과
- `npm run check:android-device-qa-execution-result`: 통과
- `npm run check:android-qa-status-summary`: 통과
- `npm run check:capacitor-readiness`: 통과
- `npm run check:android-packaging-readiness`: 통과
- `npm run check:content-safety`: 통과
- `npm run check:share-text`: 통과

# 2026-06-17 Android Debug APK Artifact Refresh Run 38

## 작업 내용

- PR 목적: Android debug APK artifact run #38 기준 갱신 문서 및 검증 스크립트 추가
- `ANDROID_DEBUG_APK_ARTIFACT_REFRESH_RUN38.md` 신규 추가
- `checkAndroidDebugApkArtifactRefreshRun38` 신규 추가
- 신규 npm script: `check:android-debug-apk-artifact-refresh-run38`
- Android Debug Build run #38 success 기록
- 기준 branch `docs/android-device-qa-unblock-readiness` 기록
- head sha `33a6ff4b60459fb9e9d9bb0b047df759b19bf559` 기록
- harupuli-debug-apk artifact id 7685703968 기록
- artifact digest `sha256:69bea66d93fbe5e4d77e82aa2d93af318feb972e99c4e37cf6c08aafb217d076` 기록
- run #35, run #36, run #37 기준 문서와의 관계 기록
- artifact 다운로드 Pending 기록
- APK 압축 해제 Pending 기록
- app-debug.apk 확인 Pending 기록
- ADB 연결 Pending 기록
- APK 설치 Pending 기록
- 앱 실행 Pending 기록
- Android 실제 기기 QA Blocked 기록
- Android Emulator QA Pending 기록
- TODO 문구 보정 기록
- 실제 이미지 파일 추가 없음 기록
- 실제 Console 입력 없음 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 통과
  - 기존 audit 경고: high severity 2건 유지
- `npm run build`: 통과
  - 기존 Vite chunk size 경고 유지
- `npm run check:android-debug-apk-artifact-refresh-run38`: 통과
- `npm run check:android-device-qa-unblock-readiness`: 통과
- `npm run check:android-debug-apk-install-launch-qa-result`: 통과
- `npm run check:android-debug-apk-qa-handoff-readiness`: 통과
- `npm run check:android-device-qa-execution-result`: 통과
- `npm run check:store-screenshot-sample-profile-screen-qa-result`: 통과
- `npm run check:store-screenshot-capture-qa-result`: 통과
- `npm run check:google-play-data-safety-input-readiness`: 통과
- `npm run check:privacy-policy-contact-readiness`: 통과
- `npm run check:privacy-policy-live-url-result`: 통과
- `npm run check:android-debug-build-recovery-result`: 통과
- `npm run check:google-play-privacy-url-input-readiness`: 통과
- `npm run check:privacy-policy-build-output`: 통과
- `npm run check:privacy-policy-url-verification`: 통과
- `npm run check:store-screenshot-sample-profile`: 통과
- `npm run check:brand-copy-consistency`: 통과
- `npm run check:public-privacy-policy-page`: 통과
- `npm run check:google-play-screenshot-readiness`: 통과
- `npm run check:google-play-data-safety`: 통과
- `npm run check:google-play-store-listing`: 통과
- `npm run check:privacy-policy-url-readiness`: 통과
- `npm run check:android-qa-status-summary`: 통과
- `npm run check:android-back-button-qa-result`: 통과
- `npm run check:android-icon-splash-qa-result`: 통과
- `npm run check:android-webview-localstorage-qa-result`: 통과
- `npm run check:android-debug-build-workflow`: 통과
- `npm run check:capacitor-readiness`: 통과
- `npm run check:android-packaging-readiness`: 통과
- `npm run check:content-safety`: 통과
- `npm run check:share-text`: 통과

# 2026-06-17 Android Device QA Unblock Readiness

## 작업 내용

- PR 목적: Android device QA unblock readiness 문서 및 검증 스크립트 추가
- `ANDROID_DEVICE_QA_UNBLOCK_READINESS.md` 신규 추가
- `checkAndroidDeviceQaUnblockReadiness` 신규 추가
- 신규 npm script: `check:android-device-qa-unblock-readiness`
- Android Debug Build run #37 success 기록
- 기준 branch `docs/android-debug-apk-install-launch-qa-result` 기록
- head sha `ce1b4996ccee5ab38913fae9d75fccb1bde45762` 기록
- harupuli-debug-apk artifact id 7685195152 기록
- artifact digest `sha256:ac6b93b40bd50c786f0ac302844da12a946c4b3ec0d63b74d2c21527c8ab39e7` 기록
- Android 실제 기기 QA Blocked 기록
- Android Emulator QA Pending 기록
- ADB 연결 Pending 기록
- artifact 다운로드 Pending 기록
- APK 설치 Pending 기록
- 앱 실행 Pending 기록
- 주요 화면 확인 Pending 기록
- localStorage QA Pending 기록
- back button QA Pending 기록
- icon/splash QA Pending 기록
- Blocked 이유 기록
- Blocked 해소 조건 기록
- TODO 문구 보정 기록
- 실제 이미지 파일 추가 없음 기록
- 실제 Console 입력 없음 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 audit high 2건 유지
- `npm run build`: 성공, 기존 500kB 초과 chunk 경고 유지
- `npm run check:android-device-qa-unblock-readiness`: 성공
- `npm run check:android-debug-apk-install-launch-qa-result`: 성공
- `npm run check:android-debug-apk-qa-handoff-readiness`: 성공
- `npm run check:android-device-qa-execution-result`: 성공
- `npm run check:store-screenshot-sample-profile-screen-qa-result`: 성공
- `npm run check:store-screenshot-capture-qa-result`: 성공
- `npm run check:google-play-data-safety-input-readiness`: 성공
- `npm run check:privacy-policy-contact-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:android-debug-build-recovery-result`: 성공
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-17 Android Debug APK Install Launch QA Result

## 작업 내용

- PR 목적: Android debug APK install/launch QA result 문서 및 검증 스크립트 추가
- `ANDROID_DEBUG_APK_INSTALL_LAUNCH_QA_RESULT.md` 신규 추가
- `checkAndroidDebugApkInstallLaunchQaResult` 신규 추가
- 신규 npm script: `check:android-debug-apk-install-launch-qa-result`
- Android Debug Build run #36 success 기록
- 기준 branch `docs/android-debug-apk-qa-handoff-readiness` 기록
- head sha `ae8ddaf22d09f8ceae27d479fd30486cf87b41da` 기록
- harupuli-debug-apk artifact id 7684586472 기록
- artifact digest `sha256:1a86909598d36127b1c9503e3c4e4bb2054a1543afe7bc5f53256c639ce4adc2` 기록
- artifact 다운로드 상태 Pending 기록
- APK 압축 해제 상태 Pending 기록
- app-debug.apk 확인 상태 Pending 기록
- ADB 연결 상태 Pending 기록
- APK 설치 상태 Pending 기록
- 앱 실행 상태 Pending 기록
- 첫 화면 표시 Pending 기록
- crash/logcat 확인 Pending 기록
- Android 실제 기기 QA Blocked 기록
- Android Emulator QA Pending 기록
- 실제 이미지 파일 추가 없음 기록
- 실제 Console 입력 없음 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 audit high 2건 유지
- `npm run build`: 성공, 기존 500kB 초과 chunk 경고 유지
- `npm run check:android-debug-apk-install-launch-qa-result`: 성공
- `npm run check:android-debug-apk-qa-handoff-readiness`: 성공
- `npm run check:android-device-qa-execution-result`: 성공
- `npm run check:store-screenshot-sample-profile-screen-qa-result`: 성공
- `npm run check:store-screenshot-capture-qa-result`: 성공
- `npm run check:google-play-data-safety-input-readiness`: 성공
- `npm run check:privacy-policy-contact-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:android-debug-build-recovery-result`: 성공
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-17 Android Debug APK QA Handoff Readiness

## 작업 내용

- PR 목적: Android debug APK QA handoff readiness 문서 및 검증 스크립트 추가
- `ANDROID_DEBUG_APK_QA_HANDOFF_READINESS.md` 신규 추가
- `checkAndroidDebugApkQaHandoffReadiness` 신규 추가
- 신규 npm script: `check:android-debug-apk-qa-handoff-readiness`
- Android Debug Build run #35 success 기록
- 기준 branch `docs/android-device-qa-execution-result` 기록
- head sha `6671ddde9f0362e8a4115b4ba7d9a748f0383243` 기록
- harupuli-debug-apk artifact id 7684142019 기록
- artifact digest `sha256:f6c09f8c5d971f8680484bedf9dc175943d0ca1ec67f862390cd10f3c5e78754` 기록
- artifact 다운로드 상태 Pending 기록
- APK 압축 해제 상태 Pending 기록
- APK 설치 상태 Pending 기록
- 앱 실행 상태 Pending 기록
- Android 실제 기기 QA Blocked 기록
- Android Emulator QA Pending 기록
- ADB 연결 확인 필요 기록
- 실제 이미지 파일 추가 없음 기록
- 실제 Console 입력 없음 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 audit high 2건 유지
- `npm run build`: 성공, 기존 500kB 초과 chunk 경고 유지
- `npm run check:android-debug-apk-qa-handoff-readiness`: 성공
- `npm run check:android-device-qa-execution-result`: 성공
- `npm run check:store-screenshot-sample-profile-screen-qa-result`: 성공
- `npm run check:store-screenshot-capture-qa-result`: 성공
- `npm run check:google-play-data-safety-input-readiness`: 성공
- `npm run check:privacy-policy-contact-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:android-debug-build-recovery-result`: 성공
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-17 Android Device QA Execution Result

## 작업 내용

- PR 목적: Android device QA execution result 문서 및 검증 스크립트 추가
- `ANDROID_DEVICE_QA_EXECUTION_RESULT.md` 신규 추가
- `checkAndroidDeviceQaExecutionResult` 신규 추가
- 신규 npm script: `check:android-device-qa-execution-result`
- Android Debug Build run #34 success 기록
- harupuli-debug-apk artifact id 7661684907 기록
- artifact digest `sha256:f7192602896ceba827ac80ec1de8f24168eff5cd9d8ccaa4aa0c0e09bb2c18ca` 기록
- Android 실제 기기 QA 상태 Blocked 기록
- Android Emulator QA 상태 Pending 기록
- APK 설치 상태 Pending 기록
- 앱 실행 상태 Pending 기록
- 주요 화면 확인 상태 Pending 기록
- WebView localStorage 실제 QA Pending 기록
- Android back button 실제 QA Pending 기록
- launcher icon 실제 QA Pending 기록
- splash 실제 QA Pending 기록
- 테스트용 샘플 프로필 입력 Pending 기록
- 실제 이미지 파일 추가 없음 기록
- 실제 Console 입력 없음 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 audit high 2건 유지
- `npm run build`: 성공, 기존 500kB 초과 chunk 경고 유지
- `npm run check:android-device-qa-execution-result`: 성공
- `npm run check:store-screenshot-sample-profile-screen-qa-result`: 성공
- `npm run check:store-screenshot-capture-qa-result`: 성공
- `npm run check:google-play-data-safety-input-readiness`: 성공
- `npm run check:privacy-policy-contact-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:android-debug-build-recovery-result`: 성공
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-17 Store Screenshot Sample Profile Screen QA Result

## 작업 내용

- PR 목적: 테스트용 샘플 프로필 화면 QA 결과 문서 및 검증 스크립트 추가
- `STORE_SCREENSHOT_SAMPLE_PROFILE_SCREEN_QA_RESULT.md` 신규 추가
- `checkStoreScreenshotSampleProfileScreenQaResult` 신규 추가
- 신규 npm script: `check:store-screenshot-sample-profile-screen-qa-result`
- 테스트용 샘플 프로필 실제 입력 상태 Pending 기록
- 주요 화면 확인 상태 Pending 기록
- Android 실제 기기 또는 에뮬레이터 확인 상태 Pending 기록
- 실제 스크린샷 이미지 생성 상태 Pending 기록
- Google Play Console 스크린샷 업로드 Not started 기록
- 저장한 풀이 기능명 유지 기록
- 저장한 운세 이전 명칭 미사용 기록
- 투자하면 성공합니다 금지 문구 기준 기록
- 사자라면 성공합니다 이전 오기 미사용 기록
- 실제 사용자 이름 사용 금지 기록
- 실제 사용자 생년월일 사용 금지 기록
- 참고용 콘텐츠 고지 유지 기록
- 실제 이미지 파일 추가 없음 기록
- 실제 Console 업로드 없음 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:store-screenshot-sample-profile-screen-qa-result`: 성공
- `npm run check:store-screenshot-capture-qa-result`: 성공
- `npm run check:google-play-data-safety-input-readiness`: 성공
- `npm run check:privacy-policy-contact-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:android-debug-build-recovery-result`: 성공
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Store Screenshot Capture QA Result

## 작업 내용

- PR 목적: 스토어 스크린샷 실제 캡처 QA 결과 문서 및 검증 스크립트 추가
- `STORE_SCREENSHOT_CAPTURE_QA_RESULT.md` 신규 추가
- `checkStoreScreenshotCaptureQaResult` 신규 추가
- 신규 npm script: `check:store-screenshot-capture-qa-result`
- 실제 스크린샷 이미지 생성 상태 Pending 기록
- 테스트용 샘플 프로필 실제 입력 상태 Pending 기록
- Android 실제 기기 또는 에뮬레이터 캡처 상태 Pending 기록
- Google Play Console 스크린샷 업로드 Not started 기록
- 저장한 풀이 기능명 유지 기록
- 저장한 운세 이전 명칭 미사용 기록
- 투자하면 성공합니다 금지 문구 기준 기록
- 사자라면 성공합니다 이전 오기 미사용 기록
- 민감정보 점검 기준 기록
- 실제 사용자 개인정보 사용 금지 기록
- 실제 이미지 파일 추가 없음 기록
- 실제 Console 업로드 없음 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:store-screenshot-capture-qa-result`: 성공
- `npm run check:google-play-data-safety-input-readiness`: 성공
- `npm run check:privacy-policy-contact-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:android-debug-build-recovery-result`: 성공
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Google Play Data Safety Input Readiness

## 작업 내용

- PR 목적: Google Play 데이터 보안 양식 입력 준비 문서 및 검증 스크립트 추가
- `GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md` 신규 추가
- `checkGooglePlayDataSafetyInputReadiness` 신규 추가
- 신규 npm script: `check:google-play-data-safety-input-readiness`
- localStorage 중심 저장 상태 기록
- 서버 DB 없음 기록
- 로그인 기능 없음 기록
- 실제 광고 SDK 없음 기록
- 실제 결제 SDK 없음 기록
- 외부 분석 SDK 없음 기록
- 제3자 공유 없음 기록
- 데이터 삭제 방법 기록
- 개인정보 처리방침 URL Pending 기록
- 문의처 Pending 기록
- Google Play Console 데이터 보안 양식 입력 Not started 기록
- 입력 차단 조건 기록
- PrivacyInfoPage 연계 기준 기록
- `public/privacy/index.html` 연계 기준 기록
- 실제 Console 입력 미진행 기록
- 실제 Vercel URL 확인 미진행 기록
- 실제 문의처 확정 미진행 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:google-play-data-safety-input-readiness`: 성공
- `npm run check:privacy-policy-contact-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:android-debug-build-recovery-result`: 성공
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Privacy Policy Contact Readiness

## 작업 내용

- PR 목적: 개인정보 처리방침 문의처 확정 준비 문서 및 검증 스크립트 추가
- `PRIVACY_POLICY_CONTACT_READINESS.md` 신규 추가
- `checkPrivacyPolicyContactReadiness` 신규 추가
- 신규 npm script: `check:privacy-policy-contact-readiness`
- 실제 문의처 상태 Pending 기록
- 임의 이메일 또는 임의 연락처를 작성하지 않는 기준 기록
- 문의처 후보 유형 기록
- Google Play 개발자 계정 지원 이메일 검토 필요성 기록
- 고객 지원 이메일 또는 개인정보 문의 전용 이메일 검토 필요성 기록
- 문의처 확정 전 확인 기준 기록
- 문의처 반영 차단 조건 기록
- `public/privacy/index.html` 실제 문의처 반영 미진행 기록
- PrivacyInfoPage 실제 문의처 반영 미진행 기록
- Google Play Console 입력 미진행 기록
- 실제 Vercel URL 확인 미진행 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:privacy-policy-contact-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:android-debug-build-recovery-result`: 성공
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Privacy Policy Live URL Check Result

## 작업 내용

- PR 목적: Vercel `/privacy/` 실제 접근 확인 결과 기록
- 실제 URL 제공 여부: 미제공
- 실제 URL 확인 상태: Pending
- Pending 유지 또는 Completed 전환 여부: Pending 유지
- Google Play Console 입력은 미진행 유지
- live URL 결과 문서 업데이트
- checkPrivacyPolicyLiveUrlResult Pending/Completed 모드 개선
- public/privacy/index.html 존재 확인
- 하루풀이 브랜드명 유지
- localStorage 안내 유지
- 서버 DB 없음 안내 유지
- 실제 광고 SDK 없음 안내 유지
- 실제 결제 SDK 없음 안내 유지
- 외부 분석 SDK 없음 안내 유지
- 데이터 삭제 방법 유지
- 참고용 콘텐츠 고지 유지
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:android-debug-build-recovery-result`: 성공
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Android Debug Build Recovery Result

## 작업 내용

- PR 목적: Android Debug Build 복구 결과 확정 기록
- PR #100 run #28 failure 기록
- PR #101 run #29 success 기록
- Install dependencies success 기록
- Build web app success 기록
- Sync Android project success 기록
- Build Android debug APK success 기록
- Upload debug APK success 기록
- `harupuli-debug-apk` artifact 재생성 기록
- artifact id 7659463327 기록
- artifact digest `sha256:dfadb247a1f862d2461518f1bc64e83a07b1d486efb0869c435c08b8788c00bd` 기록
- Android 실제 기기 QA는 여전히 Blocked 기록
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 Vercel `/privacy/` URL 확인 미진행
- Google Play Console 입력 미진행
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:android-debug-build-recovery-result`: 성공
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Android Debug Build Install Deps

## 작업 내용

- PR 목적: Android Debug Build Install dependencies 실패 보정
- PR #100 Android Debug Build run #28 failure 기록
- 실패 단계: Install dependencies
- Build web app, Sync Android project, Build Android debug APK, Upload debug APK skipped 기록
- `harupuli-debug-apk` artifact 미생성 기록
- package.json 문법 확인 결과: 정상
- package-lock.json 동기화 확인 결과: 정상
- PR #100 추가 script는 install 단계에서 실행되지 않는 구조임을 확인
- 로컬 작업 폴더 `npm ci`는 Windows node_modules 파일 잠금으로 `EPERM unlink` 발생
- clean temp package check에서 `npm ci` 성공
- package-lock 변경 필요 없음
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm ci` clean temp package check: 성공
- `npm install`: 성공, 기존 high severity audit 경고 2건 및 Windows cleanup EPERM 경고 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Google Play Privacy URL Input Readiness

## 작업 내용

- PR 목적: Google Play Console 개인정보 처리방침 URL 입력 준비 문서 및 검증 스크립트 추가
- `GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md` 신규 추가
- `checkGooglePlayPrivacyUrlInputReadiness` 신규 추가
- 신규 npm script: `check:google-play-privacy-url-input-readiness`
- 예상 URL 형식 `https://<vercel-domain>/privacy/` 기록
- 실제 Vercel URL 미확정 기록
- 실제 URL 확인 상태 Pending 기록
- Google Play Console 입력 상태 Not started 기록
- 입력 전 필수 조건 기록
- 입력 차단 조건 기록
- 데이터 보안 양식 초안과 충돌 여부 확인 기준 기록
- PrivacyInfoPage와 충돌 여부 확인 기준 기록
- 실제 Console 입력 미진행 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:google-play-privacy-url-input-readiness`: 성공
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Privacy Policy Live URL Result

## 작업 내용

- PR 목적: 개인정보 처리방침 live URL 결과 문서 및 검증 스크립트 추가
- `PRIVACY_POLICY_LIVE_URL_RESULT.md` 신규 추가
- `checkPrivacyPolicyLiveUrlResult` 신규 추가
- 신규 npm script: `check:privacy-policy-live-url-result`
- 예상 공개 경로 `/privacy/` 기록
- 예상 URL 형식 `https://<vercel-domain>/privacy/` 기록
- 실제 Vercel URL 미확정 기록
- 실제 URL 확인 상태 Pending 기록
- Google Play Console 입력 미진행 기록
- 하루풀이 브랜드명 확인 기준 기록
- localStorage 안내 확인 기준 기록
- 서버 DB 없음 안내 확인 기준 기록
- 실제 광고 SDK 없음 안내 확인 기준 기록
- 실제 결제 SDK 없음 안내 확인 기준 기록
- 외부 분석 SDK 없음 안내 확인 기준 기록
- 데이터 삭제 방법 확인 기준 기록
- 참고용 콘텐츠 고지 확인 기준 기록
- Completed로 단정하지 않는 검증 추가
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:privacy-policy-live-url-result`: 성공
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Privacy Policy Build Output Verification

## 작업 내용

- PR 목적: 개인정보 처리방침 build output 확인 문서 및 검증 스크립트 추가
- `PRIVACY_POLICY_BUILD_OUTPUT_VERIFICATION.md` 신규 추가
- `checkPrivacyPolicyBuildOutput` 신규 추가
- 신규 npm script: `check:privacy-policy-build-output`
- `public/privacy/index.html` 원본 정적 파일 확인 기준 기록
- `dist/privacy/index.html` build output 확인 기준 기록
- 예상 공개 경로 `/privacy/` 기록
- 실제 Vercel URL 확인 미진행 기록
- Google Play Console 입력 미진행 기록
- 하루풀이 브랜드명 표시 확인 기준 기록
- localStorage 안내 확인 기준 기록
- 서버 DB 없음 안내 확인 기준 기록
- 실제 광고 SDK 없음 안내 확인 기준 기록
- 실제 결제 SDK 없음 안내 확인 기준 기록
- 외부 분석 SDK 없음 안내 확인 기준 기록
- 데이터 삭제 방법 확인 기준 기록
- 참고용 콘텐츠 고지 확인 기준 기록
- 외부 script 없음 확인 기준 기록
- form 없음 확인 기준 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:privacy-policy-build-output`: 성공
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Privacy Policy URL Verification

## 작업 내용

- PR 목적: 공개 개인정보 처리방침 URL 확인 문서 추가
- `PRIVACY_POLICY_URL_VERIFICATION.md` 신규 추가
- `checkPrivacyPolicyUrlVerification` 신규 추가
- 신규 npm script: `check:privacy-policy-url-verification`
- `public/privacy/index.html` 확인 대상 기록
- 예상 경로 `/privacy/` 기록
- 실제 최종 URL 미확정 기록
- Google Play Console 입력 미진행 기록
- HTTPS 접근 필요성 기록
- 로그인 없이 접근 가능해야 함 기록
- 모바일 브라우저 표시 확인 필요성 기록
- 하루풀이 브랜드명 표시 확인 필요성 기록
- localStorage 안내 확인 필요성 기록
- 서버 DB 없음 안내 확인 필요성 기록
- 실제 광고 SDK 없음 안내 확인 필요성 기록
- 실제 결제 SDK 없음 안내 확인 필요성 기록
- 외부 분석 SDK 없음 안내 확인 필요성 기록
- 데이터 삭제 방법 확인 필요성 기록
- 참고용 콘텐츠 고지 확인 필요성 기록
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:privacy-policy-url-verification`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Store Screenshot Sample Copy

## 작업 내용

- PR 목적: 스토어 스크린샷 샘플 문구 정합성 보정
- `STORE_SCREENSHOT_SAMPLE_PROFILE.md` 기능명 `저장한 풀이`로 통일
- 피해야 할 문구 예시를 `투자하면 성공합니다.` 기준으로 보정
- `checkStoreScreenshotSampleProfile` 검증 기준 수정
- 이전 기능명 잔존 여부 검증 추가
- 잘못된 피해야 할 문구 예시 잔존 여부 검증 추가
- 정상 브랜드명 `하루풀이` 유지
- 이전 브랜드 오탈자 미존재 확인
- 실제 스크린샷 이미지 생성 없음
- Google Play Console 입력 없음
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Brand Copy Consistency

## 작업 내용

- PR 목적: 브랜드명 정합성 최종 보정
- 정상 브랜드명은 `하루풀이`
- `public/privacy/index.html`의 서비스명 표기 보정
- `checkPublicPrivacyPolicyPage` 검증 기준을 `하루풀이`로 보정
- 이전 브랜드 오타가 남아 있지 않도록 검증 추가
- `checkBrandCopyConsistency` 신규 추가
- 신규 npm script: `check:brand-copy-consistency`
- 관련 문서의 브랜드명 기준 설명 보정
- `STORE_SCREENSHOT_SAMPLE_PROFILE.md`의 브랜드명과 `저장한 풀이` 표기 확인
- 실제 URL 배포 확인 미진행
- Google Play Console 입력 미진행
- production 코드 로직 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 의존성 변경 없음, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:brand-copy-consistency`: 성공
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-16 Google Play Screenshot Readiness

### 작업 목적
- Google Play 스크린샷 준비 문서 추가
- 스크린샷 후보 화면, 권장 세트, 참고용 콘텐츠 고지 기준, 피해야 할 문구, 개인정보 노출 주의사항 정리

### 작업 내용
- `docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md` 신규 추가
- `scripts/checkGooglePlayScreenshotReadiness.mjs` 신규 추가
- 신규 npm script: `check:google-play-screenshot-readiness`
- 홈 화면, 오늘의 운세 상세, 사주 인사이트, 저장한 풀이, 개인정보 안내, 동의 설정, 방문 streak/루틴 후보 정리
- 최소/확장 권장 스크린샷 세트 정리
- 참고용 콘텐츠 고지 기준 정리
- 피해야 할 문구 정리
- 개인정보 노출 주의사항 정리
- Google Play store listing draft, Google Play data safety draft, Android QA status summary, Android packaging readiness, Capacitor readiness 문서에 스크린샷 준비 문서 경로 반영

### 변경하지 않은 항목
- 실제 스크린샷 이미지 생성 미진행
- 스크린샷 이미지 파일 추가 없음
- Google Play Console 업로드 미진행
- Android 실제 기기 QA Blocked 상태 유지
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- AndroidManifest.xml 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- `@capacitor/app` 추가 없음

### 테스트 결과
- `npm install`: `npm.cmd install` 성공, npm audit high severity 2건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `git diff -- src`: 변경 없음
- `git diff -- android/app/src/main/res android/app/src/main/AndroidManifest.xml android/app/src/main/java android/app/src/main/kotlin`: 변경 없음

## 2026-06-15 Google Play Data Safety Draft

### 작업 목적
- Google Play 데이터 보안 양식 초안 추가
- 현재 MVP의 localStorage 저장 항목, 외부 전송 여부, 제3자 공유 여부, 데이터 삭제 방식 정리

### 작업 내용
- `docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT.md` 신규 추가
- `scripts/checkGooglePlayDataSafetyDraft.mjs` 신규 추가
- 신규 npm script: `check:google-play-data-safety`
- 현재 MVP 구현 상태 정리
- localStorage 저장 항목 정리
- 데이터 유형 후보 매핑 작성
- 제3자 공유 없음 초안 작성
- 서버 전송 없음 초안 작성
- 데이터 삭제 방식 초안 작성
- 개인정보 처리방침 URL과 일치 필요성 기록
- Privacy policy URL readiness, Google Play store listing draft, privacy data map, privacy policy draft, cookie/ad consent UX, Android packaging readiness, Capacitor readiness 문서에 데이터 보안 양식 초안 경로 반영

### 변경하지 않은 항목
- 실제 Google Play Console 데이터 보안 양식 입력 미진행
- 개인정보 처리방침 외부 공개 URL 미배포
- 실제 광고 SDK 미연동
- 실제 결제 SDK 미연동
- 로그인 미구현
- 서버 DB 미연동
- 외부 분석 SDK 미연동
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- AndroidManifest.xml 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- `@capacitor/app` 추가 없음

### 테스트 결과
- `npm install`: `npm.cmd install` 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:google-play-data-safety`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `git diff -- src`: 변경 없음
- `git diff -- android/app/src/main/res android/app/src/main/AndroidManifest.xml android/app/src/main/java android/app/src/main/kotlin`: 변경 없음

## 2026-06-15 Privacy Policy URL Readiness

### 작업 목적
- Google Play 제출 전 개인정보 처리방침 URL 준비 문서 추가
- 현재 MVP의 데이터 저장 방식, localStorage 저장 항목, 외부 전송 여부, 실제 SDK 미연동 상태 정리

### 작업 내용
- `docs/PRIVACY_POLICY_URL_READINESS.md` 신규 추가
- `scripts/checkPrivacyPolicyUrlReadiness.mjs` 신규 추가
- 신규 npm script: `check:privacy-policy-url-readiness`
- 현재 MVP 데이터 저장 방식 정리
- localStorage 저장 항목 정리
- 서버 DB 없음, 로그인 없음, 실제 광고 SDK 없음, 실제 결제 SDK 없음, 외부 분석 SDK 없음 기록
- Vercel, GitHub Pages, 회사 또는 개인 도메인 후보 정리
- PrivacyInfoPage와 외부 개인정보 처리방침 URL 내용 일치 필요성 기록
- Google Play 데이터 보안 양식과 일치 필요성 기록
- Google Play Store listing draft, privacy policy draft, privacy data map, cookie/ad consent UX, Android packaging readiness, Capacitor readiness 문서에 URL 준비 문서 경로 반영

### 변경하지 않은 항목
- 실제 URL 배포 미진행
- Google Play Console 입력 미진행
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- AndroidManifest.xml 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 로그인 기능 추가 없음
- 서버 DB 연결 없음
- `@capacitor/app` 추가 없음
- rewarded ad provider/service/config 변경 없음
- consentPreferencesStorage, savedReadingsStorage, visitStreakStorage, shareTextBuilder 로직 변경 없음

### 테스트 결과
- `npm install`: `npm.cmd install` 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `git diff -- src`: 변경 없음
- `git diff -- android/app/src/main/res android/app/src/main/AndroidManifest.xml android/app/src/main/java android/app/src/main/kotlin`: 변경 없음

## 2026-06-15 Google Play Store Listing Draft

### 작업 목적
- Google Play Store 등록 정보 초안을 문서로 준비
- 앱 이름, 짧은 설명, 긴 설명, 주요 기능, 참고용 고지, 개인정보/localStorage 고지, 광고 포함 여부, 스크린샷 후보, 제출 전 체크리스트 정리

### 작업 내용
- `docs/GOOGLE_PLAY_STORE_LISTING_DRAFT.md` 신규 추가
- `scripts/checkGooglePlayStoreListingDraft.mjs` 신규 추가
- `package.json`에 `check:google-play-store-listing` script 추가
- Android QA, Android packaging, Capacitor readiness 문서에 Google Play 등록 정보 초안 링크 추가
- TODO, DEVELOPMENT_LOG, CHANGELOG 업데이트

### 변경하지 않은 항목
- production `src` 코드 변경 없음
- production 계산 로직 변경 없음
- Android native code/resource 변경 없음
- Android manifest 변경 없음
- launcher icon, round icon, adaptive icon, splash resource 변경 없음
- schemaVersion 변경 없음
- localStorage key 이름 변경 없음
- storage logic 변경 없음
- rewarded ad service/provider/config 변경 없음
- service worker 변경 없음
- iOS 프로젝트 생성 없음
- release build, signing, AAB 생성 없음
- 실제 광고 SDK 또는 결제 SDK 추가 없음
- Google Play 실제 제출 없음

### 테스트 결과
- `npm install`: `npm.cmd install` 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:google-play-store-listing`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-back-button-qa`: 성공
- `npm run check:android-qa-env-setup`: 성공
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-icon-splash-qa`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-resource-build-verification`: 성공
- `npm run check:android-resources`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `git diff -- src`: 변경 없음
- `git diff -- android/app/src/main/res android/app/src/main/AndroidManifest.xml android/app/src/main/java android/app/src/main/kotlin`: 변경 없음

## 2026-06-15 Android QA Status Summary

### 작업 목적
- Android 실제 QA Blocked 현황 통합 관리 문서 추가
- icon/splash, WebView localStorage, back button QA 상태와 공통 차단 원인을 한곳에서 확인하도록 정리

### 작업 내용
- `docs/ANDROID_QA_STATUS_SUMMARY.md` 신규 추가
- `scripts/checkAndroidQaStatusSummary.mjs` 신규 추가
- 신규 npm script: `check:android-qa-status-summary`
- Android Debug Build run #13 success 기준 기록
- `harupuli-debug-apk` artifact 기준 기록
- icon/splash QA 상태: Blocked
- WebView localStorage QA 상태: Blocked
- back button QA 상태: Blocked
- 공통 Blocked 원인: adb 및 실제 기기/에뮬레이터 환경 부족
- QA 환경 준비 문서 연결
- device QA runbook 연결
- 실제 QA 완료 표시 없음

### 변경하지 않은 항목
- Android 리소스 변경 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android back button handler 구현 없음
- `@capacitor/app` 추가 없음
- release build 미진행
- signing 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음

### 테스트 결과
- `npm install`: `npm.cmd install` 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-back-button-qa`: 성공
- `npm run check:android-qa-env-setup`: 성공
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-icon-splash-qa`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-resource-build-verification`: 성공
- `npm run check:android-resources`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `git diff -- src`: 변경 없음
- `git diff -- android/app/src/main/res android/app/src/main/AndroidManifest.xml android/app/src/main/java android/app/src/main/kotlin`: 변경 없음
- `Test-Path ios`: False

## 2026-06-15 Android Back Button QA Result

### 작업 목적
- Android back button 실제 QA 결과 문서 추가
- 실제 기기 또는 에뮬레이터 QA를 수행할 수 없는 상태를 Pass로 기록하지 않고 Blocked로 기록

### 작업 내용
- `docs/ANDROID_BACK_BUTTON_QA_RESULT.md` 신규 작성
- `scripts/checkAndroidBackButtonQaResult.mjs` 신규 추가
- `package.json`에 `check:android-back-button-qa-result` script 추가
- Android QA 관련 문서에 back button QA 결과 문서 링크 추가

### 변경하지 않은 항목
- production `src` 코드 변경 없음
- Android native code/resource 변경 없음
- launcher icon, round icon, adaptive icon, splash resource 변경 없음
- service worker 변경 없음
- rewarded ad 구조 변경 없음
- `@capacitor/app` 추가 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음

### QA 상태
- `adb version`: 실패, 현재 로컬 환경에서 `adb` 명령을 찾을 수 없음
- `adb devices`: 실패, 현재 로컬 환경에서 `adb` 명령을 찾을 수 없음
- Android back button 실제 QA: Blocked

### 테스트 결과
- `npm install`: PowerShell 실행 정책으로 `npm` 별칭은 실패, `npm.cmd install` 성공
- `npm run build`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-back-button-qa`: 성공
- `npm run check:android-qa-env-setup`: 성공
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-icon-splash-qa`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `Test-Path ios`: False
- `git diff -- src`: 변경 없음

### 다음 작업
- Android SDK Platform Tools 설치 또는 adb PATH 설정
- 실제 Android 기기 USB debugging 허용 또는 Android Emulator 실행
- `harupuli-debug-apk` artifact 다운로드 후 실제 back button QA 수행

## 2026-06-14 Android 실제 QA Blocked 해소를 위한 QA 환경 준비 문서 추가

### 작업 내용
- PR 목적: Android 실제 QA Blocked 해소를 위한 QA 환경 준비 문서 추가
- `docs/ANDROID_QA_ENVIRONMENT_SETUP.md` 신규 추가
- `scripts/checkAndroidQaEnvironmentSetupReadiness.mjs` 신규 추가
- 신규 npm script: `check:android-qa-env-setup`
- icon/splash QA 상태 Blocked 유지
- localStorage QA 상태 Blocked 유지
- back button QA 실제 수행 전
- adb 설치/PATH 설정 절차 문서화
- Android Studio 또는 Platform Tools 준비 절차 문서화
- 실제 기기 USB debugging 절차 문서화
- Emulator 준비 절차 문서화
- APK 설치 절차 문서화
- `pm clear` 절차 문서화
- logcat 절차 문서화
- Android 리소스 변경 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android back button 구현 없음
- `@capacitor/app` 추가 없음
- release build 미진행
- signing 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-qa-env-setup`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-icon-splash-qa`: 성공
- `npm run check:android-resource-build-verification`: 성공
- `npm run check:android-resources`: 성공
- `npm run check:android-back-button-qa`: 성공
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-14 Android icon/splash 실제 표시 QA 결과 기록

### 작업 내용
- PR 목적: Android icon/splash 실제 표시 QA 결과 기록
- `docs/ANDROID_ICON_SPLASH_QA_RESULT.md` 신규 추가
- `scripts/checkAndroidIconSplashQaResult.mjs` 신규 추가
- 신규 npm script: `check:android-icon-splash-qa-result`
- 실제 QA 수행 여부: 미수행
- QA 상태: Blocked
- 테스트 기기 또는 에뮬레이터 정보: 미확인
- Android 버전: 미확인
- launcher 종류: 미확인
- workflow run number 10 기준 artifact 확인 필요
- launcher icon 표시 결과: Blocked
- round icon 표시 결과: Blocked
- adaptive icon 표시 결과: Blocked
- Android 12 splash 표시 결과: Blocked
- recent apps/app info icon 표시 결과: Blocked
- 발견 이슈: 현재 기록된 표시 이슈 없음, 실제 QA 미수행으로 검증 전
- Android 리소스 변경 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android back button 구현 없음
- `@capacitor/app` 추가 없음
- release build 미진행
- signing 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음

### 테스트 결과
- `adb version`: 실패, 현재 환경에서 `adb` 명령을 찾을 수 없음
- `adb devices`: 실패, 현재 환경에서 `adb` 명령을 찾을 수 없음
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-icon-splash-qa`: 성공
- `npm run check:android-resource-build-verification`: 성공
- `npm run check:android-resources`: 성공
- `npm run check:android-back-button-qa`: 성공
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-14 Android icon/splash 표시 QA 기준 추가

### 작업 내용
- PR 목적: Android icon/splash 표시 QA 기준 추가
- `docs/ANDROID_ICON_SPLASH_QA.md` 신규 추가
- `scripts/checkAndroidIconSplashQaReadiness.mjs` 신규 추가
- 신규 npm script: `check:android-icon-splash-qa`
- 실제 icon/splash 표시 QA 수행 전
- Android resource files 변경 없음
- Android Debug Build run #9 success 상태 유지
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android back button 구현 없음
- `@capacitor/app` 추가 없음
- release build 미진행
- signing 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-icon-splash-qa`: 성공
- `npm run check:android-resource-build-verification`: 성공
- `npm run check:android-resources`: 성공
- `npm run check:android-back-button-qa`: 성공
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-14 Android 리소스 적용 후 debug build 성공 결과 문서화

### 작업 내용
- PR 목적: Android 리소스 적용 후 debug build 성공 결과 문서화
- `docs/ANDROID_RESOURCE_BUILD_VERIFICATION.md` 신규 추가
- `scripts/checkAndroidResourceBuildVerification.mjs` 신규 추가
- 신규 npm script: `check:android-resource-build-verification`
- PR #80 Android Debug Build run number 8 success 확인
- workflow run id 27488348184 기록
- `harupuli-debug-apk` artifact 생성 확인
- debug APK path `android/app/build/outputs/apk/debug/app-debug.apk` 기록
- Android resource files 변경 없음
- launcher icon 존재 확인
- round icon 존재 확인
- adaptive icon foreground/background 존재 확인
- adaptive icon XML drawable 참조 확인
- splash 후보 PNG 존재 확인
- 실제 device/emulator icon/splash 표시 QA 미진행
- release build 미진행
- signing 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-resource-build-verification`: 성공
- `npm run check:android-resources`: 성공
- `npm run check:android-back-button-qa`: 성공
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-14 Android app icon/splash/adaptive icon 리소스 적용

### 작업 내용
- PR 목적: Android 앱 아이콘, 라운드 아이콘, adaptive icon, splash 후보 PNG를 Android `res` 경로에 적용
- `scripts/applyAndroidResourceAssets.mjs` 신규 추가
- `scripts/checkAndroidResourceAssets.mjs` 신규 추가
- `npm run apply:android-resources` 스크립트 추가
- `npm run check:android-resources` 스크립트 추가
- `public/generated-icons/android`의 기존 PNG를 `mipmap-*` launcher icon과 round icon에 복사
- `public/generated-icons/android-adaptive`의 기존 PNG를 adaptive icon foreground/background에 복사
- `mipmap-anydpi-v26` adaptive icon XML 적용
- `public/generated-splash/android`의 기존 PNG를 `drawable-nodpi` splash 후보 리소스로 복사
- `public/generated-*` 원본 PNG 유지
- production `src` 코드 변경 없음
- 계산 로직 변경 없음
- 라우팅 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- rewarded ad 구조 변경 없음
- 실제 광고 SDK 추가 없음
- iOS 프로젝트 생성 없음
- release build/signing 진행 없음

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run apply:android-resources`: 성공
- `npm run build`: 성공, Vite chunk size warning 보고
- `npx cap sync android`: 성공
- `npm run check:android-resources`: 성공
- `npm run check:android-back-button-qa`: 성공
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-android-adaptive-icons`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-14 Android back button QA 기준 추가

### 작업 내용
- PR 목적: Android back button QA 기준 추가
- `docs/ANDROID_BACK_BUTTON_QA.md` 신규 추가
- `scripts/checkAndroidBackButtonQaReadiness.mjs` 신규 추가
- 신규 npm script: `check:android-back-button-qa`
- 실제 back button QA 수행 전
- `@capacitor/app` 추가 없음
- backButton handler 구현 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android 리소스 수동 적용 없음
- release build 미진행
- signing 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-back-button-qa`: 성공
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-14 Android WebView localStorage QA 재시도 결과 기록

### 작업 내용
- PR 목적: Android WebView localStorage 실제 QA 재시도 결과 기록
- QA 수행 여부: 미수행
- QA 상태: Blocked
- 테스트 기기 또는 에뮬레이터 정보: 현재 Codex 실행 환경에서 접근 불가
- Android 버전: 확인 불가
- workflow run 번호: 미기록, 현재 Codex 세션에서 GitHub Actions run 번호 조회 및 artifact 다운로드를 수행하지 못함
- `harupuli-debug-apk` artifact 기준 확인 여부: 문서상 artifact 이름과 경로 확인, 실제 다운로드/설치 미수행
- `app-debug.apk` 설치 여부: 미설치
- 앱 최초 실행 결과: Blocked
- 앱 재실행 후 localStorage 유지 결과: Blocked
- 앱 데이터 삭제 후 초기화 결과: Blocked
- 재설치/업데이트 시나리오 결과: Blocked
- 발견 이슈 여부: 현재 기록된 앱 이슈 없음, QA 환경 부재만 기록
- production localStorage key 변경 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- Android 리소스 수동 적용 없음
- release build 미진행
- signing 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음

### 테스트 결과
- `adb version`: 실패, `adb` 명령을 찾을 수 없음
- `adb devices`: 실패, `adb` 명령을 찾을 수 없음
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-debug-build-readiness`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-14 Android device/emulator QA runbook 추가

### 작업 내용
- PR 목적: Android WebView localStorage QA Blocked 해소를 위한 device/emulator runbook 추가
- `docs/ANDROID_DEVICE_QA_RUNBOOK.md` 신규 추가
- `scripts/checkAndroidDeviceQaRunbookReadiness.mjs` 신규 추가
- 신규 npm script: `check:android-device-qa-runbook`
- PR #76 QA 상태 Blocked 유지
- 실제 기기 또는 에뮬레이터 준비 필요
- `harupuli-debug-apk` artifact 다운로드 절차 문서화
- `adb devices` 확인 절차 문서화
- `adb install` 절차 문서화
- `pm clear` 절차 문서화
- `logcat` 확인 절차 문서화
- production localStorage key 변경 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- Android 리소스 수동 적용 없음
- release build 미진행
- signing 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-device-qa-runbook`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-debug-build-readiness`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-14 Android WebView localStorage 실제 QA 결과 기록

### 작업 내용
- PR 목적: Android WebView localStorage 실제 QA 결과 기록
- `docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md` 신규 추가
- `scripts/checkAndroidWebViewLocalStorageQaResult.mjs` 신규 추가
- 신규 npm script: `check:android-webview-localstorage-qa-result`
- 실제 QA 수행 여부: 미수행
- QA 상태: Blocked
- 테스트 기기 또는 에뮬레이터 정보: 현재 Codex 실행 환경에서 접근 불가
- Android 버전: 확인 불가
- `harupuli-debug-apk` artifact 기준 확인 여부: 문서상 artifact 이름과 경로 확인, 실제 설치 미수행
- production localStorage key 변경 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- Android 리소스 수동 적용 없음
- release build 미진행
- signing 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-debug-build-readiness`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-android-adaptive-icons`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-14 Android WebView localStorage QA 기준 추가

### 작업 내용
- PR 목적: Android WebView localStorage QA 기준 추가
- `docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA.md` 신규 추가
- `scripts/checkAndroidWebViewLocalStorageQaReadiness.mjs` 신규 추가
- 신규 npm script: `check:android-webview-localstorage-qa`
- GitHub Actions Android Debug Build 성공 확인 반영
- debug APK artifact 생성 확인 반영
- production localStorage key 변경 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- Android 리소스 수동 적용 없음
- release build 미진행
- signing 미진행
- 실제 기기 QA 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-webview-localstorage-qa`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-debug-build-readiness`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-android-adaptive-icons`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-14 GitHub Actions Android Debug Build 실패 보완

### 작업 내용
- PR 목적: GitHub Actions Android Debug Build 실패 보완
- `.github/workflows/android-debug-build.yml` 수정
- Java 환경 확인 step 추가
- `chmod +x android/gradlew` step 추가
- `./gradlew --version` step 추가
- `./gradlew assembleDebug --stacktrace`로 build 명령 보강
- `checkAndroidDebugBuildWorkflow` 검증 기준 보강
- Android 리소스 수동 적용 없음
- release build 미진행
- signing 미진행
- 실제 기기 QA 미진행
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-debug-build-readiness`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-android-adaptive-icons`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- GitHub Actions Android Debug Build 결과는 PR 생성 후 확인 필요

## 2026-06-13 GitHub Actions Android debug build workflow 추가

### 작업 내용
- PR 목적: 로컬 JDK/JAVA_HOME 부재를 보완하기 위한 Android debug build CI workflow 추가
- `.github/workflows/android-debug-build.yml` 신규 추가
- `scripts/checkAndroidDebugBuildWorkflow.mjs` 신규 추가
- 신규 npm script: `check:android-debug-build-workflow`
- GitHub Actions에서 Node 22와 JDK 21을 설정하도록 구성
- CI에서 `npm ci`, `npm run build`, `npx cap sync android`, `./gradlew assembleDebug` 실행
- debug APK artifact 이름: `harupuli-debug-apk`
- debug APK artifact 경로: `android/app/build/outputs/apk/debug/app-debug.apk`
- production `src` 코드 변경 없음
- Android 리소스 수동 교체 없음
- release build 미진행
- signing/keystore 설정 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- storage.js 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공, Vite chunk size warning 보고
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:android-debug-build-readiness`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-android-adaptive-icons`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- GitHub Actions 실제 APK artifact 생성 여부는 PR push 후 확인 필요
- 로컬 Android debug build는 JDK/JAVA_HOME 설정 전까지 계속 제한될 수 있음

## 2026-06-13 JDK/JAVA_HOME 확인 후 Android debug build 재시도

### 작업 내용
- PR 목적: JDK/JAVA_HOME 확인 및 Android debug build 재시도
- `scripts/checkAndroidJavaEnvironment.mjs` 신규 추가
- `scripts/checkAndroidDebugBuildSuccess.mjs` 신규 추가
- 신규 npm script: `check:android-java-env`
- 신규 npm script: `check:android-debug-build-success`
- Java/JDK 환경 확인
- Android debug build 재시도
- APK 생성 경로 후보 확인: `android/app/build/outputs/apk/debug/app-debug.apk`
- build 실패 해결을 위한 Android 설정 수정 없음
- release build 미진행
- signing 미진행
- 실제 기기 QA 미진행
- Android 리소스 수동 적용 없음
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 기존 앱 아이콘 PNG 유지
- 기존 splash PNG 유지
- 기존 Android adaptive icon PNG 유지

### 테스트 결과
- `java -version`: 실패, `spawnSync java ENOENT`
- `javac -version`: 실패, `spawnSync javac ENOENT`
- `JAVA_HOME`: 미설정
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공
- `npx cap sync android`: 성공
- `npm run check:android-java-env`: 실패
- `./gradlew assembleDebug`: 실패
- 실패 원인: `JAVA_HOME` 미설정 및 PATH에서 `java` 명령을 찾을 수 없음
- APK 생성 여부: 미생성
- `npm run check:android-debug-build-success`: 실패
- `npm run check:android-debug-build-readiness`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-android-adaptive-icons`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- release build 미실행 확인
- signing 설정 미추가 확인
- iOS 프로젝트 미생성 확인
- Android 리소스 수동 적용 없음 확인
- service worker 미추가 확인
- 실제 광고 SDK 미추가 확인
- `src` production 코드 변경 없음 확인

## 2026-06-13 Android debug build 확인

### 작업 내용
- PR 목적: Android debug build 확인
- `docs/ANDROID_BUILD_CHECK.md` 신규 추가
- `scripts/checkAndroidDebugBuildReadiness.mjs` 신규 추가
- 신규 npm script: `check:android-debug-build-readiness`
- Android debug build 시도
- APK 생성 경로 후보 확인: `android/app/build/outputs/apk/debug/app-debug.apk`
- release build 미진행
- signing 미진행
- 실제 기기 QA 미진행
- Android 리소스 수동 적용 없음
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 기존 앱 아이콘 PNG 유지
- 기존 splash PNG 유지
- 기존 Android adaptive icon PNG 유지

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공
- `npx cap sync android`: 성공
- `./gradlew assembleDebug`: 실패
- 실패 원인: `JAVA_HOME` 미설정 및 PATH에서 `java` 명령을 찾을 수 없음
- APK 생성 여부: 미생성
- `npm run check:android-debug-build-readiness`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-android-adaptive-icons`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `@capacitor/ios` 미설치 확인
- iOS 프로젝트 미생성 확인
- release build 미실행 확인
- signing 설정 미추가 확인
- service worker 미추가 확인
- 실제 광고 SDK 미추가 확인
- `src` production 코드 변경 없음 확인
- 기존 localStorage key 변경 없음 확인

## 2026-06-13 Android 플랫폼 패키지와 scaffold 추가

### 작업 내용
- PR 목적: Android 플랫폼 패키지 추가 및 Android 프로젝트 생성
- `@capacitor/android` 추가
- Android 프로젝트 생성
- `npx cap sync android` 실행
- `scripts/checkAndroidPlatformScaffold.mjs` 신규 추가
- 신규 npm script: `check:android-platform-scaffold`
- 기존 readiness/check 스크립트에서 Android 플랫폼 및 android 폴더 허용으로 기준 조정
- `@capacitor/ios` 설치 없음
- iOS 프로젝트 생성 없음
- Android native build 없음
- Android 리소스 수동 적용 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 기존 앱 아이콘 PNG 유지
- 기존 splash PNG 유지
- 기존 Android adaptive icon PNG 유지

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공
- `npx cap add android`: 성공
- `npx cap sync android`: 성공
- `npm run check:android-platform-scaffold`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-android-adaptive-icons`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `@capacitor/android` 설치 확인
- `@capacitor/ios` 미설치 확인
- Android 프로젝트 생성 확인
- iOS 프로젝트 미생성 확인
- Android native build 미실행 확인
- service worker 미추가 확인
- 실제 광고 SDK 미추가 확인
- `src` production 코드 변경 없음 확인
- 기존 localStorage key 변경 없음 확인

## 2026-06-13 Capacitor 기본 의존성과 config 추가

### 작업 내용
- PR 목적: Capacitor 기본 의존성과 config 추가
- `@capacitor/core` 추가
- `@capacitor/cli` 추가
- `capacitor.config.json` 신규 추가
- `scripts/checkCapacitorBaseConfig.mjs` 신규 추가
- 신규 npm script: `check:capacitor-base-config`
- 기존 readiness/check 스크립트에서 Capacitor core/cli 허용으로 기준 조정
- `@capacitor/android` 설치 없음
- `@capacitor/ios` 설치 없음
- Android 프로젝트 생성 없음
- iOS 프로젝트 생성 없음
- native build 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 기존 앱 아이콘 PNG 유지
- 기존 splash PNG 유지
- 기존 Android adaptive icon PNG 유지

### 테스트 결과
- `npm install`: 성공, npm audit high severity 3건 보고
- `npm run build`: 성공
- `npm run check:capacitor-base-config`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-android-adaptive-icons`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `@capacitor/android` 미설치 확인
- `@capacitor/ios` 미설치 확인
- Android/iOS 프로젝트 미생성 확인
- service worker 미추가 확인
- 실제 광고 SDK 미추가 확인
- `src` production 코드 변경 없음 확인
- 기존 localStorage key 변경 없음 확인
- 기존 app icon/splash/adaptive PNG 유지 확인

## 2026-06-13 Android adaptive icon foreground/background 실제 생성

### 작업 내용
- PR 목적: Android adaptive icon foreground/background 실제 생성
- `scripts/generateAndroidAdaptiveIcons.mjs` 신규 추가
- `scripts/checkGeneratedAndroidAdaptiveIcons.mjs` 신규 추가
- 신규 npm script: `generate:android-adaptive-icons`
- 신규 npm script: `check:generated-android-adaptive-icons`
- `public/generated-icons/android-adaptive` 아래 foreground/background PNG 생성
- `scripts/checkAndroidAdaptiveIconReadiness.mjs` 수정
- `ANDROID_ADAPTIVE_ICON_READINESS`, `ANDROID_PACKAGING_READINESS`, `APP_ASSET_READINESS`, `APP_ICON_PNG_EXPORT_READINESS`, `CAPACITOR_READINESS` 문서 업데이트
- 기존 앱 아이콘 PNG 유지
- 기존 splash PNG 유지
- Android 프로젝트 생성 없음
- adaptive icon XML 생성 없음
- 이미지 변환 라이브러리 설치 없음
- Capacitor 설치 없음
- Android/iOS 프로젝트 생성 없음
- 네이티브 앱 빌드 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run generate:android-adaptive-icons`: 성공
- `npm run build`: 성공
- `npm run check:generated-android-adaptive-icons`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- foreground PNG 투명 영역 확인
- background PNG opaque 확인
- 기존 앱 아이콘 PNG 유지 확인
- 기존 splash PNG 유지 확인
- 이미지 변환 라이브러리 설치 없음 확인
- Capacitor 설치 없음 확인
- `android/ios` 디렉터리 없음 확인
- `capacitor.config.*` 파일 없음 확인
- adaptive icon XML 생성 없음 확인
- service worker 파일 없음 확인
- `src` production 코드 변경 없음 확인

## 2026-06-13 Android adaptive icon foreground/background 준비

### 작업 내용
- PR 목적: Android adaptive icon foreground/background 준비
- `docs/ANDROID_ADAPTIVE_ICON_READINESS.md` 신규 추가
- `public/brand/android-adaptive-icon-targets.json` 신규 추가
- `scripts/checkAndroidAdaptiveIconReadiness.mjs` 신규 추가
- 신규 npm script: `check:android-adaptive-icon-readiness`
- `ANDROID_PACKAGING_READINESS`, `APP_ASSET_READINESS`, `APP_ICON_PNG_EXPORT_READINESS`, `CAPACITOR_READINESS` 문서 업데이트
- 실제 adaptive icon PNG 파일 생성 없음
- 기존 앱 아이콘 PNG 유지
- 기존 splash PNG 유지
- 이미지 변환 라이브러리 설치 없음
- Capacitor 설치 없음
- Android/iOS 프로젝트 생성 없음
- 네이티브 앱 빌드 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:android-adaptive-icon-readiness`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- adaptive icon PNG 파일 생성 없음 확인
- 기존 앱 아이콘 PNG 유지 확인
- 기존 splash PNG 유지 확인
- 이미지 변환 라이브러리 설치 없음 확인
- Capacitor 설치 없음 확인
- `android/ios` 디렉터리 없음 확인
- `capacitor.config.*` 파일 없음 확인
- service worker 파일 없음 확인
- `src` production 코드 변경 없음 확인

## 2026-06-12 splash PNG 세트 실제 생성

### 작업 내용
- PR 목적: splash PNG 세트 실제 생성
- `scripts/generateSplashPngs.mjs` 신규 추가
- `scripts/checkGeneratedSplashPngs.mjs` 신규 추가
- 신규 npm script: `generate:splash-pngs`
- 신규 npm script: `check:generated-splash-pngs`
- `public/generated-splash` 아래 splash PNG 생성
- `scripts/checkSplashPngExportReadiness.mjs` 수정
- `SPLASH_PNG_EXPORT_READINESS`, `APP_ASSET_READINESS`, `ANDROID_PACKAGING_READINESS`, `CAPACITOR_READINESS` 문서 업데이트
- 앱 아이콘 PNG 기존 파일 유지
- 이미지 변환 라이브러리 설치 없음
- Capacitor 설치 없음
- Android/iOS 프로젝트 생성 없음
- 네이티브 앱 빌드 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run generate:splash-pngs`: 성공
- `npm run build`: 성공
- `npm run check:generated-splash-pngs`: 성공
- `npm run check:splash-png-export`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:app-icon-png-export`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- 앱 아이콘 PNG 기존 파일 유지 확인
- 이미지 변환 라이브러리 설치 없음 확인
- Capacitor 설치 없음 확인
- `android/ios` 디렉터리 없음 확인
- `capacitor.config.*` 파일 없음 확인
- service worker 파일 없음 확인
- `src` production 코드 변경 없음 확인

## 2026-06-12 앱 아이콘 PNG 세트 실제 생성

### 작업 내용
- PR 목적: 앱 아이콘 PNG 세트 실제 생성
- `scripts/generateAppIconPngs.mjs` 신규 추가
- `scripts/checkGeneratedAppIconPngs.mjs` 신규 추가
- 신규 npm script: `generate:app-icons`
- 신규 npm script: `check:generated-app-icons`
- `public/generated-icons` 아래 PNG 아이콘 생성
- `manifest.webmanifest`에 PWA PNG 아이콘 추가
- `scripts/checkAppIconPngExportReadiness.mjs` 수정
- `APP_ICON_PNG_EXPORT_READINESS`, `APP_ASSET_READINESS`, `ANDROID_PACKAGING_READINESS`, `PWA_READINESS` 문서 업데이트
- splash PNG 파일 생성 없음
- 이미지 변환 라이브러리 설치 없음
- Capacitor 설치 없음
- Android/iOS 프로젝트 생성 없음
- 네이티브 앱 빌드 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run generate:app-icons`: 성공
- `npm run build`: 성공
- `npm run check:generated-app-icons`: 성공
- `npm run check:app-icon-png-export`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:splash-png-export`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- splash PNG 파일 생성 없음 확인
- 이미지 변환 라이브러리 설치 없음 확인
- Capacitor 설치 없음 확인
- `android/ios` 디렉터리 없음 확인
- `capacitor.config.*` 파일 없음 확인
- service worker 파일 없음 확인
- `src` production 코드 변경 없음 확인

## 2026-06-12 splash PNG export 준비

### 작업 내용
- PR 목적: splash PNG export 준비
- `docs/SPLASH_PNG_EXPORT_READINESS.md` 신규 추가
- `public/brand/splash-png-targets.json` 신규 추가
- `scripts/checkSplashPngExportReadiness.mjs` 신규 추가
- 신규 npm script: `check:splash-png-export`
- `APP_ASSET_READINESS`, `ANDROID_PACKAGING_READINESS`, `CAPACITOR_READINESS`, `PWA_READINESS` 문서 업데이트
- 실제 splash PNG 파일 생성 없음
- 이미지 변환 라이브러리 설치 없음
- Capacitor 설치 없음
- Android/iOS 프로젝트 생성 없음
- 네이티브 앱 빌드 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:splash-png-export`: 성공
- `npm run check:app-icon-png-export`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- 실제 splash PNG 파일 생성 없음 확인
- 이미지 변환 라이브러리 설치 없음 확인
- Capacitor 설치 없음 확인
- `android/ios` 디렉터리 없음 확인
- `capacitor.config.*` 파일 없음 확인
- service worker 파일 없음 확인
- `src` production 코드 변경 없음 확인

## 2026-06-12 앱 아이콘 PNG export 준비

### 작업 내용
- PR 목적: 앱 아이콘 PNG export 준비
- `docs/APP_ICON_PNG_EXPORT_READINESS.md` 신규 추가
- `public/brand/app-icon-png-targets.json` 신규 추가
- `scripts/checkAppIconPngExportReadiness.mjs` 신규 추가
- 신규 npm script: `check:app-icon-png-export`
- `APP_ASSET_READINESS`, `ANDROID_PACKAGING_READINESS`, `PWA_READINESS` 문서 업데이트
- 실제 PNG 파일 생성 없음
- 이미지 변환 라이브러리 설치 없음
- Capacitor 설치 없음
- Android/iOS 프로젝트 생성 없음
- 네이티브 앱 빌드 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:app-icon-png-export`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- 실제 PNG 파일 생성 없음 확인
- 이미지 변환 라이브러리 설치 없음 확인
- Capacitor 설치 없음 확인
- `android/ios` 디렉터리 없음 확인
- `capacitor.config.*` 파일 없음 확인
- service worker 파일 없음 확인
- `src` production 코드 변경 없음 확인

## 2026-06-12 Android 우선 패키징 준비 문서 추가

### 작업 내용
- PR 목적: Android 우선 패키징 준비 문서 추가
- `docs/ANDROID_PACKAGING_READINESS.md` 신규 추가
- `scripts/checkAndroidPackagingReadiness.mjs` 신규 추가
- 신규 npm script: `check:android-packaging-readiness`
- `CAPACITOR_READINESS`, `APP_PACKAGING_STRATEGY`, `APP_ASSET_READINESS`, `MOBILE_UX_QA` 문서 업데이트
- `PRIVACY_POLICY_DRAFT`, `PRIVACY_DATA_MAP` 문서 업데이트
- Capacitor 설치 없음
- Android 프로젝트 생성 없음
- iOS 프로젝트 생성 없음
- `capacitor.config.*` 파일 생성 없음
- 네이티브 앱 빌드 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `android/ios` 디렉터리 없음 확인
- `capacitor.config.*` 파일 없음 확인
- service worker 파일 없음 확인
- `src`/`public` production 코드 변경 없음 확인

## 2026-06-12 Capacitor 도입 준비 문서 추가

### 작업 내용
- PR 목적: Capacitor 도입 준비 문서 추가
- `docs/CAPACITOR_READINESS.md` 신규 추가
- `scripts/checkCapacitorReadiness.mjs` 신규 추가
- 신규 npm script: `check:capacitor-readiness`
- `APP_PACKAGING_STRATEGY`, `PWA_READINESS`, `APP_ASSET_READINESS`, `MOBILE_UX_QA` 문서 업데이트
- `REWARDED_AD_SDK_INTEGRATION_PLAN`, `PRIVACY_DATA_MAP` 문서 업데이트
- Capacitor 설치 없음
- Android/iOS 프로젝트 생성 없음
- `capacitor.config.*` 파일 생성 없음
- 네이티브 앱 빌드 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `android/ios` 디렉터리 없음 확인
- `capacitor.config.*` 파일 없음 확인
- `src`/`public` production 코드 변경 없음 확인

## 2026-06-12 앱화 방식 결정 문서 추가

### 작업 내용
- PR 목적: 앱화 방식 결정 문서 추가
- `docs/APP_PACKAGING_STRATEGY.md` 신규 추가
- `PWA_READINESS`, `APP_ASSET_READINESS`, `MOBILE_UX_QA` 문서 업데이트
- `REWARDED_AD_SDK_INTEGRATION_PLAN` 문서 업데이트
- Capacitor 설치 없음
- Android/iOS 프로젝트 생성 없음
- 네이티브 앱 패키징 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## 2026-06-12 앱 아이콘/스플래시 리소스 준비

### 작업 내용
- PR 목적: 앱 아이콘/스플래시 리소스 준비
- app icon master SVG 신규 추가
- splash master SVG 신규 추가
- `docs/APP_ASSET_READINESS.md` 신규 추가
- `checkAppAssetReadiness` 신규 추가
- 신규 npm script: `check:app-assets`
- `PWA_READINESS`, `MOBILE_UX_QA` 문서 업데이트
- PNG 아이콘 세트 생성 없음
- Capacitor 설치 없음
- 실제 네이티브 앱 패키징 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음
- 이미지 변환 라이브러리 설치 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:app-assets`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- 로컬 dev 서버 `/`: 200 응답 확인
- 로컬 dev 서버 `/brand/harupuli-app-icon-master.svg`: 200 응답 확인
- 로컬 dev 서버 `/brand/harupuli-splash-master.svg`: 200 응답 확인
- 로컬 dev 서버 `/icons/harupuli-icon.svg`: 200 응답 확인
- 로컬 dev 서버 `/manifest.webmanifest`: 200 응답 확인
- 로컬 dev 서버 `/?debug=manseryeok`: 200 응답 확인

## 2026-06-12 PWA 기본 준비

### 작업 내용
- PR 목적: PWA 기본 준비
- `public/manifest.webmanifest` 신규 추가
- 기본 SVG 아이콘 추가
- maskable SVG 아이콘 추가
- `index.html` manifest/theme-color 연결
- `docs/PWA_READINESS.md` 신규 추가
- `checkPwaManifestReadiness` 신규 추가
- 신규 npm script: `check:pwa-readiness`
- service worker 구현 없음
- Capacitor 설치 없음
- 실제 네이티브 앱 패키징 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad provider/service 로직 변경 없음
- consent storage 로직 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:pwa-readiness`: 성공
- `npm run check:rewarded-ad-placement-readiness`: 성공
- `npm run check:rewarded-ad-consent-gate`: 성공
- `npm run check:consent-storage`: 성공
- `npm run check:consent-banner-state`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- 로컬 dev 서버 `/`: 200 응답 확인
- 로컬 dev 서버 `/manifest.webmanifest`: 200 응답 확인
- 로컬 dev 서버 `/icons/harupuli-icon.svg`: 200 응답 확인
- 로컬 dev 서버 `/icons/harupuli-maskable-icon.svg`: 200 응답 확인
- 로컬 dev 서버 `/?debug=manseryeok`: 200 응답 확인

## 2026-06-12 앱 패키징 전 모바일 UX QA 보정

### 작업 내용
- PR 목적: 앱 패키징 전 모바일 UX QA 및 레이아웃 보정
- `docs/MOBILE_UX_QA.md` 신규 추가
- 하단 네비게이션, 동의 배너, 설정 패널, 광고 모달, 저장한 풀이, 개인정보 안내 페이지 모바일 보정
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad provider/service 로직 변경 없음
- consent storage 로직 변경 없음
- 저장/공유/streak 기능 동작 변경 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-placement-readiness`: 성공
- `npm run check:rewarded-ad-consent-gate`: 성공
- `npm run check:rewarded-ad-sdk-adapter`: 성공
- `npm run check:consent-storage`: 성공
- `npm run check:consent-banner-state`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- `npm run check:visit-streak`: 성공
- 로컬 dev 서버 `/`: 200 응답 확인
- 로컬 dev 서버 `/?debug=manseryeok`: 200 응답 확인
- 모바일 폭별 시각 QA는 `docs/MOBILE_UX_QA.md` 기준으로 브라우저 DevTools에서 추가 확인 필요

## 2026-06-12 rewarded ad placement readiness 검증 추가

### 작업 내용
- PR 목적: rewarded ad placement readiness 검증 추가
- `docs/REWARDED_AD_PLACEMENT_READINESS.md` 신규 추가
- `checkRewardedAdPlacementReadiness` 신규 추가
- 신규 npm script: `check:rewarded-ad-placement-readiness`
- `REWARDED_AD_SDK_INTEGRATION_PLAN`, `REWARDED_AD_SDK_READINESS`, `COOKIE_AD_CONSENT_UX` 문서 업데이트
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음
- 실제 광고 네트워크 호출 없음
- 실제 provider placement ID 하드코딩 없음
- rewarded ad provider 코드 변경 없음
- consent storage 기존 동작 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-placement-readiness`: 성공
- `npm run check:rewarded-ad-placement-resolver`: 성공
- `npm run check:rewarded-ad-sdk-adapter`: 성공
- `npm run check:rewarded-ad-consent-gate`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:consent-storage`: 성공
- `npm run check:consent-banner-state`: 성공
- 로컬 dev 서버 `/`: 200 응답 확인
- 로컬 dev 서버 `/?debug=manseryeok`: 200 응답 확인

## 2026-06-12 consent ads 상태와 rewarded ad 호출 조건 연결

### 작업 내용
- PR 목적: consent ads 상태와 rewarded ad 호출 조건 연결
- `ads_consent_required` outcome 추가
- `rewardedAdProvider.loader`에 ads consent gate 추가
- `RewardAdModal`에 consentPreferences 전달 추가
- `ads_consent_required` 상태에서 데이터 사용 설정 버튼 추가
- FortuneDetailPage / SajuInsightPage에 consentPreferences 전달 추가
- 신규 npm script: `check:rewarded-ad-consent-gate`
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음
- 실제 광고 네트워크 호출 없음
- mock provider 기본 동작 유지
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 저장/공유/streak 기능 동작 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-consent-gate`: 성공
- `npm run check:rewarded-ad-sdk-adapter`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:rewarded-ad-outcomes`: 성공
- `npm run check:consent-storage`: 성공
- `npm run check:consent-banner-state`: 성공
- 로컬 dev 서버 `/`: 200 응답 확인
- 로컬 dev 서버 `/?debug=manseryeok`: 200 응답 확인

## 2026-06-12 rewarded ad SDK provider adapter scaffold 추가

### 작업 내용
- PR 목적: rewarded ad SDK provider adapter scaffold 추가
- `rewardedAdSdkConfig` 신규 추가
- `rewardedAdProvider.sdk` 신규 추가
- `rewardedAdProvider.loader` 신규 추가
- `rewardedAdService` provider loader 연결
- `sdk_unavailable` outcome/message 추가
- 신규 npm script: `check:rewarded-ad-sdk-adapter`
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음
- 실제 광고 네트워크 호출 없음
- 기본 provider는 mock 유지
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- consent storage 기존 동작 변경 없음
- 저장/공유/streak 기능 동작 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-sdk-adapter`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:rewarded-ad-outcomes`: 성공
- `npm run check:rewarded-ad-placements`: 성공
- `npm run check:consent-storage`: 성공
- `npm run check:consent-banner-state`: 성공
- 로컬 dev 서버 `/`: 200 응답 확인
- 로컬 dev 서버 `/?debug=manseryeok`: 200 응답 확인

## 2026-06-12 실제 rewarded ad SDK 연동 전 검토 문서 추가

### 작업 내용
- PR 목적: 실제 rewarded ad SDK 연동 전 검토 문서 추가
- `docs/REWARDED_AD_SDK_INTEGRATION_PLAN.md` 신규 추가
- `docs/REWARDED_AD_SDK_READINESS.md`, `docs/COOKIE_AD_CONSENT_UX.md`, `docs/CONSENT_BANNER_UI_PLAN.md`, `docs/PRIVACY_DATA_MAP.md` 문서 업데이트
- production 코드 변경 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음
- rewarded ad provider 코드 변경 없음
- consent storage 코드 변경 없음
- 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 저장/공유/streak 기능 동작 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:consent-storage`: 성공
- `npm run check:consent-banner-state`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- `npm run check:visit-streak`: 성공

## 2026-06-12 동의 배너 UI 실제 구현

### 작업 내용
- PR 목적: 동의 배너 UI 실제 구현
- `ConsentBanner` 신규 추가
- `ConsentSettingsPanel` 신규 추가
- App.jsx에 consent preferences 상태 연결
- SettingsPage에 데이터 사용 설정 버튼 추가
- PrivacyInfoPage에 동의 상태 표시 추가
- 신규 npm script: `check:consent-banner-state`
- consent localStorage key: `harupuli_consent_preferences_v1`
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad 구조 변경 없음
- 저장/공유/streak 기능 동작 변경 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:consent-storage`: 성공
- `npm run check:consent-banner-state`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- `npm run check:visit-streak`: 성공
- 로컬 dev 서버 `/`: 200 응답 확인
- 로컬 dev 서버 `/?debug=manseryeok`: 200 응답 확인

## 2026-06-12 consent preferences 저장 유틸 추가

### 작업 내용
- PR 목적: consent preferences 저장 유틸 추가
- `consentPreferencesStorage` 신규 추가
- 신규 localStorage key: `harupuli_consent_preferences_v1`
- `checkConsentPreferencesStorageRegression` 신규 추가
- 신규 npm script: `check:consent-storage`
- `CONSENT_BANNER_UI_PLAN`, `COOKIE_AD_CONSENT_UX`, `PRIVACY_DATA_MAP`, `PRIVACY_POLICY_DRAFT` 문서 업데이트
- production UI 변경 없음
- 실제 동의 배너 UI 구현 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 기존 localStorage key 값 변경 없음
- rewarded ad 구조 변경 없음
- 저장/공유/streak 기능 동작 변경 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:consent-storage`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- `npm run check:visit-streak`: 성공
- 로컬 dev 서버 `/`: 200 응답 확인
- 로컬 dev 서버 `/?debug=manseryeok`: 200 응답 확인

## 2026-06-12 동의 배너 UI 구현 전 설계 문서 추가

### 작업 내용
- PR 목적: 동의 배너 UI 구현 전 설계 문서 추가
- `docs/CONSENT_BANNER_UI_PLAN.md` 신규 추가
- `docs/COOKIE_AD_CONSENT_UX.md`에 동의 배너 UI 계획 문서 링크 추가
- `docs/PRIVACY_POLICY_DRAFT.md`에 동의 배너 UI 계획 섹션 추가
- `docs/PRIVACY_DATA_MAP.md` consent preferences 비고 보완
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- consent localStorage key 실제 구현 없음
- rewarded ad 구조 변경 없음
- 저장/공유/streak 기능 동작 변경 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- `npm run check:visit-streak`: 성공

## 2026-06-10 앱 안 개인정보 안내 페이지 추가

### 작업 내용
- PR 목적: 개인정보 안내 앱 안 페이지 추가
- `PrivacyInfoPage` 신규 추가
- `PrivacyInfoLinkCard` 신규 추가
- HomePage에서 개인정보 안내 페이지 진입 추가
- SettingsPage에서 개인정보 안내 페이지 진입 추가
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- consent localStorage key 실제 구현 없음
- rewarded ad 구조 변경 없음
- 저장/공유/streak 기능 동작 변경 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- `npm run check:visit-streak`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 쿠키/광고 동의 UX 검토 문서 추가

### 작업 내용
- PR 목적: 쿠키/광고 동의 UX 검토 문서 추가
- `docs/COOKIE_AD_CONSENT_UX.md` 신규 추가
- `docs/PRIVACY_POLICY_DRAFT.md`에 쿠키 및 동의 UX 검토 항목 추가
- `docs/PRIVACY_DATA_MAP.md`에 consent preferences 후보 항목 추가
- `docs/REWARDED_AD_SDK_READINESS.md`에 쿠키/광고 동의 UX 연계 내용 추가
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 실제 consent localStorage key 구현 없음
- rewarded ad 구조 변경 없음
- 저장/공유/streak 기능 동작 변경 없음
- 실제 광고 SDK 추가 없음
- 외부 광고/분석 라이브러리 설치 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- `npm run check:visit-streak`: 성공

## 2026-06-10 개인정보 처리방침 초안 문서 추가

### 작업 내용
- PR 목적: 개인정보 처리방침 초안 문서 추가
- `docs/PRIVACY_POLICY_DRAFT.md` 신규 추가
- `docs/PRIVACY_DATA_MAP.md` 신규 추가
- SAVED_READINGS / VISIT_STREAK / REWARDED_AD_SDK_READINESS 문서에 개인정보 관련 원칙 추가
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad 구조 변경 없음
- 저장/공유/streak 기능 동작 변경 없음
- 실제 광고 SDK 추가 없음
- 외부 광고 라이브러리 설치 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- `npm run check:visit-streak`: 성공

## 2026-06-10 위험 표현 검증 스크립트 추가

### 작업 내용
- PR 목적: 위험 표현 검증 스크립트 추가
- 신규 스크립트: `scripts/checkContentSafetyCopyRegression.mjs`
- 신규 npm script: `check:content-safety`
- `docs/CONTENT_SAFETY.md` 자동 검증 항목 추가
- production UI 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad 구조 변경 없음
- 저장/공유 기능 동작 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공
- `npm run check:saved-readings`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 운세 콘텐츠 안전 문구 통합

### 작업 내용
- PR 목적: 운세 콘텐츠 안전 문구 통합
- `contentSafetyCopy` 신규 추가
- `ContentSafetyNotice` 신규 추가
- HomePage에 참고용 해석 안내 추가
- FortuneDetailPage에 오늘운세 참고 안내 추가
- SajuInsightPage에 사주 흐름 참고 안내 추가
- SavedReadingsPage에 저장한 풀이 참고 안내 추가
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad 구조 변경 없음
- 저장/공유 기능 동작 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 공유용 텍스트 복사 기능 추가

### 작업 내용
- PR 목적: 공유용 텍스트 복사 기능 추가
- `shareTextBuilder` 신규 추가
- `CopyShareButton` 신규 추가
- FortuneDetailPage에 오늘운세 공유 복사 추가
- SajuInsightPage에 사주 흐름 공유 복사 추가
- SavedReadingsPage에 저장한 풀이 공유 복사 추가
- profile 원본 정보 공유 없음
- locked 상세 전문 공유 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- rewarded ad 구조 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:share-text`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 풀이 저장 기능 추가

### 작업 내용
- PR 목적: 풀이 저장 기능 추가
- `savedReadingsStorage` 신규 추가
- `SaveReadingButton` 신규 추가
- `SavedReadingsSummaryCard` 신규 추가
- `SavedReadingsPage` 신규 추가
- HomePage에 저장한 풀이 카드 표시
- FortuneDetailPage에 풀이 저장 버튼 추가
- SajuInsightPage에 사주 흐름 저장 버튼 추가
- 신규 localStorage key: `harupuli_saved_readings_v1`
- 기존 localStorage key 변경 없음
- profile 원본 정보 저장 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- expected/referenceStatus 변경 없음
- rewarded ad 구조 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:saved-readings`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 연속 방문 streak 기능 추가

### 작업 내용
- PR 목적: 연속 방문 streak 기능 추가
- `visitStreakStorage` 신규 추가
- `VisitStreakCard` 신규 추가
- App에서 오늘 방문 기록
- HomePage에 streak 카드 표시
- 신규 localStorage key: `harupuli_visit_streak_v1`
- 기존 localStorage key 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- expected/referenceStatus 변경 없음
- rewarded ad 구조 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:visit-streak`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 홈 오늘의 루틴 카드 추가

### 작업 내용
- PR 목적: 홈 화면 오늘의 루틴 카드 추가
- `DailyRoutineCard` 컴포넌트 신규 추가
- HomePage에 오늘의 루틴 카드 표시
- 기존 sajuAnalysis 데이터만 사용
- production 계산 로직 변경 없음
- sajuAnalysis 데이터 구조 변경 없음
- schemaVersion 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- rewarded ad 구조 변경 없음
- storage.js 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 무료/광고 해금 콘텐츠 안내 추가

### 작업 내용
- PR 목적: 무료/광고 해금 콘텐츠 구분 안내 추가
- `ContentAccessNotice` 컴포넌트 신규 추가
- SajuInsightPage에 무료 기본 해석 안내 추가
- SajuInsightPage에 광고 해금 심화 해석 안내 추가
- FortuneDetailPage에 광고 해금 상세 풀이 안내 추가
- 기존 unlock key 유지
- 기존 placementId 유지
- rewarded ad 구조 변경 없음
- storage.js 변경 없음
- 계산 로직 변경 없음
- sajuAnalysis 데이터 구조 변경 없음
- schemaVersion 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 사주 상세 콘텐츠 품질 개선

### 작업 내용
- PR 목적: 사주 상세 페이지 콘텐츠 품질 개선
- SajuInsightPage에 생활 흐름 가이드 섹션 추가
- 관계 흐름, 일/공부 흐름, 돈 관리 흐름, 오늘의 루틴 카드 추가
- 기존 sajuAnalysis 데이터만 사용
- production 계산 로직 변경 없음
- sajuAnalysis 데이터 구조 변경 없음
- schemaVersion 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- rewarded ad 구조 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 로컬 dev 서버 `http://127.0.0.1:5174`: 200 응답 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 rewarded ad SDK readiness 체크리스트 추가

### 작업 내용
- PR 목적: rewarded ad SDK 연동 전 체크리스트 문서 추가
- 신규 문서: `docs/REWARDED_AD_SDK_READINESS.md`
- 실제 광고 SDK 연동 없음
- 외부 광고 라이브러리 설치 없음
- production 코드 변경 없음
- storage.js 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-provider-adapter`: 성공

## 2026-06-10 rewarded ad provider adapter 구조 추가

### 작업 내용
- PR 목적: rewarded ad provider adapter 구조 추가
- mock provider를 `rewardedAdProvider.mock.js`로 분리
- provider/outcome 상수를 `rewardedAdProvider.types.js`로 분리
- `rewardedAdService.js`는 facade 역할로 정리
- 실제 광고 SDK 연동 없음
- 외부 광고 라이브러리 설치 없음
- storage.js 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- 신규 npm script: `check:rewarded-ad-provider-adapter`

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-provider-adapter`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:rewarded-ad-outcomes`: 성공
- `npm run check:rewarded-ad-placements`: 성공
- `npm run check:rewarded-ad-placement-resolver`: 성공
- `npm run check:saju-insight-reward-unlock`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 rewarded ad placement resolver 추가

### 작업 내용
- PR 목적: 환경변수 기반 rewarded ad placement resolver 추가
- `rewardedAdPlacements.js`에 resolver 추가
- `.env.example`에 rewarded ad placement 환경변수 추가
- 실제 광고 SDK 연동 없음
- 외부 광고 라이브러리 설치 없음
- storage.js 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- 신규 npm script: `check:rewarded-ad-placement-resolver`

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-placements`: 성공
- `npm run check:rewarded-ad-placement-resolver`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:rewarded-ad-outcomes`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 rewarded ad placement 설정 구조 추가

### 작업 내용
- PR 목적: rewarded ad placement 설정 구조 추가
- `rewardedAdPlacements.js` 신규 추가
- `AdRewardBox`에 `placementId` prop 추가
- `RewardAdModal`이 `placementId`를 `showRewardedAd`로 전달하도록 보완
- FortuneDetailPage에 `today_fortune_detail` placement 적용
- SajuInsightPage에 `saju_insight_deep_dive` placement 적용
- unlock key와 placementId는 분리 유지
- 실제 광고 SDK 연동 없음
- storage.js 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- 신규 npm script: `check:rewarded-ad-placements`

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-placements`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:rewarded-ad-outcomes`: 성공
- `npm run check:saju-insight-reward-unlock`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-10 rewarded ad outcome 상태 처리 추가

### 작업 내용
- PR 목적: rewarded ad outcome 상태 처리 추가
- `rewardedAdService`에 `completed`, `load_failed`, `canceled`, `no_reward` 상태 추가
- `RewardAdModal`이 광고 결과 상태별 안내 문구를 표시하도록 보완
- 기본 mock provider 결과는 기존처럼 `completed` 유지
- mock 광고 카운트다운 이후 보상 확인 단계는 `delayMs: 0`으로 처리해 중복 대기 시간 제거
- 실제 광고 SDK 연동 없음
- storage.js production 로직 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- 신규 npm script: `check:rewarded-ad-outcomes`

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:rewarded-ad-outcomes`: 성공
- `npm run check:saju-insight-reward-unlock`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 rewarded ad service abstraction 추가

### 작업 내용
- PR 목적: rewarded ad service abstraction 추가
- `rewardedAdService` 신규 추가
- `RewardAdModal`이 mock provider service를 사용하도록 수정
- 실제 광고 SDK 연동 없음
- storage.js production 로직 변경 없음
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음
- 신규 npm script: `check:rewarded-ad-service`

### 테스트 결과
- `npm run build`: 성공
- `npm run check:rewarded-ad-service`: 성공
- `npm run check:saju-insight-reward-unlock`: 성공
- `npm run check:late-night-jasi-policy`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 사주 심화 해석 광고 해금 회귀 검증 추가

### 작업 내용
- PR 목적: 사주 심화 해석 광고 해금 상태 회귀 검증 스크립트 추가
- 신규 스크립트: `scripts/checkSajuInsightRewardUnlockRegression.mjs`
- 신규 npm script: `check:saju-insight-reward-unlock`
- production UI 변경 없음
- production 계산 로직 변경 없음
- storage.js production 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:saju-insight-reward-unlock`: 성공
- `npm run check:late-night-jasi-policy`: 성공
- `npm run check:manseryeok-jasi-boundary`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 사주 흐름 심화 해석 광고 해금 추가

### 작업 내용
- PR 목적: 사주 흐름 상세 페이지에 광고 해금 심화 해석 영역 추가
- `SajuInsightPage`에 rewarded unlock key `sajuInsightDeepDive` 추가
- App.jsx에서 `unlockedDetails`와 `onUnlockDetail` 전달
- 기존 storage/saveRewardUnlock 구조 재사용
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- schemaVersion 변경 없음

### 테스트 결과
- `npm run build`: 성공
- SajuInsightPage 잠금/해금 상태 수동 확인 필요
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 사주 흐름 상세 페이지 추가

### 작업 내용
- PR 목적: 사주 흐름 상세 페이지 추가
- `SajuInsightPage` 신규 추가
- `SajuElementSummaryCard`에 상세 페이지 진입 버튼 추가
- HomePage에서 `sajuInsight` 페이지 이동 연결
- App.jsx는 `SajuInsightPage` 라우팅만 추가
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 일반 `/` 접속 후 홈 카드 버튼 및 상세 페이지 표시: 수동 확인 필요
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 홈 화면 사주 오행 요약 카드 추가

### 작업 내용
- PR 목적: 홈 화면 사주 오행 요약 카드 추가
- `SajuElementSummaryCard` 신규 추가
- HomePage에 `fortune.sajuAnalysis` 기반 카드 배치
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 일반 `/` 접속 후 홈 카드 표시: 수동 확인 필요
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 사주 계산 기준 요약 카드 추가

### 작업 내용
- PR 목적: 설정 화면에 사주 계산 기준 요약 카드 추가
- `SajuCalculationBasisCard` 신규 추가
- SettingsPage에 `SajuCalculationBasisCard` 배치
- App.jsx는 SettingsPage로 `fortune` prop 전달만 추가
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- `same_day` / `next_day` 프로필에서 계산 기준 일시 표시 확인 필요

### 테스트 결과
- `npm run build`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지
- 브라우저 SettingsPage 카드 표시: 수동 확인 필요

## 2026-06-09 lateNightJasiPolicy 회귀 검증 스크립트 추가

### 작업 내용
- PR 목적: `lateNightJasiPolicy` 동작 검증 스크립트 추가
- `scripts/checkLateNightJasiPolicyRegression.mjs` 신규 추가
- `npm run check:late-night-jasi-policy` script 추가
- production 계산 로직 변경 없음
- UI 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:late-night-jasi-policy`: 성공
- `npm run check:manseryeok-jasi-boundary`: 성공
- same_day / next_day convertedSolar 차이 확인:
  - `same_day`: `1990-02-03 23:30:00`
  - `next_day`: `1990-02-04 00:30:00`
- profileId 차이 확인:
  - `same_day`: `c9xk6d`
  - `next_day`: `b3kv9b`
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 23시 이후 자시 기준 선택 옵션 추가

### 작업 내용
- PR 목적: 23:00~23:59 출생자의 자시 기준 선택 옵션 추가
- `ProfileForm`에 `lateNightJasiPolicy` 필드를 추가하고 기본값을 `same_day`로 설정
- 23:00~23:59 입력 시 `입력한 날짜 기준` / `다음 날 자시 기준` 선택 UI 표시
- `SettingsPage`에서 저장된 23시 이후 기준 표시
- `next_day` 선택 시 production 만세력 엔진이 23시 이후 출생 시간을 다음 날 00:분 기준으로 계산
- `same_day` 기본값에서는 기존 계산 흐름 유지
- expected/referenceStatus 변경 없음
- localStorage key 이름 변경 없음
- App.jsx 변경 없음
- fortune schemaVersion을 4에서 5로 증가

### 테스트 결과
- `npm run build`: 성공
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지
  - `solar_after_ipchun`: pass 유지
  - `solar_regular_known_time`: pass 유지
- 엔진 샘플 확인:
  - `same_day`: `1990-02-03 23:30:00`
  - `next_day`: `1990-02-04 00:30:00`
  - `same_day`와 `next_day`의 profileId가 다르게 생성됨
- 브라우저 온보딩/설정 UI: 수동 확인 필요

## 2026-06-09 23시 이후 출생 안내 UI 추가

### 작업 내용
- PR 목적: 23시 이후 출생 시간 안내 UI 추가
- `ProfileForm`에서 23:00~23:59 입력 시 안내 표시
- `SettingsPage`는 시간 입력 UI가 아니라 저장된 프로필 시간이 23시대일 때 안내 표시
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- 일반 `/` 접속 테스트: 브라우저 수동 확인 필요
- 내부 validator 기준:
  - `solar_before_ipchun`: reference_conflict 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 자시 후보와 외부 기준 비교 추가

### 작업 내용
- PR 목적: 자시 경계 후보와 외부 기준값 비교
- `scripts/checkManseryeokJasiBoundaryHypothesis.mjs`에 sky.told.me / posteller 기준값 비교 출력 추가
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:manseryeok-jasi-boundary`: 성공
- 1990-02-03 23:30 비교 결과:
  - sky.told.me는 nextDayCandidate/midnightReference와 일치
  - posteller는 현재 후보 중 완전 일치 없음
  - 세 번째 기준 확인 필요

## 2026-06-09 자시 경계 기준 조사 스크립트 추가

### 작업 내용
- PR 목적: 23시 이후 자시/야자시/조자시 기준 조사
- `scripts/checkManseryeokJasiBoundaryHypothesis.mjs` 신규 추가
- `npm run check:manseryeok-jasi-boundary` 스크립트 추가
- `docs/MANSERYEOK_JASI_POLICY.md` 신규 추가
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:manseryeok-jasi-boundary`: 성공
- `solar_after_23` 1990-02-03 23:30:
  - original/sameDayJasi: 기사 / 정축 / 기해 / 병자
  - nextDayCandidate/midnightReference: 기사 / 정축 / 경자 / 병자
- 내부 validator 기준:
  - `solar_before_ipchun`: referenceStatus `reference_conflict`, comparisonStatus `reference_conflict`, expected null 유지
  - `solar_ipchun_boundary`: pass 유지

## 2026-06-09 만세력 검증 도구 한글 라벨 복구

### 작업 내용
- PR 목적: 만세력 검증 도구 한글 라벨 복구
- PR #21의 `reference_conflict` 표시 기능은 유지
- 상태, 요약, 입력, expected 안내 문구를 한국어 기준으로 정리
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `/?debug=manseryeok` 한글 라벨은 코드 기준으로 제목/요약/입력/expected 안내 문구 반영 확인
- 내부 validator 기준:
  - `solar_before_ipchun`: referenceStatus `reference_conflict`, comparisonStatus `reference_conflict`, expected null 유지
  - `solar_ipchun_boundary`: pass 유지, mismatchFields 없음

## 2026-06-09 reference_conflict 검증 표시 개선

### 작업 내용
- PR 목적: `reference_conflict` 샘플의 내부 검증 표시 개선
- `expected`가 null인 `reference_conflict` 샘플을 `reference_pending` 대신 `reference_conflict`로 표시
- `solar_before_ipchun`의 `comparisonStatus`가 `reference_conflict`로 표시되도록 개선
- debug 페이지 요약에 conflict 건수 추가
- 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `/?debug=manseryeok` 내부 validator 기준 확인:
  - `solar_before_ipchun`: referenceStatus `reference_conflict`, comparisonStatus `reference_conflict`, expected null 유지
  - `solar_ipchun_boundary`: pass 유지, mismatchFields 없음
  - `solar_after_ipchun`: pass 유지, mismatchFields 없음
  - `solar_regular_known_time`: pass 유지, mismatchFields 없음

## 2026-06-09 KST/CST 절기 보정 production 반영

### 작업 내용
- PR 목적: KST→CST 절기 경계 보정 production 반영
- PR #19 검증 결과를 바탕으로 년주/월주 exact 계산에 1시간 보정 적용
- 수정 파일: `src/domain/saju/manseryeokEngine.js`, `src/utils/fortuneEngine.js`, 문서 파일
- 일주/시주 변경 없음
- expected/referenceStatus 변경 없음
- localStorage key 변경 없음
- schemaVersion 3 → 4 증가
- App.jsx 변경 없음
- 태양시 보정 미적용
- 23시 이후 자시 정책 미변경

### 테스트 결과
- `npm run build`: 성공
- `npm run check:manseryeok-term-timezone`: 성공
- `/?debug=manseryeok` 내부 validator 기준 확인:
  - `solar_ipchun_boundary`: pass, mismatchFields 없음
  - `solar_after_ipchun`: pass 유지, mismatchFields 없음
  - `solar_regular_known_time`: pass 유지, mismatchFields 없음
  - `solar_before_ipchun`: reference_conflict 유지, expected null 유지

## 2026-06-09 KST/CST 절기 경계 보정 가설 검증

### 작업 내용
- PR 목적: KST→CST 절기 경계 보정 가설 검증
- `scripts/checkManseryeokTermTimezoneHypothesis.mjs` 신규 추가
- `npm run check:manseryeok-term-timezone` 스크립트 추가
- production 계산 로직 변경 없음
- expected/referenceStatus 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음

### 테스트 결과
- `npm run build`: 성공
- `npm run check:manseryeok-term-timezone`: 성공
- `solar_ipchun_boundary`: KST→CST 보정 후 `기사 / 정축`, hypothesisResult `pass`
- `solar_after_ipchun`: KST→CST 보정 후 `경오 / 무인`, hypothesisResult `pass`
- `solar_regular_known_time`: KST→CST 보정 후 `경오 / 신사`, hypothesisResult `pass`

### 검증 포인트
- `solar_ipchun_boundary`의 1시간 보정 결과가 `기사 / 정축`이 되는지 확인
- `solar_after_ipchun`의 1시간 보정 결과가 `경오 / 무인`으로 유지되는지 확인
- `solar_regular_known_time`이 불필요하게 달라지지 않는지 확인

## 2026-06-09 입춘 절입 시각 조사 문서 추가

### 작업 내용
- PR 목적: `solar_ipchun_boundary` 입춘 절입 시각 조사 문서 추가
- PR #17 결과: `lunar-javascript` exact API 적용 후에도 `pillars.year`, `pillars.month` mismatch 유지
- `docs/MANSERYEOK_IPCHUN_INVESTIGATION.md` 신규 추가
- 입춘 절입 시각 확인 전에는 수동 보정이나 하드코딩을 하지 않는다는 원칙 기록

### 변경하지 않은 항목
- 계산 로직 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음
- expected/referenceStatus 변경 없음

### 다음 작업
- 1990년 입춘 절입 시각 한국 표준시 기준 확인
- sky.told.me와 포스텔러의 태양시 보정 여부 확인
- 세 번째 한국 만세력 기준으로 1990-02-04 10:30 추가 확인

### 테스트 결과
- `npm run build`: 성공
- 참고: Vite chunk size warning은 표시되었으나 빌드는 정상 완료

## 2026-06-09 만세력 입춘 경계 년주/월주 검토

### 작업 내용
- `solar_ipchun_boundary`의 년주/월주 mismatch 원인을 확인했다.
- `lunar-javascript`의 `getYearInGanZhiExact()`와 `getMonthInGanZhiExact()` 계열 API를 우선 사용하는 helper를 엔진에 분리했다.
- exact API 호출 실패 시 기존 `EightChar` 계산값으로 fallback하도록 정리했다.
- `solar_ipchun_boundary`는 exact API에서도 `경오년 무인월`로 계산되어 외부 기준값 `기사년 정축월`과 여전히 불일치한다.
- 샘플별 하드코딩, 수동 절기 테이블, 태양시 보정은 적용하지 않았다.
- 23시 이후 자시/야자시/조자시 정책은 변경하지 않았다.
- localStorage key 변경 없음.
- App.jsx 변경 없음.
- schemaVersion 변경 없음: 실제 pillar 결과가 변경되지 않았고, 캐시 무효화가 필요한 계산 결과 변경은 발생하지 않았다.

### 수정 파일
- `src/domain/saju/manseryeokEngine.js`
- `docs/MANSERYEOK_ENGINE.md`
- `docs/MANSERYEOK_TIME_POLICY.md`
- `CHANGELOG.md`
- `TODO.md`

### 테스트 결과
- `npm run build`: 성공
- `solar_ipchun_boundary`: fail, mismatchFields `pillars.year`, `pillars.month`
- `solar_after_ipchun`: pass 유지, mismatchFields 없음
- `solar_before_ipchun`: `reference_conflict` 유지, expected null 유지
- `solar_regular_known_time`: pass 유지, mismatchFields 없음

### 남은 이슈
- `lunar-javascript` exact API와 sky.told.me / 포스텔러 외부 기준값이 다른 입춘 당일 경계 정책 결정 필요.
- 태양시 보정 적용 여부는 별도 PR에서 검토 필요.
- 23시 이후 자시/야자시/조자시 기준은 별도 정책 결정 필요.

## 현재 상태

- 배포 방식: GitHub 저장소와 Vercel 연동 구조 사용
- 주요 기능: 프로필 입력, 오늘운세, 띠별 운세, 2026운세, 광고 보상 시뮬레이션, AI 상담 화면, 궁합 입력, 더 깊은 풀이 기능 준비 중 화면, 마이 화면
- 현재 브랜치: `docs/manseryeok-time-policy`
- 최근 수정 내용: 계산 엔진 수정 전 시간/입춘/자시/태양시 정책 문서화

## 현재 이슈

- [ ] 확인 필요: Vercel Production URL
- [ ] 확인 필요: Vercel Preview 배포 설정
- [ ] 확인 필요: 모바일 실기기 화면 테스트 결과
- [ ] 확인 필요: 2026운세 광고 해금 개수가 과하게 느껴지지 않는지
- [ ] 확인 필요: 홈 도넛 그래프와 2026 월별 물결 그래프의 모바일 가독성
- [ ] 확인 필요: 학업운 문구가 학생/성인 학습 모두에 자연스럽게 적용되는지
- [ ] 확인 필요: 기존 사용자의 당일 캐시에서 학업운 누락 시 새 운세가 정상 생성되는지
- [ ] 확인 필요: 외부 만세력 기준 샘플과 `lunar-javascript` 계산 결과 비교
- [ ] 확인 필요: 음력/윤달 입력 샘플 검증
- [ ] 확인 필요: Vercel Preview에서 `/?debug=manseryeok` 접근 가능 여부
- [ ] 확인 필요: 외부 만세력 기준값 1차 입력 후 pass/fail 결과
- [ ] 확인 필요: `solar_regular_known_time` 샘플의 출생도시 Seoul, South Korea 및 태양시 보정 여부
- [ ] 확인 필요: `solar_before_ipchun` 기준 충돌 원인
- [ ] 확인 필요: 시간 경계 정책 확정 전 사용자 표시 문구

## 다음 작업

- [ ] 우선순위 1: Vercel Preview에서 띠별 아코디언과 2026 광고 해금 흐름 확인
- [ ] 우선순위 2: 월별 상세 흐름 모바일 스크롤감 확인
- [ ] 우선순위 3: 띠별운세 연도별 문구 반복감 점검
- [ ] 우선순위 4: 광고 해금 포인트가 과하지 않은지 실사용 흐름 점검
- [ ] 우선순위 5: 월별 곡선 그래프 가로 스크롤 UX 확인
- [ ] 우선순위 6: 오늘운세 카테고리 추가 시 캐시 버전 관리 방식 검토
- [ ] 우선순위 7: 만세력 기준 샘플 검증표 작성
- [ ] 우선순위 8: 외부 기준값을 검증 샘플 expected에 입력
- [ ] 우선순위 9: 입춘 전후/23시 전후 샘플 기준값 우선 확인
- [ ] 우선순위 10: `solar_regular_known_time`을 두 번째 외부 만세력 기준으로 교차검증
- [ ] 우선순위 11: `solar_before_ipchun`을 세 번째 기준 만세력으로 추가 확인
- [ ] 우선순위 12: 입춘 경계 엔진 보정 방식 검토

## ChatGPT 검토 요청 포인트

- 기존 기능 삭제 여부
- JS 오류 가능성
- 모바일 반응형 문제
- Vercel 배포 위험
- API / DB / 환경변수 문제
- 띠별 연도 아코디언 UX가 사용하기 쉬운지
- 2026운세 카테고리별/월별 광고 해금이 과하지 않은지
- 홈 도넛 그래프와 2026 월별 물결 그래프가 모바일에서 자연스럽게 읽히는지
- 학업운 카테고리 추가로 오늘운세 탭/홈 요약/광고 해금 흐름이 깨지지 않았는지
- study 없는 기존 오늘운세 캐시가 삭제 없이 재생성되는지
- 만세력 엔진 실패 시 mock fallback으로 앱이 깨지지 않는지
- schemaVersion 도입으로 기존 mock 캐시가 새 fortune으로 갱신되는지
- 내부 debug 페이지가 일반 사용자 메뉴에 노출되지 않는지
- expected가 없는 샘플이 reference_pending으로 표시되는지
- not_applicable 샘플이 calculation_failed와 구분되어 표시되는지

## 작업 로그

### 2026-06-08

#### 작업 내용

- PR 목적: 계산 엔진 수정 전 시간/절기/자시/태양시 정책 문서화
- PR #15 검증 결과를 바탕으로 `docs/MANSERYEOK_TIME_POLICY.md` 작성
- `solar_ipchun_boundary`를 입춘/절기 기준 엔진 보정 우선 후보로 문서화
- `solar_before_ipchun`을 reference_conflict 샘플로 문서화하고 expected를 null로 유지해야 한다는 원칙 정리
- 23시 이후 자시/야자시/조자시 기준과 태양시 보정 여부를 미정 정책으로 명시
- 시간 미상은 시주 미상으로 유지한다는 원칙 정리
- `docs/MANSERYEOK_ENGINE.md`와 `docs/MANSERYEOK_VALIDATION.md`에 시간 정책 문서 참조 추가
- 계산 로직 변경 없음
- localStorage 변경 없음
- schemaVersion 변경 없음
- App.jsx 변경 없음
- 다음 작업은 입춘 경계 엔진 보정 검토

#### 수정 파일

- `docs/MANSERYEOK_TIME_POLICY.md`
- `docs/MANSERYEOK_ENGINE.md`
- `docs/MANSERYEOK_VALIDATION.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함으로 JS chunk가 500kB를 초과함

#### 남은 이슈

- `solar_ipchun_boundary` 년주/월주 mismatch 원인 분석 필요
- 23시 이후 자시/야자시/조자시 정책 결정 필요
- 태양시 보정 적용 여부 결정 필요

### 2026-06-08

#### 작업 내용

- sky.told.me와 포스텔러의 입춘 전후 샘플 비교 결과 반영
- `solar_before_ipchun`은 두 기준이 불일치해 `reference_conflict`로 분류하고 expected 미입력
- `solar_before_ipchun` 충돌 내용 기록: sky.told.me 기사년 정축월 경자일 병자시, 포스텔러 기사년 정축월 기해일 을해시
- `solar_ipchun_boundary`는 두 기준이 기사년 정축월 경자일 신사시로 일치해 `reference_verified` expected 입력
- `solar_after_ipchun`은 두 기준이 경오년 무인월 신축일 무자시로 일치해 `reference_verified` expected 입력
- convertedLunar는 외부 결과에서 명확히 확인되지 않아 입력하지 않음
- 대운, 신살, 자미두수, Natal Chart 값은 검증 범위에서 제외
- localStorage key 구조 변경 없음
- fortune schemaVersion 변경 없음
- 만세력 계산 로직 변경 없음

#### 수정 파일

- `src/domain/saju/manseryeokValidationSamples.js`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함으로 JS chunk가 500kB를 초과함
- `solar_before_ipchun`: referenceStatus `reference_conflict`, expected 미입력
- `solar_ipchun_boundary`: comparisonStatus `fail`, mismatchFields `pillars.year`, `pillars.month`
- `solar_after_ipchun`: comparisonStatus `pass`, mismatchFields 없음

#### 남은 이슈

- 23시 이후 자시/야자시/조자시 기준 정책 결정 필요
- 태양시 보정 여부 확인 필요
- `solar_before_ipchun`을 세 번째 기준 만세력으로 추가 확인 필요

### 2026-06-08

#### 작업 내용

- sky.told.me에서 수동 확인한 `solar_regular_known_time` 사주팔자 기준값 1차 입력
- profile gender를 sky.told.me 입력 기준에 맞춰 `male`로 변경
- expected에는 년주, 월주, 일주, 시주, 일간, convertedSolar만 입력
- convertedLunar는 외부 결과에서 명확히 확인되지 않아 입력하지 않음
- referenceSource에 `sky.told.me`, 수동 확인일, 출생도시 Seoul, South Korea 입력 기준을 기록
- 대운, 신살, 자미두수, Natal Chart 값은 검증 범위에서 제외
- 만세력 계산 로직 변경 없음
- localStorage key 구조 변경 없음
- fortune schemaVersion 변경 없음

#### 수정 파일

- `src/domain/saju/manseryeokValidationSamples.js`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함으로 JS chunk가 500kB를 초과함
- validator 실행 결과: `solar_regular_known_time` comparisonStatus `pass`
- mismatchFields 없음

#### 남은 이슈

- 같은 샘플을 두 번째 외부 만세력 기준으로 교차검증 필요
- 출생도시 입력값 재확인 필요
- 태양시 보정 여부 확인 필요

### 2026-06-08

#### 작업 내용

- 만세력 검증 샘플의 expected/referenceSource 권장 구조를 문서화
- referenceStatus 허용값을 `reference_pending`, `reference_verified`, `reference_conflict`, `not_applicable`로 정리
- 입춘 전 샘플 `solar_before_ipchun` 추가
- 입춘 후 샘플 `solar_after_ipchun` 추가
- 23시 직전 샘플 `solar_before_23` 추가
- 기존 23시 이후 샘플은 유지
- 잘못된 시간/날짜 입력 샘플은 referenceStatus를 `not_applicable`로 변경
- validator summary에 `notApplicable` 카운트 추가
- debug 페이지에 referenceStatus와 referenceSource 표시 추가
- expected 값은 외부 기준값 없이 임의 입력하지 않음
- localStorage key 구조 변경 없음
- fortune schemaVersion 변경 없음
- 만세력 계산 로직 `calculateManseryeok` 변경 없음

#### 수정 파일

- `src/domain/saju/manseryeokValidationSamples.js`
- `src/domain/saju/manseryeokValidator.js`
- `src/pages/ManseryeokValidationPage.jsx`
- `docs/MANSERYEOK_VALIDATION.md`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함으로 JS chunk가 500kB를 초과함
- validator 실행 결과: 전체 11개, 기준값 대기 9개, 비교 대상 아님 2개

#### 남은 이슈

- 실제 외부 만세력 기준값 1차 입력 필요
- 입춘 전후 기준값 확인 필요
- 23시 전후 기준값 확인 필요
- 음력/윤달 기준값 확인 필요

### 2026-06-08

#### 작업 내용

- 만세력 검증 샘플 데이터 구조 추가
- 양력 일반, 시간 미상, 23시 이후, 입춘 전후, 음력 일반, 음력 윤달 후보, 잘못된 시간, 잘못된 날짜 샘플 추가
- `calculateManseryeok` 결과를 샘플별로 수집하는 validator 추가
- expected가 없는 샘플은 `reference_pending`으로 표시하도록 구성
- 계산 실패 샘플은 전체 검증을 중단하지 않고 `calculation_failed` 결과로 표시
- `/?debug=manseryeok` 전용 내부 검증 페이지 추가
- 일반 하단 네비게이션에는 검증 페이지를 노출하지 않음
- debug 페이지에서는 `saveFortune`, `saveProfile`, `saveRewardUnlock`을 호출하지 않음
- localStorage key 구조 변경 없음
- schemaVersion 값 변경 없음

#### 수정 파일

- `src/domain/saju/manseryeokValidationSamples.js`
- `src/domain/saju/manseryeokValidator.js`
- `src/pages/ManseryeokValidationPage.jsx`
- `docs/MANSERYEOK_VALIDATION.md`
- `src/App.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함으로 JS chunk가 500kB를 초과함
- validator 실행 결과: 전체 8개, 기준값 대기 6개, 계산 실패 2개

#### 남은 이슈

- 외부 만세력 기준값 입력 필요
- Vercel Preview에서 `/?debug=manseryeok` 접근 확인 필요
- 브라우저에서 잘못된 날짜/시간 샘플의 `calculation_failed` 표시 확인 필요

### 2026-06-08

#### 작업 내용

- `lunar-javascript` 패키지 설치 및 실제 `Solar`, `Lunar`, `EightChar` API 확인
- 만세력 기반 년주, 월주, 일주, 시주 계산 adapter 추가
- 한자 천간/지지를 한글 천간/지지로 변환하는 사주 상수 추가
- 천간/지지 겉오행 기준 오행 분포 분석기 추가
- `createSajuAnalysis`가 만세력 계산 성공 시 실제 사주팔자/오행 분석 기반 결과를 반환하도록 연결
- 시간 미상 사용자는 내부 계산에 12:00을 사용하되 결과의 시주는 `시주 미상`으로 처리
- 음력/윤달 입력은 `lunar-javascript` 지원 범위에서 처리하고 실패 시 mock fallback 유지
- fortune `schemaVersion` 도입 및 App 캐시 유효성 검사에 schemaVersion 확인 추가
- localStorage key 구조 변경 없음
- 기존 캐시 데이터 일괄 삭제 없음
- 대운, 신강신약, 용신, 세운, 월운 고도화 구현 없음

#### 외부 라이브러리

- `lunar-javascript@1.7.7`
- 사용 이유: 양력/음력 변환과 EightChar 기반 사주팔자 계산을 직접 임의 구현하지 않기 위함
- 정확도 상태: 외부 만세력 기준 샘플 검증 필요

#### 수정 파일

- `src/domain/saju/sajuConstants.js`
- `src/domain/saju/manseryeokEngine.js`
- `src/domain/saju/elementAnalyzer.js`
- `src/domain/saju/createSajuAnalysis.js`
- `src/utils/fortuneEngine.js`
- `src/App.jsx`
- `docs/MANSERYEOK_ENGINE.md`
- `package.json`
- `package-lock.json`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함 후 JS chunk가 500kB를 초과함
- 양력 샘플에서 `engineStatus: manseryeok_core_v0` 확인
- `birthTimeUnknown=true` 샘플에서 시주가 `시주 미상`으로 처리되는지 확인
- 지원되지 않는 음력 윤달 샘플에서 mock fallback 확인
- 새 fortune에 `schemaVersion: 3` 포함 확인

#### 남은 이슈

- 외부 만세력 기준 샘플 비교 필요
- 절기 경계 출생자 검증 필요
- 23시 이후 자시 기준 정책 검토 필요
- 음력/윤달 입력 샘플 추가 검증 필요

### 2026-06-08

#### 작업 내용

- 오늘운세 캐시 유효성 검사에 필수 카테고리 목록 확인 추가
- `study` 카테고리가 없는 기존 당일 캐시는 유효하지 않은 것으로 판단해 `createTodayFortune`으로 새 운세 생성
- 새로 생성된 운세는 기존 `saveFortune` 흐름으로 덮어쓰기
- localStorage key 구조 변경 없음
- 기존 캐시 데이터 일괄 삭제 없음
- 광고 해금 저장 구조 변경 없음

#### 수정 파일

- `src/App.jsx`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 study 없는 기존 캐시를 넣은 뒤 새 운세가 생성되는지 확인 필요
- 브라우저에서 study 포함 캐시가 같은 날짜/같은 프로필에서 재사용되는지 확인 필요

### 2026-06-08

#### 작업 내용

- 2026 월별운세흐름 그래프를 넓은 SVG와 cubic bezier 곡선형 path로 개선
- 모바일에서 월별 점수와 라벨이 겹치지 않도록 가로 스크롤 구조 적용
- 광고 mock 해금 시간을 개발/테스트용으로 2초로 단축
- 오늘운세 카테고리에 학업운 추가
- 학업운 상세풀이 템플릿에 공부, 시험 준비, 자격증, 업무 학습, 자료 이해, 메모/복습 조언 반영
- 학업운 문구 기준을 콘텐츠 스타일 가이드에 추가
- localStorage key 구조 변경 없음
- 실제 광고 SDK, AI API, DB, 결제 연동 없음

#### 수정 파일

- `src/components/MonthlyWaveChart.jsx`
- `src/components/RewardAdModal.jsx`
- `src/data/fortuneTemplates.js`
- `src/pages/HomePage.jsx`
- `src/styles.css`
- `docs/CONTENT_STYLE_GUIDE.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 월별 곡선 그래프의 가로 스크롤 UX 확인 필요
- 브라우저에서 광고 mock 모달이 약 2초 후 완료되는지 확인 필요
- 브라우저에서 학업운 탭/요약/상세 광고 해금 흐름 확인 필요

### 2026-06-08

#### 작업 내용

- 홈 화면 오늘의 점수를 SVG 도넛 그래프로 시각화
- 띠별운세 연도별 아코디언에서 오늘의 조언을 광고 mock 모달 해금 후 표시하도록 변경
- 띠별운세의 키워드/색상/아이템 표시 제거
- 2026운세 재물운, 연애운, 직장운, 건강운 카테고리의 광고 박스 상시 노출을 제거하고 상세보기 클릭형 광고 UX로 변경
- 2026 월별 상세 흐름 해금 후 1월~12월 점수 물결 그래프 표시
- localStorage key 구조 변경 없음
- 실제 광고 SDK, AI API, DB, 결제 연동 없음

#### 수정 파일

- `src/components/ScoreDonut.jsx`
- `src/components/MonthlyWaveChart.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/ZodiacFortunePage.jsx`
- `src/pages/YearFortunePage.jsx`
- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 홈 도넛 그래프 중앙 점수와 `fortune.averageScore` 일치 여부 확인 필요
- 브라우저에서 띠별운세 오늘의 조언 광고 해금 흐름 확인 필요
- 브라우저에서 2026 상세보기 클릭형 광고 UX와 월별 물결 그래프 확인 필요

### 2026-06-08

#### 작업 내용

- 띠별 운세 화면을 연도 select 중심에서 12지 선택/연도별 아코디언 구조로 개선
- 선택한 띠에 해당하는 1948~2019년 사이 연도만 표시
- 여러 연도 아코디언을 동시에 열 수 있도록 구성
- 2026운세 재물운, 연애운, 직장운, 건강운에 광고 해금 상세 풀이 추가
- 2026 월별 상세 흐름을 광고 1회로 전체 해금하는 구조 추가
- localStorage key 구조 변경 없음
- 실제 광고 SDK, AI API, DB, 결제 연동 없음

#### 수정 파일

- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/pages/ZodiacFortunePage.jsx`
- `src/data/yearFortuneTemplates.js`
- `src/domain/fortune/yearFortuneEngine.js`
- `src/pages/YearFortunePage.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- 1948년 쥐띠, 2019년 돼지띠 기준 확인
- 토끼띠 연도 목록이 1951, 1963, 1975, 1987, 1999, 2011년으로 표시되는지 데이터 확인
- 2026 카테고리별 detail과 월별 detail 생성 확인

#### 남은 이슈

- 브라우저에서 토끼띠 연도 목록과 여러 아코디언 동시 열림 확인 필요
- 2026 카테고리별/월별 광고 해금 UX 확인 필요

### 2026-06-08

#### 작업 내용

- 하단 네비게이션에 띠별 운세 탭 추가
- 띠별 운세 페이지 추가
- 1948~2019년생 띠별 운세 선택 기능 추가
- 홈 화면을 오늘운세 요약 중심으로 재구성
- 홈 화면에서 2026 추천 영역 제거
- 2026운세는 하단 탭에서 접근하도록 정리
- 기능 저장 구조/localStorage key 변경 없음

#### 수정 파일

- `src/App.jsx`
- `src/components/BottomNav.jsx`
- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/pages/ZodiacFortunePage.jsx`
- `src/pages/HomePage.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 모바일에서 6개 하단 탭 간격 확인 필요

### 2026-06-01

#### 작업 내용

- 광고 해금 상세풀이 길이와 구조 개선
- 카테고리별 상세풀이 템플릿 확장
- `category.detail` 표시 방식을 문단 단위로 개선
- 기능 로직/저장 구조 변경 없음
- localStorage key 구조 변경 없음
- 광고 해금 흐름 변경 없음

#### 수정 파일

- `src/data/fortuneTemplates.js`
- `src/utils/fortuneEngine.js`
- `src/pages/FortuneDetailPage.jsx`
- `docs/CONTENT_STYLE_GUIDE.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 광고 해금 후 상세풀이 문단 표시 확인 필요
# 2026-06-16 Public Privacy Policy Brand Copy

## 작업 내용

- PR 목적: 공개 개인정보 처리방침 페이지 브랜드명 오타 정정
- `public/privacy/index.html` 내 `하루풀이` 표기 확인
- 이전 브랜드 오타 문자열이 남아 있지 않도록 검증 추가
- `checkPublicPrivacyPolicyPage` 검증 기준을 `하루풀이` 기준으로 보강
- 개인정보 처리방침 URL 준비 문서에 브랜드명 정합성 기록
- Google Play Store listing draft에 공개 개인정보 처리방침 페이지 서비스명 일치 필요성 기록
- 실제 URL 배포 확인 미진행
- Google Play Console 입력 미진행
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 의존성 변경 없음, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Public Privacy Policy Page

## 작업 내용

- PR 목적: 공개 개인정보 처리방침 페이지 scaffold 추가
- `public/privacy/index.html` 신규 추가
- `checkPublicPrivacyPolicyPage` 신규 추가
- 신규 npm script: `check:public-privacy-policy-page`
- 공개 페이지 예상 경로 `/privacy/` 기록
- localStorage 저장 항목 공개 페이지에 반영
- 서버 DB 없음 기록
- 로그인 없음 기록
- 실제 광고 SDK 없음 기록
- 실제 결제 SDK 없음 기록
- 외부 분석 SDK 없음 기록
- 데이터 삭제 방법 기록
- 참고용 콘텐츠 고지 기록
- 문의처 미확정 상태 기록
- 실제 URL 배포 확인 미진행
- Google Play Console 입력 미진행
- `STORE_SCREENSHOT_SAMPLE_PROFILE.md` 표기 상태 확인
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 의존성 변경 없음, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:public-privacy-policy-page`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

# 2026-06-16 Store Screenshot Sample Profile

## 작업 내용

- PR 목적: 스토어 스크린샷용 테스트 샘플 프로필 기준 추가
- `STORE_SCREENSHOT_SAMPLE_PROFILE.md` 신규 추가
- `checkStoreScreenshotSampleProfile` 신규 추가
- 신규 npm script: `check:store-screenshot-sample-profile`
- 대표 샘플 프로필 기준 작성
- 대체 샘플 프로필 기준 작성
- 화면별 노출 가능/노출 금지 항목 정리
- 샘플 운세 문구 기준 정리
- 피해야 할 문구 정리
- 개인정보 안내 화면 촬영 기준 정리
- 저장한 풀이 화면 촬영 기준 정리
- 실제 스크린샷 이미지 생성 미진행
- 테스트용 샘플 프로필을 앱에 내장하지 않음
- Google Play Console 업로드 미진행
- Android 실제 기기 QA Blocked 상태 유지
- production 코드 변경 없음
- production 계산 로직 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- Android resource/native 변경 없음
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- iOS 프로젝트 생성 없음
- service worker 구현 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- `@capacitor/app` 추가 없음

## 테스트 결과

- `npm install`: 성공, 의존성 변경 없음, 기존 high severity audit 경고 2건 표시
- `npm run build`: 성공, 기존 500 kB chunk size 경고 표시
- `npm run check:store-screenshot-sample-profile`: 성공
- `npm run check:google-play-screenshot-readiness`: 성공
- `npm run check:google-play-data-safety`: 성공
- `npm run check:privacy-policy-url-readiness`: 성공
- `npm run check:google-play-store-listing`: 성공
- `npm run check:android-qa-status-summary`: 성공
- `npm run check:android-back-button-qa-result`: 성공
- `npm run check:android-icon-splash-qa-result`: 성공
- `npm run check:android-webview-localstorage-qa-result`: 성공
- `npm run check:android-debug-build-workflow`: 성공
- `npm run check:capacitor-readiness`: 성공
- `npm run check:android-packaging-readiness`: 성공
- `npm run check:content-safety`: 성공
- `npm run check:share-text`: 성공

## Zodiac Year Variation After Baseline

- Regenerated zodiac year variation baseline after PR #272 wording variation
- Recorded same-animal birth-year wording variation after production improvement
- Production fortune logic unchanged in this PR
- Zodiac generation logic unchanged in this PR
- src production UI unchanged
- Generated production JSON unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- UI/routing unchanged
- privacy files unchanged
- Android/Gradle unchanged
- Total exactDuplicatePairs: 13 -> 0
- Total repeatedSnippetExamples: 13 -> 0
- Rabbit exactDuplicatePairs: 1 -> 0
- Dragon exactDuplicatePairs: 0 -> 0

## Zodiac Year Variation Baseline

- Added a baseline check for same-animal birth-year fortune variation
- Captured current duplicate/similarity status before production wording changes
- Production fortune logic unchanged
- Zodiac generation logic unchanged
- Generated production JSON unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- UI/routing unchanged
- privacy files unchanged
- Android/Gradle unchanged
