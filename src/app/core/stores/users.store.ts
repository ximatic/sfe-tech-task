import { Injectable, signal } from '@angular/core';
import { User } from '../../shared/models/user';

@Injectable({ providedIn: 'root' })
export class UserStore {
  users = signal<User[] | null>(null);
  user = signal<User | null>(null);
  loading = signal(false);
  error = signal('');

  setUsers(users: User[]): void {
    this.users.set(users);
  }

  clearUsers(): void {
    this.users.set(null);
  }

  setUser(user: User): void {
    this.user.set(user);
  }

  clearUser(): void {
    this.user.set(null);
  }

  setLoading(value: boolean): void {
    this.loading.set(value);
  }

  setError(message: string): void {
    this.error.set(message);
  }

  upsertUser(user: User): void {
    const currentUsers = this.users();
    if (!currentUsers) {
      this.users.set([user]);
      return;
    }

    const index = currentUsers.findIndex((u: User) => u.id === user.id);
    if (index === -1) {
      this.users.set([...currentUsers, user]);
    } else {
      const updated = [...currentUsers];
      updated[index] = user;
      this.users.set(updated);
    }
  }
}
