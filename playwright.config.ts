import { defineConfig, devices } from '@playwright/test';
import { ENV } from './src/config/env';

export default defineConfig({
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

  // Visual baselines are stored without an OS suffix, so Windows and Linux (CI) share them.
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  expect: {
    // Allow up to 1% of pixels to differ, to absorb tiny anti-aliasing differences.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },

  use: {
    // Record a trace only when a test is retried, to debug failures cheaply.
    trace: 'on-first-retry',
    // Keep a screenshot only for failed tests.
    screenshot: 'only-on-failure',
  },

  // Two projects: browser tests against SauceDemo, and API tests that need no browser.
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Chrome'], baseURL: ENV.uiBaseUrl },
    },
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { baseURL: ENV.apiBaseUrl },
    },
  ],
});
