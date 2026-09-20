/* ==========================================================================
   COODU Trust — LEGAL pages (Privacy · Terms · Refund)
   Single job: highlight the in-page contents link for the section you're on.
   Shared coodu.js handles drawer, .reveal, footer year.
   No-ops on pages without a [data-legal-toc]. Reduced-motion safe (no motion).
   ========================================================================== */
(function () {
  'use strict';

  var toc = document.querySelector('[data-legal-toc]');
  if (!toc || !('IntersectionObserver' in window)) return;

  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  var byId = {};
  var sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var sec = id && document.getElementById(id);
    if (!sec) return;
    byId[id] = a;
    sections.push(sec);
  });
  if (!sections.length) return;

  var current = null;
  function setCurrent(a) {
    if (a === current) return;
    if (current) current.classList.remove('is-current');
    if (a) a.classList.add('is-current');
    current = a;
  }

  /* Track which sections are in view; the topmost one wins. Offset the top of
     the root margin by the sticky header + policy switcher so a section counts
     as "current" only once it clears the chrome. */
  var visible = [];
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var i = visible.indexOf(en.target);
      if (en.isIntersecting && i < 0) visible.push(en.target);
      else if (!en.isIntersecting && i > -1) visible.splice(i, 1);
    });

    if (visible.length) {
      visible.sort(function (a, b) { return a.offsetTop - b.offsetTop; });
      setCurrent(byId[visible[0].id]);
      return;
    }

    /* Nothing intersecting (a section taller than the viewport, or we're past
       the last one) — fall back to the last section above the fold. */
    var above = null;
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top < 140) above = s;
    });
    if (above) setCurrent(byId[above.id]);
  }, { rootMargin: '-140px 0px -60% 0px', threshold: 0 });

  sections.forEach(function (s) { io.observe(s); });
})();
