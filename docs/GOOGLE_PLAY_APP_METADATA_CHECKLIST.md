# Google Play App Metadata Checklist

## Purpose

이 문서는 하루풀이의 Google Play Console 입력 전에 필요한 앱 메타데이터 항목과 준비 상태를 정리한다.

이번 문서는 앱 메타데이터 체크리스트 문서이며, 실제 Google Play Console 입력은 포함하지 않는다.

이번 PR에서는 개인정보 처리방침 URL, 문의처, 데이터 보안 양식, 스토어 스크린샷을 실제 값으로 확정하지 않는다.

## Metadata Readiness Status

- Google Play 앱 메타데이터 체크리스트: Draft
- 실제 Google Play Console 입력: Pending
- 앱 이름 최종 확인: Pending
- 짧은 설명 최종 확인: Pending
- 자세한 설명 최종 확인: Pending
- 앱 카테고리 최종 확인: Pending
- 문의처 확정: Pending
- 개인정보 처리방침 URL 확정: Pending
- Google Play 데이터 보안 양식 입력: Pending
- 실제 스토어 스크린샷 이미지 제작: Pending
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending
- release build: Pending
- signing 설정: Pending
- AAB 생성: Pending

## App Identity Checklist

| Item | Current draft | Status | Note |
|---|---|---|---|
| App name | 하루풀이 | Pending final confirmation | 실제 Console 입력 전 최종 확인 필요 |
| Default language | Korean | Pending final confirmation | 실제 Console 화면에서 최종 확인 필요 |
| App type | App | Pending final confirmation | 실제 Console 화면에서 최종 확인 필요 |
| App category | Pending | Pending | Google Play Console에서 선택 전까지 Pending |
| Tags | Pending | Pending | Console 제공 항목 기준으로 추후 선택 |

주의:

- 앱 이름에는 정확한 예측, 전문 사주, 완벽한 분석처럼 현재 release scope를 넘는 표현을 붙이지 않는다.
- 앱 카테고리와 태그는 실제 Console 화면에서 제공하는 선택지를 기준으로 최종 결정한다.

## Store Listing Text Checklist

| Item | Draft source | Status | Note |
|---|---|---|---|
| Short description | docs/GOOGLE_PLAY_DESCRIPTION_DRAFT.md | Draft | 실제 Console 입력 전 글자 수와 정확 문구 재확인 |
| Full description | docs/GOOGLE_PLAY_DESCRIPTION_DRAFT.md | Draft | 실제 Console 입력 전 최종 검토 필요 |
| Claim safety guide | docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md | Draft | 과장 표현 방지 기준 |
| Screenshot caption plan | docs/GOOGLE_PLAY_SCREENSHOT_CAPTION_PLAN.md | Draft | 실제 이미지 제작 전 계획 단계 |

사용 가능한 방향:

- 참고용 운세 콘텐츠
- 오늘의 흐름을 가볍게 확인
- 기본 사주 흐름을 살펴보기
- 입력한 생년월일과 출생시간 기준
- 앱 내 기준에 따른 결과

피해야 하는 방향:

- 정확한 미래 예측
- 반드시 맞는 오늘운세
- 전문 사주가 수준의 정밀 사주풀이
- 지장간과 십성까지 완벽히 반영한 정밀 사주 분석
- 태양시까지 정확히 보정한 결과
- 외부 만세력 기준 검증 완료

## Contact and Policy Checklist

| Item | Status | Note |
|---|---|---|
| Developer contact email | Pending | 실제 문의처 확정 전까지 Pending |
| Privacy policy URL | Pending | 실제 개인정보 처리방침 URL 확정 전까지 Pending |
| Website URL | Pending | 필요한 경우 추후 검토 |
| Support URL | Pending | 필요한 경우 추후 검토 |
| Data safety form | Pending | 실제 Google Play 데이터 보안 양식 입력 전까지 Pending |

주의:

- 현재 앱은 서버 DB 없음, 로그인 없음, 실제 광고 SDK 없음, 실제 결제 SDK 없음, 외부 분석 SDK 없음 상태이다.
- localStorage 중심 사용자 입력 저장 구조를 기준으로 데이터 보안 양식 입력 전 별도 검토가 필요하다.
- 실제 Google Play 데이터 보안 양식 입력은 이번 PR에서 하지 않는다.

## Visual Asset Checklist

| Item | Status | Note |
|---|---|---|
| App icon final check | Pending | 실제 Play Console 업로드 전 최종 확인 필요 |
| Feature graphic | Pending | 필요 여부와 실제 제작 여부 추후 검토 |
| Phone screenshots | Pending | 실제 스토어 스크린샷 이미지 제작 전까지 Pending |
| Tablet screenshots | Pending | 필요 여부 추후 검토 |
| Screenshot captions | Draft | docs/GOOGLE_PLAY_SCREENSHOT_CAPTION_PLAN.md 참고 |

주의:

- 실제 스토어 스크린샷 이미지 제작은 이번 PR에서 하지 않는다.
- 실제 스토어 스크린샷 이미지 제작 전까지 Pending으로 유지한다.

## Release Track Checklist

| Item | Status | Note |
|---|---|---|
| release build | Pending | 실제 release build 전까지 Pending |
| signing 설정 | Pending | 실제 signing 설정 전까지 Pending |
| AAB 생성 | Pending | 실제 AAB 생성 전까지 Pending |
| Play Console 앱 생성 | Pending | 실제 Console 작업 전까지 Pending |
| 내부 테스트 업로드 | Pending | 실제 업로드 전까지 Pending |
| 실제 기기 QA | Pending | APK/AAB 설치 및 실행 확인 전까지 Pending |

주의:

- Android Debug Build 성공과 release build/AAB/signing 완료는 구분한다.
- Debug APK artifact 생성은 실제 Play Console 업로드 완료가 아니다.
- 실제 기기 QA는 실제 APK/AAB 설치와 앱 실행 확인 후에만 완료로 정리한다.

## Current App Capability Notes

현재 앱에서 제공하는 범위:

- 입력한 생년월일과 출생시간 기준 만세력 산출
- 현재 앱 기준 연주, 월주, 일주, 시주 산출
- 기존 겉오행 중심 오행 분석
- 오늘운세 기존 결과 생성
- 2026운세 기존 결과 생성
- 띠별운세 기존 결과 조합
- 참고용 운세 콘텐츠
- localStorage 중심 사용자 입력 저장 구조

현재 앱에 없는 것:

- 서버 DB 없음
- 로그인 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- 지장간/십성 production 분석 연결 없음
- 태양시 보정 적용 없음
- 출생지 기반 경도 보정 없음
- 대운, 세운, 합신 분석 없음

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- 실제 Google Play Console 입력 없음
- 실제 개인정보 처리방침 URL 확정 없음
- 실제 문의처 확정 없음
- 실제 Google Play 데이터 보안 양식 입력 없음
- 실제 스토어 스크린샷 이미지 제작 없음
- 실제 기기 QA 없음
- Play Console 내부 테스트 업로드 없음
- release build 없음
- signing 설정 없음
- AAB 생성 없음
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 production 연결 없음
- 십성 분석 production 연결 없음
- 태양시 보정 적용 없음
- createSajuAnalysis 반환 구조 변경 없음
- production result shape 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- Android native code 변경 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- Gradle 설정 변경 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 로그인 추가 없음
- 서버 DB 추가 없음
- 외부 분석 SDK 추가 없음
- iOS 프로젝트 추가 없음

## Related Docs

- Google Play data safety draft checklist: docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md
- Google Play description draft: docs/GOOGLE_PLAY_DESCRIPTION_DRAFT.md
- Google Play listing claim safety: docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md
- Google Play screenshot caption plan: docs/GOOGLE_PLAY_SCREENSHOT_CAPTION_PLAN.md
- Google Play screenshot readiness: docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md
- Google Play data safety input readiness: docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md
- Google Play privacy URL input readiness: docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md
- Advanced saju engine release scope: docs/ADVANCED_SAJU_ENGINE_RELEASE_SCOPE.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

Addressed planning PR:

- `docs: google play data safety draft checklist`

1. `docs: privacy policy content draft`
   - 개인정보 처리방침 URL 확정 전 문서 초안 작성

2. `docs: google play screenshot production checklist`
   - 실제 스토어 스크린샷 이미지 제작 전 준비 항목 정리

3. `docs: local storage data inventory`
   - 실제 localStorage key와 저장 항목 목록 정리

4. `docs: record hidden stems external verification`
   - 지장간 데이터 외부 기준 대조 결과 기록
