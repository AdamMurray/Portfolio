(() => {

  'use strict';

  /**
   * Service worker configuration
   */
  var config = {
    version: '1.0.0',
    staticCacheItems: [
      'index.css',
      'site-icon-2.png',
      'index.js',
      'index.html',
      'manifest.json'
    ],
    offlineImage: '<svg role="img" aria-labelledby="offline-title"'
    + ' viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">'
    + '<title id="offline-title">Offline</title>'
    + '<g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/>'
    + '<text fill="#9B9B9B" font-family="Times New Roman,Times,serif" font-size="72" font-weight="bold">'
    + '<tspan x="93" y="172">offline</tspan></text></g></svg>',
    offlinePage: 'index.html'
  };

  /**
   * Service worker install event
   */
  self.addEventListener('install', event => {
    // Do install stuff
    function onInstall(event, opts) {
      return caches.open('static')
        .then(cache =>
          cache.addAll(opts.staticCacheItems)
        );
    }

    event.waitUntil(
      onInstall(event, config)
    );
  });

  /**
   * Service worker activate event
   */
  self.addEventListener('activate', event => {
    // Do activate stuff
    console.log('activated');
  });

  /**
   * Service worker fetch event
   */
  self.addEventListener('fetch', event => {

    function shouldHandleFetch(event, opts) {
      // Should we handle this fetch?
      var request = event.request;
      var url = new URL(request.url);
      var criteria = {
        isGETRequest: request.method === 'GET',
        isFromMyOrigin: url.origin === self.location.origin
      };

      // Create a new array with just the keys from criteria
      // that have failing (i.e. false) values
      var failingCriteria = Object.keys(criteria)
        .filter(criteriaKey => !criteria[criteriaKey]);

      // If that failing array has any length, one or more test
      // failed
      return !failingCriteria.length;
    }

    function onFetch(event, opts) {
      // Respond to the fetch
      var request = event.request;
      var acceptHeader = request.headers.get('Accept');
      var resourceType = 'static';
      var cacheKey;

      if (acceptHeader.indexOf('text/html') !== -1) {
        resourceType = 'content';
      }
      else if (acceptHeader.indexOf('image') !== -1) {
        resourceType = 'image';
      }

      // {String} [static|image|content]
      cacheKey = resourceType;

      // … now do something

      // 1. Determine what kind of asset this is... (above)
      if (resourceType === 'content') {
        // Use a network-first strategy
        event.respondWith(
          fetch(request)
            .then(response => addToCache(cacheKey, request, response))
            .catch(() => fetchFromCache(event))
            .catch(() => offlineResponse(opts))
        );
      }
      else {
        // Use a cache-first strategy
        event.respondWith(
          fetchFromCache(event)
            .catch(() => fetch(request))
            .then(response => addToCache(cacheKey, request, response))
            .catch(() => offlineResponse(resourceType, opts))
        );
      }
    }

    function addToCache(cacheKey, request, response) {
      console.log(`Adding resource to cache: ${request}`)

      if (response.ok) {
        var copy = response.clone();
        caches.open(cacheKey).then(cache => {
          cache.put(request, copy);
        });
        return response;
      }
    }

    function fetchFromCache(event) {
      console.log(`Fetching resource from cache: ${event.request}`)

      return caches.match(event.request).then(response => {
        if (!response) {
          // A synchronous error that will kick off the catch handler
          throw Error(`${event.request.url} not found in cache`);
        }
        return response;
      });
    }

    function offlineResponse(resourceType, opts) {
      console.log(`Offline response`)

      if (resourceType === 'image') {
        return new Response(opts.offlineImage,
          { headers: { 'Content-Type': 'image/svg+xml' } }
        );
      }
      else if (resourceType === 'content') {
        return caches.match(opts.offlinePage);
      }
      return undefined;
    }

    if (shouldHandleFetch(event, config)) {
      onFetch(event, config);
    }

  });

  /**
   * Service worker push event
   */
  self.addEventListener('push', function (event) {
    console.log('Push message', event);

    var title = 'Push message';

    event.waitUntil(
      self.registration.showNotification(title, {
        'body': 'The Message',
        'icon': 'me_pixel.jpg'
      }));
  });

})();