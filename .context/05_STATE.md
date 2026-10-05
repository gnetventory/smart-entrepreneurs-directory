# 05 · LIVING PROJECT STATE & ADRs
> **Smart Entrepreneurs Directory (SED)** — Living Project State, Sprint Progress & Architecture Decision Records (ADRs)  
> **Last Updated:** 2026-10-02

---

## 1. Living Project State

- **System Mode:** Production-Ready Client SPA
- **Current Active Sprint:** Sprint 1 — Editorial / Minimal Visual Alignment & Core Polish
- **Deployment Platform:** Vercel (Edge Network / Static SPA)
- **Primary Visual Archetype:** Editorial / Minimal (Spacious, Typography-Focused, Sophisticated)
- **Last Verification Status:** ✅ Configured & Verified

---

## 2. Sprint Backlog & Task Status

- [x] **Context Suite Initialization** (`01_PRODUCT_AND_ROADMAP.md` through `04_SECURITY_AND_OPS.md`)
- [x] **Design Archetype Alignment** (Editorial / Minimal typography and warm paper tokens)
- [x] **Vercel Deployment Architecture** (`vercel.json` SPA catch-all rewrites & security headers)
- [x] **Local Dev Server & Preview Script** (`start-app.sh` with dedicated port 5175)
- [ ] **Directory Filtering & Map Clustering Polish** (Refined geospatial zoom & debounced search)
- [ ] **AI Multilingual Batch Parser Tuning** (High-precision chat log parsing)

---

## 3. Architecture Decision Records (ADRs)

### ADR-001: Omni-Protocol Deterministic Context Suite
- **Date:** 2026-10-02
- **Status:** Accepted
- **Context:** Need persistent, unambiguous system memory to prevent context rot and guide autonomous development.
- **Decision:** Adopted the "Essential 4 + State" context matrix in `.context/` (`01_PRODUCT_AND_ROADMAP.md`, `02_SYSTEM_ARCHITECTURE.md`, `03_DESIGN_SYSTEM.md`, `04_SECURITY_AND_OPS.md`, `05_STATE.md`).
- **Consequences:** All future feature implementations and visual iterations must strictly align with these specifications.

### ADR-002: Editorial / Minimal Visual Archetype
- **Date:** 2026-10-02
- **Status:** Accepted
- **Context:** Community directory needed a clean, elegant visual tone avoiding generic SaaS dashboard clutter.
- **Decision:** Confirmed the **Editorial / Minimal** archetype with:
  - High-character serif display (`Fraunces`) paired with legible modern sans (`Plus Jakarta Sans`) and metric mono (`JetBrains Mono`).
  - Warm paper foundation (`#FAFAF7`) and deep warm obsidian canvas (`#0C0A09`).
  - Generous whitespace, quiet subtle borders, and uncluttered bento information cards.
- **Consequences:** Eliminates visual noise while preserving high signal-to-noise ratio for founder profiles.

### ADR-003: Vercel Static Edge SPA & Client-Side BYOK Security Model
- **Date:** 2026-10-02
- **Status:** Accepted
- **Context:** Application requires zero-latency interactions, zero ongoing server hosting costs, and strong privacy guarantees for WhatsApp community members.
- **Decision:** Deploy as a static Single Page Application on Vercel's global edge network with:
  - Client-side BYOK (Bring-Your-Own-Key) Google Gemini integration stored in isolated `localStorage`.
  - SHA-256 local hash authentication for admin governance.
  - Zero third-party telemetry or central member tracking.
- **Consequences:** Guarantees 100% privacy-first data isolation and near-zero operational maintenance overhead.

### ADR-004: Design Synthesis Verification & Token Harmonization
- **Date:** 2026-10-02
- **Status:** Accepted
- **Context:** Verification of complete UI harmonization against Editorial / Minimal tokens across all core views.
- **Decision:** Fully standardized:
  - Font families: `Fraunces` serif headings, `Plus Jakarta Sans` body, `JetBrains Mono` labels.
  - Color tokens: `#FAFAF7` warm paper light canvas, `#0C0A09` obsidian dark canvas, tactile borders and micro-shadows.
  - Component consistency across Directory, Matchmaker, Alliance Atlas (Egypt GIS), AI Parser, Dashboard, and Governance Portal.
  - Code hygiene: Cleaned unused imports and dead symbols across all React components.
- **Consequences:** Provides a cohesive, publication-grade user experience with zero visual slop and optimal performance.
