export const isBrowser = typeof window !== 'undefined';

export const toError = (value: unknown, fallback = 'Une erreur est survenue.'): Error =>
  value instanceof Error ? value : new Error(fallback);
