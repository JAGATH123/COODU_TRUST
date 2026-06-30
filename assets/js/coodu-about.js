/* ==========================================================================
   COODU Trust — About page scroll interactivity
   Vanilla JS, no dependencies, IIFE, runs on DOMContentLoaded.

   ONLY About-specific behaviour — the shared drawer, mega menus, .counter
   count-up, .reveal IntersectionObserver, dot cursor and header
   scroll-progress all live in coodu.js and MUST NOT be duplicated here.

   Features
   1. Timeline draw — [data-timeline]: grows .timeline__progress (the green
      centre fill) from the top as the viewport centre travels the timeline,
      lighting each .timeline__dot (.is-active) and revealing each
      .timeline__item (.is-in) sequentially.
   2. Hero parallax — [data-parallax]: a subtle translate on scroll, fine
      pointer + no-reduced-motion only.
   3. prefers-reduced-motion: reduce -> timeline filled, every item/dot
      revealed at once, no parallax.

   Everything degrades gracefully if the elements are absent.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------ helpers ------------------------------ */
  var mqMatch = function (q) {
    return !!(window.matchMedia && window.matchMedia(q).matches);
  };
  var prefersReduced = function () {
    return mqMatch('(prefers-reduced-motion: reduce)');
  };
  var pointerFine = function () {
    return mqMatch('(hover: hover) and (pointer: fine)');
  };
  var clamp01 = function (v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  };
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }
  function safe(name, fn) {
    try { fn(); } catch (err) {
      if (window.console && console.warn) console.warn('[coodu-about] ' + name + ' failed:', err);
    }
  }

  /* rAF-throttled scroll/resize binder — coalesces bursts into one frame.
     Returns an update() you can call directly (e.g. on init / resize). */
  function rafScroll(update) {
    var ticking = false;
    var run = function () { ticking = false; update(); };
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(run);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return update;
  }

  /* ============================ 1. TIMELINE ========================== */
  function initTimeline() {
    var timeline = document.querySelector('[data-timeline]');
    if (!timeline) return;

    var progress = timeline.querySelector('.timeline__progress');
    var items = Array.prototype.slice.call(
      timeline.querySelectorAll('.timeline__item')
    );

    /* reveal-all helper used for reduced-motion and as a safe fallback */
    function revealAll() {
      if (progress) {
        progress.style.height = '100%';
        progress.style.transform = '';
      }
      items.forEach(function (item) {
        item.classList.add('is-in');
        var dot = item.querySelector('.timeline__dot');
        if (dot) dot.classList.add('is-active');
      });
    }

    if (prefersReduced() || !window.requestAnimationFrame) {
      revealAll();
      return;
    }

    var update = function () {
      var rect = timeline.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var centre = vh / 2;

      /* progress = how far the viewport centre has travelled from the
         timeline top to its bottom, clamped 0..1 */
      var span = rect.height || 1;
      var p = clamp01((centre - rect.top) / span);

      if (progress) progress.style.height = (p * 100).toFixed(2) + '%';

      /* light each item once the fill has reached its dot (its centre) */
      items.forEach(function (item) {
        var iRect = item.getBoundingClientRect();
        var iCentre = (iRect.top + iRect.bottom) / 2;
        var reached = iCentre <= centre;
        item.classList.toggle('is-in', reached);
        var dot = item.querySelector('.timeline__dot');
        if (dot) dot.classList.toggle('is-active', reached);
      });
    };

    rafScroll(update)();

    /* if reduced-motion is toggled on later, snap to the full state */
    var rmq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (rmq) {
      var onRM = function () { if (rmq.matches) revealAll(); };
      if (rmq.addEventListener) rmq.addEventListener('change', onRM);
      else if (rmq.addListener) rmq.addListener(onRM);
    }
  }

  /* ============================ 2. PARALLAX ========================= */
  function initParallax() {
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll('[data-parallax]')
    );
    if (!nodes.length) return;
    if (prefersReduced() || !pointerFine() || !window.requestAnimationFrame) return;

    var MAX = 40; /* px — small, ~6-10% of a tall hero */

    var update = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      nodes.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        /* only move while the element is near/within the viewport */
        if (rect.bottom < 0 || rect.top > vh) return;
        /* -1 (just below viewport) .. 1 (just above) relative to centre */
        var rel = (rect.top + rect.height / 2 - vh / 2) / (vh + rect.height);
        var shift = (-rel * MAX).toFixed(1);
        el.style.backgroundPosition = 'center calc(50% + ' + shift + 'px)';
      });
    };

    rafScroll(update)();
  }

  /* Partners marquee: clone the track once for a seamless -50% loop, then
     enable the CSS animation. Reduced-motion -> leave it as a static row. */
  function initPartnersMarquee() {
    var marquee = document.querySelector('[data-marquee]');
    if (!marquee || prefersReduced()) return;
    var track = marquee.querySelector('.partners__track');
    if (!track || !track.children.length) return;
    Array.prototype.slice.call(track.children).forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    marquee.classList.add('is-animating');
  }

  /* ============================== BOOT ============================== */
  ready(function () {
    safe('timeline', initTimeline);
    safe('parallax', initParallax);
    safe('partners', initPartnersMarquee);
  });
})();
