# About — Design Doc

> Source read in full: `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/about.html` (+ supporting rules in `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/css/style.css` lines 985–1015, 1302–1488, 1646–1665 and `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/css/responsive.css` lines 159–165, 228–233).
> Global tokens/components are NOT redefined here — they live in `design/REDESIGN-STYLE-GATE.md` (the Style Gate). This doc references them by name only.

## 1. Identity
- **File:** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/about.html`
- **Represents:** the single public "About Coodu Trust" page (`about.html`), linked from the main nav ("About", currently `nav-link active`) and the footer Quick Links ("About Us").
- **COVERAGE:** This doc governs **1 real page** (it is a one-off page, not a template).
- **One-line role:** The credibility / trust-building page — it tells the org's 20+ year origin story (timeline), states vision & mission & values, introduces the leadership, and shows funders/partners, so donors and CSR partners believe COODU is real, experienced, and accountable.
- **`<title>`:** `About Coodu Trust | Our Story, Mission, and Team`
- **`<meta description>`:** `Learn about Coodu Trust's 24-year journey, our vision for a self-reliant society, and the dedicated team working to make it a reality.`

## 2. Current structure (AS-IS) — section by section

Top-to-bottom DOM order. (Header and footer are shared chrome — covered in the chrome doc; noted by reference only.)

**0. Page-wide background hack (not a section, but renders behind everything)**
- `<body>` carries an **inline** `background-image` of a fixed Cloudinary photo (`.../aboutus/background.jpg`), `background-size: cover; background-position: center; background-attachment: fixed; background-repeat: no-repeat`.
- Immediately followed by a `position: fixed` full-viewport `<div>` with inline `background: rgba(255,255,255,0.4); z-index:-1` — a white wash over that photo.
- Net effect: the whole page sits on a washed-out fixed photo. Two later sections (`vision-mission-section`, `team-section`) carry `style="background: transparent !important;"` specifically so this background shows through them instead of their normal `--light-bg`.

**1. Header** — `header.header` → shared chrome. Logo lockup + multi-level dropdown nav (Programs is 2 levels deep), header "Donate" button (`btn btn-primary donate-button`), hamburger. "About" link has `.active`. *See chrome doc.*

**2. Page header / banner** — `section.page-header`
- Purpose: page title band over a hero photo.
- Inline `background-image` = `.../headers/about-us-header.jpg`; `.page-header::before` lays a `rgba(0,0,0,0.2)` dark overlay; white text; `padding: 100px 0`; centered.
- Components: `h1.page-title` "About Coodu Trust" (3.5rem) + `p.page-subtitle` "Over Two Decades of Commitment to Rural Development" (1.2rem, not uppercased).

**3. Our Story** — `section.story-section.section-padding`
- Purpose: origin narrative + milestone timeline.
- `div.story-intro`: `h2.section-title` "The Coodu Journey" + `p.section-intro-text` (long paragraph, see §4).
- `div.timeline`: a vertical center-line timeline (max-width 800px, centered). `.timeline::after` draws a 4px green vertical rail at 50%. **5** `.timeline-item`s, each = `.timeline-dot` (white circle, 4px green border) + `.timeline-content` (light-bg rounded box with `h3` year in green + `p` description). Items alternate: odd → left/right-aligned, even → right/left-aligned (zig-zag). Years: **2000, 2005, 2012, 2018, 2024**.
- Component type: **alternating vertical timeline**.

**4. Vision & Mission** — `section.vision-mission-section.section-padding` (inline `background: transparent !important`)
- Purpose: state the why and the how.
- `div.vision-mission-grid` = 2 equal columns: `div.vision-box` ("Our Vision") and `div.mission-box` ("Our Mission"). Each is a 2px-border rounded card, centered, with `h2.box-title` (2.5rem green) + one paragraph.
- Component type: **two side-by-side statement cards**.

**5. Guiding Values** — `section.values-section.section-padding`
- Purpose: the org's 4 core values.
- `h2.section-title` "Our Guiding Values" + `div.values-grid` (4 equal columns). Each `div.value-card` = `img.value-icon` (90px PNG icon) + `h3` + `p`. Values: **Integrity, Collaboration, Empowerment, Sustainability**.
- Component type: **4-up icon/value card grid**.

**6. Meet the Team** — `section.team-section.section-padding` (inline `background: transparent !important`)
- Purpose: leadership credibility.
- `h2.section-title` "Meet Our Leadership" + `div.team-grid` (4 equal columns). Each `div.team-card` = circular `img.team-photo` (180×180, `border-radius:50%`, 5px white border, shadow) + `h3.team-name` + `p.team-title`. **4** members (see §4). Member 1 uses a **local** asset (`assets/images/team/member-1.jpg`) with an extra `team-photo-adjust-up` object-position hack; the other 3 use Cloudinary PNGs.
- Component type: **4-up profile/avatar card grid**.

**7. Partners & Recognition** — `section.partners-section.section-padding`
- Purpose: social proof via funder/partner logos.
- `h2.section-title` "Our Partners & Recognition" + `p.section-intro-text` (see §4) + `div.logo-wall` (flex, wrap, centered, gap 40px). **7** raw `<img>` logos at `height:60px`, no grayscale (`filter:none`), hover → `opacity:0.7`.
- Component type: **logo wall / partner strip**.

**8. Footer** — `footer#contact.footer` → shared chrome (logo + about blurb, Quick Links, Contact address, social icons, copyright). *See chrome doc.*

**JS:** `assets/js/main.js` (shared — drives the mobile nav hamburger). No page-specific scripts.

## 3. Current weaknesses (be specific & honest)

1. **All-caps body text everywhere.** Global `body { text-transform: uppercase; letter-spacing: .5px }` shouts. Section headings (`.section-title`, timeline year `h3`, `box-title`, value/team `h3`) all render UPPERCASE; only a handful of paragraphs opt out via `text-transform:none`. → **Fix:** sentence-case all headings and body; reserve uppercase only for tiny eyebrow labels/tags.
2. **Inline-style soup + overlay hack.** The page's washed fixed `background.jpg` lives in an inline `<body style>` plus a fixed overlay `<div>`, and two sections fight it with `background:transparent !important`. Muddy, low-contrast, off-brand, and `background-attachment:fixed` janks/repaints badly on mobile. → **Fix:** delete the full-page photo entirely; use clean white + `--color-surface-alt` section banding from the Style Gate; zero inline styles.
3. **Monotonous rhythm / weak hierarchy.** Five sections are nearly all "centered `section-title` + a grid." Nothing leads the eye; no emphasis moment; no numeric proof up top. → **Fix:** open with an intro + headline impact-stat band; vary section treatments; give the page one clear hero statement.
4. **Impact numbers are buried inside timeline prose.** "over 10,000 women" and "over 50,000 trees" sit as plain sentences in timeline boxes instead of being surfaced as big stats. → **Fix:** promote 3–4 numbers into a stat band near the top.
5. **Timeline is text-only and visually plain.** Light-grey boxes, no imagery, no founding context; the green center-rail is the only flourish. → **Fix:** keep the timeline metaphor but restyle cards on the Style Gate, optionally add small year emphasis / connector polish.
6. **Inconsistent team data & imagery.** Member 1 = local JPG with a special `object-position` hack ("adjust-up"); members 2–4 = Cloudinary PNGs (likely cut-outs on different backgrounds). One name is hard-coded ALL CAPS ("P.P. SARAVANAN"). No bios, no roles context, no LinkedIn. → **Fix:** normalize photo treatment (same crop, same circle/rounded frame, consistent background), title-case all names, optionally add one-line bios.
7. **Off-brand value icons.** `value-icon` PNGs are mixed clip-art-style raster icons — directly against the Style Gate's "one line-icon set, single color" rule (§1.9). → **Fix:** swap to one consistent line-icon set (e.g. Lucide) tinted in brand green.
8. **Vision/Mission boxes are bland.** Plain 2px-border centered boxes, no icon, no differentiation between the two. → **Fix:** give each an icon + accent, differentiate Vision vs Mission visually.
9. **Uneven partner logo wall.** Raw logos at fixed `height:60px`, mismatched aspect ratios and color treatments, sit on the washed background. → **Fix:** uniform cells, consistent sizing, grayscale-to-color-on-hover (or muted), on a clean band.
10. **No call-to-action / dead end.** The page never invites the reader to Donate, Volunteer, Partner, or view Programs. A trust page should convert at the bottom. → **Fix:** add a closing CTA band.
11. **Copy inconsistency: "24-year" vs "Over Two Decades" vs "since 2000".** Meta says 24-year journey; banner says "Over Two Decades"; story says "since our inception in the year 2000" (which, in 2026, is 26 years). → **Fix:** pick one phrasing ("Since 2000 — over two decades"); don't hard-code a year count that drifts.

## 4. Content — source of truth (PRESERVE this, verbatim)

**Banner**
- H1: **About Coodu Trust**
- Subtitle: **Over Two Decades of Commitment to Rural Development**

**Our Story**
- Section title: **The Coodu Journey**
- Intro paragraph (preserve exactly): "Since our inception in the year 2000, Coodu Trust has been driven by a single, unwavering goal: to empower the underprivileged and marginalized communities of Tamil Nadu. We began as a small group of like-minded professionals dedicated to constructive social work, and have since grown into one of the leading NGOs in the region, with a proven track record in watershed development, women's empowerment, sustainable agriculture, and more."

**Timeline (5 milestones — keep year + text exactly):**
- **2000** — "Coodu Trust is founded and registered as a charitable trust."
- **2005** — "Launched first large-scale Watershed Development program across 5 districts."
- **2012** — "Recognized by the State Government for excellence in community mobilization."
- **2018** — "Expanded skill development programs, empowering over 10,000 women."
- **2024** — "Reached a milestone of planting over 50,000 trees through environmental initiatives."

**Vision & Mission**
- **Our Vision** — "To build self-sufficient and self-reliant rural communities where every individual has the opportunity to live a life of dignity and purpose."
- **Our Mission** — "To design and implement sustainable, community-driven development programs focused on natural resource management, livelihood enhancement, and social empowerment."

**Guiding Values** (title: **Our Guiding Values**)
- **Integrity** — "We operate with transparency and accountability in all our actions."
- **Collaboration** — "We believe in the power of partnership with communities and stakeholders."
- **Empowerment** — "We enable individuals and communities to take charge of their own development."
- **Sustainability** — "We create solutions that are environmentally sound and economically viable."

**Meet Our Leadership** (title: **Meet Our Leadership**) — name + role, preserve exactly:
- **S. Jagadeesan** — Managing Trustee — (img `assets/images/team/member-1.jpg`)
- **C.T.V. Chidambara Kumar** — Trustee — (img Cloudinary `team/KUMAR.png`)
- **Dr. P. Venkatesan** — Advisory Board — (img Cloudinary `team/VENKATESAN.png`)
- **P.P. SARAVANAN** — Advisory Board — (img Cloudinary `team/SARAVANAN.png`) — *(recommend title-case "P.P. Saravanan", but the name string is load-bearing)*

**Partners & Recognition**
- Section title: **Our Partners & Recognition**
- Intro: "We are proud to collaborate with a wide range of government bodies, corporate partners, and funding agencies who share our vision."
- Logos (7, with alt text — keep all): **Government of India**, **Government of Tamil Nadu**, **NABARD**, **SBI Foundation**, **NSDC**, **Tata Power**, **Karur Vysya Bank**.

**Stats worth surfacing (already in copy, currently buried):** 20+ years (since 2000) · 5 districts · 10,000+ women empowered · 50,000+ trees planted.

**Footer contact (shared chrome, but preserve):** H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India · Email `director@coodutrust.org` · Phone `+91-451-2461362`.

**Key link targets to keep live:** nav (Home/About/Programs/Get Involved/Documents/Media/Contact), footer Quick Links (About/Programs/Careers/Donate), `donate.html` (header + footer CTA).

## 5. Enhancement direction (TO-BE) — opinionated

**Reorder & add:**
1. **Banner** — keep the photo hero with H1 + subtitle, but on a real overlay (Style Gate hero treatment), not the page-wide washed background. Delete the body background-image + overlay div entirely.
2. **NEW: Intro + Impact-stat band** (right after banner). Lead with one short framing line drawn from the story copy, then a **4-stat row**: "20+ Years", "5 Districts", "10,000+ Women Empowered", "50,000+ Trees Planted." This gives instant credibility above the fold and pulls the buried numbers up. Reuse the home page's `impact-card` pattern/tokens.
3. **Our Story + Timeline** — keep "The Coodu Journey" intro paragraph; restyle the timeline cleanly. On desktop keep the alternating two-side timeline (it's the page's signature); make connectors and year emphasis crisp; sentence-case the descriptions.
4. **Vision & Mission** — keep both statements; give each card a leading line-icon (e.g. eye / compass), differentiate Vision vs Mission with subtle accent, equal-height cards.
5. **Guiding Values** — keep all 4; **replace clip-art PNGs with one line-icon set** (Lucide) tinted brand green; 4-up on desktop.
6. **Meet Our Leadership** — keep all 4 people verbatim; normalize to one photo treatment (same circular/rounded frame, consistent background, consistent crop — drop the per-member "adjust-up" hack); title-case names; optionally add a one-line role descriptor under each title. Consider an "Advisory Board" subgroup label since two are advisory.
7. **Partners & Recognition** — keep intro + all 7 logos; present as a tidy uniform logo grid/strip (equal cells, muted → full-color on hover) on a clean band.
8. **NEW: Closing CTA band** — the page currently dead-ends. Add a full-width CTA: a "Be part of the journey" line + two buttons — primary **Donate** (`donate.html`, accent color) and secondary **Get Involved** (`get-involved.html`). Optional third link to **Our Programs** (`programs.html`).

**Patterns to use:** impact-stat row, alternating timeline, icon-value grid, avatar profile grid, logo wall, CTA band — all already exist in the system; this page should compose them, not invent new ones.

**Remove:** page-wide fixed background photo + white overlay div; all `!important` transparent hacks; all-caps body styling; clip-art value icons; per-member object-position hack.

**Content gaps to consider filling (optional, ask user):** registration/80G/FCRA number for trust legitimacy; a short founder quote; a line on geographic reach (which 5 districts); proper member photos for member-1.

▶ YOUR ENHANCEMENT NOTES: ____

## 6. Three-viewport layout spec (the core deliverable)

Global: shared sticky header on top, shared footer at bottom. Section vertical rhythm = Style Gate `--section-padding` (≈80px desktop / 50px mobile). Sections alternate white / `--color-surface-alt` banding. Container max-width per Style Gate, centered, 16–24px side gutters.

**WEB (desktop, ≥1025px)**
- **Banner:** full-bleed photo, ~360–420px tall, dark overlay (Style Gate hero overlay), centered H1 (~3.5rem) + subtitle stacked.
- **Impact-stat band:** single row, **4 columns** (`repeat(4, 1fr)`, gap ~30px), each = number (large, brand green) + label; on white or surface-alt.
- **Our Story:** centered title + intro paragraph capped ~800px; then **alternating timeline** — centered vertical rail, items 50% width zig-zagging left/right, dot on the rail, content card on the outer side. Max-width ~800–900px, centered.
- **Vision & Mission:** **2 columns** (`1fr 1fr`, gap ~40px), equal-height icon cards.
- **Guiding Values:** **4 columns** (`repeat(4,1fr)`, gap ~30px), centered icon + title + text.
- **Leadership:** **4 columns** (`repeat(4,1fr)`, gap ~30px); circular photos ~180px; name + title centered; hover lift.
- **Partners:** logo grid/strip, 7 logos in one or two centered rows, uniform cell height (~60–72px), even spacing.
- **CTA band:** full-width, centered headline + 2 buttons inline.

**TABLET (768–1024px)**
- **Banner:** same, H1 ~3rem.
- **Impact-stat band:** **2 columns** (2×2).
- **Timeline:** switch to **single left-rail** layout (rail at left ~30px, all items full-width, left-aligned, dots on the left) — matches current responsive behavior; cards no longer zig-zag.
- **Vision & Mission:** **2 columns** (stay side-by-side) or stack if cramped — prefer 2-up.
- **Guiding Values:** **2 columns** (2×2).
- **Leadership:** **2 columns** (2×2), photos ~150px.
- **Partners:** wrap to ~3–4 per row.
- **CTA band:** headline + buttons; buttons may wrap.

**MOBILE (≤600px)**
- Header collapses to logo + hamburger → full-height nav drawer (shared chrome). Touch targets ≥44px.
- **Banner:** ~240–300px, H1 ~2.5rem, subtitle smaller; no fixed background.
- **Impact-stat band:** **1 column** stacked (or 2×2 if tight) — numbers stay prominent.
- **Timeline:** single **left rail**, full-width stacked cards, left-aligned.
- **Vision & Mission:** **1 column** stacked.
- **Guiding Values:** **1 column** stacked.
- **Leadership:** **2 columns** (per current mobile rule, photos ~120px) or 1-column for larger faces — prefer 1-column at the smallest widths for legibility.
- **Partners:** **2 per row**, wrapping.
- **CTA band:** stacked, full-width buttons.
- Section padding tightens to ~50px; all type sentence-case; generous line-height.

## 7. Components used (reference the shared design system / Style Gate)

Style this page ONLY with components/tokens defined in `design/REDESIGN-STYLE-GATE.md`. Do not introduce new colors, fonts, radii, or shadows here.

- **Shared header / nav + mobile drawer** (chrome) — §2.4 of Style Gate.
- **Shared footer** (chrome).
- **Page/banner hero** with overlay (same family as home hero) — Style Gate hero overlay token (green→dark overlay, not the washed body image).
- **Impact-stat card** (`.card`/stat pattern, big number + label) — reuse home `impact-card` tokens.
- **Alternating timeline** (page-distinctive component; rail color = `--color-primary`).
- **Statement card** (Vision / Mission) — `.card` + leading line-icon.
- **Icon value card** — `.card` + Lucide line-icon, single-color (Style Gate §1.9).
- **Profile/avatar card** (leadership) — `.card` with circular media.
- **Logo wall / partner strip**.
- **CTA band** with `.btn--primary` (Donate, accent) + `.btn--secondary` (Get Involved) — Style Gate §1.7 buttons.
- **Tokens referenced (not redefined):** `--color-primary #1e7e34`, `--color-primary-dark`, `--color-accent #e8590c`, `--color-surface-alt #f6f8f6`, `--font-display Oswald`, `--font-body Inter`, `--radius-card`, `--radius-btn`, `--shadow-1/2`, breakpoints, `--section-padding`.

## 8. Ready-to-paste Claude-design instruction

> Design the **About page** for COODU Trust (a 20+ year rural-development NGO in Dindigul, Tamil Nadu). Produce **three self-contained designs: WEB (≥1025px), TABLET (768–1024px), and MOBILE (≤600px).** Follow the attached **Style Gate exactly** — colors (`#1e7e34` primary, `#e8590c` accent for Donate only, `#f6f8f6` alt surface), Oswald display + Inter body, the radius/shadow/button/card specs — and do NOT invent off-brand colors or fonts. Sentence-case all headings and body (no all-caps), no inline styles, no full-page background photo.
>
> Sections, in this order, using this exact copy (do not paraphrase numbers or names):
> 1. **Banner** over a photo with a dark overlay: H1 "About Coodu Trust", subtitle "Over Two Decades of Commitment to Rural Development".
> 2. **Impact stats** (4): "20+ Years", "5 Districts", "10,000+ Women Empowered", "50,000+ Trees Planted".
> 3. **Our Story** — title "The Coodu Journey", the intro paragraph (preserve verbatim), then an **alternating vertical timeline** with 5 milestones (2000, 2005, 2012, 2018, 2024 — keep each year's exact text).
> 4. **Vision & Mission** — two icon cards with the exact Vision and Mission statements.
> 5. **Guiding Values** — title "Our Guiding Values", 4 cards (Integrity, Collaboration, Empowerment, Sustainability) using a single consistent **line-icon set** (Lucide), brand green.
> 6. **Meet Our Leadership** — 4 circular profile cards, identical photo treatment: S. Jagadeesan (Managing Trustee), C.T.V. Chidambara Kumar (Trustee), Dr. P. Venkatesan (Advisory Board), P.P. Saravanan (Advisory Board).
> 7. **Our Partners & Recognition** — intro line + uniform logo strip of 7 (Government of India, Government of Tamil Nadu, NABARD, SBI Foundation, NSDC, Tata Power, Karur Vysya Bank).
> 8. **Closing CTA band** — short line + primary "Donate" button (accent color) and secondary "Get Involved" button.
>
> Layout: desktop = 4-col stats, 4-col values/team, alternating center-rail timeline; tablet = 2-col grids + single left-rail timeline; mobile = stacked, hamburger nav drawer, 2-per-row partners, full-width buttons, ≥44px touch targets. Show interaction states (button hover, card hover/lift, focus ring, open mobile nav). Return clean semantic HTML5 with landmarks and **all CSS in one `<style>` block using custom properties that mirror the Style Gate tokens** — copy-paste runnable as a single file, no Bootstrap/Tailwind, ≤2 Google Fonts. After each design, list the tokens you used as a short table.
