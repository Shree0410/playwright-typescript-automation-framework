import { test, expect } from '../../src/fixtures/test_fixtures';
import { PRODUCTS, USERS } from '../../src/utils/test_data';

// Visual tests compare a screenshot with a saved baseline image in tests/__screenshots__/.
// Product photos are compared (not text), because photos render the same on Windows and
// Linux, while fonts do not. Update baselines with: npx playwright test tests/visual --update-snapshots
test.describe('Product images', () => {
  test('should show the expected backpack image for standard_user', async ({ loggedInInventoryPage }) => {
    await expect(loggedInInventoryPage.itemImage(PRODUCTS.backpack)).toHaveScreenshot('backpack.png');
  });

  test('should show the expected bike light image for standard_user', async ({ loggedInInventoryPage }) => {
    await expect(loggedInInventoryPage.itemImage(PRODUCTS.bikeLight)).toHaveScreenshot('bike-light.png');
  });

  test('should show a wrong backpack image for problem_user', async ({ loginPage, inventoryPage }) => {
    await loginPage.open();
    await loginPage.login(USERS.problem);

    // problem_user is SauceDemo's deliberately broken account: every product shows the same
    // wrong picture. The visual check catches this even though the page "works".
    await expect(inventoryPage.itemImage(PRODUCTS.backpack)).not.toHaveScreenshot('backpack.png');
  });
});
