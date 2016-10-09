(() => {

  'use strict';

  // Subscription ID
  // https://android.googleapis.com/gcm/send/fRwPOoHrnHg:APA91bE9b_U8W42ZhCnxSevC8AEKiCl-Tb7oChc4uogRsH3KoV1cDGxKJQkp8SC2G7762N08Ga9vLs1MYuxpwURCQ0VMTPfziF5jRhVnVqN1UKsFjax8q2rJJo3-59MA9V3YLkt456WF

  var reg;
  var sub;
  var isSubscribed = false;
  var subscribeButton = document.getElementById('subscribeButton');

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js').then(() => {
        return navigator.serviceWorker.ready;
      })
      .then((serviceWorkerRegistration) => {
        reg = serviceWorkerRegistration;
        subscribeButton.disabled = false;
        console.log('Service Worker is ready :', reg);
      })
      .catch((error) => {
        console.log('Service Worker Error :', error);
      });
  }

  subscribeButton.addEventListener('click', () => {
    if (isSubscribed) {
      unsubscribe();
    }
    else {
      subscribe();
    }
  });

  function subscribe() {
    reg.pushManager
      .subscribe({ userVisibleOnly: true })
      .then((pushSubscription) => {
        sub = pushSubscription;
        console.log('Subscribed! Endpoint:', sub.endpoint);
        subscribeButton.textContent = 'Unsubscribe';
        isSubscribed = true;
      });
  }

  function unsubscribe() {
    sub.unsubscribe()
      .then((event) => {
        subscribeButton.textContent = 'Subscribe';
        console.log('Unsubscribed!', event);
        isSubscribed = false;
      })
      .catch((error) => {
        console.log('Error unsubscribing', error);
        subscribeButton.textContent = 'Subscribe';
      });
  }

})();