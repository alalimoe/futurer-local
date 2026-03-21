const CACHE = 'np-pdf-cache-v1';
const SHOULD_CACHE = /(\.pdf$|pdfjs\/)/;

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (!SHOULD_CACHE.test(url)) return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(hit =>
        hit || fetch(e.request).then(res => {
          cache.put(e.request, res.clone());
          return res;
        })
      )
    )
  );
});
