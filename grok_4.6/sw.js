const CACHE_NAME = 'wator-shell-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.webmanifest',
    './src/main.js',
    './src/config.js',
    './src/scenes/BootScene.js',
    './src/scenes/SimulationScene.js',
    './src/simulation/Entity.js',
    './src/simulation/Fish.js',
    './src/simulation/Shark.js',
    './src/simulation/WatorWorld.js',
    './src/simulation/WatorSimulation.js',
    './src/ui/PhaserButton.js',
    './src/ui/WorldView.js',
    './src/ui/StatsPanel.js',
    './src/ui/ControlPanel.js',
    './src/ui/HistoryChart.js',
    './assets/icon-192.png',
    './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return;
    }

    if (event.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) {
                return cached;
            }
            return fetch(event.request).then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                return response;
            });
        })
    );
});
