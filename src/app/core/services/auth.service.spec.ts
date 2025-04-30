import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MOCK_AUTH_RESPONSE_1 } from '../../../../__mocks__/constants/auth.const.mock';
import {
  MOCK_PASSWORD_1,
  MOCK_USERNAME_1,
} from '../../../../__mocks__/constants/user.const.mock';

import { AuthResponse } from '../../shared/models/auth';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let httpMock: HttpTestingController;

  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService],
    });

    // clear localStorage before every test to have known state
    localStorage.clear();

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('login works', fakeAsync(() => {
      const mockData: AuthResponse = MOCK_AUTH_RESPONSE_1;
      const expectedResponse: AuthResponse = MOCK_AUTH_RESPONSE_1;
      let serviceResponse!: AuthResponse;

      service
        .login(MOCK_USERNAME_1, MOCK_PASSWORD_1)
        .subscribe((authResponse: AuthResponse) => {
          serviceResponse = authResponse;
        });

      const req = httpMock.expectOne(`api/auth/login`);
      req.flush(mockData);

      tick();

      expect(req.request.method).toEqual('POST');
      expect(serviceResponse).toEqual(expectedResponse);
      expect(localStorage.getItem('sfe-token')).toEqual(
        JSON.stringify(mockData)
      );
    }));
  });

  describe('logout', () => {
    it('logout works', fakeAsync(() => {
      localStorage.setItem('sfe-token', JSON.stringify(MOCK_AUTH_RESPONSE_1));

      service.logout().subscribe();

      tick();

      expect(localStorage.getItem('sfe-token')).toEqual(null);
    }));
  });

  describe('verify', () => {
    it('token verification works', fakeAsync(() => {
      let serviceResponse!: AuthResponse;

      localStorage.setItem('sfe-token', JSON.stringify(MOCK_AUTH_RESPONSE_1));

      service.verify().subscribe((authResponse: AuthResponse) => {
        serviceResponse = authResponse;
      });

      tick();

      expect(serviceResponse).toEqual(MOCK_AUTH_RESPONSE_1);
    }));

    it('token verification does not work when token is not available in localStorage', fakeAsync(() => {
      let serviceResponse!: AuthResponse;

      service.verify().subscribe((authResponse: AuthResponse) => {
        serviceResponse = authResponse;
      });

      tick();

      expect(serviceResponse).toEqual({});
    }));
  });
});
