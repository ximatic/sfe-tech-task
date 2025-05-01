import { TestBed } from '@angular/core/testing';

import { MOCK_ERROR_1 } from '../../../../__mocks__/constants/common.const.mock';
import {
  MOCK_USER_1,
  MOCK_USER_2,
} from '../../../../__mocks__/constants/user.const.mock';

import { UserStore } from '../stores/users.store';

describe('UserStore', () => {
  let store: UserStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStore],
    });

    store = TestBed.inject(UserStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('users', () => {
    it('setting users works', () => {
      store.setUsers([MOCK_USER_1]);

      expect(store.users()).toEqual([MOCK_USER_1]);
    });

    it('clearing users works', () => {
      store.setUsers([MOCK_USER_1]);
      store.clearUsers();

      expect(store.users()).toEqual(null);
    });
  });

  describe('user', () => {
    it('setting user works', () => {
      store.setUser(MOCK_USER_1);

      expect(store.user()).toEqual(MOCK_USER_1);
    });

    it('clearing user works', () => {
      store.setUser(MOCK_USER_1);
      store.clearUser();

      expect(store.user()).toEqual(null);
    });
  });

  describe('loading', () => {
    it('setting loading works', () => {
      store.setLoading(true);

      expect(store.loading()).toEqual(true);
    });
  });

  describe('error', () => {
    it('setting error works', () => {
      store.setError(MOCK_ERROR_1);

      expect(store.error()).toEqual(MOCK_ERROR_1);
    });
  });

  describe('upsertUser', () => {
    it('adding user to non exisiting users list works', () => {
      store.upsertUser(MOCK_USER_1);

      expect(store.users()).toEqual([MOCK_USER_1]);
    });

    it('adding user to empty users list works', () => {
      store.setUsers([]);
      store.upsertUser(MOCK_USER_1);

      expect(store.users()).toEqual([MOCK_USER_1]);
    });

    it('adding user to non empty users list works', () => {
      store.setUsers([MOCK_USER_2]);
      store.upsertUser(MOCK_USER_1);

      expect(store.users()).toEqual([MOCK_USER_2, MOCK_USER_1]);
    });

    it('updating user to non empty users list works', () => {
      store.setUsers([MOCK_USER_1]);
      store.upsertUser(MOCK_USER_1);

      expect(store.users()).toEqual([MOCK_USER_1]);
    });
  });
});
