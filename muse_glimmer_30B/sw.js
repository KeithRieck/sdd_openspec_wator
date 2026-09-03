const CACHE_NAME = 'wator-v1-muse-glimmer';
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
  './src/simulation/WatorSimulation.js',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
