import { TestBed } from '@angular/core/testing';

import { AuthRoleGuard } from './auth-role.guard';

describe('AuthRoleGuard', () => {
  let guard: AuthRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    guard = TestBed.inject(AuthRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // TODO #1 - fix tests
  // TODO #2 - add more tests
});
