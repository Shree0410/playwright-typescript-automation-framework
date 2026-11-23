import { test, expect } from '../../src/fixtures/test_fixtures';
import { USER_SCHEMA, validateAgainstSchema } from '../../src/api/schemas/user_schema';
import { API_USERS } from '../../src/utils/test_data';

// Runs in the 'api' project: no browser is opened, and baseURL is the JSONPlaceholder host.
// JSONPlaceholder fakes writes: POST / PUT / DELETE return realistic responses but nothing is saved.
test.describe('Users API', () => {
  test('GET /users should return 200 and a non-empty list', async ({ usersClient }) => {
    const response = await usersClient.getAll();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  test('GET /users should return users that all match the schema', async ({ usersClient }) => {
    const users = await (await usersClient.getAll()).json();

    for (const user of users) {
      expect(validateAgainstSchema(user, USER_SCHEMA)).toEqual([]);
    }
  });

  test('GET /users/1 should return 200 and the expected fields', async ({ usersClient }) => {
    const response = await usersClient.getById(1);

    expect(response.status()).toBe(200);

    const user = await response.json();
    expect(validateAgainstSchema(user, USER_SCHEMA)).toEqual([]);
    expect(user.id).toBe(1);
    expect(user.email).toContain('@');
  });

  test('POST /users should return 201 and echo the payload', async ({ usersClient }) => {
    const response = await usersClient.create(API_USERS.newUser);

    expect(response.status()).toBe(201);

    const body = await response.json();
    // toMatchObject passes if the body contains these fields (extra fields such as id are allowed).
    expect(body).toMatchObject(API_USERS.newUser);
    expect(typeof body.id).toBe('number');
  });

  test('PUT /users/1 should return 200 and the updated data', async ({ usersClient }) => {
    const response = await usersClient.update(1, API_USERS.updatedUser);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({ id: 1, ...API_USERS.updatedUser });
  });

  test('DELETE /users/1 should return 200', async ({ usersClient }) => {
    const response = await usersClient.remove(1);

    // JSONPlaceholder answers a delete with 200 and an empty object (some APIs use 204).
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({});
  });

  test('GET an unknown user should return 404', async ({ usersClient }) => {
    const response = await usersClient.getById(99999);

    expect(response.status()).toBe(404);
  });
});
