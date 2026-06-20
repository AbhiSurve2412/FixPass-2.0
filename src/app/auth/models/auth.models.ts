export type UserRole = 'student' | 'admin' | 'moderator';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  university: string;
  year: string;
  college: string;
  branch: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupRequest {
  name: string;
  email: string;
  university: string;
  year: string;
  college: string;
  branch: string;
  password: string;
}

export interface RefreshResponse {
  success: boolean;
  accessToken: string;
  expiresIn: number;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}
