const CACHE_NAME = 'wator-v1-muse-spark';
const CDN_PHASER = 'https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/main.js',
  './src/config.js',
  './src/simulation/Entity.js',
  './src/simulation/Fish.js',
  './src/simulation/Shark.js',
  './src/simulation/WatorSimulation.js',
  './src/scenes/BootScene.js',
  './src/scenes/SimulationScene.js',
  './src/ui/Button.js',
  './src/ui/Chart.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  CDN_PHASER
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Optionally cache same-origin GETs
        if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
