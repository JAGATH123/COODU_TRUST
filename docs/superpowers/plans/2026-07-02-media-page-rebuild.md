# Media Page Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `media.html` as a clean design-system page — hero, filterable 17-photo gallery with story lightbox, branded press section — per the approved spec `docs/superpowers/specs/2026-07-02-media-page-design.md`.

**Architecture:** Static semantic HTML tiles carrying `data-*` metadata; one new page stylesheet (`coodu-media.css`) and one new deferred page script (`coodu-media.js`) that progressively enhance (filters, live count, lightbox). Shared chrome/tokens/behaviors come from the existing `coodu-*` files and are not modified.

**Tech Stack:** Hand-written HTML/CSS/JS (no frameworks, no build step), Lucide icons via CDN, Google Fonts (Oswald + Source Sans 3), verification via static server :8767 + headless Chrome CDP :9224.

## Global Constraints

- Branch: `redesign/home-rebuild`. Never push; never merge; commit per task with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Design tokens ONLY: every color/space/radius/shadow/font in new CSS must be `var(--…)` from `assets/css/coodu-tokens.css`. The only new literal values allowed: rgba gradient stops for photo scrims/caption gradients and the lightbox backdrop (decorative overlays with no token), media-query literals `600px/900px/1200px`, and component-internal offsets/icon sizes under 16px where no spacing token fits (badge insets, icon width/height) — never literal hex colors.
- No inline styles, no `<style>` blocks, no new libraries, nothing links to `#`.
- Shared files untouched and linked at `?v=5`: `coodu-tokens.css`, `coodu-base.css`, `coodu-components.css`, `coodu-motion.css`, `coodu.js`. New page files linked at `?v=1`.
- Typography: Oswald via `var(--font-display)` for headings/labels, Source Sans 3 via `var(--font-body)` for copy. Sentence case for headings/captions ("Our work in action", not "OUR WORK IN ACTION").
- All animation inside `@media (prefers-reduced-motion: no-preference)`; functional states (open/close/hidden) must work without motion.
- Touch targets ≥44px (chips on mobile, tile expand button hit area, lightbox controls).
- Copy the 4 rich stories VERBATIM as given in Task 1 (they are real program data) — do not paraphrase.
- Scratchpad for harness scripts (absolute): `/private/tmp/claude-501/-Users-jagathguru-Documents-PROJECTS-COODU-TRUST/35a9e510-2c07-4b85-9965-afdcaab35c79/scratchpad`

---

### Task 0: Render harness up + verification scripts

**Files:**
- Create: `<SCRATCHPAD>/cdp-shot.mjs` (may already exist — overwrite is fine)
- Create: `<SCRATCHPAD>/cdp-act.mjs`

**Interfaces:**
- Produces: `node cdp-shot.mjs <url> <outbase> <width> <mode: full|slices|both> [dsf] [waitMs]` → PNG(s) + JSON report line; `node cdp-act.mjs <url> <width> [reduce] -- <cmd>…` where cmds are `eval:<js>`, `click:<selector>`, `key:<Escape|ArrowRight|ArrowLeft|Tab>`, `wait:<ms>`, `shot:<file.png>` → prints one JSON line per eval + `CONSOLE-ERRORS` / `FAILED-REQUESTS` summary at end. All later tasks verify with these.

- [ ] **Step 1: Ensure server + headless Chrome are running**

```bash
curl -s -o /dev/null -w "server:%{http_code}\n" http://localhost:8767/media.html || (cd /Users/jagathguru/Documents/PROJECTS/COODU_TRUST && (python3 -m http.server 8767 >/dev/null 2>&1 &) && sleep 1)
curl -s http://localhost:9224/json/version | head -c 60 || ("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9224 --user-data-dir="<SCRATCHPAD>/chrome-profile" --no-first-run --window-size=1440,1000 about:blank >/dev/null 2>&1 &) 
sleep 2; curl -s http://localhost:9224/json/version | head -c 60
```
Expected: `server:200` (or 404 before Task 1 — that's fine) and a `"Browser": "Chrome/…"` line.

- [ ] **Step 2: Write `<SCRATCHPAD>/cdp-shot.mjs`** (verbatim)

```js
// Dependency-free CDP screenshotter (Chrome on :9224)
// usage: node cdp-shot.mjs <url> <outbase> <width> <mode: full|slices|both> [dsf] [waitMs]
import fs from 'node:fs';

const [,, url, outbase, wStr, mode = 'both', dsfStr, waitStr] = process.argv;
const width = +wStr || 1440;
const dsf = +dsfStr || 1;
const waitMs = +waitStr || 3000;
const SLICE_H = 2000;
const MAX_SLICES = 12;

const ver = await (await fetch('http://localhost:9224/json/version')).json();
const ws = new WebSocket(ver.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const i = ++id;
  pending.set(i, { res, rej });
  ws.send(JSON.stringify({ id: i, method, params, sessionId }));
});
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id);
    pending.delete(m.id);
    m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
  }
};
await new Promise((r) => { ws.onopen = r; });

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const s = (m, p) => send(m, p, sessionId);

await s('Page.enable');
await s('Network.enable');
await s('Network.setCacheDisabled', { cacheDisabled: true });
await s('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: dsf, mobile: false });
await s('Page.navigate', { url });
await new Promise((r) => setTimeout(r, waitMs));
// force scroll-reveal elements visible so full-page shots aren't blank
await s('Runtime.evaluate', { expression: "document.querySelectorAll('.reveal,[data-reveal]').forEach(el=>{el.classList.add('is-in');el.style.opacity='1';el.style.transform='none'});0" });
await new Promise((r) => setTimeout(r, 500));

const { contentSize } = await s('Page.getLayoutMetrics');
const fullH = Math.ceil(contentSize.height);
const report = { url, width, fullHeight: fullH, files: [] };

if (mode === 'full' || mode === 'both') {
  const h = Math.min(fullH, 25000);
  await s('Emulation.setDeviceMetricsOverride', { width, height: h, deviceScaleFactor: dsf, mobile: false });
  await new Promise((r) => setTimeout(r, 700));
  const shot = await s('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  const f = `${outbase}-full.png`;
  fs.writeFileSync(f, Buffer.from(shot.data, 'base64'));
  report.files.push(f);
}

if (mode === 'slices' || mode === 'both') {
  await s('Emulation.setDeviceMetricsOverride', { width, height: SLICE_H, deviceScaleFactor: dsf, mobile: false });
  await new Promise((r) => setTimeout(r, 500));
  const n = Math.min(Math.ceil(fullH / SLICE_H), MAX_SLICES);
  for (let i = 0; i < n; i++) {
    await s('Runtime.evaluate', { expression: `window.scrollTo(0, ${i * SLICE_H});0` });
    await new Promise((r) => setTimeout(r, 400));
    const shot = await s('Page.captureScreenshot', { format: 'png' });
    const f = `${outbase}-s${i}.png`;
    fs.writeFileSync(f, Buffer.from(shot.data, 'base64'));
    report.files.push(f);
  }
}

console.log(JSON.stringify(report));
await send('Target.closeTarget', { targetId });
ws.close();
process.exit(0);
```

- [ ] **Step 3: Write `<SCRATCHPAD>/cdp-act.mjs`** (verbatim)

```js
// Dependency-free CDP interaction driver (Chrome on :9224)
// usage: node cdp-act.mjs <url> <width> [reduce] -- <cmd> [<cmd>…]
// cmds: eval:<js>  click:<selector>  key:<Escape|ArrowRight|ArrowLeft|Tab>  wait:<ms>  shot:<file.png>
import fs from 'node:fs';

const argv = process.argv.slice(2);
const sep = argv.indexOf('--');
const [url, wStr, maybeReduce] = argv.slice(0, sep);
const cmds = argv.slice(sep + 1);
const width = +wStr || 1440;
const reduce = maybeReduce === 'reduce';

const ver = await (await fetch('http://localhost:9224/json/version')).json();
const ws = new WebSocket(ver.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const consoleErrors = [];
const failedRequests = [];
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const i = ++id;
  pending.set(i, { res, rej });
  ws.send(JSON.stringify({ id: i, method, params, sessionId }));
});
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const p = pending.get(m.id);
    pending.delete(m.id);
    m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    return;
  }
  if (m.method === 'Runtime.exceptionThrown') consoleErrors.push(m.params.exceptionDetails.text + ' ' + (m.params.exceptionDetails.exception?.description || ''));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') consoleErrors.push(m.params.args.map(a => a.value ?? a.description ?? '').join(' '));
  if (m.method === 'Network.loadingFailed') failedRequests.push(m.params.errorText);
  if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) failedRequests.push(m.params.response.status + ' ' + m.params.response.url);
};
await new Promise((r) => { ws.onopen = r; });

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const s = (m, p) => send(m, p, sessionId);

await s('Page.enable');
await s('Runtime.enable');
await s('Network.enable');
await s('Network.setCacheDisabled', { cacheDisabled: true });
await s('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
if (reduce) await s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await s('Page.navigate', { url });
await new Promise((r) => setTimeout(r, 2500));

const KEYS = {
  Escape: { key: 'Escape', code: 'Escape', keyCode: 27 },
  ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
  ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
  Tab: { key: 'Tab', code: 'Tab', keyCode: 9 },
};

for (const raw of cmds) {
  const i = raw.indexOf(':');
  const kind = raw.slice(0, i);
  const arg = raw.slice(i + 1);
  if (kind === 'eval') {
    const r = await s('Runtime.evaluate', { expression: arg, returnByValue: true });
    console.log(JSON.stringify({ eval: arg, value: r.result.value ?? r.result.description ?? null }));
  } else if (kind === 'click') {
    const r = await s('Runtime.evaluate', { expression: `(()=>{const el=document.querySelector(${JSON.stringify(arg)});if(!el)return 'NOT FOUND';el.click();return 'clicked';})()`, returnByValue: true });
    console.log(JSON.stringify({ click: arg, value: r.result.value }));
  } else if (kind === 'key') {
    const k = KEYS[arg];
    await s('Input.dispatchKeyEvent', { type: 'keyDown', key: k.key, code: k.code, windowsVirtualKeyCode: k.keyCode });
    await s('Input.dispatchKeyEvent', { type: 'keyUp', key: k.key, code: k.code, windowsVirtualKeyCode: k.keyCode });
  } else if (kind === 'wait') {
    await new Promise((r) => setTimeout(r, +arg));
  } else if (kind === 'shot') {
    const shot = await s('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(arg, Buffer.from(shot.data, 'base64'));
    console.log(JSON.stringify({ shot: arg }));
  }
}

console.log('CONSOLE-ERRORS ' + JSON.stringify(consoleErrors));
console.log('FAILED-REQUESTS ' + JSON.stringify(failedRequests.filter(u => !u.includes('favicon'))));
await send('Target.closeTarget', { targetId });
ws.close();
process.exit(0);
```

- [ ] **Step 4: Smoke-test both scripts against the live index page**

```bash
cd <SCRATCHPAD> && node cdp-shot.mjs "http://localhost:8767/index.html" smoke 1440 full 1 2000 && node cdp-act.mjs "http://localhost:8767/index.html" 1440 -- "eval:document.title" "wait:200"
```
Expected: a JSON report naming `smoke-full.png`, then `{"eval":"document.title","value":"…Coodu Trust…"}` and two summary lines. No exceptions. (No commit — scratchpad only.)

---

### Task 1: Rewrite `media.html` + create `assets/css/coodu-media.css` (static no-JS page)

**Files:**
- Modify: `media.html` (complete rewrite)
- Create: `assets/css/coodu-media.css`

**Interfaces:**
- Consumes: chrome markup from `index.html` (header block starts line 27 `<header class="site-header">`, drawer block starts line 169 `<div class="drawer" id="mobile-drawer">`, footer block lines 546–597); shared classes `.container .section .section--alt .section-head .eyebrow .eyebrow--on-dark .img-slot .img-slot__label .reveal`; tokens per `coodu-tokens.css`.
- Produces (DOM contract consumed by Tasks 2–3): `.media-chip[data-filter]` buttons (`aria-pressed`), `.media-count` (aria-live), `ul.media-grid` > `li.media-tile[data-category]` (rich tiles also carry `data-title data-location data-date data-impact data-story data-tags`), `button.media-tile__open`, `button.media-tile__title` (title-as-button), `.media-tile__img` or `.media-tile__slot`, `.media-empty[hidden]`, `.media-tile__desc`. Category slugs: `agriculture skilling environment health community recognition`.

- [ ] **Step 1: Extract chrome from index.html**

Copy from `index.html`: everything from `<header class="site-header">` (line 27) through the closing `</div>` of the drawer block (the block that starts at line 169 with `<div class="drawer" id="mobile-drawer">` — copy through the line just before `<main`), and the footer block `<footer class="site-footer" id="site-footer">…</footer>` (lines 546–597). Also copy any skip-link anchor that sits between `<body>` and `<header>`. Paste into the new media.html skeleton (Step 2) where marked. Then make exactly TWO changes in the pasted chrome:
1. Desktop nav: `<a class="nav__link" href="media.html">Media</a>` → `<a class="nav__link is-active" href="media.html" aria-current="page">Media</a>`
2. Drawer: `<a class="drawer__link" href="media.html">Media</a>` → `<a class="drawer__link is-active" href="media.html" aria-current="page">Media</a>`
If any OTHER nav/drawer link in the copied chrome carries `is-active`/`aria-current` (it will, from index), REMOVE it there so only Media is active.

- [ ] **Step 2: Write the new `media.html`**

Full file (chrome insertion points marked; everything else verbatim). Note the 4 rich tiles carry the legacy stories word-for-word:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Media — Coodu Trust</title>
  <meta name="description" content="Photo stories from Coodu Trust's field programs across Dindigul, Madurai, Karur and Theni, milestones with national leaders, and press coverage of our work.">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="assets/css/coodu-tokens.css?v=5">
  <link rel="stylesheet" href="assets/css/coodu-base.css?v=5">
  <link rel="stylesheet" href="assets/css/coodu-components.css?v=5">
  <link rel="stylesheet" href="assets/css/coodu-motion.css?v=5">
  <link rel="stylesheet" href="assets/css/coodu-media.css?v=1">
</head>
<body data-page="media">

  <!-- ======= CHROME (paste header + drawer copied from index.html here; Media set active) ======= -->

  <main id="main">

    <!-- ================= HERO ================= -->
    <section class="media-hero" aria-labelledby="media-hero-title">
      <div class="media-hero__layers" aria-hidden="true">
        <span class="media-hero__photo"></span>
        <span class="media-hero__scrim"></span>
      </div>
      <div class="container">
        <div class="media-hero__content reveal">
          <p class="eyebrow eyebrow--on-dark media-hero__eyebrow">Gallery</p>
          <h1 class="media-hero__title" id="media-hero-title">Media</h1>
          <p class="media-hero__sub">Visual stories of our programs and media coverage of our impact</p>
        </div>
      </div>
    </section>

    <!-- ================= GALLERY ================= -->
    <section class="section media-gallery" aria-labelledby="media-gallery-title">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">In the field</p>
          <h2 id="media-gallery-title">Our work in action</h2>
          <p class="section-head__sub">Real moments from our five program areas across Dindigul, Madurai, Karur and Theni — tap any photo to read the story behind it.</p>
        </div>

        <div class="media-filter reveal">
          <div class="media-chips" role="group" aria-label="Filter photos by category">
            <button class="media-chip is-active" type="button" data-filter="all" aria-pressed="true">All</button>
            <button class="media-chip" type="button" data-filter="agriculture" aria-pressed="false">Agriculture &amp; Livelihood</button>
            <button class="media-chip" type="button" data-filter="skilling" aria-pressed="false">Skilling &amp; Employment</button>
            <button class="media-chip" type="button" data-filter="environment" aria-pressed="false">Environment &amp; Water</button>
            <button class="media-chip" type="button" data-filter="health" aria-pressed="false">Health &amp; Sanitation</button>
            <button class="media-chip" type="button" data-filter="community" aria-pressed="false">Community &amp; Infrastructure</button>
            <button class="media-chip" type="button" data-filter="recognition" aria-pressed="false">Milestones &amp; Recognition</button>
          </div>
          <p class="media-count" aria-live="polite">Showing 17 photos</p>
        </div>

        <ul class="media-grid">

          <!-- 1 · agriculture · RICH · real photo -->
          <li class="media-tile reveal" data-category="agriculture"
              data-title="Watershed Development Project"
              data-location="Dindigul District, Tamil Nadu"
              data-date="March 2023"
              data-impact="500+ families benefited"
              data-story="This watershed development project transformed 200 hectares of barren land into fertile agricultural fields. Through innovative water conservation techniques and soil restoration methods, we helped local farmers increase their crop yield by 60% while conserving precious water resources."
              data-tags="Water Conservation, Soil Restoration, Sustainable Agriculture, Community Development">
            <span class="media-tile__badge">Agriculture</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Watershed development"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <img class="media-tile__img" src="https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456729/coodu-trust/images/programs/watershed-development.jpg" alt="Check dam holding water beside restored farmland in Dindigul district" loading="lazy">
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Watershed development</button>
              <span class="media-tile__desc">Transforming barren lands into productive agricultural areas</span>
            </span>
          </li>

          <!-- 2 · agriculture · RICH · placeholder slot -->
          <li class="media-tile reveal" data-category="agriculture"
              data-title="Organic Farming Training Program"
              data-location="Karur District, Tamil Nadu"
              data-date="January 2024"
              data-impact="300+ farmers trained"
              data-story="Our comprehensive organic farming training program equipped local farmers with sustainable agricultural techniques. Participants learned composting, natural pest control, and soil health management, leading to a 40% reduction in farming costs and improved crop quality."
              data-tags="Organic Farming, Sustainable Agriculture, Farmer Training, Environmental Protection">
            <span class="media-tile__badge">Agriculture</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Organic farming training"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <span class="img-slot media-tile__slot" data-ratio="4/3" role="img" aria-label="Photo coming soon: organic farming training"><span class="img-slot__label">Organic farming training</span></span>
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Organic farming training</button>
              <span class="media-tile__desc">Teaching sustainable agricultural practices</span>
            </span>
          </li>

          <!-- 3 · skilling · RICH · real photo -->
          <li class="media-tile reveal" data-category="skilling"
              data-title="Women's Skill Development Program"
              data-location="Madurai District, Tamil Nadu"
              data-date="November 2023"
              data-impact="250+ women empowered"
              data-story="This transformative program provided women with valuable skills in tailoring, handicrafts, and digital literacy. Over 90% of participants now run their own small businesses, with average monthly income increasing from ₹2,000 to ₹8,000. The program also included financial literacy and entrepreneurship training."
              data-tags="Women Empowerment, Skill Development, Entrepreneurship, Digital Literacy">
            <span class="media-tile__badge">Skilling</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Skill development program"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <img class="media-tile__img" src="https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456727/coodu-trust/images/programs/program-women-empowerment.jpg" alt="Women at a Coodu Trust skill development training session" loading="lazy">
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Skill development program</button>
              <span class="media-tile__desc">Empowering communities with employable skills</span>
            </span>
          </li>

          <!-- 4 · skilling · simple · placeholder slot -->
          <li class="media-tile reveal" data-category="skilling">
            <span class="media-tile__badge">Skilling</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Vocational training center"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <span class="img-slot media-tile__slot" data-ratio="4/3" role="img" aria-label="Photo coming soon: vocational training center"><span class="img-slot__label">Vocational training center</span></span>
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Vocational training center</button>
              <span class="media-tile__desc">Building skills for better livelihoods</span>
            </span>
          </li>

          <!-- 5 · environment · simple · real photo -->
          <li class="media-tile reveal" data-category="environment">
            <span class="media-tile__badge">Environment</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Environmental restoration"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <img class="media-tile__img" src="https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456725/coodu-trust/images/programs/program-environment.jpg" alt="Green landscape restored through Coodu Trust environmental work" loading="lazy">
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Environmental restoration</button>
              <span class="media-tile__desc">Restoring degraded ecosystems for sustainability</span>
            </span>
          </li>

          <!-- 6 · environment · simple · placeholder slot -->
          <li class="media-tile reveal" data-category="environment">
            <span class="media-tile__badge">Environment</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Water conservation"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <span class="img-slot media-tile__slot" data-ratio="4/3" role="img" aria-label="Photo coming soon: water conservation"><span class="img-slot__label">Water conservation</span></span>
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Water conservation</button>
              <span class="media-tile__desc">Implementing sustainable water management systems</span>
            </span>
          </li>

          <!-- 7 · health · RICH · real photo -->
          <li class="media-tile reveal" data-category="health"
              data-title="Mobile Health Camp Initiative"
              data-location="Theni District, Tamil Nadu"
              data-date="February 2024"
              data-impact="1,500+ people served"
              data-story="Our mobile health camps bring essential medical services directly to remote villages. Each camp provides general health checkups, vaccinations, maternal health services, and health education. We've established regular monthly visits to 15 villages, significantly reducing child mortality and improving overall community health."
              data-tags="Healthcare Access, Mobile Clinics, Preventive Care, Community Health">
            <span class="media-tile__badge">Health</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Community health camp"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <img class="media-tile__img" src="https://res.cloudinary.com/dvxbg6to3/image/upload/v1754456724/coodu-trust/images/programs/health-sanitation.jpg" alt="Children washing hands at a Coodu Trust community health initiative" loading="lazy">
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Community health camp</button>
              <span class="media-tile__desc">Providing healthcare access to remote communities</span>
            </span>
          </li>

          <!-- 8 · health · simple · placeholder slot -->
          <li class="media-tile reveal" data-category="health">
            <span class="media-tile__badge">Health</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Clean water initiative"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <span class="img-slot media-tile__slot" data-ratio="4/3" role="img" aria-label="Photo coming soon: clean water initiative"><span class="img-slot__label">Clean water initiative</span></span>
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Clean water initiative</button>
              <span class="media-tile__desc">Installing clean water systems in villages</span>
            </span>
          </li>

          <!-- 9 · health · simple · placeholder slot -->
          <li class="media-tile reveal" data-category="health">
            <span class="media-tile__badge">Health</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Health awareness session"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <span class="img-slot media-tile__slot" data-ratio="4/3" role="img" aria-label="Photo coming soon: health awareness session"><span class="img-slot__label">Health awareness session</span></span>
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Health awareness session</button>
              <span class="media-tile__desc">Educating communities about health and hygiene</span>
            </span>
          </li>

          <!-- 10 · community · simple · placeholder slot -->
          <li class="media-tile reveal" data-category="community">
            <span class="media-tile__badge">Community</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Infrastructure development"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <span class="img-slot media-tile__slot" data-ratio="4/3" role="img" aria-label="Photo coming soon: infrastructure development"><span class="img-slot__label">Infrastructure development</span></span>
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Infrastructure development</button>
              <span class="media-tile__desc">Building essential community infrastructure</span>
            </span>
          </li>

          <!-- 11 · community · simple · placeholder slot -->
          <li class="media-tile reveal" data-category="community">
            <span class="media-tile__badge">Community</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Community mobilization"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <span class="img-slot media-tile__slot" data-ratio="4/3" role="img" aria-label="Photo coming soon: community mobilization"><span class="img-slot__label">Community mobilization</span></span>
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Community mobilization</button>
              <span class="media-tile__desc">Empowering communities for self-governance</span>
            </span>
          </li>

          <!-- 12 · recognition · simple · real photo · CAPTION PENDING USER VERIFICATION -->
          <li class="media-tile reveal" data-category="recognition">
            <span class="media-tile__badge">Recognition</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Meeting Dr. A.P.J. Abdul Kalam"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <img class="media-tile__img" src="assets/images/gallery/apj/abj-1.jpg" alt="Coodu Trust representative shaking hands with Dr. A.P.J. Abdul Kalam" loading="lazy">
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Meeting Dr. A.P.J. Abdul Kalam</button>
              <span class="media-tile__desc">A proud moment for Coodu Trust</span>
            </span>
          </li>

          <!-- 13 · recognition · simple · real photo · CAPTION PENDING USER VERIFICATION -->
          <li class="media-tile reveal" data-category="recognition">
            <span class="media-tile__badge">Recognition</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: District Collector's visit"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <img class="media-tile__img" src="assets/images/gallery/ias/ias-1.jpg" alt="Dr. P. Senthilkumar IAS, Collector of Dindigul, viewing the Coodu Trust exhibition" loading="lazy">
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">District Collector's visit</button>
              <span class="media-tile__desc">Dr. P. Senthilkumar IAS, Collector of Dindigul, at our work exhibition</span>
            </span>
          </li>

          <!-- 14 · recognition · simple · real photo · CAPTION PENDING USER VERIFICATION -->
          <li class="media-tile reveal" data-category="recognition">
            <span class="media-tile__badge">Recognition</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Exhibition of our field work"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <img class="media-tile__img" src="assets/images/gallery/ias/ias-8.jpg" alt="Visitors at an exhibition of Coodu Trust's field work" loading="lazy">
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Exhibition of our field work</button>
              <span class="media-tile__desc">Officials and community members viewing our program displays</span>
            </span>
          </li>

          <!-- 15 · recognition · simple · real photo · CAPTION PENDING USER VERIFICATION -->
          <li class="media-tile reveal" data-category="recognition">
            <span class="media-tile__badge">Recognition</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Human-rights training programme"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <img class="media-tile__img" src="assets/images/gallery/nhrc/nhrc-1.jpg" alt="Participants at a human-rights training programme in Dindigul" loading="lazy">
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Human-rights training programme</button>
              <span class="media-tile__desc">Training session on human rights held in Dindigul</span>
            </span>
          </li>

          <!-- 16 · recognition · simple · real photo · CAPTION PENDING USER VERIFICATION -->
          <li class="media-tile reveal" data-category="recognition">
            <span class="media-tile__badge">Recognition</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: With Anna Hazare"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <img class="media-tile__img" src="assets/images/gallery/socialactivist/social-1.jpg" alt="Coodu Trust members with social activist Anna Hazare" loading="lazy">
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">With Anna Hazare</button>
              <span class="media-tile__desc">Coodu Trust members with the veteran social activist</span>
            </span>
          </li>

          <!-- 17 · recognition · simple · real photo · CAPTION PENDING USER VERIFICATION -->
          <li class="media-tile reveal" data-category="recognition">
            <span class="media-tile__badge">Recognition</span>
            <button class="media-tile__open" type="button" aria-label="Open photo story: Community leaders gathering"><i data-lucide="maximize-2" aria-hidden="true"></i></button>
            <img class="media-tile__img" src="assets/images/gallery/socialactivist/social-3.jpg" alt="Coodu Trust members at a gathering with social activists" loading="lazy">
            <span class="media-tile__caption">
              <button class="media-tile__title" type="button">Community leaders gathering</button>
              <span class="media-tile__desc">With social activists working for rural communities</span>
            </span>
          </li>

        </ul>

        <p class="media-empty" hidden>
          <i data-lucide="image-off" aria-hidden="true"></i>
          <span>No photos in this category yet.</span>
        </p>
      </div>
    </section>

    <!-- ================= IN THE NEWS ================= -->
    <section class="section section--alt media-press" aria-labelledby="media-press-title">
      <div class="container">
        <div class="section-head reveal">
          <p class="eyebrow">Press</p>
          <h2 id="media-press-title">In the news</h2>
        </div>
        <ul class="media-press__grid">
          <li class="media-press__card reveal">
            <span class="img-slot" data-ratio="16/9" role="img" aria-label="Press clipping coming soon: The Hindu"><span class="img-slot__label">The Hindu clipping</span></span>
            <div class="media-press__body">
              <p class="media-press__outlet"><i data-lucide="newspaper" aria-hidden="true"></i>The Hindu</p>
              <h3 class="media-press__headline">Reforestation drive transforms barren hills</h3>
            </div>
          </li>
          <li class="media-press__card reveal">
            <span class="img-slot" data-ratio="16/9" role="img" aria-label="Press clipping coming soon: Times of India"><span class="img-slot__label">Times of India clipping</span></span>
            <div class="media-press__body">
              <p class="media-press__outlet"><i data-lucide="newspaper" aria-hidden="true"></i>Times of India</p>
              <h3 class="media-press__headline">Women empowerment through skill development</h3>
            </div>
          </li>
          <li class="media-press__card reveal">
            <span class="img-slot" data-ratio="16/9" role="img" aria-label="Press clipping coming soon: Ananda Vikatan"><span class="img-slot__label">Ananda Vikatan clipping</span></span>
            <div class="media-press__body">
              <p class="media-press__outlet"><i data-lucide="newspaper" aria-hidden="true"></i>Ananda Vikatan</p>
              <h3 class="media-press__headline">From beneficiaries to leaders: inspiring stories</h3>
            </div>
          </li>
        </ul>
      </div>
    </section>

  </main>

  <!-- ======= CHROME (paste footer copied from index.html here) ======= -->

  <script src="https://unpkg.com/lucide@latest" defer></script>
  <script src="assets/js/coodu.js?v=5" defer></script>
</body>
</html>
```

- [ ] **Step 3: Write `assets/css/coodu-media.css`** (complete file, verbatim)

```css
/* ==========================================================================
   COODU TRUST — Media page styles (media.html only)
   Layers: hero, gallery filter + grid + tiles, press cards, lightbox.
   Tokens only; media queries at 600 / 900 / 1200.
   ========================================================================== */

/* ---- Hero ---------------------------------------------------------------- */
.media-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  min-height: clamp(320px, 44vh, 420px);
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
  background-image: url('https://res.cloudinary.com/dvxbg6to3/image/upload/v1754474804/coodu-trust/images/headers/media-bg.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  transform-origin: center;
}

.media-hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(13, 46, 22, .5) 0%, rgba(11, 38, 20, .72) 100%);
}

.media-hero .container {
  position: relative;
  z-index: 2;
}

.media-hero__content {
  max-width: var(--maxw-text);
  margin-inline: auto;
  padding-block: clamp(var(--s5), 8vw, var(--s7));
  text-align: center;
}

.media-hero__title {
  margin: var(--s2) 0 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h1);
  line-height: 1.08;
  color: var(--color-on-dark);
}

.media-hero__sub {
  max-width: 520px;
  margin: var(--s2) auto 0;
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--on-dark-80);
}

@media (prefers-reduced-motion: no-preference) {
  .media-hero__photo {
    animation: media-hero-zoom 22s ease-in-out infinite alternate;
  }
  @keyframes media-hero-zoom {
    from { transform: scale(1); }
    to   { transform: scale(1.09); }
  }
}

/* ---- Filter bar ----------------------------------------------------------- */
.media-filter {
  display: flex;
  flex-direction: column;
  gap: var(--s2);
  margin-top: clamp(var(--s4), 4vw, var(--s5));
}

.media-chips {
  display: flex;
  gap: var(--s1);
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  padding-bottom: 4px;
}

.media-chip {
  flex: 0 0 auto;
  min-height: 44px;
  padding: var(--s1) var(--s2);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--fs-small);
  color: var(--text-body);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  cursor: pointer;
}

.media-chip:hover {
  border-color: var(--color-primary);
}

.media-chip.is-active {
  color: var(--color-on-dark);
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.media-count {
  margin: 0;
  font-size: var(--fs-small);
  font-weight: 600;
  color: var(--text-muted);
}

@media (min-width: 600px) {
  .media-chips {
    flex-wrap: wrap;
    overflow-x: visible;
    padding-bottom: 0;
  }
  .media-chip {
    min-height: 38px;
  }
}

@media (min-width: 900px) {
  .media-filter {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--s2);
  }
  .media-count {
    white-space: nowrap;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .media-chip {
    transition: background-color var(--ease), color var(--ease), border-color var(--ease);
  }
}

/* ---- Gallery grid + tiles -------------------------------------------------- */
.media-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(var(--s2), 2vw, var(--s3));
  margin: clamp(var(--s3), 3vw, var(--s4)) 0 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 600px) {
  .media-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1200px) {
  .media-grid { grid-template-columns: repeat(3, 1fr); }
}

.media-tile {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-frame);
  overflow: hidden;
  background: var(--surface-alt);
  box-shadow: var(--shadow-1);
}

.media-tile__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center;
}

.media-tile__slot {
  position: absolute;
  inset: 0;
  aspect-ratio: auto;
  border-radius: 0;
}

.media-tile__badge {
  position: absolute;
  top: 11px;
  left: 11px;
  z-index: 3;
  padding: 5px 10px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-micro);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-primary-dark);
  background: var(--on-dark-80);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-1);
}

.media-tile__open {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 4;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--color-on-dark);
}

.media-tile__open::before {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: var(--radius-pill);
  background: rgba(15, 40, 22, .55);
}

.media-tile__open i,
.media-tile__open svg {
  position: relative;
  z-index: 1;
  width: 18px;
  height: 18px;
}

.media-tile__open:hover::before {
  background: rgba(15, 40, 22, .8);
}

.media-tile__caption {
  position: absolute;
  inset: auto 0 0 0;
  z-index: 2;
  display: block;
  padding: var(--s4) var(--s2) var(--s2);
  background: linear-gradient(to top, rgba(8, 26, 14, .82) 0%, rgba(8, 26, 14, .45) 55%, rgba(8, 26, 14, 0) 100%);
  color: var(--color-on-dark);
}

.media-tile__title {
  display: block;
  padding: 0;
  border: 0;
  background: none;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h3);
  line-height: 1.15;
  color: var(--color-on-dark);
  text-align: left;
  cursor: pointer;
}

.media-tile__desc {
  display: block;
  margin-top: 4px;
  font-family: var(--font-body);
  font-size: var(--fs-small);
  line-height: 1.45;
  color: var(--on-dark-80);
}

@media (prefers-reduced-motion: no-preference) {
  .media-tile__img {
    transition: transform 500ms var(--ease-fn);
  }
  .media-tile:hover .media-tile__img {
    transform: scale(1.05);
  }
  .media-tile__open::before {
    transition: background-color var(--ease), transform var(--ease);
  }
  .media-tile__open:hover::before {
    transform: scale(1.08);
  }
  .media-tile--pop {
    animation: media-tile-in 450ms var(--ease-fn) both;
  }
  @keyframes media-tile-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
}

/* ---- Empty state ----------------------------------------------------------- */
.media-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s2);
  margin: var(--s6) 0;
  color: var(--text-muted);
  text-align: center;
}

.media-empty[hidden] {
  display: none;
}

.media-empty i,
.media-empty svg {
  width: 40px;
  height: 40px;
  opacity: .5;
}

/* ---- Press cards ------------------------------------------------------------ */
.media-press__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(var(--s2), 2vw, var(--s3));
  margin: clamp(var(--s4), 4vw, var(--s5)) 0 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 600px) {
  .media-press__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1200px) {
  .media-press__grid { grid-template-columns: repeat(3, 1fr); }
}

.media-press__card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-1);
}

.media-press__card .img-slot {
  border-radius: 0;
  border-bottom: 1px solid var(--border-soft);
}

.media-press__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: clamp(var(--s3), 2.2vw, var(--s4));
}

.media-press__outlet {
  display: inline-flex;
  align-items: center;
  gap: var(--s1);
  margin: 0;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-micro);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-primary);
}

.media-press__outlet i,
.media-press__outlet svg {
  width: 16px;
  height: 16px;
}

.media-press__headline {
  margin: var(--s2) 0 0;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: var(--fs-h3);
  line-height: 1.25;
  color: var(--text-strong);
}

@media (prefers-reduced-motion: no-preference) {
  .media-press__card {
    transition: transform 280ms var(--ease-fn), box-shadow 280ms var(--ease-fn), border-color 280ms var(--ease-fn);
  }
  .media-press__card:hover {
    transform: translateY(-6px);
    border-color: var(--border);
    box-shadow: var(--shadow-2);
  }
}
```

- [ ] **Step 4: Render and verify the static page**

```bash
cd <SCRATCHPAD> && node cdp-shot.mjs "http://localhost:8767/media.html" t1-media-1440 1440 slices 1 4000 && node cdp-shot.mjs "http://localhost:8767/media.html" t1-media-834 834 slices 1 4000 && node cdp-shot.mjs "http://localhost:8767/media.html" t1-media-390 390 slices 1 4000 && node cdp-act.mjs "http://localhost:8767/media.html" 1440 -- "eval:document.querySelectorAll('.media-tile').length" "eval:document.querySelectorAll('.media-tile__img').length" "eval:document.querySelectorAll('.nav__link.is-active')[0]?.textContent.trim()" "eval:!!document.querySelector('.media-lightbox')" "wait:300"
```
Expected: screenshots produced; evals return `17`, `10` (4 Cloudinary program photos + 6 local recognition photos), `"Media"`, `false` (no lightbox yet); `FAILED-REQUESTS []` (empty — proves all 6 local gallery paths + 5 Cloudinary URLs resolve). READ the 1440 screenshots and confirm: hero (photo + scrim + centered text), 3-col grid, chips row with count, press band with 3 branded cards, correct header/footer. 390: 1-col grid, chips scroll row.

- [ ] **Step 5: Commit**

```bash
cd /Users/jagathguru/Documents/PROJECTS/COODU_TRUST && git add media.html assets/css/coodu-media.css && git commit -m "Rebuild Media page static markup + styles on the design system

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: `assets/js/coodu-media.js` — filtering, live count, stagger

**Files:**
- Create: `assets/js/coodu-media.js`
- Modify: `media.html` (add one script tag)

**Interfaces:**
- Consumes: Task 1 DOM contract (`.media-chip[data-filter]`, `.media-count`, `.media-grid`, `.media-tile[data-category]`, `.media-empty`).
- Produces: global `window.cooduMedia = { visibleTiles(): HTMLElement[], filterLabel(): string }` — Task 3's lightbox builds its nav list from `visibleTiles()`. Filtering hides tiles via the `hidden` attribute.

- [ ] **Step 1: Create `assets/js/coodu-media.js`** (complete file, verbatim)

```js
/* ==========================================================================
   COODU TRUST — Media page behavior (media.html only)
   1. Category filter chips -> show/hide tiles, aria-pressed, re-stagger.
   2. Live result count (aria-live).
   Exposes window.cooduMedia for the lightbox module (same file, part 3).
   ========================================================================== */
(function () {
  'use strict';

  var chips = Array.prototype.slice.call(document.querySelectorAll('.media-chip'));
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.media-tile'));
  var countEl = document.querySelector('.media-count');
  var emptyEl = document.querySelector('.media-empty');
  if (!chips.length || !tiles.length || !countEl) return;

  var motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  var current = 'all';

  function labelFor(filter) {
    for (var i = 0; i < chips.length; i++) {
      if (chips[i].getAttribute('data-filter') === filter) return chips[i].textContent.trim();
    }
    return '';
  }

  function visibleTiles() {
    return tiles.filter(function (t) { return !t.hidden; });
  }

  function applyFilter(filter) {
    current = filter;
    var shown = 0;
    tiles.forEach(function (tile, i) {
      var match = filter === 'all' || tile.getAttribute('data-category') === filter;
      tile.hidden = !match;
      tile.classList.remove('media-tile--pop');
      if (match) {
        shown++;
        if (motionOK) {
          tile.style.animationDelay = (shown * 45) + 'ms';
          // restart the entry animation
          void tile.offsetWidth;
          tile.classList.add('media-tile--pop');
        }
      }
    });

    chips.forEach(function (chip) {
      var active = chip.getAttribute('data-filter') === filter;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    countEl.textContent = filter === 'all'
      ? 'Showing ' + shown + ' photos'
      : 'Showing ' + shown + ' in ' + labelFor(filter);

    if (emptyEl) emptyEl.hidden = shown !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      applyFilter(chip.getAttribute('data-filter'));
    });
  });

  window.cooduMedia = {
    visibleTiles: visibleTiles,
    filterLabel: function () { return current === 'all' ? '' : labelFor(current); }
  };
})();
```

- [ ] **Step 2: Wire the script into `media.html`**

In `media.html`, change:
```html
  <script src="assets/js/coodu.js?v=5" defer></script>
```
to:
```html
  <script src="assets/js/coodu.js?v=5" defer></script>
  <script src="assets/js/coodu-media.js?v=1" defer></script>
```

- [ ] **Step 3: Verify filtering headlessly**

```bash
cd <SCRATCHPAD> && node cdp-act.mjs "http://localhost:8767/media.html" 1440 -- "eval:document.querySelectorAll('.media-tile:not([hidden])').length" "click:.media-chip[data-filter='health']" "wait:400" "eval:document.querySelectorAll('.media-tile:not([hidden])').length" "eval:document.querySelector('.media-count').textContent" "eval:document.querySelector(\".media-chip[data-filter='health']\").getAttribute('aria-pressed')" "shot:t2-filter-health.png" "click:.media-chip[data-filter='recognition']" "wait:400" "eval:document.querySelectorAll('.media-tile:not([hidden])').length" "eval:document.querySelector('.media-count').textContent" "shot:t2-filter-recognition.png" "click:.media-chip[data-filter='all']" "wait:400" "eval:document.querySelectorAll('.media-tile:not([hidden])').length"
```
Expected values in order: `17`, then `3`, `"Showing 3 in Health & Sanitation"`, `"true"`, then `6`, `"Showing 6 in Milestones & Recognition"`, then `17`. `CONSOLE-ERRORS []`. READ both screenshots: health shows 3 tiles, recognition shows the 6 real event photos.

- [ ] **Step 4: Commit**

```bash
cd /Users/jagathguru/Documents/PROJECTS/COODU_TRUST && git add media.html assets/js/coodu-media.js && git commit -m "Add Media gallery category filtering with live count

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Lightbox — markup, styles, behavior

**Files:**
- Modify: `media.html` (add dialog markup before the scripts)
- Modify: `assets/css/coodu-media.css` (append lightbox styles)
- Modify: `assets/js/coodu-media.js` (append lightbox module)

**Interfaces:**
- Consumes: `window.cooduMedia.visibleTiles()` from Task 2; tile `data-*` attributes and `.media-tile__open` / `.media-tile__title` buttons from Task 1.
- Produces: nothing consumed later. Behavior contract: opens on tile button click; nav list = currently filtered tiles, wraps; Esc/←/→ keys; focus trap; body scroll lock; focus restored to the opening button on close.

- [ ] **Step 1: Add lightbox markup to `media.html`**

Insert immediately BEFORE `<script src="https://unpkg.com/lucide@latest" defer></script>`:

```html
  <!-- ================= LIGHTBOX ================= -->
  <div class="media-lightbox" hidden>
    <div class="media-lightbox__backdrop" data-lb-close></div>
    <div class="media-lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="lb-title">
      <button class="media-lightbox__close" type="button" data-lb-close aria-label="Close photo story"><i data-lucide="x" aria-hidden="true"></i></button>
      <div class="media-lightbox__photo">
        <img class="media-lightbox__img" src="" alt="" hidden>
        <span class="media-lightbox__fallback" hidden>
          <i data-lucide="image" aria-hidden="true"></i>
          <span>Photo coming soon</span>
        </span>
        <button class="media-lightbox__navbtn media-lightbox__navbtn--prev" type="button" data-lb-prev aria-label="Previous photo"><i data-lucide="chevron-left" aria-hidden="true"></i></button>
        <button class="media-lightbox__navbtn media-lightbox__navbtn--next" type="button" data-lb-next aria-label="Next photo"><i data-lucide="chevron-right" aria-hidden="true"></i></button>
      </div>
      <div class="media-lightbox__content">
        <p class="media-lightbox__badge"></p>
        <h3 class="media-lightbox__title" id="lb-title"></h3>
        <p class="media-lightbox__desc"></p>
        <div class="media-lightbox__rich" hidden>
          <dl class="media-lightbox__stats">
            <div class="media-lightbox__stat"><dt>Location</dt><dd data-lb-location></dd></div>
            <div class="media-lightbox__stat"><dt>Date</dt><dd data-lb-date></dd></div>
            <div class="media-lightbox__stat"><dt>Impact</dt><dd data-lb-impact class="is-impact"></dd></div>
          </dl>
          <p class="media-lightbox__storyhead">The story behind</p>
          <p class="media-lightbox__story"></p>
          <ul class="media-lightbox__tags"></ul>
        </div>
        <div class="media-lightbox__footer">
          <p class="media-lightbox__pos"></p>
          <div class="media-lightbox__btns">
            <button class="media-lightbox__btn media-lightbox__btn--prev" type="button" data-lb-prev><i data-lucide="arrow-left" aria-hidden="true"></i><span>Previous</span></button>
            <button class="media-lightbox__btn media-lightbox__btn--next" type="button" data-lb-next><span>Next</span><i data-lucide="arrow-right" aria-hidden="true"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
```

- [ ] **Step 2: Append lightbox styles to `assets/css/coodu-media.css`** (verbatim)

```css
/* ---- Lightbox ---------------------------------------------------------------- */
.media-lightbox {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(12px, 3vw, 40px);
}

.media-lightbox[hidden] {
  display: none;
}

.media-lightbox__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(9, 24, 14, .72);
  backdrop-filter: blur(6px);
}

.media-lightbox__dialog {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(1100px, 94vw);
  max-height: 90vh;
  background: var(--surface);
  border-radius: var(--radius-frame);
  overflow: hidden;
  box-shadow: var(--shadow-menu);
}

.media-lightbox__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 6;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-pill);
  background: rgba(15, 40, 22, .55);
  color: var(--color-on-dark);
  cursor: pointer;
}

.media-lightbox__close:hover {
  background: rgba(15, 40, 22, .85);
}

.media-lightbox__close i,
.media-lightbox__close svg {
  width: 20px;
  height: 20px;
}

.media-lightbox__photo {
  position: relative;
  flex: 0 0 auto;
  min-height: 220px;
  aspect-ratio: 4 / 3;
  background: var(--color-dark-menu);
}

.media-lightbox__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-lightbox__fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--s1);
  color: var(--on-dark-60);
  font-size: var(--fs-small);
}

.media-lightbox__fallback i,
.media-lightbox__fallback svg {
  width: 36px;
  height: 36px;
  opacity: .6;
}

.media-lightbox__navbtn {
  position: absolute;
  top: 50%;
  z-index: 5;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--on-dark-80);
  color: var(--text-strong);
  box-shadow: var(--shadow-float);
  cursor: pointer;
  transform: translateY(-50%);
}

.media-lightbox__navbtn--prev { left: 12px; }
.media-lightbox__navbtn--next { right: 12px; }

.media-lightbox__navbtn:hover {
  background: var(--surface);
}

.media-lightbox__navbtn i,
.media-lightbox__navbtn svg {
  width: 22px;
  height: 22px;
}

.media-lightbox__content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: clamp(var(--s3), 3vw, var(--s5));
}

.media-lightbox__badge {
  display: inline-block;
  margin: 0;
  padding: 5px 11px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-micro);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-primary-dark);
  background: var(--surface-tint);
  border-radius: var(--radius-pill);
}

.media-lightbox__title {
  margin: var(--s2) 0 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h2);
  line-height: 1.14;
  color: var(--text-strong);
}

.media-lightbox__desc {
  margin: var(--s2) 0 0;
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--text-body);
}

.media-lightbox__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s2);
  margin: var(--s3) 0 0;
  padding: var(--s2) 0;
  border-top: 1px solid var(--border-soft);
  border-bottom: 1px solid var(--border-soft);
}

.media-lightbox__stat dt {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--fs-micro);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--text-muted);
}

.media-lightbox__stat dd {
  margin: 4px 0 0;
  font-weight: 600;
  font-size: var(--fs-small);
  color: var(--text-strong);
}

.media-lightbox__stat dd.is-impact {
  color: var(--color-primary);
}

.media-lightbox__storyhead {
  margin: var(--s3) 0 0;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--fs-eyebrow);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-primary-dark);
}

.media-lightbox__story {
  margin: var(--s2) 0 0;
  font-size: var(--fs-small);
  line-height: 1.72;
  color: var(--text-body);
}

.media-lightbox__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s1);
  margin: var(--s3) 0 0;
  padding: 0;
  list-style: none;
}

.media-lightbox__tags li {
  padding: 6px 12px;
  font-size: var(--fs-micro);
  font-weight: 600;
  color: var(--text-body);
  background: var(--surface-tint);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
}

.media-lightbox__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s2);
  margin-top: var(--s3);
}

.media-lightbox__pos {
  margin: 0;
  font-size: var(--fs-small);
  color: var(--text-muted);
}

.media-lightbox__btns {
  display: flex;
  gap: var(--s1);
}

.media-lightbox__btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 44px;
  padding: var(--s1) var(--s2);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--fs-small);
  border-radius: var(--radius-btn);
  cursor: pointer;
}

.media-lightbox__btn i,
.media-lightbox__btn svg {
  width: 16px;
  height: 16px;
}

.media-lightbox__btn--prev {
  color: var(--text-body);
  background: var(--surface);
  border: 1px solid var(--border);
}

.media-lightbox__btn--prev:hover {
  color: var(--color-primary-dark);
  border-color: var(--color-primary);
}

.media-lightbox__btn--next {
  color: var(--color-on-dark);
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.media-lightbox__btn--next:hover {
  background: var(--color-primary-dark);
}

@media (min-width: 900px) {
  .media-lightbox__dialog {
    flex-direction: row;
  }
  .media-lightbox__photo {
    flex: 0 0 58%;
    aspect-ratio: auto;
    min-height: 420px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .media-lightbox:not([hidden]) .media-lightbox__backdrop {
    animation: media-lb-fade 250ms ease both;
  }
  .media-lightbox:not([hidden]) .media-lightbox__dialog {
    animation: media-lb-pop 300ms var(--ease-fn) both;
  }
  @keyframes media-lb-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes media-lb-pop {
    from { opacity: 0; transform: scale(.96) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .media-lightbox__close {
    transition: background-color var(--ease), transform var(--ease);
  }
  .media-lightbox__close:hover {
    transform: rotate(90deg);
  }
  .media-lightbox__navbtn {
    transition: background-color var(--ease), transform var(--ease);
  }
  .media-lightbox__navbtn:hover {
    transform: translateY(-50%) scale(1.08);
  }
}
```

- [ ] **Step 3: Append the lightbox module to `assets/js/coodu-media.js`** (verbatim, after the existing IIFE)

```js
/* ---- Lightbox module --------------------------------------------------- */
(function () {
  'use strict';

  var root = document.querySelector('.media-lightbox');
  if (!root || !window.cooduMedia) return;

  var dialog = root.querySelector('.media-lightbox__dialog');
  var img = root.querySelector('.media-lightbox__img');
  var fallback = root.querySelector('.media-lightbox__fallback');
  var badge = root.querySelector('.media-lightbox__badge');
  var title = root.querySelector('.media-lightbox__title');
  var desc = root.querySelector('.media-lightbox__desc');
  var rich = root.querySelector('.media-lightbox__rich');
  var story = root.querySelector('.media-lightbox__story');
  var tags = root.querySelector('.media-lightbox__tags');
  var pos = root.querySelector('.media-lightbox__pos');
  var locEl = root.querySelector('[data-lb-location]');
  var dateEl = root.querySelector('[data-lb-date]');
  var impactEl = root.querySelector('[data-lb-impact]');

  var list = [];
  var index = 0;
  var lastFocus = null;

  function text(tile, sel) {
    var el = tile.querySelector(sel);
    return el ? el.textContent.trim() : '';
  }

  function render() {
    var tile = list[index];
    if (!tile) return;

    var tileImg = tile.querySelector('.media-tile__img');
    if (tileImg) {
      img.src = tileImg.getAttribute('src');
      img.alt = tileImg.getAttribute('alt') || '';
      img.hidden = false;
      fallback.hidden = true;
    } else {
      img.hidden = true;
      img.src = '';
      fallback.hidden = false;
    }

    badge.textContent = text(tile, '.media-tile__badge');
    title.textContent = tile.getAttribute('data-title') || text(tile, '.media-tile__title');
    desc.textContent = text(tile, '.media-tile__desc');

    var storyText = tile.getAttribute('data-story');
    if (storyText) {
      locEl.textContent = tile.getAttribute('data-location') || '';
      dateEl.textContent = tile.getAttribute('data-date') || '';
      impactEl.textContent = tile.getAttribute('data-impact') || '';
      story.textContent = storyText;
      tags.innerHTML = '';
      (tile.getAttribute('data-tags') || '').split(',').forEach(function (t) {
        t = t.trim();
        if (!t) return;
        var li = document.createElement('li');
        li.textContent = t;
        tags.appendChild(li);
      });
      rich.hidden = false;
    } else {
      rich.hidden = true;
    }

    pos.textContent = (index + 1) + ' / ' + list.length;
  }

  function lockScroll(on) {
    document.body.style.overflow = on ? 'hidden' : '';
    document.documentElement.style.overflow = on ? 'hidden' : '';
  }

  function open(tile) {
    list = window.cooduMedia.visibleTiles();
    index = Math.max(0, list.indexOf(tile));
    lastFocus = document.activeElement;
    render();
    root.hidden = false;
    lockScroll(true);
    root.querySelector('.media-lightbox__close').focus();
    document.addEventListener('keydown', onKey);
  }

  function close() {
    root.hidden = true;
    lockScroll(false);
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(dir) {
    if (!list.length) return;
    index = (index + dir + list.length) % list.length;
    render();
  }

  function onKey(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowRight') { step(1); return; }
    if (e.key === 'ArrowLeft') { step(-1); return; }
    if (e.key === 'Tab') {
      // focus trap
      var focusables = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  document.querySelectorAll('.media-tile__open, .media-tile__title').forEach(function (btn) {
    btn.addEventListener('click', function () {
      open(btn.closest('.media-tile'));
    });
  });

  root.querySelectorAll('[data-lb-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });
  root.querySelectorAll('[data-lb-prev]').forEach(function (el) {
    el.addEventListener('click', function () { step(-1); });
  });
  root.querySelectorAll('[data-lb-next]').forEach(function (el) {
    el.addEventListener('click', function () { step(1); });
  });
})();
```

- [ ] **Step 4: Bump the page-asset cache-busters**

In `media.html` `<head>` and scripts, change `coodu-media.css?v=1` → `coodu-media.css?v=2` and `coodu-media.js?v=1` → `coodu-media.js?v=2`.

- [ ] **Step 5: Verify lightbox headlessly (desktop + mobile + keyboard)**

```bash
cd <SCRATCHPAD> && node cdp-act.mjs "http://localhost:8767/media.html" 1440 -- "click:.media-tile[data-category='agriculture'] .media-tile__open" "wait:500" "eval:!document.querySelector('.media-lightbox').hidden" "eval:document.querySelector('.media-lightbox__title').textContent" "eval:!document.querySelector('.media-lightbox__rich').hidden" "eval:document.querySelector('.media-lightbox__pos').textContent" "eval:getComputedStyle(document.body).overflow" "shot:t3-lb-rich-1440.png" "key:ArrowRight" "wait:300" "eval:document.querySelector('.media-lightbox__pos').textContent" "key:Escape" "wait:300" "eval:document.querySelector('.media-lightbox').hidden" "eval:getComputedStyle(document.body).overflow" && node cdp-act.mjs "http://localhost:8767/media.html" 390 -- "click:.media-chip[data-filter='recognition']" "wait:400" "click:.media-tile[data-category='recognition'] .media-tile__open" "wait:500" "eval:document.querySelector('.media-lightbox__pos').textContent" "eval:document.querySelector('.media-lightbox__rich').hidden" "shot:t3-lb-simple-390.png"
```
Expected first run: `true`, `"Watershed Development Project"`, `true` (rich visible), `"1 / 17"`, `"hidden"`, then `"2 / 17"`, then `true` (closed), `"visible"` (or empty string — scroll restored). Second run: `"1 / 6"` (nav list = filtered recognition set), `true` (rich hidden — simple lightbox). `CONSOLE-ERRORS []` both runs. READ both screenshots: desktop = side-by-side photo/story with stats row; mobile = stacked sheet.

- [ ] **Step 6: Commit**

```bash
cd /Users/jagathguru/Documents/PROJECTS/COODU_TRUST && git add media.html assets/css/coodu-media.css assets/js/coodu-media.js && git commit -m "Add Media photo-story lightbox with filtered navigation and focus trap

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Integrated verification matrix + recognition-photo contact sheet

**Files:**
- Create: `<SCRATCHPAD>/contact-sheet.html` (throwaway, scratchpad only)
- Possibly modify: `media.html`, `assets/css/coodu-media.css` (only if defects found; bump `?v=` on any change)

**Interfaces:**
- Consumes: everything from Tasks 1–3.
- Produces: the final screenshot set for orchestrator + user review at `<SCRATCHPAD>/final-*.png`, and a contact sheet of all 24 gallery photos for curation swaps.

- [ ] **Step 1: Full render matrix**

```bash
cd <SCRATCHPAD> && node cdp-shot.mjs "http://localhost:8767/media.html" final-1440 1440 slices 1 4500 && node cdp-shot.mjs "http://localhost:8767/media.html" final-834 834 slices 1 4500 && node cdp-shot.mjs "http://localhost:8767/media.html" final-390 390 slices 1 4500
```
Expected: three slice sets. READ every slice and check against the design export renders (hero, chips, grid columns 3/2/1, captions, press band, footer).

- [ ] **Step 2: State shots — filters, lightbox, drawer, reduced-motion**

```bash
cd <SCRATCHPAD> && node cdp-act.mjs "http://localhost:8767/media.html" 1440 -- "click:.media-chip[data-filter='environment']" "wait:500" "shot:final-filter-environment.png" && node cdp-act.mjs "http://localhost:8767/media.html" 390 -- "click:.hamburger" "wait:600" "shot:final-drawer-390.png" && node cdp-act.mjs "http://localhost:8767/media.html" 1440 reduce -- "eval:getComputedStyle(document.querySelector('.media-hero__photo')).animationName" "click:.media-tile[data-category='skilling'] .media-tile__open" "wait:400" "shot:final-reduced-lb.png" "key:Escape" "wait:200" "eval:document.querySelector('.media-lightbox').hidden"
```
Expected: reduced-motion eval returns `"none"` (hero zoom disabled) and the lightbox still opens/closes (`true` at the end) — function without motion. READ the screenshots.

- [ ] **Step 3: Full-page console/network audit**

```bash
cd <SCRATCHPAD> && node cdp-act.mjs "http://localhost:8767/media.html" 1440 -- "eval:window.scrollTo(0,document.body.scrollHeight)" "wait:2500" "eval:'scrolled'"
```
Expected: `CONSOLE-ERRORS []` and `FAILED-REQUESTS []`.

- [ ] **Step 4: Contact sheet of all 24 gallery photos (for curation swap decisions)**

Write `<SCRATCHPAD>/contact-sheet.html`:

```html
<!doctype html>
<meta charset="utf-8">
<title>Gallery contact sheet</title>
<body style="margin:16px;font-family:sans-serif">
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
<script>
  var files = [];
  ['apj/abj-1.jpg','apj/apj-2.jpg','apj/apj-3.jpg','apj/apj-4.jpg'].forEach(function(f){files.push(f)});
  for (var i=1;i<=15;i++) files.push('ias/ias-'+i+'.jpg');
  files.push('nhrc/nhrc-1.jpg','nhrc/nhrc-2.jpg');
  files.push('socialactivist/social-1.jpg','socialactivist/social-2.jpg','socialactivist/social-3.jpg');
  files.forEach(function(f){
    document.write('<figure style="margin:0"><img src="http://localhost:8767/assets/images/gallery/'+f+'" style="width:100%;aspect-ratio:4/3;object-fit:cover"><figcaption style="font-size:11px">'+f+'</figcaption></figure>');
  });
</script>
</div>
```

Then:
```bash
cd <SCRATCHPAD> && node cdp-shot.mjs "file://<SCRATCHPAD>/contact-sheet.html" contact-sheet 1600 full 1 3500
```
READ `contact-sheet-full.png`. If any of the 6 chosen recognition photos is clearly weaker (blurry, duplicate scene, burned-in caption text that clashes) than an unchosen one from the same folder, swap the `src` in `media.html` (keep captions/alt consistent with the new photo's content), re-render the recognition filter state, and note the swap for the user. Keep ≥1 photo per folder and 6 tiles total.

- [ ] **Step 5: Fix any defects found, bump `?v=`, re-verify, commit**

If Steps 1–4 surfaced defects (overlaps, contrast, broken layout at any width, console errors): fix in `media.html` / `coodu-media.css` / `coodu-media.js`, bump the changed files' `?v=`, re-run the failing check until clean, then:

```bash
cd /Users/jagathguru/Documents/PROJECTS/COODU_TRUST && git add media.html assets/css/coodu-media.css assets/js/coodu-media.js && git commit -m "Polish Media page after full-matrix visual verification

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
(Skip the commit if nothing changed.)

---

## Post-plan gates (orchestrator, not subagent)

1. Orchestrator reads the final screenshot set multimodally against the design export; dispatches an independent review agent (spec + screenshots + code diff).
2. Present renders to the USER: overall look at 3 widths + recognition captions listed verbatim for word-by-word verification (spec §2.4). Recognition captions are DRAFTS until the user confirms.
3. Only after user approval: done (user pushes/merges on their own schedule; 3 earlier commits on this branch are also still unpushed).
