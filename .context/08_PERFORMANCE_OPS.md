# 08 · PERFORMANCE OPS
> Smart Entrepreneurs Directory — Bundle Budget, Caching, Rendering & Deployment

---

## Performance Targets

| Metric | Target | Tool to Measure |
|---|---|---|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Total Blocking Time (TBT) | < 200ms | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Search result latency | < 100ms | `performance.now()` |
| AI parse response | < 5s | User-visible progress |
| Initial JS bundle size | < 300 KB gzipped | `vite build --report` |

---

## Bundle Budget

### Current Dependencies Weight Estimate

| Package | Est. Size (gzipped) |
|---|---|
| react + react-dom | ~45 KB |
| lucide-react | ~12 KB (tree-shaken) |
| @google/generative-ai | ~30 KB |
| html2canvas | ~60 KB |
| date-fns | ~8 KB (tree-shaken) |
| uuid | ~3 KB |
| **Total estimate** | **~158 KB** |

> `html2canvas` is the heaviest dependency at ~60 KB. Lazy-load it only when Business Card tab is active.

### Optimization Rules

1. **Tree-shaking:** Only import named exports, not entire modules
   ```javascript
   // ✅ Good
   import { format, formatDistance } from 'date-fns';
   // ❌ Bad
   import dateFns from 'date-fns';
   ```

2. **Lucide icons:** Import individually
   ```javascript
   // ✅ Good — tree-shakeable
   import { Users, Sparkles, Globe } from 'lucide-react';
   ```

3. **Lazy load heavy components:**
   ```javascript
   // Lazy load map and html2canvas-dependent components
   const WorldMapView = lazy(() => import('./components/map/WorldMapView'));
   const BusinessCard = lazy(() => import('./components/businesscard/BusinessCard'));
   ```

---

## Rendering Strategy

### Currently: Full Re-render on State Change
The app uses a single `AppContext` — any state change (searchQuery, activeTab) triggers re-renders across all consumers.

### Optimization Plan

1. **Split Context:** Separate read-heavy state from write-heavy state
   ```javascript
   // Split into:
   // MembersContext (data - changes rarely)
   // UIContext (activeTab, sidebarOpen - changes often)
   // FiltersContext (searchQuery, stageFilter - changes very often)
   ```

2. **Memoize filtered member lists:**
   ```javascript
   const filteredMembers = useMemo(() => {
     return members.filter(m => matchesSearch(m, searchQuery) && matchesStage(m, stageFilter));
   }, [members, searchQuery, stageFilter]);
   ```

3. **Virtualize large member lists:**
   - If member count exceeds 200, consider `react-window` or `react-virtual`
   - For current scale (<500 members): `useMemo` is sufficient

4. **Debounce search input:**
   ```javascript
   const debouncedSearch = useDebounce(searchQuery, 150); // 150ms debounce
   ```

---

## localStorage Performance

Current pattern reads from localStorage on every `getMembers()` call:

```javascript
// Current — re-parses JSON every call
export function getMembers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS) || '[]');
}
```

### Optimization: Cache in module-level variable
```javascript
let _membersCache = null;

export function getMembers() {
  if (_membersCache) return _membersCache;
  const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
  _membersCache = raw ? JSON.parse(raw) : SEED_MEMBERS;
  return _membersCache;
}

export function saveMembers(members) {
  _membersCache = members; // update cache
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
}
```

---

## AI Request Performance

### Current Issues
- No loading indicator during AI calls
- No request cancellation on tab switch
- No caching of repeated identical requests

### Recommendations

1. **AbortController for cancellation:**
   ```javascript
   const controller = new AbortController();
   // Pass signal to fetch — note: @google/generative-ai may not support abort
   // Alternative: ignore stale responses by tracking request ID
   ```

2. **Session-level cache for matchmaker:**
   ```javascript
   const matchCache = new Map(); // key: memberId, value: results
   // Cache for 5 minutes per member
   ```

3. **Progress feedback:**
   ```javascript
   // Show spinner with estimated time:
   // "Analyzing 47 profiles... (~3 seconds)"
   ```

---

## Font Loading Strategy

Current: Google Fonts CDN with `display=swap` (good default).

### Optimization
```html
<!-- Preconnect to font servers -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Only load needed weights -->
<link href="https://fonts.googleapis.com/css2?
  family=Outfit:wght@600;700;800
  &family=Plus+Jakarta+Sans:wght@400;500;600;700
  &display=swap" rel="stylesheet">
```

Remove unused weights (400, 500 for Outfit are rarely used).

---

## Build & Deployment Pipeline

### Local Development
```bash
npm run dev      # Vite dev server on :5173 with HMR
```

### Production Build
```bash
npm run build    # Outputs to ./dist/
npm run preview  # Verify production build locally
```

### Deployment Options

| Platform | Setup | Cost |
|---|---|---|
| **Vercel** | `vercel deploy` — auto-detects Vite | Free tier |
| **Netlify** | Drag-and-drop `./dist/` or Git push | Free tier |
| **GitHub Pages** | `vite-plugin-gh-pages` + GH Actions | Free |
| **Local server** | `serve -s dist` or `python3 -m http.server` | Free |

### Vite Build Optimizations

Add to `vite.config.js`:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ai-vendor': ['@google/generative-ai'],
          'utils-vendor': ['date-fns', 'uuid', 'html2canvas'],
        }
      }
    },
    chunkSizeWarningLimit: 400, // KB
  }
});
```

---

## Performance Monitoring Checklist

- [ ] Run `npm run build` and check bundle sizes
- [ ] Run Lighthouse on production build (target: Performance ≥ 90)
- [ ] Verify search latency < 100ms with 200 member dataset
- [ ] Test AI parse response time on slow network (throttle to 3G)
- [ ] Verify `html2canvas` is NOT loaded until Business Card tab is accessed
- [ ] Check no re-renders occur on unchanged state (React DevTools Profiler)
