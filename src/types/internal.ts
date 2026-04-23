import type {
  ConversionMap,
  CustomViewportResolver,
  MatcherInput,
  Options,
  OrientationOptions,
  OverrideRule,
  PixelViewportWarning,
  RoundStrategy,
  UnitScopeOptions,
  ViewportUnit,
  WarningHandler
} from './public';

export type NormalizedOptions = Required<
  Pick<
    Options,
    | 'unitToConvert'
    | 'viewportWidth'
    | 'unitPrecision'
    | 'viewportUnit'
    | 'fontViewportUnit'
    | 'propList'
    | 'minPixelValue'
    | 'mediaQuery'
    | 'replace'
    | 'enableConvertComment'
    | 'disableConvertComment'
    | 'preserveCommentDirectives'
    | 'transformCustomProperties'
    | 'roundStrategy'
    | 'debug'
  >
> & {
  propertyBlacklist: MatcherInput;
  selectorBlackList: MatcherInput;
  include?: MatcherInput;
  exclude?: MatcherInput;
  overrides: OverrideRule[];
  conversionMap?: ConversionMap;
  orientation?: OrientationOptions;
  ignoreValues?: MatcherInput;
  ignoreFunctions: MatcherInput;
  ignoreProps?: MatcherInput;
  unitScope?: UnitScopeOptions;
  customViewportResolver?: CustomViewportResolver;
  onWarn?: WarningHandler;
};

export type NormalizeResult = {
  options: NormalizedOptions;
  warnings: PixelViewportWarning[];
};

export type ConversionRuntimeContext = {
  file?: string;
  prop?: string;
  selector?: string;
  atRuleName?: string;
  atRuleParams?: string;
  orientation?: 'landscape' | 'portrait';
};

export type EffectiveConversionSettings = {
  viewportWidth: number;
  unitPrecision: number;
  viewportUnit: ViewportUnit;
  fontViewportUnit: ViewportUnit;
  minPixelValue: number;
  roundStrategy: RoundStrategy;
};
