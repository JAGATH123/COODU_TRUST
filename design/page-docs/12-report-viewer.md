# Report Viewer — Design Doc

## 1. Identity
- **File(s):** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/report-viewer.html` (markup + page-scoped `<style>`), driven by `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/js/report-viewer.js` (data + PDF.js logic), plus the shared `assets/css/style.css` (chrome) and `assets/js/main.js` (nav/hamburger).
- **Real page(s) represented:** the single annual-report viewer page. It is a **template**: one HTML file rendered with a `?year=` query-string parameter. Reached from `documents.html` via links like `report-viewer.html?year=2024`, `?year=2023`, … down to `?year=2002`.
- **COVERAGE: this doc governs 1 template that covers 23 real report-instances** — one per fiscal-year entry in `REPORTS_DATA` (`2024 → 2002`, i.e. annual reports for FY **2023–2024** down to FY **2001–2002**). Default when no/invalid param is supplied: `?year=2023` (FY 2022–2023). Same layout, only the year/title/subtitle/summary/highlights/stats/PDF file differ.
- **One-line role:** A two-panel reading room that pairs an interactive in-browser PDF of a given annual report (left) with a structured, animated text summary — headline year, narrative, key highlights, and stat cards — plus report-to-report navigation (right).

---

## 2. Current structure (AS-IS) — section by section

The page has TWO headers (shared site header, then a viewer sub-header) and a two-column body. Top to bottom:

### A. Shared site header — `header.header > .container > nav.navbar`
- **Purpose:** global site chrome. Logo (Cloudinary `coodu_frontlogo.png` + "Coodu Trust" text), full nav menu (Home, About, Programs [6 mega-dropdown groups with sub-submenus], Get Involved [Volunteer / Partner / Donate], Documents, Media, Contact), a "Donate" CTA button, and a hamburger for mobile.
- **Note:** This is the shared chrome — governed by the shared-chrome doc, not here. (Quirk to flag: `Contact` carries `class="active"` on this page, which is wrong — the active item should be **Documents**, since this page lives under Documents.)

### B. Viewer sub-header — `header.viewer-header > nav.viewer-nav`
- **Purpose:** report-context action bar, sticky in intent at the top of the viewer module.
- **Content / components:**
  - **Back link** `a.back-btn` → `documents.html`, label `← Back to Documents`.
  - **Report title** `h1.report-title-header#report-title` — placeholder "Annual Report", replaced by JS with e.g. *"Annual Report 2023-2024: Scaling Impact & Innovation"*.
  - **Action cluster** `.viewer-actions` — three pill buttons: `Download PDF` (`a#download-btn`, href set by JS to the report's PDF path), `Print` (`button#print-btn` → `window.print()`), `Share` (`button#share-btn` → Web Share API, clipboard fallback with `alert('Link copied to clipboard!')`).
- **Style:** solid green `#28a745` band, white text, `3px solid #20c997` bottom border, green drop shadow.

### C. Viewer body — `.viewer-container` (CSS grid, two equal columns `1fr 1fr`)

#### C1. PDF panel — `.pdf-panel` (left column)
- **Purpose:** render and navigate the report PDF in-browser via PDF.js 3.11.174 (CDN).
- **Components:**
  - **Control bar** `.pdf-controls` (light `#f8f9fa` strip): page nav `.pdf-nav` = `Previous` button, page indicator "Page `#current-page` of `#total-pages`", `Next` button; zoom cluster `.zoom-controls` = `−` button, `#zoom-level` ("100%"), `+` button.
  - **Canvas viewport** `.pdf-viewer#pdf-container` — fixed-height (`calc(100vh - 200px)`) flex-centered area. Initially shows a **loading state** (`.pdf-loading` spinner + "Loading PDF..."), then swapped for `<canvas id="pdf-canvas">`. On failure shows **error state** (`.error-state`: ⚠️ icon, message, red "Retry" button reloading the page).
  - **Behaviors:** auto-fit scale on load/resize; zoom in/out (×1.2 step, clamp 0.3–3.0); page render; keyboard `←/→` to page, `Esc` → documents.html; touch swipe left/right to page on mobile.

#### C2. Summary panel — `.summary-panel` (right column, `position: sticky; top: 2rem`)
- **Purpose:** human-readable digest of the report so a reader gets the gist without reading the full PDF.
- **Components (all populated by JS):**
  - **Summary header** `.summary-header`: giant gradient year `h2.report-year#report-year` (e.g. "2023–2024"), subtitle `p.report-subtitle#report-subtitle` (e.g. "Scaling Impact Through Collaboration & Innovation").
  - **Summary text** `.summary-text#summary-text`: the narrative paragraph, revealed character-by-character via a **typewriter animation** (30ms/char) with a blinking green caret.
  - **Highlights** `.highlights#highlights-section`: heading "Key Highlights" + `#highlights-container` holding 6–10 `.highlight-item` rows (green ✓ check + bullet text), each animating in with a staggered `slideInUp` (0.3s stagger, kicked off ~2s after load).
  - **Stats grid** `.stats-grid#stats-container`: two `.stat-card`s (`1fr 1fr`), each a big Oswald number + label, `popIn` scale animation (kicked off ~3s after load).
  - **Report navigation** `.navigation-panel > .nav-buttons`: two outline buttons `← {prevYear} Report` (`#prev-report`, newer) and `{nextYear} Report →` (`#next-report`, older), each routing to `report-viewer.html?year=…`; disabled at the ends of the series.

### D. Shared site footer — `footer#contact-footer.footer`
- **Purpose:** global footer. Four columns: white logo + about blurb; Quick Links (About Us, Our Programs, Careers, Donate); Contact Us (address `H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.`, email, phone); Follow Us (Facebook / Twitter / Instagram icons, all `href="#"`); bottom bar `© 2025 Coodu Trust. All Rights Reserved.`
- **Note:** Shared chrome — governed by the shared-chrome doc, not here. (Odd ordering: scripts `main.js` + `report-viewer.js` are injected **between** the body and the footer in source, not at the end.)

---

## 3. Current weaknesses (be specific & honest)

1. **Two stacked green headers fight each other.** The shared site header (with its own green/white chrome) sits directly above a second solid-green `viewer-header`. Visually the user sees two near-identical green bars. **Fix:** demote the viewer sub-header to a slim **breadcrumb + action toolbar** in the brand surface/neutral tone (or a single sticky toolbar bar), not a second full-color hero band. Let one header own the green.

2. **Off-brand color system.** The whole page is hardcoded to Bootstrap-ish `#28a745` / `#20c997` greens, `#6c757d` greys, `#dc3545` red, and `#f8f9fa/#e9ecef` gradients — none of which reference the project Style Gate tokens. **Fix:** replace every literal hex with Style-Gate brand tokens (primary green, ink, surface, muted, danger) so the viewer matches the rest of the redesigned site.

3. **Massive inline `<style>` soup (640+ lines) scoped to one file.** Page-specific CSS lives inline, including a later `#rv-chrome-fix` patch `<style>` that `!important`-overrides earlier rules — evidence the layout was fought into place. **Fix:** rebuild from Style-Gate component classes; delete the override patch; no `!important` band-aids.

4. **Sticky summary panel + viewport-locked PDF cause layout pain.** The PDF viewport is `height: calc(100vh - 200px)` and the summary panel is `position: sticky` with `max-height: calc(100vh - 4rem); overflow-y:auto`. On short laptops the summary scrolls inside itself, and the patch style had to force `min-height:auto`. **Fix:** let the page scroll naturally; make the **PDF panel** the sticky element (it's the anchor), and let the summary flow.

5. **Gimmicky entry animations delay real content.** Highlights don't appear until ~2s after load and stats until ~3s; the summary types out at 30ms/char (a long paragraph takes ~6–10s to fully appear) with a blinking caret. A reader who wants the numbers must wait. **Fix:** show summary/highlights/stats immediately (or a sub-300ms fade); reserve motion for a single subtle reveal. Numbers must never be gated behind a 3s timer.

6. **No report identity / cover / metadata.** Nothing tells the reader *which* report at a glance beyond a text title — no cover thumbnail, no "FY 2023–2024" chip, no publish context. **Fix:** add a small report-cover thumbnail and a year chip in the summary header.

7. **Weak hierarchy inside the summary.** Summary text, highlights, and stats are similarly weighted blocks; the two stat cards (the most quotable proof) sit *below* a 10-item highlight list and animate in last. **Fix:** promote the two stat numbers to the top of the summary as a headline metric pair; highlights become a scannable checklist below.

8. **Action buttons are low-affordance.** `Download PDF / Print / Share` are translucent white-on-green pills of `0.85rem` text, easy to miss; "Download" is the primary intent but looks identical to "Print". **Fix:** make **Download PDF** the primary solid button; Print/Share secondary/ghost or an overflow menu.

9. **Report-to-report nav is buried at the very bottom** of a scrolling summary, and its labels (`← 2024 Report` / `2025 Report →`) are ambiguous about newer-vs-older. **Fix:** surface a compact year switcher (dropdown or prev/next with explicit "Newer/Older") near the top, and keep the prev/next at the bottom too.

10. **Mobile = tall PDF box then a wall of text.** At ≤768px the PDF viewport becomes `45vh` (40vh at ≤480px) and the summary stacks beneath — the reader scrolls past a cramped PDF to reach the summary, or vice-versa, with no way to jump. **Fix:** mobile tab/segmented switch between **PDF** and **Summary**, or summary-first with a "View full PDF" affordance.

11. **Accessibility gaps.** Buttons are icon/glyph-only in places (`−`, `+`, `✓`, `⚠️`); the blinking caret and motion ignore `prefers-reduced-motion`; the canvas has no text alternative; the wrong nav item is marked `active`. **Fix:** real `aria-label`s, honor reduced-motion, label the canvas region, correct the active nav state to Documents.

12. **PDF panel offers no fallback for failure beyond "Retry".** If PDF.js or the file fails, the reader is stuck. **Fix:** error state should also offer "Download the PDF" and "Open in new tab" as escape hatches (the file path is already known).

---

## 4. Content — source of truth (PRESERVE this)

> The viewer is data-driven; the **same template** must keep working for all 23 years. The strings below are the EXACT copy from `report-viewer.js` (`REPORTS_DATA`). Numbers, labels, and titles must carry verbatim. **Do not redesign the data — design the shell that displays any one entry.**

### Static UI copy (chrome of the viewer, all instances)
- Back link: **"← Back to Documents"** → `documents.html`
- Actions: **"Download PDF"**, **"Print"**, **"Share"**
- PDF controls: **"Previous"**, **"Page {n} of {N}"**, **"Next"**, zoom **"−"** / **"100%"** / **"+"**
- Loading: **"Loading PDF..."**
- Error: ⚠️ + **"Failed to load PDF. Please try again."** / **"Report not found for year {year}"** + button **"Retry"**
- Summary subtitle fallback label: **"Annual Report Summary"**, highlights heading: **"Key Highlights"**
- Report nav: **"← Previous Report"** / **"Next Report →"** (rendered as **"← {year} Report"** / **"{year} Report →"**)
- Share clipboard fallback alert: **"Link copied to clipboard!"**
- Footer address: **"H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India."**, email **director@coodutrust.org**, phone **+91-451-2461362**, copyright **"© 2025 Coodu Trust. All Rights Reserved."**

### Per-report data (verbatim — every title, year, subtitle, summary, highlights, stats)

**FY 2023–2024 (`?year=2024`)** — Title: *"Annual Report 2023-2024: Scaling Impact & Innovation"* · Subtitle: *"Scaling Impact Through Collaboration & Innovation"* · PDF: `assets/Annual reports/annual-report 2023 - 2024.pdf`
- Summary: *"Coodu Trust expanded its presence across Tamil Nadu and Puducherry, championing integrated rural development through strategic partnerships. Key priorities included women-led livelihoods, water safety, village planning, and inclusive skilling."*
- Highlights: Implemented 14 thematic projects across 9 districts & 1 Union Territory, impacting over 38,500 households · Conducted VPDP training for 22,700+ villagers and 1,870 village teams in participatory planning · Trained 3,425 youth under DDU-GKY, PMKVY, and TNSDC programs with 70%+ placement success · Supported 9,250 SHG women in initiating/expanding microenterprises across farm & non-farm sectors · Tested 10,250+ drinking water samples through TWAD labs to ensure community safety · Installed RO systems in 3 villages, ensuring safe water access for 510 households · Conducted community campaigns on gender equality, sanitation, HIV/AIDS, plastic use, and health across 50+ villages · Engaged with multiple CSR & Govt. agencies for sustainable co-implementation of development programs
- Stats: **38,500+** Households Impacted · **22,700+** Villagers Trained

**FY 2022–2023 (`?year=2023`, default)** — *"Annual Report 2022-2023: Integrating Sustainability"* · *"Integrating Sustainability, Empowering Communities"* · `Annula Report 2022 - 2023.pdf`
- Summary: *"Coodu Trust advanced an integrated development approach across Tamil Nadu and Puducherry, with strong focus on climate-resilient agriculture, skill development, women-led enterprises, and decentralized governance training."*
- Stats: **28,700+** Households Reached · **4,220+** Youth Trained (highlights: 28,700+ households / 8 projects / 7 districts; 4,220+ youth; 18,850 VPDP; 8,325 SHG women; 10 Panchayats MKSP; 12,565 water samples; RO for 420 schoolchildren; ~5,000 campaign reach)

**FY 2021–2022 (`?year=2022`)** — *"Annual Report 2021-2022: Building Back Stronger"* · *"Livelihoods, Health & Rights"* · `Annual Report - 2021 - 2022.pdf`
- Stats: **6,307** Families Restored · **36,000+** Villagers Trained (highlights incl. 225 villages, 1,871 village teams, 4,011 youth, 2,265 SHG women, 12,000+ samples, 135 short-stay residents)

**FY 2020–2021 (`?year=2021`)** — *"Annual Report 2020-2021: Responding to Crisis, Reinforcing Communities"* · same subtitle · `Annual Report 2020 - 2021.pdf`
- Stats: **34,011+** Total Beneficiaries · **9** Districts Covered (COVID relief 7,253 families; 10,021 villagers; RO 540 tribal households; 3,200 saplings + 1,060 kitchen gardens; 8,720+ samples; 3,042 youth; 175 short-stay residents; 15 villages street plays)

**FY 2019–2020 (`?year=2020`)** — *"Annual Report 2019-2020: Reviving Livelihoods, Restoring Balance"* · same subtitle · `Annual Report 2019-20.pdf`
- Stats: **54,585+** Total Beneficiaries · **3,920+** Hectares Rejuvenated (5,000+ Mahila Kisans MKSP; 3,920+ ha IWMP/TATA/ATG; 4,210+ youth; 12,000+ samples; RO 375+ children; 30,000+ reached)

**FY 2018–2019 (`?year=2019`)** — *"Annual Report 2018-2019: Participation, Productivity & Protection"* · same subtitle · `Annual Report 2018-2019.pdf`
- Stats: **85,000** Watershed Beneficiaries · **9,665+** Direct Participants (2,200+ SHGs Virudhunagar 5 blocks; 1,200 ha rainwater ATG–United Way; 85,000 IWMP; ~855 youth; 80%+ placement; 6,000+ samples; WASH 200+ in 5 Trichy schools; 210 short-stay; 200 Karur consumer-rights)

**FY 2017–2018 (`?year=2018`)** — *"Annual Report 2017-2018: Participatory Development in Action"* · same subtitle · `Annual Report_2017-2018.pdf`
- Stats: **8.5 Lakh** Watershed Beneficiaries · **34,653+** People Trained (570 Watershed Programs / 14 districts; ₹1.33 crore to 67 SHGs; 2,050+ youth; 1,961 certified / 1,617 placed; 12 vet camps; 125 farmers rainwater; 15 nutrient gardens + 5 WASH schools; 137 mortuary-van services; 30,600 villagers + 1,836 teams VPDP; 1,000+ day participants)

**FY 2016–2017 (`?year=2017`)** — *"Annual Report 2016-2017: Serving Communities, Deepening Roots"* · same subtitle · `Annual Report 2016-2017.pdf`
- Stats: **2,692+** Direct Beneficiaries · **₹1.33 Cr** Microfinance Support (560 dairy + 1,000 apparel NSDC; ₹1.33 cr / 67 SHGs; 15 nutrient gardens; 325 students; 12 animal + 20 medical camps w/ Rotary & Lions; 50 panchayat leaders Swachh Bharath; 600 seedlings / yoga / 100 PLHIV kits; 137 mortuary van; 210 short-stay)

**FY 2015–2016 (`?year=2016`)** — *"Annual Report 2015-2016: Skilling Communities, Growing Enterprises"* · same subtitle · `Annual report 2015-2016.pdf`
- Stats: **4,310+** Direct Beneficiaries · **₹1.33 Cr** Microfinance Enabled (560 dairy + 1,000 apparel NSDC; 2,000 spoken-English; 30,000+ seedlings; 750 youth / 75 villages; FPOs in 10 villages; 32 animal camps + 15 gardens + 67 health drives; 126 mortuary van; ₹1.33 cr Karur SHG)

**FY 2014–2015 (`?year=2015`)** — *"Annual Report 2014-2015: Empowering Livelihoods, Building Local Capacity"* · same subtitle · `Annual report 2014-2015.pdf`
- Stats: **4,499+** Total Beneficiaries · **8** Skill Development Programs (539 dairy PMKVY/NSDC; 1,000 KVIC artisans / 5 trades; 1,200 women NIFT-TEA; 750 organic farmers; 10,000 trees / 20 villages; 10 tuition centres / 250 students; 560 youth soft-skill + tractor; 200 yoga)

**FY 2013–2014 (`?year=2014`)** — *"Annual Report 2013-2014: Strengthening Systems, Amplifying Voices"* · same subtitle · `Annual reopt 2013-2014.pdf`
- Stats: **1,200+** SHGs Mobilized · **9,800+** Toilets Facilitated (1,200 SHGs / 12 districts; PRAs in 400 villages; 9,800+ TSC toilets; TANSACS FSW Pudukottai; TN-IAMWARM; 300+ new CBOs / 10 districts; eco-model farms; NREGA/tourism documentation; research)

**FY 2012–2013 (`?year=2013`)** — *"Annual Report 2012-2013: Scaling Change, Deepening Roots"* · same subtitle · `annual-report-2012-2013.pdf`
- Stats: **₹5 Crore** Micro-credit Disbursed · **10,222+** Toilets Built (1,345 SHGs / 11 districts; 10,222+ toilets TSC; HIV/AIDS in 534 panchayats; TANSACS FSW; TN-IAMWARM WUAs; organic demo Velliyanai; mortuary van TNHSP; 290 CBOs / 9 districts)

**FY 2011–2012 (`?year=2012`)** — *"Annual Report 2011-2012: Refocusing Strategy for Deeper Community Engagement"* · same subtitle · `annual-report-2011-2012.pdf`
- Stats: **14,000+** Women Reached · **1,026** Total Staff-Months (6 districts; 645 SHGs / 14,000+ women; 630 staff-months WUA World Bank TN IAMWARM; Mahalir Thittam Karur 180 staff-months; HIV/AIDS FSW Pudukottai 216 staff-months; IWMP 4 districts; 12 networks + 13+ govt agencies)

**FY 2010–2011 (`?year=2011`)** — *"Annual Report 2010-2011: Deepening Impact, Broadening Horizons"* · same subtitle · `annual-report-2010-2011.pdf`
- Stats: **340+** Training Programs · **8,487+** Direct Beneficiaries (340+ programs; 1,965 youth; 1,522 migrant workers HIV/AIDS; 5,000+ women / 6 events; eco-skills vermicompost/biopesticides/herbal/nursery; TNHSP mortuary van; NABARD/DRDA/DIC partnerships)

**FY 2009–2010 (`?year=2010`)** — *"Annual Report 2009-2010: Diversification, Youth Focus & Systems Strengthening"* · same subtitle · `annual-report-2009-2010.pdf`
- Stats: **9,000+** Total Beneficiaries · **7** Program Diversification Areas (2,500+ SHG women; 6,500+ migrant workers Karur; National Youth Day & CAPART; bamboo IFGTB Karur; mass awareness Women's 2000+ / AIDS 500+ / Migrants 1200+; mortuary van 500+ TNHSP)

**FY 2008–2009 (`?year=2009`)** — *"Annual Report 2008-2009: Integration, Innovation, and Impact"* · same subtitle · `annual-report-2008-2009.pdf`
- Stats: **9,000+** Rural Leaders Trained · **100%** Integrated Development

**FY 2007–2008 (`?year=2008`)** — *"Annual Report 2007-2008: Toward Lasting Development Impact"* · same subtitle · `annual-report-2007-2008.pdf`
- Stats: **10,000+** Stakeholders Trained · **100%** Governance Models Solidified

**FY 2006–2007 (`?year=2007`)** — *"Annual Report 2006-2007: Institutional Maturity & Program Synergy"* · same subtitle · `annual-report-2006-2007.pdf`
- Stats: **11,000+** Individuals Trained · **100%** Autonomous Structures

**FY 2005–2006 (`?year=2006`)** — *"Annual Report 2005-2006: Scaling Impact Through Consolidation"* · same subtitle · `annual-report-2005-2006.pdf`
- Stats: **10,000+** Individuals Trained · **9+** Districts Embedded

**FY 2004–2005 (`?year=2005`)** — *"Annual Report 2004-2005: From Participation to Ownership"* · same subtitle · `annual-report-2004-2005.pdf`
- Stats: **12,000+** Rural Citizens Trained · **9+** Districts with Deep Roots

**FY 2003–2004 (`?year=2004`)** — *"Annual Report 2003-2004: Deepening Impact, Broadening Horizons"* · same subtitle · `annual-report-2003-2004.pdf`
- Stats: **15,000+** Stakeholders Trained · **9+** Districts Strengthened

**FY 2002–2003 (`?year=2003`)** — *"Annual Report 2002-2003: Scaling Impact, Deepening Roots"* · same subtitle · `annual-report-2002-2003.pdf`
- Stats: **20,000+** Community Institutions · **25,000+** Capacity Building Participants

**FY 2001–2002 (`?year=2002`)** — *"Annual Report 2001-2002: Laying the Foundation for Transformation"* · same subtitle · `annual-report-2001-2002.pdf`
- Summary: *"This foundational year marked the beginning of our transformative journey in Tamil Nadu. We mobilized communities across multiple districts, established robust community institutions, and created sustainable frameworks for rural development that would guide our mission for decades to come."*
- Stats: **50,000+** People Mobilized · **9+** Districts Covered (10,000+ community institutions incl. 8,925 SHGs; DPAP/IWDP/TNCWP; 40,000+ trained)

> Cross-cutting acronyms that recur in copy (keep as-is): **VPDP, SHG, DDU-GKY, PMKVY, TNSDC, NRuM, NULM, MKSP, TWAD, RO, CSR, IWMP, TSC, TANSACS, FSW, TN-IAMWARM, WUA, CBO, NSDC, KVIC, NIFT-TEA, NABARD, DRDA, DIC, TNHSP, DPAP, IWDP, TNCWP, PLHIV, WASH.**

---

## 5. Enhancement direction (TO-BE) — opinionated

**Overall:** keep the proven two-panel idea (PDF + summary) but rebuild it as a calm "reading room": one header, brand-token colors, instant content, sticky PDF, and a year switcher. The summary becomes a real scannable digest, not an animated reveal.

**Header / toolbar**
- Kill the second full-green band. Under the shared site header, add ONE slim **sticky viewer toolbar**: left = breadcrumb `Documents › Annual Reports › {FY year}`; center = report title (truncates); right = primary **Download PDF** (solid) + secondary **Print** / **Share** (ghost or a single overflow "•••" on small screens).
- Add a compact **year switcher** (dropdown listing 2023–24 … 2001–02, current selected) in the toolbar so a reader can jump to any report without going back to Documents.
- Fix the active nav state to **Documents**.

**PDF panel**
- Make the PDF panel the **sticky** element (it's the anchor); summary scrolls past it on desktop.
- Keep PDF.js controls but modernize: real labeled icon buttons (Prev/Next with `aria-label`), page "n / N", zoom −/100%/+ and add a **"Fit"** and **"Open PDF in new tab"** affordance. Keep keyboard + swipe.
- Error state gains escape hatches: "Download the PDF" and "Open in new tab" alongside "Retry".

**Summary panel (re-ordered for hierarchy)**
1. **Year chip + headline** (FY 2023–2024) and report title/subtitle.
2. **Two stat cards FIRST** — the most quotable proof, big Oswald numbers, brand-token cards, shown immediately.
3. **Summary paragraph** — shown instantly (no 30ms typewriter; at most a 200ms fade). Remove blinking caret.
4. **Key Highlights** — a tidy checklist (✓ in brand green), shown immediately or with a single subtle stagger that respects `prefers-reduced-motion`.
5. **Report navigation** — Newer/Older prev-next, labeled with explicit FY years; mirror the top year switcher.

**Add / Remove / Reorder**
- ADD: report-cover thumbnail (or first-page snapshot) + FY chip; "Open in new tab"; year switcher; page-jump input (type a page number); reduced-motion support; correct breadcrumb.
- REMOVE: the second green header band, the `#rv-chrome-fix !important` patch, the 2s/3s delayed reveals, blinking caret, hardcoded Bootstrap hexes.
- REORDER: stats above the highlights; primary action (Download) visually dominant.

**Mobile**
- Replace "tall PDF then wall of text" with a **segmented control: [ Summary | PDF ]** (Summary default). Summary view shows chip/stats/paragraph/highlights/nav; PDF view shows the full-width canvas with sticky controls and a floating page indicator. A "View the full PDF" button on the summary jumps to the PDF tab.

**Missing content worth surfacing**
- A one-line "About these reports" note + the registration line ("registered non-profit, Tamil Nadu, since 2000") for context.
- File size / page count near the Download button so users know what they're getting.

▶ YOUR ENHANCEMENT NOTES: ____

---

## 6. Three-viewport layout spec (the core deliverable)

Shared chrome (site header + footer) per the shared-chrome doc; specs below are the viewer module between them.

### WEB (desktop, ≥1025px)
- **Page flow:** site header → sticky viewer toolbar → two-column viewer → footer. Whole page scrolls naturally (no inner-locked panels).
- **Viewer toolbar:** full-width sticky bar (top, just under site header), height ~56–64px, brand surface tone (NOT a second green hero). Left: breadcrumb + back arrow. Center: report title (single line, ellipsis). Right: Download (solid primary) + Print + Share + year-switcher dropdown.
- **Body grid:** centered container max-width ~1500–1600px, padding ~24px, **two columns** with a slight bias to the document — recommend `grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr)` (PDF a touch wider than summary), gap 24px.
- **PDF panel (left):** `position: sticky; top: ~80px` (below toolbar), white card, radius/shadow per Style Gate. Control strip on top (page nav left, zoom right). Canvas viewport fills remaining height up to `~calc(100vh - 120px)`, auto-fit scale, page shadow on canvas. Document image is rendered at the PDF's native aspect (typically ~A4 portrait, ~1:1.41), centered, never upscaled past 100% unless zoomed.
- **Summary panel (right):** flows/scrolls with the page (PDF stays pinned). Order: FY chip + year `h2` (Oswald, large) + subtitle → 2-up stat cards (`1fr 1fr`) → summary paragraph → Key Highlights checklist (single column) → prev/next report buttons (`1fr 1fr`).
- **Spacing intent:** generous vertical rhythm (24–32px between summary blocks); stat cards prominent; comfortable line length (~60–70ch) for summary text.

### TABLET (768–1024px)
- **Toolbar:** stays full-width sticky; if title + all three actions + switcher don't fit, collapse Print/Share into an overflow "•••" menu; keep Download visible. Year switcher stays.
- **Body grid:** keep **two columns** but equalize: `grid-template-columns: 1fr 1fr`, gap ~16px, container max ~1024–1100px, side padding ~16px. PDF viewport height ~`calc(100vh - 160px)`.
- **Summary:** stat cards remain 2-up; highlights single column; nav buttons 2-up. Slightly reduced year font (~2.2rem) and panel padding (~24px).
- **PDF panel:** may be sticky if height allows; if the combined height is awkward, allow it to be non-sticky and let the page scroll. Canvas auto-fits the narrower column.

### MOBILE (≤600px; behavior also applies to the ≤768 breakpoint)
- **Toolbar:** compact, sticky. Row 1: back arrow + breadcrumb/title (truncated). Row 2: Download (full-width-ish primary) + an overflow "•••" for Print/Share + year switcher. No second green band.
- **Segmented control:** `[ Summary | PDF ]` directly under the toolbar, sticky. **Summary is the default tab.**
  - **Summary tab:** single column, full width, ~16px side padding. Order: FY chip + year heading + subtitle → stat cards stacked **1 column** (full width) → summary paragraph → Key Highlights checklist → prev/next report buttons stacked full-width → a "View the full PDF →" button switching to the PDF tab.
  - **PDF tab:** full-bleed white card; sticky mini control bar (Prev / "n of N" / Next, zoom −/+, Fit, Open-in-new-tab). Canvas fits device width (`max-width:100%`, height auto), swipe left/right to page. A small floating page indicator.
- **No inner scroll traps:** the page scrolls; canvas never forces horizontal overflow (`overflow-x:hidden` safeguard). Honor `prefers-reduced-motion` (no typewriter, no blink, minimal fade).

---

## 7. Components used (reference the shared design system / Style Gate)

> GLOBAL tokens — colors, fonts (Oswald display / Inter body), radius, shadow, button & card styles, spacing scale — are defined in **`design/REDESIGN-STYLE-GATE.md`**. Do NOT redefine them here; consume them.

Shared components / patterns this page relies on:
- **Shared site header / nav** (logo, mega-menu, hamburger, Donate CTA) — shared-chrome doc; fix active state → Documents.
- **Shared site footer** (4-col + bottom bar) — shared-chrome doc.
- **Buttons:** primary solid (Download PDF, Retry), secondary/ghost (Print, Share, Fit, Open-in-new-tab), outline prev/next (report nav) — Style-Gate button tokens.
- **Stat card** — Style-Gate stat/metric card (Oswald number + Inter label). Reuse the site's stat-card style; do not invent a new green-bordered card.
- **Checklist / highlight item** — Style-Gate list-with-check pattern (✓ in brand green + text).
- **Chip / badge** — for the FY year chip and "Page n of N" — Style-Gate chip token.
- **Card surface** — white rounded card w/ Style-Gate radius + shadow for both PDF panel and summary panel.
- **Toolbar / breadcrumb** — Style-Gate breadcrumb + sticky toolbar pattern.
- **Dropdown** — Style-Gate select/menu for the year switcher and the mobile "•••" overflow.
- **Segmented control / tabs** — Style-Gate tab pattern for the mobile Summary/PDF switch.
- **Loading spinner & error/empty state** — Style-Gate feedback states (replace ad-hoc spinner, ⚠️, red retry).
- **Motion:** Style-Gate transition tokens only; all reveals gated by `prefers-reduced-motion`.

---

## 8. Ready-to-paste Claude-design instruction

> Paste into Claude design (browser) together with the filled Style Gate (`design/REDESIGN-STYLE-GATE.md`).

```
Using the attached COODU Trust STYLE GATE for ALL colors, fonts, radius, shadows,
buttons, cards, chips, and spacing (do not invent new tokens), produce THREE
clean, self-contained designs — WEB (≥1025px), TABLET (768–1024px), MOBILE (≤600px)
— for the "Annual Report Viewer" page of an NGO in Dindigul, Tamil Nadu.

PURPOSE: a calm reading room pairing an in-browser PDF of an annual report (left)
with a structured text summary (right). It is a template reused for 23 yearly
reports; design the shell, using the SAMPLE content below for FY 2023–2024.

LAYOUT:
- Shared site header on top; shared 4-column footer at bottom (brand chrome).
- ONE slim sticky viewer toolbar (NOT a second colored hero): left = back arrow +
  breadcrumb "Documents › Annual Reports › FY 2023–2024"; center = report title;
  right = primary "Download PDF" button + ghost "Print"/"Share" + a year-switcher
  dropdown (FY 2023–24 … FY 2001–02).
- WEB/TABLET: two cards side by side. LEFT = PDF panel: top control strip (Previous |
  "Page 1 of 24" | Next  …  zoom − / 100% / + / Fit / Open in new tab), below it a
  centered portrait PDF page (~A4, soft page shadow) on a light viewport; the PDF
  panel is sticky. RIGHT = summary card that scrolls: FY chip "FY 2023–2024", big
  Oswald year heading "2023–2024", subtitle "Scaling Impact Through Collaboration &
  Innovation", THEN two stat cards, THEN the summary paragraph, THEN a "Key
  Highlights" checklist (green ✓), THEN "← Newer report / Older report →" buttons.
- MOBILE: toolbar compact; a sticky segmented control [ Summary | PDF ] (Summary
  default). Summary tab = single column: chip, year, subtitle, stat cards stacked,
  paragraph, checklist, prev/next, and a "View the full PDF →" button. PDF tab =
  full-width canvas with a sticky mini control bar and swipe-to-page.

SAMPLE CONTENT (use verbatim):
- Title: "Annual Report 2023-2024: Scaling Impact & Innovation"
- Subtitle: "Scaling Impact Through Collaboration & Innovation"
- Summary: "Coodu Trust expanded its presence across Tamil Nadu and Puducherry,
  championing integrated rural development through strategic partnerships. Key
  priorities included women-led livelihoods, water safety, village planning, and
  inclusive skilling."
- Stat cards: "38,500+ Households Impacted" and "22,700+ Villagers Trained".
- Key Highlights (✓ list): "Implemented 14 thematic projects across 9 districts &
  1 Union Territory, impacting over 38,500 households"; "Conducted VPDP training for
  22,700+ villagers and 1,870 village teams"; "Trained 3,425 youth under DDU-GKY,
  PMKVY, and TNSDC with 70%+ placement"; "Supported 9,250 SHG women in micro-
  enterprises"; "Tested 10,250+ drinking water samples through TWAD labs";
  "Installed RO systems in 3 villages for 510 households".

STYLE: brand green from the Style Gate only (NO Bootstrap #28a745); Oswald for the
big year/numbers, Inter for body; rounded white cards with soft shadows; primary
solid Download button, ghost secondary actions; no blinking caret, no typewriter,
no gimmick delays; respect prefers-reduced-motion; clear hierarchy with stats
prominent. Provide all three viewports as separate clean frames.
```
