import { Injectable, signal } from '@angular/core';

import { AuthUser } from '../../shared/models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  token = signal<string | null>(null);
  authUser = signal<AuthUser | null>(null);
  processing = signal(false);
  error = signal('');

  setToken(token: string): void {
    this.token.set(token);
  }

  clearToken(): void {
    this.token.set(null);
  }

  setAuthUser(authUser: AuthUser): void {
    this.authUser.set(authUser);
  }

  clearAuthUser(): void {
    this.authUser.set(null);
  }

  setProcessing(value: boolean): void {
    this.processing.set(value);
  }

  setError(message: string): void {
    this.error.set(message);
  }
}
