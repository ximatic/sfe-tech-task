import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, of } from 'rxjs';

import { UserStore } from '../stores/users.store';

import { UsersService } from '../services/users.service';

import { User } from '../../shared/models/user';

@Injectable({ providedIn: 'root' })
export class UsersFacadeService {
  private store = inject(UserStore);
  private service = inject(UsersService);

  users = this.store.users.asReadonly();
  user = this.store.user.asReadonly();
  loading = this.store.loading.asReadonly();
  error = this.store.error.asReadonly();

  loadUsers(): void {
    this.store.setLoading(true);

    this.service.getUsers().subscribe({
      next: (users: User[]) => {
        this.store.clearUser();
        this.store.setUsers(users);
        this.store.setError('');
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError('Failed to load users');
        this.store.setLoading(false);
      },
    });
  }

  loadUser(id: number): void {
    const user = this.store.users().find((u: User) => u.id == id);
    if (user) {
      this.store.setError('');
      this.store.setUser(user);
    } else {
      this.store.setError(
        'Failed to load existing user. Please try again or contact with administrator.'
      );
      this.store.clearUser();
    }
  }

  saveUser(user: Partial<User>): Observable<boolean> {
    const action = user.id
      ? this.service.editUser(user)
      : this.service.addUser(user);
    this.store.setLoading(true);

    return action.pipe(
      map((savedUser: User) => {
        this.store.upsertUser(savedUser);
        this.store.setLoading(false);

        return true;
      }),
      catchError((error) => {
        if (error.status === 400) {
          this.store.setError(
            'Username must be unique. Please try again or contact with administrator.'
          );
        } else {
          this.store.setError(
            'Failed to save user. Please try again or contact with administrator.'
          );
        }
        this.store.setLoading(false);

        return of(false);
      })
    );
  }

  clear(): void {
    this.store.clearUsers();
    this.store.clearUser();
    this.store.setError('');
    this.store.setLoading(false);
  }
}
