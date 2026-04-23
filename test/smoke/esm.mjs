import postcss from 'postcss';
import pixelViewport, { postcssPixelViewport } from '../../dist/index.js';

if (pixelViewport !== postcssPixelViewport) {
  throw new TypeError('ESM default and named exports should reference the same factory');
}

const result = await postcss([pixelViewport()]).process('.a{width:20px;}', {
  from: undefined
});

if (result.css !== '.a{width:2.66667vmin;}') {
  throw new Error(`Unexpected ESM output: ${result.css}`);
}
