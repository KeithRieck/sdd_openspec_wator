/**
 * Service worker for the Wa-Tor web app.
 *
 * Caches the app shell and same-origin assets so the app reloads offline
 * (`app-shell/pwa-support` §2.2, §2.3). Phaser is loaded from a CDN and is
 * deliberately left to the browser's own HTTP cache: offline behavior for that
 * one cross-origin script is best-effort and may legitimately fail
 * (`app-shell/pwa-support` §2.5, §2.6).
 *
 * All URLs are relative so the worker also works when the app is served from a
 * repository subpath (`app-shell/static-hosting` §5.1).
 */

/** Cache name; bump to invalidate older cached shells. */
const CACHE_NAME = 'wator-shell-v1';

/**
 * App shell and same-origin assets to pre-cache.
 *
 * These are the files needed to start the app, plus the manifest and the icon
 * files already present in `assets/`.
 */
const PRECACHE_URLS = [
    './',
    './index.html',
    './manifest.webmanifest',
    './assets/icon-192.png',
    './assets/icon-512.png',
    './src/main.js',
    './src/config.js',
    './src/scenes/BootScene.js',
    './src/scenes/SimulationScene.js',
    './src/ui/PhaserButton.js',
    './src/ui/layout.js',
    './src/simulation/WatorSimulation.js',
    './src/simulation/Entity.js',
    './src/simulation/Fish.js',
    './src/simulation/Shark.js',
    './src/simulation/RandomSource.js',
    './src/simulation/types.js'
];

/**
 * Pre-cache the app shell when the worker installs.
 *
 * Each URL is added independently so one failure does not discard the whole
 * cache; a cached shell is still useful even if a single asset is missing.
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.all(
                PRECACHE_URLS.map((url) =>
                    cache.add(url).catch(() => {
                        /* Ignore individual failures; the app degrades gracefully. */
                    })
                )
            )
        ).then(() => self.skipWaiting())
    );
});

/**
 * Remove caches left behind by earlier versions of this worker.
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

/**
 * Serve same-origin requests from the cache, falling back to the network.
 *
 * Cross-origin requests, including the CDN Phaser script, are passed straight
 * through so the browser's normal caching rules apply
 * (`app-shell/pwa-support` §2.5).
 */
self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request)
                .then((response) => {
                    // Cache successful same-origin responses for later offline use.
                    if (response && response.status === 200 && response.type === 'basic') {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => cached);
        })
    );
});
