/* ==========================================================================
   COODU Trust — DONATE page behaviour ("Gift Multiplier")
   - amount chips + custom amount  -> live CTA amount + Live Impact Mirror
   - cause selection               -> cause-aware impact metric (count-up)
   - 80G receipt toggle            -> reveals PAN / address
   - copy buttons for bank details
   - Razorpay flow (create-order -> checkout -> verify-payment -> receipt)
   Shared coodu.js handles: drawer, .acc accordions, .reveal, .counter, year.
   Honors prefers-reduced-motion (count-up is instant).
   ========================================================================== */
(function () {
  'use strict';

  var API_BASE_URL = 'http://localhost:3000/api';   // <- point at the deployed backend
  var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var form = $('#donate-form');
  if (!form) return;

  /* ---- illustrative impact model (per-rupee unit costs; tune freely) ---- */
  var IMPACT = {
    'general':           { unit: 20,  noun: 'trees planted',          caption: 'across our Tamil Nadu watersheds' },
    'environment':       { unit: 20,  noun: 'trees planted',          caption: 'restoring land and water' },
    'women-empowerment': { unit: 35,  noun: 'days of skills training', caption: 'for women in rural self-help groups' },
    'education':         { unit: 40,  noun: 'days of schooling support', caption: 'for rural children' },
    'health':            { unit: 130, noun: 'health screenings',       caption: 'at community camps' }
  };

  var state = { amount: 1000, cause: 'general', freq: 'one-time' };

  /* refs */
  var chips      = $$('.amount-chip');
  var custom     = $('#custom-amount');
  var causes     = $$('.cause-opt');
  var ctaAmount  = $('#cta-amount');
  var mirrorAmt  = $('#mirror-amount');
  var mirrorNum  = $('#mirror-num');
  var mirrorNoun = $('#mirror-noun');
  var mirrorCap  = $('#mirror-caption');
  var cta        = $('#donate-cta');
  var receiptChk = $('#want-receipt');
  var receiptBox = $('#receipt-acc');

  function inr(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
  function num(n) { return Number(n || 0).toLocaleString('en-IN'); }

  /* ---- Live Impact Mirror -------------------------------------------- */
  function impactFor() {
    var m = IMPACT[state.cause] || IMPACT.general;
    return { val: Math.max(1, Math.round((state.amount || 0) / m.unit)), noun: m.noun, caption: m.caption };
  }

  function animateNum(el, to) {
    var from = parseFloat(el.getAttribute('data-value')) || 0;
    el.setAttribute('data-value', to);
    if (REDUCE || !window.requestAnimationFrame || from === to) { el.textContent = num(to); return; }
    var dur = 600, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = num(Math.round(from + (to - from) * e));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function refresh() {
    if (ctaAmount) ctaAmount.textContent = inr(state.amount);
    if (mirrorAmt) mirrorAmt.textContent = inr(state.amount);
    var imp = impactFor();
    if (mirrorNum) animateNum(mirrorNum, imp.val);
    if (mirrorNoun) mirrorNoun.textContent = imp.noun;
    if (mirrorCap) mirrorCap.textContent = imp.caption;
  }

  function syncChips() {
    chips.forEach(function (c) {
      var on = parseInt(c.getAttribute('data-amount'), 10) === state.amount;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  /* ---- amount: chips + custom ---------------------------------------- */
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      state.amount = parseInt(c.getAttribute('data-amount'), 10) || 0;
      if (custom) custom.value = state.amount;
      syncChips(); refresh();
      if (!REDUCE) { c.classList.remove('is-pulse'); void c.offsetWidth; c.classList.add('is-pulse'); }
    });
  });
  if (custom) {
    custom.addEventListener('input', function () {
      state.amount = parseInt(custom.value, 10) || 0;
      syncChips(); refresh();
    });
  }

  /* ---- cause --------------------------------------------------------- */
  causes.forEach(function (b) {
    b.addEventListener('click', function () {
      causes.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-checked', 'false'); });
      b.classList.add('is-active'); b.setAttribute('aria-checked', 'true');
      state.cause = b.getAttribute('data-cause') || 'general';
      refresh();
    });
  });

  /* ---- 80G receipt -> reveal PAN / address --------------------------- */
  if (receiptChk && receiptBox) {
    var toggleReceipt = function () { receiptBox.hidden = !receiptChk.checked; };
    receiptChk.addEventListener('change', toggleReceipt);
    toggleReceipt();
  }

  /* ---- PAN uppercase + phone digits ---------------------------------- */
  var pan = $('#donor-pan');
  if (pan) pan.addEventListener('input', function () { this.value = this.value.toUpperCase(); });
  var phone = $('#donor-phone');
  if (phone) phone.addEventListener('input', function () { this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10); });

  /* ---- copy buttons (bank details) ----------------------------------- */
  $$('[data-copy-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dd = btn.closest('dd');
      var span = dd && dd.querySelector('[data-copy]');
      var text = span ? span.textContent.trim() : '';
      if (!text || !navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(function () {
        btn.classList.add('is-copied');
        setTimeout(function () { btn.classList.remove('is-copied'); }, 1600);
      }).catch(function () {});
    });
  });

  /* ---- inline message ------------------------------------------------ */
  function showMsg(text, type) {
    var old = $('.give__msg', form); if (old) old.remove();
    var div = document.createElement('div');
    div.className = 'give__msg give__msg--' + (type || 'info');
    div.setAttribute('role', type === 'error' ? 'alert' : 'status');
    div.innerHTML = '<i data-lucide="' + (type === 'error' ? 'alert-circle' : 'info') + '"></i><span></span>';
    div.querySelector('span').textContent = text;
    form.insertBefore(div, form.firstChild);
    if (window.lucide) window.lucide.createIcons();
    div.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' });
  }

  function setLoading(on) {
    cta.disabled = on;
    cta.classList.toggle('is-loading', on);
    var load = $('.give__cta-load', cta);
    if (load) load.hidden = !on;
  }

  /* ---- payment ------------------------------------------------------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var amount = parseInt(state.amount, 10) || 0;
    if (amount < 1) { showMsg('Please choose or enter a donation amount.', 'error'); return; }

    var name  = $('#donor-name').value.trim();
    var email = $('#donor-email').value.trim();
    var ph    = $('#donor-phone').value.trim();
    if (!name)  { showMsg('Please enter your name.', 'error'); $('#donor-name').focus(); return; }
    if (!email || email.indexOf('@') < 0) { showMsg('Please enter a valid email.', 'error'); $('#donor-email').focus(); return; }
    if (ph.length !== 10) { showMsg('Please enter a valid 10-digit phone number.', 'error'); $('#donor-phone').focus(); return; }

    var payload = {
      amount: amount,
      donationType: state.freq,                 // 'one-time'
      cause: state.cause,
      donorInfo: {
        name: name, email: email, phone: ph,
        address: ($('#donor-address') || {}).value || '',
        panNumber: ($('#donor-pan') || {}).value || ''
      },
      isAnonymous: $('#want-anon').checked,
      receiptRequested: receiptChk ? receiptChk.checked : true,
      notes: ''
    };

    setLoading(true);

    fetch(API_BASE_URL + '/donations/create-order', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error((res.data && res.data.message) || 'Could not start the payment.');
        var d = res.data.data;
        var rzp = new Razorpay({
          key: d.key, amount: d.amount, currency: d.currency,
          name: 'Coodu Trust',
          description: 'Donation — ' + payload.cause.replace(/-/g, ' '),
          order_id: d.orderId,
          prefill: { name: name, email: email, contact: ph },
          notes: { cause: payload.cause, donation_type: payload.donationType },
          theme: { color: '#1e7e34' },
          handler: function (resp) { verify(resp, payload); },
          modal: { ondismiss: function () { setLoading(false); showMsg('Payment cancelled — you can try again any time.', 'info'); } }
        });
        rzp.open();
      })
      .catch(function (err) { setLoading(false); showMsg(err.message || 'Something went wrong. Please try again.', 'error'); });
  });

  function verify(resp, payload) {
    fetch(API_BASE_URL + '/donations/verify-payment', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: resp.razorpay_order_id,
        razorpay_payment_id: resp.razorpay_payment_id,
        razorpay_signature: resp.razorpay_signature
      })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        setLoading(false);
        if (!res.ok) throw new Error((res.data && res.data.message) || 'Payment verification failed.');
        showSuccess(res.data.data, payload);
      })
      .catch(function (err) { setLoading(false); showMsg(err.message || 'Payment verification failed. Please contact us.', 'error'); });
  }

  function showSuccess(data, payload) {
    var imp = impactFor();
    var host = $('#donate-success');
    var card = $('.give__card');
    var mirror = $('.give__mirror');
    [card, mirror].forEach(function (el) { if (el) el.style.display = 'none'; });

    host.hidden = false;
    host.innerHTML =
      '<div class="receipt reveal is-in">' +
        '<div class="receipt__check"><i data-lucide="check"></i></div>' +
        '<h2 class="receipt__title">Thank you, your gift multiplies impact</h2>' +
        '<p class="receipt__lead">You’re helping transform rural communities across Tamil Nadu.</p>' +
        '<dl class="receipt__rows">' +
          '<div><dt>Amount donated</dt><dd>' + inr(data.amount) + '</dd></div>' +
          '<div><dt>Receipt number</dt><dd>' + (data.receiptNumber || '—') + '</dd></div>' +
          '<div><dt>Donor</dt><dd>' + (data.donorName || payload.donorInfo.name) + '</dd></div>' +
        '</dl>' +
        '<p class="receipt__impact"><strong>Your gift can ' + num(imp.val) + ' ' + imp.noun + '</strong> ' + imp.caption + '.</p>' +
        '<p class="receipt__lead">A confirmation email is on its way; your 80G receipt follows within 24 hours.</p>' +
        '<div class="receipt__actions">' +
          '<button type="button" class="btn btn--cta" id="again"><i data-lucide="refresh-cw"></i> Make another donation</button>' +
          '<a class="btn btn--outline" href="index.html">Back to home</a>' +
        '</div>' +
      '</div>';
    if (window.lucide) window.lucide.createIcons();
    host.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' });
    var again = $('#again'); if (again) again.addEventListener('click', function () { window.location.reload(); });
  }

  /* ---- init ---------------------------------------------------------- */
  syncChips();
  refresh();
})();
