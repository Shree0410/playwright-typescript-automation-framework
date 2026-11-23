// One place for environment settings. Each value can be overridden with an
// environment variable, e.g. UI_BASE_URL=https://staging.example.com npx playwright test
export const ENV = {
  uiBaseUrl: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
};
