import { Page, Locator } from '@playwright/test';
import { BasePage } from './base_page';

// The "Your Cart" page (/cart.html).
export class CartPage extends BasePage {
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
