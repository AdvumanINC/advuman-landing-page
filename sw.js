// Service worker: caches sequence MP4 videos for instant repeat visits.
// Bump CACHE_VERSION when you re-export the videos (forces re-download).
const CACHE_VERSION = 'v1';
const CACHE_NAME = `advuman-seq-${CACHE_VERSION}`;

// On activate: clean up any stale cache versions from previous deploys
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('advuman-seq-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Cache-first for sequence videos; everything else passes through untouched
self.addEventListener('fetch', event => {
  const { pathname } = new URL(event.request.url);

  // Only intercept sequence video files
  if (!/^\/sequence\d+\.(mp4|webm)$/.test(pathname)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        if (cached) return cached; // Cache hit: zero network cost

        // Cache miss: fetch, store, return
        return fetch(event.request).then(response => {
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        });
      })
    )
  );
});
