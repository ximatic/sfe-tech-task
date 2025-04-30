import { Routes } from '@angular/router';

import { AuthTokenGuard } from './core/guards/auth-token.guard';

import { USERS_PATH } from './features/users/users.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: USERS_PATH,
    canActivate: [AuthTokenGuard],
    loadChildren: () =>
      import('./features/users/users.routes').then((r) => r.USERS_ROUTES),
  },
  {
    path: '**',
    redirectTo: '/auth',
  },
];
