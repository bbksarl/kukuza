const DEFAULT_API_URL = 'http://localhost:3000/api';

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

const shouldEnableMocksByDefault = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
};

export const shopEnv = {
  apiBaseUrl: normalizeBaseUrl(process.env.REACT_APP_API_URL),
  enableApiMocks: parseBoolean(process.env.REACT_APP_ENABLE_API_MOCKS, shouldEnableMocksByDefault()),
  requestTimeoutMs: 10000,
};
