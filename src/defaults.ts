import type { NormalizedOptions } from './types/internal';

export const PLUGIN_NAME = 'postcss-pixel-viewport';

export const DEFAULT_OPTIONS: NormalizedOptions = {
  unitToConvert: 'px',
  viewportWidth: 750,
  unitPrecision: 5,
  viewportUnit: 'vmin',
  fontViewportUnit: 'vmin',
  propList: ['*'],
  propertyBlacklist: [],
  selectorBlackList: [],
  minPixelValue: 2,
  mediaQuery: false,
  replace: true,
  enableConvertComment: 'on',
  disableConvertComment: 'off',
  preserveCommentDirectives: false,
  transformCustomProperties: true,
  ignoreFunctions: ['url'],
  overrides: [],
  roundStrategy: 'round',
  debug: false
};
