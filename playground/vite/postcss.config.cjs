const pixelViewport = require('postcss-pixel-viewport');

module.exports = {
  plugins: [
    pixelViewport({
      viewportWidth: 390,
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      mediaQuery: true
    })
  ]
};
