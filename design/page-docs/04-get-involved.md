# Get Involved — Design Doc

> Governs the **Get Involved landing/hub page** of the COODU Trust NGO website (Dindigul, Tamil Nadu).
> Hand this, together with the filled **Style Gate** (`design/REDESIGN-STYLE-GATE.md`), to Claude design (browser) to produce **WEB + TABLET + MOBILE** designs. Then rebuild the real page cleanly from those designs.

---

## 1. Identity

- **File:** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/get-involved.html`
- **Real page it represents:** the public **Get Involved** landing page, reachable from the main nav (`get-involved.html`, nav link has `class="nav-link active"`). It is the parent of a 3-item nav dropdown: **Volunteer** (`volunteer.html`), **Partner with Us** (`partner.html`), **Donate** (`donate.html`).
- **COVERAGE:** **Covers 1 page.** This is a standalone hub page, **not** a template. The three destinations it links to (`volunteer.html`, `partner.html`, `donate.html`) are separate, content-heavy pages with their own forms/flows and their own page-docs — do **not** fold them into this doc. This doc is only the "choose-your-path" hub.
- **One-line role/job:** A short, scannable **decision hub** that presents the three ways to support COODU Trust (Partner, Volunteer, Donate) and routes each visitor to the right action page.

---

## 2. Current structure (AS-IS) — section by section

The page is unusually short: header chrome, a page-header banner, a single 3-card section, footer chrome. Top-to-bottom:

### 2.0 `<body>` background treatment (page-level, not a section)
- Inline style on `<body>`: a **fixed full-page background photo** (`.../aboutus/background.jpg` on Cloudinary) with `background-size: cover; background-position: center; background-attachment: fixed`.
- Plus a **fixed white overlay div** at `z-index:-1` with `background: rgba(255,255,255,0.4)` to wash the photo out so text stays readable.
- Net effect: the whole page sits on a faint, washed-out photographic backdrop rather than a flat surface. (This is inline-style soup — see §3.)

### 2.1 Header / Nav — `header.header`
- Shared chrome. Logo (`coodu_frontlogo.png`) + wordmark "Coodu Trust"; full nav menu (Home, About, Programs▾ [6 sub-categories, each with its own submenu], **Get Involved▾** [Volunteer / Partner with Us / Donate] — currently `active`, Documents, Media, Contact); a standalone **Donate** primary button; hamburger for mobile.
- **Documented in the shared-chrome doc — reference only, do not redesign here.** Note: the "Get Involved" nav item is the `.active` state on this page.

### 2.2 Page Header banner — `section.page-header`
- **Purpose:** title banner / visual entry.
- **Background:** `background-image: url('assets/images/headers/get-involved-header.jpg')` (LOCAL asset, not Cloudinary — unlike the rest of the page). `.page-header::before` lays a `rgba(0,0,0,0.2)` dark scrim over it; padding `100px 0`, centered, light text.
- **Content:**
  - `h1.page-title` — **"Get Involved"** (3.5rem)
  - `p.page-subtitle` — **"Together, we can create a world of opportunity and self-reliance."** (1.2rem, normal case)
- **Components:** hero/banner with title + subtitle. No CTA in the banner.

### 2.3 Get Involved section — `section.get-involved-section.section-padding`
- Inline `style="background: transparent !important;"` so the body backdrop photo shows through this section.
- **2.3a Intro block — `div.story-intro`**
  - `h2.section-title` — **"Join Us in Our Mission"**
  - `p.section-intro-text` — the intro paragraph (full text in §4).
- **2.3b Card grid — `div.get-involved-grid`** (`display:grid; grid-template-columns: repeat(3,1fr); gap:30px; margin-top:50px`)
  - **3 × `div.involve-card`** — white card, `border-radius`, soft shadow, hover lift (`translateY(-5px)`), equal-height flex column. Each card =
    - `img.involve-card-img` (full-width, `height:220px`, `object-fit:cover`)
    - `div.involve-card-content` (centered text, flex column): `h3` (green, 1.8rem) + `p` (body copy, `#555`) + `a.btn.btn-primary` pinned to the bottom (`margin-top:auto`).
  - **Card 1 — Partner with Us:** image `partner-with-us.png`; heading "Partner with Us"; body about CSR/institutional partnerships; button **"Become a Partner"** → `partner.html`.
  - **Card 2 — Volunteer:** image `volunteer.png`; heading "Volunteer"; body about time/skills/fieldwork; button **"Volunteer With Us"** → `volunteer.html`.
  - **Card 3 — Donate:** image `donate.png`; heading "Donate"; body about financial support; button **"Make a Donation"** → `donate.html`.
- **Components:** section intro + 3-up card grid (image-top cards with CTA buttons).

### 2.4 Footer — `footer.footer`
- Shared chrome: 4-column footer (logo + about blurb; Quick Links; Contact Us address/email/phone; Follow Us social icons) + `footer-bottom` copyright.
- **Documented in the shared-chrome doc — reference only.** (Contact details restated in §4 because they are load-bearing copy.)

> **That is the entire page.** Below the banner there is exactly ONE content section (intro + 3 cards). It is thin.

---

## 3. Current weaknesses (be specific & honest)

1. **The page is too thin / does almost no selling.** One paragraph + three small cards is all there is between the banner and the footer. A "Get Involved" hub is a conversion page; right now it gives a donor or CSR partner almost no reason to act and no proof.
   **Fix:** keep the 3-path chooser as the spine, but add (a) a short "why your involvement matters" impact strip with 3–4 stat figures, (b) richer per-path cards (1-line "what you'll do" + a tiny benefit list), and (c) a closing CTA band. See §5.

2. **Inline-style soup + `!important` hacks.** Body background photo, the fixed white-overlay `<div>`, and `style="background: transparent !important;"` are all inline. This is exactly the overlay-hack pattern the Style Gate bans.
   **Fix:** rebuild with a clean surface from the Style Gate (flat `--surface` / `--surface-alt` band) — drop the global background photo + white wash entirely, or replace it with one intentional, tasteful section background.

3. **Washed-out photographic backdrop hurts legibility and looks accidental.** A 40%-white veil over a fixed photo gives a muddy, low-contrast field behind white cards; the cards barely separate from it. Off-brand and "busy."
   **Fix:** put cards on a clean light surface (`--surface` / `--surface-alt`) with the Style-Gate hairline border + soft shadow so they read as crisp, deliberate cards.

4. **Mixed asset sources / fragile images.** Card images are Cloudinary `.png`s; the banner is a LOCAL `.jpg` (`assets/images/headers/get-involved-header.jpg`). If the local header is missing the banner collapses to a flat scrim.
   **Fix:** standardize to one source, confirm the header image exists, and define a banner fallback (solid green-gradient block with the title) so the hero never breaks.

5. **Weak visual hierarchy between the three paths.** All three cards are visually identical, but the three actions are not equal in commitment or in priority for COODU. There's no signal of "start here."
   **Fix:** make **Donate** the visually dominant / accent-colored card (matches the Style Gate's "Donate = the one accent action") while Partner and Volunteer use the standard card style. Order/emphasis per §5.

6. **CTA color is generic.** All three buttons are `btn-primary` (green). The Donate action — the highest-value conversion — doesn't stand out from "Become a Partner."
   **Fix:** Donate button uses the Style-Gate **accent/CTA** color; the other two stay primary/secondary.

7. **Card body copy is set via `text-transform:none` overrides** — implying the global body style elsewhere is all-caps. On a redesigned system this should be normal sentence case by default.
   **Fix:** sentence-case body text as the system default (Style Gate already specifies this); no per-element override.

8. **No trust / no "what happens next."** Nothing tells a hesitant visitor that COODU is a registered 20+-year NGO, or what occurs after they click. For a charity hub this is a missed credibility moment.
   **Fix:** add a thin trust line ("Registered non-profit, working across Tamil Nadu since 2000") and a one-line "what to expect" under each path.

9. **Banner subtitle is the only emotional hook and it's generic.** It's fine, but it's doing 100% of the persuasion.
   **Fix:** keep the line, but support it with the impact strip and a human photo so the emotion is earned, not asserted.

---

## 4. Content — source of truth (PRESERVE this)

> Preserve this copy verbatim in the redesign. Numbers, names, link targets and button labels must not be paraphrased.

### Banner
- **Page title (H1):** `Get Involved`
- **Subtitle:** `Together, we can create a world of opportunity and self-reliance.`

### Intro block
- **Section title (H2):** `Join Us in Our Mission`
- **Intro paragraph:** `There are many ways to support the work of Coodu Trust. Whether you are an individual, a corporation, or an institution, your contribution can help us empower communities and build a sustainable future. Explore the options below to find out how you can make a difference.`

### Card 1 — Partner with Us
- **Heading (H3):** `Partner with Us`
- **Body:** `Collaborate with us on CSR initiatives, institutional partnerships, and large-scale development projects. Let's work together to achieve shared goals and create lasting impact.`
- **Button:** `Become a Partner` → `partner.html`
- **Image:** `https://res.cloudinary.com/dvxbg6to3/image/upload/v1754480830/coodu-trust/images/get-involved/partner-with-us.png` (alt: "Partner with Coodu Trust for community impact")

### Card 2 — Volunteer
- **Heading (H3):** `Volunteer`
- **Body:** `Lend your time and skills to make a direct impact. We welcome individuals and groups to support our fieldwork, assist with events, or provide professional expertise.`
- **Button:** `Volunteer With Us` → `volunteer.html`
- **Image:** `https://res.cloudinary.com/dvxbg6to3/image/upload/v1754480275/coodu-trust/images/get-involved/volunteer.png` (alt: "Volunteer with Coodu Trust community programs")

### Card 3 — Donate
- **Heading (H3):** `Donate`
- **Body:** `Your financial support fuels our programs and allows us to reach more communities in need. Every contribution, large or small, helps transform lives.`
- **Button:** `Make a Donation` → `donate.html`
- **Image:** `https://res.cloudinary.com/dvxbg6to3/image/upload/v1754478670/coodu-trust/images/get-involved/donate.png` (alt: "Donate to support Coodu Trust programs")

### Banner background image
- `assets/images/headers/get-involved-header.jpg` (LOCAL; dark `rgba(0,0,0,0.2)` scrim over it)

### Footer (shared chrome — restated because it's load-bearing)
- **About blurb:** `Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000.`
- **Quick Links:** About Us (`about.html`), Our Programs (`programs.html`), Careers (`careers.html`), Donate (`donate.html`)
- **Address:** `H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.`
- **Email:** `director@coodutrust.org` (`mailto:director@coodutrust.org`)
- **Phone:** `+91-451-2461362` (`tel:+914512461362`)
- **Social:** Facebook, Twitter, Instagram (hrefs currently `#`)
- **Copyright:** `© 2025 Coodu Trust. All Rights Reserved.`

> **No stats, testimonials, or impact numbers exist on this page today.** Any figures proposed in §5 are *new* content the user must supply/approve — do not invent numbers as fact.

---

## 5. Enhancement direction (TO-BE) — opinionated

Keep the 3-path chooser as the heart of the page, but turn a thin "menu" into a genuine conversion hub. Proposed top-to-bottom structure:

1. **Banner (keep, upgrade):** same H1 "Get Involved" + subtitle. Use a real, warm photo of COODU's people/field (not a washed veil), with a Style-Gate green→dark-green gradient scrim for legible white text. Add a fallback solid-gradient block so it never breaks. Optionally add two quiet anchor chips ("Partner", "Volunteer", "Donate") that smooth-scroll to the cards.

2. **Intro block (keep, tighten):** keep H2 "Join Us in Our Mission" + the intro paragraph verbatim. Constrain measure to ~60–70ch, centered, generous top/bottom whitespace.

3. **NEW — Impact / "why get involved" strip (add):** a slim band (3–4 figures) giving a reason to act before the choice — e.g. years active (since 2000 → "20+ years"), communities/programs reached, volunteers, lives touched. **Numbers must come from the user** (the page currently has none). If unavailable, fall back to a single trust line: "A registered non-profit working across Tamil Nadu since 2000." Pull from the Style Gate's stat-card pattern so it matches Home/About.

4. **The 3-path cards (keep content, restructure & differentiate):**
   - Preserve all three headings, bodies, buttons, links and images from §4.
   - **Differentiate by priority:** make **Donate** the dominant card — accent-colored CTA button (Style-Gate accent), slightly stronger border/elevation, or an "easiest way to help" micro-label. Partner and Volunteer use the standard primary/secondary card style.
   - **Recommended order:** Donate → Volunteer → Partner (low-effort to high-commitment), *or* keep current Partner → Volunteer → Donate order if the user prefers leading with CSR partners. Flag as the user's call.
   - **Enrich each card** with one micro-line of "what you'll do / what happens next" under the body (e.g. Partner: "We'll set up a call within 2 working days." Volunteer: "Fill a short form — we match you to a program." Donate: "Secure online payment, instant receipt."). Keep them short and honest; the user confirms wording.
   - Consistent image ratio across all three (currently all `220px` tall, cover — keep ~16:10).

5. **NEW — Closing CTA band (add):** a full-width green band repeating the strongest line ("Together, we can create a world of opportunity and self-reliance.") with one primary button → `donate.html` and a secondary ghost link → `contact.html` ("Talk to us first"). Gives the page a confident finish before the footer instead of dropping straight into it.

6. **Remove:** the global `<body>` background photo, the fixed white-overlay div, and the `background:transparent !important` hack. Replace with clean Style-Gate surfaces and intentional section banding (alternate `--surface` / `--surface-alt`).

7. **Accessibility / polish:** keep descriptive alts (already good); ensure button labels stay action-first; give the Donate card AA-contrast accent; add `:focus-visible` rings from the Style Gate.

**▶ YOUR ENHANCEMENT NOTES: ____**
*(e.g. exact impact numbers to use, card order Partner-first vs Donate-first, whether to add the closing CTA band, whether to add the "what happens next" micro-lines.)*

---

## 6. Three-viewport layout spec (the core deliverable)

Global: max content width via `.container` (Style-Gate container width, ~1140–1200px, centered). Sections use Style-Gate `--section-padding` vertical rhythm. Cards use Style-Gate radius/shadow/hairline. Clean flat surfaces — no fixed background photo.

### WEB (desktop, >= 1025px)
- **Nav:** full horizontal nav, "Get Involved" shown active; standalone Donate button at right. (Shared chrome.)
- **Banner:** full-bleed, ~360–420px tall, background photo + green gradient scrim; H1 (~3.5rem) + subtitle centered, stacked, generous padding (~100px 0). Optional 3 anchor chips below subtitle.
- **Intro block:** centered, single column, max ~70ch, ~64px top padding.
- **Impact strip (new):** one row, **4 equal columns** of stat figures (big number + small label), divided by hairlines; sits on `--surface-alt` band.
- **Card grid:** `grid-template-columns: repeat(3, 1fr); gap: ~30px; margin-top: ~50px`. Image-top cards, equal height (flex column), button pinned bottom. Donate card visually emphasized (accent button). Hover: lift `translateY(-5px)` + deeper shadow.
- **Closing CTA band (new):** full-width green band, centered headline + 1 primary + 1 ghost button on one row.
- **Footer:** 4-column. (Shared chrome.)

### TABLET (768–1024px)
- **Nav:** condenses toward hamburger per shared chrome breakpoint.
- **Banner:** ~300–340px tall; H1 ~2.6–3rem; subtitle wraps to 2 lines comfortably.
- **Intro:** single column, padding reduced (~48px).
- **Impact strip:** **2 × 2 grid** of stats (or a single row of 4 if they fit without crowding).
- **Card grid:** **2 columns** (`repeat(2,1fr)`, gap ~25px) — matches existing `max-width:1024px` rule. Third card (Donate) wraps to a second row; let it span full width OR center it — recommend Donate spans both columns as a wider emphasized card so it doesn't sit alone awkwardly.
- **Closing CTA band:** headline stacks above buttons; buttons side by side.
- **Footer:** 2-column. (Shared chrome.)

### MOBILE (<= 600px)
- **Nav:** hamburger drawer; Donate stays reachable. (Shared chrome.)
- **Banner:** ~220–260px tall; H1 ~2rem; subtitle ~1rem; tighter padding; scrim slightly stronger for contrast on small photo.
- **Intro:** full-width, ~20px side padding, centered.
- **Impact strip:** stack to **1 column** (or 2 compact columns) of stats; keep numbers prominent.
- **Card grid:** **1 column** (`grid-template-columns: 1fr; gap ~30px; margin-top ~30px`), images ~200px tall, content padding ~20px, H3 ~1.6rem — matches existing `max-width:768px` rules. **Order matters most here:** lead with **Donate** (fastest action on mobile) unless the user overrides. Buttons full-width-ish, large tap targets (≥44px).
- **Closing CTA band:** headline + stacked full-width buttons.
- **Footer:** single column stacked. (Shared chrome.)

---

## 7. Components used (reference the shared design system / Style Gate)

> Global visual tokens — colors, fonts, radius, shadows, button & card styles, spacing scale — are defined in **`design/REDESIGN-STYLE-GATE.md`**. **Do not redefine them here**; reference them so styling stays consistent across pages.

This page relies on these shared components / tokens:
- **Shared header/nav** (with active state on "Get Involved") and **shared footer** — from the **shared-chrome doc**.
- **Page-header / banner** component (`.page-header`, `.page-title`, `.page-subtitle`) — same component used on About / Contact / Documents.
- **Section intro** pattern (`.section-title` + `.section-intro-text` / `.story-intro`).
- **Card** component — image-top card with body + bottom-pinned CTA (`.involve-card` family); use Style-Gate card radius (`--border-radius`), shadow (`--shadow-color`), hairline border, hover-lift, and `--card-padding`.
- **Buttons** — `.btn.btn-primary` (Partner/Volunteer); **accent/CTA button** for Donate (Style-Gate accent color, the one high-contrast action).
- **Stat figure** component (for the new impact strip) — reuse the Home/About stat-card pattern from the Style Gate.
- **CTA band** component (for the new closing band) — Style-Gate green band + button pairing.
- **Spacing/rhythm:** `--section-padding`, container width, grid gaps — all from the Style Gate.
- Colors referenced: `--primary-green`, accent/CTA, `--surface` / `--surface-alt`, hairline, text-strong/body/muted — **token names per Style Gate.**

---

## 8. Ready-to-paste Claude-design instruction

> Paste this into Claude design (browser) together with the filled COODU Trust **Style Gate**.

```
Using the COODU Trust Style Gate I'm providing (colors, fonts, radius, shadows, button
and card styles — follow it exactly; do not invent new tokens), design the "Get Involved"
HUB page for the COODU Trust NGO (a registered non-profit in Dindigul, Tamil Nadu, working
across Tamil Nadu since 2000). Produce THREE clean, self-contained designs: WEB (desktop
>=1025px), TABLET (768–1024px), and MOBILE (<=600px). No inline-style hacks, no fixed
background photo behind everything — use clean flat Style-Gate surfaces with intentional
section banding.

This is a short DECISION HUB whose job is to route visitors to three actions. Page,
top to bottom:

1. BANNER: H1 "Get Involved"; subtitle "Together, we can create a world of opportunity and
   self-reliance." Warm real photo of people/fieldwork with a green→dark-green gradient
   scrim for legible white text.

2. INTRO: H2 "Join Us in Our Mission" + this exact paragraph:
   "There are many ways to support the work of Coodu Trust. Whether you are an individual,
   a corporation, or an institution, your contribution can help us empower communities and
   build a sustainable future. Explore the options below to find out how you can make a
   difference." (Centered, ~70ch.)

3. IMPACT STRIP (new): a slim band of 3–4 stat figures (big number + small label) giving a
   reason to act — e.g. "20+ years", "communities reached", "volunteers". Use placeholder
   numbers and mark them as placeholders.

4. THREE PATH CARDS (image-top card, heading + body + button pinned bottom, equal height):
   • Partner with Us — "Collaborate with us on CSR initiatives, institutional partnerships,
     and large-scale development projects. Let's work together to achieve shared goals and
     create lasting impact." — button "Become a Partner".
   • Volunteer — "Lend your time and skills to make a direct impact. We welcome individuals
     and groups to support our fieldwork, assist with events, or provide professional
     expertise." — button "Volunteer With Us".
   • Donate — "Your financial support fuels our programs and allows us to reach more
     communities in need. Every contribution, large or small, helps transform lives." —
     button "Make a Donation".
   Make the DONATE card the dominant one (accent-colored CTA button per Style Gate, slightly
   stronger emphasis). WEB = 3 columns; TABLET = 2 columns (Donate wider/spanning on its
   row); MOBILE = 1 column, lead with Donate, full-width tap-friendly buttons.

5. CLOSING CTA BAND (new): green full-width band repeating "Together, we can create a world
   of opportunity and self-reliance." with a primary "Donate" button and a secondary
   "Talk to us first" link.

6. Shared header (with "Get Involved" active) and shared 4-column footer (logo + "Coodu
   Trust is a registered non-profit organization working towards sustainable development in
   Tamil Nadu, India since 2000."; Quick Links; address "H-83, R.M. Colony, Dindigul –
   624 001, Tamil Nadu, India.", director@coodutrust.org, +91-451-2461362; Facebook /
   Twitter / Instagram; "© 2025 Coodu Trust. All Rights Reserved.").

Keep all quoted copy verbatim. Deliver the three viewports as clean, production-ready
layouts that match the Style Gate.
```
