// Shared TypeScript types, so test data and API payloads are checked at compile time.

export interface Credentials {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

// Body sent when creating or updating a user through the API.
// A 'type' (not an 'interface') so it can be passed to expect(...).toMatchObject(...).
export type UserPayload = {
  name: string;
  username: string;
  email: string;
};

// A user as returned by GET /users on JSONPlaceholder.
export type User = UserPayload & {
  id: number;
  phone: string;
  website: string;
  address: object;
  company: object;
};
