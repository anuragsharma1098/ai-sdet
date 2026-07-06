import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

/**
 * Shared Playwright Test configuration for web, API, desktop, and mobile specs.
 * Desktop and mobile are excluded from npm test by tags because they require
 * external host/device infrastructure.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: {
    timeout: 15_000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  // Multiple reporters support local debugging, CI parsing, and Allure dashboards.
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    baseURL: env.orangeBaseUrl,
    // Failure artifacts are retained to support review and debugging without reruns.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 45_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
