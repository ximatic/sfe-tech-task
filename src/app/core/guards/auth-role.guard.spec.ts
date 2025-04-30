import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import {
  MOCK_USER_1,
  MOCK_USER_2,
} from '../../../../__mocks__/constants/user.const.mock';

import { AuthStore } from '../stores/auth.store';

import { AuthRoleGuard } from './auth-role.guard';

describe('AuthRoleGuard', () => {
  let router: Router;
  let authStore: AuthStore;

  let guard: AuthRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), AuthStore, AuthRoleGuard],
    });

    router = TestBed.inject(Router);
    authStore = TestBed.inject(AuthStore);

    guard = TestBed.inject(AuthRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('handling invalid Role works', (done) => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    jest.spyOn(authStore, 'authUser').mockReturnValueOnce(null);

    guard.canActivate().subscribe((result: any) => {
      expect(result).toBeFalsy();
      expect(navigateSpy).toHaveBeenCalledWith([`/auth`]);
      done();
    });
  });

  it('handling User Role works', (done) => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    jest.spyOn(authStore, 'authUser').mockReturnValueOnce(MOCK_USER_1);

    guard.canActivate().subscribe((result: any) => {
      expect(result).toBeFalsy();
      expect(navigateSpy).toHaveBeenCalledWith([`/users`]);
      done();
    });
  });

  it('handling Admin Role works', (done) => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    jest.spyOn(authStore, 'authUser').mockReturnValueOnce(MOCK_USER_2);

    guard.canActivate().subscribe((result: any) => {
      expect(result).toBeTruthy();
      expect(navigateSpy).toHaveBeenCalledTimes(0);
      done();
    });
  });
});
