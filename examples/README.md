# Examples

This repository includes two package-friendly examples that ship with the npm tarball, plus one repo-only playground for manual exploration.

## Quick Commands

```sh
npm run example:basic
npm run example:advanced
cd playground/vite
npm install
npm run dev
```

## `examples/basic`

- Minimal `postcss-cli` usage with the plugin defaults.
- Good for checking the core `px -> vmin` conversion path.
- Source: [examples/basic/src/input.css](basic/src/input.css)
- Output: [examples/basic/src/output.css](basic/src/output.css)

## `examples/advanced`

- Shows `mediaQuery: true`, `replace: false`, trailing `/*off*/` directives, and `selectorBlackList`.
- Good for validating migration behavior against legacy `postcss-pixel-to-viewport` usage.
- Source: [examples/advanced/src/input.css](advanced/src/input.css)
- Output: [examples/advanced/src/output.css](advanced/src/output.css)

## `playground/vite`

- A runnable Vite demo outside the published package contents.
- Uses a 390px design width with `vw` output for both layout and font sizes.
- Best for visually checking how converted values respond while resizing the browser.
- Guide: [playground/vite/README.md](../playground/vite/README.md)
