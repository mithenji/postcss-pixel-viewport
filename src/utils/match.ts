import type { MatcherContext, MatcherInput, PatternMatcher } from '../types/public';
import { normalizePath } from './path';

export function toMatcherArray(input: MatcherInput | undefined): PatternMatcher[] {
  if (!input) {
    return [];
  }

  return Array.isArray(input) ? input : [input];
}

export function matchesPattern(
  input: string,
  matcher: PatternMatcher,
  context: MatcherContext = {}
): boolean {
  if (typeof matcher === 'string') {
    const normalizedInput = normalizePath(input);
    const normalizedMatcher = normalizePath(matcher);
    return normalizedInput.includes(normalizedMatcher);
  }

  if (matcher instanceof RegExp) {
    matcher.lastIndex = 0;
    return matcher.test(input);
  }

  return matcher(input, context);
}

export function matchesAny(
  input: string | undefined,
  matchers: MatcherInput | undefined,
  context: MatcherContext = {}
): boolean {
  if (!input) {
    return false;
  }

  return toMatcherArray(matchers).some((matcher) =>
    matchesPattern(input, matcher, context)
  );
}

export function matchesAll(
  input: string | undefined,
  matchers: MatcherInput | undefined,
  context: MatcherContext = {}
): boolean {
  if (!input) {
    return false;
  }

  const list = toMatcherArray(matchers);
  return list.length > 0 && list.every((matcher) => matchesPattern(input, matcher, context));
}

export function propListMatches(prop: string, propList: string[]): boolean {
  const includes = propList.filter((item) => !item.startsWith('!'));
  const excludes = propList
    .filter((item) => item.startsWith('!'))
    .map((item) => item.slice(1));

  const included =
    includes.length === 0 || includes.some((pattern) => wildcardMatch(prop, pattern));
  const excluded = excludes.some((pattern) => wildcardMatch(prop, pattern));

  return included && !excluded;
}

function wildcardMatch(input: string, pattern: string): boolean {
  if (pattern === '*') {
    return true;
  }

  if (!pattern.includes('*')) {
    return input === pattern;
  }

  const escaped = pattern
    .split('*')
    .map((part) => part.replace(/[|\\{}()[\]^$+?.]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${escaped}$`).test(input);
}
