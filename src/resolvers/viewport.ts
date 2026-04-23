import type { AtRule, Container } from 'postcss';

type PostcssNodeLike = {
  type: string;
  parent?: PostcssNodeLike;
  name?: string;
  params?: string;
};

export function findOrientation(
  parent: Container | undefined,
  params?: string
): 'landscape' | 'portrait' | undefined {
  const direct = readOrientation(params);
  if (direct) {
    return direct;
  }

  let current: PostcssNodeLike | undefined = parent as PostcssNodeLike | undefined;

  while (current) {
    if (current.type === 'atrule') {
      const atRule = current as AtRule;
      if (atRule.name.toLowerCase() === 'media') {
        const orientation = readOrientation(atRule.params);
        if (orientation) {
          return orientation;
        }
      }
    }

    current = current.parent;
  }

  return undefined;
}

function readOrientation(params?: string): 'landscape' | 'portrait' | undefined {
  if (!params) {
    return undefined;
  }

  if (/\borientation\s*:\s*landscape\b/i.test(params)) {
    return 'landscape';
  }

  if (/\borientation\s*:\s*portrait\b/i.test(params)) {
    return 'portrait';
  }

  return undefined;
}
