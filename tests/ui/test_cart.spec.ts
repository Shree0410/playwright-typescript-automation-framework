import { test, expect } from '../../src/fixtures/test_fixtures';
import { PRODUCTS } from '../../src/utils/test_data';

// Every test starts logged in on the Products page with an empty cart
// (the loggedInInventoryPage fixture does the login).
test.describe('Cart', () => {
  test('should show badge 1 after adding one item', async ({ loggedInInventoryPage }) => {
    await loggedInInventoryPage.addToCart(PRODUCTS.backpack);

    await expect(loggedInInventoryPage.cartBadge).toHaveText('1');
  });

  test('should show a badge count matching the number of items added', async ({ loggedInInventoryPage }) => {
    await loggedInInventoryPage.addToCart(PRODUCTS.backpack);
    await loggedInInventoryPage.addToCart(PRODUCTS.bikeLight);
    await loggedInInventoryPage.addToCart(PRODUCTS.boltShirt);

    await expect(loggedInInventoryPage.cartBadge).toHaveText('3');
  });

  test('should update the badge after removing an item', async ({ loggedInInventoryPage }) => {
    await loggedInInventoryPage.addToCart(PRODUCTS.backpack);
    await loggedInInventoryPage.addToCart(PRODUCTS.bikeLight);
    await expect(loggedInInventoryPage.cartBadge).toHaveText('2');

    await loggedInInventoryPage.removeFromCart(PRODUCTS.backpack);

    await expect(loggedInInventoryPage.cartBadge).toHaveText('1');
  });

  test('should list the added items on the cart page', async ({ page, loggedInInventoryPage, cartPage }) => {
    await loggedInInventoryPage.addToCart(PRODUCTS.backpack);
    await loggedInInventoryPage.addToCart(PRODUCTS.bikeLight);
    await loggedInInventoryPage.openCart();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(2);
    // toHaveText with an array checks every item name, in order.
    await expect(cartPage.itemNames).toHaveText([PRODUCTS.backpack, PRODUCTS.bikeLight]);
  });
});
