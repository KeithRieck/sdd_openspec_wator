/**
 * Service Worker for Wa-Tor Simulation PWA support.
 * Caches app shell and same-origin assets for offline capability.
 * Note: Phaser CDN script is cross-origin and not cached by this SW.
 */

const CACHE_NAME = 'wator-v1-nemotron';
const ASSETS = [
    '/',
    '/index.html',
    '/src/main.js',
    '/src/config.js',
    '/src/simulation/Entity.js',
    '/src/simulation/Fish.js',
    '/src/simulation/Shark.js',
    '/src/simulation/WatorSimulation.js',
    '/src/scenes/BootScene.js',
    '/src/scenes/SimulationScene.js',
    '/src/ui/WorldRenderer.js',
    '/src/ui/StatsPanel.js',
    '/src/ui/ControlPanel.js',
    '/src/ui/HistoryChart.js',
    '/src/ui/Button.js',
    '/manifest.webmanifest',
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app shell');
                return cache.addAll(ASSETS.map(url => new Request(url, { credentials: 'same-origin' })));
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Only handle same-origin requests
    const url = new URL(event.request.url);
    if (url.origin !== location.origin) {
        return; // Let cross-origin requests (like Phaser CDN) go to network
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Not in cache - fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Don't cache non-successful responses
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clone and cache the response
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(() => {
                        // Offline fallback for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});