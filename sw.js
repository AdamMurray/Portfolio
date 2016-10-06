(() => {

  self.addEventListener('install', event => {
    // Do install stuff
    console.log('installed');
  });

  self.addEventListener('activate', event => {
    // Do activate stuff
    console.log('activated');
  });

})();