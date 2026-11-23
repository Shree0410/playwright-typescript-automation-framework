import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login_page';
import { InventoryPage } from '../pages/inventory_page';
import { CartPage } from '../pages/cart_page';
import { CheckoutPage } from '../pages/checkout_page';
import { UsersClient } from '../api/clients/users_client';
import { USERS } from '../utils/test_data';

// Custom fixtures: Playwright creates each one only when a test asks for it by name,
// e.g. test('...', async ({ loginPage }) => { ... }). This removes "new LoginPage(page)"
// boilerplate from every test.
type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  // An InventoryPage that is already logged in as standard_user.
  loggedInInventoryPage: InventoryPage;
  usersClient: UsersClient;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  loggedInInventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(USERS.standard);
    // Wait for the redirect so the test starts on a fully loaded Products page.
    await page.waitForURL('**/inventory.html');
    await use(new InventoryPage(page));
  },

  // 'request' is Playwright's built-in HTTP client; it uses the project's baseURL.
  usersClient: async ({ request }, use) => {
    await use(new UsersClient(request));
  },
});

export { expect };
