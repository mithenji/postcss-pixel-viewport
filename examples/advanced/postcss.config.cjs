const pixelViewport = require('../../dist/index.cjs');

module.exports = {
  plugins: [
    pixelViewport({
      viewportWidth: 750,
      viewportUnit: 'vw',
      fontViewportUnit: 'vh',
      mediaQuery: true,
      replace: false,
      include: 'examples/advanced',
      selectorBlackList: ['.no-scale'],
      overrides: [
        {
          include: 'desktop',
          viewportWidth: 1440
        }
      ],
      preserveCommentDirectives: true
    })
  ]
};
