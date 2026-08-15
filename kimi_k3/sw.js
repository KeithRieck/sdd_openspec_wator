/**
 * Service worker: cache-first for the app shell and same-origin
 * assets; network fall-through for cross-origin requests (the Phaser
 * CDN). First load without a prior cache depends on network
 * availability (AS-R8 / AC 56, 57).
 */
const CACHE_NAME = 'wator-v1-kimi';
const SHELL = [
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
  './assets/icon-192.png',
  './assets/icon-512.png',
];

/** Installs by pre-caching the app shell. */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

/** Activates by dropping outdated caches. */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/**
 * Serves same-origin requests cache-first (falling back to network and
 * populating the cache); cross-origin requests go straight to network.
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return; // CDN: network only (AC 57)
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(
      (cached) =>
        cached ??
        fetch(event.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        }),
    ),
  );
});
