# Android Keystore Generation Storage Plan

## Purpose

이 문서는 하루풀이 Android release AAB signing에 필요한 keystore 생성 방식과 보관 방식을 실제 생성 전에 정리한다.

이번 문서는 keystore generation/storage 계획 문서이며, 이번 PR에서는 release workflow signing support 상태만 반영한다.

## Current Status

| Item | Status | Note |
|---|---|---|
| AAB signing verification result | Confirmed | Unsigned |
| signing setup plan | Draft | docs/ANDROID_SIGNING_SETUP_PLAN.md |
| signing secrets checklist | Draft | docs/ANDROID_SIGNING_SECRETS_CHECKLIST.md |
| keystore generation plan | Draft | this document |
| keystore generation decision | Decided | local secure environment with JDK keytool |
| keystore generation | Confirmed | repository outside private location |
| keystore actual generation | Confirmed | repository outside private location |
| keystore storage decision | Decided | repository commit prohibited |
| keystore backup decision | Decided | separate private safe location |
| keystore storage | Confirmed | private safe location, actual path not recorded |
| keystore backup storage | Confirmed | separate private safe location, actual path not recorded |
| GitHub Secrets actual input | Confirmed | values entered in repository settings |
| release workflow signing support | Added | GitHub Secrets based workflow support added |
| signed AAB generation | Pending | not generated |
| Play Console internal test upload | Pending | not uploaded |
| real device QA | Pending | not performed |

## Decision Result

이번 결정은 실제 keystore 생성이 아니라 생성/보관/백업 방식의 운영 기준 결정이다.

| Decision | Result | Status |
|---|---|---|
| keystore 생성 방식 | local secure environment에서 JDK keytool 사용 | Decided |
| keystore 생성 명령 | keytool 기반 생성 방식 사용 | Decided |
| keystore 파일 repository commit 여부 | commit하지 않음 | Decided |
| `.jks` 파일 repository commit 여부 | commit하지 않음 | Decided |
| `.keystore` 파일 repository commit 여부 | commit하지 않음 | Decided |
| keystore 보관 방식 | 비공개 안전 위치에 보관 | Decided |
| keystore backup 방식 | 별도 비공개 안전 위치에 백업 | Decided |
| password 보관 방식 | password manager 또는 내부 보안 저장소 사용 | Decided |
| GitHub Actions 사용 방식 | keystore 원본 대신 base64 Secret 후보 사용 | Decided |
| GitHub Secrets actual input | Confirmed | values entered in repository settings |
| release workflow signing 적용 | Added | workflow support added |
| signed AAB 생성 | Pending | Not started |

주의:

- 실제 keystore 파일은 이번 PR에서 생성하지 않는다.
- 실제 keystore 파일은 repository에 commit하지 않는다.
- 실제 keystore 보관 위치는 문서에 기록하지 않는다.
- 실제 password는 문서, 코드, PR, 로그에 기록하지 않는다.
- 실제 keystore base64 값은 문서, 코드, PR, 로그에 기록하지 않는다.
- GitHub Secrets 실제 입력은 별도 작업에서 진행한다.
- workflow signing support는 추가되었다.

## Generation Status

실제 keystore 생성/보관/백업 상태는 실제값을 기록하지 않는 기준으로만 문서화한다.

| Item | Status | Note |
|---|---|---|
| keystore actual generation | Confirmed | repository outside private location |
| keystore file commit | Not committed | `.jks`/`.keystore` not added |
| keystore storage | Confirmed | private safe location, actual path not recorded |
| keystore backup storage | Confirmed | separate private safe location, actual path not recorded |
| signing password record | Not recorded | password not recorded in docs/code/PR/logs |
| key alias record | Not recorded | actual alias not recorded |
| keystore base64 value record | Not recorded | actual base64 not recorded |
| GitHub Secrets actual input | Confirmed | values entered in repository settings |
| release workflow signing support | Added | GitHub Secrets based workflow support added |
| signed AAB generation | Pending | not generated |

주의:

- 실제 keystore 파일명은 기록하지 않는다.
- 실제 keystore 저장 경로는 기록하지 않는다.
- 실제 key alias는 기록하지 않는다.
- 실제 signing password는 기록하지 않는다.
- 실제 keystore base64 값은 기록하지 않는다.
- GitHub Secrets 실제 입력은 별도 PR에서 진행한다.
- workflow signing support는 추가되었다.
- signed AAB generation remains Pending.
- signed AAB verification remains Pending.

## Proposed Keystore Generation Method

후속 작업에서 검토할 keystore 생성 방식:

```bash
keytool -genkeypair -v -keystore <private-keystore-file>.jks -keyalg RSA -keysize 2048 -validity 10000 -alias <private-alias>
```

주의:

- 이 명령은 예시이며 이번 PR에서 실행하지 않는다.
- `<private-keystore-file>` 실제값은 기록하지 않는다.
- `<private-alias>` 실제값은 기록하지 않는다.
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
- GitHub Secrets actual input is Confirmed.
- Secret actual values are Not recorded.
- Secret 입력 완료 여부는 실제 입력 후 별도 PR에서 상태만 기록한다.

## Decision Checklist

후속 PR 전에 결정해야 할 항목:

| Decision | Status | Note |
|---|---|---|
| keystore 생성 담당자 | Decided | 실제 개인 정보 기록 금지 |
| keystore 생성 환경 | Decided | local secure environment |
| keystore 파일명 정책 | Decided | 실제 파일명 문서 기록 금지 |
| key alias 정책 | Decided | 실제 alias 문서 기록 금지 |
| password 보관 방식 | Decided | 내부 보안 저장소 사용 |
| primary backup 위치 | Decided | 실제 경로 기록 금지 |
| secondary backup 위치 | Decided | 실제 경로 기록 금지 |
| GitHub Secrets 입력 시점 | Pending | 별도 PR 이후 |
| workflow signing 적용 시점 | Pending | 별도 PR |

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- keystore 파일 추가 없음
- keystore 파일 commit 없음
- `.jks` 파일 commit 없음
- `.keystore` 파일 commit 없음
- signing password 기록 없음
- keystore base64 실제값 기록 없음
- GitHub Secrets 실제값 기록 없음
- signed AAB 생성 결과 기록 없음
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
