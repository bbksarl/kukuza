import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    watch: {
      // Polling avoids Linux inotify watcher exhaustion in this workspace.
      usePolling: true,
      interval: 300,
    },
  },
  build: {
    outDir: 'dist',
  },
  base: '/',
});
