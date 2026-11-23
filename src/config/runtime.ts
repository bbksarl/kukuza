import { environment } from '@/config/environment.generated';
type RuntimeEnvironment = {
  DEV?: boolean;
  PROD?: boolean;
  MODE?: string;
  VITE_ENABLE_API_MOCKS?: string;
  VITE_DEFAULT_CURRENCY?: string;
};

const env: RuntimeEnvironment = environment;

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value == null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};

/** Les données mock sont toujours opt-in, y compris en développement. */
export const runtimeConfig = {
  enableApiMocks: env.MODE === 'demo' || (env.DEV === true && parseBoolean(env.VITE_ENABLE_API_MOCKS, false)),
  isDevelopment: Boolean(env.DEV),
  currency: /^[A-Z]{3}$/.test(env.VITE_DEFAULT_CURRENCY ?? '') ? env.VITE_DEFAULT_CURRENCY! : 'XOF',
} as const;
