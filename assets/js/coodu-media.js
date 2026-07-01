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
