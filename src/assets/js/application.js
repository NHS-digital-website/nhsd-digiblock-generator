/* global $, window, document */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Import NHSUK modules
import 'nhsuk-frontend/packages/nhsuk';

// Import custom modules
import todaysDate from './modules/todaysDate';
import DigiBlocks from './modules/digiBlocks';

// Expose $ on window
window.$ = $;

// Render today's date into the appropriate elements on the page
const todaysDateEls = document.querySelectorAll('[data-module="todays-date"]');
todaysDateEls.forEach((el) => {
  el.innerText = todaysDate();
});

DigiBlocks();
