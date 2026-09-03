/**
 * Service worker for the Wa-Tor PWA app shell.
 *
 * Caches the app shell (index.html, JS modules, manifest, icons) and
 * same-origin assets on install. Serves cache-first on subsequent visits.
 * The Phaser CDN script is cached after its first successful load so the
 * app works offline once Phaser has been fetched at least once.
 */

const CACHE_NAME = 'wator-v1-glm';

/** App shell URLs to cache on install (same-origin). */
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
    './src/ui/PhaserButton.js',
    './src/ui/HistoryChart.js',
    './assets/icon-192.png',
    './assets/icon-512.png'
];

/** Phaser CDN URL to cache after first load. */
const PHASER_CDN_URL = 'https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js';

/**
 * Install: cache the app shell. Phaser is cached on first fetch, not here,
 * because cross-origin caching during install can be unreliable.
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

/**
 * Activate: clean up old caches.
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

/**
 * Fetch: serve from cache first, then network. Cache Phaser CDN after a
 * successful network response so it is available offline on subsequent loads.
 */
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Only handle GET requests.
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) {
                return cached;
            }
            return fetch(request).then((response) => {
                // Cache the Phaser CDN script after first successful load.
                if (request.url === PHASER_CDN_URL && response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            }).catch(() => {
                // Offline and not cached: nothing to return.
                return new Response('', { status: 504 });
            });
        })
    );
});
