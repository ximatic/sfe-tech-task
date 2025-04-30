export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
  password?: string;
}
