import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import {
  MOCK_PASSWORD_1,
  MOCK_USER_1,
  MOCK_USER_2,
} from '../../../../__mocks__/constants/user.const.mock';

import { UserStore } from '../stores/users.store';

import { UsersService } from '../services/users.service';

import { User } from '../../shared/models/user';

import { UsersFacadeService } from './users-facade.service';

describe('UsersFacadeService', () => {
  let store: UserStore;
  let service: UsersService;

  let facade: UsersFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserStore,
        UsersService,
        UsersFacadeService,
      ],
    });

    store = TestBed.inject(UserStore);
    service = TestBed.inject(UsersService);

    facade = TestBed.inject(UsersFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadUsers', () => {
    it('loading users works', fakeAsync(() => {
      const mockData: User[] = [MOCK_USER_1, MOCK_USER_2];
      const spyGetUsers = jest
        .spyOn(service, 'getUsers')
        .mockReturnValueOnce(of(mockData));
      const spySetLoading = jest.spyOn(store, 'setLoading');
      const spyClearUser = jest.spyOn(store, 'clearUser');

      facade.loadUsers();

      tick();

      expect(spyGetUsers).toHaveBeenCalled();
      expect(spySetLoading).toHaveBeenCalledTimes(2);
      expect(spyClearUser).toHaveBeenCalled();

      expect(store.users()).toEqual(mockData);
      expect(store.user()).toEqual(null);
      expect(store.error()).toEqual('');
      expect(store.loading()).toEqual(false);
    }));

    it('loading users throws error', fakeAsync(() => {
      const spyGetUsers = jest
        .spyOn(service, 'getUsers')
        .mockReturnValue(throwError(() => new Error()));
      const spySetLoading = jest.spyOn(store, 'setLoading');
      const spyClearUser = jest.spyOn(store, 'clearUser');

      facade.loadUsers();

      tick();

      expect(spyGetUsers).toHaveBeenCalled();
      expect(spySetLoading).toHaveBeenCalledTimes(2);
      expect(spyClearUser).toHaveBeenCalledTimes(0);

      expect(store.users()).toEqual([]);
      expect(store.user()).toEqual(null);
      expect(store.error()).toEqual(
        'Failed to load users. Please try again or contact with administrator.'
      );
      expect(store.loading()).toEqual(false);
    }));
  });

  describe('loadUser', () => {
    it('loading user works', fakeAsync(() => {
      const mockData: User[] = [MOCK_USER_1, MOCK_USER_2];
      const spyUsers = jest.spyOn(store, 'users').mockReturnValueOnce(mockData);

      facade.loadUser(MOCK_USER_1.id);

      tick();

      expect(spyUsers).toHaveBeenCalled();

      expect(store.user()).toEqual(MOCK_USER_1);
      expect(store.error()).toEqual('');
    }));

    it('loading user throws error', fakeAsync(() => {
      const mockData: User[] = [];
      const spyUsers = jest.spyOn(store, 'users').mockReturnValueOnce(mockData);

      facade.loadUser(MOCK_USER_1.id);

      tick();

      expect(spyUsers).toHaveBeenCalled();

      expect(store.user()).toEqual(null);
      expect(store.error()).toEqual(
        'Failed to load existing user. Please try again or contact with administrator.'
      );
    }));
  });

  describe('saveUser', () => {
    it('saving new user works', fakeAsync(() => {
      const mockData: User = MOCK_USER_1;
      const spyUpsertUser = jest.spyOn(store, 'upsertUser');
      const spySetLoading = jest.spyOn(store, 'setLoading');
      const spyAddUser = jest
        .spyOn(service, 'addUser')
        .mockReturnValueOnce(of(mockData));

      let facadeResponse!: boolean;

      facade
        .saveUser({ ...MOCK_USER_1, id: 0, password: MOCK_PASSWORD_1 })
        .subscribe((result: boolean) => {
          facadeResponse = result;
        });

      tick();

      expect(spyAddUser).toHaveBeenCalled();
      expect(spyUpsertUser).toHaveBeenCalled();
      expect(spySetLoading).toHaveBeenCalledTimes(2);

      expect(facadeResponse).toEqual(true);
      expect(store.users()).toEqual([MOCK_USER_1]);
      expect(store.user()).toEqual(null);
      expect(store.error()).toEqual('');
    }));

    it('saving existing user works', fakeAsync(() => {
      const mockData: User = MOCK_USER_1;
      const spyUpsertUser = jest.spyOn(store, 'upsertUser');
      const spySetLoading = jest.spyOn(store, 'setLoading');
      const spyEditUser = jest
        .spyOn(service, 'editUser')
        .mockReturnValueOnce(of(mockData));

      store.setUsers([MOCK_USER_1]);

      let facadeResponse!: boolean;

      facade
        .saveUser({ ...MOCK_USER_1, password: MOCK_PASSWORD_1 })
        .subscribe((result: boolean) => {
          facadeResponse = result;
        });

      tick();

      expect(spyEditUser).toHaveBeenCalled();
      expect(spyUpsertUser).toHaveBeenCalled();
      expect(spySetLoading).toHaveBeenCalledTimes(2);

      expect(facadeResponse).toEqual(true);
      expect(store.users()).toEqual([MOCK_USER_1]);
      expect(store.user()).toEqual(null);
      expect(store.error()).toEqual('');
    }));

    it('saving user throws unique name error', fakeAsync(() => {
      const spyUpsertUser = jest.spyOn(store, 'upsertUser');
      const spySetLoading = jest.spyOn(store, 'setLoading');
      const spyEditUser = jest
        .spyOn(service, 'editUser')
        .mockReturnValue(
          throwError(() => new HttpErrorResponse({ status: 400 }))
        );

      let facadeResponse!: boolean;

      facade
        .saveUser({ ...MOCK_USER_1, password: MOCK_PASSWORD_1 })
        .subscribe((result: boolean) => {
          facadeResponse = result;
        });

      tick();

      expect(spyEditUser).toHaveBeenCalled();
      expect(spyUpsertUser).toHaveBeenCalledTimes(0);
      expect(spySetLoading).toHaveBeenCalledTimes(2);

      expect(facadeResponse).toEqual(false);
      expect(store.users()).toEqual([]);
      expect(store.user()).toEqual(null);
      expect(store.error()).toEqual(
        'Username must be unique. Please try again or contact with administrator.'
      );
    }));

    it('saving user throws generic error', fakeAsync(() => {
      const spyUpsertUser = jest.spyOn(store, 'upsertUser');
      const spySetLoading = jest.spyOn(store, 'setLoading');
      const spyEditUser = jest
        .spyOn(service, 'editUser')
        .mockReturnValue(throwError(() => new Error()));

      let facadeResponse!: boolean;

      facade
        .saveUser({ ...MOCK_USER_1, password: MOCK_PASSWORD_1 })
        .subscribe((result: boolean) => {
          facadeResponse = result;
        });

      tick();

      expect(spyEditUser).toHaveBeenCalled();
      expect(spyUpsertUser).toHaveBeenCalledTimes(0);
      expect(spySetLoading).toHaveBeenCalledTimes(2);

      expect(facadeResponse).toEqual(false);
      expect(store.users()).toEqual([]);
      expect(store.user()).toEqual(null);
      expect(store.error()).toEqual(
        'Failed to save user. Please try again or contact with administrator.'
      );
    }));
  });

  describe('clear', () => {
    it('clearing store works', () => {
      facade.clear();

      expect(store.users()).toEqual([]);
      expect(store.user()).toEqual(null);
      expect(store.error()).toEqual('');
      expect(store.loading()).toEqual(false);
    });
  });
});
