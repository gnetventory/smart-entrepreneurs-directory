# 06 · UI/UX DESIGN SYSTEM
> Smart Entrepreneurs Directory — Component Tokens, Patterns & Interaction Rules  
> Vibe: Warm Humanist | Framework: React + Tailwind CSS v3

---

## Design Token Reference

### Color Tokens (Tailwind Classes)

```
─── Backgrounds ───────────────────────────────────
canvas-base:     bg-stone-50 dark:bg-stone-950
canvas-card:     bg-white dark:bg-stone-900
canvas-hover:    bg-stone-100 dark:bg-stone-800
canvas-accent:   bg-emerald-50 dark:bg-emerald-950/30

─── Borders ───────────────────────────────────────
border-default:  border-stone-200 dark:border-stone-700
border-strong:   border-stone-300 dark:border-stone-600
border-accent:   border-emerald-300 dark:border-emerald-700

─── Text ──────────────────────────────────────────
text-primary:    text-stone-900 dark:text-stone-50
text-secondary:  text-stone-600 dark:text-stone-400
text-muted:      text-stone-400 dark:text-stone-500
text-accent:     text-emerald-600 dark:text-emerald-400

─── Interactive ───────────────────────────────────
focus-ring:      focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
```

---

## Component Patterns

### Card — Member Profile Card

```jsx
// Anatomy: avatar | name + role | business | location | stage | tags | actions
<div className="
  bg-white dark:bg-stone-900
  rounded-xl border border-stone-200 dark:border-stone-700
  shadow-sm hover:shadow-md
  hover:-translate-y-0.5
  transition-all duration-200
  p-5
">
  {/* Avatar — gradient initials */}
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600
                  flex items-center justify-center text-white font-bold text-lg">
    M
  </div>
  
  {/* Name & Role */}
  <h3 className="font-semibold text-stone-900 dark:text-stone-50 text-base">Name</h3>
  <p className="text-sm text-stone-500 dark:text-stone-400">Role</p>
  
  {/* Stage Badge */}
  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                   text-xs font-semibold bg-emerald-100 text-emerald-700
                   dark:bg-emerald-900/40 dark:text-emerald-300">
    ⚙️ Running
  </span>
  
  {/* Tag Pills */}
  <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800
                   text-xs text-stone-600 dark:text-stone-300">
    FinTech
  </span>
</div>
```

---

### Button Variants

```jsx
// Primary — filled emerald
<button className="
  px-4 py-2 rounded-lg font-semibold text-sm text-white
  bg-emerald-600 hover:bg-emerald-700
  focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
  transition-colors duration-150
  disabled:opacity-50 disabled:cursor-not-allowed
">

// Secondary — outlined stone
<button className="
  px-4 py-2 rounded-lg font-semibold text-sm
  text-stone-700 dark:text-stone-200
  border border-stone-300 dark:border-stone-600
  hover:bg-stone-100 dark:hover:bg-stone-800
  transition-colors duration-150
">

// Ghost — no border
<button className="
  px-4 py-2 rounded-lg font-semibold text-sm
  text-stone-600 dark:text-stone-300
  hover:bg-stone-100 dark:hover:bg-stone-800
  transition-colors duration-150
">

// Destructive — filled red
<button className="
  px-4 py-2 rounded-lg font-semibold text-sm text-white
  bg-red-600 hover:bg-red-700
  focus:ring-2 focus:ring-red-500 focus:ring-offset-2
  transition-colors duration-150
">
```

---

### Input / Textarea

```jsx
<input className="
  w-full px-3 py-2 rounded-lg text-sm
  bg-white dark:bg-stone-800
  border border-stone-200 dark:border-stone-700
  text-stone-900 dark:text-stone-100
  placeholder-stone-400 dark:placeholder-stone-500
  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
  transition-all duration-150
" />
```

---

### Select / Dropdown

```jsx
<select className="
  w-full px-3 py-2 rounded-lg text-sm
  bg-white dark:bg-stone-800
  border border-stone-200 dark:border-stone-700
  text-stone-900 dark:text-stone-100
  focus:outline-none focus:ring-2 focus:ring-emerald-500
">
```

---

### Stage Badge System

| Stage | Background | Text | Dark Background | Dark Text |
|---|---|---|---|---|
| `idea` | `bg-purple-100` | `text-purple-700` | `bg-purple-900/40` | `text-purple-300` |
| `starting` | `bg-blue-100` | `text-blue-700` | `bg-blue-900/40` | `text-blue-300` |
| `running` | `bg-emerald-100` | `text-emerald-700` | `bg-emerald-900/40` | `text-emerald-300` |
| `growing` | `bg-amber-100` | `text-amber-700` | `bg-amber-900/40` | `text-amber-300` |

---

### Avatar Gradient Assignment

Gradient index is determined by: `nameCharCode % AVATAR_GRADIENTS.length`

```javascript
const AVATAR_GRADIENTS = [
  'from-emerald-500 to-teal-600',   // 0
  'from-blue-500 to-indigo-600',    // 1
  'from-purple-500 to-violet-600',  // 2
  'from-amber-500 to-orange-600',   // 3
  'from-pink-500 to-rose-600',      // 4
  'from-cyan-500 to-sky-600',       // 5
  'from-red-500 to-orange-600',     // 6
  'from-green-500 to-emerald-600',  // 7
];
```

---

### Empty State Pattern

```jsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="text-5xl mb-4">🔍</div>
  <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">
    No members found
  </h3>
  <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xs">
    Try adjusting your search or filters. Or add a new member from the Add Member tab.
  </p>
  <button className="mt-4 ...">Add First Member</button>
</div>
```

---

### Skeleton Loader Pattern

```jsx
// Card skeleton — pulse animation with warm shimmer
<div className="animate-pulse">
  <div className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-700" />
  <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-3/4 mt-3" />
  <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-1/2 mt-2" />
</div>
```

---

### Toast Notification

```jsx
// Positioned: fixed top-6 right-6 z-50
// Animation: animate-slide-up
// Auto-dismiss: 3500ms
// Types: success (emerald), error (rose), warning (amber)
<div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl
  text-sm font-semibold flex items-center gap-2 border animate-slide-up
  ${type === 'error' ? 'bg-rose-600 text-white border-rose-500'
  : type === 'warning' ? 'bg-amber-500 text-stone-950 border-amber-400'
  : 'bg-emerald-600 text-white border-emerald-500'}`}
>
```

---

## Layout System

### Page Structure

```
┌─────────────────────────────────────────────────────┐
│ Header (sticky top)                                  │
│  Logo | Search | Actions                             │
├──────────┬──────────────────────────────────────────┤
│ Sidebar  │ Main Content Area                         │
│ (240px)  │ max-w-[1800px] px-4→px-10 py-6→py-8     │
│          │                                           │
│ NavTabs  │ [Active Module]                           │
│          │                                           │
└──────────┴──────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| `< md (768px)` | Sidebar collapses → hamburger menu; cards 1-col |
| `md (768px)` | Sidebar visible; cards 2-col |
| `lg (1024px)` | Cards 3-col |
| `xl (1280px)` | Cards 3-4-col |
| `2xl (1536px)` | Max container width 1800px, centered |

---

## Interaction Patterns

### Hover States
- Cards: `hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`
- Buttons: `hover:bg-[shade-700]` — one step darker
- Links: `hover:text-emerald-600` with `underline`
- Nav items: `hover:bg-stone-100 dark:hover:bg-stone-800`

### Focus States
- All interactive: `focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`
- Never remove `outline` without replacing with ring

### Transition Timing
```
Instant (0ms):     None — no transition
Fast (150ms):      Color changes, background fills
Normal (200ms):    Shadows, border changes
Slow (300ms):      Position transforms (slide, translate)
Never > 300ms:     Animation theater — rejected
```

---

## Accessibility Requirements

- All icon-only buttons: `aria-label="Description"`
- All form inputs: `<label>` element linked via `htmlFor`/`id`
- Modal: `role="dialog"` + `aria-modal="true"` + focus trap
- Images: `alt` attribute always present
- Color: never used as the *only* differentiator — always paired with text/icon
- Keyboard: Tab order follows visual order; no keyboard traps
