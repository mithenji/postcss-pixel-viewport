import { describe, expect, it } from 'vitest';
import { normalizeOptions } from '../src/options';
import { convertDeclarationValue } from '../src/parsers/declaration-value';

describe('declaration value parser', () => {
  it('converts negative, decimal, and multi-value px tokens', () => {
    const { options } = normalizeOptions();
    const result = convertDeclarationValue('-10px 9.5px 1px', options, {
      prop: 'margin'
    });

    expect(result).toEqual({
      changed: true,
      value: '-1.33333vmin 1.26667vmin 1px'
    });
  });

  it('does not convert strings, urls, or existing viewport units', () => {
    const { options } = normalizeOptions();
    const result = convertDeclarationValue(
      'url("/icons/16px.svg") "12px" 2vw 10px',
      options,
      {
        prop: 'background'
      }
    );

    expect(result.value).toBe('url("/icons/16px.svg") "12px" 2vw 1.33333vmin');
  });

  it('uses fontViewportUnit for font properties', () => {
    const { options } = normalizeOptions({
      fontViewportUnit: 'vw'
    });
    const result = convertDeclarationValue('16px/20px sans-serif', options, {
      prop: 'font'
    });

    expect(result.value).toBe('2.13333vw/2.66667vw sans-serif');
  });

  it('supports conversionMap for additional source units', () => {
    const { options } = normalizeOptions({
      conversionMap: {
        rpx: {
          viewportWidth: 750,
          toUnit: 'vw'
        }
      }
    });
    const result = convertDeclarationValue('75rpx 10px', options, {
      prop: 'width'
    });

    expect(result.value).toBe('10vw 1.33333vmin');
  });
});
