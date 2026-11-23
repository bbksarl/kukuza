import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: appRoot,
  resolve: {
    alias: [
      {
        find: '@/config/environment.generated',
        replacement: path.resolve(appRoot, 'src/config/environment.test.ts'),
      },
      { find: '@/', replacement: appRoot + '/src/' },
      { find: '@', replacement: appRoot + '/src' },
    ],
  },
  server: {
    fs: {
      allow: [appRoot],
    },
  },
  test: {
    name: 'unified-app',
    environment: 'jsdom',
    setupFiles: [path.resolve(appRoot, 'vitest.setup.ts')],
    // Les tests API restent indépendants du mode démo choisi dans .env.local.
    env: { VITE_ENABLE_API_MOCKS: 'false' },
    include: [path.resolve(appRoot, 'src/**/*.test.ts'), path.resolve(appRoot, 'scripts/**/*.test.ts')],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      all: true,
      include: [
        'src/app/core/format-money.ts',
        'src/app/core/safe-return-url.ts',
        'src/core/auth/sessionStorage.ts',
        'src/app/storefront/cart.service.ts',
        'src/services/orders/orderService.ts',
        'src/api/contracts/catalog.ts',
        'src/features/shop/services/shop/shopMappers.ts',
        'src/features/shop/utils/productForm.ts',
        'src/features/auth/domain/auth/schemas.ts',
        'src/features/auth/utils/validation.ts',
      ],
      exclude: ['**/*.test.ts'],
      thresholds: { statements: 70, branches: 60, functions: 65, lines: 70 },
    },
    globals: true,
  },
});
