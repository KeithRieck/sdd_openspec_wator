const CACHE_NAME = 'wator-v1-luna';
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
  './src/ui/LayoutManager.js',
  './src/ui/StatsPanel.js',
  './src/ui/ControlsPanel.js',
  './src/ui/PopulationChart.js',
  './assets/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
