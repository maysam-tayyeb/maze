'use strict';

require("@babel/polyfill");

// In tests, polyfill requestAnimationFrame(raf) since jsdom doesn't provide it yet.
// We don't polyfill it in the browser--this is user's responsibility.
if (process.env.NODE_ENV === 'test') {
  require('raf').polyfill(global);
}
