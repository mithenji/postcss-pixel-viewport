import type { Result } from 'postcss';
import { PLUGIN_NAME } from './defaults';
import type { PixelViewportWarning, WarningHandler } from './types/public';

export function warning(
  code: PixelViewportWarning['code'],
  message: string,
  details: Omit<PixelViewportWarning, 'code' | 'message'> = {}
): PixelViewportWarning {
  return {
    code,
    message,
    ...details
  };
}

export function emitWarnings(
  warnings: PixelViewportWarning[],
  result: Result,
  onWarn?: WarningHandler
): void {
  for (const item of warnings) {
    onWarn?.(item);
    result.warn(item.message, {
      plugin: PLUGIN_NAME
    });
  }
}
