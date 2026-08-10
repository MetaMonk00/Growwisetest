/* ═══════════════════════════════════════════════════════════
   GROWWISE — shared site behavior
   ───────────────────────────────────────────────────────────
   BOOKING EMBED SETUP:
   Paste your HighLevel calendar embed URL below — the `src`
   value from the iframe in your GHL calendar embed code, e.g.
   "https://api.leadconnectorhq.com/widget/booking/XXXXXXXX".
   Every button/link with the class "js-book" site-wide opens
   it in a popup. Leave it empty ("") to show the fallback
   (call + contact links) until you have the link.
   ═══════════════════════════════════════════════════════════ */
const BOOKING_EMBED_URL = "";

/* Optional: separate embeds per popup context can be added later,
   e.g. a different calendar for demo vs. support calls. */

(function () {
  /* ── Inject booking modal markup once per page ── */
  const overlay = document.createElement('div');
  overlay.className = 'bk-overlay';
  overlay.id = 'bkOverlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<div class="bk-box" role="dialog" aria-modal="true" aria-labelledby="bkTitle">' +
      '<button class="bk-close" id="bkClose" aria-label="Close booking window">✕</button>' +
      '<div class="bk-head">' +
        '<div class="bk-title" id="bkTitle">Book Your <em>Free Call</em></div>' +
        '<div class="bk-sub">Pick a time that works for you — we\'ll handle the rest.</div>' +
      '</div>' +
      '<div class="bk-body" id="bkBody">' +
        '<div class="bk-fallback">' +
          '<p>Our booking calendar is being connected. In the meantime, call us directly or send us a message and we\'ll get right back to you.</p>' +
          '<a href="tel:+18501234567" class="btn btn-primary">Call (850) 123-4567</a>' +
          '<a href="contact.html" class="btn btn-ghost">Contact Us</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  const body = overlay.querySelector('#bkBody');

  function openBooking(e) {
    if (e) e.preventDefault();
    if (BOOKING_EMBED_URL && !body.dataset.loaded) {
      const f = document.createElement('iframe');
      f.src = BOOKING_EMBED_URL;
      f.title = 'Book a call with GrowWise';
      f.loading = 'lazy';
      body.innerHTML = '';
      body.appendChild(f);
      body.dataset.loaded = '1';
    }
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeBooking() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }
  document.querySelectorAll('.js-book').forEach(function (el) {
    el.addEventListener('click', openBooking);
  });
  overlay.querySelector('#bkClose').addEventListener('click', closeBooking);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closeBooking(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBooking(); });

  /* ── Nav: scrolled state + mobile burger ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
    const burger = nav.querySelector('.nav-burger');
    const links = nav.querySelector('.nav-links');
    if (burger && links) {
      burger.addEventListener('click', function () {
        links.classList.toggle('open');
      });
    }
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      const item = q.parentElement;
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        if (o !== item) o.classList.remove('open');
      });
      item.classList.toggle('open');
    });
  });

  /* ── Scroll reveals ── */
  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        const sibs = Array.prototype.slice.call(e.target.parentElement.querySelectorAll('.reveal'));
        setTimeout(function () { e.target.classList.add('in'); }, sibs.indexOf(e.target) * 90);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
})();
