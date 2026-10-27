import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const root = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, 'KUKUZA_');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@kukuza/facade': fileURLToPath(new URL('./facade/src/index.ts', import.meta.url)),
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.KUKUZA_API_PROXY_TARGET || 'https://localhost:7200',
          changeOrigin: true,
          secure: env.KUKUZA_API_PROXY_INSECURE !== 'true',
        },
      },
    },
    preview: { port: 4173, strictPort: true },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'], charts: ['recharts'] } } },
    },
  };
});
