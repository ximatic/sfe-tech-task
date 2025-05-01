import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthFacadeService } from '../../../core/facades/auth-facade.service';
import { UsersFacadeService } from '../../../core/facades/users-facade.service';

import { UsersListComponent } from '../users-list/users-list.component';

@Component({
  selector: 'app-users-list-page',
  templateUrl: './users-list-page.component.html',
  styleUrl: './users-list-page.component.scss',
  imports: [
    // 3rd party imports
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    // other
    UsersListComponent,
  ],
})
export class UsersListPageComponent implements OnInit {
  // di
  private router: Router = inject(Router);
  authFacade: AuthFacadeService = inject(AuthFacadeService);
  userFacade: UsersFacadeService = inject(UsersFacadeService);

  // lifecycle methods

  ngOnInit(): void {
    this.userFacade.loadUsers();
  }

  // router methods

  goToNew(): void {
    this.router.navigate(['/users/create']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/users/update', id]);
  }
}
