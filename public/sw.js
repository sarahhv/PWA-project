// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
// importScripts('serviceworker-cache-polyfill.js');

// Here comes the install event!
// This only happens once, when the browser sees this version of the ServiceWorker for the first time.
self.addEventListener('install', function (event) {
    // We pass a promise to event.waitUntil to signal how
    // long install takes, and if it failed
    event.waitUntil(
        // We open a cache…
        caches.open('simple-sw-v1').then(function (cache) {
            // And add resources to it
            return cache.addAll([
                //add the files that needs to be cache
                'index.html',
                'style.css'
            ]);
        })
    );
});

//Eventlistener for fetch
self.addEventListener('fetch', function(e) {
    console.log(e.request.url);
/*    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );*/
});