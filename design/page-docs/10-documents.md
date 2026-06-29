# Documents — Design Doc

## 1. Identity
- **File:** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/documents.html`
- **Real page represented:** the public "Documents" / resource-library listing page, reached from the main nav (`Documents` link, currently `nav-link active`) and meta-titled `Documents | Coodu Trust`. Each card links to a per-year report viewer (`report-viewer.html?year=YYYY`) — that viewer is a SEPARATE page-type and is NOT governed here.
- **COVERAGE:** Covers **1 page** (`documents.html`). It is a single, standalone listing page — not a template that fans out. (It does, however, generate links into 23 `report-viewer.html?year=…` URLs, which belong to a different doc.)
- **Role/job (one line):** A filterable library index where visitors browse and open Coodu Trust's published documents — 23 Annual Reports (2001–2002 through 2023–2024) plus Publications/Case Studies and Research Papers — as the organization's transparency / credibility archive.

## 2. Current structure (AS-IS) — section by section

The page is `Header → main(Page Header → Resources Section) → Footer`. Header and Footer are shared chrome (see shared-chrome doc); described here only by reference.

**0. Body background + global overlay (page-level, not a section)**
- `<body>` carries an inline background: Cloudinary `…/aboutus/background.jpg`, `background-size:cover; background-position:center; background-attachment:fixed; background-repeat:no-repeat`.
- A second element, a fixed full-viewport white scrim `div` with `background: rgba(255,255,255,0.4); z-index:-1`, sits over that photo to wash it out so foreground text is legible.
- Net effect: the whole page floats over a faint fixed background photo; the Resources section is forced `background: transparent !important` so the photo shows behind the card grid.

**1. Header / Navbar** — shared chrome. `class="header"` → `.container` → `.navbar` with logo (Cloudinary front logo + "Coodu Trust" wordmark), full `.nav-menu` (Home, About, Programs [6-group mega-dropdown with 2nd-level submenus], Get Involved [Volunteer / Partner / Donate], **Documents [active]**, Media, Contact), a `.btn.btn-primary.donate-button` "Donate" CTA, and a `.hamburger` (3 bars) for mobile. Reference only.

**2. Page Header** — `<section class="page-header">`
- **Purpose:** title banner / page intro.
- **Component:** full-bleed hero band (no slider). Inline `background-image` = Cloudinary `…/headers/Documents_bg.jpg`, `cover`, centered. CSS adds `padding:100px 0`, centered text, light text color, and a `::before` dark scrim `rgba(0,0,0,0.2)`.
- **Content:** `<h1 class="page-title">Documents</h1>` (3.5rem) and `<p class="page-subtitle">Our comprehensive resource library showcasing research, reports, and publications.</p>` (1.2rem, `text-transform:none`).

**3. Resources Section** — `<section class="resources-section section-padding">` (inline `background: transparent !important`)
- **Purpose:** the actual library — a category sidebar + a filterable card grid.
- **Layout component:** `.resources-layout` = CSS grid `250px 1fr`, `gap:40px`. Two columns:

  **3a. Left column — Sidebar** `<aside class="resources-sidebar">`
  - `<h3 class="sidebar-title">Categories</h3>` (underlined by a 2px bottom border).
  - Primary menu `ul.sidebar-menu` with ONE item: `<a class="sidebar-link active" data-filter="all">All Documents</a>` (active = green left-border + green text).
  - `<div class="sidebar-subsection">` → `<h4 class="sidebar-subtitle">Resources</h4>` → `ul.sidebar-submenu` with three filter links:
    - `data-filter="annual-reports"` → "Annual Reports"
    - `data-filter="publications"` → "Publications & Case Studies"
    - `data-filter="research"` → "Research Papers"
  - These are client-side filter controls (no real `href`, all `#`). `assets/js/main.js` (block "3. DOCUMENTS PAGE FILTERING", lines 240–297) wires clicks: it sets `.active` on the clicked link, clears it from every other link/sublink, then shows/hides each `.resource-card` by matching `data-category` to the chosen `data-filter` (or shows all when `all`). Filtering is pure `style.display` toggling — no count, no animation, no URL state.

  **3b. Right column — Resources grid** `<div class="resources-grid-wrapper">` → `<div class="resources-grid">` (3-column CSS grid, `gap:30px`)
  - **Component:** uniform card grid of `.resource-card` items. Each card = `<a class="resource-link">` wrapping `<img class="resource-image">` (200px tall, `object-fit:cover`) + `<div class="resource-content">` containing `<span class="resource-meta">` (small grey eyebrow) and `<h3 class="resource-title">` (1.4rem). Card has white bg, `border-radius`, soft shadow, hover lift (`translateY(-5px)` + bigger shadow) and title turns green on hover.
  - **27 cards total**, in DOM order:
    - **23 Annual Report cards** (`data-category="annual-reports"`), newest → oldest, each linking to `report-viewer.html?year=YYYY`: 2023-2024, 2022-2023, 2021-2022, 2020-2021, 2019-2020, 2018-2019, 2017-2018, 2016-2017, 2015-2016, 2014-2015, 2013-2014, 2012-2013, 2011-2012, 2010-2011, 2009-2010, 2008-2009, 2007-2008, 2006-2007, 2005-2006, 2004-2005, 2003-2004, 2002-2003, 2001-2002.
    - **2 Publications cards** (`data-category="publications"`), `href="#"` `target="_blank"` (dead links): "Sustainable Agriculture Practices in Drought-Prone Areas" (Case Study | 2024) and "Women's Self-Help Groups: A Model for Economic Empowerment" (Publication | 2023).
    - **2 Research cards** (`data-category="research"`), `href="#"` `target="_blank"` (dead links): "Impact Assessment of Watershed Development Programs" (Research Paper | 2024) and "Community-Based Health Interventions in Rural Settings" (Research Paper | 2023).

**4. Footer** — shared chrome. `<footer id="contact-footer" class="footer">` with 4 columns (white logo + about blurb, Quick Links, Contact Us address block, Follow Us social icons) and `.footer-bottom` copyright. Reference only.

## 3. Current weaknesses (be specific & honest)

- **No search and no result count.** A 27-item (and growing) archive with only 3 category filters and no text search is hard to scan. The 23 annual reports are nearly identical-looking cards; finding "2011-2012" means eyeballing a wall. → **Fix:** add a year/keyword search field and a live "Showing X of Y" count; consider a year jump-bar or decade groupings.
- **Filter UX is half-built.** The sidebar has a near-empty "Categories" group ("All Documents" is the only top-level item) and the real categories are demoted into a "Resources" sub-list — odd information architecture. Clicking any sublink strips `.active` off "All Documents" but never restores a clear "you are here" for the primary group. → **Fix:** make the four filters a single equal-weight control set (sidebar list on desktop, horizontal chip row on tablet/mobile), each with its own count badge; keep "All" visually distinct as the default.
- **Broken/placeholder images.**
  - 2014-2015 card src = `assets/images/resources/annual-report-2014-2015.png   ` and 2013-2014 card src = `assets/images/resources/annual-report-2013-2014.png  ` — both have **trailing whitespace in the URL** (will 404) AND point to local `.png` files while every other report uses Cloudinary `.jpg`. Inconsistent + likely broken.
  - All **4 Publications/Research cards reuse the SAME image** `assets/images/resources/annual-report-2023-2024.png` (an annual-report cover) — obvious placeholder. → **Fix:** give each non-report document a real thumbnail (or a typed generic cover: "Case Study", "Research"), trim URLs, and standardize on one host/format.
- **Dead document links.** Every Publications and Research card is `href="#"` — they look clickable but go nowhere, and they open `target="_blank"` to a blank tab. → **Fix:** wire to real PDFs/viewer pages or hide the section until content exists; never ship `#` `_blank` links.
- **Inline-style soup + `!important`.** Body background, the white scrim div, the page-header background, and the section's `background: transparent !important` are all inline. Fragile and off the token system. → **Fix:** move to tokenized component CSS (Style Gate), drop `!important`.
- **Weak hierarchy in the card list.** The newest report (2023-2024) looks identical to a 2002 report — no "Latest" emphasis, no visual grouping by year/decade despite a 22-year span. → **Fix:** feature the latest report large, group older ones, lighten visual weight of the long tail.
- **External-host dependency.** Most covers, the page background, header/footer logos and social icons are remote Cloudinary assets on one account (`dvxbg6to3`); if it lapses the page degrades badly. → **Fix:** localize critical images.
- **Accessibility / mobile.** Card images are not lazy-loaded or width/height-sized (CLS risk on a 27-image grid); sidebar filter links are `<a href="#">` (not buttons) so they read as navigation to screen readers; 200px-tall card images on mobile single-column make for a very long scroll. → **Fix:** lazy + sized images, real `<button>`/`aria-pressed` for filters, denser mobile cards or list rows.

## 4. Content — source of truth (PRESERVE this)

**Page header**
- H1: `Documents`
- Subtitle: `Our comprehensive resource library showcasing research, reports, and publications.`
- Meta title: `Documents | Coodu Trust`
- Meta description: `Access our comprehensive resource library including annual reports, publications, case studies, and research papers showcasing Coodu Trust's impact.`

**Sidebar**
- Heading: `Categories`
- Primary: `All Documents` (filter `all`)
- Sub-heading: `Resources`
- `Annual Reports` (filter `annual-reports`)
- `Publications & Case Studies` (filter `publications`)
- `Research Papers` (filter `research`)

**Annual Report cards** — preserve exact `meta` + `title` + link target for all 23:
| Meta | Title | Link |
|---|---|---|
| Annual Report \| March 2024 | Annual Report 2023-2024: Scaling Impact & Innovation | report-viewer.html?year=2024 |
| Annual Report \| March 2023 | Annual Report 2022-2023: Integrating Sustainability | report-viewer.html?year=2023 |
| Annual Report \| March 2022 | Annual Report 2021-2022: Building Back Stronger | report-viewer.html?year=2022 |
| Annual Report \| March 2021 | Annual Report 2020-2021: Adapting to New Challenges | report-viewer.html?year=2021 |
| Annual Report \| March 2020 | Annual Report 2019-2020: Two Decades of Service | report-viewer.html?year=2020 |
| Annual Report \| March 2019 | Annual Report 2018-2019: Scaling Impact & Sustainability | report-viewer.html?year=2019 |
| Annual Report \| March 2018 | Annual Report 2017-2018: Technology for Development | report-viewer.html?year=2018 |
| Annual Report \| March 2017 | Annual Report 2016-2017: Inclusive Growth & Empowerment | report-viewer.html?year=2017 |
| Annual Report \| March 2016 | Annual Report 2015-2016: Sustainable Development Goals | report-viewer.html?year=2016 |
| Annual Report \| March 2015 | Annual Report 2014-2015: Innovation in Rural Development | report-viewer.html?year=2015 |
| Annual Report \| March 2014 | Annual Report 2013-2014: Expanding Horizons | report-viewer.html?year=2014 |
| Annual Report \| March 2013 | Annual Report 2012-2013: Community Development & Growth | report-viewer.html?year=2013 |
| Annual Report \| March 2012 | Annual Report 2011-2012: Strengthening Rural Communities | report-viewer.html?year=2012 |
| Annual Report \| March 2011 | Annual Report 2010-2011: A Decade of Service Excellence | report-viewer.html?year=2011 |
| Annual Report \| March 2010 | Annual Report 2009-2010: Expanding Our Reach | report-viewer.html?year=2010 |
| Annual Report \| March 2009 | Annual Report 2008-2009: Building Sustainable Futures | report-viewer.html?year=2009 |
| Annual Report \| March 2008 | Annual Report 2007-2008: Women's Empowerment Focus | report-viewer.html?year=2008 |
| Annual Report \| March 2007 | Annual Report 2006-2007: Environmental Conservation Initiatives | report-viewer.html?year=2007 |
| Annual Report \| March 2006 | Annual Report 2005-2006: Health & Sanitation Programs | report-viewer.html?year=2006 |
| Annual Report \| March 2005 | Annual Report 2004-2005: Watershed Development Success | report-viewer.html?year=2005 |
| Annual Report \| March 2004 | Annual Report 2003-2004: Community Mobilization | report-viewer.html?year=2004 |
| Annual Report \| March 2003 | Annual Report 2002-2003: Early Growth & Development | report-viewer.html?year=2003 |
| Annual Report \| March 2002 | Annual Report 2001-2002: Foundation Years | report-viewer.html?year=2002 |

**Publications & Case Studies cards** (links currently dead `#`):
- `Case Study | 2024` — `Sustainable Agriculture Practices in Drought-Prone Areas`
- `Publication | 2023` — `Women's Self-Help Groups: A Model for Economic Empowerment`

**Research Papers cards** (links currently dead `#`):
- `Research Paper | 2024` — `Impact Assessment of Watershed Development Programs`
- `Research Paper | 2023` — `Community-Based Health Interventions in Rural Settings`

**Footer (shared, preserve):** About blurb `Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000.` · Quick Links: About Us, Our Programs, Careers, Donate · Address `H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.` · Email `director@coodutrust.org` · Phone `+91-451-2461362` · Social: Facebook / Twitter / Instagram · `© 2025 Coodu Trust. All Rights Reserved.`

## 5. Enhancement direction (TO-BE) — opinionated

**Reframe the page as a true document library, not a photo grid.**

1. **Toolbar over sidebar (on tablet/mobile) / refined sidebar (desktop).** Replace the awkward "Categories → All Documents → Resources" nesting with one equal set of four filters: **All · Annual Reports · Publications & Case Studies · Research Papers**, each showing a count (e.g. "Annual Reports (23)"). Add a **search input** ("Search documents by title or year") and a live **"Showing X of Y documents"** line. Keep `All` as the default-active state.
2. **Feature the latest report.** Pull "Annual Report 2023-2024: Scaling Impact & Innovation" into a wide **featured hero card** at the top of the grid (large cover, "Latest report" badge, prominent "View report →"), then list the rest below. This gives the page an obvious primary action.
3. **Group the 22-year archive.** Under Annual Reports, group cards by decade or under year sub-headers ("2020s", "2010s", "2000s") so the long tail is scannable rather than an undifferentiated wall of 23 lookalikes.
4. **Fix the cards' metadata layer.** Standardize the eyebrow as a small typed **pill/tag** ("Annual Report" / "Case Study" / "Publication" / "Research Paper") + date, so document TYPE is visible at a glance even when filtering "All". Add an explicit affordance icon (PDF / external-link) per card.
5. **Repair imagery.** Trim the two trailing-space URLs, give Publications/Research real or typed-generic covers (stop reusing the 2023-2024 cover four times), and localize/standardize on one host + format. Lazy-load and size all 27 images.
6. **Make every card actionable for real.** Wire Publications/Research to real document URLs; if none exist yet, either hide those filters or show an honest "Coming soon" empty state rather than `#` links that open blank tabs.
7. **Empty state + a11y.** When a filter/search yields nothing, show a friendly "No documents match" panel. Convert filter links to `<button aria-pressed>`; visible focus rings; preserve filter state in the URL (`?type=annual-reports`) so results are shareable/bookmarkable.
8. **Optional: list/grid toggle.** For power users scanning 23 reports, offer a compact list view (title + year + type + download) alongside the card grid.

▶ YOUR ENHANCEMENT NOTES: ____

## 6. Three-viewport layout spec (the core deliverable)

Shared intent across all viewports: clean light surface for the card area (drop the washed-out fixed-photo background or keep it only as a very faint texture); generous gaps; the latest report featured; type-tags on every card; tokenized colors/radius/shadow from the Style Gate.

**WEB (desktop, ≥1025px)**
- Sticky shared header. Page-header hero band full-bleed: `Documents_bg.jpg` with dark scrim, centered H1 (~3.5rem) + subtitle, ~100px vertical padding.
- Resources section = 2-column layout, mirroring current `250px 1fr` with `~40px` gap: **left rail** (sticky, ~250–280px) = search field + four filter items as a vertical list with count badges and active state (green left-border + green text); **right column** = content.
- Right column top: a **full-width featured card** for the 2023-2024 report (cover left ~40%, text right ~60%, "Latest report" badge, large title, "View report →" button).
- Below it: a **3-column card grid**, `gap ~30px`, cards uniform — cover image 16:9 (or current fixed ~200px height, `object-fit:cover`), then content padding with a type-tag pill, date meta, and `<h3>` (~1.3–1.4rem). Hover = lift + shadow + title-green (+ optional image zoom 1.03 per Style Gate). Optionally insert lightweight decade sub-headers between report groups.
- "Showing X of Y" count sits above the grid, right-aligned with the filter rail.

**TABLET (768–1024px)**
- Header collapses to hamburger drawer (shared behavior).
- Layout switches to **single column** (current rule: `.resources-layout` → `1fr` at ≤992px): the sidebar becomes a **horizontal filter bar** above the grid — search input full-width on its own row, then the four filter chips in a wrap row with counts; "Showing X of Y" below them.
- Featured card spans full width (can keep cover-left/text-right, or stack at the lower end of the range).
- Card grid = **2 columns** (current `repeat(2,1fr)`), `gap ~24–30px`, same card anatomy; image height ~180–200px.

**MOBILE (≤600px)**
- Header = logo + hamburger; full-screen nav drawer on open.
- Page-header hero compresses (reduced padding, H1 ~2.2–2.5rem, subtitle ~1rem).
- Filters as a **horizontal scroll / wrapping chip row** (sticky just under the header is a nice-to-have); search input full-width above the chips; count line beneath.
- Featured card **stacks**: cover on top (16:9), text below, full-width button.
- Card grid = **single column** (current `1fr` at ≤768px), cards full-width, `gap ~16–20px`. Consider a denser list-row variant (small thumb left, title+meta right) to shorten the 23-report scroll. 44px minimum tap targets; lazy-load images.

## 7. Components used (reference the shared design system / Style Gate)

Global tokens (colors, fonts, radius, shadows, button & card styles, spacing scale, breakpoints) are defined in `design/REDESIGN-STYLE-GATE.md` — **do not redefine here**; reference them.

- **Shared header / nav** (logo, mega-menu, donate button, hamburger drawer) — shared-chrome doc.
- **Shared footer** (4-col grid + copyright) — shared-chrome doc.
- **Page-header hero band** (`.page-header` pattern: bg image + dark scrim + centered H1/subtitle) — shared with About/Contact pages; reuse as-is.
- **Document card** = the shared **card component** (`.card` / `.card__media` / `.card__title` / `.card__meta` per Style Gate §1.8 / §2.2), with a **`.card--featured`** modifier for the latest report and a small **type-tag/pill** element. Uses `--radius-card`, `--shadow-1`/`--shadow-2`, hover lift, `--color-primary` accent.
- **Filter control set** — a shared filter-chip / sidebar-filter component (active state uses `--color-primary`), reused from the Programs/Media filtering patterns; backed by the documents-filtering JS in `assets/js/main.js`.
- **Search input** — shared form-input token styling.
- **Button / link** — shared `.btn .btn-primary` token for "View report →" and the empty-state CTA.
- **Count / "Showing X of Y"** + **empty-state panel** — small shared utility text/blocks.
- **Tokens to honor:** `--font-display` (Oswald) for titles, `--font-body` (Inter) for meta/body, brand green `--color-primary` `#28a745` / `--color-primary-dark` `#1e7e34`, hairline `#e2e8e2`, `--radius-btn 8px` / `--radius-card 12px`, shadows `--shadow-1` / `--shadow-2`, the named breakpoints. No off-brand colors, no inline styles, no `!important`.

## 8. Ready-to-paste Claude-design instruction

> Using the filled COODU Trust Style Gate (brand green `#28a745` / dark `#1e7e34`, Oswald display + Inter body, radius 8/12px, soft shadows `0 2px 8px` → `0 8px 24px` on hover, card hover = lift + image zoom 1.03), design the **Documents** page of an Indian rural-development NGO (Coodu Trust, Dindigul, Tamil Nadu) and produce **THREE self-contained designs: WEB (≥1025px), TABLET (768–1024px), MOBILE (≤600px).**
>
> The page is a filterable **document library**. Include, in order: (1) a shared sticky header with logo, nav (Home, About, Programs, Get Involved, **Documents [active]**, Media, Contact), a green "Donate" button, and a mobile hamburger drawer; (2) a hero band titled **"Documents"** with subtitle **"Our comprehensive resource library showcasing research, reports, and publications."** over a photo with a dark scrim; (3) the library: a **search field** + four filters **All · Annual Reports (23) · Publications & Case Studies (2) · Research Papers (2)** each with a count, plus a **"Showing X of Y documents"** line; (4) a **featured card** for "Annual Report 2023-2024: Scaling Impact & Innovation" (badge "Latest report", "View report →" button); (5) a **card grid** of document cards — each = cover image + a small TYPE pill (Annual Report / Case Study / Publication / Research Paper) + date meta + title. Show at least these sample titles: "Annual Report 2022-2023: Integrating Sustainability", "Annual Report 2021-2022: Building Back Stronger", "Annual Report 2011-2012: Strengthening Rural Communities", "Annual Report 2001-2002: Foundation Years", "Sustainable Agriculture Practices in Drought-Prone Areas" (Case Study 2024), "Women's Self-Help Groups: A Model for Economic Empowerment" (Publication 2023), "Impact Assessment of Watershed Development Programs" (Research Paper 2024), "Community-Based Health Interventions in Rural Settings" (Research Paper 2023); (6) the shared footer (about blurb; Quick Links: About Us, Our Programs, Careers, Donate; address "H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.", email director@coodutrust.org, phone +91-451-2461362; Facebook/Twitter/Instagram; "© 2025 Coodu Trust. All Rights Reserved.").
>
> Layout: WEB = left filter rail (~260px, sticky) + 3-column card grid, featured card full-width on top. TABLET = filters as a horizontal chip bar above a 2-column grid. MOBILE = search + scrollable filter chips, featured card stacked, single-column cards. Show real interaction states (filter active state, card hover lift, focus ring, open mobile nav drawer) and an empty/no-results state.
>
> Return clean, copy-paste-runnable HTML5 with semantic landmarks, one `<h1>`, all styling in ONE `<style>` block using CSS custom properties mirroring the Style Gate tokens, NO inline `style=` attributes, no CSS frameworks, ≤2 Google Fonts, lazy-loaded sized images. Then list the design tokens used (hex, font sizes, spacing, radii) as a short table.
