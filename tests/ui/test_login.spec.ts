import { test, expect } from '../../src/fixtures/test_fixtures';
import { USERS } from '../../src/utils/test_data';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('should redirect to inventory after valid login', async ({ page, loginPage }) => {
    await loginPage.login(USERS.standard);

    // toHaveURL retries until the URL matches, so no manual wait is needed.
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should show an error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(USERS.invalid);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('should show locked out error for locked_out_user', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('should show "Username is required" when username is empty', async ({ loginPage }) => {
    await loginPage.login({ username: '', password: USERS.standard.password });

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('should show "Password is required" when password is empty', async ({ loginPage }) => {
    await loginPage.login({ username: USERS.standard.username, password: '' });

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
  });

  test('should show an error when both fields are empty', async ({ loginPage }) => {
    await loginPage.login({ username: '', password: '' });

    // The username check runs first, so its message is the one shown.
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('should log in problem_user successfully', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(USERS.problem);

    await expect(page).toHaveURL(/inventory/);
    await expect(loginPage.errorMessage).toBeHidden();
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('should show "Username" as the username placeholder', async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
  });

  test('should return to the login page after logout', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard);

    await inventoryPage.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
