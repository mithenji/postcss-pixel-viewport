import type { Declaration, Result } from 'postcss';
import type { NormalizedOptions } from '../types/internal';
import { getDeclarationDirective, removeDirectiveComment } from '../utils/comments';
import { getParentSelector, isSelectorAllowed } from '../filters/selector-filter';
import { shouldTransformProperty } from '../filters/prop-filter';
import { convertDeclarationValue } from '../parsers/declaration-value';
import { findOrientation } from '../resolvers/viewport';

export function transformDeclaration(
  decl: Declaration,
  options: NormalizedOptions,
  result: Result,
  file?: string
): void {
  const directive = getDeclarationDirective(decl, options);

  if (directive.force === 'disable') {
    removeDirectiveComment(directive, options.preserveCommentDirectives);
    return;
  }

  if (!containsSourceUnit(decl.value, options)) {
    if (directive.force) {
      removeDirectiveComment(directive, options.preserveCommentDirectives);
    }
    return;
  }

  const selector = getParentSelector(decl.parent);
  if (!isSelectorAllowed(selector, options)) {
    return;
  }

  if (!shouldTransformProperty(decl.prop, options, directive)) {
    return;
  }

  const converted = convertDeclarationValue(decl.value, options, {
    file,
    prop: decl.prop,
    selector,
    orientation: findOrientation(decl.parent)
  });

  if (!converted.changed) {
    if (directive.force) {
      removeDirectiveComment(directive, options.preserveCommentDirectives);
    }
    return;
  }

  if (options.replace) {
    decl.value = converted.value;
  } else {
    decl.cloneAfter({
      value: converted.value,
      raws: {
        ...decl.raws
      }
    });
  }

  removeDirectiveComment(directive, options.preserveCommentDirectives);

  if (options.debug) {
    result.messages.push({
      type: 'postcss-pixel-viewport-debug',
      plugin: 'postcss-pixel-viewport',
      message: `Converted ${decl.prop} in ${file ?? '<inline css>'}.`
    });
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
