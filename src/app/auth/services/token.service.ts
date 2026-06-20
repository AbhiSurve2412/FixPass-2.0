import { Injectable } from '@angular/core';

const ACCESS_TOKEN_KEY  = 'fp_access_token';
const REFRESH_TOKEN_KEY = 'fp_refresh_token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private storage: Storage = sessionStorage;

  setStorage(rememberMe: boolean): void {
    this.storage = rememberMe ? localStorage : sessionStorage;
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    this.storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    this.storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    // sessionStorage first: a fresh login with rememberMe=false overwrites any
    // stale localStorage token from a previous "remember me" session.
    return (
      sessionStorage.getItem(ACCESS_TOKEN_KEY) ??
      localStorage.getItem(ACCESS_TOKEN_KEY)
    );
  }

  getRefreshToken(): string | null {
    return (
      sessionStorage.getItem(REFRESH_TOKEN_KEY) ??
      localStorage.getItem(REFRESH_TOKEN_KEY)
    );
  }

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
