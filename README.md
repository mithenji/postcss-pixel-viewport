# postcss-pixel-viewport

[![npm version](https://img.shields.io/npm/v/postcss-pixel-viewport?logo=npm)](https://www.npmjs.com/package/postcss-pixel-viewport)
[![CI](https://github.com/mithenji/postcss-pixel-viewport/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mithenji/postcss-pixel-viewport/actions/workflows/ci.yml)
[![Release](https://github.com/mithenji/postcss-pixel-viewport/actions/workflows/release.yml/badge.svg)](https://github.com/mithenji/postcss-pixel-viewport/actions/workflows/release.yml)
[![License](https://img.shields.io/github/license/mithenji/postcss-pixel-viewport)](https://github.com/mithenji/postcss-pixel-viewport/blob/main/LICENSE)

A modern, zero-from-scratch PostCSS 8+ plugin that converts pixel units into viewport-relative units. It is designed as a drop-in replacement and long-term maintained successor to legacy pixel-to-viewport plugins, especially `postcss-pixel-to-viewport`.

English | [简体中文](README.zh-CN.md)

## Quick Links

- [npm package](https://www.npmjs.com/package/postcss-pixel-viewport)
- [Examples guide](examples/README.md)
- [Vite playground](playground/vite/README.md)
- [Migration guide](docs/migration-from-postcss-pixel-to-viewport.md)
- [Changelog](CHANGELOG.md)

## Requirements

- Node.js >= 18.18
- PostCSS >= 8.4
- TypeScript types are included
- ESM and CommonJS consumers are both supported

## Install

```sh
npm install postcss-pixel-viewport postcss --save-dev
```

## Examples

- `npm run example:basic`: minimal `postcss-cli` conversion with defaults.
- `npm run example:advanced`: media queries, trailing `/*off*/` directives, and selector filtering.
- `cd playground/vite && npm install && npm run dev`: a runnable Vite demo with a 390px design width.

Maintainer docs: see [docs/releasing.md](docs/releasing.md).

## Basic Usage

```js
import postcss from 'postcss';
import pixelViewport from 'postcss-pixel-viewport';

const result = await postcss([
  pixelViewport({
    viewportWidth: 750
  })
]).process('.card{width:75px;font-size:20px;}', { from: undefined });

console.log(result.css);
// .card{width:10vmin;font-size:2.66667vmin;}
```

## CommonJS

```js
const pixelViewport = require('postcss-pixel-viewport');

module.exports = {
  plugins: [
    pixelViewport({
      viewportWidth: 750
    })
  ]
};
```

## ESM

```js
import pixelViewport from 'postcss-pixel-viewport';

export default {
  plugins: [
    pixelViewport({
      viewportWidth: 750
    })
  ]
};
```

## PostCSS Config

### postcss.config.cjs

```js
const pixelViewport = require('postcss-pixel-viewport');

module.exports = {
  plugins: [
    pixelViewport({
      viewportWidth: 750
    })
  ]
};
```

### postcss.config.mjs

```js
import pixelViewport from 'postcss-pixel-viewport';

export default {
  plugins: [
    pixelViewport({
      viewportWidth: 750
    })
  ]
};
```

## Vite

```ts
import { defineConfig } from 'vite';
import pixelViewport from 'postcss-pixel-viewport';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        pixelViewport({
          viewportWidth: 750,
          viewportUnit: 'vw'
        })
      ]
    }
  }
});
```

## webpack

```js
const pixelViewport = require('postcss-pixel-viewport');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  pixelViewport({
                    viewportWidth: 750
                  })
                ]
              }
            }
          }
        ]
      }
    ]
  }
};
```

## postcss-cli

```js
// postcss.config.cjs
const pixelViewport = require('postcss-pixel-viewport');

module.exports = {
  plugins: [
    pixelViewport({
      viewportWidth: 750
    })
  ]
};
```

```sh
npx postcss src/input.css -o dist/output.css
```

## Defaults

```ts
{
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
}
```

## Legacy-Compatible Options

| Option | Default | Description |
| --- | --- | --- |
| `unitToConvert` | `'px'` | Source unit to convert. |
| `viewportWidth` | `750` | Design viewport width used in `value / viewportWidth * 100`. |
| `unitPrecision` | `5` | Decimal precision for generated viewport values. |
| `viewportUnit` | `'vmin'` | Target viewport unit for non-font properties. |
| `fontViewportUnit` | `'vmin'` | Target viewport unit for `font` and `font-*` properties. |
| `propList` | `['*']` | Allow/deny property list. Supports `*` wildcards and `!` exclusions. |
| `propertyBlacklist` | `[]` | Legacy property blacklist. Strings use substring matching; regexes use `test`. |
| `propertyBlackList` | none | Deprecated typo alias for `propertyBlacklist`; emits a PostCSS warning. |
| `selectorBlackList` | `[]` | Selector blacklist. Strings use substring matching; regexes use `test`. |
| `selectorBlacklist` | none | Modern spelling alias for `selectorBlackList`; emits a PostCSS warning. |
| `minPixelValue` | `2` | Values with absolute pixel size <= this number are preserved. |
| `mediaQuery` | `false` | Convert px units inside `@media` params when true. |
| `replace` | `true` | Replace the original declaration. When false, append a converted clone after it. |
| `enableConvertComment` | `'on'` | Trailing declaration comment that forces conversion for that declaration. |
| `disableConvertComment` | `'off'` | Trailing declaration comment that disables conversion for that declaration. |

Filtering priority is: file `includeFiles`/`excludeFiles`, selector blacklist, selector allow list, custom property policy, `/*off*/`, `/*on*/`, `propList`, `propertyBlacklist`, `ignoreProps`. The `/*on*/` directive intentionally bypasses property filters to match legacy usage.

## Enhanced Options

| Option | Default | Stability | Description |
| --- | --- | --- | --- |
| `includeFiles` | none | stable | Process only matching files. Accepts string, regex, function, or array. |
| `excludeFiles` | none | stable | Skip matching files. Accepts string, regex, function, or array. |
| `include` | none | deprecated | Alias for `includeFiles`; emits a PostCSS warning. |
| `exclude` | none | deprecated | Alias for `excludeFiles`; emits a PostCSS warning. |
| `overrides` | `[]` | stable | File-scoped option overrides. Useful for mobile/desktop CSS folders. |
| `selectorAllowList` | none | stable | Convert only matching selectors. Blacklist rules still win. |
| `selectorWhitelist` | none | deprecated | Alias for `selectorAllowList`; emits a PostCSS warning. |
| `selectorWhiteList` | none | deprecated | Alias for `selectorAllowList`; emits a PostCSS warning. |
| `conversionMap` | none | advanced | Add source unit conversion rules, for example `rpx -> vw`. |
| `landscape` | `false` | advanced | Shorthand for landscape orientation settings. `true` uses `vw`. |
| `orientation` | none | advanced | Per-orientation conversion settings inside media queries. |
| `debug` | `false` | advanced | Pushes conversion debug messages into `result.messages`. |
| `onWarn` | none | stable | Callback for structured warnings. PostCSS warnings are still emitted. |
| `preserveCommentDirectives` | `false` | stable | Keep `/*on*/` and `/*off*/` comments in output. |
| `transformCustomProperties` | `true` | stable | Convert values in CSS custom property declarations. True keeps legacy behavior. |
| `ignoreValues` | none | advanced | Skip matching value tokens, such as `'1px'` or `/hairline/`. |
| `ignoreFunctions` | `['url']` | stable | Skip conversion inside matching CSS functions. |
| `ignoreProps` | none | stable | Additional property deny list after legacy filters. |
| `roundStrategy` | `'round'` | advanced | Supports `'round'`, `'floor'`, and `'ceil'`. |
| `unitScope` | none | advanced | Apply conversion settings by file, selector, or property matchers. |
| `customViewportResolver` | none | advanced | Hook to dynamically return `viewportWidth` per value. |

## Comment Directives

Legacy `postcss-pixel-to-viewport` placed directive comments immediately after a declaration, for example `font-size:14px;/*off*/`. This plugin keeps that behavior.

- `/*off*/` after a declaration disables conversion for that declaration only.
- `/*on*/` after a declaration forces conversion for that declaration only.
- Directive comments are removed by default.
- Standalone block comments do not toggle an entire rule or file.
- Set `preserveCommentDirectives: true` to keep directive comments.

## Compatibility Notes

This package intentionally keeps the legacy defaults from `postcss-pixel-to-viewport`: `viewportWidth: 750`, `viewportUnit: 'vmin'`, `minPixelValue: 2`, and `mediaQuery: false`. It also keeps the old trailing comment directive behavior and the old `propertyBlacklist` substring matching behavior.

Known historical differences are documented in [the migration guide](docs/migration-from-postcss-pixel-to-viewport.md). The main implementation difference is that this plugin uses the official PostCSS 8 plugin object API and a value parser, so strings and `url()` are handled more safely.

## FAQ

### Why is `1px` not converted?

The default `minPixelValue` is `2` for legacy compatibility. Set `minPixelValue: 0` if you want to convert hairlines.

### Why are media queries unchanged?

`mediaQuery` defaults to `false`, matching the old package. Set `mediaQuery: true`.

### How do I skip a folder?

Use `excludeFiles: 'vendor'`, `excludeFiles: /node_modules/`, or a matcher function.

### How do I debug warnings?

Use the `onWarn` callback or inspect `result.warnings()`. This plugin never calls `console.warn`.

## Development

```sh
npm install
npm run lint
npm run typecheck
npm run build
npm test
npm run test:smoke
npm run pack:dry
```

## License

MIT
