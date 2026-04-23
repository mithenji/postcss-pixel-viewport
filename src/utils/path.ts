export function normalizePath(input: string): string {
  return input.replace(/\\/g, '/');
}

export function getProcessFile(from?: string): string | undefined {
  return from ? normalizePath(from) : undefined;
}
