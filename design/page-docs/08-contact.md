# Contact — Design Doc

## 1. Identity
- **File:** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/contact.html`
- **Real page it represents:** the public "Contact" page at `contact.html` (linked from the main nav `Contact` item, the footer, and the sitewide persistent flow). Active nav state is set here (`<a href="contact.html" class="nav-link active">`).
- **COVERAGE:** This doc governs **1 real page** (the standalone Contact page). It is NOT a template — it does not stamp out other pages. (Note: the contact `<form>` here POSTs to the Node/Express `/server/` backend in the live build; the static HTML currently has `action="#"`.)
- **One-line role/job:** Make COODU Trust easy and trustworthy to reach — a working message form plus all three office addresses, phone/email, and a map — so donors, CSR partners, volunteers, and villagers can get in touch with zero friction.

---

## 2. Current structure (AS-IS) — section by section

Document order, top to bottom. Shared chrome (header/footer) is covered in the shared-chrome doc and only referenced here.

### A. Page-level background (body)
- **What it is:** An inline-styled `<body>` with a full-page fixed Cloudinary background photo (`.../aboutus/background.jpg`), `background-size: cover`, `background-attachment: fixed`, plus a `position: fixed` white overlay div at `rgba(255,255,255,0.4)` and `z-index:-1`.
- **Purpose:** Give the whole page a soft photographic backdrop behind transparent sections.
- **Components:** none — pure decorative inline-style background + overlay.

### B. Header / Global Navigation — `header.header`
- **Purpose:** Sitewide sticky nav (shared component). Logo lockup (`coodu_frontlogo.png` + "Coodu Trust"), full multi-level dropdown menu (Home, About, Programs [6 category submenus, each with deeper submenus], Get Involved [Volunteer / Partner with Us / Donate], Documents, Media, Contact), a persistent "Donate" `btn btn-primary donate-button`, and a mobile hamburger.
- **Note:** Contact is the `active` nav item. **Defined in the shared-chrome doc — do not redefine.**

### C. Page Header / Hero banner — `section.page-header`
- **Purpose:** Page title banner.
- **Content:**
  - Background image: Cloudinary `.../headers/Contact_us_bg.jpg` (inline-styled `background-image`), `cover`/`center`, with a `::before` dark overlay at `rgba(0,0,0,0.2)`.
  - `h1.page-title` → **"Contact Us"**
  - `p.page-subtitle` → **"We'd love to hear from you. Reach out with any questions or inquiries."**
- **Components:** full-bleed hero banner (centered title + subtitle over photo). `padding: 100px 0`, `page-title` 3.5rem, light text.

### D. Contact Info & Form — `section.contact-section.section-padding`
- **Purpose:** The core of the page — let users send a message AND find office addresses.
- **Layout:** `div.contact-grid` = CSS grid `grid-template-columns: 1.2fr 1fr; gap: 50px` (form wider than offices). Section is forced `background: transparent !important` so the body photo shows through.
- **Left column — `div.contact-form-wrapper`:**
  - `h2.contact-heading` → **"Send Us a Message"** (inline-block heading with 2px green bottom-border underline).
  - `form.contact-form` (`action="#" method="POST"`) with 5 `form-group`s, each a `<label>` + input:
    1. **Full Name** — `input#name type=text` (required)
    2. **Email Address** — `input#email type=email` (required)
    3. **Phone Number (Optional)** — `input#phone type=tel`, placeholder "Enter your phone number"
    4. **Subject** — `input#subject type=text` (required)
    5. **Your Message** — `textarea#message rows=6` (required)
  - Submit: `button type=submit class="btn btn-primary"` → **"Send Message"**
- **Right column — `div.contact-details-wrapper`:**
  - `h2.contact-heading` → **"Our Offices"**
  - Three `div.office-card` (light-bg cards, green `h3` titles):
    - **Head Office** — address + Phone + Email
    - **Branch Office (Karur)** — address + Phone
    - **Branch Office (Chennai)** — address + Phone
- **Components:** 2-column responsive grid, contact form (labelled inputs), stacked address/office cards with `<address>` + `tel:`/`mailto:` links.

### E. Map — `section.map-section`
- **Purpose:** Show the Head Office location.
- **Content:** A single full-width Google Maps `<iframe>` (`width="100%" height="450"`, `loading="lazy"`) pinned to **R.M. Colony, Dindigul, Tamil Nadu 624001** (the Head Office). Forced `background: transparent !important`; CSS `padding:0; line-height:0`.
- **Components:** embedded map iframe (full-bleed, no container padding).

### F. Footer — `footer#contact-footer.footer`
- **Purpose:** Sitewide footer (shared component): white logo + about blurb ("…working towards sustainable development in Tamil Nadu, India since 2000."), Quick Links (About Us / Our Programs / Careers / Donate), a "Contact Us" address block (duplicates Head Office), Follow Us social icons (Facebook/Twitter/Instagram, all `href="#"`), and a copyright bar "© 2025 Coodu Trust. All Rights Reserved." **Defined in the shared-chrome doc — do not redefine.**

---

## 3. Current weaknesses (be specific & honest)

1. **Inline-style soup on `<body>` + overlay hack.** The page background photo, overlay div, and several `background: transparent !important` declarations are inline and fight the cascade. → Move the page background (or remove it) into the design system; drop `!important` and overlay divs. Recommend a **clean surface** (white / `--surface`) instead of a busy photo behind a form, which hurts readability and looks off-brand.

2. **Photo-behind-form kills legibility.** A fixed cover photo at 40% white overlay sits behind form inputs and address cards. On lower-contrast areas of the photo, labels/inputs are hard to read; on mobile it's worse. → Put form + offices on solid surfaces (white cards on a soft `--surface-alt` band).

3. **Global ALL-CAPS body.** The sitewide `text-transform: uppercase` on `<body>` forces caps; this page patches it back with `text-transform: none` on inputs, office text, and subtitle. That's a smell — labels and headings still inherit caps oddly. → Kill the global uppercase (per Style Gate §2.1) and apply case per component (sentence case for form labels and body).

4. **Form has no feedback / no real action.** `action="#"`, no success/error message, no `aria-live` region, no client validation styling, no `autocomplete` attributes. → Wire to the `/server/` contact endpoint, add inline validation states, a visible success/error banner (`aria-live="polite"`), `autocomplete` on name/email/phone, and a disabled/loading state on submit.

5. **Offices are flat text blocks.** Three near-identical address cards with no icons, no "Get directions" link, no visual anchor (which office is HQ). → Add a small icon per field (pin/phone/mail), label the Head Office as primary, and give each office a "Directions" link to Google Maps.

6. **Only one office is mapped.** The single iframe shows only Dindigul HQ; Karur and Chennai branches are listed but not locatable. → Either keep one map (HQ) and add per-card "Directions" links, or add a small map per office. Minimum: directions links for all three.

7. **No supporting trust/expectation content.** No office hours, no "we reply within X", no WhatsApp/quick-contact, no department routing. → Add a short "What to expect" / hours strip and optional quick-contact chips.

8. **Map is full-bleed with `line-height:0` and no container.** Visually it slams edge-to-edge against the footer with no breathing room or rounding. → Wrap in a container with radius + spacing, give it a heading ("Find us in Dindigul"), and add a caption with the HQ address.

9. **No section padding rhythm consistency.** The contact section uses `section-padding` but map uses `padding:0`; transitions feel abrupt. → Standardize vertical rhythm per Style Gate §1.5.

---

## 4. Content — source of truth (PRESERVE this)

> Everything below is the REAL copy/data. Do not paraphrase numbers, names, or addresses. Phone/email link targets must be preserved exactly.

**Page meta**
- `<title>`: **"Contact Coodu Trust | Get In Touch"**
- Meta description: **"Contact Coodu Trust for inquiries, partnerships, or support. Find our office addresses, send us a message, or locate us on the map."**

**Hero**
- H1: **"Contact Us"**
- Subtitle: **"We'd love to hear from you. Reach out with any questions or inquiries."**

**Form ("Send Us a Message")**
- Heading: **"Send Us a Message"**
- Fields (label → input type, required?):
  - **"Full Name"** — text, required
  - **"Email Address"** — email, required
  - **"Phone Number (Optional)"** — tel, placeholder **"Enter your phone number"**
  - **"Subject"** — text, required
  - **"Your Message"** — textarea (6 rows), required
- Submit button text: **"Send Message"**

**Offices ("Our Offices")**
- Heading: **"Our Offices"**
- **Head Office**
  - Address: **H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.**
  - Phone: **+91-451-2461362** → `tel:+914512461362`
  - Email: **director@coodutrust.org** → `mailto:director@coodutrust.org`
- **Branch Office (Karur)**
  - Address: **14/ 75, Trichy Main Road, Mylampatty, Tharagampatti Post, Karur District - 621 301.**
  - Phone: **+91-4323-251663** → `tel:+914323251663`
- **Branch Office (Chennai)**
  - Address: **56, 5th Cross Street, Kakkan Nagar, Adambakkam, Chennai – 600 088.**
  - Phone: **+91-9047043593** → `tel:+919047043593`

**Map**
- Google Maps embed pinned to **R.M. Colony, Dindigul, Tamil Nadu 624001** (Head Office), height 450px, lazy-loaded.

**Footer (shared — preserve as in chrome doc)**
- About: **"Coodu Trust is a registered non-profit organization working towards sustainable development in Tamil Nadu, India since 2000."**
- Quick Links: **About Us, Our Programs, Careers, Donate**
- Footer contact (duplicate of HQ): address + **director@coodutrust.org** + **+91-451-2461362**
- Copyright: **"© 2025 Coodu Trust. All Rights Reserved."**

---

## 5. Enhancement direction (TO-BE) — opinionated

**Reframe the page as a calm, high-trust "reach us" hub on solid surfaces** — not a form floating over a busy photo.

1. **Drop the body background photo + overlay; use a clean surface.** White page, with the form/offices block sitting on a soft `--surface-alt` band. Optionally keep ONE photographic accent (a thin tinted strip in the hero), nothing behind reading content.

2. **Two-column "Form + Offices" remains, but rebalanced and carded.**
   - Left (wider): the message form inside a white card with subtle border/shadow, clear labels in sentence case, generous field spacing, and a full-width green **"Send Message"** button.
   - Right (narrower): a stacked list of **3 office cards**. Mark **Head Office** as primary (a small "Head Office" pill/badge in primary green). Each card gets icons (pin / phone / mail) and a **"Get directions →"** link (Google Maps query for that exact address). Karur & Chennai cards get directions links too even though only HQ has an embedded map.

3. **Add a "What to expect" micro-strip** above or beside the form: office hours (e.g. "Mon–Sat, 9:30am–5:30pm" — confirm with user), typical reply time ("We usually reply within 2 working days" — confirm), and a quick line routing donation/partnership/volunteer queries to the relevant page. *(These are NEW — flag for user confirmation; do not invent hours that aren't approved.)*

4. **Add quick-contact chips** under the offices: tap-to-call HQ, email HQ, and (if available) WhatsApp. These convert mobile villagers/volunteers who won't fill a 5-field form.

5. **Upgrade the form to a real, accessible, working form:** inline validation, `aria-live="polite"` success/error banner ("Thanks — your message has been sent." / "Something went wrong, please call us instead."), `autocomplete` attributes, loading state on submit, honeypot/spam guard. Wire to the existing `/server/` contact endpoint.

6. **Give the map a frame and a home.** Section heading **"Find us in Dindigul"**, the iframe inside a rounded container with proper section padding, and a caption restating the Head Office address + a "Open in Google Maps" link. Lazy-load (keep `loading="lazy"`).

7. **Reorder for flow:** Hero → Form + Offices (with what-to-expect + quick-contact) → Map (HQ) → Footer. Keep it short and scannable.

8. **Remove duplication awareness:** the footer already repeats HQ contact; keep the page's own offices block as the canonical, richer version.

▶ YOUR ENHANCEMENT NOTES: ____

---

## 6. Three-viewport layout spec (the core deliverable)

Global tokens (color, type, radius, shadow, button/card) come from the **Style Gate**. Below is layout/structure only.

### WEB (desktop, >=1025px)
- **Hero (`page-header`):** full-bleed banner, ~360–420px tall, centered H1 ("Contact Us") + subtitle, dark overlay over photo for contrast (or solid primary-dark band if photo dropped). Sits directly under the sticky header.
- **Form + Offices band:** centered container (max-width ~1140–1200px) on `--surface`/`--surface-alt`. CSS grid, **2 columns**: left **Form card ≈ 1.2fr**, right **Offices column ≈ 1fr**, `gap ~48–56px`, vertical section padding ~80–96px.
  - Left: white form card, padding ~32–40px, fields full-width, labels above inputs, "Your Message" textarea ~6 rows, full-width primary "Send Message" button. Optional small "What to expect / hours" line at top of card.
  - Right: heading "Our Offices" + 3 stacked office cards (gap ~24px). Head Office card carries a "Head Office" pill; each card: address (with pin icon), phone (phone icon, tel link), email where present (mail icon, mailto), and "Get directions →" link.
- **Map section:** heading "Find us in Dindigul", iframe in a rounded container (radius per Style Gate), height ~420–450px, container max-width matching the band or full-bleed-with-inset; caption under it (HQ address + "Open in Google Maps"). Section padding ~64–80px top/bottom.
- **Nav:** full horizontal dropdown menu, persistent Donate button visible (shared chrome).
- **Image ratios:** hero photo cover-cropped (~16:5 banner); map 450px fixed height.

### TABLET (768–1024px)
- **Hero:** same banner, ~300–340px tall, H1 ~3rem.
- **Form + Offices:** grid **collapses to 1 column** (matches existing `.contact-grid { grid-template-columns: 1fr }` at this breakpoint). Order: **Form card first**, then **Offices** below it. Form card and office cards span full container width (max-width ~720–820px, centered), `gap ~40px`. Office cards can go 1-up full-width, or 2-up if space allows (prefer 1-up for the richer card with directions).
- **Map:** full-width within container, rounded, height ~400px, caption below.
- **Nav:** hamburger menu may engage near the lower end of this range (per shared chrome breakpoints); Donate stays reachable.
- **Spacing intent:** section padding ~56–64px; comfortable single-column reading.

### MOBILE (<=600px)
- **Hero:** compact banner ~200–240px, H1 ~2.5rem, subtitle ~1rem, generous side padding (16–20px).
- **Form + Offices:** single column, full-width. **Order:** quick-contact chips (tap-to-call HQ / email / WhatsApp) near top for instant action → then Form card (inputs full-width, large 44px+ tap targets, full-width "Send Message" button) → then 3 office cards stacked (full-width, Head Office pill, directions link). What-to-expect/hours as a short line, not a heavy block.
- **Map:** full-width, height ~280–320px, rounded, caption below with "Open in Google Maps" (so users leave to the native maps app).
- **Nav:** hamburger drawer (shared chrome); sticky header ~80px.
- **Spacing intent:** section padding ~40–48px; vertical rhythm tight but breathable; no horizontal scroll.

---

## 7. Components used (reference the shared design system / Style Gate)

Global tokens (colors, fonts, radius, shadow, button/card styles, spacing scale) are defined in **`design/REDESIGN-STYLE-GATE.md`** — do NOT redefine them here; just compose these shared components:

- **Shared header / nav** (logo lockup, multi-level dropdown, persistent Donate `btn btn-primary`, hamburger) — from chrome doc.
- **Shared footer** (4-col grid, white logo, quick links, contact block, social icons, copyright) — from chrome doc.
- **Page hero banner** (`page-header` pattern: photo/overlay + centered H1 + subtitle), shared with About/Documents.
- **Primary button** (`btn btn-primary`) — for "Send Message" and Donate.
- **Form controls** — labelled `.field`/`.field__label`/`.field__input` text inputs, email, tel, textarea, plus validation/error + `aria-live` success states (per Style Gate §2.1/§2.2 form component).
- **Card** — base `.card` for the form wrapper and each office card (light surface, radius, border/shadow per Style Gate); a `.card--primary`/pill modifier for Head Office.
- **Pill / badge** — "Head Office" label.
- **Icon + label rows** — pin / phone / mail line items inside office cards.
- **Link with arrow** — "Get directions →" / "Open in Google Maps".
- **Map embed wrapper** — rounded container for the Google Maps iframe.
- **Section / container layout primitives** — `.section` padding + max-width container, responsive 2→1 column grid.

---

## 8. Ready-to-paste Claude-design instruction

> Using the filled COODU Trust **Style Gate** (colors, Oswald/body fonts, radius, shadows, button + card styles, spacing — apply them exactly; do not invent new global styles), design the **Contact page** for COODU Trust, an NGO in Dindigul, Tamil Nadu. Produce **THREE self-contained designs: WEB (≥1025px), TABLET (768–1024px), and MOBILE (≤600px)**.
>
> The page must feel calm, credible, and easy to act on — a real "reach us" hub on clean white/soft surfaces (NO busy photo behind the form). Keep this exact content and structure:
>
> 1. **Hero banner** — H1 "Contact Us", subtitle "We'd love to hear from you. Reach out with any questions or inquiries."
> 2. **Form + Offices block** (2 columns on web with the form wider; single column stacked on tablet/mobile, form first):
>    - **Form card "Send Us a Message"** with fields: Full Name (required), Email Address (required), Phone Number (Optional, placeholder "Enter your phone number"), Subject (required), Your Message (textarea, required), and a full-width primary button "Send Message". Show an accessible success/error state.
>    - **"Our Offices"** — three cards: **Head Office** (badge it as primary) "H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.", phone +91-451-2461362, email director@coodutrust.org; **Branch Office (Karur)** "14/ 75, Trichy Main Road, Mylampatty, Tharagampatti Post, Karur District - 621 301.", phone +91-4323-251663; **Branch Office (Chennai)** "56, 5th Cross Street, Kakkan Nagar, Adambakkam, Chennai – 600 088.", phone +91-9047043593. Each card: pin/phone/mail icons + a "Get directions →" link.
>    - On mobile, add quick-contact chips (Call HQ / Email / WhatsApp) above the form.
> 3. **Map section** — heading "Find us in Dindigul", a Google Maps embed (~450px web) of the Dindigul Head Office in a rounded frame, with a caption repeating the HQ address + an "Open in Google Maps" link.
> 4. Reuse the shared sticky header (with active "Contact") and the shared footer.
>
> Preserve every address, phone number, email, and button label exactly as written. Sentence case for body and form labels (no all-caps body text). Mobile: 44px+ tap targets, no horizontal scroll. Deliver web, tablet, and mobile as three clean frames.
