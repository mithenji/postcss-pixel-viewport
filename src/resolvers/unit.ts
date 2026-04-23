import type {
  ConversionMapEntry,
  ConversionSettings,
  ViewportUnit
} from '../types/public';
import type {
  ConversionRuntimeContext,
  EffectiveConversionSettings,
  NormalizedOptions
} from '../types/internal';
import { isFontProperty } from '../filters/prop-filter';
import { matchesPattern } from '../utils/match';

export function getSourceUnits(options: NormalizedOptions): string[] {
  const units = new Set<string>([options.unitToConvert.toLowerCase()]);

  if (options.conversionMap) {
    for (const unit of Object.keys(options.conversionMap)) {
      units.add(unit.toLowerCase());
    }
  }

  return [...units].sort((a, b) => b.length - a.length);
}

export function resolveConversionSettings(
  options: NormalizedOptions,
  sourceUnit: string,
  context: ConversionRuntimeContext,
  numericValue: number
): EffectiveConversionSettings {
  let settings: EffectiveConversionSettings = {
    viewportWidth: options.viewportWidth,
    unitPrecision: options.unitPrecision,
    viewportUnit: options.viewportUnit,
    fontViewportUnit: options.fontViewportUnit,
    minPixelValue: options.minPixelValue,
    roundStrategy: options.roundStrategy
  };

  settings = applyConversionMap(settings, options, sourceUnit);
  settings = applyOrientation(settings, options, context);
  settings = applyUnitScope(settings, options, context);

  const targetUnit = isFontProperty(context.prop)
    ? settings.fontViewportUnit
    : settings.viewportUnit;

  const customViewportWidth = options.customViewportResolver?.({
    sourceUnit,
    targetUnit,
    value: numericValue,
    file: context.file,
    prop: context.prop,
    selector: context.selector,
    atRuleName: context.atRuleName,
    atRuleParams: context.atRuleParams
  });

  if (typeof customViewportWidth === 'number' && Number.isFinite(customViewportWidth)) {
    settings = {
      ...settings,
      viewportWidth: customViewportWidth
    };
  }

  return settings;
}

export function resolveTargetUnit(
  settings: EffectiveConversionSettings,
  prop?: string
): ViewportUnit {
  return isFontProperty(prop) ? settings.fontViewportUnit : settings.viewportUnit;
}

function applyConversionMap(
  settings: EffectiveConversionSettings,
  options: NormalizedOptions,
  sourceUnit: string
): EffectiveConversionSettings {
  const mapEntry = options.conversionMap?.[sourceUnit];
  if (!mapEntry) {
    return settings;
  }

  if (typeof mapEntry === 'string') {
    return {
      ...settings,
      viewportUnit: mapEntry
    };
  }

  return mergeSettings(settings, {
    ...mapEntry,
    viewportUnit: mapEntry.toUnit ?? mapEntry.viewportUnit
  });
}

function applyOrientation(
  settings: EffectiveConversionSettings,
  options: NormalizedOptions,
  context: ConversionRuntimeContext
): EffectiveConversionSettings {
  if (!context.orientation || !options.orientation?.[context.orientation]) {
    return settings;
  }

  return mergeSettings(settings, options.orientation[context.orientation]);
}

function applyUnitScope(
  settings: EffectiveConversionSettings,
  options: NormalizedOptions,
  context: ConversionRuntimeContext
): EffectiveConversionSettings {
  let resolved = settings;

  for (const rule of options.unitScope?.file ?? []) {
    if (context.file && matchesPattern(context.file, rule.match, { file: context.file })) {
      resolved = mergeSettings(resolved, rule);
    }
  }

  for (const rule of options.unitScope?.selector ?? []) {
    if (
      context.selector &&
      matchesPattern(context.selector, rule.match, {
        file: context.file,
        selector: context.selector
      })
    ) {
      resolved = mergeSettings(resolved, rule);
    }
  }

  for (const rule of options.unitScope?.property ?? []) {
    if (
      context.prop &&
      matchesPattern(context.prop, rule.match, {
        file: context.file,
        prop: context.prop,
        selector: context.selector
      })
    ) {
      resolved = mergeSettings(resolved, rule);
    }
  }

  return resolved;
}

function mergeSettings(
  base: EffectiveConversionSettings,
  next: ConversionSettings | ConversionMapEntry | undefined
): EffectiveConversionSettings {
  if (!next) {
    return base;
  }

  return {
    ...base,
    ...definedSettings(next)
  };
}

function definedSettings(
  settings: ConversionSettings | ConversionMapEntry
): Partial<EffectiveConversionSettings> {
  const result: Partial<EffectiveConversionSettings> = {};

  if (settings.viewportWidth !== undefined) {
    result.viewportWidth = settings.viewportWidth;
  }
  if (settings.unitPrecision !== undefined) {
    result.unitPrecision = settings.unitPrecision;
  }
  if (settings.viewportUnit !== undefined) {
    result.viewportUnit = settings.viewportUnit;
  }
  if (settings.fontViewportUnit !== undefined) {
    result.fontViewportUnit = settings.fontViewportUnit;
  }
  if (settings.minPixelValue !== undefined) {
    result.minPixelValue = settings.minPixelValue;
  }
  if (settings.roundStrategy !== undefined) {
    result.roundStrategy = settings.roundStrategy;
  }

  return result;
}
