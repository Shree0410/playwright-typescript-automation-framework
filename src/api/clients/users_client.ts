import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserPayload } from '../../types';

// Wraps the /users endpoints so tests call usersClient.getById(1) instead of building URLs.
// Paths are relative: the 'api' project in playwright.config.ts sets baseURL to the API host.
export class UsersClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  getAll(): Promise<APIResponse> {
    return this.request.get('/users');
  }

  getById(id: number): Promise<APIResponse> {
    return this.request.get(`/users/${id}`);
  }

  create(payload: UserPayload): Promise<APIResponse> {
    return this.request.post('/users', { data: payload });
  }

  update(id: number, payload: UserPayload): Promise<APIResponse> {
    return this.request.put(`/users/${id}`, { data: payload });
  }

  remove(id: number): Promise<APIResponse> {
    return this.request.delete(`/users/${id}`);
  }
}
