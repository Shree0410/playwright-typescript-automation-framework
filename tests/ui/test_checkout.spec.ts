import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login_page';
import { InventoryPage } from '../../pages/inventory_page';
import { CartPage } from '../../pages/cart_page';
import { CheckoutPage } from '../../pages/checkout_page';
import data from '../../test_data/users.json';

const { firstName, lastName, postalCode } = data.checkout;

test.describe('Checkout', () => {
  let checkoutPage: CheckoutPage;

  // Every test starts on "Checkout: Your Information" with one item in the cart.
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(data.users.standard, data.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();

    const cartPage = new CartPage(page);
    await cartPage.checkout();

    checkoutPage = new CheckoutPage(page);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('should complete the order on the happy path', async ({ page }) => {
    await checkoutPage.fillInformation(firstName, lastName, postalCode);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('should show an error when first name is missing', async () => {
    await checkoutPage.fillInformation('', lastName, postalCode);

    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
  });

  test('should show an error when last name is missing', async () => {
    await checkoutPage.fillInformation(firstName, '', postalCode);

    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
  });

  test('should show an error when postal code is missing', async () => {
    await checkoutPage.fillInformation(firstName, lastName, '');

    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
  });

  test('should return to the cart when checkout is cancelled', async ({ page }) => {
    await checkoutPage.cancel();

    await expect(page).toHaveURL(/cart\.html/);
  });
});
