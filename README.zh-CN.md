# postcss-pixel-viewport

一个现代化、从零实现的 PostCSS 8+ 插件，用于把像素单位转换为 viewport 相对单位。它定位为旧库 `postcss-pixel-to-viewport` 的兼容替代和长期维护后继方案。

## 环境要求

- Node.js >= 18.18
- PostCSS >= 8.4
- 内置 TypeScript 类型
- 同时支持 ESM 和 CommonJS

## 安装

```sh
npm install postcss-pixel-viewport postcss --save-dev
```

## 基础用法

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

## PostCSS 配置

### postcss.config.cjs

```js
const pixelViewport = require('postcss-pixel-viewport');

module.exports = {
  plugins: [pixelViewport({ viewportWidth: 750 })]
};
```

### postcss.config.mjs

```js
import pixelViewport from 'postcss-pixel-viewport';

export default {
  plugins: [pixelViewport({ viewportWidth: 750 })]
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
                plugins: [pixelViewport({ viewportWidth: 750 })]
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
  plugins: [pixelViewport({ viewportWidth: 750 })]
};
```

```sh
npx postcss src/input.css -o dist/output.css
```

## 默认配置

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

## 兼容配置项

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `unitToConvert` | `'px'` | 要转换的源单位。 |
| `viewportWidth` | `750` | 设计稿宽度，按 `value / viewportWidth * 100` 计算。 |
| `unitPrecision` | `5` | 输出数值精度。 |
| `viewportUnit` | `'vmin'` | 非字体属性的目标 viewport 单位。 |
| `fontViewportUnit` | `'vmin'` | `font` 和 `font-*` 属性的目标单位。 |
| `propList` | `['*']` | 属性白名单/黑名单，支持 `*` 通配和 `!` 排除。 |
| `propertyBlacklist` | `[]` | 旧库属性黑名单。字符串为包含匹配，正则为 `test`。 |
| `propertyBlackList` | 无 | 历史 typo 别名，会通过 PostCSS warning 提醒迁移。 |
| `selectorBlackList` | `[]` | 选择器黑名单。字符串为包含匹配，正则为 `test`。 |
| `minPixelValue` | `2` | 绝对值小于等于该阈值时不转换。 |
| `mediaQuery` | `false` | 是否转换 `@media` 参数里的 px。 |
| `replace` | `true` | 直接替换原声明。为 false 时在原声明后追加转换声明。 |
| `enableConvertComment` | `'on'` | 声明后紧邻注释，强制转换该声明。 |
| `disableConvertComment` | `'off'` | 声明后紧邻注释，禁用该声明转换。 |

属性过滤优先级为：文件 include/exclude、选择器黑名单、自定义属性策略、`/*off*/`、`/*on*/`、`propList`、`propertyBlacklist`、`ignoreProps`。其中 `/*on*/` 会绕过属性过滤，用于兼容旧库用法。

## 增强配置项

| 配置项 | 默认值 | 稳定性 | 说明 |
| --- | --- | --- | --- |
| `include` | 无 | stable | 只处理匹配文件。支持字符串、正则、函数或数组。 |
| `exclude` | 无 | stable | 跳过匹配文件。支持字符串、正则、函数或数组。 |
| `overrides` | `[]` | stable | 按文件覆盖配置，适合不同目录使用不同设计稿宽度。 |
| `conversionMap` | 无 | advanced | 添加额外源单位转换，例如 `rpx -> vw`。 |
| `landscape` | `false` | advanced | landscape 方向配置简写，`true` 使用 `vw`。 |
| `orientation` | 无 | advanced | 根据 media query 中的方向设置转换参数。 |
| `debug` | `false` | advanced | 向 `result.messages` 写入转换调试信息。 |
| `onWarn` | 无 | stable | 结构化 warning 回调，同时仍会产生 PostCSS warning。 |
| `preserveCommentDirectives` | `false` | stable | 保留 `/*on*/` 和 `/*off*/` 注释。 |
| `transformCustomProperties` | `true` | stable | 是否转换 CSS 自定义属性声明，默认 true 以兼容旧行为。 |
| `ignoreValues` | 无 | advanced | 跳过匹配的值 token。 |
| `ignoreFunctions` | `['url']` | stable | 跳过匹配 CSS 函数内部转换。 |
| `ignoreProps` | 无 | stable | 额外属性忽略规则。 |
| `roundStrategy` | `'round'` | advanced | 支持 `'round'`、`'floor'`、`'ceil'`。 |
| `unitScope` | 无 | advanced | 按文件、选择器、属性匹配应用单位配置。 |
| `customViewportResolver` | 无 | advanced | 高级钩子，可按每个值动态返回 `viewportWidth`。 |

## 注释指令

旧库实际使用的是声明后紧邻注释，例如 `font-size:14px;/*off*/`。本插件保持这个行为。

- `/*off*/` 只禁用紧邻前一个声明。
- `/*on*/` 只强制转换紧邻前一个声明。
- 指令注释默认会被移除。
- 独立块级注释不会切换整个 rule 或文件。
- 设置 `preserveCommentDirectives: true` 可保留注释。

## 兼容说明

本包保留旧库默认值：`viewportWidth: 750`、`viewportUnit: 'vmin'`、`minPixelValue: 2`、`mediaQuery: false`。同时保留 `propertyBlacklist` 的字符串包含匹配和声明后注释指令行为。

更多差异请看 [迁移说明](docs/migration-from-postcss-pixel-to-viewport.md)。主要实现差异是：本包使用 PostCSS 8 官方插件对象模式，并使用 value parser 更稳妥地跳过字符串与 `url()`。

## FAQ

### 为什么 `1px` 没有转换？

默认 `minPixelValue` 是 `2`，这是兼容旧库行为。如果要转换细线，设置 `minPixelValue: 0`。

### 为什么 media query 没有转换？

`mediaQuery` 默认是 `false`。设置 `mediaQuery: true`。

### 如何跳过目录？

使用 `exclude: 'vendor'`、`exclude: /node_modules/` 或 matcher 函数。

### warning 在哪里看？

使用 `onWarn` 或 PostCSS 的 `result.warnings()`。本插件不会调用 `console.warn`。

## 开发

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
