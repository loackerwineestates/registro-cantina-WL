// Service Worker per Registro Cantina
// Caches l'app per uso offline; passa al network per le call a Apps Script
//
// Per aggiornare la cache dopo un cambio di codice:
// incrementa la versione di CACHE_VERSION qui sotto.
const CACHE_VERSION = 'rc-v1';
const CACHE_NAME = `registro-cantina-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(k => k !== CACHE_NAME)
        .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Solo richieste GET dalla nostra origin → strategia cache-first
  // (le call POST/GET a script.google.com passano dirette in rete)
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      // Cache-first: se in cache, ritorna subito; in background prova ad aggiornare
      if (cached) {
        // Fire-and-forget update
        fetch(req).then(fresh => {
          if (fresh && fresh.ok) {
            caches.open(CACHE_NAME).then(c => c.put(req, fresh.clone()));
          }
        }).catch(() => { /* offline, no problem */ });
        return cached;
      }
      // Niente in cache: fetch e salva
      return fetch(req).then(fresh => {
        if (fresh && fresh.ok) {
          const copy = fresh.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return fresh;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
