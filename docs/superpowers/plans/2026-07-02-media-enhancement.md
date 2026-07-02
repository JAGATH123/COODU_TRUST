# Media Page Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Media hero photo-first (exact image tone, Home/Donate content density) and add a narrative arc: proof strip → featured story → polished press → closing CTA band.

**Architecture:** Static site. All changes live in `media.html` + page-scoped `assets/css/coodu-media.css` + `assets/js/coodu-media.js`, on the existing token/component system. New sections reuse proven sibling patterns (Donate proof-strip overlap, About CTA band, shared `.counter` animation from `coodu.js`).

**Tech Stack:** Hand-written HTML/CSS/JS, design tokens in `coodu-tokens.css`, Lucide icons, Cloudinary images. No build step.

**Spec:** `docs/superpowers/specs/2026-07-02-media-enhancement-design.md`

## Global Constraints

- Branch `redesign/home-rebuild`. Breakpoints **600 / 900 / 1200 only**. Sentence case everywhere.
- Tokens only — no raw hex except the neutral black scrim rgba values (hue-free by design).
- No invented facts (press cards get NO dates/links; all numbers already exist on the page/site).
- Amber discipline: `--color-amber-light` labels on dark, `--color-amber-text` on white, `--color-amber` UI on dark.
- Motion only inside `@media (prefers-reduced-motion: no-preference)`.
- Cache-busters: `coodu-media.css?v=3 → ?v=4` and `coodu-media.js?v=3 → ?v=4` (done once, Task 1).
- Verification harness (already running): static server `http://localhost:8767`, headless Chrome CDP on `:9224`.
  Scripts: `SCRATCH/cdp-shot.mjs` (screenshots; forces `.reveal` visible) and `SCRATCH/cdp-act.mjs`
  (interactions + console/network audit), where
  `SCRATCH=/private/tmp/claude-501/-Users-jagathguru-Documents-PROJECTS-COODU-TRUST/e0befb9a-65a9-4535-9ecc-a20c6218d00e/scratchpad`.
  Renders go to `design/redesign-renders/` (gitignored screenshots dir — do NOT commit PNGs).

---

### Task 1: Hero — true image tone + rich content

**Files:**
- Modify: `media.html:17` (css `?v=4`), `media.html:224-237` (hero), `media.html:240` (gallery section id), `media.html:484` (press section id), `media.html:613` (js `?v=4`), head `<link rel="preload">` after the font links (~line 12)
- Modify: `assets/css/coodu-media.css:8-77` (hero block)

**Interfaces:**
- Produces: anchors `#gallery` and `#press` (Tasks 3 uses `#gallery` too); hero classes `.media-hero__meta`, `.media-hero__actions`.

- [ ] **Step 1: Update media.html head + hero markup**

In the `<head>`, bump the page stylesheet and add a hero-image preload directly after the `coodu-media.css` link:

```html
  <link rel="stylesheet" href="assets/css/coodu-media.css?v=4">
  <link rel="preload" as="image" href="https://res.cloudinary.com/dvxbg6to3/image/upload/f_auto,q_auto/v1754474804/coodu-trust/images/headers/media-bg.png">
```

At the bottom (~line 613): `assets/js/coodu-media.js?v=4`.

Replace the whole HERO section (lines 224–237) with:

```html
    <!-- ================= HERO ================= -->
    <section class="media-hero" aria-labelledby="media-hero-title">
      <div class="media-hero__layers" aria-hidden="true">
        <span class="media-hero__photo"></span>
        <span class="media-hero__scrim"></span>
      </div>
      <div class="container">
        <div class="media-hero__content reveal">
          <p class="eyebrow eyebrow--on-dark media-hero__eyebrow"><i data-lucide="camera" aria-hidden="true"></i> Media &mdash; gallery &amp; press</p>
          <h1 class="media-hero__title" id="media-hero-title">Stories from the field</h1>
          <p class="media-hero__sub">From golden paddy fields to national headlines &mdash; real moments from our work across rural Tamil Nadu, and the recognition it has earned.</p>
          <ul class="media-hero__meta">
            <li><i data-lucide="map-pin" aria-hidden="true"></i> Dindigul &middot; Madurai &middot; Karur &middot; Theni</li>
            <li><i data-lucide="newspaper" aria-hidden="true"></i> Covered by The Hindu, Times of India &amp; Ananda Vikatan</li>
          </ul>
          <div class="media-hero__actions">
            <a class="btn btn--light" href="#gallery">Browse the gallery <i data-lucide="arrow-down" aria-hidden="true"></i></a>
            <a class="btn btn--ghost-light" href="#press"><i data-lucide="newspaper" aria-hidden="true"></i> In the news</a>
          </div>
        </div>
      </div>
    </section>
```

Add `id="gallery"` to the gallery section opener (line ~240) and `id="press"` to the press section opener (line ~484):

```html
    <section class="section media-gallery" id="gallery" aria-labelledby="media-gallery-title">
```
```html
    <section class="section section--alt media-press" id="press" aria-labelledby="media-press-title">
```

- [ ] **Step 2: Rewrite the hero CSS block (`coodu-media.css:8-77`)**

Replace everything from `.media-hero {` through the `media-hero-zoom` keyframes block with:

```css
.media-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  min-height: clamp(400px, 52vh, 480px);
  color: var(--color-on-dark);
  background-color: var(--color-dark-menu);
}

.media-hero__layers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.media-hero__photo {
  position: absolute;
  inset: 0;
  background-image: url('https://res.cloudinary.com/dvxbg6to3/image/upload/f_auto,q_auto/v1754474804/coodu-trust/images/headers/media-bg.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  transform-origin: center;
}

/* Neutral, hue-free legibility gradient — the photograph keeps its exact tone.
   Top band protects the fixed header; middle is fully untouched; bottom carries the text. */
.media-hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(0, 0, 0, .30) 0%,
    rgba(0, 0, 0, 0) 26%,
    rgba(0, 0, 0, 0) 44%,
    rgba(0, 0, 0, .34) 72%,
    rgba(0, 0, 0, .66) 100%);
}

.media-hero .container {
  position: relative;
  z-index: 2;
  width: 100%;
}

.media-hero__content {
  max-width: var(--maxw-text);
  margin-inline: auto;
  padding-block: clamp(var(--s6), 12vw, 120px) clamp(64px, 9vw, 96px);
  text-align: center;
}

.media-hero__eyebrow svg,
.media-hero__eyebrow [data-lucide] { width: 15px; height: 15px; }

.media-hero__title {
  margin: var(--s2) 0 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h1);
  line-height: 1.08;
  color: var(--color-on-dark);
  text-shadow: 0 1px 18px rgba(0, 0, 0, .35);
}

.media-hero__sub {
  max-width: 560px;
  margin: var(--s2) auto 0;
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--on-dark-80);
  text-shadow: 0 1px 12px rgba(0, 0, 0, .35);
}

.media-hero__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--s1) var(--s3);
  margin: var(--s3) 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--fs-small);
  color: var(--on-dark-80);
  text-shadow: 0 1px 10px rgba(0, 0, 0, .4);
}
.media-hero__meta li { display: inline-flex; align-items: center; gap: 7px; }
.media-hero__meta svg,
.media-hero__meta [data-lucide] { width: 16px; height: 16px; color: var(--color-amber); flex: none; }

.media-hero__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
  margin-top: var(--s4);
}
.media-hero__actions .btn { width: 100%; max-width: 320px; justify-content: center; }

@media (min-width: 600px) {
  .media-hero__actions { flex-direction: row; justify-content: center; }
  .media-hero__actions .btn { width: auto; max-width: none; }
}

/* anchor targets clear the fixed header */
#gallery, #press { scroll-margin-top: calc(var(--header-h-desktop) + 16px); }

@media (prefers-reduced-motion: no-preference) {
  .media-hero__photo {
    animation: media-hero-zoom 22s ease-in-out infinite alternate;
  }
  @keyframes media-hero-zoom {
    from { transform: scale(1); }
    to   { transform: scale(1.09); }
  }
}
```

- [ ] **Step 3: Render-verify the hero at 3 widths**

```bash
SCRATCH=/private/tmp/claude-501/-Users-jagathguru-Documents-PROJECTS-COODU-TRUST/e0befb9a-65a9-4535-9ecc-a20c6218d00e/scratchpad
node $SCRATCH/cdp-shot.mjs "http://localhost:8767/media.html" design/redesign-renders/enh1-hero-1440 1440 slices
node $SCRATCH/cdp-shot.mjs "http://localhost:8767/media.html" design/redesign-renders/enh1-hero-834 834 slices
node $SCRATCH/cdp-shot.mjs "http://localhost:8767/media.html" design/redesign-renders/enh1-hero-390 390 slices
```

Read slice `s0` of each (multimodal). Expected: golden paddy scene reads warm/golden (compare against raw photo `$SCRATCH/media-bg.png` — NOT green-washed), all hero text legible, eyebrow amber, meta icons amber, two buttons (white solid + ghost), no overlap with header.

- [ ] **Step 4: Verify anchors + console clean**

```bash
node $SCRATCH/cdp-act.mjs "http://localhost:8767/media.html" 1440 -- \
  click:'.media-hero__actions .btn--light' wait:900 \
  eval:'Math.round(document.getElementById("gallery").getBoundingClientRect().top)' \
  eval:'getComputedStyle(document.querySelector(".media-hero__scrim")).backgroundImage.includes("13, 46, 22") ? "GREEN SCRIM STILL PRESENT" : "scrim neutral"'
```

Expected: gallery top between 0 and ~120 (below header), `"scrim neutral"`, `CONSOLE-ERRORS []`, `FAILED-REQUESTS []`.

- [ ] **Step 5: Commit**

```bash
git add media.html assets/css/coodu-media.css
git commit -m "Rebuild Media hero photo-first: true image tone, meta row, CTAs"
```

---

### Task 2: Proof strip overlapping the hero

**Files:**
- Modify: `media.html` (insert new section directly after the HERO `</section>`)
- Modify: `assets/css/coodu-media.css` (new block after the hero block)

**Interfaces:**
- Consumes: `.stat`, `.stat__num`, `.stat__label`, `.icon-chip` (coodu-components.css); `.counter[data-target]` animation (coodu.js — needs BOTH class and attribute; static fallback text stays inside the span).

- [ ] **Step 1: Insert the section HTML**

```html
    <!-- ================= PROOF STRIP (overlaps hero) ================= -->
    <section class="media-proof" aria-label="The archive at a glance">
      <div class="container">
        <div class="media-proof__card reveal">
          <div class="stat">
            <span class="icon-chip"><i data-lucide="camera" aria-hidden="true"></i></span>
            <span class="stat__num counter" data-target="17">17</span>
            <span class="stat__label">Field photographs</span>
          </div>
          <div class="stat">
            <span class="icon-chip"><i data-lucide="layers" aria-hidden="true"></i></span>
            <span class="stat__num counter" data-target="5">5</span>
            <span class="stat__label">Program areas</span>
          </div>
          <div class="stat">
            <span class="icon-chip"><i data-lucide="map-pin" aria-hidden="true"></i></span>
            <span class="stat__num counter" data-target="4">4</span>
            <span class="stat__label">Districts covered</span>
          </div>
          <div class="stat">
            <span class="icon-chip"><i data-lucide="calendar-days" aria-hidden="true"></i></span>
            <span class="stat__num counter" data-target="20" data-suffix="+">20+</span>
            <span class="stat__label">Years documented</span>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Add the CSS block (after the hero block, before "Filter bar")**

```css
/* ---- Proof strip (overlaps hero) ----------------------------------------- */
.media-proof {
  margin-top: clamp(-56px, -5vw, -36px);
  position: relative;
  z-index: 2;
}

.media-proof__card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(16px, 3vw, 28px) clamp(12px, 3vw, 24px);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-band);
  padding: clamp(20px, 4vw, 30px) clamp(18px, 4vw, 34px);
  text-align: center;
}

.media-proof .stat { align-items: center; gap: 6px; }
.media-proof .icon-chip { margin-bottom: 2px; }
.media-proof .stat__num { font-size: var(--fs-stat); }

@media (min-width: 900px) {
  .media-proof__card { grid-template-columns: repeat(4, 1fr); }
}
```

- [ ] **Step 3: Render-verify + counter check**

```bash
node $SCRATCH/cdp-shot.mjs "http://localhost:8767/media.html" design/redesign-renders/enh2-proof-1440 1440 slices
node $SCRATCH/cdp-act.mjs "http://localhost:8767/media.html" 1440 -- \
  eval:'document.querySelector(".media-proof").previousElementSibling.className' \
  wait:2500 \
  eval:'[...document.querySelectorAll(".media-proof .stat__num")].map(e=>e.textContent.trim()).join("|")'
```

Read `enh2-proof-1440-s0.png`: white card rises out of the hero's dark bottom gradient at every width (also shoot 390). Expected eval 1: `media-hero`; eval 2: `17|5|4|20+`. Console/requests clean.

- [ ] **Step 4: Commit**

```bash
git add media.html assets/css/coodu-media.css
git commit -m "Add Media proof strip overlapping hero (17 photos / 5 areas / 4 districts / 20+ years)"
```

---

### Task 3: Featured story section

**Files:**
- Modify: `media.html` (insert between proof strip and gallery section)
- Modify: `assets/css/coodu-media.css` (new block after proof strip block)
- Modify: `assets/js/coodu-media.js` (new module appended at end of file)

**Interfaces:**
- Consumes: tile 1 `li.media-tile[data-title="Watershed Development Project"]` and its `.media-tile__title` click-to-open lightbox behavior; `.media-chip[data-filter="all"]`.
- Produces: `[data-featured-open="<data-title value>"]` button convention.

- [ ] **Step 1: Insert the section HTML** (story text is VERBATIM from tile 1's `data-story` — do not edit a word)

```html
    <!-- ================= FEATURED STORY ================= -->
    <section class="section section--alt media-featured" aria-labelledby="media-featured-title">
      <div class="container">
        <article class="media-featured__card reveal">
          <div class="media-featured__photo">
            <img src="https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456729/coodu-trust/images/programs/watershed-development.jpg"
                 alt="Check dam holding water beside restored farmland in Dindigul district" loading="lazy">
          </div>
          <div class="media-featured__body">
            <p class="eyebrow">Featured story</p>
            <h2 class="media-featured__title" id="media-featured-title">Watershed development</h2>
            <ul class="media-featured__meta">
              <li><i data-lucide="map-pin" aria-hidden="true"></i> Dindigul District, Tamil Nadu</li>
              <li><i data-lucide="calendar" aria-hidden="true"></i> March 2023</li>
              <li class="media-featured__impact"><i data-lucide="trending-up" aria-hidden="true"></i> 500+ families benefited</li>
            </ul>
            <p class="media-featured__excerpt">This watershed development project transformed 200 hectares of barren land into fertile agricultural fields. Through innovative water conservation techniques and soil restoration methods, we helped local farmers increase their crop yield by 60% while conserving precious water resources.</p>
            <div class="media-featured__actions">
              <button class="btn btn--primary" type="button" data-featured-open="Watershed Development Project">Read the full story <i data-lucide="maximize-2" aria-hidden="true"></i></button>
              <a class="media-featured__link" href="#gallery">Browse all 17 photographs <i data-lucide="arrow-down" aria-hidden="true"></i></a>
            </div>
          </div>
        </article>
      </div>
    </section>
```

- [ ] **Step 2: Add the CSS block**

```css
/* ---- Featured story ------------------------------------------------------- */
.media-featured__card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-frame);
  box-shadow: var(--shadow-2);
}

.media-featured__photo { position: relative; aspect-ratio: 16 / 10; }
.media-featured__photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-featured__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--s2);
  padding: clamp(var(--s3), 4vw, var(--s5));
}

.media-featured__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h2);
  line-height: 1.15;
  color: var(--text-strong);
}

.media-featured__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s1) var(--s2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--fs-small);
  color: var(--text-muted);
}
.media-featured__meta li { display: inline-flex; align-items: center; gap: 6px; }
.media-featured__meta svg,
.media-featured__meta [data-lucide] { width: 15px; height: 15px; color: var(--color-primary); flex: none; }
.media-featured__impact { color: var(--color-success); font-weight: 600; }

.media-featured__excerpt {
  margin: 0;
  font-size: var(--fs-body);
  line-height: 1.65;
  color: var(--text-body);
}

.media-featured__actions {
  display: flex;
  flex-direction: column;
  gap: var(--s2);
  width: 100%;
  margin-top: var(--s1);
}
.media-featured__actions .btn { justify-content: center; }

.media-featured__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: .8125rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--color-primary);
  text-decoration: none;
}
.media-featured__link:hover { color: var(--color-primary-dark); }
.media-featured__link svg,
.media-featured__link [data-lucide] { width: 15px; height: 15px; }

@media (min-width: 900px) {
  .media-featured__card { flex-direction: row; align-items: stretch; }
  .media-featured__photo { flex: 0 0 55%; aspect-ratio: auto; min-height: 380px; }
  .media-featured__body { justify-content: center; }
  .media-featured__actions { flex-direction: row; align-items: center; width: auto; }
}
```

- [ ] **Step 3: Append the JS module to `coodu-media.js`**

```js
/* ---- Featured story hook ------------------------------------------------ */
(function () {
  'use strict';

  var btn = document.querySelector('[data-featured-open]');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var tile = document.querySelector('.media-tile[data-title="' + btn.getAttribute('data-featured-open') + '"]');
    if (!tile) return;
    if (tile.hidden) {
      var allChip = document.querySelector('.media-chip[data-filter="all"]');
      if (allChip) allChip.click();
    }
    var opener = tile.querySelector('.media-tile__title');
    if (opener) opener.click();
  });
})();
```

- [ ] **Step 4: Render + interaction verify**

```bash
node $SCRATCH/cdp-shot.mjs "http://localhost:8767/media.html" design/redesign-renders/enh3-featured-1440 1440 slices
node $SCRATCH/cdp-act.mjs "http://localhost:8767/media.html" 1440 -- \
  click:'[data-featured-open]' wait:600 \
  eval:'!document.querySelector(".media-lightbox").hidden' \
  eval:'document.querySelector(".media-lightbox__title").textContent' \
  key:Escape wait:300 \
  click:'.media-chip[data-filter="health"]' wait:400 \
  click:'[data-featured-open]' wait:600 \
  eval:'document.querySelector(".media-lightbox__title").textContent'
```

Expected: `true`, `Watershed Development Project`, and after filtering to health the featured button still opens `Watershed Development Project` (filter auto-reset to All). Read the slice with the featured card: photo left / content right at 1440; also shoot 390 (stacked). Console/requests clean.

- [ ] **Step 5: Commit**

```bash
git add media.html assets/css/coodu-media.css assets/js/coodu-media.js
git commit -m "Add featured story spotlight wired to the gallery lightbox"
```

---

### Task 4: Press band polish (visual only — no new facts)

**Files:**
- Modify: `media.html:486-511` (press section-head + 3 cards)
- Modify: `assets/css/coodu-media.css` (press card block, currently lines ~334-411)

- [ ] **Step 1: Update the press markup**

Section head gains a sub line:

```html
        <div class="section-head reveal">
          <p class="eyebrow">Press</p>
          <h2 id="media-press-title">In the news</h2>
          <p class="section-head__sub">Independent coverage of our programs in the English and Tamil press.</p>
        </div>
```

Each card's outlet line swaps the generic newspaper icon for a typographic monogram chip
(monograms: `TH` The Hindu, `TOI` Times of India, `AV` Ananda Vikatan):

```html
              <p class="media-press__outlet"><span class="media-press__mono" aria-hidden="true">TH</span>The Hindu</p>
```

(the `.img-slot` placeholders and headlines stay byte-identical.)

- [ ] **Step 2: Add CSS (append inside the press block area)**

```css
.media-press__mono {
  display: inline-grid;
  place-items: center;
  min-width: 30px;
  height: 30px;
  padding-inline: 5px;
  border-radius: var(--radius-btn);
  background: var(--surface-tint);
  color: var(--color-primary-dark);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: .6875rem;
  letter-spacing: .02em;
}

.media-press__headline::before {
  content: "\201C";
  display: block;
  font-family: var(--font-display);
  font-size: 2rem;
  line-height: .55;
  color: var(--color-amber-text);
  margin-bottom: 4px;
}
```

- [ ] **Step 3: Render-verify**

```bash
node $SCRATCH/cdp-shot.mjs "http://localhost:8767/media.html" design/redesign-renders/enh4-press-1440 1440 slices
```

Read the press slice: monogram chips render, amber quote marks above headlines, sub line present, cards otherwise unchanged. Console clean.

- [ ] **Step 4: Commit**

```bash
git add media.html assets/css/coodu-media.css
git commit -m "Polish press cards with outlet monograms and pull-quote headlines"
```

---

### Task 5: Closing CTA band

**Files:**
- Modify: `media.html` (insert after press `</section>`, before `</main>`)
- Modify: `assets/css/coodu-media.css` (new block before the lightbox block)

- [ ] **Step 1: Insert the section HTML**

```html
    <!-- ================= CTA BAND ================= -->
    <section class="section media-cta" aria-labelledby="media-cta-title">
      <div class="container media-cta__inner reveal">
        <p class="eyebrow">Be part of the story</p>
        <h2 class="media-cta__title" id="media-cta-title">The next photograph could include you.</h2>
        <div class="media-cta__actions">
          <a class="btn btn--cta" href="donate.html"><i data-lucide="heart" aria-hidden="true"></i> Donate</a>
          <a class="btn btn--outline" href="volunteer.html">Volunteer with us</a>
        </div>
        <a class="media-cta__link" href="programs.html">Explore our programs <i data-lucide="arrow-right" aria-hidden="true"></i></a>
      </div>
    </section>
```

- [ ] **Step 2: Add CSS (mirror of the proven `about-cta` pattern, media-scoped)**

```css
/* ---- Closing CTA band ----------------------------------------------------- */
.media-cta {
  background: var(--grad-cta);
  color: var(--surface);
  text-align: center;
}

.media-cta__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s3);
  max-width: 640px;
}

.media-cta .eyebrow {
  color: var(--color-amber-light);
  justify-content: center;
}
.media-cta .eyebrow::after {
  content: "";
  width: 24px;
  height: 2px;
  background: currentColor;
  flex: none;
}

.media-cta__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h2);
  line-height: 1.12;
  color: var(--surface);
}

.media-cta__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 360px;
}
.media-cta__actions .btn { width: 100%; justify-content: center; }

.media-cta .btn--outline {
  background: transparent;
  color: var(--surface);
  border-color: var(--border-on-dark);
}
.media-cta .btn--outline:hover {
  background: var(--surface);
  color: var(--color-primary-dark);
  border-color: var(--surface);
}

.media-cta__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: .8125rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--color-amber-light);
  text-decoration: none;
}
.media-cta__link svg,
.media-cta__link [data-lucide] { width: 15px; height: 15px; }
.media-cta__link:hover { color: var(--surface); }

@media (prefers-reduced-motion: no-preference) {
  .media-cta__link svg { transition: transform var(--ease); }
  .media-cta__link:hover svg { transform: translateX(3px); }
}

@media (min-width: 600px) {
  .media-cta__actions { flex-direction: row; max-width: none; width: auto; }
  .media-cta__actions .btn { width: auto; }
}
```

- [ ] **Step 3: Render-verify + commit**

```bash
node $SCRATCH/cdp-shot.mjs "http://localhost:8767/media.html" design/redesign-renders/enh5-cta-1440 1440 slices
git add media.html assets/css/coodu-media.css
git commit -m "Add closing CTA band to Media page"
```

Expected in render: green gradient band, amber eyebrow with underline, orange Donate + white-outline Volunteer, amber programs link — directly before the footer.

---

### Task 6: Full-matrix verification + fix loop

**Files:** none new — fixes only if defects found.

- [ ] **Step 1: Full-page render matrix (multimodal review)**

```bash
node $SCRATCH/cdp-shot.mjs "http://localhost:8767/media.html" design/redesign-renders/enh6-final-1440 1440 both 1 4000
node $SCRATCH/cdp-shot.mjs "http://localhost:8767/media.html" design/redesign-renders/enh6-final-834 834 both 1 4000
node $SCRATCH/cdp-shot.mjs "http://localhost:8767/media.html" design/redesign-renders/enh6-final-390 390 both 1 4000
```

Review every slice at every width: narrative order hero → proof → featured → gallery → press → CTA → footer; hero tone golden (side-by-side against `$SCRATCH/media-bg.png`); no clipped/overlapping elements; spacing rhythm consistent.

- [ ] **Step 2: Full interaction + a11y pass**

```bash
node $SCRATCH/cdp-act.mjs "http://localhost:8767/media.html" 1440 -- \
  click:'.media-chip[data-filter="recognition"]' wait:400 \
  eval:'document.querySelector(".media-count").textContent' \
  click:'.media-chip[data-filter="all"]' wait:400 \
  click:'.media-tile__title' wait:500 \
  eval:'!document.querySelector(".media-lightbox").hidden' \
  key:ArrowRight wait:200 key:Escape wait:300 \
  eval:'document.querySelectorAll("section[aria-label], section[aria-labelledby]").length' \
  eval:'[...document.querySelectorAll("a[href]")].filter(a=>a.getAttribute("href").startsWith("#")).map(a=>a.getAttribute("href")).join()'
```

Expected: `Showing 6 in Milestones & Recognition`, lightbox opens/navigates/closes, ≥6 labelled sections, anchors `#gallery,#press,...` all resolve to existing ids. Also run once with `reduce` flag: no pop/zoom animation errors. CONSOLE-ERRORS `[]`, FAILED-REQUESTS `[]`.

- [ ] **Step 3: Reduced-motion + drawer spot-check at 390**

```bash
node $SCRATCH/cdp-act.mjs "http://localhost:8767/media.html" 390 reduce -- \
  eval:'getComputedStyle(document.querySelector(".media-hero__photo")).animationName' \
  shot:design/redesign-renders/enh6-390-reduce.png
```

Expected: `none` (Ken Burns disabled under reduced motion).

- [ ] **Step 4: Fix anything found, re-render, then commit fixes**

```bash
git add -A media.html assets/css/coodu-media.css assets/js/coodu-media.js
git commit -m "Media enhancement: full-matrix verification fixes"
```

(Skip the commit if no fixes were needed.)
