# Migration from postcss-pixel-to-viewport

`postcss-pixel-viewport` is a new implementation, not a fork. It keeps the practical defaults and usage habits of `postcss-pixel-to-viewport` while moving to the official PostCSS 8 plugin API, TypeScript, dual package output, and a stronger test suite.

## Quick Migration

```diff
- const pixelToViewport = require('postcss-pixel-to-viewport');
+ const pixelViewport = require('postcss-pixel-viewport');

  module.exports = {
    plugins: [
-     pixelToViewport({
+     pixelViewport({
        viewportWidth: 750
      })
    ]
  };
```

## Preserved Defaults

| Behavior | Old package | New package |
| --- | --- | --- |
| Design width | `750` | `750` |
| Target unit | `vmin` | `vmin` |
| Minimum converted value | `2` | `2` |
| Media query conversion | `false` | `false` |
| Property blacklist | `propertyBlacklist` | `propertyBlacklist` |
| Inline directives | `/*on*/` and `/*off*/` after a declaration | Same |

## Important Differences

### PostCSS API

The old package used the deprecated `postcss.plugin(...)` API for PostCSS 6. The new package returns a PostCSS 8 plugin object with `postcssPlugin: 'postcss-pixel-viewport'`.

### Safer Value Parsing

The old package used a regular expression that skipped simple strings and `url()`. The new package uses `postcss-value-parser`, which avoids converting strings and ignored functions more reliably.

### Warning Strategy

The new package never calls `console.warn`. Deprecations and compatibility warnings are emitted through:

- `result.warn(...)`
- the optional `onWarn(warning)` callback

### Historical Typo Alias

Use `propertyBlacklist`. The typo `propertyBlackList` is still accepted, but it emits a warning.

```js
pixelViewport({
  // Accepted, but deprecated:
  propertyBlackList: ['font']
});
```

### Comment Scope

The old implementation looked at the comment immediately after a declaration:

```css
.a {
  font-size: 20px;/*off*/
}
```

The new implementation keeps this scope. Comments do not toggle an entire block or file.

### `replace`

The old package always replaced declarations. The new package keeps `replace: true` by default. Set `replace: false` to keep the original declaration and append a converted clone:

```css
.a {
  font-size: 20px;
  font-size: 2.66667vmin;
}
```

## Recommended Modern Options

Prefer `propList` for new projects:

```js
pixelViewport({
  propList: ['*', '!border*']
});
```

Use `includeFiles` and `excludeFiles` to avoid transforming third-party CSS:

```js
pixelViewport({
  includeFiles: 'src',
  excludeFiles: ['node_modules', /\.legacy\.css$/]
});
```

Use `overrides` for multiple design widths:

```js
pixelViewport({
  viewportWidth: 750,
  overrides: [
    {
      includeFiles: 'src/desktop',
      viewportWidth: 1440,
      viewportUnit: 'vw'
    }
  ]
});
```

## Verification Checklist

1. Run your existing CSS fixture through the old package.
2. Run the same fixture through `postcss-pixel-viewport` with default options.
3. Check these known compatibility points:
   - `1px` stays unchanged unless `minPixelValue` is lowered.
   - `@media` params stay unchanged unless `mediaQuery: true`.
   - `/*on*/` and `/*off*/` comments are trailing declaration comments.
   - `propertyBlacklist` strings match by substring.
4. Move newly written config toward `propList`, `includeFiles`, `excludeFiles`, `selectorAllowList`, and `overrides`.
