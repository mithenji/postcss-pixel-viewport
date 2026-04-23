# Release Checklist

This repository is release-ready for npm once the package metadata points at the final GitHub repository and npm publishing access is configured.

## Before Publishing

- [ ] Update `repository`, `homepage`, and `bugs` in `package.json`.
- [ ] Confirm the npm package name `postcss-pixel-viewport` is available or owned by the publisher.
- [ ] Confirm npm 2FA requirements for the publishing account.
- [ ] Push this project to the final public GitHub repository.
- [ ] Enable GitHub Actions for the repository.
- [ ] Configure npm Trusted Publishing for GitHub Actions:
  - Organization or user: the GitHub owner.
  - Repository: the GitHub repository name.
  - Workflow filename: `release.yml`.
- [ ] Review `README.md`, `README.zh-CN.md`, and migration docs.
- [ ] Update `CHANGELOG.md` with the release date and changes.
- [ ] Ensure all examples still match generated output.

## Local Validation

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npm test
npm run test:smoke
npm run example:basic
npm run example:advanced
npm run pack:dry
```

## First npm Publish

```sh
npm version patch
git push --follow-tags
```

If npm Trusted Publishing cannot be configured before the package exists on npm, publish the first version manually with `npm publish --access public --provenance`, then configure Trusted Publishing immediately afterward.

## GitHub Actions Release

The included release workflow runs when a tag such as `v0.1.0` is pushed. It can also be run manually from GitHub Actions with a tag input.

The workflow runs:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run test:smoke`
- `npm pack --dry-run`
- `npm publish --access public`

When npm Trusted Publishing is configured, GitHub Actions uses OIDC for the publish operation, so no `NPM_TOKEN` secret is required. Provenance is generated automatically for public packages published from public GitHub repositories.
