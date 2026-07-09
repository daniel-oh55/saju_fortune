# App Icon Design Brief

## Current Status

- Current status: Pending
- App icon design brief: Documented
- App icon asset creation: Pending
- Android icon resource integration: Pending
- Adaptive icon implementation: Not started
- Android native/resource changes: Not started
- Actual icon image files: Not added
- Store icon image: Pending
- Google Play icon upload: Pending
- Release build: Not started
- Signing setup: Not started
- AAB generation: Not started
- No src changes in this PR
- No Android/Gradle changes in this PR
- No icon asset files added in this PR

## Design Direction

- App name: 하루풀이
- Concept: 고요한 밤의 운세 다이어리
- Visual tone:
  - 따뜻한 아이보리 배경
  - 딥 네이비 포인트
  - 은은한 금색 포인트
  - 차분하고 개인 맞춤 인사이트 앱 느낌
- Avoid:
  - 과한 점집 느낌
  - 무속/공포/부적 느낌
  - 너무 복잡한 사주표
  - 작은 화면에서 식별 불가능한 디테일
  - 텍스트가 너무 많은 아이콘
- Recommended motifs:
  - 달
  - 별
  - 작은 나침반
  - 산수 실루엣
  - 운세 다이어리 느낌의 얇은 선
- Preferred composition:
  - rounded square app icon
  - simple center symbol
  - strong contrast between ivory and deep navy
  - small warm-gold accent
  - readable at small launcher size

## Candidate Icon Concepts

| Concept ID | Concept name | Description | Status |
|---|---|---|---|
| ICON-001 | Moon diary | Ivory background with deep navy moon and small gold star accent | Pending |
| ICON-002 | Fortune compass | Deep navy compass mark with warm-gold point on ivory background | Pending |
| ICON-003 | Night mountain | Minimal navy mountain silhouette with moon/star accent | Pending |
| ICON-004 | Daily flow mark | Abstract moon-orbit line and small star in calm diary style | Pending |

## Required Asset Plan

- Source master icon: Pending
- Android adaptive icon foreground: Pending
- Android adaptive icon background: Pending
- Google Play 512x512 icon: Pending
- Launcher icon preview: Pending
- Small-size legibility check: Pending
- Real-device launcher QA: Pending

## Recommended PR Split

1. App icon asset creation PR
   - Create actual icon source image
   - Do not modify Android resources yet unless explicitly included

2. Android icon resource integration PR
   - Apply finalized icon to Android adaptive icon/resources
   - Modify Android resources only in this PR
   - Run Android Debug Build

3. Android APK icon QA PR
   - Install APK on real device
   - Confirm launcher icon display
   - Record QA result

## Do Not Implement In This PR

- Do not add icon image files
- Do not modify Android resources
- Do not modify AndroidManifest.xml
- Do not add adaptive icon XML
- Do not add mipmap or drawable resources
- Do not change src
- Do not change production UI
- Do not create release build
- Do not configure signing
- Do not generate AAB
- Do not claim Google Play icon upload is completed
- Do not implement saved reading share feature
- Do not add Kakao SDK
- Do not add Capacitor Share dependency
