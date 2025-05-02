import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { MOCK_TOKEN_1 } from '../../../../__mocks__/constants/auth.const.mock';

import { AuthFacadeService } from '../facades/auth-facade.service';
import { UsersFacadeService } from '../facades/users-facade.service';

import { authInterceptor } from './auth.interceptor';
import { of } from 'rxjs';
import { routes } from '../../app.routes';

describe('authInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  let router: Router;
  let authFacadeService: AuthFacadeService;
  let usersFacadeService: UsersFacadeService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        AuthFacadeService,
        UsersFacadeService,
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    router = TestBed.inject(Router);
    authFacadeService = TestBed.inject(AuthFacadeService);
    usersFacadeService = TestBed.inject(UsersFacadeService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // handling header

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

  // handling response

  it('should not redirect user to /auth route without error', () => {
    const spyNavigate = jest.spyOn(router, 'navigate');
    const spyLogout = jest.spyOn(authFacadeService, 'logout');
    const spyClear = jest.spyOn(usersFacadeService, 'clear');

    const url = `/users`;
    httpClient.get(url, {}).subscribe();
    const req = httpTestingController.expectOne(url);

    expect(req.request.method).toEqual('GET');
    expect(spyLogout).toHaveBeenCalledTimes(0);
    expect(spyClear).toHaveBeenCalledTimes(0);
    expect(spyNavigate).toHaveBeenCalledTimes(0);
  });

  it('should not redirect user to /auth route when receiving non-401 error', () => {
    const spyNavigate = jest.spyOn(router, 'navigate');
    const spyLogout = jest.spyOn(authFacadeService, 'logout');
    const spyClear = jest.spyOn(usersFacadeService, 'clear');

    const url = `/users`;
    httpClient.get(url, {}).subscribe();
    const req = httpTestingController.expectOne(url);
    req.error(new ProgressEvent('error'), { status: 400 });

    expect(req.request.method).toEqual('GET');
    expect(spyLogout).toHaveBeenCalledTimes(0);
    expect(spyClear).toHaveBeenCalledTimes(0);
    expect(spyNavigate).toHaveBeenCalledTimes(0);
  });

  it('should redirect user to /auth route when receiving 401 error', (() => {
    const spyNavigate = jest.spyOn(router, 'navigate');
    const spyLogout = jest.spyOn(authFacadeService, 'logout');
    const spyClear = jest.spyOn(usersFacadeService, 'clear');

    const url = `/users`;
    httpClient.get(url, {}).subscribe();
    const req = httpTestingController.expectOne(url);
    req.error(new ProgressEvent('error'), { status: 401 });

    expect(req.request.method).toEqual('GET');
    expect(spyLogout).toHaveBeenCalled();
    expect(spyClear).toHaveBeenCalled();
    expect(spyNavigate).toHaveBeenCalledWith(['/auth']);
  });
});
