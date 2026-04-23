import type { RoundStrategy } from '../types/public';

export function roundNumber(
  value: number,
  precision: number,
  strategy: RoundStrategy
): number {
  const factor = 10 ** precision;

  if (strategy === 'floor') {
    return Math.floor(value * factor) / factor;
  }

  if (strategy === 'ceil') {
    return Math.ceil(value * factor) / factor;
  }

  return Number(value.toFixed(precision));
}

export function stripTrailingZeros(value: number): string {
  return String(Number(value));
}

export function convertNumberToViewport(
  pixels: number,
  viewportWidth: number,
  precision: number,
  strategy: RoundStrategy
): number {
  return roundNumber((pixels / viewportWidth) * 100, precision, strategy);
}
