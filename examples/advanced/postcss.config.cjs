const pixelViewport = require('../../dist/index.cjs');

module.exports = {
  plugins: [
    pixelViewport({
      viewportWidth: 750,
      viewportUnit: 'vw',
      fontViewportUnit: 'vh',
      mediaQuery: true,
      replace: false,
      includeFiles: 'examples/advanced',
      selectorBlackList: ['.no-scale'],
      overrides: [
        {
          includeFiles: 'desktop',
          viewportWidth: 1440
        }
      ],
      preserveCommentDirectives: true
    })
  ]
};
