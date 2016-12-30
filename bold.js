(function() {

  'use strict';

  let CARD_COLOURS = {
    PINK: 'card--pink',
    TEAL: 'card--teal',
    YELLOW: 'card--yellow'
  };

  let currentColour = CARD_COLOURS.TEAL;

  let card = document.getElementById('card');
  card.classList.add(currentColour);

  let colourTimeout = setTimeout(() => {

  }, 1000);

})();