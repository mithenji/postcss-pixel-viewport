# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-04-24

### Fixed

- Release notes extraction now accepts `v`-prefixed git tags such as `v0.1.2`, matching the release workflow input format.

## [0.1.1] - 2026-04-24

### Added

- Automated GitHub Release creation for version tags, including attached npm package tarballs.
- A documented release checklist in `docs/releasing.md`.

### Changed

- Release workflow now validates that the pushed tag matches `package.json`.
- Manual release reruns can now skip npm publish and repair GitHub Releases independently.
- npm publishing now uses provenance metadata.

## [0.1.0] - 2026-04-22

### Added

- Initial PostCSS 8+ implementation.
- Legacy-compatible defaults inspired by `postcss-pixel-to-viewport`.
- TypeScript public options and warning types.
- ESM and CommonJS package entry points.
- Declaration, media query, file, property, selector, comment directive, and override support.
- Unit, integration, compatibility fixture, and consumer smoke tests.
- English and Chinese documentation, migration notes, examples, CI, and release workflow.
