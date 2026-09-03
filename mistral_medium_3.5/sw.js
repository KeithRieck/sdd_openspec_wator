/**
 * Service Worker for Wa-Tor Simulation PWA.
 * Caches app shell and same-origin assets for offline support.
 */

const CACHE_NAME = 'wator-v1-mistral';
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
    '/manifest.webmanifest',
    '/sw.js'
];

// Install service worker and cache app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS);
            })
    );
});

// Fetch from cache or network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if available
                if (response) {
                    return response;
                }
                // Otherwise fetch from network and cache
                return fetch(event.request)
                    .then((response) => {
                        // Clone the response to cache it
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        return response;
                    });
            })
    );
});

// Clean up old caches
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
