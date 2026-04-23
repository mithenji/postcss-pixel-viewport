import type { NormalizedOptions } from '../types/internal';
import { shouldProcessFile } from '../options';

export function isFileAllowed(options: NormalizedOptions, file?: string): boolean {
  return shouldProcessFile(options, file);
}
