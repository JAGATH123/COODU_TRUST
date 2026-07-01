# Media page rebuild — design spec

**Date:** 2026-07-02 · **Branch:** `redesign/home-rebuild` · **Status:** user-approved design
**Goal anchor:** rebuild COODU Trust pages cleanly from the user's Claude-design exports — semantic HTML on the shared design system, web + tablet + mobile, user approves before commit.

## 1. Sources of truth (in priority order)

1. `design/build-specs/07-media.md` — authoritative build spec.
2. `About page content/Media - COODU Trust.dc.html` + `Media - Responsive Views.dc.html` — the user's design exports (visual reference).
3. `design/build-specs/00-design-system.md` + `01-shared-chrome.md` — tokens and chrome.
4. The 5 rebuilt pages (`index/about/donate/contact/documents.html`) — living pattern reference.
5. `design/page-docs/11-media.md` is **obsolete** (describes the legacy 14-item mixed grid with a "Media Mentions" filter). Ignore where it conflicts.

## 2. User decisions (locked 2026-07-02)

1. **Add a "Milestones & Recognition" gallery category** using the real photos in `assets/images/gallery/` (APJ Kalam, Dindigul Collector, NHRC, Anna Hazare) — curated ~6–8 best shots, selected at visual review.
2. **Branded `.img-slot` placeholders** for the 7 program tiles that have no real photo. No stock photos anywhere.
3. **Press cards are branded (outlet + headline), never broken images; no links until real URLs exist.** Nothing links to `#`.
4. **Lightbox ships 4 rich + everything-else simple.** No fabricated metadata. Recognition captions drafted honestly and **verified word-by-word by the user** at review.

## 3. Approach

Static semantic HTML tiles in `media.html` with `data-*` attributes; one new page stylesheet and one new page script. Progressive enhancement: with JS disabled, all tiles are visible, filters/lightbox simply don't activate, press cards are plain cards.

### Files

| File | Action |
|---|---|
| `media.html` | Rewrite completely (legacy references to `style.css`, `responsive.css`, `main.js`, `gallery.js` are dropped) |
| `assets/css/coodu-media.css` | New, `?v=1` — all page-specific styles, `.media-*` prefix |
| `assets/js/coodu-media.js` | New, `?v=1`, deferred — filter chips, live count, lightbox |
| Shared files | Untouched; linked at `?v=5` (`coodu-tokens/base/components/motion.css`, `coodu.js`, Lucide CDN) |

`<head>`: same preconnects + Google Fonts (Oswald + Source Sans 3) block as `index.html`. `<title>Media — Coodu Trust</title>` + meta description. `<body data-page="media">`, skip-link, scroll-progress span in header.

## 4. Page structure

### 4.1 Chrome
Header and footer copied exactly from `index.html`; `Media` nav link gets `class="nav__link is-active"` + `aria-current="page"` (desktop nav and drawer). Everything else identical, including mega-menus, Donate CTA, hamburger/drawer, `data-year` footer span. Leaf body background (from `coodu-base.css`) shows through plain `.section` blocks.

### 4.2 Hero — `.media-hero`
Follows the `about-hero` pattern (component classes + page CSS):
- Real photo: the same hero image URL legacy `media.html` uses (paddy-field/ox-plough Cloudinary image) as `background-image`, dark green scrim gradient (`rgba(13,46,22,.5) → rgba(11,38,20,.72)`), min-height `clamp(360px, 60vh, 480px)`.
- Content: `.eyebrow` **"Gallery"** (amber-light on dark), H1 **"Media"**, sub **"Visual stories of our programs and media coverage of our impact"** (white 90%).
- Slow zoom: background layer scales 1.0→1.09 over 22s alternate (own element, not `background-attachment`), inside `@media (prefers-reduced-motion: no-preference)`.

### 4.3 Gallery — "Our work in action" (plain `.section`, leaf shows through)
- `.section-head` centered: eyebrow **"In the field"**, H2 **"Our work in action"**, sub: *"Real moments from our five program areas across Dindigul, Madurai, Karur and Theni — tap any photo to read the story behind it."*
- **Filter bar**: 7 chips — `All` (default active), `Agriculture & Livelihood`, `Skilling & Employment`, `Environment & Water`, `Health & Sanitation`, `Community & Infrastructure`, `Milestones & Recognition`. Chip = pill (`radius 999`), inactive: white bg / `#e4ebe5`-token border / body text; active: green bg white text. ≥600px: wrap; <600px: single-row horizontal scroll, `min-height 44px`. Buttons with `aria-pressed`.
- **Result count**: right of chips (wraps under on mobile), `aria-live="polite"`: "Showing 19 photos" / "Showing 3 in Health & Sanitation" (always "photos" wording only in the All state).
- **Grid**: `.media-grid` — 1 col base, 2 cols ≥600, 3 cols ≥1200, gap `clamp(16px, 2vw, 24px)`.

**Tile anatomy** (`.media-tile`, aspect 4/3, radius from tokens, soft shadow):
- Category pill top-left (short label: Agriculture / Skilling / Environment / Health / Community / Recognition).
- Expand button top-right: 36px circle visual, padded to ≥44px hit area, `aria-label="Open photo story: {title}"`.
- Photo `<img>` (real) **or** `.img-slot[data-ratio="4/3"]` with subject hint text (placeholder tiles). Real photos get hover zoom (motion-gated) + `loading="lazy"` + real alt text.
- Bottom gradient caption: Oswald title + one-line description (always visible, sentence case).

**Tile inventory — 19 tiles:**

Program tiles (11) — the 4 marked ● have real photos (same Cloudinary URLs legacy uses):
| # | Title | Caption | Category | Photo |
|---|---|---|---|---|
| 1 | Watershed development ● | Transforming barren lands into productive agricultural areas | agriculture | `programs/watershed-development.jpg` (Cloudinary) |
| 2 | Organic farming training | Teaching sustainable agricultural practices | agriculture | slot: "Organic farming training" |
| 3 | Skill development program ● | Empowering communities with employable skills | skilling | `programs/program-women-empowerment.jpg` (Cloudinary) |
| 4 | Vocational training center | Building skills for better livelihoods | skilling | slot |
| 5 | Environmental restoration ● | Restoring degraded ecosystems for sustainability | environment | `programs/program-environment.jpg` (Cloudinary) |
| 6 | Water conservation | Implementing sustainable water management systems | environment | slot |
| 7 | Community health camp ● | Providing healthcare access to remote communities | health | `programs/health-sanitation.jpg` (Cloudinary) |
| 8 | Clean water initiative | Installing clean water systems in villages | health | slot |
| 9 | Health awareness session | Educating communities about health and hygiene | health | slot |
| 10 | Infrastructure development | Building essential community infrastructure | community | slot |
| 11 | Community mobilization | Empowering communities for self-governance | community | slot |

Recognition tiles (6–8, real local photos from `assets/images/gallery/`, curated by quality at build; ≥1 from each folder):
| Pool | Folder | Draft title / caption (**user verifies wording**) |
|---|---|---|
| 4 photos | `apj/` | "Meeting Dr. A.P.J. Abdul Kalam" / "A proud moment for COODU Trust" |
| 15 photos | `ias/` | "District Collector's visit" / "Dr. P. Senthilkumar IAS, Collector of Dindigul, at our work exhibition" |
| 2 photos | `nhrc/` | "Human-rights training programme" / "Training session on human rights held in Dindigul" |
| 3 photos | `socialactivist/` | "With Anna Hazare" / "COODU Trust members with the veteran social activist" |

**Rich metadata** (data attributes on the 4 ● tiles; copy verbatim from legacy `media.html`):
1. *Watershed Development Project* — Dindigul District, Tamil Nadu · March 2023 · 500+ families benefited · story + tags (Water Conservation, Soil Restoration, Sustainable Agriculture, Community Development).
2. *Organic Farming Training Program* — Karur District, Tamil Nadu · January 2024 · 300+ farmers trained · story + tags. **Note:** legacy attaches this rich data to tile #2 (a placeholder-photo tile) — keep the rich data on tile #2 regardless of placeholder photo.
3. *Women's Skill Development Program* — Madurai District, Tamil Nadu · November 2023 · 250+ women empowered · story + tags.
4. *Mobile Health Camp Initiative* — Theni District, Tamil Nadu · February 2024 · 1,500+ people served · story + tags.

(Builder copies the four `data-story` texts exactly from legacy `media.html` — do not paraphrase.)

- **Filter behavior**: chip click → toggle tiles by `data-category`, update count, re-stagger visible tiles (~45 ms/tile, motion-gated). Empty state (icon + "No photos in this category yet.") implemented for robustness even though every category currently has items.

### 4.4 Lightbox — `.media-lightbox`
- Backdrop: fixed, dark green at 72% + blur, fade in. Dialog: `role="dialog" aria-modal="true"` + `aria-label` of current photo title, white, radius 18, pop animation.
- **≥900px**: row — photo pane 58% (dark green bg, image contained/covered), story pane 42% scrollable. **<900px**: stacked sheet — photo top (4/3), story below, near-fullscreen.
- Story pane: category pill, Oswald title, caption; **rich tiles add**: Location / Date / Impact stat row, "The story behind" paragraph, tag pills. Simple tiles: no fabricated fields.
- Footer row: position "n / total (current filter)", Prev / Next buttons (44px).
- Behavior: opens from tile expand button or title; nav cycles **within currently filtered tiles**, wraps; `Esc` close, arrow keys nav; overlay prev/next buttons on photo; close button rotates on hover; body+html scroll lock; **focus trap** inside the dialog, focus restored to the opening tile on close.

### 4.5 In the News — `.section--alt` band
- `.section-head` centered: eyebrow **"Press"**, H2 **"In the News"**.
- 3-col grid (≥1200) / 2 (≥600) / 1 (base): branded press cards — top: branded clipping slot (`.img-slot` 16/9 with outlet label, swap-ready for real scans); body: outlet row (`newspaper` Lucide icon + THE HINDU / TIMES OF INDIA / ANANDA VIKATAN, green, small caps style per design), Oswald headline:
  - The Hindu — "Reforestation drive transforms barren hills"
  - Times of India — "Women empowerment through skill development"
  - Ananda Vikatan — "From beneficiaries to leaders: inspiring stories"
- **No "Read article" link** rendered until real URLs are provided (design accommodates adding the link row later). Cards are not fake-clickable.

## 5. Conventions

- **Breakpoints: site convention 600/900/1200** (not the export's 768/1025). Grid columns 1→2 (600)→3 (1200); lightbox row split at 900.
- Tokens only — no new hex values, no inline styles, no `<style>` blocks. Type: Oswald display / Source Sans 3 body, sentence case everywhere.
- `.reveal` on section heads, filter bar, tiles, press cards (shared IntersectionObserver auto-inits). Stagger via existing conventions.
- All motion inside `prefers-reduced-motion: no-preference`; open/close states remain instant-functional without motion.
- A11y: `aria-pressed` chips, `aria-live` count, focus trap, visible focus rings per design, ≥44px touch targets (chips, expand, lightbox controls), meaningful alt text on every real photo, `figure/figcaption` semantics in the grid where natural.

## 6. Verification (acceptance)

1. Render harness (server :8767, headless Chrome CDP :9224, cache disabled): screenshots at **1440, 834, 390** — full page + states: filter active (e.g. Health), Recognition filter, lightbox rich, lightbox simple, mobile drawer open.
2. Multimodal review by orchestrator + an independent review agent against this spec and the design export renders.
3. Keyboard walk: Tab through chips → tiles → lightbox trap → Esc restore. Reduced-motion pass.
4. No console errors; no 404s in network log (all image paths resolve).
5. User reviews rendered screenshots (and live page) and **verifies recognition captions**; only then commit.

## 7. Explicitly deferred

- Deleting legacy `.masonry-gallery` / `.season-filter-nav` CSS from `style.css` — legacy pages still load that file; handle in the site-wide cleanup pass.
- Video tile type (build-spec "nice to have") — no real videos exist for this page; YAGNI, design accommodates adding a tile type later.
- Real press clipping scans/URLs, real field photos for the 7 placeholder tiles — swap-in points are built ready.
- Cloudinary → local asset consolidation (site-wide decision, not per-page).
