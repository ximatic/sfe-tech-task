import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

import { UsersFacadeService } from '../../../core/facades/users-facade.service';

import { User } from '../../../shared/models/user';

import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-form-page',
  templateUrl: './user-form-page.component.html',
  styleUrl: './user-form-page.component.scss',
  imports: [
    // 3rd party imports
    MatCardModule,
    // other
    UserFormComponent,
  ],
})
export class UserFormPageComponent implements OnInit, OnDestroy {
  // di
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  facade: UsersFacadeService = inject(UsersFacadeService);

  // other
  private subscription = new Subscription();

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // form handling

  handleSave(user: Partial<User>) {
    this.facade.saveUser(user).subscribe((result: boolean) => {
      if (result) {
        this.goBack();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  // initialization

  private init(): void {
    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        if (params['id']) {
          this.facade.loadUser(params['id']);
        }
      })
    );
  }
}
