import { test, expect } from '../../src/fixtures/test_fixtures';
import { CUSTOMER, PRODUCTS, USERS } from '../../src/utils/test_data';
import { sumPrices } from '../../src/utils/price';

// Integration tests: one test walks through several pages and checks that data
// stays consistent between them, instead of testing one page in isolation.
test.describe('Purchase flow', () => {
  test('should show an item total equal to the sum of the product prices', async ({
    page,
    loggedInInventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const backpackPrice = await loggedInInventoryPage.getItemPrice(PRODUCTS.backpack);
    const bikeLightPrice = await loggedInInventoryPage.getItemPrice(PRODUCTS.bikeLight);

    await loggedInInventoryPage.addToCart(PRODUCTS.backpack);
    await loggedInInventoryPage.addToCart(PRODUCTS.bikeLight);
    await loggedInInventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText([PRODUCTS.backpack, PRODUCTS.bikeLight]);

    await cartPage.checkout();
    await checkoutPage.fillInformation(CUSTOMER);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    expect(await checkoutPage.getItemTotal()).toBe(sumPrices([backpackPrice, bikeLightPrice]));

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    // A finished order empties the cart, so the badge disappears.
    await expect(loggedInInventoryPage.cartBadge).toBeHidden();
  });

  test('should keep cart items after logging out and back in', async ({
    loggedInInventoryPage,
    loginPage,
  }) => {
    await loggedInInventoryPage.addToCart(PRODUCTS.backpack);
    await expect(loggedInInventoryPage.cartBadge).toHaveText('1');

    await loggedInInventoryPage.logout();
    await loginPage.login(USERS.standard);

    // SauceDemo stores the cart in the browser's localStorage, so it survives a logout.
    await expect(loggedInInventoryPage.cartBadge).toHaveText('1');
  });
});
