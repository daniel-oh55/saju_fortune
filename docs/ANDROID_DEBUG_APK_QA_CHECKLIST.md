# Android Debug APK QA Checklist

## Scope

- Review target: Android Debug APK manual QA preparation
- Build type: debug APK artifact from GitHub Actions
- This document is a QA checklist only
- This document references completed APK download, install, and launch confirmation from the QA result
- This document records Android device QA as completed with follow-up issues
- This document does not confirm Google Play Console input
- This document does not confirm release build
- This document does not confirm signing setup
- This document does not confirm AAB generation
- This document does not change production logic

## Status Summary

| Item | Status | Note |
|---|---|---|
| Android Debug Build workflow | Ready for QA | GitHub Actions creates debug APK artifact |
| Debug APK artifact | Ready for QA | download required before manual test |
| APK download | Completed | artifact was downloaded manually |
| APK install | Completed | debug APK was installed on Android device |
| App launch test | Completed | app launched successfully |
| Android device QA | Completed with follow-up issues | no blocking launch issue observed, but improvements remain |
| Home screen QA | Completed with follow-up issues | improvement items recorded in QA result |
| Today flow QA | Pending | not completed in this PR |
| Zodiac fortune QA | Completed with follow-up issues | layout improvement remains |
| My info QA | Completed with follow-up issues | birth region data improvement remains |
| Quick menu customization QA | Completed with follow-up issues | scroll position improvement remains |
| Google Play Console input | Pending | not completed in this PR |
| release build | Pending | not completed in this PR |
| signing setup | Pending | not completed in this PR |
| AAB generation | Pending | not completed in this PR |

## Manual QA Checklist

- [ ] Download latest `harupuli-debug-apk` artifact from GitHub Actions
- [ ] Extract APK from artifact zip
- [ ] Install APK on Android test device
- [ ] Launch app successfully
- [ ] Confirm app does not crash on first launch
- [ ] Confirm home screen renders correctly
- [ ] Confirm bottom navigation works
- [ ] Confirm my info input flow works
- [ ] Confirm today fortune flow works
- [ ] Confirm today flow screen works
- [ ] Confirm 2026 fortune screen works
- [ ] Confirm zodiac fortune screen works
- [ ] Confirm quick menu customization works
- [ ] Confirm quick menu localStorage restore works after app restart
- [ ] Confirm "my saju flow" help modal opens and closes
- [ ] Confirm daily routine detail toggle works
- [ ] Confirm five elements description card is readable on mobile
- [ ] Confirm share/save related UI does not crash
- [ ] Confirm no unexpected permission prompt appears
- [ ] Confirm no login/payment/ad SDK flow appears

## Storage QA

- Confirm existing profile/fortune localStorage data is preserved
- Confirm `harupuli_home_quick_menu_prefs` is independent from profile/fortune storage
- Confirm invalid quick menu saved value falls back safely
- Confirm app works after clearing app data
- Confirm no schemaVersion migration is triggered by quick menu settings

## Guardrails

- production fortune logic unchanged
- zodiac fortune engine unchanged
- src production UI unchanged
- generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- existing localStorage keys unchanged
- routing unchanged
- privacy files unchanged
- Android/Gradle unchanged
- release build not added
- signing setup not added
- AAB not generated
