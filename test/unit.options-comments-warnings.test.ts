import postcss from 'postcss';
import { describe, expect, it, vi } from 'vitest';
import pixelViewport from '../src';
import { getDeclarationDirective } from '../src/utils/comments';
import { normalizeOptions } from '../src/options';

describe('options, comments, and warnings', () => {
  it('normalizes deprecated propertyBlackList alias with warnings', () => {
    const result = normalizeOptions({
      propertyBlackList: ['font']
    });

    expect(result.options.propertyBlacklist).toEqual(['font']);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]?.code).toBe('deprecated-option');
  });

  it('parses trailing declaration directives only', () => {
    const root = postcss.parse('.a{font-size:14px;/*on*/line-height:20px;}');
    const rule = root.first;
    const decl = rule?.type === 'rule' ? rule.first : undefined;
    const { options } = normalizeOptions();

    expect(decl?.type).toBe('decl');
    if (decl?.type === 'decl') {
      expect(getDeclarationDirective(decl, options).force).toBe('enable');
    }
  });

  it('emits warnings through PostCSS and onWarn', async () => {
    const onWarn = vi.fn();
    const result = await postcss([
      pixelViewport({
        propertyBlackList: ['font'],
        onWarn
      })
    ]).process('.a{font-size:20px;}', {
      from: undefined
    });

    expect(result.warnings()).toHaveLength(1);
    expect(onWarn).toHaveBeenCalledTimes(1);
  });
});
