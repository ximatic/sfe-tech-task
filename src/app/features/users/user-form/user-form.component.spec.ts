import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  MOCK_PASSWORD_1,
  MOCK_USER_1,
  MOCK_USER_ROLE_1,
  MOCK_USERNAME_1,
} from '../../../../../__mocks__/constants/user.const.mock';

import { UsersFacadeService } from '../../../core/facades/users-facade.service';

import { User } from '../../../shared/models/user';

import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        UsersFacadeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('New User', () => {
    it('submitting form works', () => {
      const mockData: Partial<User> = {
        username: MOCK_USERNAME_1,
        role: MOCK_USER_ROLE_1,
        password: MOCK_PASSWORD_1,
      };
      const spySave = jest.spyOn(component.save, 'emit');

      fixture.detectChanges();

      component.form.patchValue(mockData);

      expect(component.form.invalid).toBeFalsy();

      component.submitForm();

      expect(spySave).toHaveBeenCalledWith(mockData);
    });

    it('submitting form does not work for invalid form', () => {
      const spySave = jest.spyOn(component.save, 'emit');

      fixture.detectChanges();

      expect(component.form.invalid).toBeTruthy();

      component.submitForm();

      expect(spySave).toHaveBeenCalledTimes(0);
    });
  });

  describe('Existing User', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('user', MOCK_USER_1);
    });

    it('submitting form works', () => {
      const mockData: Partial<User> = {
        ...MOCK_USER_1,
        password: '',
      };
      const spyPatchValue = jest.spyOn(component.form, 'patchValue');
      const spySave = jest.spyOn(component.save, 'emit');

      fixture.detectChanges();

      expect(component.form.invalid).toBeFalsy();

      component.submitForm();

      expect(spyPatchValue).toHaveBeenCalledWith(MOCK_USER_1);
      expect(spySave).toHaveBeenCalledWith(mockData);
    });
  });
});
