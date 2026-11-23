import { test, expect } from '../../src/fixtures/test_fixtures';
import { CUSTOMER, PRODUCTS } from '../../src/utils/test_data';

test.describe('Checkout', () => {
  // Every test starts on "Checkout: Your Information" with one item in the cart.
  test.beforeEach(async ({ page, loggedInInventoryPage, cartPage }) => {
    await loggedInInventoryPage.addToCart(PRODUCTS.backpack);
    await loggedInInventoryPage.openCart();
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('should complete the order on the happy path', async ({ page, checkoutPage }) => {
    await checkoutPage.fillInformation(CUSTOMER);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('should show an error when first name is missing', async ({ checkoutPage }) => {
    // { ...CUSTOMER, firstName: '' } copies the customer and blanks one field.
    await checkoutPage.fillInformation({ ...CUSTOMER, firstName: '' });

    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
  });

  test('should show an error when last name is missing', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation({ ...CUSTOMER, lastName: '' });

    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
  });

  test('should show an error when postal code is missing', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation({ ...CUSTOMER, postalCode: '' });

    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
  });

  test('should return to the cart when checkout is cancelled', async ({ page, checkoutPage }) => {
    await checkoutPage.cancel();

    await expect(page).toHaveURL(/cart\.html/);
  });
});
