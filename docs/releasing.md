# Releasing

This repository publishes to npm and creates a matching GitHub Release from the same tag.

## Release checklist

1. Update the version in `package.json`.
2. Add the matching section to `CHANGELOG.md`.
3. Merge the release commit into `main`.
4. Create and push a version tag such as `v0.1.1`.

```sh
git tag v0.1.1
git push origin v0.1.1
```

## What happens after the tag is pushed

The release workflow will:

- verify that the tag matches `package.json`
- install dependencies and run lint, typecheck, build, tests, smoke tests, and `npm pack --dry-run`
- publish the package to npm with provenance
- create a GitHub Release for the same tag
- attach the generated `.tgz` package tarball to that GitHub Release

## Manual reruns

If a release needs to be rerun from GitHub Actions, use the `Release` workflow's manual trigger and provide the existing tag name, for example `v0.1.1`.

The manual trigger is intentionally tag-based so the workflow always releases an immutable ref instead of a moving branch head.

- Keep both options enabled for a first-time release retry before npm publish succeeded.
- Disable `publish_to_npm` and keep `create_github_release` enabled when npm is already published and only the GitHub Release needs to be created or repaired.

## Notes on npm search

The package page and `npm view` usually update immediately after publish. npm search indexing can lag behind for newly published packages, sometimes for up to two weeks.
