import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import pixelViewport from '../src';
import { processCss } from './helpers';

describe('postcss plugin integration', () => {
  it('converts declarations with legacy defaults', async () => {
    await expect(
      processCss('.a{margin:-10px .5vh;padding:5vmin 9.5px 1px;}')
    ).resolves.toBe('.a{margin:-1.33333vmin .5vh;padding:5vmin 1.26667vmin 1px;}');
  });

  it('converts media query params only when enabled', async () => {
    const css = '@media (min-width: 750px){.a{font-size:16px;}}';

    await expect(processCss(css)).resolves.toBe(
      '@media (min-width: 750px){.a{font-size:2.13333vmin;}}'
    );
    await expect(processCss(css, { mediaQuery: true })).resolves.toBe(
      '@media (min-width: 100vmin){.a{font-size:2.13333vmin;}}'
    );
  });

  it('supports replace=false by appending converted declarations', async () => {
    await expect(
      processCss('.a{font-size:20px;}', {
        replace: false
      })
    ).resolves.toBe('.a{font-size:20px;font-size:2.66667vmin;}');
  });

  it('honors comment directives and removes them by default', async () => {
    const css = '.a{font-size:20px;/*off*/line-height:20px;/*on*/}';

    await expect(
      processCss(css, {
        propertyBlacklist: ['line-height']
      })
    ).resolves.toBe('.a{font-size:20px;line-height:2.66667vmin;}');
  });

  it('preserves comment directives when requested', async () => {
    await expect(
      processCss('.a{font-size:20px;/*off*/}', {
        preserveCommentDirectives: true
      })
    ).resolves.toBe('.a{font-size:20px;/*off*/}');
  });

  it('does not let standalone block comments toggle conversion', async () => {
    await expect(processCss('.a{/*off*/font-size:20px;}')).resolves.toBe(
      '.a{/*off*/font-size:2.66667vmin;}'
    );
  });

  it('supports include, exclude, and overrides', async () => {
    const css = '.a{width:75px;}';

    await expect(
      processCss(
        css,
        {
          include: 'src',
          overrides: [
            {
              include: 'src/mobile',
              viewportWidth: 375,
              viewportUnit: 'vw'
            }
          ]
        },
        'src/mobile/button.css'
      )
    ).resolves.toBe('.a{width:20vw;}');

    await expect(
      processCss(
        css,
        {
          include: 'src',
          exclude: 'vendor'
        },
        'vendor/button.css'
      )
    ).resolves.toBe(css);
  });

  it('supports source maps', async () => {
    const result = await postcss([pixelViewport()]).process('.a{width:20px;}', {
      from: 'input.css',
      to: 'output.css',
      map: {
        inline: false
      }
    });

    expect(result.map).toBeTruthy();
    expect(result.css).toContain('2.66667vmin');
  });

  it('supports customViewportResolver and orientation overrides', async () => {
    const css =
      '@media (orientation: landscape){.a{width:100px;font-size:20px;}}';

    await expect(
      processCss(css, {
        landscape: {
          viewportWidth: 1000,
          viewportUnit: 'vw'
        },
        customViewportResolver(context) {
          return context.prop === 'font-size' ? 500 : undefined;
        }
      })
    ).resolves.toBe(
      '@media (orientation: landscape){.a{width:10vw;font-size:4vmin;}}'
    );
  });
});
