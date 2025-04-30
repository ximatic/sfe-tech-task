import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { MOCK_TOKEN_1 } from '../../../../../__mocks__/constants/auth.const.mock';

import { AuthFacadeService } from '../../../core/facades/auth-facade.service';

import { routes } from '../../../app.routes';

import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  let router: Router;
  let authFacadeService: AuthFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthFacadeService,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    authFacadeService = TestBed.inject(AuthFacadeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('form is initially invalid and not sending any data', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const loginSpy = jest.spyOn(authFacadeService, 'login');
    const tokenSpy = jest.spyOn(authFacadeService, 'token');

    fixture.detectChanges();

    expect(component.form.invalid).toBeTruthy();
    expect(component.submitForm()).toBeUndefined();

    expect(tokenSpy).toHaveBeenCalledTimes(0);
    expect(loginSpy).toHaveBeenCalledTimes(0);
    expect(navigateSpy).toHaveBeenCalledTimes(0);
  });

  describe('submitForm', () => {
    it('submitting login form works', fakeAsync(() => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const loginSpy = jest
        .spyOn(authFacadeService, 'login')
        .mockReturnValueOnce(of(true));
      jest.spyOn(authFacadeService, 'token').mockReturnValueOnce(MOCK_TOKEN_1);

      fixture.detectChanges();

      component.form.patchValue({ username: 'admin', password: 'admin123' });

      expect(component.form.invalid).toBeFalsy();
      component.submitForm();

      tick();

      expect(loginSpy).toHaveBeenCalledWith('admin', 'admin123');
      expect(navigateSpy).toHaveBeenCalledWith([`/users`]);
    }));

    it('submitting login form does not work when login fails', fakeAsync(() => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      const loginSpy = jest
        .spyOn(authFacadeService, 'login')
        .mockReturnValueOnce(of(false));

      fixture.detectChanges();

      component.form.patchValue({ username: 'admin', password: 'admin123' });

      expect(component.form.invalid).toBeFalsy();
      component.submitForm();

      tick();

      expect(loginSpy).toHaveBeenCalledWith('admin', 'admin123');
      expect(navigateSpy).toHaveBeenCalledTimes(0);
    }));
  });
});
