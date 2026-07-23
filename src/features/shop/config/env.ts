const DEFAULT_API_URL = '/api';

const runtimeEnv: Record<string, string | undefined> =
  (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env ??
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ??
  {};

const normalizeBaseUrl = (value: string | undefined): string => {
  const resolved = value?.trim() || DEFAULT_API_URL;
  return resolved.replace(/\/+$/, '');
};

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return fallback;
};

export const shopEnv = {
  apiBaseUrl: normalizeBaseUrl(runtimeEnv.REACT_APP_API_URL ?? runtimeEnv.VITE_API_BASE_URL),
  enableApiMocks: parseBoolean(runtimeEnv.REACT_APP_ENABLE_API_MOCKS ?? runtimeEnv.VITE_ENABLE_API_MOCKS, false),
  requestTimeoutMs: 10000,
};
