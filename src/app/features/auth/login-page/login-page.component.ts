import { Component, inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';

import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

import { AuthFacadeService } from '../../../core/facades/auth-facade.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  imports: [
    // Angular imports
    ReactiveFormsModule,
    RouterModule,
    // 3rd party imports
    MatButton,
    MatCardModule,
    MatFormField,
    MatInput,
    MatLabel,
  ],
})
export class LoginPageComponent implements OnDestroy {
  // di
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  facade: AuthFacadeService = inject(AuthFacadeService);

  // form
  form = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  // other
  private subscription = new Subscription();

  // lifecycle methods

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // controls

  get usernameControl(): AbstractControl | null {
    return this.form.get('username');
  }

  get passwordControl(): AbstractControl | null {
    return this.form.get('password');
  }

  // form handling

  submitForm(): void {
    if (this.form.invalid) {
      return;
    }

    this.login();
  }

  private login(): void {
    const username = this.usernameControl?.value;
    const password = this.passwordControl?.value;

    if (username && password) {
      this.subscription.add(
        this.facade.login(username, password).subscribe({
          next: () => {
            if (this.facade.token()) {
              this.router.navigate(['/users']);
            }
          },
        })
      );
    }
  }
}
