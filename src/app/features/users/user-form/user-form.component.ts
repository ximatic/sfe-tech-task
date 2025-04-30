import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  output,
  OutputEmitterRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { userNameValidator } from '../../../core/utils/custom-form.validators';

import { User, UserRole } from '../../../shared/models/user';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  // di
  private formBuilder: FormBuilder = inject(FormBuilder);
  facade: UsersFacadeService = inject(UsersFacadeService);

  // inputs & outputs
  user = input<User | null>();
  save: OutputEmitterRef<Partial<User>> = output();
  cancel: OutputEmitterRef<void> = output();

  // form
  form = this.formBuilder.group({
    username: ['', [Validators.required, userNameValidator]],
    role: ['', Validators.required],
    password: ['', Validators.required],
  });
  roles = Object.keys(UserRole).map((role) => ({
    value: (UserRole as any)[role],
    name: role,
  }));

  constructor() {
    effect(() => {
      if (this.user()) {
        this.form.patchValue({ ...this.user() });
        // clear validators if user exists as password is not required for such use case
        this.form.get('password')?.clearValidators();
      }
    });
  }

  // controls

  get usernameControl(): AbstractControl | null {
    return this.form.get('username');
  }

  get roleControl(): AbstractControl | null {
    return this.form.get('role');
  }

  get passwordControl(): AbstractControl | null {
    return this.form.get('password');
  }

  // form

  submitForm(): void {
    if (this.form.invalid) {
      return;
    }

    const userData = { ...this.user(), ...this.form.value };
    this.save.emit(userData as Partial<User>);
  }
}
