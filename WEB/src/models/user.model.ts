export interface User {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}