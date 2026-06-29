# Build Spec — About (`about.html`)

> **Build contract.** This is the precise, authoritative spec for rebuilding the redesigned **About Coodu Trust** page in clean semantic HTML5 + the shared design-system CSS (tokens + components). It is reverse-engineered from the approved design canvas and the three render images, and reconciled with the project Style Gate.
>
> **Design source (exact truth):** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/About page content/About - COODU Trust.dc.html`
> **Renders (visual truth):** `design/redesign-renders/about-1280.png` · `about-820.png` · `about-390.png`
> **Content source of truth:** `design/page-docs/02-about.md`
> **Tokens / components:** `design/REDESIGN-STYLE-GATE.md` (referenced by name; do not re-define here).
>
> **Hard rules (from Clean-Rebuild Standards §2):** zero `style="…"` attributes, zero page-level `<style>` blocks, one `<h1>`, real landmarks, mobile-first with the three system breakpoints **600 / 900 / 1200**, shared header/footer partials, every hex/px comes from a token. Delete the legacy full-page fixed background photo + white overlay and all `!important` transparent hacks. Sentence-case everything except tiny eyebrow/label text.

---

## 1. Purpose & coverage

- **Governs:** the single public page `about.html` (one-off page, not a template). Nav label "About" gets `.active`; footer Quick Links "About Us" points here.
- **Job:** the credibility / trust-building page. Tells the 20+ year origin story (timeline), states vision/mission/values, introduces leadership, shows funders/partners, and converts at the bottom — so donors and CSR partners believe COODU is real, experienced, accountable.
- **`<title>`:** `About Coodu Trust | Our Story, Mission, and Team`
- **`<meta name="description">`:** `Learn about Coodu Trust's 20+ year journey, our vision for a self-reliant society, and the dedicated team working to make it a reality.` *(Avoid the drifting "24-year" count; use "20+ / since 2000".)*
- **Section order (DOM, top→bottom):** shared header → **(1)** Banner → **(2)** Impact stats (overlapping card) → **(3)** Our Story + timeline → **(4)** Vision & Mission → **(5)** Guiding Values → **(6)** Meet Our Leadership → **(7)** Partners & Recognition → **(8)** CTA band → shared footer.
- **Section banding rhythm (alternating):** Banner = dark green photo → Stats = white → Story = `--surface-alt` → Vision/Mission = white → Values = `--surface-alt` → Leadership = white → Partners = `--surface-alt` → CTA = green gradient → Footer = dark.

### Breakpoint mapping (design modes → system breakpoints)
The design JS switches at 768 and 1025 across three modes (`mobile` / `tablet` / `web`). Rebuild against the **system breakpoints 600 / 900 / 1200**, mapping as follows:

| Design mode | Maps to system band | Notes |
|---|---|---|
| `mobile` (<768) | **MOBILE** `<600` (base, no query) | 1-col reflow, 2-up partners/team, stacked CTA |
| `tablet` (768–1024) | **TABLET** `600–1199` | 2-col grids, left-rail timeline |
| `web` (≥1025) | **WEB** `≥1200` | 4-col grids, alternating timeline |

The system's intermediate **900** breakpoint is available as a fluid refinement hook (e.g. to lift Values/Leadership from 2→3 columns mid-band if cells look sparse), but the faithful reproduction holds **2-col through the entire 600–1199 band** and jumps to 4-col only at **1200**. The two grid-count switches the design actually performs (2-up ↔ 4-up, and the timeline layout swap) land on the **1200** breakpoint; the 1-up ↔ 2-up mobile switches land on the **600** breakpoint.

---

## 2. Section-by-section layout

Global container: `max-width: 1140px` (`--maxw`), centered, side padding `clamp(20px, 5vw, 40px)`. Section vertical padding `--section-padding` = `clamp(56px, 8vw, 96px)` (comfortable density). Several sections use a tighter inner `max-width` cap (see each).

### Section 1 — Banner (`<header>`-level hero band, but page `<h1>` lives here)
Full-bleed photo band with a dark green overlay and centered eyebrow + H1 + subtitle.

- **WEB (≥1200):** `min-height: clamp(320px, 42vw, 460px)` (renders ~460px). Photo `position:absolute; inset:0; object-fit:cover`. Overlay gradient on top. Content centered, `max-width: 860px`, inner padding `clamp(48px,8vw,80px) clamp(20px,5vw,40px)`. Stack: eyebrow row ("— ABOUT US —") → H1 (~3.5rem) → subtitle (max 560px). All centered.
- **TABLET (600–1199):** identical structure; H1 scales down fluidly via `clamp` (~2.7rem at 820px). Band ~360px tall.
- **MOBILE (<600):** band ~320px tall; H1 ~2.1rem; subtitle wraps to 2 lines. Centered. **No `background-attachment:fixed`** (kills mobile jank).
- The stats card in the next section **overlaps up into the bottom of this band** (negative margin), so leave visual breathing room at the band's lower edge — keep the subtitle vertically centered, not bottom-pinned.

### Section 2 — Impact stats (overlapping card)
A white rounded card that floats over the banner/stats boundary, holding 4 stat blocks.

- **Mechanism:** the stats `<section>` is white with `padding: 0 0 clamp(40px,5vw,64px)`; the card inside has `margin-top: clamp(-64px,-6vw,-40px)` so it rises into the banner. `position:relative; z-index:3`. Card: white, `border:1px solid` `--border`, `border-radius:18px`, big drop shadow, padding `clamp(26px,3.2vw,40px) clamp(16px,3vw,30px)`.
- **WEB (≥1200):** 4 columns, `grid-template-columns: repeat(4,1fr)`, gap `clamp(18px,2.4vw,28px)`. One row: `20+ / 5 / 10,000+ / 50,000+`.
- **TABLET (600–1199):** **2×2 grid** (`repeat(2,1fr)`). Card width tracks the 1140 container.
- **MOBILE (<600):** **2×2 grid** (`repeat(2,1fr)`) — numbers stay prominent; do NOT drop to 1-col (matches the 390 render).
- Each stat block: centered, padding `6px 8px`; big number (Oswald green) over an uppercase label.

### Section 3 — Our Story + timeline
Centered intro (eyebrow + H2 + paragraph), then a vertical milestone timeline. Background `--surface-alt`.

- **Intro:** centered, container `max-width: 780px`; paragraph capped `max-width: 720px`, `line-height:1.75`. Eyebrow "— OUR STORY —", H2 "The Coodu Journey".
- **Timeline — WEB (≥1200): ALTERNATING center-rail.** Wrapper `max-width: 900px`, centered. A 3px vertical rail (gradient `#1e7e34 → #15602a`) at `left:50%`, `top/bottom:6px`. Each milestone is a 3-col grid `1fr 56px 1fr`, `align-items:center`, `margin-bottom: clamp(20px,2.4vw,30px)`:
  - Odd-position milestones (**2000, 2012, 2024**) → card in **column 1**, `justify-self:end`, text right-aligned.
  - Even-position milestones (**2005, 2018**) → card in **column 3**, `justify-self:start`, text left-aligned.
  - Center column (`56px`) holds the dot. Card `max-width:380px`.
  - Dot: 18px circle, white fill, 4px `--color-primary` border, `box-shadow:0 0 0 4px` `--surface-alt` (halo ring that masks the rail).
- **Timeline — TABLET (600–1199) & MOBILE (<600): LEFT-RAIL stacked.** Wrapper `max-width: 560px`, centered. Rail 3px at `left:9px`. Each item: `position:relative; padding-left:40px; margin-bottom: clamp(16px,3vw,22px)`; dot absolutely placed at `left:1px; top:6px`; card full-width, left-aligned. (This is the design's `tlStacked` branch — switch to it for everything below 1200.)
- **Timeline card (both layouts):** white, `border:1px solid` `--border`, `border-radius:14px`, soft shadow, padding `clamp(16px,1.8vw,22px) clamp(18px,2vw,24px)`. Year (Oswald green, 1.5rem desktop / 1.4rem stacked) over description (`margin-top:~10px`). Hover lift (see §5).

### Section 4 — Vision & Mission
Centered intro + two equal icon cards. Background white.

- **Intro:** eyebrow "— WHAT DRIVES US —", H2 "Our Vision & Mission", centered, `max-width:760px`.
- **Grid wrapper:** `max-width: 980px`, centered, gap `clamp(20px,2.4vw,32px)`, `margin-top: clamp(36px,4vw,52px)`.
- **WEB (≥1200) & TABLET (600–1199):** **2 columns** (`repeat(2,1fr)`) — cards sit side by side.
- **MOBILE (<600):** **1 column** (stacked).
- Cards are equal-height (`display:flex; flex-direction:column; gap:18px`). **Vision** card icon tile = soft green wash (`rgba(30,126,52,.10)`) with green icon. **Mission** card icon tile = solid `--color-primary` with white icon + colored glow shadow — this differentiates the two.

### Section 5 — Guiding Values
Centered intro + 4 icon/value cards. Background `--surface-alt`.

- **Intro:** eyebrow "— WHAT WE STAND FOR —", H2 "Our Guiding Values".
- **Grid:** gap `clamp(18px,2vw,26px)`, `margin-top: clamp(36px,4vw,52px)`. (Full 1140 container, no inner cap.)
- **WEB (≥1200):** **4 columns** (`repeat(4,1fr)`) — single row.
- **TABLET (600–1199):** **2 columns** (2×2).
- **MOBILE (<600):** **1 column** (stacked — matches the 390 render, larger tap-friendly cards).
- Each card centered: icon tile → title → 2-line text; `display:flex; flex-direction:column; align-items:center; gap:16px`.

### Section 6 — Meet Our Leadership
Centered intro + 4 profile cards with circular photos. Background white.

- **Intro:** eyebrow "— OUR PEOPLE —", H2 "Meet Our Leadership".
- **Grid wrapper:** `max-width: 1000px`, centered, gap `clamp(20px,2.4vw,30px)`.
- **WEB (≥1200):** **4 columns** (`repeat(4,1fr)`) — single row.
- **TABLET (600–1199):** **2 columns** (2×2).
- **MOBILE (<600):** **2 columns** (2×2) — per design (`teamCols` = 2 for non-web). The page-doc suggests 1-col is acceptable at the very smallest widths for larger faces; the **design ships 2-up**, so build 2-up and optionally collapse to 1-up below ~380px only if faces get too small.
- Card: white, bordered, `border-radius:16px`, centered column, padding `clamp(24px,2.4vw,32px) clamp(16px,2vw,22px)`. Circular photo `clamp(116px,13vw,156px)` square, `border-radius:50%`, 4px white border + shadow, on `--surface-alt` placeholder bg. Then name (Oswald) + role (green uppercase micro-label).

### Section 7 — Partners & Recognition
Centered intro + intro paragraph + uniform logo wall (flex wrap). Background `--surface-alt`.

- **Intro:** eyebrow "— TRUSTED BY —", H2 "Our Partners & Recognition", paragraph capped `max-width:680px`.
- **Logo wall:** `display:flex; flex-wrap:wrap; justify-content:center`, gap `clamp(14px,1.6vw,20px)`, wrapper `max-width:1000px`, `margin-top: clamp(36px,4vw,52px)`.
- **Cell:** fixed-height uniform tiles — `height:90px`, white, bordered, `border-radius:12px`, padding 14px, logo `object-fit:contain` inside.
- **WEB (≥1200) / TABLET (600–1199):** each cell `flex: 0 0 150px` → ~6 per row at desktop (7th wraps, centered), ~3–4 per row at tablet.
- **MOBILE (<600):** each cell `flex: 0 0 calc(50% - 8px)` → **2 per row**, wrapping (4 rows: 2/2/2/1).

### Section 8 — CTA band
Full-bleed green-gradient band, centered. Background `linear-gradient(135deg, #1e7e34 0%, #15602a 55%, #0f3d1b 100%)`.

- Container `max-width: 820px`, centered. Stack: eyebrow "— GET INVOLVED —" → H2 "Be part of the journey." → button row → secondary text link.
- **Button row:** `display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:14px; margin-top:30px`.
- **WEB / TABLET (≥600):** `flex-direction:row`; buttons auto-width, sit inline.
- **MOBILE (<600):** `flex-direction:column`; **buttons full-width** (`width:100%`).
- Below buttons (`margin-top:22px`): a single underlined text link "View our programs →".

---

## 3. Components (with exact styles + token mapping)

> The design uses values that mostly match the Style Gate but **diverge in a few places** (noted ⚠). For the rebuild, prefer the **design's actual values** so the build matches the approved render, and add the few new tokens below to `tokens.css` rather than hardcoding.

### Design tokens actually used on this page

| Token (proposed) | Style Gate name | Value used in design | Note |
|---|---|---|---|
| `--color-primary` | `--color-primary` | `#1e7e34` | matches |
| `--color-primary-dark` | `--color-primary-dark` | `#15602a` | ⚠ design uses `#15602a` for rail/CTA gradients (gate token is `#155d27`) — add `--color-primary-grad: #15602a` or align |
| `--banner-base` | — | `#0f3d1b` | banner photo fallback + CTA gradient end (new token) |
| `--color-accent` | `--color-accent` | `#e8590c` (hover `#c4470a`) | Donate only |
| `--surface` | `--surface` | `#ffffff` | matches |
| `--surface-alt` | `--surface-alt` | `#f6f8f6` | matches |
| `--border` | `--border` | `#e4ebe5` | ⚠ design uses `#e4ebe5` (gate token `#e2e8e2`); hover border `#cfe0d4` (add `--border-hover`) |
| `--text-strong` | `--text-strong` | `#18241d` | ⚠ design `#18241d` (gate `#1a1f1a`) |
| `--text-body` | `--text-body` | `#45524b` | ⚠ design `#45524b` (gate `#3d433d`) |
| `--text-muted` | `--text-muted` | `#6f7d75` | ⚠ design `#6f7d75` (gate `#6b726b`) |
| `--font-display` | `--font-display` | `'Oswald'` (400/500/600/700) | headings, numbers, years |
| `--font-body` | `--font-body` | `'Inter'` (400/500/600/700) | body, labels, buttons |
| `--radius-btn` | `--radius-btn` | `9px` | ⚠ design `9px` (gate `8px`) |
| `--radius-card` | `--radius-card` | `16px` (cards) / `14px` (timeline) / `18px` (stats) / `12px` (partner) | multiple card radii — see each component |
| `--shadow-card` | `--shadow-1` | `0 2px 10px rgba(16,40,24,.05)` | ⚠ design shadows tint dark-green `rgba(16,40,24,…)`, not `rgba(0,0,0,…)` |
| `--shadow-card-hover` | `--shadow-2` | `0 22px 48px rgba(16,40,24,.14)` | card hover lift |
| `--icon-wash` | — | `rgba(30,126,52,.10)` | soft green icon-tile bg (new) |

### 3.1 Section eyebrow (shared label component)
Centered inline-flex: `[22×2px green bar] · LABEL · [22×2px green bar]`, `gap:10px`.
- Label: `--font-body`, weight 600, `12.5px`, `letter-spacing:.16em` (`.18em` on the dark banner/CTA bands), `text-transform:uppercase`.
- Color: `--color-primary` on light sections; `rgba(255,255,255,.92)` text + `rgba(255,255,255,.7)` bars on dark bands.
- The two bars: `width:22px; height:2px; border-radius:2px`.
- Suggested class: `.eyebrow` / `.eyebrow--on-dark`.

### 3.2 Banner hero (`.hero--page` family)
- Band: `min-height:clamp(320px,42vw,460px)`, `display:flex; align-items:center; justify-content:center`, `overflow:hidden`, base bg `--banner-base #0f3d1b`.
- Photo: absolute `inset:0`, full cover (`<img>` or image-slot).
- Overlay (`pointer-events:none`): `linear-gradient(180deg, rgba(13,46,22,0.55) 0%, rgba(11,38,20,0.74) 100%)`. *(Derived from the design's `bannerOverlay=0.62`: top = 0.62−0.07, bottom = min(0.95, 0.62+0.12). Expose as a single overlay-strength control if desired.)*
- H1: `--font-display` 600, `clamp(2.1rem,5.2vw,3.5rem)`, `line-height:1.08`, `#fff`, `letter-spacing:.01em`, `margin:16px 0 0`.
- Subtitle: `--font-body`, `clamp(15px,1.8vw,1.2rem)`, `line-height:1.6`, `rgba(255,255,255,.9)`, `max-width:560px`, `margin:16px auto 0`.

### 3.3 Stat (overlapping card) — reuse home `.stat` / `impact-card`
- Card shell: white, `border:1px solid var(--border)`, `border-radius:18px`, `box-shadow:0 18px 48px rgba(16,40,24,.12)`, padding `clamp(26px,3.2vw,40px) clamp(16px,3vw,30px)`; `margin-top:clamp(-64px,-6vw,-40px)`; `position:relative; z-index:3`.
- Grid gap `clamp(18px,2.4vw,28px)`.
- `.stat__num`: `--font-display` 600, `clamp(2rem,3.6vw,3rem)`, `line-height:1`, `--color-primary`.
- `.stat__label`: `--font-body` 500, `13px`, `letter-spacing:.06em`, uppercase, `--text-muted`, `margin-top:10px`.

### 3.4 Timeline (page-distinctive component `.timeline`)
- Rail: `width:3px`, `background:linear-gradient(#1e7e34,#15602a)`, `border-radius:2px`.
- Dot `.timeline__dot`: `18px` circle, white fill, `4px solid var(--color-primary)`, `box-shadow:0 0 0 4px var(--surface-alt)`.
- Card `.timeline__card`: white, `1px solid var(--border)`, `border-radius:14px`, `box-shadow:0 2px 10px rgba(16,40,24,.05)`, padding `clamp(16px,1.8vw,22px) clamp(18px,2vw,24px)`.
- `.timeline__year`: `--font-display` 600, `1.5rem` (alternating) / `1.4rem` (stacked), `--color-primary`.
- `.timeline__text`: `--font-body`, `15px`, `line-height:1.6`, `--text-body`.
- Two layout modifiers: `.timeline--alt` (≥1200, center rail, 3-col grid `1fr 56px 1fr`) and `.timeline--rail` (<1200, left rail at 9px, `padding-left:40px`).

### 3.5 Statement card — Vision / Mission (`.card` + leading icon)
- Card: white, `1px solid var(--border)`, `border-radius:16px`, padding `clamp(28px,3vw,40px)`, `box-shadow:0 2px 10px rgba(16,40,24,.05)`, `display:flex; flex-direction:column; gap:18px`.
- Icon tile: `58px` square, `border-radius:14px`. Vision = `background:var(--icon-wash)` + `color:var(--color-primary)`. Mission = `background:var(--color-primary)` + `color:#fff` + `box-shadow:0 8px 20px rgba(30,126,52,.28)`.
- Title `h3`: `--font-display` 600, `clamp(1.4rem,2.2vw,1.8rem)`, `--text-strong`.
- Body `p`: `--font-body`, `clamp(15px,1.1vw,16.5px)`, `line-height:1.7`, `--text-body`.
- Lucide icons: `eye` (Vision), `compass` (Mission), 28×28, stroke-width 1.75.

### 3.6 Icon value card (`.card` centered + Lucide icon)
- Card: white, `1px solid var(--border)`, `border-radius:16px`, padding `clamp(26px,2.6vw,34px) clamp(20px,2vw,26px)`, centered flex column, `gap:16px`, soft shadow.
- Icon tile: `62px` square, `border-radius:16px`, `background:var(--icon-wash)`, `color:var(--color-primary)`.
- Title `h3`: `--font-display` 600, `1.3rem`, `--text-strong`.
- Text `p`: `--font-body`, `14.5px`, `line-height:1.65`, `--text-body`.
- Lucide: `shield-check` (Integrity), `handshake` (Collaboration), `sprout` (Empowerment), `recycle` (Sustainability).

### 3.7 Profile / avatar card — Leadership (`.card` + circular media)
- Card: white, `1px solid var(--border)`, `border-radius:16px`, centered flex column, `gap:16px`, padding `clamp(24px,2.4vw,32px) clamp(16px,2vw,22px)`, soft shadow.
- Photo frame: `clamp(116px,13vw,156px)` square, `border-radius:50%`, `overflow:hidden`, `4px solid #fff` border, `box-shadow:0 10px 26px rgba(16,40,24,.16)`, placeholder bg `--surface-alt`. Photo `object-fit:cover`.
- Name `h3`: `--font-display` 600, `1.2rem`, `--text-strong`.
- Role `p`: `--font-body` 600, `12.5px`, `letter-spacing:.06em`, uppercase, `--color-primary`, `margin-top:8px`.

### 3.8 Logo wall / partner cell (`.logo-wall` + `.logo-cell`)
- Cell: `height:90px`, white, `1px solid var(--border)`, `border-radius:12px`, `display:flex; align-items:center; justify-content:center`, padding `14px`, `box-shadow:0 2px 8px rgba(16,40,24,.04)`, basis `0 0 150px` (desktop/tablet) / `0 0 calc(50% - 8px)` (mobile).
- Logo `<img>`: `object-fit:contain`, full width/height inside padding.

### 3.9 CTA band + buttons (Style Gate §1.7)
- Band bg: `linear-gradient(135deg,#1e7e34 0%,#15602a 55%,#0f3d1b 100%)`.
- H2: `--font-display` 600, `clamp(1.9rem,4vw,2.8rem)`, `line-height:1.1`, `#fff`.
- **`.btn--cta` (Donate):** text `#fff`, bg `--color-accent #e8590c`, padding `15px 30px`, `border-radius:9px`, `box-shadow:0 8px 22px rgba(232,89,12,.32)`, weight 600, `15px`. Hover `#c4470a` + `translateY(-2px)` + `0 12px 28px rgba(232,89,12,.42)`.
- **`.btn--secondary` (Get Involved):** transparent bg, `1.5px solid rgba(255,255,255,.6)` border, `#fff` text, padding `13.5px 28px`, `border-radius:9px`. Hover `background:rgba(255,255,255,.14)` + border `#fff` + lift.
- **`.btn--link` (View our programs →):** `--font-body` 500, `14px`, `rgba(255,255,255,.9)`, `border-bottom:1px solid rgba(255,255,255,.4)`, `padding-bottom:2px`. Hover → `#fff` + border `#fff`.
- All three share a focus ring: `outline:3px solid rgba(255,255,255,.75); outline-offset:3px`.

---

## 4. Content to populate (verbatim — do not paraphrase numbers/names)

**Banner**
- Eyebrow: `About us`
- H1: `About Coodu Trust`
- Subtitle: `Over Two Decades of Commitment to Rural Development`

**Impact stats** (4) — number + label:
| Number | Label |
|---|---|
| `20+` | `Years` |
| `5` | `Districts` |
| `10,000+` | `Women empowered` |
| `50,000+` | `Trees planted` |

**Our Story**
- Eyebrow: `Our story` · H2: `The Coodu Journey`
- Intro paragraph (verbatim): "Since our inception in the year 2000, Coodu Trust has been driven by a single, unwavering goal: to empower the underprivileged and marginalized communities of Tamil Nadu. We began as a small group of like-minded professionals dedicated to constructive social work, and have since grown into one of the leading NGOs in the region, with a proven track record in watershed development, women's empowerment, sustainable agriculture, and more."

**Timeline** (5 milestones — year + text, exact; visual side in `--alt` layout noted):
- **2000** (left) — "Coodu Trust is founded and registered as a charitable trust."
- **2005** (right) — "Launched first large-scale Watershed Development program across 5 districts."
- **2012** (left) — "Recognized by the State Government for excellence in community mobilization."
- **2018** (right) — "Expanded skill development programs, empowering over 10,000 women."
- **2024** (left) — "Reached a milestone of planting over 50,000 trees through environmental initiatives."

**Vision & Mission**
- Eyebrow: `What drives us` · H2: `Our Vision & Mission`
- **Our Vision** — "To build self-sufficient and self-reliant rural communities where every individual has the opportunity to live a life of dignity and purpose."
- **Our Mission** — "To design and implement sustainable, community-driven development programs focused on natural resource management, livelihood enhancement, and social empowerment."

**Guiding Values**
- Eyebrow: `What we stand for` · H2: `Our Guiding Values`
- **Integrity** — "We operate with transparency and accountability in all our actions."
- **Collaboration** — "We believe in the power of partnership with communities and stakeholders."
- **Empowerment** — "We enable individuals and communities to take charge of their own development."
- **Sustainability** — "We create solutions that are environmentally sound and economically viable."

**Meet Our Leadership**
- Eyebrow: `Our people` · H2: `Meet Our Leadership`
- **S. Jagadeesan** — `Managing Trustee`
- **C.T.V. Chidambara Kumar** — `Trustee`
- **Dr. P. Venkatesan** — `Advisory Board`
- **P.P. Saravanan** — `Advisory Board` *(title-cased per the approved design — not the legacy ALL-CAPS "P.P. SARAVANAN")*

**Partners & Recognition**
- Eyebrow: `Trusted by` · H2: `Our Partners & Recognition`
- Intro: "We are proud to collaborate with a wide range of government bodies, corporate partners, and funding agencies who share our vision."
- 7 logos (alt text = name): `Government of India`, `Government of Tamil Nadu`, `NABARD`, `SBI Foundation`, `NSDC`, `Tata Power`, `Karur Vysya Bank`.

**CTA band**
- Eyebrow: `Get involved` · H2: `Be part of the journey.`
- Primary button: `Donate` → `donate.html`
- Secondary button: `Get Involved` → `get-involved.html`
- Text link: `View our programs →` → `programs.html`

**Link targets to keep live:** nav (Home/About/Programs/Get Involved/Documents/Media/Contact), footer Quick Links (About/Programs/Careers/Donate), `donate.html`, `get-involved.html`, `programs.html`.

**Footer (shared chrome — preserve):** H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India · `director@coodutrust.org` · `+91-451-2461362`.

---

## 5. Image slots

The design uses `image-slot` placeholders. Rebuild as real `<img>` (with `width`/`height` or `aspect-ratio`, `loading="lazy"` except the banner, `decoding="async"`, meaningful `alt`). Cloudinary is available — request sized transforms, not full-res.

| Slot id | Shape / fit | Aspect / size | Subject | Notes |
|---|---|---|---|---|
| `about-banner` | rect / cover | full-bleed band, ~`16:5` at desktop (min-height 320–460px) | Rural landscape / fieldwork (authentic, warm light) | The only above-the-fold image — **do not lazy-load**; add `fetchpriority="high"`. Sits under the green overlay. |
| `team-jagadeesan` | circle / cover | `1:1`, `clamp(116px,13vw,156px)` | S. Jagadeesan portrait | Normalize crop across all 4 (drop the legacy per-member "adjust-up" object-position hack). |
| `team-kumar` | circle / cover | `1:1` | C.T.V. Chidambara Kumar portrait | same circular treatment |
| `team-venkatesan` | circle / cover | `1:1` | Dr. P. Venkatesan portrait | same |
| `team-saravanan` | circle / cover | `1:1` | P.P. Saravanan portrait | same |
| `logo-goi` | rect / contain | fits `~122×62` inside 150×90 cell | Government of India emblem | uniform cell; `object-fit:contain` |
| `logo-gotn` | rect / contain | same | Government of Tamil Nadu | |
| `logo-nabard` | rect / contain | same | NABARD logo | |
| `logo-sbi` | rect / contain | same | SBI Foundation logo | |
| `logo-nsdc` | rect / contain | same | NSDC logo | |
| `logo-tata` | rect / contain | same | Tata Power logo | |
| `logo-kvb` | rect / contain | same | Karur Vysya Bank logo | |

---

## 6. Interactions & motion + accessibility

### Interactions / motion
- **Card hover lift (timeline, vision/mission, values, leadership):** `transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease`. Hover → `transform:translateY(-6px)` (timeline `-4px`), shadow up to `0 22px 48px rgba(16,40,24,.14)` (timeline `0 16px 36px rgba(16,40,24,.13)`), `border-color:#cfe0d4`.
- **Partner cell hover:** `transition:… .2s`; `translateY(-3px)`, `box-shadow:0 12px 26px rgba(16,40,24,.12)`, `border-color:#cfe0d4`. *(Page-doc also suggests muted→full-color on hover; optional grayscale filter that lifts to color is on-brand.)*
- **Donate button hover:** darken to `#c4470a`, `translateY(-2px)`, stronger accent glow.
- **Secondary / link hover:** background/border lighten to white (see §3.9).
- **No counters / carousels / drawers / lightbox on this page.** The stat numbers are **static** (no count-up animation in the design). The only carousel/drawer is the shared header's mobile nav (chrome). No lightbox.
- **Smooth scroll:** `html{scroll-behavior:smooth}` (already global).
- **Lucide icons:** rendered at 28×28, `stroke-width:1.75`, single color (brand green or white) — one icon set only, replacing the legacy clip-art PNGs.

### Accessibility
- **Landmarks:** skip-link first in `<body>` → `#main`; shared `<header>`/`<nav>`; one `<main id="main">` wrapping sections 1–8; shared `<footer>`. Each content section is a `<section>` with an `aria-labelledby` pointing at its H2 (banner uses the H1).
- **Headings:** exactly one `<h1>` ("About Coodu Trust" in the banner); section titles are `<h2>`; card titles `<h3>`. No skipped levels. Eyebrows are **not** headings (use `<p>`/`<span>` with a class, or visually-hidden context if needed).
- **Lists:** stats, timeline milestones, values, leadership, and partners are each a `<ul>` of items (timeline ideally an `<ol>` since it's chronological), not stacked `<div>`s.
- **Links vs buttons:** Donate / Get Involved / View programs are `<a href>` (they navigate). No clickable `<div>`s.
- **Contrast:** body `#45524b` on white/`#f6f8f6` and green `#1e7e34` on white both pass ≥4.5:1. White text over the banner photo passes via the `0.55→0.74` dark overlay (verify on the chosen photo; deepen overlay if a light image is used). Muted label `#6f7d75` is for ≥12.5px uppercase labels only (large-text threshold) — keep it off long-form body.
- **Focus:** visible `:focus-visible` ring on every interactive element. On the dark CTA band use `outline:3px solid rgba(255,255,255,.75); outline-offset:3px`; on light sections use a `--color-primary` outline. Never `outline:none` without replacement.
- **Touch targets ≥44×44px:** all buttons clear it (Donate 15px×2 + text ≈ 49px tall; secondary 13.5px×2 + border ≈ 46px). Ensure the "View our programs" text link and any logo/partner links have ≥44px hit area (add padding if they become links).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables all hover transforms and any scroll-reveal fade-ups; keep color/opacity changes only.
- **Images:** real `alt` on banner + team + logos (logo alt = partner name); decorative eyebrow bars are CSS (no alt needed). `lang="en"` on `<html>`.

---

## 7. Build notes

- **Semantic skeleton:**
  ```
  <body data-page="about">
    <a class="skip" href="#main">Skip to content</a>
    <!-- @@include header (shared partial; set About active via data-page) -->
    <main id="main">
      <header class="hero hero--page" aria-labelledby="about-h1"> … <h1 id="about-h1"> … </header>
      <section class="section section--stats" aria-label="Impact at a glance"> … overlapping .stat card … </section>
      <section class="section section--alt" aria-labelledby="story-h2"> … intro + <ol class="timeline"> … </section>
      <section class="section" aria-labelledby="vm-h2"> … 2 .card statement cards … </section>
      <section class="section section--alt" aria-labelledby="values-h2"> … <ul> 4 value cards … </section>
      <section class="section" aria-labelledby="team-h2"> … <ul> 4 profile cards … </section>
      <section class="section section--alt" aria-labelledby="partners-h2"> … intro + .logo-wall … </section>
      <section class="section cta-band" aria-labelledby="cta-h2"> … eyebrow + h2 + buttons + link … </section>
    </main>
    <!-- @@include footer (shared partial) -->
  </body>
  ```
- **Reuse shared components, don't reinvent:** `.hero--page` (same family as home hero overlay), `.stat`/`impact-card` (home impact band), `.card` + modifiers, `.btn--cta`/`.btn--secondary`/`.btn--link`, `.eyebrow`, shared header/footer partials. The **only page-distinctive component is `.timeline`** — put it in `components/timeline.css` (or `pages/about.css` if it's truly one-off) with the two layout modifiers.
- **Token reconciliation (do once):** the design's text/border/shadow colors differ slightly from the gate (`#18241d`/`#45524b`/`#6f7d75`/`#e4ebe5`, shadows tinted `rgba(16,40,24,…)`, radii 9/14/16/18, primary-grad `#15602a`). Decide centrally whether to (a) update the gate tokens to these warmer values, or (b) add page-scoped tokens. Either way, **no raw hex/px in the About markup or page CSS** — only `var(--…)`.
- **Timeline is the tricky bit:** two genuinely different layouts (3-col center-rail vs left-rail). Build mobile-first as `.timeline--rail` (base), then at `@media (min-width:1200px)` swap the grid/rail to `.timeline--alt`. The alternating sides are driven by `:nth-child(odd/even)` → column placement (`grid-column:1 / justify-self:end / text-align:right` for odd; `grid-column:3 / justify-self:start / text-align:left` for even). The dot's `box-shadow:0 0 0 4px var(--surface-alt)` halo masks the rail behind it — keep the section background `--surface-alt` so the halo blends.
- **Overlapping stats card:** the negative `margin-top` pulls the card up over the banner. Keep the stats `<section>` background white and `z-index:3` on the card; ensure the banner has no `overflow:hidden` conflict at the join (the banner clips its own photo, but the card lives in the next section so it floats freely).
- **Banner image priority:** it's the LCP element — eager-load with `fetchpriority="high"`; everything else `loading="lazy"`.
- **Mobile-first authoring:** base = mobile (1-col values/vm, 2-col stats/team, 2-up partners, left-rail timeline, column CTA). Add `@media (min-width:600px)` for the 1→2 / 2-up→fixed / column→row switches, and `@media (min-width:1200px)` for the 2→4 grid jumps + alternating timeline. `@media (min-width:900px)` is free to use for fluid mid-band refinement but the faithful build doesn't require it.
- **Remove / do not port:** legacy `<body>` background-image + fixed white overlay div, the two `background:transparent !important` section hacks, global `text-transform:uppercase`, clip-art value icons, per-member `team-photo-adjust-up` object-position hack, hardcoded ALL-CAPS name.
- **Definition of done (§2.7):** semantic landmarks ✓, one `<h1>` ✓, zero inline styles/`<style>` ✓, shared header/footer ✓, tokenized values only ✓, matches all three renders ✓, keyboard focus visible ✓, contrast ✓, 44px targets ✓, images lazy+sized (banner eager) ✓, no console errors ✓.
