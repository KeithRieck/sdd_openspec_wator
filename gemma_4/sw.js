const CACHE_NAME = 'wator-sim-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/config.js',
  '/src/main.js',
  '/src/scenes/BootScene.js',
  '/src/scenes/SimulationScene.js',
  '/src/simulation/Entities.js',
  '/src/simulation/WatorSimulation.js',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
