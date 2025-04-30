import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { of } from 'rxjs';

import {
  MOCK_USER_1,
  MOCK_USER_ID_1,
} from '../../../../../__mocks__/constants/user.const.mock';

import { UsersFacadeService } from '../../../core/facades/users-facade.service';

import { routes } from '../../../app.routes';

import { UserFormPageComponent } from './user-form-page.component';

describe('UserFormPageComponent', () => {
  let component: UserFormPageComponent;
  let fixture: ComponentFixture<UserFormPageComponent>;

  let router: Router;
  let usersFacadeService: UsersFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormPageComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: MOCK_USER_ID_1 }),
          },
        },
        UsersFacadeService,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    usersFacadeService = TestBed.inject(UsersFacadeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loading user works', () => {
    const spyLoadUser = jest.spyOn(usersFacadeService, 'loadUser');

    fixture.detectChanges();

    expect(spyLoadUser).toHaveBeenCalledWith(MOCK_USER_ID_1);
  });

  it('handling form save works and redirects user to the list', fakeAsync(() => {
    const spySaveUser = jest
      .spyOn(usersFacadeService, 'saveUser')
      .mockReturnValueOnce(of(true));
    const spyNavigate = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    component.handleSave(MOCK_USER_1);

    tick();

    expect(spySaveUser).toHaveBeenCalledWith(MOCK_USER_1);
    expect(spyNavigate).toHaveBeenCalledWith(['/users']);
  }));

  it('handling form save does not work', fakeAsync(() => {
    const spySaveUser = jest
      .spyOn(usersFacadeService, 'saveUser')
      .mockReturnValueOnce(of(false));
    const spyNavigate = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    component.handleSave(MOCK_USER_1);

    tick();

    expect(spySaveUser).toHaveBeenCalledWith(MOCK_USER_1);
    expect(spyNavigate).toHaveBeenCalledTimes(0);
  }));

  it('going back works', () => {
    const spyNavigate = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    component.goBack();

    expect(spyNavigate).toHaveBeenCalledWith(['/users']);
  });
});
