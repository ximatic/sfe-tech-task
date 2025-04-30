import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable, of } from 'rxjs';

import { AuthStore } from '../stores/auth.store';

import { UserRole } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthRoleGuard implements CanActivate {
  private router: Router = inject(Router);
  private authStore = inject(AuthStore);

  canActivate(): Observable<boolean> {
    const authUser = this.authStore.authUser();

    if (!authUser) {
      this.router.navigate(['/auth']);
      return of(false);
    } else if (authUser.role === UserRole.User) {
      this.router.navigate(['/users']);
      return of(false);
    }

    return of(true);
  }
}
