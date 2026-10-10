# Workflow: UI & Layout Revamp (/revamp-ui)

CRITICAL: Execute strictly phase-by-phase. DO NOT write production component code until Phase 1 & 2 pass visual review and approval.

## Phase 1: Visual Prototyping & Archetype Selection
1. Read `.context/03_DESIGN_SYSTEM.md` and active project context.
2. Formulate 3 distinct visual archetype options tailored to the system (e.g., Option A: High-Density Canvas, Option B: Warm Humanist, Option C: Neo-Brutalist) with explicit CSS tokens, typography pairings, and card/grid layouts.
3. Generate a self-contained HTML visual prototype file at `public/design-preview.html` containing live, side-by-side or tabbed HTML mockups with realistic data and Tailwind CSS styling.
4. Launch the integrated Browser Agent / Webview to open and render `public/design-preview.html` visually for the user.
5. Run `./scripts/check-tokens.sh`.
✋ STOP POINT: Display `public/design-preview.html` in the browser panel. Ask the user to visually inspect the rendered mockups and select their preferred archetype (Option A, B, or C) before generating component code.

## Phase 2: Security & Responsive Spec
1. Audit chosen archetype specs for:
   - Accessibility (aria labels, keyboard focus states).
   - Input/output sanitization (prevent XSS in layout containers).
   - Mobile-first responsiveness and breakpoint rules.
✋ STOP POINT: Present audit findings and responsive spec to the user. Wait for approval.

## Phase 3: Modular Implementation
1. Lock chosen archetype tokens into `.context/03_DESIGN_SYSTEM.md`.
2. Execute CLI checkpoint: `omni checkpoint "ui-revamp-impl"`.
3. Re-architect components modularly. Enforce zero hardcoded hex values in component styling.
4. Run `./scripts/check-tokens.sh` after each component edit.

## Phase 4: Full Spectrum Verification
1. Run `./scripts/scan-secrets.sh`.
2. Run `./scripts/verify.sh` (Typecheck, Lint, Tests, Build).
3. Use Browser Agent to inspect live application rendering across viewports.

## Phase 5: State Log
1. Log ADR in `.context/05_STATE.md`.
2. Execute CLI checkpoint: `omni checkpoint "ui-revamp-complete"`.
