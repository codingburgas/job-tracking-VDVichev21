export interface User {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  role: string;
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