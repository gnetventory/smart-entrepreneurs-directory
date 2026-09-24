# Autonomous Runtime Rules
- You are an automated execution agent. Minimize human confirmation prompts.
- Always cross-reference tasks with `.context/` structural files.
- Enforce silent, secure environment variable isolation. Never expose keys.
- Every feature must be deployed with an accompanying self-running unit test.
- If an operation fails, execute the /heal-broken-task protocol automatically before reporting back.

# Visual & UI/UX Design System Guardrails (Anti-Slop Protocol)
- NEVER use default AI color palettes (e.g., generic indigo `#6366F1`, purple gradients, or pure `#000000` text on pure `#FFFFFF`).
- Strict Token Enforcement: Read design tokens from `.context/06_UI_UX_DESIGN_SYSTEM.md`. Prohibit raw hex codes or random inline styles in components.
- Reject Generic AI Layouts: Avoid centered H1s with dual pill buttons, floating card grids with identical soft shadows, or generic vector illustrations.
- Enforce Structural Archetypes: Every UI page must use an explicit visual archetype (e.g., Asymmetric Split Grid, High-Density Data Canvas, or Editorial Column Layout).
