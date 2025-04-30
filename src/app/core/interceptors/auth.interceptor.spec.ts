import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MOCK_TOKEN_1 } from '../../../../__mocks__/constants/auth.const.mock';

import { AuthFacadeService } from '../facades/auth-facade.service';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  let authFacadeService: AuthFacadeService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        AuthFacadeService,
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    authFacadeService = TestBed.inject(AuthFacadeService);
  });

  it('should not add auth Authorization Header with Token to URL on excluded list', () => {
    const tokenSpy = jest
      .spyOn(authFacadeService, 'token')
      .mockReturnValue(MOCK_TOKEN_1);

    const url = `/auth`;
    httpClient.post(url, {}).subscribe();

    const req = httpTestingController.expectOne(url);
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(tokenSpy).toHaveBeenCalledTimes(0);
  });

  it('should add auth Authorization Header with Token to URL not on excluded list', () => {
    const tokenSpy = jest
      .spyOn(authFacadeService, 'token')
      .mockReturnValue(MOCK_TOKEN_1);

    const url = `/users`;
    httpClient.get(url).subscribe();

    const req = httpTestingController.expectOne(url);
    expect(req.request.headers.get('Authorization')).toEqual(
      `Bearer ${authFacadeService.token()}`
    );
    expect(tokenSpy).toHaveBeenCalled();
  });
});
