/* ==========================================================================
   COODU Trust — CONTACT page behaviour ("Rooted in Dindigul")
   1) Contact form -> POST /api/contact/submit (validate, loading, success/error)
   2) Tamil Nadu locator map (d3): faint TN + 3 office pins, hover-linked to the
      office cards (hover a card -> its pin lights up, and vice-versa).
   Shared coodu.js handles drawer, .reveal, .counter, year. Reduced-motion safe.
   ========================================================================== */
(function () {
  'use strict';

  var API_BASE_URL = 'http://localhost:3000/api';   // <- deployed backend URL
  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var SVGNS = 'http://www.w3.org/2000/svg';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function svgEl(name, attrs) {
    var e = document.createElementNS(SVGNS, name);
    if (attrs) for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* ====================================================== 1. CONTACT FORM === */
  var form = $('#contact-form');
  if (form) {
    var cta = $('#contact-cta');
    var TYPE_LABEL = {
      general: 'General enquiry', volunteer: 'Volunteering enquiry',
      partnership: 'Partnership enquiry', donation: 'Donation enquiry', support: 'Website enquiry'
    };

    function feedback(msg, type) {
      var old = $('.msg__feedback', form); if (old) old.remove();
      var div = document.createElement('div');
      div.className = 'msg__feedback msg__feedback--' + (type === 'ok' ? 'ok' : 'error');
      div.setAttribute('role', type === 'ok' ? 'status' : 'alert');
      div.innerHTML = '<i data-lucide="' + (type === 'ok' ? 'check-circle' : 'alert-circle') + '"></i><span></span>';
      div.querySelector('span').textContent = msg;
      form.insertBefore(div, form.firstChild);
      if (window.lucide) window.lucide.createIcons();
      div.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' });
    }
    function loading(on) {
      cta.disabled = on; cta.classList.toggle('is-loading', on);
      var l = $('.msg__cta-load', cta); if (l) l.hidden = !on;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#c-name').value.trim();
      var email = $('#c-email').value.trim();
      var phone = $('#c-phone').value.trim();
      var type = $('#c-type').value;
      var message = $('#c-message').value.trim();

      if (name.length < 2) { feedback('Please enter your name.', 'error'); $('#c-name').focus(); return; }
      if (email.indexOf('@') < 1) { feedback('Please enter a valid email address.', 'error'); $('#c-email').focus(); return; }
      if (message.length < 5) { feedback('Please add a short message (at least 5 characters).', 'error'); $('#c-message').focus(); return; }

      var subject = (TYPE_LABEL[type] || 'Website enquiry') + ' from ' + name;
      if (subject.length < 5) subject = 'Website enquiry';

      var payload = { name: name, email: email, phone: phone, subject: subject, message: message, inquiryType: type };
      loading(true);

      fetch(API_BASE_URL + '/contact/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
          loading(false);
          if (!res.ok) throw new Error((res.data && res.data.message) || 'Could not send your message.');
          success(name);
        })
        .catch(function (err) {
          loading(false);
          feedback(err.message || 'Something went wrong. Please call +91-451-2461362 or try again.', 'error');
        });
    });

    function success(name) {
      var first = name ? name.split(' ')[0] : '';
      form.innerHTML =
        '<div class="msg__done">' +
          '<div class="msg__done-check"><i data-lucide="check"></i></div>' +
          '<h3>Thank you' + (first ? ', ' + first : '') + '!</h3>' +
          '<p>Your message is on its way. We’ll get back to you within 24–48 hours.</p>' +
          '<p class="msg__fineprint" style="justify-content:center"><i data-lucide="phone"></i> Need us sooner? Call +91-451-2461362.</p>' +
        '</div>';
      if (window.lucide) window.lucide.createIcons();
      form.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' });
    }
  }

  /* ================================================= 2. TN LOCATOR MAP === */
  var mapHost = $('[data-tn-map]');
  if (mapHost) {
    var offices = $$('.office').map(function (el) {
      return {
        key: el.getAttribute('data-office'),
        name: (el.querySelector('.office__name') || {}).textContent || '',
        lat: parseFloat(el.getAttribute('data-lat')),
        lng: parseFloat(el.getAttribute('data-lng')),
        el: el, hq: el.getAttribute('data-office') === 'dindigul'
      };
    });
    var tip = $('.find__maptip');
    var SIZE = 520, PAD = 24;

    fetch('assets/data/india-districts.min.json')
      .then(function (r) { return r.json(); })
      .then(function (geo) {
        var d3 = window.d3;
        if (!geo || !geo.features || !d3 || !d3.geoMercator || mapHost.__built) return;
        mapHost.__built = true;

        var tn = { type: 'FeatureCollection', features: geo.features.filter(function (f) { return f.properties.s === 'Tamil Nadu'; }) };
        if (!tn.features.length) return;
        var proj = d3.geoMercator().fitExtent([[PAD, PAD], [SIZE - PAD, SIZE - PAD]], tn);
        var geoPath = d3.geoPath(proj);

        var svg = svgEl('svg', { viewBox: '0 0 ' + SIZE + ' ' + SIZE, 'class': 'locator-svg' });
        svg.appendChild(svgEl('path', {
          d: geoPath(tn) || '', fill: 'rgba(30,126,52,0.07)',
          stroke: 'rgba(17,55,27,0.20)', 'stroke-width': 0.5, 'stroke-linejoin': 'round'
        }));

        var pins = {};
        offices.forEach(function (o) {
          if (isNaN(o.lat) || isNaN(o.lng)) return;
          var p = proj([o.lng, o.lat]); if (!p) return;
          var color = o.hq ? '#e8590c' : '#1e7e34';
          var base = o.hq ? 9 : 7;
          var g = svgEl('g', { 'class': 'pin' + (o.hq ? ' pin--hq' : ''), transform: 'translate(' + p[0] + ',' + p[1] + ')' });
          g.style.cursor = 'pointer';
          var halo = svgEl('circle', { r: base + 7, fill: color, opacity: 0.16, 'class': 'pin__halo' });
          var dot = svgEl('circle', { r: base, fill: color, stroke: '#fff', 'stroke-width': 2, 'class': 'pin__dot' });
          g.appendChild(halo); g.appendChild(dot);
          g.addEventListener('mouseenter', function () { activate(o.key); });
          g.addEventListener('mouseleave', deactivate);
          g.addEventListener('click', function () { o.el.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' }); });
          svg.appendChild(g);
          pins[o.key] = { halo: halo, dot: dot, base: base };
        });
        mapHost.appendChild(svg);

        offices.forEach(function (o) {
          o.el.addEventListener('mouseenter', function () { activate(o.key); });
          o.el.addEventListener('mouseleave', deactivate);
          o.el.addEventListener('focus', function () { activate(o.key); });
          o.el.addEventListener('blur', deactivate);
        });

        function activate(key) {
          offices.forEach(function (o) { o.el.classList.toggle('is-active', o.key === key); });
          Object.keys(pins).forEach(function (k) {
            var pn = pins[k], on = k === key;
            pn.dot.setAttribute('r', on ? pn.base + 3 : pn.base);
            pn.halo.setAttribute('opacity', on ? 0.32 : 0.16);
          });
          var o = offices.filter(function (x) { return x.key === key; })[0];
          if (o && tip) { tip.textContent = o.name; tip.classList.add('is-on'); }
        }
        function deactivate() {
          offices.forEach(function (o) { o.el.classList.remove('is-active'); });
          Object.keys(pins).forEach(function (k) { pins[k].dot.setAttribute('r', pins[k].base); pins[k].halo.setAttribute('opacity', 0.16); });
          if (tip) tip.classList.remove('is-on');
        }
      })
      .catch(function () { /* map optional */ });
  }
})();
