# Launch Copy

Prepared for the current public release of `postcss-pixel-viewport` `0.1.2`.

## Links

- npm: <https://www.npmjs.com/package/postcss-pixel-viewport>
- GitHub: <https://github.com/mithenji/postcss-pixel-viewport>
- Migration guide: <https://github.com/mithenji/postcss-pixel-viewport/blob/main/docs/migration-from-postcss-pixel-to-viewport.md>
- Examples: <https://github.com/mithenji/postcss-pixel-viewport/blob/main/examples/README.md>

## Short Post (English)

Released `postcss-pixel-viewport` `0.1.2`.

A modern PostCSS 8+ replacement for legacy pixel-to-viewport plugins:

- PostCSS 8 plugin API
- TypeScript types included
- ESM + CommonJS support
- compatibility-oriented defaults
- migration guide, examples, CI, npm publishing, and GitHub Releases

npm: <https://www.npmjs.com/package/postcss-pixel-viewport>
repo: <https://github.com/mithenji/postcss-pixel-viewport>

## Short Post (Chinese)

`postcss-pixel-viewport` `0.1.2` 已发布。

这是一个面向 PostCSS 8+ 的现代化 `px -> viewport` 插件，目标是成为旧版 pixel-to-viewport 类库的兼容替代和长期维护方案。

- 支持 PostCSS 8 插件 API
- 内置 TypeScript 类型
- 同时支持 ESM / CommonJS
- 默认配置尽量兼容旧用法
- 提供迁移文档、示例项目、CI、npm 发布流和 GitHub Release

npm：<https://www.npmjs.com/package/postcss-pixel-viewport>
GitHub：<https://github.com/mithenji/postcss-pixel-viewport>

## Long Post (English)

I just published `postcss-pixel-viewport`, a fresh implementation of a pixel-to-viewport PostCSS plugin for modern toolchains.

The goal was not to fork an abandoned package, but to rebuild the practical behavior people still rely on and move it onto a cleaner foundation:

- PostCSS 8+
- TypeScript public types
- ESM and CommonJS outputs
- stronger tests and smoke coverage
- documented release automation

It keeps familiar defaults such as `viewportWidth: 750`, `minPixelValue: 2`, and trailing `/*on*/` / `/*off*/` declaration directives, while adding modern options like `include`, `exclude`, `overrides`, `ignoreProps`, and structured warnings.

If you are migrating from `postcss-pixel-to-viewport`, there is also a dedicated migration guide and runnable examples in the repository.

## Long Post (Chinese)

刚把 `postcss-pixel-viewport` 发布出来。

它不是对旧库的简单 fork，而是一次面向现代工具链的重写：目标是在尽量保留原有使用习惯的前提下，把这个方向的插件带回到一个更容易维护、也更适合 PostCSS 8+ 生态的基础上。

这次重写重点放在几个方面：

- 采用 PostCSS 8 官方插件 API
- 提供 TypeScript 类型
- 同时产出 ESM / CommonJS
- 用更完整的测试和 smoke case 兜底
- 把 CI、npm 发布和 GitHub Release 流程补齐

它保留了很多历史项目真正依赖的行为，比如：

- `viewportWidth: 750`
- `minPixelValue: 2`
- 声明后紧邻的 `/*on*/` / `/*off*/` 注释指令

同时也补上了更现代的能力，例如 `include`、`exclude`、`overrides`、`ignoreProps` 和结构化 warning。

如果你正从 `postcss-pixel-to-viewport` 迁移，可以直接看仓库里的 migration guide 和 examples。

## Release Highlights

- PostCSS 8+ native plugin API
- TypeScript types included
- ESM and CommonJS package entry points
- legacy-friendly defaults
- runnable examples and Vite playground
- automated npm publish with GitHub Release output
