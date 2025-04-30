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

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let router: Router;
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
