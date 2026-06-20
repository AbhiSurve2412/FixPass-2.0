import { Injectable, signal, computed } from '@angular/core';
import type { AuthUser } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly currentUser  = signal<AuthUser | null>(null);
  readonly accessToken  = signal<string | null>(null);
  readonly refreshToken = signal<string | null>(null);
  readonly isLoading    = signal(false);
  readonly error        = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.accessToken());
  readonly isLoggedIn      = computed(() => !!this.currentUser() && !!this.accessToken());
  readonly userName        = computed(() => this.currentUser()?.name ?? null);
  readonly userRole        = computed(() => this.currentUser()?.role ?? null);

  setAuth(user: AuthUser, accessToken: string, refreshToken: string): void {
    this.currentUser.set(user);
    this.accessToken.set(accessToken);
    this.refreshToken.set(refreshToken);
    this.error.set(null);
  }

  updateAccessToken(token: string): void {
    this.accessToken.set(token);
  }

  clearAuth(): void {
    this.currentUser.set(null);
    this.accessToken.set(null);
    this.refreshToken.set(null);
  }

  setLoading(val: boolean): void { this.isLoading.set(val); }
  setError(msg: string | null): void { this.error.set(msg); }
}
