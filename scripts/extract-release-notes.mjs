import { readFileSync } from 'node:fs';

const version = process.argv[2];

if (!version) {
  console.error('Usage: node scripts/extract-release-notes.mjs <version>');
  process.exit(1);
}

const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
const headingPattern = new RegExp(`^## \\[${version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\](?:\\s+-\\s+.+)?$`, 'm');
const headingMatch = changelog.match(headingPattern);

if (!headingMatch || headingMatch.index === undefined) {
  console.error(`Could not find a changelog entry for version ${version}.`);
  process.exit(1);
}

const sectionStart = headingMatch.index + headingMatch[0].length;
const remaining = changelog.slice(sectionStart);
const nextHeadingMatch = remaining.match(/^##\s+\[/m);
const sectionEnd = nextHeadingMatch?.index ?? remaining.length;
const notes = remaining.slice(0, sectionEnd).trim();

if (!notes) {
  console.error(`Changelog entry for version ${version} is empty.`);
  process.exit(1);
}

console.log(notes);
