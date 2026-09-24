# 03 · FUNCTIONAL SPECIFICATION
> Smart Entrepreneurs Directory — Features, User Stories & Acceptance Criteria  
> Mode: Enhance/Restructure

---

## Module Inventory

| # | Module | Route/Tab | Status |
|---|---|---|---|
| F01 | Member Directory | `directory` | ✅ Exists |
| F02 | AI Member Parser | `add` | ✅ Exists |
| F03 | AI Matchmaker | `matchmaker` | ✅ Exists |
| F04 | World Map View | `map` | ✅ Exists |
| F05 | Skills Exchange | `exchange` | ✅ Exists |
| F06 | Community Dashboard | `dashboard` | ✅ Exists |
| F07 | Weekly Digest | `digest` | ✅ Exists |
| F08 | Admin Panel | `admin` | ✅ Exists |
| F09 | Business Card Generator | `businesscard` | 🔶 Component exists, not in nav |
| F10 | Onboarding / Guide | `guide` | 🔶 Component exists, not in nav |

---

## F01 · Member Directory

### User Stories
- As a **community member**, I want to browse all entrepreneurs so I can discover potential collaborators
- As a **community member**, I want to filter by business stage so I can find peers at my level
- As a **community admin**, I want to search by name, skill, or industry so I can quickly locate anyone

### Acceptance Criteria
- [ ] Card grid with avatar, name, role, business, location, stage badge, and tags
- [ ] Search bar with live filtering across name, business, canHelp, lookingFor, tags
- [ ] Stage filter (All / Idea / Starting / Running / Growing)
- [ ] Country flag displayed next to city/country
- [ ] "Stale" warning indicator on profiles not updated in >90 days
- [ ] Click card to open full profile modal (all fields + contact action)
- [ ] Empty state with CTA if no members match filters

---

## F02 · AI Member Parser

### User Stories
- As an **admin**, I want to paste a WhatsApp intro message so the AI can extract a structured profile
- As an **admin**, I want to bulk-import a full WhatsApp chat export so all intros are parsed at once
- As an **admin**, I want to review and edit parsed data before saving

### Acceptance Criteria
- [ ] Single-message parse: textarea → AI parse → editable preview form → save
- [ ] Bulk chat parse: file upload or paste → AI extracts all intros → review each → bulk save
- [ ] AI model fallback chain: `gemini-1.5-flash` → `gemini-2.0-flash` → `gemini-2.5-flash` → `gemini-1.5-pro`
- [ ] Local rule-based fallback if all AI models fail
- [ ] Duplicate detection by name before save
- [ ] Manual form entry as alternative to parsing
- [ ] Confirmation of how many members were added after bulk import

---

## F03 · AI Matchmaker

### User Stories
- As a **member**, I want to select my profile and get AI-ranked connection suggestions
- As a **member**, I want to see why I was matched so I can evaluate the recommendation
- As a **member**, I want the AI to draft an outreach message I can send on WhatsApp

### Acceptance Criteria
- [ ] Member selector dropdown (search-filtered)
- [ ] AI returns top 5 matches with score (0–10), headline, reason, mutual value explanation
- [ ] Each match card shows member mini-profile + match rationale
- [ ] "Draft Message" button generates a WhatsApp-ready outreach text
- [ ] Copy-to-clipboard for generated outreach
- [ ] Fallback: top-3 candidates by tag overlap if AI unavailable

---

## F04 · World Map View

### User Stories
- As a **community member**, I want to see where everyone in my community is located
- As an **admin**, I want to understand geographic distribution for community strategy

### Acceptance Criteria
- [ ] Interactive SVG/canvas world map with pins per member location
- [ ] Clustered pins for cities with multiple members
- [ ] Click pin to see member name, role, and stage
- [ ] Country stats sidebar: top countries by member count
- [ ] Members without location data shown in a "Location Unknown" section

---

## F05 · Skills Exchange

### User Stories
- As a **member**, I want to post what I need and what I offer so others can reach out
- As a **member**, I want to browse the board to find skill offers that match my needs

### Acceptance Criteria
- [ ] Post types: `offer` (can help) and `need` (looking for)
- [ ] Required fields: title, description, category/tags, contact info
- [ ] Posts expire automatically after 30 days
- [ ] Filter by type (offer/need) and by tag
- [ ] Delete own post (by member name match or admin override)
- [ ] Empty state encourages first post

---

## F06 · Community Dashboard

### User Stories
- As an **admin**, I want analytics about community composition so I can report on growth
- As a **member**, I want to see community health at a glance

### Acceptance Criteria
- [ ] Total member count, new this week, new this month
- [ ] Stage distribution: donut or bar chart (Idea / Starting / Running / Growing)
- [ ] Top 10 countries by member count
- [ ] Top 10 industry tags by frequency
- [ ] Recent activity feed (last 5 members added)
- [ ] Staleness indicator: count of profiles not updated in >90 days

---

## F07 · Weekly Digest

### User Stories
- As an **admin**, I want to generate a formatted WhatsApp digest of new members so I can post it to the group

### Acceptance Criteria
- [ ] Date range selector (default: last 7 days)
- [ ] Shows list of new members in the period
- [ ] "Generate with AI" produces a warm, human narrative message
- [ ] Fallback: structured bullet-point format if AI unavailable
- [ ] One-click copy to clipboard in WhatsApp-optimized format (plain text, bold via `*`)
- [ ] Preview pane shows exact message as it will appear

---

## F08 · Admin Panel

### User Stories
- As an **admin**, I want PIN protection so unauthorized users can't delete community data
- As an **admin**, I want to export/import data so I can backup and restore the directory

### Acceptance Criteria
- [ ] PIN setup and change (stored as hash in localStorage)
- [ ] PIN gate before accessing admin functions
- [ ] Export all data as JSON file download
- [ ] Import JSON with merge or replace mode
- [ ] Clear all data with confirmation dialog
- [ ] Gemini API key configuration field
- [ ] Member count and last-updated stats visible in admin

---

## F09 · Business Card Generator (Enhancement Target)

### User Stories
- As a **member**, I want to generate a shareable visual business card from my directory profile

### Acceptance Criteria
- [ ] Select a member → render styled card with name, role, business, location, tags
- [ ] Download as PNG (html2canvas already installed)
- [ ] Card respects Warm Humanist design theme
- [ ] Add to sidebar navigation

---

## F10 · Onboarding Guide (Enhancement Target)

### User Stories
- As a **new user**, I want a tutorial so I know how to use the directory

### Acceptance Criteria
- [ ] Step-by-step guide covering: setting API key, adding first member, using matchmaker
- [ ] Accessible from sidebar navigation
- [ ] Dismissable, with "Don't show again" option

---

## Global Functional Requirements

- **Multilingual input:** Accept Arabic, French, Spanish, Portuguese, and auto-detect/translate via AI
- **Responsive layout:** Mobile-first; sidebar collapses to hamburger on `< md` breakpoint
- **Offline capable:** All core browsing/search functions work without internet (localStorage-backed)
- **Performance:** Initial render < 2s on average hardware; search results update < 100ms
- **Accessibility:** All interactive elements reachable via keyboard; ARIA labels on icons
