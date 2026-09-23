/**
 * Lightweight service worker for PWA support (spec Req 31.1).
 *
 * Caches the app shell and same-origin assets with relative URLs so caching
 * works when the app is deployed under a repository subpath (design D12).
 * Serving is cache-first. The CDN Phaser script is a cross-origin request
 * and is intentionally not cached here: first-load or offline behavior may
 * depend on its network availability (spec Req 31.2).
 */

/** Cache version; bump when shipping app updates (design Migration Plan). */
const CACHE_NAME = 'wator-app-v2';

/** App shell and same-origin assets to cache on install (spec Req 31.1). */
const APP_SHELL = [
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
    './src/ui/StatsPanel.js',
    './src/ui/HistoryChart.js',
    './assets/icon-192.png',
    './assets/icon-512.png'
];

// Pre-cache the app shell on install.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

// Drop caches from previous versions on activate.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

/**
 * Serve same-origin GET requests cache-first with network fallback and
 * runtime cache fill (spec Req 31.1). Cross-origin requests such as the
 * CDN Phaser script pass straight to the network with no offline fallback
 * (spec Req 31.2).
 */
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) {
                return cached;
            }
            return fetch(event.request).then((response) => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                }
                return response;
            });
        })
    );
});
