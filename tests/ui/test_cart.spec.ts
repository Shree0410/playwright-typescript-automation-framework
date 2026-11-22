import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login_page';
import { InventoryPage } from '../../pages/inventory_page';
import { CartPage } from '../../pages/cart_page';
import data from '../../test_data/users.json';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';
const BOLT_SHIRT = 'Sauce Labs Bolt T-Shirt';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;

  // Every test starts logged in on the Products page with an empty cart.
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(data.users.standard, data.password);
    inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('should show badge 1 after adding one item', async () => {
    await inventoryPage.addToCart(BACKPACK);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should show a badge count matching the number of items added', async () => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await inventoryPage.addToCart(BOLT_SHIRT);

    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('should update the badge after removing an item', async () => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(BACKPACK);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('should list the added items on the cart page', async ({ page }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await inventoryPage.openCart();
    const cartPage = new CartPage(page);

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(2);
    // toHaveText with an array checks every item name, in order.
    await expect(cartPage.itemNames).toHaveText([BACKPACK, BIKE_LIGHT]);
  });
});
