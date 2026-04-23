const postcss = require('postcss');
const pixelViewport = require('../../dist/index.cjs');

if (typeof pixelViewport !== 'function') {
  throw new TypeError('CJS require should return the plugin factory function');
}

postcss([pixelViewport()])
  .process('.a{width:20px;}', { from: undefined })
  .then((result) => {
    if (result.css !== '.a{width:2.66667vmin;}') {
      throw new Error(`Unexpected CJS output: ${result.css}`);
    }
  });
