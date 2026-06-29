# COODU TRUST — 2-Page Redesign: STYLE GATE & Build Brief

> **🎯 GOAL (north star):** take this NGO site to a genuinely well-designed, well-structured,
> distinctive, fully-responsive (desktop + tablet + mobile) site, then deploy it.
> **Process:** YOU design the style in Claude design (browser, web + mobile) → I REBUILD the real
> pages cleanly (semantic HTML + design system, no overlay hacks) → multi-agent + verify →
> pilot 2 pages, approve, then scale.
>
> **Pilot pages:** Home + Women Empowerment (a Program page — the template covers 36 pages). *Swappable.*

## How to use this doc
1. Fill in the **STYLE GATE** (§1) with your exact visual direction.
2. Use **§4 (What to ask Claude design)** + the filled gate to generate a **web + mobile** design for each pilot page.
3. Send the designs back. I rebuild them per the **Clean-Rebuild Standards** (§3), using the **Content Inventories** (§2) as the source of truth so no real content is lost.

---

# §1–§... STYLE GATE, STANDARDS & CLAUDE-DESIGN INSTRUCTION

# COODU Trust — Style Gate + Clean-Rebuild Standards

**Project:** COODU Trust NGO website (Dindigul, Tamil Nadu)
**Why this document exists:** The last attempt layered new CSS over messy legacy markup. You weren't happy with the structure or the look. We are changing the process. From now on:

1. **You** lock the visual direction first by filling in **Part 1 (the Style Gate)**.
2. You paste the filled gate into **Claude design (browser)** and approve a **web + mobile** design.
3. **I** rebuild the real pages cleanly from your approved design, following **Part 2 (Clean-Rebuild Standards)** — no overlay hacks, no inline-style soup.

**The gate is a gate.** No page gets rebuilt until the Style Gate for that direction is filled and approved. Current brand is green `#28a745` / `#1e7e34` + Oswald, but you may change anything below — this is the moment to do it.

> Repo reality this is written against: 15 top-level pages, 38 program pages under `/programs/`, project pages under `/programs/projects/`, a single 5,250-line `assets/css/style.css`, a `assets/css/responsive.css`, JS in `assets/js/`, a Node/Express backend in `/server/` (contact + Razorpay donations + Cloudinary + email), and an existing `/design/` folder where Claude-design renders already live (`design/renders-site/`, `design/mobile/`, `design/tablet/`).

---

## PART 1 — THE STYLE GATE

Fill in **every** slot. Replace the `>>` example with your choice, or keep the example if you like it. Where you're unsure, write "Claude, you pick — match the mood above." Anything left blank means I (or Claude design) guesses, which is how we got the last mess. Be decisive.

### 1.1 Brand mood & adjectives
Pick **3–5 adjectives** that the site should feel like. These steer every other choice.

- **Feel (3–5 words):** `>> grounded, trustworthy, warm, modern, hopeful`
- **One-line vibe:** `>> "A serious rural-development NGO that's been doing real work for 20+ years — credible, not flashy, human."`
- **Avoid at all costs (anti-mood):** `>> corporate-cold, startup-neon, charity-guilt, clip-art, busy/cluttered`
- **Audience first in mind:** `>> donors & CSR partners on desktop; farmers/villagers & volunteers on mobile (low-end Android, slow data)`

### 1.2 Reference sites you like
List **2–4 sites** and say what you like about each (one phrase). Claude design will borrow the *feeling*, not copy.

- **Reference 1:** `>> charitywater.org` — like: `>> generous whitespace, big honest photos, calm`
- **Reference 2:** `>> goonj.org` — like: `>> Indian-NGO credibility, impact numbers up front`
- **Reference 3:** `>> ____________` — like: `>> ____________`
- **Reference 4 (optional):** `>> ____________` — like: `>> ____________`

### 1.3 COLOR palette
Give a hex + say **where each is used**. Keep it tight: one primary, one or two support colors, one accent for action. Too many colors reads cheap.

| Role | Hex | Used for | Example |
|---|---|---|---|
| **Primary** | `>> #1e7e34` | Headers, primary buttons, key emphasis, link hover | deep green |
| **Primary-dark** (hover/press) | `>> #155d27` | Button hover, footer bg | |
| **Secondary** | `>> #f4a300` (warm) **or** `>> #007bff` | Section accents, tags, secondary buttons | pick warm OR blue, not both |
| **Accent / CTA** | `>> #e8590c` | Donate button only — the one thing that must be clicked | high-contrast, used sparingly |
| **Surface / page bg** | `>> #ffffff` | Page background | |
| **Surface-alt** (banded sections) | `>> #f6f8f6` | Alternating sections, cards | soft, not gray-cold |
| **Border / hairline** | `>> #e2e8e2` | Card borders, dividers | |
| **Text-strong** (headings) | `>> #1a1f1a` | Headings | near-black, not pure #000 |
| **Text-body** | `>> #3d433d` | Paragraphs | |
| **Text-muted** | `>> #6b726b` | Captions, meta, placeholders | |
| **Success / Error** (forms) | `>> #2e7d32 / #c62828` | Form validation, donation status | |

- **Dark sections?** `>> yes — footer + hero overlay on photos` / `no`
- **Gradients?** `>> subtle green→dark-green on hero overlay only` / `none, flat color`
- **Decision — keep current green or change?** `>> KEEP green, warm it slightly` / `>> CHANGE to ____________`

### 1.4 TYPOGRAPHY
Two fonts max (one display, one body). Name fonts available on Google Fonts so they load free.

- **Display / heading font:** `>> Oswald` (current) **or** `>> "Plus Jakarta Sans" / "Sora" / "Bricolage Grotesque"`
- **Body / paragraph font:** `>> "Inter"` **or** `>> "Source Sans 3" / system-ui`
- **IMPORTANT — case:** the current site forces **ALL-CAPS on the entire body** (`text-transform: uppercase` on `body`). That hurts readability badly on mobile. Choose:
  - `>> Caps for headings/labels ONLY; sentence case for all body text` **(recommended)**
  - `>> Keep everything uppercase` (not recommended)
- **Type scale (desktop):** H1 `>> 48px` · H2 `>> 34px` · H3 `>> 24px` · body `>> 17px` · small `>> 14px`
- **Type scale (mobile):** H1 `>> 32px` · H2 `>> 26px` · H3 `>> 20px` · body `>> 16px` (never below 16px for body on mobile)
- **Weights to use:** headings `>> 600/700` · body `>> 400` · emphasis `>> 600`
- **Line-height:** headings `>> 1.15` · body `>> 1.6`
- **Letter-spacing:** headings `>> normal` · all-caps labels `>> +0.04em`
- **Max line length (body):** `>> ~70 characters` (so paragraphs don't run full-width on desktop)

### 1.5 Spacing & rhythm
- **Base unit:** `>> 8px` (all spacing is multiples: 8/16/24/32/48/64/96)
- **Section vertical padding:** desktop `>> 96px` · mobile `>> 56px`
- **Max content width:** `>> 1140px` centered; text columns `>> 720px`
- **Gutter / page side padding:** desktop `>> 24px` · mobile `>> 16px`
- **Density:** `>> airy/generous whitespace` / `compact/info-dense`

### 1.6 Corner radius, shadows, borders
- **Radius:** buttons `>> 8px` · cards `>> 12px` · inputs `>> 8px` · images `>> 12px` · pills/tags `>> 999px`
- **Shadow style:** `>> soft & low — 0 2px 8px rgba(0,0,0,.06), lift to 0 8px 24px rgba(0,0,0,.10) on hover` / `>> flat, borders only, no shadows`
- **Borders:** `>> 1px hairline on cards in the border color; no heavy outlines`
- **Overall edge feel:** `>> soft & rounded` / `sharp & editorial`

### 1.7 BUTTON styles
- **Primary button:** bg `>> primary green`, text `>> white`, radius `>> 8px`, padding `>> 14px 28px`, weight `>> 600`, hover `>> darken + slight lift`, case `>> sentence` / `UPPERCASE`
- **Secondary button:** `>> outline — 1.5px primary border, transparent bg, primary text, fills on hover`
- **Donate / CTA button:** `>> accent color, slightly larger, always visible in header on desktop`
- **Text/link button:** `>> primary color, underline on hover, arrow "→" affordance`
- **Min height (touch):** `>> 44px` (non-negotiable for mobile)
- **Icon in buttons?** `>> yes, small leading icon on CTAs` / `no`

### 1.8 CARD styles (program cards, project cards, report cards)
- **Anatomy:** `>> image top → tag/category → title → 2-line summary → "Learn more →"`
- **Image ratio:** `>> 16:9` / `>> 4:3` / `>> 3:2`
- **Background:** `>> white on surface-alt sections` · border `>> 1px hairline` · radius `>> 12px`
- **Hover:** `>> lift + shadow + image zoom 1.03` / `>> just border-color change`
- **Grid:** desktop `>> 3 columns` · tablet `>> 2` · mobile `>> 1 (full-width stacked)`
- **Program-hub specific:** 38 programs is a lot — `>> group into themed sections with headings` / `>> filterable grid with category chips`

### 1.9 Imagery & illustration style
- **Photo treatment:** `>> real field photos, warm, natural light; subtle green/dark gradient overlay where text sits on them`
- **People in photos?** `>> yes — farmers, women's SHGs, training in action (authentic, not stock)`
- **Illustration / icon style:** `>> simple line icons (one set, e.g. Lucide), single color` — avoid mixed clip-art
- **Logo placement & lockup:** `>> logo + "COODU Trust" wordmark, left of header`
- **Image shape:** `>> rounded corners 12px` / `>> full-bleed straight edges`
- **Impact numbers / stats:** `>> big number + short label blocks (e.g. "20+ yrs", "X villages")` — yes/no: `>> yes, on home + about`

### 1.10 Motion & interaction feel
- **Overall:** `>> calm and subtle — nothing bounces` / `>> lively`
- **Hover transitions:** `>> 150–200ms ease, color + transform only`
- **Scroll reveals:** `>> gentle fade-up on sections, once, respecting reduced-motion` / `>> none`
- **Mobile nav:** `>> slide-in drawer from right with overlay` (matches existing `design/renders/mobile-14-drawer.png`)
- **Reduced motion:** `>> honor prefers-reduced-motion — disable reveals/zoom` (required)

### 1.11 Per-page intent (what each pilot page must emphasize)
Pick a **pilot page** to design first (I recommend **Home**, then **one Program detail**, because those two templates cover ~90% of the site). For each page say the ONE job it does.

| Page | One job it must do | Must-have blocks |
|---|---|---|
| **Home (`index.html`)** | `>> Build instant trust + route to Programs / Donate` | hero w/ photo + tagline + 2 CTAs, impact stats, programs preview grid, "who we are" strip, partners/donate band, footer |
| **Programs hub (`programs.html`)** | `>> Make 38 programs scannable, not overwhelming` | intro, themed groups or filter chips, card grid |
| **Program detail (`/programs/*.html`)** | `>> Explain one program + its projects credibly` | banner, overview, what-we-do, related projects, CTA |
| **Project detail (`/programs/projects/*.html`)** | `>> Show one concrete project (training/impact)` | hero, summary, gallery, outcomes, back-to-program |
| **About (`about.html`)** | `>> 20+ yr credibility, mission, people` | story, mission/vision, timeline, team, registrations |
| **Donate (`donate.html`)** | `>> Frictionless giving (Razorpay)` | amount presets, form, trust signals, secure badge |
| **Get Involved / Volunteer / Partner** | `>> Convert helpers — clear next step` | role cards, simple form, what-you-get |
| **Documents / Report viewer** | `>> Browse 20+ annual reports cleanly` | year list/grid, in-page PDF viewer |
| **Media** | `>> Show activity proof (gallery)` | filterable image/video grid, lightbox |
| **Contact (`contact.html`)** | `>> Easy to reach + working form` | form, address/map, phone/email, hours |

- **Pilot page chosen:** `>> Home + one Program detail`

---

## PART 2 — CLEAN-REBUILD STANDARDS

How I rebuild from your approved design so it is **structured**, not a re-skin. These are commitments, not suggestions. Every new/rebuilt page is checked against this list before it's called done.

### 2.1 Semantic HTML5 (structure first, style never inline)
- Real landmarks on every page: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` — **one `<main>` per page**.
- Headings form a logical outline: exactly **one `<h1>`** per page, no skipped levels (no `<h3>` jumping from `<h1>`).
- Lists are `<ul>/<ol>`, not stacked `<div>`s. Buttons that act are `<button>`; things that navigate are `<a href>`. Never a clickable `<div>`.
- Images use `<img>` with **meaningful `alt`** (empty `alt=""` only for pure decoration). Figures use `<figure>/<figcaption>`.
- Forms (contact/donate/volunteer) use `<form>`, `<label for>` tied to every input, `<fieldset>/<legend>` for groups, proper `type`/`autocomplete`/`required`.
- **Zero `style="..."` attributes** in markup. **Zero `<style>` blocks** in page `<head>` (today's pages embed page-specific CSS — that ends). All styling lives in the design-system CSS files.
- Drop the legacy global `text-transform: uppercase` on `<body>`; case is applied per component only (per your Style Gate choice).

### 2.2 A real design-system CSS (tokens + components), not a 5,250-line dump
Replace the single mega `style.css` with a small, layered, **token-driven** system. Cascade order is fixed:

```
assets/css/
  tokens.css        /* :root design tokens ONLY — the Style Gate, in code */
  base.css          /* reset, html/body, typography defaults, links, focus */
  layout.css        /* .container, .grid, .section, spacing utilities */
  components/
    button.css      /* .btn, .btn--primary, .btn--secondary, .btn--cta */
    card.css        /* .card, .card__media, .card__title, .card__meta */
    header.css      /* .site-header, .site-nav, .nav-drawer */
    footer.css      /* .site-footer */
    hero.css        /* .hero, .hero__title, .hero__actions */
    form.css        /* .field, .field__label, .field__input, .field--error */
    stats.css       /* .stat, .stat__num, .stat__label */
    gallery.css     /* media grid + lightbox */
  pages/
    home.css        /* ONLY the few rules unique to home, if any */
    program.css
  main.css          /* @imports the above in order — single entry point */
```

- **`tokens.css` is the Style Gate in code.** Every value from Part 1 becomes a CSS custom property; **nothing hardcodes a hex or px outside this file.**

```css
:root {
  /* color */
  --color-primary: #1e7e34;
  --color-primary-dark: #155d27;
  --color-accent: #e8590c;
  --surface: #ffffff;
  --surface-alt: #f6f8f6;
  --border: #e2e8e2;
  --text-strong: #1a1f1a;
  --text-body: #3d433d;
  --text-muted: #6b726b;
  /* type */
  --font-display: "Oswald", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --fs-h1: clamp(2rem, 1.2rem + 3vw, 3rem);
  --fs-body: 1.0625rem;
  /* space (8px base) */
  --space-1: .5rem; --space-2: 1rem; --space-3: 1.5rem;
  --space-4: 2rem; --space-6: 3rem; --space-8: 4rem;
  /* shape */
  --radius-btn: 8px; --radius-card: 12px;
  --shadow-1: 0 2px 8px rgba(0,0,0,.06);
  --shadow-2: 0 8px 24px rgba(0,0,0,.10);
  --maxw: 1140px; --maxw-text: 720px;
  --dur: 180ms; --ease: cubic-bezier(.2,.6,.2,1);
}
```

- **Reusable component classes, BEM-ish.** Block `.card`, element `.card__title`, modifier `.card--featured`. No styling by tag deep in trees, no `#id` styling, no `!important` (the current file leans on `!important` — gone). One class = one job; pages compose components, they don't redefine them.
- A component is defined **once** and reused on all 50+ pages. If a program card looks different on two pages, that's a modifier (`.card--compact`), not a copy-paste.

### 2.3 Mobile-first, small fixed set of breakpoints
- Author base styles for **mobile**, then enhance upward with `min-width` queries only.
- **Exactly three breakpoints**, named as tokens — no random `@media (max-width: 991.5px)`:

```css
/* sm/base: 0+ (mobile, default, no query) */
@media (min-width: 600px)  { /* md: large phone / small tablet */ }
@media (min-width: 900px)  { /* lg: tablet / small laptop */ }
@media (min-width: 1200px) { /* xl: desktop */ }
```

- Layout via CSS Grid/Flex with `clamp()` and `minmax()` so it's fluid between breakpoints, not 4 frozen layouts. Replaces the separate `responsive.css` patch file.

### 2.4 ONE shared header/footer (kill the ~50× duplication)
Today the same `<header>`/`<nav>`/`<footer>` is hand-copied into every one of the 50+ HTML files — editing one link means 50 edits. That stops. Choose **one** mechanism and document it as the single source of truth:

- **Option A — build-time include (preferred):** keep `partials/header.html` + `partials/footer.html`; assemble pages with a tiny include step (e.g. an `npm run build` using `posthtml-include`/`eleventy`, or even a small Node script — the repo already has Node in `/server`). Pages contain `<!-- @@include header -->`, never raw nav.
- **Option B — runtime inject (no build):** one `partials/header.html` + `partials/footer.html`, injected by a single `assets/js/include.js` on `DOMContentLoaded` (`fetch` + `innerHTML`) into `<div data-include="header">`. Simplest given the static host; works on plain file serving.
- Either way: **header/footer markup exists in exactly one file.** Active-nav state is set by a `data-page` attribute on `<body>`, not by editing each copy.

### 2.5 No inline styles, no dead assets, accessibility, performance
**Accessibility (checked per page):**
- Landmarks present (2.1); skip-link `<a class="skip" href="#main">` first in `<body>`.
- Visible keyboard focus on every interactive element (`:focus-visible` outline using `--color-primary`); never `outline:none` without a replacement.
- Color contrast **≥ 4.5:1** for body text, **≥ 3:1** for large text/UI — verify the chosen palette (esp. green-on-white and any text over photos; add the gradient overlay so it passes).
- Touch targets **≥ 44×44px** (buttons, nav links, drawer toggle).
- Mobile drawer: `aria-expanded` on the toggle, focus trap while open, `Esc` closes, background `inert`/scroll-locked.
- `alt` text real; forms have associated labels + `aria-live` region for submit success/error (contact + donate).
- `prefers-reduced-motion` honored — disables scroll reveals and image zoom.
- `<html lang="en">` (and mark any Tamil content with `lang="ta"`).

**Performance:**
- Images: `loading="lazy"` + `decoding="async"` on everything below the fold; explicit `width`/`height` (or `aspect-ratio`) to stop layout shift; serve sized/compressed (Cloudinary is already wired — request appropriately sized transforms, not full-res). Prefer WebP/AVIF with fallback.
- Fonts: 2 families max, `display=swap`, preconnect to Google Fonts, only the weights used.
- CSS/JS: ship the small modular set; no page-embedded `<style>`; defer non-critical JS (`<script defer>`). One small `main.js`, feature scripts loaded only where used (gallery only on media, donate only on donate).
- **Remove dead assets:** delete the test/debug scaffolding from the web root — `debug-contact.html`, `temp_nav.html`, `test-contact-api.html`, `test-contact-main.html` — and any `Thumbs.db`/`.DS_Store` (add to `.gitignore`). No orphan CSS/JS.

### 2.6 Final folder/file structure (target)
```
/                       # top-level pages: index, about, programs, donate, contact, ...
/programs/              # 38 program detail pages
/programs/projects/     # project detail pages
/partials/
  header.html           # SINGLE source of truth
  footer.html
/assets/
  css/  tokens.css base.css layout.css components/* pages/* main.css
  js/   include.js main.js gallery.js donate.js report-viewer.js sectors.js
  images/ ...           # sized/optimized, no Thumbs.db
/design/                # Claude-design renders live here (already in use)
  renders-site/  mobile/  tablet/  STYLE-GATE.md (the filled Part 1)
/server/                # unchanged Node/Express backend
```
- Each rebuilt page links **only** `assets/css/main.css` (+ its one optional `pages/*.css`) and the JS it actually needs. No page reaches into another page's styles.

### 2.7 Definition of done (per page)
A page is "rebuilt" only when: semantic landmarks ✓, one `<h1>` ✓, zero inline styles/`<style>` ✓, uses shared header/footer ✓, only tokenized values ✓, mobile + desktop both match the approved render ✓, keyboard-navigable with visible focus ✓, contrast ✓, 44px targets ✓, images lazy + sized ✓, no console errors ✓.

---

## PART 3 — WHAT TO ASK CLAUDE DESIGN FOR

Once Part 1 is filled, paste the block below into **Claude design (browser)**. Paste your **entire filled Style Gate** where indicated. Ask for **one page at a time** (start with Home), and require **both web and mobile**.

> **Prompt to paste into Claude design:**
>
> Design the **[PAGE NAME, e.g. Home page]** for **COODU Trust**, a rural-development NGO in Dindigul, Tamil Nadu (20+ years of work in sustainable agriculture, livelihoods, health, education, and environment).
>
> Produce **TWO** complete, polished designs of this same page:
> 1. **Desktop / web** at **1280px** wide.
> 2. **Mobile** at **390px** wide (including the slide-in nav drawer state).
>
> Follow this Style Gate **exactly** — colors, fonts, spacing, radius, shadows, button/card styles, and the per-page intent. Do not invent off-brand colors or fonts:
>
> ```
> [PASTE YOUR FILLED PART 1 STYLE GATE HERE]
> ```
>
> Requirements:
> - Use a **mobile-first, fluid** layout; the mobile version is a true reflow, not a squashed desktop.
> - Body text is **readable** (sentence case, ≥16px on mobile, max ~70-char line length). Apply all-caps to headings/labels only.
> - Include the must-have blocks listed for this page in the Style Gate (hero, impact stats, programs preview, etc.).
> - Text over photos must stay legible — add the specified gradient overlay so contrast passes.
> - Show real interaction states: button hover, card hover, focus ring, and the open mobile nav drawer.
> - Use placeholder photos that match the imagery style (authentic rural field/community photos, warm, natural light).
> - Return **clean, self-contained output**: semantic HTML5 with landmarks, **all styling in one `<style>` block using CSS custom properties** that mirror the Style Gate tokens, **no inline `style=` attributes**, no external CSS frameworks (no Bootstrap/Tailwind), and ≤2 Google Fonts. Make it copy-paste runnable as a single file.
>
> After the design, list the **design tokens** you used (hex values, font sizes, spacing, radii) as a short table so they can be ported into a token file.

**Workflow after Claude design replies:**
1. Review **mobile first**, then desktop. Iterate in Claude design until you approve.
2. Save the approved renders into `design/renders-site/` and the token table + filled gate into `design/STYLE-GATE.md`.
3. Hand it to me. I rebuild the **real** page per Part 2 (tokens → components → semantic page → shared header/footer), and we repeat for the next pilot page (a Program detail).


---

# §2. CONTENT INVENTORIES (source of truth — preserve this content in the redesign)

## 2A. HOME

› **Source file:** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/index.html`
› **Page `<title>`:** `Coodu Trust - Empowering Communities, Transforming Lives`
› **Meta description:** `Coodu Trust is a non-profit organization dedicated to women empowerment, health, environmental sustainability, and livelihood development in India.`
› **Font:** Google Fonts — Oswald (weights 400/500/700)
› **Stylesheets:** `assets/css/style.css`, `assets/css/responsive.css`
› **Script:** `assets/js/main.js` (drives hero slideshow, stories carousel, animated stat counters, mobile hamburger)

---

## Page-level background

- Full-page fixed background image (inline on `<body>`): Cloudinary `…/coodu-trust/images/aboutus/background.jpg` — cover, center, fixed, no-repeat.
- A fixed white overlay div at `rgba(255,255,255,0.4)`, `z-index:-1` softens the background. Most sections force `background: transparent` so this shows through; exceptions are the CTA, Stats Banner (`#2c3e50` dark navy), and Footer.

---

## SECTION ORDER (top → bottom)

1. Header / Nav bar
2. Hero (background slideshow)
3. Our Impact (stat cards)
4. Video & Mission
5. Our Core Programs (program cards)
6. Call to Action band (two boxes)
7. Stories of Transformation (testimonial carousel)
8. Live Statistics Banner (animated counters)
9. Footer (logo/about, quick links, contact, social)

---

## 1. HEADER — `header.header`
**Purpose:** Sticky site navigation + persistent Donate CTA.

**Logo (links to `index.html`):**
- Image: Cloudinary `…/logos/coodu_frontlogo.png`, alt "Coodu Trust Logo"
- Text: **"Coodu Trust"**

**Primary nav links (in order):**
- Home → `index.html` (marked `active` on this page)
- About → `about.html`
- **Programs** → `programs.html` (dropdown with 6 categories, each with its own sub-menu):
  - **Environment and Resilience** → `programs/environment-resilience.html`
    - Watershed Management → `programs/watershed-management.html`
    - Plantation & Afforestation → `programs/plantation-afforestation.html`
    - Water Resource Management → `programs/water-resource-management.html`
    - Soil & Land Management → `programs/soil-land-management.html`
    - Biodiversity Conservation → `programs/biodiversity-conservation.html`
    - Climate Change Adaptation & Mitigation → `programs/climate-change-adaptation.html`
  - **Sustainable Agriculture** → `programs/sustainable-agriculture.html`
    - Farmer Collectivization & Agribusiness → `programs/farmer-collectivization.html`
    - Livestock & Allied Activities → `programs/livestock-allied.html`
    - Horticulture & Diversified Farming → `programs/horticulture-diversified.html`
    - Agricultural Technology & Youth Engagement → `programs/agricultural-technology.html`
    - Organic Farming Practices → `programs/organic-farming.html`
  - **Women Empowerment** → `programs/women-empowerment.html`
    - Social Empowerment & Leadership → `programs/social-empowerment-leadership.html`
    - Microfinance & Financial Inclusion → `programs/microfinance-financial-inclusion.html`
    - Entrepreneurship & Enterprise Development → `programs/entrepreneurship-enterprise-development.html`
    - SHG & Community Mobilization → `programs/shg-community-mobilization.html`
  - **Education and Skilling** → `programs/education-skilling.html`
    - Vocational & Livelihood Training → `programs/vocational-livelihood-training.html`
    - Digital Literacy & IT Training → `programs/digital-literacy-it-training.html`
    - Formal & Higher Education Support → `programs/formal-higher-education-support.html`
    - School Infrastructure Development → `programs/school-infrastructure-development.html`
  - **Health, Sanitation & Waste Management** → `programs/health-sanitation.html`
    - Health Support & Rehabilitation → `programs/health-support-rehabilitation.html`
    - Community Health Services → `programs/community-health-services.html`
    - Disease-Specific Interventions → `programs/disease-specific-interventions.html`
    - Water Quality & Safety → `programs/water-quality-safety.html`
    - Sanitation & Hygiene Infrastructure → `programs/sanitation-hygiene-infrastructure.html`
    - Solid Waste Management → `programs/solid-waste-management.html`
  - **Consultancy and HR Management** → `programs/consultancy-hr.html`
    - Technology & Knowledge Dissemination → `programs/technology-knowledge-dissemination.html`
    - Strategic Planning & Advisory Services → `programs/strategic-planning-advisory.html`
    - Human Resource & Staffing Solutions → `programs/hr-staffing-solutions.html`
- **Get Involved** → `get-involved.html` (dropdown):
  - Partner with Us → `partner.html`
  - Volunteer → `volunteer.html`
  - Donate → `donate.html`
- Documents → `documents.html`
- Media → `media.html`
- Contact → `contact.html`

**Header CTA button:** "Donate" → `donate.html` (`btn btn-primary donate-button`)
**Mobile:** Hamburger icon (3 bars) toggles the menu.

**Components:** logo lockup, multi-level dropdown nav (2 levels deep on Programs), primary button, hamburger.

---

## 2. HERO — `section.hero-section`
**Purpose:** Headline value proposition over a rotating image slideshow.

**Background slideshow (5 slides, JS auto-rotating, first is `active`):**
1. `…/images/hero/style.jpg`
2. `…/images/hero/women-empowerment.jpg`
3. `…/images/programs/program-environment.jpg`
4. `…/images/programs/health-sanitation.jpg`
5. `…/images/programs/program-women-empowerment.jpg`
(all Cloudinary-hosted, set as inline `background-image`)

A `hero-overlay` div darkens the slideshow for text legibility.

**Copy:**
- H1 (`hero-title`): **"Empowering Communities, Transforming Lives"**
- Subtitle (`hero-subtitle`): **"Join us in our mission to create a sustainable and equitable future for rural communities through empowerment, health, and environmental action."**
- CTA button (`btn btn-secondary`): **"Discover Our Work"** → anchor `#programs` (scrolls to Programs section)

**Slideshow nav:** 5 clickable dots (`hero-dot`, `data-slide` 0–4).
**Components:** image carousel/slideshow, overlay, headline block, secondary button, dot navigation.

---

## 3. OUR IMPACT — `section#impact.impact-section`
**Purpose:** Headline impact metrics ("at a glance").

**Section title (H2):** **"Our Impact at a Glance"**

**Stat cards (4, `impact-card` — icon + number + label):**
| Icon (local asset) | Number | Label |
|---|---|---|
| `assets/images/icons/womens-empwerment.png` | **3,81,609+** | Total Beneficiaries |
| `assets/images/icons/village.png` | **534** | Panchayats Served |
| `assets/images/icons/icon-health.png` | **18,523+** | Toilets Built |
| `assets/images/icons/icon-tree.png` | **26,93,250** | Trees Planted |

(Numbers use Indian digit grouping. All 4 icon files confirmed present on disk.)
**Components:** stat card grid (4 cards), static numbers (no animation here).

---

## 4. VIDEO & MISSION — `section#mission.mission-section`
**Purpose:** Intro video + mission statement, two-column layout.

**Left — video:** YouTube embed `https://www.youtube.com/embed/wrG63C0qtxg`, title "Introduction to COODU TRUST". (Hardcoded iframe width=1803 height=1014 — should be made responsive in redesign.)

**Right — content:**
- H2 (`mission-title`), three stacked emphasized words:
  - **"Community."** (blue)
  - **"Compassion."** (blue)
  - **"Collaboration."** (green)
- Mission text: **"The mission of Coodu Trust is to improve the quality of life for economically disadvantaged individuals by providing the necessary resources to increase their standard of living, foster self-improvement, and maximize self-empowerment."**
- CTA button (`btn btn-primary`): **"Learn More"** → `about.html`

**Components:** responsive 2-col grid, embedded video iframe, headline with colored keywords, primary button.

---

## 5. OUR CORE PROGRAMS — `section#programs.programs-section`
**Purpose:** Showcase the 5 core program pillars as cards. (This is the target of the hero "Discover Our Work" anchor.)

**Section title (H2):** **"Our Core Programs"**

**Program cards (5, `program-card` — image + title + description + link):**

1. **Environment and Resilience**
   - Image: Cloudinary `…/programs/program-environment.jpg`
   - Desc: "Building climate-resilient communities through environmental conservation, renewable energy solutions, and sustainable development practices."
   - Link: "Learn More →" → `programs/environment-resilience.html`

2. **Sustainable Agriculture**
   - Image: Cloudinary `…/programs/watershed-development.jpg`
   - Desc: "Promoting organic farming, watershed management, and innovative agricultural techniques to enhance food security and farmer livelihoods."
   - Link: "Learn More →" → `programs/sustainable-agriculture.html`

3. **Education and Skilling**
   - Image: Cloudinary `…/programs/program-women-empowerment.jpg` *(image subject mismatch — uses a women-empowerment photo for the education card; consider correcting in redesign)*
   - Desc: "Empowering communities through quality education, vocational training, and skill development programs for sustainable employment."
   - Link: "Learn More →" → `programs/education-skilling.html`

4. **Health, Sanitation & Waste Management**
   - Image: Cloudinary `…/programs/health-sanitation.jpg`
   - Desc: "Improving community health through healthcare access, sanitation facilities, solid waste management, and health awareness programs in rural areas."
   - Link: "Learn More →" → `programs/health-sanitation.html`

5. **Consultancy and HR Management**
   - Image: Cloudinary `…/team/member-1.jpg` *(image subject mismatch — uses a team-member portrait for the consultancy card; placeholder-quality, replace in redesign)*
   - Desc: "Providing expert consultancy services and human resource management solutions for organizational development and capacity building."
   - Link: "Learn More →" → `programs/consultancy-hr.html`

**Note:** The site's nav lists **6** program categories but the home page shows only **5** cards — **"Women Empowerment"** has no card here despite being a top-level program. Redesign should decide whether to add it.
**Components:** program/feature card grid (5 cards), image + text + arrow link.

---

## 6. CALL TO ACTION BAND — `section#cta.cta-section`
**Purpose:** Dual-path CTA band (seek help vs. give help).

**Two boxes (`cta-box`):**
1. `cta-help`
   - H3: **"Are You Looking for Support?"**
   - P: "Discover the programs and resources we offer to communities."
   - Button (`btn btn-light`): **"Get Help"** → `contact.html`
2. `cta-involve`
   - H3: **"Do You Want to Make a Difference?"**
   - P: "Join us as a volunteer, partner, or donor to transform lives."
   - Button (`btn btn-light`): **"Get Involved"** → `get-involved.html`

**Components:** 2-column CTA band, two cards each with heading + text + light button. (No images.)

---

## 7. STORIES OF TRANSFORMATION — `section#testimonials.stories-carousel-section`
**Purpose:** Testimonial / beneficiary success-story carousel.

**Section title (H2):** **"Stories of Transformation"**
**Intro (`section-intro-text`):** "Witness the powerful journeys of communities and individuals transformed through our programs"

**Carousel slides (3, `story-slide`, first `active`) — each = image + category badge + quote + author:**

1. Category badge: **"Women Empowerment"**
   - Image: `assets/images/programs/program-women-empowerment.jpg` (local, present), alt "Lakshmi Devi in her tailoring workshop"
   - Quote: "Coodu Trust's skill development program changed my life completely. I learned tailoring and now I run my own small business, supporting my family independently. My monthly income has increased from ₹2,000 to ₹8,000."
   - Author: **Lakshmi Devi** — "Women Empowerment Program, Dindigul"

2. Category badge: **"Health & Sanitation"**
   - Image: `assets/images/programs/watershed-development.jpg` (local, present), alt "Clean water facility in the village"
   - Quote: "Before Coodu Trust came to our village, we had to walk 3 kilometers for clean water. Now with the new water system and sanitation facilities, our children are healthier and our women save 2 hours daily."
   - Author: **Murugan S.** — "Village Head, Karur District"

3. Category badge: **"Sustainable Agriculture"**
   - Image: `assets/images/programs/program-environment.jpg` (local, present), alt "Raman Kumar in his organic farm"
   - Quote: "The organic farming training helped us reduce our costs by 40% and increase crop yield by 25%. We no longer depend on expensive chemical fertilizers and our soil health has improved significantly."
   - Author: **Raman Kumar** — "Farmer, Environmental Program"

**Controls:** 3 dots (`carousel-dot`, `data-slide` 0–2); prev/next arrows (‹ / ›, aria-labelled "Previous story" / "Next story"). Decorative large quote-mark icon (`"`) per slide.
**Components:** testimonial carousel, category badge overlay on image, quote block, author block, dot + arrow navigation.

---

## 8. LIVE STATISTICS BANNER — `section#stats-banner.stats-banner-section`
**Purpose:** Environmental "wake-up" global stats with animated count-up. Dark navy band (`background:#2c3e50`).

**Intro:**
- H4: **"We Have Only One Planet"**
- P: "It's time to wake up to the grim reality and get our act together."

**Animated counters (4, `stat-number` count from 0 to `data-target` via JS):**
| Target value | Label |
|---|---|
| 8,192,242,010 | World population |
| 1,198,948,812 | Tonnes of waste dumped |
| 28,277,094 | Tonnes of electronic waste |
| 1.72 | Number of Earths humanity uses |

**Components:** dark CTA/stat band, intro headline, 4 animated counter items. (No images.)

---

## 9. FOOTER — `footer#contact.footer`
**Purpose:** Org summary, quick links, contact details, social, copyright. (Note: `id="contact"` — any `#contact` anchor lands here.)

**4 columns (`footer-col`):**

1. **Brand/about**
   - Logo: Cloudinary `…/logos/logo-white.png`, alt "Coodu Trust White Logo"
   - About text: **"Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000."**

2. **Quick Links** (H4 "Quick Links")
   - About Us → `about.html`
   - Our Programs → `programs.html`
   - Careers → `careers.html`
   - Donate → `donate.html`

3. **Contact Us** (H4 "Contact Us", in `<address>`)
   - Address: **"H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India."**
   - Email: **director@coodutrust.org** (`mailto:`)
   - Phone: **+91-451-2461362** (`tel:+914512461362`)

4. **Follow Us** (H4 "Follow Us") — social icons, all `href="#"` (no real destinations yet):
   - Facebook — Cloudinary `…/icons/facebook.png`
   - Twitter — Cloudinary `…/icons/twitter.png`
   - Instagram — Cloudinary `…/icons/instagram.png`

**Footer bottom:** **"© 2025 Coodu Trust. All Rights Reserved."** (year is 2025 — current year is 2026; update on redesign.)
**Components:** 4-col footer grid, white logo, link list, address block, social icon row, copyright bar.

---

## INTERNAL NAVIGATION TARGETS USED ON THIS PAGE
- On-page anchors: `#programs` (hero CTA → Programs section). Section IDs available as targets: `#impact`, `#mission`, `#programs`, `#cta`, `#testimonials`, `#stats-banner`, `#contact` (footer).
- Cross-page links from body: `about.html` (mission Learn More), `contact.html` (Get Help), `get-involved.html` (Get Involved), 5 individual `programs/*.html` pages, plus footer links (`about.html`, `programs.html`, `careers.html`, `donate.html`) and contact `mailto:`/`tel:`.

---

## IMAGE INVENTORY — real vs. placeholder/issues
**Local assets — confirmed present on disk:**
- Impact icons: `womens-empwerment.png`, `village.png`, `icon-health.png`, `icon-tree.png` (all present)
- Story images: `program-women-empowerment.jpg`, `watershed-development.jpg`, `program-environment.jpg` (all present)

**Remote (Cloudinary `dvxbg6to3`) — external dependency, not in repo:** page background, 5 hero slides, 5 program-card images, footer white logo, header front logo, 3 social icons. These load only with internet + an intact Cloudinary account; treat as a hosting risk for the redesign (consider localizing).

**Subject mismatches / weak imagery to fix in redesign:**
- Program card "Education and Skilling" reuses the **women-empowerment** photo.
- Program card "Consultancy and HR Management" uses a **team member portrait** (`team/member-1.jpg`) — reads as a placeholder.
- Hero slide list and program images overlap (same environment/health/women images reused across sections).

**No broken/404 image references were found among the local assets** (all referenced local files exist). Risk is concentrated in the remote Cloudinary URLs and the placeholder-quality program images noted above.

---

## CONTENT THAT MUST SURVIVE THE REDESIGN (quick checklist)
- Tagline: "Empowering Communities, Transforming Lives" + hero subtitle.
- 4 impact stats: 3,81,609+ Beneficiaries · 534 Panchayats · 18,523+ Toilets · 26,93,250 Trees.
- Mission triad "Community. Compassion. Collaboration." + full mission paragraph.
- 5 core program titles + descriptions + their deep links (plus decide on Women Empowerment 6th).
- Dual CTA: "Are You Looking for Support?" / "Do You Want to Make a Difference?".
- 3 testimonials verbatim (Lakshmi Devi, Murugan S., Raman Kumar) with quotes, names, locations, categories.
- "We Have Only One Planet" banner + 4 global stats (8,192,242,010 / 1,198,948,812 / 28,277,094 / 1.72).
- Footer: "registered non-profit … Tamil Nadu, India since 2000", full address, director@coodutrust.org, +91-451-2461362, social links, copyright.
- Intro video (YouTube ID `wrG63C0qtxg`).

---

## 2B. WOMEN EMPOWERMENT (Program template)

# Women Empowerment Program Page — Content & Structure Inventory

**File:** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/programs/women-empowerment.html`
**Page title (browser tab):** `Women Empowerment | Coodu Trust`
**Meta description:** `Empowering women through social empowerment, microfinance, entrepreneurship development, and self-help group mobilization for sustainable community development.`
**Lang:** `en` · **Font:** Google Fonts — Oswald (400, 500, 700)
**Stylesheets:** `../assets/css/style.css`, `../assets/css/responsive.css` · **Script:** `../assets/js/main.js`

This page is one of the four sub-pillars under the "Women Empowerment" program category. It is a **landing/overview page** that summarizes the pillar, then routes users into 4 detailed sub-program pages, shows impact, and ends with a CTA.

---

## SECTION-BY-SECTION INVENTORY (in document order)

### 1. Header / Global Navigation (`<header class="header">`)
**Purpose:** Site-wide sticky nav (shared component across all pages). Component: navbar + logo + multi-level dropdown menu + persistent Donate button + mobile hamburger.

- **Logo (link → `../index.html`):** image + text "Coodu Trust"
  - Logo image (REAL, Cloudinary): `coodu_frontlogo.png` — alt "Coodu Trust Logo"
- **Top-level nav links:**
  - Home → `../index.html`
  - About → `../about.html`
  - **Programs → `../programs.html`** (marked `active` on this page; dropdown parent)
  - Get Involved → `../get-involved.html` (dropdown)
  - Documents → `../documents.html`
  - Media → `../media.html`
  - Contact → `../contact.html`
- **Programs dropdown** — 6 categories, each with its own submenu:
  1. **Environment and Resilience** → `environment-resilience.html` → Watershed Management, Plantation & Afforestation, Water Resource Management, Soil & Land Management, Biodiversity Conservation, Climate Change Adaptation & Mitigation
  2. **Sustainable Agriculture** → `sustainable-agriculture.html` → Farmer Collectivization & Agribusiness, Livestock & Allied Activities, Horticulture & Diversified Farming, Agricultural Technology & Youth Engagement, Organic Farming Practices
  3. **Women Empowerment** → `women-empowerment.html` (THIS PAGE) → Social Empowerment & Leadership, Microfinance & Financial Inclusion, Entrepreneurship & Enterprise Development, SHG & Community Mobilization
  4. **Education and Skilling** → `education-skilling.html` → Vocational & Livelihood Training, Digital Literacy & IT Training, Formal & Higher Education Support, School Infrastructure Development
  5. **Health, Sanitation & Waste Management** → `health-sanitation.html` → Health Support & Rehabilitation, Community Health Services, Disease-Specific Interventions, Water Quality & Safety, Sanitation & Hygiene Infrastructure, Solid Waste Management
  6. **Consultancy and HR Management** → `consultancy-hr.html` → Technology & Knowledge Dissemination, Strategic Planning & Advisory Services, Human Resource & Staffing Solutions
- **Get Involved dropdown:** Partner with Us → `../partner.html`; Volunteer → `../volunteer.html`; Donate → `../donate.html`
- **Donate button** (`btn btn-primary donate-button`) → `../donate.html`, text: "Donate"
- **Hamburger** menu (3 bars) for mobile.

---

### 2. Page Header / Hero Banner (`<section class="page-header">`)
**Purpose:** Page title hero with background image and breadcrumb. Component: hero band with background image (inline style).

- **Background image (REAL, Cloudinary):** `background-prgms/women-empowerment.png` (set via inline `background-image`)
- **Breadcrumb:** `Programs` (link → `../programs.html`) `>` `Women Empowerment` (current, plain span)
- **H1 page title:** `Women Empowerment`
- **Subtitle:** `Empowering women as catalysts of social and economic transformation`

---

### 3. Sector Overview (`<section class="sector-overview section-padding">`)
**Purpose:** Two-column intro — descriptive copy + stat highlights on the left, image on the right. Components: section title, body paragraphs, 4 stat/highlight items, photo.

- **H2 section title:** `Creating Sustainable Change Through Women`
- **Paragraph 1 (full copy):**
  > "Women empowerment is at the heart of sustainable development and social transformation. Our comprehensive Women Empowerment program recognizes women as key agents of change in their families and communities. Through systematic interventions in social empowerment, financial inclusion, entrepreneurship development, and community mobilization, we create pathways for women to achieve economic independence, social recognition, and leadership roles."
- **Paragraph 2 (full copy):**
  > "Our approach encompasses forming and strengthening Self-Help Groups (SHGs), providing microfinance services, developing entrepreneurial skills, and building leadership capacities. We focus on creating sustainable livelihood opportunities, improving access to credit and financial services, and fostering women's participation in decision-making processes at household and community levels. Our programs have consistently demonstrated that empowered women contribute significantly to poverty reduction, education improvements, and overall community development."
- **Stat highlights** (`sector-highlights`, 4 items — number + label):
  | Number | Label |
  |--------|-------|
  | 5,000+ | Women Empowered |
  | 450+ | SHGs Formed |
  | 800+ | Enterprises Created |
  | 300% | Income Increase |
- **Overview image (REAL, Cloudinary):** `program-women-empowerment.jpg` — alt "Women empowerment and leadership development activities" (class `story-photo`)

---

### 4. Program Focus Areas (`<section class="focus-areas section-padding light-bg">`)
**Purpose:** The 4 sub-program cards — the primary navigation hub into detail pages. Component: 4-card grid (`focus-grid`), each card = emoji icon + title + description + "Explore →" link.

- **H2 section title:** `Our Focus Areas`
- **Card 1 — icon 👥**
  - Title: `Social Empowerment & Leadership`
  - Description: "Building women's confidence, leadership skills, and social recognition through capacity building programs, leadership training, and community participation initiatives."
  - Link: "Explore →" → `social-empowerment-leadership.html`
- **Card 2 — icon 💰**
  - Title: `Microfinance & Financial Inclusion`
  - Description: "Providing access to financial services, credit facilities, and savings programs to enable women's economic participation and financial independence."
  - Link: "Explore →" → `microfinance-financial-inclusion.html`
- **Card 3 — icon 🚀**
  - Title: `Entrepreneurship & Enterprise Development`
  - Description: "Supporting women entrepreneurs through business development training, market linkages, and enterprise support for sustainable livelihood creation."
  - Link: "Explore →" → `entrepreneurship-enterprise-development.html`
- **Card 4 — icon 🤝**
  - Title: `SHG & Community Mobilization`
  - Description: "Organizing women into Self-Help Groups and community-based organizations for collective action, mutual support, and community development initiatives."
  - Link: "Explore →" → `shg-community-mobilization.html`

---

### 5. Impact Stories (`<section class="impact-stories section-padding">`)
**Purpose:** Showcase outcomes/impact themes. Component: 6-card grid (`impact-grid`), each card = emoji icon + title + description. (No links — informational cards only.)

- **H2 section title:** `Women Empowerment Impact`
- **Card 1 — icon 💪 — `Leadership Development`:** "Over 2,000 women have emerged as community leaders, taking up key positions in local governance, SHGs, and development committees, driving positive change in their communities."
- **Card 2 — icon 💼 — `Economic Independence`:** "800+ women-led micro-enterprises have been established, generating sustainable income and creating employment opportunities for other women in their communities."
- **Card 3 — icon 🏦 — `Financial Inclusion`:** "450+ SHGs have mobilized savings exceeding ₹50 lakhs, providing women access to credit and financial services for personal and business needs."
- **Card 4 — icon 🌱 — `Social Transformation`:** "Empowered women have become change agents in their families and communities, improving education, health, and overall quality of life for future generations."
- **Card 5 — icon 🤝 — `Community Solidarity`:** "Strong women's collectives have been formed, creating support networks that address social issues, promote gender equality, and advocate for women's rights."
- **Card 6 — icon 🎯 — `Sustainable Development`:** "Women's active participation in development programs has led to more inclusive and sustainable outcomes, benefiting entire communities and future generations."

**Embedded data points worth preserving:** 2,000+ women community leaders · 800+ women-led micro-enterprises · 450+ SHGs · savings exceeding ₹50 lakhs.

---

### 6. Call to Action (`<section class="sector-cta section-padding light-bg">`)
**Purpose:** Conversion band — partner/donate. Component: centered CTA content with title, text, two buttons.

- **H2 CTA title:** `Join Our Women Empowerment Mission`
- **CTA text:** "Partner with us to empower women and create lasting social transformation. Your support can help us reach more women, strengthen communities, and build a more equitable society where every woman can thrive and lead."
- **Buttons:**
  - "Partner with Us" (`btn btn-primary`) → `../partner.html`
  - "Support Our Work" (`btn btn-secondary`) → `../donate.html`

---

### 7. Footer (`<footer class="footer">`)
**Purpose:** Site-wide footer (shared component). Component: 4-column grid + bottom copyright bar.

- **Col 1 — Brand:**
  - Footer logo (REAL, Cloudinary): `logos/logo-white.png` — alt "Coodu Trust White Logo"
  - About text: "Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000."
- **Col 2 — Quick Links (heading "Quick Links"):** About Us → `../about.html`; Our Programs → `../programs.html`; Careers → `../careers.html`; Donate → `../donate.html`
- **Col 3 — Contact Us (heading "Contact Us", `<address>`):**
  - Address: "H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India."
  - Email: `director@coodutrust.org` (mailto link)
  - Phone: `+91-451-2461362` (tel link `tel:+914512461362`)
- **Col 4 — Follow Us (heading "Follow Us"):** social icon links — Facebook, Twitter, Instagram (all `href="#"` placeholders, no real URLs; icons are REAL Cloudinary images `facebook.png`, `twitter.png`, `instagram.png`)
- **Footer bottom:** "© 2025 Coodu Trust. All Rights Reserved."

---

## COMPONENTS PRESENT (summary)
- **Hero banner** with background image + breadcrumb + title + subtitle (Section 2).
- **Two-column overview** (text + image) with inline **stat highlights** (4 number/label pairs) (Section 3).
- **Feature/Program cards** — 4-card grid with icon, title, description, "Explore →" deep links (Section 4). These are the navigational core.
- **Impact cards** — 6-card grid, icon + title + description, no links (Section 5).
- **CTA band** — title + paragraph + 2 buttons (Section 6).
- **Multi-level dropdown navigation** (header) and **4-column footer**.
- **NOT present:** no forms, no tables, no carousels/sliders, no testimonials (impact cards are statements, not attributed quotes), no video.

---

## INTERNAL LINK / NAVIGATION TARGETS (this page's content links, excluding shared header/footer nav)
- Breadcrumb → `../programs.html`
- Focus Card 1 → `social-empowerment-leadership.html`
- Focus Card 2 → `microfinance-financial-inclusion.html`
- Focus Card 3 → `entrepreneurship-enterprise-development.html`
- Focus Card 4 → `shg-community-mobilization.html`
- CTA → `../partner.html` and `../donate.html`

**Key:** The 4 Focus Area cards are the only outbound paths to this pillar's detail pages; the redesign MUST keep all four routes intact (these are the sub-program entry points).

---

## IMAGES INVENTORY (real vs placeholder)
| Image | Location | Status | Subject / alt |
|-------|----------|--------|---------------|
| `coodu_frontlogo.png` | Header logo | REAL (Cloudinary) | Coodu Trust logo |
| `background-prgms/women-empowerment.png` | Hero background (inline style) | REAL (Cloudinary) | Women empowerment hero backdrop |
| `program-women-empowerment.jpg` | Overview right column | REAL (Cloudinary) | "Women empowerment and leadership development activities" |
| `logo-white.png` | Footer logo | REAL (Cloudinary) | Coodu Trust white logo |
| `facebook.png` / `twitter.png` / `instagram.png` | Footer social | REAL icon images, but **links are `#` placeholders** | Social media icons (no destination URLs) |

- **All section emoji "icons" are Unicode emoji, not image files:** 👥 💰 🚀 🤝 (focus) and 💪 💼 🏦 🌱 🤝 🎯 (impact). Preserve their meaning if swapping to an icon set.
- No broken/missing `<img>` tags detected; all image sources point to Cloudinary CDN. (Note: rendering depends on those Cloudinary assets remaining available.)

---

## CONTENT THAT MUST CARRY INTO THE REDESIGN (priority checklist)
1. Page identity: H1 "Women Empowerment" + subtitle "Empowering women as catalysts of social and economic transformation".
2. Overview H2 "Creating Sustainable Change Through Women" + both full paragraphs.
3. The 4 headline stats: 5,000+ Women Empowered / 450+ SHGs Formed / 800+ Enterprises Created / 300% Income Increase.
4. The 4 Focus Area cards (titles + descriptions + the 4 deep links).
5. The 6 Impact cards (titles + descriptions, incl. embedded figures: 2,000+ leaders, 800+ enterprises, 450+ SHGs, ₹50 lakhs savings).
6. CTA: "Join Our Women Empowerment Mission" + paragraph + "Partner with Us" / "Support Our Work" buttons.
7. Footer contact details (Dindigul address, director@coodutrust.org, +91-451-2461362), "since 2000" / "© 2025" lines.

**Consistency notes for redesign:** "800+" enterprises and "450+" SHGs appear in BOTH the overview stats and the impact cards — keep these numbers consistent. Social links are placeholders (`#`) and should ideally be given real URLs during redesign.
