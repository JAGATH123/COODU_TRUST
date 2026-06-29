# Program / Sector Page (TEMPLATE) — Design Doc

> Canonical source read in full: `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/programs/women-empowerment.html`
> Cross-checked against leaf variant `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/programs/social-empowerment-leadership.html` and 6 others to confirm the shared skeleton.
> Global style tokens are NOT redefined here — they live in `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/design/REDESIGN-STYLE-GATE.md` (the "Style Gate"). This doc only references them.

---

## 1. Identity

- **File(s):** Canonical example = `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/programs/women-empowerment.html`. All sibling files live in `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/programs/*.html`.
- **COVERAGE: this doc governs ALL 36 program pages under `/programs/`** (confirmed: `ls -1 programs/*.html` = 36). They share ONE template skeleton with two interchangeable middle blocks. The 36 split into two near-identical variants:
  - **Variant A — Sector-Hub page** (the source page's shape). Middle block = a grid of `focus-card`s that DEEP-LINK to sub-program pages. Pages: `women-empowerment.html`, `health-sanitation.html`, `consultancy-hr.html`, `education-skilling.html`, plus `sustainable-agriculture.html` & `environment-resilience.html` (these two add an extra projects/stories block). The 6 top-category landing pages.
  - **Variant B — Sub-Program / Leaf page** (e.g. `social-empowerment-leadership.html`, `microfinance-financial-inclusion.html`, `shg-community-mobilization.html`, `entrepreneurship-enterprise-development.html`, the watershed/agri/health/education leaf pages, etc.). Middle block = a grid of `project-card`s that link to `/programs/projects/*.html`, and the overview adds a `component-list`. ~28 of the 36.
  - **Two legacy outliers** — `environment-climate.html` and `natural-resources.html` — are older Variant-B-shaped category pages (hero → overview → `projects-section` → `success-stories` → CTA). They should be reconciled to this same template during rebuild (likely duplicates of `environment-resilience.html`).
- **One-line role:** Explain ONE program/sector credibly — what it is, the proof (stats), the routes deeper (sub-programs or concrete projects), the outcomes (impact), and one conversion ask (Partner / Donate).

---

## 2. Current structure (AS-IS) — section by section

Document order, top → bottom. Header and Footer are the SHARED CHROME (covered in the chrome doc) — referenced only.

### 0. Header / Global Nav — `<header class="header">` *(SHARED CHROME — see chrome doc)*
Sticky navbar: logo + wordmark, top-level links (Home / About / **Programs** [active] / Get Involved / Documents / Media / Contact), a 6-category Programs mega-dropdown with sub-submenus, a persistent `btn btn-primary donate-button` "Donate", and a 3-bar hamburger for mobile. Not restyled by this doc.

### 1. Page Header / Hero — `<section class="page-header">`
- **Purpose:** Title band that names the page and locates it in the site.
- **Components:** full-bleed background image set via **inline `style="background-image:url(...)"`** (anti-pattern, §3), `.container`, `.breadcrumb`, `<h1 class="page-title">`, `<p class="page-subtitle">`.
- **Content (source):** bg `…/background-prgms/women-empowerment.png`; breadcrumb `Programs > Women Empowerment` (2-level on hubs, 3-level on leaves, e.g. `Programs > Women Empowerment > Social Empowerment & Leadership`); H1 `Women Empowerment`; subtitle `Empowering women as catalysts of social and economic transformation`.

### 2. Sector Overview — `<section class="sector-overview section-padding">`
- **Purpose:** Two-column intro — descriptive copy + headline stats on the left, photo on the right.
- **Components:** `.overview-content` (2-col) → `.overview-text` (`<h2 class="section-title">` + two `<p class="overview-description">` + `.sector-highlights`) and `.overview-image` (`<img class="story-photo">`).
- **`.sector-highlights`** = 4 × `.highlight-item`, each `.highlight-number` + `.highlight-label`.
- **Variant-B addition:** between the paragraphs and the stats, leaf pages insert `<h3 class="subsection-title">` ("Key Components of …:") + `<ul class="component-list">` of `<li><strong>Label:</strong> text</li>` (5 items on the social-empowerment leaf).

### 3. Middle block — the route-deeper grid *(the one section that differs by variant)*
**Variant A (HUB): `<section class="focus-areas section-padding light-bg">`**
- **Purpose:** The primary navigation hub into this pillar's sub-program detail pages.
- **Components:** `<h2 class="section-title">` "Our Focus Areas" + `.focus-grid` of 4–6 × `.focus-card`. Each card = `.focus-icon` (Unicode emoji) + `<h3 class="focus-title">` + `<p class="focus-description">` + `<a class="focus-link">Explore →</a>` (deep link to a sub-program page).

**Variant B (LEAF): `<section class="programs-section section-padding light-bg">`**
- **Purpose:** Concrete projects under this sub-program (with dated periods).
- **Components:** `<h2 class="section-title">` (e.g. "Our Social Empowerment & Leadership Projects (2002–2024)") + `.projects-grid` of 1–3 × `.project-card`. Each card = `.project-header` (`.project-title` h3 + `.project-period` span, e.g. "2002-2003") + `.project-summary` (`.project-image` img + `.project-impact` [`.impact-number` + `.impact-label`]) + `.project-details` (`.project-description` p + `.project-focus` "Focus Areas: …") + `<a class="project-link">View Details →</a>` → `projects/*.html`.

*(Two hubs — `sustainable-agriculture.html`, `environment-resilience.html` — carry BOTH a `focus-grid` and a `projects-grid`; the two legacy outliers carry only a `projects-grid`.)*

### 4. Impact — `<section class="impact-stories section-padding">` (hub) / `<section class="impact-section section-padding">` (leaf)
- **Purpose:** Outcome themes / proof of results.
- **Components:** `<h2 class="section-title">` + `.impact-grid` of **6** × `.impact-card`, each = `.impact-icon` (emoji) + `<h3 class="impact-title">` + `<p class="impact-description">`. No links — informational only. (Some leaf pages name it `success-stories` but the card anatomy is identical.)

### 5. Call to Action — `<section class="sector-cta section-padding light-bg">`
- **Purpose:** Single conversion band — partner or donate.
- **Components:** `.cta-content` (centered) → `<h2 class="cta-title">` + `<p class="cta-text">` + `.cta-buttons` with two: `btn btn-primary` "Partner with Us" → `../partner.html` and `btn btn-secondary` "Support Our Work" → `../donate.html`.

### 6. Footer — `<footer class="footer">` *(SHARED CHROME — see chrome doc)*
4-column grid (brand/about, Quick Links, Contact `<address>`, social icons) + `.footer-bottom` copyright. Not restyled by this doc.

---

## 3. Current weaknesses (be specific & honest)

1. **Hero background is an inline `style="background-image:url(...)"`** on the section. Violates the "zero inline styles" rebuild standard, can't be tokenized, and there's **no gradient overlay** — white title text over an arbitrary photo will fail contrast on light images. → Move to a CSS class with a fixed green→dark gradient overlay (Style Gate §1.3 "subtle green→dark-green on hero overlay"); ship a sized Cloudinary transform, not full-res.
2. **Global all-caps body text.** The legacy `text-transform:uppercase` on `<body>` (per Style Gate §1.4 / §2.1) renders the overview paragraphs and card descriptions in caps — unreadable in long form, especially mobile. → Sentence case for all body/descriptions; caps reserved for small labels (`.highlight-label`, `.project-period`) only.
3. **Emoji as iconography** (👥 💰 🚀 🤝 / 💪 💼 🏦 🌱 🎯). Renders inconsistently across OS/browser, looks clip-arty, off-brand vs. the "simple line icons, one set" direction (Style Gate §1.9). → Replace with one Lucide line-icon set, single-color in primary green; preserve each icon's MEANING.
4. **Two stat systems with duplicated numbers.** "800+ Enterprises" and "450+ SHGs" appear in BOTH `.sector-highlights` and the impact cards. → Keep numbers identical; treat overview stats as the headline `.stat` band and impact cards as qualitative themes so they don't read as repetition.
5. **Weak hierarchy / sameness of the two card grids.** Focus cards and impact cards look near-identical (icon + title + text), so a visitor can't tell "click here to go deeper" from "read-only proof." → Make `focus-card`/`project-card` visually actionable (hover lift, explicit arrow link, pointer affordance) and impact cards quieter (flat, no link, lighter surface).
6. **Project cards (leaf) are dense and unstructured** — title, period, image, an "impact number" that's sometimes a word ("Conceptual", "Direct"), description, and a comma-run "Focus Areas:" string all stacked. → Standardize a `.card` with media-top, a category/period pill, a 2-line clamp summary, and the focus areas as small `pill`/tag chips, not a sentence.
7. **No "what we do" / approach structure on hubs.** Hub overview is two long prose paragraphs with no scannable list (leaf pages at least add `component-list`). → Give hubs an optional bulleted "Our approach" list too.
8. **CTA repeats verbatim across ~36 pages** ("Partner with Us / Support Our Work"). Fine as a system, but the heading should stay program-specific (it currently is — keep that).
9. **Social links are `#` placeholders** (footer, shared chrome) — note only.
10. **Responsive behavior depends on a separate `responsive.css` patch file**; the 2-col overview and 3-col grids likely break to brittle frozen layouts rather than fluid reflow. → Rebuild fluid with Grid `minmax()` + the 3 named breakpoints.

---

## 4. Content — source of truth (PRESERVE this)

> This is the canonical Women Empowerment (hub) copy. Every OTHER program page reuses the SAME slots with its own values — the redesign template must preserve whatever each page fills here. Do not paraphrase numbers, names, or links.

**Identity**
- Browser title: `Women Empowerment | Coodu Trust`
- Meta description: `Empowering women through social empowerment, microfinance, entrepreneurship development, and self-help group mobilization for sustainable community development.`
- H1: **Women Empowerment** · Subtitle: **Empowering women as catalysts of social and economic transformation**
- Breadcrumb: `Programs` (→ `../programs.html`) `>` `Women Empowerment`

**Overview — H2: "Creating Sustainable Change Through Women"**
- Para 1 (verbatim): *"Women empowerment is at the heart of sustainable development and social transformation. Our comprehensive Women Empowerment program recognizes women as key agents of change in their families and communities. Through systematic interventions in social empowerment, financial inclusion, entrepreneurship development, and community mobilization, we create pathways for women to achieve economic independence, social recognition, and leadership roles."*
- Para 2 (verbatim): *"Our approach encompasses forming and strengthening Self-Help Groups (SHGs), providing microfinance services, developing entrepreneurial skills, and building leadership capacities. We focus on creating sustainable livelihood opportunities, improving access to credit and financial services, and fostering women's participation in decision-making processes at household and community levels. Our programs have consistently demonstrated that empowered women contribute significantly to poverty reduction, education improvements, and overall community development."*
- Overview image: `…/programs/program-women-empowerment.jpg`, alt "Women empowerment and leadership development activities".

**Headline stats (4) — PRESERVE numbers exactly**
| Number | Label |
|---|---|
| **5,000+** | Women Empowered |
| **450+** | SHGs Formed |
| **800+** | Enterprises Created |
| **300%** | Income Increase |

**Focus Area cards (4) — titles + descriptions + DEEP LINKS (must stay intact):**
1. **Social Empowerment & Leadership** — "Building women's confidence, leadership skills, and social recognition through capacity building programs, leadership training, and community participation initiatives." → `social-empowerment-leadership.html` ("Explore →")
2. **Microfinance & Financial Inclusion** — "Providing access to financial services, credit facilities, and savings programs to enable women's economic participation and financial independence." → `microfinance-financial-inclusion.html`
3. **Entrepreneurship & Enterprise Development** — "Supporting women entrepreneurs through business development training, market linkages, and enterprise support for sustainable livelihood creation." → `entrepreneurship-enterprise-development.html`
4. **SHG & Community Mobilization** — "Organizing women into Self-Help Groups and community-based organizations for collective action, mutual support, and community development initiatives." → `shg-community-mobilization.html`

**Impact cards (6) — H2 "Women Empowerment Impact":**
1. **Leadership Development** — "Over 2,000 women have emerged as community leaders, taking up key positions in local governance, SHGs, and development committees, driving positive change in their communities."
2. **Economic Independence** — "800+ women-led micro-enterprises have been established, generating sustainable income and creating employment opportunities for other women in their communities."
3. **Financial Inclusion** — "450+ SHGs have mobilized savings exceeding ₹50 lakhs, providing women access to credit and financial services for personal and business needs."
4. **Social Transformation** — "Empowered women have become change agents in their families and communities, improving education, health, and overall quality of life for future generations."
5. **Community Solidarity** — "Strong women's collectives have been formed, creating support networks that address social issues, promote gender equality, and advocate for women's rights."
6. **Sustainable Development** — "Women's active participation in development programs has led to more inclusive and sustainable outcomes, benefiting entire communities and future generations."
- Embedded figures to keep: **2,000+** leaders · **800+** enterprises · **450+** SHGs · savings exceeding **₹50 lakhs**.

**CTA — H2 "Join Our Women Empowerment Mission"**
- Text (verbatim): *"Partner with us to empower women and create lasting social transformation. Your support can help us reach more women, strengthen communities, and build a more equitable society where every woman can thrive and lead."*
- Buttons: **Partner with Us** → `../partner.html` · **Support Our Work** → `../donate.html`

**Variant-B (leaf) extra slots to preserve** (from `social-empowerment-leadership.html`, as the pattern every leaf follows):
- Overview H3 "Key Components of …:" + `component-list` of `<strong>Label:</strong> text` items (e.g. Leadership Training / Legal Awareness / Capacity Building / Social Recognition / Income Generation).
- Project cards: title + **period** (e.g. "2002-2003") + image + `impact-number`/`impact-label` (e.g. "Conceptual / Foundation Program") + description + "Focus Areas: …" + **"View Details →"** → `projects/*.html` (e.g. `projects/feminization-agriculture.html`). These project routes MUST stay intact.

**Footer / contact (shared chrome — preserve):** "…since 2000."; address **H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.**; **director@coodutrust.org**; **+91-451-2461362** (`tel:+914512461362`); "© 2025 Coodu Trust. All Rights Reserved."

---

## 5. Enhancement direction (TO-BE) — opinionated

**Hierarchy & flow (target reading order):** Hero (overlay, legible) → one-sentence "what this is" → headline stats band → 2-col overview (intro + scannable "our approach" list) → route-deeper grid (focus or projects) → impact themes → CTA.

Concrete moves:
1. **Hero:** kill the inline bg; add the fixed green→dark gradient overlay so white H1/subtitle always pass 4.5:1. Keep breadcrumb (it's the only "where am I"). Add a slim hero meta line under the subtitle for stat-tease on hubs (e.g. "5,000+ women · 450+ SHGs · since 2000").
2. **Promote the stats** out of a cramped 4-up under the paragraphs into a dedicated, high-contrast **`.stat` band** (big number, small caps label) — this is the page's instant-credibility moment (donor audience). Reuse the home/about stat component.
3. **Overview copy:** keep both paragraphs verbatim but constrain to ~70-char measure (`--maxw-text` 720px), sentence case. On hubs, add a short bulleted "Our approach" list (mirrors the leaf `component-list`) so prose is scannable.
4. **Make the route-deeper grid unmistakably clickable:** real `.card` with hover lift + image/icon, primary-green Lucide icon replacing emoji, and an explicit "Explore →"/"View Details →" affordance. These are the page's job (route into sub-programs/projects) — give them the most visual weight after the hero.
5. **Project cards (leaf):** standardize to media-top card → period pill + impact pill → title → 2-line clamped summary → focus-area tag chips → "View Details →". Removes today's dense stack.
6. **Impact cards quieter:** flat surface-alt tiles, line icon, title, 2–3 line text — clearly read-only proof, visually subordinate to the actionable grid.
7. **De-duplicate numbers** intentionally: stats band owns the figures; impact cards reference them in prose (already consistent: 800+, 450+) — keep aligned.
8. **CTA:** keep the program-specific heading; make "Partner with Us" the primary (filled green) and "Support Our Work"/Donate the accent CTA color (Style Gate §1.3 accent = donate-only). Add a one-line trust signal ("Registered non-profit · Dindigul · since 2000").
9. **Add (missing) lightweight "related programs" / sibling links** at the foot of leaf pages (the other 3 pillars' sub-programs) so leaves aren't dead-ends — optional, low priority.
10. **Remove:** emoji icons, inline styles, all-caps body, the brittle separate responsive layout. Reconcile the two legacy outliers into Variant A or B.

▶ YOUR ENHANCEMENT NOTES: ____

---

## 6. Three-viewport layout spec (the core deliverable)

Container max width `--maxw` 1140px, centered; text columns `--maxw-text` 720px. Section padding desktop 96px / mobile 56px (Style Gate §1.5). Breakpoints: base (mobile), 600, 900, 1200.

### WEB (desktop, ≥1025px / design at 1280px)
- **Hero:** full-bleed bg image, height ~360–420px, green→dark gradient overlay; content in `.container` bottom-left: breadcrumb (small caps) → H1 (`--fs-h1`) → subtitle → optional stat-tease line.
- **Stats band:** 4 stats in one row (4 × equal columns), big number + label, on surface or a thin tinted band. (If kept inside overview, place as a 4-up row directly under the heading.)
- **Overview:** 2-column grid — text **~7fr** / image **~5fr** (`grid-template-columns: 1.4fr 1fr`), 48px gap; image 4:3 or 3:2, radius 12px; text column capped at ~720px measure; bulleted "approach" list inside text column.
- **Route-deeper grid (focus/projects):** CSS Grid `repeat(auto-fit, minmax(280px, 1fr))` → **3 across** (4 focus cards wrap to 3+1 or set 2×2 for exactly 4; projects 1–3 across). 24–32px gap, equal-height cards, hover lift + shadow-2.
- **Impact grid:** 3 columns × 2 rows (6 cards), 24px gap, flat tiles.
- **CTA:** centered band, content max ~720px, two buttons inline (gap 16px). Optional full-bleed tinted/surface-alt background.
- **Nav:** full horizontal navbar with Programs mega-dropdown (shared chrome).

### TABLET (768–1024px / design at 834px)
- **Hero:** same, height ~300–340px, padding tightened.
- **Stats band:** 4 in a row if they fit, else **2×2**.
- **Overview:** **stack to single column** — text first, image full-width below (or keep 2-col only ≥900px with image narrower). Image 16:9/4:3 full width.
- **Route-deeper & Impact grids:** **2 columns** (Style Gate §1.8 tablet = 2). Gap 20–24px.
- **CTA:** centered, buttons may sit inline or wrap; keep ≥44px height.
- **Nav:** hamburger drawer kicks in (shared chrome).

### MOBILE (≤600px / design at 390px)
- **Hero:** height ~220–260px, H1 `--fs-h1` mobile (~32px), subtitle 16px, breadcrumb small; overlay strong enough for contrast.
- **Stats band:** **2×2** grid (never 4-up squashed); number stays prominent, label ≥14px.
- **Overview:** single column — heading → paragraphs (sentence case, 16px, 1.6 line-height) → approach list → image full-width below text. No side-by-side.
- **Route-deeper & Impact grids:** **1 column, full-width stacked** cards; image/icon top; tap target ≥44px; "Explore →"/"View Details →" full-width-feeling link.
- **CTA:** stacked — heading → text → two **full-width** buttons stacked (primary above accent), 12px gap.
- **Nav:** slide-in drawer from right with overlay (shared chrome), `aria-expanded`, Esc closes, scroll-locked.

---

## 7. Components used (reference the shared design system / Style Gate)

Global tokens (colors, fonts, radius, shadows, button/card base) are defined in `design/REDESIGN-STYLE-GATE.md` — **do not redefine here.** This page composes:

- **`.hero`** (`hero.css`) — page-header band with bg image + gradient overlay + `.hero__title` (H1) + subtitle + breadcrumb. (Style Gate §1.3 hero overlay, §1.9 imagery.)
- **`.breadcrumb`** — small caps trail (base/typography).
- **`.stat` / `.stat__num` / `.stat__label`** (`stats.css`) — the 4 headline highlights. (Style Gate §1.9 impact numbers.)
- **`.section` + `.container`** + spacing utilities (`layout.css`); `--surface-alt` for banded (`light-bg`) sections. (Style Gate §1.5.)
- **`.card` / `.card__media` / `.card__title` / `.card__meta`** (`card.css`) — used as the **focus card** (`.card--action`, with link arrow) and **project card** (`.card--project`, media-top + period/impact pills + tag chips) and **impact card** (`.card--quiet`, flat, no link). One block, three modifiers — not three copies. (Style Gate §1.8.)
- **Tag/pill** (`999px` radius, Style Gate §1.6) — project period, impact label, focus-area chips.
- **Icons:** one **Lucide line-icon set**, single primary-green color, replacing emoji. (Style Gate §1.9.)
- **`.btn` / `.btn--primary` / `.btn--secondary` / `.btn--cta`** (`button.css`) — CTA band + donate. (Style Gate §1.7; ≥44px touch target.)
- **`.cta` band** — title + text + actions (could live in `pages/program.css` if not global).
- **Shared `.site-header` / `.nav-drawer` and `.site-footer`** (chrome) — referenced, not restyled here.
- **Motion:** gentle fade-up reveals, 150–200ms hover, `prefers-reduced-motion` honored (Style Gate §1.10).

Per-page intent row to satisfy (Style Gate §1.11, "Program detail"): *banner, overview, what-we-do, related projects, CTA.*

---

## 8. Ready-to-paste Claude-design instruction

> Design the **Program / Sector detail page** for **COODU Trust**, a rural-development NGO in Dindigul, Tamil Nadu (20+ years in sustainable agriculture, women's empowerment, health, education, environment). This is a reusable TEMPLATE used by 36 program pages — design it so the same layout works whether the middle block is a grid of "sub-program" cards (that link deeper) or a grid of dated "project" cards.
>
> Use the **Women Empowerment** page as the concrete content (preserve it exactly):
> - H1 "Women Empowerment"; subtitle "Empowering women as catalysts of social and economic transformation"; breadcrumb Programs › Women Empowerment.
> - Overview H2 "Creating Sustainable Change Through Women" + the two real paragraphs (sentence case).
> - 4 headline stats: **5,000+** Women Empowered · **450+** SHGs Formed · **800+** Enterprises Created · **300%** Income Increase.
> - 4 "Focus Area" route-deeper cards (Social Empowerment & Leadership / Microfinance & Financial Inclusion / Entrepreneurship & Enterprise Development / SHG & Community Mobilization), each with a 1–2 line description and an "Explore →" link.
> - 6 "Impact" tiles (Leadership Development / Economic Independence / Financial Inclusion / Social Transformation / Community Solidarity / Sustainable Development) — read-only, no links; keep the embedded figures (2,000+ leaders, 800+ enterprises, 450+ SHGs, ₹50 lakhs savings).
> - CTA "Join Our Women Empowerment Mission" + paragraph + two buttons: "Partner with Us" (primary) and "Support Our Work" (accent/donate).
> - Shared header (Programs mega-nav, persistent Donate) and 4-column footer (address H-83, R.M. Colony, Dindigul – 624 001; director@coodutrust.org; +91-451-2461362; © 2025; since 2000).
>
> Produce **THREE** complete, polished designs of this same page:
> 1. **WEB / desktop** at **1280px** wide.
> 2. **TABLET** at **834px** wide.
> 3. **MOBILE** at **390px** wide (including the open slide-in nav drawer state).
>
> Follow the Style Gate **exactly** — colors, fonts, spacing, radius, shadows, button/card styles, per-page intent. Do not invent off-brand colors or fonts:
>
> ```
> [PASTE THE FILLED PART 1 STYLE GATE HERE]
> ```
>
> Requirements: mobile-first true reflow (not a squashed desktop); body text sentence case, ≥16px on mobile, ~70-char measure; **all-caps only on small labels**; replace ALL emoji icons with one Lucide line-icon set in primary green; hero photo gets the specified green→dark gradient overlay so white title text passes contrast; route-deeper cards must look clickable (hover lift + arrow), impact tiles flat/quiet; show real states (button hover, card hover, focus ring, open mobile drawer); use authentic rural/women's-SHG field photos (warm, natural light), rounded 12px. Grids: cards 3-up desktop / 2-up tablet / 1-up mobile; stats 4-up desktop / 2×2 mobile. Return **clean, self-contained** output: semantic HTML5 with landmarks, one `<h1>`, **all styling in one `<style>` block using CSS custom properties mirroring the Style Gate tokens, zero inline `style=` attributes**, no CSS frameworks, ≤2 Google Fonts, copy-paste runnable as a single file per viewport. After the designs, list the design tokens used (hex, font sizes, spacing, radii) as a short table.
