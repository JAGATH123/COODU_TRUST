# Build Spec — Program / Sector Page TEMPLATE

> **This is the build contract.** Rebuild target = clean semantic HTML5 + a shared design-system CSS (tokens + component classes), **zero inline `style=` attributes, no CSS-overlay hack.**
>
> **Design sources reconciled (read in full):**
> 1. `About page content/Program Template - COODU Trust.dc.html` — the purpose-built, fully-responsive template (renderVals breakpoint engine, separate stats band, "Our approach" list, hero stat-tease, trust line). **Canonical for STRUCTURE & responsive behavior.** Renders as `design/redesign-renders/program-1280.png` + `program-390.png`.
> 2. `NGO Website Design Enhancement/COODU Trust Redesign.dc.html` Frames 5 (desktop) + 6 (mobile) — the pilot Women Empowerment screens. Renders as `redesign-women-empowerment-desktop-.png` + `-mobile-.png`.
> 3. `COODU Trust Redesign.dc.html` Frame 7 (Design tokens) — **the authoritative Style Gate in code.** Token names + hex come from here.
> 4. Content source of truth: `design/page-docs/06-program-template.md`.
>
> **Reconciliation rule applied throughout:** structure/responsive logic from source 1; token values (colors, fonts, type scale, spacing, radii, shadows) from source 3 (Frame 7). Where the two pilots diverge, the chosen value is stated and the rejected one noted.

---

## 1. Purpose & coverage

**Role:** Explain ONE program/sector credibly — what it is (overview), the proof (stats), the routes deeper (sub-programs or concrete projects), the outcomes (impact themes), and one conversion ask (Partner / Donate).

**Coverage:** ONE template governs **all 36 program pages** under `/programs/`. Two interchangeable middle blocks:

- **Variant A — Sector Hub** (e.g. `women-empowerment.html`, `health-sanitation.html`, `education-skilling.html`, `consultancy-hr.html`): middle block is a grid of **Focus-Area cards** that deep-link to sub-program pages. The Women Empowerment page (the design subject) is Variant A.
- **Variant B — Sub-Program / Leaf** (~28 pages, e.g. `social-empowerment-leadership.html`): middle block is a grid of dated **Project cards** linking to `/programs/projects/*.html`; overview also carries a `component-list` ("Key Components of…").
- Two hubs (`sustainable-agriculture.html`, `environment-resilience.html`) carry BOTH a focus grid AND a project grid. Two legacy outliers (`environment-climate.html`, `natural-resources.html`) reconcile to Variant B.

**Document order (every page):** Header (shared chrome) → **Hero banner** → **Stats band** → **Overview** (2-col + "Our approach" list) → **Middle block** (Focus grid [A] or Projects grid [B]) → **Impact** themes → **CTA** band → Footer (shared chrome).

---

## 2. Section-by-section layout — per breakpoint

**Breakpoints (Style Gate, Frame 7):** `600 / 900 / 1200`. The canvas previews simulated devices at 768/1025; the rebuild uses the canonical 600/900/1200. Container `--maxw 1140px` centered; text measure `--maxw-text 720px`; gutters `clamp(20px,5vw,40px)`; section padding `--sec-pad: clamp(56px,8vw,96px)` (compact density option = `clamp(40px,5.5vw,68px)`).

### 2.0 Hero banner — `<section class="page-hero">`
- **WEB ≥1200:** full-bleed; `min-height: clamp(360px,38vw,420px)`; `display:flex; align-items:flex-end`. Background = photo (`object-fit:cover`) + fixed green→dark gradient overlay. Content in `.container` (max 1140) bottom-left, padding `48px 40px`: breadcrumb → H1 → subtitle (max 560px) → **stat-tease row** (3 dotted items). Reading order top→bottom, left-aligned.
- **TABLET 600–1199:** `min-height: clamp(300px,40vw,340px)`; padding tightens to `clamp(28px,4vw,40px) clamp(20px,5vw,40px)`. Same left-aligned stack. Stat-tease wraps.
- **MOBILE <600:** auto-height with `padding:26px 20px 28px` (banner crops short ~220–260px effective); H1 ~31px; subtitle 15.5px; breadcrumb 12px; stat-tease may hide or wrap to 2 lines. Overlay strengthened (left stop ≥.86 alpha) so white text passes 4.5:1.

### 2.1 Stats band — `<section class="stats-band">`
- **WEB ≥1200:** banded (`--surface-alt #f6f8f6`, 1px bottom border `#e9eee9`), padding `clamp(32px,4.2vw,50px) 0`; inner max 1080px; **4 stats in one row** `grid-template-columns:repeat(4,1fr)`, gap `clamp(20px,2.4vw,30px)`, centered. Big number + small-caps label. Numbers count up on scroll-in.
- **TABLET 900–1199:** still **4-up**. **600–899:** drop to **2×2** (`repeat(2,1fr)`).
- **MOBILE <600:** **2×2** grid, gap ~20px. Number stays prominent (`clamp(1.9rem,3.4vw,2.9rem)`), label ≥12px.

> *Alternative seen in the redesign pilot:* stats embedded as a 4-col row INSIDE the overview text column + a floating "300% Avg. income rise" badge on the photo. **Rejected as primary** per content-doc §5.2 ("promote the stats out of a cramped 4-up into a dedicated high-contrast band, reuse home/about stat component"). Keep the dedicated band. The floating badge is an optional flourish, not required.

### 2.2 Overview — `<section class="sector-overview section">`
- **WEB ≥1200:** 2-column grid `grid-template-columns:1.4fr 1fr` (text 7 / image 5), gap `clamp(32px,4vw,56px)`, `align-items:center`. Left = eyebrow + H2 (max 18ch) + two paragraphs (max `62ch`) + **"Our approach" list** (2×2, check-circle icons). Right = image `aspect-ratio:4/3`, radius 16, shadow.
- **TABLET 900–1199:** keep 2-col but image column narrows (`1.2fr 1fr`); approach list stays 2×2.
- **TABLET 600–899 & MOBILE <600:** **stack to single column** (`1fr`) — order: eyebrow → H2 → paragraphs → approach list (1-col on mobile) → **image full-width below**. Mobile image `aspect-ratio:16/10`. Paragraphs 15.5–16px, lh 1.6, sentence case.

### 2.3 Middle block A — Focus areas — `<section class="focus-areas section surface-alt">`
- **WEB ≥1200:** centered eyebrow ("Go deeper" / "Our focus areas") + H2; grid `repeat(2,1fr)` (4 cards = clean 2×2), gap `clamp(18px,2vw,26px)`, equal-height cards. Card icon-top vertical (canonical, per `program-1280`) OR icon-left horizontal (redesign pilot) — **use icon-top vertical**; cards hover-lift.
- **TABLET 600–1199:** **2-up** (`repeat(2,1fr)`), gap 20–24px.
- **MOBILE <600:** **1-up** stacked full-width; tap target ≥44px; "Explore →" visible per card.

> *Variant B swap:* replace `.focus-areas` with `<section class="projects-section section surface-alt">` — same heading pattern, grid of **project cards** (media-top). Desktop 3-up if 3+ projects else 2-up; tablet 2-up; mobile 1-up.

### 2.4 Impact — `<section class="impact section">`
- **WEB ≥1200:** centered eyebrow ("Proof of results" / "Our impact") + H2; grid `repeat(3,1fr)` (6 cards = 3×2), gap `clamp(16px,1.8vw,22px)`. Quiet/flat tiles, no link.
- **TABLET 600–1199:** **2-up** (`repeat(2,1fr)`).
- **MOBILE <600:** **1-up** stacked; icon-left + title row, then text.

### 2.5 CTA — `<section class="cta-band">`
- **WEB ≥1200:** full-bleed green gradient; centered content max 740px; eyebrow → H2 → text (max 600px) → two buttons **inline** (gap 14px) → trust line. 
- **TABLET 600–1199:** same, buttons inline (may wrap), keep ≥44px height.
- **MOBILE <600:** stacked — H2 → text → two **full-width buttons stacked** (`flex-direction:column`, Partner above Support), gap 11–12px, `min-height:48px`.

---

## 3. Components (token-referenced, exact values)

### 3.0 Design tokens (`tokens.css`) — from Frame 7 (authoritative Style Gate)
```css
:root{
  /* color */
  --primary:#1e7e34;        /* brand green — headings accents, focus icons, links */
  --primary-dark:#155d27;   /* hover/active green, gradient mid */
  --deep:#11371b;           /* footer + hero gradient end */
  --dark-band:#161d18;      /* dark info bands */
  --amber:#f4a300;          /* support accent (the 300% stat, eyebrow on dark) */
  --amber-text:#c47f00;     /* amber when used as text on light */
  --accent:#e8590c;         /* DONATE only (Support Our Work, header Donate) */
  --surface:#ffffff;
  --surface-alt:#f6f8f6;    /* banded sections, quiet impact tiles */
  --border:#e2e8e2;
  --text-strong:#1a1f1a;    /* H1–H3 on light */
  --text-body:#3d433d;      /* paragraphs */
  --text-muted:#6b726b;     /* labels, captions */
  /* type */
  --font-display:'Oswald',sans-serif;   /* headings + UPPERCASE labels, 600/700 */
  --font-body:'Source Sans 3',system-ui,sans-serif; /* body, 400/600, sentence case */
  /* type scale  (desktop / mobile) */
  --fs-h1:48px;  --fs-h1-m:32px;
  --fs-h2:34px;  --fs-h2-m:26px;
  --fs-h3:24px;  --fs-h3-m:20px;
  --fs-body:17px;--fs-body-m:16px;
  --fs-small:14px;
  /* space scale */
  --s1:8px; --s2:16px; --s3:24px; --s4:32px; --s5:48px; --s6:64px; --sec:96px;
  --sec-pad:clamp(56px,8vw,96px);
  /* shape */
  --r-btn:8px; --r-card:14px; --r-pill:999px;
  --maxw:1140px; --maxw-text:720px;
  /* shadow + motion */
  --shadow-1:0 2px 8px rgba(0,0,0,.06);    /* rest */
  --shadow-2:0 10px 26px rgba(0,0,0,.10);  /* hover */
  --ease:cubic-bezier(.22,.61,.36,1); --dur:180ms;
}
```
> **Font reconciliation:** body font = **Source Sans 3** (Frame 7 Style Gate + redesign pilot). The Program Template canvas file used Inter — **do not use Inter**; tokens win. Headings = Oswald 600 (title-case), labels = Oswald uppercase `.04–.16em`. ≤2 Google Fonts.
> **Type reconciliation:** Frame 7 gives H1 48/32, H2 34/26, H3 24/20. The Program Template canvas used Oswald 600 `clamp(2rem,4.8vw,3.3rem)` H1 and weight 600 throughout — match the clamp ranges but cap at the Frame-7 scale.

### 3.1 `.page-hero`
- Full-bleed; `min-height:clamp(360px,38vw,420px)` (≥1200), tablet `clamp(300px,40vw,340px)`, mobile auto.
- Layers (bottom→top): photo `<img class="page-hero__bg" object-fit:cover>`; **gradient overlay** `linear-gradient(120deg, rgba(13,46,22,.86) 0%, rgba(15,61,27,.6) 48%, rgba(11,38,20,.3) 100%)` (template values; redesign used the 90deg `.86→.25` variant — either passes contrast; use the 120deg). Solid fallback bg `--deep`.
- Breadcrumb (`.breadcrumb`): Source Sans 3 12–13px, weight 600, `letter-spacing:.04em`; links `rgba(255,255,255,.82)` → `#fff` hover; current item `#f6c453` (amber) or `#fff`; separator `›`/chevron-right `rgba(255,255,255,.6)`.
- H1 (`.page-hero__title`): Oswald 600, `clamp(2rem,4.8vw,3rem)`, line-height 1.07–1.08, `#fff`, margin-top 14px.
- Subtitle: Source Sans 3 `clamp(15px,1.7vw,1.18rem)`, lh 1.55, `rgba(255,255,255,.9)`, max 560px.
- **Stat-tease row** (hubs): 3 items, Source Sans 3 13.5px weight 500 `rgba(255,255,255,.92)`, each prefixed with a 6px dot `#7ed09a`; content e.g. "5,000+ women · 450+ SHGs · Since 2000". Margin-top 18px, `flex-wrap`.

### 3.2 `.stats-band` / `.stat`
- Band: `background:var(--surface-alt)`, `border-bottom:1px solid #e9eee9`, padding `clamp(32px,4.2vw,50px) 0`; inner max 1080px.
- `.stat__num`: Oswald 600, `clamp(1.9rem,3.4vw,2.9rem)`, line-height 1, `color:var(--primary)`; the income-rise stat may use `--amber` (`#f4a300`) per redesign. `data-count-to` + `data-count-suffix` for count-up.
- `.stat__label`: Source Sans 3/Oswald 600, 12px, `letter-spacing:.06em`, `text-transform:uppercase`, `color:#6f7d75`, margin-top 10px.

### 3.3 `.sector-overview`
- Eyebrow (`.eyebrow`): 22×2px bar `var(--primary)` + Oswald/Source 600 12.5px `letter-spacing:.16em` uppercase `var(--primary)`. (Centered variant adds a second bar on the right for Focus/Impact section headers.)
- H2 (`.section-title`): Oswald 600 `clamp(1.7rem,3.2vw,2.4rem)`, lh 1.14, `var(--text-strong)`, max 18ch.
- Paragraph (`.overview-text p`): Source Sans 3 `clamp(15px,1.1vw,16.5px)`, lh 1.6–1.75, `var(--text-body)`, max `62ch`.
- "Our approach" list (`.approach-list`): label Oswald 600 12.5px `.06em` uppercase `#15602a`; items in 2-col grid (1-col mobile), each = lucide `check-circle-2` `var(--primary)` + 14.5px `var(--text-body)`.
- Image (`.overview-image`): `aspect-ratio:4/3`, `border-radius:16px`, `box-shadow:0 18px 44px rgba(16,40,24,.14)`, bg `#eef3ee`.

### 3.4 `.card` (ONE block, THREE modifiers)
Base: `background:var(--surface)`, `border:1px solid #e4ebe5`, `border-radius:16px`, `box-shadow:var(--shadow-1)`.
- **`.card--action`** (Focus area) — `<a>`, `display:flex; flex-direction:column`, padding `clamp(24px,2.6vw,32px)`. Icon chip 54×54, radius 14, `background:rgba(30,126,52,.10)`, `color:var(--primary)`, lucide icon. H3 Oswald 600 `clamp(1.18rem,1.6vw,1.4rem)` `var(--text-strong)`. Desc Source Sans 3 14.5px lh 1.64 `#55635b`. Footer "Explore →" Source/Oswald 600 14px `var(--primary)`. **Hover:** `translateY(-6px)`, `box-shadow:0 24px 52px rgba(16,40,24,.14)`, border `#cfe0d4`, link gap widens + color `var(--primary-dark)`. **Focus-visible:** `outline:3px solid rgba(30,126,52,.4); outline-offset:3px`.
- **`.card--project`** (Variant B leaf) — media-top `<img aspect-ratio:16/9>` + period pill + impact pill (`.pill`, radius 999) → H3 → 2-line clamped summary (`-webkit-line-clamp:2`) → focus-area tag chips (`.tag`, radius 999, surface-alt) → "View Details →". Same hover-lift as `--action`.
- **`.card--quiet`** (Impact) — `<div>` (NO link), `background:var(--surface-alt)`, `border:1px solid #eef2ee`, radius 14, padding `clamp(22px,2.2vw,28px)`. Icon chip 40–48, radius 11–12, `background:#fff`, `border:1px solid #e4ebe5`, `color:var(--primary)`, `box-shadow:var(--shadow-1)`. H3 Oswald 600 ~1.12rem (19px). Desc 14–14.5px lh 1.62 `#55635b`; embedded figures wrapped in `<strong style→ class>` `color:var(--text-strong)`. **No hover lift** (read-only, visually subordinate).

### 3.5 `.cta-band` + `.btn`
- Band: `background:linear-gradient(135deg,#1e7e34 0%,#155d27 55%,#0f3d1b 100%)`; content max 740px centered; eyebrow "Join the mission" `--amber #f6c453`; H2 Oswald 600 `clamp(1.8rem,3.6vw,2.6rem)` `#fff`; text `rgba(255,255,255,.88)` max 600px; trust line shield-check + 12.5px `rgba(255,255,255,.78)`.
- **`.btn--cta-primary`** ("Partner with Us"): `background:#fff`, `color:var(--primary-dark)`, padding `15px 32px`, `border-radius:9px`, `box-shadow:0 8px 22px rgba(0,0,0,.16)`; hover `#f0f5f0` + `translateY(-2px)`.
- **`.btn--cta-donate`** ("Support Our Work"): `background:var(--accent) #e8590c`, `color:#fff`, same metrics, `box-shadow:0 8px 22px rgba(232,89,12,.32)`; hover `#c4470a`.
- Both: focus-visible `outline:3px solid rgba(255,255,255,.75); outline-offset:3px`; min touch ≥44px (mobile 48px).
- General `.btn` (header/other): radius `--r-btn 8px`, Oswald 600 uppercase `.04–.05em` ~14–15px, `min-height:44px`.

### 3.6 Shared chrome (reference only — DO NOT restyle here)
- `.site-header`: logo (sprout icon chip `--primary`) + wordmark "COODU TRUST" / "Dindigul · Tamil Nadu"; nav (Oswald uppercase 14px) Home/About/**Programs**(active, amber underline + chevron)/Get Involved/Documents/Media/Contact; persistent **Donate** btn `--accent` with heart icon; mobile hamburger.
- `.site-footer`: deep `#11371b`, 4-col grid (brand/about · Quick Links · Contact `<address>` · social), `.footer-bottom` copyright. Use the chrome doc; this template only places `<header>`/`<footer>` slots.

---

## 4. Content to populate (Women Empowerment = the worked example; PRESERVE verbatim)

- **Title:** `Women Empowerment | Coodu Trust` · **Meta:** "Empowering women through social empowerment, microfinance, entrepreneurship development, and self-help group mobilization for sustainable community development."
- **Breadcrumb:** `Programs` (→ `../programs.html`) › `Women Empowerment`
- **H1:** Women Empowerment · **Subtitle:** "Empowering women as catalysts of social and economic transformation"
- **Hero stat-tease:** 5,000+ women · 450+ SHGs · Since 2000

**Stats band (4 — PRESERVE numbers):**
| Number | Label |
|---|---|
| 5,000+ | Women Empowered |
| 450+ | SHGs Formed |
| 800+ | Enterprises Created |
| 300% | Income Increase *(may render in --amber)* |

**Overview — H2 "Creating Sustainable Change Through Women"** (eyebrow "Overview"/"Program overview"):
- Para 1 (verbatim): "Women empowerment is at the heart of sustainable development and social transformation. Our comprehensive Women Empowerment program recognizes women as key agents of change in their families and communities. Through systematic interventions in social empowerment, financial inclusion, entrepreneurship development, and community mobilization, we create pathways for women to achieve economic independence, social recognition, and leadership roles."
- Para 2 (verbatim): "Our approach encompasses forming and strengthening Self-Help Groups (SHGs), providing microfinance services, developing entrepreneurial skills, and building leadership capacities. We focus on creating sustainable livelihood opportunities, improving access to credit and financial services, and fostering women's participation in decision-making processes at household and community levels. Our programs have consistently demonstrated that empowered women contribute significantly to poverty reduction, education improvements, and overall community development."
- **Our approach (4 items):** Forming & strengthening Self-Help Groups · Providing microfinance & credit access · Developing entrepreneurial skills · Building leadership capacities.

**Focus-Area cards (4 — title · desc · deep link · icon):**
1. **Social Empowerment & Leadership** — "Building women's confidence, leadership skills, and social recognition through capacity building programs, leadership training, and community participation initiatives." → `social-empowerment-leadership.html` · icon `users` / `award`
2. **Microfinance & Financial Inclusion** — "Providing access to financial services, credit facilities, and savings programs to enable women's economic participation and financial independence." → `microfinance-financial-inclusion.html` · icon `piggy-bank`
3. **Entrepreneurship & Enterprise Development** — "Supporting women entrepreneurs through business development training, market linkages, and enterprise support for sustainable livelihood creation." → `entrepreneurship-enterprise-development.html` · icon `rocket` / `store`
4. **SHG & Community Mobilization** — "Organizing women into Self-Help Groups and community-based organizations for collective action, mutual support, and community development initiatives." → `shg-community-mobilization.html` · icon `handshake` / `users-round`

Each card link label: **"Explore →"**.

**Impact tiles (6 — H2 "Women Empowerment Impact", eyebrow "Our impact"/"Proof of results"; read-only, keep embedded figures):**
1. **Leadership Development** (`award`) — "Over **2,000 women** have emerged as community leaders, taking up key positions in local governance, SHGs, and development committees, driving positive change in their communities."
2. **Economic Independence** (`briefcase`/`coins`) — "**800+** women-led micro-enterprises have been established, generating sustainable income and creating employment opportunities for other women in their communities."
3. **Financial Inclusion** (`landmark`) — "**450+ SHGs** have mobilized savings exceeding **₹50 lakhs**, providing women access to credit and financial services for personal and business needs."
4. **Social Transformation** (`sprout`/`sparkles`) — "Empowered women have become change agents in their families and communities, improving education, health, and overall quality of life for future generations."
5. **Community Solidarity** (`users-round`/`heart-handshake`) — "Strong women's collectives have been formed, creating support networks that address social issues, promote gender equality, and advocate for women's rights."
6. **Sustainable Development** (`target`/`leaf`) — "Women's active participation in development programs has led to more inclusive and sustainable outcomes, benefiting entire communities and future generations."

> Numbers must stay consistent across stats band and impact prose: 2,000+ leaders · 800+ enterprises · 450+ SHGs · ₹50 lakhs savings · 5,000+ women · 300%.

**CTA — H2 "Join Our Women Empowerment Mission"** (eyebrow "Join the mission"):
- Text (verbatim): "Partner with us to empower women and create lasting social transformation. Your support can help us reach more women, strengthen communities, and build a more equitable society where every woman can thrive and lead."
- Buttons: **Partner with Us** → `../partner.html` (primary white) · **Support Our Work** → `../donate.html` (accent `#e8590c`).
- Trust line: "Registered non-profit · Dindigul · since 2000".

**Variant-B (leaf) extra content to preserve:** overview H3 "Key Components of …:" + `component-list` of `<strong>Label:</strong> text`; project cards = title + period (e.g. "2002-2003") + image + impact-number/label + description + "Focus Areas: …" (render as tag chips) + **"View Details →"** → `projects/*.html`.

**Footer/contact (shared):** "…since 2000." · H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India · director@coodutrust.org · +91-451-2461362 (`tel:+914512461362`) · © 2025 Coodu Trust. All Rights Reserved.

---

## 5. Image slots (aspect ratio + subject)

| Slot | Ratio | Subject / alt | Notes |
|---|---|---|---|
| Hero background | ~3:1 banner crop (covers `min-height`) | Women leaders / SHG meeting / fieldwork — warm natural light | `object-fit:cover`; fixed green→dark gradient overlay on top; sized Cloudinary transform, NOT full-res; `loading="eager"` (above fold) |
| Overview image | **4:3** desktop (4:5 portrait acceptable per redesign) / **16:10** mobile | "Women empowerment and leadership development activities" | radius 16, shadow `0 18px 44px rgba(16,40,24,.14)`; `loading="lazy"` |
| Project card media (Variant B) | **16:9** | The specific project's field photo | radius top corners; media-top; `loading="lazy"` |

> Optional overview flourish (redesign): floating "300% · Avg. income rise" badge card over the photo (white, radius 14, shadow, trending-up icon in `#fdebd6`/`#e8590c`). Not required.
> Replace every canvas `image-slot` / placeholder with a real `<img>` carrying explicit `width`/`height` (to reserve space / avoid CLS), `decoding="async"`, and a meaningful `alt`.

---

## 6. Interactions & motion

- **Scroll reveal** (`[data-reveal]`): start `opacity:0; translateY(22px)` → `data-in` removes; `transition:.7s var(--ease)`. IntersectionObserver `rootMargin:0px 0px -8% 0px`, `threshold:.04`; per-element stagger via `data-stagger` (focus 0/90/180/270ms; impact 0/70/140/210/280/350ms). Safety timeout 2800ms force-shows all.
- **Stat count-up** (`[data-count-to]` + `data-count-suffix`): animates 0→value on 50%-visible; duration 1400ms; ease `1-(1-x)^3`; `toLocaleString('en-US')` (renders "5,000+", "300%"). Only when motion on.
- **Hero zoom** (optional): `@keyframes heroZoom scale(1)→scale(1.09)` `22s ease-in-out infinite alternate`. Disabled when motion off / reduced.
- **Card hover** (`.card--action`, `.card--project`): `translateY(-6px)` (redesign used -3px), `--shadow-2`→stronger, border lightens; ~180–280ms `var(--ease)`. "Explore/View Details →" arrow gap widens + color → `--primary-dark`.
- **Button hover:** `translateY(-1…-2px)`, bg darken (primary→`#155d27`, donate→`#c4470a`/`#c2410c`), shadow grows.
- **`::selection`:** `rgba(30,126,52,.18)`.
- **No carousel/drawer/lightbox** on this template (the program page has none); the testimonial carousel lives on Home, the nav drawer is shared chrome.

### Accessibility
- **Landmarks:** `<header>` (chrome), `<main>` wrapping all page sections, `<footer>` (chrome). Each `<section>` gets `aria-labelledby` pointing at its H2; CTA + hero too.
- **Headings:** exactly one `<h1>` (the hero title); sections use `<h2>`; cards `<h3>`. No skipped levels.
- **Breadcrumb:** `<nav aria-label="Breadcrumb">` with ordered list; current item `aria-current="page"`.
- **Contrast:** white H1/subtitle over the green→dark overlay must pass 4.5:1 — the left gradient stop is ≥`.86` alpha precisely for this; never ship hero text without the overlay. Body text `#3d433d` on white passes; small uppercase labels only (`--text-muted`/`#6f7d75`).
- **Targets:** all buttons + card links ≥44px (CTA mobile 48px).
- **Icons:** Lucide line set, single color (`--primary` in chips), `stroke-width:1.75–1.8`; decorative icons `aria-hidden="true"`; replace ALL emoji.
- **Focus-visible:** green ring `3px rgba(30,126,52,.4)` offset 3px on light; white ring `rgba(255,255,255,.75)` on the green CTA band. Never remove outlines without a replacement.
- **Reduced motion:** `@media (prefers-reduced-motion:reduce){ [data-reveal]{opacity:1!important;transform:none!important} *{animation:none!important} }`; count-up + hero zoom skipped.

---

## 7. Build notes

**Semantic skeleton (Variant A shown; Variant B swaps §4 the focus section for a projects section):**
```html
<header class="site-header">…shared chrome…</header>
<main>
  <section class="page-hero" aria-labelledby="page-h1">
    <img class="page-hero__bg" alt="…SHG meeting…">
    <div class="page-hero__overlay" aria-hidden="true"></div>
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol>…</ol></nav>
      <h1 id="page-h1" class="page-hero__title">Women Empowerment</h1>
      <p class="page-hero__subtitle">…</p>
      <ul class="page-hero__stat-tease">…</ul>
    </div>
  </section>

  <section class="stats-band" aria-label="Program impact at a glance">
    <div class="container stats-grid">
      <div class="stat"><span class="stat__num" data-count-to="5000" data-count-suffix="+">5,000+</span><span class="stat__label">Women empowered</span></div>
      …×4
    </div>
  </section>

  <section class="sector-overview section" aria-labelledby="ov-h2">
    <div class="container overview-grid">
      <div class="overview-text">
        <p class="eyebrow">Overview</p>
        <h2 id="ov-h2" class="section-title">Creating Sustainable Change Through Women</h2>
        <p>…para1…</p><p>…para2…</p>
        <div class="approach-list">…check items…</div>
      </div>
      <figure class="overview-image"><img alt="Women empowerment and leadership development activities"></figure>
    </div>
  </section>

  <section class="focus-areas section surface-alt" aria-labelledby="fa-h2">   <!-- Variant A -->
    <div class="container">
      <header class="section-head"><p class="eyebrow eyebrow--center">Go deeper</p><h2 id="fa-h2" class="section-title">Our Focus Areas</h2></header>
      <div class="card-grid card-grid--focus">
        <a class="card card--action" href="social-empowerment-leadership.html">…</a>
        …×4
      </div>
    </div>
  </section>

  <section class="impact section" aria-labelledby="im-h2">
    <div class="container">
      <header class="section-head"><p class="eyebrow eyebrow--center">Proof of results</p><h2 id="im-h2" class="section-title">Women Empowerment Impact</h2></header>
      <div class="card-grid card-grid--impact">
        <article class="card card--quiet">…</article> …×6
      </div>
    </div>
  </section>

  <section class="cta-band" aria-labelledby="cta-h2">
    <div class="container cta-content">
      <p class="eyebrow eyebrow--on-dark">Join the mission</p>
      <h2 id="cta-h2" class="cta-title">Join Our Women Empowerment Mission</h2>
      <p class="cta-text">…</p>
      <div class="cta-actions">
        <a class="btn btn--cta-primary" href="../partner.html">Partner with Us</a>
        <a class="btn btn--cta-donate" href="../donate.html">Support Our Work</a>
      </div>
      <p class="cta-trust">Registered non-profit · Dindigul · since 2000</p>
    </div>
  </section>
</main>
<footer class="site-footer">…shared chrome…</footer>
```

**Tricky / important:**
1. **One `.card` block, three modifiers** (`--action` / `--project` / `--quiet`) — do NOT copy three card stylesheets. Actionable cards lift + arrow + pointer; quiet impact tiles are flat (no lift, no link).
2. **Hero background must be a CSS class + real `<img>`, never inline `style="background-image:url()"`** (the AS-IS anti-pattern). The gradient overlay is a separate `aria-hidden` layer or `::after`.
3. **Stats live in a dedicated band**, not crammed under the overview paragraphs. Keep numbers identical to the impact-card prose (de-duplicate intent, not values).
4. **Body font = Source Sans 3** (tokens), NOT Inter. **Headings = Oswald 600 title-case; labels = Oswald UPPERCASE only** (never all-caps body — kills the legacy `text-transform:uppercase` on `<body>`).
5. **Responsive = fluid Grid** (`grid-template-columns` swaps at 900/1200 via media queries or container width), not a frozen `responsive.css` patch. Focus 2-up desktop+tablet / 1-up mobile; impact 3-up / 2-up / 1-up; stats 4-up / 2×2; overview 2-col ≥900 → 1-col below.
6. **Variant A↔B is a single section swap** — same hero/stats/overview/impact/CTA shell; only the middle block (focus-card grid vs project-card grid) changes. Leaf pages add a 3-level breadcrumb + overview `component-list`.
7. **Shared `.site-header` (mega-nav + drawer) and `.site-footer`** come from the chrome doc — render the slots, don't restyle.
8. **Reuse the home/about `.stat` component** for the stats band; reuse the global `.btn` for the CTA (CTA-specific white/donate are modifiers).
9. Replace all canvas `image-slot`/`<sc-for>`/`{{ }}` bindings with static semantic HTML + real `<img>`; the count-up/reveal JS becomes a small progressive-enhancement script gated on `prefers-reduced-motion`.
