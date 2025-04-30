import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { MOCK_AUTH_RESPONSE_1 } from '../../../../__mocks__/constants/auth.const.mock';
import {
  MOCK_PASSWORD_1,
  MOCK_USER_1,
  MOCK_USER_2,
  MOCK_USERNAME_1,
} from '../../../../__mocks__/constants/user.const.mock';

import { AuthStore } from '../stores/auth.store';

import { AuthService } from '../services/auth.service';

import { AuthResponse } from '../../shared/models/auth';
import { User } from '../../shared/models/user';

import { AuthFacadeService } from './auth-facade.service';

describe('AuthFacadeService', () => {
  let store: AuthStore;
  let service: AuthService;

  let facade: AuthFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthStore,
        AuthService,
        AuthFacadeService,
      ],
    });

    store = TestBed.inject(AuthStore);
    service = TestBed.inject(AuthService);

    facade = TestBed.inject(AuthFacadeService);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('login', () => {
    it('login works', fakeAsync(() => {
      const mockData: AuthResponse = MOCK_AUTH_RESPONSE_1;
      const spyLogin = jest
        .spyOn(service, 'login')
        .mockReturnValueOnce(of(mockData));
      const spySetProcessing = jest.spyOn(store, 'setProcessing');

      let facadeResponse!: boolean;

      facade
        .login(MOCK_USERNAME_1, MOCK_PASSWORD_1)
        .subscribe((result: boolean) => {
          facadeResponse = result;
        });

      tick();

      expect(spyLogin).toHaveBeenCalledWith(MOCK_USERNAME_1, MOCK_PASSWORD_1);
      expect(spySetProcessing).toHaveBeenCalledTimes(2);

      expect(facadeResponse).toEqual(true);
      expect(store.token()).toEqual(mockData.token);
      expect(store.authUser()).toEqual(mockData.user);
      expect(store.error()).toEqual('');
      expect(store.processing()).toEqual(false);
    }));

    it('login throws generic error when token or user are not available', fakeAsync(() => {
      const mockData: AuthResponse = { ...MOCK_AUTH_RESPONSE_1, token: '' };
      const spyLogin = jest
        .spyOn(service, 'login')
        .mockReturnValueOnce(of(mockData));
      const spySetProcessing = jest.spyOn(store, 'setProcessing');

      let facadeResponse!: boolean;

      facade
        .login(MOCK_USERNAME_1, MOCK_PASSWORD_1)
        .subscribe((result: boolean) => {
          facadeResponse = result;
        });

      tick();

      expect(spyLogin).toHaveBeenCalledWith(MOCK_USERNAME_1, MOCK_PASSWORD_1);
      expect(spySetProcessing).toHaveBeenCalledTimes(2);

      expect(facadeResponse).toEqual(false);
      expect(store.token()).toEqual(null);
      expect(store.authUser()).toEqual(null);
      expect(store.error()).toEqual(
        'Login failed. Please try again later or contact with administrator.'
      );
      expect(store.processing()).toEqual(false);
    }));

    it('login throws invalid credentials error', fakeAsync(() => {
      const spyLogin = jest
        .spyOn(service, 'login')
        .mockReturnValue(
          throwError(() => new HttpErrorResponse({ status: 401 }))
        );
      const spySetProcessing = jest.spyOn(store, 'setProcessing');

      let facadeResponse!: boolean;

      facade
        .login(MOCK_USERNAME_1, MOCK_PASSWORD_1)
        .subscribe((result: boolean) => {
          facadeResponse = result;
        });

      tick();

      expect(spyLogin).toHaveBeenCalledWith(MOCK_USERNAME_1, MOCK_PASSWORD_1);
      expect(spySetProcessing).toHaveBeenCalledTimes(2);

      expect(facadeResponse).toEqual(false);
      expect(store.token()).toEqual(null);
      expect(store.authUser()).toEqual(null);
      expect(store.error()).toEqual(
        'Invalid credentials. Please try again or contact with administrator.'
      );
      expect(store.processing()).toEqual(false);
    }));

    it('login throws generic error', fakeAsync(() => {
      const spyLogin = jest
        .spyOn(service, 'login')
        .mockReturnValue(throwError(() => new Error()));
      const spySetProcessing = jest.spyOn(store, 'setProcessing');

      let facadeResponse!: boolean;

      facade
        .login(MOCK_USERNAME_1, MOCK_PASSWORD_1)
        .subscribe((result: boolean) => {
          facadeResponse = result;
        });

      tick();

      expect(spyLogin).toHaveBeenCalledWith(MOCK_USERNAME_1, MOCK_PASSWORD_1);
      expect(spySetProcessing).toHaveBeenCalledTimes(2);

      expect(facadeResponse).toEqual(false);
      expect(store.token()).toEqual(null);
      expect(store.authUser()).toEqual(null);
      expect(store.error()).toEqual(
        'Login failed. Please try again later or contact with administrator.'
      );
      expect(store.processing()).toEqual(false);
    }));
  });

  describe('logout', () => {
    it('logout works', fakeAsync(() => {
      const mockData: AuthResponse = MOCK_AUTH_RESPONSE_1;
      const spyLogout = jest
        .spyOn(service, 'logout')
        .mockReturnValueOnce(of(mockData));
      const spyClearToken = jest.spyOn(store, 'clearToken');
      const spyClearAuthUser = jest.spyOn(store, 'clearAuthUser');
      const spyError = jest.spyOn(store, 'setError');
      const spySetProcessing = jest.spyOn(store, 'setProcessing');

      facade.logout().subscribe();

      tick();

      expect(spyLogout).toHaveBeenCalled();
      expect(spyClearToken).toHaveBeenCalled();
      expect(spyClearAuthUser).toHaveBeenCalled();
      expect(spyError).toHaveBeenCalled();
      expect(spySetProcessing).toHaveBeenCalledTimes(2);

      expect(store.token()).toEqual(null);
      expect(store.authUser()).toEqual(null);
      expect(store.error()).toEqual('');
      expect(store.processing()).toEqual(false);
    }));
  });

  describe('verify', () => {
    it('token verification works', fakeAsync(() => {
      const mockData: AuthResponse = MOCK_AUTH_RESPONSE_1;
      const spyVerify = jest
        .spyOn(service, 'verify')
        .mockReturnValueOnce(of(mockData));
      const spySetProcessing = jest.spyOn(store, 'setProcessing');

      let facadeResponse!: boolean;

      facade.verify().subscribe((result: boolean) => {
        facadeResponse = result;
      });

      tick();

      expect(spyVerify).toHaveBeenCalled();
      expect(spySetProcessing).toHaveBeenCalledTimes(2);

      expect(facadeResponse).toEqual(true);
      expect(store.token()).toEqual(mockData.token);
      expect(store.authUser()).toEqual(mockData.user);
      expect(store.error()).toEqual('');
      expect(store.processing()).toEqual(false);
    }));

    it('token verification throws generic error when token or user are not available', fakeAsync(() => {
      const mockData: AuthResponse = { ...MOCK_AUTH_RESPONSE_1, token: '' };
      const spyVerify = jest
        .spyOn(service, 'verify')
        .mockReturnValueOnce(of(mockData));
      const spySetProcessing = jest.spyOn(store, 'setProcessing');

      let facadeResponse!: boolean;

      facade.verify().subscribe((result: boolean) => {
        facadeResponse = result;
      });

      tick();

      expect(spyVerify).toHaveBeenCalled();
      expect(spySetProcessing).toHaveBeenCalledTimes(2);

      expect(facadeResponse).toEqual(false);
      expect(store.token()).toEqual(null);
      expect(store.authUser()).toEqual(null);
      expect(store.error()).toEqual('');
      expect(store.processing()).toEqual(false);
    }));
  });

  describe('isAdminRole', () => {
    it('user is admin', () => {
      const mockData: User = MOCK_USER_2;
      store.setAuthUser(mockData);

      const facadeResult = facade.isAdminRole();

      expect(facadeResult).toEqual(true);
    });

    it('user is not admin', () => {
      const mockData: User = MOCK_USER_1;
      store.setAuthUser(mockData);

      const facadeResult = facade.isAdminRole();

      expect(facadeResult).toEqual(false);
    });
  });
});
