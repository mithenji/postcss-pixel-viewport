# Vite Playground

This playground is a lightweight way to test `postcss-pixel-viewport` in a modern dev server instead of only generating static example output.

## Run

```sh
cd playground/vite
npm install
npm run dev
```

Then open the local Vite URL and resize the viewport width. The demo is configured around a 390px mobile design width, so spacing, radii, and typography will scale with the browser width.

## What It Demonstrates

- Vite loading a local `file:../..` dependency during plugin development
- `viewportWidth: 390`
- `viewportUnit: 'vw'`
- `fontViewportUnit: 'vw'`
- `mediaQuery: true`
- default `minPixelValue: 2`, so `1px` borders stay crisp
- a trailing `/*off*/` directive that keeps one text line in pixels

## Files

- [index.html](index.html)
- [postcss.config.cjs](postcss.config.cjs)
- [src/style.css](src/style.css)
