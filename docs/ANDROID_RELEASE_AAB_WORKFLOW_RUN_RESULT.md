# Android Release AAB Workflow Run Result

## Purpose

이 문서는 하루풀이 Android release AAB workflow 수동 실행 결과를 기록한다.

이번 문서는 실행 결과 기록 문서이며, signing 설정이나 Play Console 업로드를 포함하지 않는다.

## Workflow Run Summary

아래 값은 실제 GitHub Actions 실행 결과를 기준으로 작성한다.

| Item | Value |
|---|---|
| Workflow | Android Release AAB |
| Trigger | workflow_dispatch |
| Branch | main |
| Run number | 3 |
| Status | completed |
| Conclusion | success |
| AAB artifact name | harupuli-release-aab |
| AAB artifact 확인 | Confirmed |

주의:

- workflow가 실패했다면 실패를 그대로 기록한다.
- workflow가 성공했더라도 Play Console 업로드 완료로 표시하지 않는다.
- AAB artifact가 생성되었더라도 signing 설정과 Play Console 업로드 가능 여부는 별도 검토한다.

## Result Details

실제 결과:

- release AAB workflow 수동 실행: Completed
- AAB artifact 생성: Confirmed
- AAB artifact name: harupuli-release-aab
- AAB artifact size: 5.6 MB
- AAB artifact digest: sha256:64ba8d4739cb7716893a4bd4a55e8bdcd26a0139febf8a40c6bb86caec45b9b7
- GitHub Actions run number: 3
- GitHub Actions run URL: https://github.com/daniel-oh55/saju_fortune/actions/runs/28225624458
- Play Console 업로드: Pending
- signing 설정: Pending
- 실제 기기 QA: Pending

## Actual Current Run Note

2026-06-26 기준 current Android Release AAB workflow를 main branch에서 workflow_dispatch로 수동 실행했고, run number 3은 success로 완료되었다.

확인 메모:

- 이전 run number 2의 Node.js 버전 오류는 PR #184에서 Node.js 22로 보정했다.
- `harupuli-release-aab` artifact가 생성되었다.
- AAB artifact 생성은 Play Console 업로드 완료가 아니다.
- signing 설정과 Play Console 업로드 가능 여부는 별도 검토가 필요하다.

주의:

- 이전 signing workflow run 기준 결과를 현재 workflow 결과로 기록하지 않는다.
- 현재 `.github/workflows/android-release-aab.yml` 기준 current workflow run 결과만 기록한다.

## Signing and Upload Status

현재 상태:

- signing 설정: Pending
- keystore 파일 추가: 없음
- signing password 기록: 없음
- GitHub Secrets 실제 입력: Pending
- Play Console 내부 테스트 업로드: Pending
- 실제 Google Play Console 입력: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- workflow 파일 변경 없음
- signing 설정 적용 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- GitHub Secrets 실제 입력 없음
- Play Console 내부 테스트 업로드 없음
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

- Android release AAB workflow: docs/ANDROID_RELEASE_AAB_WORKFLOW.md
- Release workflow design: docs/RELEASE_WORKFLOW_DESIGN.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: signing setup plan`
   - 실제 signing 설정 전 keystore/secrets 운영 계획 정리

2. `docs: google play internal test checklist`
   - Play Console 내부 테스트 업로드 전 확인 항목 정리

3. `docs: android release AAB artifact QA`
   - AAB artifact 다운로드/보관/검증 절차 정리
