import { environment } from '../../../environments/environment';

const BASE = environment.apiBaseUrl;

export const AUTH_ENDPOINTS = {
  LOGIN:   `${BASE}/auth/login`,
  SIGNUP:  `${BASE}/auth/signup`,
  REFRESH: `${BASE}/auth/refresh`,
  LOGOUT:  `${BASE}/auth/logout`,
} as const;
