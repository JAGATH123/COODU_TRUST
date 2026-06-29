# Build Spec — Get Involved (`get-involved.html`)

> **Build contract.** This is the precise, authoritative spec for rebuilding the redesigned **Get Involved** hub page in clean semantic HTML5 + the shared design-system CSS (tokens + components). It is reverse-engineered from the approved Claude-design canvas and the three render images, and reconciled with the project Style Gate / `00-design-system.md`.
>
> **Design source (exact truth):** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/About page content/Get Involved - COODU Trust.dc.html`
> **Renders (visual truth):** `design/redesign-renders/getinvolved-1280.png` · `getinvolved-820.png` · `getinvolved-390.png`
> **Content source of truth:** `design/page-docs/04-get-involved.md`
> **Tokens / components:** `design/build-specs/00-design-system.md` + `design/REDESIGN-STYLE-GATE.md` (referenced by name; do not re-define here).
>
> **Hard rules (Clean-Rebuild Standards §2):** zero `style="…"` attributes, zero page-level `<style>` blocks, one `<h1>`, real landmarks, mobile-first with the three system breakpoints **600 / 900 / 1200**, shared header/footer partials, every hex/px comes from a token. Delete the legacy full-page fixed background photo + 40%-white overlay div and the `background:transparent !important` section hack. Sentence-case everything except tiny eyebrow/label text.

---

## 1. Purpose & coverage

- **Governs:** the single public page `get-involved.html` — a standalone **decision hub**, NOT a template. Nav label "Get Involved" gets `.active`; it is the parent of the nav dropdown (Volunteer / Partner with Us / Donate). The three destinations it links to (`volunteer.html`, `partner.html`, `donate.html`) are separate content-heavy pages with their own specs — **do not fold them in here.**
- **Job:** a short, scannable "choose-your-path" hub that (a) gives a reason to act (impact strip + trust line), (b) presents the three ways to support COODU — **Partner, Volunteer, Donate** — as differentiated cards, and (c) routes each visitor to the right action page, with a confident closing CTA.
- **`<title>`:** `Get Involved | Donate, Volunteer, or Partner with Coodu Trust`
- **`<meta name="description">`:** `Support Coodu Trust's work across Tamil Nadu — donate, volunteer your time and skills, or partner with us on CSR and institutional projects. Find the way that fits you.`
- **Section order (DOM, top→bottom):** shared header → **(1)** Banner → **(2)** Intro + trust pill → **(3)** Impact strip → **(4)** Three path cards → **(5)** Closing CTA band → shared footer.
- **Section banding rhythm (alternating):** Banner = dark green photo → Intro = white → Impact = `--surface-alt` (hairline top+bottom) → Paths = white → CTA = green gradient → Footer = dark.

### Breakpoint mapping (design modes → system breakpoints)
The design JS (`renderVals`) switches at **768** and **1025** across three modes (`mobile` / `tablet` / `web`). Rebuild against the **system breakpoints 600 / 900 / 1200**, mapping as follows:

| Design mode | Maps to system band | Cards | Stats | CTA buttons | Donate order |
|---|---|---|---|---|---|
| `mobile` (<768) | **MOBILE** `<600` (base, no query) | 1 col | 2 col | column, full-width | **first** (`order:-1`) |
| `tablet` (768–1024) | **TABLET** `600–1199` | 2 col | 2 col | row, auto-width | normal (3rd) |
| `web` (≥1025) | **WEB** `≥1200` | 3 col | 4 col | row, auto-width | normal (3rd) |

The design performs exactly **two** grid switches and **three** mobile-only switches, all driven by `renderVals` CSS vars:
- `--cards-cols`: `1fr` → `repeat(2,1fr)` → `repeat(3,1fr)` (switches land on **600** and **1200**).
- `--stats-cols`: `repeat(2,1fr)` (mobile+tablet) → `repeat(4,1fr)` (web) (switch lands on **1200**).
- `--cta-dir` + `--cta-btn-w`: `column`/`100%` → `row`/`auto` (switch lands on **600**).
- `--donate-order`: `-1` (mobile only) → `0` (switch lands on **600**).

The system's **900** breakpoint is a free fluid-refinement hook (not required); the faithful build holds 2-col cards / 2-col stats across the whole **600–1199** band and jumps to 3-col / 4-col only at **1200**. `--sec-pad` is a density prop (comfortable `clamp(56px,8vw,96px)` / compact `clamp(40px,5.5vw,68px)`) — build **comfortable** to match renders.

---

## 2. Section-by-section layout

Global container: `max-width:1140px` (`--maxw`), centered, side padding `clamp(20px,5vw,40px)` (`--gutter` fluid). Section vertical padding `--sec-pad` = `clamp(56px,8vw,96px)` (comfortable). Some sections cap their inner `max-width` tighter (noted per section).

### Section 1 — Banner (`<header>`-level hero band; page `<h1>` lives here)
Full-bleed photo band, dark-green base, gradient scrim, centered eyebrow + H1 + subtitle + **3 anchor chips**.

- **Band:** `min-height:clamp(300px,40vw,440px)`, `display:flex; align-items:center; justify-content:center`, `overflow:hidden`, base bg `--banner-base #0f3d1b`.
- **Photo layer:** absolute `inset:0`, full cover, with a slow zoom animation (`heroZoom` scale 1 → 1.09 over 22s ease-in-out infinite alternate — reduced-motion off).
- **Scrim (on top, `pointer-events:none`):** `linear-gradient(135deg, rgba(13,46,22,.62) 0%, rgba(15,61,27,.72) 55%, rgba(11,38,20,.82) 100%)`.
- **Content block:** `position:relative; z-index:2; text-align:center; max-width:880px; padding:clamp(54px,8vw,92px) clamp(20px,5vw,40px)`.
- **WEB (≥1200):** eyebrow row "— JOIN US —" → H1 (~3.5rem) → subtitle (max 560px) → chip row (3 pills). All centered, stacked.
- **TABLET (600–1199):** identical structure; H1 scales down fluidly (~2.6rem at 820px); subtitle wraps to ~2 lines; chips stay on one row. Band ~340–360px tall.
- **MOBILE (<600):** band ~300px tall; H1 ~2.1rem; subtitle ~15px (wraps to 2–3 lines); chips wrap but typically stay one row. Tighter padding. **No `background-attachment:fixed`.**
- Chips smooth-scroll to the matching path card (`#path-partner`, `#path-volunteer`, `#path-donate`) with a −24px offset; they are real `<a href="#…">` (or `<button>`), full keyboard-reachable.

### Section 2 — Intro + trust pill
Centered eyebrow + H2 + lead paragraph + a pill trust line. Background white.

- **Section padding:** `clamp(48px,7vw,84px) 0 clamp(30px,4vw,46px)` (asymmetric — more top than bottom so it tucks into the impact band).
- **Inner:** `max-width:1140px`, centered, side padding, `text-align:center`.
- **Stack:** eyebrow "— WAYS TO HELP —" (green) → H2 "Join Us in Our Mission" (`max-width:680px`) → lead paragraph (`max-width:62ch`, `line-height:1.75`) → trust pill (`margin-top:22px`).
- **Trust pill:** inline-flex, `shield-check` icon (green) + text; pale-green fill, hairline border, fully rounded. One line on desktop/tablet; wraps to 2 lines on mobile.
- **All breakpoints:** single centered column; only type scale + paragraph wrap change. (390 render: pill wraps to 2 lines.)

### Section 3 — Impact strip
A slim banded row of 4 stat figures + a caption. Background `--surface-alt` with hairline top AND bottom borders.

- **Section:** `background:--surface-alt`, `border-top:1px solid --border-soft`, `border-bottom:1px solid --border-soft`, `padding:clamp(34px,4.5vw,52px) 0`.
- **Inner:** `max-width:1080px` (tighter than the 1140 default), centered, side padding.
- **Grid:** `grid-template-columns:var(--stats-cols)`, `gap:clamp(20px,2.4vw,30px)`, `text-align:center`.
- **WEB (≥1200):** **4 columns** in one row — `20+ / 5 / 10,000+ / 50,000+`.
- **TABLET (600–1199):** **2×2 grid** (`repeat(2,1fr)`) — confirmed by the 820 render.
- **MOBILE (<600):** **2×2 grid** (`repeat(2,1fr)`) — numbers stay prominent; do NOT drop to 1-col (confirmed by 390 render).
- **Caption** below the grid (`margin-top:18px`, centered, tiny muted): "Figures carried over from the About page — confirm or replace before publishing." This is a build-time placeholder note; keep it until the client confirms real numbers, then remove.
- Each stat: big Oswald green number over an uppercase micro-label. Numbers animate 0→target on scroll-into-view (count-up, once; reduced-motion shows final value).

### Section 4 — Three path cards
The spine of the page: 3 image-top cards (Partner, Volunteer, Donate), equal height, button pinned to the bottom. Donate is visually emphasized. Background white. Section `id="paths"`.

- **Section:** `background:--surface`, `padding:var(--sec-pad) 0`.
- **Inner:** `max-width:1140px`, centered, side padding.
- **Grid:** `grid-template-columns:var(--cards-cols)`, `gap:clamp(20px,2.4vw,30px)`, `align-items:stretch` (equal-height cards).
- **DOM order:** Partner → Volunteer → Donate. Donate carries `order:var(--donate-order)`.
- **WEB (≥1200):** **3 columns** — Partner, Volunteer, Donate side by side, equal height. Donate (col 3) reads as the accent card.
- **TABLET (600–1199):** **2 columns**. Row 1 = Partner + Volunteer; Row 2 = Donate alone in the **left** cell (donate `order:0`, the 3rd item, so it sits bottom-left with the right cell empty). *Faithful design behavior.* **Optional refinement (page-doc §6 suggests):** let the Donate card span both columns OR center it on its row so it doesn't sit lopsided — flag as a build choice; the literal design does neither.
- **MOBILE (<600):** **1 column**, full-width cards, generous gap. **Donate moves to FIRST** (`order:-1`) — confirmed by the 390 render (Donate → Partner → Volunteer). Lead with the fastest action on mobile.
- **Card internals (all):** image (16:10) on top → content block (`flex:1`, column, `padding:clamp(22px,2.4vw,30px)`): icon-tile + H3 row → body paragraph → "what happens next" micro-line → button wrapper pinned to bottom (`margin-top:auto; padding-top:22px`).

### Section 5 — Closing CTA band
Full-bleed green-gradient band, centered eyebrow + H2 + 2 buttons. Background `linear-gradient(135deg,#1e7e34 0%,#155d27 55%,#0f3d1b 100%)`.

- **Section:** `padding:var(--sec-pad) 0`.
- **Inner:** `max-width:760px`, centered, side padding, `text-align:center`.
- **Stack:** eyebrow "— MAKE A DIFFERENCE —" (on-dark) → H2 (the subtitle line repeated, `max-width:600px`) → button row (`margin-top:30px`).
- **Button row:** `display:flex; flex-direction:var(--cta-dir); gap:14px; justify-content:center; align-items:center; flex-wrap:wrap`.
- **WEB / TABLET (≥600):** `--cta-dir:row`; buttons auto-width, side by side. Primary "Donate" (accent) + ghost "Talk to us first".
- **MOBILE (<600):** `--cta-dir:column`; both buttons `width:100%` (stacked, full-width).

---

## 3. Components (with exact styles + token mapping)

> The design's values mostly match `00-design-system.md` but **diverge in a few warm-tinted places** (noted ⚠) — identical to the divergences already flagged in `04-about.md`. Prefer the **design's actual values** so the build matches the approved render, and reconcile tokens centrally (see §7) rather than hardcoding.

### Design tokens actually used on this page

| Token (use) | Design-system name | Value used here | Note |
|---|---|---|---|
| `--color-primary` | `--color-primary` | `#1e7e34` | matches |
| `--color-primary-dark` | `--color-primary-dark` | `#155d27` | matches gate exactly (CTA gradient mid-stop) |
| `--banner-base` | (new, shared w/ About) | `#0f3d1b` | banner photo fallback + CTA gradient end |
| `--color-accent` | `--color-accent` | `#e8590c` | **Donate / CTA only** |
| `--color-accent-dark` | `--color-accent-dark` | `#c4470a` | ⚠ design uses `#c4470a` (gate token `#c2410c`) — align |
| `--accent-wash` | (new) | `rgba(232,89,12,.12)` | Donate icon-tile bg |
| `--accent-text` | (new) | `#a9560f` | Donate card micro-line text (AA on white) |
| `--accent-border-soft` | (new) | `#f2c4a3` | Donate card rest border |
| `--surface-accent-tint` | `--surface-tint-orange`-ish | `#fbeee5` | Donate card image placeholder bg |
| `--surface` | `--surface` | `#ffffff` | matches |
| `--surface-alt` | `--surface-alt` | `#f6f8f6` | impact band |
| `--surface-tint-green` | `--surface-tint-green` | `#eef3ee` | Partner/Volunteer image placeholder bg |
| `--trust-pill-bg` | (new) | `#f1f6f1` | intro trust pill fill |
| `--trust-pill-border` | (new) | `#dde9de` | intro trust pill border |
| `--border` | `--border` | `#e4ebe5` | ⚠ design `#e4ebe5` (gate `#e2e8e2`) |
| `--border-soft` | `--border-soft` | `#e9eee9` | impact band hairlines |
| `--border-hover` | (new) | `#cfe0d4` | card hover border |
| `--icon-wash` | (new, shared w/ About) | `rgba(30,126,52,.10)` | Partner/Volunteer icon-tile bg |
| `--text-strong` | `--text-strong` | `#18241d` | ⚠ design `#18241d` (gate `#1a1f1a`) — H1/H2/H3 |
| `--text-body` | `--text-body` | `#45524b` / card body `#55635b` | ⚠ design warmer than gate `#3d433d` |
| `--text-muted` | `--text-muted` | `#6f7d75` | ⚠ design `#6f7d75` (gate `#6b726b`) — labels, micro-lines |
| `--text-faint` | (new) | `#9aa69e` | impact-strip caption only |
| `--font-display` | `--font-display` | `'Oswald'` 400/500/600/700 | H1/H2/H3, stat numbers |
| `--font-body` | `--font-body` | `'Inter'` 400/500/600/700 | body, labels, buttons, chips |
| `--radius-card` | `--radius-card` | `18px` | path cards |
| `--radius-icon` | `--radius-icon` | `11px` | 40px icon tiles |
| `--radius-btn` | `--radius-btn` | `9px` | ⚠ design `9px` (gate `8px`) |
| `--radius-pill` | `--radius-pill` | `999px` | chips, trust pill, badge |
| `--shadow-card` | `--shadow-1` | `0 2px 12px rgba(16,40,24,.06)` | ⚠ shadows tinted dark-green, not black |
| `--shadow-card-hover` | `--shadow-2` | `0 24px 52px rgba(16,40,24,.14)` | Partner/Volunteer hover |

> ⚠ **Note the design canvas uses `'Inter'` for body, but `00-design-system.md` §2.2 standardizes body on `'Source Sans 3'`.** This is a system-wide divergence (also present in About). Reconcile centrally in `tokens.css` — pick one body font for the whole site; do not let Get Involved alone ship Inter. The px sizes/weights below are font-agnostic.

### 3.1 Section eyebrow (shared label component) — `.eyebrow` / `.eyebrow--on-dark`
Centered inline-flex: `[22×2px bar] · LABEL · [22×2px bar]`, `gap:10px`.
- Label: `--font-body` 600, `12.5px`, `text-transform:uppercase`. `letter-spacing:.16em` on light sections (intro); `.18em` on dark bands (banner, CTA).
- Color: `--color-primary` text + bars on light; `rgba(255,255,255,.92)` text + `rgba(255,255,255,.7)` bars on dark.
- Bars: `width:22px; height:2px; border-radius:2px`.
- Labels on this page: `JOIN US` (banner), `WAYS TO HELP` (intro), `MAKE A DIFFERENCE` (CTA).

### 3.2 Banner hero — `.hero--page` (reuse About's banner family)
- Band: `min-height:clamp(300px,40vw,440px)`, flex-center, `overflow:hidden`, bg `--banner-base`.
- Photo: absolute `inset:0`, cover; wrapper carries the zoom animation (`@keyframes heroZoom{from{transform:scale(1)}to{transform:scale(1.09)}}`, 22s ease-in-out infinite alternate).
- Scrim: `linear-gradient(135deg,rgba(13,46,22,.62) 0%,rgba(15,61,27,.72) 55%,rgba(11,38,20,.82) 100%)`, `pointer-events:none`.
- H1: `--font-display` 600, `clamp(2.1rem,5.2vw,3.5rem)`, `line-height:1.08`, `#fff`, `letter-spacing:.01em`, `margin:16px 0 0`.
- Subtitle: `--font-body`, `clamp(15px,1.8vw,1.2rem)`, `line-height:1.6`, `rgba(255,255,255,.92)`, `max-width:560px`, `margin:16px auto 0`.

### 3.3 Anchor chip — `.chip--anchor`
Pill links/buttons under the banner subtitle that smooth-scroll to the cards.
- Layout: `display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:26px`.
- Chip: `--font-body` 600, `13px`, `#fff`, bg `rgba(255,255,255,.12)`, `border:1px solid rgba(255,255,255,.34)`, `padding:9px 17px`, `border-radius:--radius-pill`, `backdrop-filter:blur(4px)`, `cursor:pointer`.
- Hover: `background:rgba(255,255,255,.22); border-color:#fff; transform:translateY(-2px)`.
- Focus: `outline:3px solid rgba(255,255,255,.7); outline-offset:3px`.
- Labels → targets: `Partner`→`#path-partner`, `Volunteer`→`#path-volunteer`, `Donate`→`#path-donate`.

### 3.4 Trust pill — `.trust-pill`
- `display:inline-flex; align-items:center; gap:9px; margin-top:22px; padding:9px 16px; border-radius:--radius-pill`.
- Fill `--trust-pill-bg #f1f6f1`, `border:1px solid --trust-pill-border #dde9de`.
- Text: `--font-body` 500, `13px`, `--text-body #55635b`. Leading `shield-check` icon, `--color-primary`.

### 3.5 Stat figure — `.stat` (reuse home/About impact stat)
- `.stat__num`: `--font-display` 600, `clamp(1.9rem,3.4vw,2.9rem)`, `line-height:1`, `--color-primary`. Carries `data-count-to` (+ optional `data-count-suffix`) for the count-up.
- `.stat__label`: `--font-body` 600, `12px`, `letter-spacing:.06em`, uppercase, `--text-muted`, `margin-top:10px`.
- `.impact__caption`: `--font-body`, `12px`, `--text-faint #9aa69e`, centered, `margin-top:18px`.

### 3.6 Path card — `.path-card` (image-top card; the page-distinctive component)
Base (Partner + Volunteer):
- Shell: `width:100%; display:flex; flex-direction:column; background:--surface; border:1px solid --border; border-radius:--radius-card (18px); overflow:hidden; box-shadow:--shadow-card`.
- `transition:transform .28s cubic-bezier(.22,.61,.36,1), box-shadow .28s ease, border-color .28s ease`.
- Hover: `transform:translateY(-6px); box-shadow:--shadow-card-hover (0 24px 52px rgba(16,40,24,.14)); border-color:--border-hover`.
- `.path-card__media`: `position:relative; width:100%; aspect-ratio:16/10; background:--surface-tint-green #eef3ee` (placeholder bg behind the image).
- `.path-card__body`: `flex:1; display:flex; flex-direction:column; padding:clamp(22px,2.4vw,30px)`.
- Header row: `display:flex; align-items:center; gap:11px`. Icon tile = `40×40; border-radius:--radius-icon (11px); background:--icon-wash; color:--color-primary; flex-center`. H3 = `--font-display` 600, `clamp(1.3rem,1.9vw,1.55rem)`, `--text-strong`, `line-height:1.1`, `margin:0`.
- Body `p`: `--font-body`, `14.5px`, `line-height:1.66`, `--text-body #55635b`, `margin:16px 0 0`.
- "What happens next" micro-line: `display:flex; align-items:center; gap:8px; margin-top:16px; --font-body 13px; --text-muted #6f7d75`. Leading icon `--color-primary`.
- Button wrapper: `margin-top:auto; padding-top:22px`.

**`.path-card--accent` (Donate) modifier:**
- Shell: `position:relative; border:1.5px solid --accent-border-soft #f2c4a3; box-shadow:0 10px 30px rgba(232,89,12,.12)`.
- Hover: `transform:translateY(-8px); box-shadow:0 28px 58px rgba(232,89,12,.2); border-color:--color-accent`.
- Badge `.path-card__badge`: absolute `top:14px; right:14px; z-index:2`; `inline-flex; align-items:center; gap:6px`; `--font-body` 700, `10.5px`, `letter-spacing:.06em`, uppercase, `#fff`; bg `--color-accent`; `padding:6px 11px`; `border-radius:--radius-pill`; `box-shadow:0 4px 12px rgba(232,89,12,.4)`. Leading `zap` icon. Text "EASIEST WAY TO HELP".
- `.path-card__media` bg = `--surface-accent-tint #fbeee5`.
- Icon tile: bg `--accent-wash`, color `--color-accent`.
- Micro-line text color `--accent-text #a9560f`, leading icon `--color-accent`.

### 3.7 Buttons
- **`.btn--secondary` (Partner / Volunteer card CTA, outline):** `display:flex; align-items:center; justify-content:center; gap:8px; --font-body 600 14.5px; color:--color-primary; background:--surface; border:1.5px solid --color-primary; padding:12px 22px; border-radius:--radius-btn (9px)`. Hover: `background:--color-primary; color:#fff; transform:translateY(-2px)`. Focus: `outline:3px solid rgba(30,126,52,.4); outline-offset:3px`.
- **`.btn--cta` (Donate card CTA, filled accent):** `--font-body 600 14.5px; color:#fff; background:--color-accent; border:1.5px solid --color-accent; padding:13.5px 22px; border-radius:--radius-btn; box-shadow:0 8px 22px rgba(232,89,12,.3)`. Hover: `background:--color-accent-dark #c4470a; transform:translateY(-2px); box-shadow:0 12px 28px rgba(232,89,12,.42)`. Focus: `outline:3px solid rgba(232,89,12,.45); outline-offset:3px`. (All three card buttons render full-width inside the card via `display:flex; justify-content:center`.)
- **CTA-band `.btn--cta` (Donate):** `--font-body 600 15px; color:#fff; background:--color-accent; padding:15px 32px; border-radius:--radius-btn; box-shadow:0 8px 22px rgba(232,89,12,.32)`. Hover/focus same family as above. `width:var(--cta-btn-w)` (auto desktop / 100% mobile).
- **CTA-band `.btn--ghost-light` (Talk to us first):** `--font-body 600 15px; color:#fff; background:transparent; border:1.5px solid rgba(255,255,255,.6); padding:13.5px 30px; border-radius:--radius-btn`. Hover: `background:rgba(255,255,255,.14); border-color:#fff; transform:translateY(-2px)`. Focus: `outline:3px solid rgba(255,255,255,.75); outline-offset:3px`. `width:var(--cta-btn-w)`.

### 3.8 CTA band — `.cta-band` (reuse home/About)
- Bg `linear-gradient(135deg,#1e7e34 0%,#155d27 55%,#0f3d1b 100%)`.
- H2: `--font-display` 600, `clamp(1.85rem,3.8vw,2.7rem)`, `line-height:1.12`, `#fff`, `max-width:600px`, `margin:14px auto 0`.

---

## 4. Content to populate (verbatim — do not paraphrase copy/links/labels)

**Banner**
- Eyebrow: `Join us`
- H1: `Get Involved`
- Subtitle: `Together, we can create a world of opportunity and self-reliance.`
- Anchor chips: `Partner` · `Volunteer` · `Donate` (smooth-scroll to the matching cards)

**Intro**
- Eyebrow: `Ways to help`
- H2: `Join Us in Our Mission`
- Paragraph (verbatim): `There are many ways to support the work of Coodu Trust. Whether you are an individual, a corporation, or an institution, your contribution can help us empower communities and build a sustainable future. Explore the options below to find out how you can make a difference.`
- Trust pill: `A registered non-profit working across Tamil Nadu since 2000.` (icon `shield-check`)

**Impact strip** (4 stats — number + label; ⚠ placeholder figures carried from About, mark as such):
| Number | `data-count-to` | Label |
|---|---|---|
| `20+` | 20, suffix `+` | `Years of service` |
| `5` | 5 | `Districts reached` |
| `10,000+` | 10000, suffix `+` | `Women empowered` |
| `50,000+` | 50000, suffix `+` | `Trees planted` |
- Caption (keep until client confirms): `Figures carried over from the About page — confirm or replace before publishing.`

**Path card 1 — Partner with Us** (`id="path-partner"`)
- Icon: `handshake` (tile) · H3: `Partner with Us`
- Body: `Collaborate with us on CSR initiatives, institutional partnerships, and large-scale development projects. Let's work together to achieve shared goals and create lasting impact.`
- Micro-line (icon `phone-call`): `We'll set up a call within 2 working days.`
- Button: `Become a Partner` → `partner.html`

**Path card 2 — Volunteer** (`id="path-volunteer"`)
- Icon: `hand-heart` (tile) · H3: `Volunteer`
- Body: `Lend your time and skills to make a direct impact. We welcome individuals and groups to support our fieldwork, assist with events, or provide professional expertise.`
- Micro-line (icon `clipboard-list`): `Fill a short form — we match you to a program.`
- Button: `Volunteer With Us` → `volunteer.html`

**Path card 3 — Donate** (`id="path-donate"`, accent card)
- Badge (icon `zap`): `Easiest way to help`
- Icon: `heart-handshake` (tile) · H3: `Donate`
- Body: `Your financial support fuels our programs and allows us to reach more communities in need. Every contribution, large or small, helps transform lives.`
- Micro-line (icon `receipt`): `Secure online payment, instant receipt.`
- Button: `Make a Donation` → `donate.html`

**Closing CTA band**
- Eyebrow: `Make a difference`
- H2: `Together, we can create a world of opportunity and self-reliance.`
- Primary button: `Donate` → `donate.html`
- Secondary button: `Talk to us first` → `contact.html`

**Link targets to keep live:** nav (Home/About/Programs/Get Involved/Documents/Media/Contact, "Get Involved" active), `partner.html`, `volunteer.html`, `donate.html`, `contact.html`, footer Quick Links.

**Footer (shared chrome — preserve):** About blurb `Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000.` · Address `H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.` · `director@coodutrust.org` (`mailto:`) · `+91-451-2461362` (`tel:+914512461362`) · social Facebook / Twitter / Instagram · `© 2025 Coodu Trust. All Rights Reserved.`

---

## 5. Image slots

The design uses `image-slot` placeholders. Rebuild as real `<img>` (or `<picture>`) with `width`/`height` or `aspect-ratio`, `loading="lazy"` (except the banner), `decoding="async"`, meaningful `alt`. Cloudinary is available — request sized transforms, not full-res.

| Slot id | Shape / fit | Aspect / size | Subject / `alt` | Notes |
|---|---|---|---|---|
| `getinvolved-hero` | rect / cover | full-bleed band, `min-height:clamp(300px,40vw,440px)` | People / fieldwork — warm, authentic. `alt=""` (decorative under scrim) or "Coodu Trust team and community in the field" | **LCP element — do NOT lazy-load**; `fetchpriority="high"`. Carries the slow zoom layer. Legacy local `assets/images/headers/get-involved-header.jpg` — confirm it exists or define a solid `--banner-base` fallback so it never collapses. |
| `getinvolved-partner` | rect / cover | **16:10** | Partner / CSR / institutional collaboration. `alt="Partner with Coodu Trust for community impact"` | placeholder bg `--surface-tint-green`. Cloudinary: `.../get-involved/partner-with-us.png` |
| `getinvolved-volunteer` | rect / cover | **16:10** | Volunteers in fieldwork / events. `alt="Volunteer with Coodu Trust community programs"` | placeholder bg `--surface-tint-green`. Cloudinary: `.../get-involved/volunteer.png` |
| `getinvolved-donate` | rect / cover | **16:10** | Beneficiaries / impact of giving. `alt="Donate to support Coodu Trust programs"` | placeholder bg `--surface-accent-tint #fbeee5`. Cloudinary: `.../get-involved/donate.png` |

All three card images share the **16:10** ratio (consistent across the row). Standardize source (prefer one CDN); the three card PNGs already live on Cloudinary under `coodu-trust/images/get-involved/`.

---

## 6. Interactions & motion + accessibility

### Interactions / motion
- **Banner photo zoom:** `heroZoom` scale 1→1.09 over 22s, infinite alternate. **Off under reduced-motion.**
- **Anchor chips:** smooth-scroll to the target card with a −24px top offset (JS `scrollTo({behavior:'smooth'})`, falls back to instant). Hover lift + brighten; focus ring (see §3.3).
- **Count-up stats:** each `data-count-to` number animates 0→target (cubic ease-out, ~1.4s) on scroll-into-view (`IntersectionObserver`, threshold 0.5), **once**. Indian/US digit grouping via `toLocaleString` + optional suffix. Reduced-motion / no-IO: show the final value immediately.
- **Section reveal:** `[data-reveal]` blocks fade-up (`translateY(22px)` → none, 0.7s) on scroll-in; path cards stagger (Partner 0ms, Volunteer 90ms, Donate 180ms). Safety timeout reveals all after 2.8s. **Off under reduced-motion** (content shown immediately).
- **Card hover lift:** Partner/Volunteer `translateY(-6px)` + deeper shadow + `--border-hover`; Donate `translateY(-8px)` + accent glow + accent border (see §3.6).
- **Button hover:** outline buttons fill; accent buttons darken to `#c4470a` + lift + stronger glow; ghost button lightens. All `--dur`/ease.
- **No carousel, drawer, or lightbox on this page** (the only drawer is the shared header's mobile nav — chrome).

### Accessibility
- **Landmarks:** skip-link first in `<body>` → `#main`; shared `<header>`/`<nav>`; one `<main id="main">` wrapping sections 1–5; shared `<footer>`. Each content section is a `<section>` with `aria-labelledby` → its H2 (banner uses the H1).
- **Headings:** exactly one `<h1>` ("Get Involved" in the banner); section titles `<h2>` (Join Us in Our Mission, the CTA line); card titles `<h3>`. No skipped levels. Eyebrows are **not** headings (`<p>`/`<span>` + class).
- **Lists:** the impact stats are a `<ul>` of `.stat` items; the three path cards are a `<ul>` of `<li>` (not stacked `<div>`s).
- **Links vs buttons:** all 5 navigations (4 card/CTA buttons + ghost) are `<a href>`; anchor chips that scroll within the page may be `<a href="#…">` (preferred, works without JS) or `<button>`. No clickable `<div>`s.
- **Contrast:** body `#45524b`/`#55635b` on white and green `#1e7e34` on white pass ≥4.5:1. Banner/CTA white text passes via the dark scrim/gradient. Donate micro-line `--accent-text #a9560f` on white passes for ≥13px (verify ≥4.5:1; it is ~4.6:1). Impact caption `#9aa69e` is decorative meta only — keep it off load-bearing copy. The badge "Easiest way to help" is white on `--color-accent` (passes for bold ≥10.5px small text — borderline; it is bold uppercase so treated as large-ish, but verify and darken to `--color-accent-dark` if it fails).
- **Focus:** visible `:focus-visible` ring on every interactive element. Dark bands (banner chips, CTA buttons) use `outline:3px solid rgba(255,255,255,.7–.75); outline-offset:3px`; light-section buttons use `rgba(30,126,52,.4)` (outline) / `rgba(232,89,12,.45)` (Donate). Never bare `outline:none`.
- **Touch targets ≥44×44:** card buttons (12–13.5px×2 + text ≈ 45–48px tall) and CTA buttons (15px×2 ≈ 50px) clear it. Anchor chips (9px×2 + 13px ≈ 36px) are **below 44px** — pad to a ≥44px hit area (extra vertical padding or `min-height`) without changing the visual pill. Card link tap area should span the button width.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables hero zoom, count-up (show final value), reveals, and all hover transforms (keep color/opacity).
- **Images:** banner eager (`fetchpriority="high"`), card images `loading="lazy"` + `decoding="async"`, all with meaningful `alt` (card alts above). `lang="en"` on `<html>`; mark any Tamil strings `lang="ta"`. Decorative eyebrow bars + scrim are CSS (no alt). Icons are decorative Lucide → `aria-hidden="true"`.

---

## 7. Build notes

- **Semantic skeleton:**
  ```html
  <body data-page="get-involved">
    <a class="skip" href="#main">Skip to content</a>
    <!-- @@include header (shared partial; set Get Involved active via data-page) -->
    <main id="main">
      <header class="hero hero--page" aria-labelledby="gi-h1">
        <!-- photo + scrim + eyebrow + <h1 id="gi-h1">Get Involved</h1> + subtitle + chip <nav> -->
      </header>
      <section class="section" aria-labelledby="intro-h2">
        <!-- eyebrow + <h2 id="intro-h2"> + lead + .trust-pill -->
      </section>
      <section class="section section--alt impact" aria-label="Our impact at a glance">
        <ul class="impact__grid"> 4 × <li class="stat"> … </ul>
        <p class="impact__caption"> … </p>
      </section>
      <section class="section paths" id="paths" aria-label="Ways to get involved">
        <ul class="paths__grid">
          <li id="path-partner"   class="path-card"> … </li>
          <li id="path-volunteer" class="path-card"> … </li>
          <li id="path-donate"    class="path-card path-card--accent"> … </li>
        </ul>
      </section>
      <section class="section cta-band" aria-labelledby="cta-h2">
        <!-- eyebrow + <h2 id="cta-h2"> + <a .btn--cta> + <a .btn--ghost-light> -->
      </section>
    </main>
    <!-- @@include footer (shared partial) -->
  </body>
  ```
- **Reuse shared components, don't reinvent:** `.hero--page` (same banner family as About — same `min-height` clamp, scrim pattern, eyebrow/H1/subtitle), `.eyebrow`/`.eyebrow--on-dark`, `.stat` (home/About impact figures + count-up), `.cta-band` + `.btn--cta`/`.btn--ghost-light` (same as About's CTA, just different copy/2nd button), shared header/footer partials. The **only page-distinctive component is `.path-card`** (image-top card with bottom-pinned CTA + the `--accent` Donate modifier) → put it in `components/path-card.css` (or `pages/get-involved.css` if truly one-off).
- **CSS-var responsive contract (faithful to the design JS):** drive the four switches with custom properties set per breakpoint, NOT per-element media queries:
  - base (mobile <600): `--cards-cols:1fr; --stats-cols:repeat(2,1fr); --cta-dir:column; --cta-btn-w:100%; --donate-order:-1;`
  - `@media (min-width:600px)`: `--cards-cols:repeat(2,1fr); --cta-dir:row; --cta-btn-w:auto; --donate-order:0;` (`--stats-cols` stays 2-col)
  - `@media (min-width:1200px)`: `--cards-cols:repeat(3,1fr); --stats-cols:repeat(4,1fr);`
  The grids read `grid-template-columns:var(--cards-cols)` / `var(--stats-cols)`; the CTA row reads `flex-direction:var(--cta-dir)` + button `width:var(--cta-btn-w)`; the Donate card reads `order:var(--donate-order)`. Mobile-first: author base = mobile, enhance up.
- **Tablet Donate-card orphan (decide once):** at 600–1199 the 2-col grid leaves Donate alone bottom-left (faithful design). If that reads awkward, either (a) `@media (min-width:600px) and (max-width:1199px){ .path-card--accent{ grid-column:1 / -1 } }` to span it full-width, or (b) center it. The literal canvas does neither — flag for the client; default to faithful unless told otherwise.
- **Token reconciliation (do once, centrally):** the warm-tinted divergences (`#18241d`/`#45524b`/`#55635b`/`#6f7d75`/`#e4ebe5`, green-tinted shadows `rgba(16,40,24,…)`, accent-tinted shadows `rgba(232,89,12,…)`, radii 9/11/18, accent-dark `#c4470a`) match those already noted in `04-about.md` — resolve them the same way (update gate tokens to the warmer values OR add page-scoped tokens). Add the genuinely-new tokens (`--banner-base`, `--accent-wash`, `--accent-text`, `--accent-border-soft`, `--surface-accent-tint`, `--trust-pill-bg/-border`, `--border-hover`, `--icon-wash`, `--text-faint`) to `tokens.css`. **No raw hex/px in the Get Involved markup or page CSS — only `var(--…)`.**
- **Body-font divergence:** the canvas uses `Inter`; the system standardizes on `Source Sans 3`. Do NOT special-case this page — use the site's chosen body font via `--font-body`. The spec's px/weights are font-agnostic.
- **Count-up + reveal JS:** reuse the shared `IntersectionObserver` utilities (same as About has none, but Home/Programs do) — count-up on `[data-count-to]`, fade-up on `[data-reveal]` with `[data-stagger]`, both gated on `prefers-reduced-motion`. Load once globally; it no-ops where the attributes are absent.
- **Banner robustness:** confirm the hero photo exists; otherwise the solid `--banner-base #0f3d1b` block + scrim keeps the white title legible. Eager-load the banner image; lazy-load the three card images.
- **Remove / do not port (legacy):** the `<body>` fixed background photo, the fixed 40%-white overlay `<div>`, the `style="background:transparent !important"` section hack, global `text-transform:uppercase`, and all inline `style="…"`. Sentence-case card body copy by default (no per-element `text-transform:none` override).
- **Definition of done (§2.7):** semantic landmarks ✓, one `<h1>` ✓, zero inline styles/`<style>` ✓, shared header/footer ✓, tokenized values only ✓, matches all three renders (Donate-first on mobile, 2×2 stats on tablet/mobile, 3-up cards + 4-up stats at ≥1200) ✓, keyboard focus visible ✓, contrast ✓, 44px targets (pad the chips) ✓, banner eager / cards lazy+sized ✓, no console errors ✓.
