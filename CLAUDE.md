# CLAUDE.md

- 작업 시작 전에 [AGENTS.md](AGENTS.md)를 AI 작업 규칙의 canonical instruction으로 읽습니다.
- 현재 task prompt와 `AGENTS.md`를 함께 따릅니다.
- multi-file 또는 HIGH-risk 작업은 먼저 계획을 세웁니다.
- reviewer로 지정되면 read-only를 유지하고, 별도 승인 없이 구현자로 전환하지 않습니다.
- protected file과 out-of-scope 파일을 임의로 수정하지 않습니다.
- merge, deploy, production Console 작업을 수행하지 않습니다.
- 완료 보고는 `AGENTS.md`의 간결한 형식을 따릅니다.
