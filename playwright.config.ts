import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const systemChromium = ['/usr/bin/chromium-browser', '/usr/bin/chromium', '/usr/bin/google-chrome'].find(
  existsSync,
);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || systemChromium,
      args: ['--no-sandbox'],
    },
  },
  webServer: [
    {
      command: 'node scripts/mock-api.mjs',
      url: 'http://127.0.0.1:4720/healthz',
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
    },
    {
      command: 'node dist/server/server.mjs',
      url: 'http://127.0.0.1:4173/healthz',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        PORT: '4173',
        KUKUZA_API_UPSTREAM: 'http://127.0.0.1:4720',
      },
    },
  ],
});
