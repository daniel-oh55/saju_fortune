# Android Release AAB Artifact QA

## Purpose

이 문서는 하루풀이 Android Release AAB workflow run number 3에서 생성된 AAB artifact의 QA 확인 항목을 정리한다.

이번 문서는 AAB artifact QA 체크리스트와 metadata 기록 문서이며, Play Console 업로드나 signing 설정을 포함하지 않는다.

## Artifact Metadata

| Item | Value |
|---|---|
| Workflow | Android Release AAB |
| Run number | 3 |
| Branch | main |
| Status | completed |
| Conclusion | success |
| Artifact name | harupuli-release-aab |
| Artifact size | 5.6 MB |
| Artifact digest | sha256:64ba8d4739cb7716893a4bd4a55e8bdcd26a0139febf8a40c6bb86caec45b9b7 |
| Artifact 확인 | Confirmed |

주의:

- AAB artifact 생성은 Play Console 업로드 완료가 아니다.
- AAB artifact 생성은 실제 기기 QA 완료가 아니다.
- AAB artifact 생성은 signing 설정 완료가 아니다.
- Play Console 업로드 가능 여부는 별도 검토가 필요하다.

## Artifact QA Checklist

| Item | Status | Note |
|---|---|---|
| AAB artifact 생성 확인 | Confirmed | run number 3 기준 |
| AAB artifact name 확인 | Confirmed | harupuli-release-aab |
| AAB artifact size 기록 | Confirmed | 5.6 MB |
| AAB artifact digest 기록 | Confirmed | sha256 기록 |
| artifact 다운로드 | Pending | 실제 다운로드 확인 전까지 Pending |
| artifact 압축 해제 | Pending | zip 내부 확인 전까지 Pending |
| `.aab` 파일 존재 확인 | Pending | 실제 파일 확인 전까지 Pending |
| AAB 파일명 기록 | Pending | 실제 파일 확인 후 기록 |
| AAB 파일 크기 기록 | Pending | 실제 파일 확인 후 기록 |
| Play Console 업로드 가능 여부 | Pending | 실제 업로드 전까지 Pending |
| signing 상태 확인 | Pending | 실제 signing 검증 전까지 Pending |
| 실제 기기 QA | Pending | 실제 설치/실행 확인 전까지 Pending |

## Download and Inspection Notes

후속 PR에서 확인할 항목:

- GitHub Actions artifact 다운로드
- artifact zip 압축 해제
- zip 내부 `.aab` 파일 존재 확인
- AAB 파일명 기록
- AAB 파일 크기 기록
- AAB 파일 보관 위치 기록
- signing 상태 확인 가능 여부 검토
- Play Console 내부 테스트 업로드 전 추가 요구사항 확인

현재 상태:

- artifact 다운로드: Pending
- artifact 압축 해제: Pending
- `.aab` 파일 존재 확인: Pending
- signing 상태 확인: Pending
- Play Console 내부 테스트 업로드: Pending

## Signing and Upload Status

현재 상태:

- signing 설정: Pending
- keystore 파일 추가: 없음
- signing password 기록: 없음
- GitHub Secrets 실제 입력: Pending
- Play Console 내부 테스트 업로드: Pending
- 실제 Google Play Console 입력: Pending
- 실제 기기 QA: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- workflow 파일 변경 없음
- signing 설정 적용 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- GitHub Secrets 실제 입력 없음
- Play Console 내부 테스트 업로드 없음
- 실제 Google Play Console 입력 없음
- 실제 기기 QA 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- Gradle 설정 변경 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음

## Related Docs

- Android release AAB workflow run result: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md
- Android release AAB workflow: docs/ANDROID_RELEASE_AAB_WORKFLOW.md
- Release workflow design: docs/RELEASE_WORKFLOW_DESIGN.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: record Android release AAB artifact inspection`
   - artifact 다운로드/압축 해제/내부 `.aab` 파일 확인 결과 기록

2. `docs: signing setup plan`
   - 실제 signing 설정 전 keystore/secrets 운영 계획 정리

3. `docs: google play internal test checklist`
   - Play Console 내부 테스트 업로드 전 확인 항목 정리
