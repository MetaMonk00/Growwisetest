/* ═══════════════════════════════════════════════════════════
   GROWWISE — shared site behavior
   ───────────────────────────────────────────────────────────
   SETUP — the two values you'll want to touch:

   1) BOOKING_EMBED_URL — paste your HighLevel calendar embed
      URL (the `src` value from the iframe in your GHL calendar
      embed code, e.g.
      "https://api.leadconnectorhq.com/widget/booking/XXXXXXXX").
      Every "Book a Call" button site-wide opens it in a popup.
      Leave "" to show the call/contact fallback instead.

   2) AUTO_POPUP_MINUTES — how long after page load the
      automatic "Book a Call Now" popup appears. It shows once
      per visit and never interrupts a popup the visitor
      already opened.
   ═══════════════════════════════════════════════════════════ */
const BOOKING_EMBED_URL = "https://main.growwisebusiness.com/widget/booking/mng8qLDNdMMHAIQVmSSL";
const AUTO_POPUP_MINUTES = 5;

(function () {
  /* ── Inject booking modal markup once per page ── */
  var overlay = document.createElement('div');
  overlay.className = 'bk-overlay';
  overlay.id = 'bkOverlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<div class="bk-box" role="dialog" aria-modal="true" aria-labelledby="bkTitle">' +
      '<button class="bk-close" id="bkClose" aria-label="Close booking window">✕</button>' +
      '<div class="bk-head">' +
        '<div class="bk-title" id="bkTitle">Book Your <em>Free Call</em></div>' +
        '<div class="bk-sub" id="bkSub">Pick a time that works for you — we\'ll handle the rest.</div>' +
      '</div>' +
      '<div class="bk-body" id="bkBody"></div>' +
    '</div>';
  document.body.appendChild(overlay);

  var body = overlay.querySelector('#bkBody');
  var titleEl = overlay.querySelector('#bkTitle');
  var subEl = overlay.querySelector('#bkSub');
  var userOpenedOnce = false;

  var FALLBACK_HTML =
    '<div class="bk-fallback">' +
      '<p>Our booking calendar is being connected. Send us a message and we\'ll get right back to you.</p>' +
      '<a href="contact.html" class="btn btn-primary">Contact Us</a>' +
    '</div>';

  function showCalendar() {
    titleEl.innerHTML = 'Book Your <em>Free Call</em>';
    subEl.textContent = "Pick a time that works for you — we'll handle the rest.";
    if (BOOKING_EMBED_URL) {
      if (!body.dataset.loaded) {
        var f = document.createElement('iframe');
        f.src = BOOKING_EMBED_URL;
        f.title = 'Book a call with GrowWise';
        f.loading = 'lazy';
        body.innerHTML = '';
        body.appendChild(f);
        body.dataset.loaded = '1';
        /* GHL embed helper — auto-sizes the booking iframe */
        if (!document.getElementById('ghl-form-embed')) {
          var s = document.createElement('script');
          s.id = 'ghl-form-embed';
          s.src = 'https://link.msgsndr.com/js/form_embed.js';
          document.body.appendChild(s);
        }
      }
    } else if (!body.dataset.loaded) {
      body.innerHTML = FALLBACK_HTML;
    }
  }

  function openOverlay() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeBooking() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  function openBooking(e) {
    if (e) e.preventDefault();
    userOpenedOnce = true;
    showCalendar();
    openOverlay();
  }

  /* Auto popup: shows once per visit, AUTO_POPUP_MINUTES after load */
  function openAutoPromo() {
    if (userOpenedOnce || overlay.classList.contains('open')) return;
    try { if (sessionStorage.getItem('gw_auto_popup')) return; sessionStorage.setItem('gw_auto_popup', '1'); } catch (err) {}
    titleEl.innerHTML = 'Still Thinking It Over?';
    subEl.textContent = 'The call is free, takes 30 minutes, and there\'s zero pressure.';
    body.innerHTML =
      '<div class="bk-fallback">' +
        '<p>Let\'s look at your business together and map out exactly how the GrowWise system would win you more leads, bookings, and reviews.</p>' +
        '<button class="btn btn-primary btn-lg" id="bkPromoCta" style="width:100%;max-width:340px;">Book a Call Now</button>' +
      '</div>';
    delete body.dataset.loaded;
    body.querySelector('#bkPromoCta').addEventListener('click', function () {
      showCalendar();
    });
    openOverlay();
  }
  setTimeout(openAutoPromo, AUTO_POPUP_MINUTES * 60 * 1000);

  document.querySelectorAll('.js-book').forEach(function (el) {
    el.addEventListener('click', openBooking);
  });
  overlay.querySelector('#bkClose').addEventListener('click', closeBooking);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeBooking(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBooking(); });

  /* ── Nav: scrolled state + mobile burger ── */
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
    var burger = nav.querySelector('.nav-burger');
    var links = nav.querySelector('.nav-links');
    if (burger && links) {
      burger.addEventListener('click', function () {
        links.classList.toggle('open');
      });
    }
  }

  /* ── FAQ: all answers open by default; click to collapse/expand ── */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.classList.add('open');
  });
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      q.parentElement.classList.toggle('open');
    });
  });


  /* ── Decorative brand marks in heroes & CTA bands ── */
  var MARK = '<img src="assets/logo.png" alt="" class="hex-deco %CLS%">';
  document.querySelectorAll('.hero, .page-hero, .cta-band').forEach(function (h) {
    h.insertAdjacentHTML('afterbegin', MARK.replace('%CLS%', 'd1') + MARK.replace('%CLS%', 'd2'));
  });

  /* ── Scroll reveals ── */
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var sibs = Array.prototype.slice.call(e.target.parentElement.querySelectorAll('.reveal'));
        setTimeout(function () { e.target.classList.add('in'); }, sibs.indexOf(e.target) * 90);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
})();
