export type ViewportUnit = 'vw' | 'vh' | 'vmin' | 'vmax' | (string & {});

export type RoundStrategy = 'round' | 'floor' | 'ceil';

export type MatcherContext = {
  file?: string;
  prop?: string;
  selector?: string;
  value?: string;
};

export type PatternMatcher =
  | string
  | RegExp
  | ((input: string, context: MatcherContext) => boolean);

export type MatcherInput = PatternMatcher | PatternMatcher[];

export type PropList = string[];

export type WarningCode =
  | 'deprecated-option'
  | 'conflicting-option'
  | 'invalid-option'
  | 'debug';

export type PixelViewportWarning = {
  code: WarningCode;
  message: string;
  option?: string;
  suggestion?: string;
};

export type WarningHandler = (warning: PixelViewportWarning) => void;

export type ConversionSettings = {
  viewportWidth?: number;
  unitPrecision?: number;
  viewportUnit?: ViewportUnit;
  fontViewportUnit?: ViewportUnit;
  minPixelValue?: number;
  roundStrategy?: RoundStrategy;
};

export type ConversionMapEntry = ConversionSettings & {
  unitToConvert?: string;
  toUnit?: ViewportUnit;
};

export type ConversionMap = Record<string, ViewportUnit | ConversionMapEntry>;

export type OverrideRule = ConversionSettings & {
  include?: MatcherInput;
  exclude?: MatcherInput;
  unitToConvert?: string;
  mediaQuery?: boolean;
  propList?: PropList;
  propertyBlacklist?: MatcherInput;
  selectorBlackList?: MatcherInput;
  ignoreProps?: MatcherInput;
  ignoreValues?: MatcherInput;
  ignoreFunctions?: MatcherInput;
  transformCustomProperties?: boolean;
};

export type UnitScopeRule = ConversionSettings & {
  match: PatternMatcher;
};

export type UnitScopeOptions = {
  property?: UnitScopeRule[];
  selector?: UnitScopeRule[];
  file?: UnitScopeRule[];
};

export type OrientationOptions = {
  landscape?: ConversionSettings;
  portrait?: ConversionSettings;
};

export type CustomViewportContext = {
  sourceUnit: string;
  targetUnit: ViewportUnit;
  value: number;
  file?: string;
  prop?: string;
  selector?: string;
  atRuleName?: string;
  atRuleParams?: string;
};

export type CustomViewportResolver = (
  context: CustomViewportContext
) => number | undefined;

export type Options = ConversionSettings & {
  /**
   * Source unit to convert. Defaults to `px`.
   */
  unitToConvert?: string;

  /**
   * Property allow/deny list using postcss-px-to-viewport style patterns.
   */
  propList?: PropList;

  /**
   * Legacy blacklist name from postcss-pixel-to-viewport.
   */
  propertyBlacklist?: MatcherInput;

  /**
   * Historical typo alias. Supported with a deprecation warning.
   */
  propertyBlackList?: MatcherInput;

  selectorBlackList?: MatcherInput;

  /**
   * Modern spelling alias. Supported with a deprecation warning because the
   * historical PostCSS ecosystem option uses selectorBlackList.
   */
  selectorBlacklist?: MatcherInput;

  mediaQuery?: boolean;
  replace?: boolean;
  enableConvertComment?: string | false;
  disableConvertComment?: string | false;
  include?: MatcherInput;
  exclude?: MatcherInput;
  overrides?: OverrideRule[];
  conversionMap?: ConversionMap;
  landscape?: boolean | ConversionSettings;
  orientation?: OrientationOptions;
  debug?: boolean;
  onWarn?: WarningHandler;
  preserveCommentDirectives?: boolean;
  transformCustomProperties?: boolean;
  ignoreValues?: MatcherInput;
  ignoreFunctions?: MatcherInput;
  ignoreProps?: MatcherInput;
  unitScope?: UnitScopeOptions;
  customViewportResolver?: CustomViewportResolver;
};
