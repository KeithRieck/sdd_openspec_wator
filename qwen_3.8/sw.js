/**
 * Service worker for lightweight PWA support (pwa R2, R3).
 *
 * Precaches the app shell and same-origin assets with a cache-first strategy.
 * The CDN-hosted Phaser script is intentionally left to the network: if it has
 * not already been loaded and cached, first-load or offline behavior depends
 * on network availability (pwa R3).
 */

const CACHE_NAME = 'wator-shell-v1';

/** App shell and same-origin assets to precache (pwa R2). */
const ASSETS = [
    'index.html',
    'manifest.webmanifest',
    'src/main.js',
    'src/config.js',
    'src/scenes/BootScene.js',
    'src/scenes/SimulationScene.js',
    'src/simulation/WatorSimulation.js',
    'src/simulation/Entity.js',
    'src/simulation/Fish.js',
    'src/simulation/Shark.js',
    'src/ui/PhaserButton.js',
    'src/ui/StatsPanel.js',
    'src/ui/ControlPanel.js',
    'src/ui/PopulationChart.js',
    'assets/icon-192.png',
    'assets/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') {
        return;
    }

    // Same-origin requests: cache-first, then network, then cache fallback.
    if (new URL(request.url).origin === self.location.origin) {
        event.respondWith(
            caches.match(request)
                .then((cached) => {
                    if (cached) {
                        return cached;
                    }
                    return fetch(request).then((response) => {
                        if (response.ok) {
                            const copy = response.clone();
                            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                        }
                        return response;
                    });
                })
                .catch(() => caches.match('index.html'))
        );
        return;
    }

    // Cross-origin (e.g., the Phaser CDN): network-first, fall back to cache
    // so a previously loaded Phaser script works offline (pwa R3).
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});
