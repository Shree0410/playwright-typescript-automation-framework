import { Page, Locator } from '@playwright/test';
import { BasePage } from './base_page';
import { parsePrice } from '../utils/price';

// The "Products" page shown after login (/inventory.html).
export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  // Finds the product card whose text contains the product name.
  itemCard(productName: string): Locator {
    return this.inventoryItems.filter({ hasText: productName });
  }

  itemImage(productName: string): Locator {
    return this.itemCard(productName).locator('img');
  }

  async getItemPrice(productName: string): Promise<number> {
    const priceText = await this.itemCard(productName)
      .locator('[data-test="inventory-item-price"]')
      .innerText();
    return parsePrice(priceText);
  }

  async addToCart(productName: string) {
    await this.itemCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName: string) {
    await this.itemCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    // click() auto-waits until the sliding menu link is visible and clickable.
    await this.logoutLink.click();
  }
}
