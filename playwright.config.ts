import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // All spec files live under tests/ui and tests/api.
  testDir: './tests',

  // Run test files and the tests inside them in parallel.
  fullyParallel: true,

  // Fail the CI build if a test.only is left in the code by mistake.
  forbidOnly: !!process.env.CI,

  // Retry failed tests twice on CI only, to absorb network flakiness.
  retries: process.env.CI ? 2 : 0,

  // HTML report is written to playwright-report/ (open with: npx playwright show-report).
  // 'never' stops the report from auto-opening a browser after a local run.
  reporter: [['html', { open: 'never' }]],

  use: {
    // Lets tests call page.goto('/') instead of the full SauceDemo URL.
    baseURL: 'https://www.saucedemo.com',

    // Record a trace only when a test is retried, to debug failures cheaply.
    trace: 'on-first-retry',

    // Keep a screenshot only for failed tests.
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
