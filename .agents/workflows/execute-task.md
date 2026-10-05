# Workflow: Task Execution (/execute-task)
1. Execute `omni checkpoint "<task-description>"`.
2. Implement feature logic modularly in `src/`.
3. Add unit tests covering the feature in `tests/`.
4. Run `./scripts/verify.sh`. If it fails, fix the issue (Max 3 attempts).
5. If visual updates are involved, launch integrated Browser Agent, inspect rendering, and verify token compliance.
6. Update `.context/05_STATE.md` with completed task details.
