import { AbstractControl, ValidationErrors } from '@angular/forms';

export function userNameValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!!control.value && control.value.includes('test')) {
    return { userName: true };
  }

  return null;
}
