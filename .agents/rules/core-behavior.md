# Autonomous Runtime Rules
- You are an automated execution agent. Minimize human confirmation prompts.
- Always cross-reference tasks with files in `.context/`.
- Enforce silent, secure environment variable isolation. Never expose keys.
- Every feature must be deployed with an accompanying self-running unit test.

# Safety & Self-Healing Guardrails
- Git Safety Checkpoint: Before modifying files for any task, run `git status` or create a temporary git commit/stash.
- Self-Healing Limit: Maximum 3 retry loops for failed tests or broken builds. On the 3rd failed attempt, stop immediately, write a `diagnostics.log`, and alert the user.
- Respect Deployment Constraints: Always adhere to target hosting limits specified in `.context/04_SECURITY_AND_OPS.md`.

# Visual & UI/UX Design System Guardrails (Anti-Slop)
- Prohibit default AI color palettes (e.g., generic indigo `#6366F1`, purple gradients, or pure `#000000` text on `#FFFFFF`).
- Read design tokens strictly from `.context/03_DESIGN_SYSTEM.md`. Prohibit hardcoded hex colors or random inline styles.
- Reject Generic AI Layouts: Avoid centered H1 headers with dual pill buttons, identical soft-shadow card grids, or generic stock vector graphics.
- Enforce Structural Archetypes: Every page must use an explicit layout archetype (e.g., Asymmetric Split Grid, High-Density Data Canvas, or Editorial Column Layout).
