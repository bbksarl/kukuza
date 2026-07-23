
const getEnvVar = (key: string, defaultValue: string): string => {
  const nodeProcess = (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process;
  const browserEnv = (import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  }).env;
  return nodeProcess?.env?.[key] ?? browserEnv?.[key] ?? defaultValue;
};

const API_BASE_URL = getEnvVar(
  'REACT_APP_API_BASE_URL',
  '/api'
);

const API_TIMEOUT = parseInt(
  getEnvVar('REACT_APP_API_TIMEOUT', '30000'),
  10
);

const ENVIRONMENT = getEnvVar('NODE_ENV', 'development');

const IS_PRODUCTION = ENVIRONMENT === 'production';

const IS_DEVELOPMENT = ENVIRONMENT === 'development';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: API_TIMEOUT,
  },
  routes: {
    storefrontUrl: getEnvVar('REACT_APP_STOREFRONT_URL', '/'),
  },
  env: {
    isDevelopment: IS_DEVELOPMENT,
    isProduction: IS_PRODUCTION,
    current: ENVIRONMENT,
  },
};

export default config;
