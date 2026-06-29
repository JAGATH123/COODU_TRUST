# Volunteer & Partner (shared info+CTA layout) — Design Doc

## 1. Identity

- **File(s):** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/volunteer.html` and `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/partner.html`.
- **Real page(s) represented:** "Volunteer with Us" (nav: Get Involved → Volunteer) and "Partner with Us" (nav: Get Involved → Partner with Us). Both live under the "Get Involved" dropdown (alongside `donate.html`, which is a different page-type not covered here).
- **COVERAGE: This doc governs 2 pages** (`volunteer.html` + `partner.html`). They are the same page-type/template — a long-scroll "conversion landing page" — differing only in content (audience, copy, icons, stats, success-story format). One layout system, two content fills.
- **One-line role/job:** Persuade a self-selecting visitor (an individual who wants to give time, or an organization that wants to give money/resources) to take ONE conversion action — apply / start a partnership discussion — by stacking proof (stats, opportunity cards, testimonials/success stories, process steps, requirements/benefits) and funnelling everything into a final CTA band with email + phone.

---

## 2. Current structure (AS-IS) — section by section

Both pages share an identical skeleton: **Header → Page Header (hero band) → Overview (text + image, 50/50) → Opportunity card grid → Social proof (testimonials / success stories) → Process steps (1-2-3-4) → Requirements/Benefits → CTA band → Footer.** Differences are noted per section.

**Page-level chrome (both pages):**
- `<body>` carries an **inline-styled fixed background image** (Cloudinary `aboutus/background.jpg`, `background-size:cover`, `background-attachment:fixed`) plus a sibling **fixed white-overlay div** at `rgba(255,255,255,0.4)`, `z-index:-1`. This is a global page texture, not a section.
- `header.header` → `.container` → `.navbar`: logo (img + "Coodu Trust" text), full `.nav-menu` with a deep multi-level Programs mega-dropdown and a "Get Involved" dropdown (Volunteer / Partner with Us / Donate) marked `.active`, a standalone `.btn.btn-primary.donate-button`, and a `.hamburger` (3 bars) for mobile. **Nav + footer are shared chrome — see the shared-chrome doc; not redefined here.**

### Section-by-section

**(A) PAGE HEADER — `section.page-header`** (both)
- **Purpose:** Title band / page hero.
- **Content:** `h1.page-title` + `p.page-subtitle`, inside `.container`. Background image set inline.
  - Volunteer: bg `assets/images/headers/volunteer-header.jpg`; "Volunteer with Us" / "Be the change you want to see - contribute your time, skills, and passion".
  - Partner: bg `assets/images/headers/partner-header.jpg`; "Partner with Us" / "Creating sustainable impact through strategic partnerships and collaboration".
- **Components:** Hero band (title + subtitle over image). No CTA in the hero.

**(B) OVERVIEW — `section.volunteer-overview` / `section.partnership-overview`** (`.section-padding`)
- **Purpose:** Mission framing + headline stats; the emotional "why".
- **Content:** `.overview-content` holding two children:
  - `.overview-text`: `h2.section-title` + `p.overview-description` (one long paragraph) + a 4-up stat block (`.volunteer-highlights` / `.partnership-highlights`) of `.highlight-item` (each = `.highlight-number` + `.highlight-label`).
  - `.overview-image`: a single `img.sector-image` with **inline** `height:400px; object-fit:cover`.
- **Components:** Two-column info+image split; inline 4-up stat counters.

**(C) OPPORTUNITY GRID — `section.volunteer-opportunities` / `section.partnership-types`** (`.section-padding.light-bg`)
- **Purpose:** The core "what you can do / how we can work together" menu.
- **Content:** `h2.section-title` + `p.section-intro-text`, then a card grid.
  - **Volunteer — `.opportunities-grid` with 6 `.opportunity-card`** (first is `.featured`). Each card = emoji `.opportunity-icon` + `.opportunity-content` (`h3.opportunity-title`, `p.opportunity-excerpt`, `.opportunity-details` = 4 `.detail-item` with a bold label, and `.opportunity-benefits` = 3 `.benefit-tag` checkmark chips).
  - **Partner — `.partnership-grid` with 4 `.partnership-card`** (first is `.featured`). Each card = emoji `.partnership-icon` + `.partnership-content` (`h3.partnership-title`, `p.partnership-excerpt`, `.partnership-features` = 4 `.feature-item` checkmark lines, and `.partnership-investment` = a single `.investment-range` pill/figure).
- **Components:** Responsive card grid; featured card variant; icon + title + excerpt + meta-list + tag chips.

**(D) SOCIAL PROOF**
- **Volunteer — `section.volunteer-stories`** (`.section-padding`): `h2.section-title` "Volunteer Stories" + `.testimonials-grid` of **3 `.testimonial-card`**. Each = `.testimonial-content` → `.volunteer-photo` (`img.volunteer-img`) + `.testimonial-text` (`h3.testimonial-title` quote-headline, `p.testimonial-quote`, `.volunteer-info` = `<strong>` name, `<span>` role/duration, `.volunteer-impact` line). **Static grid, no JS.**
- **Partner — `section.partnership-success`** (`.section-padding`): `h2.section-title` "Partnership Success Stories" + a **JS carousel** `.success-slider` with **2 `.success-card`** (first `.active`). Each = `.success-content` → `.partner-logo` (`img.logo-img`) + `.success-text` (`h3.success-title`, `p.success-description`, `.success-author` = `<strong>` + `<span>`, and `.success-metrics` = 3 `.metric` blocks each `.metric-number` + `.metric-label`). Below: `.slider-controls` (`.slider-btn.prev` "‹", `.slider-dots` 2 `.dot`, `.slider-btn.next` "›"). Driven by inline `<script>` at bottom: `changeSlide()`, `currentSlide()`, `showSlide()`, auto-advance every 8s.
- **Components:** Testimonial card grid (volunteer) vs. single-item carousel with metrics + dots/arrows + autoplay (partner).

**(E) PROCESS — `section.volunteer-process` / `section.partnership-process`** (`.section-padding.light-bg`)
- **Purpose:** Demystify "how to start" in 4 steps.
- **Content (Volunteer):** `h2` "How to Get Started" + `.process-timeline` of 4 `.timeline-item` (each `.timeline-marker` numbered 1-4 + `.timeline-content` h3 + p). Steps: Express Interest → Interview & Matching → Orientation & Training → Start Volunteering.
- **Content (Partner):** `h2` "How to Partner with Us" + `.process-steps` of 4 `.step-item` (each `.step-number` 1-4 + `.step-content` h3 + p). Steps: Initial Discussion → Program Design → Implementation → Impact Assessment.
- **Components:** Numbered step/timeline sequence (different class names, same idea — should be unified).

**(F) REQUIREMENTS / BENEFITS**
- **Volunteer — `section.volunteer-requirements`** (`.section-padding`): `h2` "Volunteer Requirements & Support" + `.requirements-grid` = two `.requirements-column`. Left "What We Look For" = `.requirement-list` of 6 `.requirement-item` (✓ lines). Right "What We Provide" = `.support-list` of 8 `.support-item` (emoji-prefixed lines).
- **Partner — `section.partner-benefits`** (`.section-padding`): `h2` "Why Partner with Coodu Trust?" + `.benefits-grid` = **6 `.benefit-card`** (each `.benefit-icon` emoji + h3 + p).
- **Components:** Two-column ✓ checklist (volunteer) vs. 6-up icon-card "value props" grid (partner).

**(G) CTA BAND — `section.volunteer-cta` / `section.partnership-cta`** (`.section-padding.light-bg`)
- **Purpose:** The single conversion moment.
- **Content:** `.cta-content` → `h2.cta-title` + `p.cta-text` + `.cta-buttons` (primary + secondary `.btn`) + `.contact-info` (2 `.contact-item` with bold label + value).
  - Volunteer: "Ready to Make a Difference?"; buttons `Apply to Volunteer` (→ `contact.html?subject=volunteer`) + `Download Volunteer Guide` (→ `assets/documents/volunteer-handbook.pdf`, `target=_blank`); coordinator `volunteers@coodutrust.org`, phone `+91-451-2461362`.
  - Partner: "Ready to Create Impact Together?"; buttons `Start Partnership Discussion` (→ `contact.html?subject=partnership`) + `Download Partnership Brochure` (→ `assets/documents/partnership-brochure.pdf`, `target=_blank`); team `partnerships@coodutrust.org`, direct line `+91-451-2461362`.
- **Components:** Centered CTA band (heading + supporting line + dual buttons + inline contact strip).

**(H) FOOTER — `footer.footer`** (both, identical) — shared chrome; see shared-chrome doc.

---

## 3. Current weaknesses (be specific & honest)

1. **Inline-style soup on `<body>` + overlay div.** The fixed Cloudinary background + `rgba(255,255,255,0.4)` overlay are hard-coded inline on every page. It fights the section backgrounds (`.light-bg` alternation barely reads over a busy photo) and is an external image dependency for page texture. **Fix:** move page background to the Style Gate's neutral surface token; drop the photo-as-wallpaper. Let section bands (white vs. tinted) carry rhythm.
2. **Inline `height:400px; object-fit:cover` on the overview image.** Layout magic numbers in markup; the image cannot respond per-viewport. **Fix:** fixed aspect-ratio box (e.g. 4:3 / 3:2) controlled by CSS per breakpoint.
3. **Two different class vocabularies for the SAME pattern across the two pages** (`.opportunity-card`/`.partnership-card`, `.process-timeline`/`.process-steps`, `.timeline-marker`/`.step-number`, `.volunteer-highlights`/`.partnership-highlights`). This is a template that pretends to be two bespoke pages. **Fix:** in the rebuild, unify to one component set (`.info-card`, `.stat`, `.process-step`, `.cta-band`) and only vary content/icon, so both pages style-match exactly.
4. **Emoji as the entire icon system** (🌾💼📚📱🎉📊 / 🏢🎓🤝💻 / 🏠🍽️🚗 etc.). Renders inconsistently across OS/devices, off-brand, and not crisp at large sizes. **Fix:** swap to a single inline-SVG / icon-font set tinted with the brand color (keep the same semantic meaning per card).
5. **Hero has no CTA and no overlay contract.** `.page-header` is a title over a photo with unknown contrast; if the header image is light, white title disappears. **Fix:** mandatory dark gradient scrim + optional hero CTA button (e.g. "Apply to Volunteer" / "Start a Conversation") to capture decided visitors immediately.
6. **Partner success carousel hides content + has weak controls.** 2 slides, autoplay every 8s, tiny "‹ › " glyph buttons, no pause-on-hover, no keyboard support, and the second slide's proof is invisible until rotation. For an NGO proving credibility, hiding half your proof is counterproductive. **Fix:** either show both success stories as a 2-up static grid (matching the volunteer testimonials pattern for cross-page consistency) OR keep a carousel but with visible peek, pause-on-hover, real arrow buttons, and accessible dots.
7. **Stat numbers lack visual weight and any "counts up" treatment.** `500+ / 10,000+ / 25+ / 100%` and `25+ / ₹2.5Cr+ / 50,000+ / 15+` are the strongest trust signals on the page but render as plain stacked text. **Fix:** large brand-weight numerals, clear label hierarchy, optional count-up on scroll, equal-width 4-up row.
8. **Inconsistent / unverifiable numbers between sections.** Partner overview says "15+ Years Experience" while the footer and benefit cards say "since 2000" / "25+ years". **Fix:** reconcile to a single true figure (the footer's "since 2000" implies ~25 years) before building — flag to client.
9. **Featured card variant is declared but visually unclear.** `.featured` on the first card has no obvious payoff in markup. **Fix:** give the featured card a distinct accent (brand top-border / subtle elevation / "Most popular" or "High impact" ribbon) so the eye has an entry point into the grid.
10. **Volunteer "What We Provide" is an 8-item emoji list with no grouping** — dense and monotonous. **Fix:** 2-column icon checklist with consistent SVG ticks; group "Look For" vs "Provide" as a clear give/get pairing.
11. **Buttons point to `contact.html?subject=…` and PDFs that may not exist** (`volunteer-handbook.pdf`, `partnership-brochure.pdf`). **Fix:** verify the PDFs exist before launch; if not, hide the secondary button or replace with an inline form. Keep the `?subject=` query so the contact page can pre-fill.
12. **No actual application/lead form on either page** — every CTA bounces to `contact.html`. For a conversion landing page this adds a friction step. **Fix (optional, see §5):** embed a short inline form (name, email, area of interest, message) so a decided visitor converts without a page change.
13. **All-caps risk from the Oswald font + `.section-title`.** Oswald + uppercase styling can make body-adjacent text shouty and reduce readability of long paragraphs. **Fix:** keep Oswald for headings/numbers only; use the Style Gate body font for paragraphs and meta text.

---

## 4. Content — source of truth (PRESERVE this)

> Preserve numbers, names, emails, phone, and link targets EXACTLY. Copy may be lightly tightened but facts/figures must not change.

### 4A. VOLUNTEER (`volunteer.html`)

- **Page title (browser):** "Volunteer with Us | Coodu Trust - Make a Difference"
- **Meta description:** "Join Coodu Trust as a volunteer. Contribute your time, skills, and passion to create sustainable impact in rural communities across Tamil Nadu."
- **Hero H1:** "Volunteer with Us" — **Subtitle:** "Be the change you want to see - contribute your time, skills, and passion"
- **Overview H2:** "Your Time Can Transform Lives"
- **Overview paragraph:** "Volunteering with Coodu Trust offers you the opportunity to make a real, measurable difference in rural communities. Whether you have a few hours a week or can commit to longer-term projects, there's a meaningful way for you to contribute to sustainable development and community empowerment."
- **Stats (4):** `500+` Active Volunteers · `10,000+` Volunteer Hours · `25+` Volunteer Programs · `100%` Impact Guaranteed
- **Opportunities H2:** "Volunteer Opportunities" — **Intro:** "Find the perfect way to contribute based on your skills, interests, and availability"
- **Opportunity cards (6):**
  1. 🌾 **Field Work & Community Engagement** (FEATURED) — "Work directly with rural communities on watershed development, organic farming, and women's empowerment programs. Perfect for hands-on experience in development work." · Time Commitment: 2-4 weeks minimum · Location: Rural Tamil Nadu villages · Skills Needed: Communication, adaptability, Hindi/Tamil helpful · Best For: Students, gap year, career changers · Tags: ✓ Accommodation provided · ✓ Cultural immersion · ✓ Certificate provided
  2. 💼 **Professional Skills Volunteering** — "Share your professional expertise in areas like accounting, marketing, IT, legal, or project management to strengthen our organizational capacity." · Time: 5-10 hours per week · Location: Remote/Online + occasional visits · Skills: Professional expertise in specific areas · Best For: Working professionals, retirees · Tags: ✓ Flexible timing · ✓ Remote work · ✓ Skill development
  3. 📚 **Education & Training** — "Conduct workshops, training sessions, and educational programs for community members, farmers, and women's groups on various development topics." · Time: Weekend workshops or week-long programs · Location: Community centers, villages, our office · Skills: Teaching, presentation, subject expertise · Best For: Teachers, trainers, subject experts · Tags: ✓ Impactful teaching · ✓ Material support · ✓ Recognition
  4. 📱 **Digital & Communications** — "Help with social media, content creation, photography, videography, website management, and digital marketing to amplify our impact." · Time: 3-5 hours per week · Location: Fully remote · Skills: Digital marketing, design, writing, photography · Best For: Students, freelancers, digital professionals · Tags: ✓ Portfolio building · ✓ Creative freedom · ✓ Flexible schedule
  5. 🎉 **Event Management & Fundraising** — "Organize fundraising events, awareness campaigns, and community outreach programs to support our mission and expand our reach." · Time: Project-based, 10-20 hours total · Location: Urban centers, colleges, offices · Skills: Event planning, networking, communication · Best For: Event planners, sales professionals, students · Tags: ✓ Leadership experience · ✓ Networking opportunities · ✓ Event planning skills
  6. 📊 **Research & Documentation** — "Conduct impact assessments, document best practices, prepare case studies, and support monitoring & evaluation activities." · Time: 1-3 months per project · Location: Mixed - field visits + remote work · Skills: Research, data analysis, writing · Best For: Graduate students, researchers, analysts · Tags: ✓ Research experience · ✓ Publication opportunities · ✓ Data skills
- **Stories H2:** "Volunteer Stories" — **Testimonials (3):**
  1. img `assets/images/team/member-1.JPG` — Title: "Life-Changing Experience in Rural Development" — Quote: "My 3 months with Coodu Trust working on women's SHG programs completely changed my perspective. I learned more about real development challenges and solutions than any textbook could teach. The communities welcomed me like family." — **Priya Sharma**, MBA Student, Field Volunteer (3 months) — Impact: Helped form 15 new SHGs
  2. img `assets/images/team/SARAVANAN.png` — Title: "Using Tech Skills for Social Good" — Quote: "As a software engineer, I helped develop their project tracking system remotely. It's incredibly fulfilling to see how technology can directly improve program efficiency and impact measurement. Highly recommend!" — **Rajesh Kumar**, Software Engineer, Tech Volunteer (6 months) — Impact: Built tracking system used across 20+ projects
  3. img `assets/images/team/VENKATESAN.png` — Title: "Medical Camps That Make a Difference" — Quote: "Volunteering in their health camps during weekends has been incredibly rewarding. We've screened over 500 people and the gratitude from communities is overwhelming. It's given new meaning to my medical practice." — **Dr. Meera Reddy**, Doctor, Health Volunteer (1 year) — Impact: Conducted 12 health camps, 500+ screenings
- **Process H2:** "How to Get Started" — **Steps (4):** 1) **Express Interest** — "Fill out our volunteer application form with your interests, skills, and availability. Tell us what excites you most about development work." · 2) **Interview & Matching** — "We'll have a conversation to understand your goals and match you with the right opportunity. This ensures a meaningful experience for both you and the communities." · 3) **Orientation & Training** — "Complete our volunteer orientation covering our approach, cultural sensitivity, safety protocols, and specific training for your chosen area." · 4) **Start Volunteering** — "Begin your volunteer journey with full support from our team. Regular check-ins ensure you're having a positive and impactful experience."
- **Requirements H2:** "Volunteer Requirements & Support"
  - **What We Look For (6):** ✓ Genuine commitment to social development · ✓ Respect for local cultures and communities · ✓ Flexibility and adaptability · ✓ Basic English communication (Hindi/Tamil helpful) · ✓ Minimum age 18 (parental consent for under 21) · ✓ Physical fitness for field work (if applicable)
  - **What We Provide (8):** 🏠 Accommodation for field volunteers · 🍽️ Meals during field assignments · 🚗 Local transportation for work · 📋 Comprehensive orientation & training · 🤝 Dedicated mentor/supervisor · 📜 Certificate of volunteer service · 📸 Photo documentation of your work · 💬 24/7 support and emergency contact
- **CTA H2:** "Ready to Make a Difference?" — **Text:** "Join our community of passionate volunteers who are creating real change in rural Tamil Nadu. Your time and skills can transform lives and communities." — **Buttons:** `Apply to Volunteer` → `contact.html?subject=volunteer` ; `Download Volunteer Guide` → `assets/documents/volunteer-handbook.pdf` (new tab) — **Contact:** Volunteer Coordinator: `volunteers@coodutrust.org` · Phone: `+91-451-2461362`

### 4B. PARTNER (`partner.html`)

- **Page title (browser):** "Partner with Us | Coodu Trust - Creating Impact Together"
- **Meta description:** "Join Coodu Trust as a partner. Explore corporate partnerships, institutional collaborations, and strategic alliances to create sustainable impact together."
- **Hero H1:** "Partner with Us" — **Subtitle:** "Creating sustainable impact through strategic partnerships and collaboration"
- **Overview H2:** "Together We Can Achieve More"
- **Overview paragraph:** "For over two decades, Coodu Trust has been building meaningful partnerships that amplify our impact across rural Tamil Nadu. We believe that sustainable development requires collaborative efforts from corporate leaders, institutions, foundations, and community organizations working together toward shared goals."
- **Stats (4):** `25+` Active Partners · `₹2.5Cr+` Partnership Value · `50,000+` Lives Impacted · `15+` Years Experience *(see §3.8 — reconcile vs "since 2000")*
- **Partnership Opportunities H2:** "Partnership Opportunities" — **Intro:** "Multiple ways to collaborate based on your organization's goals, resources, and commitment level"
- **Partnership cards (4):**
  1. 🏢 **Corporate CSR Partnerships** (FEATURED) — "Align your corporate social responsibility goals with our proven development programs. Create measurable impact while fulfilling regulatory CSR requirements." · Features: ✓ Compliance with CSR regulations · ✓ Detailed impact reporting · ✓ Employee engagement opportunities · ✓ Brand visibility and recognition · Investment: **₹5L - ₹50L+ annually**
  2. 🎓 **Institutional Partnerships** — "Collaborate with educational institutions, research organizations, and academic bodies for knowledge exchange and capacity building." · Features: ✓ Research and development projects · ✓ Student internship programs · ✓ Faculty exchange initiatives · ✓ Joint publication opportunities · Investment: **Knowledge & Resource Sharing**
  3. 🤝 **Foundation & Trust Partnerships** — "Partner with foundations and charitable trusts to scale successful programs and reach more communities in need." · Features: ✓ Program scaling opportunities · ✓ Joint grant applications · ✓ Shared expertise and resources · ✓ Collaborative impact measurement · Investment: **₹10L - ₹1Cr+ per project**
  4. 💻 **Technology Partnerships** — "Leverage technology solutions to enhance program delivery, impact measurement, and operational efficiency." · Features: ✓ Digital platform development · ✓ Data analytics and reporting · ✓ Mobile app solutions · ✓ Training and capacity building · Investment: **Technology & Expertise**
- **Success H2:** "Partnership Success Stories" — **Success cards (2):**
  1. logo `assets/images/partners/corporate-partner-1.jpg` — Title: "Transforming 500 Families Through Watershed Development" — Description: "Our three-year partnership with Coodu Trust has restored 2,000 acres of degraded land and directly benefited 500 farming families. The transparent reporting and measurable outcomes exceeded our CSR expectations." — **Leading Manufacturing Company**, 3-Year CSR Partnership — Metrics: `2,000` Acres Restored · `500` Families Benefited · `₹1.2Cr` Total Investment
  2. logo `assets/images/partners/foundation-partner-1.jpg` — Title: "Empowering 1,000 Women Entrepreneurs" — Description: "The joint women empowerment program created 800 micro-enterprises and trained 1,000 women in financial literacy. The sustainable livelihood model is now being replicated across multiple states." — **National Development Foundation**, 2-Year Collaborative Program — Metrics: `800` Enterprises Created · `1,000` Women Trained · `₹80L` Total Investment
- **Process H2:** "How to Partner with Us" — **Steps (4):** 1) **Initial Discussion** — "Connect with our partnership team to discuss your organization's goals and explore collaboration opportunities." · 2) **Program Design** — "We'll work together to design a program that aligns with your objectives and our development priorities." · 3) **Implementation** — "Our experienced team executes the program with regular monitoring, reporting, and stakeholder engagement." · 4) **Impact Assessment** — "Comprehensive evaluation and reporting of outcomes, impact, and lessons learned for continuous improvement."
- **Benefits H2:** "Why Partner with Coodu Trust?" — **Benefit cards (6):** 📊 **Proven Track Record** — "25+ years of successful development programs with measurable impact across 100+ villages in Tamil Nadu." · 🎯 **Transparent Reporting** — "Detailed quarterly reports with financial transparency, impact metrics, and photographic documentation." · 🏆 **Award-Winning Programs** — "Recognition from government agencies and development organizations for innovation and effectiveness." · 🤝 **Collaborative Approach** — "We work as true partners, involving you in program design, monitoring, and strategic decision-making." · 🌍 **Sustainable Impact** — "Focus on long-term sustainability with community ownership and capacity building for lasting change." · 📈 **Scalable Solutions** — "Proven models that can be scaled and replicated across different regions and communities."
- **CTA H2:** "Ready to Create Impact Together?" — **Text:** "Join our network of partners who are making a real difference in rural communities. Let's discuss how we can align your goals with our proven development programs." — **Buttons:** `Start Partnership Discussion` → `contact.html?subject=partnership` ; `Download Partnership Brochure` → `assets/documents/partnership-brochure.pdf` (new tab) — **Contact:** Partnership Team: `partnerships@coodutrust.org` · Direct Line: `+91-451-2461362`

### 4C. SHARED FOOTER (both — see shared-chrome doc, do not restyle here)
"Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000." · Quick Links: About Us, Our Programs, Careers, Donate · Address: **H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.** · Email `director@coodutrust.org` · Phone `+91-451-2461362` · Social: Facebook / Twitter / Instagram · "© 2025 Coodu Trust. All Rights Reserved."

---

## 5. Enhancement direction (TO-BE) — opinionated

**Unify the template first.** Treat volunteer + partner as ONE component system with two content fills. Replace divergent class names with shared components (`.lead-hero`, `.overview-split`, `.stat-row`, `.info-card`, `.proof-grid`, `.process-step`, `.give-get`, `.cta-band`). This guarantees the two pages look like siblings and halves the build/maintenance cost.

**Hierarchy & flow (recommended order, same for both):**
1. **Hero band** — title + subtitle + ONE primary CTA button ("Apply to Volunteer" / "Start a Partnership Discussion") + dark scrim for guaranteed contrast. Capture decided visitors at the top.
2. **Overview split** — keep 50/50 text+image, but pull the **4 stats out into a full-width stat row** directly beneath the overview (or as a tinted band) so the numbers get hero treatment with brand-weight numerals and count-up on scroll.
3. **Opportunity / Partnership cards** — equal-height cards, icon swapped from emoji to brand SVG, the FEATURED card gets a clear accent (top-border + "High impact" / "Most popular" ribbon). Investment range (partner) shown as a clear price pill.
4. **Social proof — UNIFY THE TWO PAGES TO THE SAME PATTERN.** Recommendation: drop the partner JS carousel and show both success stories as a **2-up static card grid** that visually matches the 3-up volunteer testimonial grid. Both should use a quote-mark motif, photo/logo, name, role, and a metrics strip (volunteer = single "Impact:" line; partner = 3 metric tiles). If client insists on a carousel, add pause-on-hover, real arrow hit-areas, accessible dots, and a visible peek of the next card.
5. **Process steps** — one horizontal 4-step "connector" timeline on desktop (numbered nodes joined by a line), stacking vertically on mobile. Identical component on both pages.
6. **Requirements (volunteer) / Benefits (partner)** — volunteer keeps the give/get two-column checklist (consistent SVG ticks, grouped); partner keeps the 6-up icon-card value grid. These are the one place the two pages legitimately diverge in layout — keep that, but share the card and tick styling.
7. **CTA band** — bold full-width tinted band: heading + line + dual buttons + an inline contact strip (email + phone as clickable `mailto:` / `tel:`). **Add the missing `mailto:`/`tel:` links** (currently the CTA emails/phones are plain text).

**Add:**
- Hero CTA button (both).
- A short **inline lead form** option in/near the CTA band (Name, Email, Phone, Area of interest [select], Message) posting to the existing backend, with the `contact.html?subject=…` link kept as fallback — removes the extra page hop for decided users.
- `mailto:`/`tel:` on all contact lines.
- "Most popular / High impact" ribbon on featured cards.

**Remove / fix:**
- The inline `<body>` background photo + white overlay → replace with Style Gate surface tokens.
- All emoji icons → brand SVG icon set (preserve meaning).
- Inline `height:400px` image styling → CSS aspect-ratio box.
- Reconcile "15+ Years Experience" vs "since 2000 / 25+ years" before build (flag to client; likely should read "25+").
- Verify the two PDFs exist; if missing, hide the secondary download button rather than ship a dead link.

**Reorder:** none major — the existing top-to-bottom funnel (frame → menu → proof → process → reassurance → convert) is sound; just elevate the stats and add a top-of-page CTA.

**▶ YOUR ENHANCEMENT NOTES: ____**

---

## 6. Three-viewport layout spec (the core deliverable)

Container max-width, gutters, type scale, colors, radius, shadows = **Style Gate** (`design/REDESIGN-STYLE-GATE.md`). Below is layout/structure only.

### WEB (desktop, >=1025px)
- **Header/nav:** full horizontal nav with Programs mega-dropdown + Get Involved dropdown + standalone Donate button (shared chrome).
- **Hero (`.page-header`):** full-bleed background image, container-constrained text left-aligned (or centered), min-height ~360-440px, dark bottom-up gradient scrim. H1 large display, subtitle below, ONE primary CTA button under subtitle.
- **Overview split:** 2-column grid `~1.05fr / 0.95fr`, text left / image right, ~48-64px gap, vertical-centered. Image = fixed aspect box (3:2), `object-fit:cover`, radius + soft shadow per Style Gate.
- **Stat row:** full-width 4-column equal grid directly under overview (or as its own tinted band). Each stat: big numeral over small uppercase label, centered, thin divider or card. Count-up on scroll.
- **Opportunity/Partnership grid:** Volunteer = 3 columns × 2 rows (6 cards); Partner = 2 columns × 2 rows (4 cards). Equal-height cards, icon top, title, excerpt, meta-list, then tag chips / investment pill at the bottom. Featured card spans the same cell but carries an accent border + ribbon.
- **Social proof:** Volunteer = 3-column testimonial grid. Partner = 2-column success grid (recommended) — each success card shows logo/quote + a 3-tile metric strip in a row. (If carousel retained: single centered card ~720-820px wide with side arrows and dots beneath.)
- **Process:** horizontal 4-step row; numbered circular nodes connected by a horizontal line, label + paragraph beneath each node.
- **Requirements (volunteer):** 2-column give/get; each column a titled checklist card. **Benefits (partner):** 3-column × 2-row icon-card grid (6 cards).
- **CTA band:** full-width tinted band, centered content max ~760px: H2 + paragraph + two side-by-side buttons + a one-line contact strip (email · phone), all centered.
- **Spacing intent:** generous `section-padding` (~80-96px vertical); alternate white / tinted bands to separate sections; the photo wallpaper is gone.

### TABLET (768-1024px)
- **Header/nav:** condensed nav or hamburger per shared chrome breakpoint.
- **Hero:** same, slightly reduced min-height (~300-360px); H1 steps down one scale.
- **Overview split:** keep 2-column but tighten to ~1/1 with smaller gap; if cramped, allow image to drop below text (stacked) at the lower end of the range.
- **Stat row:** 4-up stays if it fits; otherwise **2×2 grid**.
- **Opportunity/Partnership grid:** **2 columns** for both pages (volunteer 6 → 3 rows of 2; partner 4 → 2 rows of 2). Featured card keeps accent.
- **Social proof:** Volunteer testimonials → 2 columns (3rd wraps) or 1-column stack of wide cards. Partner success → 1 column wide cards stacked (or 2-up). Carousel (if kept) full container width.
- **Process:** 4 steps in a **2×2 grid**, or a vertical connector list if horizontal feels tight.
- **Requirements/Benefits:** volunteer give/get stays 2-column; partner benefits → **2 columns** (3 rows).
- **CTA band:** centered, buttons may stay inline or wrap; contact strip wraps to 2 lines if needed.

### MOBILE (<=600px)
- **Header/nav:** hamburger drawer (shared chrome).
- **Hero:** min-height ~220-280px, centered text, H1 reduced, subtitle shorter line-length, primary CTA full-width button.
- **Overview split:** **single column** — text first, then image (full-width, aspect 16:10 / 3:2).
- **Stat row:** **2×2 grid** (or 1-column if numbers are long like `₹2.5Cr+`); keep numerals prominent.
- **Opportunity/Partnership grid:** **1 column**, cards full-width stacked; meta-list and tags wrap naturally; featured ribbon still visible.
- **Social proof:** **1 column** stacked cards; partner metric tiles go to a 3-across mini-row inside each card (or stack if too narrow). Carousel (if kept): one card + dots, arrows become large tap targets or swipe.
- **Process:** **vertical** numbered list with a left connector line; node + content stacked.
- **Requirements (volunteer):** give/get columns **stack** (Look For, then Provide). **Benefits (partner):** **1 column**, 6 cards stacked.
- **CTA band:** centered, buttons **full-width stacked** (primary above secondary); contact strip stacked, email + phone each tappable (`mailto:`/`tel:`).
- **Spacing intent:** reduce section padding (~48-56px), maintain comfortable tap targets (>=44px) and generous card padding.

---

## 7. Components used (reference the shared design system / Style Gate)

Global tokens (color, type scale, Oswald-for-headings, radius, shadow, button styles, card styles, section-padding rhythm, `.light-bg` band) are defined in **`design/REDESIGN-STYLE-GATE.md`** — DO NOT redefine here; reference them.

Shared components this page-type relies on:
- **Header / nav + dropdowns + Donate button** — shared chrome.
- **Footer** (4-col grid, social icons, copyright) — shared chrome.
- **Page hero band** (`.page-header`: image + scrim + title/subtitle [+ new CTA]) — shared component used across inner pages.
- **`.section-title` / `.section-intro-text`** heading pair.
- **Overview split** (text + image two-column) — same as other info pages.
- **Stat / highlight counter** (`.stat` = number + label) — shared with About/Home impact stats.
- **Info card** (icon + title + excerpt + meta-list + tag chips / pill) — unify `.opportunity-card` + `.partnership-card`.
- **Benefit / value card** (icon + title + paragraph) — partner benefits; shared with other icon-grid sections.
- **Testimonial / success card** (photo/logo + quote + author + metrics) — unify volunteer testimonials and partner success stories.
- **Process step / numbered timeline** — unify `.process-timeline` + `.process-steps`.
- **Checklist (give/get)** with consistent tick icon.
- **CTA band** (`.cta-content`: title + text + dual `.btn.btn-primary` / `.btn.btn-secondary` + contact strip) — shared across conversion pages.
- **Buttons** `.btn`, `.btn-primary`, `.btn-secondary` — Style Gate.
- **Brand SVG icon set** (replacing emoji) — Style Gate / shared asset.

---

## 8. Ready-to-paste Claude-design instruction

> **Design a conversion landing page for COODU Trust (a rural-development NGO in Dindigul, Tamil Nadu). Apply the COODU Trust Style Gate (colors, fonts, radius, shadows, buttons, cards) exactly — do not invent a new visual language. Produce THREE self-contained designs: WEB (>=1025px), TABLET (768-1024px), and MOBILE (<=600px).**
>
> **This is a shared template used for two pages — design it once with the VOLUNTEER content below; it must also work for the PARTNER variant (same layout, 4 cards instead of 6, a 2-up success grid instead of testimonials, a 6-up benefits grid instead of the give/get checklist).**
>
> **Section order (top to bottom):** (1) Header/nav with Donate button. (2) Hero band: image with dark gradient scrim, H1 "Volunteer with Us", subtitle "Be the change you want to see - contribute your time, skills, and passion", plus one primary button "Apply to Volunteer". (3) Overview: left text — H2 "Your Time Can Transform Lives" + the overview paragraph; right image. (4) Full-width 4-stat row: 500+ Active Volunteers · 10,000+ Volunteer Hours · 25+ Volunteer Programs · 100% Impact Guaranteed (big brand-weight numerals). (5) "Volunteer Opportunities" + intro line, then a 6-card grid (icon + title + excerpt + a 4-line meta list [Time/Location/Skills/Best For] + 3 checkmark tag chips); the first card is FEATURED with an accent border and a small "High impact" ribbon. Use clean brand-tinted SVG icons, NOT emoji. (6) "Volunteer Stories" — 3 testimonial cards (round photo, quote headline, quote, name + role, and an "Impact:" line). (7) "How to Get Started" — a horizontal 4-step numbered timeline (Express Interest → Interview & Matching → Orientation & Training → Start Volunteering). (8) "Volunteer Requirements & Support" — two columns: "What We Look For" (6 ticks) and "What We Provide" (8 ticks). (9) CTA band (tinted): H2 "Ready to Make a Difference?", supporting paragraph, two buttons "Apply to Volunteer" + "Download Volunteer Guide", and a contact strip "volunteers@coodutrust.org · +91-451-2461362". (10) Footer (4-column: about/since 2000, Quick Links, Contact at H-83 R.M. Colony Dindigul – 624 001, social icons, © 2025).**
>
> **Responsive rules:** Web — overview 2-col, stats 4-up, opportunity cards 3-up, testimonials 3-up, process horizontal, requirements 2-col. Tablet — opportunity cards 2-up, stats 2×2, process 2×2, requirements 2-col. Mobile — everything single-column stacked, overview image below text, stats 2×2, cards full-width, process vertical with a left connector line, CTA buttons full-width stacked, contact email/phone tappable.**
>
> **Preserve every headline, number, name, email, phone, and button label EXACTLY as written above. Equal-height cards, comfortable spacing, alternating white / lightly-tinted section bands, no busy photographic page background. Tap targets >=44px on mobile.**