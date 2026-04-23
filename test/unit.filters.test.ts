import { describe, expect, it } from 'vitest';
import { isFileAllowed } from '../src/filters/file-filter';
import { shouldTransformProperty } from '../src/filters/prop-filter';
import { isSelectorAllowed } from '../src/filters/selector-filter';
import { normalizeOptions } from '../src/options';

describe('filters', () => {
  it('matches propList includes and excludes', () => {
    const { options } = normalizeOptions({
      propList: ['*', '!border*'],
      propertyBlacklist: ['font']
    });

    expect(shouldTransformProperty('margin', options, {})).toBe(true);
    expect(shouldTransformProperty('border-width', options, {})).toBe(false);
    expect(shouldTransformProperty('font-size', options, {})).toBe(false);
  });

  it('allows enable comments to bypass property filters', () => {
    const { options } = normalizeOptions({
      propertyBlacklist: ['font']
    });

    expect(
      shouldTransformProperty('font-size', options, {
        force: 'enable'
      })
    ).toBe(true);
  });

  it('matches selector blacklists with strings and regex', () => {
    const { options } = normalizeOptions({
      selectorBlackList: ['.ignore', /^\.legacy$/]
    });

    expect(isSelectorAllowed('.card', options)).toBe(true);
    expect(isSelectorAllowed('.ignore .card', options)).toBe(false);
    expect(isSelectorAllowed('.legacy', options)).toBe(false);
  });

  it('matches include and exclude paths cross-platform', () => {
    const { options } = normalizeOptions({
      include: ['src/components'],
      exclude: [/\.legacy\.css$/]
    });

    expect(isFileAllowed(options, 'src\\components\\button.css')).toBe(true);
    expect(isFileAllowed(options, 'src/components/button.legacy.css')).toBe(false);
    expect(isFileAllowed(options, 'src/pages/index.css')).toBe(false);
  });
});
