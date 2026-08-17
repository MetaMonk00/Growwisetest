/* ═══════════════════════════════════════════════════════════
   GROWWISE — shared site behavior
   ───────────────────────────────────────────────────────────
   SETUP:

   1) BOOKING_PAGE — where every "Book a Call" button goes.
      The calendar itself lives on that page (book.html).

   2) AUTO_POPUP_MINUTES — how long after page load the
      reminder popup appears. It shows once per visit and
      never appears on the booking page itself.
   ═══════════════════════════════════════════════════════════ */
const BOOKING_PAGE = "book.html";
const AUTO_POPUP_MINUTES = 5;

(function () {
  var onBookingPage = /(^|\/)book\.html$/.test(window.location.pathname);

  /* ── Reminder popup: shown once per visit, sends people to the booking page ── */
  var overlay = document.createElement('div');
  overlay.className = 'bk-overlay';
  overlay.id = 'bkOverlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<div class="bk-box" role="dialog" aria-modal="true" aria-labelledby="bkTitle">' +
      '<button class="bk-close" id="bkClose" aria-label="Close">\u2715</button>' +
      '<div class="bk-head">' +
        '<div class="bk-title" id="bkTitle">Still Thinking It Over?</div>' +
        '<div class="bk-sub">The call is free, takes about 30 minutes, and there is zero pressure.</div>' +
      '</div>' +
      '<div class="bk-body">' +
        '<div class="bk-fallback">' +
          '<p>Let us look at your business together. We will show you exactly how the system would win you more leads, reviews, and repeat work.</p>' +
          '<a href="' + BOOKING_PAGE + '" class="btn btn-primary btn-lg" style="width:100%;max-width:340px;">Book a Call Now</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  function closePopup() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }
  function openPopup() {
    if (onBookingPage) return;
    try {
      if (sessionStorage.getItem('gw_auto_popup')) return;
      sessionStorage.setItem('gw_auto_popup', '1');
    } catch (err) {}
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  }
  if (!onBookingPage) setTimeout(openPopup, AUTO_POPUP_MINUTES * 60 * 1000);

  overlay.querySelector('#bkClose').addEventListener('click', closePopup);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });

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
