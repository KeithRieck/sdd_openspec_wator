// Service worker for PWA app shell caching
// R15: PWA support - cache app shell and same-origin assets

const CACHE_NAME = 'wa-tor-v1';
const APP_SHELL_URL = './index.html';
const SAME_ORIGIN_ASSETS = [
    './src/main.js',
    './src/config.js',
    './src/simulation/Entity.js',
    './src/simulation/Fish.js',
    './src/simulation/Shark.js',
    './src/simulation/Grid.js',
    './src/simulation/RandomGenerator.js',
    './src/simulation/WatorSimulation.js',
    './src/scenes/BootScene.js',
    './src/scenes/SimulationScene.js',
    './src/ui/PhaserButton.js',
    './manifest.webmanifest',
    './sw.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(SAME_ORIGIN_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method() !== 'GET') {
        return;
    }

    // Only handle same-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response or fetch from network
            return response || fetch(event.request);
        })
    );
});
