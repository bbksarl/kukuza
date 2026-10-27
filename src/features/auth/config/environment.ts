import { runtimeConfig } from '@/config/runtime';

export const config = {
  routes: { storefrontUrl: import.meta.env.VITE_STOREFRONT_URL || '/' },
  env: {
    isDevelopment: runtimeConfig.isDevelopment,
    isProduction: import.meta.env.PROD,
    current: import.meta.env.MODE,
  },
};

export default config;
