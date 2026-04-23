import { DEFAULT_OPTIONS } from './defaults';
import type { NormalizedOptions, NormalizeResult } from './types/internal';
import type { ConversionSettings, Options } from './types/public';
import { matchesAny } from './utils/match';
import { normalizePath } from './utils/path';
import { warning } from './warnings';

const NORMALIZED_KEYS = [
  'unitToConvert',
  'viewportWidth',
  'unitPrecision',
  'viewportUnit',
  'fontViewportUnit',
  'propList',
  'propertyBlacklist',
  'selectorBlackList',
  'minPixelValue',
  'mediaQuery',
  'replace',
  'enableConvertComment',
  'disableConvertComment',
  'include',
  'exclude',
  'overrides',
  'conversionMap',
  'orientation',
  'debug',
  'onWarn',
  'preserveCommentDirectives',
  'transformCustomProperties',
  'ignoreValues',
  'ignoreFunctions',
  'ignoreProps',
  'roundStrategy',
  'unitScope',
  'customViewportResolver'
] as const;

const OVERRIDE_KEYS = [
  'unitToConvert',
  'viewportWidth',
  'unitPrecision',
  'viewportUnit',
  'fontViewportUnit',
  'propList',
  'propertyBlacklist',
  'selectorBlackList',
  'minPixelValue',
  'mediaQuery',
  'include',
  'exclude',
  'ignoreValues',
  'ignoreFunctions',
  'ignoreProps',
  'transformCustomProperties',
  'roundStrategy'
] as const;

export function normalizeOptions(rawOptions: Options = {}): NormalizeResult {
  const warnings = [];
  const raw = { ...rawOptions };

  if (raw.propertyBlackList !== undefined) {
    warnings.push(
      warning(
        'deprecated-option',
        '`propertyBlackList` is deprecated. Use `propertyBlacklist` instead.',
        {
          option: 'propertyBlackList',
          suggestion: 'Rename `propertyBlackList` to `propertyBlacklist`.'
        }
      )
    );

    if (raw.propertyBlacklist === undefined) {
      raw.propertyBlacklist = raw.propertyBlackList;
    } else {
      warnings.push(
        warning(
          'conflicting-option',
          '`propertyBlacklist` and deprecated `propertyBlackList` were both provided. `propertyBlacklist` wins.',
          {
            option: 'propertyBlackList',
            suggestion: 'Keep only `propertyBlacklist`.'
          }
        )
      );
    }
  }

  if (raw.selectorBlacklist !== undefined) {
    warnings.push(
      warning(
        'deprecated-option',
        '`selectorBlacklist` is an alias. Use historical ecosystem spelling `selectorBlackList` for compatibility.',
        {
          option: 'selectorBlacklist',
          suggestion: 'Rename `selectorBlacklist` to `selectorBlackList`.'
        }
      )
    );

    if (raw.selectorBlackList === undefined) {
      raw.selectorBlackList = raw.selectorBlacklist;
    }
  }

  const orientation = normalizeOrientation(raw);

  const options: NormalizedOptions = {
    ...DEFAULT_OPTIONS,
    ...pickDefined(raw, NORMALIZED_KEYS),
    orientation
  };

  return {
    options,
    warnings
  };
}

export function shouldProcessFile(
  options: NormalizedOptions,
  file?: string
): boolean {
  if (!file) {
    return true;
  }

  const normalizedFile = normalizePath(file);
  const context = { file: normalizedFile };

  if (options.include && !matchesAny(normalizedFile, options.include, context)) {
    return false;
  }

  if (options.exclude && matchesAny(normalizedFile, options.exclude, context)) {
    return false;
  }

  return true;
}

export function resolveOptionsForFile(
  options: NormalizedOptions,
  file?: string
): NormalizedOptions {
  if (!file || options.overrides.length === 0) {
    return options;
  }

  const normalizedFile = normalizePath(file);
  let resolved = options;

  for (const override of options.overrides) {
    const context = { file: normalizedFile };
    const included = override.include
      ? matchesAny(normalizedFile, override.include, context)
      : true;
    const excluded = override.exclude
      ? matchesAny(normalizedFile, override.exclude, context)
      : false;

    if (included && !excluded) {
      resolved = {
        ...resolved,
        ...pickDefined(override, OVERRIDE_KEYS)
      };
    }
  }

  return resolved;
}

function normalizeOrientation(raw: Options): NormalizedOptions['orientation'] {
  const orientation = raw.orientation ? { ...raw.orientation } : undefined;

  if (raw.landscape === undefined) {
    return orientation;
  }

  const landscapeSettings: ConversionSettings =
    raw.landscape === true ? { viewportUnit: 'vw' } : raw.landscape || {};

  return {
    ...orientation,
    landscape: {
      ...orientation?.landscape,
      ...landscapeSettings
    }
  };
}

function pickDefined<T extends object, K extends readonly (keyof T)[]>(
  input: T,
  keys: K
): Partial<Pick<T, K[number]>> {
  const output: Partial<Pick<T, K[number]>> = {};

  for (const key of keys) {
    const value = input[key];
    if (value !== undefined) {
      output[key] = value;
    }
  }

  return output;
}
