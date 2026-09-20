/* visitors.js — fills the visitor bar with the total number of visitors.
   Each browser is counted once (remembered in localStorage); repeat visits
   and other pages only read the current total.
   Every site gets its own counter, named after its web address, so the same
   file works in both repos. Counter service: Abacus (abacus.jasoncameron.dev),
   no signup needed. */
(function () {
  var bar = document.getElementById('visitorBar');
  var out = document.getElementById('visitorCount');
  if (!bar || !out) return;

  var BASE = 'https://abacus.jasoncameron.dev';
  var NAMESPACE = (location.hostname || 'local-preview').toLowerCase();
  var KEY = 'visitors';
  var FLAG = 'visitor-counted-' + NAMESPACE;

  function call(action) {
    return fetch(BASE + '/' + action + '/' + NAMESPACE + '/' + KEY).then(function (res) {
      if (!res.ok) throw new Error('Counter error ' + res.status);
      return res.json();
    });
  }

  var counted = false;
  try { counted = localStorage.getItem(FLAG) === '1'; } catch (e) {}

  // New visitor: add 1. Returning visitor: just read the total
  // (if the counter was cleared or expired, start it again with a hit).
  var request = counted ? call('get').catch(function () { return call('hit'); }) : call('hit');

  request.then(function (data) {
    out.textContent = Number(data.value).toLocaleString();
    if (!counted) {
      try { localStorage.setItem(FLAG, '1'); } catch (e) {}
    }
  }).catch(function () {
    bar.hidden = true; // counter unreachable: hide the bar instead of showing a broken number
  });
})();
