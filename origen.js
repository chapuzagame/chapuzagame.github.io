// De dónde llega cada visita a la web de Chapuza Game, para saber qué red (y qué publicación) trae a la gente hasta la
// demo, la beta y Google Play. Los enlaces que publicamos llevan ?de=<red>&p=<publicación> (o utm_source/utm_campaign);
// si no, se mira la web de la que viene (Instagram, Google…) y, si no hay ninguna, «directo» (WhatsApp, apps, a mano).
// Se guarda para toda la visita (sessionStorage, no pasa a otras visitas) y:
//   - manda un evento «llegada» por visita, con el origen;
//   - lo añade a cada clic medido (data-umami-event-origen) y a los eventos de la demo (window.cgOrigen);
//   - lo pasa a Google Play en los enlaces de la ficha (referrer): la app lo lee al instalarse.
// Quita ?de y ?p de la barra de direcciones, para que quien copie el enlace no se lleve el origen de otro.
(function () {
  // si has pedido que no se cuenten tus visitas (el botón de la política de privacidad, o ?soyyo), no se apunta nada
  try { if (localStorage.getItem('umami.disabled')) return; } catch (e) {}
  var RED = { ig: 'instagram', fb: 'facebook', tt: 'tiktok', yt: 'youtube', wa: 'whatsapp', gg: 'grupo', x: 'x', bs: 'bluesky',
    rd: 'reddit', th: 'threads', itch: 'itch' };
  var POR_WEB = [[/instagram/, 'instagram'], [/facebook|^fb\.|messenger/, 'facebook'], [/tiktok/, 'tiktok'],
    [/youtube|youtu\.be/, 'youtube'], [/whatsapp|^wa\.me/, 'whatsapp'], [/^t\.co$|twitter|^x\.com/, 'x'],
    [/(^|\.)bsky\.(app|social)$/, 'bluesky'], [/reddit/, 'reddit'], [/(^|\.)threads\.(net|com)$/, 'threads'],
    [/(^|\.)itch\.io$/, 'itch'],
    [/google|bing|duckduckgo|yahoo|ecosia|qwant|brave/, 'buscador']];
  var limpia = function (s, n) { return String(s || '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, n); };
  var q = new URLSearchParams(location.search);
  // un enlace de reto del juego: su «de» es el código de quien reta (lo lee el juego), no una red; el origen es «reto»
  var reto = q.has('reto');
  var de = reto ? 'reto' : limpia(q.get('de') || q.get('utm_source'), 30), p = reto ? '' : limpia(q.get('p') || q.get('utm_campaign'), 40);
  var o = null;
  try { o = JSON.parse(sessionStorage.getItem('cg-origen')); } catch (e) {}
  if (de || !o || !o.de) {                      // una visita nueva (o un enlace nuestro a media visita)
    var web = '';
    try { web = document.referrer ? new URL(document.referrer).hostname.replace(/^(www|m|l|lm)\./, '') : ''; } catch (e) {}
    if (web === location.hostname) web = '';     // de otra página de la propia web: no es un origen
    var porWeb = '';
    for (var i = 0; i < POR_WEB.length && !porWeb; i++) if (POR_WEB[i][0].test(web)) porWeb = POR_WEB[i][1];
    o = { de: RED[de] || de || porWeb || (web ? 'otra-web' : 'directo'), p: p, web: limpia(web, 40), nueva: 1 };
  }
  window.cgOrigen = o;
  var guarda = function () { try { sessionStorage.setItem('cg-origen', JSON.stringify(o)); } catch (e) {} };
  guarda();
  if (!reto && (q.has('de') || q.has('p') || q.has('utm_source') || q.has('utm_medium') || q.has('utm_campaign'))) {
    ['de', 'p', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { q.delete(k); });
    var resto = q.toString();
    history.replaceState(history.state, '', location.pathname + (resto ? '?' + resto : '') + location.hash);
  }
  // la llegada, cuando Umami esté cargado (una vez por visita)
  var intentos = 0;
  (function llegada() {
    if (!o.nueva) return;
    if (!window.umami) { if (intentos++ < 30) setTimeout(llegada, 400); return; }
    try { window.umami.track('llegada', { origen: o.de, publicacion: o.p || '-', web: o.web || '-' }); } catch (e) {}
    o.nueva = 0; guarda();
  })();
  addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('[data-umami-event]');
    for (var i = 0; i < els.length; i++) els[i].setAttribute('data-umami-event-origen', o.de);
    var ref = 'utm_source=' + o.de + '&utm_medium=web' + (o.p ? '&utm_campaign=' + o.p : '');
    var play = document.querySelectorAll('a[href^="https://play.google.com/store/apps/details"]');
    for (var j = 0; j < play.length; j++) {
      var u = new URL(play[j].href);
      u.searchParams.set('referrer', ref);
      play[j].href = u.href;
    }
  });
})();
