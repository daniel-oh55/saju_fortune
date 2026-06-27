# Android Keystore Generation Storage Plan

## Purpose

이 문서는 하루풀이 Android release AAB signing에 필요한 keystore 생성 방식과 보관 방식을 실제 생성 전에 정리한다.

이번 문서는 keystore generation/storage 계획 문서이며, 실제 keystore 생성, keystore 파일 추가, signing 설정 적용, GitHub Secrets 입력, workflow 수정은 포함하지 않는다.

## Current Status

| Item | Status | Note |
|---|---|---|
| AAB signing verification result | Confirmed | Unsigned |
| signing setup plan | Draft | docs/ANDROID_SIGNING_SETUP_PLAN.md |
| signing secrets checklist | Draft | docs/ANDROID_SIGNING_SECRETS_CHECKLIST.md |
| keystore generation plan | Draft | this document |
| keystore generation | Pending | not created yet |
| keystore storage decision | Pending | not finalized yet |
| keystore backup decision | Pending | not finalized yet |
| GitHub Secrets actual input | Pending | not entered yet |
| release workflow signing support | Pending | not implemented |
| signed AAB generation | Pending | not generated |
| Play Console internal test upload | Pending | not uploaded |
| real device QA | Pending | not performed |

## Proposed Keystore Generation Method

후속 작업에서 검토할 keystore 생성 방식:

```bash
keytool -genkeypair -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

주의:

- 이 명령은 예시이며 이번 PR에서 실행하지 않는다.
- 실제 alias, password, 파일명은 문서에 기록하지 않는다.
- 실제 keystore 생성은 별도 작업에서 수행한다.
- 생성한 keystore 파일은 repository에 commit하지 않는다.

## Storage Policy

keystore 보관 기준:

- keystore 파일은 repository에 commit하지 않는다.
- `.jks` 파일은 repository에 commit하지 않는다.
- `.keystore` 파일은 repository에 commit하지 않는다.
- keystore 파일은 비공개 안전 위치에 보관한다.
- keystore 백업 위치는 별도로 정하되 문서에는 실제 경로를 기록하지 않는다.
- keystore 분실 시 앱 업데이트에 문제가 생길 수 있으므로 백업 방식을 반드시 정한다.
- GitHub Actions에서는 keystore 파일 원본 대신 base64 인코딩값을 GitHub Secrets로 사용하는 방식을 검토한다.
- base64 실제값은 문서, 코드, PR, 로그에 기록하지 않는다.

## Backup Policy

백업 기준:

| Item | Status | Note |
|---|---|---|
| primary keystore storage | Pending | 실제 위치 문서 기록 금지 |
| backup keystore storage | Pending | 실제 위치 문서 기록 금지 |
| password manager usage | Pending | 실제 password 기록 금지 |
| recovery owner | Pending | 실제 개인 정보 기록 금지 |
| loss recovery plan | Pending | 후속 문서에서 검토 |

주의:

- 실제 보관 위치, 비밀번호, recovery owner 개인 정보는 repository 문서에 기록하지 않는다.
- 백업 완료 여부는 실제 보관 후 별도 PR에서 상태만 기록한다.
- 실제 파일이나 경로는 문서화하지 않는다.

## Candidate GitHub Secrets Mapping

후속 PR에서 사용할 수 있는 Secret 후보와 keystore 관련 흐름:

| Secret name | Source | Status |
|---|---|---|
| ANDROID_KEYSTORE_BASE64 | generated keystore file encoded as base64 | Pending |
| ANDROID_KEYSTORE_PASSWORD | keystore password | Pending |
| ANDROID_KEY_ALIAS | signing key alias | Pending |
| ANDROID_KEY_PASSWORD | signing key password | Pending |

주의:

- Secret 이름만 기록한다.
- 실제 Secret 값은 기록하지 않는다.
- GitHub Secrets 실제 입력은 Pending이다.
- Secret 입력 완료 여부는 실제 입력 후 별도 PR에서 상태만 기록한다.

## Decision Checklist

후속 PR 전에 결정해야 할 항목:

| Decision | Status | Note |
|---|---|---|
| keystore 생성 담당자 | Pending | 실제 개인 정보 기록 금지 |
| keystore 생성 환경 | Pending | local secure environment 권장 |
| keystore 파일명 정책 | Pending | 실제 파일명 기록 여부 신중히 결정 |
| key alias 정책 | Pending | 실제 alias 기록 금지 |
| password 보관 방식 | Pending | password manager 등 검토 |
| primary backup 위치 | Pending | 실제 경로 기록 금지 |
| secondary backup 위치 | Pending | 실제 경로 기록 금지 |
| GitHub Secrets 입력 시점 | Pending | 별도 PR 이후 |
| workflow signing 적용 시점 | Pending | 별도 PR |

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- keystore 파일 실제 생성 없음
- keystore 파일 추가 없음
- keystore 파일 commit 없음
- `.jks` 파일 commit 없음
- `.keystore` 파일 commit 없음
- signing password 기록 없음
- keystore base64 실제값 기록 없음
- GitHub Secrets 실제 입력 없음
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

1. `docs: record Android keystore generation decision`
   - keystore 생성 방식/보관 방식 결정 결과만 기록
   - 실제 파일, password, 경로는 기록하지 않음

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

- Android signing secrets checklist: docs/ANDROID_SIGNING_SECRETS_CHECKLIST.md
- Android signing setup plan: docs/ANDROID_SIGNING_SETUP_PLAN.md
- Android AAB signing verification plan: docs/ANDROID_AAB_SIGNING_VERIFICATION_PLAN.md
- Android release AAB artifact QA: docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md
