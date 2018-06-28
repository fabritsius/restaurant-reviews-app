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
  'js/swhelper.js'
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
      // Fetch the response if it is not cached 
      return response || fetch(event.request).then(networkResponse => {
        // Cache the response only if it is useful
        if (networkResponse && networkResponse.status === 200) {
          // Clone the response cause it is a stream
          const clonedResponse = networkResponse.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request.url, clonedResponse);
            })
        }
        // Return the response in any scenario
        return networkResponse;
      });
    })
  );
});

// Delete outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith(APP_NAME) &&
                 CACHE_NAME != cacheName;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
