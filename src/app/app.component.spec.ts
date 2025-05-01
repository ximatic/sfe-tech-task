import { provideHttpClient } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthFacadeService } from './core/facades/auth-facade.service';
import { UsersFacadeService } from './core/facades/users-facade.service';

import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { DOCUMENT } from '@angular/common';
import { InjectionToken } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let router: Router;
  let document: Document;
  let authFacadeService: AuthFacadeService;
  let usersFacadeService: UsersFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        AuthFacadeService,
        UsersFacadeService,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    document = TestBed.inject(DOCUMENT);
    authFacadeService = TestBed.inject(AuthFacadeService);
    usersFacadeService = TestBed.inject(UsersFacadeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // toggle theme

  it('toggling theme works', () => {
    fixture.detectChanges();

    expect(document.body.classList.contains('light-theme')).toBeFalsy();
    component.toggleTheme();
    expect(document.body.classList.contains('light-theme')).toBeTruthy();
    component.toggleTheme();
    expect(document.body.classList.contains('light-theme')).toBeFalsy();
  });

  // logout

  it('logout works', fakeAsync(() => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const logoutSpy = jest.spyOn(authFacadeService, 'logout');
    const clearSpy = jest.spyOn(usersFacadeService, 'clear');

    fixture.detectChanges();

    component.logout();

    tick();

    expect(logoutSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith([`/auth`]);
  }));
});
