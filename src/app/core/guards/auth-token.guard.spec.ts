import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { AuthStore } from '../stores/auth.store';

import { AuthTokenGuard } from './auth-token.guard';
import { MOCK_TOKEN_1 } from '../../../../__mocks__/constants/auth.const.mock';

describe('AuthTokenGuard', () => {
  let router: Router;
  let authStore: AuthStore;

  let guard: AuthTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), AuthStore, AuthTokenGuard],
    });

    router = TestBed.inject(Router);
    authStore = TestBed.inject(AuthStore);

    guard = TestBed.inject(AuthTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('handling invalid Token works', (done) => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    jest.spyOn(authStore, 'token').mockReturnValueOnce(null);

    guard.canActivate().subscribe((result: any) => {
      expect(result).toBeFalsy();
      expect(navigateSpy).toHaveBeenCalledWith([`/auth`]);
      done();
    });
  });

  it('handling valid Token works', (done) => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    jest.spyOn(authStore, 'token').mockReturnValueOnce(MOCK_TOKEN_1);

    guard.canActivate().subscribe((result: any) => {
      expect(result).toBeTruthy();
      expect(navigateSpy).toHaveBeenCalledTimes(0);
      done();
    });
  });
});
