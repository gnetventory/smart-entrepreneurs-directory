# 04 · TECH STACK BOM (Bill of Materials)
> Smart Entrepreneurs Directory — Package Manifest & Dependency Decisions  
> Current: v1.0.0 | Node environment: ESM

---

## Runtime & Build Tooling

| Package | Version | Role | Notes |
|---|---|---|---|
| `react` | ^18.3.1 | UI framework | Concurrent mode enabled |
| `react-dom` | ^18.3.1 | DOM renderer | — |
| `vite` | ^6.0.5 | Build tool + dev server | ESM-first, HMR |
| `@vitejs/plugin-react` | ^4.3.4 | JSX transform | Uses Babel |

---

## Styling

| Package | Version | Role | Notes |
|---|---|---|---|
| `tailwindcss` | ^3.4.17 | Utility CSS framework | `darkMode: 'class'` |
| `postcss` | ^8.5.1 | CSS processor | Required by Tailwind |
| `autoprefixer` | ^10.4.20 | Vendor prefix automation | — |

### Fonts (CDN, not npm)
| Font | Weights | Usage |
|---|---|---|
| Outfit | 400, 500, 600, 700, 800 | Display / headings |
| Plus Jakarta Sans | 400, 500, 600, 700, 800 | UI body text |

---

## UI Components & Icons

| Package | Version | Role | Notes |
|---|---|---|---|
| `lucide-react` | ^0.460.0 | Icon library | Stroke-based SVG icons |

### Missing / Recommended Additions
| Package | Reason |
|---|---|
| `@headlessui/react` | Accessible modal, listbox, combobox primitives |
| `react-hot-toast` | Replace custom toast — battle-tested, accessible |
| `clsx` | Conditional className merging (replace template literals) |
| `tailwind-merge` | Prevent Tailwind class conflicts |

---

## AI / Data Processing

| Package | Version | Role | Notes |
|---|---|---|---|
| `@google/generative-ai` | ^0.21.0 | Gemini API client | Multi-model fallback chain |
| `date-fns` | ^4.1.0 | Date formatting & math | Staleness calculations |
| `uuid` | ^11.0.3 | Unique ID generation | Member + post IDs |

---

## Export / Media

| Package | Version | Role | Notes |
|---|---|---|---|
| `html2canvas` | ^1.4.1 | DOM-to-PNG screenshot | Business card downloads |

---

## Testing (Currently Missing — Enhancement Target)

| Package | Recommended | Role |
|---|---|---|
| `vitest` | ^2.x | Unit test runner (Vite-native) |
| `@testing-library/react` | ^16.x | React component testing |
| `@testing-library/user-event` | ^14.x | User interaction simulation |
| `@testing-library/jest-dom` | ^6.x | DOM assertion matchers |

---

## Development Tools (Currently Missing — Enhancement Target)

| Package | Recommended | Role |
|---|---|---|
| `eslint` | ^9.x | Code linting |
| `eslint-plugin-react` | ^7.x | React-specific rules |
| `eslint-plugin-react-hooks` | ^4.x | Hooks rules enforcement |
| `prettier` | ^3.x | Code formatting |

---

## Model Fallback Chain (Gemini)

```
Priority 1: gemini-1.5-flash    (fast, cost-effective)
Priority 2: gemini-2.0-flash    (latest flash)
Priority 3: gemini-2.5-flash    (most capable flash)
Priority 4: gemini-1.5-pro      (highest quality, last resort)
```

If all models fail → local rule-based parser (`parseLocalRuleBased`)

---

## Environment Variables

```env
# Required for AI features
VITE_GEMINI_API_KEY=your_key_here

# Optional: override default app title
VITE_APP_NAME=Smart Entrepreneurs Directory
```

Variables prefixed with `VITE_` are inlined at build time by Vite.  
**Never commit `.env` to version control.** `.env.example` is tracked instead.

---

## Build Scripts

```json
{
  "dev":     "vite",           // Start dev server (http://localhost:5173)
  "build":   "vite build",     // Production build → ./dist/
  "preview": "vite preview"    // Preview production build locally
}
```

### Recommended Additions
```json
{
  "test":    "vitest run",
  "test:ui": "vitest --ui",
  "lint":    "eslint src/",
  "format":  "prettier --write src/"
}
```
