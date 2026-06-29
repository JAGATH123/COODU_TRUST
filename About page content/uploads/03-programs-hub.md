# Programs Hub — Design Doc

## 1. Identity
- **File:** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/programs.html`
- **Real page represented:** The single "Our Programs" landing/hub page (`programs.html`) — the gateway to COODU Trust's entire program portfolio.
- **COVERAGE:** This doc governs **1 real page** (the hub itself). It is NOT a template. It is the index/router that links OUT to the 38 program pages under `/programs/` (6 sector overview pages + 32 individual program pages). The 38 destination pages are governed by separate program-page docs; this doc governs only the hub that points to them.
- **One-line role/job:** Give a first-time visitor (donor, CSR partner, government official, volunteer) a confident, scannable overview of the organization's six work sectors and route them into the right deeper program page in one or two clicks.

## 2. Current structure (AS-IS) — section by section

The page is a single `<main>` between the shared header and shared footer. Top-to-bottom:

### A. Page Header / Hero band — `section.page-header`
- **Purpose:** Title the page and set context.
- **Content:** `h1.page-title` = "Our Programs of Impact"; `p.page-subtitle` = "Comprehensive development approach across five key areas of community transformation".
- **Components:** Full-width hero band with a background photo (`headers/programs-bg.png`) under a `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2))` dark scrim, white centered text, ~100px vertical padding. No CTA, no breadcrumb.

### B. Sectors Overview + Tab Navigation — `section.programs-overview.section-padding`
- **Purpose:** Frame the mission and provide the filter control for the sectors below.
- **Content:** `h2.section-title` = "Transforming Communities Through Integrated Development"; `p.section-intro-text` = the "Since 2000…" mission paragraph.
- **Components:** A `div.programs-nav` containing **six `button.program-nav-btn`** filter pills, each with an emoji + label and a `data-sector` attribute:
  - 🌍 Environment & Resilience (`environment-resilience`, starts `.active`)
  - 🌾 Sustainable Agriculture (`sustainable-agriculture`)
  - 👩 Women Empowerment (`women-empowerment`)
  - 🎓 Education & Skilling (`education-skilling`)
  - 🏥 Health, Sanitation & Waste Management (`health-sanitation`)
  - 💼 Consultancy & HR Management (`consultancy-hr`)
- The whole section is forced `background: transparent !important` over the page's fixed background image.

### C–H. Six Sector Sections — `section.sector-section` (one per sector)
- **Behavior (critical):** This is a **TAB/SHOW-HIDE pattern.** `assets/js/sectors.js` toggles `.active`; CSS sets `.sector-section { display:none }` and `.sector-section.active { display:block }`, so **only ONE sector's content is visible at a time.** Clicking a pill hides the others, reveals the chosen sector, updates the active pill, and `scrollIntoView({behavior:'smooth'})` jumps to it. On load, only Environment is shown. (JS also re-reveals cards because an IntersectionObserver fade-in would otherwise leave cards in hidden sectors at `opacity:0` — a known fragility documented in code comments.)
- **Each sector contains:**
  - `div.sector-header` = `div.sector-icon` (large emoji) + `div.sector-title-group` (`h2.sector-title` + `p.sector-subtitle` with a "(N years of experience)" tagline).
  - `div.projects-grid` = a CSS-grid of **`div.project-card`** (auto-fit, `minmax(340px,1fr)`, gap 30px).
- **Each `project-card` holds:**
  - `div.project-header` = `h3.project-title` + `span.project-badge` (pill tag, e.g. "Core Focus", "TWAD Board Partner").
  - `div.project-content` = `p.project-description` + `div.project-activities` (`h4` "Key Activities:" + bulleted `ul`) + `div.project-impact` (two `div.impact-stat`, each `span.impact-number` + `span.impact-label`) + a `a.project-link` "Learn More" (CSS adds a `→` arrow, hover widens the gap).
- **Card counts per sector:** Environment 3, Agriculture 3, Women 3, Education 3, Health 4, Consultancy 3 = **19 cards / 19 "Learn More" links total.**

### I. Call To Action band — `section.sectors-cta.section-padding.light-bg`
- **Purpose:** Convert.
- **Content:** `h2.cta-title` = "Ready to Make a Difference?"; `p.cta-text` = the "Join us in transforming rural communities…" paragraph.
- **Components:** `div.cta-buttons` with two buttons: `a.btn.btn-primary` "Get Involved" → `get-involved.html`; `a.btn.btn-secondary` "Contact Us" → `contact.html`. Also forced `background: transparent !important`.

### Shared chrome (by reference only — see shared-chrome doc)
- **Header/nav** (`header.header`) with the multi-level Programs mega-dropdown (6 sector submenus → all individual program links — 34 program links in the dropdown) and a Donate button + hamburger.
- **Footer** (`footer.footer`): logo + about, Quick Links, Contact address/email/phone, social icons, copyright.
- **Page-level decoration:** body has an inline `background-image` (Cloudinary `aboutus/background.jpg`, fixed, cover) plus a fixed `rgba(255,255,255,0.4)` white overlay div — handled globally, not per this page.

## 3. Current weaknesses (be specific & honest)

1. **Tab/show-hide hides 5 of 6 sectors.** Only one sector renders at a time (`display:none` on the rest). A visitor cannot scroll and absorb the breadth of work; they must click each pill. This is bad for scannability, terrible for SEO (hidden content), and hostile on mobile (pills stack into a tall column, then each tap scroll-jumps).
   **Fix:** Drop the tab gating. Render all six sectors stacked on the page; keep the pill row as **sticky in-page anchor navigation** (jump links / scrollspy), not a content filter. All content is always present.
2. **Copy says "five key areas" but there are SIX sectors.** `page-subtitle` = "across five key areas"; the intro paragraph correctly says "six interconnected sectors."
   **Fix:** Correct to "six" (preserve all other wording).
3. **Emoji as sector identity (🌍🌾👩🎓🏥💼).** Renders inconsistently across OS/browser, looks informal/clip-arty for a 25-year credible NGO, and clashes with the "grounded, trustworthy" brand mood.
   **Fix:** Replace with a single consistent line-icon set (or restrained duotone icons) in brand green, or sector cover photos. No emoji.
4. **Cards are text-only — no imagery.** Long activity bullet lists make each card a wall of text; nothing visual differentiates sectors.
   **Fix:** Give each sector a header photo (real field photography), and tighten card body to description + the two impact stats + Learn More; move long activity bullets to the destination page (or a collapsible).
5. **Inline-style soup + `!important` overrides.** Body has inline background; every section carries `style="background: transparent !important"`; a page-level `<style>` block in `<head>` re-skins `.project-card` (white bg + shadow) to override the stylesheet's transparent border-left variant; cards are force-shown with `opacity:1 !important`.
   **Fix:** Rebuild on the design-system tokens with proper surface colors; remove all inline styles and the JS opacity-reveal hacks.
6. **Duplicate / conflicting CSS.** `.programs-overview`, `.programs-nav`, `.program-nav-btn`, `.sector-section`, `.project-card`, `.project-impact`, `.impact-label`, `.cta-title` are each defined twice (≈line 512 and ≈line 2780 in `style.css`) with different values (e.g. impact uses both flex and 2-col grid; cards are both transparent-border-left and white-shadow). The later block wins unpredictably.
   **Fix:** Single canonical card/grid/stat style from the Style Gate.
7. **Global ALL-CAPS body.** The site forces `text-transform:uppercase` on body; this page patches it back with `text-transform:none` on several selectors — proof the global rule fights the content.
   **Fix:** Sentence case for all body/description text per Style Gate; caps reserved for small labels (badges, impact-labels) only.
8. **Hub surfaces only 19 of 38 programs.** The cards link to a hand-picked subset; the other ~19 program pages are reachable only via the mega-dropdown.
   **Fix:** Per sector, list all its programs (the dropdown's children) as quick links beneath the highlighted cards, so the hub is a true index to all 38 pages.
9. **Weak hero.** Generic dark scrim, no trust signal, no top-level impact number, no breadcrumb.
   **Fix:** Add one or two flagship org-wide stats and a short credibility line in/under the hero.

## 4. Content — source of truth (PRESERVE this)

### Hero
- H1: **"Our Programs of Impact"**
- Subtitle: **"Comprehensive development approach across five key areas of community transformation"** → CORRECT to **"six key areas"** on rebuild.

### Overview
- H2: **"Transforming Communities Through Integrated Development"**
- Intro: **"Since 2000, Coodu Trust has been working across six interconnected sectors to create sustainable change in rural Tamil Nadu. Our holistic approach ensures that communities develop comprehensively, addressing immediate needs while building long-term resilience."**

### Sector tab labels (with emoji to be replaced by icons)
🌍 Environment & Resilience · 🌾 Sustainable Agriculture · 👩 Women Empowerment · 🎓 Education & Skilling · 🏥 Health, Sanitation & Waste Management · 💼 Consultancy & HR Management

### SECTOR 1 — Environment and Resilience
Subtitle: "Building climate-resilient communities through environmental conservation and sustainable development (25 years of experience)"
- **Climate Resilience & Adaptation** — badge "Core Focus". Desc: "Building community resilience to climate change through comprehensive risk assessment, adaptation strategies, and sustainable infrastructure development." Activities: Climate vulnerability assessments · Disaster risk reduction planning · Early warning systems development · Climate-smart infrastructure design · Community-based adaptation programs. Stats: **15+ Districts Covered** · **50+ Communities Resilient**. Link → `programs/climate-change-adaptation.html`
- **Environmental Conservation** — badge "Conservation". Desc: "Large-scale environmental protection through tree plantation, biodiversity conservation, and ecosystem restoration programs across Tamil Nadu." Activities: Large-scale tree plantation drives (26,93,250 trees planted) · Biodiversity conservation initiatives · Ecosystem restoration projects · Wildlife habitat protection · Environmental education programs. Stats: **26,93,250 Trees Planted** · **14 Districts Covered**. Link → `programs/plantation-afforestation.html`
- **Renewable Energy Solutions** — badge "Clean Energy". Desc: "Promoting sustainable energy solutions through solar power, biogas, and other renewable technologies for rural communities." Activities: Solar energy system installations · Biogas plant development · Energy-efficient technology promotion · Community energy planning · Green technology training. Stats: **500+ Households Powered** · **30% Energy Cost Reduction**. Link → `programs/environment-resilience.html`

### SECTOR 2 — Sustainable Agriculture
Subtitle: "Promoting organic farming, watershed management, and innovative agricultural techniques (25 years of experience)"
- **Organic Farming & Natural Methods** — badge "Core Focus". Desc: "Promoting chemical-free agriculture through organic farming techniques, natural pest management, and soil health improvement programs." Activities: Organic farming training for 7,650+ farmers · Natural pest and disease management · Soil health improvement programs · Vermicompost production training · Integrated pest management systems. Stats: **7,650+ Farmers Trained** · **40% Cost Reduction**. Link → `programs/organic-farming.html`
- **Watershed Management** — badge "Water Conservation". Desc: "Comprehensive watershed development across 640 micro-watersheds in 24 districts, focusing on soil and water conservation for sustainable agriculture. Coodu Trust is the only empanelled Field Agency for the Ministry of Jal Shakti." Activities: 640 micro-watersheds management across 24 districts · Rainwater harvesting and groundwater recharge · Check dams and percolation tanks construction · Farm pond creation and water storage · Soil erosion control measures. Stats: **640 Micro-Watersheds Managed** · **24 Districts Covered**. Link → `programs/watershed-management.html`
- **Innovative Agricultural Techniques** — badge "Technology Integration". Desc: "Implementing modern farming techniques including integrated farming systems, precision agriculture, and technology-driven solutions for enhanced productivity." Activities: Integrated farming systems demonstration · Precision agriculture techniques · Farm mechanization support · Crop diversification programs · Post-harvest technology implementation. Stats: **25% Yield Increase** · **1,000+ Farmers Benefited**. Link → `programs/agricultural-technology.html`

### SECTOR 3 — Women Empowerment
Subtitle: "Empowering women through livelihood improvement, microfinance, and community mobilization (25 years of impact)"
- **SHG & Community Mobilization** — badge "Core Focus". Desc: "Promotion of Self Help Groups (SHGs) and Joint Liability Groups (JLGs) for community mobilization and income generation, benefiting 2,168+ individuals across Tamil Nadu." Activities: Formation and strengthening of SHGs and JLGs · Income generation programs for women · Micro-credit and micro-insurance facilitation · Community leadership development · Collective livelihood initiatives. Stats: **2,168+ Income Generation Beneficiaries** · **1,000+ SHGs Formed**. Link → `programs/shg-community-mobilization.html`
- **Microfinance & Financial Inclusion** — badge "Financial Empowerment". Desc: "Micro-credit programs and financial inclusion initiatives funded by NABARD, Mahalir Thittam, TNSRLM, and MKSP, enabling women's economic independence." Activities: Micro-credit program management · Micro-insurance schemes promotion · Financial literacy and management training · Bank linkage facilitation · Credit monitoring and support. Stats: **100% Repayment Rate** · **₹50+ Cr Credit Facilitated**. Link → `programs/microfinance-financial-inclusion.html`
- **Social Empowerment & Leadership** — badge "Women Development". Desc: "Women Development Programme focused on social empowerment, leadership training, and enhanced income opportunities through collective action and skill building." Activities: Women leadership training programs · Rights awareness and legal literacy · Social protection schemes access · Gender sensitization initiatives · Decision-making capacity building. Stats: **500+ Women Leaders Trained** · **25 Years of Experience**. Link → `programs/social-empowerment-leadership.html`

### SECTOR 4 — Education and Skilling
Subtitle: "Empowering communities through quality education and skill development programs (12 years of transformative impact)"
- **Vocational Training Programs** — badge "Skill Development". Desc: "PIA for DDUGKY (PRN: TN2015RT7221) and Training Partner for TNSDC. Comprehensive vocational training across NSDC/ASCI Skill Development in 5 districts with 90%+ placement rates, benefiting 18,592+ youth." Activities: DDUGKY skill training programs (Ministry of Rural Development) · TNSDC vocational training across 5 districts · Sewing machine operation and tailoring · Mobile repair and electronic services · Computer skills, data entry, and IT training · Beautician and hospitality services · Multi-cuisine cooking and food service. Stats: **18,592+ Youth Trained** · **90%+ Placement Rate**. Link → `programs/vocational-livelihood-training.html`
- **Educational Infrastructure Development** — badge "School Adoption". Desc: "School Adoption Programme (SAP) enhancing educational infrastructure with new classrooms, libraries, science labs, and computer facilities." Activities: Classroom and library construction · Science laboratory setup · Computer lab establishment · School toilet and infrastructure development · Evening tuition centers for rural students. Stats: **50+ Schools Adopted** · **5,000+ Students Benefited**. Link → `programs/school-infrastructure-development.html`
- **Entrepreneurship & Business Development** — badge "Enterprise Support". Desc: "Supporting micro-enterprise development through business training, financial literacy, and market linkage programs for sustainable livelihoods." Activities: Business planning and development training · Financial literacy and management · Market linkage and product development · Self-help group formation and strengthening · Micro-credit access facilitation. Stats: **300+ Enterprises Created** · **1,000+ SHGs Formed**. Link → `programs/entrepreneurship-enterprise-development.html`

### SECTOR 5 — Health, Sanitation & Waste Management
Subtitle: "Improving public health through medical services, water safety, sanitation, and solid waste management (20 years of dedicated service)"
- **Water Quality & Safety** — badge "TWAD Board Partner". Desc: "Managing and operating 22 water quality testing laboratories across seven districts for TWAD Board, testing over 66,000 samples annually and training 1,200+ community members." Activities: Operating 22 water quality testing labs · Annual testing of 66,000+ water samples · Field Test Kit (FTK) training under Jal Jeevan Mission · Training PRI representatives on water testing. Stats: **66,000+ Samples Tested Annually** · **1,200+ Community Members Trained**. Link → `programs/water-quality-safety.html`
- **Community Health Services** — badge "Direct Services". Desc: "Operating Ambulatory & Mortuary Services benefiting hundreds of individuals in emergencies. ATC Tires partnership: 20 health camps with 10 specialist doctors, 20 paramedical staff, treating 9,000+ individuals. Specialized COVID-19 response camps." Activities: 24/7 Ambulatory emergency services · Mortuary services for communities (TNHSP) · 20 health camps (ATC Tires partnership) · 10 specialist doctors and 20 paramedical staff deployment · COVID-19 specialized health camps · HIV/AIDS awareness programs. Stats: **9,000+ Individuals Treated** · **20 Health Camps**. Link → `programs/community-health-services.html`
- **Sanitation & Disease Prevention** — badge "Public Health". Desc: "Implementing Total Sanitation Campaign (TSC) in 11 districts and Swachh Bharath initiatives, building 2,500+ household latrines. Running DBC Program and Dengue Eradication Programme in Dindigul for mosquito control and disease prevention." Activities: Total Sanitation Campaign (TSC) in 11 districts · Individual and institutional sanitation facilities (2,500+ toilets) · Domestic Breeding Checkers (DBC) Program in Dindigul · Dengue Eradication Programme implementation · School sanitation and hygiene awareness · Swachh Bharat Mission initiatives. Stats: **2,500+ Toilets Built** · **11 Districts (TSC)**. Link → `programs/sanitation-hygiene-infrastructure.html`
- **Solid Waste Management** — badge "20 Years Experience". Desc: "20 years of expertise in municipal solid waste management. Managing Dindigul MC (48 wards, 54,000 HH, 90 tons/day, 400 workers, ₹7.1 crore) and Padappai (Renault Nissan, ECO-MAC 2T/day, 70%+ segregation, 3,000 HH)." Activities: Dindigul Municipal Corporation: 48 wards, 90 tons/day waste management · Padappai SIPCOT: Zero-waste initiative (Renault Nissan partnership) · Door-to-door collection (54,000+ households) · Source segregation (70%+ efficiency) · ECO-MAC composting plant operation (2 tons/day) · 400+ sanitation workers management. Stats: **90 Tons Daily Waste Managed** · **70%+ Segregation Rate**. Link → `programs/solid-waste-management.html`

### SECTOR 6 — Consultancy and HR Management
Subtitle: "Providing expert consultancy services and human resource management solutions" (no years tagline)
- **Project Management Consultancy** — badge "Expert Services". Desc: "Providing comprehensive project management consultancy services for development programs, including planning, implementation, monitoring, and evaluation." Activities: Project planning and design consultancy · Implementation support and guidance · Monitoring and evaluation frameworks · Stakeholder management and coordination · Impact assessment and reporting. Stats: **100+ Projects Managed** · **25+ Partner Organizations**. Link → `programs/strategic-planning-advisory.html`
- **Organizational Development** — badge "Capacity Building". Desc: "Supporting organizational growth through capacity building, institutional strengthening, and governance improvement programs for NGOs and community organizations." Activities: Institutional capacity assessments · Governance and leadership training · Systems and process development · Strategic planning facilitation · Performance management systems. Stats: **50+ Organizations Strengthened** · **500+ Leaders Trained**. Link → `programs/technology-knowledge-dissemination.html`
- **Human Resource Management** — badge "HR Solutions". Desc: "Comprehensive HR management services including recruitment, training, performance management, and organizational development for development sector organizations." Activities: Recruitment and selection services · Training and development programs · Performance management systems · HR policy development · Employee engagement and retention. Stats: **1,000+ Professionals Managed** · **95% Client Satisfaction**. Link → `programs/hr-staffing-solutions.html`

### CTA band
- Title: **"Ready to Make a Difference?"**
- Text: **"Join us in transforming rural communities across Tamil Nadu. Whether you want to partner with us, volunteer your time, or support our work through donations, there are many ways to get involved."**
- Buttons: **"Get Involved"** → `get-involved.html` · **"Contact Us"** → `contact.html`

### Footer (preserve, shared)
Address: **"H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India."** · Email: **director@coodutrust.org** · Phone: **+91-451-2461362** · About line: "Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000." · Copyright: "© 2025 Coodu Trust. All Rights Reserved."

## 5. Enhancement direction (TO-BE) — opinionated

**Kill the tab gate; make it a single scrollable index.** The single biggest improvement is showing all six sectors on the page at once. Convert the six pills into a **sticky scrollspy anchor bar** (highlights the sector you're scrolling through, click = smooth-scroll to it). Now donors can skim the entire portfolio, and search engines index everything.

**Restructure each sector as a band, not a hidden panel:**
1. Sector intro row: real **icon** (not emoji) + sector title + subtitle + the "(N years)" badge rendered as a small chip. Optionally a slim sector cover photo or color accent strip per sector for visual rhythm.
2. A **3–4 card grid** of the highlighted programs (same cards, redesigned): title, badge, 1–2 line description, the **two impact stats as the visual hero of the card** (big number + caps label), and "Learn More →". **Move the long "Key Activities" bullet lists off the card** — they belong on the destination program page; on the hub they bloat every card into a wall of text. (If you want to keep some, collapse them behind a "View activities" disclosure.)
3. Below the cards, a **"All programs in this sector" quick-link row** listing the sector's full child list from the nav dropdown — so the hub indexes all 38 program pages, not just 19.

**Add a top-of-page credibility strip.** Under the hero, a thin band of 3–4 org-wide flagship numbers pulled from the content (e.g. **Since 2000 · 26,93,250 Trees Planted · 18,592+ Youth Trained · 640 Micro-Watersheds**) to immediately signal scale to a CSR/government visitor.

**Fix the count + casing.** "six key areas" in the subtitle; sentence case body; caps only on badges and stat labels. Replace all emoji with a consistent brand-green icon set.

**Visual upgrade:** cards on a clean surface-alt background, hairline borders, one accent (green) per the Style Gate; subtle hover lift; impact stats separated by a hairline. Alternate sector band backgrounds (white / surface-alt) for scannable rhythm.

**Keep the CTA band** but give it the brand-dark/green treatment so it reads as the page's decisive close; keep both buttons but make "Get Involved" the primary.

**▶ YOUR ENHANCEMENT NOTES: ____**

## 6. Three-viewport layout spec (the core deliverable)

Container max-width ~1200px, centered, generous gutters. All sectors visible (no tab gate). Spacing intent: large vertical rhythm between sectors (~80px desktop / 56px tablet / 40px mobile); calm, whitespace-led per brand mood.

### WEB (desktop, ≥1025px)
- **Hero:** full-bleed photo band, dark green→transparent scrim, centered H1 (~48px) + subtitle. ~96–120px vertical padding.
- **Credibility strip:** full-width band directly under hero, 3–4 stats in a single horizontal row, divided by hairlines.
- **Sector anchor bar:** sticky to top once scrolled past the overview; 6 anchor links in one centered row; active item underlined/filled in green (scrollspy).
- **Overview:** centered H2 + intro paragraph constrained to ~70ch.
- **Each sector band:** left-aligned sector header (icon + title block) full width; below it a **3-column card grid** (4-col sector — Health — wraps to 3+1 or stays 2×2; use `repeat(auto-fit, minmax(320px,1fr))`). Card = vertical stack, equal-height (flex column), "Learn More" pinned to bottom. Impact stats sit in a 2-up row near the card bottom above the link. Quick-link row spans full width beneath the grid.
- **CTA band:** full-width, centered content (~600px), two buttons inline.
- **Image ratios:** optional sector cover photo 16:9 or a 21:9 slim banner; hero ~21:9 / fixed-height band.

### TABLET (768–1024px)
- **Hero:** same band, H1 ~40px, slightly less padding.
- **Credibility strip:** 2×2 grid of stats (or 4-up if they fit).
- **Anchor bar:** sticky; if 6 pills don't fit one row, allow horizontal scroll (no wrap to 2 lines) OR wrap to 2 rows centered.
- **Sector header:** icon + title may stay side-by-side or stack if subtitle is long.
- **Card grid:** **2 columns** (`minmax(300px,1fr)`); the 4-card Health sector becomes 2×2. Gap ~24px.
- **Impact stats:** stay 2-up inside the card.
- **CTA:** buttons inline, may wrap.

### MOBILE (≤600px)
- **Hero:** H1 ~30–32px, subtitle ~16px, ~64px padding; image still present but shorter.
- **Credibility strip:** 2-up grid or a horizontal scroll row of stat chips.
- **Anchor bar:** sticky **horizontally scrollable** chip row (do NOT stack the 6 into a tall column the way the current build does). One tap scrolls to the sector.
- **Sector header:** stacked, centered or left — icon above title, subtitle below.
- **Card grid:** **single column**, full-width cards, ~20px gap. Each card: title, badge below or inline-wrapped, short description, the two impact stats side-by-side (or stacked if cramped — keep numbers prominent), "Learn More →" full-width-tappable (min 44px touch target).
- **Quick-link rows:** vertical list of tappable links per sector.
- **CTA:** stacked full-width buttons ("Get Involved" primary on top).
- Body text never below 16px; all-caps only on tiny labels.

## 7. Components used (reference the shared design system / Style Gate)
Global tokens (colors, fonts, radius, shadows, button & card styles, spacing scale) are defined in `design/REDESIGN-STYLE-GATE.md` — **do not redefine here.** This page composes these shared components:
- **Shared chrome:** Header + Programs mega-dropdown nav, Donate button, hamburger; Footer (see shared-chrome doc).
- **Page hero band** (`page-header` equivalent) — shared hero/title component with photo + scrim.
- **Stat / impact number component** — big number + caps label (reused in credibility strip and in cards).
- **Program card** — shared card surface (radius, border/hairline, shadow, hover-lift) with title + badge/tag pill + description + stat pair + text link with arrow.
- **Tag/badge pill** — shared small caps label chip.
- **Section heading + intro** (`section-title` / `section-intro-text`).
- **Sticky anchor / scrollspy nav** — pill/underline nav component.
- **Buttons** — `btn-primary` / `btn-secondary` from the Style Gate (Get Involved / Contact).
- **CTA band** — shared full-width call-to-action section.
- **Quick-link list** — shared inline link row.
All color, type, radius, and shadow values come from the Style Gate tokens (primary green `#1e7e34`, dark `#155d27`, warm/CTA accents, surfaces, Oswald display + Inter body, sentence-case body) — referenced, not redefined.

## 8. Ready-to-paste Claude-design instruction

> Design the **Programs Hub** page for COODU Trust (a 25-year rural-development NGO in Dindigul, Tamil Nadu). Produce **three self-contained designs: WEB (1440px), TABLET (768px), MOBILE (375px)**, all following the filled **Style Gate** (brand-green `#1e7e34`/`#155d27`, Oswald headings + Inter body, sentence-case body, caps only on small labels, calm/whitespace-led, "grounded, trustworthy, warm, modern, hopeful" — no emoji, no clip-art).
>
> Layout, top to bottom: (1) **Hero** photo band, dark-green scrim, H1 "Our Programs of Impact" + subtitle "Comprehensive development approach across six key areas of community transformation". (2) **Credibility strip** of 4 flagship stats: "Since 2000", "26,93,250 Trees Planted", "18,592+ Youth Trained", "640 Micro-Watersheds". (3) **Overview**: H2 "Transforming Communities Through Integrated Development" + the "Since 2000… six interconnected sectors…" intro. (4) A **sticky scrollspy anchor bar** of the six sectors (Environment & Resilience, Sustainable Agriculture, Women Empowerment, Education & Skilling, Health Sanitation & Waste Management, Consultancy & HR Management) — clean line-icons in green, NOT emoji. (5) **All six sectors shown stacked** (no tabs/hidden panels). Each sector = icon + title + subtitle band, then a card grid of its highlighted programs. **Each program card** = title, a small caps badge/tag, a 1–2 line description, two big impact stats (number + caps label) as the visual focus, and a "Learn More →" link pinned to the bottom; below each sector's cards, a quick-link row of that sector's other programs. (6) **CTA band** "Ready to Make a Difference?" + paragraph, with "Get Involved" (primary) and "Contact Us" (secondary) buttons.
>
> Use the exact copy, every stat number/label, badge text, and link target from the design doc's §4 — do not invent or paraphrase numbers. Grid: 3 columns web (Health sector 4 cards → 2×2 or 3+1), 2 columns tablet, 1 column mobile; on mobile the anchor bar is a horizontally scrollable chip row, never a tall stacked column. Show real field-photography placeholders, equal-height cards, subtle hover lift, hairline dividers between stats. Deliver clean, reusable components consistent with the Style Gate.
