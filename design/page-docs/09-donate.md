# Donate — Design Doc

## 1. Identity
- **File(s):** `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/donate.html` (behaviour/logic: `/Users/jagathguru/Documents/PROJECTS/COODU_TRUST/assets/js/donate.js`; styles: `assets/css/style.css` + `assets/css/responsive.css`; payment: Razorpay Checkout + Node/Express backend at `/api/donations/*`).
- **Real page represented:** the single public **Donate** page (`donate.html`), reachable from the header CTA button, the "Get Involved → Donate" dropdown, and the footer Quick Links.
- **COVERAGE:** This doc governs **1 real page** (the donate page). It is **not** a template — it is unique. It is the highest-stakes conversion page on the site (money changes hands here).
- **One-line role/job:** Convert intent into a completed gift — let a visitor pick a cause, amount, and giving frequency, hand over donor + 80G details, and pay securely via Razorpay; with fallback offline channels (bank transfer, cheque/DD) for those who don't want to pay online.

---

## 2. Current structure (AS-IS) — section by section

Top-to-bottom, every section of `donate.html`:

### 2.0 `<body>` background (page-level)
- Inline-styled `<body>` paints a full-page fixed Cloudinary background photo (`aboutus/background.jpg`, `cover` / `center` / `fixed`) with a separate `position:fixed` white overlay `div` at `rgba(255,255,255,0.4)`, `z-index:-1`. So the whole page sits on a washed-out photo rather than a clean surface.

### 2.1 Header / Nav (shared chrome)
- `header.header > .container > nav.navbar`: logo (`coodu_frontlogo.png` + "Coodu Trust" wordmark), full nav menu with multi-level Programs mega-dropdown and a "Get Involved" dropdown (Volunteer / Partner with Us / Donate), a persistent **Donate** CTA button (`btn btn-primary donate-button active` — note `active` is set here because this IS the donate page), and a hamburger for mobile. **Defined in the shared-chrome doc — referenced here, not redesigned.**

### 2.2 Page header / hero band — `section.page-header`
- **Purpose:** Page title banner.
- **Content:** Background image (`headers/Donate_bg.jpg`, inline `cover`/`center`), `h1.page-title` = "Support Our Mission", `p.page-subtitle` = "Your contribution can create lasting change in rural communities."
- **Components:** Simple text-over-image hero band (no CTA, no stats, no overlay scrim defined inline — relies on CSS).

### 2.3 Donation section — `section.donation-section.section-padding`
Wrapped in `.container > .donation-layout`. This is a **two-column layout**: main donation area (left/primary) + sidebar (right/secondary).

#### 2.3.a Main donation area — `.donation-main`
- **Heading:** `h2.donation-title` = "Choose Your Method of Giving".
- **Tab navigation — `.donation-tabs`:** three `button.tab-link` toggles: **"Donate Online"** (`data-tab="online"`, `active` by default), **"Bank Transfer"** (`data-tab="bank"`), **"By Cheque"** (`data-tab="cheque"`). JS-driven tab switcher.
- **Tab content — `.donation-content`** holds three panels:

  **Panel 1 — Online (`#online.tab-content.active`):** the conversion engine.
  - `h3` = "Online (Credit/Debit Card, UPI, Net Banking)"; intro `p` = "Select an amount or enter your own. Click 'Donate Now' to proceed to our secure payment gateway."
  - **`form#donation-form`** containing:
    - **Cause select** (`#cause`, required): General Fund / Education / Health & Sanitation / Environmental Action / Women Empowerment.
    - **Donation Type select** (`#donation-type`, required): One-time Donation / Monthly (Recurring) / Yearly (Recurring).
    - **Amount buttons — `.donation-amounts`:** four `button.amount-btn` presets: ₹500, **₹1000 (`active` default)**, ₹2500, ₹5000.
    - **Custom amount — `.custom-amount`:** label "Or Enter a Custom Amount (INR)" + `input#custom-amount` (number, `min=1`, placeholder "e.g., 3000", required; JS defaults its value to 1000).
    - **Donor info block — `.donor-info`:** `h4` "Donor Information"; two `.form-row` rows → Full Name * + Email Address * (row 1), Phone Number * + PAN Number (for 80G receipt, auto-uppercased) (row 2); then full-width Address `textarea` (placeholder "Complete address for receipt") and Special Message (Optional) `textarea` (placeholder "Any special message or dedication").
    - **Checkboxes — `.form-checkboxes`:** "Make this donation anonymous" (unchecked) and "I want to receive an 80G tax receipt" (checked by default), each styled with a custom `.checkmark` span.
    - **Submit — `button#donate-btn.btn.btn-primary.btn-donate-now`:** label span "Donate Now" + hidden loader span "Processing…".
  - On submit, `donate.js` builds the order, calls `POST /api/donations/create-order`, opens Razorpay Checkout (theme green `#28a745`, name "Coodu Trust"), then on success calls `POST /api/donations/verify-payment` and **replaces the entire `#online` panel** with a success block: "🎉 Thank You for Your Generous Donation!" + Receipt Number / Amount / Donor + "A confirmation email has been sent… receipt processed within 24 hours." + a "Make Another Donation" button. Inline `.donation-message` toasts handle errors / "Payment cancelled".

  **Panel 2 — Bank Transfer (`#bank.tab-content`):** `h3` "Direct Bank Transfer (NEFT / IMPS / RTGS)" + intro `p` + `ul.bank-details` (Account Name, Account Number, Bank Name, Branch, IFSC Code, Account Type).

  **Panel 3 — Cheque/DD (`#cheque.tab-content`):** `h3` "Donate by Cheque / Demand Draft" + instruction `p` + `address` block with the head-office postal address.

#### 2.3.b Sidebar — `aside.donation-sidebar`
- Two stacked `.sidebar-card` blocks:
  - **"Why Your Donation Matters"** — trust/impact paragraph.
  - **"Tax Exemption"** — 80G reassurance paragraph.

### 2.4 Footer (shared chrome)
- `footer#contact-footer.footer`: 4-column grid (white logo + about blurb; Quick Links; Contact Us address/email/phone; Follow Us social icons) + `.footer-bottom` copyright "© 2025 Coodu Trust. All Rights Reserved." **Defined in the shared-chrome doc — referenced here, not redesigned.** (Note: copyright year is stale — 2025.)

---

## 3. Current weaknesses (be specific & honest)

1. **Washed-out full-page photo background under a payment form.** The inline `body` background image + `rgba(255,255,255,0.4)` fixed overlay creates a low-contrast, muddy field behind a form that demands focus and trust. **Fix:** put the form on a clean white/`surface-alt` surface; reserve photography for the hero only.

2. **Inline-style soup.** `body`, the overlay `div`, the page-header `background-image`, and the PAN field's `text-transform` are all inline. This is exactly the legacy mess the redesign exists to kill. **Fix:** zero inline styles; everything via the design system / Style Gate tokens.

3. **All-caps body text (global `text-transform: uppercase`).** Bank account numbers, IFSC codes, the postal address, donor labels, and helper copy rendered in all-caps are hard to read and error-prone for fields users must copy. **Fix:** sentence case for body/values per Style Gate §1.4; caps reserved for labels/eyebrows only.

4. **The most important action is buried.** The whole point — pick amount, pay — sits below a cause select and a type select, and the amount presets are small; the "Donate Now" button is far down a long single-column form. **Fix:** lead with amount selection; make presets large tap targets; keep a sticky/visible primary CTA showing the chosen amount.

5. **No trust scaffolding at the point of payment.** No security/"secure payment" signal, no logos (Razorpay/UPI/cards), no 80G badge near the button, no "where your money goes" reassurance adjacent to the form — only soft sidebar cards far to the side. **Fix:** add a compact trust strip (secure-lock + payment-method marks + 80G) right beside/under the CTA.

6. **Weak hierarchy between the three giving methods.** Three tabs given equal visual weight, but ~95% of donors want "Donate Online." Bank/Cheque deserve to exist but shouldn't compete. **Fix:** make Online the dominant default panel; demote Bank/Cheque to clearly secondary tabs (or an "Other ways to give" accordion).

7. **Long ungrouped form with no progress sense.** Amount, type, cause, six donor fields, two textareas, two checkboxes all in one undivided scroll — feels heavy, raises abandonment. **Fix:** group into clear steps/cards ("1 Your gift", "2 Your details") with visual separation and only the essentials marked required.

8. **Recurring donations are offered but technically unsupported.** "Monthly/Yearly (Recurring)" options exist in the select, but `donate.js` creates a one-time Razorpay order regardless. This is a broken promise. **Fix:** either implement subscriptions or relabel honestly (e.g. note "recurring coming soon") — flag for build, but the design should still accommodate a frequency toggle.

9. **Placeholder / unverifiable financial details.** Account Number "123456789012" reads as dummy data; the success flow logo path `assets/images/logos/123.jpeg` is a junk filename. **Fix:** real, verified bank details before launch; proper Razorpay merchant logo asset.

10. **Sidebar trust cards are visually inert and easy to miss.** Two plain text cards with no icon, number, or photo — the credibility content (20+ years, 80G, real impact) doesn't land. **Fix:** turn them into icon-led trust cards / an impact mini-stat strip.

11. **Mobile form ergonomics unknown / likely cramped.** Two-up `.form-row` fields and small amount buttons get tight on phones (the primary mobile audience per Style Gate is low-end Android). **Fix:** single-column on mobile, ≥44px inputs/buttons, `inputmode="numeric"` on amount/phone.

12. **Stale copyright (2025) and no SSL/refund/privacy microcopy.** A donation page legally benefits from a refund/cancellation + privacy note and a contact-for-help line. **Fix:** add small reassurance footer microcopy near the form.

---

## 4. Content — source of truth (PRESERVE this)

> Reproduce this copy **verbatim** in the redesign (numbers, names, field labels, account details unchanged unless explicitly corrected pre-launch).

**Page meta**
- `<title>`: "Donate to Coodu Trust | Support Our Mission"
- Meta description: "Support Coodu Trust by making a donation. Choose to donate online, via bank transfer, or by cheque. Your contribution is tax-exempt under Section 80G."

**Hero**
- H1: **"Support Our Mission"**
- Subtitle: **"Your contribution can create lasting change in rural communities."**

**Donation block heading**
- H2: **"Choose Your Method of Giving"**

**Tab labels:** "Donate Online" · "Bank Transfer" · "By Cheque"

**Online panel**
- H3: "Online (Credit/Debit Card, UPI, Net Banking)"
- Intro: "Select an amount or enter your own. Click 'Donate Now' to proceed to our secure payment gateway."
- **Cause options:** General Fund · Education · Health & Sanitation · Environmental Action · Women Empowerment
- **Donation Type options:** One-time Donation · Monthly (Recurring) · Yearly (Recurring)
- **Preset amounts:** ₹500 · **₹1000 (default selected)** · ₹2500 · ₹5000
- Custom amount label: "Or Enter a Custom Amount (INR)" — placeholder "e.g., 3000" — min 1
- Donor Information heading: "Donor Information"
- Fields: "Full Name *", "Email Address *", "Phone Number *", "PAN Number (for 80G receipt)", "Address" (placeholder "Complete address for receipt"), "Special Message (Optional)" (placeholder "Any special message or dedication")
- Checkbox 1: "Make this donation anonymous"
- Checkbox 2 (checked): "I want to receive an 80G tax receipt"
- Submit button: "Donate Now" / loading state "Processing..."

**Success state (from donate.js — preserve):**
- "🎉 Thank You for Your Generous Donation!"
- "Receipt Number:" · "Amount:" · "Donor:"
- "A confirmation email has been sent to your registered email address. Your donation receipt will be processed within 24 hours."
- Button: "Make Another Donation"
- System messages: "Payment cancelled", "Please enter a valid donation amount", "Failed to initiate payment. Please try again."

**Bank Transfer panel**
- H3: "Direct Bank Transfer (NEFT / IMPS / RTGS)"
- Intro: "You can donate directly to our bank account using the details below."
- **Account Name:** COODU TRUST
- **Account Number:** 123456789012  *(⚠ verify/replace with real number before launch)*
- **Bank Name:** State Bank of India
- **Branch:** Dindigul Main Branch
- **IFSC Code:** SBIN0000833
- **Account Type:** Savings

**Cheque / DD panel**
- H3: "Donate by Cheque / Demand Draft"
- Instruction: 'Please make your Cheque or Demand Draft payable to "COODU TRUST" and mail it to our head office:'
- Address: **COODU TRUST**, H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India.

**Sidebar cards**
- Card 1 — "Why Your Donation Matters": "Your support helps us continue our vital work in women's empowerment, environmental conservation, health, and sustainable livelihoods. Every contribution, no matter the size, makes a real difference."
- Card 2 — "Tax Exemption": "All donations made to Coodu Trust are eligible for tax exemption under Section 80G of the Income Tax Act, 1961. A receipt will be provided for your records."

**Shared chrome contacts (footer — for reference):** H-83, R.M. Colony, Dindigul – 624 001, Tamil Nadu, India · director@coodutrust.org · +91-451-2461362 · "registered non-profit… in Tamil Nadu, India since 2000." Razorpay checkout name "Coodu Trust", theme color `#28a745`.

---

## 5. Enhancement direction (TO-BE) — opinionated

**Reframe the page around the gift, not the "method."** Most donors want to give online; bank/cheque are escape hatches. Restructure to:

1. **Clean, focused hero.** Keep H1 + subtitle, but add a one-line trust eyebrow above it (e.g. "Tax-exempt under Section 80G · Working in rural Tamil Nadu since 2000"). Lose the washed-out full-page photo behind the form; photo lives in the hero only, with a proper dark→transparent scrim for legible white text.

2. **Lead with the gift card.** Make "Donate Online" the primary, always-open panel. Reorder inside it to the donor's mental model: **(a) Frequency** (One-time / Monthly / Yearly as a segmented pill toggle, not a dropdown) → **(b) Amount** (large preset chips ₹500/₹1000/₹2500/₹5000 + custom field, ₹1000 preselected) → **(c) Cause** (chips or select) → **(d) Your details** (collapsible "Donor information" with only Name/Email/Phone required up front; PAN/Address revealed when "I want an 80G receipt" is checked) → **(e) sticky Donate button that shows the live amount**, e.g. "Donate ₹1,000".

3. **Add impact anchoring to amounts.** Under each preset, a micro-line tying money to outcome (e.g. "₹1000 = a month of skills training for one woman"). This lifts average gift size and replaces the inert sidebar with something donors actually read. *(Copy TBD with the trust — placeholder, mark for confirmation.)*

4. **Make trust explicit at the point of payment.** A compact trust strip near the CTA: secure-lock + "Secured by Razorpay" + UPI/Visa/Mastercard/RuPay marks + "80G tax-exempt" badge. Add a one-line refund/privacy microcopy and "Need help? director@coodutrust.org / +91-451-2461362".

5. **Demote Bank & Cheque to "Other ways to give."** Keep all the real account/address content (it's source-of-truth), but as a secondary, lighter section/accordion below or beside the online flow — still tabbed is fine, just visually subordinate. Give each value (account number, IFSC) a one-tap **Copy** button so people don't mistype all-caps strings.

6. **Upgrade the two sidebar cards into trust assets.** Add an icon to each, and consider a small 3-up impact stat strip ("since 2000", "80G", "communities served") so the credibility content carries on mobile where the sidebar collapses under the form.

7. **Honesty on recurring.** Either wire up Razorpay subscriptions or clearly mark Monthly/Yearly as the chosen cadence while the backend supports it; the design should present a frequency toggle but the build must not silently downgrade recurring to one-time.

8. **Polish the success state.** Keep the exact success copy, but render it as a clean confirmation card (check icon, receipt details, "email sent", primary "Make Another Donation" + secondary "Back to Home"), not raw injected HTML over a photo.

9. **Housekeeping:** sentence-case all values, fix copyright year, replace placeholder account number + junk logo path, add `inputmode`/`autocomplete` hints, ensure ≥44px touch targets.

**▶ YOUR ENHANCEMENT NOTES: ____**

---

## 6. Three-viewport layout spec (the core deliverable)

Shared rules (all viewports): max content width per Style Gate (≈1140px), 8px spacing system, clean white/`surface-alt` surfaces (no full-page photo wash), hero photo with dark scrim for white text, primary CTA in the accent/CTA color from the Style Gate, all inputs ≥44px height, sentence-case values, labels in caps/eyebrow only.

### WEB (desktop, >=1025px)
- **Header:** shared sticky nav; Donate CTA shown in `active` state.
- **Hero (`page-header`):** full-bleed band, ~360–420px tall, background photo + left-to-right dark scrim. Content left-aligned within container: trust eyebrow → H1 "Support Our Mission" → subtitle. No form in hero.
- **Donation section — two-column grid inside container:** left **main column ~62–66%** (the gift form), right **sidebar ~34–38%** (sticky on scroll). Gutter ≈ 32–48px.
  - **Main column** = one elevated white card (radius/shadow per Style Gate) titled "Choose Your Method of Giving", with the three method tabs across the top (Online dominant/active). Inside the Online panel, vertical flow: Frequency segmented toggle (full width) → Amount preset row (4 chips in a single row, equal width, + custom field beside or below) → Cause (chips or select) → "Donor information" group with the two `.form-row` pairs kept **two-up** (Name|Email, Phone|PAN), Address + Message full width, then the two checkboxes → trust strip → full-width sticky-ish "Donate ₹1,000" button.
  - **Sidebar** = sticky stack: "Why Your Donation Matters" card, "Tax Exemption" card, optional impact-stat mini strip, and a secured-payment/80G badge.
- **Bank/Cheque** render inside the same card as the non-default tabs; values left-aligned with Copy buttons.

### TABLET (768–1024px)
- **Header:** condensed nav (hamburger may engage near the low end per shared chrome).
- **Hero:** ~300–340px tall, same scrim, slightly smaller type.
- **Donation section collapses to a single column.** Sidebar drops **below** the form (no longer sticky): order = gift form card first, then the two trust cards as a **2-up row** (side by side) to use the width, then impact strip.
- Inside the form, keep amount presets in **one row of 4** (or 2×2 if they get cramped); keep Name|Email and Phone|PAN **two-up** while width allows (≥720px), otherwise stack. Inputs full width of the single column. Tabs remain horizontal.

### MOBILE (<=600px)
- **Header:** logo + hamburger; Donate CTA accessible in the opened menu.
- **Hero:** ~220–260px tall, centered or left text, H1 ~32px, subtitle ~16px, scrim strong enough for contrast.
- **Everything single column, full width, 16px side gutters.**
  - Method tabs become a horizontally-scrollable pill row **or** "Donate online" stays primary with "Other ways to give" as an accordion beneath.
  - Form order optimized for thumb: Frequency pill toggle → **Amount presets 2×2 grid** (large, ≥44px) → custom amount → Cause → details (single column, one field per row — Name, Email, Phone each full width; PAN/Address/Message revealed via the 80G checkbox to shorten the initial scroll) → checkboxes → trust strip.
  - **Primary "Donate ₹1,000" button is sticky to the bottom** of the viewport (safe-area aware) so it's always reachable while scrolling the form; it mirrors the chosen amount live.
  - Trust cards and impact stats stack full-width below the form. Bank/cheque values stack with full-width Copy buttons. Success state fills the screen as a clean confirmation card.
- Use `inputmode="numeric"` for amount/phone, `autocomplete` for name/email, native font ≥16px to avoid iOS zoom.

---

## 7. Components used (reference the shared design system / Style Gate)

> Global tokens (color, type, radius, shadow, button/card/input styles) are defined in **`design/REDESIGN-STYLE-GATE.md`** — do **not** redefine them here. This page composes these shared components:

- **Shared chrome:** `Header / Nav` (with active Donate CTA) and `Footer` — per the shared-chrome doc.
- **Page hero band** (`page-header` pattern: photo + scrim + H1 + subtitle) — same component used across interior pages.
- **Primary button / CTA button** (accent color, ≥44px) — for "Donate Now".
- **Secondary / outline button** — for "Make Another Donation", "Back to Home", Copy buttons.
- **Segmented pill toggle** (new shared atom) — frequency selector.
- **Selection chips / preset buttons** (`.amount-btn` upgraded) — amount presets and cause chips, with active state.
- **Form system:** labeled text/email/tel/number inputs, textareas, native selects, two-up `form-row`, custom checkbox (`.checkmark`) — all per Style Gate input tokens.
- **Card** (surface, radius, hairline border, soft shadow) — gift-form card and the two sidebar trust cards.
- **Tabs** component — Online / Bank Transfer / By Cheque.
- **Stat / trust strip** (optional, shared with About/Home) — impact mini-stats + 80G/secure-payment badges.
- **Inline alert / toast** (`.donation-message` — success/error/info) and **confirmation/success card**.
- **Razorpay Checkout** (third-party modal; theme color from Style Gate primary green).

---

## 8. Ready-to-paste Claude-design instruction

> Paste this together with the filled **Style Gate** (`design/REDESIGN-STYLE-GATE.md`) into Claude design (browser).

"Design the **Donate page** for the COODU Trust NGO website (rural-development NGO, Dindigul, Tamil Nadu) in **three viewports: WEB (≥1025px), TABLET (768–1024px), and MOBILE (≤600px)**. Use the attached Style Gate for all colors, fonts, radius, shadows, and button/card/input styles — do not invent new tokens. Clean surfaces only: a photo hero with a dark scrim, then the form on a white/surface-alt card. No full-page background photo, no all-caps body text, no inline-style look.

Structure: (1) **Hero** — trust eyebrow ('Tax-exempt under Section 80G · Working in rural Tamil Nadu since 2000'), H1 'Support Our Mission', subtitle 'Your contribution can create lasting change in rural communities.' (2) **Gift section**, titled 'Choose Your Method of Giving', with three tabs — 'Donate Online' (primary, default open), 'Bank Transfer', 'By Cheque'. In the Online panel, order it for donors: a **frequency segmented toggle** (One-time / Monthly / Yearly), then **large amount chips** ₹500 / ₹1000 (preselected) / ₹2500 / ₹5000 + a custom amount field, then a **cause** selector (General Fund, Education, Health & Sanitation, Environmental Action, Women Empowerment), then a 'Donor information' group (Full Name*, Email*, Phone*, PAN for 80G, Address, optional message), two checkboxes ('Make this donation anonymous', 'I want to receive an 80G tax receipt' — checked), a **trust strip** (secure lock + 'Secured by Razorpay' + UPI/Visa/Mastercard/RuPay + '80G' badge), and a prominent primary CTA reading **'Donate ₹1,000'** that reflects the chosen amount. On desktop, put two trust cards in a **sticky right sidebar** ('Why Your Donation Matters', 'Tax Exemption' — use the exact copy provided); on tablet move them below the form as a 2-up row; on mobile stack everything single-column with the **Donate button sticky to the bottom** and amount chips in a 2×2 grid. Show the **success state** as a clean confirmation card: '🎉 Thank You for Your Generous Donation!', receipt number / amount / donor, the confirmation-email line, and a 'Make Another Donation' button. Include the **Bank Transfer** details (Account Name COODU TRUST, A/C 123456789012, State Bank of India, Dindigul Main Branch, IFSC SBIN0000833, Savings — each with a Copy button) and the **Cheque/DD** instructions + head-office address as the two secondary tabs. Keep all quoted copy verbatim. Show standard shared header (with active Donate CTA) and footer. Deliver WEB, TABLET, and MOBILE as three clean, self-contained frames."
