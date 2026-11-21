/* theme.js — dipasang di <head> SEBELUM CSS agar tidak berkedip.
   Membaca gaya pilihan pengunjung (localStorage), bawaan: klasik. */
(function () {
  'use strict';
  var GAYA = ['klasik', 'album', 'binder', 'sinematik', 'scrapbook', 'pilar'];
  var WARNA = ['navy', 'sage', 'langit', 'borneo', 'gelap'];
  var FONTS = {
    klasik: 'family=Manrope:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Instrument+Serif:ital@1&family=Caveat:wght@600',
    album: 'family=Great+Vibes&family=Jost:wght@300;400;500;600;700',
    binder: 'family=Kalam:wght@400;700&family=Patrick+Hand&family=Special+Elite',
    sinematik: 'family=Archivo:wght@400;500;600;700;800;900&family=Pinyon+Script',
    scrapbook: 'family=Lilita+One&family=Caveat+Brush&family=Nunito:wght@600;700;800',
    pilar: 'family=Poppins:wght@400;500;600;700;800'
  };
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* mode privat: abaikan */ } }
  function loadFont(g) {
    var id = 'font-' + g;
    if (document.getElementById(id)) return;
    var l = document.createElement('link');
    l.id = id; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?' + FONTS[g] + '&display=swap';
    document.head.appendChild(l);
  }
  var root = document.documentElement;
  var g = read('smpn7-gaya'); if (GAYA.indexOf(g) < 0) g = 'klasik';
  var w = read('smpn7-warna'); if (WARNA.indexOf(w) < 0) w = 'navy';
  root.setAttribute('data-theme', g);
  root.setAttribute('data-warna', w);
  loadFont(g);
  window.SMP7Tema = {
    gaya: GAYA, warna: WARNA,
    get: function () { return { gaya: root.getAttribute('data-theme'), warna: root.getAttribute('data-warna') }; },
    setGaya: function (v) { if (GAYA.indexOf(v) < 0) return; loadFont(v); root.setAttribute('data-theme', v); save('smpn7-gaya', v); document.dispatchEvent(new CustomEvent('smp7:tema', { detail: v })); },
    setWarna: function (v) { if (WARNA.indexOf(v) < 0) return; root.setAttribute('data-warna', v); save('smpn7-warna', v); }
  };
})();
