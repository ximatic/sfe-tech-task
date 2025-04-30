import { FormGroup, FormControl } from '@angular/forms';

import { userNameValidator } from './custom-form.validators';

describe('userNameValidator', () => {
  const username = 'password';
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      [username]: new FormControl('', { validators: userNameValidator }),
    });
  });

  it('should be invalid for value containing "test"', () => {
    formGroup.patchValue({
      [username]: 'invalid-user-test',
    });
    formGroup.get(username)?.updateValueAndValidity();

    expect(formGroup.get(username)?.hasError('userName')).toBe(true);
    expect(formGroup.get(username)?.invalid).toBe(true);
  });

  it('should be valid for value without "test"', () => {
    formGroup.patchValue({
      [username]: 'valid-user',
    });
    formGroup.get(username)?.updateValueAndValidity();

    expect(formGroup.get(username)?.hasError('userName')).toBe(false);
    expect(formGroup.get(username)?.invalid).toBe(false);
  });
});
