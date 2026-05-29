# WORKFLOW

## 역할

### 사용자

- 업무 요구사항 제공
- 최종 승인
- 화면 확인

### ChatGPT 프로젝트

- 기능 기획
- Codex 프롬프트 작성
- 코드 검토
- 오류 원인 분석
- 배포 전 체크리스트 작성

### Codex

- 실제 코드 수정
- 파일 생성
- 테스트 실행
- 변경사항 요약

### GitHub

- 코드 저장
- 브랜치 관리
- PR 검토
- 변경 이력 관리

### Vercel

- 배포
- 프리뷰 확인
- 운영 URL 제공

## 새 기능 개발 흐름

1. 사용자 → ChatGPT에 기능 요청
2. ChatGPT → 구현 방향과 Codex 프롬프트 작성
3. 사용자 → Codex에 프롬프트 전달
4. Codex → 현재 Git 상태 확인
5. Codex → 기능별 브랜치 생성
6. Codex → 요청 범위 안에서 코드 수정
7. Codex → 로컬 테스트 실행
8. Codex → 변경사항 요약
9. GitHub → PR 생성
10. Codex 또는 ChatGPT → PR 검토
11. 문제 없으면 `main` merge
12. Vercel 배포 확인
13. `DEVELOPMENT_LOG.md` 업데이트

## 버그 수정 흐름

1. 오류 화면, 콘솔 로그, 재현 방법을 기록
2. 새 `fix/*` 브랜치 생성
3. 원인 파일을 읽고 최소 범위로 수정
4. 같은 오류가 재발하지 않도록 테스트
5. PR에 재현 방법과 수정 결과를 기록
6. Vercel Preview에서 확인 후 merge

## 배포 전 검토 흐름

1. `git status`로 변경 파일 확인
2. 기능 파일 외 불필요한 파일 포함 여부 확인
3. `.env`가 커밋되지 않았는지 확인
4. `npm install` 필요 여부 확인
5. `npm run build` 실행
6. 주요 화면 수동 테스트
7. 모바일 화면 확인
8. Vercel Preview 확인
9. PR 설명에 테스트 결과 기록

## 배포 후 오류 대응 흐름

1. Vercel 배포 로그 확인
2. 브라우저 콘솔 에러 확인
3. 최근 merge commit 확인
4. 환경변수 누락 여부 확인
5. API/정적 파일 경로 문제 확인
6. 빠른 수정이 가능하면 `fix/*` 브랜치에서 수정
7. 긴급하면 이전 정상 commit으로 롤백
8. 원인과 조치 내용을 `DEVELOPMENT_LOG.md`에 기록
