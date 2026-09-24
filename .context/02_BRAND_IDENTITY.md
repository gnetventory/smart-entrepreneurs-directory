# 02 · BRAND IDENTITY
> Smart Entrepreneurs Directory — Visual Language System  
> Vibe: **Warm Humanist**

---

## Design Philosophy

The Warm Humanist vibe rejects cold dashboard aesthetics. This is a **community product** — it must feel like a gathering place, not a database viewer. Design decisions should evoke trust, warmth, belonging, and human connection.

> **Core Principle:** Every UI element should feel like it was made by a person who cares about people — not by an algorithm.

---

## Vibe Mapping

| Attribute | Value |
|---|---|
| **Mood** | Welcoming, professional, globally curious |
| **Energy** | Active but not frantic — purposeful |
| **Trust Level** | High transparency, human voices, real faces |
| **Density** | Medium — enough info to be useful, enough space to breathe |

---

## Color System (Warm Humanist Palette)

### Light Mode (Primary Target)
```
Background Layer 0:  #FAFAF7   (warm off-white, base canvas)
Background Layer 1:  #F5F3EE   (card surfaces, slightly warmer)
Background Layer 2:  #EDE9E1   (hover states, subtle depth)

Border:              #D6D0C4   (warm gray, gentle separation)
Border Strong:       #B5ADA0   (interactive element frames)

Text Primary:        #1C1917   (near-black with warm undertone)
Text Secondary:      #57534E   (warm stone-600)
Text Muted:          #A8A29E   (stone-400, labels, metadata)

Accent Primary:      #059669   (emerald-600 — kept from existing brand)
Accent Secondary:    #0284C7   (sky-600 — trustworthy, sky link color)
Accent Warm:         #D97706   (amber-600 — growing/success states)
Accent Danger:       #DC2626   (red-600 — errors, destructive)
Accent Purple:       #7C3AED   (violet-600 — idea stage)
```

### Dark Mode (Secondary — Already default in app)
```
Background Layer 0:  #0C0A09   (stone-950)
Background Layer 1:  #1C1917   (stone-900, cards)
Background Layer 2:  #292524   (stone-800, hover)

Border:              #3F3935   (stone-700)
Text Primary:        #FAFAF9   (stone-50)
Text Secondary:      #A8A29E   (stone-400)
```

---

## Typography

### Font Pairing
| Role | Font | Weight | Size Range |
|---|---|---|---|
| **Display / Hero** | Outfit | 700–800 | 24–48px |
| **UI Body** | Plus Jakarta Sans | 400–600 | 13–16px |
| **Metadata / Labels** | Plus Jakarta Sans | 400–500 | 11–13px |
| **Monospace (API keys, IDs)** | system monospace | 400 | 12px |

### Typographic Scale
```
xs:   11px / leading-4   — badges, timestamps, meta
sm:   13px / leading-5   — secondary text, descriptions
base: 15px / leading-6   — body, card content
lg:   17px / leading-7   — section subheadings
xl:   20px / leading-8   — module headings
2xl:  24px / leading-9   — page titles
3xl:  30px+              — hero display only
```

---

## Spacing & Shape Language

- **Border Radius:** `rounded-xl` (12px) as default card radius; `rounded-2xl` (16px) for modal/hero panels; `rounded-full` for tags, badges, avatars
- **Spacing Unit:** 4px base. Cards use `p-5` or `p-6`. Sections use `gap-4` to `gap-6`.
- **Shadows:** Soft multi-layer, warm-tinted (no pure-black shadows)
  - `shadow-sm`: hover states
  - `shadow-md`: cards at rest
  - `shadow-xl`: modals, drawers
- **Glass Effect:** Reserved for overlay panels — `backdrop-blur-sm bg-white/80`

---

## Icon Language

- **Icon Library:** Lucide React (already installed)
- **Stroke Width:** `1.5` (default) — delicate, not heavy
- **Icon Size Scale:** `14px` (inline), `18px` (UI actions), `24px` (navigation), `32px+` (feature hero icons)
- **Color:** Always inherit from text context (`currentColor`) unless status-coded

---

## Component Personality Rules

| Component | Personality Rule |
|---|---|
| **Avatar** | Gradient initials only (no placeholder silhouettes) — warm gradients from palette |
| **Stage Badges** | Color-coded pills with emoji icon — communicate energy and growth stage |
| **Cards** | Soft shadow, rounded-xl, hover lifts slightly (`hover:shadow-lg hover:-translate-y-0.5`) |
| **Buttons** | Primary = filled emerald; Secondary = outlined stone; Destructive = filled red |
| **Empty States** | Always include an emoji, friendly message, and a clear CTA — never just "No data." |
| **Loading States** | Skeleton loaders with warm shimmer, not spinners alone |
| **Toasts** | Slide up from bottom-right, auto-dismiss 3.5s, no close button needed |

---

## Zero Graphic Fluff Rules

1. **No stock imagery** — use emoji, icons, or generative avatars only
2. **No decorative gradients** on text unless for a hero accent word
3. **No shadow on shadow** — pick one depth level per element
4. **No animation theater** — transitions serve orientation, not entertainment. Max duration: 300ms
5. **No color abuse** — max 2 accent colors per screen region
6. **No lorem ipsum** — empty states must use real copy that teaches the user what to do
7. **No unnecessary borders** — use space and background contrast for separation first

---

## Tone of Voice

| Context | Tone | Example |
|---|---|---|
| Empty states | Encouraging, actionable | "No members yet. Paste an intro message above to add your first member." |
| Errors | Calm, helpful | "Couldn't parse that. Try pasting more of the introduction." |
| Success | Warm, human | "Member added! Say hi to Maria." |
| Admin alerts | Direct, factual | "90 days since last update. Consider refreshing this profile." |
| Digest | Celebratory, community | "🎉 5 new entrepreneurs joined this week. Say hello!" |
