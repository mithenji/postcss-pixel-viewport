import postcss from 'postcss';
import pixelViewport, { type Options } from '../../dist/index.js';

const options: Options = {
  viewportWidth: 375,
  viewportUnit: 'vw'
};

await postcss([pixelViewport(options)]).process('.a{width:75px;}', {
  from: undefined
});
