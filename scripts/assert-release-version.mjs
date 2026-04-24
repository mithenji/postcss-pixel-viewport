import { readFileSync } from 'node:fs';

const rawTag = process.argv[2];

if (!rawTag) {
  console.error('Usage: node scripts/assert-release-version.mjs <tag>');
  process.exit(1);
}

if (!rawTag.startsWith('v')) {
  console.error(`Release tag must start with "v". Received: ${rawTag}`);
  process.exit(1);
}

const expectedVersion = rawTag.slice(1);
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

if (packageJson.version !== expectedVersion) {
  console.error(
    `Tag ${rawTag} does not match package.json version ${packageJson.version}.`
  );
  process.exit(1);
}

console.log(`Validated release tag ${rawTag} against package.json version ${packageJson.version}.`);
