/* ==========================================================================
   COODU — "Our reach" (About page)
   Two flat INDIA MAPS (Dindigul + Tamil Nadu) flanking a centre comparison
   chart of real NFHS-5 (2019–21) data.

   1) MAPS  — an SVG India map (d3.geoMercator), drawn from a slimmed
      district GeoJSON (assets/data/india-districts.min.json). All of India
      is drawn faint, state by state; the home region is filled in the side's
      brand colour with a soft glow underneath:
        • LEFT  (amber)  — Dindigul DISTRICT, inside a lightly-tinted Tamil Nadu
        • RIGHT (green)  — the whole of TAMIL NADU
      "A little interactive": hover any state to highlight it + see its name.
      Lazy-loaded as the section nears the viewport; honors
      prefers-reduced-motion (no transitions); falls back to a clean mark if
      d3 / the map can't load.
   2) COMPARE — builds one row per indicator into [data-reach-compare],
      animates the dots/connecting lines in when scrolled into view
      (IntersectionObserver, once, staggered). Hover/focus emphasises a row
      and reveals the two exact values + the gap. Reduced motion -> instant.

   Each feature inits independently and is wrapped in try/catch; every
   feature returns early if its elements are missing.
   ========================================================================== */
(function () {
  'use strict';

  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var SVGNS = 'http://www.w3.org/2000/svg';
  var GEO_URL = 'assets/data/india-districts.min.json';   // {s: state, d: district}

  /* ---- verified data (do NOT change — NFHS-5 2019–21, MoHFW / IIPS) ---- */
  var INDICATORS = [
    { key: 'water', label: 'Improved drinking water',  a: 99.5, b: 98.6 },
    { key: 'sanit', label: 'Improved sanitation',      a: 61.0, b: 72.6 },
    { key: 'fuel',  label: 'Clean cooking fuel',       a: 76.3, b: 82.9 },
    { key: 'power', label: 'Electricity',              a: 98.8, b: 99.3 },
    { key: 'lit',   label: 'Women literate (15–49)', a: 78.2, b: 84.0 },
    { key: 'birth', label: 'Institutional births',     a: 97.0, b: 99.6 },
    { key: 'vacc',  label: 'Children fully vaccinated', a: 92.6, b: 89.2 }
  ];

  var REGION_A = 'Dindigul';
  var REGION_B = 'Tamil Nadu';
  var HOME_STATE = 'Tamil Nadu';

  function svgEl(name, attrs) {
    var e = document.createElementNS(SVGNS, name);
    if (attrs) for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    return e;
  }
  function hexToRgba(hex, a) {
    hex = (hex || '').replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(hex, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* ======================================================================
     PART 1 — flat India maps
     ====================================================================== */

  var SIZE = 540, PAD = 26;
  var BASE_FILL = 'rgba(30,126,52,0.05)';
  var BASE_STROKE = 'rgba(17,55,27,0.16)';
  var _uid = 0;

  // shared GeoJSON (slimmed India districts), fetched once
  var _geoPromise = null;
  function loadIndia() {
    if (_geoPromise) return _geoPromise;
    _geoPromise = fetch(GEO_URL)
      .then(function (r) { if (!r.ok) throw new Error('bad status ' + r.status); return r.json(); })
      .catch(function () { return null; });
    return _geoPromise;
  }

  function injectFallback(host, opt) {
    if (host.__reachMap) return;
    host.__reachMap = true;
    if (window.console && console.warn) console.warn('[coodu-reach] India map data unavailable — showing placeholder.');
    var svg = svgEl('svg', { viewBox: '0 0 ' + SIZE + ' ' + SIZE, 'class': 'globe-svg is-error' });
    svg.appendChild(svgEl('rect', {
      x: PAD, y: PAD, width: SIZE - 2 * PAD, height: SIZE - 2 * PAD, rx: 18,
      fill: 'rgba(30,126,52,0.05)', stroke: 'rgba(17,55,27,0.30)', 'stroke-width': 1
    }));
    svg.appendChild(svgEl('circle', { cx: SIZE / 2 + 24, cy: SIZE / 2, r: 12, fill: opt.accent }));
    host.appendChild(svg);
  }

  function startMap(host, opt) {
    if (host.__reachMap) return;

    loadIndia().then(function (geo) {
      var d3 = window.d3;
      if (!geo || !geo.features || !d3 || !d3.geoMercator) { injectFallback(host, opt); return; }
      if (host.__reachMap) return;
      host.__reachMap = true;

      var feats = geo.features;
      var projection = d3.geoMercator().fitExtent([[PAD, PAD], [SIZE - PAD, SIZE - PAD]], geo);
      var geoPath = d3.geoPath(projection);

      // group districts by state
      var byState = {};
      feats.forEach(function (f) {
        var s = f.properties.s || '—';
        (byState[s] = byState[s] || []).push(f);
      });

      var id = 'reachMap' + (++_uid), blurId = id + '-blur';
      var svg = svgEl('svg', { viewBox: '0 0 ' + SIZE + ' ' + SIZE, 'class': 'globe-svg' });
      if (!REDUCE) svg.classList.add('is-live');

      var defs = svgEl('defs');
      var filter = svgEl('filter', { id: blurId, x: '-40%', y: '-40%', width: '180%', height: '180%' });
      filter.appendChild(svgEl('feGaussianBlur', { stdDeviation: '5' }));
      defs.appendChild(filter);
      svg.appendChild(defs);

      // tooltip (state name on hover)
      var tip = document.createElement('span');
      tip.className = 'reach__maptip';
      tip.setAttribute('aria-hidden', 'true');

      var hoverFill = hexToRgba(opt.accent, 0.20);
      var hoverStroke = hexToRgba(opt.accent, 0.70);
      var districtMode = (opt.highlight === 'district');

      // base state shapes (one combined path per state)
      Object.keys(byState).forEach(function (s) {
        var fc = { type: 'FeatureCollection', features: byState[s] };
        var d = geoPath(fc) || '';
        if (!d) return;
        var homeTint = districtMode && s === opt.state;   // tint the state that holds Dindigul
        var baseFill = homeTint ? hexToRgba(opt.accent, 0.10) : BASE_FILL;
        var baseStroke = homeTint ? hexToRgba(opt.accent, 0.45) : BASE_STROKE;
        var baseW = homeTint ? '0.7' : '0.4';
        var p = svgEl('path', {
          d: d, fill: baseFill, stroke: baseStroke, 'stroke-width': baseW,
          'stroke-linejoin': 'round', 'class': 'reach-state', 'data-state': s
        });
        // hover: brighten this state + show its name
        p.addEventListener('pointerenter', function () {
          p.setAttribute('fill', hoverFill);
          p.setAttribute('stroke', hoverStroke);
          p.setAttribute('stroke-width', '0.8');
          tip.textContent = s;
          tip.classList.add('is-on');
        });
        p.addEventListener('pointerleave', function () {
          p.setAttribute('fill', baseFill);
          p.setAttribute('stroke', baseStroke);
          p.setAttribute('stroke-width', baseW);
          tip.classList.remove('is-on');
        });
        svg.appendChild(p);
      });

      // home highlight (Dindigul district, or whole Tamil Nadu) + soft glow
      var hiFC = districtMode
        ? { type: 'FeatureCollection', features: feats.filter(function (f) { return f.properties.d === opt.target; }) }
        : { type: 'FeatureCollection', features: byState[opt.state] || [] };
      var hd = geoPath(hiFC) || '';
      if (hd) {
        var glow = svgEl('path', { d: hd, fill: opt.accent, opacity: 0.42, filter: 'url(#' + blurId + ')', 'pointer-events': 'none' });
        var hi = svgEl('path', {
          d: hd, fill: opt.accent, 'fill-opacity': 0.88,
          stroke: opt.accentStroke, 'stroke-width': districtMode ? '0.8' : '0',
          'stroke-linejoin': 'round', 'pointer-events': 'none'
        });
        svg.appendChild(glow);
        svg.appendChild(hi);
      }

      host.appendChild(svg);
      host.appendChild(tip);
    });
  }

  function initMaps() {
    var a = document.querySelector('[data-reach-globe="a"]');
    var b = document.querySelector('[data-reach-globe="b"]');
    // Dindigul = amber district; Tamil Nadu = brand-green state.
    var optA = { accent: '#f4a300', accentStroke: '#b45309', highlight: 'district', target: 'Dindigul', state: HOME_STATE };
    var optB = { accent: '#1e7e34', accentStroke: '#11371b', highlight: 'state', state: HOME_STATE };
    function go() { if (a) startMap(a, optA); if (b) startMap(b, optB); }

    // lazy: only fetch + build when the section nears the viewport
    var section = document.getElementById('reach');
    if (section && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) { if (e.isIntersecting) { obs.disconnect(); go(); } });
      }, { rootMargin: '600px' });
      io.observe(section);
    } else { go(); }
  }

  /* ======================================================================
     PART 2 — comparison chart
     ====================================================================== */

  function fmt(v) { return (Math.round(v * 10) / 10).toFixed(1); }

  function buildCompare() {
    var host = document.querySelector('[data-reach-compare]');
    if (!host) return;
    if (host.__cooduReachBuilt) return;
    host.__cooduReachBuilt = true;

    // header row naming the two sides
    var head = document.createElement('div');
    head.className = 'reach__compare-head';
    head.setAttribute('aria-hidden', 'true');
    head.innerHTML = '<span>' + REGION_A + '</span><span>' + REGION_B + '</span>';
    host.appendChild(head);

    var rows = [];
    INDICATORS.forEach(function (ind) {
      var aLead = ind.a > ind.b;
      var bLead = ind.b > ind.a;
      var gap = Math.abs(ind.a - ind.b);
      var lo = Math.min(ind.a, ind.b);

      var row = document.createElement('div');
      row.className = 'comparison-row';
      row.setAttribute('tabindex', '0');
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label',
        ind.label + ': ' + REGION_A + ' ' + fmt(ind.a) + ' percent, ' +
        REGION_B + ' ' + fmt(ind.b) + ' percent.');

      var lineClass = aLead ? 'line line--a-lead' : (bLead ? 'line line--b-lead' : 'line');
      var gapText = gap < 0.05
        ? REGION_A + ' ' + fmt(ind.a) + '% · ' + REGION_B + ' ' + fmt(ind.b) + '% · level'
        : REGION_A + ' ' + fmt(ind.a) + '% vs ' + REGION_B + ' ' + fmt(ind.b) +
          '% · gap ' + fmt(gap) + ' pts · ' +
          (aLead ? REGION_A : REGION_B) + ' ahead';

      row.innerHTML =
        '<span class="comparison-row__label">' + ind.label + '</span>' +
        '<div class="comparison-row__values">' +
          '<span class="comparison-row__val--a">' + fmt(ind.a) + '%</span>' +
          '<span class="comparison-row__val--b">' + fmt(ind.b) + '%</span>' +
        '</div>' +
        '<div class="comparison-row__track">' +
          '<span class="track"></span>' +
          '<span class="' + lineClass + '" style="left:' + lo + '%;width:' + gap + '%"></span>' +
          '<span class="dot dot--a" style="left:' + ind.a + '%"></span>' +
          '<span class="dot dot--b" style="left:' + ind.b + '%"></span>' +
        '</div>' +
        '<span class="comparison-row__gap">' + gapText + '</span>';

      host.appendChild(row);
      rows.push(row);
    });

    // reveal: reduced motion -> instant; else stagger when scrolled into view
    if (REDUCE || !('IntersectionObserver' in window)) {
      rows.forEach(function (r) { r.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        rows.forEach(function (r, i) {
          setTimeout(function () { r.classList.add('is-in'); }, i * 90);
        });
      });
    }, { threshold: 0.18 });

    var section = document.getElementById('reach') || host;
    io.observe(section);
  }

  /* ======================================================================
     boot
     ====================================================================== */
  function start() {
    try { initMaps(); } catch (e) { /* maps optional */ }
    try { buildCompare(); } catch (e) { /* chart optional */ }
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
