import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: appRoot,
  plugins: [react()],
  resolve: {
    alias: {
      '@': appRoot + '/src',
      '@/': appRoot + '/src/',
      '@kukuza/facade': path.resolve(appRoot, 'facade/src/index.ts'),
      '@kukuza/facade/': path.resolve(appRoot, 'facade/src/'),
      '@testing-library/react': path.resolve(appRoot, 'node_modules/@testing-library/react'),
      react: path.resolve(appRoot, 'node_modules/react'),
      'react/jsx-runtime': path.resolve(appRoot, 'node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(appRoot, 'node_modules/react/jsx-dev-runtime.js'),
      'react-dom': path.resolve(appRoot, 'node_modules/react-dom'),
      'react-router-dom': path.resolve(appRoot, 'node_modules/react-router-dom'),
    },
  },
  server: {
    fs: {
      allow: [appRoot],
    },
  },
  test: {
    name: 'unified-app',
    environment: 'jsdom',
    setupFiles: [path.resolve(appRoot, 'tests/setup.ts')],
    include: [path.resolve(appRoot, 'src/**/*.test.tsx')],
    globals: true,
  },
});
