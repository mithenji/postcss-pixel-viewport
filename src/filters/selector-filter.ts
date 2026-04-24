import type { Container, Rule } from 'postcss';
import type { NormalizedOptions } from '../types/internal';
import { matchesAny } from '../utils/match';

export function getParentSelector(parent: Container | undefined): string | undefined {
  if (!parent || parent.type !== 'rule') {
    return undefined;
  }

  return (parent as Rule).selector;
}

export function isSelectorAllowed(
  selector: string | undefined,
  options: NormalizedOptions
): boolean {
  if (!selector) {
    return true;
  }

  if (matchesAny(selector, options.selectorBlackList, { selector })) {
    return false;
  }

  if (options.selectorAllowList) {
    return matchesAny(selector, options.selectorAllowList, { selector });
  }

  return true;
}
