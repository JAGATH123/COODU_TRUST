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

  var motionMQ = window.matchMedia('(prefers-reduced-motion: no-preference)');
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
    tiles.forEach(function (tile) {
      var match = filter === 'all' || tile.getAttribute('data-category') === filter;
      tile.hidden = !match;
      tile.classList.remove('media-tile--pop');
      if (match) {
        shown++;
        if (motionMQ.matches) {
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
      ? 'Showing ' + shown + (shown === 1 ? ' photo' : ' photos')
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
