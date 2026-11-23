import { Page } from '@playwright/test';

// Shared parent for every page object. Holds the Playwright page and common helpers.
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Paths are relative to the project's baseURL in playwright.config.ts, e.g. '/' or '/cart.html'.
  async goto(path: string = '/') {
    await this.page.goto(path);
  }
}
