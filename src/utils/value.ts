import type { NormalizedOptions } from '../types/internal';
import type { ConversionRuntimeContext } from '../types/internal';
import { convertNumberToViewport, stripTrailingZeros } from './math';
import { matchesAny } from './match';
import {
  getSourceUnits,
  resolveConversionSettings,
  resolveTargetUnit
} from '../resolvers/unit';

export type ConvertedUnit = {
  value: string;
  changed: boolean;
};

export function convertUnitToken(
  token: string,
  options: NormalizedOptions,
  context: ConversionRuntimeContext
): ConvertedUnit {
  let changed = false;
  let next = token;

  for (const sourceUnit of getSourceUnits(options)) {
    const pattern = createUnitPattern(sourceUnit);
    next = next.replace(pattern, (match, prefix: string, numberText: string) => {
      if (matchesAny(match, options.ignoreValues, { ...context, value: match })) {
        return match;
      }

      const pixels = Number.parseFloat(numberText);
      if (!Number.isFinite(pixels)) {
        return match;
      }

      const settings = resolveConversionSettings(
        options,
        sourceUnit,
        context,
        pixels
      );

      if (Math.abs(pixels) <= settings.minPixelValue) {
        return match;
      }

      const converted = convertNumberToViewport(
        pixels,
        settings.viewportWidth,
        settings.unitPrecision,
        settings.roundStrategy
      );
      const targetUnit = resolveTargetUnit(settings, context.prop);
      changed = true;

      return `${prefix}${stripTrailingZeros(converted)}${targetUnit}`;
    });
  }

  return {
    value: next,
    changed
  };
}

function createUnitPattern(unit: string): RegExp {
  const escaped = unit.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
  return new RegExp(
    `(^|[^A-Za-z0-9_-])(-?(?:\\d+|\\d*\\.\\d+))${escaped}\\b`,
    'gi'
  );
}
