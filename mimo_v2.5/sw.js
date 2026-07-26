/**
 * Service worker for Wa-Tor simulation PWA support.
 *
 * Caches the app shell and same-origin assets. Phaser CDN script
 * depends on browser cache behavior for offline availability.
 */

const CACHE_NAME = 'wa-tor-v1';
const APP_SHELL = [
  './',
  './index.html',
  './src/main.js',
  './src/config.js',
  './src/simulation/Entity.js',
  './src/simulation/Fish.js',
  './src/simulation/Shark.js',
  './src/simulation/Grid.js',
  './src/simulation/WatorSimulation.js',
  './src/scenes/BootScene.js',
  './src/scenes/SimulationScene.js',
  './manifest.webmanifest',
  './assets/icon-192.svg',
  './assets/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache successful same-origin responses
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
