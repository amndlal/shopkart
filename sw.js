/* Simple offline cache so the app works without a network once visited. */
const CACHE = 'shopkart-v2';
const ASSETS = [
  './', './index.html', './manifest.json', './icon.svg',
  './css/style.css', './js/store.js', './js/data.js', './js/app.js', './js/admin.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
