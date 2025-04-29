import { inject, Injectable } from '@angular/core';

import { AuthStore } from '../stores/auth.store';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../../shared/models/auth';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthFacadeService {
  private store = inject(AuthStore);
  private service = inject(AuthService);

  token = this.store.token.asReadonly();
  authUser = this.store.authUser.asReadonly();
  processing = this.store.processing.asReadonly();
  error = this.store.error.asReadonly();

  login(username: string, password: string): Observable<boolean> {
    this.store.setProcessing(true);
    return this.service.login(username, password).pipe(
      map((response: AuthResponse) => {
        if (response.token && response.user) {
          this.store.setToken(response.token);
          this.store.setAuthUser(response.user);
          this.store.setError('');
          this.store.setProcessing(false);

          return true;
        } else {
          this.store.setError(
            'Login failed. Please try again later or contact with administrator.'
          );
          this.store.setProcessing(false);

          return false;
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.store.setError(
            'Invalid credentials. Please try again or contact with administrator.'
          );
        } else {
          this.store.setError(
            'Login failed. Please try again later or contact with administrator.'
          );
        }
        this.store.setProcessing(false);

        return of(false);
      })
    );
  }

  logout(): Observable<object> {
    this.store.setProcessing(true);
    return this.service.logout().pipe(
      tap(() => {
        this.store.clearToken();
        this.store.clearAuthUser();
        this.store.setError('');

        this.store.setProcessing(false);
      })
    );
  }

  verify(): Observable<boolean> {
    this.store.setProcessing(true);
    return this.service.verify().pipe(
      map((response: AuthResponse) => {
        if (response.token && response.user) {
          this.store.setToken(response.token);
          this.store.setAuthUser(response.user);
          this.store.setError('');
          this.store.setProcessing(false);

          return true;
        } else {
          this.store.setError('Verification failed.');
          this.store.setProcessing(false);

          return false;
        }
      })
    );
  }
}
