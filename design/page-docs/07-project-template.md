# Project-detail page (TEMPLATE) — Design Doc

> **Scope note:** This is a TEMPLATE doc. The structure, layout, and component spec below govern **all 33 project-detail pages** under `/programs/projects/`. The §4 content quotes are taken verbatim from the reference page (`mushroom-cultivation-training.html`); **every other project page carries its own equivalent copy in the same slots** (its own hero badge, stat numbers, phase cards, timeline rows, statistics-table rows, CTA, etc.). Where this doc says "PRESERVE," it means: preserve whatever that specific page holds in that slot — do not drop any of it during the redesign.

---

## 1. Identity

- **Reference file read in full:** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/programs/projects/mushroom-cultivation-training.html`
- **Real page this represents:** "Mushroom Cultivation Training" project-detail page (a single concrete project/training initiative under the *Sustainable Agriculture → Horticulture & Diversified Farming* program).
- **COVERAGE: This doc governs the shared template for all 33 project-detail pages** in `/programs/projects/`:
  `bamboo-cultivation`, `coconut-climbing-training`, `dairy-development-kvb`, `dpap`, `fpo-10000-scheme`, `fpo-promotion-2015`, `goshala-center`, `indigenous-farming-practices`, `iwdp`, `iwmp`, `jatropha-cultivation`, `mahalir-thittam`, `medicinal-plants-conservation`, `medicinal-plants-cultivation`, `mi-tank-initiative`, `mushroom-cultivation-training`, `nursery-plantation-training`, `nursery-technology-training`, `nwdpra`, `organic-vegetable-fruit-cultivation`, `padappai-zero-waste`, `pmksy-watershed-backup`, `pmksy-watershed`, `rainwater-harvesting-program`, `rmk-project`, `rwh-activities`, `sustainable-agriculture-training`, `swm-dcmc`, `swm-renault`, `tncwp`, `vermicomposting-organic-farming`, `western-ghats-development`, `wua-capacity-building`. **(covers 33 pages)**
- **One-line role/job:** Tell the credible, evidence-backed story of ONE concrete project/initiative — what it is, who it served, what it delivered (numbers + phases + outcomes), and route the reader back up to its parent program or onward to Partner/Donate.

---

## 2. Current structure (AS-IS) — section by section

The page is one `<main>` with a fixed Cloudinary background photo (`…/aboutus/background.jpg`, cover/center/fixed) plus a fixed `rgba(255,255,255,0.4)` white overlay div at `z-index:-1`. Almost every section sets `background: transparent !important` so the photo shows through; section content sits in white "glass" cards (`rgba(255,255,255,0.95)` + `backdrop-filter: blur(10px)` + soft shadow + 20px radius). The accent color throughout is a green gradient `linear-gradient(135deg, #28a745, #20c997)`. **All section styling is inline or in a page-local `<style>` block** — there is no shared component CSS for this template.

**Chrome (by reference — see the shared-chrome doc):**
- **`header.header > .container > nav.navbar`** — logo + wordmark, full nav menu with a deep multi-level Programs dropdown (6 sector submenus, each with its own sub-submenu), Get Involved dropdown, Documents/Media/Contact links, a persistent "Donate" `.btn.btn-primary`, and a `.hamburger`. Programs nav-link carries `.active`.
- **`footer.footer`** — 4-column footer (logo+about, Quick Links, Contact Us address block, social icons) + `.footer-bottom` copyright. (Detailed in shared-chrome doc.)

**Section-by-section, top → bottom (inside `<main>`):**

1. **`section.mushroom-hero`** — *Hero.* Purpose: identify the project + headline stats + gallery.
   - **Breadcrumb** (`.breadcrumb`): `Programs > Sustainable Agriculture > Horticulture & Diversified Farming > Mushroom Cultivation Training` (last crumb is current, non-link).
   - **`.hero-content-modern`** = 2-col grid (`1fr 1fr`, 60px gap):
     - **Left `.hero-text-section`** (white glass card): a pill **category badge** (`🍄 WOMEN'S ENTERPRISE DEVELOPMENT`), `<h1>` title, subtitle line, a **"Program Mission" callout box** (green-tinted, left-border), a **"Implementation Highlights"** block (2×2 grid of 4 icon+label chips), and a **`.quick-stats`** 2-up grid of 2 green **stat cards** (number + label).
     - **Right `.hero-visual-section > .modern-carousel`** (white glass card): "📸 Project Gallery" heading + a **photo carousel** (`.hero-photo-carousel > .carousel-frame > .photo-slides` with 4 `.photo-slide`, each an image + caption chip) and `.carousel-indicators` dots. JS-driven (`main.js`).

2. **`section.overview-modern`** — *Programme Overview.* `.overview-grid` = 2-col (`2fr 1fr`, 50px gap):
   - **Left `.overview-content-modern`** (white glass): `<h2>` "Programme Overview", 4 body paragraphs, a yellow/red **"Core Rationale" callout**, and a **"Target Beneficiaries"** sub-box (3-up icon grid: Women SHG Members / Marginal & Landless Farmers / Aspiring Rural Entrepreneurs).
   - **Right `.overview-sidebar`** (green gradient card): "📈 Project Scope" with 3 stacked info boxes — **Geographic Coverage** (phase-by-phase), **Programme Context** (bulleted), **Mushroom Type** (Primary/Secondary/Value Addition).

3. **`section.programs-section.section-padding` (Phase-wise Implementation)** — centered `.section-title` + **two 2-col grid rows** of **4 phase cards** (white glass, left green border). Each card = circular emoji icon + phase title + year sub-label + a green-tinted **Stats box** + a description paragraph. (Phase 3 card uses a bulleted "SHG Activities" list instead of a single stat line.)

4. **`section.programs-section.section-padding` (Training Curriculum)** — centered `.section-title` + one large white glass card containing: a **2-col grid** of two tinted module panels — **🔬 Technical Modules** (green tint, 5-item ✓ list) and **💼 Enterprise Modules** (yellow/red tint, 5-item ✓ list) — followed by a full-width **🎓 Delivery Method** panel (blue/purple tint, 2×2 grid of 4 ✓-circle items).

5. **`section.programs-section.section-padding` (Income Impact — The ₹300/Day Story)** — centered `.section-title` + white glass card: intro line, a **2-col grid of 6 ✓-circle outcome rows**, then a green-gradient **emphasis banner** ("highest return-on-investment training programme…").

6. **`section.programs-section.section-padding` (Why Mushroom Cultivation Works for Rural Women)** — centered `.section-title` + white glass card: **2-col grid of 8 benefit cards** (✓ circle + `<h4>` + one-line description).

7. **`section.programs-section.section-padding` (Programme Legacy Timeline)** — centered `.section-title` + intro line + white glass card holding a **3-column data table** (`Year | Milestone | Impact`) with a green-gradient header row and 6 body rows (incl. a "Total" summary row). Wrapped in `overflow-x:auto`.

8. **`section.statistics-section.section-padding` (Verified Statistics)** — `.section-title` + `.statistics-table-container` (white glass) holding a 2-column `.statistics-table` (`Metric | Details`) with 15 rows.

9. **`section.sector-cta.section-padding`** — *CTA band* (shared component). `.cta-content` = `.cta-title`, `.cta-text`, `.cta-buttons` with two buttons: `.btn.btn-primary` "Partner with Us" + `.btn.btn-secondary` "Support Our Work".

**Components present:** hero with split text/visual, pill badge, callout boxes, icon-chip grids, stat cards, JS photo carousel w/ indicators, info-sidebar card, phase/feature card grids, two data tables, emphasis banner, CTA band.

---

## 3. Current weaknesses (be specific & honest)

1. **Inline-style soup / page-local `<style>` block.** 100% of section styling is inline or embedded; nothing is tokenized or reusable. Every one of the 33 pages re-declares the same green gradient, glass card, radii, shadows. **Fix:** rebuild on the Style Gate token set + shared component classes (`.card`, `.stat`, `.section`, `.cta`, `.callout`), zero inline styles.

2. **Off-brand color system.** The page is built on `#28a745`/`#20c997` (bright "Bootstrap" green) — the Style Gate brand is the warmer, deeper `--color-primary: #1e7e34` / `#155d27`. The bright green + the yellow/red (`#fff3cd`/`#f8d7da`) and blue/purple (`#e3f2fd`/`#f3e5f5`) callout tints read as clip-art and contradict the "credible, not flashy" mood. **Fix:** map everything to the Style Gate palette; replace the multi-tint callouts with a single tasteful accent + surface-alt.

3. **Emoji-as-icons everywhere** (🍄 👩‍🌾 💰 🎯 📋 🔬 💼 🎓 📸 📈). Inconsistent across platforms, off the "simple line icons, one set" direction. **Fix:** swap to one Lucide line-icon set, single-color.

4. **Glass-on-photo over a busy fixed background.** `backdrop-filter: blur` + a generic background photo + 0.4 white overlay is heavy, hurts text contrast, is GPU-costly on low-end Android (the stated mobile audience), and dates the page. **Fix:** flat `--surface` / `--surface-alt` banded sections per Style Gate; reserve a real project photo for the hero only.

5. **Weak hero image quality + irrelevant images.** The "Project Gallery" carousel reuses generic program thumbnails (`program-women-empowerment.jpg`, `watershed-development.jpg`, `health-sanitation.jpg`) that are NOT mushroom photos — the captions claim "Oyster Mushroom Production" / "SHG Mushroom Enterprises" over unrelated stock. **Fix:** real project photos with honest captions; if none exist, single hero image + remove the carousel rather than mislabel.

6. **`!important` overuse and `background: transparent !important`** on nearly every section — brittle cascade. **Fix:** none needed once tokens/components replace overlay hacks.

7. **Hierarchy is flat / everything is a card.** 9 sections, almost all rendered as the same white glass slab — no rhythm, no scannable "what is this / who / proof / act" flow. The two tables (Legacy Timeline + Verified Statistics) are largely redundant. **Fix:** establish vertical rhythm with alternating surfaces, tighten to a clear narrative, and merge/relegate the redundant stats table (see §5).

8. **Mobile behavior is minimal.** Only two breakpoints (`1024`, `768`); below 768 the 6-row and 15-row tables rely on horizontal scroll, and the dense 2-col grids just collapse to 1-col with no reflow thought. Body text inherits the global `text-transform:uppercase` from legacy CSS in places. **Fix:** mobile-first reflow, sentence-case body ≥16px, tables → stacked key/value cards on mobile.

9. **No "back to program" affordance besides the breadcrumb.** A project page should clearly route up to its parent program. **Fix:** explicit "← Back to [Program]" link near top and/or in CTA.

10. **Heading levels are visually faked with inline font-size, not semantic.** Multiple `<h3>/<h4>` set by inline px; `<h1>` is styled inline. **Fix:** one semantic `<h1>`, logical outline, type from tokens.

---

## 4. Content — source of truth (PRESERVE this)

> Verbatim copy from the reference page. **Numbers, names, ₹ figures, years, and link targets must carry over exactly.** Each of the other 32 pages has the analogous content in the same slots — preserve theirs identically.

**Document / meta**
- `<title>`: **"Mushroom Cultivation Training | Coodu Trust"**
- Meta description: *"Mushroom cultivation skill development programme implemented by Coodu Trust since 2003, training over 1,600 beneficiaries across 5 districts in oyster mushroom production, spawn technology, composting, value addition, and entrepreneurship — with women earning ₹300/day from mushroom enterprises."*

**Breadcrumb (link targets):**
- `Programs` → `../../programs.html`
- `Sustainable Agriculture` → `../sustainable-agriculture.html`
- `Horticulture & Diversified Farming` → `../horticulture-diversified.html`
- `Mushroom Cultivation Training` (current, no link)

**Hero**
- Badge: **"🍄 WOMEN'S ENTERPRISE DEVELOPMENT"**
- H1: **"Mushroom Cultivation Training"**
- Subtitle: **"Entrepreneurship Development through Oyster Mushroom Production (2003-Present)"**
- Program Mission heading: **"🎯 Program Mission"** — body: *"Empowering rural women, marginal farmers, and aspiring entrepreneurs with the knowledge and skills to establish profitable mushroom production enterprises — leveraging agricultural waste into a high-protein, high-demand food product that requires low investment, minimal land, and provides year-round income through a sustainable indoor farming model."*
- Implementation Highlights (heading **"📋 Implementation Highlights"**), 4 chips: **"2003-Present (Recurring)"**, **"Oyster Mushroom Focus"**, **"Women & SHG Targeted"**, **"₹300/Day Income Achieved"**
- Quick stats (2): **"1,600+" / "Total Beneficiaries Trained"** · **"5+" / "Districts Covered"**
- Gallery heading: **"📸 Project Gallery"**; 4 captions: **"🍄 Mushroom Cultivation Training"**, **"👩‍💼 Women Entrepreneurs"**, **"🌾 Oyster Mushroom Production"**, **"👩‍🤝‍👩 SHG Mushroom Enterprises"** *(note: images currently mislabeled — see §3.5; replace images, keep/correct captions)*

**Programme Overview (H2 "Programme Overview")** — 4 paragraphs PRESERVE verbatim:
- P1: *"Mushroom cultivation has been one of Coodu Trust's most enduring and impactful entrepreneurship development programmes, running continuously since 2003 across multiple phases and reaching over 1,600 beneficiaries. Mushroom is the cheapest source of protein energy for people, and cultivation is gaining increasing attention as a means to use agricultural wastes productively, alleviate poverty, and address food insecurity."*
- Core Rationale callout ("🎯 Core Rationale"): *"Mushroom cultivation provides an opportunity for entrepreneurs to achieve good profit with low investment. The produce has year-round demand from consumers, requires minimal land (can be done indoors), utilises agricultural waste as substrate, and is particularly suited for women and landless families who lack conventional farming resources — making it one of the most inclusive agricultural enterprises possible."*
- P2: *"The programme focuses on **Oyster mushroom production** and **Spawn production** as primary enterprise models. Training covers the complete value chain from composting of agricultural residues through cultivation, harvesting, processing into value-added products, packing, and marketing. Successful mushroom entrepreneurs serve as resource persons during training, sharing their practical experience and boosting trainee confidence."*
- P3: *"The programme has been delivered across multiple phases: initial women's SHG training under watershed projects (2003-04), scaled-up entrepreneurship training across 5 districts (2013-14), SHG-linked enterprise development through Mahalir Thittam (ongoing), and most recently a focused women's entrepreneurship programme in 2023-24 that resulted in **8 women's groups generating ₹300/day income per participant.**"*
- Target Beneficiaries (3): **Women SHG Members** · **Marginal & Landless Farmers** · **Aspiring Rural Entrepreneurs**

**Overview sidebar ("📈 Project Scope"):**
- Geographic Coverage: **Phase 1 (2003-04):** Karur & Trichy districts · **Phase 2 (2013-14):** 5 districts of Tamil Nadu · **Phase 3 (2023-24):** Karur district · **Ongoing:** Integrated with SHG programmes
- Programme Context: *Linked with IWDP & DPAP watershed projects (2003-04); Part of SHG income generation activities (Mahalir Thittam); Standalone entrepreneurship development (2013-14, 2023-24); WordPress: Listed as dedicated "Mushroom production" activity*
- Mushroom Type: **Primary:** Oyster Mushroom · **Secondary:** Spawn Production · **Value Addition:** Processed mushroom products

**Phase-wise Implementation (4 phases):**
- **Phase 1 — Women's SHG Training (2003-2004):** Stats *"242 Women | Karur & Trichy Districts"* — *"Coodu Trust conducted training on mushroom cultivation for selected women in Karur and Trichy districts under IWDP and DPAP watershed programmes. 242 women members were trained with a view to provide employment opportunities. Women who received training gave positive feedback and expressed intention to start mushroom production units in their localities."*
- **Phase 2 — Large-Scale Entrepreneurship Training (2013-2014):** Stats *"1,267 Potential Entrepreneurs | 5 Districts"* — *"Coodu Trust identified 1,267 potential entrepreneurs from 5 districts of Tamil Nadu and organised skill-enhanced trainings covering mushroom know-how, health properties and benefits, cultivation techniques, processing methods, and how to run a mushroom production farm. Training combined practical and theoretical classes, concentrating on Oyster mushroom production and Spawn production. Composting technologies of agricultural produce were dealt in detail as the basis for mushroom cultivation. Harvesting, packing, and marketing strategies were shared by successful mushroom entrepreneurs."*
- **Phase 3 — SHG Enterprise Development (Ongoing):** SHG Activities list: *"Mushroom production identified as major viable economic activity for trained SHGs; SHGs established Mushroom Production Centres; Integrated with Mahalir Thittam women's development programme; 43 women SHG members trained in mushroom production (2009-10)"* — body: *"Mushroom cultivation was identified as one of the major viable economic activities for trained Self-Help Groups, alongside Community Herbal Nurseries and Vermi-Composting Centres. SHGs that received training established dedicated Mushroom Production Centres, creating sustainable group-based enterprises."*
- **Phase 4 — Women's Entrepreneurship (2023-2024):** Stats *"60 Women Trained | 8 Groups Started | ₹300/Day Income"* — *"A two-day entrepreneurship development training was conducted for 60 women with a special focus on mushroom production. Following the training, 8 women's groups comprising 41 women began mushroom cultivation, generating an income of ₹300/day for each participant. This initiative provided rural women with a new skill and a reliable source of income while promoting sustainable agricultural practices."*

**Training Curriculum:**
- 🔬 Technical Modules: *Mushroom biology — types, health properties, and nutritional benefits · Oyster mushroom production — substrate preparation, spawning, growing conditions · Spawn production technology — spawn multiplication and quality management · Composting of agricultural produce — substrate composting as the foundation for cultivation · Growing environment management — temperature, humidity, ventilation control*
- 💼 Enterprise Modules: *Preparation of value-added mushroom products · Harvesting techniques for quality preservation · Packing methods for market readiness · Marketing strategies and market linkage development · Business planning and enterprise economics*
- 🎓 Delivery Method (4): *Practical and theoretical classes combined · Successful mushroom entrepreneurs as resource persons · Hands-on demonstrations of all cultivation stages · Business mentoring from experienced practitioners*

**Income Impact — "The ₹300/Day Story"** (intro: *"The 2023-24 mushroom entrepreneurship programme demonstrates the real economic impact of this training:"*), 6 points:
- *60 women received 2-day intensive training*
- *8 women's groups (41 women) started actual cultivation immediately after training*
- *Each participant generates **₹300/day income** from mushroom sales*
- *This translates to approximately **₹9,000/month** per woman — a transformative income for rural households*
- *The enterprise requires low capital investment, minimal land (indoor cultivation), and uses locally available agricultural waste as substrate*
- *Year-round demand ensures consistent income without seasonal dependency*
- Emphasis banner: *"This makes mushroom cultivation one of the highest return-on-investment training programmes in Coodu Trust's entire portfolio."*

**Why Mushroom Cultivation Works for Rural Women** (8 benefit cards, title + line):
- **Low Investment** — *Minimal startup capital compared to other agricultural enterprises*
- **No Land Required** — *Can be cultivated indoors in small spaces — ideal for landless women*
- **Agricultural Waste Utilisation** — *Converts crop residues into valuable protein-rich food*
- **Year-Round Demand** — *Consistent market demand throughout all seasons*
- **Quick Returns** — *Short production cycle (3-4 weeks for harvest) compared to crop farming*
- **High Protein** — *Cheapest source of protein energy, addressing food insecurity and nutrition*
- **Scalable** — *Can start small and expand based on market response*
- **Group Enterprise Model** — *Ideal for SHG-based collective enterprises*

**Programme Legacy Timeline** (intro: *"20+ years of continuous mushroom cultivation training demonstrates Coodu Trust's sustained commitment to women's economic empowerment through this proven enterprise model."*) — table `Year | Milestone | Impact`:
- `2003-04` | First mushroom training under IWDP/DPAP | 242 women trained, Karur & Trichy
- `2009-10` | SHG integration via Mahalir Thittam | 43 women, Mushroom Production Centres established
- `2012-13` | SHG enterprise consolidation | Mushroom Production Centre listed as major SHG economic activity
- `2013-14` | Large-scale entrepreneurship training | 1,267 entrepreneurs across 5 districts
- `2023-24` | Women's entrepreneurship with income outcomes | 60 women → 41 active cultivators earning ₹300/day
- `Total` | 20+ years of mushroom training | 1,600+ beneficiaries, established enterprise model

**Verified Statistics** — table `Metric | Details` (15 rows): Phase 1 Period `2003-2004`; Phase 1 Beneficiaries `242 women (IWDP/DPAP)`; Phase 1 Districts `Karur, Trichy`; SHG Training (2009-10) `43 women SHG members`; Phase 2 Period `2013-2014`; Phase 2 Beneficiaries `1,267 potential entrepreneurs`; Phase 2 Districts `5 districts of Tamil Nadu`; Phase 2 Focus `Oyster mushroom, Spawn production`; Phase 4 Period `2023-2024`; Phase 4 Beneficiaries `60 women trained`; Phase 4 Enterprises Started `8 women's groups (41 women)`; Phase 4 Income Generated `₹300/day per participant`; SHG Enterprises `Mushroom Production Centres established`; WordPress Activity `"Mushroom production" listed as dedicated activity`; Total Beneficiaries `~1,612 across all phases`.

**CTA band:**
- Title: **"Support Mushroom Entrepreneurship for Women"**
- Text: *"Join us in empowering rural women through mushroom cultivation training that creates sustainable income with minimal investment. Your support helps women start profitable enterprises, improve household nutrition, and build economic independence through this proven low-cost, high-return farming model."*
- Buttons: **"Partner with Us"** → `../../partner.html` · **"Support Our Work"** → `../../donate.html`

**Footer / contact (shared, PRESERVE):** Address **"H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India."** · Email **director@coodutrust.org** · Phone **+91-451-2461362** · About line *"Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000."* · © 2025.

---

## 5. Enhancement direction (TO-BE) — opinionated

**Narrative spine (reorder to a clean 6-beat story):**
1. **Hero** — breadcrumb + "← Back to [parent program]" link, category tag, H1, one-line subtitle, ONE strong real project photo (not a 4-up carousel of unrelated stock). Below the headline, a tight inline **stat strip** (3-4 key numbers: `1,600+ trained`, `5+ districts`, `20+ yrs`, `₹300/day`) — this is the credibility hook donors scan first.
2. **What it is** — Programme Overview (lead paragraph + Rationale as a single pull-quote callout) with the **Project Scope** facts as a compact sidebar/"fact sheet" (Period, Districts, Focus, Beneficiary types). Keep the 3 Target-Beneficiary tiles.
3. **What we did** — Phase-wise Implementation as a **vertical timeline / stepper** (4 phases), each step = year badge + title + one stat line + description. This reads far better than 4 equal slabs and reinforces "20+ years."
4. **What's taught** — Training Curriculum: two clean lists (Technical / Enterprise) + a Delivery-Method row. Drop the 3 clashing tint colors; use surface-alt panels + one accent rule.
5. **Proof / impact** — keep the **₹300/Day Story** as the emotional+numeric peak (6 outcome points + emphasis banner) and the **"Why it works"** 8-tile grid as the rational backup. 
6. **Reference data + Act** — collapse the **two tables into one**: the *Programme Legacy Timeline* (Year/Milestone/Impact) is the keeper and is more readable; fold any unique facts from *Verified Statistics* into it or into an expandable "Full data table" `<details>` so the page isn't two near-identical tables back to back. End on the CTA band.

**Add:**
- A persistent **"Back to [Program]"** link (top + bottom) — projects must route up.
- A small **"At a glance" fact card** (Period · Location · Beneficiaries · Focus · Status) pinned in/under the hero — donors want the summary instantly.
- **Real, honest photo captions** — fix the mislabeled gallery (§3.5).
- **Source/credibility microcopy** where a number is notable (e.g. "Verified across project records 2003–2024").

**Remove / de-emphasize:**
- The fixed background photo + blur-glass treatment (perf + off-mood).
- Emoji icons → Lucide line icons.
- The redundant second table (merge per beat 6).
- Multi-tint callout backgrounds → one accent system.

**Emphasize:** the hero stat strip, the ₹300/day outcome, and the 20+ year timeline — these three carry the "credible, long-running, real impact" message for donors/CSR.

**Template robustness (critical — 33 pages):** not every project page has every block. Some are pure-narrative (no income numbers), some have richer tables, some have no gallery photos. The redesign must define each block as **optional and self-contained** so a page can include only the beats it has data for, without looking broken. Define graceful states: hero with no photo, timeline with 1 phase, no income section, table-only data.

**▶ YOUR ENHANCEMENT NOTES: ____**

---

## 6. Three-viewport layout spec (the core deliverable)

Global: max content width `--maxw` (1140px) centered; gutters desktop 24px / mobile 16px; section vertical padding desktop 96px / mobile 56px; surfaces alternate `--surface` ↔ `--surface-alt`; flat sections (no fixed background, no glass). Type, color, radius, shadow = Style Gate tokens.

### WEB (desktop, >=1025px)
- **Header:** full horizontal nav, persistent Donate CTA (Style Gate header component). Sticky.
- **Hero:** 2-column grid `1.1fr 0.9fr`. Left = breadcrumb + back-link + tag pill + H1 (`--fs-h1`) + subtitle + inline 3–4 stat strip + primary CTA. Right = one project photo, **16:9**, radius 12px (or the corrected gallery as a simple slider, single image visible). Below hero full-width: "At a glance" fact card as a 4–5 cell horizontal band.
- **Programme Overview:** 2-col `2fr 1fr`, 48px gap — body + Rationale pull-quote on left, "Project Scope" fact sidebar on right (sticky optional). Target-beneficiary tiles = 3-up row.
- **Phase-wise:** vertical timeline, single column centered at `--maxw-text` ~760–860px, alternating-side cards optional; each phase card full-width with left year-rail.
- **Curriculum:** Technical / Enterprise = 2-col; Delivery method = 2×2 below, full width.
- **Income Impact:** 6 outcome points in a 2- or 3-col grid; emphasis banner full-width.
- **Why it works:** 4-col grid of 8 tiles (2 rows).
- **Timeline table:** full 3-col table, comfortable 16–20px cell padding, header in `--color-primary`.
- **CTA band:** full-bleed accent/surface-alt band, centered, 2 buttons inline.

### TABLET (768–1024px)
- **Header:** condensed; hamburger may appear at the low end.
- **Hero:** stacks to 1 column — text block, then photo full-width 16:9; stat strip wraps 2×2. Fact card → 2 columns.
- **Programme Overview:** stacks to 1 col — body first, then Scope sidebar as a normal card; beneficiary tiles 3-up (or 1×3 if cramped).
- **Phase-wise:** single-column timeline.
- **Curriculum:** Technical/Enterprise remain 2-col if room, else stack; Delivery 2×2 → 1×4 at low end.
- **Income points:** 2-col. **Why-it-works:** 2-col (4 rows).
- **Tables:** keep tabular but allow horizontal scroll only as last resort; prefer reduced cell padding. Begin transition to stacked at lower edge.

### MOBILE (<=600px)
- **Header:** logo + hamburger; slide-in drawer (Style Gate mobile nav).
- **Everything single column.** Body ≥16px, sentence case, line-height 1.6.
- **Hero:** back-link + tag + H1 (mobile scale ~32px) + subtitle + photo 16:9 + stat strip as 2×2 small stat cards + primary CTA full-width. Fact card = stacked label/value rows.
- **Overview:** lead paragraph, Rationale callout, then Scope facts as a stacked list; beneficiary tiles 1-col.
- **Phase-wise:** stacked timeline steps with left year badge.
- **Curriculum:** all lists stack; checkmark + text rows full width.
- **Income / Why-it-works:** 1-col stacked cards.
- **Tables → key/value stacked cards** (each row becomes a small labeled card; NO horizontal scroll). Optionally wrap the full data table in `<details>` "View full statistics."
- **CTA:** stacked full-width buttons, ≥44px touch height.

*(Style Gate canonical rebuild breakpoints are min-width 600/900/1200; the >=1025 / 768–1024 / <=600 framing above is the design-review viewport set — they reconcile: mobile=base, tablet≈900, desktop≈1200.)*

---

## 7. Components used (reference the shared design system / Style Gate)

Global tokens (color, type, spacing, radius, shadow, breakpoints) and base component styling are defined in `design/REDESIGN-STYLE-GATE.md` — **do not redefine them here.** This template composes:

- **Header / nav + mobile drawer** — shared chrome (`.site-header` / `.nav-drawer`).
- **Breadcrumb** + **back-to-program text link** (primary color, arrow affordance).
- **Hero (split text/media)** — `.hero`, `.hero__title`, `.hero__actions` + 16:9 media.
- **Tag / category pill** — pill radius 999px token.
- **Stat block** — `.stat` / `.stat__num` / `.stat__label` (Style Gate stats component) for the hero strip + quick stats.
- **Fact card / "at a glance"** — surface-alt card, hairline border.
- **Callout / pull-quote** — accent left-border on surface-alt (replaces the 3 tinted boxes).
- **Card** — `.card` / `.card__title` / `.card__meta` for phase cards, benefit tiles, beneficiary tiles.
- **Timeline / stepper** — phase-wise implementation (component or composed from cards).
- **Checklist row** — icon + label list (curriculum, income points).
- **Data table** — shared `.statistics-table` styling; responsive stacked variant on mobile.
- **Emphasis banner** — accent band.
- **CTA band** — shared `.sector-cta` → `.cta-title` / `.cta-text` / `.cta-buttons`.
- **Buttons** — `.btn--primary` / `.btn--secondary` (Style Gate button tokens; ≥44px touch).
- **Footer** — shared chrome.
- **Icons** — single Lucide line-icon set (replaces emoji).

---

## 8. Ready-to-paste Claude-design instruction

> Design the **Project-detail page** for **COODU Trust**, a rural-development NGO in Dindigul, Tamil Nadu (20+ years in sustainable agriculture, livelihoods, women's empowerment, health, environment). This is a reusable **template** that will hold ~33 different projects; design it so each content block is optional and self-contained. Use the example project **"Mushroom Cultivation Training"** for the copy.
>
> Produce **THREE** complete, polished designs of this same page:
> 1. **WEB / desktop** at **1280px** wide.
> 2. **TABLET** at **820px** wide.
> 3. **MOBILE** at **390px** wide (include the slide-in nav drawer state).
>
> Follow the COODU Trust **Style Gate exactly** — colors, fonts, spacing, radius, shadows, button/card/stat styles, and per-page intent. Do not invent off-brand colors or fonts. Paste the filled Style Gate here:
>
> ```
> [PASTE FILLED PART 1 STYLE GATE HERE]
> ```
>
> **Page structure, top → bottom (use this exact content, preserve every number/name/₹ figure):**
> - **Hero:** breadcrumb (`Programs > Sustainable Agriculture > Horticulture & Diversified Farming > Mushroom Cultivation Training`) + a "← Back to Horticulture & Diversified Farming" link; category tag "WOMEN'S ENTERPRISE DEVELOPMENT"; H1 "Mushroom Cultivation Training"; subtitle "Entrepreneurship Development through Oyster Mushroom Production (2003-Present)"; ONE authentic project photo (16:9); an inline stat strip: **1,600+ trained · 5+ districts · 20+ years · ₹300/day**; primary CTA "Partner with Us." Add an "At a glance" fact card: Period 2003–Present · Location 5 districts of Tamil Nadu · Beneficiaries 1,600+ · Focus Oyster mushroom & spawn · Status Recurring.
> - **Programme Overview:** lead paragraph + a "Core Rationale" pull-quote callout, with a "Project Scope" fact sidebar (Geographic Coverage by phase, Programme Context, Mushroom Type) and 3 target-beneficiary tiles (Women SHG Members / Marginal & Landless Farmers / Aspiring Rural Entrepreneurs).
> - **Phase-wise Implementation** as a vertical timeline of 4 phases (2003-04 · 2013-14 · Ongoing · 2023-24), each with a year badge, title, one stat line, and a short description.
> - **Training Curriculum:** two lists side by side — Technical Modules (5) and Enterprise Modules (5) — plus a Delivery Method row (4 items). Use line icons, not emoji; one accent color, no clashing tints.
> - **Income Impact ("The ₹300/Day Story"):** 6 outcome points + an accent emphasis banner ("…one of the highest return-on-investment training programmes…").
> - **Why It Works:** grid of 8 short benefit tiles (Low Investment, No Land Required, Agricultural Waste Utilisation, Year-Round Demand, Quick Returns, High Protein, Scalable, Group Enterprise Model).
> - **Programme Legacy Timeline table** (Year | Milestone | Impact, 6 rows) — on mobile, render as stacked key/value cards, no horizontal scroll.
> - **CTA band:** "Support Mushroom Entrepreneurship for Women" + the supporting paragraph + two buttons: "Partner with Us" and "Support Our Work."
> - Shared header (with Donate CTA) and 4-column footer (address H-83, R.M. Colony, Dindigul – 624 001; director@coodutrust.org; +91-451-2461362).
>
> **Requirements:** mobile-first, true reflow (not a squashed desktop); body text sentence case, ≥16px on mobile, ~70-char line length; headings/labels may be all-caps. Flat banded sections (surface ↔ surface-alt) — NO fixed background photo, NO frosted-glass cards, NO emoji icons (use one Lucide-style line-icon set). Real interaction states (button hover, card hover, focus ring, open mobile drawer). Authentic warm rural/training photos as placeholders. Return clean, self-contained output per viewport: semantic HTML5 with landmarks, all styling in one `<style>` block using CSS custom properties mirroring the Style Gate tokens, no inline `style=` attributes, no CSS frameworks, ≤2 Google Fonts, copy-paste runnable. After the designs, list the design tokens used (hex, font sizes, spacing, radii) as a short table.
