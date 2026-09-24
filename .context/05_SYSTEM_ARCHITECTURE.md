# 05 · SYSTEM ARCHITECTURE
> Smart Entrepreneurs Directory — Directory Tree, Data Models & Component Map

---

## Directory Tree (Current State)

```
Smart Directory/
├── .context/                    # 📋 Architect's documentation suite
│   ├── ops/                     # Operations & performance docs
│   ├── security/                # Security hardening docs
│   └── specs/                   # Additional specs
├── .env                         # Local secrets (gitignored)
├── .env.example                 # Safe template (tracked)
├── .gitignore
├── dist/                        # Build output (gitignored)
├── docs/                        # Additional project documentation
├── index.html                   # App entry point (Google Fonts, meta)
├── package.json
├── postcss.config.js
├── tailwind.config.js           # Tailwind + custom tokens
├── vite.config.js
├── tests/                       # Test suite (currently empty)
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Root layout + tab router
    ├── index.css                # Global styles, Tailwind directives
    ├── contexts/
    │   └── AppContext.jsx       # Global state provider
    ├── utils/
    │   ├── constants.js         # STAGES, TAGS, SEED_MEMBERS, NAV_TABS, FLAGS
    │   ├── gemini.js            # Gemini AI integration (parse, match, digest)
    │   ├── helpers.js           # ID generation, formatting utilities
    │   └── storage.js           # localStorage CRUD for members & exchange posts
    └── components/
        ├── layout/
        │   ├── Header.jsx       # Top bar: logo, search, dark mode, sidebar toggle
        │   └── Sidebar.jsx      # Navigation tabs, collapsible on mobile
        ├── directory/
        │   └── Directory.jsx    # Member grid, search, filter, profile modal
        ├── parser/
        │   └── AIParser.jsx     # Single + bulk WhatsApp chat parser
        ├── matchmaker/
        │   └── AIMatchmaker.jsx # Member selector + AI match results
        ├── map/
        │   └── WorldMapView.jsx # Geographic visualization
        ├── exchange/
        │   └── SkillsExchange.jsx # Offer/need bulletin board
        ├── dashboard/
        │   └── CommunityDashboard.jsx # Analytics & stats
        ├── digest/
        │   └── WeeklyDigest.jsx # AI-generated WhatsApp digest
        ├── admin/
        │   └── AdminPanel.jsx   # PIN gate, export/import, settings
        ├── businesscard/        # 🔶 Unused in nav — pending integration
        ├── guide/               # 🔶 Unused in nav — pending integration
        └── common/              # Shared UI components (buttons, inputs, etc.)
```

---

## Data Models

### Member

```typescript
interface Member {
  id: string;                  // UUID v4 (uuid package)
  name: string;                // Full name
  role: string;                // One-line role/title
  business: string;            // Business name + description pitch
  stage: 'idea' | 'starting' | 'running' | 'growing';
  lookingFor: string;          // What they need from the community
  canHelp: string;             // What they offer to the community
  location: {
    country: string;           // Full country name (maps to COUNTRY_FLAGS)
    city: string;
  };
  phone: string;               // Raw phone digits (optional)
  tags: string[];              // 2–5 industry tags from INDUSTRY_TAGS enum
  originalLanguage: string;    // ISO 639-1 code (e.g., 'ar', 'en', 'fr')
  originalText: string;        // Raw text that was parsed (for audit)
  createdAt: string;           // ISO 8601 timestamp
  updatedAt: string;           // ISO 8601 timestamp
}
```

### SkillsExchangePost

```typescript
interface SkillsExchangePost {
  id: string;                  // UUID v4
  type: 'offer' | 'need';
  title: string;
  description: string;
  tags: string[];              // Category tags
  contact: string;             // WhatsApp number or name
  authorName: string;          // Links to a Member name (loose coupling)
  createdAt: string;           // ISO 8601 timestamp
  expiresAt: string;           // createdAt + 30 days
}
```

### AppState (Context Shape)

```typescript
interface AppState {
  // Data
  members: Member[];
  exchangePosts: SkillsExchangePost[];
  
  // Navigation
  activeTab: TabId;
  sidebarOpen: boolean;
  
  // Theme
  darkMode: boolean;
  
  // API
  apiKey: string;
  
  // Filters
  searchQuery: string;
  stageFilter: 'all' | Stage;
  viewMode: 'grid' | 'matchmaker';
  
  // UI
  notification: { type: 'success' | 'error' | 'warning'; message: string } | null;
}
```

---

## Storage Schema (localStorage Keys)

| Key | Value Type | Description |
|---|---|---|
| `sed_members` | `Member[]` (JSON) | All community members |
| `sed_exchange_posts` | `SkillsExchangePost[]` (JSON) | Skills exchange posts |
| `sed_gemini_api_key` | `string` | User's Gemini API key |
| `sed_dark_mode` | `'true'` \| `'false'` | Theme preference |
| `sed_admin_pin` | `string` (hashed) | Admin PIN hash |
| `sed_app_settings` | `object` (JSON) | Reserved for future settings |

---

## Navigation Architecture

```
App.jsx
├── Header (always visible)
│   ├── Logo
│   ├── SearchBar → setSearchQuery (global)
│   ├── DarkModeToggle
│   └── SidebarToggle (mobile)
├── Sidebar (collapsible)
│   └── NavTabs → setActiveTab
└── Main
    └── [activeTab] → renders one of:
        ├── Directory
        ├── AIParser
        ├── AIMatchmaker
        ├── WorldMapView
        ├── SkillsExchange
        ├── CommunityDashboard
        ├── WeeklyDigest
        └── AdminPanel
```

---

## AI Integration Architecture

```
User Input
    │
    ▼
gemini.js
    ├── initGemini(apiKey)
    │       └── GoogleGenerativeAI instance
    │
    ├── generateContentWithFallback(prompt)
    │       ├── Try gemini-1.5-flash
    │       ├── Try gemini-2.0-flash
    │       ├── Try gemini-2.5-flash
    │       └── Try gemini-1.5-pro
    │
    ├── parseIntro(rawText) ──────────── Single message parser
    ├── bulkParseChat(chatText) ──────── WhatsApp export parser
    ├── generateMatches(target, all) ─── AI matchmaker
    ├── generateOutreachMessage(a, b) ── Outreach draft
    ├── semanticSearch(query, members) ─ Search (currently local)
    └── generateWeeklyDigest(members) ── Digest generator
```

---

## Routing Strategy

**No router installed.** Navigation is tab-based via `activeTab` in `AppContext`. This is intentional for a single-page, localhost/static-deployment app with no deep linking requirements.

**If routing is needed in future:**
- Add `react-router-dom` v6
- Map tabs to URL paths (`/directory`, `/matchmaker`, etc.)
- Enables browser back/forward and direct URL sharing

---

## Deployment Target

- **Static hosting** (no server required)
- Candidates: Vercel, Netlify, GitHub Pages, local file system
- Build output: `./dist/` via `vite build`
- All data is client-side — no API server, no database
