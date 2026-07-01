/* ==========================================================================
   COODU Trust — REPORT VIEWER behaviour (page 2)
   Reads ?year= , finds the report in window.COODU_REPORTS, renders its PDF with
   PDF.js (left) and its impact summary / highlights / stats (right), plus
   report-to-report navigation and download / print / share. Reduced-motion safe.
   ========================================================================== */
(function () {
  'use strict';

  var REPORTS = window.COODU_REPORTS || [];
  if (!REPORTS.length) return;

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var year = new URLSearchParams(location.search).get('year');
  var idx = REPORTS.findIndex(function (r) { return String(r.year) === String(year); });
  if (idx < 0) idx = 0;
  var r = REPORTS[idx];
  var pdfUrl = encodeURI(r.pdf);

  /* ---- title bar + summary ---- */
  document.title = 'Annual Report ' + r.label + ' | Coodu Trust';
  $('rv-bar-year').textContent = r.label;
  $('rv-year').textContent = r.label;
  $('rv-subtitle').textContent = r.title;
  $('rv-summary').textContent = r.summary || '';

  $('rv-stats').innerHTML = (r.stats || []).map(function (s) {
    return '<div class="rv-stat"><span class="rv-stat__num">' + esc(s.number) + '</span><span class="rv-stat__label">' + esc(s.label) + '</span></div>';
  }).join('');

  $('rv-highlights').innerHTML = (r.highlights || []).map(function (h) {
    return '<li><i data-lucide="check"></i><span>' + esc(h) + '</span></li>';
  }).join('');

  /* ---- download / open ---- */
  var dl = $('rv-download');
  dl.href = pdfUrl;
  dl.setAttribute('download', 'Coodu-Trust-Annual-Report-' + r.label.replace(/[^0-9]+/g, '-').replace(/^-|-$/g, '') + '.pdf');
  $('rv-error-dl').href = pdfUrl;

  /* ---- report-to-report nav (REPORTS is newest-first) ---- */
  var older = REPORTS[idx + 1];   // back in time
  var newer = REPORTS[idx - 1];   // forward in time
  var prevBtn = $('rv-prev-report'), nextBtn = $('rv-next-report');
  if (older) { prevBtn.href = 'report-viewer.html?year=' + encodeURIComponent(older.year); prevBtn.querySelector('span').textContent = older.label; }
  else { prevBtn.hidden = true; }
  if (newer) { nextBtn.href = 'report-viewer.html?year=' + encodeURIComponent(newer.year); nextBtn.querySelector('span').textContent = newer.label; }
  else { nextBtn.hidden = true; }

  /* ---- print / share ---- */
  $('rv-print').addEventListener('click', function () { window.open(pdfUrl, '_blank', 'noopener'); });
  $('rv-share').addEventListener('click', function () {
    var data = { title: 'Coodu Trust — Annual Report ' + r.label, url: location.href };
    if (navigator.share) { navigator.share(data).catch(function () {}); }
    else if (navigator.clipboard) {
      navigator.clipboard.writeText(location.href).then(function () {
        var b = $('rv-share'); b.classList.add('is-copied');
        setTimeout(function () { b.classList.remove('is-copied'); }, 1600);
      }).catch(function () {});
    }
  });

  if (window.lucide) window.lucide.createIcons();

  /* ====================================================== PDF.js render === */
  var loading = $('rv-loading'), canvas = $('rv-canvas'), errEl = $('rv-error'), wrap = $('rv-canvas-wrap');
  function showError() { if (loading) loading.hidden = true; if (canvas) canvas.hidden = true; if (errEl) errEl.hidden = false; if (window.lucide) window.lucide.createIcons(); }
  if (!window.pdfjsLib) { showError(); return; }

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var ctx = canvas.getContext('2d');
  var pdfDoc = null, pageNum = 1, baseScale = 1, zoom = 1, rendering = false, pending = null;

  pdfjsLib.getDocument(pdfUrl).promise.then(function (doc) {
    pdfDoc = doc;
    $('rv-pages').textContent = doc.numPages;
    loading.hidden = true; canvas.hidden = false;
    fitAndRender();
  }).catch(showError);

  function fitAndRender() {
    pdfDoc.getPage(pageNum).then(function (page) {
      var unscaled = page.getViewport({ scale: 1 });
      var avail = (wrap.clientWidth || 600) - 40;
      baseScale = Math.max(0.3, Math.min(2.2, avail / unscaled.width));
      renderPage(pageNum);
    });
  }

  function renderPage(n) {
    if (!pdfDoc) return;
    rendering = true;
    $('rv-page').textContent = n;
    $('rv-zoom').textContent = Math.round(zoom * 100) + '%';
    $('rv-prev-page').disabled = (n <= 1);
    $('rv-next-page').disabled = (n >= pdfDoc.numPages);
    pdfDoc.getPage(n).then(function (page) {
      var vp = page.getViewport({ scale: baseScale * zoom });
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(vp.width * dpr);
      canvas.height = Math.floor(vp.height * dpr);
      canvas.style.width = Math.floor(vp.width) + 'px';
      canvas.style.height = Math.floor(vp.height) + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      page.render({ canvasContext: ctx, viewport: vp }).promise.then(function () {
        rendering = false;
        if (pending !== null) { var p = pending; pending = null; renderPage(p); }
      });
    });
  }
  function queueRender(n) { if (rendering) pending = n; else renderPage(n); }

  $('rv-prev-page').addEventListener('click', function () { if (pageNum > 1) { pageNum--; wrap.scrollTop = 0; queueRender(pageNum); } });
  $('rv-next-page').addEventListener('click', function () { if (pdfDoc && pageNum < pdfDoc.numPages) { pageNum++; wrap.scrollTop = 0; queueRender(pageNum); } });
  $('rv-zoom-in').addEventListener('click', function () { zoom = Math.min(3, Math.round((zoom + 0.2) * 10) / 10); queueRender(pageNum); });
  $('rv-zoom-out').addEventListener('click', function () { zoom = Math.max(0.4, Math.round((zoom - 0.2) * 10) / 10); queueRender(pageNum); });

  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (pdfDoc) { zoom = 1; fitAndRender(); } }, 200); });
})();
