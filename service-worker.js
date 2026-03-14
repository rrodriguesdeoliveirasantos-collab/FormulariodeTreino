const CACHE_NAME = 'ficha-treino-v1';

self.addEventListener('install', event => {
  self.skipWaiting();  
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});