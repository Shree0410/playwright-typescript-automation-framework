import users from '../../test-data/users.json';
import checkout from '../../test-data/checkout.json';
import apiUsers from '../../test-data/api_users.json';
import { CheckoutInfo, Credentials, UserPayload } from '../types';

// Typed access to the JSON files in test-data/, so tests never hardcode credentials or payloads.

export const PASSWORD = users.password;

export const USERS = {
  standard: { username: users.users.standard, password: PASSWORD } as Credentials,
  lockedOut: { username: users.users.lockedOut, password: PASSWORD } as Credentials,
  problem: { username: users.users.problem, password: PASSWORD } as Credentials,
  performanceGlitch: { username: users.users.performanceGlitch, password: PASSWORD } as Credentials,
  invalid: users.invalid as Credentials,
};

export const CUSTOMER: CheckoutInfo = checkout.customer;
export const PRODUCTS = checkout.products;

export const API_USERS: { newUser: UserPayload; updatedUser: UserPayload } = apiUsers;
