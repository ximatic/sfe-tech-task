import { UserRole, User } from '../../src/app/shared/models/user';

export const MOCK_ID_1 = 1;
export const MOCK_ID_2 = 2;

export const MOCK_USERNAME_1 = 'Test Username #1';
export const MOCK_USERNAME_2 = 'Test Username #2';

export const MOCK_USER_ROLE_1 = UserRole.User;
export const MOCK_USER_ROLE_2 = UserRole.Admin;

export const MOCK_PASSWORD_1 = 'P@ssword1';
export const MOCK_PASSWORD_2 = 'P@ssword2';

export const MOCK_USER_1: User = {
  id: MOCK_ID_1,
  username: MOCK_USERNAME_1,
  role: MOCK_USER_ROLE_1,
};

export const MOCK_USER_2: User = {
  id: MOCK_ID_2,
  username: MOCK_USERNAME_2,
  role: MOCK_USER_ROLE_2,
};
