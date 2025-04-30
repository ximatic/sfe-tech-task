import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { MOCK_USER_ID_1 } from '../../../../../__mocks__/constants/user.const.mock';

import { AuthFacadeService } from '../../../core/facades/auth-facade.service';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';

import { routes } from '../../../app.routes';

import { UsersListPageComponent } from './users-list-page.component';

describe('UsersListPageComponent', () => {
  let component: UsersListPageComponent;
  let fixture: ComponentFixture<UsersListPageComponent>;

  let router: Router;
  let usersFacadeService: UsersFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListPageComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthFacadeService,
        UsersFacadeService,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    usersFacadeService = TestBed.inject(UsersFacadeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users', () => {
    const spyLoadUsers = jest.spyOn(usersFacadeService, 'loadUsers');

    fixture.detectChanges();

    expect(spyLoadUsers).toHaveBeenCalled();
  });

  it('should navigate to New User form', () => {
    const spyNavigate = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    component.goToNew();

    expect(spyNavigate).toHaveBeenCalledWith(['/users/create']);
  });

  it('should navigate to Existing User form', () => {
    const spyNavigate = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    component.goToEdit(MOCK_USER_ID_1);

    expect(spyNavigate).toHaveBeenCalledWith(['/users', MOCK_USER_ID_1]);
  });
});
