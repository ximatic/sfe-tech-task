import { TestBed } from '@angular/core/testing';

import { MOCK_ERROR_1 } from '../../../../__mocks__/constants/common.const.mock';
import { MOCK_TOKEN_1 } from '../../../../__mocks__/constants/auth.const.mock';
import { MOCK_USER_1 } from '../../../../__mocks__/constants/user.const.mock';

import { AuthStore } from '../stores/auth.store';

describe('AuthStore', () => {
  let store: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthStore],
    });

    store = TestBed.inject(AuthStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('token', () => {
    it('setting token works', () => {
      store.setToken(MOCK_TOKEN_1);

      expect(store.token()).toEqual(MOCK_TOKEN_1);
    });

    it('clearing token works', () => {
      store.setToken(MOCK_TOKEN_1);
      store.clearToken();

      expect(store.token()).toEqual(null);
    });
  });

  describe('auth user', () => {
    it('setting auth user works', () => {
      store.setAuthUser(MOCK_USER_1);

      expect(store.authUser()).toEqual(MOCK_USER_1);
    });

    it('clearing auth user works', () => {
      store.setAuthUser(MOCK_USER_1);
      store.clearAuthUser();

      expect(store.authUser()).toEqual(null);
    });
  });

  describe('processing', () => {
    it('setting processing works', () => {
      store.setProcessing(true);

      expect(store.processing()).toEqual(true);
    });
  });

  describe('error', () => {
    it('setting error works', () => {
      store.setError(MOCK_ERROR_1);

      expect(store.error()).toEqual(MOCK_ERROR_1);
    });
  });
});
