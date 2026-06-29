# Home — Design Doc

> Source read in full: `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/index.html` (426 lines). Cross-checked against `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/css/style.css` for current visual behavior and `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/design/REDESIGN-STYLE-GATE.md` for the global tokens this page must inherit (do NOT redefine them here).

---

## 1. Identity

- **File(s):** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/index.html`
- **Real page(s) represented:** the public homepage / landing page (`index.html`, the site root `/`).
- **COVERAGE:** This doc governs **1 page** (the homepage only). It is NOT a multi-page template — it is the single most-trafficked, first-impression page. (Other docs in `design/page-docs/` cover the shared chrome, the Programs hub, Program/Project detail templates, etc.)
- **One-line role/job:** Build instant trust in a 20+ year rural-development NGO and route two distinct audiences — donors/CSR partners and beneficiaries/volunteers — toward **Programs** and **Donate/Get Involved**.

---

## 2. Current structure (AS-IS) — section by section

Top-to-bottom, exactly as the markup renders. Page chrome (header/nav, footer) is governed by the **shared-chrome doc** and only referenced here.

**0. Page-level background hack (body) — `<body style="...">` + fixed overlay `<div>`**
- A full-page fixed `background-image` (Cloudinary `aboutus/background.jpg`), `background-attachment: fixed`, `cover`, centered.
- A `position: fixed` overlay `<div>` at `rgba(255,255,255,0.4)`, `z-index:-1`, sitting behind content to wash the bg out.
- Most `<section>`s below then carry `style="background: transparent !important;"` so this washed photo shows through. This is the core "overlay hack" being replaced.

**1. HEADER / NAV — `<header class="header">` → `.navbar`** (shared chrome — by reference)
- Logo (`coodu_frontlogo.png`) + wordmark "Coodu Trust"; horizontal `.nav-menu`: Home (active), About, **Programs** (mega-dropdown with 6 themed submenus, each with 3–6 sub-items), **Get Involved** (dropdown: Partner with Us / Volunteer / Donate), Documents, Media, Contact; a standalone green **Donate** `.btn .btn-primary .donate-button`; a `.hamburger` (3 bars) for mobile. *Detail lives in the chrome doc.*

**2. HERO — `<section class="hero-section">`** — *component: full-bleed background slideshow + overlaid content + dots*
- **Purpose:** emotional hook + primary value prop + one CTA.
- **Components:**
  - `.hero-slideshow` with **5** `.hero-slide` divs, each an inline `background-image` (Cloudinary): `hero/style.jpg` (active), `hero/women-empowerment.jpg`, `programs/program-environment.jpg`, `programs/health-sanitation.jpg`, `programs/program-women-empowerment.jpg`. JS auto-rotates.
  - `.hero-overlay` (dark scrim for legibility).
  - `.hero-content`: `<h1 class="hero-title">`, `<p class="hero-subtitle">`, one `<a class="btn btn-secondary">` (currently blue) anchored to `#programs`.
  - `.hero-dots`: 5 clickable `.hero-dot` slideshow indicators (`data-slide` 0–4).

**3. OUR IMPACT — `<section id="impact" class="impact-section">`** — *component: 4-up stat-card grid*
- **Purpose:** headline credibility via numbers, immediately after hero.
- **Components:** `.section-title` "Our Impact at a Glance" + `.impact-grid` = `repeat(4,1fr)` of `.impact-card`. Each card = PNG `.impact-icon` + `.impact-number` (`<h3>`) + `.impact-text` (`<p>`).
- Icons are local PNGs in `assets/images/icons/` (`womens-empwerment.png`, `village.png`, `icon-health.png`, `icon-tree.png`). (Memory note: icon set is only partially present — `icon-women.svg` missing — so icon sourcing must be verified at rebuild.)

**4. VIDEO & MISSION — `<section id="mission" class="mission-section">`** — *component: 2-col split (media + text)*
- **Purpose:** introduce the org in its own words + a video.
- **Components:** `.mission-grid` = `1fr 1fr`. Left `.mission-video-wrapper` = YouTube `<iframe>` (embed `wrG63C0qtxg`, "Introduction to COODU TRUST") with hardcoded `width="1803" height="1014"`. Right `.mission-content`: `.mission-title` (`<h2>`) built from 3 colored `<span>`s ("Community." blue, "Compassion." blue, "Collaboration." green), `.mission-text` paragraph, one `<a class="btn btn-primary">` "Learn More" → `about.html`.

**5. OUR PROGRAMS — `<section id="programs" class="programs-section">`** — *component: card grid (5 cards)*
- **Purpose:** preview the 6 core program pillars and route into Programs.
- **Components:** `.section-title` "Our Core Programs" + `.programs-grid` = `repeat(3,1fr)` holding **5** `.program-card`s. Each card = `.program-image` (Cloudinary) + `.program-content` (`.program-title` `<h3>`, `.program-description` `<p>`, `.program-link` "Learn More →"). The 5 cards link to: `environment-resilience`, `sustainable-agriculture`, `education-skilling`, `health-sanitation`, `consultancy-hr`. **Note:** "Women Empowerment" pillar (which exists in the nav mega-menu) is MISSING from this grid; the 5th card's image is mistakenly a team headshot (`team/member-1.jpg`).

**6. CTA BLOCK — `<section id="cta" class="cta-section">`** — *component: 2-up split CTA band (flex)*
- **Purpose:** fork the two audiences.
- **Components:** `.cta-container` (flex) with two edge-to-edge `.cta-box`: `.cta-help` ("Are You Looking for Support?" → `contact.html`, `.btn .btn-light` "Get Help") and `.cta-involve` ("Do You Want to Make a Difference?" → `get-involved.html`, `.btn .btn-light` "Get Involved").

**7. STORIES OF TRANSFORMATION — `<section id="testimonials" class="stories-carousel-section">`** — *component: testimonial carousel*
- **Purpose:** human proof via beneficiary stories.
- **Components:** `.section-title` "Stories of Transformation" + `.section-intro-text`. `.stories-carousel` → `.carousel-container` with **3** `.story-slide`s (first `active`). Each slide = `.story-image-wrapper` (`.story-image` local JPG + `.story-overlay` → `.story-category` tag) + `.story-content` (`.quote-icon` ", `.story-quote` `<p>`, `.story-author` → `.author-name` `<h4>` + `.author-location` `<p>`). Plus `.carousel-dots` (3) and prev/next `.carousel-arrow` buttons.

**8. LIVE STATISTICS BANNER — `<section id="stats-banner" class="stats-banner-section">`** — *component: dark count-up stat band*
- **Purpose:** environmental urgency message + animated global counters.
- **Components:** inline `style="background:#2c3e50 !important;"` (dark slate). `.stats-banner-container` = `.stats-intro` (`<h4>` "We Have Only One Planet" + `<p>`) beside `.stats-grid` (`repeat(2,1fr)`) of **4** `.stat-item`s: `.stat-number` (`<h3>`, `data-target` count-up) + `.stat-label`. Targets: `8192242010`, `1198948812`, `28277094`, `1.72`.

**9. FOOTER — `<footer id="contact" class="footer">`** (shared chrome — by reference)
- 4-col `.footer-grid` (white logo + about blurb; Quick Links; Contact Us address/email/phone; Follow Us social icons) + `.footer-bottom` copyright. *Detail in chrome doc.* (Note: footer carries `id="contact"` AND a real `contact.html` page exists — an id collision worth cleaning.)

---

## 3. Current weaknesses (be specific & honest)

1. **Global ALL-CAPS body.** `body { text-transform: uppercase; letter-spacing: 0.5px; }` (style.css line 52) forces every paragraph, quote, label and button into uppercase. This wrecks readability — testimonial quotes and the mission paragraph are walls of capitals, brutal on mobile. **Fix:** drop the global rule; caps reserved for short labels/tags/eyebrows only (per Style Gate §1.4).
2. **Inline-style + overlay-hack soup.** A fixed body background photo + a fixed white `rgba(255,255,255,0.4)` overlay + `background: transparent !important` on six sections is how the page gets its look. It's fragile, fights the cascade, and gives a muddy washed-out feel with no intentional section rhythm. **Fix:** remove the body bg photo and overlay entirely; use real, intentional alternating surfaces (`--surface` / `--surface-alt`) per the design system.
3. **No alternating section banding → flat hierarchy.** Because every section is "transparent," Impact, Mission, Programs, and Stories all float on the same washed photo with weak separation. **Fix:** band sections (white vs soft-green `--surface-alt`), consistent 96/56px vertical rhythm.
4. **Programs grid is wrong & incomplete.** 5 cards in a 3-col grid (orphan 4th/5th row), the **Women Empowerment pillar is missing**, and one card's image is a **team headshot** (`team/member-1.jpg`) instead of a program photo. **Fix:** show all **6** pillars in an even grid with correct, captioned imagery.
5. **Off-brand secondary color.** Hero CTA is `.btn-secondary` = blue (`#007bff`); mission title mixes blue + green. The brand is green. Blue dilutes identity. **Fix:** use green primary + one chosen warm/secondary accent from the Style Gate, not ad-hoc blue.
6. **Hero CTA is weak for the page's job.** Only one button ("Discover Our Work") and it's the off-brand blue. The homepage's job is trust + routing to Programs AND Donate, yet Donate only lives in the nav. **Fix:** two hero CTAs — primary "Donate"/"Get Involved" (accent) + secondary "Explore Our Work".
7. **Iframe with absurd fixed dimensions.** `width="1803" height="1014"` on the YouTube embed is non-responsive and overflow-prone. **Fix:** responsive 16:9 wrapper (`aspect-ratio`), no hardcoded px.
8. **Stats banner numbers lack context/format.** Raw `8192242010` etc. with no thousands separators or "as of" framing reads like noise; and the planet-doom banner sits oddly far from COODU's own work. **Fix:** format numbers, add a source/"live estimate" caption, and reconsider placement so the page ends on COODU's mission, not generic doom.
9. **Icon assets fragile.** Impact icons are mismatched local PNGs (e.g. `womens-empwerment.png` typo, partial set, missing SVGs per memory). **Fix:** one consistent line-icon set (Lucide-style, single color) for all four stats.
10. **Duplicate `id="contact"`.** Footer uses `id="contact"` while `contact.html` exists and nav links to it — confusing anchor/semantics. **Fix:** rename footer id (e.g. `site-footer`).
11. **No "who we are" / proof strip near the top.** A donor landing in 2026 wants a one-line "since 2000, Dindigul, Tamil Nadu" credibility cue above the fold-ish; today that only appears buried in the footer. **Fix:** add a short trust strip (est. year, location, registration/80G cue).

---

## 4. Content — source of truth (PRESERVE this)

> Reproduce verbatim. Numbers, names, ₹ amounts and links must not be paraphrased. (Casing may be normalized OUT of all-caps; wording must not change.)

**Document title / meta**
- Title: `Coodu Trust - Empowering Communities, Transforming Lives`
- Meta description: `Coodu Trust is a non-profit organization dedicated to women empowerment, health, environmental sustainability, and livelihood development in India.`

**Hero**
- H1: **Empowering Communities, Transforming Lives**
- Subtitle: *Join us in our mission to create a sustainable and equitable future for rural communities through empowerment, health, and environmental action.*
- CTA button: **Discover Our Work** → `#programs`

**Our Impact at a Glance** (section title preserved)
- **3,81,609+** — Total Beneficiaries
- **534** — Panchayats Served
- **18,523+** — Toilets Built
- **26,93,250** — Trees Planted

**Video & Mission**
- Video: YouTube embed `https://www.youtube.com/embed/wrG63C0qtxg`, title "Introduction to COODU TRUST"
- H2 (3 emphasized words): **Community.** · **Compassion.** · **Collaboration.**
- Body: *The mission of Coodu Trust is to improve the quality of life for economically disadvantaged individuals by providing the necessary resources to increase their standard of living, foster self-improvement, and maximize self-empowerment.*
- CTA: **Learn More** → `about.html`

**Our Core Programs** (section title preserved) — 5 cards as-is; recommend adding the 6th (Women Empowerment):
1. **Environment and Resilience** — *Building climate-resilient communities through environmental conservation, renewable energy solutions, and sustainable development practices.* → `programs/environment-resilience.html`
2. **Sustainable Agriculture** — *Promoting organic farming, watershed management, and innovative agricultural techniques to enhance food security and farmer livelihoods.* → `programs/sustainable-agriculture.html`
3. **Education and Skilling** — *Empowering communities through quality education, vocational training, and skill development programs for sustainable employment.* → `programs/education-skilling.html`
4. **Health, Sanitation & Waste Management** — *Improving community health through healthcare access, sanitation facilities, solid waste management, and health awareness programs in rural areas.* → `programs/health-sanitation.html`
5. **Consultancy and HR Management** — *Providing expert consultancy services and human resource management solutions for organizational development and capacity building.* → `programs/consultancy-hr.html`
- *(MISSING — add for completeness, links exist in nav)* **Women Empowerment** → `programs/women-empowerment.html`
- Each card link text: **Learn More →**

**CTA Block**
- Box 1 — **Are You Looking for Support?** / *Discover the programs and resources we offer to communities.* / button **Get Help** → `contact.html`
- Box 2 — **Do You Want to Make a Difference?** / *Join us as a volunteer, partner, or donor to transform lives.* / button **Get Involved** → `get-involved.html`

**Stories of Transformation** (section title + intro preserved)
- Intro: *Witness the powerful journeys of communities and individuals transformed through our programs*
- **Story 1 — category "Women Empowerment":** *“Coodu Trust's skill development program changed my life completely. I learned tailoring and now I run my own small business, supporting my family independently. My monthly income has increased from ₹2,000 to ₹8,000.”* — **Lakshmi Devi**, *Women Empowerment Program, Dindigul*
- **Story 2 — category "Health & Sanitation":** *“Before Coodu Trust came to our village, we had to walk 3 kilometers for clean water. Now with the new water system and sanitation facilities, our children are healthier and our women save 2 hours daily.”* — **Murugan S.**, *Village Head, Karur District*
- **Story 3 — category "Sustainable Agriculture":** *“The organic farming training helped us reduce our costs by 40% and increase crop yield by 25%. We no longer depend on expensive chemical fertilizers and our soil health has improved significantly.”* — **Raman Kumar**, *Farmer, Environmental Program*

**Live Statistics Banner**
- H4: **We Have Only One Planet**
- Sub: *It's time to wake up to the grim reality and get our act together.*
- Counters (label / target): **World population** `8192242010` · **Tonnes of waste dumped** `1198948812` · **Tonnes of electronic waste** `28277094` · **Number of Earths humanity uses** `1.72`

**Footer (shared chrome — preserve content)**
- About: *Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000.*
- Quick Links: About Us → `about.html`, Our Programs → `programs.html`, Careers → `careers.html`, Donate → `donate.html`
- Contact (address): **H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.** · Email: **director@coodutrust.org** (`mailto:`) · Phone: **+91-451-2461362** (`tel:+914512461362`)
- Follow Us: Facebook, Twitter, Instagram (hrefs currently `#`)
- Copyright: **© 2025 Coodu Trust. All Rights Reserved.**

**Header Donate CTA (shared chrome):** **Donate** → `donate.html`

---

## 5. Enhancement direction (TO-BE) — opinionated

**Overall:** kill the washed-out body-photo overlay; make the page a calm, confident, banded scroll — generous whitespace, big honest field photos, green identity, numbers up front (charitywater/goonj mood from the Style Gate).

**Order (recommended TO-BE flow):**
1. **Hero** — full-bleed photo (keep the rotating slideshow, but slow + crossfade), green→dark gradient scrim bottom-left, H1 + subtitle, **TWO CTAs**: primary accent **Donate** (or **Get Involved**) + secondary outline **Explore Our Work**. Add a thin trust line under CTAs: *"A registered non-profit serving rural Tamil Nadu since 2000 · Dindigul."*
2. **Impact stats (4-up)** — promote directly under hero on `--surface`; consistent single-color line icons, large green numbers, animated count-up, thin label. Optionally add an eyebrow "Our impact at a glance".
3. **Mission + video** — 2-col on desktop (text left, 16:9 responsive video right), banded `--surface-alt`. Keep the 3-word "Community. Compassion. Collaboration." but render all three in ONE brand treatment (green, with weight/size emphasis) instead of mixed blue/green.
4. **Core Programs** — **show all 6 pillars** (add Women Empowerment, fix the headshot image) in an even **3×2** grid; uniform 16:9 images, category-consistent photos, "Learn more →". End with a secondary link/button **See all programs →** `programs.html`.
5. **Stories of Transformation** — keep the carousel; modernize to a large image + quote card, visible prev/next, dots, autoplay with pause-on-hover; preserve all 3 quotes verbatim. Consider showing 2-up on desktop.
6. **Audience-fork CTA band** — keep the 2-up "Get Help / Get Involved", but on a strong green band with white text so it reads as the page's action moment; ensure 44px+ touch targets.
7. **Live planet stats** — keep as the dark closing band BUT format numbers with separators and add an "estimated, live" caption; alternatively reframe as COODU's environmental contribution to end on the org's own work. Lowest-priority block — fine to keep last before footer.

**Add:** trust strip (est. 2000, location, registration/80G/12A cue if available); "See all programs →" link; partner/funder logo row is optional (only if assets exist — don't fabricate).
**Remove:** body background photo + fixed white overlay; all `style="background: transparent !important;"`; inline iframe dimensions; off-brand blue.
**Reorder:** none mandatory beyond the above; current order is sound once banding is added.

**▶ YOUR ENHANCEMENT NOTES: ____**

---

## 6. Three-viewport layout spec (the core deliverable)

Global: max content width per Style Gate (`~1140–1200px` centered), 8px spacing system, section vertical padding desktop 96px / mobile 56px, side gutters desktop 24px / mobile 16px. Banding alternates `--surface` / `--surface-alt`. Honor `prefers-reduced-motion` (disable count-up, slideshow auto-advance, image zoom).

### WEB (desktop, >=1025px)
- **Header:** sticky, full horizontal nav with Programs mega-menu + Get Involved dropdown; standalone accent **Donate** button right-aligned. (Chrome doc.)
- **Hero:** full-viewport-width, ~80–90vh, background slideshow with crossfade; content constrained to container, left-aligned bottom-left; H1 ~48px, subtitle ~18–20px max ~640px wide; two CTAs inline; dots bottom-center; gradient scrim for legibility.
- **Impact:** 4-column grid (`repeat(4,1fr)`, gap 24–32px), centered cards, icon→number→label.
- **Mission:** 2-column `minmax(0,1fr) minmax(0,1fr)` (text + 16:9 video), gap ~48px, vertically centered; text column capped ~560px.
- **Programs:** 3-column grid, **2 rows** (6 cards), gap 24–32px; cards = 16:9 image top, content below; hover lift + image zoom 1.03. "See all programs →" centered beneath.
- **CTA band:** 2 equal columns edge-to-edge inside a green band; each with heading, line, light button.
- **Stories:** centered, max ~960px; large image-left / quote-right card (or single wide card) with arrows flanking and dots beneath; OR 2-up. Autoplay + manual.
- **Stats banner:** dark band; `.stats-intro` left (~30%) + 4 stat items right in a `repeat(4,1fr)` or `repeat(2,2)` row; big count-up numbers.
- **Footer:** 4-column grid. (Chrome doc.)

### TABLET (768–1024px)
- **Header:** condensed nav or hamburger drawer (per chrome doc breakpoint).
- **Hero:** ~60–70vh; H1 ~38–40px; two CTAs may stack if cramped; dots bottom-center.
- **Impact:** **2×2** grid (`repeat(2,1fr)`), gap 24px.
- **Mission:** remains 2-col if it fits (text + video) OR stacks to video-over-text at the narrow end; video stays 16:9 full-width of its column.
- **Programs:** **2-column** grid, 3 rows (6 cards).
- **CTA band:** 2-col preserved (or stack to 2 rows if text crowds).
- **Stories:** single card, image top / quote below; arrows + dots beneath.
- **Stats banner:** intro on top, stats as **2×2** below; numbers scale down.
- **Footer:** 2×2 column grid.

### MOBILE (<=600px)
- **Header:** logo + hamburger; slide-in right drawer with overlay (per Style Gate §1.10 / chrome doc); Donate prominent inside drawer and/or sticky.
- **Hero:** ~70vh min, content bottom-aligned, H1 ~30–32px (never crammed), subtitle ~16px; CTAs **full-width stacked** (primary above secondary), 44px+ tall; dots bottom-center; ensure scrim keeps text legible on every slide.
- **Impact:** **1 column** stacked (or 2×2 if cards stay legible — prefer single-column for breathing room), each card centered.
- **Mission:** stacked — **video first (16:9 full-width), then heading, text, button**.
- **Programs:** **1 column**, full-width cards, 16:9 images; "See all programs →" full-width.
- **CTA band:** 2 boxes stacked vertically, full-width buttons.
- **Stories:** 1 card, image top / quote below; arrows as tappable controls or swipe; dots beneath.
- **Stats banner:** intro then stats **stacked 1-col** (or 2×2 compact); numbers wrap-safe with separators.
- **Footer:** single column, stacked sections.
- **Type minimum:** body never below 16px (Style Gate §1.4).

---

## 7. Components used (reference the shared design system / Style Gate)

Global tokens (color, type, radius, shadow, spacing, button/card styles) are defined in `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/design/REDESIGN-STYLE-GATE.md` and will live in `tokens.css`. **Do not redefine them here.** This page composes these shared components:

- **Site header / nav + mega-menu + mobile drawer** — `header.css` (shared chrome).
- **Site footer** — `footer.css` (shared chrome).
- **Hero** (full-bleed slideshow + overlay + dots + actions) — `hero.css`.
- **Button** — `.btn--primary` (green), `.btn--secondary` (outline), `.btn--cta`/accent (Donate) — `button.css`. Min height 44px.
- **Card** (program preview: media 16:9 → title → 2-line summary → "Learn more →") — `card.css`.
- **Stat block** (`.stat__num` count-up + `.stat__label`) — used by both Impact (light) and Planet banner (dark) — `stats.css`.
- **Testimonial / carousel** (image + quote + author + category tag, dots + arrows) — carousel component (`gallery.css` / a `carousel` component).
- **Media embed** (responsive 16:9 video wrapper) — layout/aspect utility.
- **Section / container / grid** primitives + spacing utilities — `layout.css`.
- **CTA band** (split 2-up action band) — composed from layout + button.
- All visual values inherit from `tokens.css`; section banding uses `--surface` / `--surface-alt`.

---

## 8. Ready-to-paste Claude-design instruction

> Paste this into Claude design (browser) **together with the filled COODU Trust Style Gate** (`design/REDESIGN-STYLE-GATE.md`).

```
Design the HOMEPAGE for COODU Trust — a rural-development NGO in Dindigul, Tamil Nadu,
working since 2000 in women empowerment, environment, agriculture, education, and
health/sanitation. Apply the COODU Trust Style Gate I'm providing (green primary, one
accent for Donate, Oswald-style display + readable body font, soft rounded cards, calm
generous whitespace, alternating white / soft-green section bands). Do NOT use all-caps
body text — caps only on short labels/tags. Do NOT wash the page with a translucent
background photo; use intentional section banding.

Produce THREE clean, self-contained designs of the SAME page: WEB (>=1025px), TABLET
(768-1024px), and MOBILE (<=600px).

Sections, in order (keep this copy EXACTLY — only normalize casing out of all-caps):

1. HERO — full-bleed rotating field-photo background with a green gradient scrim.
   H1 "Empowering Communities, Transforming Lives"; subtitle "Join us in our mission to
   create a sustainable and equitable future for rural communities through empowerment,
   health, and environmental action."; TWO buttons — primary accent "Donate" and outline
   "Discover Our Work"; a small trust line "A registered non-profit serving rural Tamil
   Nadu since 2000 · Dindigul"; slideshow dots.
2. IMPACT — title "Our Impact at a Glance"; four stat cards (icon + number + label):
   3,81,609+ Total Beneficiaries · 534 Panchayats Served · 18,523+ Toilets Built ·
   26,93,250 Trees Planted. Desktop 4-up, tablet 2x2, mobile stacked.
3. MISSION + VIDEO — 2-col (text + responsive 16:9 video). Heading words
   "Community. Compassion. Collaboration." in one green brand treatment. Body: "The
   mission of Coodu Trust is to improve the quality of life for economically disadvantaged
   individuals by providing the necessary resources to increase their standard of living,
   foster self-improvement, and maximize self-empowerment." Button "Learn More".
4. CORE PROGRAMS — title "Our Core Programs"; a 6-card grid (desktop 3x2, tablet 2-col,
   mobile 1-col), each card = photo + title + one-line summary + "Learn more →":
   Environment and Resilience · Sustainable Agriculture · Education and Skilling ·
   Health, Sanitation & Waste Management · Women Empowerment · Consultancy and HR
   Management. End with a "See all programs →" link.
5. AUDIENCE CTA BAND — strong green band, two side-by-side cards:
   "Are You Looking for Support?" → button "Get Help"; and
   "Do You Want to Make a Difference?" → button "Get Involved".
6. STORIES OF TRANSFORMATION — title + intro "Witness the powerful journeys of
   communities and individuals transformed through our programs"; a testimonial carousel
   (image + category tag + quote + author) with these three, verbatim:
   • "Coodu Trust's skill development program changed my life completely..." — Lakshmi
     Devi, Women Empowerment Program, Dindigul (tag: Women Empowerment)
   • "Before Coodu Trust came to our village, we had to walk 3 kilometers for clean
     water..." — Murugan S., Village Head, Karur District (tag: Health & Sanitation)
   • "The organic farming training helped us reduce our costs by 40%..." — Raman Kumar,
     Farmer, Environmental Program (tag: Sustainable Agriculture)
   Dots + prev/next arrows.
7. PLANET STATS BANNER — dark band; heading "We Have Only One Planet"; sub "It's time to
   wake up to the grim reality and get our act together."; four animated count-up stats
   with thousands separators: 8,192,242,010 World population · 1,198,948,812 Tonnes of
   waste dumped · 28,277,094 Tonnes of electronic waste · 1.72 Number of Earths humanity
   uses.
8. FOOTER — 4 columns: logo + "Coodu Trust is a registered non-profit organization
   working towards sustainable development in Tamil Nadu, India since 2000."; Quick Links
   (About Us, Our Programs, Careers, Donate); Contact ("H-83, R.M. Colony, Dindigul –
   624 001, Tamil Nadu, India.", director@coodutrust.org, +91-451-2461362); social icons
   (Facebook, Twitter, Instagram). Bottom: "© 2025 Coodu Trust. All Rights Reserved."

Header (all viewports): logo + wordmark "Coodu Trust"; nav Home/About/Programs/Get
Involved/Documents/Media/Contact; standalone accent "Donate" button; hamburger →
right slide-in drawer on tablet/mobile.

Make all buttons >=44px tall, all body text >=16px on mobile, keep motion calm, and show
the same content faithfully across all three viewports.
```
