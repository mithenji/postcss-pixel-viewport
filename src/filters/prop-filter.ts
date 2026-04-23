import type { DeclarationDirective } from '../utils/comments';
import type { NormalizedOptions } from '../types/internal';
import { matchesAny, propListMatches } from '../utils/match';

export function shouldTransformProperty(
  prop: string,
  options: NormalizedOptions,
  directive: DeclarationDirective
): boolean {
  if (!options.transformCustomProperties && prop.startsWith('--')) {
    return false;
  }

  if (directive.force === 'enable') {
    return true;
  }

  if (!propListMatches(prop, options.propList)) {
    return false;
  }

  if (matchesAny(prop, options.propertyBlacklist, { prop })) {
    return false;
  }

  if (matchesAny(prop, options.ignoreProps, { prop })) {
    return false;
  }

  return true;
}

export function isFontProperty(prop?: string): boolean {
  if (!prop) {
    return false;
  }

  return prop === 'font' || prop.startsWith('font-') || prop.includes('font');
}
