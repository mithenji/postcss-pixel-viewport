import { readFileSync } from 'node:fs';

const rawVersion = process.argv[2];

if (!rawVersion) {
  console.error('Usage: node scripts/extract-release-notes.mjs <version>');
  process.exit(1);
}

const version = rawVersion.startsWith('v') ? rawVersion.slice(1) : rawVersion;

const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
const headingPattern = new RegExp(`^## \\[${version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\](?:\\s+-\\s+.+)?$`, 'm');
const headingMatch = changelog.match(headingPattern);

if (!headingMatch || headingMatch.index === undefined) {
  console.error(`Could not find a changelog entry for version ${rawVersion}.`);
  process.exit(1);
}

const sectionStart = headingMatch.index + headingMatch[0].length;
const remaining = changelog.slice(sectionStart);
const nextHeadingMatch = remaining.match(/^##\s+\[/m);
const sectionEnd = nextHeadingMatch?.index ?? remaining.length;
const notes = remaining.slice(0, sectionEnd).trim();

if (!notes) {
  console.error(`Changelog entry for version ${rawVersion} is empty.`);
  process.exit(1);
}

console.log(notes);
