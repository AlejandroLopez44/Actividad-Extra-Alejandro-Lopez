const CACHE_NAME = 'ucab-store-cache-v2';

// 1. Archivos vitales que deben guardarse sí o sí al instalar (Pre-caché)
const APP_SHELL = [
    './',
    './index.html',
    './admin.html',
    './login.html'
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Obliga al nuevo Service Worker a instalarse de inmediato
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 Pre-guardando archivos principales para el Modo Offline...');
            // Atrapamos posibles errores de rutas en el APP_SHELL
            return cache.addAll(APP_SHELL).catch(err => console.log('Aviso en caché:', err));
        })
    );
});

self.addEventListener('activate', (event) => {
    // 2. Toma el control de la página inmediatamente sin esperar a recargar
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // 3. Estrategia Cache-First (Primero busca en el disco duro, luego en internet)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Si lo tenemos guardado, ¡entrégalo sin usar internet!
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Si no lo tenemos, búscalo en internet y guárdalo para la próxima
            return fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    // Solo guardamos peticiones válidas HTTP/HTTPS
                    if (event.request.url.startsWith('http')) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });
            });
        }).catch(() => {
            console.warn('⚠️ Estás offline y el recurso no está en caché:', event.request.url);
        })
    );
});