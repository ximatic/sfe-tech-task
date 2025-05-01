import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthFacadeService } from '../../../core/facades/auth-facade.service';

import { UsersListComponent } from './users-list.component';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  let authFacadeService: AuthFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthFacadeService,
      ],
    }).compileComponents();

    authFacadeService = TestBed.inject(AuthFacadeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should show "actions" column for Admin user', () => {
    jest.spyOn(authFacadeService, 'isAdminRole').mockReturnValue(true);

    fixture.detectChanges();

    expect(component.displayedColumns).toEqual([
      'index',
      'username',
      'role',
      'actions',
    ]);
  });

  it('should not show "actions" column for Admin user', () => {
    jest.spyOn(authFacadeService, 'isAdminRole').mockReturnValue(false);

    fixture.detectChanges();

    expect(component.displayedColumns).toEqual(['index', 'username', 'role']);
  });
});
