import postcss from 'postcss';
import pixelViewport from '../src';
import type { Options } from '../src';

export async function processCss(
  css: string,
  options: Options = {},
  from = 'test.css'
): Promise<string> {
  const result = await postcss([pixelViewport(options)]).process(css, {
    from
  });

  return result.css;
}
