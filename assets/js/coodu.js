/* ==========================================================================
   COODU Trust — interaction + motion layer
   Vanilla JS, no dependencies (Lucide is optional / guarded).

   Features
   1. Mobile drawer        — [data-drawer-open] / [data-drawer-close] + backdrop
                             + Esc, focus-trap, inert background, scroll-lock,
                             aria-expanded.
   2. Drawer accordions    — .acc__trigger toggles .acc (.acc__panel height),
                             aria-expanded, one-open-at-a-time per group.
   3. Desktop mega menus   — .has-mega > button, click + keyboard-focus toggle,
                             aria-expanded / aria-controls, Esc + outside-click
                             close, hover-open on fine-pointer devices.
   4. Carousel             — [data-carousel] prev / next / dots / swipe, looping,
                             optional pause-able autoplay.
   5. Count-up counters    — .counter[data-target], IntersectionObserver trigger,
                             comma / Indian grouping, reduced-motion = static.
   6. Reveal on scroll     — .reveal -> .is-in once, IntersectionObserver.
   7. Lucide icons         — lucide.createIcons() (guarded).
   8. Footer year          — [data-year] -> current year.

   Everything degrades gracefully and honours prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  /* Mark that JS is live — CSS uses .coodu-js to gate the reveal hidden-state
     (so no-JS visitors always see content) and to disable the no-JS mega
     hover-fallback. Set as early as possible. */
  document.documentElement.classList.add('coodu-js');

  /* Header: leaf at the very top, leaf-on-light once scrolled, plus a green
     scroll-progress line on the bottom edge of the bar. */
  (function () {
    var siteHeader = document.querySelector('.site-header');
    if (!siteHeader) return;
    var bar = siteHeader.querySelector('.scroll-progress');
    var update = function () {
      var y = window.scrollY || window.pageYOffset || 0;
      siteHeader.classList.toggle('is-scrolled', y > 8);
      if (bar) {
        var max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
        bar.style.setProperty('--scroll', Math.min(1, Math.max(0, y / max)).toFixed(4));
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  })();

  /* Custom dot cursor — a precise dot + a trailing ring that grows over
     interactive elements. Mouse devices only; never touch/keyboard/reduced-motion. */
  (function () {
    if (!window.matchMedia) return;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    if (!fine || !motionOk) return;

    var wrap = document.createElement('div');
    wrap.className = 'coodu-cursor';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = '<span class="coodu-cursor__ring"></span><span class="coodu-cursor__dot"></span>';
    document.body.appendChild(wrap);
    document.body.classList.add('coodu-has-cursor');

    var dot = wrap.firstChild.nextSibling;   // the dot
    var ring = wrap.firstChild;              // the ring
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, raf = 0;
    var place = function (el, x, y) { el.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)'; };
    var loop = function () {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      place(ring, rx, ry);
      if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) { raf = requestAnimationFrame(loop); } else { raf = 0; }
    };
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY; place(dot, mx, my);
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    var hoverSel = 'a, button, [role="button"], input, textarea, select, label, summary, .card, [data-drawer-open], [data-drawer-close]';
    document.addEventListener('mouseover', function (e) { if (e.target.closest && e.target.closest(hoverSel)) wrap.classList.add('is-hover'); }, { passive: true });
    document.addEventListener('mouseout', function (e) { if (e.target.closest && e.target.closest(hoverSel)) wrap.classList.remove('is-hover'); }, { passive: true });
    document.addEventListener('mousedown', function () { wrap.classList.add('is-down'); }, { passive: true });
    document.addEventListener('mouseup', function () { wrap.classList.remove('is-down'); }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { wrap.style.opacity = '0'; });
    document.documentElement.addEventListener('mouseenter', function () { wrap.style.opacity = '1'; });
  })();

  /* ------------------------------ helpers ------------------------------ */
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var FOCUSABLE = [
    'a[href]', 'area[href]', 'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
    'textarea:not([disabled])', 'summary', 'iframe', 'audio[controls]',
    'video[controls]', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  var reduceMQ = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false, addEventListener: function () {}, addListener: function () {} };
  function prefersReduced() { return !!reduceMQ.matches; }

  var canHover = window.matchMedia
    ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
    : false;

  var supportsInert = ('inert' in HTMLElement.prototype);

  function onMediaChange(mq, fn) {
    if (!mq) return;
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn); /* legacy Safari */
  }

  function isVisible(el) {
    return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
  }

  function uid(prefix) {
    return (prefix || 'id') + '-' + Math.random().toString(36).slice(2, 8);
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  /* run an init safely — a failure in one feature must not kill the rest */
  function safe(name, fn) {
    try { fn(); } catch (err) {
      if (window.console && console.warn) console.warn('[coodu] ' + name + ' failed:', err);
    }
  }

  /* ============================ 1. DRAWER ============================ */
  function initDrawer() {
    var drawer = $('.drawer');
    if (!drawer) return;

    var panel    = $('.drawer__panel', drawer) || drawer;
    var backdrop = $('.drawer__backdrop', drawer);
    var openers  = $$('[data-drawer-open]');

    if (!drawer.id) drawer.id = 'mobile-drawer';
    drawer.setAttribute('role', drawer.getAttribute('role') || 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    if (!drawer.getAttribute('aria-label') && !drawer.getAttribute('aria-labelledby')) {
      drawer.setAttribute('aria-label', 'Site menu');
    }
    if (backdrop) {
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.setAttribute('tabindex', '-1');
    }

    var lastFocused = null;
    var inerted = [];

    function focusables() {
      return $$(FOCUSABLE, panel).filter(isVisible);
    }

    function setPanelHidden(hidden) {
      if (supportsInert) {
        try { panel.inert = hidden; } catch (e) {}
      } else {
        /* no-inert fallback: pull focusables out of the tab order */
        $$(FOCUSABLE, panel).forEach(function (el) {
          if (hidden) el.setAttribute('tabindex', '-1');
          else el.removeAttribute('tabindex');
        });
      }
      if (hidden) panel.setAttribute('aria-hidden', 'true');
      else panel.removeAttribute('aria-hidden');
    }

    function setBackgroundInert(on) {
      if (on) {
        inerted = [];
        $$('body > *').forEach(function (el) {
          if (el === drawer) return;
          var tag = el.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'TEMPLATE' || tag === 'NOSCRIPT') return;
          inerted.push([el, el.hasAttribute('aria-hidden'), el.inert]);
          try { el.inert = true; } catch (e) {}
          el.setAttribute('aria-hidden', 'true');
        });
      } else {
        inerted.forEach(function (rec) {
          var el = rec[0], hadAria = rec[1], prevInert = rec[2];
          try { el.inert = prevInert; } catch (e) {}
          if (!hadAria) el.removeAttribute('aria-hidden');
        });
        inerted = [];
      }
    }

    function lockScroll(on) {
      var html = document.documentElement;
      if (on) {
        var sw = window.innerWidth - html.clientWidth;
        if (sw > 0) document.body.style.paddingRight = sw + 'px';
        html.classList.add('coodu-scroll-lock');
      } else {
        html.classList.remove('coodu-scroll-lock');
        document.body.style.paddingRight = '';
      }
    }

    function open(opener) {
      if (drawer.classList.contains('is-open')) return;
      lastFocused = opener || document.activeElement;

      drawer.classList.add('is-open');
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
      lockScroll(true);

      setPanelHidden(false);              /* expose drawer to AT + tab order   */
      var f = focusables();
      (f[0] || panel).focus({ preventScroll: true });
      setBackgroundInert(true);           /* AFTER moving focus in             */

      document.addEventListener('keydown', onKeydown, true);
    }

    function close() {
      if (!drawer.classList.contains('is-open')) return;

      setBackgroundInert(false);
      drawer.classList.remove('is-open');
      openers.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      lockScroll(false);
      setPanelHidden(true);

      document.removeEventListener('keydown', onKeydown, true);

      if (lastFocused && document.contains(lastFocused)) {
        lastFocused.focus({ preventScroll: true });
      }
      lastFocused = null;
    }

    function onKeydown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      var f = focusables();
      if (!f.length) { e.preventDefault(); panel.focus(); return; }
      var first = f[0], last = f[f.length - 1];
      var active = document.activeElement;

      if (!panel.contains(active)) { e.preventDefault(); first.focus(); return; }
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    }

    /* wire openers */
    openers.forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
      if (!btn.hasAttribute('aria-controls')) btn.setAttribute('aria-controls', drawer.id);
      if (!btn.hasAttribute('aria-haspopup')) btn.setAttribute('aria-haspopup', 'dialog');
      btn.addEventListener('click', function (e) { e.preventDefault(); open(btn); });
    });

    /* closers: every [data-drawer-close] + the backdrop (close() is idempotent) */
    $$('[data-drawer-close]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); close(); });
    });
    if (backdrop) backdrop.addEventListener('click', close);

    /* selecting a real navigation link closes the drawer */
    $$('.drawer__nav a[href]', drawer).forEach(function (a) {
      a.addEventListener('click', function () { close(); });
    });

    /* initial collapsed state */
    if (!drawer.classList.contains('is-open')) setPanelHidden(true);
  }

  /* ========================== 2. ACCORDIONS ========================== */
  function setAccordion(acc, open) {
    var trigger = $('.acc__trigger', acc);
    var pnl = $('.acc__panel', acc);
    acc.classList.toggle('is-open', open);
    if (trigger) trigger.setAttribute('aria-expanded', String(open));
    if (!pnl) return;

    /* the base reset enforces [hidden]{display:none!important} — the class
       alone can never show the panel, so keep the attribute in sync */
    pnl.hidden = !open;

    if (prefersReduced()) {
      pnl.style.maxHeight = open ? 'none' : '0px';
      return;
    }

    if (open) {
      pnl.style.maxHeight = pnl.scrollHeight + 'px';
      var done = function (e) {
        if (e.target !== pnl || e.propertyName !== 'max-height') return;
        if (acc.classList.contains('is-open')) pnl.style.maxHeight = 'none';
        pnl.removeEventListener('transitionend', done);
      };
      pnl.addEventListener('transitionend', done);
    } else {
      /* from auto/none -> fixed px -> 0 so the transition has somewhere to go */
      pnl.style.maxHeight = pnl.scrollHeight + 'px';
      void pnl.offsetHeight; /* reflow */
      requestAnimationFrame(function () { pnl.style.maxHeight = '0px'; });
    }
  }

  function initAccordions() {
    $$('.acc').forEach(function (acc) {
      var trigger = $('.acc__trigger', acc);
      var pnl = $('.acc__panel', acc);
      if (!trigger || !pnl) return;

      if (!pnl.id) pnl.id = uid('acc-panel');
      if (!trigger.hasAttribute('aria-controls')) trigger.setAttribute('aria-controls', pnl.id);

      var startOpen = acc.classList.contains('is-open');
      trigger.setAttribute('aria-expanded', String(startOpen));
      pnl.hidden = !startOpen;
      pnl.style.maxHeight = startOpen ? 'none' : '0px';

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var willOpen = !acc.classList.contains('is-open');
        if (willOpen) {
          /* one open at a time within the same drawer nav / group */
          var scope = acc.closest('.drawer__nav, [data-acc-group]') || document;
          $$('.acc.is-open', scope).forEach(function (other) {
            if (other !== acc) setAccordion(other, false);
          });
        }
        setAccordion(acc, willOpen);
      });
    });
  }

  /* ============================ 3. MEGA ============================== */
  function initMega() {
    var items = $$('.has-mega');
    if (!items.length) return;

    var recs = items.map(function (item) {
      /* trigger is a <button> (toggle-only) or an <a href> (navigates on
         desktop click; dropdown still opens via hover / keyboard / first tap) */
      var btn = $(':scope > button, :scope > a.nav__trigger', item) || $('button', item);
      var panel = null;
      if (btn && btn.getAttribute('aria-controls')) {
        panel = document.getElementById(btn.getAttribute('aria-controls'));
      }
      if (!panel) panel = $('.mega', item);

      if (btn) {
        /* plain disclosure (aria-expanded + aria-controls); no aria-haspopup —
           the panels are link groups, not menus with menu semantics */
        btn.removeAttribute('aria-haspopup');
        btn.setAttribute('aria-expanded', 'false');
        if (panel) {
          if (!panel.id) panel.id = uid('mega');
          if (!btn.getAttribute('aria-controls')) btn.setAttribute('aria-controls', panel.id);
        }
      }
      return { item: item, btn: btn, panel: panel };
    });

    function setOpen(rec, open) {
      if (!rec.btn) return;
      /* the base reset enforces [hidden]{display:none!important} — the class
         alone can never show the panel, so keep the attribute in sync */
      if (rec.panel) rec.panel.hidden = !open;
      rec.item.classList.toggle('is-open', open);
      rec.btn.setAttribute('aria-expanded', String(open));
    }
    function closeAll(except) {
      recs.forEach(function (r) { if (r !== except) setOpen(r, false); });
    }

    recs.forEach(function (rec) {
      if (!rec.btn) return;

      rec.btn.addEventListener('click', function (e) {
        var isLink = rec.btn.tagName === 'A' && rec.btn.getAttribute('href');
        if (isLink) {
          /* fine pointer: hover already shows the panel — click navigates.
             coarse pointer: first tap opens the panel, second tap navigates. */
          if (canHover) return;
          if (!rec.item.classList.contains('is-open')) {
            e.preventDefault();
            closeAll(rec);
            setOpen(rec, true);
          }
          return;
        }
        e.preventDefault();
        var open = !rec.item.classList.contains('is-open');
        closeAll(rec);
        setOpen(rec, open);
      });

      /* Keyboard path: the trigger is a real link to the hub page, which
         carries every destination the panel offers — no auto-open on focus
         (it would force tabbing through every panel link). */
      /* close when focus leaves the whole item */
      rec.item.addEventListener('focusout', function (e) {
        if (!rec.item.contains(e.relatedTarget)) setOpen(rec, false);
      });

      /* hover-open on fine-pointer devices */
      if (canHover) {
        var t;
        rec.item.addEventListener('mouseenter', function () {
          clearTimeout(t); closeAll(rec); setOpen(rec, true);
        });
        rec.item.addEventListener('mouseleave', function () {
          t = setTimeout(function () { setOpen(rec, false); }, 120);
        });
      }
    });

    /* Esc closes the open panel + returns focus to its trigger */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' && e.key !== 'Esc') return;
      var open = recs.filter(function (r) { return r.item.classList.contains('is-open'); })[0];
      if (open) { setOpen(open, false); if (open.btn) open.btn.focus(); }
    });

    /* click outside closes everything */
    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('.has-mega')) closeAll();
    });
  }

  /* ============================ 4. CAROUSEL ========================== */
  function setupCarousel(root) {
    var track = $('[data-carousel-track]', root) || $('.carousel__track', root);

    var slides = $$('[data-carousel-slide]', root);
    if (!slides.length && track) slides = $$(':scope > *', track);
    if (!slides.length) slides = $$('.carousel__slide', root);
    if (!slides.length) return;

    var n = slides.length;
    var stage = track || slides[0].parentElement;
    if (track) {
      if (track.parentElement) track.parentElement.classList.add('is-clip');
    } else if (stage) {
      stage.classList.add('is-fade');
    }

    var index = 0;
    for (var i = 0; i < n; i++) {
      if (slides[i].classList.contains('is-active')) { index = i; break; }
    }

    var prevBtn = $('[data-carousel-prev]', root) || $('.carousel__prev', root) || $('.arrow--prev', root);
    var nextBtn = $('[data-carousel-next]', root) || $('.carousel__next', root) || $('.arrow--next', root);
    var dotsWrap = $('[data-carousel-dots]', root) || $('.carousel__dots', root) || $('.dots', root);
    var live = $('[data-carousel-live]', root) || $('[aria-live]', root);

    /* dots — reuse authored buttons, else generate one per slide */
    var dots = [];
    if (dotsWrap) {
      var existing = $$('button', dotsWrap);
      if (!existing.length) {
        slides.forEach(function (_s, di) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'dot';
          b.setAttribute('aria-label', 'Go to slide ' + (di + 1));
          dotsWrap.appendChild(b);
        });
      }
      dots = $$('button', dotsWrap);
      dots.forEach(function (d, di) {
        d.addEventListener('click', function () { go(di, true); });
      });
    }

    function render() {
      slides.forEach(function (s, si) {
        var active = si === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', String(!active));
        if (supportsInert) {
          try { s.inert = !active; } catch (e) {}
        } else {
          $$(FOCUSABLE, s).forEach(function (el) {
            if (active) el.removeAttribute('tabindex');
            else el.setAttribute('tabindex', '-1');
          });
        }
      });
      if (track) track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (d, di) {
        var active = di === index;
        d.classList.toggle('is-active', active);
        if (active) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      if (live) live.textContent = 'Slide ' + (index + 1) + ' of ' + n;
    }

    function go(i, user) {
      index = (i % n + n) % n;       /* loop */
      render();
      if (user) restartAuto();
    }
    function next(u) { go(index + 1, u); }
    function prev(u) { go(index - 1, u); }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(true); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(true); });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(true); }
    });

    /* swipe */
    var swipeTarget = $('[data-carousel-viewport]', root) || track || root;
    var startX = 0, startY = 0, dragging = false;
    var THRESHOLD = 40;

    if (window.PointerEvent) {
      swipeTarget.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true; startX = e.clientX; startY = e.clientY;
      });
      swipeTarget.addEventListener('pointerup', function (e) {
        if (!dragging) return; dragging = false;
        var dx = e.clientX - startX, dy = e.clientY - startY;
        if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) next(true); else prev(true);
        }
      });
      swipeTarget.addEventListener('pointercancel', function () { dragging = false; });
    } else {
      swipeTarget.addEventListener('touchstart', function (e) {
        var t = e.changedTouches[0]; startX = t.clientX; startY = t.clientY; dragging = true;
      }, { passive: true });
      swipeTarget.addEventListener('touchend', function (e) {
        if (!dragging) return; dragging = false;
        var t = e.changedTouches[0];
        var dx = t.clientX - startX, dy = t.clientY - startY;
        if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) next(true); else prev(true);
        }
      }, { passive: true });
    }

    /* optional autoplay (opt-in via data-carousel-autoplay) */
    var timer = null;
    var wantsAuto = root.hasAttribute('data-carousel-autoplay');
    var interval = parseInt(root.getAttribute('data-carousel-interval'), 10) || 6000;

    function startAuto() {
      if (!wantsAuto || prefersReduced() || n < 2 || document.hidden) return;
      stopAuto();
      timer = setInterval(function () { next(false); }, interval);
    }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    function restartAuto() { if (wantsAuto) { stopAuto(); startAuto(); } }

    if (wantsAuto) {
      ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) {
        root.addEventListener(ev, stopAuto, { passive: true });
      });
      ['mouseleave', 'focusout'].forEach(function (ev) {
        root.addEventListener(ev, startAuto);
      });
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stopAuto(); else startAuto();
      });
      onMediaChange(reduceMQ, restartAuto);
      startAuto();
    }

    render();
  }

  function initCarousels() {
    $$('[data-carousel]').forEach(setupCarousel);
  }

  /* ============================ 5. COUNTERS ========================= */
  function counterConfig(el) {
    var raw = (el.dataset.target != null ? el.dataset.target : el.textContent) || '0';
    raw = String(raw);

    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix;
    if (suffix == null) suffix = /\+\s*$/.test(raw) ? '+' : '';

    var cleaned = raw.replace(/[^0-9.\-]/g, '');
    var target = parseFloat(cleaned);
    if (isNaN(target)) target = 0;

    var decimals;
    if (el.dataset.decimals != null) {
      decimals = parseInt(el.dataset.decimals, 10) || 0;
    } else {
      var dot = cleaned.indexOf('.');
      decimals = dot >= 0 ? cleaned.slice(dot + 1).length : 0;
    }

    var fmtName = el.dataset.format || 'intl';
    var locale = fmtName === 'indian' ? 'en-IN' : (fmtName === 'none' ? null : 'en-US');
    var opts = { minimumFractionDigits: decimals, maximumFractionDigits: decimals };

    function fmt(v) {
      var num = Number(v);
      var body;
      if (locale && num.toLocaleString) {
        try { body = num.toLocaleString(locale, opts); }
        catch (e) { body = num.toFixed(decimals); }
      } else {
        body = num.toFixed(decimals);
      }
      return prefix + body + suffix;
    }

    return { target: target, fmt: fmt };
  }

  function renderFinal(el) {
    var c = counterConfig(el);
    el.textContent = c.fmt(c.target);
  }

  function animateCounter(el) {
    var c = counterConfig(el);
    if (prefersReduced() || !window.requestAnimationFrame) {
      el.textContent = c.fmt(c.target);
      return;
    }
    var dur = parseInt(el.dataset.duration, 10) || 1600;
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

    el.setAttribute('aria-live', 'off');

    function frame(now) {
      var t = Math.min(1, ((now || Date.now()) - t0) / dur);
      el.textContent = c.fmt(c.target * easeOut(t));
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = c.fmt(c.target);
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    var counters = $$('.counter[data-target]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(renderFinal);
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCounter(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ============================ 6. REVEAL =========================== */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || prefersReduced()) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var vh = window.innerHeight || document.documentElement.clientHeight;
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    items.forEach(function (el) {
      /* reveal anything already in view synchronously — kills the
         above-the-fold flash that a one-tick observer would cause */
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('is-in');
      else io.observe(el);
    });
  }

  /* ============================ 7. ICONS ============================ */
  function initIcons() {
    var create = function () {
      try {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      } catch (e) {}
    };
    create();
    /* if the CDN script hasn't executed yet, retry once after load */
    if (!window.lucide) window.addEventListener('load', create, { once: true });
  }

  /* ============================ 8. YEAR ============================= */
  function initYear() {
    var y = String(new Date().getFullYear());
    $$('[data-year]').forEach(function (el) { el.textContent = y; });
  }

  /* ============================ BOOT =============================== */
  ready(function () {
    safe('icons', initIcons);          /* convert <i data-lucide> first */
    safe('drawer', initDrawer);
    safe('accordions', initAccordions);
    safe('mega', initMega);
    safe('carousel', initCarousels);
    safe('counters', initCounters);
    safe('reveal', initReveal);
    safe('year', initYear);
  });
})();
