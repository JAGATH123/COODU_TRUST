# Media Page Enhancement — Design Spec (Approach A: "Photo-first editorial")

**Date:** 2026-07-02 · **Branch:** `redesign/home-rebuild` · **Extends:** `2026-07-02-media-page-design.md`

## Goal

The user's verdict on the current Media page: the hero is thin compared to Home/Donate ("no major text"),
and the dark-green scrim kills the golden tone of the hero photograph ("apply the exact image tone").
This round rebuilds the hero photo-first and adds a narrative arc to the page:
**arrive → proof → featured story → explore → press → act.**

User approved Approach A ("Photo-first editorial") with page-wide polish scope on 2026-07-02.

## Constraints (unchanged)

- Design system only: tokens in `coodu-tokens.css`, breakpoints 600/900/1200, Lucide icons, sentence case.
- No invented facts. Press cards have no real dates/URLs — polish is visual/typographic only.
- Recognition captions (tiles 12–17) remain pending user verification — the featured spotlight therefore
  uses tile 1 (Watershed), whose story copy is already approved verbatim from legacy.
- Page files: `media.html`, `assets/css/coodu-media.css`, `assets/js/coodu-media.js`. Bump `?v=3 → ?v=4`.

## 1. Hero — photo-first, true tone (`.media-hero` v2)

**Backdrop (the core fix):**
- Keep `media-bg.png` (golden-hour paddy scene; original is 1650×300 — no larger source exists).
- Serve via Cloudinary `f_auto,q_auto` (same pixels, exact tone, ~1.1MB → far smaller transfer).
- **Delete the green scrim** (`rgba(13,46,22,.5) → rgba(11,38,20,.72)`). Replace with a neutral,
  hue-free (pure black) legibility gradient anchored where text sits:
  `linear-gradient(180deg, rgba(0,0,0,.26) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 46%, rgba(0,0,0,.58) 100%)`
  — small top band for header legibility, untouched middle (the image reads at its exact tone),
  bottom band under the content. Tune values during visual verification; hue must stay 0-saturation.
- Height: `min-height: clamp(380px, 50vh, 470px)` (taller than today's 320–420, capped so the
  300px-tall source doesn't upscale past ~1.57×). Keep the 22s Ken Burns zoom (reduced-motion-safe).
- Add `<link rel="preload" as="image">` for the hero image (LCP).

**Content (Home/Donate density), bottom-weighted and centered:**
- Eyebrow (`.eyebrow--on-dark` + camera icon): `Media — Gallery & press`
- H1: **"Stories from the field"** (replaces bare "Media"; matches the emotive-title pattern of
  Home "Empowering communities…" / Donate "Support our mission". Nav label stays "Media".)
- Sub (2 lines): `From golden paddy fields to national headlines — real moments from our work
  across rural Tamil Nadu, and the recognition it has earned.`
- Meta row (Donate-style `ul` with amber 16px icons):
  - map-pin · `Dindigul · Madurai · Karur · Theni`
  - newspaper · `Covered by The Hindu, Times of India & Ananda Vikatan`
- Actions row (dark-safe variants only):
  - `btn--light` → `Browse the gallery` (anchor `#gallery`, arrow-down icon)
  - `btn--ghost-light` → `In the news` (anchor `#press`, newspaper icon)
- Sections gain `id="gallery"` / `id="press"` for the anchors. `scroll-margin-top` for fixed header.

## 2. Proof strip — `.media-proof` (new section, overlaps hero bottom)

Donate's overlap mechanic (works at all widths): card with
`margin-top: clamp(-56px, -5vw, -36px); position: relative; z-index: 2;` + Home's icon-chips.
White `--surface` card, `--radius-card`, `--shadow-band`, 2-col grid → 4-col at ≥760px.
Four stats (all `counter` spans with static fallback text, honest numbers already on the page/site):

| icon | number | label |
|---|---|---|
| camera | 17 | Field photographs |
| layers | 5 | Program areas |
| map-pin | 4 | Districts covered |
| calendar-days | 20+ | Years documented |

The white card rising out of the hero's dark bottom gradient is the key visual moment of the fold.

## 3. Featured story — `.media-featured` (new section, before the gallery)

Editorial split card introducing the gallery as *stories*, not thumbnails:
- Layout: real photo left (≥900px: 55%, 4/3), content right; stacks on mobile. `--surface` card,
  `--radius-frame`, `--shadow-2`, generous padding.
- Content: eyebrow `Featured story` → h2 `Watershed Development Project` → meta chips
  (map-pin Dindigul District · calendar March 2023 · green impact chip "500+ families benefited")
  → 2–3 line excerpt of the existing approved `data-story` (verbatim, truncated with …) →
  `btn--primary` **Read the full story** + text-link `Browse all 17 photographs →` (to `#gallery`).
- Behavior: "Read the full story" opens the existing lightbox on tile 1 by delegating to that tile's
  title-button click (no data duplication; single source of truth stays in the tile markup).
- Section uses `.section` spacing; sits between proof strip and gallery.

## 4. Press band polish — visual only, zero new facts

- Section-head gains sub: `Independent coverage of our programs in the English and Tamil press.`
- Each card: typographic **outlet monogram chip** (TH / TOI / AV — display font, `--surface-tint`
  bg, `--color-primary-dark` text) beside the outlet name; headline gets pull-quote treatment
  (decorative quote mark, `--fs-h3` display). Keep existing hover lift; keep `.img-slot`
  clipping placeholders exactly as they are.

## 5. Closing CTA band — `.media-cta` (new section, after press)

Mirror of About's green band pattern (`--grad-cta`, centered, amber eyebrow w/ underline):
- Eyebrow: `Be part of the story`
- H2: `The next photograph could include you.`
- Actions: `btn--cta` Donate (heart) · on-dark outline **Volunteer with us** → `volunteer.html`
- Text-link: `Explore our programs →` (programs.html, amber, arrow)
Styles live in `coodu-media.css` (page-scoped, consistent with `about-cta` precedent).

## 6. Order of sections after this round

Hero (true-tone photo) → Proof strip (overlapping) → Featured story → Gallery (unchanged) →
Press (polished) → CTA band → Footer.

## Error handling / a11y / perf

- All new sections `aria-labelledby`; counters ship static fallback text (work without JS);
  meta list is a semantic `ul`; monogram chips `aria-hidden` (outlet name is adjacent text).
- Anchor scrolling: `scroll-margin-top` ≥ header height; CSS `scroll-behavior: smooth` only
  under `prefers-reduced-motion: no-preference` (respect existing base rules if present).
- Featured image: explicit `width/height`/`aspect-ratio` to avoid CLS; `loading="eager"` above
  fold only for hero preload; featured photo `loading="lazy"` is fine (below fold on mobile).
- No console errors; no new network hosts (Cloudinary already in use).

## Verification

- Render matrix 1440 / 834 / 390 via the harness (server :8767, CDP :9224, cache disabled,
  force `.reveal is-in`), full-page + hero close-up; verify the hero tone against the raw
  photograph side-by-side (multimodal check: golden, not green).
- Interaction pass: chips still filter, lightbox opens from featured button + tiles, anchors
  scroll, counters animate once.
- Console/network audit clean; `?v=4` everywhere.
