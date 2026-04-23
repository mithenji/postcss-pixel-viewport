import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { processCss } from './helpers';

const root = process.cwd();

describe('compatibility and enhanced fixtures', () => {
  it('matches the legacy README output with default options', async () => {
    const input = await readFixture('legacy-readme/input.css');
    const output = await readFixture('legacy-readme/output.css');

    await expect(processCss(input)).resolves.toBe(output);
  });

  it('matches enhanced feature fixture output', async () => {
    const input = await readFixture('enhanced/input.css');
    const output = await readFixture('enhanced/output.css');

    await expect(
      processCss(input, {
        viewportWidth: 500,
        viewportUnit: 'vw',
        fontViewportUnit: 'vh',
        mediaQuery: true,
        selectorBlackList: ['.legacy'],
        transformCustomProperties: false,
        landscape: {
          viewportWidth: 500
        }
      })
    ).resolves.toBe(output);
  });
});

async function readFixture(name: string): Promise<string> {
  return readFile(join(root, 'test', 'fixtures', name), 'utf8');
}
