/* site.js — menu, submenu, panel tema, carousel beranda (gaya Klasik), filter prestasi */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- menu HP ---------- */
  var nav = $('#siteNav'), menuBtn = $('#siteMenuBtn');
  if (nav && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      closePanel();
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }); });
  }
  /* ---------- submenu ---------- */
  $$('.dd-btn').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var dd = b.parentElement, open = !dd.classList.contains('open');
      $$('.dd.open').forEach(function (x) { if (x !== dd) { x.classList.remove('open'); $('.dd-btn', x).setAttribute('aria-expanded', 'false'); } });
      dd.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dd')) $$('.dd.open').forEach(function (x) { x.classList.remove('open'); $('.dd-btn', x).setAttribute('aria-expanded', 'false'); });
    if (!e.target.closest('#themePanel') && !e.target.closest('#themeBtn')) closePanel();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { $$('.dd.open').forEach(function (x) { x.classList.remove('open'); }); closePanel(); }
  });

  /* ---------- panel tema ---------- */
  var panel = $('#themePanel'), themeBtn = $('#themeBtn');
  function closePanel() { if (panel && !panel.hidden) { panel.hidden = true; if (themeBtn) themeBtn.setAttribute('aria-expanded', 'false'); } }
  function syncPanel() {
    if (!panel || !window.SMP7Tema) return;
    var t = window.SMP7Tema.get();
    $$('[data-gaya]', panel).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-gaya') === t.gaya); });
    $$('[data-warna-pick]', panel).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-warna-pick') === t.warna); });
    var sub = $('.tp-sub', panel); if (sub) sub.hidden = t.gaya !== 'klasik';
  }
  if (panel && themeBtn) {
    themeBtn.addEventListener('click', function () {
      panel.hidden = !panel.hidden; themeBtn.setAttribute('aria-expanded', !panel.hidden);
      if (nav) nav.classList.remove('open');
      syncPanel();
    });
    $$('[data-gaya]', panel).forEach(function (b) { b.addEventListener('click', function () { window.SMP7Tema.setGaya(b.getAttribute('data-gaya')); syncPanel(); }); });
    $$('[data-warna-pick]', panel).forEach(function (b) { b.addEventListener('click', function () { window.SMP7Tema.setWarna(b.getAttribute('data-warna-pick')); syncPanel(); }); });
    syncPanel();
  }

  /* ---------- tombol ke atas (juga di halaman tanpa app.js) ---------- */
  var toTop = $('#backToTop');
  if (toTop && !window.__smp7Top) {
    window.__smp7Top = true;
    window.addEventListener('scroll', function () { toTop.classList.toggle('show', window.scrollY > 350); }, { passive: true });
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ---------- tahun di footer ---------- */
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- carousel beranda (gaya Klasik) ---------- */
  var kh = $('.kh-card');
  if (kh) {
    var layers = $$('.kh-layer', kh), slides = $$('.kh-slide', kh), cards = $$('.kh-cardbtn', kh);
    var count = $('.kh-count', kh), bar = $('.kh-bar i', kh), n = layers.length, idx = 0, timer = null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function pad(x) { return (x < 10 ? '0' : '') + x; }
    function render(prev) {
      layers.forEach(function (l, i) { l.classList.toggle('is-active', i === idx); l.classList.toggle('is-prev', i === prev); });
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
      cards.forEach(function (c) { var i = +c.getAttribute('data-i'); c.classList.toggle('is-hidden', i === idx); c.style.order = (i - idx + n) % n; });
      if (count) count.textContent = pad(idx + 1) + ' / ' + pad(n);
      if (bar) { bar.classList.remove('run'); void bar.offsetWidth; if (!reduce) bar.classList.add('run'); }
    }
    function go(i, user) {
      var next = ((i % n) + n) % n; if (next === idx) return;
      var prev = idx; idx = next; render(prev); if (user) start();
    }
    function start() {
      clearInterval(timer);
      if (reduce || document.documentElement.getAttribute('data-theme') !== 'klasik') return;
      timer = setInterval(function () { go(idx + 1, false); }, 7000);
    }
    cards.forEach(function (c) { c.addEventListener('click', function () { go(+c.getAttribute('data-i'), true); }); });
    var prevBtn = $('.kh-ctrl .prev', kh), nextBtn = $('.kh-ctrl .next', kh);
    if (prevBtn) prevBtn.addEventListener('click', function () { go(idx - 1, true); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(idx + 1, true); });
    document.addEventListener('smp7:tema', start);
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(timer); else start(); });
    render(-1); start();
  }

  /* ---------- filter prestasi (data statis; CMS menimpa bila ada data) ---------- */
  var fbtns = $$('.achievement-filter [data-filter]');
  fbtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.onclick) return; // sudah diatur cms-public.js
      fbtns.forEach(function (x) { x.classList.toggle('active', x === btn); });
      var f = (btn.getAttribute('data-filter') || 'all').toLowerCase();
      $$('.achievement-catalog .achievement-entry').forEach(function (card) {
        var c = (card.getAttribute('data-category') || '').toLowerCase().split(/\s+/);
        card.style.display = f === 'all' || c.indexOf(f) >= 0 ? '' : 'none';
      });
    });
  });
})();
