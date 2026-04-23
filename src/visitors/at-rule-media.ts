import type { AtRule } from 'postcss';
import type { NormalizedOptions } from '../types/internal';
import { convertMediaQueryParams } from '../parsers/media-query';
import { findOrientation } from '../resolvers/viewport';

export function transformMediaAtRule(
  atRule: AtRule,
  options: NormalizedOptions,
  file?: string
): void {
  if (!options.mediaQuery) {
    return;
  }

  if (!containsSourceUnit(atRule.params, options)) {
    return;
  }

  const converted = convertMediaQueryParams(atRule.params, options, {
    file,
    atRuleName: atRule.name,
    atRuleParams: atRule.params,
    orientation: findOrientation(atRule.parent, atRule.params)
  });

  if (converted.changed) {
    atRule.params = converted.params;
  }
}

function containsSourceUnit(value: string, options: NormalizedOptions): boolean {
  if (value.toLowerCase().includes(options.unitToConvert.toLowerCase())) {
    return true;
  }

  return Object.keys(options.conversionMap ?? {}).some((unit) =>
    value.toLowerCase().includes(unit.toLowerCase())
  );
}
