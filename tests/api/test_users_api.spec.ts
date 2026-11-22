import { test, expect } from '@playwright/test';
import data from '../../test_data/users.json';

// JSONPlaceholder is a free fake REST API that needs no API key.
// Full URLs are used because baseURL in playwright.config.ts points at SauceDemo.
// Note: it fakes writes — POST/PUT/DELETE return realistic responses but nothing is saved.
const API_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Users API', () => {
  // The 'request' fixture is Playwright's built-in HTTP client (no browser is opened).
  test('GET /users should return 200 and a non-empty list', async ({ request }) => {
    const response = await request.get(`${API_URL}/users`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  test('GET /users/1 should return 200 and the expected fields', async ({ request }) => {
    const response = await request.get(`${API_URL}/users/1`);

    expect(response.status()).toBe(200);

    const user = await response.json();
    expect(user.id).toBe(1);
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('username');
    expect(user.email).toContain('@');
  });

  test('POST /users should return 201 and echo the payload', async ({ request }) => {
    const payload = data.api.newUser;

    const response = await request.post(`${API_URL}/users`, { data: payload });

    expect(response.status()).toBe(201);

    const body = await response.json();
    // toMatchObject passes if the body contains these fields (extra fields such as id are allowed).
    expect(body).toMatchObject(payload);
    expect(body).toHaveProperty('id');
  });

  test('PUT /users/1 should return 200 and the updated data', async ({ request }) => {
    const payload = data.api.updatedUser;

    const response = await request.put(`${API_URL}/users/1`, { data: payload });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject(payload);
  });

  test('DELETE /users/1 should return 200', async ({ request }) => {
    const response = await request.delete(`${API_URL}/users/1`);

    // JSONPlaceholder answers a delete with 200 and an empty object (some APIs use 204).
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({});
  });

  test('GET an unknown user should return 404', async ({ request }) => {
    const response = await request.get(`${API_URL}/users/99999`);

    expect(response.status()).toBe(404);
  });
});
