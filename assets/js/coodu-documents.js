/* ==========================================================================
   COODU Trust — DOCUMENTS listing
   Builds period-grouped report cards from window.COODU_REPORTS, with filter
   pills (All / 2020s / 2010s / 2000s) and live search. Shared coodu.js handles
   header/drawer/reveal/counter. Reduced-motion safe (CSS).
   ========================================================================== */
(function () {
  'use strict';

  var grid = document.querySelector('[data-docs-grid]');
  var reports = window.COODU_REPORTS;
  if (!grid || !reports || !reports.length) return;

  var DECADES = ['2020s', '2010s', '2000s'];
  var DECADE_LABEL = { '2020s': '2020 – 2024', '2010s': '2010 – 2019', '2000s': '2001 – 2009' };

  function decadeOf(year) { return (Math.floor(Number(year) / 10) * 10) + 's'; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function cardHTML(r, isLatest) {
    var stat = (r.stats && r.stats[0]) || null;
    var search = (r.label + ' ' + r.title + ' ' + r.year + ' ' + (r.highlights || []).join(' ')).toLowerCase();
    var href = 'report-viewer.html?year=' + encodeURIComponent(r.year);
    return '<article class="report-card" data-decade="' + decadeOf(r.year) + '" data-search="' + esc(search) + '">' +
      '<a class="report-card__cover" href="' + href + '" aria-label="View the ' + esc(r.label) + ' annual report">' +
        '<img src="' + esc(r.cover) + '" alt="Cover of the ' + esc(r.label) + ' annual report" loading="lazy" width="300" height="396">' +
        (isLatest ? '<span class="report-card__badge">Latest</span>' : '') +
      '</a>' +
      '<div class="report-card__body">' +
        '<span class="report-card__year">' + esc(r.label) + '</span>' +
        '<h3 class="report-card__title"><a href="' + href + '">' + esc(r.title) + '</a></h3>' +
        (stat ? '<p class="report-card__stat"><strong>' + esc(stat.number) + '</strong> ' + esc(stat.label) + '</p>' : '') +
        '<div class="report-card__actions">' +
          '<a class="btn btn--primary btn--sm" href="' + href + '">View report</a>' +
          '<a class="report-card__pdf" href="' + encodeURI(r.pdf) + '" target="_blank" rel="noopener" aria-label="Download the ' + esc(r.label) + ' PDF"><i data-lucide="download"></i> PDF</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /* ---- build period groups ---- */
  var html = '';
  DECADES.forEach(function (dec) {
    var list = reports.filter(function (r) { return decadeOf(r.year) === dec; });
    if (!list.length) return;
    html += '<div class="docs__group" data-decade="' + dec + '">' +
      '<div class="docs__group-head">' +
        '<h2 class="docs__group-title">' + (DECADE_LABEL[dec] || dec) + '</h2>' +
        '<span class="docs__group-count">' + list.length + ' report' + (list.length > 1 ? 's' : '') + '</span>' +
        '<span class="docs__group-rule" aria-hidden="true"></span>' +
      '</div>' +
      '<div class="docs__grid">' +
        list.map(function (r) { return cardHTML(r, r.year === reports[0].year); }).join('') +
      '</div>' +
    '</div>';
  });
  grid.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  /* per-period counts on the filter pills */
  var countByDecade = { all: reports.length };
  DECADES.forEach(function (d) { countByDecade[d] = reports.filter(function (r) { return decadeOf(r.year) === d; }).length; });
  Object.keys(countByDecade).forEach(function (k) { var n = document.querySelector('[data-count="' + k + '"]'); if (n) n.textContent = countByDecade[k]; });

  /* ---- filter + search ---- */
  var groups = Array.prototype.slice.call(grid.querySelectorAll('.docs__group'));
  var pills = Array.prototype.slice.call(document.querySelectorAll('.filter-pill'));
  var search = document.getElementById('docs-search');
  var empty = document.querySelector('[data-docs-empty]');
  var countEl = document.querySelector('[data-docs-count]');
  var state = { filter: 'all', q: '' };

  function apply() {
    var visible = 0;
    groups.forEach(function (g) {
      var decadeOk = state.filter === 'all' || state.filter === g.getAttribute('data-decade');
      var groupVisible = false;
      Array.prototype.slice.call(g.querySelectorAll('.report-card')).forEach(function (c) {
        var match = decadeOk && (state.q === '' || c.getAttribute('data-search').indexOf(state.q) >= 0);
        c.hidden = !match;
        if (match) { groupVisible = true; visible++; }
      });
      g.hidden = !groupVisible;
    });
    if (empty) empty.hidden = visible > 0;
    if (countEl) {
      if (state.q) countEl.innerHTML = '<strong>' + visible + '</strong> result' + (visible === 1 ? '' : 's') + ' for &ldquo;' + esc(state.q) + '&rdquo;';
      else if (state.filter === 'all') countEl.innerHTML = 'Showing all <strong>' + visible + '</strong> annual reports';
      else countEl.innerHTML = 'Showing <strong>' + visible + '</strong> reports from the ' + state.filter;
    }
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      state.filter = pill.getAttribute('data-filter');
      pills.forEach(function (p) {
        var on = p === pill;
        p.classList.toggle('is-active', on);
        p.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      apply();
    });
  });

  if (search) {
    search.addEventListener('input', function () { state.q = search.value.trim().toLowerCase(); apply(); });
  }
  var resetBtn = document.querySelector('[data-docs-reset]');
  if (resetBtn) resetBtn.addEventListener('click', function () { if (search) search.value = ''; state.q = ''; apply(); if (search) search.focus(); });

  apply();   // set the initial results count
})();
