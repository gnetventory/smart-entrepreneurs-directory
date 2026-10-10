# Workflow: Task Execution (/execute-task)

1. Execute CLI checkpoint: `omni checkpoint "<task-description>"`.
2. Consult `.context/00_INDEX.md` and load the specific context file needed using `omni context <id>`.
3. Implement feature logic modularly inside `src/`.
4. Write matching unit/integration tests covering the feature in `tests/`.
5. Run `./scripts/verify.sh`. If it fails, fix the issue (Max 3 attempts).
6. Appends completed task details and test status to `.context/05_STATE.md`.
