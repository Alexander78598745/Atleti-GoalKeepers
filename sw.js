// Service Worker para AtletiKeepers Pro PWA
const CACHE_NAME = 'atleti-keepers-v3';

// Instalar Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activar Service Worker
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
    self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
    // Para llamadas a Firebase, ir a la red directamente
    if (event.request.url.includes('firebaseio.com') || 
        event.request.url.includes('googleapis.com') ||
        event.request.url.includes('firebasestorage.googleapis.com') ||
        event.request.url.includes('firebasestorage.app')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Para recursos locales, usar cache o red
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('index.html');
            })
    );
});
