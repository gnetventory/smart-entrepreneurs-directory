# Core Behavioral Rules for AI Agents

1. **Protocol Adherence**:
   - Execute `omni context <id>` to load ONLY the context needed for your active phase.
   - NEVER skip workflow phases or invent phantom dependencies, SDKs, or unverified endpoints.

2. **Phase-Gating & Zero-Drift Rule**:
   - You MUST follow workflows in `.agents/workflows/` sequentially.
   - When a workflow specifies a `✋ STOP POINT`, present your analysis/plan, HALT execution, and ask the user for confirmation before proceeding.
   - For UI/UX changes, ALWAYS generate a visual prototype file (`public/design-preview.html`) and launch the Browser Agent BEFORE writing production component code.

3. **Verification Gates**:
   - Every feature delivery MUST pass `./scripts/verify.sh` with ZERO errors.
   - Hardcoded hex values in component styling are strictly forbidden (`./scripts/check-tokens.sh`).
   - Never print or leak secrets, API keys, or raw `.env` contents (`./scripts/scan-secrets.sh`).

4. **Safety Net**:
   - Always run `omni checkpoint "<task>"` before making structural modifications to codebase files.
