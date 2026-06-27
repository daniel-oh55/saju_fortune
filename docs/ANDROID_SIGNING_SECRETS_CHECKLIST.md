# Android Signing Secrets Checklist

## Purpose

이 문서는 하루풀이 Android release AAB signing을 GitHub Actions에서 처리하기 전에, GitHub Secrets 입력 전 확인해야 할 항목을 정리한다.

이번 문서는 signing secrets 입력 전 체크리스트이며, 실제 GitHub Secrets 입력, keystore 생성, signing 설정 적용, workflow 수정은 포함하지 않는다.

## Current Status

| Item | Status | Note |
|---|---|---|
| AAB signing verification result | Confirmed | Unsigned |
| signing setup plan | Draft | docs/ANDROID_SIGNING_SETUP_PLAN.md |
| signing secrets checklist | Draft | this document |
| keystore generation decision | Decided | docs/ANDROID_KEYSTORE_GENERATION_STORAGE_PLAN.md |
| keystore generation | Pending | not created yet |
| keystore actual generation | Pending | not performed in this PR |
| keystore storage decision | Decided | repository commit prohibited |
| keystore backup decision | Decided | separate private safe location |
| keystore storage | Pending | actual private location not recorded |
| keystore backup storage | Pending | actual private location not recorded |
| GitHub Secrets actual input | Pending | not entered yet |
| release workflow signing support | Pending | not implemented |
| signed AAB generation | Pending | not generated |
| Play Console internal test upload | Pending | not uploaded |
| real device QA | Pending | not performed |

## Candidate Secrets

후속 작업에서 사용할 수 있는 GitHub Secrets 후보명:

| Secret name | Required | Purpose | Status |
|---|---|---|---|
| ANDROID_KEYSTORE_BASE64 | Yes | keystore 파일을 base64로 인코딩한 값 후보 | Pending |
| ANDROID_KEYSTORE_PASSWORD | Yes | keystore password 후보 | Pending |
| ANDROID_KEY_ALIAS | Yes | signing key alias 후보 | Pending |
| ANDROID_KEY_PASSWORD | Yes | signing key password 후보 | Pending |

주의:

- 이 항목은 Secret 이름 후보이며 실제 값이 아니다.
- 실제 Secret 값은 문서, 코드, PR, 로그에 기록하지 않는다.
- Secret 입력 완료 여부는 실제 GitHub repository settings에서 입력한 뒤 별도 PR에서 기록한다.

## Pre-Input Checklist

GitHub Secrets 실제 입력 전 확인할 항목:

| Item | Status | Note |
|---|---|---|
| upload key 생성 방식 결정 | Pending | local 생성 또는 별도 방식 결정 필요 |
| keystore 파일 보관 위치 결정 | Pending | repository commit 금지 |
| keystore backup 방식 결정 | Pending | 분실 방지 필요 |
| key alias 확정 | Pending | 실제값 문서 기록 금지 |
| password 보관 방식 결정 | Pending | 문서/코드/로그 기록 금지 |
| GitHub Secrets 입력 권한 확인 | Pending | repository settings 접근 필요 |
| workflow signing 적용 방식 결정 | Pending | 별도 PR에서 처리 |
| Play Console App Signing 사용 여부 확인 | Pending | Play Console 설정 전까지 Pending |

## Security Rules

보안 기준:

- keystore 파일은 repository에 commit하지 않는다.
- `.jks` 파일은 repository에 commit하지 않는다.
- `.keystore` 파일은 repository에 commit하지 않는다.
- signing password는 코드, 문서, PR, 로그에 기록하지 않는다.
- GitHub Secrets 실제값은 문서에 기록하지 않는다.
- GitHub Secrets 실제값은 PR body에 기록하지 않는다.
- GitHub Secrets 실제값은 check script에 기록하지 않는다.
- keystore base64 실제값은 문서나 로그에 기록하지 않는다.
- local 임시 파일은 작업 후 제거한다.
- GitHub Secrets 입력 완료 여부는 실제 입력 후 별도 PR에서 기록한다.

## Not Yet Done

현재 아직 완료하지 않은 항목:

- keystore generation decision: Decided
- keystore storage decision: Decided
- keystore backup decision: Decided
- keystore 생성: Pending
- keystore actual generation: Pending
- keystore storage: Pending
- keystore backup storage: Pending
- GitHub Secrets 실제 입력: Pending
- GitHub Secrets actual input: Pending
- release workflow signing support: Pending
- release workflow signing 적용: Pending
- signed AAB 생성: Pending
- signed AAB 검증: Pending
- Play Console 내부 테스트 업로드: Pending
- 실제 Google Play Console 입력: Pending
- 실제 기기 QA: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- GitHub Secrets 실제 입력 없음
- keystore 파일 생성 없음
- keystore 파일 추가 없음
- keystore 파일 commit 없음
- `.jks` 파일 commit 없음
- `.keystore` 파일 commit 없음
- signing password 기록 없음
- keystore base64 실제값 기록 없음
- signing 설정 적용 없음
- workflow 파일 변경 없음
- Gradle 설정 변경 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- Play Console 내부 테스트 업로드 없음
- 실제 Google Play Console 입력 없음
- 실제 기기 QA 없음
- artifact zip 파일 commit 없음
- `.aab` 파일 commit 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음

## Follow-up PR Order

권장 후속 PR 순서:

1. `docs: record Android keystore generation plan`
   - keystore 생성 방식과 보관 방식을 문서화
   - 실제 keystore 파일은 commit하지 않음

2. `docs: record Android signing secrets input status`
   - GitHub Secrets 입력 여부만 기록
   - 실제값은 기록하지 않음

3. `ci: add Android release signing workflow support`
   - workflow signing 적용
   - secrets 실제값은 workflow에서만 사용

4. `docs: record signed AAB workflow result`
   - signed AAB 생성 결과 기록

5. `docs: record signed AAB verification result`
   - signed AAB 검증 결과 기록

## Related Docs

- Android keystore generation storage plan: docs/ANDROID_KEYSTORE_GENERATION_STORAGE_PLAN.md
- Android signing setup plan: docs/ANDROID_SIGNING_SETUP_PLAN.md
- Android AAB signing verification plan: docs/ANDROID_AAB_SIGNING_VERIFICATION_PLAN.md
- Android release AAB artifact QA: docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md
- Android release AAB workflow run result: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md
