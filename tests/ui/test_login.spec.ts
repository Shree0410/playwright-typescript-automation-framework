import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login_page';
import { InventoryPage } from '../../pages/inventory_page';
import data from '../../test_data/users.json';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('should redirect to inventory after valid login', async ({ page }) => {
    await loginPage.login(data.users.standard, data.password);

    // toHaveURL retries until the URL matches, so no manual wait is needed.
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should show an error for invalid credentials', async () => {
    await loginPage.login(data.invalid.username, data.invalid.password);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('should show locked out error for locked_out_user', async () => {
    await loginPage.login(data.users.lockedOut, data.password);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('should show "Username is required" when username is empty', async () => {
    await loginPage.login('', data.password);

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('should show "Password is required" when password is empty', async () => {
    await loginPage.login(data.users.standard, '');

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
  });

  test('should show an error when both fields are empty', async () => {
    await loginPage.login('', '');

    // The username check runs first, so its message is the one shown.
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('should log in problem_user successfully', async ({ page }) => {
    await loginPage.login(data.users.problem, data.password);
    const inventoryPage = new InventoryPage(page);

    await expect(page).toHaveURL(/inventory/);
    await expect(loginPage.errorMessage).toBeHidden();
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('should show "Username" as the username placeholder', async () => {
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
  });

  test('should return to the login page after logout', async ({ page }) => {
    await loginPage.login(data.users.standard, data.password);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
