# 05 — Programs Hub — BUILD SPEC (build contract)

> Source of truth, in priority order:
> 1. `About page content/Programs - COODU Trust.dc.html` (approved Claude-design canvas — exact values below are lifted from it)
> 2. Renders: `design/redesign-renders/programs-1280.png`, `…-820.png`, `…-390.png`
> 3. Copy: `design/page-docs/03-programs-hub.md`
>
> Rebuild target: real page at `/programs.html` as **semantic HTML + shared design-system CSS** (no inline-style soup, no `!important` overrides, no JS show/hide tab-gate). The approved design is a single scrollable index — replicate that.

---

## Purpose & coverage

- **One page only:** the Programs hub (`programs.html`). It is the index/router into the 6 sector overview pages + ~32 individual program pages under `/programs/`. It governs the hub, not the destinations.
- **Job:** let a first-time donor / CSR partner / government official / volunteer scan the entire 6-sector portfolio top-to-bottom and route into the right deeper page in 1–2 clicks.
- **How the 36+ programs are made scannable — the decisive decision:** the approved design uses **themed sector groups, NOT a content filter.** All six sectors render stacked as always-visible bands; the row of six pills is a **sticky scrollspy anchor bar (jump links)**, never a tab that hides content. The hub surfaces **19 highlighted program cards** (Environment 3, Agriculture 3, Women 3, Education 3, Health 4, Consultancy 3). The old DDUGKY/SAP-style tab gate (`display:none` on 5 of 6 sectors) is gone.
- **Sector ordering & default:** Environment & Resilience, Sustainable Agriculture, Women Empowerment, Education & Skilling, Health/Sanitation/Waste, Consultancy & HR. Anchor bar opens with **Environment** active.

> Note vs. content doc §5: the approved `.dc.html` does **not** include per-sector "all programs in this sector" quick-link rows or per-sector cover photos. Build to the approved design (cards + stats only, single hero photo). The quick-link rows are logged below under "Deferred enhancements" but are NOT part of this contract.

---

## Design tokens (extract from the canvas — feed these into the shared design-system CSS)

These are the literal values used in the source. Name them as tokens in the shared stylesheet; the page must consume tokens, not hard-coded hex.

### Color
| Token | Value | Used for |
|---|---|---|
| `--primary` | `#1e7e34` | brand green: stat numbers, icons, badges, active anchor, links, eyebrow rule/text, card-link |
| `--primary-deep` | `#155d27` | link hover, CTA gradient mid, "Get Involved" text, anchor hover text `#15602a` (near-variant) |
| `--primary-darkest` | `#0f3d1b` | hero base bg, CTA gradient end |
| `--primary-tint` | `rgba(30,126,52,.10)` | icon-box bg, badge bg, years-chip bg |
| `--ink` | `#18241d` | headings (H2 section, sector H2, card H3) |
| `--body` | `#45524b` | body / subtitle / intro text |
| `--body-soft` | `#55635b` | card description |
| `--muted` | `#6f7d75` | stat labels (credibility strip + card stats) |
| `--anchor-idle` | `#46544c` | inactive anchor text |
| `--surface` | `#ffffff` | page bg, cards, credibility band, even sector bands |
| `--surface-alt` | `#f6f8f6` | overview band, odd sector bands |
| `--hairline` | `#e4ebe5` | card border, anchor-bar bottom border, idle anchor border |
| `--hairline-soft` | `#eef2ee` | card stat divider (top + vertical) |
| `--hairline-strong` | `#e9eee9` | credibility band bottom border |
| `--card-border-hover` | `#cfe0d4` | card hover border |
| `--scrim` | `linear-gradient(180deg,rgba(13,46,22,.5),rgba(11,38,20,.78))` | hero photo scrim |
| `--cta-gradient` | `linear-gradient(135deg,#1e7e34 0%,#155d27 55%,#0f3d1b 100%)` | CTA band bg |
| `--on-dark` / `--on-dark-soft` | `#ffffff` / `rgba(255,255,255,.9)` `.92` `.88` | hero & CTA text |
| selection | `rgba(30,126,52,.18)` | `::selection` |

### Type
- Display/headings: **Oswald** 400/500/600/700 (used at 600).
- Body/UI: **Inter** 400/500/600/700.
- Body base: `line-height:1.6`, `-webkit-font-smoothing:antialiased`, `text-rendering:optimizeLegibility`. **Sentence case** for all body/description; UPPERCASE only on small labels (eyebrow, badges, stat labels, years chip).

| Element | Font / weight | Size (clamp from source) | LH | Color | Tracking |
|---|---|---|---|---|---|
| Eyebrow label | Inter 600 | `12.5px` | — | on-dark `.92` / `--primary` (overview) | `.16em`–`.18em`, uppercase |
| Hero H1 | Oswald 600 | `clamp(2.1rem,5.2vw,3.4rem)` | 1.08 | `#fff` | `.01em` |
| Hero subtitle | Inter 400 | `clamp(15px,1.7vw,1.18rem)` | 1.6 | `rgba(255,255,255,.9)` | — |
| Credibility number | Oswald 600 | `clamp(1.9rem,3.4vw,2.9rem)` | 1 | `--primary` | — |
| Credibility label | Inter 600 | `12px` | — | `--muted` | `.06em`, uppercase |
| Overview H2 | Oswald 600 | `clamp(1.75rem,3.4vw,2.5rem)` | 1.14 | `--ink` | — |
| Overview intro | Inter 400 | `clamp(15px,1.2vw,17px)` | 1.75 | `--body` | — |
| Anchor pill | Inter 500/600 | `13.5px` | — | idle `#46544c` / active `#fff` | — |
| Sector H2 | Oswald 600 | `clamp(1.5rem,2.8vw,2.1rem)` | 1.1 | `--ink` | — |
| Years chip | Inter 600 | `11px` | — | `#15602a` | `.05em`, uppercase |
| Sector subtitle | Inter 400 | `clamp(14.5px,1.1vw,16px)` | 1.6 | `--body` | — |
| Card badge | Inter 600 | `11px` | — | `--primary` | `.06em`, uppercase |
| Card H3 | Oswald 600 | `clamp(1.12rem,1.5vw,1.28rem)` | 1.2 | `--ink` | — |
| Card description | Inter 400 | `14px` | 1.62 | `--body-soft` | — |
| Card stat number | Oswald 600 | `clamp(1.22rem,1.8vw,1.45rem)` | 1 | `--primary` | — |
| Card stat label | Inter 600 | `10.5px` | 1.3 | `--muted` | `.05em`, uppercase |
| Card "Learn more" | Inter 600 | `14px` | — | `--primary` | — |
| CTA H2 | Oswald 600 | `clamp(1.9rem,4vw,2.8rem)` | 1.1 | `#fff` | — |
| CTA paragraph | Inter 400 | `clamp(15px,1.3vw,17px)` | 1.7 | `rgba(255,255,255,.88)` | — |
| CTA buttons | Inter 600 | `15px` | — | per-button | — |

### Radius / shadow / spacing
- Radii: pills/chips/anchors/badges `999px`; cards & icon-box `16px`; buttons `9px`; eyebrow rule & link focus `2–3px`.
- Shadows: card rest `0 2px 10px rgba(16,40,24,.05)`; card hover `0 24px 50px rgba(16,40,24,.13)`; anchor bar `0 6px 20px rgba(16,40,24,.05)`; CTA primary btn `0 8px 22px rgba(0,0,0,.16)` → hover `0 12px 28px rgba(0,0,0,.22)`.
- Container: `max-width:1200px; margin:0 auto;` gutters `padding-inline:clamp(20px,5vw,40px)` (CTA + overview use a narrower 760px content max).
- Section vertical rhythm `--sec-pad: clamp(56px,8vw,96px)` (comfortable) / `clamp(40px,5.5vw,68px)` (compact density variant).

---

## Section-by-section layout

> Source mode boundaries (JS `_onResize`): **web ≥ 1025**, **tablet 768–1024**, **mobile < 768**. The contract below is written to the requested buckets (WEB ≥1200 / TABLET 600–1199 / MOBILE <600). **Fidelity note:** the source flips cards to 3-col at 1025 and the credibility/cards to their tablet form below 1025/768. Recommended CSS breakpoints for the rebuild: **cards 3-col at ≥1024, 2-col 600–1023, 1-col <600; credibility 4-col at ≥1024, 2-col <1024.** If strict ≥1200 bucketing is required, keep 3-col only ≥1200 and 2-col 1024–1199 — but matching the source (≥1024 → 3-col) is preferred. Everything else (typography, spacing, colors) is fluid via `clamp()` and identical across breakpoints.

Page order (single `<main>`): **Hero → Credibility strip → Overview → [sticky anchor bar] → 6 Sector bands → CTA band.**

### 1. Hero band
- Full-bleed, `min-height:clamp(340px,44vw,500px)`, `display:flex; place-items:center`, `overflow:hidden`, base bg `--primary-darkest`.
- Background photo absolutely positioned (`inset:0; object-fit:cover`) inside a wrapper that runs the `heroZoom` Ken-Burns animation; dark scrim `--scrim` layer above it (`pointer-events:none`); content layer `z-index:2`.
- Content: centered, `max-width:920px`, padding `clamp(56px,9vw,96px) clamp(20px,5vw,40px)`.
  - Eyebrow "OUR WORK": 22×2px rule + label + 22×2px rule, `gap:10px`, rules `rgba(255,255,255,.7)`.
  - H1 (margin-top 16px), subtitle (margin-top 16px, `max-width:640px`).
- **WEB/TABLET/MOBILE:** identical structure; H1/subtitle scale by clamp (≈48px → ≈40px → ≈30–34px). No layout reflow.

### 2. Credibility strip
- bg `--surface`, `border-bottom:1px solid --hairline-strong`, padding `clamp(36px,5vw,56px) 0`. `data-reveal` on the inner row.
- Grid `gap:clamp(20px,2.4vw,32px)`, `text-align:center`. Each item = big number (Oswald, `--primary`) + caps label (margin-top 10px).
- 4 stats: **2000 / Serving since** · **26,93,250 / Trees planted** (count-up, en-IN format) · **18,592+ / Youth trained** (count-up, suffix `+`) · **640 / Micro-watersheds** (count-up).
- **WEB (≥1200 / src ≥1025):** `repeat(4,1fr)` — single row.
- **TABLET (600–1199 / src <1025):** `repeat(2,1fr)` — 2×2.
- **MOBILE (<600):** `repeat(2,1fr)` — stays 2×2 (numbers stay prominent; do not single-column).

### 3. Overview band
- bg `--surface-alt`, padding `clamp(48px,7vw,84px) 0 clamp(28px,4vw,44px)`. `data-reveal`. Centered, content `max-width:760px` (H2) / `680px` (intro).
- Eyebrow "OUR APPROACH" (green rule/text), H2, intro paragraph.
- Identical across all three breakpoints (centered, fluid).

### 4. Sticky scrollspy anchor bar
- Wrapper: `position:sticky; top:0; z-index:50`, bg `rgba(255,255,255,.9)`, `backdrop-filter:saturate(180%) blur(10px)` (+ `-webkit-`), `border-bottom:1px solid --hairline`, shadow `0 6px 20px rgba(16,40,24,.05)`.
- Inner: `overflow-x:auto`; flex row `gap:8px`, `width:max-content; max-width:100%; margin:0 auto`, padding `11px clamp(16px,4vw,24px)`.
- 6 anchor buttons → smooth-scroll to `#sec-{id}` (`scroll-margin-top:78px` on targets; JS offsets by −70). Labels (short): **Environment · Agriculture · Women · Education · Health · Consultancy**.
- Pill states: idle `bg:transparent; color:#46544c; border:1px solid --hairline; weight:500`; active `bg:--primary; color:#fff; border-color:--primary; weight:600`. Active is set by scrollspy (the sector occupying viewport), not by click alone.
- **WEB:** all 6 fit centered in one row. **TABLET/MOBILE:** **horizontal scroll** (`overflow-x:auto`, `white-space:nowrap`, `flex:0 0 auto` pills) — never wrap into a tall stacked column. This is the single most important mobile fix vs. the old build.

### 5. Six sector bands (`<section id="sec-{id}" data-sector="{id}">`)
- Background **alternates** by index: Environment `#fff`, Agriculture `#f6f8f6`, Women `#fff`, Education `#f6f8f6`, Health `#fff`, Consultancy `#f6f8f6`. Padding `--sec-pad`. `scroll-margin-top:78px`.
- Container `max-width:1200px` + gutters.
- **Sector header** (`data-reveal`, `data-stagger:0`): flex row, `align-items:flex-start`, `gap:clamp(14px,1.6vw,20px)`, `max-width:880px`.
  - Icon box: `clamp(52px,5vw,62px)` square, `radius:16px`, bg `--primary-tint`, centered lucide icon (`--primary`, stroke 1.75, 28×28).
  - Title group: title H2 + optional years chip on one wrapping row (`gap:12px`); subtitle below (`margin-top:10px`).
- **Card grid:** `margin-top:clamp(26px,3.4vw,42px)`, `gap:clamp(18px,2vw,26px)`.
  - **WEB (≥1200 / src ≥1025):** `repeat(3,1fr)`. Health (4 cards) → 3 + 1 wrap.
  - **TABLET (600–1199 / src 768–1024):** `repeat(2,1fr)`. Health → 2×2.
  - **MOBILE (<600 / src <768):** `1fr` single column, full-width cards.
- Cards are **equal-height** (each is a flex column; "Learn more" pinned to bottom via the stat block carrying `margin-top:auto`).

### 6. CTA band
- bg `--cta-gradient`, padding `--sec-pad`, content centered `max-width:760px` (text block `620px`). `data-reveal`.
- Eyebrow "GET INVOLVED" (on-dark), H2 "Ready to Make a Difference?", paragraph.
- Button row `margin-top:30px`, `gap:14px`, centered, `flex-wrap:wrap`.
  - **WEB/TABLET:** buttons inline (`flex-direction:row`, auto width).
  - **MOBILE (<600 / src <768):** `flex-direction:column`, each button `width:100%`, primary ("Get Involved") on top.

---

## Components (with exact styles)

### Eyebrow / kicker
Inline-flex, `gap:10px`. Two `22px × 2px` rules (`radius:2px`) flanking a `12.5px` Inter-600 uppercase label, tracking `.16em` (light bg, `--primary`) or `.18em` (dark bg, `rgba(255,255,255,.92)`).

### Stat block (two uses)
- **Credibility variant:** Oswald number `clamp(1.9rem,3.4vw,2.9rem)`/`--primary` + Inter-600 `12px` uppercase `--muted` label (margin-top 10px), centered. Count-up animated.
- **Card variant:** 2-col grid (`1fr 1fr`) with `border-top:1px solid --hairline-soft`, `padding-top:16px`, `margin-top:20px`; left cell `padding-right:14px`, right cell `padding-left:14px; border-left:1px solid --hairline-soft`. Number `clamp(1.22rem,1.8vw,1.45rem)`/`--primary`; label `10.5px` uppercase `--muted` (margin-top 7px).

### Program card
`background:#fff; border:1px solid --hairline; radius:16px; padding:clamp(22px,2.2vw,28px); box-shadow:0 2px 10px rgba(16,40,24,.05)`. Flex column. Order: badge (self-start pill) → H3 (margin-top 14px) → description (margin-top 10px) → stat block (pushed to bottom) → "Learn more →" link (margin-top 18px).
- Hover: `transform:translateY(-6px); box-shadow:0 24px 50px rgba(16,40,24,.13); border-color:--card-border-hover`, transition `.28s cubic-bezier(.22,.61,.36,1)`.

### Badge / years chip / anchor pill (shared pill primitive)
- **Badge:** `bg:--primary-tint; color:--primary; padding:5px 11px; radius:999px; 11px/.06em uppercase`.
- **Years chip:** same box, `color:#15602a`, `11px/.05em uppercase`.
- **Anchor pill:** `padding:9px 15px; radius:999px; 13.5px`; idle/active states per §4. Hover `border-color:--primary; color:#15602a`. Focus `outline:2px solid rgba(30,126,52,.45); offset:2px`.

### Card link ("Learn more →")
Inline-flex, `gap:7px`, Inter-600 `14px`, `--primary`, no underline. Arrow `→` at `16px`. Hover: `gap:12px; color:#155d27`. Focus: `outline:2px solid rgba(30,126,52,.4); offset:3px; radius:3px`.

### Buttons (CTA) — reuse Style-Gate `btn-primary` / `btn-secondary`
- **Primary "Get Involved":** `bg:#fff; color:#155d27; padding:15px 30px; radius:9px; 15px/600; box-shadow:0 8px 22px rgba(0,0,0,.16)`. Hover `bg:#f0f5f0; translateY(-2px); shadow:0 12px 28px rgba(0,0,0,.22)`. Focus `outline:3px solid rgba(255,255,255,.75); offset:3px`.
- **Secondary "Contact Us":** `bg:transparent; color:#fff; border:1.5px solid rgba(255,255,255,.6); padding:13.5px 28px; radius:9px`. Hover `bg:rgba(255,255,255,.14); border-color:#fff; translateY(-2px)`. Focus same as primary.

### Section heading + intro, Sticky nav, CTA band, Container/eyebrow → all map to shared Style-Gate components.

---

## Content (real copy — use verbatim)

**Hero:** eyebrow "Our work" · H1 **"Our Programs of Impact"** · subtitle **"Comprehensive development approach across six key areas of community transformation"** (note: corrected "six", not "five").

**Credibility strip:** `2000` Serving since · `26,93,250` Trees planted · `18,592+` Youth trained · `640` Micro-watersheds.

**Overview:** eyebrow "Our approach" · H2 **"Transforming Communities Through Integrated Development"** · intro **"Since 2000, Coodu Trust has been working across six interconnected sectors to create sustainable change in rural Tamil Nadu. Our holistic approach ensures that communities develop comprehensively, addressing immediate needs while building long-term resilience."**

**Anchor labels:** Environment · Agriculture · Women · Education · Health · Consultancy.

**Sectors** (icon = lucide name; title; years chip; subtitle; then cards as `Badge — Title — Description — Stat1 num/label · Stat2 num/label → href`):

**1. Environment & Resilience** — icon `trees` — chip "25 years of experience" — "Building climate-resilient communities through environmental conservation and sustainable development"
- Core Focus — **Climate Resilience & Adaptation** — "Building community resilience to climate change through comprehensive risk assessment, adaptation strategies, and sustainable infrastructure development." — `15+` Districts covered · `50+` Communities resilient → `programs/climate-change-adaptation.html`
- Conservation — **Environmental Conservation** — "Large-scale environmental protection through tree plantation, biodiversity conservation, and ecosystem restoration programs across Tamil Nadu." — `26,93,250` Trees planted · `14` Districts covered → `programs/plantation-afforestation.html`
- Clean Energy — **Renewable Energy Solutions** — "Promoting sustainable energy solutions through solar power, biogas, and other renewable technologies for rural communities." — `500+` Households powered · `30%` Energy cost reduction → `programs/environment-resilience.html`

**2. Sustainable Agriculture** — icon `wheat` — chip "25 years of experience" — "Promoting organic farming, watershed management, and innovative agricultural techniques"
- Core Focus — **Organic Farming & Natural Methods** — "Promoting chemical-free agriculture through organic farming techniques, natural pest management, and soil health improvement programs." — `7,650+` Farmers trained · `40%` Cost reduction → `programs/organic-farming.html`
- Water Conservation — **Watershed Management** — "Comprehensive watershed development across 640 micro-watersheds in 24 districts. Coodu Trust is the only empanelled Field Agency for the Ministry of Jal Shakti." — `640` Micro-watersheds managed · `24` Districts covered → `programs/watershed-management.html`
- Technology Integration — **Innovative Agricultural Techniques** — "Implementing modern farming techniques including integrated farming systems, precision agriculture, and technology-driven solutions for enhanced productivity." — `25%` Yield increase · `1,000+` Farmers benefited → `programs/agricultural-technology.html`

**3. Women Empowerment** — icon `users-round` — chip "25 years of impact" — "Empowering women through livelihood improvement, microfinance, and community mobilization"
- Core Focus — **SHG & Community Mobilization** — "Promotion of Self Help Groups (SHGs) and Joint Liability Groups (JLGs) for community mobilization and income generation, benefiting 2,168+ individuals across Tamil Nadu." — `2,168+` Income beneficiaries · `1,000+` SHGs formed → `programs/shg-community-mobilization.html`
- Financial Empowerment — **Microfinance & Financial Inclusion** — "Micro-credit programs and financial inclusion initiatives funded by NABARD, Mahalir Thittam, TNSRLM, and MKSP, enabling women's economic independence." — `100%` Repayment rate · `₹50+ Cr` Credit facilitated → `programs/microfinance-financial-inclusion.html`
- Women Development — **Social Empowerment & Leadership** — "Women Development Programme focused on social empowerment, leadership training, and enhanced income opportunities through collective action and skill building." — `500+` Women leaders trained · `25 yrs` Of experience → `programs/social-empowerment-leadership.html`

**4. Education & Skilling** — icon `graduation-cap` — chip "12 years of transformative impact" — "Empowering communities through quality education and skill development programs"
- Skill Development — **Vocational Training Programs** — "PIA for DDUGKY (PRN: TN2015RT7221) and Training Partner for TNSDC. Comprehensive vocational training across 5 districts with 90%+ placement rates, benefiting 18,592+ youth." — `18,592+` Youth trained · `90%+` Placement rate → `programs/vocational-livelihood-training.html`
- School Adoption — **Educational Infrastructure Development** — "School Adoption Programme (SAP) enhancing educational infrastructure with new classrooms, libraries, science labs, and computer facilities." — `50+` Schools adopted · `5,000+` Students benefited → `programs/school-infrastructure-development.html`
- Enterprise Support — **Entrepreneurship & Business Development** — "Supporting micro-enterprise development through business training, financial literacy, and market linkage programs for sustainable livelihoods." — `300+` Enterprises created · `1,000+` SHGs formed → `programs/entrepreneurship-enterprise-development.html`

**5. Health, Sanitation & Waste Management** — icon `heart-pulse` — chip "20 years of dedicated service" — "Improving public health through medical services, water safety, sanitation, and solid waste management" — **4 cards**
- TWAD Board Partner — **Water Quality & Safety** — "Managing and operating 22 water quality testing laboratories across seven districts for TWAD Board, testing over 66,000 samples annually and training 1,200+ community members." — `66,000+` Samples tested annually · `1,200+` Members trained → `programs/water-quality-safety.html`
- Direct Services — **Community Health Services** — "Operating Ambulatory & Mortuary Services in emergencies. ATC Tires partnership: 20 health camps with 10 specialist doctors and 20 paramedical staff, treating 9,000+ individuals." — `9,000+` Individuals treated · `20` Health camps → `programs/community-health-services.html`
- Public Health — **Sanitation & Disease Prevention** — "Implementing the Total Sanitation Campaign in 11 districts and Swachh Bharath initiatives, building 2,500+ household latrines, plus the DBC and Dengue Eradication Programmes in Dindigul." — `2,500+` Toilets built · `11` Districts (TSC) → `programs/sanitation-hygiene-infrastructure.html`
- 20 Years Experience — **Solid Waste Management** — "Two decades of municipal solid waste expertise — managing Dindigul Corporation (48 wards, 90 tons/day, 400 workers) and the Padappai SIPCOT zero-waste initiative with Renault Nissan." — `90` Tons daily managed · `70%+` Segregation rate → `programs/solid-waste-management.html`

**6. Consultancy & HR Management** — icon `briefcase` — **no years chip** — "Providing expert consultancy services and human resource management solutions"
- Expert Services — **Project Management Consultancy** — "Providing comprehensive project management consultancy services for development programs, including planning, implementation, monitoring, and evaluation." — `100+` Projects managed · `25+` Partner organizations → `programs/strategic-planning-advisory.html`
- Capacity Building — **Organizational Development** — "Supporting organizational growth through capacity building, institutional strengthening, and governance improvement programs for NGOs and community organizations." — `50+` Organizations strengthened · `500+` Leaders trained → `programs/technology-knowledge-dissemination.html`
- HR Solutions — **Human Resource Management** — "Comprehensive HR management services including recruitment, training, performance management, and organizational development for development sector organizations." — `1,000+` Professionals managed · `95%` Client satisfaction → `programs/hr-staffing-solutions.html`

**CTA:** eyebrow "Get involved" · H2 **"Ready to Make a Difference?"** · text **"Join us in transforming rural communities across Tamil Nadu. Whether you want to partner with us, volunteer your time, or support our work through donations, there are many ways to get involved."** · **Get Involved** → `get-involved.html` (primary) · **Contact Us** → `contact.html` (secondary).

**Footer (shared, preserve):** H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India · director@coodutrust.org · +91-451-2461362 · © 2025 Coodu Trust.

---

## Image slots

The approved design uses **one** real image slot only (placeholder component in source). Do not invent sector cover photos for this contract.

| Slot | Where | Aspect / sizing | Subject |
|---|---|---|---|
| `programs-hero` | Hero band background | Full-bleed cover, band height `clamp(340px,44vw,500px)` (≈21:9 → near-square on mobile) | Real field / community work photo — people in the field (planting, training, watershed), warm + grounded. Sits under the green scrim; choose an image that reads through a dark gradient and keeps the centered H1 legible. |

- Use `<picture>`/`srcset` with an explicit `width`/`height` (or `aspect-ratio`) to reserve space and prevent CLS. `object-fit:cover; object-position:center`. Provide descriptive `alt` (e.g. "Coodu Trust team working with farmers in a rural Tamil Nadu field").
- Sector icons are **lucide line-icons** (`trees`, `wheat`, `users-round`, `graduation-cap`, `heart-pulse`, `briefcase`) in `--primary`, stroke 1.75 — **no emoji** anywhere.

---

## Interactions & motion

- **Ken-Burns hero:** `@keyframes heroZoom { scale(1) → scale(1.09) }`, `22s ease-in-out infinite alternate` on the photo wrapper only.
- **Scroll-reveal:** `[data-reveal]` starts `opacity:0; translateY(22px)`, transitions to visible over `.7s cubic-bezier(.22,.61,.36,1)`. IntersectionObserver `rootMargin:'0px 0px -8% 0px'`, `threshold:0.04`. Per-card **stagger** via `data-stagger` = `0 / 90 / 180 / 270` ms. Safety fallback: force-visible after 2800ms and if `IntersectionObserver` is unavailable.
- **Count-up:** credibility numbers animate from 0 on first view (`threshold:0.5`, `1400ms`, cubic ease-out). Formats: `26,93,250` uses Indian grouping (`en-IN`), others `en-US`; `18,592+` keeps the `+` suffix. Render the final value in the HTML as the no-JS fallback.
- **Scrollspy anchor bar:** IntersectionObserver on `[data-sector]`, `rootMargin:'-22% 0px -45% 0px'`, picks the highest-ratio sector → sets active pill. Clicking a pill smooth-scrolls to `#sec-{id}` (offset −70px) and sets active.
- **Hover micro-interactions:** card lift + shadow; "Learn more" arrow gap widens 7→12px; anchor/button hovers per component specs.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` → `[data-reveal]` forced visible, `* { animation:none }`. Disables heroZoom + count-up + reveals. Scrollspy/scroll still work (no transform).

### Accessibility
- **Landmarks:** shared `<header>`/nav + `<footer>`; page body in `<main>`. Each sector band is a `<section aria-labelledby="sec-{id}-title">`. The anchor bar is `<nav aria-label="Program sectors">`.
- **Anchor pills** are real `<a href="#sec-{id}">` (progressive enhancement; work without JS). Mark active with `aria-current="true"`. Min target ≥ 44px (pad anchors to meet it on touch; CTA buttons already exceed; "Learn more" link row gets adequate hit area on mobile).
- **Headings:** one `<h1>` (hero), `<h2>` for overview + each sector + CTA, `<h3>` for card titles. Don't skip levels.
- **Contrast:** body `#45524b` on white passes AA; card description `#55635b` on white passes AA; stat labels `#6f7d75` are ≥4.5:1 on white — keep at ≥10.5px/600. On-dark text uses ≥`rgba(255,255,255,.88)`. Active anchor `#fff` on `--primary` passes.
- **Focus visible:** keep the source's outline rings (anchors `2px rgba(30,126,52,.45)`, links `2px rgba(30,126,52,.4)`, CTA buttons `3px rgba(255,255,255,.75)`). Never remove outlines without a replacement.
- **Image alt** on hero; decorative eyebrow rules and stat dividers are CSS, not content.
- **No keyboard traps**, logical DOM order = visual order (cards in source order).

---

## Build notes

- **Semantic structure:**
  ```
  <main id="programs">
    <section class="hero"> … <picture> + scrim + .eyebrow/.h1/.subtitle </section>
    <section class="stats" aria-label="Impact at a glance"> 4 × .stat </section>
    <section class="overview"> .eyebrow + h2 + p </section>
    <nav class="sector-nav" aria-label="Program sectors"> 6 × <a> </nav>   <!-- sticky -->
    <section id="sec-{id}" class="sector" aria-labelledby="…"> header + <ul class="card-grid"> <li><article class="card">…</article></li> … </section>  × 6
    <section class="cta"> .eyebrow + h2 + p + .actions(2 buttons) </section>
  </main>
  ```
  Cards as `<article>` inside `<li>` of a `<ul class="card-grid">` (a card list, not loose divs). Stat pair as a `<dl>` (number `<dd>` + label `<dt>` or vice-versa) is ideal.
- **Reuse shared components** (do not redefine in this page's CSS): container/eyebrow, section-heading+intro, stat/impact-number, program-card, pill (badge/chip/anchor), btn-primary/btn-secondary, CTA band, sticky scrollspy nav, header/footer chrome. All tokens come from the Style Gate; this page only sets layout (grid columns, section bg alternation) + supplies content.
- **Kill the legacy anti-patterns:** no `display:none` tab gate, no inline `style="background:transparent !important"`, no duplicate `.project-card`/`.programs-nav` CSS blocks, no global `text-transform:uppercase` on body, no JS `opacity:1 !important` reveal hacks. All six sectors are in the DOM, always rendered, always indexable.
- **Replace JS-mode switching with CSS:** the source computes columns in JS (`renderVals`). In the rebuild, drive `--card-cols` / `--cred-cols` / CTA direction with **CSS media queries** (breakpoints per the fidelity note: cards 3/2/1 at ≥1024 / 600–1023 / <600; credibility 4/2 at ≥1024 / <1024). Keep `clamp()` for all fluid type/spacing.
- **Equal-height cards:** flex-column card with the stat block carrying `margin-top:auto` so "Learn more" pins to the bottom regardless of description length. Grid with `1fr` tracks gives equal column heights per row.
- **Tricky bits:**
  - Health sector has **4 cards** → 3+1 on web, 2×2 on tablet, 1-col on mobile. Don't special-case; `repeat(3,1fr)` handles the wrap.
  - `scroll-margin-top:78px` on each sector must stay so the sticky bar doesn't cover the heading after a jump.
  - Sticky anchor bar + `backdrop-filter`: include `-webkit-backdrop-filter`; provide a near-opaque white fallback for unsupported browsers.
  - Indian-format number `26,93,250` must keep its grouping (it appears both in the credibility strip and the Environmental Conservation card) — render the formatted string in HTML, count-up is enhancement only.
  - The `₹50+ Cr` and `90%+`/`70%+` stat values contain symbols/suffixes — store as plain text, not numeric count-up (only the 4 credibility numbers count up).
- **Deferred enhancements (NOT in this contract — from content-doc §5):** per-sector "all programs in this sector" quick-link rows (to index all ~32 child pages), optional slim sector cover photos, collapsible "Key Activities" disclosure. Flag for a later iteration; the approved render does not include them.
- **Files/assets:** lucide icons (already loaded via `image-slot.js`/lucide UMD in the canvas; in the real build prefer inline SVG sprite to avoid a runtime icon library). Fonts: Oswald + Inter via the existing Google Fonts link/preconnect.
