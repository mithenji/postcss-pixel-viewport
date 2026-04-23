import type { PluginCreator } from 'postcss';
import { PLUGIN_NAME } from './defaults';
import { isFileAllowed } from './filters/file-filter';
import { normalizeOptions, resolveOptionsForFile } from './options';
import type { Options } from './types/public';
import { getProcessFile } from './utils/path';
import { transformMediaAtRule } from './visitors/at-rule-media';
import { transformDeclaration } from './visitors/declaration';
import { emitWarnings } from './warnings';

export const postcssPixelViewport: PluginCreator<Options> = (rawOptions = {}) => {
  const normalized = normalizeOptions(rawOptions);

  return {
    postcssPlugin: PLUGIN_NAME,
    Once(root, helpers) {
      const file = getProcessFile(helpers.result.opts.from);
      const options = resolveOptionsForFile(normalized.options, file);

      emitWarnings(normalized.warnings, helpers.result, options.onWarn);

      if (!isFileAllowed(options, file)) {
        return;
      }

      root.walkDecls((decl) => {
        transformDeclaration(decl, options, helpers.result, file);
      });

      root.walkAtRules('media', (atRule) => {
        transformMediaAtRule(atRule, options, file);
      });
    }
  };
};

postcssPixelViewport.postcss = true;
