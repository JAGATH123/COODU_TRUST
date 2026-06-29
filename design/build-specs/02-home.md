# Build Spec — Home (`index.html`)

> **Status:** Build contract. This is the source of truth for rebuilding the real homepage in
> semantic HTML + the shared design-system CSS. It is derived FULLY from the approved design:
> `NGO Website Design Enhancement/COODU Trust Redesign.dc.html` (Frames 1–4), the render images
> in `design/redesign-renders/`, the content doc `design/page-docs/01-home.md`, and the token
> system in `design/REDESIGN-STYLE-GATE.md`.
>
> **Read me first — how the design encodes responsiveness.** The `.dc.html` is a Claude-design
> canvas. It does **not** use `{{ }}` render-bindings or `clamp()`; each viewport is a separate,
> fully static frame (Frame 1 = Home Desktop @1280, Frame 3 = Home Mobile @390, Frame 4 = Mobile
> drawer, Frame 2 = an alternate "Hero B" direction). **There is no tablet frame.** The values
> below for WEB (≥1200) come from Frame 1, MOBILE (<600) from Frames 3–4, and **TABLET (600–1199)
> is interpolated** per the rules in §2 + the content doc. All hex/px in this spec are the literal
> values pulled from the frames — do not re-measure from the PNGs.

---

## 1. Purpose & coverage

- **Coverage:** ONE page — the public homepage / site root (`index.html`, `/`). Header, nav,
  mega-menu, mobile drawer, and footer are **shared chrome** — specified here only as they appear
  on Home; the chrome doc owns their canonical definition. Build them as shared components.
- **Page job:** Build instant trust in a 20+ year rural-development NGO (Dindigul, Tamil Nadu) and
  route two audiences — donors/CSR partners and beneficiaries/volunteers — toward **Programs** and
  **Donate / Get Involved**.
- **Section order (top → bottom):** Header → Hero → Impact stat band → Who-we-are + video → Core
  programs grid → Stories of transformation → Dual "Get involved" CTA band → "We have only one
  planet" dark counter band → Footer.
- **Two hero directions** exist in the design — see §3.2. **Build HERO A** (full-bleed dark-green
  gradient hero) as the canonical homepage hero; it is the one used in the Home Desktop frame and
  the Mobile frame and matches both the `…desktop` and `…mobile` renders. **Hero B** (split
  light hero) is documented as an approved alternate.

---

## 2. Breakpoint model (fixed, from the Style Gate §2.3)

Mobile-first. Author base = mobile; enhance up with `min-width` only. Exactly three queries:

| Token name | Query | Maps to task band | Source frame |
|---|---|---|---|
| base | `0+` (no query) | **MOBILE (<600)** | Frame 3 @390 |
| `--bp-md` | `@media (min-width:600px)` | lower **TABLET** | interpolated |
| `--bp-lg` | `@media (min-width:900px)` | upper **TABLET** | interpolated |
| `--bp-xl` | `@media (min-width:1200px)` | **WEB (≥1200)** | Frame 1 @1280 |

- Content container: `--maxw: 1140px`, centered. Side gutters: **40px desktop** (the frames use
  `padding:0 40px`), **20px mobile** (frames use `padding:… 20px`). Use `clamp(20px, 5vw, 40px)`
  for the gutter so 600–1199 interpolates smoothly.
- Section vertical rhythm: desktop ~**78–84px** (Mission 78, Programs/Stories 84, CTA 74, Planet
  70), mobile ~**34–40px**. Tablet ≈ 56–64px.
- Banding alternates `--surface` (#fff) and `--surface-alt` (#f6f8f6); two dark bands at the end
  (green CTA gradient, then near-black planet band) before the deep-green footer.

---

## 3. Section-by-section layout

### 3.1 Header / nav (shared chrome — Home view)

**WEB (≥1200)** — `header` flex space-between, `padding:15px 40px`, `background:#fff`,
`border-bottom:1px solid #e2e8e2`, `position:sticky; top:0; z-index:5`.
- **Logo lockup (left):** 42×42 rounded-10 square `background:#1e7e34` holding a white `sprout`
  icon (24px); beside it a 2-line stack — wordmark "Coodu Trust" (Oswald 700, 20px, `.03em`,
  uppercase, #1a1f1a) over kicker "Dindigul · Tamil Nadu" (Source Sans 3, 10px, `.13em`, uppercase,
  #6b726b).
- **Nav (center/right):** horizontal `<ul>`, gap 24px, Oswald 500, 14px, uppercase, `.04em`.
  Items: Home · About · Programs ▾ · Get Involved ▾ · Documents · Media · Contact. Inactive
  #3d433d → hover #1e7e34. **Active item** (Home): #1e7e34 with a 2px **#f4a300** bottom border
  (`padding-bottom:3px`). Programs/Get Involved carry a `chevron-down` (→ `chevron-up` when open).
- **Donate button (far right, standalone):** accent `#e8590c`, white, Oswald 600, 14px, `.05em`,
  uppercase, `padding:12px 22px`, radius 8px, leading `heart` icon (16px), `box-shadow:0 2px 8px
  rgba(232,89,12,.28)`; hover `background:#c2410c; translateY(-1px)`.
- **Programs mega-menu** (Frame 2): full-width white panel, radius 14px, `box-shadow:0 20px 50px
  rgba(0,0,0,.3)`, `padding:30px 32px`, **`grid-template-columns:repeat(3,1fr); gap:28px 36px`**
  = 6 category columns. Each column = a header row (30px rounded-8 icon chip + Oswald 600 15px
  uppercase title) then an indented (`padding-left:39px`) list of sub-links (Source Sans 3, 13.5px,
  #6b726b → hover #1e7e34). Women Empowerment's chip uses the amber tint (`#fdebd6` / `#e8590c`);
  the other five use the green tint (`#eef5ef` / `#1e7e34`). Full link map = content doc §1.

**TABLET (600–1199):** collapse the horizontal nav to the hamburger + drawer at the **lg→md**
boundary (≤~1024 per chrome doc). Keep logo lockup left; Donate button + 40px hamburger right
(as mobile). Mega-menu becomes the drawer's expandable Programs accordion.

**MOBILE (<600):** `padding:10px 18px`. Logo = 36px square + wordmark (17px, no kicker). Right
cluster: compact Donate (`padding:9px 13px`, 13px text) + 40×40 rounded-9 hamburger button (1px
#e2e8e2 border, `menu` icon 22px). See §3.10 for the drawer.

---

### 3.2 Hero — TWO directions

#### HERO A — full-bleed gradient hero (**BUILD THIS**) — Frame 1 + both renders

**WEB (≥1200):** `section`, `position:relative`, `min-height:566px`, flex align-center, overflow
hidden. Three stacked layers:
1. Base: `background:linear-gradient(135deg,#2c5a3c,#12301e)`.
2. Texture: `repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 16px, rgba(0,0,0,.05) 16px 32px)` — a faint diagonal weave (in the real build this layer sits **over the rotating photo**; the design's diagonal hatch is the placeholder for the field photo).
3. Legibility scrim: `linear-gradient(90deg, rgba(8,26,15,.9) 0%, rgba(8,26,15,.62) 46%, rgba(8,26,15,.18) 100%)` — darkens the left where text sits.

Content: container `max-width:1140px; padding:0 40px`; inner block `max-width:616px`, left-aligned,
vertically centered. Stack:
- **Eyebrow:** 26×2px gold bar (`#f6c453`) + label "Rural development across Tamil Nadu · since
  2000" (Oswald 600, 13px, uppercase, `.16em`, **#f6c453**), `margin-bottom:18px`.
- **H1:** Oswald 600, **53px**, line-height 1.08, **#fff**, "Empowering communities, transforming
  lives".
- **Subtitle:** Source Sans 3, 18px, line-height 1.6, `rgba(255,255,255,.9)`, `max-width:540px`,
  `margin-top:20px`.
- **Actions** (`margin-top:30px`, gap 14px, inline): primary **"Discover our work"** (green
  `.btn--primary`, `padding:15px 28px`, `arrow-right`) + secondary **"Donate"** (ghost-on-dark:
  transparent, white, `border:1.5px solid rgba(255,255,255,.6)`, `padding:13px 26px`, `heart`
  icon; hover → `background:#fff; color:#12301e`).
- **Trust line** (`margin-top:30px`, Source Sans 3 14px `rgba(255,255,255,.78)`): `map-pin`
  "Dindigul, Tamil Nadu" · 4px dot · "20+ years of field work".
- **Slideshow dots:** absolute, `bottom:24px`, horizontally centered; 5 dots; active = 26×6px
  pill `#f4a300`, inactive = 6px circles `rgba(255,255,255,.5)`.

**TABLET:** ~60–70vh (min-height ~440–500px); H1 ~38–40px; subtitle 17px; the two CTAs stay inline
if room, else wrap; dots bottom-center; keep the left scrim.

**MOBILE (<600):** Frame 3 — `padding:32px 20px 28px`; `background:linear-gradient(160deg,#2c5a3c,
#10271a)`; texture layer at 14/28px; scrim is **vertical** `linear-gradient(180deg, rgba(8,26,15,.5),
rgba(8,26,15,.82))`. Eyebrow bar 22px, label 11px "Since 2000 · Tamil Nadu". **H1 Oswald 600 32px**
line-height 1.1. Subtitle 16px (shorter copy — see §4). **CTAs full-width, stacked, gap 11px**,
`min-height:48px`: Discover our work (green) above Donate (**solid accent #e8590c** on mobile, not
ghost). Dots `margin-top:22px`.

#### HERO B — split light hero (**APPROVED ALTERNATE**, do not build by default) — Frame 2 + `…hero-b` render
White-background split: container `padding:62px 40px 56px`, `grid-template-columns:1.02fr .98fr;
gap:54px; align-items:center`.
- **Left:** green eyebrow bar (#1e7e34) + "Rural development · since 2000"; **H1 Oswald 600 50px on
  #1a1f1a** (dark text, not white); subtitle 18px #3d433d `max-width:500px` (alt copy: "A serious
  rural-development NGO doing real work for over 20 years — in agriculture, livelihoods, health,
  education and the environment."); CTAs = Discover our work (green) + **Donate (solid #e8590c)**;
  then 3 **trust pill chips** (1px #e2e8e2, radius 999px, `padding:7px 14px`, 13px, green icons):
  "Since 2000" (`calendar-check`), "534 panchayats" (`map-pin`), "3.8L+ lives touched" (`users`).
- **Right:** a 4:3 image card (radius 16px, 1px #e2e8e2) with a decorative 120px amber circle
  (`rgba(244,163,0,.16)`) peeking top-right, and a **floating stat card** bottom-left (white, radius
  14px, shadow): "20+" (Oswald 700 34px #1e7e34) + "Years of field work".
- **Below hero:** a "In partnership with" **partner-logo strip** on `#f6f8f6` (5 logo placeholders
  96×26px, opacity .6).
- **If/when Hero B is chosen:** it is light, so it reuses standard `.btn--primary`/accent and needs
  no scrim. The trust chips, floating 20+ badge, and partner strip are nice extras worth porting
  into Hero A's section even if Hero A stays the default.

---

### 3.3 Impact stat band — Frame 1 + renders

**WEB (≥1200):** `section background:#fff`. Inside the 1140 container, a **floating card** that
**overlaps the hero** via `margin-top:-54px; position:relative; z-index:3`. Card: `background:#fff;
border:1px solid #e2e8e2; border-radius:14px; box-shadow:0 14px 34px rgba(0,0,0,.09);
grid-template-columns:repeat(4,1fr)`. Each cell `padding:28px 24px; text-align:center;
border-right:1px solid #eef1ee` (last cell no border):
- Icon chip 46×46, radius 12px, `background:#eef5ef`, color #1e7e34, lucide icon 24px (stroke 1.9),
  `margin:0 auto 12px`.
- Number: Oswald 700, **32px**, #1a1f1a, line-height 1.
- Label: Oswald, uppercase, `.09em`, 12px, #6b726b, `margin-top:7px`.
- Icons in order: `users`, `map-pin`, `droplets`, `trees`.
- Caption under the card (centered, Source Sans 3 14px #6b726b, `margin-top:18px`): "Cumulative
  results across 20+ years of field work."

**TABLET:** **2×2** grid (`repeat(2,1fr)`), gap 24px; keep the cell dividers as borders that adapt
(or drop the right-borders and use grid gap). Card may sit flush (drop the −54 overlap below ~lg
if the hero shortens) or keep a smaller overlap.

**MOBILE (<600):** Frame 3 — `section padding:34px 20px`. Centered eyebrow "Our impact at a glance"
(Oswald 600 12px uppercase `.14em` #1e7e34). **2×2 grid**, gap 12px; each card is its own bordered
box (`border:1px solid #e2e8e2; border-radius:12px; padding:18px 14px`) — i.e. on mobile the four
cells become four separate cards, not one divided slab. Icon 40px, number 24px, label 10.5px with
**shortened labels**: Beneficiaries · Panchayats · Toilets built · Trees planted. No hero overlap.

---

### 3.4 Who-we-are + video — Frame 1 / Frame 3

**WEB (≥1200):** `section background:#fff`; container `padding:78px 40px;
grid-template-columns:1.04fr 1fr; gap:54px; align-items:center`.
- **Left = video** (media first visually): `aspect-ratio:16/9`, radius 14px, overflow hidden;
  placeholder is a `linear-gradient(135deg,#1f3b29,#10261a)` with a centered 74px white play circle
  (#1e7e34 `play` icon, filled) + caption "VIDEO · Introduction to Coodu Trust (YouTube)". **Real
  build:** responsive 16:9 wrapper around the YouTube iframe `wrG63C0qtxg` (no fixed px), click-to-
  load facade recommended (perf).
- **Right = content:** green eyebrow ("Who we are"); **H2** Oswald 600 36px line-height 1.16 with
  the tri-word treatment — "Community." (#1e7e34) "Compassion." (**#c47f00** amber) "Collaboration."
  (#1e7e34) as three `<span>`s; body Source Sans 3 17px line-height 1.62 #3d433d `max-width:560px`;
  primary button "Learn more about us" (`padding:14px 26px`, arrow).

**TABLET:** keep 2-col if it fits at lg; at the narrow end (md, ~600–760) **stack: video on top,
then heading/body/button**. Video stays full-width-of-column 16:9.

**MOBILE (<600):** Frame 3 — `section padding:8px 20px 40px`, **stacked, video first**: 16:9
placeholder (radius 13px, play 58px) → eyebrow "Who we are" → H2 Oswald 600 **25px** triad → body
16px → full-width green button (min-height 48px).

---

### 3.5 Core programs grid — Frame 1 / Frame 3

**WEB (≥1200):** `section background:#f6f8f6; border-top + border-bottom:1px solid #eef1ee`;
container `padding:84px 40px`.
- **Header** (centered, `max-width:640px`, `margin-bottom:44px`): eyebrow **flanked by 24×2px green
  bars on both sides** + "What we do"; H2 Oswald 600 36px "Our core programs"; sub-line Source Sans
  3 17px #6b726b "Six interlinked pillars that move families from vulnerability toward lasting
  self-reliance."
- **Grid:** `repeat(3,1fr); gap:26px` → **6 cards, 3×2**. Card = `.card` (see §5):
  `background:#fff; border:1px solid #e2e8e2; border-radius:12px; box-shadow:0 2px 8px
  rgba(0,0,0,.06)`; the whole card is a single `<a>`. Hover: `box-shadow:0 10px 26px rgba(0,0,0,.1);
  translateY(-3px)`.
  - **Media** (top): `aspect-ratio:16/9`, with a 38px white rounded-10 **icon chip top-left**
    (#1e7e34 lucide icon 20px) and a bottom-left photo caption. **Women Empowerment** also gets a
    **"New" pill top-right** (Oswald uppercase 10px on **#f4a300**, radius 999px).
  - **Body** `padding:20px 22px 22px`: H3 Oswald 600 20px → summary Source Sans 3 15px line-height
    1.55 #3d433d (`margin-top:9px`) → "Learn more" link (Oswald uppercase `.06em` 13px 600 #1e7e34,
    `margin-top:16px`, `arrow-right`).
  - 6 cards + icons: Environment & Resilience (`leaf`) · Sustainable Agriculture (`wheat`) · Women
    Empowerment (`hand-heart`, New badge) · Education & Skilling (`graduation-cap`) · Health,
    Sanitation & Waste (`heart-pulse`) · Consultancy & HR Management (`briefcase`).
- **Footer link** (centered, `margin-top:40px`): **"View all programs"** as an outline button
  (`.btn--secondary`: 1.5px #1e7e34 border, transparent, #1e7e34; hover fills to white-on-green).

**TABLET:** **2-col** grid (3 rows × 6 cards), gap 24px. Header stays centered.

**MOBILE (<600):** Frame 3 — `section padding:40px 20px` on #f6f8f6. Eyebrow "What we do" + H2 26px.
**Single column, gap 16px.** NOTE the mobile frame shows only **3 cards** (Environment & Resilience,
Women Empowerment [New], Health Sanitation & Waste) followed by a full-width **"View all 6 programs"**
outline button. **Build decision:** render all 6 cards in the real single-column list (the 3-card
mobile frame is a design abbreviation, not a content cut) and keep the outline CTA labelled "View
all programs"; the content doc requires all six pillars present. Card on mobile: radius 13px, image
16:9, icon chip 34px, H3 19px, summary 15px.

---

### 3.6 Stories of transformation (carousel) — Frame 1 / Frame 3

**WEB (≥1200):** `section background:#fff`; container `padding:84px 40px`.
- **Header** centered (`max-width:640px`, `margin-bottom:40px`): eyebrow (both bars) "Stories of
  transformation"; H2 Oswald 600 36px "Real journeys, real change"; sub-line "Witness the powerful
  journeys of communities and individuals transformed through our programs."
- **Card:** one wide split card — `grid-template-columns:0.92fr 1.08fr`, `border:1px solid #e2e8e2;
  border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,.06)`.
  - **Left = image** (`min-height:340px`, placeholder stripe): **category badge top-left** (#1e7e34
    pill, white Oswald uppercase 11px, e.g. "Women Empowerment") + photo caption bottom-left.
  - **Right = quote panel** (`padding:42px 44px`, flex column, justify center): big decorative
    quote mark (Oswald 64px **#f4a300**) → quote (Source Sans 3 21px line-height 1.5 #1a1f1a weight
    500) → **author row** (48px circle avatar `#eef5ef` with #1e7e34 initials "LD"; name Oswald 600
    16px; meta Source Sans 3 14px #6b726b) → **controls row** (space-between): **dots** (active
    22×6px #1e7e34 pill, inactive 6px #cdd6cd) on the left + **arrows** on the right (two 40px
    circles: prev = 1px #e2e8e2 border, #6b726b `chevron-left`; next = filled #1e7e34, white
    `chevron-right`).
- Carousel holds **3 slides** (content doc §7), the visible one is slide 1 (Lakshmi Devi).

**TABLET:** single card; if the split feels cramped below ~lg, stack to **image on top / quote
below** (as mobile) — keep arrows + dots beneath.

**MOBILE (<600):** Frame 3 — `section padding:40px 20px`. Eyebrow + H2 26px. Card stacked: media
`aspect-ratio:16/10` with category badge top-left → quote panel `padding:22px` (quote mark 50px,
quote 17px, avatar 42px, name + short location "Dindigul"). **Dots centered below the card**
(active 20×5px #1e7e34, inactive 5px #cdd6cd); arrows may be omitted in favor of swipe + dots on
mobile (the mobile frame shows dots only).

---

### 3.7 Dual "Get involved" CTA band — Frame 1 / Frame 3

**WEB (≥1200):** `section background:linear-gradient(135deg,#1e7e34,#13311f)`; container
`padding:74px 40px`.
- **Header** centered (`margin-bottom:38px`): eyebrow **gold #f6c453** "Get involved"; H2 Oswald
  600 34px **white** "Whether you need support or want to give it".
- **Grid:** `1fr 1fr; gap:24px` — two white cards (`background:#fff; border-radius:16px;
  padding:34px 36px`). Each: 50px rounded-13 icon chip → H3 Oswald 600 23px #1a1f1a → body Source
  Sans 3 16px #3d433d (`margin:10px 0 22px`) → button.
  - **Box 1 "Are you looking for support?"** — green icon chip (`#eef5ef`/#1e7e34, `life-buoy`);
    button = **outline green** "Get help".
  - **Box 2 "Do you want to make a difference?"** — amber icon chip (`#fdebd6`/#e8590c,
    `heart-handshake`); button = **solid green** "Get involved".

**TABLET:** keep 2-col if text fits; otherwise stack to two rows, full-width buttons.

**MOBILE (<600):** Frame 3 — `background:linear-gradient(160deg,#1e7e34,#13311f)`; `padding:40px
20px`. Eyebrow gold "Get involved" + H2 24px "Need support, or want to give it?". **Cards stacked,
gap 14px** (`padding:24px 22px`, radius 15px): icon 46px, H3 20px ("Looking for support?" /
"Want to make a difference?"), full-width buttons min-height 46px.

---

### 3.8 "We have only one planet" dark counter band — Frame 1 / Frame 3

**WEB (≥1200):** `section background:#161d18; color:#fff`; container `padding:70px 40px`.
- **Header** centered (`max-width:600px`, `margin-bottom:40px`): 52px rounded-14 globe chip
  (`background:rgba(244,163,0,.14)`, color #f4a300, `globe` icon 28px) → H2 Oswald 600 32px white
  "We have only one planet" → sub Source Sans 3 16px `rgba(255,255,255,.72)` "It's time to wake up
  to the grim reality and get our act together."
- **Grid:** `repeat(4,1fr); gap:20px`. Each stat: `text-align:center; padding:22px 14px;
  border:1px solid rgba(255,255,255,.1); border-radius:14px; background:rgba(255,255,255,.03)` —
  number Oswald 700 **27px #f4a300** + label Oswald uppercase `.08em` 11.5px `rgba(255,255,255,.66)`
  (`margin-top:8px`).
- **Caption** centered below (Source Sans 3 13px `rgba(255,255,255,.5)`, `margin-top:22px`): "Live
  counters — figures animate upward on the live site."

**TABLET:** **2×2** grid, gap 16px; numbers ~23–24px.

**MOBILE (<600):** Frame 3 — `padding:38px 20px`; globe chip 46px; H2 24px; **2×2 grid** gap 12px;
number 21px; label 10px with shortened labels (World population · Waste dumped (t) · E-waste (t) ·
Earths used). Caption may be dropped on mobile (frame omits it) — keep it if room.

---

### 3.9 Footer (shared chrome — Home view) — Frame 1 / Frame 3

**WEB (≥1200):** `footer background:#11371b; color:#cfe3d4`. Top region: 1140 container
`padding:60px 40px 0; grid-template-columns:1.6fr 1fr 1.3fr 1fr; gap:40px`:
1. **Brand:** 38px white rounded-10 square with #1e7e34 `sprout`; wordmark Oswald 700 19px white;
   blurb Source Sans 3 14.5px line-height 1.6 #a8c4af `max-width:280px`.
2. **Quick Links** (H4 Oswald uppercase `.08em` 14px white): About Us · Our Programs · Careers ·
   Donate (links #a8c4af → hover #fff, gap 11px).
3. **Contact Us:** rows with `map-pin` / `mail` / `phone` icons (17px) — address, email, phone.
4. **Follow Us:** three 40px rounded-10 social tiles (`background:rgba(255,255,255,.08)`, hover
   `#1e7e34`) — Facebook, X (twitter), Instagram (inline SVGs already in the frame).
- **Bottom bar:** `padding:22px 40px; margin-top:44px; border-top:1px solid rgba(255,255,255,.12)`,
  flex space-between, Source Sans 3 13px #8fae97: "© 2026 Coodu Trust. All rights reserved." +
  Privacy / Terms links.

**TABLET:** 2×2 column grid; bottom bar may stack.

**MOBILE (<600):** Frame 3 — `padding:36px 20px 22px`, **single column**: brand + blurb → a
contact block (top hairline border, the three icon rows) → social row → centered copyright (12.5px).

---

### 3.10 Mobile nav drawer — Frame 4 (mobile only)

- **Scrim:** `position:fixed; inset:0; background:rgba(8,18,11,.55)` over the dimmed page; click to
  close.
- **Drawer:** `aside` pinned right, `width:328px`, `background:#fff`, `box-shadow:-12px 0 40px
  rgba(0,0,0,.25)`, flex column, slides in from the right.
  - **Header row:** logo (34px) + wordmark + 36px close (`x`) button.
  - **Nav** (Oswald uppercase `.03em` 15px 500, `padding:8px 14px`): **Home active** = `background:
    #f0f6f1; color:#1e7e34; border-radius:9px` with a small **amber dot** indicator; other items
    #3d433d, `padding:12px 14px`. **Programs** expanded (`chevron-up`) reveals an indented sub-list
    (`border-left:2px solid #e2e8e2`, Source Sans 3 14px, **not uppercase**) of the 6 categories;
    active sub-item #1e7e34 weight 600. **Get Involved** collapsed (`chevron-down`). Then Documents,
    Media, Contact.
  - **Footer of drawer** (top hairline): full-width accent **"Donate now"** button (#e8590c,
    min-height 48px, `heart`) + phone line beneath (`phone` icon + +91-451-2461362).

---

## 4. Content to populate (verbatim — preserve exactly)

> Casing may be normalized out of all-caps; wording, numbers, ₹ amounts, and links must NOT change.
> Where the desktop and mobile frames differ in length, **use the desktop copy as canonical** and
> the mobile copy only as a documented short variant.

**Meta:** title `Coodu Trust - Empowering Communities, Transforming Lives`; description `Coodu Trust
is a non-profit organization dedicated to women empowerment, health, environmental sustainability,
and livelihood development in India.`

**Hero (A):** eyebrow "Rural development across Tamil Nadu · since 2000" · H1 "Empowering
communities, transforming lives" · subtitle (desktop) "Join us in building a sustainable, equitable
future for rural communities — through empowerment, health, livelihoods and environmental action."
(mobile short: "Building a sustainable, equitable future for rural communities — through
empowerment, health and the environment.") · CTAs "Discover our work" → `#programs` and "Donate" →
`donate.html` · trust line "Dindigul, Tamil Nadu · 20+ years of field work".

**Impact (4 stats):** 3,81,609+ Total beneficiaries · 534 Panchayats served · 18,523+ Toilets built
· 26,93,250 Trees planted. Caption "Cumulative results across 20+ years of field work."

**Who we are:** eyebrow "Who we are" · H2 "Community. Compassion. Collaboration." · body "The mission
of Coodu Trust is to improve the quality of life for economically disadvantaged individuals —
providing the resources to raise their standard of living, foster self-improvement, and maximise
self-empowerment." · button "Learn more about us" → `about.html` · video YouTube `wrG63C0qtxg`
(title "Introduction to COODU TRUST").

**Core programs:** eyebrow "What we do" · H2 "Our core programs" · sub "Six interlinked pillars that
move families from vulnerability toward lasting self-reliance." · 6 cards:
1. **Environment & Resilience** — "Climate-resilient communities through conservation, renewable
   energy and sustainable development." → `programs/environment-resilience.html`
2. **Sustainable Agriculture** — "Organic farming, watershed management and modern techniques that
   lift food security and incomes." → `programs/sustainable-agriculture.html`
3. **Women Empowerment** *(New badge)* — "Self-help groups, microfinance and enterprise support so
   women can lead and earn independently." → `programs/women-empowerment.html`
4. **Education & Skilling** — "Quality education, vocational training and skill-building for
   dignified, sustainable employment." → `programs/education-skilling.html`
5. **Health, Sanitation & Waste** — "Healthcare access, sanitation facilities and waste management
   that keep rural families healthy." → `programs/health-sanitation.html`
6. **Consultancy & HR Management** — "Expert consultancy and HR solutions for organisational
   development and capacity building." → `programs/consultancy-hr.html`
- Card link text "Learn more →". Footer button "View all programs" → `programs.html`.

**Stories (3, verbatim quotes — carousel):**
- **Women Empowerment** — "Coodu Trust's skill development program changed my life completely. I
  learned tailoring and now I run my own small business, supporting my family independently. My
  monthly income has increased from ₹2,000 to ₹8,000." — **Lakshmi Devi**, Women Empowerment
  Program · Dindigul. *(Design abbreviates this; ship the full content-doc quote.)*
- **Health & Sanitation** — "Before Coodu Trust came to our village, we had to walk 3 kilometers for
  clean water. Now with the new water system and sanitation facilities, our children are healthier
  and our women save 2 hours daily." — **Murugan S.**, Village Head · Karur District.
- **Sustainable Agriculture** — "The organic farming training helped us reduce our costs by 40% and
  increase crop yield by 25%. We no longer depend on expensive chemical fertilizers and our soil
  health has improved significantly." — **Raman Kumar**, Farmer · Environmental Program.

**Dual CTA:** eyebrow "Get involved" · H2 "Whether you need support or want to give it" ·
Box 1 "Are you looking for support?" / "Discover the programs and resources we offer to communities
across the district." / "Get help" → `contact.html` · Box 2 "Do you want to make a difference?" /
"Join us as a volunteer, partner or donor and help transform lives across Tamil Nadu." / "Get
involved" → `get-involved.html`.

**Planet band:** globe · H2 "We have only one planet" · sub "It's time to wake up to the grim
reality and get our act together." · counters 8,192,242,010 World population · 1,198,948,812 Tonnes
of waste dumped · 28,277,094 Tonnes of e-waste · 1.72 Earths humanity uses · caption "Live counters
— figures animate upward on the live site."

**Footer:** blurb "A registered non-profit working towards sustainable development in Tamil Nadu,
India since 2000." · Quick Links: About Us `about.html`, Our Programs `programs.html`, Careers
`careers.html`, Donate `donate.html` · Contact: "H-83, R.M. Colony, Dindigul – 624 001, Tamil
Nadu, India" / director@coodutrust.org (`mailto:`) / +91-451-2461362 (`tel:+914512461362`) · Social:
Facebook, X, Instagram · copyright "© 2026 Coodu Trust. All rights reserved." (design uses 2026 —
update from the legacy 2025) · Privacy / Terms.

**Header:** nav Home / About / Programs ▾ / Get Involved ▾ / Documents / Media / Contact · Donate →
`donate.html`. Programs mega-menu = the 6 categories + sub-items from content doc §1 (full link map).

---

## 5. Components (shared design system — token-referenced)

> All values below are the literal design values, mapped to the `tokens.css` custom properties from
> Style Gate §2.2. Components are defined once and reused on all pages. **No inline styles, no
> `!important`, no per-page hexes** — every value resolves to a token. Several design colors are NOT
> yet in the gate's starter `:root`; **add the tokens marked "NEW" below.**

### 5.1 Tokens to put in `tokens.css`
```
/* color — existing in gate */
--color-primary:#1e7e34;  --color-primary-dark:#155d27;
--color-accent:#e8590c;   --color-accent-dark:#c2410c;   /* NEW: accent-dark */
--surface:#ffffff;        --surface-alt:#f6f8f6;
--border:#e2e8e2;         --border-light:#eef1ee;          /* NEW: hairline-on-alt */
--text-strong:#1a1f1a;    --text-body:#3d433d;             --text-muted:#6b726b;
/* color — NEW (used across hero/stories/planet/footer) */
--amber:#f4a300;          --gold:#f6c453;                  --amber-text:#c47f00;
--tint-green:#eef5ef;     --tint-amber:#fdebd6;
--hero-from:#2c5a3c;      --hero-to:#12301e;   /* mobile hero-to:#10271a */
--scrim-x:linear-gradient(90deg,rgba(8,26,15,.9),rgba(8,26,15,.62) 46%,rgba(8,26,15,.18));
--scrim-y:linear-gradient(180deg,rgba(8,26,15,.5),rgba(8,26,15,.82));
--planet-bg:#161d18;
--footer-bg:#11371b; --footer-text:#cfe3d4; --footer-muted:#a8c4af; --footer-faint:#8fae97;
/* type */
--font-display:"Oswald",system-ui,sans-serif;
--font-body:"Source Sans 3",system-ui,sans-serif;   /* NOTE: gate starter said Inter; the
                                                       approved design uses Source Sans 3 — use it */
/* shape + shadow */
--radius-btn:8px; --radius-card:12px; --radius-card-lg:14px; --radius-card-xl:16px; --radius-pill:999px;
--shadow-1:0 2px 8px rgba(0,0,0,.06);
--shadow-2:0 8px 24px rgba(0,0,0,.10);
--shadow-card-hover:0 10px 26px rgba(0,0,0,.10);
--shadow-float:0 14px 34px rgba(0,0,0,.09);
--shadow-cta:0 2px 8px rgba(232,89,12,.28);
--maxw:1140px; --maxw-text:560px;
--dur:180ms; --ease:cubic-bezier(.2,.6,.2,1);
```
> Two font weights actually used: Oswald 500/600/700, Source Sans 3 400/500/600/700. Load only those.

### 5.2 Button (`button.css`)
- `.btn` base: inline-flex, gap 9px, Oswald 600, 15px (header 14px), uppercase, `.04em` (header
  `.05em`), radius `--radius-btn`, **`min-height:44px`** (mobile 48px), `transition:var(--dur)
  var(--ease)`; optional leading/trailing lucide icon.
- `.btn--primary`: `background:var(--color-primary)`; text #fff; `padding:15px 28px` (mission 14px
  26px); hover `background:var(--color-primary-dark); translateY(-1px)`.
- `.btn--secondary` (outline): transparent, `border:1.5px solid var(--color-primary)`, text
  primary; `padding:13px 28px`; hover fills `background:var(--color-primary); color:#fff`.
- `.btn--cta` (Donate): `background:var(--color-accent)`; #fff; `padding:12px 22px`;
  `box-shadow:var(--shadow-cta)`; hover `background:var(--color-accent-dark); translateY(-1px)`.
- `.btn--ghost-on-dark` (hero secondary): transparent, white, `border:1.5px solid
  rgba(255,255,255,.6)`; hover `background:#fff; color:var(--hero-to)`. (Mobile hero replaces this
  with `.btn--cta` solid accent.)
- `.btn--link`: Oswald uppercase `.06em` 13px 600, primary color, trailing `arrow-right`.

### 5.3 Card (`card.css`) — program preview
- `.card`: a single `<a>`; `background:var(--surface); border:1px solid var(--border);
  border-radius:var(--radius-card); box-shadow:var(--shadow-1); overflow:hidden; display:flex;
  flex-direction:column`. Hover `box-shadow:var(--shadow-card-hover); translateY(-3px)`
  (+ image zoom 1.03, reduced-motion off).
- `.card__media`: `aspect-ratio:16/9`; holds `.card__chip` (38px white rounded-10 icon, top-left)
  and optional `.card__badge` ("New", amber pill top-right).
- `.card__body` `padding:20px 22px 22px`: `.card__title` (Oswald 600 20px #1a1f1a) → `.card__desc`
  (Source Sans 3 15px/1.55 #3d433d) → `.btn--link`.

### 5.4 Stat blocks (`stats.css`)
- `.stat` (Impact, light): center; icon chip 46px `--tint-green`/primary; `.stat__num` Oswald 700
  32px #1a1f1a (count-up target); `.stat__label` Oswald uppercase `.09em` 12px #6b726b. In the
  desktop band, cells are divided by `border-right:1px solid var(--border-light)`; on mobile each is
  a bordered card.
- `.stat--dark` (Planet): bordered tile on `--planet-bg`; `.stat__num` Oswald 700 27px **--amber**;
  `.stat__label` uppercase `.08em` 11.5px `rgba(255,255,255,.66)`.

### 5.5 Testimonial / carousel (`carousel` in `gallery.css`)
- `.story` split card (`grid 0.92fr 1.08fr`, radius `--radius-card-xl`, `--shadow-2`):
  `.story__media` (category `.badge` top-left, primary pill) + `.story__panel` (`padding:42px 44px`)
  = `.story__mark` (Oswald 64px --amber) + `.story__quote` (Source Sans 3 21px/1.5 #1a1f1a w500) +
  `.story__author` (48px `--tint-green` avatar + name Oswald 600 16px + meta 14px #6b726b) +
  `.story__controls` (dots + two 40px arrow circles).
- `.dots`: active = 22×6px primary pill; inactive = 6px `#cdd6cd` circle.
- `.arrow`: 40px circle; prev = 1px `--border` / #6b726b; next = filled primary / #fff.

### 5.6 Section primitives & other shared bits (`layout.css`)
- `.section` (vertical padding tokens, banding modifiers `.section--alt` #f6f8f6, `.section--dark`
  planet, gradient CTA), `.container` (`max-width:var(--maxw)`, gutter `clamp(20px,5vw,40px)`),
  `.grid` helpers, `.eyebrow` (bar(s) + Oswald uppercase `.16em` 13px 600 — primary green default,
  `--gold` on dark), `.media-embed` (responsive 16:9 wrapper), `.pill`/`.badge`, `.icon-chip`.
- **Header / drawer** → `header.css`; **footer** → `footer.css`; **hero** → `hero.css`. All shared.

---

## 6. Image slots (placeholders in the design → real photos at build)

> Design uses diagonal-hatch placeholders with a mono caption naming the intended subject. Every
> `<img>` needs meaningful `alt`, explicit `width/height` or `aspect-ratio`, `loading="lazy"` +
> `decoding="async"` below the fold, and Cloudinary-sized transforms (not full-res).

| Slot | Ratio | Subject (from design caption) |
|---|---|---|
| Hero A background (rotating, ~5 slides) | full-bleed (≈16:9 cropped to section) | "farmers / community · warm natural light" — field/community photos |
| Hero B image card (alternate) | 4:3 | "women's collective / field" |
| Who-we-are video | 16:9 | YouTube `wrG63C0qtxg` thumbnail / facade → iframe |
| Program card 1 | 16:9 | watershed / plantation |
| Program card 2 | 16:9 | farmer in field |
| Program card 3 (Women Emp.) | 16:9 | women's SHG |
| Program card 4 | 16:9 | vocational training |
| Program card 5 | 16:9 | health camp / sanitation |
| Program card 6 | 16:9 | training workshop |
| Story slide image (desktop) | ~tall, `min-height:340px` | "Lakshmi Devi in her tailoring workshop" (+ Murugan water facility, Raman organic farm) |
| Story slide image (mobile) | 16:10 | same |
| Partner logos (Hero B strip) | ~96×26 each | partner/funder wordmarks (only if real assets exist) |
| Footer / header logo | square | sprout-mark + "Coodu Trust" (design renders the mark as an icon chip, not the legacy PNG) |

**Subject fixes carried from the content doc:** give the Education and Consultancy cards their own
correct photos (legacy reused a women-emp photo and a team headshot); do not fabricate partner logos.

---

## 7. Interactions & motion + accessibility

**Interactions / motion** (calm, 150–200ms, `--dur`/`--ease`; color + transform only):
- **Hero slideshow:** ~5 slides, slow crossfade auto-advance; dots are real `<button>`s that jump to
  a slide; pause on hover/focus; honor reduced-motion (no auto-advance — show slide 1, dots still
  navigate).
- **Card hover:** lift (`translateY(-3px)`) + deeper shadow + image zoom `scale(1.03)` (zoom off
  under reduced-motion).
- **Stories carousel:** prev/next arrows + dots, autoplay with **pause-on-hover/focus**; swipe on
  touch; reduced-motion disables autoplay. Each slide change updates `aria-live="polite"` politely
  or moves focus appropriately; arrows are `<button aria-label="Previous story / Next story">`.
- **Count-up counters:** Impact (4) and Planet (4) animate from 0 → target when scrolled into view
  (IntersectionObserver). Numbers keep their formatting (Indian grouping for impact, thousands
  separators for planet, `1.72` not animated as integer). Reduced-motion → render final value
  immediately.
- **Mobile drawer:** slide-in from right + scrim fade; `aria-expanded` on the hamburger, focus trap
  while open, `Esc` closes, background `inert` + scroll-locked, focus returns to the toggle on close.
- **Header:** sticky; subtle shadow/border on scroll is acceptable (optional).
- **Buttons/links hover:** primary darken+lift, outline fill, ghost invert, link arrow nudge.

**Accessibility (Style Gate §2.5 — enforce):**
- Landmarks: skip-link first, one `<header>`, `<nav aria-label>`, **one `<main>`**, `<section>`s
  with `aria-labelledby` pointing at each H2, `<footer>`. Exactly **one `<h1>`** (hero); H2 per
  section; no skipped levels. Rename the legacy footer `id="contact"` collision (e.g.
  `id="site-footer"`).
- Real elements: program cards = `<a>`; carousel/drawer controls = `<button>`; stats numbers in
  text; lists are `<ul>/<ol>`. Decorative icons `aria-hidden="true"`; decorative placeholder images
  `alt=""`.
- **Contrast:** white text on the hero must clear 4.5:1 — the left scrim (`--scrim-x`) provides it;
  verify on the lightest slide. Green #1e7e34 on white = OK for large/headings; check the
  `.btn--link` 13px green (passes ~5:1). Amber #f4a300 numbers on the near-black planet band pass;
  do **not** put amber on white as body text. Footer #a8c4af on #11371b passes for body.
- **Touch targets ≥ 44×44** (mobile 48): all buttons, nav links, dots, arrows, drawer toggle, social
  tiles (40px tiles → pad hit-area to 44).
- **Focus:** visible `:focus-visible` ring using `--color-primary` (offset on light, white ring on
  dark bands); never bare `outline:none`.
- `prefers-reduced-motion`: disables slideshow autoplay, carousel autoplay, count-up, and card/image
  zoom.
- `<html lang="en">`. Body never below 16px on mobile.

---

## 8. Build notes

- **Semantic skeleton:**
  `header.site-header` → `main` { `section.hero` (h1) · `section.impact` · `section.about`
  (who-we-are+video) · `section.programs` · `section.stories` · `section.cta-band` ·
  `section.planet` } → `footer.site-footer`, plus the off-canvas `aside.nav-drawer` + scrim. Each
  `section` gets `aria-labelledby`.
- **Reuse shared components, don't redefine:** `header.css` (nav + mega-menu + drawer), `footer.css`,
  `hero.css`, `button.css`, `card.css`, `stats.css`, carousel (`gallery.css`), `layout.css`. Page-
  specific CSS in `pages/home.css` should be near-empty — composition only. Page links **only**
  `assets/css/main.css`.
- **Header/footer = single source of truth** (Style Gate §2.4): one `partials/header.html` +
  `partials/footer.html`, included at build or injected at runtime; active state via `data-page`
  on `<body>`. Do not hand-copy.
- **Font correction:** the gate's starter `:root` examples list Inter for body, but the **approved
  design uses Source Sans 3** (with Oswald display). Set `--font-body:"Source Sans 3"` in
  `tokens.css` to match. This is the one place the design diverges from the gate's placeholder code.
- **Tricky bits:**
  1. **Impact band overlaps the hero** via `margin-top:-54px; z-index:3` on desktop — the Impact
     section's `<section background:#fff>` must sit directly after the hero with no gap, and the
     overlap must collapse to 0 on mobile (and likely tablet). Build as a modifier, not a magic
     number scattered around.
  2. **Hero placeholder vs. real photo:** the diagonal hatch = the photo slot. Real build layers
     `photo → texture(optional) → scrim → content`. Keep the scrim as a token (`--scrim-x` desktop,
     `--scrim-y` mobile) so contrast is guaranteed on every slide.
  3. **Mobile programs shows 3 cards in the frame** — that is a design abbreviation; **render all 6**
     (single column) in the real page; the "View all programs" button stays.
  4. **Mobile copy is shortened** for hero subtitle, mission body, and the Lakshmi Devi quote — treat
     desktop copy as canonical; only use the short variants if a deliberate responsive copy swap is
     wanted (otherwise ship the full content-doc text at every width).
  5. **Two CTA color rules:** hero secondary is a **ghost** button on desktop (dark hero) but a
     **solid accent** on mobile; the CTA-band Box 2 button is solid green; Donate in header/drawer is
     accent. Encode these as button modifiers, not ad-hoc styles.
  6. **Remove the legacy overlay hack entirely** — no body background photo, no fixed white overlay,
     no `background:transparent !important`. Banding is intentional (`--surface` / `--surface-alt` /
     dark bands).
  7. **Responsive YouTube:** drop the legacy `width=1803 height=1014`; use a 16:9 `.media-embed`
     wrapper (`aspect-ratio:16/9`) with a click-to-load facade for performance.
  8. **Counters formatting:** keep Indian digit grouping on Impact (3,81,609+ / 26,93,250) and
     comma thousands on Planet; `1.72` is a decimal, not an integer count-up.
- **Definition of done** (Style Gate §2.7): semantic landmarks ✓, one `<h1>` ✓, zero inline styles /
  `<style>` ✓, shared header/footer ✓, only tokenized values ✓, mobile + desktop match the renders
  ✓, keyboard-navigable with visible focus ✓, contrast ✓, 44px targets ✓, images lazy + sized ✓, no
  console errors ✓.
