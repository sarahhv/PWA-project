const filesToCache = [
    'index.html',
    'style.css',
    'app.js'
];

var staticCacheName = 'pages-cache-v2';

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

self.addEventListener("fetch", function(event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.open(staticCacheName).then(function (cache) {
            return cache.match(event.request).then(function (cachedResponse) {
                if (cachedResponse) {
                    console.log('Found ', event.request.url, 'in cache');
                }
                console.log('Network request for ', event.request.url);
                /*fetch(event.request).then(response => {
                  return caches.open(staticCacheName).then(cache => {
                       cache.put(event.request.url, response.clone());
                       return response;
                   });
                });*/
                let fetchPromise =
                    fetch(event.request).then(function (networkResponse) {
                        if (networkResponse.status === 404) {
                            return caches.match('pages/404.html');
                        }
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                return cachedResponse || fetchPromise;
            }).catch(error => {
                console.log('Error ', error)
                return caches.match('pages/offline.html')
            })
        })
    );
})
//Eventlistener for fetch
/*self.addEventListener('fetch', event => {
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
});*/

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