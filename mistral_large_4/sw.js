/**
 * Service Worker for Wa-Tor Simulation PWA.
 *
 * Caches the app shell and same-origin assets for offline capability.
 * Phaser from CDN is cached after first successful load.
 *
 * @see prd-v001.md requirements #56-57
 */

const CACHE_NAME = 'wator-simulation-v1';

/**
 * List of app shell files to cache on install.
 * Uses relative paths for subpath deployment support.
 */
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
    './src/simulation/RandomNumberGenerator.js',
    './src/scenes/BootScene.js',
    './src/scenes/SimulationScene.js',
    './src/ui/PhaserButton.js',
    './src/ui/StatsPanel.js',
    './src/ui/ControlsPanel.js',
    './src/ui/SpeedControls.js',
    './src/ui/HistoryChart.js',
    './assets/icon-192.png',
    './assets/icon-512.png'
];

/**
 * Install event - cache the app shell.
 * Uses relative paths for subpath deployment support.
 */
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(APP_SHELL);
            })
            .then(() => {
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[ServiceWorker] Cache failed:', error);
            })
    );
});

/**
 * Activate event - clean up old caches.
 */
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[ServiceWorker] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

/**
 * Fetch event - cache-first strategy for same-origin requests.
 * Network-first for CDN requests (Phaser) to allow updates.
 */
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // For CDN requests (Phaser), try network first, fall back to cache
    if (url.origin !== self.location.origin) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cache successful CDN responses
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Fall back to cache if network fails
                    return caches.match(event.request);
                })
        );
        return;
    }

    // For same-origin requests, use cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Not in cache, fetch from network and cache it
                return fetch(event.request)
                    .then((response) => {
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return response;
                    });
            })
            .catch(() => {
                // Return offline fallback if available
                return caches.match('./index.html');
            })
    );
});
