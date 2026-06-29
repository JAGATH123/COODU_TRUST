# Shared Header & Footer (Global Chrome) — Design Doc

## 1. Identity
- **File(s):** The canonical markup lives in `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/index.html` (header `lines 23–125`, footer `lines 382–420`). Styling: `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/css/style.css` (root tokens `7–29`, buttons `103–154`, header/nav `748–978`, footer `2721–2784`) and `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/css/responsive.css` (entire file, `1–299`). Behavior: `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/js/main.js` (`lines 41–105`).
- **COVERAGE:** This is the **global chrome** — the `<header class="header">` + `<footer class="footer">` pair that is copy-pasted into the top and bottom of **every page on the site**. Per the Style Gate, that is roughly **53+ real pages**: 15 top-level pages (Home, About, Programs hub, Get Involved, Documents, Media, Contact, Donate, Volunteer, Partner, Careers, + status/legal), ~38 program pages under `/programs/`, plus project pages under `/programs/projects/`. **This doc governs every page on the site.**
- **One-line role/job:** Persistent brand + wayfinding shell — get any visitor (donor/CSR on desktop, villager/volunteer on mobile) to the right program or to Donate within two taps, and close every page with trust signals (registration, address, contact, socials).

---

## 2. Current structure (AS-IS) — section by section

### A. Global page background (body-level, not chrome but wraps the chrome)
- `<body>` carries an **inline** `background-image` (Cloudinary `aboutus/background.jpg`), `background-attachment: fixed`, `cover`, plus a sibling **fixed full-viewport white overlay** at `rgba(255,255,255,0.4)`, `z-index:-1` (`index.html lines 19–21`). Every section then re-declares `background: transparent !important` inline so this photo bleeds through the whole site. Mentioned here because the redesigned chrome must sit on a clean surface, not this overlay hack.

### B. HEADER — `header.header` (`index.html 23–125`)
- **Purpose:** Sticky top navigation bar present on every page.
- **Behavior/visuals (`style.css 750–762`):** `position: sticky; top:0; z-index:1000; width:100%`. Background is a **white gradient `rgba(255,255,255,.5)→rgba(255,255,255,.932)` over a raster image `../images/headers/all_header.png`** (`cover/center`), plus `box-shadow: 0 2px 10px rgba(0,0,0,.1)`.
- **Inner wrapper:** `.container` (max-width 1200px) → `nav.navbar` — `display:flex; justify-content:space-between; align-items:center; height:100px` (`764–769`).
- **Components inside the navbar:**
  1. **Logo** `a.logo[href=index.html]` (`27–30`): `img.logo-img` (Cloudinary `coodu_frontlogo.png`, **CSS height 125px**) + `span.logo-text` "Coodu Trust" (1.8rem, 700, uppercase, `margin-left:-25px`). Note the logo image (125px) is **taller than the 100px bar**.
  2. **Primary nav** `ul.nav-menu` (`33–113`, flex, gap 18px) — 7 visible top-level items:
     - `Home` → index.html (`.active` on home)
     - `About` → about.html
     - `Programs` → programs.html — **`li.dropdown` mega-menu** (`37–99`): a 280px `ul.dropdown-menu` listing **6 category links**, each a `li.dropdown-submenu` that on hover opens a **second-level flyout `ul.dropdown-submenu-menu`** (300px, positioned `left:100%`, opens to the right) of individual program pages. ~30 program links total live in this hover tree.
     - `Get Involved` → get-involved.html — **`li.dropdown`** (`101–108`) with a flat `ul.dropdown-menu`: Partner with Us, Volunteer, Donate.
     - `Documents` → documents.html
     - `Media` → media.html
     - `Contact` → contact.html
  3. **Donate button** `a.btn.btn-primary.donate-button[href=donate.html]` (`115`) — standalone, a **sibling of `.nav-menu`** (not a list item). Green `.btn-primary`. **Note: there is no `.donate-button` CSS rule anywhere**; it inherits only `.btn`+`.btn-primary`.
  4. **Hamburger** `div.hamburger` with 3 `span.bar` (`118–122`) — `display:none` on desktop, shown ≤1200px.
- **Nav interaction model:**
  - **Desktop dropdowns are hover-only** (`.dropdown:hover .dropdown-menu`, `.dropdown-submenu:hover .dropdown-submenu-menu`) with opacity/transform transitions. No click, no `aria-expanded`, no keyboard support.
  - **Underline affordance:** `.nav-link::after` grows a 3px green underline on hover/active.
  - **Mobile/tablet (≤1200px, `responsive.css 7–132`):** hamburger shown; `.nav-menu` becomes a **fixed off-canvas panel** sliding from `left:-100%`→`0`, `top:100px`, `height:calc(100vh - 100px)`, white bg, vertical, scrollable. JS (`main.js 47–101`) toggles `.active` on hamburger+menu, animates bars into an X, and **click-toggles** each dropdown / nested submenu (`display:block/none`) with `▼/▲` carets and progressive indentation (40px / 60px).

### C. MAIN — page-specific content
Everything between `</header>` and `<footer>` is the per-page body and is **out of scope** for this doc (covered by each page's own doc). On Home it is: hero slideshow, Impact stats, Mission+video, Programs grid, CTA band, Stories carousel, Live-stats banner.

### D. FOOTER — `footer.footer#contact` (`index.html 382–420`)
- **Purpose:** Closing trust block + secondary nav + contact, on every page.
- **Visuals (`style.css 2721–2784`):** solid `background:#1e7e34` (dark green), white text, `padding:60px 0 20px`.
- **Layout:** `.container` → `.footer-grid` — `display:grid; grid-template-columns:repeat(4,1fr); gap:40px`. Four `.footer-col`:
  1. **Brand:** `img.footer-logo` (Cloudinary `logo-white.png`, height 60px) + `p.footer-about` (about sentence, `text-transform:none`).
  2. **Quick Links:** `h4.footer-heading` "Quick Links" + `ul.footer-links`: About Us, Our Programs, Careers, Donate.
  3. **Contact Us:** `h4.footer-heading` + `<address class="footer-contact">` — postal address, mailto email link, tel phone link.
  4. **Follow Us:** `h4.footer-heading` + `.social-links` — Facebook / Twitter / Instagram icon images (Cloudinary), each `<a href="#">` (dead) with `aria-label`.
- **Footer bottom:** `.footer-bottom` — centered copyright, `border-top:1px solid #34495e` (a slate-blue hairline on green).
- **Responsive (`responsive.css`):** `.footer-grid` → `repeat(2,1fr)` at ≤992px → `1fr` at ≤768px with `.footer-col{text-align:center}`, `.footer-about` centered max-350px, `.social-links{justify-content:center}`.

---

## 3. Current weaknesses (be specific & honest)

1. **Entire `<body>` is `text-transform: uppercase`** (`style.css 52`). Every nav link, footer link, address, and copyright renders ALL-CAPS — exhausting and low-legibility, especially on mobile. **Fix:** caps for the logo wordmark and small section labels only; sentence-case all nav text, footer links, address, and copyright.
2. **Logo overflows the bar.** `.logo-img` is `height:125px` inside a `100px` navbar (`style.css 768, 789`). The logo literally spills past the header edges and dominates the bar. **Fix:** logo lockup capped at ~40–48px mark height; bar height ~72–80px desktop.
3. **`.donate-button` has no CSS and the mobile donate rules are orphaned.** Markup uses `class="...donate-button"` (`index.html 115`) but the only styled class is `.donate-link` — including all the `@media(max-width:1200px)` donate overrides in `responsive.css 52–62`. So the responsive donate styling **never applies** (wrong class). **Fix:** one canonical Donate (CTA/accent) component, styled at all breakpoints; keep it visible in the bar on every viewport.
4. **Hover-only mega-menu is inaccessible and fragile.** The Programs tree (6 categories → ~30 nested links) opens only on hover, flies out `left:100%` (can collide with viewport edge), has no `aria-expanded`, no focus/keyboard path, and no click fallback. **Fix:** click/focus-driven mega-menu panel (a single multi-column dropdown, not a right-flyout), full keyboard + `aria-expanded`/`aria-controls`, ESC to close.
5. **Raster header background image adds weight + noise for nothing.** `all_header.png` (214KB) sits behind a near-opaque white gradient — barely visible, but loads on every page. **Fix:** flat white/surface header, drop the image.
6. **Off-brand footer hairline + stale year.** `border-top:#34495e` (cold slate-blue) clashes with the green footer; copyright reads "© 2025" while the org is "since 2000." **Fix:** hairline in a tinted-green/white-alpha; dynamic year, e.g. "© {year}".
7. **Dead social links.** All three socials are `href="#"` (`index.html 410–412`). **Fix:** real URLs or remove until available.
8. **No skip-link, no landmark labeling, no scrolled state.** No "skip to content," nav has no `aria-label`, and the sticky header never compacts on scroll. **Fix:** add skip-link, `<nav aria-label="Primary">`, and an optional shrink-on-scroll state.
9. **External Cloudinary dependency for chrome assets.** Header/footer logos + social icons load from Cloudinary (tied to the project's exposed-secrets concern) although local copies exist in `assets/images/logos/` and `assets/images/icons/`. **Fix:** serve chrome assets locally.
10. **Mobile mega-menu is a long scroll.** Expanding Programs in the off-canvas panel reveals ~30 indented links — heavy. **Fix:** collapse categories by default (accordion), keep only one open at a time.

---

## 4. Content — source of truth (PRESERVE this)

> Preserve every label and link target below **verbatim**. Only the letter-casing may change (ALL-CAPS → sentence/Title case).

### Header
- **Logo wordmark:** `Coodu Trust` → links to `index.html`. Logo image alt: `Coodu Trust Logo`.
- **Primary nav (top level):**
  - `Home` → `index.html`
  - `About` → `about.html`
  - `Programs` → `programs.html`
  - `Get Involved` → `get-involved.html`
  - `Documents` → `documents.html`
  - `Media` → `media.html`
  - `Contact` → `contact.html`
- **Header CTA button:** `Donate` → `donate.html`

- **Programs mega-menu — 6 categories, each with sub-items (preserve all):**
  1. **Environment and Resilience** → `programs/environment-resilience.html`
     - Watershed Management → `programs/watershed-management.html`
     - Plantation & Afforestation → `programs/plantation-afforestation.html`
     - Water Resource Management → `programs/water-resource-management.html`
     - Soil & Land Management → `programs/soil-land-management.html`
     - Biodiversity Conservation → `programs/biodiversity-conservation.html`
     - Climate Change Adaptation & Mitigation → `programs/climate-change-adaptation.html`
  2. **Sustainable Agriculture** → `programs/sustainable-agriculture.html`
     - Farmer Collectivization & Agribusiness → `programs/farmer-collectivization.html`
     - Livestock & Allied Activities → `programs/livestock-allied.html`
     - Horticulture & Diversified Farming → `programs/horticulture-diversified.html`
     - Agricultural Technology & Youth Engagement → `programs/agricultural-technology.html`
     - Organic Farming Practices → `programs/organic-farming.html`
  3. **Women Empowerment** → `programs/women-empowerment.html`
     - Social Empowerment & Leadership → `programs/social-empowerment-leadership.html`
     - Microfinance & Financial Inclusion → `programs/microfinance-financial-inclusion.html`
     - Entrepreneurship & Enterprise Development → `programs/entrepreneurship-enterprise-development.html`
     - SHG & Community Mobilization → `programs/shg-community-mobilization.html`
  4. **Education and Skilling** → `programs/education-skilling.html`
     - Vocational & Livelihood Training → `programs/vocational-livelihood-training.html`
     - Digital Literacy & IT Training → `programs/digital-literacy-it-training.html`
     - Formal & Higher Education Support → `programs/formal-higher-education-support.html`
     - School Infrastructure Development → `programs/school-infrastructure-development.html`
  5. **Health, Sanitation & Waste Management** → `programs/health-sanitation.html`
     - Health Support & Rehabilitation → `programs/health-support-rehabilitation.html`
     - Community Health Services → `programs/community-health-services.html`
     - Disease-Specific Interventions → `programs/disease-specific-interventions.html`
     - Water Quality & Safety → `programs/water-quality-safety.html`
     - Sanitation & Hygiene Infrastructure → `programs/sanitation-hygiene-infrastructure.html`
     - Solid Waste Management → `programs/solid-waste-management.html`
  6. **Consultancy and HR Management** → `programs/consultancy-hr.html`
     - Technology & Knowledge Dissemination → `programs/technology-knowledge-dissemination.html`
     - Strategic Planning & Advisory Services → `programs/strategic-planning-advisory.html`
     - Human Resource & Staffing Solutions → `programs/hr-staffing-solutions.html`

- **Get Involved dropdown:**
  - Partner with Us → `partner.html`
  - Volunteer → `volunteer.html`
  - Donate → `donate.html`

### Footer
- **Brand blurb (verbatim):** "Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000." (logo alt: `Coodu Trust White Logo`)
- **Quick Links heading:** "Quick Links"
  - About Us → `about.html`
  - Our Programs → `programs.html`
  - Careers → `careers.html`
  - Donate → `donate.html`
- **Contact Us heading:** "Contact Us"
  - Address (verbatim): "H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India."
  - Email: `director@coodutrust.org` (link `mailto:director@coodutrust.org`)
  - Phone: `+91-451-2461362` (link `tel:+914512461362`)
- **Follow Us heading:** "Follow Us" — Facebook, Twitter, Instagram (currently `href="#"`; keep labels/icons, supply real URLs when known).
- **Copyright (verbatim text, update year handling):** "© 2025 Coodu Trust. All Rights Reserved."

---

## 5. Enhancement direction (TO-BE) — opinionated

**Header**
- **Slim, flat, white sticky bar.** Drop the raster background and the body-level photo overlay. Bar height ~72px desktop / ~64px mobile. Logo lockup = mark (~40px) + "Coodu Trust" wordmark; fix the 125px overflow.
- **Three zones:** left = logo; center/right = primary nav; far right = a single high-contrast **Donate** CTA in the §1.7 accent color, always visible at every breakpoint (it is the one button that must be clicked).
- **Replace the hover right-flyout mega-menu with a click/focus mega-panel.** One wide dropdown under "Programs" laid out as **a multi-column grid of the 6 categories**, each category a bold heading (linking to its hub) with its child program links beneath. No second-level flyout. Full keyboard support, `aria-expanded`, ESC-to-close, click-outside-to-close. "Get Involved" stays a small simple dropdown (3 links).
- **Optional scrolled state:** subtle shadow appears once the page scrolls; logo may shrink a touch. Add a **skip-to-content** link and `<nav aria-label="Primary">`.
- **Active-page indicator** stays (the green underline), but driven by the current page, not just Home.

**Footer**
- Keep the **green band** but make it the Style Gate's primary-dark green; warm, calm, not busy. Four columns on desktop collapsing gracefully.
- Re-order columns left→right: **Brand+blurb → Quick Links → Contact Us → Follow Us**, exactly the current order (good). Make the address and contacts genuinely scannable (icon + line), keep `mailto:`/`tel:` live.
- Fix the hairline to a green-tinted / white-alpha divider (kill `#34495e`). **Dynamic year** in copyright. Add an optional small registration/legal line and a "Back to top" affordance.
- Serve logo + social icons **locally** (assets exist), and wire real social URLs or hide dead ones.
- Consider one slim trust strip above the footer (partner/funder logos already exist in `assets/images/icons/`: NABARD, KVB, SBI, NSDC, Tata Power, Tamil Nadu Govt) — optional, only if it doesn't clutter.

▶ YOUR ENHANCEMENT NOTES: ____

---

## 6. Three-viewport layout spec (the core deliverable)

### WEB (desktop, ≥1025px)
- **Header:** single sticky row, max-width 1140px centered with 24px side gutters, ~72px tall, flat white surface, hairline/soft shadow at bottom. Left: logo lockup (mark ~40px + wordmark). Right cluster (one row, ~16–18px gap): Home · About · **Programs ▾** · **Get Involved ▾** · Documents · Media · Contact, then the **Donate** CTA pill in accent color. Active link shows the green underline.
  - **Programs mega-panel:** opens on click/focus, full-width-ish dropdown (anchored under the trigger, ~960–1100px), **6-column (or 3×2) grid**; each cell = category heading link + its program links stacked under it. Soft shadow, 12px radius, opens/closes with a short fade; closes on ESC / outside-click.
  - **Get Involved dropdown:** small 220–260px panel, 3 stacked links.
- **Footer:** green band, content max-width 1140px. **4 equal columns** (Brand+blurb / Quick Links / Contact / Follow Us), 40px gap, ~64–96px top padding. Below: full-width hairline → centered copyright row (~20px padding). Optional "Back to top" at far right of the bottom row.

### TABLET (768–1024px)
- **Header:** **hamburger mode begins here** (current breakpoint is ≤1200px; keep hamburger for the full tablet range given 7 items + mega-menu). Bar ~72px. Left: logo. Right: **Donate** CTA stays visible in the bar + hamburger icon beside it. Tapping hamburger opens a full-width **off-canvas panel** sliding from the left, starting just under the header, white, vertically scrollable. Inside: the 7 links stacked; Programs and Get Involved are **tap-to-expand accordions** (one open at a time), Programs revealing the 6 categories, each expandable to its program links with clear indentation.
- **Footer:** **2 columns** (per `responsive.css 181`), 30px gap; columns keep left alignment; copyright centered below the hairline.

### MOBILE (≤600px)
- **Header:** compact bar ~56–64px. Left: logo (mark + smaller wordmark, ~32–36px mark). Right: **Donate** CTA (compact) + hamburger. Off-canvas menu = full-screen panel, white, sentence-case links at ≥16px, min 44px tap targets, generous vertical padding. Programs/Get Involved are collapsed accordions by default; expanding Programs shows 6 collapsed category rows (chevrons), each opening its sub-links. A persistent close (X) at top of the panel; tapping a leaf link closes the menu.
- **Footer:** **single column, centered** (per `responsive.css 274–277`). Order: logo + blurb (max ~350px centered) → Quick Links → Contact (address/email/phone, tap-to-call/mail) → Follow Us (icons centered). Hairline → centered copyright. Comfortable 24–32px gaps between stacked groups.

**Spacing intent across all viewports:** 8px base unit; header internal padding multiples of 8; footer top padding 96px desktop / 56–64px mobile; touch targets ≥44px on tablet/mobile.

---

## 7. Components used (reference the shared design system / Style Gate)

> Global tokens (colors, fonts, radius, shadows, button & card styles) are defined in `design/REDESIGN-STYLE-GATE.md`. **Do not redefine them here** — reference only.

- **Primary button / CTA button** — for the **Donate** action (Style Gate §1.7: accent/CTA color, ≥44px height, sentence case, slight leading icon optional).
- **Text/link with arrow affordance** — footer Quick Links, "Learn more →" style (§1.7).
- **Nav link + active underline** — primary nav item pattern.
- **Dropdown / mega-menu panel** — surface, 12px radius, soft low shadow, hairline border (§1.6).
- **Logo lockup** — mark + "Coodu Trust" wordmark (display font, §1.4).
- **Off-canvas mobile menu + hamburger/X** — mobile nav pattern.
- **Footer band (dark/primary-dark section)** — §1.3 dark sections; white text, hairline divider, social icon row.
- **Hairline / divider** token (§1.6 border color) for footer top border and bottom row.
- **Type & case rules** — §1.4: caps for wordmark/labels only, sentence case for nav + footer body.
- **Spacing scale** — §1.5 (8px base; section paddings).

---

## 8. Ready-to-paste Claude-design instruction

> Paste this into Claude design (browser) **together with the filled `design/REDESIGN-STYLE-GATE.md`**.

```
Design the GLOBAL HEADER and FOOTER (shared chrome) for the COODU Trust NGO website
(Dindigul, Tamil Nadu) — a 20+-year rural-development charity. Produce THREE clean,
self-contained mockups: WEB (≥1025px), TABLET (768–1024px), MOBILE (≤600px).
Apply the attached STYLE GATE exactly for all colors, fonts, radius, shadows, buttons.

HEADER — slim flat white sticky bar, max content width 1140px:
- Left: logo lockup = small mark + wordmark "Coodu Trust" (links Home). No oversized logo.
- Primary nav (this exact order & wording): Home · About · Programs ▾ · Get Involved ▾ ·
  Documents · Media · Contact.
- Far right: a single high-contrast DONATE button in the accent color, visible on ALL three
  viewports.
- "Programs ▾" opens a CLICK/FOCUS mega-panel: a multi-column grid of 6 category headings,
  each with its sub-links beneath (content below) — NOT a hover right-flyout. Keyboard
  accessible, ESC closes.
- "Get Involved ▾" is a small dropdown: Partner with Us, Volunteer, Donate.
- Tablet & mobile: hamburger menu; Donate stays in the bar; nav opens as a full-height
  off-canvas panel where Programs and Get Involved are tap-to-expand accordions (one open at
  a time). Min 44px tap targets. Sentence case (NOT all-caps).

Programs mega-panel content (6 categories, each heading is a link):
- Environment and Resilience: Watershed Management; Plantation & Afforestation; Water Resource
  Management; Soil & Land Management; Biodiversity Conservation; Climate Change Adaptation &
  Mitigation.
- Sustainable Agriculture: Farmer Collectivization & Agribusiness; Livestock & Allied
  Activities; Horticulture & Diversified Farming; Agricultural Technology & Youth Engagement;
  Organic Farming Practices.
- Women Empowerment: Social Empowerment & Leadership; Microfinance & Financial Inclusion;
  Entrepreneurship & Enterprise Development; SHG & Community Mobilization.
- Education and Skilling: Vocational & Livelihood Training; Digital Literacy & IT Training;
  Formal & Higher Education Support; School Infrastructure Development.
- Health, Sanitation & Waste Management: Health Support & Rehabilitation; Community Health
  Services; Disease-Specific Interventions; Water Quality & Safety; Sanitation & Hygiene
  Infrastructure; Solid Waste Management.
- Consultancy and HR Management: Technology & Knowledge Dissemination; Strategic Planning &
  Advisory Services; Human Resource & Staffing Solutions.

FOOTER — green band (Style Gate primary-dark green), white text. 4 columns desktop → 2 tablet
→ 1 centered mobile:
1) Logo (white) + blurb: "Coodu Trust is a registered non-profit organization working towards
   sustainable development in Tamil Nadu, India since 2000."
2) "Quick Links": About Us; Our Programs; Careers; Donate.
3) "Contact Us": H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India. ·
   director@coodutrust.org · +91-451-2461362.
4) "Follow Us": Facebook, Twitter, Instagram icons.
Bottom: subtle green-tinted hairline + centered "© 2025 Coodu Trust. All Rights Reserved."
(use a dynamic year). Optional "Back to top".

Style: grounded, trustworthy, warm, modern; generous whitespace; calm. No all-caps body text,
no busy raster textures behind the bar. Show each of the three viewports as a separate clean frame.
```
