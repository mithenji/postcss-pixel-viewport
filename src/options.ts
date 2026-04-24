import { DEFAULT_OPTIONS } from './defaults';
import type { NormalizedOptions, NormalizeResult } from './types/internal';
import type {
  ConversionSettings,
  Options,
  OverrideRule,
  PixelViewportWarning
} from './types/public';
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
  'selectorAllowList',
  'minPixelValue',
  'mediaQuery',
  'replace',
  'enableConvertComment',
  'disableConvertComment',
  'includeFiles',
  'excludeFiles',
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
  'selectorAllowList',
  'minPixelValue',
  'mediaQuery',
  'includeFiles',
  'excludeFiles',
  'ignoreValues',
  'ignoreFunctions',
  'ignoreProps',
  'transformCustomProperties',
  'roundStrategy'
] as const;

export function normalizeOptions(rawOptions: Options = {}): NormalizeResult {
  const warnings: PixelViewportWarning[] = [];
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

  normalizeAlias(raw, warnings, {
    alias: 'include',
    target: 'includeFiles',
    aliasLabel: '`include`',
    targetLabel: '`includeFiles`',
    suggestion: 'Rename `include` to `includeFiles`.'
  });

  normalizeAlias(raw, warnings, {
    alias: 'exclude',
    target: 'excludeFiles',
    aliasLabel: '`exclude`',
    targetLabel: '`excludeFiles`',
    suggestion: 'Rename `exclude` to `excludeFiles`.'
  });

  normalizeAlias(raw, warnings, {
    alias: 'selectorWhitelist',
    target: 'selectorAllowList',
    aliasLabel: '`selectorWhitelist`',
    targetLabel: '`selectorAllowList`',
    suggestion: 'Rename `selectorWhitelist` to `selectorAllowList`.'
  });

  normalizeAlias(raw, warnings, {
    alias: 'selectorWhiteList',
    target: 'selectorAllowList',
    aliasLabel: '`selectorWhiteList`',
    targetLabel: '`selectorAllowList`',
    suggestion: 'Rename `selectorWhiteList` to `selectorAllowList`.'
  });

  if (raw.overrides) {
    raw.overrides = raw.overrides.map((override, index) =>
      normalizeOverrideRule(override, warnings, index)
    );
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

  if (
    options.includeFiles &&
    !matchesAny(normalizedFile, options.includeFiles, context)
  ) {
    return false;
  }

  if (options.excludeFiles && matchesAny(normalizedFile, options.excludeFiles, context)) {
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
    const included = override.includeFiles
      ? matchesAny(normalizedFile, override.includeFiles, context)
      : true;
    const excluded = override.excludeFiles
      ? matchesAny(normalizedFile, override.excludeFiles, context)
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

type AliasRule<T extends object> = {
  alias: keyof T;
  target: keyof T;
  aliasLabel: string;
  targetLabel: string;
  suggestion: string;
};

function normalizeAlias<T extends object>(
  raw: T,
  warnings: NormalizeResult['warnings'],
  rule: AliasRule<T>
): void {
  const aliasValue = raw[rule.alias];
  if (aliasValue === undefined) {
    return;
  }

  warnings.push(
    warning(
      'deprecated-option',
      `${rule.aliasLabel} is deprecated. Use ${rule.targetLabel} instead.`,
      {
        option: String(rule.alias),
        suggestion: rule.suggestion
      }
    )
  );

  if (raw[rule.target] === undefined) {
    raw[rule.target] = aliasValue;
  } else {
    warnings.push(
      warning(
        'conflicting-option',
        `${rule.targetLabel} and deprecated ${rule.aliasLabel} were both provided. ${rule.targetLabel} wins.`,
        {
          option: String(rule.alias),
          suggestion: `Keep only ${rule.targetLabel}.`
        }
      )
    );
  }
}

function normalizeOverrideRule(
  override: OverrideRule,
  warnings: NormalizeResult['warnings'],
  index: number
): OverrideRule {
  const normalized = { ...override };
  normalizeAlias(normalized, warnings, {
    alias: 'include',
    target: 'includeFiles',
    aliasLabel: `overrides[${index}].include`,
    targetLabel: `overrides[${index}].includeFiles`,
    suggestion: `Rename overrides[${index}].include to overrides[${index}].includeFiles.`
  });
  normalizeAlias(normalized, warnings, {
    alias: 'exclude',
    target: 'excludeFiles',
    aliasLabel: `overrides[${index}].exclude`,
    targetLabel: `overrides[${index}].excludeFiles`,
    suggestion: `Rename overrides[${index}].exclude to overrides[${index}].excludeFiles.`
  });
  normalizeAlias(normalized, warnings, {
    alias: 'selectorWhitelist',
    target: 'selectorAllowList',
    aliasLabel: `overrides[${index}].selectorWhitelist`,
    targetLabel: `overrides[${index}].selectorAllowList`,
    suggestion: `Rename overrides[${index}].selectorWhitelist to overrides[${index}].selectorAllowList.`
  });
  normalizeAlias(normalized, warnings, {
    alias: 'selectorWhiteList',
    target: 'selectorAllowList',
    aliasLabel: `overrides[${index}].selectorWhiteList`,
    targetLabel: `overrides[${index}].selectorAllowList`,
    suggestion: `Rename overrides[${index}].selectorWhiteList to overrides[${index}].selectorAllowList.`
  });

  return normalized;
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
