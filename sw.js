const APP_NAME = 'restaurant-reviews';
const CACHE_NAME = `${APP_NAME}-v1`;
const urlsToCache = [
  '/',
  'index.html',
  'restaurant.html',
  'css/main.css',
  'css/home.css',
  'css/restaurant.css',
  'js/main.js',
  'js/restaurant_info.js',
  'js/dbhelper.js',
  'js/swhelper.js',
  // 'img/favicon.ico'
];

// Perform install steps
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Respond with cached resources
self.addEventListener('fetch', (event) => {
  // console.log(`fetch request: ${event.request.url}`)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  )
});

// Delete outdated caches
self.addEventListener('activate', (event) => {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});