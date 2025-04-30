import {
  Component,
  inject,
  input,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { AuthFacadeService } from '../../../core/facades/auth-facade.service';

import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  imports: [MatButtonModule, MatIconModule, MatTableModule],
})
export class UsersListComponent implements OnInit {
  // di
  private authFacade: AuthFacadeService = inject(AuthFacadeService);

  // inputs & outputs
  users = input<User[]>([]);
  edit: OutputEmitterRef<number> = output();

  // table
  displayedColumns: string[] = ['username', 'role'];

  ngOnInit(): void {
    if (this.authFacade.isAdminRole()) {
      // add actions column only if user has Admin role
      this.displayedColumns.push('actions');
    }
  }
}
