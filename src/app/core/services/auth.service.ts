import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, of, tap } from 'rxjs';

import { AuthResponse } from '../../shared/models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageKey = 'sfe-token';

  private readonly http: HttpClient = inject(HttpClient);

  private readonly apiUrl: string = 'api/auth';

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response: AuthResponse) => {
          this.saveToken(response);
        })
      );
  }

  logout(): Observable<object> {
    // artificial logout method, just clears localStorage (no request to the backend)
    // Observable used for easier future extension
    return of({}).pipe(
      tap(() => {
        this.clearToken();
      })
    );
  }

  verify(): Observable<AuthResponse> {
    // artificial verify method, just gets token from localStorage (no request to the backend)
    // Observable used for easier future extension
    return of({}).pipe(
      map(() => {
        return this.getToken();
      })
    );
  }

  // token

  private getToken(): AuthResponse {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }

  private saveToken(response: AuthResponse): void {
    localStorage.setItem(this.storageKey, JSON.stringify(response));
  }

  private clearToken(): void {
    localStorage.removeItem(this.storageKey);
  }
}
