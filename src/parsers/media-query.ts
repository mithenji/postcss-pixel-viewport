import type { NormalizedOptions } from '../types/internal';
import type { ConversionRuntimeContext } from '../types/internal';
import { convertParsedValue } from './declaration-value';

export function convertMediaQueryParams(
  params: string,
  options: NormalizedOptions,
  context: ConversionRuntimeContext
): { params: string; changed: boolean } {
  const result = convertParsedValue(params, options, context);

  return {
    params: result.value,
    changed: result.changed
  };
}
