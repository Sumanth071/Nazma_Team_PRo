// ColoAI Diagnostic Platform Service Worker
const CACHE_NAME = 'coloai-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-http requests
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // CRITICAL: NEVER intercept or synthetic-reject API requests, uploads, reports, or backend domains.
  // Bypass Service Worker completely for all dynamic network and non-GET requests.
  if (
    event.request.method !== 'GET' ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/uploads') ||
    url.pathname.startsWith('/reports') ||
    url.hostname.includes('onrender.com') ||
    url.hostname.includes('trycloudflare.com')
  ) {
    return; // Direct native browser network passthrough
  }

  // Stale-While-Revalidate for static GET UI assets only
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback to index.html for SPA navigation requests when truly offline
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
