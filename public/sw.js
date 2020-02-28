const filesToCache = [
    'index.html',
    'style.css'
];

var staticCacheName = 'pages-cache-v1';

// This only happens once, when the browser sees this version of the ServiceWorker for the first time.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
            // And add resources to it
            return cache.addAll(filesToCache);
        })
    );
});

//Eventlistener for fetch
self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request)

                    .then(response => {
                        if (response.status === 404) {
                            return caches.match('pages/404.html');
                        }
                        return caches.open(staticCacheName)
                            .then(cache => {
                                cache.put(event.request.url, response.clone());
                                return response;
                            });
                    });

            }).catch(error => {

            console.log('Error, ', error);
            return caches.match('pages/offline.html');

        })
    );
});

self.addEventListener('activate', event => {
    console.log('Activating new service worker...');

    const cacheWhitelist = [staticCacheName];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});