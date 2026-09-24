# 10 · SPRINT ROADMAP
> Smart Entrepreneurs Directory — Prioritized Execution Plan & Definition of Done  
> Mode: Enhance/Restructure | Generated: 2026-09-22

---

## Definition of Done (DoD)

A feature is **Done** when:
- [ ] Code is written and committed to the `develop` branch
- [ ] Component renders correctly in both light and dark mode
- [ ] Empty states are handled gracefully (no blank screens)
- [ ] Loading states are shown for async operations
- [ ] Error states are handled with user-facing messages
- [ ] Mobile layout renders correctly at 375px viewport
- [ ] No console errors or warnings
- [ ] Functionality tested manually end-to-end

---

## Sprint 0 — Foundation & Security Hardening ⚡ PRIORITY 1
> **Goal:** Fix critical security gaps and stabilize the codebase before adding features

### Tasks

- [ ] **[SEC-01]** Hash Admin PIN using Web Crypto API (SHA-256 with domain salt)
  - Migrate existing raw PIN to hashed format transparently
  - File: `src/utils/storage.js` + `src/components/admin/AdminPanel.jsx`

- [ ] **[SEC-02]** Add failed PIN attempt rate limiting
  - 5 attempts → 5-minute lockout stored in `sessionStorage`
  - Show countdown timer in lockout state

- [ ] **[SEC-03]** Add admin session TTL (30 minutes inactivity)
  - Store `sed_admin_session` with timestamp in `sessionStorage`
  - Auto-lock admin panel after inactivity

- [ ] **[SEC-04]** Add export PII warning dialog
  - "This file contains personal data. Please store securely."
  - One-time acknowledgment with checkbox

- [ ] **[SEC-05]** Add double-confirmation for "Clear All Data"
  - Require typing "DELETE" to confirm

- [ ] **[PERF-01]** Split AppContext into MembersContext + UIContext + FiltersContext
  - Prevent unnecessary re-renders on search/filter changes

- [ ] **[PERF-02]** Add `useMemo` for filtered member list in Directory
  - Debounce search input at 150ms

- [ ] **[PERF-03]** Add Vite manual chunk splitting
  - Separate `react-vendor`, `ai-vendor`, `utils-vendor`

---

## Sprint 1 — UI/UX Theme Migration 🎨 PRIORITY 2
> **Goal:** Migrate from Dark Technical Ops → Warm Humanist. Light mode becomes primary.

### Tasks

- [ ] **[UI-01]** Update Tailwind config with Warm Humanist color tokens
  - Add `stone` palette as base
  - Replace `slate-100/slate-950` base with `stone-50/stone-950`
  - Update brand colors from slate → stone in global CSS

- [ ] **[UI-02]** Update `index.html` — remove `class="dark"` from `<html>`
  - Default to light mode; respect user preference

- [ ] **[UI-03]** Rewrite Header component to Warm Humanist spec
  - Warm white background, stone borders, soft shadow
  - Logo: updated typography

- [ ] **[UI-04]** Rewrite Sidebar component to Warm Humanist spec
  - Light surface, active state with emerald accent
  - Mobile: smooth slide-in drawer

- [ ] **[UI-05]** Rewrite Directory member cards to Warm Humanist spec
  - Soft shadow, `rounded-xl`, hover lift
  - Country flag inline with location

- [ ] **[UI-06]** Update all button variants across all components
  - Primary / Secondary / Ghost / Destructive per spec in `06_UI_UX_DESIGN_SYSTEM.md`

- [ ] **[UI-07]** Implement skeleton loaders for member cards (replace any spinners)

- [ ] **[UI-08]** Update all empty states with emoji + message + CTA

---

## Sprint 2 — Missing Feature Integration 🔌 PRIORITY 3
> **Goal:** Wire up the Business Card and Guide modules into the live navigation

### Tasks

- [ ] **[FEAT-01]** Integrate Business Card Generator into nav
  - Add `businesscard` tab to `NAV_TABS` in `constants.js`
  - Add route in `App.jsx`
  - Lazy-load `html2canvas` only when tab is active
  - Apply Warm Humanist card design

- [ ] **[FEAT-02]** Integrate Onboarding Guide into nav
  - Add `guide` tab to `NAV_TABS`
  - Create step-by-step walkthrough: API key → Add member → Matchmaker
  - Dismissable with "Don't show again" localStorage flag

- [ ] **[FEAT-03]** Improve AI Parser UX
  - Add progress indicator during AI parse ("Analyzing your text...")
  - Show which model was used (Flash / Pro) after successful parse
  - Preview editable form before saving (not just raw JSON)

- [ ] **[FEAT-04]** Improve Matchmaker UX
  - Add loading state with "Analyzing 47 profiles..." progress
  - Show match score as visual bar (not just number)
  - Copy outreach message to clipboard with one click

- [ ] **[FEAT-05]** Skills Exchange improvements
  - Add tag filter chips
  - Show days remaining until post expiry
  - Allow post author to mark as "Fulfilled" (closes post)

---

## Sprint 3 — Quality & Testing 🧪 PRIORITY 4
> **Goal:** Add test infrastructure and reach reliable coverage on core utilities

### Tasks

- [ ] **[TEST-01]** Install Vitest + Testing Library
  ```bash
  npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
  ```

- [ ] **[TEST-02]** Configure Vitest in `vite.config.js`
  ```javascript
  test: { environment: 'jsdom', setupFiles: './tests/setup.js' }
  ```

- [ ] **[TEST-03]** Write unit tests for `storage.js`
  - `addMember`, `deleteMember`, `addMembers` (deduplication)
  - `addExchangePost` (expiry calculation)

- [ ] **[TEST-04]** Write unit tests for `helpers.js`
  - `generateId`, `formatDate`, sanitization helpers

- [ ] **[TEST-05]** Write unit tests for `gemini.js` local functions
  - `isIntroMessage` — test true/false classification
  - `parseLocalRuleBased` — test field extraction

- [ ] **[TEST-06]** Write component tests for `Directory`
  - Renders member cards
  - Search filter works
  - Stage filter works
  - Empty state shown when no results

- [ ] **[TEST-07]** Set up ESLint + Prettier
  ```bash
  npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks prettier
  ```

---

## Sprint 4 — Performance & Deployment 🚀 PRIORITY 5
> **Goal:** Optimize bundle, validate performance, and establish deployment workflow

### Tasks

- [ ] **[PERF-04]** Lazy load `WorldMapView` and `BusinessCard` components
  - Use React `lazy()` + `Suspense`

- [ ] **[PERF-05]** Add module-level localStorage cache in `storage.js`

- [ ] **[PERF-06]** Add session-level matchmaker result cache in `gemini.js`

- [ ] **[PERF-07]** Run Lighthouse on production build — target ≥ 90 Performance

- [ ] **[DEPLOY-01]** Configure Vercel deployment
  - Connect Git repo → auto-deploy on `main` branch push
  - Set `VITE_GEMINI_API_KEY` as Vercel environment variable

- [ ] **[DEPLOY-02]** Add auto-export reminder to Admin Panel
  - Show banner if last export was >7 days ago

---

## Backlog (Future Consideration)

| Item | Notes |
|---|---|
| Multi-community support | Requires named storage namespaces or a backend |
| Cloud sync | Firebase / Supabase integration |
| URL routing | Add `react-router-dom` for deep linking |
| Search with Gemini Embeddings | True semantic search beyond keyword matching |
| Member self-registration form | Shareable URL for members to submit their own profiles |
| WhatsApp Bot integration | Auto-parse intros from WhatsApp Cloud API webhook |
| Mobile app (React Native / PWA) | Package as installable app |
| Community admin dashboard (multi-user) | Role-based access |

---

## Velocity Reference

| Sprint | Focus | Estimated Effort |
|---|---|---|
| Sprint 0 | Security + Context refactor | 3–4 days |
| Sprint 1 | UI theme migration | 2–3 days |
| Sprint 2 | Feature integration | 3–4 days |
| Sprint 3 | Testing + linting | 2–3 days |
| Sprint 4 | Performance + deployment | 1–2 days |
| **Total** | **Full enhancement cycle** | **~2–3 weeks** |
