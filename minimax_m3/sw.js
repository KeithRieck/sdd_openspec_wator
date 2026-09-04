/**
 * Service worker for the Wa-Tor PWA shell.
 *
 * Strategy:
 *   - Precache the app shell on install (cache-first for same-origin GETs).
 *   - Phaser (loaded from jsdelivr) is network-only — it is NOT precached.
 *
 * This matches the requirement: the shell loads offline once the user has
 * visited the page at least once online; first-load or offline-before-cached
 * behavior depends on network availability for Phaser.
 */
const CACHE_NAME = 'wator-v1-minimax-m3';

/**
 * The set of URLs to precache on install. Relative paths are resolved
 * against the service worker's scope, which is
 * /sdd_openspec_wator/minimax_m3/. Add new same-origin shell files here.
 */
const ASSETS = [
    './',
    './index.html',
    './manifest.webmanifest',
    './src/main.js',
    './src/config.js',
    './src/simulation/Grid.js',
    './src/simulation/Fish.js',
    './src/simulation/Shark.js',
    './src/simulation/WatorSimulation.js',
    './src/scenes/BootScene.js',
    './src/scenes/SimulationScene.js',
    './src/ui/PhaserButton.js',
    './assets/icon-192.png',
    './assets/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // Same-origin: cache-first.
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(req).then(cached => {
                if (cached) return cached;
                return fetch(req).then(response => {
                    // Optionally cache successful basic responses for the shell.
                    if (response && response.status === 200 && response.type === 'basic') {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(c => c.put(req, copy));
                    }
                    return response;
                }).catch(() => caches.match('./index.html'));
            })
        );
        return;
    }

    // Cross-origin (e.g. Phaser CDN): network-only.
    event.respondWith(fetch(req).catch(() => new Response('', { status: 504 })));
});
