// Service Worker for Winter Arc PWA
// Bump version when deploying so old caches (e.g. from 1800 build) are cleared
const CACHE_NAME = 'winter-arc-v2';

self.addEventListener('install', (event) => {
  // Activate immediately so we don't keep serving an old SW
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Delete ALL old caches (including winter-arc-v1) so no stale app code is served
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first for everything: never serve cached HTML/JS so app always gets latest (e.g. 2200 goal)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Only use cache when offline (e.g. shell for PWA)
      return caches.match(event.request);
    })
  );
});
