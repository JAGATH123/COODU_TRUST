# 00 — Design System & Tokens (BUILD SPEC)

> **This is the build contract for the foundation file every other page imports.**
> Source of truth: the approved Claude-design canvas `NGO Website Design Enhancement/COODU Trust Redesign.dc.html` (6 frames: Home desktop Hero-A, Home Hero-B + mega-menu, Home mobile, mobile drawer, Women-Empowerment desktop, Women-Empowerment mobile), the token render `design/redesign-renders/redesign-design-tokens.png`, and the locked Style Gate in `NGO Website Design Enhancement/uploads/REDESIGN-STYLE-GATE.md`.
> Build target per the Style Gate §2.2: `assets/css/tokens.css` + `base.css` + `layout.css` + `components/*.css` assembled by `main.css`. **No inline styles, no `<style>` blocks in pages, no `!important`, no hardcoded hex/px outside `tokens.css`.**

---

## 1. Purpose & coverage

This file defines the **canonical design system** for the COODU Trust rebuild: the exact CSS custom properties (color, type, space, radius, shadow, breakpoints, motion), the two web fonts, the global layout primitives (`.container`, `.section`, `.grid`), and the **shared component inventory** (button, eyebrow label, section heading, card variants, stat block, chip/tag, icon chip, header/nav/drawer, footer, hero, testimonial, CTA band). Every page (Home, the 38 program pages, project pages, About, Donate, Contact, etc.) composes these components and **never redefines a token or a component**.

The canvas itself ships a **token reference page** (rendered in `redesign-design-tokens.png`) — a style-guide/swatch sheet titled "STYLE SYSTEM". This spec covers (a) that reference sheet as a buildable page, and (b) the system primitives + components it documents. Two hero directions exist in the canvas; **Hero direction B (light split hero)** is the approved desktop home hero, **Hero A (dark gradient photo hero)** is the page-banner/mobile pattern reused by program pages. Both are specified so the shared `hero` component carries both modifiers.

**Note on the canvas format:** the `.dc.html` frames are static, fixed-width artboards (1280 desktop, 390 mobile) built from inline styles — there are **no `{{ }}` responsive bindings or `renderVals`** in the file. Breakpoint behavior below is derived by diffing the 1280 desktop frames against the 390 mobile frames, anchored to the Style Gate's declared breakpoints **600 / 900 / 1200** and mobile-first authoring.

---

## 2. Canonical tokens — `tokens.css` (`:root`)

Every value below is pulled directly from the canvas inline styles and the token render. **This is `tokens.css` in code.**

### 2.1 Color

| Token | Hex | Role / where used |
|---|---|---|
| `--color-primary` | `#1e7e34` | Brand green: primary buttons, logo tile, links/hover, eyebrow rules, active nav text, icon chips, stat numbers |
| `--color-primary-dark` | `#155d27` | Primary button hover/press, dark end of CTA gradient |
| `--color-deep` | `#11371b` | Footer background |
| `--color-dark-band` | `#161d18` | "We have only one planet" dark stats band |
| `--color-dark-menu` | `#0f2417` | Mega-menu showcase backdrop (Hero-B frame) |
| `--color-amber` | `#f4a300` | Support/secondary accent: "New" tag, hero progress dot, slider active dot, big counter numbers on dark band, eyebrow rule on dark |
| `--color-amber-text` | `#c47f00` | Accessible amber **for text on white** (mission word "Compassion.", "300%" stat) — passes contrast where `#f4a300` would not |
| `--color-amber-light` | `#f6c453` | Lighter gold eyebrow/label text **on dark backgrounds only** (hero eyebrow, CTA-band eyebrow, breadcrumb current) |
| `--color-accent` | `#e8590c` | **Donate / CTA only** — the one action that must be clicked |
| `--color-accent-dark` | `#c2410c` | Donate button hover |
| `--surface` | `#ffffff` | Page background, cards, header |
| `--surface-alt` | `#f6f8f6` | Banded sections (Core Programs, Focus Areas, partner strip, impact cards bg) |
| `--surface-tint-green` | `#eef5ef` | Round/rounded icon-chip background (green icons), avatar bg |
| `--surface-tint-orange` | `#fdebd6` | Icon-chip background for the orange "make a difference" / income icons |
| `--border` | `#e2e8e2` | Card borders, dividers, input borders, hairlines |
| `--border-soft` | `#eef1ee` | Inner stat-band dividers, section top/bottom hairlines |
| `--border-card-outer` | `#e7ece7` | Outer frame border on large screen cards |
| `--text-strong` | `#1a1f1a` | Headings, strong emphasis (near-black, never `#000`) |
| `--text-body` | `#3d433d` | Body paragraphs (also the global `body` color) |
| `--text-muted` | `#6b726b` | Captions, meta, labels, secondary text |
| `--on-dark` | `#ffffff` | Text on hero/CTA/footer dark surfaces |
| `--on-dark-80` | `rgba(255,255,255,.9)` | Hero subtitle / lead paragraph on dark |
| `--on-dark-60` | `rgba(255,255,255,.72)` | Muted copy on dark band |
| `--footer-text` | `#cfe3d4` | Footer base text |
| `--footer-text-muted` | `#a8c4af` | Footer links/body |
| `--footer-text-dim` | `#8fae97` | Footer bottom bar |
| `--color-success` | `#2e7d32` | Form success (Style Gate) |
| `--color-error` | `#c62828` | Form error (Style Gate) |

**Gradients & overlays (tokenize as named values):**
- `--grad-hero: linear-gradient(135deg, #2c5a3c, #12301e)` — Hero-A / page-banner background.
- `--overlay-hero: linear-gradient(90deg, rgba(8,26,15,.9) 0%, rgba(8,26,15,.62) 46%, rgba(8,26,15,.18) 100%)` — left-to-right legibility scrim over hero photo (desktop). Mobile uses vertical `linear-gradient(180deg, rgba(8,26,15,.5), rgba(8,26,15,.82))`.
- `--grad-cta: linear-gradient(135deg, #1e7e34, #13311f)` — dual-CTA band & program CTA.
- `--texture-weave: repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 16px, rgba(0,0,0,.05) 16px 32px)` — subtle diagonal weave laid over dark hero surfaces (decorative; placeholder image-slots use a lighter `#e8efe8/#e0e8e0` weave).

### 2.2 Typography

- **Display / headings + labels:** `--font-display: 'Oswald', system-ui, sans-serif;` weights **400, 500, 600, 700**. Headings use **600** (title case); wordmark and nav labels use **500–700** UPPERCASE.
- **Body:** `--font-body: 'Source Sans 3', system-ui, sans-serif;` weights **400, 500, 600, 700**. Body 400, emphasis 500–600, sentence case.
- **Mono (decorative captions only):** `ui-monospace, Menlo, monospace` — used **only** for the dashed placeholder-slot captions in the design; not a content font. Not required in production.
- Load: `<link>` Google Fonts `Oswald:wght@400;500;600;700` + `Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700`, `display=swap`, with `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`.
- **Case rule (Style Gate, non-negotiable):** title/sentence case for headings & body; `text-transform:uppercase` applied **per component** to labels/eyebrows/nav/wordmark ONLY. The legacy global `body{text-transform:uppercase}` is removed.

**Type scale — desktop / mobile (px), fluid via `clamp()`:**

| Token | Desktop | Mobile | Used for | line-height |
|---|---|---|---|---|
| `--fs-h1` | 48 (hero 50–53) | 31–32 | Page H1 / hero title | 1.08–1.1 |
| `--fs-h2` | 34–36 | 24–26 | Section headings | 1.15–1.18 |
| `--fs-h3` | 19–24 (cards 19–20, CTA 23) | 19–20 | Card / sub-section titles | 1.2 |
| `--fs-body` | 17 (hero/lead 18) | 15.5–16 | Paragraphs (min 16 on mobile) | 1.55–1.62 |
| `--fs-small` | 14 (13–14.5) | 13 | Meta, captions, footer body | 1.6 |
| `--fs-eyebrow` | 13 | 11–12 | Eyebrow/section kicker labels | 1 |
| `--fs-micro` | 10–12 | 10–10.5 | Stat labels, tags, tagline | 1.3–1.4 |
| `--fs-stat` | 32 (program 28, dark-band 27) | 24 (dark-band 21) | Big stat numbers | 1 |

Suggested clamps: `--fs-h1: clamp(1.9375rem, 1.1rem + 3.4vw, 3rem)` · `--fs-h2: clamp(1.5rem, 1.05rem + 1.9vw, 2.25rem)` · `--fs-body: clamp(1rem, .96rem + .2vw, 1.0625rem)`.

**Letter-spacing tokens:** `--ls-eyebrow: .16em` (section eyebrows) · `--ls-label: .08–.09em` (stat labels, footer headings) · `--ls-nav: .04em` · `--ls-wordmark: .02–.04em` · `--ls-tagline: .13em` (header sub-line). Body: normal.

### 2.3 Spacing — 8px base scale

`--space-1:.5rem (8) · --space-2:1rem (16) · --space-3:1.5rem (24) · --space-4:2rem (32) · --space-6:3rem (48) · --space-8:4rem (64) · --space-12:6rem (96)`.
Render shows the bar ladder 8 · 16 · 24 · 32 · 48 · 64 · (96).

- **Section vertical padding:** desktop **~80px** (canvas uses 74–84; standardize `--section-y: clamp(2.5rem, 1.5rem + 4vw, 5.25rem)` ≈ 40→84). Mobile **34–40px**.
- **Container max:** `--maxw: 1140px`. **Text measure:** `--maxw-text: 720px` (lead paragraphs cap ~500–560).
- **Side gutter:** desktop `--gutter: 40px`; mobile `20px` (≈ `clamp(1.25rem, .9rem + 1.2vw, 2.5rem)`).
- **Grid gaps:** card grids 22–26px desktop / 12–16px mobile; 2-col content splits 54px desktop.

### 2.4 Radius

`--radius-btn: 8px · --radius-input: 8px · --radius-card: 12px (large cards/feature 14–16) · --radius-image: 12px · --radius-pill: 999px · --radius-icon: 9–14px (icon chips) · --radius-frame: 14px (page/device frame)`.
Render chips: "radius btn 8 · card 12–14 · pill 999".

### 2.5 Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-1` | `0 2px 8px rgba(0,0,0,.06)` | Card rest, header lift |
| `--shadow-2` | `0 8px 24px rgba(0,0,0,.10)` | Card hover (cards also use `0 10px 26px rgba(0,0,0,.1)`) |
| `--shadow-band` | `0 14px 34px rgba(0,0,0,.09)` | Floating impact-stats band (overlaps hero) |
| `--shadow-float` | `0 10px 28px rgba(0,0,0,.1)` | Floating stat badge on Hero-B / overview |
| `--shadow-donate` | `0 2px 8px rgba(232,89,12,.28)` | Donate button (accent-tinted) |
| `--shadow-drawer` | `-12px 0 40px rgba(0,0,0,.25)` | Mobile nav drawer |
| `--shadow-menu` | `0 20px 50px rgba(0,0,0,.3)` | Open mega-menu panel |

### 2.6 Breakpoints (exactly three, mobile-first `min-width`)

`--bp-md: 600px · --bp-lg: 900px · --bp-xl: 1200px`. Author base = mobile; enhance up. Render chip: "bp 600 / 900 / 1200".
- **< 600 (MOBILE):** single column everywhere; hamburger + drawer.
- **600–899 (large phone / small tablet):** 2-col card grids begin; content splits may stay stacked.
- **900–1199 (TABLET / small laptop):** 2–3 col grids; condensed horizontal nav may appear or stay drawer (see §6 Build notes).
- **≥ 1200 (WEB/DESKTOP):** full multi-column layouts, inline nav, mega-menu, floating bands.

### 2.7 Motion

`--dur: 180ms · --ease: cubic-bezier(.2,.6,.2,1)`. Render chip "ease 180ms".
- Hover: color + `transform` only. Buttons lift `translateY(-1px)`; cards lift `translateY(-3px)` + shadow-1→shadow-2.
- Counters animate 0→target on the live stats; hero/stories are carousels; section reveals = gentle fade-up, once.
- **`prefers-reduced-motion: reduce`** disables reveals, counter animation (show final value), image zoom, and auto-advance.

---

## 3. Section-by-section layout — the **Token Reference page** (`redesign-design-tokens.png`)

This is the buildable style-guide page the render depicts ("STYLE SYSTEM"). It is the human-readable companion to `tokens.css`. Structure top→bottom: page title + subtitle → **COLOR** → **TYPOGRAPHY** → **SPACING · SHAPE · MOTION**.

### WEB (≥1200)
- **Header block:** H1 "STYLE SYSTEM" (Oswald 700, `--text-strong`), sub-line "Every value below is the Style Gate in code — port straight into `tokens.css`." (`--fs-small`, `--text-muted`, with `tokens.css` in mono).
- **COLOR:** eyebrow "COLOR" (`--color-primary`, `--ls-eyebrow`, uppercase) over a **2-column swatch grid** (12 swatches): each row = rounded color square (~22px, `--radius-icon`) + name (`--text-strong`, Oswald 600 micro) + hex (`--text-muted`, mono). Left column: Primary, Deep, Amber, Surface-alt, Text-strong, Text-muted. Right column: Primary-dark, Dark band, Accent/Donate, Border, Text-body, Amber-text.
- **TYPOGRAPHY:** eyebrow "TYPOGRAPHY" over **2 specimen cards** side by side (bordered, `--radius-card`, `--space-3` pad): card 1 "Oswald" set large + meta "Display & labels · 600/700 · Title-case headings, UPPERCASE labels [~14–16px]"; card 2 "Source Sans 3" + meta "Body · 400/600 · sentence case · line-height 1.6". Below: a **type-scale chip row** — `H1 48/32  H2 34/26  H3 24/20  Body 17/16  Small 14` with caption "desktop / mobile".
- **SPACING · SHAPE · MOTION:** eyebrow over a **spacing bar ladder** (ascending green bars 8/16/24/32/48/64 + barcode-style 96) labelled beneath; then a **chip row**: `radius btn 8` · `card 12–14` · `pill 999` · `maxw 1140 · text 720` · `bp 600 / 900 / 1200` · `ease 180ms`; then **two shadow swatch cards**: "shadow-1 · rest" and "shadow-2 · hover".
- Container `--maxw` ~ centered; sections separated by `--space-8`.

### TABLET (600–1199)
- COLOR stays 2-col (or `repeat(auto-fit, minmax(150px,1fr))`). Typography specimen cards may stay 2-up at ≥900, **stack to 1-up below 900**. Type-scale chips and shape/motion chips wrap fluidly. Spacing ladder scrolls/wraps but keeps the ascending bars.

### MOBILE (<600)
- Everything **single column**: COLOR swatches 1 per row (or 2 with `minmax(140px,1fr)`), specimen cards stacked, chip rows wrap to multiple lines, shadow cards stacked. Side gutter 20px, section gap `--space-6`.

> The reference page is **not** linked into production pages; it lives as a maintainer artifact. The *real* breakpoint contract that pages follow is the home/program layout in §3b below.

---

## 3b. Section-by-section layout — **shared page composition** (Home as the reference implementation)

The home frames are the canonical demonstration of how the system composes. Document each band per breakpoint; program pages reuse the same primitives.

### HEADER (all pages)
- **WEB ≥1200:** flex row, `padding:15px 40px`, `--surface` bg, `1px var(--border)` bottom. Left = logo lockup (42px primary tile w/ `sprout` icon + 2-line wordmark "COODU TRUST" / "DINDIGUL · TAMIL NADU" tagline). Center = inline `<nav>` (Home, About, Programs▾, Get Involved▾, Documents, Media, Contact) Oswald 500 uppercase 14px, `--ls-nav`; active link = `--color-primary` text + 2px `--color-amber` underline. Right = Donate button (accent, `heart` icon, `--shadow-donate`).
- **TABLET 900–1199:** logo + Donate persist; inline nav condenses (drop tagline line, tighten gap) — or collapse to hamburger at the lower end (see Build notes). 
- **MOBILE <600:** `padding:10px 18px`; logo tile 36px + single-line wordmark (no tagline); right cluster = compact Donate (`9px 13px`, `heart`) + 40px hamburger button (`menu` icon, 1px border). Opens drawer (§5 components).

### HERO
- **WEB ≥1200 — approved Hero-B (light split):** centered `--maxw`, `padding:62px 40px 56px`, **grid `1.02fr .98fr`, gap 54px**. Left: eyebrow ("Rural development · since 2000") → H1 50px → lead 18px (max 500) → two buttons (primary "Discover our work" + accent "Donate") → **3 outline chips** (Since 2000 / 534 panchayats / 3.8L+ lives). Right: photo card `aspect-ratio:4/3` `--radius-frame`, an amber blur circle top-right, and a **floating "20+ / Years of field work" badge** bottom-left (`--shadow-float`). Below the split: full-width **partner strip** (`--surface-alt`, "In partnership with" + 5 logo placeholders).
  - *Alt Hero-A (dark photo, used as program page-banner):* min-height 566px (banner 340px), `--grad-hero` + `--texture-weave` + `--overlay-hero`, left-aligned text block max 616px over photo, eyebrow with gold rule, H1 53px white, lead, primary + outline buttons, meta row, **5 carousel dots** bottom-center (first = 26px amber pill).
- **TABLET 600–1199:** split collapses toward stacked; image either drops below text or shrinks; H1 ~`clamp` 38–46px; chips wrap. Hero-A banner keeps overlay, text block widens to gutter.
- **MOBILE <600:** **Hero-A pattern** (`linear-gradient(160deg,#2c5a3c,#10271a)` + weave + vertical scrim), `padding:32px 20px 28px`; eyebrow → H1 32px → lead 16px → **stacked full-width buttons** (primary then accent, min-height 48px) → 5 dots. Single column.

### IMPACT STATS
- **WEB ≥1200:** floating white band, **grid `repeat(4,1fr)`**, pulled up `margin-top:-54px` to overlap hero, `--border` + `--radius-frame` + `--shadow-band`; each cell = 46px green icon chip + 32px Oswald number + uppercase micro label; vertical `--border-soft` dividers between; caption below.
- **TABLET 600–1199:** 4-col may hold at ≥900; **2×2** at 600–899; remove the −54 overlap (sits in normal flow) when it would collide.
- **MOBILE <600:** eyebrow "Our impact at a glance" + **2×2 grid**, each stat a **bordered card** (not divider cells): 40px icon chip, 24px number, 10.5px label. `gap:12px`.

### MISSION / "WHO WE ARE"
- **WEB ≥1200:** grid `1.04fr 1fr`, gap 54px, centered. Left = video/media frame `aspect-ratio:16/9` with center play button. Right = eyebrow "Who we are" → H2 36px with colored tri-words (`Community.` green / `Compassion.` amber-text / `Collaboration.` green) → mission paragraph → primary button.
- **TABLET:** 2-col may persist at ≥900 (tighten gap); stacks below 900.
- **MOBILE <600:** **stacked** — media frame first (16:9, play btn), then eyebrow, H2 25px, paragraph 16px, full-width primary button (min-height 48px).

### CORE PROGRAMS
- **WEB ≥1200:** `--surface-alt` band, top/bottom `--border-soft`. Centered heading group (eyebrow flanked by two 24px rules + H2 36px + sub). **`repeat(3,1fr)` card grid, gap 26px** — 6 program cards (Environment, Sustainable Agriculture, Women Empowerment [amber "New" tag], Education, Health, Consultancy). Centered outline "View all programs" button below.
- **TABLET 900–1199:** **2-col** grid. 600–899: 2-col.
- **MOBILE <600:** eyebrow + H2 26px (no flanking rules); **single-column stack, gap 16px**; show **3 cards** + full-width outline "View all 6 programs" button.

### STORIES OF TRANSFORMATION (testimonial)
- **WEB ≥1200:** centered heading group. **Split card grid `0.92fr 1.08fr`** inside one bordered `--radius-frame` container (`--shadow-2`): left = image panel min-height 340px with category badge (pill, primary) top-left; right = quote block (64px amber quotation glyph, 21px medium quote, avatar initials + name/meta, then **3 progress dots + prev/next round arrow buttons** — next = filled primary).
- **TABLET:** split may hold at ≥900; stacks below.
- **MOBILE <600:** **stacked** card — image (16:10) with badge on top, quote 17px, avatar row, then **3 centered dots** (arrows omitted; swipe). 

### DUAL CTA BAND
- **WEB ≥1200:** `--grad-cta` band; centered eyebrow (gold) + H2 34px white; **`1fr 1fr` grid, gap 24px** of two white cards (icon chip + H3 + copy + button). Card 1 = green icon + outline "Get help"; card 2 = orange icon (`--surface-tint-orange`/`--color-accent`) + primary "Get involved".
- **TABLET:** 2-col holds ≥900; stacks below.
- **MOBILE <600:** eyebrow + H2 24px; **stacked** cards (gap 14px); buttons full-width min-height 46px.

### "ONE PLANET" LIVE STATS (dark band)
- **WEB ≥1200:** `--color-dark-band` bg, centered amber `globe` chip + H2 32px + sub; **`repeat(4,1fr)`** counter cells, each bordered `rgba(255,255,255,.1)` `--radius-frame`, 27px amber number + uppercase muted label; caption "Live counters…".
- **TABLET:** 4-col ≥900; 2×2 below.
- **MOBILE <600:** **2×2 grid**, 21px numbers, 10px labels.

### FOOTER (all pages)
- **WEB ≥1200:** `--color-deep` bg. Top grid `1.6fr 1fr 1.3fr 1fr`, gap 40px: brand+blurb / Quick Links / Contact (`<address>`) / Follow (3 social tiles). Bottom bar: top hairline `rgba(255,255,255,.12)`, space-between "© 2026…" + Privacy/Terms.
- **TABLET 600–1199:** 4-col → **2-col** (≥600) then comfortable; bottom bar stays row.
- **MOBILE <600:** **single column stack** — brand + blurb, then contact list (top hairline), then social row, then centered copyright. `padding:36px 20px 22px`.

### WOMEN-EMPOWERMENT (program template) deltas
- **Page banner** = Hero-A pattern, min-height 340px, bottom-aligned, breadcrumb (Programs › **Women Empowerment** in gold) + H1 46px + subtitle.
- **Sector overview:** WEB grid `1.08fr .92fr` — left text (eyebrow, H2 34, 2 paragraphs, **4 inline stats** 28px) + right photo `aspect-ratio:4/5` with floating "300% / Avg income rise" badge. MOBILE stacks: eyebrow, H2 25, paragraph, image 16:10, **2×2 stat cards**.
- **Focus areas:** WEB `1fr 1fr` grid of **horizontal cards** (54px icon chip left + title/desc/"Explore →"). MOBILE single column.
- **Impact:** WEB `repeat(3,1fr)` cards on `--surface` with `--surface-alt` card fill, 48px white icon chip + H3 + copy (bolded figures). MOBILE 1-col (2-col ≥600).
- **CTA:** centered max 780px, H2 36, white "Partner with us" + accent "Support our work". MOBILE stacks.

---

## 4. Components (with exact tokenized styles)

### 4.1 Button — `.btn` + modifiers
Base: `display:inline-flex; align-items:center; gap:9px; font-family:var(--font-display); font-weight:600; font-size:15px; letter-spacing:var(--ls-nav); text-transform:uppercase; border-radius:var(--radius-btn); min-height:44px; text-decoration:none; transition:background var(--dur) var(--ease), transform var(--dur) var(--ease);`
- `.btn--primary` — bg `--color-primary`, color `--on-dark`, `padding:14px 28px` (hero 15px 28px); hover `background:var(--color-primary-dark); transform:translateY(-1px)`.
- `.btn--secondary` (outline) — `background:transparent; color:var(--color-primary); border:1.5px solid var(--color-primary); padding:13px 26px`; hover fills `background:var(--color-primary); color:var(--on-dark)`.
- `.btn--cta` (Donate) — bg `--color-accent`, color `--on-dark`, `padding:12px 22px` (header) / `15px 26px` (hero), `--shadow-donate`; hover `background:var(--color-accent-dark); transform:translateY(-1px)`. Leading `heart` icon.
- `.btn--ghost-light` — on dark hero: transparent, `border:1.5px solid rgba(255,255,255,.6)`, white text; hover fills white with `--color-deep` text.
- `.btn--on-dark` — white bg / `--color-primary` text (program CTA "Partner with us").
- **Mobile:** buttons go full-width (`justify-content:center`), `min-height:48px`. Optional trailing `arrow-right` (15–17px) or leading icon.

### 4.2 Eyebrow / kicker — `.eyebrow`
`font-family:var(--font-display); font-weight:600; text-transform:uppercase; letter-spacing:var(--ls-eyebrow); font-size:var(--fs-eyebrow); color:var(--color-primary);` Optional flanking rule(s): `.eyebrow__rule{width:24px;height:2px;background:currentColor}` (centered headings flank both sides; left-aligned one side). On dark surfaces use `--color-amber-light` (hero) or `--color-amber` and a gold rule.

### 4.3 Section heading — `.section-head`
Eyebrow + `<h2>` (Oswald 600, `--fs-h2`, `--text-strong`, line-height 1.15) + optional sub-paragraph (`--fs-body`, `--text-muted`, max ~640). Centered variant `.section-head--center` (rules flank eyebrow); left variant for split layouts.

### 4.4 Card — `.card` (program/feature)
`display:flex; flex-direction:column; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-card); overflow:hidden; box-shadow:var(--shadow-1); text-decoration:none;` hover `box-shadow:var(--shadow-2); transform:translateY(-3px)`.
- `.card__media` — `aspect-ratio:16/9`; holds a corner **icon chip** (`.card__icon`: 38px, white bg, `--radius-icon`, `--color-primary`, `--shadow-1`) and optional `.tag` ("New").
- `.card__body` — `padding:20px 22px 22px`; `.card__title` Oswald 600 20px `--text-strong`; `.card__text` Source Sans 15px/1.55 `--text-body`; `.card__link` Oswald 600 uppercase 13px `--color-primary` + `arrow-right`.
- **Modifier `.card--horizontal`** (Focus Areas): `flex-direction:row; gap:20px; padding:28px`; 54px icon chip leading. Mobile reverts to stacked/full-width.
- **Modifier `.card--impact`** (program impact): `--surface-alt` fill, 48px white icon chip, no link.

### 4.5 Stat block — `.stat`
`.stat__num` Oswald 700, `--fs-stat`, `--text-strong` (or `--color-primary` in overview, `--color-amber` on dark band), line-height 1. `.stat__label` Oswald uppercase, `--fs-micro`, `--ls-label`, `--text-muted`.
- Variants: `.stat--banded` (white floating band, 46px icon chip, divider cells); `.stat--card` (bordered card, mobile 2×2); `.stat--inline` (overview 4-up, no border); `.stat--dark` (bordered translucent cell, amber number).

### 4.6 Chip / tag
- `.tag` — pill label: `--radius-pill`, Oswald 600 uppercase ~10px, `--ls-label`. `.tag--new` = `--color-amber` bg, `--text-strong` text. `.tag--category` = `--color-primary` bg, white text (story badge).
- `.chip` (hero fact chip) — `border:1px solid var(--border); border-radius:var(--radius-pill); padding:7px 14px; font:var(--fs-small) var(--font-body); color:var(--text-body)`; leading icon `--color-primary`.

### 4.7 Icon treatment — `.icon-chip`
Lucide line icons, single color, `stroke-width` 1.8–2.2 (decorative inline; nav/affordance 2.2). `.icon-chip` = rounded square (`--radius-icon`) tinted container: green = `--surface-tint-green` + `--color-primary`; orange = `--surface-tint-orange` + `--color-accent`; sizes 30 / 38 / 46 / 48 / 50 / 54px by context. Icon set is **Lucide** (sprout, heart, users, map-pin, droplets, trees, leaf, wheat, hand-heart, graduation-cap, heart-pulse, briefcase, life-buoy, heart-handshake, globe, play, arrow-right, chevron-down/up/right/left, menu, x, piggy-bank, rocket, handshake, award, landmark, sprout, users-round, target, trending-up, calendar-check, mail, phone, signal, wifi, battery-full). Decorative icons get `aria-hidden="true"`.

### 4.8 Header / nav — `.site-header`, `.site-nav`
See §3b. `.site-nav__link` Oswald 500 uppercase 14px `--ls-nav` `--text-body`; hover `--color-primary`; `.is-active` = `--color-primary` + 2px `--color-amber` bottom border. Dropdown parents carry `chevron-down`. **Mega-menu** `.mega` (Programs open): white panel `--radius-frame` `--shadow-menu`, `repeat(3,1fr)` gap 28×36, each column = icon chip + category title (Oswald 600 uppercase 15px) + sub-link list (Source Sans 13.5px `--text-muted`, hover `--color-primary`).

### 4.9 Mobile drawer — `.nav-drawer`
Right-anchored `aside` width **328px**, white, `--shadow-drawer`, full height flex column. Header row = logo + 36px close (`x`). Scroll nav: items `padding:12px 14px`, `--radius-icon`; active item = `--surface-tint-green` bg + `--color-primary` text + amber dot. Expandable "Programs" reveals indented sub-list with 2px `--border` left rule (Source Sans, sentence case, active sub = `--color-primary` 600). Footer of drawer: full-width accent "Donate now" button + phone line. Backdrop scrim `rgba(8,18,11,.55)`. Toggle: `aria-expanded`, focus-trap, `Esc` closes, background `inert` + scroll-locked.

### 4.10 Footer — `.site-footer`
See §3b. Headings Oswald uppercase 14px `--ls-label` white; links Source Sans 14.5px `--footer-text-muted` hover white; `<address>` not italic; social tiles 40px `--radius-icon` `rgba(255,255,255,.08)` hover `--color-primary`.

### 4.11 Hero — `.hero` (+ `.hero--split` / `.hero--photo` / `.hero--banner`)
Carries both directions: `.hero--split` (Hero-B light), `.hero--photo` (Hero-A dark home), `.hero--banner` (program page banner, shorter). Shared parts: `.hero__eyebrow`, `.hero__title` (Oswald 600), `.hero__lead`, `.hero__actions`, `.hero__media`, `.hero__badge` (floating stat). Overlays/gradients tokenized in §2.1.

### 4.12 Testimonial — `.quote-card`
Split (desktop) / stacked (mobile) per §3b; `.quote-card__mark` (Oswald 64px `--color-amber`), `.quote-card__text` (Source Sans 21px/1.5 weight 500 `--text-strong`), `.quote-card__author` (avatar initials `--surface-tint-green`/`--color-primary` + name Oswald 600 + meta muted), `.carousel-dots`, `.carousel-arrows` (40px round; active = filled primary).

### 4.13 CTA band — `.cta-band`
`--grad-cta` bg; centered head; grid of `.cta-card` (white, `--radius-frame`, icon chip + H3 + copy + button). Mobile stacks.

---

## 5. Content to populate (real copy — preserve verbatim)

**Brand:** Wordmark "Coodu Trust"; tagline "Dindigul · Tamil Nadu"; "A registered non-profit working towards sustainable development in Tamil Nadu, India since 2000."
**Nav (7):** Home, About, Programs (6-category mega-menu, see §6 of Style Gate content doc for full 2-level list), Get Involved (Partner / Volunteer / Donate), Documents, Media, Contact. Persistent **Donate** CTA → `donate.html`.
**Home hero:** eyebrow "Rural development across Tamil Nadu · since 2000" (Hero-A) / "Rural development · since 2000" (Hero-B); H1 "Empowering communities, transforming lives"; lead (Hero-A) "Join us in building a sustainable, equitable future for rural communities — through empowerment, health, livelihoods and environmental action."; CTAs "Discover our work" + "Donate"; meta "Dindigul, Tamil Nadu · 20+ years of field work". Hero-B chips: "Since 2000", "534 panchayats", "3.8L+ lives touched"; floating badge "20+ Years of field work".
**Impact stats (4):** 3,81,609+ Total beneficiaries · 534 Panchayats served · 18,523+ Toilets built · 26,93,250 Trees planted. Caption "Cumulative results across 20+ years of field work."
**Mission:** eyebrow "Who we are"; H2 "Community. Compassion. Collaboration."; "The mission of Coodu Trust is to improve the quality of life for economically disadvantaged individuals — providing the resources to raise their standard of living, foster self-improvement, and maximise self-empowerment."; button "Learn more about us" → `about.html`; video YouTube ID `wrG63C0qtxg`.
**Core programs (6 cards):** Environment & Resilience; Sustainable Agriculture; **Women Empowerment** (carries "New" tag — added vs legacy 5); Education & Skilling; Health, Sanitation & Waste; Consultancy & HR Management. (Descriptions per canvas; deep-links per Style Gate content doc.) Button "View all programs".
**Story (Lakshmi Devi):** badge "Women Empowerment"; quote "Coodu Trust's skill program changed my life completely. I learned tailoring and now run my own small business, supporting my family. My monthly income rose from ₹2,000 to ₹8,000."; "Lakshmi Devi — Women Empowerment Program · Dindigul". (Plus Murugan S. & Raman Kumar from content doc for the 3-slide carousel.)
**Dual CTA:** eyebrow "Get involved"; H2 "Whether you need support or want to give it"; card 1 "Are you looking for support?" → "Get help" (`contact.html`); card 2 "Do you want to make a difference?" → "Get involved" (`get-involved.html`).
**One planet:** H2 "We have only one planet"; sub "It's time to wake up to the grim reality and get our act together."; counters 8,192,242,010 World population · 1,198,948,812 Tonnes of waste dumped · 28,277,094 Tonnes of e-waste · 1.72 Earths humanity uses; caption "Live counters — figures animate upward on the live site."
**Footer:** address "H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India"; `director@coodutrust.org`; `+91-451-2461362` (`tel:+914512461362`); Quick Links (About Us, Our Programs, Careers, Donate); social (Facebook, X, Instagram); "© 2026 Coodu Trust. All rights reserved." + Privacy / Terms.
**Women-Empowerment template:** H1 "Women Empowerment" + subtitle "Empowering women as catalysts of social and economic transformation"; overview H2 "Creating sustainable change through women" + 2 paragraphs; stats 5,000+ / 450+ / 800+ / 300%; 4 focus cards (Social Empowerment & Leadership, Microfinance & Financial Inclusion, Entrepreneurship & Enterprise, SHG & Community Mobilization) → their detail pages; 6 impact cards (figures 2,000+ leaders, 800+ enterprises, 450+ SHGs, ₹50 lakhs); CTA "Join our women empowerment mission" + "Partner with us"/"Support our work".

---

## 6. Image slots (aspect ratio + subject)

All real images carry meaningful `alt`; placeholder slots are dashed in the canvas. Serve via Cloudinary sized transforms (WebP/AVIF), `loading="lazy"` + `decoding="async"` below the fold, explicit `width/height` or `aspect-ratio`.

| Slot | Ratio | Subject / alt |
|---|---|---|
| Home Hero-A photo (full-bleed) | hero band (~21:9 desktop) | Farmers / community, warm natural light |
| Home Hero-B photo card | **4:3** | Women's collective / field |
| Mission video | **16:9** | YouTube intro (`wrG63C0qtxg`) — facade thumb + play |
| Program card media ×6 | **16:9** | watershed/plantation; farmer in field; women's SHG; vocational training; health camp/sanitation; training workshop |
| Story image panel | **~3:4 desktop / 16:10 mobile** | Lakshmi Devi in tailoring workshop (+ water facility, organic farm for slides 2–3) |
| Partner logo strip ×5 | logo box ~96×26 | Partner/funder logos |
| Program banner photo | hero band (~17:6 / 340px) | Women leaders / SHG meeting |
| WE overview photo | **4:5 desktop / 16:10 mobile** | Leadership-development activity |
| Footer/header logo | square ~38–42 | Coodu Trust mark (sprout) |

Subject-mismatch fixes from content doc: don't reuse the women-empowerment photo for Education; replace the team-portrait used for Consultancy.

---

## 7. Interactions & motion + accessibility

**Interactions:**
- **Button hover** — bg darken + `translateY(-1px)`, `--dur`/`--ease`. **Card hover** — `translateY(-3px)` + shadow-1→shadow-2 (image zoom 1.03 optional, reduced-motion off).
- **Hero carousel** (Hero-A) — 5 slides auto-advance, dot nav (active = amber pill); pausable; respects reduced-motion (no auto-advance).
- **Stories carousel** — 3 slides, dots + prev/next arrows (desktop), swipe (mobile).
- **Live counters** — animate 0→target on scroll-into-view, once; reduced-motion shows final value immediately. Indian digit grouping preserved.
- **Mega-menu** — hover/focus opens on desktop ≥1200; click-toggle with `aria-expanded` for keyboard.
- **Mobile drawer** — slide-in from right + scrim; `aria-expanded` on toggle, focus trap, `Esc` to close, background `inert` + scroll-lock; expandable Programs sub-list.
- **Section reveals** — gentle fade-up, once, `IntersectionObserver`; disabled under reduced-motion.

**Accessibility (per Style Gate §2.5):**
- Landmarks on every page: `<header><nav><main><section><article><footer>`, one `<main>`, one `<h1>`, logical heading order. Skip-link `<a class="skip" href="#main">` first in `<body>`.
- `:focus-visible` outline using `--color-primary` on every interactive element; never bare `outline:none`.
- Contrast ≥4.5:1 body / ≥3:1 large+UI. **Use `--color-amber-text #c47f00` (not `#f4a300`) for amber text on white; use `--color-amber-light #f6c453` only on dark.** Hero text over photo relies on `--overlay-hero` to pass.
- Touch targets ≥44×44 (buttons 44 desktop / 48 mobile, nav links, hamburger 40→ensure 44 hit area, social tiles 40→pad to 44).
- `<html lang="en">`; mark Tamil strings `lang="ta"`. Decorative icons/weave `aria-hidden`; meaningful icons get labels. Forms (other pages): `<label for>`, `aria-live` status.
- Honor `prefers-reduced-motion: reduce`.

---

## 8. Build notes

- **Cascade / files (Style Gate §2.2):** `tokens.css` → `base.css` (reset, `html/body`, type defaults, links, `:focus-visible`, skip-link) → `layout.css` (`.container{max-width:var(--maxw);margin-inline:auto;padding-inline:var(--gutter)}`, `.section`, `.grid` helpers, `.measure`) → `components/*.css` → `pages/*.css` → assembled by `main.css` `@import` in that order. **No hex/px outside `tokens.css`; no `!important`; no `#id` styling; no inline styles.**
- **Mobile-first:** author base = mobile; enhance with `@media (min-width:600px|900px|1200px)` only. Use `clamp()`/`minmax()`/`auto-fit` so layouts are fluid between the three breakpoints, not four frozen artboards (the canvas only shows 1280 & 390 — interpolate 600/900 sensibly, e.g. program grid 1→2→3 cols at 600/1200, content splits stack until 900).
- **One shared header/footer** (Style Gate §2.4): markup lives once in `partials/header.html` + `partials/footer.html`, injected at build (`posthtml-include`/Eleventy) or runtime (`assets/js/include.js` into `<div data-include>`). Active nav via `data-page` on `<body>` — never hand-edit 50 copies. The mega-menu and drawer share the same nav data.
- **Semantic structure (Home):** `header>nav` · `main` containing `section.hero`, `section#impact`, `section#mission`, `section#programs` (cards as `<a class="card">`, a real `<ul>` if listy), `section#stories` (`<figure><blockquote><figcaption>`), `section#cta`, `section#planet`, then `footer`. Buttons that navigate = `<a>`; the drawer/menu/carousel toggles = `<button>`. Never a clickable `<div>`.
- **Tricky bits:** (1) The floating impact band's `-54px` overlap must collapse to in-flow on small screens to avoid collision. (2) Hero has **two directions** — build one `.hero` block with `--split` / `--photo` / `--banner` modifiers rather than three components; mobile always uses the dark `--photo` treatment even when desktop uses `--split`. (3) Amber has **three roles** (`--color-amber` UI / `--color-amber-text` text-on-white / `--color-amber-light` label-on-dark) — keep them distinct to stay accessible. (4) The diagonal weave + gradient overlays are decorative layers stacked under hero content (`position:absolute; inset:0; aria-hidden`). (5) Lucide via CDN in design; in production either inline an SVG sprite or ship only the used icons. (6) Drawer needs focus-trap + `inert` + scroll-lock — load that JS only where the drawer exists (it's in the shared header, so it's global but lazy-init).
- **Definition of done** (Style Gate §2.7): semantic landmarks, one `<h1>`, zero inline styles/`<style>`, shared header/footer, only tokenized values, mobile+desktop match the approved renders, keyboard-navigable with visible focus, contrast verified, 44px targets, images lazy+sized, no console errors.
