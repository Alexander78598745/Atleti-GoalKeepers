// Service Worker para AtletiKeepers Pro PWA
const CACHE_NAME = 'atleti-keepers-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/firebase-config.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cacheando recursos de la app');
                return cache.addAll(urlsToCache);
            })
            .catch((err) => {
                console.log('Error cacheando:', err);
            })
    );
    self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando cache antigua:', cacheName);
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
        event.request.url.includes('googleapis.com')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Para recursos de la app, usar cache
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en cache, devolverlo
                if (response) {
                    return response;
                }

                // Si no está, obtener de la red
                return fetch(event.request).then((response) => {
                    // Solo cachear respuestas válidas
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clonar la respuesta
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // Si no hay internet ni cache, mostrar página offline
                return caches.match('/index.html');
            })
    );
});
