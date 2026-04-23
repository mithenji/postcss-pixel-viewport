import type { Comment, Declaration } from 'postcss';
import type { NormalizedOptions } from '../types/internal';

export type DeclarationDirective = {
  force?: 'enable' | 'disable';
  comment?: Comment;
};

export function getDeclarationDirective(
  decl: Declaration,
  options: NormalizedOptions
): DeclarationDirective {
  const next = decl.next();
  if (!next || next.type !== 'comment') {
    return {};
  }

  const text = next.text.trim();

  if (options.enableConvertComment !== false && text === options.enableConvertComment) {
    return {
      force: 'enable',
      comment: next
    };
  }

  if (options.disableConvertComment !== false && text === options.disableConvertComment) {
    return {
      force: 'disable',
      comment: next
    };
  }

  return {};
}

export function removeDirectiveComment(
  directive: DeclarationDirective,
  preserve: boolean
): void {
  if (!preserve && directive.comment) {
    directive.comment.remove();
  }
}
