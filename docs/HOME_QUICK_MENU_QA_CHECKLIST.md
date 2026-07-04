# Home Quick Menu QA Checklist

## Scope

- Review target: home quick menu customization after PR #279
- Storage key: `harupuli_home_quick_menu_prefs`
- This document is a QA checklist only
- This document does not confirm actual Android device QA
- This document does not confirm APK download, APK install, or app launch
- This document does not change production logic

## Status Summary

| Item | Status | Note |
|---|---|---|
| Quick menu customization UI | Ready for QA | implemented before/through PR #279 |
| Quick menu storage key | Documented | `harupuli_home_quick_menu_prefs` |
| Maximum 4 menu selection | Ready for QA | must be checked manually |
| Minimum 1 menu retained | Ready for QA | must be checked manually |
| localStorage restore after reload | Ready for QA | must be checked manually |
| Invalid saved value fallback | Ready for QA | must be checked manually |
| Android device QA | Pending | not completed in this PR |
| APK download | Pending | not completed in this PR |
| APK install | Pending | not completed in this PR |
| App launch test | Pending | not completed in this PR |
| Google Play Console input | Pending | not completed in this PR |
| release build | Pending | not completed in this PR |
| signing setup | Pending | not completed in this PR |
| AAB generation | Pending | not completed in this PR |

## Manual QA Checklist

- [ ] Open home screen
- [ ] Tap quick menu edit button
- [ ] Confirm quick menu editor opens
- [ ] Select up to 4 menu items
- [ ] Confirm a 5th item cannot be selected or shows a clear limit message
- [ ] Confirm at least 1 item remains selected
- [ ] Save or close editor
- [ ] Confirm selected items appear on home quick menu
- [ ] Confirm home quick menu remains one row with 4 columns
- [ ] Reload the app
- [ ] Confirm selected quick menu items are restored from localStorage
- [ ] Manually corrupt `harupuli_home_quick_menu_prefs`
- [ ] Reload the app
- [ ] Confirm fallback to default quick menu
- [ ] Confirm existing profile/fortune data is not changed
- [ ] Confirm no route is broken
- [ ] Confirm privacy/Android/Gradle behavior is unchanged

## Storage Contract

- Storage key: `harupuli_home_quick_menu_prefs`
- Stored value shape: JSON array of quick menu ids
- Maximum length: 4
- Minimum effective length: 1
- Invalid ids should be ignored
- Invalid JSON should fallback to default quick menu
- This storage is independent from profile/fortune storage
- No schemaVersion migration is required

## Guardrails

- production fortune logic unchanged
- zodiac fortune engine unchanged
- generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- existing localStorage keys unchanged
- no new localStorage key added in this PR
- routing unchanged
- privacy files unchanged
- Android/Gradle unchanged
