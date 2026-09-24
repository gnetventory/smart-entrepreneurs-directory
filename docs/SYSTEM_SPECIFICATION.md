# 📘 Smart Entrepreneurs Directory — Master System Specification

> **Version:** 1.0.0 (Post-Enhancement Release)  
> **Architecture:** Zero-Backend Client-Side Single Page Application (SPA)  
> **Visual Identity:** Warm Humanist Design System  
> **Primary Technology:** React 18, Vite 6, Tailwind CSS v3, Google Gemini AI API, Web Crypto API  

---

## 1. Executive Summary & Project Scope

### 1.1 Purpose & Mission
WhatsApp and Telegram entrepreneur groups suffer from rapid message turnover. Critical intros, skill offers, geographic locations, and business needs scroll past and are permanently lost in chat history.

The **Smart Entrepreneurs Directory (SED)** converts raw, unstructured WhatsApp chat intros into a living, structured, searchable, AI-enhanced directory. It empowers community admins and founders to discover peers, match synergies, export digital business cards, and analyze community growth—without requiring a server or database subscription.

### 1.2 Architectural Principles & Scope Boundaries

#### ✅ In-Scope (Core Capabilities)
* **Zero-Server Client-Side Persistence:** 100% of member data, settings, and posts live in browser `localStorage`. No backend database or server infrastructure is required.
* **Privacy-First Architecture:** Member data is never sent to third-party databases. AI processing is performed client-side using direct user-provided Gemini API keys.
* **Dual Ingestion Engine:** Supports AI-powered single introduction parsing, bulk WhatsApp group chat export parsing, and manual form entry.
* **AI Matchmaker & Connection Generator:** Analyzes profiles to calculate synergy scores (0–10) and generate personalized WhatsApp outreach drafts.
* **Geographic Visualization:** World map rendering member distributions and top country statistics.
* **Skills Exchange Bulletin Board:** 30-day auto-expiring board for skill offers and help requests.
* **Digital Business Card Engine:** Render and download high-resolution PNG business cards using `html2canvas`.
* **Hardened Security Vault:** SHA-256 Web Crypto PIN protection, 5-attempt brute-force rate-limiting, 30-minute session TTL, PII export warnings, and typed deletion confirmations.

#### ❌ Out-of-Scope (Non-Goals for v1.0)
* Multi-community SaaS tenancy (current scope is optimized for a single community instance).
* Live cloud database synchronization (all syncing is handled via JSON export/import).
* Direct WhatsApp Webhook bots (ingestion is file/text paste based).

---

## 2. Complete Feature Matrix & Capabilities

| Module ID | Feature Name | Core Functionality | Primary Components |
|---|---|---|---|
| **F01** | **Member Directory** | Debounced search (<150ms), stage filtering (Idea, Starting, Running, Growing), industry tag selector, stale profile indicator (>90 days), grid vs split matchmaker views. | `Directory.jsx`, `ProfileCard.jsx`, `EmptyState.jsx` |
| **F02** | **AI Intro & Chat Parser** | Single message parser, bulk WhatsApp chat log parser, multi-model fallback chain (`gemini-1.5-flash` → `2.0-flash` → `2.5-flash` → `1.5-pro`), rule-based local parser fallback. | `AIParser.jsx`, `EditMemberModal.jsx`, `ManualForm.jsx` |
| **F03** | **AI Synergy Matchmaker** | AI-driven profile compatibility scoring (0–10), synergy reasoning, value exchange breakdown, visual score progress bar, and instant WhatsApp outreach message drafter. | `AIMatchmaker.jsx` |
| **F04** | **World Map View** | Geographic pin visualization of member distribution, city clustering, country breakdown sidebar, and unmapped location handling. | `WorldMapView.jsx` |
| **F05** | **Skills Exchange** | Needs & Offers bulletin board, tag filtering, expiration tracker (30-day TTL), and direct contact actions. | `SkillsExchange.jsx` |
| **F06** | **Community Dashboard** | Community health analytics: stage distribution chart, top country rankings, top industry tags, and activity metrics. | `CommunityDashboard.jsx` |
| **F07** | **AI Weekly Digest** | Formatted WhatsApp broadcast generator for introducing new weekly members with AI narrative polish and copy-to-clipboard. | `WeeklyDigest.jsx` |
| **F08** | **Digital Business Card** | Standalone card generator page & modal: renders stylized card with gradient avatars, badges, and high-res PNG download. | `BusinessCardPage.jsx`, `BusinessCardModal.jsx` |
| **F09** | **User & Onboarding Guide** | Step-by-step 7-field intro writing guide, copyable community template, and direct "Paste into AI Parser" shortcut. | `IntroGuide.jsx` |
| **F10** | **Admin Security Vault** | SHA-256 PIN authentication, rate-limiting lockout, 30-min session TTL, API key manager, JSON backup export/import (Merge vs Replace), PII notice, and typed data wipe (`DELETE`). | `AdminPanel.jsx` |

---

## 3. User Options & Configuration Matrix

### 3.1 Theme & Appearance Options
* **Light Mode (Default):** Warm Humanist aesthetic (`stone-50` background, warm off-white cards, `stone-900` text).
* **Dark Mode:** High-contrast dark theme (`stone-950` background, `stone-900` cards, `stone-100` text).
* **Theme Toggle:** Instant header button switch, persisted in `localStorage` (`sed_dark_mode`).

### 3.2 Filtering & Discovery Options
* **Debounced Search Input:** Searches across Name, Role, Business Pitch, Looking For, Can Help With, Country, and City (150ms debounce).
* **Stage Filter Options:** `All Stages`, `💡 Idea`, `🚀 Starting`, `⚙️ Already Running`, `📈 Growing`.
* **Industry Tag Selector:** Dynamic dropdown populated from active community tags (FinTech, EdTech, SaaS, AI/ML, E-commerce, Marketing, etc.).
* **Layout View Modes:**
  * **Grid View:** Standard 3-column responsive card grid.
  * **Matchmaker Split View:** 2-column split comparing community **Needs** on the left against **Offers** on the right.

### 3.3 Data Import & Export Modes
* **JSON Backup Export:** Downloads complete dataset as `smart_directory_backup_[YYYY-MM-DD].json`.
* **JSON Import Modes:**
  * **Merge Mode:** Adds new members, skips duplicate names, preserves existing records.
  * **Replace All Mode:** Replaces entire database with the imported JSON snapshot.

---

## 4. Technical Specifications

### 4.1 Technology Stack & BOM

```
├── Framework:            React 18.3.1 (Concurrent Rendering)
├── Build System:         Vite 6.0.5 (ESM Module Bundling)
├── Styling:              Tailwind CSS 3.4.17 + PostCSS + Autoprefixer
├── Icons:                Lucide React 0.460.0
├── AI Integration:       @google/generative-ai 0.21.0
├── Date Handling:        date-fns 4.1.0
├── Media Generation:     html2canvas 1.4.1
├── ID Generation:        uuid 11.0.3 / Web Crypto randomUUID
├── Security Engine:      Web Crypto API (SubtleCrypto SHA-256)
└── Testing Suite:        Vitest 2.x + Testing Library React + jsdom
```

---

### 4.2 State Architecture (Tri-Split Context Pattern)

To eliminate unnecessary re-renders across un-related components, `AppContext.jsx` is split into three memoized React Contexts:

```
                      ┌────────────────────────┐
                      │      AppProvider       │
                      └───────────┬────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ MembersContext  │      │    UIContext    │      │ FiltersContext  │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤
│ • members       │      │ • activeTab     │      │ • searchQuery   │
│ • exchangePosts │      │ • darkMode      │      │ • stageFilter   │
│ • refreshFuncs  │      │ • apiKey        │      │ • viewMode      │
└─────────────────┘      │ • notification  │      └─────────────────┘
                         └─────────────────┘
```

---

### 4.3 Data Model Schemas

#### Member Record Schema
```typescript
interface Member {
  id: string;                  // UUID v4
  name: string;                // Full Name
  role: string;                // Primary role/profession (1 line)
  business: string;            // Business name + description pitch
  stage: 'idea' | 'starting' | 'running' | 'growing';
  lookingFor: string;          // What they need from community
  canHelp: string;             // What they offer to community
  location: {
    country: string;           // Country name (mapped to flag emoji)
    city: string;              // City name
  };
  phone: string;               // E.164 or normalized digit string
  tags: string[];              // 2-5 industry tags
  originalLanguage: string;    // ISO language code (e.g. 'en', 'ar')
  originalText: string;        // Raw intro text before parsing
  createdAt: string;           // ISO 8601 timestamp
  updatedAt: string;           // ISO 8601 timestamp
}
```

#### Skills Exchange Post Schema
```typescript
interface SkillsExchangePost {
  id: string;                  // UUID v4
  type: 'offer' | 'need';
  title: string;
  description: string;
  tags: string[];
  contact: string;             // WhatsApp contact info
  authorName: string;          // Author member name link
  createdAt: string;           // ISO 8601 timestamp
  expiresAt: string;           // ISO 8601 timestamp (createdAt + 30 days)
}
```

---

### 4.4 Security Architecture & Cryptographic Vault

```
                        ┌────────────────────────┐
                        │   Admin Access Request │
                        └───────────┬────────────┘
                                    │
                                    ▼
                         Is Admin PIN Configured?
                         ├── NO ──> Prompt: Set New PIN
                         └── YES ─> Verify Session / PIN Input
                                    │
                       ┌────────────┴────────────┐
                       ▼                         ▼
            Session Valid (<30m)?        Verify PIN Attempt
            ├── YES ─> Grant Access      ├── Match ─> Reset Counter, Grant Session
            └── NO  ─> Prompt PIN        └── Fail  ─> Increment Fail Counter
                                                      │
                                                      ▼
                                           Fail Count >= 5?
                                           ├── YES ─> Lockout 5 Minutes
                                           └── NO  ─> Show Remaining Attempts
```

#### Key Security Implementations
1. **SHA-256 Salted Hashing:** Admin PINs are never stored in plaintext. They are hashed using Web Crypto:
   $$\text{Hash} = \text{SHA-256}(\text{"sed-pin-salt-"} + \text{userPIN})$$
2. **Brute-Force Lockout:** Tracks failed attempts in `sessionStorage`. 5 consecutive failures lock the admin panel for 300 seconds.
3. **Session TTL:** Successful unlocks place a timestamped session token in `sessionStorage`. Expire automatically after 30 minutes of inactivity.
4. **Export PII Notice:** Modal notice warning admins about member PII handling prior to JSON downloads.
5. **Destructive Action Verification:** Clearing directory data requires explicit string confirmation (`"DELETE"`).

---

### 4.5 AI Integration & Fallback Pipeline

When calling Gemini for parsing, matchmaking, or digest generation, the engine executes a multi-stage fallback chain:

```
             ┌─────────────────────────┐
             │    AI Operation Call    │
             └────────────┬────────────┘
                          │
                          ▼
             Try: gemini-1.5-flash
             ├── Success ──> Return Result
             └── Failure ──> Try: gemini-2.0-flash
                             ├── Success ──> Return Result
                             └── Failure ──> Try: gemini-2.5-flash
                                             ├── Success ──> Return Result
                                             └── Failure ──> Try: gemini-1.5-pro
                                                             ├── Success ──> Return Result
                                                             └── Failure ──> Run Local Rule-Based Heuristic Parser
```

---

### 4.6 Performance & Build Optimizations

* **In-Memory Storage Cache:** `storage.js` maintains synchronous `_membersCache` and `_exchangeCache` pointers to prevent redundant `JSON.parse()` executions on localStorage.
* **Debounced Search:** `useDebounce(searchQuery, 150)` prevents filtering on every keystroke.
* **Vite Code Chunking:**
  * `react-vendor` (`react`, `react-dom`)
  * `ai-vendor` (`@google/generative-ai`)
  * `utils-vendor` (`date-fns`, `uuid`)
  * `media-vendor` (`html2canvas`)

---

## 5. Verification & Test Coverage

The project includes automated Vitest unit tests:

```bash
# Run Vitest test suite
npx vitest run
```

### Test Coverage Areas
* `tests/helpers.test.js`: Validates `getInitials`, `normalizePhone`, `buildWhatsAppUrl`, `memberMatchesSearch`, `generateId`, and `isStale`.
* `tests/storage.test.js`: Validates member CRUD, name deduplication, JSON import/export routines, and exchange post expiration calculations.
* `tests/gemini.test.js`: Validates `isIntroMessage` classification heuristic and `parseLocalRuleBased` fallback regex parsing.
