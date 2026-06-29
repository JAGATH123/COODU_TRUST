# Build Spec 01 — Shared Chrome (Global Header & Footer)

> **Status:** Build contract. Derived from the approved redesign canvas
> `NGO Website Design Enhancement/COODU Trust Redesign.dc.html` (frames 1–7), the render images
> `design/redesign-renders/redesign-home-desktop-.png` + `redesign-home-mobile-drawer-.png`, and the
> content doc `design/page-docs/00-shared-header-footer.md`. Token names follow
> `design/REDESIGN-STYLE-GATE.md`. **Where the design source and the page doc disagree, the design
> source wins** (it is the visual truth); every such case is flagged inline as ⚠ DEVIATION.

---

## A. Purpose & coverage

The **global chrome** is the `<header>` + `<footer>` pair injected at the top and bottom of **every page
on the site** (~53+ pages: 15 top-level, ~38 program pages, project pages). One build, shared everywhere.

**Job:** persistent brand + wayfinding shell that gets any visitor (desktop donor/CSR or mobile
villager/volunteer) to the right Program or to **Donate** within two taps, and closes every page with
trust signals (registration blurb, address, phone/email, socials).

**Build philosophy (hard requirement):** rebuild as clean **semantic HTML** + a **shared design-system
CSS** (`tokens.css` + component partials). This is NOT a CSS-overlay patch on the legacy markup. The
legacy header/footer (oversized 125px logo, raster `all_header.png`, body-level photo overlay,
all-caps body, hover-only mega-menu, orphaned `.donate-button` class) is **replaced**, not skinned.

### How the design expresses responsiveness (read this first)
The canvas has **no `clamp()`, no `{{ }}` bindings, and `renderVals(){ return {}; }`** — it ships
**fixed-width frames** (Desktop = 1280px, Mobile = 390px) with fully inline styles. There is **no tablet
frame for the chrome.** So: desktop and mobile values below are lifted verbatim from the frames; the
**tablet (600–1199) column is derived** from the page doc §6 + interpolation, and is called out as
DERIVED. Use the design-system breakpoints printed on the token frame: **600 / 900 / 1200**.

| Range | Header mode | Footer columns |
|---|---|---|
| **WEB ≥ 1200** | Full horizontal nav + click mega-panel | 4 columns (1.6 / 1 / 1.3 / 1 fr) |
| **TABLET 600–1199** | Hamburger + right off-canvas drawer; Donate stays in bar | 2 columns *(DERIVED)* |
| **MOBILE < 600** | Compact bar; hamburger + compact Donate; full drawer | 1 column, centered |

---

## B. Design tokens (canonical — from frame 7 "Design tokens")

Port these into `tokens.css`. Names use the Style Gate convention; values are the **exact** ones the
design uses. Rows marked **NEW** are not yet in the Style Gate but are required by the chrome — add them.

### Color
| Token | Hex | Use in chrome |
|---|---|---|
| `--color-primary` | `#1e7e34` | logo chip, active nav, nav hover, footer logo glyph, social hover |
| `--color-primary-dark` | `#155d27` | primary-button hover (not used in chrome bar) |
| `--color-deep` **NEW** | `#11371b` | **footer background** |
| `--color-dark-band` **NEW** | `#161d18` | "one planet" band (body, not chrome — reference only) |
| `--color-amber` **NEW** | `#f4a300` | **active-nav underline**, drawer active dot |
| `--color-amber-gold` **NEW** | `#f6c453` | gold eyebrow on dark heroes (body, reference) |
| `--color-amber-text` **NEW** | `#c47f00` | amber word in headings (body, reference) |
| `--color-accent` | `#e8590c` | **Donate CTA** fill (all viewports) |
| `--color-accent-dark` **NEW** | `#c2410c` | Donate hover fill |
| `--surface` | `#ffffff` | header bar background |
| `--surface-alt` | `#f6f8f6` | (body sections; not chrome) |
| `--surface-tint` **NEW** | `#f0f6f1` | drawer active-row background |
| `--surface-icon` **NEW** | `#eef5ef` | mega-menu category icon chip (green) |
| `--surface-icon-accent` **NEW** | `#fdebd6` | mega-menu Women icon chip (orange) |
| `--border` | `#e2e8e2` | header bottom border, drawer borders, icon-button border |
| `--text-strong` | `#1a1f1a` | wordmark, nav (active), mega headings |
| `--text-body` | `#3d433d` | nav links (rest), drawer links |
| `--text-muted` | `#6b726b` | header eyebrow, mega sub-links, drawer sub-links |
| `--footer-text` **NEW** | `#cfe3d4` | footer default text / social glyph |
| `--footer-text-muted` **NEW** | `#a8c4af` | footer blurb, links, contact lines |
| `--footer-text-faint` **NEW** | `#8fae97` | copyright + Privacy/Terms |
| `--footer-hairline` **NEW** | `rgba(255,255,255,.12)` | footer dividers |
| `--footer-social-bg` **NEW** | `rgba(255,255,255,.08)` | social icon chip background |

### Type
- `--font-display: "Oswald", system-ui, sans-serif;` — display + **all labels/nav/CTA**; weights 500/600/700.
  Title-case headings; UPPERCASE for labels/nav/buttons with letter-spacing **.02–.16em**.
- `--font-body: "Source Sans 3", system-ui, sans-serif;` — body copy, footer blurb/links/contact;
  weights 400/600; line-height **1.6**; **sentence case**.
  ⚠ DEVIATION: Style Gate `tokens.css` currently lists `--font-body:"Inter"`. The **design source uses
  Source Sans 3** (Google Fonts import in `<helmet>`). Reconcile `tokens.css` to Source Sans 3.
- Scale (desktop / mobile): H1 48/32 · H2 34/26 · H3 24/20 · Body 17/16 · Small 14.
  Chrome-specific sizes are given per component below (nav 14, mega heading 15, etc.).

### Space · shape · motion
- `--space-1:.5rem(8) · --space-2:1rem(16) · --space-3:1.5rem(24) · --space-4:2rem(32) · --space-6:3rem(48) · --space-8:4rem(64)`; section rhythm 96. **8px base unit.**
- `--radius-btn:8px · --radius-card:12–14px · pill:999px`. (chrome: bar buttons 8, icon-buttons 9–10, logo chip 10, panels 14.)
- `--maxw:1140px` (content max-width for header inner + footer grid); `--maxw-text:720px`.
- `--shadow-1:0 2px 8px rgba(0,0,0,.06)` (rest); `--shadow-2:0 10px 26px rgba(0,0,0,.10)` (hover);
  mega-panel uses a deeper `0 20px 50px rgba(0,0,0,.30)`; Donate uses `0 2px 8px rgba(232,89,12,.28)`;
  drawer uses `-12px 0 40px rgba(0,0,0,.25)`.
- `--dur:180ms; --ease:cubic-bezier(.2,.6,.2,1)`.
- **NEW** `--header-h: 72px` (desktop) / `56px` (mobile) — see component specs.

### Icon system
Design renders **Lucide** glyphs. Chrome uses: `sprout` (logo mark), `chevron-down`/`chevron-up`
(Programs, Get Involved), `heart` (Donate), `menu` (hamburger), `x` (drawer close), `map-pin`/`mail`/
`phone` (footer contact), and **inline SVG** for socials (Facebook, X/Twitter, Instagram). Mega-panel
category chips: `leaf, wheat, hand-heart, graduation-cap, heart-pulse, briefcase`.
**Build note:** do NOT ship the full Lucide CDN on every page. Inline these ~12 SVGs (or a tiny sprite).

---

## C. Section-by-section layout per breakpoint

### C1 — HEADER · WEB (≥1200)
Source: frame 1 `<header>` (lines 42–60) + frame 2/5 (Programs-active states).

- **Bar:** `<header>` flex; `align-items:center; justify-content:space-between; gap:24px;`
  **`padding:15px 40px`** over `background:var(--surface)`; `border-bottom:1px solid var(--border)`;
  `position:sticky; top:0; z-index:1000` (canvas uses `relative;z-index:5` inside a frame — make it
  **sticky** for the real site). Resulting height ≈ **72px** (15+15 padding around a 42px mark).
  Inner content is NOT separately max-width-capped in the frame because the frame *is* 1280; for the
  real fluid site, wrap the three zones in a `max-width:1140px; margin:0 auto` container with the 40px
  side padding moved onto that container.
- **Three zones, single row:**
  1. **Left — logo lockup** `<a href="index.html">` flex `gap:12px`:
     - mark: `42×42px; border-radius:10px; background:var(--color-primary); color:#fff;` centered
       `sprout` icon `24×24 stroke-width:2`.
     - text stack (`flex-column; line-height:1`): wordmark **"Coodu Trust"** Oswald 700 / **20px** /
       `letter-spacing:.03em` / `--text-strong` / UPPERCASE; eyebrow **"Dindigul · Tamil Nadu"**
       Source Sans 3 / **10px** / `letter-spacing:.13em` / `--text-muted` / UPPERCASE / `margin-top:3px`.
  2. **Center/right — primary nav** `<nav>` flex `align-items:center; gap:24px;` Oswald / UPPERCASE /
     `letter-spacing:.04em` / **14px** / weight 500. Order: Home · About · **Programs ▾** · **Get
     Involved ▾** · Documents · Media · Contact.
     - rest link: `color:var(--text-body)`; hover `color:var(--color-primary)`.
     - **active** link: `color:var(--color-primary); padding-bottom:3px; border-bottom:2px solid
       var(--color-amber)` (amber underline — note: amber, not green).
     - Programs & Get Involved carry a trailing `chevron-down 14×14 stroke-width:2.2` (`gap:4px`);
       chevron flips to `chevron-up` while the panel is open.
  3. **Far right — Donate CTA** `<a href="donate.html">` inline-flex `gap:8px;
     background:var(--color-accent); color:#fff;` Oswald 600 / **14px** / `letter-spacing:.05em` /
     UPPERCASE; **`padding:12px 22px`**; `border-radius:8px`; `box-shadow:0 2px 8px rgba(232,89,12,.28)`;
     leading `heart 16×16 stroke-width:2.2`. Hover: `background:var(--color-accent-dark);
     transform:translateY(-1px)`.
     ⚠ A11y: 12px padding on 14px text ≈ 42px tall — **bump to `min-height:44px`** in the build.

#### Programs mega-panel (WEB) — source frame 2, lines 441–505
- Trigger = the "Programs" nav item. Opens on **click/focus** (NOT hover — the legacy hover/right-flyout
  is dropped). Anchored under the header, centered to the 1140 container.
- Panel: `background:#fff; border-radius:14px; box-shadow:0 20px 50px rgba(0,0,0,.30);
  padding:30px 32px; display:grid; grid-template-columns:repeat(3,1fr); gap:28px 36px`.
  → **3 columns × 2 rows = the 6 categories** (⚠ DEVIATION: page doc said "6-column or 3×2"; design
  ships **3×2**).
- Each category cell:
  - heading row: flex `gap:9px; margin-bottom:13px`: icon chip `30×30; border-radius:8px;
    background:var(--surface-icon); color:var(--color-primary)` (Women uses
    `--surface-icon-accent`/`--color-accent`) with the category Lucide glyph `17×17 stroke-width:2`;
    then category title Oswald 600 / **15px** / `--text-strong` / UPPERCASE / `letter-spacing:.02em`.
    The **heading itself links to the category hub page.**
  - sub-links: `flex-column; gap:8px; padding-left:39px;` Source Sans 3 / **13.5px** /
    `color:var(--text-muted)`; hover `color:var(--color-primary)`.
- ⚠ DEVIATION — link set: the canvas mega-panel shows **abbreviated** labels and **omits two sub-links**
  ("Soil & Land Management" under Environment; "Health Support & Rehabilitation" under Health) to fit
  the frame. **For the build, use the full verbatim content-doc set (28 sub-links, §D) with full
  labels and real hrefs.** Treat the canvas as visual layout, the content doc as the link source.

#### Get Involved dropdown (WEB)
Small panel (~220–260px), surface, `--radius-card`, `--shadow-2`/panel shadow, 3 stacked links
(Partner with Us, Volunteer, Donate) styled like mega sub-links. Same click/focus + ESC model.

---

### C2 — HEADER · TABLET (600–1199) *(DERIVED — no canvas frame)*
Hamburger mode begins here (7 items + a mega-menu do not fit a tablet row). Follow the mobile frame's
mechanics at a slightly larger bar.
- Bar: `padding:12px 24px` (~64px tall), `background:var(--surface)`, `border-bottom:1px solid var(--border)`, sticky.
- Left: full logo lockup (mark **40px** + wordmark; eyebrow MAY stay ≥768, drop <768).
- Right cluster (`gap:10–12px`): **Donate stays visible in the bar** (desktop Donate styling) +
  hamburger icon-button.
- Hamburger button: `40×40; border-radius:9px; border:1px solid var(--border); background:#fff;
  color:var(--text-strong);` `menu` icon `22×22 stroke-width:2.2`. ⚠ bump to **44×44** for touch.
- Tapping hamburger opens the **off-canvas drawer** (same component as mobile, §C7) — a right-anchored
  panel; one accordion open at a time.

---

### C3 — HEADER · MOBILE (<600) — source frame 3, lines 524–533
- Bar: flex `space-between; gap:10px;` **`padding:10px 18px`**; `background:var(--surface)`;
  `border-bottom:1px solid var(--border)`. Height ≈ **56px**.
- Left logo: `gap:9px`; mark **36×36; border-radius:9px; background:var(--color-primary)** with `sprout
  20×20`; wordmark Oswald 700 / **17px** / `letter-spacing:.02em` / `--text-strong` / UPPERCASE.
  **No eyebrow** on mobile.
- Right cluster `gap:9px`:
  - **Compact Donate** `<a>` inline-flex `gap:6px; background:var(--color-accent); color:#fff;` Oswald
    600 / **13px** / `letter-spacing:.04em` / UPPERCASE; `padding:9px 13px; border-radius:7px;` leading
    `heart 14×14 stroke-width:2.4`. ⚠ ≈36px tall — bump to `min-height:44px`.
  - Hamburger button `40×40; border-radius:9px; border:1px solid var(--border); background:#fff` with
    `menu 22×22 stroke-width:2.2`. ⚠ bump to 44×44.

---

### C4 — FOOTER · WEB (≥1200) — source frame 1, lines 322–361
- `<footer>`: `background:var(--color-deep) #11371b; color:var(--footer-text) #cfe3d4`.
- **Top grid:** `max-width:1140px; margin:0 auto; padding:60px 40px 0; display:grid;
  grid-template-columns:1.6fr 1fr 1.3fr 1fr; gap:40px`.
  ⚠ DEVIATION: page doc said "4 **equal**"; design uses the **asymmetric 1.6/1/1.3/1** ratio. Use the
  design ratio.
  1. **Brand:** logo row (`gap:11px; margin-bottom:16px`) = white chip `38×38; border-radius:10px;
     background:#fff; color:var(--color-primary)` + `sprout 22×22`, then wordmark Oswald 700 / **19px** /
     `letter-spacing:.03em` / `#fff` / UPPERCASE. Blurb `<p>` Source Sans 3 / **14.5px** / lh 1.6 /
     `color:var(--footer-text-muted)` / `max-width:280px`.
  2. **Quick Links:** `<h4>` Oswald / UPPERCASE / `letter-spacing:.08em` / **14px** / `#fff` /
     `margin:0 0 16px`; list `flex-column; gap:11px;` Source Sans 3 / **14.5px**; each `<a>`
     `color:var(--footer-text-muted)` → hover `#fff`.
  3. **Contact Us:** `<h4>` same; body `flex-column; gap:12px;` 14.5px / `--footer-text-muted`; three
     rows, each `flex; gap:10px` with a leading icon `17×17 stroke-width:1.9` (`map-pin`, `mail`,
     `phone`). Use a semantic `<address>`; wrap email in `mailto:` and phone in `tel:`.
  4. **Follow Us:** `<h4>` same; social row `flex; gap:10px`; each `<a>` `40×40; border-radius:10px;
     background:var(--footer-social-bg); color:var(--footer-text)` → hover `background:var(--color-primary);
     color:#fff`; inline SVG glyph 18–19px.
- **Bottom bar:** `max-width:1140px; margin:0 auto; margin-top:44px; padding:22px 40px;
  border-top:1px solid var(--footer-hairline); display:flex; align-items:center;
  justify-content:space-between;` Source Sans 3 / **13px** / `color:var(--footer-text-faint)`.
  Left = copyright; right = `flex; gap:20px` Privacy / Terms links (`--footer-text-faint` → hover #fff).

---

### C5 — FOOTER · TABLET (600–1199) *(DERIVED)*
- Top grid → **2 columns**, `gap:30px`, columns keep left alignment (Brand+Quick on row 1, Contact+Follow
  on row 2, or 2×2 reflow). Padding `48px 24px 0`.
- Bottom bar stays a row if it fits, else stacks (copyright above, Privacy/Terms below), centered.

---

### C6 — FOOTER · MOBILE (<600) — source frame 3, lines 667–684
- `<footer>`: `background:var(--color-deep); color:var(--footer-text); padding:36px 20px 22px`.
- **Single column, stacked:** Brand (chip `36×36; radius:9px` + `sprout 20×20`, wordmark Oswald 700 /
  **18px** / #fff) → blurb (14px / lh 1.6 / `--footer-text-muted` / `margin:0 0 22px`) → **Contact**
  block (`border-top:1px solid var(--footer-hairline); padding-top:20px; flex-column; gap:11px;` 14px /
  `--footer-text-muted`; icons `16×16`) → **Social** row (`gap:10px; margin-top:20px;` same 40×40 chips)
  → **Copyright** (`border-top:1px solid var(--footer-hairline); margin-top:22px; padding-top:18px;`
  Source Sans 3 / **12.5px** / `--footer-text-faint`; `text-align:center`).
- ⚠ DEVIATION: the mobile frame **omits the Quick Links column and Privacy/Terms**. RECOMMENDATION:
  keep Quick Links as a stacked, centered group between Brand and Contact for nav parity (low risk),
  and keep copyright centered. If strict fidelity is required, omit per the frame.

---

### C7 — MOBILE/TABLET DRAWER (off-canvas) — source frame 4, lines 714–746 + render `redesign-home-mobile-drawer-.png`
- **Scrim:** full-viewport overlay `background:rgba(8,18,11,.55)`, sits under the panel, above the page;
  click/tap dismisses.
- **Panel `<aside>`:** anchored to the **RIGHT** edge: `position:fixed; top:0; right:0; bottom:0;
  width:328px; background:#fff; box-shadow:-12px 0 40px rgba(0,0,0,.25); display:flex; flex-direction:column`.
  ⚠ DEVIATION: legacy/page-doc described a **left** off-canvas; the approved render slides from the
  **right** (328px panel, dimmed page strip on the left). Build right-anchored. On <360px screens use
  `width:min(328px, 88vw)`. Animate with `transform:translateX(100%)→0`, `--dur`/`--ease`.
- **Drawer header:** `flex; space-between; padding:16px 20px; border-top:none;
  border-bottom:1px solid var(--border)`. Left = mark `34×34; radius:9px; background:var(--color-primary)`
  + `sprout 19×19` + wordmark Oswald 700 / **16px** / `--text-strong` / UPPERCASE. Right = **close button**
  `36×36; border-radius:9px; border:1px solid var(--border); background:#fff` with `x 20×20 stroke-width:2.2`.
- **Drawer nav `<nav>`:** `flex:1; overflow-y:auto; padding:8px 14px;` Oswald / UPPERCASE /
  `letter-spacing:.03em` / **15px** / weight 500.
  - **Top-level rows:** each `flex; align-items:center; justify-content:space-between; padding:12px 14px`.
    - **Home (active):** `border-radius:9px; background:var(--surface-tint) #f0f6f1;
      color:var(--color-primary); margin-bottom:2px;` trailing **amber dot** `6×6; border-radius:50%;
      background:var(--color-amber)`.
    - rest rows: `color:var(--text-body)`.
    - **Programs** & **Get Involved** rows carry a trailing chevron (`17×17 stroke-width:2.2`):
      `chevron-down` collapsed, `chevron-up` + `color:var(--color-primary)` when open.
  - **Programs accordion (expanded):** a sub-panel `flex-column; gap:1px; padding:2px 0 8px;
    margin:0 6px 4px 8px; border-left:2px solid var(--border);` and it **switches font context** to
    Source Sans 3 / `text-transform:none; letter-spacing:normal;` **14px** / weight 400. Rows
    `padding:8px 14px; color:var(--text-muted)`; the active category is `color:var(--color-primary);
    font-weight:600`.
    - ⚠ The drawer Programs accordion lists the **6 CATEGORY links only** (Environment & Resilience,
      Sustainable Agriculture, Women Empowerment, Education & Skilling, Health & Sanitation, Consultancy
      & HR) — a **2-level** menu, NOT the 28 sub-links. Each category row → its hub page. (Page doc
      floated an optional 3rd level; the approved design keeps it to 2 levels. Build 2 levels.)
    - **Accordion rule:** only one of Programs / Get Involved open at a time.
  - Documents · Media · Contact: plain rows `padding:12px 14px; color:var(--text-body)`.
- **Pinned drawer footer (always visible):** `padding:14px 18px 18px; border-top:1px solid var(--border)`.
  - **Donate now** `<a>` full-width: `flex; center; gap:9px; background:var(--color-accent); color:#fff;`
    Oswald 600 / **15px** / `letter-spacing:.05em` / UPPERCASE; `padding:14px 20px; border-radius:8px;
    min-height:48px;` leading `heart 17×17 stroke-width:2.2`. Label is **"Donate now"** (vs bar "Donate").
  - Phone line under it: `flex; center; gap:8px; margin-top:14px;` Source Sans 3 / **13px** /
    `--text-muted`; `phone 14×14` + **"+91-451-2461362"** (wrap in `tel:`).

---

## D. Content to populate (verbatim — preserve labels/links; casing may change)

### Header
- Logo wordmark **"Coodu Trust"** → `index.html`; image alt `Coodu Trust Logo`. Desktop eyebrow
  **"Dindigul · Tamil Nadu"**.
- Primary nav: Home→`index.html` · About→`about.html` · Programs→`programs.html` · Get
  Involved→`get-involved.html` · Documents→`documents.html` · Media→`media.html` · Contact→`contact.html`.
- Header CTA **"Donate"** → `donate.html`.

### Programs mega-panel — 6 categories (heading links) + sub-links (USE THIS FULL SET, 28 links)
1. **Environment and Resilience** → `programs/environment-resilience.html`
   - Watershed Management → `programs/watershed-management.html`
   - Plantation & Afforestation → `programs/plantation-afforestation.html`
   - Water Resource Management → `programs/water-resource-management.html`
   - **Soil & Land Management → `programs/soil-land-management.html`** *(canvas omitted — include)*
   - Biodiversity Conservation → `programs/biodiversity-conservation.html`
   - Climate Change Adaptation & Mitigation → `programs/climate-change-adaptation.html`
2. **Sustainable Agriculture** → `programs/sustainable-agriculture.html`
   - Farmer Collectivization & Agribusiness → `programs/farmer-collectivization.html`
   - Livestock & Allied Activities → `programs/livestock-allied.html`
   - Horticulture & Diversified Farming → `programs/horticulture-diversified.html`
   - Agricultural Technology & Youth Engagement → `programs/agricultural-technology.html`
   - Organic Farming Practices → `programs/organic-farming.html`
3. **Women Empowerment** → `programs/women-empowerment.html` *(icon chip uses the orange accent variant)*
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
   - **Health Support & Rehabilitation → `programs/health-support-rehabilitation.html`** *(canvas omitted — include)*
   - Community Health Services → `programs/community-health-services.html`
   - Disease-Specific Interventions → `programs/disease-specific-interventions.html`
   - Water Quality & Safety → `programs/water-quality-safety.html`
   - Sanitation & Hygiene Infrastructure → `programs/sanitation-hygiene-infrastructure.html`
   - Solid Waste Management → `programs/solid-waste-management.html`
6. **Consultancy and HR Management** → `programs/consultancy-hr.html`
   - Technology & Knowledge Dissemination → `programs/technology-knowledge-dissemination.html`
   - Strategic Planning & Advisory Services → `programs/strategic-planning-advisory.html`
   - Human Resource & Staffing Solutions → `programs/hr-staffing-solutions.html`

Category → Lucide icon map: Environment `leaf` · Agriculture `wheat` · Women `hand-heart` (orange chip) ·
Education `graduation-cap` · Health `heart-pulse` · Consultancy `briefcase`.

### Get Involved dropdown (and drawer accordion)
Partner with Us → `partner.html` · Volunteer → `volunteer.html` · Donate → `donate.html`.

### Footer
- Brand blurb (verbatim): *"A registered non-profit working towards sustainable development in Tamil
  Nadu, India since 2000."* (logo alt `Coodu Trust White Logo`).
  Note: the long-form blurb in the content doc ("Coodu Trust is a registered non-profit organization
  working towards sustainable development in Tamil Nadu, India since 2000.") is acceptable; the design
  uses the shortened form above — either is fine, keep one consistent.
- Quick Links: About Us → `about.html` · Our Programs → `programs.html` · Careers → `careers.html` · Donate → `donate.html`.
- Contact Us: **"H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India"** ·
  `director@coodutrust.org` (→ `mailto:director@coodutrust.org`) · `+91-451-2461362` (→ `tel:+914512461362`).
- Follow Us: Facebook, Twitter/X, Instagram (inline SVG). Wire **real URLs**; if unknown, omit rather
  than ship `href="#"` (legacy dead links). Each needs `aria-label`.
- Copyright: **"© {year} Coodu Trust. All rights reserved."** — render the year **dynamically** (design
  shows 2026). Bottom-bar Privacy → `privacy.html` · Terms → `terms.html` (desktop/tablet only).

---

## E. Image slots

**The chrome has NO photographic image slots** — by design it sits on a flat surface (the legacy raster
`all_header.png` and body-level Cloudinary photo overlay are dropped). The only "image" assets are:

| Slot | Form | Subject / spec |
|---|---|---|
| Header logo mark | Icon chip, **42×42** desktop / 36×36 mobile / 38×38 footer / 34×34 drawer; `border-radius:10/9/10/9px`; green `--color-primary` bg (white bg in footer) | Canvas uses a Lucide `sprout` glyph as placeholder. **Production: swap for the real Coodu Trust brand mark** (local asset in `assets/images/logos/`), keeping the rounded-chip geometry and sizes. No aspect-ratio crop. |
| Footer/brand wordmark | Text (Oswald), not an image | — |
| Social icons | Inline SVG, ~18–19px in 40×40 chip | Facebook, X/Twitter, Instagram brand glyphs (already inline in the canvas; keep as inline SVG, serve locally). |

No 16:9 / 4:3 / 4:5 photo slots exist in the chrome (those belong to body sections, out of scope here).

---

## F. Interactions & motion

- **Nav hover:** link color `--text-body → --color-primary` over `--dur`/`--ease`. Active link shows the
  static 2px amber underline (`--color-amber`), driven by the **current page**, not hard-coded to Home.
- **Donate hover:** `background --color-accent → --color-accent-dark` + `transform:translateY(-1px)`.
- **Programs mega-panel:** opens on **click or keyboard focus/Enter** on the trigger; short fade/scale-in
  (`opacity 0→1`, ~150–180ms). Closes on: second click on trigger, **ESC**, **click/focus outside**, or
  selecting a link. Chevron toggles down↔up. (No hover-intent open; no right-flyout.)
- **Get Involved dropdown:** identical open/close model, smaller panel.
- **Drawer:** hamburger opens; panel slides `translateX(100%)→0` with scrim fade `0→.55`; **focus moves
  into the drawer** and is **trapped** while open; ESC, scrim tap, X button, or selecting a leaf link
  closes it and **returns focus to the hamburger**; body scroll locked while open.
- **Drawer accordions:** Programs / Get Involved expand/collapse height with chevron flip; **only one
  open at a time**.
- **Counters / carousel / lightbox:** none live in the chrome (impact counters and the stories carousel
  are body components — out of scope for this spec).
- **Optional scrolled state:** after the page scrolls a little, the sticky header may gain
  `--shadow-1` and shave a few px of vertical padding (logo shrinks slightly). Keep subtle; respect
  reduced-motion.

### Accessibility (required)
- **Landmarks:** one `<header>` with `<nav aria-label="Primary">`; one `<footer>` with a nested
  `<nav aria-label="Footer">` for Quick Links; contact in `<address>`. Add a **skip-to-content** link
  (`<a class="skip-link" href="#main">`) as the first focusable element.
- **Dropdowns/mega-menu:** triggers are real `<button>`s with `aria-expanded` (true/false),
  `aria-controls` → panel id, `aria-haspopup="true"`; panel reachable by keyboard; ESC closes and returns
  focus to the trigger. Category headings are links; sub-links are links.
- **Drawer:** hamburger `<button aria-expanded aria-controls="mobile-drawer" aria-label="Open menu">`;
  drawer `role="dialog" aria-modal="true" aria-label="Site menu"`; focus trap + restore; ESC closes.
- **Touch targets ≥44×44** everywhere (the canvas ships several at 36–42px — **bump**: bar Donate,
  compact mobile Donate, hamburger/close icon-buttons). Drawer rows already ~44 (12px pad on 15px text).
- **Contrast (verified against the deep footer / white bar):** footer body `#a8c4af`/`#11371b` ≈ 7.2:1 ✓;
  copyright `#8fae97`/`#11371b` ≈ 5.3:1 ✓; nav `#3d433d`/#fff ≈ 10:1 ✓; mega sub-link `#6b726b`/#fff ≈
  4.8:1 ✓ (AA normal). ⚠ Donate `#fff` on `#e8590c` ≈ 4.0:1 — passes AA for **bold/large** text only;
  acceptable for the bold uppercase button, and hover `#c2410c` improves it (~5.2:1). Don't use accent
  fill behind small/thin text.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` — disable slide/fade/translate; show
  instant open/close; no scrolled-state shrink animation.
- **Focus-visible:** every link/button gets a visible focus ring (e.g. 2px `--color-primary` outline,
  offset 2px); never `outline:none` without a replacement.

---

## G. Build notes

- **Semantic skeleton (shared partials):**
  ```html
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="logo" href="index.html"> <span class="logo__mark">…</span>
        <span class="logo__text"><b>Coodu Trust</b><small>Dindigul · Tamil Nadu</small></span></a>
      <nav class="primary-nav" aria-label="Primary">
        <ul> … <li class="has-mega"><button aria-expanded="false" aria-controls="mega-programs">Programs ▾</button>
               <div class="mega" id="mega-programs" hidden> …3×2 grid… </div></li> … </ul>
      </nav>
      <a class="btn btn--cta donate" href="donate.html">♥ Donate</a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="mobile-drawer" aria-label="Open menu">☰</button>
    </div>
  </header>
  <!-- drawer + scrim as siblings -->
  <main id="main"> … per-page content (out of scope) … </main>
  <footer class="site-footer"> …grid… </footer>
  ```
- **Reuse from the design system:** Donate = the Style Gate **`.btn--cta`** (accent) component;
  secondary/outline buttons elsewhere are `.btn--secondary` (not in chrome). Nav-link+underline,
  dropdown/mega panel surface (radius 14, soft shadow, hairline), logo lockup, off-canvas drawer +
  hamburger/X, footer dark band, hairline divider, and the type/case rules are all shared tokens —
  reference, don't redefine.
- **CSS architecture:** `tokens.css` (the §B table) → `components/header.css`, `components/footer.css`,
  `components/nav.css` (mega + dropdown), `components/drawer.css`, `components/button.css`. The header is
  `position:sticky; top:0; z-index:1000`. Wrap header/footer inner content in
  `.container{max-width:1140px;margin-inline:auto;padding-inline:40px}` (24px on tablet, 20px mobile).
- **One Donate component, all breakpoints** — fixes the legacy orphaned `.donate-button` class (which
  had no CSS and broke the responsive donate rules). Build it as `.btn--cta` and reuse in bar (desktop),
  bar (mobile compact modifier), and pinned drawer footer ("Donate now" label variant).
- **Drop the legacy hacks:** no `all_header.png`, no body-level Cloudinary background + white overlay,
  no `text-transform:uppercase` on `<body>` (caps only on Oswald labels/nav/CTA via the component CSS,
  body copy stays sentence case).
- **Tricky bits:**
  1. **Mega-panel link set vs canvas** — the canvas truncates labels and drops 2 links; **the build
     must emit all 28 sub-links with full labels** (§D). Do not copy the canvas verbatim for hrefs.
  2. **3×2 grid, not 6 columns** — `grid-template-columns:repeat(3,1fr)` with `gap:28px 36px`; collapse
     to 2 cols then 1 inside the drawer (where it becomes a flat 6-category accordion).
  3. **Drawer is right-anchored** (deviates from the legacy left drawer) — match the approved render.
  4. **Drawer accordion is 2-level** (6 category links), desktop mega is 1-level-deep grid (28 links) —
     two different information densities sharing the same content source.
  5. **Active state is per-page** — set the amber underline (desktop) / tinted active row + amber dot
     (drawer) from the current route, not a hard-coded Home.
  6. **Dynamic copyright year**; wire real social URLs or omit; serve logo + social icons **locally**
     (assets already exist) — no Cloudinary dependency for chrome.
  7. **Self-host fonts/icons** — Oswald + Source Sans 3 (weights 400/500/600/700) and the ~12 inline
     SVG icons; avoid loading the full Lucide CDN on all 53+ pages.
  8. **Reconcile `--font-body`** in `tokens.css` from Inter → **Source Sans 3** to match the design source.
