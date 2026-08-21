/**
 * @file Service worker for lightweight PWA support (prd-v001.md AC 56).
 *
 * Precaches the same-origin app shell. The cross-origin CDN Phaser
 * script is cached opportunistically at install time (jsdelivr sends
 * CORS headers); failure is non-fatal because offline behavior without
 * a cached Phaser copy depends on network availability (AC 57).
 */

const CACHE_NAME = 'wator-v1-ox-alpha';

/** Same-origin app shell files. */
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/main.js',
  './src/config.js',
  './src/simulation/WatorSimulation.js',
  './src/simulation/Entity.js',
  './src/simulation/Fish.js',
  './src/simulation/Shark.js',
  './src/scenes/BootScene.js',
  './src/scenes/SimulationScene.js',
  './src/ui/LayoutSolver.js',
  './src/ui/UiButton.js',
  './src/ui/StatsPanel.js',
  './src/ui/ControlPanel.js',
  './src/ui/HistoryChart.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
];

/** Cross-origin CDN script cached best-effort. */
const CDN_PHASER = 'https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Cache the app shell first; never let one failure abort install.
      await Promise.allSettled(APP_SHELL.map((url) => cache.add(url)));
      try {
        await cache.add(CDN_PHASER);
      } catch {
        /* offline or CORS issue: accept network dependence (AC 57) */
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(cacheFirst(event.request));
});

/**
 * Serves from the cache when possible, falling back to the network and
 * opportunistically caching successful same-origin responses.
 *
 * @param {Request} request The fetch request.
 * @returns {Promise<Response>} Cached or fetched response.
 */
async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok && new URL(request.url).origin === self.location.origin) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
  }
}
