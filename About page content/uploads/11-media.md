# Media / Gallery — Design Doc

> Source read in full: `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/media.html` (+ behavior in `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/js/gallery.js`, styles in `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/css/style.css`).
> Global tokens (color, type, radius, shadow, buttons, cards) live in `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/design/REDESIGN-STYLE-GATE.md` — this doc references them, never redefines them.

## 1. Identity
- **File:** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/media.html`
- **Behavior:** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/js/gallery.js` (filtering + lightbox); shared chrome in `assets/js/main.js`.
- **Real page represented:** the public **Media / Photo Gallery** page (`media.html`), linked from the main nav as "Media".
- **COVERAGE: this doc governs 1 real page** (a single, non-templated page — there is exactly one media/gallery page in the site). It is *not* a template that fans out to many URLs.
- **One-line role/job:** Provide visual proof of work — a filterable photo gallery of COODU Trust's five program areas plus press coverage, each tile opening a lightbox with the full story (location, date, impact, narrative, tags). Per the Style Gate's per-page intent: *"Show activity proof (gallery) — filterable image/video grid, lightbox."*

---

## 2. Current structure (AS-IS) — section by section

Document order, top to bottom.

### A. Page-level background (inline soup, not a section)
- `<body>` carries an **inline** `background-image` (Cloudinary `aboutus/background.jpg`), `background-size:cover`, `center`, `fixed` attachment, `no-repeat`, `position:relative`.
- Immediately after `<body>`, a **fixed full-viewport overlay `<div>`** with inline `background: rgba(255,255,255,0.4); z-index:-1` washes the whole page white-ish.
- The gallery section then forces `background: transparent !important` (inline) so the body image shows through behind the grid.
- **Purpose:** decorative full-page wallpaper behind the gallery. **Components:** none — pure inline-styled wrappers.

### B. Header — `header.header` > `nav.navbar` (SHARED CHROME)
- Logo lockup (`coodu_frontlogo.png` + "Coodu Trust"), full nav menu with **Programs** mega-dropdown (6 themed submenus, each with its own fly-out submenu), **Get Involved** dropdown (Volunteer / Partner with Us / Donate), plus Home, About, Documents, **Media (`.active`)**, Contact, and a standalone **Donate** button + hamburger.
- **Reference only** — governed by the shared-chrome doc. Note: Media is the active nav item here.

### C. Page header / hero — `section.page-header`
- **Purpose:** page banner / title block.
- **Content:** background image = inline `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4))` over Cloudinary `headers/media-bg.png`; `h1.page-title` = "Media"; `p.page-subtitle` = "Visual stories of our programs and media coverage of our impact".
- **Components:** simple full-width photo hero with centered white title + subtitle. `.page-header` is `padding:100px 0`, `text-align:center`, `color:white`, with a `::before` `rgba(0,0,0,0.2)` scrim on top of the inline gradient (double-darkened). `.page-title` is `3.5rem`.

### D. Gallery section — `section.gallery-section.section-padding`
- **Purpose:** the core of the page — the filterable image grid.
- **Content & components, in order:**
  1. **`h2.section-title`** = "Our Work in Action".
  2. **Filter nav — `div.filter-nav`:** 7 `<button class="filter-btn">` chips. First (`All`) has `.active`. Buttons (label → `data-filter`):
     - "All" → `all`
     - "Agriculture & Livelihood" → `agriculture`
     - "Skilling & Employment" → `skilling`
     - "Environment & Water" → `environment`
     - "Health & Sanitation" → `health`
     - "Community & Infrastructure" → `community`
     - "Media Mentions" → `media-mentions`
     - Styled uppercase, 2px border, rounded, fills primary-green when hover/active. Centered, wraps.
  3. **Gallery grid — `div.gallery-grid`:** CSS `grid-template-columns: repeat(auto-fit, minmax(300px,1fr))`, `gap:30px`. **14 `div.gallery-item`** tiles. Each tile = `<img class="gallery-image">` (forced `height:250px`, `object-fit:cover`) + a `div.gallery-overlay` (hidden, slides up + fades in **on hover only**) holding `h3.gallery-title` + `p.gallery-description`. Each tile is `cursor:pointer` and opens the lightbox.
     - Tiles carry `data-category` for filtering; **only 5 of 14** also carry the rich `data-title / data-location / data-date / data-impact / data-story / data-tags` used by the lightbox (the other 9 fall back to JS defaults — see §3).
     - Category counts: agriculture ×2, skilling ×2, health ×3, environment ×2, community ×2, media-mentions ×3.
- **Filtering behavior (`gallery.js`):** clicking a filter sets `.active`, then shows/hides tiles via inline `display:block/none` matching `data-category` (or `all`).

### E. Lightbox modal — `div#lightbox.glass-modal` (hidden until opened)
- **Purpose:** "iOS glassmorphism" detail view for a tile.
- **Structure:** `.glass-modal-backdrop` + `.glass-modal-content` containing:
  - `button.glass-close-btn` (×).
  - `.glass-image-section`: `img#lightbox-img` + `.glass-image-nav` with `.glass-prev (‹)` / `.glass-next (›)` arrows.
  - `.glass-content-section`: `.glass-header` (`span#glass-category` badge + `h3#glass-title`); `.glass-details` with `p#glass-description`; a **`.glass-info-grid`** of three `.glass-info-item`s labeled **Location / Date / Impact**; a **`.glass-story`** block titled **"The Story Behind"** (`p#glass-story`); and a **`.glass-tags`** list (`#glass-tags`, pills generated from comma-split `data-tags`).
- **Behavior:** opens on tile click; prev/next cycle through *currently visible* (filtered) tiles with wrap-around; keyboard ←/→ navigate, Esc closes; click backdrop closes; body scroll locked while open. Missing data fields fall back to defaults ("Various Locations", "Ongoing", "Making a difference", a generic story).

### F. Footer — `footer.footer` (SHARED CHROME)
- 4-column footer: white logo + about blurb; Quick Links; Contact (address/email/phone); Follow Us social icons; `.footer-bottom` copyright.
- **Reference only** — governed by the shared-chrome doc.

### G. Scripts
- `assets/js/main.js` (chrome/nav), `assets/js/gallery.js` (filter + lightbox).

---

## 3. Current weaknesses (be specific & honest)

1. **Three broken images in "Media Mentions".** `media-hindu.jpg`, `media-toi.jpg`, `media-vikatan.jpg` point to `assets/images/resources/` — but that folder contains **only annual-report PNGs**; those three files do not exist. All three press tiles render as broken-image icons. **Fix:** supply real press clipping/screenshot images (or a designed "press card" with publication logo + headline) and host them; if no scans exist, redesign Media Mentions as text/logo cards that link out, not photo tiles.

2. **Seven placeholder photos via `picsum.photos`.** Tiles "Organic Farming Training" (`random=2`), "Vocational Training Center" (`random=4`), "Clean Water Initiative" (`random=5`), "Health Awareness Session" (`random=6`), "Water Conservation" (`random=8`), "Infrastructure Development" (`random=10`), "Community Mobilization" (`random=11`) load random stock photos — unrelated to the work, will change every load, and need network to a third party. **Fix:** replace with real field photos on Cloudinary; until then, the redesign should use a branded placeholder, never random stock.

3. **Only 5 of 14 tiles have real story data.** Just Watershed Development, Organic Farming Training, Women's Skill Development, and Mobile Health Camp (and the agriculture/skilling/health "rich" ones) carry `data-location/date/impact/story/tags`. The other 9 open a lightbox full of **generic fallback text** ("Various Locations", "Ongoing", "Making a difference", a boilerplate story) — looks unfinished and slightly dishonest. **Fix:** either author real metadata for every tile, or in the redesign drop the heavy story-modal for data-less tiles and use a simple image lightbox; do not show fake metadata.

4. **Overlay caption is hover-only — invisible on touch.** `.gallery-overlay` is `opacity:0` until `:hover`. On phones/tablets there is no hover, so titles/descriptions never appear before tapping; the grid reads as unlabeled images. **Fix:** show a persistent caption (or gradient + always-visible title) on mobile/tablet; reserve the slide-up reveal as a desktop nicety only.

5. **Global ALL-CAPS body + uppercase filter chips.** The legacy `text-transform:uppercase` on `<body>` plus uppercase `.filter-btn` makes everything shout and hurts readability (Tamil place names, long category labels wrap awkwardly). **Fix:** per Style Gate, caps for labels only; sentence case for body, titles, descriptions, and lightbox story.

6. **Inline-style soup + `!important`.** Body background, the fixed white overlay div, the page-header gradient, and `gallery-section { background:transparent !important }` are all inline. This is exactly the anti-pattern the Clean-Rebuild Standards kill. **Fix:** move all of it to component CSS; drop the full-page wallpaper in favor of a clean surface (see §5).

7. **Full-page fixed wallpaper + white wash fights the gallery.** A `fixed` background photo at 40% white overlay behind a transparent grid creates a muddy, low-contrast canvas and a parallax-ish jump on scroll; photos sit on a busy backdrop instead of clean whitespace. **Fix:** plain `--surface` / `--surface-alt` background; let the photographs be the color.

8. **Inconsistent tile heights vs. mixed aspect ratios.** Images are forced to a flat `250px` height regardless of source ratio, so portrait press clippings get cropped hard. **Fix:** standardize on a defined ratio (e.g. 4:3 for field photos) with `object-fit:cover`, and give press mentions their own card treatment.

9. **Two unrelated gallery CSS systems exist.** `style.css` also contains a `.gallery-hero / .masonry-gallery / .gallery-card / .season-filter-nav` system (lines ~2229+) that this page does **not** use — dead/confusing CSS. **Fix:** the rebuild ships one `gallery.css` component; delete the unused masonry/season variant.

10. **No empty-state and no count feedback.** Filtering to a category with few items (or a future empty one) gives no "showing N of M" or "no results" message; the grid just silently shrinks. **Fix:** add a result count and a graceful empty state.

11. **Filter order ≠ grid order.** Nav order is Agriculture, Skilling, Environment, Health, Community; the DOM groups tiles Agriculture, Skilling, Health, Environment, Community. Minor, but worth aligning so "All" reads in the same order as the chips.

12. **No video, despite the page's promise.** Meta/intent mention "media"/"visual stories" and the Style Gate lists "image/video grid", but there is zero video. **Fix:** support an optional video tile type (thumbnail + play badge) even if only one or two exist.

---

## 4. Content — source of truth (PRESERVE this)

> Numbers, names, places, and copy below are quoted verbatim and must survive the redesign exactly.

**Document meta**
- `<title>`: "Media | Coodu Trust - Visual Stories & Press Coverage"
- `<meta description>`: "Explore Coodu Trust's programs through images and media coverage. See our five key programs in action and read about our impact in the news."

**Page header**
- H1: **"Media"**
- Subtitle: **"Visual stories of our programs and media coverage of our impact"**

**Gallery section heading**
- H2: **"Our Work in Action"**

**Filter chips (label order as shown):**
"All" · "Agriculture & Livelihood" · "Skilling & Employment" · "Environment & Water" · "Health & Sanitation" · "Community & Infrastructure" · "Media Mentions"

**Gallery tiles** — for each: overlay **Title / Description**, then (where present) the rich lightbox metadata.

1. **Watershed Development** — "Transforming barren lands into productive agricultural areas"
   - *Lightbox title:* "Watershed Development Project" · *Category:* Agriculture
   - *Location:* "Dindigul District, Tamil Nadu" · *Date:* "March 2023" · *Impact:* "500+ families benefited"
   - *Story (The Story Behind):* "This watershed development project transformed 200 hectares of barren land into fertile agricultural fields. Through innovative water conservation techniques and soil restoration methods, we helped local farmers increase their crop yield by 60% while conserving precious water resources."
   - *Tags:* Water Conservation, Soil Restoration, Sustainable Agriculture, Community Development
   - *Image:* real — Cloudinary `programs/watershed-development.jpg`

2. **Organic Farming Training** — "Teaching sustainable agricultural practices"
   - *Lightbox title:* "Organic Farming Training Program" · *Category:* Agriculture
   - *Location:* "Karur District, Tamil Nadu" · *Date:* "January 2024" · *Impact:* "300+ farmers trained"
   - *Story:* "Our comprehensive organic farming training program equipped local farmers with sustainable agricultural techniques. Participants learned composting, natural pest control, and soil health management, leading to a 40% reduction in farming costs and improved crop quality."
   - *Tags:* Organic Farming, Sustainable Agriculture, Farmer Training, Environmental Protection
   - *Image:* **placeholder** — `picsum.photos/400/300?random=2` (replace)

3. **Skill Development Program** — "Empowering communities with employable skills"
   - *Lightbox title:* "Women's Skill Development Program" · *Category:* Skilling
   - *Location:* "Madurai District, Tamil Nadu" · *Date:* "November 2023" · *Impact:* "250+ women empowered"
   - *Story:* "This transformative program provided women with valuable skills in tailoring, handicrafts, and digital literacy. Over 90% of participants now run their own small businesses, with average monthly income increasing from ₹2,000 to ₹8,000. The program also included financial literacy and entrepreneurship training."
   - *Tags:* Women Empowerment, Skill Development, Entrepreneurship, Digital Literacy
   - *Image:* real — Cloudinary `programs/program-women-empowerment.jpg`

4. **Vocational Training Center** — "Building skills for better livelihoods"
   - *Category:* Skilling · *No rich metadata* (lightbox uses fallbacks)
   - *Image:* **placeholder** — `picsum.photos/400/300?random=4` (replace)

5. **Community Health Camp** — "Providing healthcare access to remote communities"
   - *Lightbox title:* "Mobile Health Camp Initiative" · *Category:* Health
   - *Location:* "Theni District, Tamil Nadu" · *Date:* "February 2024" · *Impact:* "1,500+ people served"
   - *Story:* "Our mobile health camps bring essential medical services directly to remote villages. Each camp provides general health checkups, vaccinations, maternal health services, and health education. We've established regular monthly visits to 15 villages, significantly reducing child mortality and improving overall community health."
   - *Tags:* Healthcare Access, Mobile Clinics, Preventive Care, Community Health
   - *Image:* real — Cloudinary `programs/health-sanitation.jpg`

6. **Clean Water Initiative** — "Installing clean water systems in villages"
   - *Category:* Health · *No rich metadata*
   - *Image:* **placeholder** — `picsum.photos/400/300?random=5` (replace)

7. **Health Awareness Session** — "Educating communities about health and hygiene"
   - *Category:* Health · *No rich metadata*
   - *Image:* **placeholder** — `picsum.photos/400/300?random=6` (replace)

8. **Environmental Restoration** — "Restoring degraded ecosystems for sustainability"
   - *Category:* Environment · *No rich metadata*
   - *Image:* real — Cloudinary `programs/program-environment.jpg`

9. **Water Conservation** — "Implementing sustainable water management systems"
   - *Category:* Environment · *No rich metadata*
   - *Image:* **placeholder** — `picsum.photos/400/300?random=8` (replace)

10. **Infrastructure Development** — "Building essential community infrastructure"
    - *Category:* Community · *No rich metadata*
    - *Image:* **placeholder** — `picsum.photos/400/300?random=10` (replace)

11. **Community Mobilization** — "Empowering communities for self-governance"
    - *Category:* Community · *No rich metadata*
    - *Image:* **placeholder** — `picsum.photos/400/300?random=11` (replace)

12. **The Hindu Coverage** — "Reforestation drive transforms barren hills"
    - *Category:* Media Mentions · *No rich metadata*
    - *Image:* **BROKEN** — `assets/images/resources/media-hindu.jpg` (file does not exist)

13. **Times of India Feature** — "Women empowerment through skill development"
    - *Category:* Media Mentions · *No rich metadata*
    - *Image:* **BROKEN** — `assets/images/resources/media-toi.jpg` (file does not exist)

14. **Ananda Vikatan Story** — "From beneficiaries to leaders: Inspiring stories"
    - *Category:* Media Mentions · *No rich metadata*
    - *Image:* **BROKEN** — `assets/images/resources/media-vikatan.jpg` (file does not exist)

**Lightbox fixed labels (preserve):** info-grid labels "Location", "Date", "Impact"; story heading "The Story Behind".

**Footer (shared chrome — preserve verbatim):**
- About: "Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000."
- Quick Links: About Us, Our Programs, Careers, Donate.
- Contact: "H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India."; Email `director@coodutrust.org`; Phone `+91-451-2461362`.
- Copyright: "© 2025 Coodu Trust. All Rights Reserved."

**Real, reusable images (keep these):** `watershed-development.jpg`, `program-women-empowerment.jpg`, `health-sanitation.jpg`, `program-environment.jpg` (all on Cloudinary). Header: `headers/media-bg.png`.

---

## 5. Enhancement direction (TO-BE) — opinionated

**Page frame**
- **Kill the full-page fixed wallpaper + white wash.** Use a clean `--surface` page with the gallery on `--surface` and, if banding is wanted, `--surface-alt` behind the filter bar. Let the photos provide the color. Remove every inline style and the `!important`.
- **Hero stays but calmer:** keep H1 "Media" + subtitle over `media-bg.png` with a single dark gradient scrim (not double-darkened). Add a one-line intro under the H2 to frame the grid (e.g. "Real moments from our five program areas across Dindigul, Madurai, Karur and Theni — and how the press has covered our work.").

**Two clear zones instead of one mixed grid**
- The current grid mixes *field photos* and *press clippings* with different needs. Split into:
  1. **"Our Work in Action"** — the filterable photo gallery (categories: Agriculture & Livelihood, Skilling & Employment, Environment & Water, Health & Sanitation, Community & Infrastructure). Drop "Media Mentions" from this filter set.
  2. **"In the News"** — a dedicated press strip below the gallery: 3 publication cards (The Hindu, Times of India, Ananda Vikatan) each = publication name/logo + headline + "Read article →" link. This fixes the 3 broken tiles by giving press its own card type instead of a photo tile, and reads more credibly to donors.

**Filtering & feedback**
- Keep the chip filter, but **sentence-case** the chips and add a small **result count** ("Showing 12 photos" / "Showing 3 in Health & Sanitation") and a graceful **empty state**. Animate filtered tiles with a gentle fade (respect reduced-motion). Align chip order with grid order.
- Consider an optional **"with stories" toggle** or a small badge on the 5 tiles that have a full story, so the rich lightbox is a discoverable reward rather than a coin-flip.

**Tiles & captions**
- Standardize tiles to a **4:3** ratio, `object-fit:cover`, radius 12, soft shadow, lift + image-zoom 1.03 on hover (desktop).
- **Always-visible caption** (title + 1-line description) via a bottom gradient on every tile — not hover-only — so mobile/tablet users can read labels. The hover slide-up becomes a desktop refinement only.
- Add a small **category tag pill** on each tile (matches Style Gate card anatomy).
- Support a **video tile variant** (thumbnail + centered play badge) for future clips.

**Lightbox**
- Keep the rich modal for tiles that *have* real data: image left, story right (Location/Date/Impact stat row, "The Story Behind", tag pills), prev/next, Esc/arrows, focus trap, `aria-modal`. **But for data-less tiles, degrade to a clean image-only lightbox** (image + title + description + prev/next) — never show fabricated "Various Locations / Ongoing / Making a difference" fallbacks.
- Restyle "glassmorphism" to match the Style Gate (soft shadow, white card, 12px radius) rather than iOS frosted glass, unless the user wants to keep the glass look — it currently reads off-brand vs. "grounded, trustworthy, warm".

**Content to add / fix (hand to user)**
- Replace **7 picsum placeholders** and **3 broken press images** with real assets.
- Author real Location/Date/Impact/Story/Tags for the 9 data-less tiles, OR accept image-only lightbox for them.
- Add 2–4 more real photos per category so each filter has a satisfying count.

**▶ YOUR ENHANCEMENT NOTES: ____**

---

## 6. Three-viewport layout spec (the core deliverable)

Shared rules: max content width 1140px centered; section padding desktop 96px / mobile 56px; tile ratio 4:3, radius 12, `object-fit:cover`; chips are pills (radius 999) in sentence case; honor `prefers-reduced-motion`.

### WEB (desktop, >=1025px)
- **Header:** full horizontal nav (shared chrome), Media active, Donate button visible right.
- **Hero (`page-header`):** full-bleed `media-bg.png` with single dark gradient scrim; centered H1 "Media" (~48px) + subtitle; ~96–120px vertical padding.
- **Intro + filter bar:** centered H2 "Our Work in Action" + 1-line intro; below it the **filter chips** in one centered row (wrap if needed), with a right-aligned **result count**. Sticky-on-scroll optional.
- **Gallery grid:** **3 columns** (≥1280px may go 4), `gap:24–32px`, 4:3 tiles, persistent bottom-gradient caption + category pill; hover = lift + zoom + slide-up detail. Roughly 12 photo tiles.
- **"In the News" strip:** below the grid, **3-column** row of press cards (logo/name + headline + "Read article →").
- **Lightbox:** centered card ~min(1100px, 92vw); **two columns** — image left (~58%), scrollable story panel right (~42%) with Location/Date/Impact stat row, "The Story Behind", tag pills; prev/next arrows overlaying the image edges; × top-right.
- **Footer:** 4-column shared chrome.

### TABLET (768–1024px)
- **Header:** condensed; hamburger may appear at the lower end (shared chrome behavior).
- **Hero:** H1 ~40px; reduced padding (~72px).
- **Filter bar:** chips wrap to two rows, horizontally centered; result count below chips on its own line if cramped.
- **Gallery grid:** **2 columns**, `gap:24px`, 4:3 tiles, **captions always visible** (no hover dependency).
- **"In the News":** **2-column** press cards (third wraps).
- **Lightbox:** image **stacks on top**, story panel below in a scroll container; full-width card with ~24px margins; prev/next as a control row under the image; × top-right. (Single-column modal once the two-pane layout would be too narrow.)
- **Footer:** 2-column shared chrome.

### MOBILE (<=600px)
- **Header:** logo + hamburger; slide-in drawer (shared chrome).
- **Hero:** H1 ~32px, subtitle ~16px, ~48–56px padding; scrim keeps text legible.
- **Filter bar:** chips become a **horizontal scroll row** (swipeable) with the active chip visually distinct; result count beneath. Min 44px touch height.
- **Gallery grid:** **1 column**, full-width 4:3 tiles stacked, `gap:16px`; **caption (title + description) always visible** over a bottom gradient; category pill top-left. Tap opens lightbox.
- **"In the News":** **single-column** stacked press cards.
- **Lightbox:** near-fullscreen sheet; image at top (4:3 or contain), story content scrolls below; large × and bottom prev/next buttons (44px); swipe left/right to navigate; body scroll locked. Tags wrap. Never show fabricated metadata — image-only lightbox for data-less tiles.
- **Footer:** single-column stacked shared chrome.

---

## 7. Components used (reference the shared design system / Style Gate)

Styling for all of these comes from `design/REDESIGN-STYLE-GATE.md` tokens (colors, Oswald/Inter type, radius, shadows, button/card styles) and the planned `assets/css/components/` files — **do not redefine global tokens here.**

- **Shared chrome:** `.site-header` / `.site-nav` / nav drawer, `.site-footer` (header.css, footer.css).
- **Page hero:** `.hero` / page-header pattern with photo + scrim (hero.css).
- **Filter chips:** pill buttons (radius 999) — Style Gate button/tag styling; sentence case; active = primary green.
- **Gallery grid + tiles:** `gallery.css` (media grid + lightbox) — card-style tiles per Style Gate card anatomy (image → category pill → title → 1-line summary), 4:3 ratio, radius 12, soft shadow, hover lift+zoom.
- **Press cards ("In the News"):** standard `.card` (card.css) — logo/name → headline → "Read article →" text-link button.
- **Lightbox modal:** `gallery.css` lightbox — card surface (Style Gate radius/shadow), `.btn`-styled close/nav controls, **tag pills** (radius 999), and a **stat row** reusing `.stat` (stats.css) for Location/Date/Impact.
- **Buttons / links:** `.btn` primary/secondary and text/arrow link from button.css (e.g. "Read article →", lightbox controls).
- **Motion:** Style Gate §1.10 — 150–200ms ease, fade-up reveals, reduced-motion honored.

---

## 8. Ready-to-paste Claude-design instruction

> Paste the filled **Style Gate** first, then this:

"Using the Style Gate above as the single source of truth for color, typography (Oswald headings / Inter body, sentence case — no all-caps body), spacing, radius (cards & images 12px, pills 999px), soft shadows, and button/card styles, design the **Media / Gallery page** for COODU Trust (a 20+ year rural-development NGO in Dindigul, Tamil Nadu). Produce **three clean, self-contained mockups: WEB (≥1025px), TABLET (768–1024px), and MOBILE (≤600px).**

Page structure, top to bottom:
1. **Hero:** full-width photo banner with a single dark gradient scrim, centered H1 **"Media"** and subtitle **"Visual stories of our programs and media coverage of our impact"**.
2. **"Our Work in Action"** section: H2 + one intro line, then a **filterable photo gallery**. Filter chips (sentence case, pill shape, first active) = **All · Agriculture & Livelihood · Skilling & Employment · Environment & Water · Health & Sanitation · Community & Infrastructure**, plus a small "Showing N photos" result count. Below: a responsive card grid of 4:3 photo tiles — **3 columns desktop, 2 tablet, 1 mobile**, gap ~24–32px — each tile with a category pill and an **always-visible** title + one-line caption over a bottom gradient (hover adds a gentle lift + image zoom on desktop only). Use these real tiles (title — caption): Watershed Development — Transforming barren lands into productive agricultural areas; Organic Farming Training — Teaching sustainable agricultural practices; Skill Development Program — Empowering communities with employable skills; Vocational Training Center — Building skills for better livelihoods; Community Health Camp — Providing healthcare access to remote communities; Clean Water Initiative — Installing clean water systems in villages; Health Awareness Session — Educating communities about health and hygiene; Environmental Restoration — Restoring degraded ecosystems for sustainability; Water Conservation — Implementing sustainable water management systems; Infrastructure Development — Building essential community infrastructure; Community Mobilization — Empowering communities for self-governance.
3. **"In the News"** strip (separate from the gallery): 3 press cards — **The Hindu** ("Reforestation drive transforms barren hills"), **Times of India** ("Women empowerment through skill development"), **Ananda Vikatan** ("From beneficiaries to leaders: Inspiring stories") — each card = publication name + headline + "Read article →". (3 across desktop, 2 tablet, 1 mobile.)
4. **Lightbox / detail modal** (show one open state): image on the left (~58%) and a story panel on the right (~42%) on desktop, stacked on tablet/mobile. Panel shows a category pill, the title **"Watershed Development Project"**, a description, a 3-up stat row labeled **Location / Date / Impact** ("Dindigul District, Tamil Nadu" · "March 2023" · "500+ families benefited"), a **"The Story Behind"** paragraph, and tag pills (Water Conservation, Soil Restoration, Sustainable Agriculture, Community Development). Include ‹ › prev/next controls, an × close, and on mobile a near-fullscreen sheet with bottom nav buttons.
5. Reuse the existing **shared header** (logo + nav, Media active, Donate button, hamburger on small screens) and **shared footer** (about blurb; Quick Links; contact "H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India", `director@coodutrust.org`, `+91-451-2461362`; social icons; "© 2025 Coodu Trust. All Rights Reserved.").

Use warm, authentic field photography (people, farming, training, health camps) — no random stock, no broken images. Keep it grounded, trustworthy, generous in whitespace. Deliver the three viewports as separate clean artboards."
