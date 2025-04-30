import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable, of } from 'rxjs';

import { AuthStore } from '../stores/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenGuard implements CanActivate {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);

  canActivate(): Observable<boolean> {
    const token = this.authStore.token();

    if (!token) {
      this.router.navigate(['/auth']);
    }

    return of(!!token);
  }
}
