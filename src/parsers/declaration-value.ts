import valueParser from 'postcss-value-parser';
import type { NormalizedOptions } from '../types/internal';
import type { ConversionRuntimeContext } from '../types/internal';
import { convertUnitToken } from '../utils/value';
import { matchesAny } from '../utils/match';

export type ConvertValueResult = {
  value: string;
  changed: boolean;
};

export function convertDeclarationValue(
  value: string,
  options: NormalizedOptions,
  context: ConversionRuntimeContext
): ConvertValueResult {
  return convertParsedValue(value, options, context);
}

export function convertParsedValue(
  value: string,
  options: NormalizedOptions,
  context: ConversionRuntimeContext
): ConvertValueResult {
  let changed = false;
  const ast = valueParser(value);

  ast.walk((node) => {
    if (node.type === 'function') {
      if (matchesAny(node.value, options.ignoreFunctions, context)) {
        return false;
      }
      return undefined;
    }

    if (node.type !== 'word') {
      return undefined;
    }

    const result = convertUnitToken(node.value, options, context);
    if (result.changed) {
      node.value = result.value;
      changed = true;
    }

    return undefined;
  });

  return {
    value: ast.toString(),
    changed
  };
}
