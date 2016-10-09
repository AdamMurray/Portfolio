(() => {

  'use strict';

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then((registration) => {
      console.log('Service worker registered on scope:', registration.scope);
      console.log('Service worker reg:', registration);
    })
    .catch((err) => {
      console.log('Service worker registration failed:', err);
    });
  }

})();