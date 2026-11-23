import { readFileSync, writeFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

// Only this public allowlist can enter the browser bundle. Never copy process.env.
const publicKeys = [
  'VITE_SITE_URL',
  'VITE_API_BASE_URL',
  'VITE_API_TIMEOUT',
  'VITE_ENABLE_API_MOCKS',
  'VITE_DEFAULT_CURRENCY',
  'VITE_BRAND_METRICS_PATH',
  'VITE_BRAND_PRODUCTS_PATH',
  'VITE_BRAND_CATEGORIES_PATH',
  'VITE_PRODUCT_PATH',
  'VITE_CATEGORY_PATH',
  'VITE_STOREFRONT_URL',
];
const demoKeys = [
  'VITE_DEFAULT_ADMIN_EMAIL',
  'VITE_DEFAULT_ADMIN_PASSWORD',
  'VITE_DEFAULT_BOUTIQUE_EMAIL',
  'VITE_DEFAULT_BOUTIQUE_PASSWORD',
];
const mode = process.argv[2] ?? 'production';
let values = {};
const environmentFiles =
  mode === 'production'
    ? ['.env', '.env.production', '.env.production.local']
    : ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`];
for (const file of environmentFiles) {
  try {
    values = { ...values, ...parseEnv(readFileSync(file, 'utf8')) };
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
values = { ...values, ...process.env };
const mocksRequested = /^(true|1|yes|on)$/i.test(values.VITE_ENABLE_API_MOCKS ?? 'false');
const apiBaseUrl = values.VITE_API_BASE_URL ?? '/api';
if (mode === 'production' && (!apiBaseUrl.startsWith('/') || apiBaseUrl.startsWith('//'))) {
  throw new Error(
    'Le build de production doit appeler son API sur la même origine, via un chemin relatif comme /api.',
  );
}
const demo = mode === 'demo' || (mode === 'development' && mocksRequested);
const env = { DEV: mode === 'development', PROD: mode !== 'development', MODE: mode };
for (const key of [...publicKeys, ...(demo ? demoKeys : [])])
  if (values[key] !== undefined) env[key] = values[key];
env.VITE_ENABLE_API_MOCKS = String(demo);
writeFileSync(
  'src/config/environment.generated.ts',
  `// Generated from public configuration by scripts/environment.mjs.\nexport const environment = ${JSON.stringify(env, null, 2)} as unknown as Record<string, string | undefined> & { DEV: boolean; PROD: boolean; MODE: string };\n`,
);
const target = values.KUKUZA_API_PROXY_TARGET || 'https://localhost:7200';
writeFileSync(
  'proxy.generated.json',
  JSON.stringify(
    { '/api': { target, changeOrigin: true, secure: values.KUKUZA_API_PROXY_INSECURE !== 'true' } },
    null,
    2,
  ),
);
