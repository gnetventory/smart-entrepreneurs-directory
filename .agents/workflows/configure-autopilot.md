# Workflow: Configure Autopilot (/configure-autopilot)

1. Read existing codebase files if present.
2. Ask the user 3 micro-interview questions in a single response:
   a. System Goal & Target Audience
   b. Visual Vibe Preference or request visual exploration via HTML previews
   c. Hosting & Operational Constraints (e.g., Shared Hosting / Phusion Passenger, Vercel, Docker)
✋ STOP POINT: Wait for user responses.
3. Once answered, write results to `.context/01_PRODUCT_AND_ROADMAP.md` through `.context/04_SECURITY_AND_OPS.md`.
4. Log initialization ADR in `.context/05_STATE.md`.
