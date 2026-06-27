# Android Signing Setup Plan

## Purpose

이 문서는 하루풀이 Android release AAB signing 설정을 실제 적용하기 전 필요한 결정사항, 보안 기준, GitHub Secrets 후보, 후속 작업 순서를 정리한다.

이번 문서는 signing setup 계획 문서이며, 이번 PR에서는 GitHub Secrets 기반 release workflow signing support와 Gradle release signing config만 최소 적용한다.

## Current Signing Status

| Item | Status | Note |
|---|---|---|
| AAB file | Confirmed | app-release.aab |
| AAB file size | Confirmed | 6,016,271 bytes |
| signing verification command | Confirmed | PR #189 |
| jarsigner result | Confirmed | Unsigned |
| signing status result | Confirmed | Unsigned |
| signing setup plan | Required | this document |
| signing setup applied | Partially added | Gradle release signing config uses environment variables |
| keystore file | Pending | not committed to repository, actual filename not recorded |
| keystore generation/storage decision | Decided | docs/ANDROID_KEYSTORE_GENERATION_STORAGE_PLAN.md |
| keystore actual generation | Confirmed | repository outside private location |
| keystore storage | Confirmed | private safe location, actual path not recorded |
| keystore backup storage | Confirmed | separate private safe location, actual path not recorded |
| signing password | Pending | not recorded |
| GitHub Secrets actual input | Confirmed | values entered in repository settings |
| release workflow signing support | Added | GitHub Secrets based workflow support added |
| workflow signing 적용 | Added | workflow support added |
| signed AAB 생성 | Pending | not generated |
| Play Console internal test upload | Pending | not uploaded |
| real device QA | Pending | not performed |

## Signing Goal

목표:

- release AAB를 Play Console 업로드 가능한 형태로 signing하는 절차를 준비한다.
- keystore와 password를 repository에 저장하지 않는다.
- GitHub Actions에서 signing을 자동화할 경우 GitHub Secrets를 사용한다.
- 실제 signing 적용은 별도 PR에서 진행한다.
- Play Console 업로드 가능 여부는 signing 설정 이후 별도 확인한다.

주의:

- signing setup plan은 signing 설정 완료가 아니다.
- signing setup plan은 Play Console 업로드 완료가 아니다.
- signing setup plan은 실제 기기 QA 완료가 아니다.
- workflow signing support 추가는 signed AAB 생성 완료가 아니다.
- workflow signing support 추가는 Play Console 업로드 완료가 아니다.
- workflow signing support 추가는 실제 기기 QA 완료가 아니다.
- signed AAB 생성 결과는 workflow 수동 실행 후 별도 PR에서 기록한다.

## Required Decisions

후속 작업 전에 결정해야 할 항목:

| Decision | Status | Note |
|---|---|---|
| upload key 생성 방식 | Pending | local 생성 또는 별도 관리 방식 검토 필요 |
| keystore 보관 방식 | Pending | repository commit 금지 |
| GitHub Secrets 사용 여부 | Pending | 실제값 입력 전까지 Pending |
| release workflow signing 적용 방식 | Pending | workflow 수정은 별도 PR |
| Play Console App Signing 사용 여부 | Pending | Play Console 설정 전까지 Pending |
| 내부 테스트 업로드 순서 | Pending | signing 이후 별도 PR |

## Candidate GitHub Secrets

후속 PR에서 사용할 수 있는 GitHub Secrets 후보명만 정리한다.
실제 값은 절대 기록하지 않는다.

| Secret name | Purpose | Status |
|---|---|---|
| ANDROID_KEYSTORE_BASE64 | keystore 파일을 base64로 인코딩한 값 후보 | Pending |
| ANDROID_KEYSTORE_PASSWORD | keystore password 후보 | Pending |
| ANDROID_KEY_ALIAS | key alias 후보 | Pending |
| ANDROID_KEY_PASSWORD | key password 후보 | Pending |

주의:

- 위 이름은 후보명이며 실제 값이 아니다.
- 실제 GitHub Secrets 입력은 Pending이다.
- password와 keystore 원본은 문서, 코드, 로그에 기록하지 않는다.

## Keystore Policy

보안 기준:

- keystore 파일은 repository에 commit하지 않는다.
- keystore 파일은 PR 첨부물로 올리지 않는다.
- signing password는 코드, 문서, 로그에 기록하지 않는다.
- GitHub Secrets 실제값은 문서에 기록하지 않는다.
- local 임시 파일은 작업 후 제거한다.
- keystore 생성/보관 절차는 별도 PR 또는 별도 비공개 운영 절차로 관리한다.

## Proposed Future Workflow Approach

향후 workflow에 signing을 적용할 경우 검토할 방향:

1. GitHub Secrets에 keystore/password/alias 후보가 입력
2. workflow에서 keystore base64를 임시 파일로 복원
3. Gradle signing config 또는 command line property로 signing 정보 전달
4. `bundleRelease`로 signed AAB 생성
5. artifact 업로드
6. signing verification command로 signed 여부 확인
7. Play Console 내부 테스트 업로드 가능 여부 별도 확인

현재 상태:

- keystore generation/storage decision: Decided
- keystore actual generation: Confirmed
- keystore storage: Confirmed
- keystore backup storage: Confirmed
- GitHub Secrets actual input: Confirmed
- release workflow signing support: Added
- workflow signing 적용: Added
- signed AAB 생성: Pending
- workflow signing 적용: Added
- GitHub Secrets 실제 입력: Confirmed
- signed AAB 생성: Pending
- signed AAB 검증: Pending
- Play Console 내부 테스트 업로드: Pending
- real device QA: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- signed AAB 생성 결과 기록 없음
- keystore 파일 생성 없음
- keystore 파일 추가 없음
- keystore 파일 commit 없음
- signing password 기록 없음
- GitHub Secrets 실제값 기록 없음
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

1. `docs: add Android signing secrets checklist`
   - GitHub Secrets 입력 전 체크리스트 문서화

2. `ci: add Android release signing workflow support`
   - 실제 workflow signing 적용
   - keystore/password 실제값은 GitHub Secrets로만 사용

3. `docs: record signed AAB workflow result`
   - signed AAB 생성 결과 기록

4. `docs: record signed AAB verification result`
   - jarsigner 또는 apksigner 검증 결과 기록

5. `docs: google play internal test upload checklist`
   - Play Console 내부 테스트 업로드 전 확인 항목 정리

## Related Docs

- Android keystore generation storage plan: docs/ANDROID_KEYSTORE_GENERATION_STORAGE_PLAN.md
- Android signing secrets checklist: docs/ANDROID_SIGNING_SECRETS_CHECKLIST.md
- Android AAB signing verification plan: docs/ANDROID_AAB_SIGNING_VERIFICATION_PLAN.md
- Android release AAB artifact QA: docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md
- Android release AAB workflow run result: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md
- Android release AAB workflow: docs/ANDROID_RELEASE_AAB_WORKFLOW.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md
