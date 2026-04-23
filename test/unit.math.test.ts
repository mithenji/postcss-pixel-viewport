import { describe, expect, it } from 'vitest';
import { convertNumberToViewport, roundNumber, stripTrailingZeros } from '../src/utils/math';

describe('math utilities', () => {
  it('rounds with fixed precision by default', () => {
    expect(roundNumber(1.266666, 5, 'round')).toBe(1.26667);
    expect(stripTrailingZeros(4)).toBe('4');
  });

  it('supports floor and ceil strategies', () => {
    expect(roundNumber(1.239, 2, 'floor')).toBe(1.23);
    expect(roundNumber(1.231, 2, 'ceil')).toBe(1.24);
  });

  it('converts pixels to viewport units', () => {
    expect(convertNumberToViewport(20, 750, 5, 'round')).toBe(2.66667);
  });
});
