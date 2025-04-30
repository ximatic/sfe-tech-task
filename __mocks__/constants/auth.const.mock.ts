import { AuthResponse } from '../../src/app/shared/models/auth';

import { MOCK_USER_1, MOCK_USER_2 } from './user.const.mock';

export const MOCK_TOKEN_1 = 'test-token-1';
export const MOCK_TOKEN_2 = 'test-token-1';

export const MOCK_AUTH_RESPONSE_1: AuthResponse = {
  token: MOCK_TOKEN_1,
  user: MOCK_USER_1,
};

export const MOCK_AUTH_RESPONSE_2: AuthResponse = {
  token: MOCK_TOKEN_2,
  user: MOCK_USER_2,
};
