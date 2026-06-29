# Build Spec — Media / Gallery (`media.html`)

> **Build contract.** Rebuild target: clean semantic HTML + shared design-system CSS (`gallery.css` component + global tokens). NOT a CSS-overlay hack over the legacy page.
> **Design source of truth (exact values extracted):** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/About page content/Media - COODU Trust.dc.html`
> **Visual ground truth:** `design/redesign-renders/media-1280.png` (web), `design/redesign-renders/media-390.png` (mobile). Tablet render was incomplete — tablet values below are derived from the responsive bindings in the source.
> **Content source:** `design/page-docs/11-media.md`.

---

## 0. Purpose & coverage

- **Coverage:** ONE real page — the public **Media / Photo Gallery** (`media.html`), nav label "Media" (active). Not a template; one URL.
- **Job:** Visual proof of work. A **filterable photo gallery** of COODU Trust's five program areas, each tile opening a **lightbox** (rich story for tiles that have data, image-only for those that don't), plus a separate **"In the News"** press strip (3 publication cards). 
- **What the redesign changes vs legacy:** "Media Mentions" is removed from the filter set and rebuilt as the dedicated press strip; the 14-tile mixed grid becomes **11 photo tiles** (5 categories) + **3 press cards**; full-page fixed wallpaper killed; captions are now **always visible** (gradient), not hover-only; sentence-case body, caps for labels only.
- **Stats band:** there is **no standalone stats/counter band** on this page. The only stat row is the 3-up **Location / Date / Impact** grid *inside the lightbox* (rich tiles only). Do not invent a counters band.

### Breakpoints (IMPORTANT — actual source thresholds)
The source `_onResize` switches a JS `mode` state at hard pixel thresholds, and fluid `clamp()` handles everything in between:
- **web** `mode` when `window.innerWidth >= 1025`
- **tablet** `mode` when `768 <= innerWidth < 1025`
- **mobile** `mode` when `innerWidth < 768`

The brief's WEB(>=1200)/TABLET(600–1199)/MOBILE(<600) buckets are mapped below, but **the rebuild MUST use `1025px` and `768px` as the layout breakpoints** (pure CSS media queries — no JS state needed for layout). Per-breakpoint the source only swaps 6 CSS custom properties (see token table §3.0); everything else is `clamp()` fluid.

---

## 1. Section-by-section layout

Document order: **Hero → Gallery (intro + filter bar + grid + empty state) → In the News → Lightbox (overlay, conditional)**.

Shared frame for content sections: inner wrapper `max-width:1140px; margin:0 auto; padding-inline:clamp(20px,5vw,40px)`. Vertical section padding = `--sec-pad` = `clamp(56px,8vw,96px)` (comfortable) / `clamp(40px,5.5vw,68px)` (compact density variant).

### 1A. Hero — `<section>` "Gallery / Media"
- Full-bleed band, `min-height:clamp(260px,34vw,400px)`, flex-centered, `overflow:hidden`, base bg `#0f3d1b`.
- Layers: (1) absolute image-slot `inset:0` cover (hero photo, `heroZoom` 22s loop); (2) absolute scrim `linear-gradient(180deg,rgba(13,46,22,.5) 0%,rgba(11,38,20,.72) 100%)`, `pointer-events:none`; (3) centered text block `z-index:2`, `max-width:760px`, padding `clamp(48px,7vw,84px) clamp(20px,5vw,40px)`, `pointer-events:none`.
- Text block: eyebrow row (2px×22px rule · "Gallery" · rule) → H1 "Media" → subtitle (`max-width:520px`).

| Breakpoint | Behavior |
|---|---|
| **WEB (≥1025)** | H1 fluid up to 3.4rem; band up to 400px tall. Centered. |
| **TABLET (768–1024)** | Same structure; H1/padding scale down via clamp (≈40px H1). |
| **MOBILE (<768)** | Band ≈260px; H1 floor 2.1rem (≈34px); subtitle floor 15px; padding floor 48px. Text stays centered, scrim keeps legible. |

### 1B. Gallery — `<section>` "Our Work in Action", bg `#ffffff`
Three stacked blocks inside the 1140 wrapper:

**(i) Intro header** — `data-reveal`, `text-align:center; max-width:720px; margin:0 auto`. Eyebrow ("In the field", green) → H2 "Our Work in Action" → intro `<p>` (`max-width:600px`).

**(ii) Filter bar** — `margin-top:clamp(28px,3.4vw,40px)`; `display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap`.
- **Left:** chip row — `display:flex; gap:9px; flex-wrap:var(--chips-wrap); overflow-x:auto; max-width:100%; padding-bottom:2px; -webkit-overflow-scrolling:touch`. 6 chips.
- **Right:** result count text (`white-space:nowrap`).

**(iii) Grid** — `margin-top:clamp(22px,2.6vw,30px); display:grid; grid-template-columns:var(--gal-cols); gap:clamp(16px,2vw,24px)`. 11 tiles, each `aspect-ratio:4/3`.

**(iv) Empty state** — only when a filter yields 0 tiles: centered `image-off` icon + "No photos in this category yet."

| Breakpoint | `--gal-cols` | Chips | Result count |
|---|---|---|---|
| **WEB (≥1025)** | `repeat(3,1fr)` | `flex-wrap:wrap`, left-aligned, one/two rows | right-aligned, same row as chips |
| **TABLET (768–1024)** | `repeat(2,1fr)` | `wrap`, left-aligned | right side; drops below chips if cramped (flex-wrap) |
| **MOBILE (<768)** | `1fr` | `flex-wrap:nowrap` → **horizontal scroll row** (swipeable) | wraps under chip row (flex parent wraps) |

> Render note: at 1280 the grid is a clean 3-col (4 rows: 3/3/3/2 tiles). Mobile render shows 1-col full-width tiles with persistent captions.

### 1C. In the News — `<section>` "Press", bg `#f6f8f6`, `border-top:1px solid #e9eee9`
Inside 1140 wrapper: centered header (eyebrow "Press" → H2 "In the News") then press grid `margin-top:clamp(28px,3.4vw,42px); display:grid; grid-template-columns:var(--news-cols); gap:clamp(18px,2vw,26px)`. 3 cards.

| Breakpoint | `--news-cols` |
|---|---|
| **WEB (≥1025)** | `repeat(3,1fr)` — 3 across |
| **TABLET (768–1024)** | `repeat(2,1fr)` — third wraps |
| **MOBILE (<768)** | `1fr` — stacked |

### 1D. Lightbox overlay (conditional, fixed `z-index:1000`)
Backdrop `position:fixed; inset:0; display:flex; align-items:center; justify-content:center; padding:clamp(12px,3vw,40px); background:rgba(9,24,14,.72); backdrop-filter:blur(6px)`. Dialog card `width:min(1100px,94vw); max-height:90vh; border-radius:18px; overflow:hidden; display:flex; flex-direction:var(--lb-dir)`.
- **Image pane:** `flex:0 0 var(--lb-img-w); background:#0f2916; min-height:200px`, centered img cover; overlay ‹ › nav buttons at left/right edges.
- **Content pane:** `flex:1; min-width:0; overflow-y:auto; padding:clamp(24px,3vw,38px)`.

| Breakpoint | `--lb-dir` | `--lb-img-w` | Result |
|---|---|---|---|
| **WEB (≥1025)** | `row` | `58%` | Two-pane: image left 58%, story right 42% |
| **TABLET (768–1024)** | `column` | `auto` | Image on top, story scrolls below |
| **MOBILE (<768)** | `column` | `auto` | Near-fullscreen sheet, image top, story scrolls below; bottom prev/next row |

---

## 2. Image slots (aspect ratio + subject)

The design uses placeholder `<image-slot>` elements; the rebuild ships `<img>`/`<picture>` with these exact ratios. Use real Cloudinary field photos — never random stock.

| Slot id | Ratio | Subject / placeholder text | Real asset (if exists) |
|---|---|---|---|
| `media-hero` | full-bleed cover (band `clamp(260–400px)`) | "Drop hero photo — fieldwork montage" | `headers/media-bg.png` |
| `media-watershed` | 4:3 | Watershed development | `programs/watershed-development.jpg` |
| `media-organic` | 4:3 | Organic farming training | placeholder (replace) |
| `media-skill` | 4:3 | Skill development (women) | `programs/program-women-empowerment.jpg` |
| `media-vocational` | 4:3 | Vocational training | placeholder (replace) |
| `media-envrestore` | 4:3 | Environmental restoration | `programs/program-environment.jpg` |
| `media-waterconserv` | 4:3 | Water conservation | placeholder (replace) |
| `media-healthcamp` | 4:3 | Community health camp | `programs/health-sanitation.jpg` |
| `media-cleanwater` | 4:3 | Clean water initiative | placeholder (replace) |
| `media-healthaware` | 4:3 | Health awareness session | placeholder (replace) |
| `media-infra` | 4:3 | Infrastructure development | placeholder (replace) |
| `media-mobilization` | 4:3 | Community mobilization | placeholder (replace) |
| `press-hindu` | 16:9 | The Hindu clipping | supply real scan/logo card |
| `press-toi` | 16:9 | Times of India clipping | supply real scan/logo card |
| `press-vikatan` | 16:9 | Ananda Vikatan clipping | supply real scan/logo card |
| lightbox image | cover, image pane | mirrors the opened tile's photo; falls back to `image` icon + "Photo coming soon" if none |

Tile placeholder bg `#eef3ee`; press image bg `#eef3ee` with `border-bottom:1px solid #eef2ee`; lightbox image bg `#0f2916`.

---

## 3. Components & exact styles (design-token mapping)

### 3.0 Design tokens used (token name → exact value from source)
| Token | Value | Used for |
|---|---|---|
| `--primary` | `#1e7e34` | green accent, active chip, eyebrows, links, lightbox Next btn |
| `--primary-dark` | `#155d27` | hover state of primary (links, Next btn) |
| `--primary-deep` | `#15602a` | category-pill text, "The Story Behind" heading |
| `--ink` | `#18241d` | H1/H2/H3 headings, stat values |
| `--body` | `#45524b` | body copy, lightbox desc/story |
| `--chip-fg` | `#46544c` | inactive chip label |
| `--muted` | `#6f7d75` | result count |
| `--muted-2` | `#9aa69e` | stat labels, lightbox position label |
| `--muted-3` | `#8a968e` | empty-state text |
| `--muted-4` | `#b8c4bb` | empty-state icon |
| `--hero-bg` | `#0f3d1b` | hero base behind photo |
| `--lb-img-bg` | `#0f2916` | lightbox image pane bg |
| `--surface` | `#ffffff` | page + gallery bg, cards, lightbox card |
| `--surface-alt` | `#f6f8f6` | In the News section bg |
| `--surface-tile` | `#eef3ee` | image placeholder bg |
| `--tag-bg` | `#f1f6f1` | lightbox tag pill bg |
| `--tag-border` | `#dde9de` | lightbox tag pill border |
| `--border` | `#e4ebe5` | chip/press-card border, Prev btn border |
| `--border-2` | `#e9eee9` | In the News top border |
| `--border-3` | `#eef2ee` | lightbox dividers, press img divider |
| `--border-hover` | `#cfe0d4` | press card hover border |
| `--shadow-tile` | `0 3px 14px rgba(16,40,24,.08)` | gallery tiles |
| `--shadow-pill` | `0 2px 6px rgba(16,40,24,.12)` | tile category pill |
| `--shadow-card` | `0 2px 12px rgba(16,40,24,.06)` | press card rest |
| `--shadow-card-hover` | `0 24px 52px rgba(16,40,24,.14)` | press card hover |
| `--shadow-lb` | `0 40px 90px rgba(0,0,0,.4)` | lightbox card |
| `--shadow-lb-nav` | `0 4px 14px rgba(0,0,0,.25)` | lightbox arrow buttons |
| Fonts | Oswald 400/500/600/700 (headings), Inter 400/500/600/700 (body) | — |

**Per-breakpoint CSS variables** (the only things that change per breakpoint):
`--sec-pad`, `--gal-cols`, `--news-cols`, `--chips-wrap`, `--chips-justify`(always `flex-start`), `--lb-dir`, `--lb-img-w`. Values in §1 tables.

### 3.1 Eyebrow label (rule · text · rule)
`display:inline-flex; align-items:center; gap:10px`. Rules: `width:22px; height:2px; border-radius:2px`. Text: Inter 600, 12.5px, uppercase. Hero variant: rules `rgba(255,255,255,.7)`, text `rgba(255,255,255,.92)`, letter-spacing `.18em`. Section variant: rules + text `#1e7e34`, letter-spacing `.16em`.

### 3.2 Headings
- **H1 (hero):** Oswald 600, `clamp(2.1rem,5.2vw,3.4rem)`, line-height 1.08, `#ffffff`, letter-spacing .01em, margin `14px 0 0`.
- **H2 (sections):** Oswald 600, `clamp(1.75rem,3.4vw,2.5rem)`, line-height 1.14, `#18241d`, margin `14px 0 0`.
- **Hero subtitle:** Inter, `clamp(15px,1.7vw,1.18rem)`, line-height 1.6, `rgba(255,255,255,.9)`, `max-width:520px`, margin `14px auto 0`.
- **Gallery intro p:** Inter, `clamp(15px,1.2vw,16.5px)`, line-height 1.7, `#45524b`, `max-width:600px`, margin `16px auto 0`.

### 3.3 Filter chips (`<button type="button">`, pill)
- Base: Inter, 13.5px, `padding:9px 16px; border-radius:999px; border:1px solid; cursor:pointer; white-space:nowrap; flex:0 0 auto; transition:background/.26s,color/.26s,border-color/.26s`.
- **Inactive:** weight 500, fg `#46544c`, bg `#ffffff`, border `#e4ebe5`.
- **Active:** weight 600, fg `#ffffff`, bg `#1e7e34`, border `#1e7e34`.
- Hover: `border-color:#1e7e34`. Focus: `outline:2px solid rgba(30,126,52,.45); outline-offset:2px`.

### 3.4 Result count
Inter 13px, weight 500, `#6f7d75`, `white-space:nowrap`. Text: `"Showing {N} photos"` (filter=all) / `"Showing {N} in {Category full name}"`.

### 3.5 Gallery tile (`.media-tile`)
- Container: `position:relative; aspect-ratio:4/3; border-radius:14px; overflow:hidden; background:#eef3ee; box-shadow:0 3px 14px rgba(16,40,24,.08)`.
- **Image wrapper** `.zoomimg` `position:absolute; inset:0`; image cover. Hover (desktop): `transform:scale(1.05); transition:transform .5s cubic-bezier(.22,.61,.36,1)`.
- **Category pill** top-left (`top:11px; left:11px; z-index:3; pointer-events:none`): Inter 600, 10.5px, uppercase, letter-spacing .04em, color `#15602a`, bg `rgba(255,255,255,.92)`, `padding:5px 10px; border-radius:999px; box-shadow:0 2px 6px rgba(16,40,24,.12)`. Labels: Agriculture / Skilling / Environment / Health / Community.
- **Open button** top-right (`top:10px; right:10px; z-index:4`): 36×36 circle, border 0, bg `rgba(15,40,22,.55)`, white `maximize-2` icon, `backdrop-filter:blur(4px)`. Hover `bg rgba(15,40,22,.8); transform:scale(1.08)`. Focus `outline:2px solid #fff; outline-offset:2px`.
- **Caption** bottom (`z-index:3`): gradient `linear-gradient(to top,rgba(8,26,14,.82) 0%,rgba(8,26,14,.45) 55%,rgba(8,26,14,0) 100%)`, padding `34px 14px 13px`. Title = `<button>`-styled link, Oswald 600, `clamp(1rem,1.3vw,1.18rem)`, white, line-height 1.15, `pointer-events:auto`. Desc = Inter 12.5px, line-height 1.45, `rgba(255,255,255,.86)`, margin `5px 0 0`. **Caption is always visible** (not hover-gated).

### 3.6 Press card (`<a>` — whole card is the link)
- `display:flex; flex-direction:column; text-decoration:none; background:#ffffff; border:1px solid #e4ebe5; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px rgba(16,40,24,.06)`.
- Hover: `transform:translateY(-6px); box-shadow:0 24px 52px rgba(16,40,24,.14); border-color:#cfe0d4`. Focus: `outline:3px solid rgba(30,126,52,.4); outline-offset:3px`.
- Image area: `aspect-ratio:16/9; background:#eef3ee; border-bottom:1px solid #eef2ee`.
- Body: `flex:1; display:flex; flex-direction:column; padding:clamp(20px,2.2vw,26px)`.
  - Outlet row: `newspaper` icon + name, Inter 700, 11px, uppercase, letter-spacing .05em, `#1e7e34`.
  - Headline `<h3>`: Oswald 500, `clamp(1.05rem,1.4vw,1.22rem)`, `#18241d`, line-height 1.25, margin `12px 0 0`.
  - "Read article →" link: `margin-top:auto; padding-top:18px`, Inter 600, 14px, `#1e7e34`, `gap:7px`. Hover: `gap:12px; color:#155d27`.

### 3.7 Lightbox (`role="dialog" aria-modal="true"`)
- Card: `background:#ffffff; border-radius:18px; box-shadow:0 40px 90px rgba(0,0,0,.4); animation:lbPop .3s`.
- Close btn (top-right, 12/12): 40×40 circle, bg `rgba(15,40,22,.55)`, white `x` icon, blur(4). Hover `bg rgba(15,40,22,.85); transform:rotate(90deg)`.
- Arrow nav (over image, left/right 12px, vertically centered): 44×44 circle, bg `rgba(255,255,255,.92)`, color `#18241d`, `box-shadow:0 4px 14px rgba(0,0,0,.25)`, `chevron-left`/`chevron-right`. Hover `bg #fff; scale(1.08)`.
- Content pane elements:
  - Category pill: Inter 600, 10.5px, uppercase, letter-spacing .05em, color `#15602a`, bg `rgba(30,126,52,.10)`, `padding:5px 11px; border-radius:999px`.
  - Title `<h3>`: Oswald 600, `clamp(1.4rem,2.4vw,1.9rem)`, `#18241d`, line-height 1.14.
  - Desc `<p>`: Inter 15px, line-height 1.7, `#45524b`.
  - **Rich-only block:** stat grid `display:grid; grid-template-columns:repeat(3,1fr); gap:14px; padding:18px 0; border-top+bottom:1px solid #eef2ee`. Each stat: label Inter 600, 10.5px, uppercase, `#9aa69e`; value Inter 600, 13.5px, `#18241d` (Impact value `#1e7e34`).
  - "The Story Behind" heading: Inter 600, 12.5px, uppercase, letter-spacing .04em, `#15602a`; story `<p>` Inter 14.5px, line-height 1.72, `#45524b`.
  - Tag pills: Inter 500, 12px, color `#45524b`, bg `#f1f6f1`, border `1px solid #dde9de`, `padding:6px 12px; border-radius:999px`.
  - Footer row: position label (Inter 12.5px `#9aa69e`, e.g. "1 / 4") + Prev/Next buttons. **Prev:** Inter 600, 13.5px, `#45524b`, bg `#fff`, border `1px solid #e4ebe5`, radius 9px, `arrow-left` icon; hover `border-color:#1e7e34; color:#15602a`. **Next:** same metrics, white text, bg+border `#1e7e34`, `arrow-right` icon; hover bg `#155d27`.

---

## 4. Content to populate (verbatim — preserve exactly)

**Doc meta:** title "Media | Coodu Trust - Visual Stories & Press Coverage"; description "Explore Coodu Trust's programs through images and media coverage. See our five key programs in action and read about our impact in the news."

**Hero:** eyebrow "Gallery"; H1 "Media"; subtitle "Visual stories of our programs and media coverage of our impact".

**Gallery header:** eyebrow "In the field"; H2 "Our Work in Action"; intro "Real moments from our five program areas across Dindigul, Madurai, Karur and Theni — tap any photo to read the story behind it."

**Filter chips (6, in order; first active):** `All` · `Agriculture & Livelihood` (agriculture) · `Skilling & Employment` (skilling) · `Environment & Water` (environment) · `Health & Sanitation` (health) · `Community & Infrastructure` (community). *(Note: "Media Mentions" is intentionally NOT a chip — press lives in §1C.)*

**Result-count category names (full):** Agriculture & Livelihood / Skilling & Employment / Environment & Water / Health & Sanitation / Community & Infrastructure.

**11 tiles** — `category` → catLabel, **Title** — caption:
1. agriculture → Agriculture — **Watershed Development** — "Transforming barren lands into productive agricultural areas" — *rich*
2. agriculture → Agriculture — **Organic Farming Training** — "Teaching sustainable agricultural practices" — *rich*
3. skilling → Skilling — **Skill Development Program** — "Empowering communities with employable skills" — *rich*
4. skilling → Skilling — **Vocational Training Center** — "Building skills for better livelihoods" — *image-only*
5. environment → Environment — **Environmental Restoration** — "Restoring degraded ecosystems for sustainability" — *image-only*
6. environment → Environment — **Water Conservation** — "Implementing sustainable water management systems" — *image-only*
7. health → Health — **Community Health Camp** — "Providing healthcare access to remote communities" — *rich*
8. health → Health — **Clean Water Initiative** — "Installing clean water systems in villages" — *image-only*
9. health → Health — **Health Awareness Session** — "Educating communities about health and hygiene" — *image-only*
10. community → Community — **Infrastructure Development** — "Building essential community infrastructure" — *image-only*
11. community → Community — **Community Mobilization** — "Empowering communities for self-governance" — *image-only*

> Counts: agriculture ×2, skilling ×2, environment ×2, health ×3, community ×2 = 11. "All" shows "Showing 11 photos".

**Rich lightbox data (the 4 tiles with `rich:true`):**
- **Watershed Development** → title "Watershed Development Project" · Location "Dindigul District, Tamil Nadu" · Date "March 2023" · Impact "500+ families benefited" · Story "This watershed development project transformed 200 hectares of barren land into fertile agricultural fields. Through innovative water conservation techniques and soil restoration methods, we helped local farmers increase their crop yield by 60% while conserving precious water resources." · Tags: Water Conservation, Soil Restoration, Sustainable Agriculture, Community Development.
- **Organic Farming Training** → title "Organic Farming Training Program" · Karur District, Tamil Nadu · January 2024 · "300+ farmers trained" · Story "Our comprehensive organic farming training program equipped local farmers with sustainable agricultural techniques. Participants learned composting, natural pest control, and soil health management, leading to a 40% reduction in farming costs and improved crop quality." · Tags: Organic Farming, Sustainable Agriculture, Farmer Training, Environmental Protection.
- **Skill Development Program** → title "Women's Skill Development Program" · Madurai District, Tamil Nadu · November 2023 · "250+ women empowered" · Story "This transformative program provided women with valuable skills in tailoring, handicrafts, and digital literacy. Over 90% of participants now run their own small businesses, with average monthly income increasing from ₹2,000 to ₹8,000. The program also included financial literacy and entrepreneurship training." · Tags: Women Empowerment, Skill Development, Entrepreneurship, Digital Literacy.
- **Community Health Camp** → title "Mobile Health Camp Initiative" · Theni District, Tamil Nadu · February 2024 · "1,500+ people served" · Story "Our mobile health camps bring essential medical services directly to remote villages. Each camp provides general health checkups, vaccinations, maternal health services, and health education. We've established regular monthly visits to 15 villages, significantly reducing child mortality and improving overall community health." · Tags: Healthcare Access, Mobile Clinics, Preventive Care, Community Health.

> The 7 image-only tiles open a degraded lightbox (category pill + title + caption + prev/next only) — **never show fabricated Location/Date/Impact/Story**.

**In the News (3 press cards):** eyebrow "Press"; H2 "In the News".
- The Hindu — "Reforestation drive transforms barren hills" — `href:#` (replace with real article URL)
- Times of India — "Women empowerment through skill development" — `href:#`
- Ananda Vikatan — "From beneficiaries to leaders: Inspiring stories" — `href:#`

**Lightbox fixed labels (preserve):** "Location", "Date", "Impact", "The Story Behind".

**Empty state:** "No photos in this category yet."

**Footer (shared chrome — preserve):** About "Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000."; Quick Links: About Us, Our Programs, Careers, Donate; Contact "H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India", `director@coodutrust.org`, `+91-451-2461362`; "© 2025 Coodu Trust. All Rights Reserved."

---

## 5. Interactions & motion

**Keyframes (from source `<style>`):**
- `heroZoom` — `scale(1) → scale(1.09)`, `22s ease-in-out infinite alternate` on the hero photo layer.
- `mediaIn` — `opacity 0; translateY(14px) scale(.98) → none`, `.45s cubic-bezier(.22,.61,.36,1)`; applied to visible tiles on mount **and on every filter change**, staggered `i*45ms`.
- `[data-reveal]` — `opacity 0; translateY(22px) → none`, `.7s cubic-bezier(.22,.61,.36,1)`, triggered by IntersectionObserver (`rootMargin:0px 0px -8% 0px; threshold:.04`); press cards stagger via `data-stagger` = 0 / 90 / 180 ms. Safety fallback reveals all after 2800ms.
- `lbFade` (.25s) backdrop, `lbPop` (.3s cubic-bezier) dialog.
- Tile image hover zoom `.media-tile:hover .zoomimg{transform:scale(1.05)}` `.5s`.

**Filtering (gallery.js behavior to re-implement):** click chip → set active chip styles → toggle each tile `display:block/none` by category (`all` shows everything) → update result count → re-run `mediaIn` stagger on visible tiles → show empty state if 0.

**Lightbox:**
- Open from tile title-button OR open (`maximize-2`) button. Builds nav list from **currently visible (filtered)** tiles; `prev/next` wrap around (`(pos+dir+len)%len`).
- Image source is read from the tile's rendered photo; if none → "Photo coming soon" placeholder (`image` icon).
- Close: × button, click backdrop, or `Esc`. Inner card click stops propagation.
- Keyboard: `Esc` close, `ArrowRight` next, `ArrowLeft` prev.
- Body + html `overflow:hidden` while open (scroll lock); restored on close/unmount.
- On open, focus moves to the Close button (`requestAnimationFrame`).
- Position label "{pos+1} / {len}".

**Icons (lucide, stroke-width 1.75, 20×20):** `maximize-2` (tile open), `x` (close), `chevron-left`/`chevron-right` (image nav), `arrow-left`/`arrow-right` (footer prev/next), `newspaper` (press outlet), `image-off` (empty state), `image` (lightbox no-image).

### Accessibility
- **Landmarks:** wrap each section in `<section>` with an accessible name (`aria-labelledby` → the H2). Gallery uses a `<main>` landmark for the page body; hero H1 is the page title. Filter chips in a labelled group (`role="group" aria-label="Filter gallery by program"`); active chip `aria-pressed="true"`.
- **Lightbox:** `role="dialog" aria-modal="true"`, labelled by the lightbox title; **focus trap** within the dialog; return focus to the triggering tile on close; Close button has `title="Close"` (add `aria-label`). Provide a live-region announcement of "{pos+1} of {len}" on navigation.
- **Result count** in an `aria-live="polite"` region so filtering is announced.
- **Targets:** all interactive controls ≥44px effective — tile open btn is 36px (pad the hit area to 44px on touch); lightbox arrows 44px (OK); chips 9px+13.5px ≈ ~38px tall → **bump chip min-height to 44px on mobile**.
- **Contrast:** caption text is white over an 82%-opacity dark-green gradient (passes); category pill `#15602a` on `rgba(255,255,255,.92)` passes; ensure chip inactive `#46544c` on white passes (it does). Hero subtitle `rgba(255,255,255,.9)` over scrim passes.
- **Images:** every gallery/press `<img>` needs a meaningful `alt` (use the tile title/caption); decorative scrims/rules are CSS only.
- **Reduced motion:** `@media (prefers-reduced-motion:reduce)` — disable `heroZoom`, `mediaIn`, reveals (`[data-reveal]{opacity:1!important;transform:none!important}`), and tile hover zoom (`*{animation:none!important}`). Source already does this; preserve.

---

## 6. Build notes

**Semantic HTML skeleton:**
```
<main>
  <section class="media-hero" aria-labelledby="media-hero-h1"> … <h1 id="media-hero-h1">Media</h1> … </section>
  <section class="gallery" aria-labelledby="gallery-h2">
    <header class="gallery__intro"> <h2 id="gallery-h2">Our Work in Action</h2> … </header>
    <div class="gallery__bar">
      <div class="gallery__filters" role="group" aria-label="Filter gallery by program">
        <button class="chip is-active" aria-pressed="true" data-filter="all">All</button> …
      </div>
      <p class="gallery__count" aria-live="polite">Showing 11 photos</p>
    </div>
    <ul class="gallery__grid">
      <li class="media-tile" data-category="agriculture"> <figure> <img alt="…"> <figcaption> <span class="tile__cat">Agriculture</span> <h3><button class="tile__open">Watershed Development</button></h3> <p>…</p> </figcaption> </figure> <button class="tile__expand" aria-label="Open Watershed Development"></button> </li> …
    </ul>
    <p class="gallery__empty" hidden>No photos in this category yet.</p>
  </section>
  <section class="press" aria-labelledby="press-h2">
    <header> <h2 id="press-h2">In the News</h2> </header>
    <ul class="press__grid"> <li><a class="press-card" href="…"> … </a></li> … </ul>
  </section>
</main>
<div class="lightbox" role="dialog" aria-modal="true" aria-labelledby="lb-title" hidden> … </div>
```

**Reuse / shared components:**
- **Header & footer** = shared chrome (`header.css`/`footer.css`) — Media nav item active, Donate button, hamburger drawer on small screens. Not redefined here.
- **Hero** = shared page-hero pattern (`hero.css`) — photo + single dark gradient scrim (do NOT double-darken like legacy).
- **Chips** = shared pill/tag button styling (`button.css`) — sentence case, active = `--primary`.
- **Tiles + lightbox** = new `assets/css/components/gallery.css`. Ship ONE gallery system; **delete the legacy unused `.masonry-gallery / .season-filter-nav` CSS** (style.css ~2229+) noted in the design doc.
- **Press cards** = standard `.card` (`card.css`) text-link variant.
- **Lightbox stat row** = reuse `.stat` pattern (`stats.css`) for Location/Date/Impact; tag pills = shared pill.
- **JS** = `assets/js/gallery.js` (filter + lightbox + keyboard + scroll-lock + reveal/stagger observers). Layout is pure CSS media queries at 1025px / 768px — no JS `mode` state needed for layout (the source used JS only because canvas files can't run media queries).

**Tricky bits:**
1. **Rich vs image-only lightbox** — branch on a `data-rich` flag (4 tiles true). Image-only path must NOT render the stat grid / story / tags. Never fabricate fallback metadata (legacy bug).
2. **Lightbox nav list = filtered set**, not all tiles — rebuild the index list each open and wrap-around; keep prev/next in sync with the active filter.
3. **Caption always visible** — the bottom gradient + title + desc render at rest (mobile/touch have no hover). Hover adds only the image zoom (desktop).
4. **Filter order must match grid order** (Agriculture, Skilling, Environment, Health, Community) — already aligned in the source `_tiles`/`_chipDefs`.
5. **Scroll lock** must restore on close AND on unmount/navigation; lock both `body` and `html` overflow.
6. **44px targets** — pad the 36px tile expand button hit-area and set chip `min-height:44px` at mobile per §5.
7. **Press images** are currently missing assets — until real scans exist, render a branded logo/headline card (publication name + headline), never a broken `<img>`.
8. **Density variant** — `--sec-pad` has a `compact` value (`clamp(40px,5.5vw,68px)`); expose as a modifier class if the density toggle is kept, else hardcode comfortable.
